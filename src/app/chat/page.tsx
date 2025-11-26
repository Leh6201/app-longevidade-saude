'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  Crown,
  AlertCircle,
  Sparkles,
  User,
  Bot
} from 'lucide-react';
import { loadUserData, addChatMessage, canSendChatMessage, getSubscriptionTier } from '@/lib/storage';
import { generateAIResponse } from '@/lib/ai';
import type { UserData, ChatMessage } from '@/lib/types';

export default function ChatPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = loadUserData();
    
    // Verificar se onboarding foi completado
    if (!data.profile?.onboardingCompleted) {
      router.push('/onboarding');
      return;
    }

    setUserData(data);
    setMessages(data.chatHistory);
  }, [router]);

  useEffect(() => {
    // Auto-scroll para última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !userData) return;

    // Verificar limite de mensagens
    if (!canSendChatMessage()) {
      setShowPaywall(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, userMessage]);
    addChatMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Gerar resposta da IA
      const aiResponse = await generateAIResponse(inputMessage, userData, messages);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      // Adicionar resposta da IA
      setMessages(prev => [...prev, assistantMessage]);
      addChatMessage(assistantMessage);

      // Atualizar userData
      const updatedData = loadUserData();
      setUserData(updatedData);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isPremium = getSubscriptionTier() === 'premium';
  const messagesRemaining = isPremium ? '∞' : Math.max(0, 10 - userData.chatMessagesUsed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold">Chat com IA</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assistente de saúde personalizada
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!isPremium && (
                <Badge variant="outline" className="text-xs">
                  {messagesRemaining} mensagens restantes
                </Badge>
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

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Limite de Mensagens Atingido
                </CardTitle>
                <CardDescription>
                  Você usou suas 10 mensagens gratuitas deste mês
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Com o Plano Premium:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-600" />
                      Chat ilimitado com IA
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-600" />
                      Uploads ilimitados de exames
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-600" />
                      Recomendações avançadas
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-600" />
                      Relatórios PDF completos
                    </li>
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowPaywall(false)}
                  >
                    Voltar
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    onClick={() => router.push('/subscription')}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Assinar Premium
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alerta de Boas-vindas */}
        {messages.length === 0 && (
          <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
              Olá! Sou sua assistente de saúde personalizada. Posso responder perguntas sobre seus exames, 
              biomarcadores, e dar dicas de saúde baseadas no seu perfil. Como posso ajudar?
            </AlertDescription>
          </Alert>
        )}

        {/* Área de Mensagens */}
        <Card className="mb-4 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Bot className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Nenhuma mensagem ainda
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Comece uma conversa fazendo uma pergunta!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input de Mensagem */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Digite sua pergunta sobre saúde..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {!isPremium && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                {messagesRemaining} de 10 mensagens gratuitas restantes este mês
              </p>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="mt-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-xs text-yellow-900 dark:text-yellow-100">
            <strong>Aviso importante:</strong> Este app não fornece diagnóstico médico. 
            As informações são apenas educacionais. Procure um profissional de saúde para orientação individual.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
}
