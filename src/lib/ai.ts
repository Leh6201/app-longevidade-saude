// Sistema de IA contextualizado para o LongLife AI
import type { UserData, ChatMessage } from './types';

const DISCLAIMER = '\n\n⚠️ **Aviso importante:** Este app não fornece diagnóstico médico. Procure um profissional de saúde para orientação individual.';

// Gerar contexto do usuário para a IA
export function generateUserContext(userData: UserData): string {
  const { profile, healthScores, exams, recommendations } = userData;
  
  if (!profile) {
    return 'Usuário ainda não completou o onboarding.';
  }

  let context = `**Perfil do Usuário:**\n`;
  context += `- Idade: ${profile.age} anos\n`;
  context += `- Sexo: ${profile.sex === 'male' ? 'Masculino' : 'Feminino'}\n`;
  context += `- Peso: ${profile.weight} kg\n`;
  context += `- Altura: ${profile.height} cm\n`;
  context += `- Objetivo: ${getGoalText(profile.goal)}\n`;
  context += `- Frequência de exercícios: ${getExerciseText(profile.exerciseFrequency)}\n`;
  context += `- Qualidade do sono: ${getSleepText(profile.sleepQuality)}\n`;
  context += `- Consumo de álcool: ${getAlcoholText(profile.alcoholConsumption)}\n`;

  if (healthScores) {
    context += `\n**Scores de Saúde:**\n`;
    context += `- Idade Biológica: ${healthScores.biologicalAge} anos\n`;
    context += `- Risco Metabólico: ${getRiskText(healthScores.metabolicRisk)}\n`;
    context += `- Nível de Inflamação: ${getInflammationText(healthScores.inflammationLevel)}\n`;
  }

  if (exams.length > 0) {
    const lastExam = exams[exams.length - 1];
    context += `\n**Último Exame (${new Date(lastExam.uploadedAt).toLocaleDateString('pt-BR')}):**\n`;
    
    const biomarkers = lastExam.biomarkers;
    if (biomarkers.cholesterolTotal?.value) {
      context += `- Colesterol Total: ${biomarkers.cholesterolTotal.value} ${biomarkers.cholesterolTotal.unit} (${biomarkers.cholesterolTotal.status})\n`;
    }
    if (biomarkers.hdl?.value) {
      context += `- HDL: ${biomarkers.hdl.value} ${biomarkers.hdl.unit} (${biomarkers.hdl.status})\n`;
    }
    if (biomarkers.ldl?.value) {
      context += `- LDL: ${biomarkers.ldl.value} ${biomarkers.ldl.unit} (${biomarkers.ldl.status})\n`;
    }
    if (biomarkers.triglycerides?.value) {
      context += `- Triglicérides: ${biomarkers.triglycerides.value} ${biomarkers.triglycerides.unit} (${biomarkers.triglycerides.status})\n`;
    }
    if (biomarkers.glucose?.value) {
      context += `- Glicemia: ${biomarkers.glucose.value} ${biomarkers.glucose.unit} (${biomarkers.glucose.status})\n`;
    }
    if (biomarkers.crp?.value) {
      context += `- Proteína C Reativa: ${biomarkers.crp.value} ${biomarkers.crp.unit} (${biomarkers.crp.status})\n`;
    }
  }

  if (recommendations.length > 0) {
    context += `\n**Recomendações Ativas:** ${recommendations.length} recomendações personalizadas\n`;
  }

  return context;
}

