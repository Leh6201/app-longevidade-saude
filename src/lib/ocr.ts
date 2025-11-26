// Sistema de OCR e extração de biomarcadores
import type { Biomarker } from './types';

// Gerar ID único para exame
export function generateExamId(): string {
  return `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Extrair biomarcadores do texto do exame
export function extractBiomarkersFromText(text: string): {
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
  crp?: Biomarker;
} {
  const biomarkers: any = {};

  // Normalizar texto
  const normalizedText = text.toUpperCase();

  // Padrões de extração (regex)
  const patterns = {
    cholesterolTotal: /COLESTEROL\s+TOTAL[:\s]+(\d+(?:\.\d+)?)/i,
    hdl: /HDL[:\s]+(\d+(?:\.\d+)?)/i,
    ldl: /LDL[:\s]+(\d+(?:\.\d+)?)/i,
    triglycerides: /TRIGLIC[EÉ]RIDES?[:\s]+(\d+(?:\.\d+)?)/i,
    glucose: /GLICEMIA[:\s]+(\d+(?:\.\d+)?)/i,
    hemoglobin: /HEMOGLOBINA[:\s]+(\d+(?:\.\d+)?)/i,
    creatinine: /CREATININA[:\s]+(\d+(?:\.\d+)?)/i,
    tgo: /TGO[:\s]+(\d+(?:\.\d+)?)/i,
    tgp: /TGP[:\s]+(\d+(?:\.\d+)?)/i,
    ggt: /GGT[:\s]+(\d+(?:\.\d+)?)/i,
    vitaminD: /VITAMINA\s+D[:\s]+(\d+(?:\.\d+)?)/i,
    tsh: /TSH[:\s]+(\d+(?:\.\d+)?)/i,
    crp: /PCR[:\s]+(\d+(?:\.\d+)?)/i,
  };

  // Extrair cada biomarcador
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = normalizedText.match(pattern);
    if (match && match[1]) {
      const value = parseFloat(match[1]);
      biomarkers[key] = createBiomarker(key, value);
    }
  }

  return biomarkers;
}

// Criar objeto Biomarker com valores de referência
function createBiomarker(type: string, value: number): Biomarker {
  const references: Record<string, { unit: string; range: string; normal: [number, number] }> = {
    cholesterolTotal: { unit: 'mg/dL', range: '<200', normal: [0, 200] },
    hdl: { unit: 'mg/dL', range: '>40', normal: [40, 999] },
    ldl: { unit: 'mg/dL', range: '<130', normal: [0, 130] },
    triglycerides: { unit: 'mg/dL', range: '<150', normal: [0, 150] },
    glucose: { unit: 'mg/dL', range: '70-100', normal: [70, 100] },
    hemoglobin: { unit: 'g/dL', range: '12-16', normal: [12, 16] },
    creatinine: { unit: 'mg/dL', range: '0.6-1.2', normal: [0.6, 1.2] },
    tgo: { unit: 'U/L', range: '<40', normal: [0, 40] },
    tgp: { unit: 'U/L', range: '<40', normal: [0, 40] },
    ggt: { unit: 'U/L', range: '<55', normal: [0, 55] },
    vitaminD: { unit: 'ng/mL', range: '30-100', normal: [30, 100] },
    tsh: { unit: 'mUI/L', range: '0.4-4.0', normal: [0.4, 4.0] },
    crp: { unit: 'mg/L', range: '<3.0', normal: [0, 3.0] },
  };

  const ref = references[type];
  if (!ref) {
    return {
      name: type,
      value,
      unit: '',
      referenceRange: '',
      status: 'unavailable',
    };
  }

  // Determinar status
  let status: 'normal' | 'borderline' | 'abnormal' = 'normal';
  const [min, max] = ref.normal;

  if (value < min || value > max) {
    // Verificar se está borderline (10% fora do range)
    const tolerance = (max - min) * 0.1;
    if (value >= min - tolerance && value <= max + tolerance) {
      status = 'borderline';
    } else {
      status = 'abnormal';
    }
  }

  return {
    name: getBiomarkerName(type),
    value,
    unit: ref.unit,
    referenceRange: ref.range,
    status,
  };
}

// Obter nome legível do biomarcador
function getBiomarkerName(type: string): string {
  const names: Record<string, string> = {
    cholesterolTotal: 'Colesterol Total',
    hdl: 'HDL (Colesterol Bom)',
    ldl: 'LDL (Colesterol Ruim)',
    triglycerides: 'Triglicérides',
    glucose: 'Glicemia',
    hemoglobin: 'Hemoglobina',
    creatinine: 'Creatinina',
    tgo: 'TGO (AST)',
    tgp: 'TGP (ALT)',
    ggt: 'Gama GT',
    vitaminD: 'Vitamina D',
    tsh: 'TSH (Tireoide)',
    crp: 'Proteína C Reativa',
  };
  return names[type] || type;
}

// Calcular idade biológica baseada nos biomarcadores
export function calculateBiologicalAge(
  chronologicalAge: number,
  biomarkers: any,
  lifestyle: {
    exerciseFrequency: string;
    sleepQuality: string;
    alcoholConsumption: string;
  },
  bmi: number
): number {
  let ageModifier = 0;

  // Análise de biomarcadores
  if (biomarkers.cholesterolTotal?.value) {
    if (biomarkers.cholesterolTotal.value > 240) ageModifier += 3;
    else if (biomarkers.cholesterolTotal.value > 200) ageModifier += 1;
    else if (biomarkers.cholesterolTotal.value < 180) ageModifier -= 1;
  }

  if (biomarkers.hdl?.value) {
    if (biomarkers.hdl.value > 60) ageModifier -= 2;
    else if (biomarkers.hdl.value < 40) ageModifier += 2;
  }

  if (biomarkers.ldl?.value) {
    if (biomarkers.ldl.value > 160) ageModifier += 3;
    else if (biomarkers.ldl.value > 130) ageModifier += 1;
    else if (biomarkers.ldl.value < 100) ageModifier -= 1;
  }

  if (biomarkers.triglycerides?.value) {
    if (biomarkers.triglycerides.value > 200) ageModifier += 2;
    else if (biomarkers.triglycerides.value < 100) ageModifier -= 1;
  }

  if (biomarkers.glucose?.value) {
    if (biomarkers.glucose.value > 126) ageModifier += 4;
    else if (biomarkers.glucose.value > 100) ageModifier += 2;
    else if (biomarkers.glucose.value >= 70 && biomarkers.glucose.value <= 85) ageModifier -= 1;
  }

  if (biomarkers.crp?.value) {
    if (biomarkers.crp.value > 3) ageModifier += 3;
    else if (biomarkers.crp.value < 1) ageModifier -= 1;
  }

  if (biomarkers.vitaminD?.value) {
    if (biomarkers.vitaminD.value < 20) ageModifier += 2;
    else if (biomarkers.vitaminD.value >= 40) ageModifier -= 1;
  }

  // Análise de estilo de vida
  if (lifestyle.exerciseFrequency === '5+') ageModifier -= 3;
  else if (lifestyle.exerciseFrequency === '3-4') ageModifier -= 2;
  else if (lifestyle.exerciseFrequency === '0') ageModifier += 2;

  if (lifestyle.sleepQuality === 'good') ageModifier -= 2;
  else if (lifestyle.sleepQuality === 'poor') ageModifier += 3;

  if (lifestyle.alcoholConsumption === 'high') ageModifier += 3;
  else if (lifestyle.alcoholConsumption === 'none') ageModifier -= 1;

  // Análise de IMC
  if (bmi >= 30) ageModifier += 4;
  else if (bmi >= 25) ageModifier += 2;
  else if (bmi >= 18.5 && bmi < 25) ageModifier -= 1;

  return Math.max(18, Math.round(chronologicalAge + ageModifier));
}

// Calcular risco metabólico
export function calculateMetabolicRisk(biomarkers: any, bmi: number): 'low' | 'moderate' | 'high' {
  let riskScore = 0;

  // Glicemia
  if (biomarkers.glucose?.value) {
    if (biomarkers.glucose.value > 126) riskScore += 3;
    else if (biomarkers.glucose.value > 100) riskScore += 2;
  }

  // Triglicérides
  if (biomarkers.triglycerides?.value) {
    if (biomarkers.triglycerides.value > 200) riskScore += 3;
    else if (biomarkers.triglycerides.value > 150) riskScore += 2;
  }

  // HDL
  if (biomarkers.hdl?.value) {
    if (biomarkers.hdl.value < 40) riskScore += 2;
  }

  // LDL
  if (biomarkers.ldl?.value) {
    if (biomarkers.ldl.value > 160) riskScore += 3;
    else if (biomarkers.ldl.value > 130) riskScore += 1;
  }

  // IMC
  if (bmi >= 30) riskScore += 3;
  else if (bmi >= 25) riskScore += 1;

  // Classificar risco
  if (riskScore >= 8) return 'high';
  if (riskScore >= 4) return 'moderate';
  return 'low';
}

// Calcular nível de inflamação
export function calculateInflammationLevel(biomarkers: any, lifestyle: any): 'low' | 'medium' | 'high' {
  let inflammationScore = 0;

  // PCR (Proteína C Reativa)
  if (biomarkers.crp?.value) {
    if (biomarkers.crp.value > 3) inflammationScore += 3;
    else if (biomarkers.crp.value > 1) inflammationScore += 1;
  }

  // Enzimas hepáticas
  if (biomarkers.tgo?.value && biomarkers.tgo.value > 40) inflammationScore += 1;
  if (biomarkers.tgp?.value && biomarkers.tgp.value > 40) inflammationScore += 1;
  if (biomarkers.ggt?.value && biomarkers.ggt.value > 55) inflammationScore += 1;

  // Estilo de vida
  if (lifestyle.exerciseFrequency === '0') inflammationScore += 1;
  if (lifestyle.sleepQuality === 'poor') inflammationScore += 2;
  if (lifestyle.alcoholConsumption === 'high') inflammationScore += 2;

  // Classificar inflamação
  if (inflammationScore >= 6) return 'high';
  if (inflammationScore >= 3) return 'medium';
  return 'low';
}
