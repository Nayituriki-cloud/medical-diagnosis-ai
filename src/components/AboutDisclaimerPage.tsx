import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Info,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { EMERGENCY_NUMBERS_BY_COUNTRY } from '../data/symptomsDatabase';

export const AboutDisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Clinical Governance & Safety
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Medical Disclaimer & Safety Constitution
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          The 10 non-negotiable safety guardrails governing MediDiagnosis AI.
        </p>
      </div>

      {/* Prominent Legal Disclaimer Box */}
      <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <span>Non-Diagnostic Clinical Disclaimer</span>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed font-medium">
          MediDiagnosis AI is an artificial intelligence decision-support and educational triage tool. It is <strong>NOT a licensed medical doctor</strong> and does <strong>NOT provide a definitive medical diagnosis</strong>. All assessments are preliminary insights intended solely to help you understand potential explanations and prepare for consultation with a qualified healthcare professional.
        </p>
        <p className="text-xs text-amber-950 leading-relaxed">
          If you believe you are experiencing a medical emergency, do not wait for an online assessment. Immediately call your local emergency services (e.g. 911, 999, 112) or proceed to the nearest emergency department.
        </p>
      </div>

      {/* The 10 Principles */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          The 10 Core Medical Safety Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              num: 1,
              title: 'Not a Doctor',
              text: 'The application clearly states at every interaction that it is an AI health-assessment tool and not a substitute for hands-on clinical evaluation.',
            },
            {
              num: 2,
              title: 'Possible Explanations, Not Confirmed Diagnoses',
              text: 'We present potential differential possibilities for discussion rather than definitive clinical diagnoses.',
            },
            {
              num: 3,
              title: 'Never Claim 100% Certainty',
              text: 'We reject deceptive diagnostic percentages like "95% chance you have condition X". Diagnostic certainty requires clinical tests.',
            },
            {
              num: 4,
              title: 'Emergency Detection Priority',
              text: 'Potentially dangerous red-flag symptoms immediately trigger high-priority emergency guidance and bypass non-critical questions.',
            },
            {
              num: 5,
              title: 'Prescription Medication Safety',
              text: 'We never tell users to start, stop, increase, or decrease prescription doses without professional medical instruction.',
            },
            {
              num: 6,
              title: 'Adaptive Clarification',
              text: 'When reported information is insufficient, the system poses targeted, adaptive follow-up questions to understand context.',
            },
            {
              num: 7,
              title: 'Encourage Medical Evaluation',
              text: 'We actively encourage professional evaluation when symptoms persist, worsen, or exceed self-care boundaries.',
            },
            {
              num: 8,
              title: 'Zero Delay for Emergencies',
              text: 'We never delay emergency guidance by subjecting a critically ill patient to unnecessary multi-step questionnaires.',
            },
            {
              num: 9,
              title: 'Educational Distinction',
              text: 'We clearly distinguish health educational information from personalized physician clinical advice.',
            },
            {
              num: 10,
              title: 'Data Privacy & Sovereignty',
              text: 'Health data remains strictly private and protected, with user-controlled export and permanent deletion features.',
            },
          ].map((principle) => (
            <div
              key={principle.num}
              className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-800 text-xs font-bold flex items-center justify-center font-mono">
                  {principle.num}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{principle.title}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                {principle.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Global Emergency Numbers Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Global Emergency Numbers Directory
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th className="p-3.5">Jurisdiction</th>
                <th className="p-3.5">Emergency Dispatch</th>
                <th className="p-3.5">Non-Emergency Healthline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {Object.entries(EMERGENCY_NUMBERS_BY_COUNTRY).map(([code, info]) => (
                <tr key={code} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{info.countryName}</span>
                  </td>
                  <td className="p-3.5">
                    <a
                      href={`tel:${info.emergency}`}
                      className="font-bold text-rose-700 hover:underline"
                    >
                      {info.emergency}
                    </a>
                  </td>
                  <td className="p-3.5 text-slate-600">{info.nonEmergency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
