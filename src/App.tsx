/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, AssessmentRecord, AssessmentData } from './types';
import { Storage } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SymptomAssessment, AssessmentDraft } from './components/SymptomAssessment';
import { FollowUpQuestions } from './components/FollowUpQuestions';
import { AssessmentResults } from './components/AssessmentResults';
import { DoctorReport } from './components/DoctorReport';
import { ClinicMode } from './components/ClinicMode';
import { AssessmentHistoryPage } from './components/AssessmentHistoryPage';
import { MedicationSafetyPage } from './components/MedicationSafetyPage';
import { MedicalHistoryPage } from './components/MedicalHistoryPage';
import { AiChatAssistant } from './components/AiChatAssistant';
import { PrivacySettingsPage } from './components/PrivacySettingsPage';
import { AboutDisclaimerPage } from './components/AboutDisclaimerPage';
import { AdminDashboard } from './components/AdminDashboard';
import { EmergencyModal } from './components/EmergencyModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [user, setUser] = useState<UserProfile>(Storage.getUserProfile());
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(Storage.getAssessments());
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Intake workflow state
  const [activeDraft, setActiveDraft] = useState<AssessmentDraft | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(assessments[0] || null);

  // Modals
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencyRedFlags, setEmergencyRedFlags] = useState<string[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync assessments list from storage when updated
  const refreshAssessments = () => {
    setAssessments(Storage.getAssessments());
  };

  const handleStartAssessment = () => {
    setActiveDraft(null);
    setCurrentTab('assess');
  };

  const handleProceedToFollowUp = (draft: AssessmentDraft) => {
    setActiveDraft(draft);
    setCurrentTab('followup');
  };

  const handleAssessmentCompleted = (result: {
    assessment_id: string;
    created_at: string;
    is_emergency: boolean;
    data: AssessmentData;
    answers: Array<{ question: string; answer: string }>;
  }) => {
    if (!activeDraft) return;

    const newRecord: AssessmentRecord = {
      id: result.assessment_id,
      createdAt: result.created_at,
      symptoms: activeDraft.symptoms,
      rawDescription: activeDraft.rawDescription,
      duration: activeDraft.duration,
      severity: activeDraft.severity,
      location: activeDraft.location,
      onset: activeDraft.onset,
      frequency: activeDraft.frequency,
      vitals: activeDraft.vitals,
      followupAnswers: result.answers,
      assessment: result.data,
      isEmergency: result.is_emergency,
    };

    Storage.saveAssessment(newRecord);
    refreshAssessments();
    setSelectedRecord(newRecord);
    setCurrentTab('results');
  };

  const handleEmergencyDetected = (redFlags: string[]) => {
    setEmergencyRedFlags(redFlags);
    setEmergencyModalOpen(true);
  };

  const handleViewAssessment = (record: AssessmentRecord) => {
    setSelectedRecord(record);
    setCurrentTab('results');
  };

  const handleCreateReport = () => {
    setCurrentTab('report');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract (3-Zone) */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenEmergency={() => {
          setEmergencyRedFlags(['User-initiated emergency guidance request']);
          setEmergencyModalOpen(true);
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onStartAssessment={handleStartAssessment}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenEmergency={() => {
              setEmergencyRedFlags(['Emergency 911 Direct Contact Requested']);
              setEmergencyModalOpen(true);
            }}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            user={user}
            assessments={assessments}
            onStartAssessment={handleStartAssessment}
            onViewAssessment={handleViewAssessment}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenEmergency={() => {
              setEmergencyRedFlags(['Emergency Guidance Requested']);
              setEmergencyModalOpen(true);
            }}
          />
        )}

        {currentTab === 'assess' && (
          <SymptomAssessment
            user={user}
            onProceedToFollowUp={handleProceedToFollowUp}
            onEmergencyDetected={handleEmergencyDetected}
          />
        )}

        {currentTab === 'followup' && activeDraft && (
          <FollowUpQuestions
            draft={activeDraft}
            user={user}
            onAssessmentCompleted={handleAssessmentCompleted}
            onEmergencyDetected={handleEmergencyDetected}
            onBack={() => setCurrentTab('assess')}
          />
        )}

        {currentTab === 'results' && selectedRecord && (
          <AssessmentResults
            record={selectedRecord}
            onCreateReport={handleCreateReport}
            onOpenEmergency={() => {
              setEmergencyRedFlags(selectedRecord.assessment.red_flags);
              setEmergencyModalOpen(true);
            }}
            onStartNew={handleStartAssessment}
          />
        )}

        {currentTab === 'report' && selectedRecord && (
          <DoctorReport
            record={selectedRecord}
            user={user}
            onBack={() => setCurrentTab('results')}
            onNavigateToClinic={() => setCurrentTab('clinic')}
          />
        )}

        {currentTab === 'reports' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Doctor-Ready Documentation
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">Clinical Reports</h1>
              </div>
              <button
                onClick={handleStartAssessment}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800"
              >
                + New Assessment
              </button>
            </div>
            {assessments.length > 0 ? (
              <DoctorReport
                record={selectedRecord || assessments[0]}
                user={user}
                onBack={() => setCurrentTab('dashboard')}
                onNavigateToClinic={() => setCurrentTab('clinic')}
              />
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-sm font-semibold text-slate-700">No clinical reports available yet.</p>
                <p className="text-xs text-slate-400 mt-1">Complete a symptom assessment to generate a doctor-ready report.</p>
              </div>
            )}
          </div>
        )}

        {currentTab === 'history' && (
          <AssessmentHistoryPage
            assessments={assessments}
            onSelectAssessment={handleViewAssessment}
            onStartNew={handleStartAssessment}
          />
        )}

        {currentTab === 'medications' && <MedicationSafetyPage />}

        {currentTab === 'medical_history' && <MedicalHistoryPage />}

        {currentTab === 'clinic' && (
          <ClinicMode
            assessments={assessments}
            onSelectAssessment={(rec) => {
              setSelectedRecord(rec);
              setCurrentTab('report');
            }}
            onAssessmentUpdated={refreshAssessments}
          />
        )}

        {currentTab === 'chat' && (
          <AiChatAssistant
            user={user}
            latestAssessment={selectedRecord || undefined}
            onOpenEmergency={() => {
              setEmergencyRedFlags(['Potential acute emergency identified in educational chat']);
              setEmergencyModalOpen(true);
            }}
          />
        )}

        {currentTab === 'admin' && <AdminDashboard />}

        {currentTab === 'privacy' && (
          <PrivacySettingsPage
            onDataWiped={() => {
              refreshAssessments();
              setSelectedRecord(null);
            }}
          />
        )}

        {currentTab === 'disclaimer' && <AboutDisclaimerPage />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenEmergency={() => {
          setEmergencyRedFlags(['Emergency Services Guidance']);
          setEmergencyModalOpen(true);
        }}
      />

      {/* Emergency Modal Screen */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        redFlags={emergencyRedFlags}
        initialCountry={user.country}
      />

      {/* Auth / Profile Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={user}
        onSaveProfile={(updated) => setUser(updated)}
      />
    </div>
  );
}
