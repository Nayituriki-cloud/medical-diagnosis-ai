import React, { useState } from 'react';
import {
  Printer,
  Download,
  Share2,
  Check,
  ShieldAlert,
  Calendar,
  User,
  HeartPulse,
  Pill,
  AlertTriangle,
  Stethoscope,
  ArrowLeft,
} from 'lucide-react';
import { AssessmentRecord, UserProfile } from '../types';
import { Storage } from '../utils/storage';

interface DoctorReportProps {
  record: AssessmentRecord;
  user: UserProfile;
  onBack: () => void;
  onNavigateToClinic?: () => void;
}

export const DoctorReport: React.FC<DoctorReportProps> = ({
  record,
  user,
  onBack,
  onNavigateToClinic,
}) => {
  const [copied, setCopied] = useState(false);
  const conditions = Storage.getConditions();
  const medications = Storage.getMedications();
  const allergies = Storage.getAllergies();

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `CLINICAL REPORT: MediDiagnosis AI
Report ID: ${record.id}
Date: ${new Date(record.createdAt).toLocaleDateString()}
Patient: ${user.name} (Age: ${user.age}, Sex: ${user.sex})
Urgency Level: ${record.assessment.urgency.toUpperCase()}
Chief Complaints: ${record.symptoms.join(', ')}
Duration: ${record.duration} | Severity: ${record.severity}/10
Summary: ${record.assessment.summary}

POSSIBLE EXPLANATIONS:
${record.assessment.possible_conditions.map((c) => `- ${c.condition_name} (${c.confidence_level}): ${c.why_it_fits}`).join('\n')}

RED FLAGS:
${record.assessment.red_flags.join(', ')}

RECOMMENDED LEVEL OF CARE:
${record.assessment.recommended_next_step}

AI NOTICE: AI-generated preliminary assessment — not a confirmed medical diagnosis.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Action Toolbar (Hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assessment</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          {onNavigateToClinic && (
            <button
              onClick={onNavigateToClinic}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Clinician Portal Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Clinical Document */}
      <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-sm space-y-8 print-shadow-none">
        {/* Header with Barcode Simulation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                MediDiagnosis AI
              </span>
              <span className="text-xs bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-slate-600 font-mono">
                CLINICAL TRIAGE SUMMARY
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Physician Decision Support & Structured Intake Record
            </p>
          </div>

          <div className="text-right sm:text-right font-mono text-xs text-slate-600 space-y-0.5">
            <div><strong>REPORT ID:</strong> {record.id}</div>
            <div><strong>DATE:</strong> {new Date(record.createdAt).toLocaleDateString()} {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-[10px] text-slate-400">STATUS: PRE-CLINICIAN INTAKE</div>
          </div>
        </div>

        {/* Mandatory Safety Notice */}
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>AI-generated preliminary assessment — not a confirmed medical diagnosis.</strong> This document provides structured patient-reported information to assist clinical history-taking.
          </span>
        </div>

        {/* Patient Demographics & Vitals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-medium uppercase text-[10px]">Patient Name</span>
            <span className="font-bold text-slate-900 text-sm">{user.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium uppercase text-[10px]">Age / Biological Sex</span>
            <span className="font-semibold text-slate-800">{user.age} yrs · {user.sex}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium uppercase text-[10px]">Emergency Contact</span>
            <span className="font-semibold text-slate-800">
              {user.emergencyContact?.name ? `${user.emergencyContact.name} (${user.emergencyContact.phone})` : 'None recorded'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium uppercase text-[10px]">Reported Temperature</span>
            <span className="font-semibold text-slate-800">{record.vitals?.temperature || 'Unmeasured'}</span>
          </div>
        </div>

        {/* Section 1: Chief Complaint & Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Chief Complaints & Chronology
          </h3>
          <div className="text-xs text-slate-800 space-y-1.5">
            <p><strong>Primary Symptoms:</strong> {record.symptoms.join(', ')}</p>
            <p><strong>Duration:</strong> {record.duration} · <strong>Onset:</strong> {record.onset || 'Gradual'} · <strong>Frequency:</strong> {record.frequency || 'Intermittent'}</p>
            <p><strong>Patient Severity Score:</strong> {record.severity} / 10</p>
            {record.rawDescription && (
              <p className="italic text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                "{record.rawDescription}"
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Clinical Urgency Level */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Triage Urgency Assessment
          </h3>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold uppercase px-3 py-1 rounded text-white ${
                record.assessment.urgency === 'red'
                  ? 'bg-rose-600'
                  : record.assessment.urgency === 'orange'
                  ? 'bg-orange-600'
                  : record.assessment.urgency === 'yellow'
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
            >
              URGENCY: {record.assessment.urgency.toUpperCase()}
            </span>
            <span className="text-xs text-slate-700 font-medium">
              {record.assessment.urgency_reason}
            </span>
          </div>
        </div>

        {/* Section 3: Possible Explanations (Differentials for Discussion) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            3. Algorithmic Differential Possibilities (For Physician Evaluation)
          </h3>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-2.5">Possible Condition</th>
                <th className="p-2.5">Confidence Tier</th>
                <th className="p-2.5">Clinical Rationale</th>
                <th className="p-2.5">Suggested Workup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {record.assessment.possible_conditions.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold">{c.condition_name}</td>
                  <td className="p-2.5 font-medium text-slate-600">{c.confidence_level}</td>
                  <td className="p-2.5">{c.why_it_fits}</td>
                  <td className="p-2.5 font-mono text-[11px]">{c.tests_doctor_might_order?.join(', ') || 'Clinical exam'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Red Flag Screen */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            4. Red Flag Safety Screen
          </h3>
          <div className="text-xs text-slate-700">
            <p className="font-semibold text-rose-700 mb-1">Warning Signs to Rule Out:</p>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
              {record.assessment.red_flags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 5: Medical History & Medications */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="font-bold text-slate-900 block mb-1">Documented Conditions</span>
            {conditions.length > 0 ? (
              <ul className="space-y-0.5 text-slate-700 list-disc list-inside">
                {conditions.map((c) => (
                  <li key={c.id}>{c.name} ({c.status})</li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-400">None reported</span>
            )}
          </div>

          <div>
            <span className="font-bold text-slate-900 block mb-1">Current Medications</span>
            {medications.length > 0 ? (
              <ul className="space-y-0.5 text-slate-700 list-disc list-inside">
                {medications.map((m) => (
                  <li key={m.id}>{m.name} {m.dosage}</li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-400">None reported</span>
            )}
          </div>

          <div>
            <span className="font-bold text-slate-900 block mb-1">Known Allergies</span>
            {allergies.length > 0 ? (
              <ul className="space-y-0.5 text-rose-700 font-semibold list-disc list-inside">
                {allergies.map((a) => (
                  <li key={a.id}>{a.allergen} ({a.reactionType})</li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-400">NKDA (No known allergies)</span>
            )}
          </div>
        </div>

        {/* Section 6: Follow-Up Questions Transcript */}
        {record.followupAnswers?.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              6. Patient Follow-up Questionnaire Transcript
            </h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              {record.followupAnswers.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1">
                  <span className="font-semibold text-slate-900 sm:w-1/2">Q: {item.question}</span>
                  <span className="text-slate-700 sm:w-1/2 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    A: {item.answer}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 7: Clinician Review & Sign-Off Section */}
        <div className="pt-6 border-t-2 border-slate-300 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              7. Healthcare Professional Review & Clinical Orders
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              PHYSICIAN / PROVIDER USE ONLY
            </span>
          </div>

          {record.clinicianReview ? (
            <div className="p-4 bg-teal-50 border border-teal-300 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-teal-900">
                <span>Verified by: {record.clinicianReview.reviewedBy}</span>
                <span>Action: {record.clinicianReview.recommendedAction}</span>
              </div>
              <p className="text-slate-800">
                <strong>Clinician Notes:</strong> {record.clinicianReview.clinicalNotes}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 pt-4 text-xs">
              <div className="space-y-6">
                <div>
                  <div className="border-b border-slate-400 h-8" />
                  <span className="text-[11px] text-slate-500 block mt-1">Attending Clinician Signature / License #</span>
                </div>
                <div>
                  <div className="border-b border-slate-400 h-8" />
                  <span className="text-[11px] text-slate-500 block mt-1">Printed Clinician Name & Clinic Facility</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="border-b border-slate-400 h-8" />
                  <span className="text-[11px] text-slate-500 block mt-1">Clinical Impression / Confirmed Diagnosis</span>
                </div>
                <div>
                  <div className="border-b border-slate-400 h-8" />
                  <span className="text-[11px] text-slate-500 block mt-1">Disposition & Follow-up Date</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
