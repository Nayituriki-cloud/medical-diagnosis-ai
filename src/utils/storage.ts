import {
  UserProfile,
  AssessmentRecord,
  MedicalConditionItem,
  SurgeryItem,
  MedicationItem,
  AllergyItem,
  FamilyHistoryItem,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'medidiagnosis_user_profile',
  ASSESSMENTS: 'medidiagnosis_assessments',
  CONDITIONS: 'medidiagnosis_conditions',
  SURGERIES: 'medidiagnosis_surgeries',
  MEDICATIONS: 'medidiagnosis_medications',
  ALLERGIES: 'medidiagnosis_allergies',
  FAMILY_HISTORY: 'medidiagnosis_family_history',
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-default',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  age: 38,
  dob: '1988-06-15',
  sex: 'Female',
  country: 'US',
  isPregnant: false,
  emergencyContact: {
    name: 'David Morgan',
    relationship: 'Spouse',
    phone: '+1 (555) 234-5678',
  },
};

const INITIAL_CONDITIONS: MedicalConditionItem[] = [
  { id: 'c1', name: 'Mild Intermittent Asthma', diagnosedYear: '2016', status: 'Active', notes: 'Managed with rescue inhaler PRN' },
  { id: 'c2', name: 'Seasonal Allergic Rhinitis', diagnosedYear: '2012', status: 'Active', notes: 'Spring tree pollen flare-ups' },
];

const INITIAL_MEDICATIONS: MedicationItem[] = [
  { id: 'm1', name: 'Albuterol HFA Inhaler', dosage: '90 mcg/actuation', frequency: '2 puffs as needed for wheeze', prescribedFor: 'Asthma' },
  { id: 'm2', name: 'Cetirizine (Zyrtec)', dosage: '10 mg', frequency: 'Once daily as needed', prescribedFor: 'Allergies' },
];

const INITIAL_ALLERGIES: AllergyItem[] = [
  { id: 'a1', allergen: 'Penicillin', reactionType: 'Moderate', symptoms: 'Urticaria (hives) and mild pruritus' },
];

const INITIAL_ASSESSMENTS: AssessmentRecord[] = [
  {
    id: 'ASMT-PREV-01',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    symptoms: ['Sore throat', 'Mild fever', 'Nasal congestion'],
    rawDescription: 'Woke up with scratchy sore throat, low fever around 99.8F and stuffy nose for 2 days.',
    duration: '2 days',
    severity: 4,
    location: 'Throat & Sinuses',
    onset: 'gradual',
    frequency: 'constant',
    vitals: {
      temperature: '99.8°F (37.7°C)',
      heartRate: '78 bpm',
      bloodPressure: '118/76 mmHg',
    },
    followupAnswers: [
      { question: 'Difficulty swallowing saliva or opening mouth?', answer: 'No, can swallow liquids and food normally' },
      { question: 'Presence of white patches on tonsils?', answer: 'Throat looks red, no obvious white spots' },
    ],
    isEmergency: false,
    assessment: {
      summary: 'Patient reports 2-day history of scratchy sore throat accompanied by low-grade fever and mild nasal congestion without airway compromise or swallowing difficulty.',
      urgency: 'yellow',
      urgency_reason: 'Symptoms are consistent with a benign upper respiratory tract viral infection, but medical evaluation is recommended if fever persists beyond 3-5 days or if severe throat pain worsens.',
      possible_conditions: [
        {
          condition_name: 'Viral Pharyngitis / Upper Respiratory Tract Infection',
          confidence_level: 'More consistent with',
          why_it_fits: 'Concurrent rhinorrhea, low fever, and gradual onset strongly align with common respiratory viral etiology.',
          clinical_summary: 'Self-limiting inflammation of the pharynx often caused by rhinovirus, adenovirus, or coronavirus.',
          tests_doctor_might_order: ['Rapid Strep test', 'Throat culture if strep suspected', 'Viral panel if immunocompromised'],
        },
        {
          condition_name: 'Acute Streptococcal Pharyngitis (Strep Throat)',
          confidence_level: 'Could be related to',
          why_it_fits: 'Sore throat with fever can be bacterial, though absence of tonsillar exudates and presence of cough/coryza reduces likelihood.',
          clinical_summary: 'Bacterial infection caused by Group A Streptococcus requiring antibiotic therapy if confirmed.',
          tests_doctor_might_order: ['Rapid antigen detection test (RADT)', 'Throat culture'],
        },
      ],
      red_flags: [
        'Inability to swallow fluids or own saliva (drooling)',
        'Difficulty breathing or audible stridor',
        'Inability to open mouth widely (trismus)',
        'Asymmetric swelling of one tonsil or uvular deviation',
      ],
      recommended_next_step: 'Schedule a routine consultation with your primary care provider or visit a local walk-in clinic for a rapid throat swab if symptoms worsen or fever rises above 101°F.',
      self_care_information: [
        'Warm salt-water gargles 3-4 times daily for throat comfort',
        'Maintain abundant oral hydration with warm broths, herbal teas, or cool liquids',
        'Use honey or soothing throat lozenges for irritation',
        'Get plenty of rest and avoid smoke exposure',
      ],
      doctor_questions: [
        'Do my symptoms warrant a rapid strep or COVID-19 swab?',
        'At what point should I seek further evaluation if the throat pain does not resolve?',
        'Are there specific over-the-counter pain relievers best suited for my medical history?',
      ],
      disclaimer: 'MediDiagnosis AI is an educational clinical support tool and does not provide definitive medical diagnoses. Seek qualified medical advice.',
    },
    clinicianReview: {
      reviewedBy: 'Dr. Sarah Lin, MD (Internal Medicine)',
      reviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      clinicalNotes: 'Reviewed patient summary. Presentation strongly suggests viral URI. Recommended supportive care, hydration, and return precautions for high fever or dysphagia.',
      recommendedAction: 'Self-Care Monitoring',
      status: 'reviewed',
    },
  },
];

