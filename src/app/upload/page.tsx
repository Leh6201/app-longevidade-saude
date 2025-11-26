'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { addExam, loadUserData } from '@/lib/storage';
import { extractBiomarkersFromText, generateExamId } from '@/lib/ocr';
import type { ExamResult } from '@/lib/types';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const userData = loadUserData();
  const isPremium = userData.profile?.subscriptionTier === 'premium';
  const examCount = userData.exams.length;
  const canUpload = isPremium || examCount === 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Formato inválido. Use PDF, JPG ou PNG.');
      return;
    }

    // Validar tamanho (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 10MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Gerar preview para imagens
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const processExam = async () => {
    if (!file || !canUpload) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Simular progresso
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Converter arquivo para texto (OCR simulado)
      setProgress(40);
      const text = await extractTextFromFile(file);
      
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Extrair biomarcadores
      const biomarkers = extractBiomarkersFromText(text);
      
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Criar resultado do exame
      const examResult: ExamResult = {
        id: generateExamId(),
        uploadedAt: new Date().toISOString(),
        biomarkers,
      };

      // Salvar exame
      addExam(examResult);

      setProgress(100);
      setSuccess(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/results');
      }, 2000);

    } catch (err) {
      console.error('Erro ao processar exame:', err);
      setError('Erro ao processar o exame. Tente novamente.');
      setIsProcessing(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    // Simulação de OCR - em produção, usar API real (Tesseract.js, Google Vision, etc)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Texto simulado de exame
        const mockText = `
          EXAME DE SANGUE - LABORATÓRIO
          
          COLESTEROL TOTAL: 195 mg/dL (Ref: <200)
          HDL: 52 mg/dL (Ref: >40)
          LDL: 118 mg/dL (Ref: <130)
          TRIGLICÉRIDES: 125 mg/dL (Ref: <150)
          
          GLICEMIA: 92 mg/dL (Ref: 70-100)
          HEMOGLOBINA: 14.2 g/dL (Ref: 12-16)
          
          CREATININA: 0.9 mg/dL (Ref: 0.6-1.2)
          TGO: 28 U/L (Ref: <40)
          TGP: 32 U/L (Ref: <40)
          GGT: 24 U/L (Ref: <55)
          
          VITAMINA D: 28 ng/mL (Ref: 30-100)
          TSH: 2.1 mUI/L (Ref: 0.4-4.0)
          PCR: 1.2 mg/L (Ref: <3.0)
        `;
        resolve(mockText);
      }, 1000);
    });
  };

  if (!canUpload) {
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

          <Card className="max-w-2xl mx-auto border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
                <AlertCircle className="w-6 h-6" />
                Limite Atingido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                Você já enviou seu exame gratuito. Para enviar mais exames e desbloquear 
                recursos ilimitados, faça upgrade para Premium.
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                onClick={() => router.push('/subscription')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade para Premium
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

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Enviar Exame
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Faça upload do seu exame de sangue para análise inteligente
            </p>
          </div>

          {/* Card de Upload */}
          <Card className="shadow-xl mb-6">
            <CardHeader>
              <CardTitle>Selecione seu exame</CardTitle>
              <CardDescription>
                Aceito: PDF, JPG, PNG (máx 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div className="space-y-4">
                  {/* Área de Drop */}
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Clique para enviar</span> ou arraste aqui
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, JPG ou PNG (máx 10MB)
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      disabled={isProcessing}
                    />
                  </label>

                  {/* Botões de Opções */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <FileText className="w-6 h-6" />
                      <span className="text-xs">PDF</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-xs">Imagem</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Camera className="w-6 h-6" />
                      <span className="text-xs">Foto</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview do arquivo */}
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start gap-4">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded"
                        />
                      ) : (
                        <FileText className="w-24 h-24 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {!isProcessing && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-red-600"
                            onClick={() => {
                              setFile(null);
                              setPreview(null);
                              setError(null);
                            }}
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progresso */}
                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Processando exame...
                        </span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {/* Sucesso */}
                  {success && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Exame processado com sucesso! Redirecionando...
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Botão de Processar */}
                  {!isProcessing && !success && (
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={processExam}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analisar Exame
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}

              {/* Erro */}
              {error && (
                <Alert className="mt-4 border-red-200 bg-red-50 dark:bg-red-950">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Informações */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                O que analisamos:
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Perfil lipídico (colesterol, HDL, LDL, triglicérides)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Glicemia e hemoglobina</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Função hepática (TGO, TGP, GGT)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Função renal (creatinina)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Vitamina D, TSH e marcadores inflamatórios</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
