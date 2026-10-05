import React from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  PhoneCall,
  Lock,
  ChevronRight,
  HeartPulse,
  Stethoscope,
  Info,
} from 'lucide-react';

interface LandingPageProps {
  onStartAssessment: () => void;
  onOpenAuth: () => void;
  onOpenEmergency: () => void;
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onOpenAuth,
  onOpenEmergency,
  onNavigate,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/src/assets/images/hero_clinical_consult_1791160958188.jpg"
            alt="Clinical consultation environment"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/50" />
        </div>

        <div className="relative z-10 max-w-4xl px-6 sm:px-12 py-16 sm:py-24 space-y-8">
          {/* Subtle kicker without pill enclosure */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Clinical Decision Support & Triage</span>
            <span aria-hidden="true">·</span>
            <span>Safety-First Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-3xl">
            Understand Your Symptoms. Know Your Next Step.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            AI-powered health assessment designed to help you understand symptoms, assess clinical urgency, and prepare a structured report for professional medical care.
          </p>

          {/* Strict Safety Notice */}
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 max-w-2xl text-xs sm:text-sm text-slate-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
            <p>
              <strong>Important Medical Safety:</strong> MediDiagnosis AI provides preliminary health assessments and triage support. It does not replace a doctor or provide definitive medical diagnoses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartAssessment}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-md active:scale-95"
            >
              <span>Start Assessment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAuth}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base rounded-xl border border-white/20 transition-colors"
            >
              Sign In / Profile
            </button>
            <button
              onClick={onOpenEmergency}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-rose-300 hover:text-white hover:bg-rose-950/60 rounded-xl border border-rose-800/60 transition-colors text-sm font-semibold"
            >
              <PhoneCall className="w-4 h-4 text-rose-400" />
              <span>Emergency 911 Info</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4-Tier Emergency Triage System Display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Clinical Urgency Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Safety-First Triage Framework
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every symptom presentation is mapped to an evidence-grounded level of care to guide safe and timely medical decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Green */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 border-l-4 border-l-emerald-500 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span className="uppercase tracking-wider">Level 1 · GREEN</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Routine Monitoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Self-care education, home comfort measures, and general lifestyle tracking. Medical consultation is optional or elective.
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              Example: Mild fatigue after exercise, minor seasonal sniffles
            </div>
          </div>

          {/* Yellow */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 border-l-4 border-l-amber-500 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
              <span className="uppercase tracking-wider">Level 2 · YELLOW</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Consultation Advised</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Schedule a standard outpatient appointment with your primary care provider within a few days to evaluate persistent symptoms.
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              Example: Persistent cough for 10 days, recurring mild headache
            </div>
          </div>

          {/* Orange */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 border-l-4 border-l-orange-500 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-orange-800">
              <span className="uppercase tracking-wider">Level 3 · ORANGE</span>
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Prompt Evaluation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Same-day clinical evaluation recommended at an urgent care clinic or same-day clinic to prevent deterioration.
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              Example: High sustained fever, deep laceration, spreading rash
            </div>
          </div>

          {/* Red */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 border-l-4 border-l-rose-600 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-800">
              <span className="uppercase tracking-wider">Level 4 · RED</span>
              <PhoneCall className="w-4 h-4 text-rose-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Potential Emergency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Immediate escalation to local emergency services (911/999/112) or the nearest emergency department.
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              Example: Chest pain radiating to arm, stroke signs (FAST), severe dyspnea
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Clinical Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How MediDiagnosis AI Supports Your Health Journey
          </h2>
          <p className="text-sm text-slate-600">
            Built on strict medical principles that prioritize patient safety, clarity, and doctor-patient collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Adaptive Question Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Asks only relevant follow-up questions tailored to your specific symptoms, avoiding question fatigue while capturing critical clinical subtleties.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Physician-Ready Reports</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates a structured medical summary complete with timeline, severity, vitals, and smart questions you can bring to your appointment.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Privacy & Data Sovereignty</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your health data is private, stored locally on your device, with 1-click JSON export and permanent wipe controls. No selling to third parties.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Pledge Box (Anti-Slop & Regulatory Integrity) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-slate-100 rounded-3xl border border-slate-200 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-teal-700" />
            <h3 className="text-lg font-bold text-slate-900">
              The MediDiagnosis AI Medical Safety Pledge
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Never a definitive diagnosis:</strong> We present possible explanations rather than confirmed clinical verdicts.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>No deceptive percentages:</strong> We refuse to show false diagnostic probabilities like "95% chance you have X".</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>No prescription tampering:</strong> We will never instruct you to stop, start, or change prescription medication.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Zero emergency delays:</strong> Red-flag symptoms immediately trigger emergency services advice.</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 text-xs text-slate-500">
            <span>Always consult a qualified healthcare provider for clinical evaluation.</span>
            <button
              onClick={() => onNavigate('disclaimer')}
              className="text-teal-700 font-semibold hover:underline"
            >
              Read Full Medical Disclaimer & Regulations →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
