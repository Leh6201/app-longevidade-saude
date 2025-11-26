'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Target, Moon, Dumbbell, Wine, ArrowRight, ArrowLeft } from 'lucide-react';
import type { UserProfile, Sex, Goal, ExerciseFrequency, SleepQuality, AlcoholConsumption } from '@/lib/types';
import { saveUserProfile } from '@/lib/storage';

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Dados do formulário
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState<Goal>('increase_longevity');
  const [exerciseFrequency, setExerciseFrequency] = useState<ExerciseFrequency>('1-2');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('medium');
  const [alcoholConsumption, setAlcoholConsumption] = useState<AlcoholConsumption>('low');

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      age: parseInt(age),
      sex,
      weight: parseFloat(weight),
      height: parseFloat(height),
      goal,
      exerciseFrequency,
      sleepQuality,
      alcoholConsumption,
      onboardingCompleted: true,
      subscriptionTier: 'free',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    saveUserProfile(profile);
    router.push('/dashboard');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return age && parseInt(age) > 0 && parseInt(age) < 120;
      case 2:
        return weight && height && parseFloat(weight) > 0 && parseFloat(height) > 0;
      case 3:
        return goal;
      case 4:
        return exerciseFrequency && sleepQuality && alcoholConsumption;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LongLife AI
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Vamos conhecer você melhor para personalizar sua experiência
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Etapa {currentStep} de {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <Card className="shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentStep === 1 && 'Informações Básicas'}
              {currentStep === 2 && 'Dados Físicos'}
              {currentStep === 3 && 'Seu Objetivo'}
              {currentStep === 4 && 'Estilo de Vida'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Conte-nos sobre você'}
              {currentStep === 2 && 'Vamos calcular seu perfil metabólico'}
              {currentStep === 3 && 'O que você quer alcançar?'}
              {currentStep === 4 && 'Seus hábitos atuais'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Informações Básicas */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ex: 35"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Sexo Biológico</Label>
                  <RadioGroup value={sex} onValueChange={(value) => setSex(value as Sex)} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Feminino</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 2: Dados Físicos */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 75.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Ex: 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Objetivo */}
            {currentStep === 3 && (
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  Escolha seu objetivo principal
                </Label>
                <RadioGroup value={goal} onValueChange={(value) => setGoal(value as Goal)} className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="lose_weight" id="lose_weight" />
                    <Label htmlFor="lose_weight" className="cursor-pointer flex-1">Emagrecer</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="improve_energy" id="improve_energy" />
                    <Label htmlFor="improve_energy" className="cursor-pointer flex-1">Melhorar energia</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="improve_sleep" id="improve_sleep" />
                    <Label htmlFor="improve_sleep" className="cursor-pointer flex-1">Melhorar sono</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="reduce_cholesterol" id="reduce_cholesterol" />
                    <Label htmlFor="reduce_cholesterol" className="cursor-pointer flex-1">Reduzir colesterol</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="reduce_glucose" id="reduce_glucose" />
                    <Label htmlFor="reduce_glucose" className="cursor-pointer flex-1">Reduzir glicemia</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="increase_longevity" id="increase_longevity" />
                    <Label htmlFor="increase_longevity" className="cursor-pointer flex-1">Aumentar longevidade</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 4: Estilo de Vida */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Dumbbell className="w-5 h-5 text-blue-600" />
                    Quantas vezes treina por semana?
                  </Label>
                  <RadioGroup value={exerciseFrequency} onValueChange={(value) => setExerciseFrequency(value as ExerciseFrequency)} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="ex0" />
                      <Label htmlFor="ex0" className="cursor-pointer">Não treino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-2" id="ex1-2" />
                      <Label htmlFor="ex1-2" className="cursor-pointer">1-2 vezes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-4" id="ex3-4" />
                      <Label htmlFor="ex3-4" className="cursor-pointer">3-4 vezes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5+" id="ex5+" />
                      <Label htmlFor="ex5+" className="cursor-pointer">5 ou mais vezes</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Moon className="w-5 h-5 text-blue-600" />
                    Qualidade do sono
                  </Label>
                  <RadioGroup value={sleepQuality} onValueChange={(value) => setSleepQuality(value as SleepQuality)} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poor" id="sleep-poor" />
                      <Label htmlFor="sleep-poor" className="cursor-pointer">Ruim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="sleep-medium" />
                      <Label htmlFor="sleep-medium" className="cursor-pointer">Médio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="sleep-good" />
                      <Label htmlFor="sleep-good" className="cursor-pointer">Bom</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Wine className="w-5 h-5 text-blue-600" />
                    Consumo de álcool
                  </Label>
                  <RadioGroup value={alcoholConsumption} onValueChange={(value) => setAlcoholConsumption(value as AlcoholConsumption)} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="alc-none" />
                      <Label htmlFor="alc-none" className="cursor-pointer">Não consumo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="alc-low" />
                      <Label htmlFor="alc-low" className="cursor-pointer">Pouco (1-2x/mês)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="alc-moderate" />
                      <Label htmlFor="alc-moderate" className="cursor-pointer">Moderado (1-2x/semana)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="alc-high" />
                      <Label htmlFor="alc-high" className="cursor-pointer">Alto (3+x/semana)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentStep === TOTAL_STEPS ? 'Finalizar' : 'Próximo'}
                {currentStep < TOTAL_STEPS && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