// Simular resposta da IA (em produção, usar API real como OpenAI)
export async function generateAIResponse(
  userMessage: string,
  userData: UserData,
  chatHistory: ChatMessage[]
): Promise<string> {
  // Gerar contexto do usuário
  const userContext = generateUserContext(userData);

  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Análise básica da mensagem para gerar resposta contextualizada
  const messageLower = userMessage.toLowerCase();

  // Respostas contextualizadas baseadas em palavras-chave
  if (messageLower.includes('idade biológica') || messageLower.includes('idade biologica')) {
    if (userData.healthScores?.biologicalAge) {
      const diff = userData.profile!.age - userData.healthScores.biologicalAge;
      if (diff > 0) {
        return `Sua idade biológica é de ${userData.healthScores.biologicalAge} anos, o que significa que seu corpo está funcionando ${diff} anos mais jovem que sua idade cronológica de ${userData.profile!.age} anos! Isso é excelente! 🎉\n\nPara manter esse resultado, continue com seus hábitos saudáveis e siga as recomendações personalizadas.${DISCLAIMER}`;
      } else if (diff < 0) {
        return `Sua idade biológica é de ${userData.healthScores.biologicalAge} anos, ${Math.abs(diff)} anos acima da sua idade cronológica de ${userData.profile!.age} anos.\n\nIsso indica que há espaço para melhorias. Recomendo focar nas suas recomendações personalizadas, especialmente em exercícios regulares, alimentação balanceada e qualidade do sono.${DISCLAIMER}`;
      } else {
        return `Sua idade biológica está alinhada com sua idade cronológica de ${userData.profile!.age} anos. Há oportunidades para melhorar ainda mais através de hábitos saudáveis!${DISCLAIMER}`;
      }
    }
    return `Para calcular sua idade biológica, você precisa enviar um exame de sangue. Vá até a seção "Enviar Exame" e faça upload do seu exame mais recente.${DISCLAIMER}`;
  }

  if (messageLower.includes('colesterol')) {
    const lastExam = userData.exams[userData.exams.length - 1];
    if (lastExam?.biomarkers.cholesterolTotal?.value) {
      const chol = lastExam.biomarkers.cholesterolTotal;
      const hdl = lastExam.biomarkers.hdl;
      const ldl = lastExam.biomarkers.ldl;
      
      let response = `Sobre seu colesterol:\n\n`;
      response += `- **Colesterol Total:** ${chol.value} ${chol.unit} (${chol.status})\n`;
      if (hdl?.value) response += `- **HDL (bom):** ${hdl.value} ${hdl.unit} (${hdl.status})\n`;
      if (ldl?.value) response += `- **LDL (ruim):** ${ldl.value} ${ldl.unit} (${ldl.status})\n`;
      
      if (chol.status === 'abnormal') {
        response += `\n**Recomendações:**\n`;
        response += `- Aumente consumo de fibras (aveia, frutas, vegetais)\n`;
        response += `- Reduza gorduras saturadas e trans\n`;
        response += `- Pratique exercícios aeróbicos 150 min/semana\n`;
        response += `- Considere incluir ômega-3 na dieta\n`;
      }
      
      return response + DISCLAIMER;
    }
    return `Não encontrei dados de colesterol nos seus exames. Envie um exame de sangue para que eu possa analisar seus níveis de colesterol.${DISCLAIMER}`;
  }

  if (messageLower.includes('glicemia') || messageLower.includes('glicose') || messageLower.includes('diabetes')) {
    const lastExam = userData.exams[userData.exams.length - 1];
    if (lastExam?.biomarkers.glucose?.value) {
      const glucose = lastExam.biomarkers.glucose;
      let response = `Sobre sua glicemia:\n\n`;
      response += `- **Glicemia em jejum:** ${glucose.value} ${glucose.unit} (${glucose.status})\n\n`;
      
      if (glucose.value < 100) {
        response += `Sua glicemia está normal! Continue mantendo hábitos saudáveis.`;
      } else if (glucose.value < 126) {
        response += `Sua glicemia está na faixa de pré-diabetes. **Recomendações:**\n`;
        response += `- Reduza carboidratos refinados e açúcares\n`;
        response += `- Aumente atividade física (caminhadas após refeições)\n`;
        response += `- Priorize alimentos de baixo índice glicêmico\n`;
        response += `- Monitore regularmente\n`;
      } else {
        response += `Sua glicemia está elevada. É importante consultar um médico para avaliação completa.`;
      }
      
      return response + DISCLAIMER;
    }
    return `Não encontrei dados de glicemia nos seus exames. Envie um exame de sangue para análise.${DISCLAIMER}`;
  }

  if (messageLower.includes('exercício') || messageLower.includes('exercicio') || messageLower.includes('treino')) {
    const freq = userData.profile?.exerciseFrequency;
    let response = `Sobre exercícios físicos:\n\n`;
    
    if (freq === '0') {
      response += `Você informou que não pratica exercícios atualmente. Começar é mais importante que a intensidade!\n\n`;
      response += `**Recomendações para iniciantes:**\n`;
      response += `- Comece com 10-15 min de caminhada diária\n`;
      response += `- Aumente gradualmente para 30 min, 5x/semana\n`;
      response += `- Inclua alongamentos e fortalecimento 2x/semana\n`;
    } else if (freq === '1-2') {
      response += `Você treina 1-2x por semana. Para melhores resultados:\n\n`;
      response += `- Tente aumentar para 3-4x/semana\n`;
      response += `- Combine aeróbico + musculação\n`;
      response += `- Mantenha consistência\n`;
    } else {
      response += `Excelente! Você treina ${freq === '3-4' ? '3-4' : '5 ou mais'} vezes por semana.\n\n`;
      response += `Continue assim! Lembre-se de:\n`;
      response += `- Variar os tipos de exercício\n`;
      response += `- Incluir descanso adequado\n`;
      response += `- Manter boa alimentação\n`;
    }
    
    return response + DISCLAIMER;
  }

  if (messageLower.includes('sono') || messageLower.includes('dormir')) {
    const sleep = userData.profile?.sleepQuality;
    let response = `Sobre seu sono:\n\n`;
    
    if (sleep === 'poor') {
      response += `Você classificou seu sono como ruim. O sono é fundamental para saúde e longevidade!\n\n`;
      response += `**Dicas para melhorar:**\n`;
      response += `- Estabeleça horário fixo para dormir/acordar\n`;
      response += `- Evite telas 1h antes de dormir\n`;
      response += `- Mantenha quarto escuro, silencioso e fresco\n`;
      response += `- Evite cafeína após 14h\n`;
      response += `- Pratique relaxamento antes de dormir\n`;
    } else if (sleep === 'medium') {
      response += `Seu sono está médio. Há espaço para melhorias:\n\n`;
      response += `- Tente dormir 7-9 horas por noite\n`;
      response += `- Crie uma rotina relaxante antes de dormir\n`;
      response += `- Evite refeições pesadas à noite\n`;
    } else {
      response += `Ótimo! Você tem boa qualidade de sono. Continue mantendo:\n\n`;
      response += `- Horários regulares\n`;
      response += `- Ambiente adequado\n`;
      response += `- Rotina de relaxamento\n`;
    }
    
    return response + DISCLAIMER;
  }

  if (messageLower.includes('recomendações') || messageLower.includes('recomendacoes')) {
    if (userData.recommendations.length > 0) {
      let response = `Você tem ${userData.recommendations.length} recomendações personalizadas:\n\n`;
      userData.recommendations.slice(0, 3).forEach((rec, idx) => {
        response += `${idx + 1}. **${rec.title}**\n   ${rec.description}\n   Impacto: ${rec.impact}\n\n`;
      });
      if (userData.recommendations.length > 3) {
        response += `Veja todas as recomendações na página dedicada.`;
      }
      return response + DISCLAIMER;
    }
    return `Você ainda não tem recomendações. Envie um exame para receber recomendações personalizadas!${DISCLAIMER}`;
  }

  // Resposta genérica contextualizada
  let response = `Olá! Sou sua assistente de saúde e longevidade. 👋\n\n`;
  
  if (userData.profile) {
    response += `Vejo que você tem ${userData.profile.age} anos e seu objetivo é: ${getGoalText(userData.profile.goal)}.\n\n`;
  }
  
  response += `Posso ajudar você com:\n`;
  response += `- Explicar seus biomarcadores e exames\n`;
  response += `- Sugerir hábitos para melhorar sua saúde\n`;
  response += `- Responder dúvidas sobre longevidade\n`;
  response += `- Interpretar seus scores de saúde\n\n`;
  response += `O que você gostaria de saber?`;
  
  return response + DISCLAIMER;
}

