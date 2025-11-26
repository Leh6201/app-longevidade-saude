// Sistema de geração de recomendações personalizadas
import type { Recommendation, UserProfile, HealthScores } from './types';

export function generateRecommendations(
  biomarkers: any,
  profile: UserProfile,
  healthScores: HealthScores
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let idCounter = 1;

  // Recomendações baseadas em biomarcadores

  // Colesterol e Lipídios
  if (biomarkers.cholesterolTotal?.value > 200) {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Reduza gorduras saturadas',
      description: 'Limite carnes vermelhas e laticínios integrais. Prefira peixes, azeite e oleaginosas.',
      impact: 'Pode reduzir colesterol em 10-15% em 8 semanas',
      category: 'nutrition',
      priority: 'high',
    });
  }

  if (biomarkers.ldl?.value > 130) {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Aumente fibras solúveis',
      description: 'Consuma aveia, feijão, maçã e linhaça diariamente. Fibras reduzem absorção de colesterol.',
      impact: 'Reduz LDL em até 10% em 4 semanas',
      category: 'nutrition',
      priority: 'high',
    });
  }

  if (biomarkers.hdl?.value < 40) {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Pratique exercícios aeróbicos',
      description: 'Caminhe 30 minutos por dia, 5x/semana. Exercícios aeróbicos aumentam HDL (colesterol bom).',
      impact: 'Aumenta HDL em 5-10% em 12 semanas',
      category: 'exercise',
      priority: 'high',
    });
  }

  if (biomarkers.triglycerides?.value > 150) {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Evite açúcares e carboidratos refinados',
      description: 'Elimine refrigerantes, sucos industrializados e doces. Prefira carboidratos integrais.',
      impact: 'Pode reduzir triglicérides em 20-30% em 6 semanas',
      category: 'nutrition',
      priority: 'high',
    });
  }

  // Glicemia
  if (biomarkers.glucose?.value > 100) {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Controle carboidratos simples',
      description: 'Evite pão branco, massas refinadas e açúcar. Prefira carboidratos de baixo índice glicêmico.',
      impact: 'Reduz glicemia em 10-20 mg/dL em 4 semanas',
      category: 'nutrition',
      priority: 'high',
    });

    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Caminhe após as refeições',
      description: 'Faça uma caminhada leve de 10-15 minutos após almoço e jantar.',
      impact: 'Reduz pico glicêmico em até 30%',
      category: 'exercise',
      priority: 'medium',
    });
  }

  // Inflamação
  if (biomarkers.crp?.value > 1 || healthScores.inflammationLevel !== 'low') {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Adicione alimentos anti-inflamatórios',
      description: 'Consuma cúrcuma, gengibre, peixes gordos (salmão, sardinha) e frutas vermelhas diariamente.',
      impact: 'Reduz marcadores inflamatórios em 15-25% em 8 semanas',
      category: 'nutrition',
      priority: 'high',
    });
  }

  // Vitamina D
  if (biomarkers.vitaminD?.value && biomarkers.vitaminD.value < 30) {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Exponha-se ao sol diariamente',
      description: 'Tome 15-20 minutos de sol (braços e pernas) entre 10h-16h, sem protetor solar.',
      impact: 'Aumenta vitamina D em 10-15 ng/mL em 4 semanas',
      category: 'lifestyle',
      priority: 'medium',
    });
  }

  // Função hepática
  if (
    (biomarkers.tgo?.value && biomarkers.tgo.value > 40) ||
    (biomarkers.tgp?.value && biomarkers.tgp.value > 40) ||
    (biomarkers.ggt?.value && biomarkers.ggt.value > 55)
  ) {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Reduza consumo de álcool',
      description: 'Limite álcool a no máximo 1 dose/dia (mulheres) ou 2 doses/dia (homens), ou elimine completamente.',
      impact: 'Normaliza enzimas hepáticas em 4-8 semanas',
      category: 'lifestyle',
      priority: 'high',
    });
  }

  // Recomendações baseadas em estilo de vida

  if (profile.exerciseFrequency === '0' || profile.exerciseFrequency === '1-2') {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Aumente frequência de exercícios',
      description: 'Meta: 150 minutos/semana de atividade moderada. Comece com 30 min, 3x/semana.',
      impact: 'Reduz risco cardiovascular em 30-40%',
      category: 'exercise',
      priority: 'high',
    });
  }

  if (profile.sleepQuality === 'poor' || profile.sleepQuality === 'medium') {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Melhore qualidade do sono',
      description: 'Durma 7-9h/noite. Evite telas 1h antes de dormir. Mantenha quarto escuro e fresco (18-20°C).',
      impact: 'Melhora inflamação em 12% e reduz cortisol',
      category: 'sleep',
      priority: 'high',
    });
  }

  if (profile.alcoholConsumption === 'high' || profile.alcoholConsumption === 'moderate') {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Reduza consumo de álcool',
      description: 'Limite a 1-2 doses/semana ou faça pausas de 2-3 dias consecutivos sem álcool.',
      impact: 'Melhora função hepática e reduz inflamação em 20%',
      category: 'lifestyle',
      priority: 'medium',
    });
  }

  // Recomendações baseadas em objetivo
  switch (profile.goal) {
    case 'lose_weight':
      recommendations.push({
        id: `rec_${idCounter++}`,
        title: 'Crie déficit calórico moderado',
        description: 'Reduza 300-500 calorias/dia. Priorize proteínas magras e vegetais. Evite dietas extremas.',
        impact: 'Perda saudável de 0.5-1kg/semana',
        category: 'nutrition',
        priority: 'high',
      });
      break;

    case 'improve_energy':
      recommendations.push({
        id: `rec_${idCounter++}`,
        title: 'Otimize hidratação',
        description: 'Beba 2-3L de água/dia. Desidratação reduz energia em até 30%.',
        impact: 'Aumenta energia e foco em 15-20%',
        category: 'lifestyle',
        priority: 'medium',
      });
      break;

    case 'reduce_cholesterol':
      recommendations.push({
        id: `rec_${idCounter++}`,
        title: 'Adicione esteróis vegetais',
        description: 'Consuma 2g/dia de esteróis (presentes em margarinas fortificadas, oleaginosas).',
        impact: 'Reduz LDL em 10% adicional',
        category: 'nutrition',
        priority: 'medium',
      });
      break;

    case 'increase_longevity':
      recommendations.push({
        id: `rec_${idCounter++}`,
        title: 'Pratique jejum intermitente',
        description: 'Experimente 16h de jejum (ex: jantar às 20h, café da manhã às 12h). Consulte médico antes.',
        impact: 'Ativa autofagia e pode aumentar longevidade',
        category: 'nutrition',
        priority: 'medium',
      });
      break;
  }

  // Recomendações baseadas em risco metabólico
  if (healthScores.metabolicRisk === 'high') {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Consulte um médico',
      description: 'Seu risco metabólico está elevado. Agende consulta médica para avaliação completa.',
      impact: 'Prevenção de complicações cardiovasculares',
      category: 'lifestyle',
      priority: 'high',
    });
  }

  // Recomendações baseadas em idade biológica
  if (healthScores.biologicalAge > profile.age + 3) {
    recommendations.push({
      id: `rec_${idCounter++}`,
      title: 'Implemente rotina anti-aging',
      description: 'Combine exercícios de força 2x/semana, dieta mediterrânea e suplementação (após avaliação médica).',
      impact: 'Pode reduzir idade biológica em 2-5 anos em 6 meses',
      category: 'lifestyle',
      priority: 'high',
    });
  }

  // Limitar a 10 recomendações (5 para free tier)
  const maxRecommendations = profile.subscriptionTier === 'premium' ? 10 : 5;
  
  // Ordenar por prioridade
  recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return recommendations.slice(0, maxRecommendations);
}
