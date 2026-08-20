import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Activity, Radio, RefreshCw, Server, ShieldCheck } from "lucide-react";
import { fetchHealth, fetchSystemStatus } from "../services/health";
import type { ProbeState, SystemStatusResponse } from "../types/health";

interface Probe {
  label: string;
  detail: string;
  state: ProbeState;
}

const initialProbes: Record<string, Probe> = {
  frontend: {
    label: "Frontend",
    detail: "Vite + React command center loaded",
    state: "ok",
  },
  health: {
    label: "GET /health",
    detail: "Waiting to probe backend",
    state: "idle",
  },
  status: {
    label: "GET /api/v1/system/status",
    detail: "Waiting to probe backend",
    state: "idle",
  },
};

export default function HealthPage() {
  const [probes, setProbes] = useState(initialProbes);
  const [system, setSystem] = useState<SystemStatusResponse["data"] | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const runChecks = useCallback(async () => {
    setChecking(true);
    setProbes((current) => ({
      ...current,
      health: { ...current.health, state: "checking", detail: "Requesting /health" },
      status: { ...current.status, state: "checking", detail: "Requesting system status" },
    }));

    try {
      const health = await fetchHealth();
      const ok = health.status === "ok";
      setProbes((current) => ({
        ...current,
        health: {
          ...current.health,
          state: ok ? "ok" : "error",
          detail: ok ? 'Received { "status": "ok" }' : `Unexpected payload: ${JSON.stringify(health)}`,
        },
      }));
    } catch (error) {
      setProbes((current) => ({
        ...current,
        health: {
          ...current.health,
          state: "error",
          detail: error instanceof Error ? error.message : "Health probe failed",
        },
      }));
    }

    try {
      const status = await fetchSystemStatus();
      setSystem(status.data);
      setProbes((current) => ({
        ...current,
        status: {
          ...current.status,
          state: "ok",
          detail: `${status.data.service} · phase ${status.data.phase} · ${status.data.phase_name}`,
        },
      }));
    } catch (error) {
      setSystem(null);
      setProbes((current) => ({
        ...current,
        status: {
          ...current.status,
          state: "error",
          detail: error instanceof Error ? error.message : "Status probe failed",
        },
      }));
    }

    setLastChecked(new Date().toISOString());
    setChecking(false);
  }, []);

  useEffect(() => {
    void runChecks();
  }, [runChecks]);

  const allOk = Object.values(probes).every((probe) => probe.state === "ok");

  return (
    <div className="min-h-full bg-navy-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,195,255,0.08),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(45,212,160,0.06),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-full max-w-6xl flex-col px-6 py-8">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-signal-info">
              Operations command center
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">LogiSense AI</h1>
            <p className="mt-2 max-w-xl text-sm text-steel-400">
              Phase 1 foundation check. This page only reports live services — no mock KPIs,
              no invented risk scores.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void runChecks()}
            disabled={checking}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-navy-800 px-3 py-2 text-sm text-steel-300 transition hover:border-signal-info/40 hover:text-white disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
            Re-run probes
          </button>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <SummaryCard
            icon={<Activity className="h-4 w-4 text-signal-info" />}
            label="Platform state"
            value={allOk ? "Healthy" : checking ? "Checking" : "Degraded"}
            tone={allOk ? "ok" : checking ? "info" : "bad"}
          />
          <SummaryCard
            icon={<Server className="h-4 w-4 text-signal-ok" />}
            label="Build phase"
            value={system ? `Phase ${system.phase}` : "Phase 1"}
            tone="info"
          />
          <SummaryCard
            icon={<ShieldCheck className="h-4 w-4 text-signal-warn" />}
            label="Last checked"
            value={lastChecked ? new Date(lastChecked).toLocaleTimeString() : "—"}
            tone="warn"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl bg-navy-900/80 p-5 shadow-panel lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-steel-300">
                Service probes
              </h2>
              <span className="font-mono text-[11px] text-steel-400">live HTTP</span>
            </div>
            <ul className="space-y-3">
              {Object.entries(probes).map(([key, probe]) => (
                <li
                  key={key}
                  className="flex items-start justify-between gap-4 rounded-lg border border-white/5 bg-navy-800/60 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{probe.label}</p>
                    <p className="mt-1 font-mono text-xs text-steel-400">{probe.detail}</p>
                  </div>
                  <StatusPill state={probe.state} />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-5 shadow-panel lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Radio className="h-4 w-4 text-signal-info" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-steel-300">
                Backend identity
              </h2>
            </div>
            {system ? (
              <dl className="space-y-3 text-sm">
                <Row term="Service" value={system.service} />
                <Row term="Version" value={system.version} />
                <Row term="Environment" value={system.environment} />
                <Row term="Phase" value={`${system.phase} · ${system.phase_name}`} />
                <Row term="Timestamp" value={system.timestamp} />
              </dl>
            ) : (
              <p className="text-sm text-steel-400">
                Backend status will appear here once `/api/v1/system/status` responds.
                Start the API with `uvicorn app.main:app --reload --port 8000`.
              </p>
            )}
          </div>
        </section>

        <footer className="mt-auto pt-8 font-mono text-[11px] uppercase tracking-wider text-steel-400">
          LogiSense AI · Phase 1 of 29 · Initialization only
        </footer>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "ok" | "info" | "warn" | "bad";
}) {
  const toneClass = {
    ok: "text-signal-ok",
    info: "text-signal-info",
    warn: "text-signal-warn",
    bad: "text-signal-bad",
  }[tone];

  return (
    <div className="rounded-xl bg-navy-900/80 p-4 shadow-panel">
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-steel-400">
        {icon}
        {label}
      </div>
      <p className={`text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function StatusPill({ state }: { state: ProbeState }) {
  const map: Record<ProbeState, { label: string; className: string }> = {
    idle: { label: "Idle", className: "bg-white/5 text-steel-400" },
    checking: { label: "Checking", className: "bg-signal-info/10 text-signal-info" },
    ok: { label: "OK", className: "bg-signal-ok/10 text-signal-ok" },
    error: { label: "Error", className: "bg-signal-bad/10 text-signal-bad" },
  };
  const item = map[state];
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] ${item.className}`}>
      {item.label}
    </span>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 last:border-0">
      <dt className="text-steel-400">{term}</dt>
      <dd className="text-right font-mono text-xs text-slate-100">{value}</dd>
    </div>
  );
}
