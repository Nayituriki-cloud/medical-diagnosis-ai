export type UrgencyLevel = 'green' | 'yellow' | 'orange' | 'red';

export type ConfidenceLevel = 'More consistent with' | 'Could be related to' | 'Less consistent with' | 'Needs medical evaluation';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  dob?: string;
  sex: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  country: string;
  isPregnant?: boolean;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface PossibleCondition {
  condition_name: string;
  confidence_level: ConfidenceLevel;
  why_it_fits: string;
  clinical_summary: string;
  tests_doctor_might_order: string[];
}

export interface AssessmentData {
  summary: string;
  urgency: UrgencyLevel;
  urgency_reason: string;
  possible_conditions: PossibleCondition[];
  alternative_possibilities?: string[];
  red_flags: string[];
  recommended_next_step: string;
  self_care_information: string[];
  doctor_questions: string[];
  disclaimer: string;
}

export interface AssessmentRecord {
  id: string;
  createdAt: string;
  symptoms: string[];
  rawDescription: string;
  duration: string;
  severity: number;
  location?: string;
  onset?: string;
  frequency?: string;
  vitals?: {
    temperature?: string;
    heartRate?: string;
    bloodPressure?: string;
  };
  followupAnswers: Array<{ question: string; answer: string }>;
  assessment: AssessmentData;
  isEmergency: boolean;
  clinicianReview?: ClinicianReview;
}

export interface ClinicianReview {
  reviewedBy: string;
  reviewedAt: string;
  clinicalNotes: string;
  recommendedAction: 'Emergency Department' | 'Same-day Urgent Care' | 'Routine Primary Care' | 'Specialist Referral' | 'Self-Care Monitoring';
  prescriptionsDiscussed?: string;
  status: 'reviewed' | 'pending';
}

export interface MedicalConditionItem {
  id: string;
  name: string;
  diagnosedYear?: string;
  status: 'Active' | 'Resolved' | 'In Remission';
  notes?: string;
}

export interface SurgeryItem {
  id: string;
  procedureName: string;
  year: string;
  hospitalOrSurgeon?: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedFor?: string;
  startDate?: string;
}

export interface AllergyItem {
  id: string;
  allergen: string;
  reactionType: 'Mild' | 'Moderate' | 'Severe / Anaphylaxis';
  symptoms: string;
}

export interface FamilyHistoryItem {
  id: string;
  relation: string;
  condition: string;
}

export interface MedicationLookupResult {
  medication_name: string;
  drug_class: string;
  general_purpose: string;
  common_precautions: string[];
  common_side_effects: string[];
  important_warning_signs: string[];
  patient_counseling_reminder: string;
}