// Funções auxiliares para textos
function getGoalText(goal: string): string {
  const goals: Record<string, string> = {
    lose_weight: 'Emagrecer',
    improve_energy: 'Melhorar energia',
    improve_sleep: 'Melhorar sono',
    reduce_cholesterol: 'Reduzir colesterol',
    reduce_glucose: 'Reduzir glicemia',
    increase_longevity: 'Aumentar longevidade',
  };
  return goals[goal] || goal;
}

function getExerciseText(freq: string): string {
  const texts: Record<string, string> = {
    '0': 'Não pratica',
    '1-2': '1-2 vezes por semana',
    '3-4': '3-4 vezes por semana',
    '5+': '5 ou mais vezes por semana',
  };
  return texts[freq] || freq;
}

function getSleepText(quality: string): string {
  const texts: Record<string, string> = {
    poor: 'Ruim',
    medium: 'Médio',
    good: 'Bom',
  };
  return texts[quality] || quality;
}

function getAlcoholText(consumption: string): string {
  const texts: Record<string, string> = {
    none: 'Não consome',
    low: 'Pouco',
    moderate: 'Moderado',
    high: 'Alto',
  };
  return texts[consumption] || consumption;
}

function getRiskText(risk: string): string {
  const texts: Record<string, string> = {
    low: 'Baixo',
    moderate: 'Moderado',
    high: 'Alto',
  };
  return texts[risk] || risk;
}

function getInflammationText(level: string): string {
  const texts: Record<string, string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };
  return texts[level] || level;
}
