'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Activity, Sparkles, TrendingUp, Heart, Brain, ArrowRight } from 'lucide-react';
import { isOnboardingCompleted } from '@/lib/storage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Se já completou onboarding, redireciona para dashboard
    if (isOnboardingCompleted()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Activity className="w-16 h-16 text-blue-600" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              LongLife AI
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4">
            Descubra sua idade biológica e otimize sua longevidade
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Interpretação inteligente de exames, análise de risco metabólico e recomendações 
            personalizadas com IA para você viver mais e melhor.
          </p>

          {/* CTA */}
          <Button 
            size="lg"
            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all"
            onClick={() => router.push('/onboarding')}
          >
            Começar Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Idade Biológica</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Descubra como seu corpo realmente funciona com base em seus biomarcadores
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Risco Metabólico</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Análise completa da sua saúde cardiovascular e metabólica
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">IA Personalizada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Recomendações inteligentes baseadas nos seus dados e objetivos
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold">Como funciona?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h4 className="font-semibold mb-2">Envie seu exame</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Faça upload de PDF ou foto do seu exame de sangue
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h4 className="font-semibold mb-2">IA analisa tudo</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Extração automática de biomarcadores e cálculo de scores
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h4 className="font-semibold mb-2">Receba recomendações</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ações personalizadas para otimizar sua saúde e longevidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            <strong>Aviso:</strong> Este aplicativo não fornece diagnóstico médico. 
            Consulte sempre um profissional de saúde qualificado.
          </p>
          <p>© 2024 LongLife AI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