export const Storage = {
  getUserProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  setUserProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  },

  getAssessments: (): AssessmentRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return data ? JSON.parse(data) : INITIAL_ASSESSMENTS;
    } catch {
      return INITIAL_ASSESSMENTS;
    }
  },

  saveAssessment: (record: AssessmentRecord): void => {
    try {
      const existing = Storage.getAssessments();
      const updated = [record, ...existing.filter(a => a.id !== record.id)];
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  updateAssessmentReview: (assessmentId: string, review: any): void => {
    try {
      const existing = Storage.getAssessments();
      const updated = existing.map(item => {
        if (item.id === assessmentId) {
          return { ...item, clinicianReview: review };
        }
        return item;
      });
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  getConditions: (): MedicalConditionItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONDITIONS);
      return data ? JSON.parse(data) : INITIAL_CONDITIONS;
    } catch {
      return INITIAL_CONDITIONS;
    }
  },

  saveConditions: (conditions: MedicalConditionItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.CONDITIONS, JSON.stringify(conditions));
  },

  getMedications: (): MedicationItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      return data ? JSON.parse(data) : INITIAL_MEDICATIONS;
    } catch {
      return INITIAL_MEDICATIONS;
    }
  },

  saveMedications: (meds: MedicationItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
  },

  getAllergies: (): AllergyItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALLERGIES);
      return data ? JSON.parse(data) : INITIAL_ALLERGIES;
    } catch {
      return INITIAL_ALLERGIES;
    }
  },

  saveAllergies: (allergies: AllergyItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.ALLERGIES, JSON.stringify(allergies));
  },

  clearAllData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
    localStorage.removeItem(STORAGE_KEYS.CONDITIONS);
    localStorage.removeItem(STORAGE_KEYS.SURGERIES);
    localStorage.removeItem(STORAGE_KEYS.MEDICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ALLERGIES);
    localStorage.removeItem(STORAGE_KEYS.FAMILY_HISTORY);
  },

  exportAllDataJson: (): string => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: Storage.getUserProfile(),
      assessments: Storage.getAssessments(),
      conditions: Storage.getConditions(),
      medications: Storage.getMedications(),
      allergies: Storage.getAllergies(),
    };
    return JSON.stringify(payload, null, 2);
  },
};
