import React, { useState } from 'react';
import { AlertOctagon, PhoneCall, AlertTriangle, ShieldCheck, MapPin, X } from 'lucide-react';
import { EMERGENCY_NUMBERS_BY_COUNTRY } from '../data/symptomsDatabase';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  redFlags?: string[];
  initialCountry?: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  redFlags = [],
  initialCountry = 'US',
}) => {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

  if (!isOpen) return null;

  const currentNumbers = EMERGENCY_NUMBERS_BY_COUNTRY[selectedCountry] || EMERGENCY_NUMBERS_BY_COUNTRY.US;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-4 border-rose-600 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Red Alert Banner */}
        <div className="bg-rose-600 px-6 py-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <AlertOctagon className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-rose-100">
                CRITICAL SAFETY TRIAGE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                Your symptoms may require urgent medical attention.
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Dismiss alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Detected Red Flags if present */}
          {redFlags.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Detected High-Risk Clinical Indicators:</span>
              </div>
              <ul className="list-disc list-inside text-sm text-rose-900 space-y-1 pl-1">
                {redFlags.map((flag, idx) => (
                  <li key={idx} className="font-medium">{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Primary Action: Direct Dial */}
          <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-wider text-teal-400 uppercase">
                Immediate Action Required
              </p>
              <h3 className="text-lg font-bold">
                Call Local Emergency Services
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Dispatch paramedics or proceed immediately to the nearest Emergency Department.
              </p>
            </div>
            <a
              href={`tel:${currentNumbers.emergency}`}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-base rounded-xl transition-transform active:scale-95 shadow-lg whitespace-nowrap"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>Call {currentNumbers.emergency} Now</span>
            </a>
          </div>

          {/* Country Selector for Emergency Numbers */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-xs text-slate-600 font-medium">Emergency Country:</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {Object.entries(EMERGENCY_NUMBERS_BY_COUNTRY).map(([code, info]) => (
                  <option key={code} value={code}>
                    {info.countryName} ({info.emergency})
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500">
                Non-emergency: <strong className="text-slate-700">{currentNumbers.nonEmergency}</strong>
              </span>
            </div>
          </div>

          {/* Immediate Safety Steps */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
              Essential Safety Actions (Do Not Delay)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>1. Do NOT Drive Yourself:</strong> Always call an ambulance or have someone drive you safely to avoid sudden incapacitation on the road.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>2. Rest & Stay Still:</strong> Sit down or lie down in a comfortable position with support for your back and head.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>3. Unlock Doors:</strong> If alone, unlock your front door so emergency responders can access you without delay.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>4. Notify Someone:</strong> Alert a family member, neighbor, or emergency contact immediately.
              </div>
            </div>
          </div>

          {/* Medical Disclaimer Reminder */}
          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              MediDiagnosis AI is an educational clinical triage tool and not a substitute for hands-on physician evaluation. Do not continue answering questions if you suspect a medical emergency.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              I Understand & Will Seek Emergency Care
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
