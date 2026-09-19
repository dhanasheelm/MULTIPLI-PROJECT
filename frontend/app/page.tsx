"use client";

import { useState } from "react";

const threats = [
  {
    level: "CRITICAL",
    title: "Oracle Price Deviation",
    detail: "12.8% deviation detected",
    time: "2 min ago",
  },
  {
    level: "HIGH",
    title: "Whale Accumulation",
    detail: "$820K moved into target protocol",
    time: "7 min ago",
  },
  {
    level: "HIGH",
    title: "Admin Parameter Change",
    detail: "Risk parameter modified",
    time: "14 min ago",
  },
  {
    level: "MEDIUM",
    title: "Transaction Volume Spike",
    detail: "4.7× normal activity",
    time: "21 min ago",
  },
];

const graphNodes = [
  { name: "SUSPICIOUS WALLET", x: "12%", y: "48%", type: "danger" },
  { name: "LENDING CONTRACT", x: "37%", y: "28%", type: "normal" },
  { name: "PRICE ORACLE", x: "70%", y: "25%", type: "warning" },
  { name: "ADMIN WALLET", x: "38%", y: "73%", type: "warning" },
  { name: "BRIDGE", x: "70%", y: "70%", type: "normal" },
];

export default function Home() {
  const [selected, setSelected] = useState(threats[0]);

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#080b10]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-xl font-black text-black">
              A
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-[0.3em]">
                AGISMESH
              </h1>
              <p className="text-[9px] tracking-[0.25em] text-gray-500">
                WEB3 SECURITY INTELLIGENCE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              LIVE MONITORING
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300">
              Ethereum Mainnet
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-6 py-7">
        {/* TITLE */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-[0.3em] text-cyan-400">
            SECURITY OPERATIONS CENTER
          </p>

          <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold">
                Protocol Security Overview
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                AI-powered early warning and attack relationship detection
              </p>
            </div>

            <p className="text-xs text-gray-600">
              Last scan:{" "}
              <span className="text-gray-300">8 seconds ago</span>
            </p>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            title="RISK SCORE"
            value="87"
            suffix="/100"
            status="HIGH RISK"
            statusColor="text-red-400"
          />

          <Metric
            title="ACTIVE THREATS"
            value="04"
            suffix=""
            status="2 CRITICAL"
            statusColor="text-red-400"
          />

          <Metric
            title="EXPOSURE"
            value="$2.4M"
            suffix=""
            status="AT RISK"
            statusColor="text-orange-400"
          />

          <Metric
            title="PROTOCOL HEALTH"
            value="72"
            suffix="%"
            status="WARNING"
            statusColor="text-yellow-400"
          />
        </div>

        {/* RADAR + INCIDENTS */}
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          {/* RISK RADAR */}
          <section className="rounded-2xl border border-white/10 bg-[#090d12] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-gray-500">
                  PREDICTIVE RISK RADAR
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Threat trajectory
                </h3>
              </div>

              <span className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] text-red-400">
                ELEVATED
              </span>
            </div>

            <div className="mt-6 h-56 rounded-xl border border-white/5 bg-[#05080c] p-5">
              <div className="flex h-full items-end gap-2">
                {[30, 35, 33, 42, 48, 45, 56, 60, 57, 70, 76, 87].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="relative flex h-full flex-1 items-end"
                    >
                      <div
                        className="w-full rounded-t-md bg-cyan-400/70"
                        style={{ height: `${height}%` }}
                      />

                      {index === 11 && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-red-400">
                          87
                        </span>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="mt-3 flex justify-between text-[9px] text-gray-600">
              <span>12H AGO</span>
              <span>6H AGO</span>
              <span>NOW</span>
            </div>
          </section>

          {/* ACTIVE INCIDENTS */}
          <section className="rounded-2xl border border-white/10 bg-[#090d12] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-gray-500">
                  ACTIVE INCIDENTS
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Detected signals
                </h3>
              </div>

              <span className="text-xs text-cyan-400">
                4 ACTIVE
              </span>
            </div>

            <div className="mt-5 space-y-2">
              {threats.map((threat) => (
                <button
                  key={threat.title}
                  onClick={() => setSelected(threat)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selected.title === threat.title
                      ? "border-cyan-400/30 bg-cyan-400/5"
                      : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`mt-1.5 h-2 w-2 rounded-full ${
                        threat.level === "CRITICAL"
                          ? "bg-red-500"
                          : threat.level === "HIGH"
                            ? "bg-orange-400"
                            : "bg-yellow-400"
                      }`}
                    />

                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <span className="text-xs font-semibold">
                          {threat.title}
                        </span>

                        <span className="text-[9px] text-gray-600">
                          {threat.time}
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] text-gray-500">
                        {threat.detail}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* ATTACK GRAPH */}
        <section className="mt-5 rounded-2xl border border-white/10 bg-[#090d12] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-[0.25em] text-gray-500">
                ATTACK RELATIONSHIP ENGINE
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                Explainable Incident Graph
              </h3>
            </div>

            <div className="hidden gap-2 text-[9px] text-gray-500 md:flex">
              <span className="rounded border border-white/10 px-2 py-1">
                5 ENTITIES
              </span>

              <span className="rounded border border-white/10 px-2 py-1">
                7 RELATIONSHIPS
              </span>
            </div>
          </div>

          <div className="relative mt-5 h-[420px] overflow-hidden rounded-xl border border-white/5 bg-[#05080c]">
            {/* GRID */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* CONNECTIONS */}
            <svg className="absolute inset-0 h-full w-full">
              <line
                x1="14%"
                y1="48%"
                x2="38%"
                y2="30%"
                stroke="#22d3ee"
                strokeOpacity="0.5"
                strokeWidth="2"
              />

              <line
                x1="41%"
                y1="30%"
                x2="70%"
                y2="27%"
                stroke="#ef4444"
                strokeOpacity="0.7"
                strokeWidth="2"
              />

              <line
                x1="40%"
                y1="33%"
                x2="40%"
                y2="72%"
                stroke="#f59e0b"
                strokeOpacity="0.6"
                strokeWidth="2"
              />

              <line
                x1="43%"
                y1="72%"
                x2="70%"
                y2="69%"
                stroke="#22d3ee"
                strokeOpacity="0.5"
                strokeWidth="2"
              />

              <line
                x1="15%"
                y1="50%"
                x2="39%"
                y2="71%"
                stroke="#ef4444"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            </svg>

            {/* GRAPH NODES */}
            {graphNodes.map((node) => (
              <div
                key={node.name}
                className="absolute"
                style={{
                  left: node.x,
                  top: node.y,
                }}
              >
                <div
                  className={`flex h-20 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border text-center text-[9px] font-bold tracking-wider ${
                    node.type === "danger"
                      ? "border-red-500/50 bg-red-500/10 text-red-400"
                      : node.type === "warning"
                        ? "border-orange-400/50 bg-orange-400/10 text-orange-300"
                        : "border-cyan-400/30 bg-cyan-400/5 text-cyan-300"
                  }`}
                >
                  {node.name}
                </div>
              </div>
            ))}

            {/* PATTERN */}
            <div className="absolute bottom-5 left-5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="text-[9px] tracking-[0.2em] text-red-400">
                CORRELATED PATTERN
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                4 weak signals connected into a potential attack sequence
              </p>
            </div>
          </div>
        </section>

        {/* EXPLANATION + SYSTEM STATUS */}
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {/* EXPLANATION */}
          <section className="rounded-2xl border border-white/10 bg-[#090d12] p-5">
            <p className="text-[10px] tracking-[0.25em] text-gray-500">
              INCIDENT EXPLANATION
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {selected.title}
            </h3>

            <div className="mt-5 space-y-4">
              <Info
                title="WHAT HAPPENED"
                text={selected.detail}
              />

              <Info
                title="WHY SUSPICIOUS"
                text="Behavior differs significantly from the protocol baseline."
              />

              <Info
                title="CONNECTED SIGNALS"
                text="Wallet activity + contract interaction + oracle deviation"
              />

              <Info
                title="POTENTIAL EXPOSURE"
                text="$2.4M across affected protocol components"
              />
            </div>
          </section>

          {/* SYSTEM STATUS */}
          <section className="rounded-2xl border border-white/10 bg-[#090d12] p-5">
            <p className="text-[10px] tracking-[0.25em] text-gray-500">
              SYSTEM STATUS
            </p>

            <div className="mt-5 space-y-3">
              <Status
                name="Blockchain ingestion"
                value="Operational"
              />

              <Status
                name="Feature engine"
                value="Operational"
              />

              <Status
                name="Relationship graph"
                value="Operational"
              />

              <Status
                name="Risk engine"
                value="Monitoring"
              />

              <Status
                name="Alert pipeline"
                value="4 active alerts"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
  suffix,
  status,
  statusColor,
}: {
  title: string;
  value: string;
  suffix: string;
  status: string;
  statusColor: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#090d12] p-5">
      <p className="text-[10px] tracking-[0.25em] text-gray-500">
        {title}
      </p>

      <div className="mt-3 flex items-end gap-1">
        <span className="text-3xl font-bold">{value}</span>
        <span className="mb-1 text-sm text-gray-600">{suffix}</span>
      </div>

      <p className={`mt-2 text-[10px] font-semibold ${statusColor}`}>
        {status}
      </p>
    </div>
  );
}

function Info({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="border-b border-white/5 pb-3">
      <p className="text-[9px] tracking-[0.2em] text-gray-600">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {text}
      </p>
    </div>
  );
}

function Status({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
      <span className="text-xs text-gray-400">
        {name}
      </span>

      <span className="flex items-center gap-2 text-[10px] text-green-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
        {value}
      </span>
    </div>
  );
}