'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Upload, 
  TrendingUp, 
  Heart, 
  Flame, 
  BarChart3,
  MessageSquare,
  FileText,
  Crown,
  AlertCircle
} from 'lucide-react';
import { loadUserData, calculateBMI, getBMIClassification } from '@/lib/storage';
import type { UserData } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiClass, setBmiClass] = useState<string>('');

  useEffect(() => {
    const data = loadUserData();
    
    // Verificar se onboarding foi completado
    if (!data.profile?.onboardingCompleted) {
      router.push('/onboarding');
      return;
    }

    setUserData(data);

    // Calcular IMC
    if (data.profile) {
      const calculatedBMI = calculateBMI(data.profile.weight, data.profile.height);
      setBmi(calculatedBMI);
      setBmiClass(getBMIClassification(calculatedBMI));
    }
  }, [router]);

  if (!userData || !userData.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { profile, healthScores, recommendations, exams } = userData;
  const hasExams = exams.length > 0;
  const isPremium = profile.subscriptionTier === 'premium';

  const getGoalText = (goal: string) => {
    const goals: Record<string, string> = {
      lose_weight: 'Emagrecer',
      improve_energy: 'Melhorar energia',
      improve_sleep: 'Melhorar sono',
      reduce_cholesterol: 'Reduzir colesterol',
      reduce_glucose: 'Reduzir glicemia',
      increase_longevity: 'Aumentar longevidade',
    };
    return goals[goal] || goal;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LongLife AI
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Olá, {profile.sex === 'male' ? 'bem-vindo' : 'bem-vinda'}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!isPremium && (
                <Button 
                  variant="outline" 
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => router.push('/subscription')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Premium
                </Button>
              )}
              {isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alerta: Sem exames */}
        {!hasExams && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Envie seu primeiro exame
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                    Para calcular sua idade biológica, risco metabólico e receber recomendações personalizadas, 
                    faça upload de um exame de sangue.
                  </p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push('/upload')}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Exame
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Perfil Rápido */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Seu Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Idade:</span>
                <span className="font-semibold">{profile.age} anos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Peso:</span>
                <span className="font-semibold">{profile.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Altura:</span>
                <span className="font-semibold">{profile.height} cm</span>
              </div>
              {bmi && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">IMC:</span>
                    <span className="font-semibold">{bmi.toFixed(1)}</span>
                  </div>
                  <Badge variant="outline" className="w-full justify-center">
                    {bmiClass}
                  </Badge>
                </>
              )}
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Objetivo:</p>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                  {getGoalText(profile.goal)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Idade Biológica */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Idade Biológica
              </CardTitle>
              <CardDescription>Como seu corpo está funcionando</CardDescription>
            </CardHeader>
            <CardContent>
              {healthScores?.biologicalAge ? (
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    {healthScores.biologicalAge}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seu corpo funciona como se tivesse {healthScores.biologicalAge} anos
                  </p>
                  {healthScores.biologicalAge < profile.age && (
                    <Badge className="mt-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      {profile.age - healthScores.biologicalAge} anos mais jovem!
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Envie um exame para calcular
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risco Metabólico */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Risco Metabólico
              </CardTitle>
              <CardDescription>Saúde cardiovascular e metabólica</CardDescription>
            </CardHeader>
            <CardContent>
              {healthScores?.metabolicRisk ? (
                <div className="text-center">
                  <Badge 
                    className={`text-lg px-4 py-2 mb-3 ${
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
                      healthScores.metabolicRisk === 'low' ? 25 :
                      healthScores.metabolicRisk === 'moderate' ? 60 : 90
                    }
                    className="h-2"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Envie um exame para calcular
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            className="h-24 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            onClick={() => router.push('/upload')}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6" />
              <span>Enviar Exame</span>
            </div>
          </Button>

          <Button 
            variant="outline"
            className="h-24"
            onClick={() => router.push('/chat')}
          >
            <div className="flex flex-col items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              <span>Chat com IA</span>
            </div>
          </Button>

          <Button 
            variant="outline"
            className="h-24"
            onClick={() => router.push('/recommendations')}
            disabled={recommendations.length === 0}
          >
            <div className="flex flex-col items-center gap-2">
              <Flame className="w-6 h-6" />
              <span>Recomendações</span>
            </div>
          </Button>

          <Button 
            variant="outline"
            className="h-24"
            onClick={() => router.push('/report')}
            disabled={!hasExams}
          >
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-6 h-6" />
              <span>Relatório PDF</span>
            </div>
          </Button>
        </div>

        {/* Recomendações Preview */}
        {recommendations.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                Suas Recomendações
              </CardTitle>
              <CardDescription>
                Ações personalizadas para melhorar sua saúde
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.slice(0, 3).map((rec) => (
                  <div 
                    key={rec.id}
                    className="p-4 rounded-lg border bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950"
                  >
                    <h4 className="font-semibold mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {rec.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {rec.impact}
                    </Badge>
                  </div>
                ))}
              </div>
              {recommendations.length > 3 && (
                <Button 
                  variant="link" 
                  className="w-full mt-4"
                  onClick={() => router.push('/recommendations')}
                >
                  Ver todas as recomendações →
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
