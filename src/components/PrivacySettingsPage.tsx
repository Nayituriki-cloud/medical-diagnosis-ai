import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  EyeOff,
  Database,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Storage } from '../utils/storage';

interface PrivacySettingsPageProps {
  onDataWiped: () => void;
}

export const PrivacySettingsPage: React.FC<PrivacySettingsPageProps> = ({ onDataWiped }) => {
  const [wipedSuccess, setWipedSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportData = () => {
    const json = Storage.exportAllDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medidiagnosis_health_record_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleWipeData = () => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete all stored health assessments, conditions, medications, and allergies from this device? This action cannot be undone.'
      )
    ) {
      Storage.clearAllData();
      onDataWiped();
      setWipedSuccess(true);
      setTimeout(() => setWipedSuccess(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Transparency & Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Privacy Architecture & Data Sovereignty
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          How your health information is handled, secured, and retained on your local device.
        </p>
      </div>

      {/* Primary Data Sovereignty Controls */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Your Data Sovereignty Controls</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          You have absolute control over your health records. You may export a complete, machine-readable JSON backup at any time or permanently wipe your local health data.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-700" />
            <span>{downloadSuccess ? 'Downloaded!' : 'Export All Data (JSON)'}</span>
          </button>

          <button
            onClick={handleWipeData}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>{wipedSuccess ? 'All Data Wiped' : 'Permanently Delete All Records'}</span>
          </button>
        </div>
      </div>

      {/* Privacy Q&A Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Privacy Disclosures</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wide">
              <Database className="w-4 h-4 text-teal-600" />
              <span>What Information Is Collected?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We collect only the symptoms, timeline, severity scores, and optional health history you explicitly enter during an assessment.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wide">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>Where Is Data Stored?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your health assessments and medication history are stored locally in your browser's private sandbox storage. We do not store unanonymized records on external ad servers.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wide">
              <EyeOff className="w-4 h-4 text-teal-600" />
              <span>Zero 3rd-Party Data Sales</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              MediDiagnosis AI does not sell, broker, or monetize your health information with insurance providers, advertisers, or third-party data brokers.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>How Is AI Processing Handled?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assessment requests are transmitted over secure TLS/HTTPS to our server-side medical assessment engine. Prompts are scrubbed of unneeded identifiers prior to model invocation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
