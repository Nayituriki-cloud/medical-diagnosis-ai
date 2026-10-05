import React from 'react';
import {
  Activity,
  AlertTriangle,
  AlertOctagon,
  Clock,
  CheckCircle2,
  FileText,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  HelpCircle,
  PhoneCall,
  Sparkles,
  Share2,
} from 'lucide-react';
import { AssessmentRecord, UrgencyLevel, ConfidenceLevel } from '../types';

interface AssessmentResultsProps {
  record: AssessmentRecord;
  onCreateReport: () => void;
  onOpenEmergency: () => void;
  onStartNew: () => void;
  onShareReport?: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  record,
  onCreateReport,
  onOpenEmergency,
  onStartNew,
}) => {
  const { assessment } = record;

  const getUrgencyDisplay = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'red':
        return {
          title: 'RED · Potential Emergency',
          subtitle: 'Immediate evaluation by emergency services or emergency department required.',
          border: 'border-l-rose-600 bg-rose-50/60',
          badge: 'bg-rose-600 text-white',
          icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
        };
      case 'orange':
        return {
          title: 'ORANGE · Prompt Medical Evaluation',
          subtitle: 'Prompt evaluation recommended today at an urgent care center or same-day clinic.',
          border: 'border-l-orange-500 bg-orange-50/60',
          badge: 'bg-orange-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
        };
      case 'yellow':
        return {
          title: 'YELLOW · Medical Consultation Advised',
          subtitle: 'Schedule a routine appointment with your primary care provider within a few days.',
          border: 'border-l-amber-500 bg-amber-50/60',
          badge: 'bg-amber-600 text-white',
          icon: <Clock className="w-5 h-5 text-amber-600" />,
        };
      case 'green':
      default:
        return {
          title: 'GREEN · Routine Monitoring & Self-Care',
          subtitle: 'Supportive self-care and routine observation. Clinical evaluation is elective.',
          border: 'border-l-emerald-500 bg-emerald-50/60',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
        };
    }
  };

  const getConfidenceBadge = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case 'More consistent with':
        return (
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
            More consistent with presentation
          </span>
        );
      case 'Could be related to':
        return (
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
            Could be related to symptoms
          </span>
        );
      case 'Less consistent with':
        return (
          <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md">
            Less consistent with pattern
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            Needs medical evaluation
          </span>
        );
    }
  };

  const urgencyInfo = getUrgencyDisplay(assessment.urgency);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner if Emergency */}
      {assessment.urgency === 'red' && (
        <div className="p-5 bg-rose-600 text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 text-white shrink-0 animate-pulse" />
            <div>
              <h3 className="font-bold text-base">Potential Emergency Detected</h3>
              <p className="text-xs text-rose-100 mt-0.5">
                Do not rely solely on this digital assessment. Immediate emergency care is advised.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEmergency}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-rose-700 font-bold text-xs rounded-xl shadow-xs whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Services</span>
          </button>
        </div>
      )}

      {/* Assessment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Assessment ID: {record.id}</span>
            <span aria-hidden="true">·</span>
            <span>
              {new Date(record.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Clinical Symptom Assessment
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartNew}
            className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            New Assessment
          </button>
          <button
            onClick={onCreateReport}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Create Doctor Report</span>
          </button>
        </div>
      </div>

      {/* 1. Urgency Level Banner */}
      <div
        className={`p-6 rounded-2xl border border-slate-200 border-l-6 ${urgencyInfo.border} space-y-3 shadow-xs`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {urgencyInfo.icon}
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Triage Decision Support
            </span>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${urgencyInfo.badge}`}>
            {assessment.urgency.toUpperCase()}
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">{urgencyInfo.title}</h2>
        <p className="text-sm text-slate-700 leading-relaxed font-medium">
          {assessment.urgency_reason}
        </p>
      </div>

      {/* 2. Intake Summary Grid */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Reported Presentation Summary
        </h3>
        <p className="text-sm text-slate-800 leading-relaxed">
          {assessment.summary}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block">Reported Symptoms</span>
            <span className="font-semibold text-slate-800">{record.symptoms.join(', ')}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Duration</span>
            <span className="font-semibold text-slate-800">{record.duration}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Severity Score</span>
            <span className="font-semibold text-slate-800 tabular-nums">{record.severity} / 10</span>
          </div>
          <div>
            <span className="text-slate-400 block">Onset & Location</span>
            <span className="font-semibold text-slate-800 capitalize">
              {record.onset || 'Gradual'} · {record.location || 'General'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Possible Explanations (NO misleading percentages) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Possible Explanations</h3>
          <p className="text-xs text-slate-500">
            These are clinical possibilities to discuss with a physician, not confirmed diagnoses.
          </p>
        </div>

        <div className="space-y-3">
          {assessment.possible_conditions.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span>{item.condition_name}</span>
                </h4>
                <div>{getConfidenceBadge(item.confidence_level)}</div>
              </div>

              <div className="text-xs text-slate-700 space-y-2">
                <div>
                  <strong className="text-slate-900">Why this may fit:</strong>{' '}
                  <span className="text-slate-600">{item.why_it_fits}</span>
                </div>
                <div>
                  <strong className="text-slate-900">Clinical summary:</strong>{' '}
                  <span className="text-slate-600">{item.clinical_summary}</span>
                </div>
                {item.tests_doctor_might_order?.length > 0 && (
                  <div className="pt-1">
                    <strong className="text-slate-900">Evaluative tests a doctor might order:</strong>{' '}
                    <span className="text-slate-600 font-mono text-[11px]">
                      {item.tests_doctor_might_order.join(' · ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Warning Signs (Red Flags) */}
      {assessment.red_flags?.length > 0 && (
        <div className="p-6 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Warning Signs to Watch For (Red Flags)</span>
          </div>
          <p className="text-xs text-rose-900/80">
            If you experience any of the following signs, seek immediate emergency medical care without waiting:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-950 font-medium">
            {assessment.red_flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-lg border border-rose-100">
                <span className="text-rose-500 font-bold">⚠️</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Recommended Next Step & Comfort Measures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Recommended Level of Care</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {assessment.recommended_next_step}
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>General Comfort & Self-Care</span>
          </h4>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            {assessment.self_care_information?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 6. Questions to Ask Your Doctor */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Stethoscope className="w-4 h-4 text-teal-700" />
          <span>Recommended Questions to Ask Your Healthcare Provider</span>
        </div>
        <p className="text-xs text-slate-500">
          Take these prepared questions to your appointment to facilitate an informed discussion.
        </p>

        <div className="space-y-2">
          {assessment.doctor_questions?.map((q, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800 flex items-start gap-2.5">
              <span className="font-bold text-teal-700">Q{idx + 1}:</span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA for Doctor Report */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Prepare for Your Doctor's Visit</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Generate a clean, printable clinical summary formatted for your physician.
          </p>
        </div>
        <button
          onClick={onCreateReport}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md whitespace-nowrap active:scale-95"
        >
          <FileText className="w-4 h-4" />
          <span>Create Doctor Report</span>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center leading-relaxed">
        {assessment.disclaimer}
      </p>
    </div>
  );
};
