'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  TrendingUp,
  Heart,
  Flame,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { loadUserData, updateHealthScores, updateRecommendations, calculateBMI } from '@/lib/storage';
import { 
  calculateBiologicalAge, 
  calculateMetabolicRisk, 
  calculateInflammationLevel 
} from '@/lib/ocr';
import { generateRecommendations } from '@/lib/recommendations';
import type { Biomarker } from '@/lib/types';

export default function ResultsPage() {
  const router = useRouter();
  const [isCalculating, setIsCalculating] = useState(true);
  const userData = loadUserData();

  useEffect(() => {
    // Verificar se tem exame
    if (userData.exams.length === 0) {
      router.push('/upload');
      return;
    }

    // Calcular scores de saúde
    const calculateScores = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const lastExam = userData.exams[userData.exams.length - 1];
      const profile = userData.profile!;
      const bmi = calculateBMI(profile.weight, profile.height);

      // Calcular idade biológica
      const biologicalAge = calculateBiologicalAge(
        profile.age,
        lastExam.biomarkers,
        {
          exerciseFrequency: profile.exerciseFrequency,
          sleepQuality: profile.sleepQuality,
          alcoholConsumption: profile.alcoholConsumption,
        },
        bmi
      );

      // Calcular risco metabólico
      const metabolicRisk = calculateMetabolicRisk(lastExam.biomarkers, bmi);

      // Calcular inflamação
      const inflammationLevel = calculateInflammationLevel(
        lastExam.biomarkers,
        {
          exerciseFrequency: profile.exerciseFrequency,
          sleepQuality: profile.sleepQuality,
          alcoholConsumption: profile.alcoholConsumption,
        }
      );

      // Salvar scores
      updateHealthScores({
        biologicalAge,
        metabolicRisk,
        inflammationLevel,
        calculatedAt: new Date().toISOString(),
      });

      // Gerar recomendações
      const recommendations = generateRecommendations(
        lastExam.biomarkers,
        profile,
        { biologicalAge, metabolicRisk, inflammationLevel, calculatedAt: new Date().toISOString() }
      );
      updateRecommendations(recommendations);

      setIsCalculating(false);
    };

    calculateScores();
  }, [router]);

  if (isCalculating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Sparkles className="w-16 h-16 text-blue-600 mx-auto animate-pulse" />
              <h2 className="text-2xl font-bold">Analisando seu exame...</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Estamos calculando sua idade biológica, risco metabólico e gerando recomendações personalizadas.
              </p>
              <Progress value={66} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lastExam = userData.exams[userData.exams.length - 1];
  const healthScores = userData.healthScores!;
  const profile = userData.profile!;

  const biomarkersList = Object.values(lastExam.biomarkers).filter(Boolean) as Biomarker[];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'borderline':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'abnormal':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'borderline':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
      case 'abnormal':
        return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Análise Completa
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Seus resultados estão prontos
          </p>
        </div>

        {/* Scores Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Idade Biológica */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Idade Biológica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {healthScores.biologicalAge}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Seu corpo funciona como se tivesse {healthScores.biologicalAge} anos
                </p>
                {healthScores.biologicalAge < profile.age ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {profile.age - healthScores.biologicalAge} anos mais jovem! 🎉
                  </Badge>
                ) : healthScores.biologicalAge > profile.age ? (
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                    {healthScores.biologicalAge - profile.age} anos acima
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Igual à idade cronológica
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Risco Metabólico */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Risco Metabólico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge
                  className={`text-2xl px-6 py-3 mb-4 ${
                    healthScores.metabolicRisk === 'low'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : healthScores.metabolicRisk === 'moderate'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {healthScores.metabolicRisk === 'low' && 'Baixo'}
                  {healthScores.metabolicRisk === 'moderate' && 'Moderado'}
                  {healthScores.metabolicRisk === 'high' && 'Alto'}
                </Badge>
                <Progress
                  value={
                    healthScores.metabolicRisk === 'low'
                      ? 25
                      : healthScores.metabolicRisk === 'moderate'
                      ? 60
                      : 90
                  }
                  className="h-3"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  {healthScores.metabolicRisk === 'low' &&
                    'Excelente! Continue com seus hábitos saudáveis.'}
                  {healthScores.metabolicRisk === 'moderate' &&
                    'Atenção! Algumas melhorias são recomendadas.'}
                  {healthScores.metabolicRisk === 'high' &&
                    'Importante! Consulte um médico e siga as recomendações.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Inflamação */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                Nível de Inflamação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge
                  className={`text-2xl px-6 py-3 mb-4 ${
                    healthScores.inflammationLevel === 'low'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : healthScores.inflammationLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {healthScores.inflammationLevel === 'low' && 'Baixa'}
                  {healthScores.inflammationLevel === 'medium' && 'Média'}
                  {healthScores.inflammationLevel === 'high' && 'Alta'}
                </Badge>
                <Progress
                  value={
                    healthScores.inflammationLevel === 'low'
                      ? 25
                      : healthScores.inflammationLevel === 'medium'
                      ? 60
                      : 90
                  }
                  className="h-3"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  {healthScores.inflammationLevel === 'low' &&
                    'Ótimo! Seu corpo está com baixa inflamação.'}
                  {healthScores.inflammationLevel === 'medium' &&
                    'Moderado. Algumas mudanças podem ajudar.'}
                  {healthScores.inflammationLevel === 'high' &&
                    'Elevado. Priorize as recomendações anti-inflamatórias.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Biomarcadores */}
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Seus Biomarcadores
            </CardTitle>
            <CardDescription>Valores extraídos do seu exame</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {biomarkersList.map((biomarker, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getStatusColor(biomarker.status)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{biomarker.name}</h4>
                    {getStatusIcon(biomarker.status)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      {biomarker.value} <span className="text-sm font-normal">{biomarker.unit}</span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Referência: {biomarker.referenceRange}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950">
          <Activity className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Importante:</strong> Este app não fornece diagnóstico médico. Os resultados são
            baseados em algoritmos e devem ser interpretados por um profissional de saúde qualificado.
            Procure sempre orientação médica para decisões sobre sua saúde.
          </AlertDescription>
        </Alert>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => router.push('/recommendations')}
          >
            <Flame className="w-4 h-4 mr-2" />
            Ver Recomendações Personalizadas
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/dashboard')}
          >
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
