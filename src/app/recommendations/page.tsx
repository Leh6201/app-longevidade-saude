'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Flame,
  ArrowLeft,
  TrendingUp,
  Heart,
  Utensils,
  Moon,
  Activity,
  CheckCircle2,
  Crown,
  Lock,
} from 'lucide-react';
import { loadUserData } from '@/lib/storage';

export default function RecommendationsPage() {
  const router = useRouter();
  const userData = loadUserData();
  const recommendations = userData.recommendations;
  const isPremium = userData.profile?.subscriptionTier === 'premium';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise':
        return <Activity className="w-5 h-5" />;
      case 'nutrition':
        return <Utensils className="w-5 h-5" />;
      case 'sleep':
        return <Moon className="w-5 h-5" />;
      case 'lifestyle':
        return <Heart className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exercise':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
      case 'nutrition':
        return 'text-green-600 bg-green-50 dark:bg-green-950';
      case 'sleep':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950';
      case 'lifestyle':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-950';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Alta Prioridade</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Média Prioridade</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Baixa Prioridade</Badge>;
      default:
        return null;
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <Flame className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Nenhuma recomendação ainda</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Envie um exame para receber recomendações personalizadas de saúde.
              </p>
              <Button onClick={() => router.push('/upload')}>
                Enviar Exame
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
            Suas Recomendações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ações personalizadas para melhorar sua saúde e longevidade
          </p>
        </div>

        {/* Alerta Free Tier */}
        {!isPremium && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
            <Crown className="w-4 h-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <div className="flex items-center justify-between">
                <span>
                  Você está vendo 5 recomendações básicas. Upgrade para Premium para desbloquear recomendações avançadas.
                </span>
                <Button
                  size="sm"
                  className="ml-4 bg-gradient-to-r from-yellow-500 to-orange-500"
                  onClick={() => router.push('/subscription')}
                >
                  Upgrade
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Lista de Recomendações */}
        <div className="space-y-4 mb-8">
          {recommendations.map((rec, index) => (
            <Card key={rec.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-3 rounded-lg ${getCategoryColor(rec.category)}`}>
                      {getCategoryIcon(rec.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                        {getPriorityBadge(rec.priority)}
                      </div>
                      <CardTitle className="text-xl mb-2">{rec.title}</CardTitle>
                      <CardDescription className="text-base">{rec.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                      Impacto Esperado:
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200">{rec.impact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recomendações Premium Bloqueadas */}
        {!isPremium && (
          <div className="space-y-4 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-white mx-auto mb-3" />
                    <p className="text-white font-semibold mb-2">Recomendação Premium</p>
                    <Button
                      className="bg-gradient-to-r from-yellow-500 to-orange-500"
                      onClick={() => router.push('/subscription')}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Desbloquear
                    </Button>
                  </div>
                </div>
                <CardHeader className="blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-gray-200">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle>Recomendação Avançada</CardTitle>
                      <CardDescription>Conteúdo exclusivo para assinantes Premium</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="blur-sm">
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Importante:</strong> Estas recomendações são baseadas em seus dados e biomarcadores,
            mas não substituem orientação médica profissional. Consulte sempre um médico antes de fazer
            mudanças significativas em sua dieta, exercícios ou estilo de vida.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
