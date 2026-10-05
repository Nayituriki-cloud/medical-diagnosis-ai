import React, { useState } from 'react';
import {
  HeartPulse,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  Scissors,
  Users,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { MedicalConditionItem, SurgeryItem, FamilyHistoryItem } from '../types';
import { Storage } from '../utils/storage';

export const MedicalHistoryPage: React.FC = () => {
  const [conditions, setConditions] = useState<MedicalConditionItem[]>(Storage.getConditions());
  const [activeTab, setActiveTab] = useState<'conditions' | 'surgeries' | 'family'>('conditions');

  // New condition state
  const [newCondName, setNewCondName] = useState('');
  const [newCondYear, setNewCondYear] = useState('');
  const [newCondStatus, setNewCondStatus] = useState<'Active' | 'Resolved' | 'In Remission'>('Active');
  const [newCondNotes, setNewCondNotes] = useState('');

  // Sample Surgeries state
  const [surgeries, setSurgeries] = useState<SurgeryItem[]>([
    { id: 's1', procedureName: 'Laparoscopic Appendectomy', year: '2019', hospitalOrSurgeon: 'St. Mary General' },
  ]);
  const [newSurgName, setNewSurgName] = useState('');
  const [newSurgYear, setNewSurgYear] = useState('');

  // Sample Family History state
  const [familyItems, setFamilyItems] = useState<FamilyHistoryItem[]>([
    { id: 'f1', relation: 'Mother', condition: 'Type 2 Diabetes Mellitus (Onset age 54)' },
    { id: 'f2', relation: 'Father', condition: 'Hypertension, Coronary Artery Disease' },
  ]);
  const [newFamilyRel, setNewFamilyRel] = useState('');
  const [newFamilyCond, setNewFamilyCond] = useState('');

  const handleAddCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondName.trim()) return;

    const newItem: MedicalConditionItem = {
      id: `c-${Date.now()}`,
      name: newCondName.trim(),
      diagnosedYear: newCondYear.trim() || undefined,
      status: newCondStatus,
      notes: newCondNotes.trim() || undefined,
    };

    const updated = [newItem, ...conditions];
    setConditions(updated);
    Storage.saveConditions(updated);
    setNewCondName('');
    setNewCondYear('');
    setNewCondNotes('');
  };

  const handleDeleteCondition = (id: string) => {
    const updated = conditions.filter((c) => c.id !== id);
    setConditions(updated);
    Storage.saveConditions(updated);
  };

  const handleAddSurgery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSurgName.trim()) return;
    const newItem: SurgeryItem = {
      id: `s-${Date.now()}`,
      procedureName: newSurgName.trim(),
      year: newSurgYear.trim() || new Date().getFullYear().toString(),
    };
    setSurgeries([newItem, ...surgeries]);
    setNewSurgName('');
    setNewSurgYear('');
  };

  const handleDeleteSurgery = (id: string) => {
    setSurgeries(surgeries.filter((s) => s.id !== id));
  };

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyRel.trim() || !newFamilyCond.trim()) return;
    const newItem: FamilyHistoryItem = {
      id: `f-${Date.now()}`,
      relation: newFamilyRel.trim(),
      condition: newFamilyCond.trim(),
    };
    setFamilyItems([newItem, ...familyItems]);
    setNewFamilyRel('');
    setNewFamilyCond('');
  };

  const handleDeleteFamily = (id: string) => {
    setFamilyItems(familyItems.filter((f) => f.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Personal Health Record
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Medical History & Family Background
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Stored locally on your device. These background details are factored into AI triage decisions to detect relevant risk factors.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('conditions')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'conditions'
              ? 'border-teal-600 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Conditions ({conditions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('surgeries')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'surgeries'
              ? 'border-teal-600 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Surgeries & Procedures ({surgeries.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('family')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'family'
              ? 'border-teal-600 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Family History ({familyItems.length})</span>
        </button>
      </div>

      {/* Tab 1: Conditions */}
      {activeTab === 'conditions' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddCondition}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Add Medical Condition
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Condition / Diagnosis Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hypertension, Hypothyroidism, Type 2 Diabetes"
                  value={newCondName}
                  onChange={(e) => setNewCondName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Year Diagnosed
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2018"
                  value={newCondYear}
                  onChange={(e) => setNewCondYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Clinical Status
                </label>
                <select
                  value={newCondStatus}
                  onChange={(e) => setNewCondStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Active">Active / Ongoing</option>
                  <option value="Resolved">Resolved / Cured</option>
                  <option value="In Remission">In Remission</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Clinical Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Managed with diet and exercise"
                  value={newCondNotes}
                  onChange={(e) => setNewCondNotes(e.target.value)}
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
                <span>Save Condition</span>
              </button>
            </div>
          </form>

          {/* List */}
          <div className="space-y-3">
            {conditions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No conditions logged yet.</p>
            ) : (
              conditions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {item.status}
                      </span>
                      {item.diagnosedYear && (
                        <span className="text-xs text-slate-400">Diag: {item.diagnosedYear}</span>
                      )}
                    </div>
                    {item.notes && <p className="text-xs text-slate-500 mt-1">{item.notes}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteCondition(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Surgeries */}
      {activeTab === 'surgeries' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddSurgery}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Add Past Surgical Procedure
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Procedure Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cholecystectomy (Gallbladder removal), Knee Arthroscopy"
                  value={newSurgName}
                  onChange={(e) => setNewSurgName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2021"
                  value={newSurgYear}
                  onChange={(e) => setNewSurgYear(e.target.value)}
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
                <span>Save Surgery</span>
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {surgeries.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{s.procedureName}</h4>
                  <span className="text-xs text-slate-400">Year: {s.year}</span>
                </div>
                <button
                  onClick={() => handleDeleteSurgery(s.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Family History */}
      {activeTab === 'family' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddFamily}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Add Hereditary / Family Risk
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Relation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mother, Father, Sibling"
                  value={newFamilyRel}
                  onChange={(e) => setNewFamilyRel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Health Condition
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Early-onset myocardial infarction, Breast cancer, Glaucoma"
                  value={newFamilyCond}
                  onChange={(e) => setNewFamilyCond(e.target.value)}
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
                <span>Save Family Record</span>
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {familyItems.map((f) => (
              <div
                key={f.id}
                className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{f.relation}</h4>
                  <p className="text-xs text-slate-600">{f.condition}</p>
                </div>
                <button
                  onClick={() => handleDeleteFamily(f.id)}
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
