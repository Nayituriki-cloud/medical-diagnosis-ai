import React, { useState } from 'react';
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  User,
  ShieldCheck,
  Save,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { AssessmentRecord, ClinicianReview } from '../types';
import { Storage } from '../utils/storage';

interface ClinicModeProps {
  assessments: AssessmentRecord[];
  onSelectAssessment: (record: AssessmentRecord) => void;
  onAssessmentUpdated: () => void;
}

export const ClinicMode: React.FC<ClinicModeProps> = ({
  assessments,
  onSelectAssessment,
  onAssessmentUpdated,
}) => {
  const [selectedId, setSelectedId] = useState<string>(assessments[0]?.id || '');
  const [clinicianName, setClinicianName] = useState('Dr. Sarah Lin, MD');
  const [clinicName, setClinicName] = useState('Metro Health Urgent & Primary Care');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [recommendedAction, setRecommendedAction] = useState<
    'Emergency Department' | 'Same-day Urgent Care' | 'Routine Primary Care' | 'Specialist Referral' | 'Self-Care Monitoring'
  >('Routine Primary Care');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedRecord = assessments.find((a) => a.id === selectedId) || assessments[0];

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const review: ClinicianReview = {
      reviewedBy: `${clinicianName} (${clinicName})`,
      reviewedAt: new Date().toISOString(),
      clinicalNotes: clinicalNotes || 'Patient intake and preliminary AI differential reviewed. Clinical examination ordered.',
      recommendedAction,
      status: 'reviewed',
    };

    Storage.updateAssessmentReview(selectedRecord.id, review);
    onAssessmentUpdated();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Clinician Header with Doctor Avatar */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-teal-500 shrink-0">
            <img
              src="/src/assets/images/avatar_doctor_lead_1791160968870.jpg"
              alt="Attending Clinician"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-teal-400">
                Healthcare Professional Portal
              </span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-mono">
                CLINICIAN PRIVILEGE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-0.5">{clinicianName}</h1>
            <p className="text-xs text-slate-300">{clinicName} · Internal Medicine</p>
          </div>
        </div>

        {/* Clear demarcation notice */}
        <div className="p-3 bg-white/10 rounded-xl border border-white/10 max-w-sm text-xs text-slate-300">
          <strong className="text-white block mb-0.5">Clinical Protocol:</strong>
          AI assessments represent unverified patient intake summaries. Only licensed clinicians determine final diagnosis and prescription regimens.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Intake Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Patient Intake Queue</h2>
            <span className="text-xs text-slate-500 font-mono">{assessments.length} records</span>
          </div>

          <div className="space-y-2.5">
            {assessments.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedId(item.id);
                  setClinicalNotes(item.clinicianReview?.clinicalNotes || '');
                  if (item.clinicianReview?.recommendedAction) {
                    setRecommendedAction(item.clinicianReview.recommendedAction);
                  }
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedId === item.id
                    ? 'bg-teal-50/70 border-teal-600 ring-1 ring-teal-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">{item.id}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      item.assessment.urgency === 'red'
                        ? 'bg-rose-100 text-rose-800'
                        : item.assessment.urgency === 'orange'
                        ? 'bg-orange-100 text-orange-800'
                        : item.assessment.urgency === 'yellow'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.assessment.urgency}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">
                  {item.symptoms.join(', ')}
                </h4>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    {item.clinicianReview ? (
                      <span className="text-teal-700 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Reviewed
                      </span>
                    ) : (
                      <span className="text-amber-700">Pending Review</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Selected Assessment & Clinician Addendum */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRecord ? (
            <>
              {/* Distinct AI Assessment Card */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      AI PRELIMINARY ASSESSMENT SUMMARY
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectAssessment(selectedRecord)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Clinical Report</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Severity Score</span>
                    <span className="font-semibold text-slate-800 tabular-nums">{selectedRecord.severity} / 10</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Urgency Classification</span>
                    <span className="font-bold text-slate-900 uppercase">{selectedRecord.assessment.urgency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Vitals</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.vitals?.temperature || 'None'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedRecord.assessment.summary}
                </p>

                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    AI Differential Possibilities:
                  </span>
                  <div className="space-y-1.5">
                    {selectedRecord.assessment.possible_conditions.map((c, i) => (
                      <div key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="font-bold text-slate-900">• {c.condition_name}:</span>
                        <span className="text-slate-500">[{c.confidence_level}]</span>
                        <span className="text-slate-600">{c.why_it_fits}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Distinct Clinician Assessment & Sign-Off Card */}
              <div className="p-6 bg-teal-900 text-white rounded-2xl shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-teal-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-teal-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                      CLINICIAN EVALUATION & FORMAL ADDENDUM
                    </span>
                  </div>
                  {selectedRecord.clinicianReview && (
                    <span className="text-xs font-semibold text-teal-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>Formally Reviewed</span>
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-teal-200 mb-1">
                        Attending Clinician
                      </label>
                      <input
                        type="text"
                        value={clinicianName}
                        onChange={(e) => setClinicianName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-teal-950/60 border border-teal-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-teal-200 mb-1">
                        Recommended Clinical Action / Disposition
                      </label>
                      <select
                        value={recommendedAction}
                        onChange={(e) => setRecommendedAction(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-teal-950/60 border border-teal-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                      >
                        <option value="Self-Care Monitoring">Self-Care Monitoring & Return Precautions</option>
                        <option value="Routine Primary Care">Routine Outpatient Primary Care</option>
                        <option value="Same-day Urgent Care">Same-day Urgent Care Clinic</option>
                        <option value="Specialist Referral">Specialist Outpatient Referral</option>
                        <option value="Emergency Department">Direct Escalation to Emergency Department</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-200 mb-1">
                      Clinical Impression & Formal Physician Notes
                    </label>
                    <textarea
                      rows={4}
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      placeholder="Enter provider examination findings, working diagnosis, confirmatory laboratory orders, or patient return instructions..."
                      className="w-full p-3 text-xs bg-teal-950/60 border border-teal-700 rounded-xl text-white placeholder:text-teal-400/60 focus:outline-none focus:ring-1 focus:ring-teal-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-teal-300">
                      Signatures and addenda are securely attached to patient intake record.
                    </span>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-900 bg-teal-300 hover:bg-teal-200 rounded-xl transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saveSuccess ? 'Saved to Record' : 'Sign & Mark as Reviewed'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">Select an assessment from the queue to review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
