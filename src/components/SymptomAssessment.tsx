import React, { useState } from 'react';
import {
  Activity,
  Search,
  Plus,
  X,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Thermometer,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { UserProfile } from '../types';
import { SYMPTOM_CATEGORIES, ALL_SYMPTOMS } from '../data/symptomsDatabase';
import { Storage } from '../utils/storage';

interface SymptomAssessmentProps {
  user: UserProfile;
  onProceedToFollowUp: (data: AssessmentDraft) => void;
  onEmergencyDetected: (redFlags: string[]) => void;
}

export interface AssessmentDraft {
  rawDescription: string;
  symptoms: string[];
  duration: string;
  severity: number;
  location: string;
  onset: string;
  frequency: string;
  vitals: {
    temperature?: string;
    heartRate?: string;
    bloodPressure?: string;
  };
  context: {
    recentInjury: boolean;
    recentTravel: boolean;
    recentProcedure: boolean;
    pregnant: boolean;
  };
}

export const SymptomAssessment: React.FC<SymptomAssessmentProps> = ({
  user,
  onProceedToFollowUp,
  onEmergencyDetected,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [freeformText, setFreeformText] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [duration, setDuration] = useState('2 days');
  const [severity, setSeverity] = useState<number>(5);
  const [location, setLocation] = useState('');
  const [onset, setOnset] = useState('gradual');
  const [frequency, setFrequency] = useState('intermittent');

  // Vitals & Context
  const [temperature, setTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [recentInjury, setRecentInjury] = useState(false);
  const [recentTravel, setRecentTravel] = useState(false);
  const [recentProcedure, setRecentProcedure] = useState(false);
  const [isPregnant, setIsPregnant] = useState(user.isPregnant || false);

  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAiExtract = async () => {
    if (!freeformText.trim()) return;
    setExtracting(true);
    setExtractError(null);

    try {
      const res = await fetch('/api/assess/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: freeformText,
          profile: {
            age: user.age,
            sex: user.sex,
            country: user.country,
            pregnant: isPregnant,
          },
        }),
      });

      const data = await res.json();

      if (data.is_emergency && data.deterministic_red_flags?.length > 0) {
        onEmergencyDetected(data.deterministic_red_flags);
        return;
      }

      if (Array.isArray(data.symptoms) && data.symptoms.length > 0) {
        // Merge extracted symptoms
        const merged = Array.from(new Set([...selectedSymptoms, ...data.symptoms]));
        setSelectedSymptoms(merged);
      }

      if (data.duration) setDuration(data.duration);
      if (data.severity) setSeverity(Math.min(Math.max(Math.round(data.severity), 1), 10));
      if (data.location) setLocation(data.location);
      if (data.onset) setOnset(data.onset);
      if (data.frequency) setFrequency(data.frequency);

      // Advance to Step 2
      setStep(2);
    } catch (err) {
      console.error(err);
      setExtractError('Could not process description with AI. You can still select symptoms manually below.');
    } finally {
      setExtracting(false);
    }
  };

  const filteredSymptoms = ALL_SYMPTOMS.filter((s) => {
    const matchesSearch = s.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === 'all') return matchesSearch;
    const cat = SYMPTOM_CATEGORIES.find((c) => c.id === selectedCategory);
    return matchesSearch && cat?.symptoms.includes(s);
  });

  const getSeverityDescription = (val: number) => {
    if (val <= 3) return 'Mild — Noticeable discomfort, but easily perform normal work and daily routine.';
    if (val <= 6) return 'Moderate — Discomfort interferes with normal tasks; concentration or activity is limited.';
    if (val <= 8) return 'Severe — Significant pain/distress; unable to perform routine activities, resting in bed.';
    return 'Excruciating / Emergency — Extreme distress or intolerable pain requiring urgent attention.';
  };

  const handleProceed = () => {
    if (selectedSymptoms.length === 0 && !freeformText.trim()) {
      alert('Please enter or select at least one symptom.');
      return;
    }

    const draft: AssessmentDraft = {
      rawDescription: freeformText,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : [freeformText.slice(0, 50)],
      duration,
      severity,
      location: location || 'General',
      onset,
      frequency,
      vitals: {
        temperature: temperature ? `${temperature}°` : undefined,
        heartRate: heartRate ? `${heartRate} bpm` : undefined,
        bloodPressure: bloodPressure ? `${bloodPressure} mmHg` : undefined,
      },
      context: {
        recentInjury,
        recentTravel,
        recentProcedure,
        pregnant: isPregnant,
      },
    };

    onProceedToFollowUp(draft);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Stepper Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Clinical Intake · Step {step} of 3</span>
          <span>{step === 1 ? 'Describe & Select' : step === 2 ? 'Duration & Onset' : 'Severity & Vitals'}</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Conversational & Searchable Symptom Input */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">
              What symptoms are you experiencing?
            </h1>
            <p className="text-sm text-slate-600">
              Describe your symptoms in your own words or choose from the catalog below.
            </p>
          </div>

          {/* Conversational Freeform Box */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Natural Language Description
            </label>
            <textarea
              rows={3}
              value={freeformText}
              onChange={(e) => setFreeformText(e.target.value)}
              placeholder="e.g. I have had a severe throbbing headache for two days, sensitive to bright light, and feeling slightly nauseous..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-slate-400"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>The AI will extract symptoms, duration, and anatomical location.</span>
              </span>

              <button
                type="button"
                disabled={extracting || !freeformText.trim()}
                onClick={handleAiExtract}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                {extracting ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Parse & Continue</span>
                  </>
                )}
              </button>
            </div>

            {extractError && (
              <p className="text-xs text-rose-600 font-medium">{extractError}</p>
            )}
          </div>

          {/* Selected Symptoms Chips */}
          {selectedSymptoms.length > 0 && (
            <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                <span>Selected Symptoms ({selectedSymptoms.length})</span>
                <button
                  onClick={() => setSelectedSymptoms([])}
                  className="text-teal-700 hover:underline text-xs"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-900 bg-white border border-teal-300 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    <span>{symptom}</span>
                    <X className="w-3.5 h-3.5 text-teal-600 hover:text-teal-900" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Searchable Database Catalog */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Search or Browse by Body System
              </label>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter symptoms..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Systems
              </button>
              {SYMPTOM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Symptoms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {filteredSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`flex items-center justify-between p-2.5 text-left text-xs rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-1">{symptom}</span>
                    <span className="shrink-0 text-slate-400">
                      {isSelected ? '✓' : '+'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              disabled={selectedSymptoms.length === 0 && !freeformText.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm"
            >
              <span>Next: Timeline & Onset</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Duration, Location & Onset */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">
              How long have you had these symptoms?
            </h1>
            <p className="text-sm text-slate-600">
              Timeline details are crucial to distinguishing acute emergencies from chronic conditions.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            {/* Duration Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Approximate Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {['< 3 hours', '12-24 hours', '2-3 days', '1-2 weeks', '> 1 month'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDuration(preset)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                      duration === preset
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Or specify custom duration e.g. 48 hours"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Onset Pattern */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Onset Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOnset('sudden')}
                    className={`p-3 text-xs rounded-xl border text-left transition-colors ${
                      onset === 'sudden'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Sudden onset</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Started abruptly in minutes</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnset('gradual')}
                    className={`p-3 text-xs rounded-xl border text-left transition-colors ${
                      onset === 'gradual'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Gradual onset</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Developed over days/weeks</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Frequency Pattern
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="constant">Constant (present non-stop)</option>
                  <option value="intermittent">Intermittent (comes and goes)</option>
                  <option value="worsening">Steadily worsening</option>
                  <option value="improving">Gradually improving</option>
                </select>
              </div>
            </div>

            {/* Anatomical Location */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Primary Body Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Forehead and temples, lower right abdomen, left shoulder"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-sm"
            >
              <span>Next: Severity & Context</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Severity, Vitals & Risk Context */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">
              Severity, Vitals & Clinical Context
            </h1>
            <p className="text-sm text-slate-600">
              Rate your symptom intensity and provide any relevant clinical history.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            {/* Severity Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Symptom Severity (1 to 10 Scale)
                </label>
                <span className="text-lg font-bold text-teal-700 tabular-nums">
                  {severity} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>1 Mild</span>
                <span>5 Moderate</span>
                <span>8 Severe</span>
                <span>10 Emergency</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                {getSeverityDescription(severity)}
              </p>
            </div>

            {/* Optional Vitals */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
                Measured Vitals (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Temperature (°F or °C)</span>
                  <input
                    type="text"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g. 100.4°F or 38°C"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Heart Rate (BPM)</span>
                  <input
                    type="text"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="e.g. 78 bpm"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Blood Pressure</span>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="e.g. 120/80"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Context Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
                Relevant Clinical Context
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
                  <input
                    type="checkbox"
                    checked={recentTravel}
                    onChange={(e) => setRecentTravel(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <span>Recent international or wilderness travel</span>
                </label>
                <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
                  <input
                    type="checkbox"
                    checked={recentInjury}
                    onChange={(e) => setRecentInjury(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <span>Recent trauma, fall, or physical injury</span>
                </label>
                <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
                  <input
                    type="checkbox"
                    checked={recentProcedure}
                    onChange={(e) => setRecentProcedure(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <span>Recent surgical or dental procedure</span>
                </label>
                {user.sex === 'Female' && (
                  <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
                    <input
                      type="checkbox"
                      checked={isPregnant}
                      onChange={(e) => setIsPregnant(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                    <span>Currently pregnant or postpartum (&lt;6 weeks)</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleProceed}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-sm"
            >
              <span>Continue to Adaptive Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
