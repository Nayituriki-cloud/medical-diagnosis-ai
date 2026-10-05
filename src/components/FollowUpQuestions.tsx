import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowRight,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { AssessmentDraft } from './SymptomAssessment';
import { UserProfile, AssessmentData } from '../types';
import { Storage } from '../utils/storage';

interface FollowUpQuestionsProps {
  draft: AssessmentDraft;
  user: UserProfile;
  onAssessmentCompleted: (result: {
    assessment_id: string;
    created_at: string;
    is_emergency: boolean;
    data: AssessmentData;
    answers: Array<{ question: string; answer: string }>;
  }) => void;
  onEmergencyDetected: (redFlags: string[]) => void;
  onBack: () => void;
}

interface QuestionItem {
  id: string;
  text: string;
  type?: string;
  options: string[];
  clinical_rationale?: string;
}

export const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({
  draft,
  user,
  onAssessmentCompleted,
  onEmergencyDetected,
  onBack,
}) => {
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [submittingAssessment, setSubmittingAssessment] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/assess/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: draft.symptoms,
          duration: draft.duration,
          severity: draft.severity,
          initialText: draft.rawDescription,
          profile: {
            age: user.age,
            sex: user.sex,
            country: user.country,
            pregnant: draft.context.pregnant,
          },
        }),
      });

      const data = await res.json();

      if (data.is_emergency && data.emergency_warning) {
        onEmergencyDetected([data.emergency_warning]);
      }

      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        // Fallback clinical questions
        setQuestions([
          {
            id: 'q1',
            text: 'How rapidly did the main symptoms develop?',
            options: ['Within minutes to an hour', 'Gradually over several hours', 'Steadily over several days'],
          },
          {
            id: 'q2',
            text: 'Are you experiencing any shortness of breath, dizziness, or lightheadedness?',
            options: ['Yes, noticeable breathing difficulty or dizziness', 'Mild shortness of breath with activity only', 'No breathing difficulty or dizziness'],
          },
          {
            id: 'q3',
            text: 'Have you had this exact symptom episode previously?',
            options: ['Never before, this is new', 'Yes, recurrent flare-up of known issue', 'Similar episode in the past but milder'],
          },
        ]);
      }
    } catch (err) {
      console.error('Follow-up load error:', err);
      setErrorMsg('Failed to generate customized follow-up questions. Using standard clinical triage questions.');
      setQuestions([
        {
          id: 'q_progression',
          text: 'Is the symptom getting progressively worse, stable, or improving?',
          options: ['Steadily worsening', 'Remaining about the same', 'Comes and goes in waves', 'Gradually improving'],
        },
        {
          id: 'q_fever',
          text: 'Are you experiencing fever, chills, or night sweats?',
          options: ['Yes, measured fever', 'Chills or feeling hot only', 'No fever'],
        },
      ]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleCustomText = (questionId: string, text: string) => {
    setCustomAnswers((prev) => ({ ...prev, [questionId]: text }));
    if (text) {
      setAnswers((prev) => ({ ...prev, [questionId]: `Other: ${text}` }));
    }
  };

  const handleSubmit = async () => {
    // Check if at least some questions answered
    const formattedAnswers = questions.map((q) => ({
      question: q.text,
      answer: answers[q.id] || 'Not answered / Skipped',
    }));

    setSubmittingAssessment(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/assess/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: draft.symptoms,
          duration: draft.duration,
          severity: draft.severity,
          location: draft.location,
          onset: draft.onset,
          frequency: draft.frequency,
          vitals: draft.vitals,
          profile: {
            age: user.age,
            sex: user.sex,
            country: user.country,
            pregnant: draft.context.pregnant,
          },
          followupAnswers: formattedAnswers,
          medicalHistory: Storage.getConditions(),
          medications: Storage.getMedications(),
          allergies: Storage.getAllergies(),
        }),
      });

      if (!res.ok) {
        throw new Error('Assessment service error');
      }

      const result = await res.json();

      if (result.is_emergency && result.deterministic_red_flags?.length > 0) {
        onEmergencyDetected(result.deterministic_red_flags);
      }

      onAssessmentCompleted({
        assessment_id: result.assessment_id,
        created_at: result.created_at,
        is_emergency: result.is_emergency,
        data: result.data,
        answers: formattedAnswers,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Assessment could not be processed at this time. Please seek medical advice directly from a doctor.');
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const allAnswered = questions.length > 0 && questions.every((q) => !!answers[q.id]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Adaptive Clinical Questions · Step 4 of 4</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Clarifying Your Symptoms
        </h1>
        <p className="text-sm text-slate-600">
          These targeted questions help rule out red flags and distinguish between possible explanations.
        </p>
      </div>

      {loadingQuestions ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <Activity className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">
            Tailoring clinical questions to your symptoms...
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Our medical engine is filtering the relevant questions for {draft.symptoms.slice(0, 2).join(' and ')}.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              {errorMsg}
            </div>
          )}

          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Question {idx + 1} of {questions.length}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {q.text}
                  </h3>
                </div>
                {answers[q.id] && (
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`w-full text-left p-3.5 text-xs sm:text-sm rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-teal-50 border-teal-600 text-teal-950 font-semibold ring-1 ring-teal-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                          isSelected
                            ? 'border-teal-600 bg-teal-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}

                {/* Free text custom answer */}
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Or type a custom answer..."
                    value={customAnswers[q.id] || ''}
                    onChange={(e) => handleCustomText(q.id, e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={onBack}
              disabled={submittingAssessment}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              ← Back to Symptoms
            </button>

            <button
              onClick={handleSubmit}
              disabled={submittingAssessment}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
            >
              {submittingAssessment ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Clinical Assessment...</span>
                </>
              ) : (
                <>
                  <span>{allAnswered ? 'Complete Assessment' : 'Submit & Analyze'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
