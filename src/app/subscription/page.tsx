'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Check, 
  X, 
  ArrowLeft,
  Sparkles,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';

export default function SubscriptionPage() {
  const router = useRouter();

  const handleSubscribe = (tier: 'free' | 'premium') => {
    if (tier === 'premium') {
      // Em produção, integrar com gateway de pagamento (Stripe, etc)
      alert('Em breve! Integração com pagamento será implementada.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Crown className="w-6 h-6 text-yellow-500" />
            <div>
              <h1 className="text-xl font-bold">Planos e Assinaturas</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Escolha o plano ideal para você
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            Oferta de Lançamento
          </Badge>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Invista na sua longevidade
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tenha acesso completo a análises avançadas, recomendações personalizadas e 
            acompanhamento contínuo da sua saúde.
          </p>
        </div>

        {/* Comparação de Planos */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Plano Free */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Plano Gratuito</CardTitle>
                <Badge variant="outline">Free</Badge>
              </div>
              <CardDescription>
                Experimente o básico do LongLife AI
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-gray-600 dark:text-gray-400">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">1 upload de exame</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Cálculo de idade biológica</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Score de risco metabólico</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Nível de inflamação</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">3 gráficos simples</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">5 recomendações básicas</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Chat com IA (10 mensagens/mês)</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">Uploads ilimitados</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">Chat ilimitado</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">Recomendações avançadas</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">Histórico de exames</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">Relatório PDF completo</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSubscribe('free')}
              >
                Continuar Gratuito
              </Button>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="shadow-2xl border-2 border-yellow-500 relative overflow-hidden">
            {/* Badge "Mais Popular" */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                Mais Popular
              </Badge>
            </div>

            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  Plano Premium
                </CardTitle>
              </div>
              <CardDescription>
                Acesso completo a todas as funcionalidades
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  R$ 39,90
                </span>
                <span className="text-gray-600 dark:text-gray-400">/mês</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Cancele quando quiser
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Tudo do plano gratuito +</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Uploads ilimitados de exames</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Chat ilimitado com IA</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Recomendações avançadas personalizadas</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Histórico completo de exames</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Relatório PDF completo para compartilhar</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Revisão automática mensal dos scores</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Gráficos avançados e tendências</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Suporte prioritário</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                onClick={() => handleSubscribe('premium')}
              >
                <Crown className="w-4 h-4 mr-2" />
                Assinar Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefícios Adicionais */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Dados Seguros</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seus dados de saúde são criptografados e protegidos
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Resultados Reais</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Acompanhe sua evolução com métricas precisas
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">IA Avançada</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recomendações personalizadas baseadas em ciência
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Rápido */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Posso cancelar a qualquer momento?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxas ou multas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Meus dados estão seguros?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Absolutamente. Usamos criptografia de ponta e seguimos todas as normas de proteção de dados.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Como funciona o período de teste?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Você pode usar o plano gratuito por tempo ilimitado. Ao assinar o Premium, 
                tem acesso imediato a todos os recursos.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
