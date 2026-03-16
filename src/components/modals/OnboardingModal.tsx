'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Check, X, Loader2 } from 'lucide-react'
import { differenceInYears, parseISO } from 'date-fns'
import { useOnboarding } from '@/providers/OnboardingProvider'
import { useAuth } from '@/providers/UserAuthProvider'
import { StaticLeaves } from '@/components/layout/staticLeaves'

interface Props {
  isOpen: boolean
  onCloseAction: () => void
}

const steps = ['birth', 'skin', 'concerns']

const skinTypes = [
  'normal',
  'oleosa',
  'acnéica',
  'mista',
  'madura',
  'seca'
]

const concernsList = [
  'acne',
  'manchas',
  'sensibilidade',
  'oleosidade',
  'poros',
  'linhas finas',
]

export default function OnboardingModal({ isOpen, onCloseAction }: Props) {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const {
    birthDate,
    setBirthDate,
    skinType,
    setSkinType,
    concerns,
    setConcerns,
    submitOnboarding,
    isSaving 
  } = useOnboarding()

  const { refreshProfile } = useAuth()

  const progress = ((step + 1) / steps.length) * 100

  let ageMessage = ''
  if (birthDate && birthDate.length === 10) {
    try {
      const age = differenceInYears(new Date(), parseISO(birthDate))
      if (age > 0 && age < 120) {
        ageMessage = `Legal, você tem ${age} anos.`
      }
    } catch (error) {
      console.error("Erro ao calcular idade:", error)
    }
  }

  function toggleSkinType(value: string) {
    if (skinType.includes(value)) {
      setSkinType(skinType.filter(v => v !== value))
    } else {
      if (skinType.length < 2) {
        setSkinType([...skinType, value])
      }
    }
  }

  function toggleConcern(value: string) {
    if (concerns.includes(value)) {
      setConcerns(concerns.filter(v => v !== value))
    } else {
      setConcerns([...concerns, value])
    }
  }

  async function nextStep() {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      setStep(3) 
      
      try {
        await submitOnboarding()
        await refreshProfile()
        
        setTimeout(() => {
          onCloseAction() 
          router.push('/')
        }, 3000)

      } catch (error) {
        console.error("Erro ao finalizar o onboarding:", error)
        setStep(2) 
      }
    }
  }

  function prevStep() {
    if (step > 0) setStep(step - 1)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="onboarding-overlay"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[110] bg-[#f0f5ed] overflow-y-auto no-scrollbar"
        >
          <div className="fixed inset-0 pointer-events-none z-0">
            <StaticLeaves />
          </div>

          <div className="relative z-10 w-full min-h-full p-4 md:p-6 py-6 md:py-10 flex items-center justify-center">
            
            <div className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[40px] p-6 md:p-8 flex flex-col h-fit relative">
              
              {step < 3 && !isSaving && (
                <button
                  onClick={onCloseAction}
                  className="absolute top-6 right-6 md:top-8 md:right-8 z-20 p-3 bg-white/70 backdrop-blur-sm rounded-full text-gray-400 border border-white hover:bg-white active:scale-95 transition-all shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="flex flex-col w-full animate-in fade-in duration-300">
                {step < 3 && (
                  <>
                    <div className="space-y-2 mb-6 pr-12">
                      <h2 className="text-xl font-semibold text-[#3a6b4d] font-poppins tracking-tight mt-2">
                        Personalizar Experiência
                      </h2>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={prevStep}
                          className={`p-1 rounded-full hover:bg-white/60 text-[#5f8c73] transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <p className="text-[#5f8c73] text-[10px] font-bold uppercase tracking-[0.1em] flex items-center">
                          PASSO {Math.min(step + 1, steps.length)} DE {steps.length}
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-white/50 mb-8 overflow-hidden shadow-inner">
                      <motion.div animate={{ width: `${progress}%` }} className="h-full bg-[#3a6b4d]" />
                    </div>
                  </>
                )}

                {/* CONTEÚDO */}
                <div className="flex flex-col w-full">
                  {step === 0 && (
                    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
                      <p className="text-[#5f8c73] text-sm text-center mb-12 font-medium">
                        Me responde umas perguntinhas? < br/>
                        Pometo que leva menos de <b>30 segundos</b> e vai nos ajudar a te oferecer recomendações mais inteligentes.
                      </p>
                      <div className="w-full">
                        <label className="text-[12px] font-black text-[#3a6b4d]/80 uppercase tracking-[0.2em] pl-1 block mb-3 text-center">
                          Data de nascimento
                        </label>
                        <div className="relative w-full">
                          <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full appearance-none bg-white/80 border-2 border-white/80 shadow-md text-gray-500 font-medium px-6 py-4 rounded-2xl focus:outline-none focus:border-[#8ec5a0] focus:ring-4 focus:ring-[#8ec5a0]/20 transition-all text-center"
                          />
                        </div>
                        <div className="h-8 mt-4 flex items-center justify-center">
                          {ageMessage && (
                            <p className="text-sm text-[#3a6b4d] font-bold animate-in fade-in slide-in-from-bottom-2 duration-300">
                              {ageMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="flex flex-col w-full">
                      <h4 className="text-[10px] font-black text-[#3a6b4d]/80 uppercase tracking-[0.2em] pl-1 mb-4">
                        Qual é o seu tipo de pele? (Até 2)
                      </h4>
                      <div className="grid grid-cols-2 gap-3 w-full">
                        {skinTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => toggleSkinType(type)}
                            className={`p-4 rounded-[20px] text-sm font-bold capitalize transition-all active:scale-95 border-2 shadow-sm ${
                              skinType.includes(type)
                                ? 'bg-[#3a6b4d]/70 text-white'
                                : 'bg-[#3a6b4d]/4 border-white text-gray-500 hover:border-[#8ec5a0]'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex flex-col w-full">
                      <h4 className="text-[10px] font-black text-[#3a6b4d]/80 uppercase tracking-[0.2em] pl-1 mb-4">
                        Principais Queixas
                      </h4>
                      <div className="grid grid-cols-2 gap-3 w-full">
                        {concernsList.map(item => (
                          <button
                            key={item}
                            onClick={() => toggleConcern(item)}
                            className={`p-4 rounded-[20px] text-sm font-bold capitalize transition-all active:scale-95 border-2 shadow-sm ${
                              concerns.includes(item)
                                ? 'bg-[#3a6b4d]/70 text-white'
                                : 'bg-[#3a6b4d]/4 border-white text-gray-500 hover:border-[#8ec5a0]'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto py-10">
                      <div className="w-24 h-24 rounded-full bg-[#3a6b4d] flex items-center justify-center mb-8 animate-in zoom-in duration-500 shadow-[0_10px_30px_rgba(58,107,77,0.3)] border-4 border-white">
                        <Check className="w-12 h-12 text-white" strokeWidth={3} />
                      </div>
                      <h2 className="text-3xl font-bold text-[#3a6b4d] mb-4">Tudo Certo!</h2>
                      <p className="text-[#5f8c73] text-base font-medium">
                        Agora podemos oferecer recomendações mais personalizadas para sua rotina de skincare.
                      </p>
                      {isSaving && (
                        <div className="mt-8 flex items-center justify-center gap-2 text-[#3a6b4d]/60 text-sm font-bold">
                          
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* BOTÕES DE AÇÃO */}
                {step < 3 && (
                  <div className="pt-8 w-full border-t border-white/50 mt-6">
                    {step === 0 && (
                      // FORÇANDO FLEX-ROW: Botões lado a lado idênticos à referência (image_b979f9.png)
                      <div className="flex flex-row items-center justify-between gap-3 w-full">
                        <button
                          onClick={onCloseAction}
                          className="flex-1 h-14 bg-white/70 border-white text-gray-500 hover:bg-white rounded-2xl font-bold text-lg shadow-md border-1 transition-all active:scale-95"
                        >
                          Mais tarde
                        </button>
                        <button
                          onClick={nextStep}
                          className="flex-1 h-14 bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white rounded-2xl font-bold text-lg shadow-md transition-transform active:scale-95"
                        >
                          Continuar
                        </button>
                      </div>
                    )}

                    {step > 0 && (
                      <button
                        onClick={nextStep}
                        disabled={isSaving}
                        className="w-full h-16 bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white rounded-2xl font-bold text-lg shadow-2xl shadow-[#3a6b4d]/20 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-70"
                      >
                        {isSaving ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Salvando...</>
                        ) : (
                          step === steps.length - 1 ? 'Finalizar' : 'Próximo'
                        )}
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}