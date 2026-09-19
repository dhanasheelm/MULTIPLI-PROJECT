require('dotenv').config();
const express = require('express');
const session = require('express-session');
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
console.log('Etherscan key loaded:', ETHERSCAN_API_KEY ? 'YES' : 'NO - IT IS UNDEFINED');

const app = express();
app.use(express.json());
app.use(express.static('.'));
app.use(session({
  secret: 'web3-tracker-secret-key',
  resave: false,
  saveUninitialized: false
}));

const PORT = 3000;

// Temporary in-memory user store — resets every time the server restarts
const users = [];

app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, error: 'Email and password required.' });
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.json({ success: false, error: 'Account already exists — try logging in.' });
  }

  users.push({ email, password });
  req.session.user = email;
  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.json({ success: false, error: 'Invalid email or password.' });
  }

  req.session.user = email;
  res.json({ success: true });
});
app.get('/analyze', async (req, res) => {
  const wallet = req.query.address;

  if (!wallet) {
    return res.status(400).json({ error: 'No wallet address provided' });
  }

  try {
    const txListUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    const txResponse = await fetch(txListUrl);
    const txData = await txResponse.json();

    if (txData.status !== '1') {
      return res.status(404).json({ error: 'No transactions found for this wallet' });
    }

    const contractCreations = txData.result.filter(tx => tx.to === '' && tx.contractAddress !== '');

    if (contractCreations.length === 0) {
      return res.json({ wallet, tokens: [], summary: 'This wallet has not deployed any contracts.' });
    }

    const tokenResults = [];

    for (const creation of contractCreations.slice(0, 5)) {
      const tokenAddress = creation.contractAddress;
      const goplusUrl = `https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${tokenAddress}`;
      const goplusResponse = await fetch(goplusUrl);
      const goplusData = await goplusResponse.json();
      const tokenInfo = goplusData.result ? goplusData.result[tokenAddress.toLowerCase()] : null;

      let riskLevel = 'unknown';
      let flags = [];

      if (tokenInfo) {
        let riskScore = 0;
        if (tokenInfo.is_mintable === '1') { flags.push('Unlimited mint function'); riskScore += 2; }
        if (tokenInfo.is_honeypot === '1') { flags.push('Possible honeypot'); riskScore += 3; }
        if (tokenInfo.is_open_source === '0') { flags.push('Source code not verified'); riskScore += 2; }
        if (parseFloat(tokenInfo.owner_percent || 0) > 0.05) { flags.push('High owner concentration'); riskScore += 1; }
        riskLevel = riskScore >= 4 ? 'high' : riskScore >= 1 ? 'medium' : 'low';
      }

      tokenResults.push({
        address: tokenAddress,
        deployedAt: creation.timeStamp,
        name: tokenInfo ? tokenInfo.token_name : 'Unknown',
        symbol: tokenInfo ? tokenInfo.token_symbol : '?',
        riskLevel,
        flags
      });
    }

    const incomingTxUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${wallet}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
    const incomingResponse = await fetch(incomingTxUrl);
    const incomingData = await incomingResponse.json();

    const deployedAddresses = tokenResults.map(t => t.address.toLowerCase());
    const suspiciousTransfers = [];

    if (incomingData.status === '1') {
      incomingData.result.forEach(tx => {
        if (deployedAddresses.includes(tx.from.toLowerCase()) && tx.value !== '0') {
          suspiciousTransfers.push({
            from: tx.from,
            valueEth: (parseInt(tx.value) / 1e18).toFixed(4),
            timestamp: tx.timeStamp
          });
        }
      });
    }

    const riskyCount = tokenResults.filter(t => t.riskLevel === 'high').length;
    let summary = `This wallet deployed ${tokenResults.length} token(s). ${riskyCount} show high-risk patterns. `;
    summary += suspiciousTransfers.length > 0
      ? `${suspiciousTransfers.length} fund transfer(s) moved from deployed tokens back to this wallet — worth investigating.`
      : `No suspicious fund movement detected back to this wallet.`;

    res.json({ wallet, tokens: tokenResults, suspiciousTransfers, summary });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong analyzing this wallet' });
  }
});

app.listen(PORT, () => {
  console.log(`web3-tracker server running at http://localhost:${PORT}`);
});