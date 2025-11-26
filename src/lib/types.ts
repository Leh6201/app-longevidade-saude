// Types para o LongLife AI

export type Sex = 'male' | 'female';

export type Goal = 
  | 'lose_weight'
  | 'improve_energy'
  | 'improve_sleep'
  | 'reduce_cholesterol'
  | 'reduce_glucose'
  | 'increase_longevity';

export type ExerciseFrequency = '0' | '1-2' | '3-4' | '5+';
export type SleepQuality = 'poor' | 'medium' | 'good';
export type AlcoholConsumption = 'none' | 'low' | 'moderate' | 'high';

export type SubscriptionTier = 'free' | 'premium';

export type RiskLevel = 'low' | 'moderate' | 'high';
export type InflammationLevel = 'low' | 'medium' | 'high';

export interface UserProfile {
  // Dados pessoais
  age: number;
  sex: Sex;
  weight: number; // kg
  height: number; // cm
  goal: Goal;
  
  // Estilo de vida
  exerciseFrequency: ExerciseFrequency;
  sleepQuality: SleepQuality;
  alcoholConsumption: AlcoholConsumption;
  
  // Sistema
  onboardingCompleted: boolean;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  lastUpdated: string;
}

export interface Biomarker {
  name: string;
  value: number | null;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'borderline' | 'abnormal' | 'unavailable';
}

export interface ExamResult {
  id: string;
  uploadedAt: string;
  biomarkers: {
    cholesterolTotal?: Biomarker;
    hdl?: Biomarker;
    ldl?: Biomarker;
    triglycerides?: Biomarker;
    glucose?: Biomarker;
    hemoglobin?: Biomarker;
    creatinine?: Biomarker;
    tgo?: Biomarker;
    tgp?: Biomarker;
    ggt?: Biomarker;
    vitaminD?: Biomarker;
    tsh?: Biomarker;
    crp?: Biomarker; // Proteína C Reativa
  };
}

export interface HealthScores {
  biologicalAge: number;
  metabolicRisk: RiskLevel;
  inflammationLevel: InflammationLevel;
  calculatedAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserData {
  profile: UserProfile | null;
  exams: ExamResult[];
  healthScores: HealthScores | null;
  recommendations: Recommendation[];
  chatHistory: ChatMessage[];
  chatMessagesUsed: number; // Para limite free tier
}
