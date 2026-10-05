export interface SymptomCategory {
  id: string;
  name: string;
  symptoms: string[];
}

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    id: 'general',
    name: 'General & Systemic',
    symptoms: [
      'Fever',
      'Chills',
      'Fatigue / Extreme tiredness',
      'Unexplained weight loss',
      'Night sweats',
      'Loss of appetite',
      'Body aches',
      'Malaise',
    ],
  },
  {
    id: 'head_neck',
    name: 'Head & Neck',
    symptoms: [
      'Headache (throbbing)',
      'Headache (tension/tight band)',
      'Severe sudden headache',
      'Stiff neck',
      'Dizziness / Vertigo',
      'Sore throat',
      'Swollen lymph nodes',
      'Sinus pressure',
      'Earache',
    ],
  },
  {
    id: 'chest_cardiac',
    name: 'Chest & Cardiovascular',
    symptoms: [
      'Chest pain or pressure',
      'Chest pain radiating to arm or jaw',
      'Heart palpitations (fluttering)',
      'Rapid heartbeat (tachycardia)',
      'Shortness of breath on exertion',
      'Chest tightness',
    ],
  },
  {
    id: 'respiratory',
    name: 'Respiratory & Lungs',
    symptoms: [
      'Persistent dry cough',
      'Productive cough (phlegm)',
      'Shortness of breath / Dyspnea',
      'Wheezing',
      'Stridor (high-pitched breathing)',
      'Runny nose / Congestion',
      'Loss of smell or taste',
    ],
  },
  {
    id: 'digestive',
    name: 'Abdominal & Digestive',
    symptoms: [
      'Nausea',
      'Vomiting',
      'Severe abdominal pain',
      'Bloating / Cramps',
      'Diarrhea',
      'Constipation',
      'Heartburn / Acid reflux',
      'Blood in stool or black stool',
    ],
  },
  {
    id: 'neurological',
    name: 'Neurological & Mental Health',
    symptoms: [
      'Confusion / Altered mental state',
      'Numbness or tingling in extremities',
      'Facial weakness or drooping',
      'Speech difficulty or slurring',
      'Tremors / Shaking',
      'Severe anxiety / Panic',
      'Depressed mood',
      'Sleep disturbance',
    ],
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal & Joints',
    symptoms: [
      'Joint pain / Arthritis',
      'Joint swelling or redness',
      'Lower back pain',
      'Muscle stiffness or spasm',
      'Neck pain',
      'Limited range of motion',
    ],
  },
  {
    id: 'skin',
    name: 'Skin & Allergies',
    symptoms: [
      'Hives / Urticaria',
      'Skin rash with itching',
      'Facial or lip swelling (angioedema)',
      'Petechiae or purpuric purple spots',
      'Unusual skin lesion or changing mole',
      'Jaundice (yellow skin/eyes)',
    ],
  },
];

export const ALL_SYMPTOMS = SYMPTOM_CATEGORIES.flatMap(c => c.symptoms);

export const EMERGENCY_NUMBERS_BY_COUNTRY: Record<string, { emergency: string; nonEmergency: string; countryName: string }> = {
  US: { emergency: '911', nonEmergency: '311 or 211', countryName: 'United States' },
  CA: { emergency: '911', nonEmergency: '811 (HealthLink)', countryName: 'Canada' },
  UK: { emergency: '999', nonEmergency: '111 (NHS non-emergency)', countryName: 'United Kingdom' },
  EU: { emergency: '112', nonEmergency: '116 117 (Medical on-call)', countryName: 'European Union' },
  AU: { emergency: '000', nonEmergency: '1800 022 222 (Healthdirect)', countryName: 'Australia' },
  NZ: { emergency: '111', nonEmergency: '0800 611 116 (Healthline)', countryName: 'New Zealand' },
  IN: { emergency: '112', nonEmergency: '1075 (National Health)', countryName: 'India' },
};
