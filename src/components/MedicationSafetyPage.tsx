import React, { useState } from 'react';
import {
  Pill,
  Search,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Plus,
  Trash2,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { MedicationItem, AllergyItem, MedicationLookupResult } from '../types';
import { Storage } from '../utils/storage';

export const MedicationSafetyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'safety_lookup' | 'my_meds' | 'allergies'>('safety_lookup');

  // Search Lookup State
  const [lookupQuery, setLookupQuery] = useState('');
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [lookupResult, setLookupResult] = useState<MedicationLookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // My Meds state
  const [meds, setMeds] = useState<MedicationItem[]>(Storage.getMedications());
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  const [newMedPurpose, setNewMedPurpose] = useState('');

  // Allergies state
  const [allergies, setAllergies] = useState<AllergyItem[]>(Storage.getAllergies());
  const [newAllergen, setNewAllergen] = useState('');
  const [newReaction, setNewReaction] = useState<'Mild' | 'Moderate' | 'Severe / Anaphylaxis'>('Moderate');
  const [newSymptoms, setNewSymptoms] = useState('');

  const handleLookup = async (e?: React.FormEvent, customName?: string) => {
    if (e) e.preventDefault();
    const query = customName || lookupQuery;
    if (!query.trim()) return;

    setLoadingLookup(true);
    setLookupError(null);

    try {
      const res = await fetch('/api/medication/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicationName: query.trim() }),
      });

      if (!res.ok) throw new Error('Medication not found');
      const data = await res.json();
      setLookupResult(data);
    } catch (err) {
      console.error(err);
      setLookupError('Could not retrieve medication profile. Please check the spelling or verify with your pharmacist.');
    } finally {
      setLoadingLookup(false);
    }
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    const newItem: MedicationItem = {
      id: `m-${Date.now()}`,
      name: newMedName.trim(),
      dosage: newMedDose.trim() || 'Unspecified dose',
      frequency: newMedFreq.trim() || 'As directed',
      prescribedFor: newMedPurpose.trim() || undefined,
    };

    const updated = [newItem, ...meds];
    setMeds(updated);
    Storage.saveMedications(updated);
    setNewMedName('');
    setNewMedDose('');
    setNewMedFreq('');
    setNewMedPurpose('');
  };

  const handleDeleteMed = (id: string) => {
    const updated = meds.filter((m) => m.id !== id);
    setMeds(updated);
    Storage.saveMedications(updated);
  };

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergen.trim()) return;

    const newItem: AllergyItem = {
      id: `a-${Date.now()}`,
      allergen: newAllergen.trim(),
      reactionType: newReaction,
      symptoms: newSymptoms.trim() || 'Allergic reaction',
    };

    const updated = [newItem, ...allergies];
    setAllergies(updated);
    Storage.saveAllergies(updated);
    setNewAllergen('');
    setNewSymptoms('');
  };

  const handleDeleteAllergy = (id: string) => {
    const updated = allergies.filter((a) => a.id !== id);
    setAllergies(updated);
    Storage.saveAllergies(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Pharmacotherapy Decision Support
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Medication Safety & Allergies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Educational drug safety reference and personal allergy profile. Never adjust a prescribed dose without medical supervision.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('safety_lookup')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'safety_lookup'
              ? 'border-teal-600 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Drug Safety Checker</span>
        </button>
        <button
          onClick={() => setActiveTab('my_meds')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'my_meds'
              ? 'border-teal-600 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>My Active Medications ({meds.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('allergies')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'allergies'
              ? 'border-teal-600 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Allergies ({allergies.length})</span>
        </button>
      </div>

      {/* TAB 1: Safety Lookup */}
      {activeTab === 'safety_lookup' && (
        <div className="space-y-6">
          <form
            onSubmit={(e) => handleLookup(e)}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Look Up Medication Safety Profile
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Metformin, Lisinopril, Amoxicillin, Sertraline, Ibuprofen..."
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loadingLookup || !lookupQuery.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm whitespace-nowrap"
              >
                {loadingLookup ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <span>Check Safety Profile</span>
                )}
              </button>
            </div>

            {/* Quick preset chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs text-slate-500">
              <span>Popular references:</span>
              {['Metformin', 'Lisinopril', 'Amoxicillin', 'Atorvastatin', 'Ibuprofen'].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setLookupQuery(name);
                    handleLookup(undefined, name);
                  }}
                  className="text-teal-700 hover:underline font-medium"
                >
                  {name}
                </button>
              ))}
            </div>
          </form>

          {lookupError && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              {lookupError}
            </div>
          )}

          {/* Results Display */}
          {lookupResult && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs uppercase font-mono text-teal-700 font-bold">
                    {lookupResult.drug_class}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {lookupResult.medication_name}
                  </h2>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600 text-xs flex items-center gap-1.5 border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Educational Profile Only</span>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
                  General Clinical Purpose
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {lookupResult.general_purpose}
                </p>
              </div>

              {/* Grid: Precautions & Side Effects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Common Clinical Precautions
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {lookupResult.common_precautions.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Known Common Side Effects
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {lookupResult.common_side_effects.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Important Warning Signs */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Critical Warning Signs (Seek Urgent Medical Evaluation)</span>
                </div>
                <ul className="text-xs text-rose-950 font-medium space-y-1 list-disc list-inside">
                  {lookupResult.important_warning_signs.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>

              {/* Strict Patient Reminder */}
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-start gap-3">
                <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Patient Counseling Reminder:</strong> {lookupResult.patient_counseling_reminder} Never stop, start, or alter your prescribed dose without direct consultation with your prescribing physician or pharmacist.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: My Medications */}
      {activeTab === 'my_meds' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddMed}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Add Prescription or Supplement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Albuterol HFA, Lisinopril"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Dosage / Strength
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10 mg, 90 mcg"
                  value={newMedDose}
                  onChange={(e) => setNewMedDose(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Frequency / Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Once daily in morning with food"
                  value={newMedFreq}
                  onChange={(e) => setNewMedFreq(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Prescribed For (Condition)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Blood pressure control"
                  value={newMedPurpose}
                  onChange={(e) => setNewMedPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Profile</span>
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {meds.map((m) => (
              <div
                key={m.id}
                className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {m.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Frequency: {m.frequency} {m.prescribedFor && `· For: ${m.prescribedFor}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setLookupQuery(m.name);
                      setActiveTab('safety_lookup');
                      handleLookup(undefined, m.name);
                    }}
                    className="text-xs font-semibold text-teal-700 hover:underline px-2 py-1"
                  >
                    Check Safety
                  </button>
                  <button
                    onClick={() => handleDeleteMed(m.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Allergies */}
      {activeTab === 'allergies' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddAllergy}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Record Drug, Food, or Environmental Allergy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Allergen / Substance
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Penicillin, Sulfa drugs, Peanuts, Latex"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Reaction Severity
                </label>
                <select
                  value={newReaction}
                  onChange={(e) => setNewReaction(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Mild">Mild (Mild rash, sneezing, localized itch)</option>
                  <option value="Moderate">Moderate (Widespread hives, swelling)</option>
                  <option value="Severe / Anaphylaxis">Severe / Anaphylaxis (Airway constriction, shock)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Typical Reaction Symptoms
              </label>
              <input
                type="text"
                placeholder="e.g. Facial hives, shortness of breath, lip swelling"
                value={newSymptoms}
                onChange={(e) => setNewSymptoms(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Allergy</span>
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {allergies.map((a) => (
              <div
                key={a.id}
                className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{a.allergen}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        a.reactionType === 'Severe / Anaphylaxis'
                          ? 'bg-rose-100 text-rose-800'
                          : a.reactionType === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {a.reactionType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Symptoms: {a.symptoms}</p>
                </div>
                <button
                  onClick={() => handleDeleteAllergy(a.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
