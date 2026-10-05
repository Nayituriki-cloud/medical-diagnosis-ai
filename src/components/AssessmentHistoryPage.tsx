import React, { useState } from 'react';
import {
  Activity,
  Search,
  Calendar,
  Filter,
  ChevronRight,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';
import { AssessmentRecord, UrgencyLevel } from '../types';

interface AssessmentHistoryPageProps {
  assessments: AssessmentRecord[];
  onSelectAssessment: (record: AssessmentRecord) => void;
  onStartNew: () => void;
}

export const AssessmentHistoryPage: React.FC<AssessmentHistoryPageProps> = ({
  assessments,
  onSelectAssessment,
  onStartNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | UrgencyLevel>('all');

  const filtered = assessments.filter((record) => {
    const matchesSearch =
      record.symptoms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.assessment.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUrgency = urgencyFilter === 'all' || record.assessment.urgency === urgencyFilter;

    return matchesSearch && matchesUrgency;
  });

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Clinical Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Assessment History & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review past symptom assessments, track episode progression over time, and export physician reports.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 rounded-xl hover:bg-teal-800 transition-colors shadow-sm whitespace-nowrap"
        >
          <Activity className="w-4 h-4" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by symptom, condition, or assessment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Urgency Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'red', 'orange', 'yellow', 'green'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setUrgencyFilter(lvl)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors whitespace-nowrap ${
                urgencyFilter === lvl
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lvl === 'all' ? 'All Tiers' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Assessment List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No assessments matched your query</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or start a new clinical assessment.
            </p>
          </div>
        ) : (
          filtered.map((record) => (
            <div
              key={record.id}
              onClick={() => onSelectAssessment(record)}
              className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 transition-all cursor-pointer shadow-xs space-y-4 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-slate-700">{record.id}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">
                    {new Date(record.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {record.clinicianReview && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-teal-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Clinician Reviewed
                      </span>
                    </>
                  )}
                </div>
                <div>{getUrgencyBadge(record.assessment.urgency)}</div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                  {record.symptoms.join(', ')}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {record.assessment.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                  <span className="font-semibold text-slate-800">{record.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Severity</span>
                  <span className="font-semibold text-slate-800 tabular-nums">{record.severity} / 10</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Consideration</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {record.assessment.possible_conditions[0]?.condition_name || 'Evaluation needed'}
                  </span>
                </div>
                <div className="flex justify-end items-center">
                  <span className="text-teal-700 font-semibold flex items-center gap-1">
                    <span>Inspect Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
