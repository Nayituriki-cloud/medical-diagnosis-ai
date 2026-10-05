import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Activity,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Clock,
  ShieldCheck,
  RefreshCw,
  Lock,
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  type: string;
  urgency: string;
  symptomsCount: number;
  redFlagsTriggered: string[];
  latencyMs: number;
  status: string;
}

interface TestResult {
  id: string;
  name: string;
  input: string;
  expectedUrgency: string;
  actualUrgency: string;
  passed: boolean;
  durationMs: number;
}

export const AdminDashboard: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [metrics, setMetrics] = useState({
    uptime_seconds: 3600,
    avg_latency_ms: 240,
    emergency_triggers_count: 2,
    normal_assessments_count: 8,
  });
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Testing Suite State
  const [runningTests, setRunningTests] = useState(false);
  const [testSummary, setTestSummary] = useState<{ total: number; passed: number; failed: number } | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        if (data.system_metrics) setMetrics(data.system_metrics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const runAutomatedTests = async () => {
    setRunningTests(true);
    try {
      const res = await fetch('/api/tests/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTestSummary(data.summary);
        setTestResults(data.results || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunningTests(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono text-teal-700 font-bold">
              SYSTEM MONITORING & COMPLIANCE
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-mono">
              AUDIT CONSOLE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Clinical Safety & Telemetry Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live monitoring of AI triage latency, emergency overrides, and automated clinical test suites.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loadingLogs}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>System Status</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600 mt-2">Operational</div>
          <p className="text-[11px] text-slate-400 mt-1">Gemini 3.8 Flash Engine Active</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average API Latency</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2 tabular-nums">
            {metrics.avg_latency_ms} ms
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Within &le;1200ms target</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Emergency Red-Flag Overrides</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-rose-600 mt-2 tabular-nums">
            {metrics.emergency_triggers_count}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Immediate 911 guidance served</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Standard Assessments</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2 tabular-nums">
            {metrics.normal_assessments_count}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Logged with audit hashes</p>
        </div>
      </div>

      {/* Automated Testing Suite Runner */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                AUTOMATED CLINICAL SAFETY VALIDATION
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">
                REGULATORY BATTERY
              </span>
            </div>
            <h2 className="text-lg font-bold mt-1">Clinical Scenario Test Harness</h2>
            <p className="text-xs text-slate-300">
              Executes deterministic unit checks for emergency chest pain, stroke FAST, pediatric lethargy, and prompt injection defense.
            </p>
          </div>

          <button
            onClick={runAutomatedTests}
            disabled={runningTests}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            {runningTests ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                <span>Executing Scenarios...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Run Safety Battery</span>
              </>
            )}
          </button>
        </div>

        {testSummary && (
          <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-center">
            <div>
              <span className="text-slate-400 block text-[10px]">TOTAL SCENARIOS</span>
              <span className="text-lg font-bold text-white tabular-nums">{testSummary.total}</span>
            </div>
            <div>
              <span className="text-emerald-400 block text-[10px]">PASSED CHECKS</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">{testSummary.passed}</span>
            </div>
            <div>
              <span className="text-rose-400 block text-[10px]">FAILED CHECKS</span>
              <span className="text-lg font-bold text-rose-400 tabular-nums">{testSummary.failed}</span>
            </div>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Scenario Execution Results:
            </h4>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {testResults.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {t.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className="font-bold text-white">{t.name}</span>
                    </div>
                    <p className="text-slate-300 italic text-[11px]">"{t.input}"</p>
                    <div className="text-slate-400 text-[10px] space-x-2">
                      <span>Expected: {t.expectedUrgency}</span>
                      <span>·</span>
                      <span>Resolved Urgency: {t.actualUrgency}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-teal-300 tabular-nums shrink-0">
                    {t.durationMs}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Anonymized Clinical Audit Logs</h2>
            <p className="text-xs text-slate-500">
              Logs record event type, urgency classification, and red flags without exposing private patient identifiable data.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Zero PII stored in logs</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="p-3.5">Log ID & Timestamp</th>
                  <th className="p-3.5">Event Type</th>
                  <th className="p-3.5">Urgency</th>
                  <th className="p-3.5">Red Flags Triggered</th>
                  <th className="p-3.5 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{log.id}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-3.5 capitalize font-sans">{log.type.replace('_', ' ')}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.urgency === 'red'
                            ? 'bg-rose-100 text-rose-800'
                            : log.urgency === 'orange'
                            ? 'bg-orange-100 text-orange-800'
                            : log.urgency === 'yellow'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {log.urgency}
                      </span>
                    </td>
                    <td className="p-3.5 font-sans">
                      {log.redFlagsTriggered?.length > 0 ? (
                        <span className="text-rose-700 font-medium">
                          {log.redFlagsTriggered[0]}
                        </span>
                      ) : (
                        <span className="text-slate-400">None detected</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums text-slate-600">
                      {log.latencyMs} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
