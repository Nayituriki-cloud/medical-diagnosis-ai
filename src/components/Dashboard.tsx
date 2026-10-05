import React from 'react';
import {
  Activity,
  PlusCircle,
  Clock,
  AlertTriangle,
  FileText,
  Pill,
  HeartPulse,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Calendar,
} from 'lucide-react';
import { UserProfile, AssessmentRecord } from '../types';
import { Storage } from '../utils/storage';

interface DashboardProps {
  user: UserProfile;
  assessments: AssessmentRecord[];
  onStartAssessment: () => void;
  onViewAssessment: (record: AssessmentRecord) => void;
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  assessments,
  onStartAssessment,
  onViewAssessment,
  onNavigate,
  onOpenEmergency,
}) => {
  const conditions = Storage.getConditions();
  const medications = Storage.getMedications();
  const allergies = Storage.getAllergies();

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'red':
        return <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">RED · Emergency</span>;
      case 'orange':
        return <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-md">ORANGE · Prompt</span>;
      case 'yellow':
        return <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">YELLOW · Consult</span>;
      case 'green':
      default:
        return <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">GREEN · Routine</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Age: {user.age} · Sex: {user.sex} · Country: {user.country}
            {user.isPregnant && ' · Currently Pregnant'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenEmergency}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency 911</span>
          </button>
          <button
            onClick={onStartAssessment}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* Top 3 Quick Stats / Health Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Conditions */}
        <div
          onClick={() => onNavigate('medical_history')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Medical Conditions</span>
            <HeartPulse className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{conditions.length}</span>
            <span className="text-xs text-slate-500 ml-1.5">active records</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 truncate">
            {conditions.length > 0 ? conditions.map(c => c.name).join(', ') : 'No conditions recorded'}
          </p>
        </div>

        {/* Medications */}
        <div
          onClick={() => onNavigate('medications')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Medications</span>
            <Pill className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{medications.length}</span>
            <span className="text-xs text-slate-500 ml-1.5">prescriptions</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 truncate">
            {medications.length > 0 ? medications.map(m => m.name).join(', ') : 'No medications recorded'}
          </p>
        </div>

        {/* Allergies */}
        <div
          onClick={() => onNavigate('medications')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Known Allergies</span>
            <AlertTriangle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{allergies.length}</span>
            <span className="text-xs text-slate-500 ml-1.5">sensitivities</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 truncate">
            {allergies.length > 0 ? allergies.map(a => a.allergen).join(', ') : 'No allergies recorded'}
          </p>
        </div>
      </div>

      {/* Main Content Split: Recent Assessments + Quick Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Assessments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Symptom Assessments</h2>
              <p className="text-xs text-slate-500">Click any assessment to inspect detailed clinical results and doctor reports.</p>
            </div>
            {assessments.length > 0 && (
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                View all ({assessments.length}) →
              </button>
            )}
          </div>

          {assessments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
              <Activity className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No assessments logged yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Begin by describing any symptoms you are experiencing. The AI will guide you through triage questions.
              </p>
              <button
                onClick={onStartAssessment}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
              >
                Start First Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {assessments.slice(0, 4).map((record) => (
                <div
                  key={record.id}
                  onClick={() => onViewAssessment(record)}
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">{record.id}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">
                          {new Date(record.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        {record.symptoms.slice(0, 3).join(', ')}
                        {record.symptoms.length > 3 && ` +${record.symptoms.length - 3} more`}
                      </h3>
                    </div>
                    {getUrgencyBadge(record.assessment.urgency)}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {record.assessment.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      Duration: <strong className="text-slate-700">{record.duration}</strong> · Severity: <strong className="text-slate-700">{record.severity}/10</strong>
                    </span>
                    <span className="text-teal-700 font-semibold flex items-center gap-1">
                      <span>View Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Quick Clinical Modules */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Clinical Support Modules</h2>

          <div className="space-y-3">
            {/* Med Safety */}
            <div
              onClick={() => onNavigate('medications')}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 transition-colors cursor-pointer flex items-start gap-3"
            >
              <div className="p-2 bg-teal-50 rounded-lg text-teal-700 shrink-0">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Medication Safety Checker</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Look up drug purpose, precautions, side effects, and warning signs safely.
                </p>
              </div>
            </div>

            {/* Doctor Reports */}
            <div
              onClick={() => onNavigate('reports')}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 transition-colors cursor-pointer flex items-start gap-3"
            >
              <div className="p-2 bg-teal-50 rounded-lg text-teal-700 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Physician-Ready Clinical Reports</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Print or export structured reports with clinical timeline and symptom analysis.
                </p>
              </div>
            </div>

            {/* Clinic Portal */}
            <div
              onClick={() => onNavigate('clinic')}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 transition-colors cursor-pointer flex items-start gap-3"
            >
              <div className="p-2 bg-teal-50 rounded-lg text-teal-700 shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Healthcare Professional Portal</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clinician review mode: verify patient reports and add official physician notes.
                </p>
              </div>
            </div>

            {/* AI Educational Q&A */}
            <div
              onClick={() => onNavigate('chat')}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 transition-colors cursor-pointer flex items-start gap-3"
            >
              <div className="p-2 bg-teal-50 rounded-lg text-teal-700 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">AI Health Education Companion</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ask educational questions about symptoms, terminology, and what to ask a doctor.
                </p>
              </div>
            </div>

            {/* Admin Console & Automated Tests */}
            <div
              onClick={() => onNavigate('admin')}
              className="p-4 bg-slate-100 rounded-xl border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer flex items-start gap-3"
            >
              <div className="p-2 bg-slate-200 rounded-lg text-slate-700 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">System Monitoring & Tests</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  View safety triage logs, AI error monitoring, and execute automated safety tests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
