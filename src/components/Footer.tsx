import React from 'react';
import { Activity, ShieldCheck, PhoneCall, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenEmergency }) => {
  return (
    <footer className="no-print bg-white border-t border-slate-200 mt-16 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 text-sm">MediDiagnosis AI</span>
            </div>
            <p className="text-slate-500 text-xs">
              AI Medical Symptom Assessment & Clinical Support. Understand your symptoms, assess urgency, and prepare for professional medical care.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 font-medium">
            <button
              onClick={() => onNavigate('landing')}
              className="hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('assess')}
              className="hover:text-slate-900 transition-colors"
            >
              Symptom Intake
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="hover:text-slate-900 transition-colors"
            >
              Assessment History
            </button>
            <button
              onClick={() => onNavigate('medications')}
              className="hover:text-slate-900 transition-colors"
            >
              Medication Safety
            </button>
            <button
              onClick={() => onNavigate('clinic')}
              className="hover:text-slate-900 transition-colors"
            >
              Clinician Portal
            </button>
            <button
              onClick={() => onNavigate('disclaimer')}
              className="hover:text-slate-900 transition-colors"
            >
              Safety Disclaimer
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-900 transition-colors"
            >
              Privacy & Controls
            </button>
          </div>

          <button
            onClick={onOpenEmergency}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 font-semibold transition-colors self-start md:self-auto"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Guidance</span>
          </button>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} MediDiagnosis AI. Designed for educational decision support. Not a doctor or definitive diagnostic service.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('disclaimer')}
              className="hover:underline"
            >
              Medical Disclaimer
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:underline"
            >
              Data Protection
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:underline"
            >
              Admin Telemetry
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
