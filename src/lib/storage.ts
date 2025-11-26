// Sistema de armazenamento local para o LongLife AI
import type { UserData, UserProfile, ExamResult, HealthScores, Recommendation, ChatMessage } from './types';

const STORAGE_KEY = 'longlife_user_data';

const defaultUserData: UserData = {
  profile: null,
  exams: [],
  healthScores: null,
  recommendations: [],
  chatHistory: [],
  chatMessagesUsed: 0,
};

// Carregar dados do usuário
export function loadUserData(): UserData {
  if (typeof window === 'undefined') return defaultUserData;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultUserData;
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return defaultUserData;
  }
}

// Salvar dados do usuário
export function saveUserData(data: UserData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

// Salvar perfil do usuário
export function saveUserProfile(profile: UserProfile): void {
  const data = loadUserData();
  data.profile = profile;
  saveUserData(data);
}

// Adicionar exame
export function addExam(exam: ExamResult): void {
  const data = loadUserData();
  data.exams.push(exam);
  saveUserData(data);
}

// Atualizar scores de saúde
export function updateHealthScores(scores: HealthScores): void {
  const data = loadUserData();
  data.healthScores = scores;
  saveUserData(data);
}

// Atualizar recomendações
export function updateRecommendations(recommendations: Recommendation[]): void {
  const data = loadUserData();
  data.recommendations = recommendations;
  saveUserData(data);
}

// Adicionar mensagem ao chat
export function addChatMessage(message: ChatMessage): void {
  const data = loadUserData();
  data.chatHistory.push(message);
  if (message.role === 'user') {
    data.chatMessagesUsed++;
  }
  saveUserData(data);
}

// Verificar se onboarding foi completado
export function isOnboardingCompleted(): boolean {
  const data = loadUserData();
  return data.profile?.onboardingCompleted ?? false;
}

// Verificar tier de assinatura
export function getSubscriptionTier(): 'free' | 'premium' {
  const data = loadUserData();
  return data.profile?.subscriptionTier ?? 'free';
}

// Verificar limite de chat (free tier)
export function canSendChatMessage(): boolean {
  const data = loadUserData();
  const tier = getSubscriptionTier();
  
  if (tier === 'premium') return true;
  
  return data.chatMessagesUsed < 10;
}

// Resetar dados (para desenvolvimento)
export function resetUserData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Calcular IMC
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

// Obter classificação do IMC
export function getBMIClassification(bmi: number): string {
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
}
