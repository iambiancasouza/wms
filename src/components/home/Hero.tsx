'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FallingLeaves } from '@/components/layout/fallingLeaves'
import { useAuth } from '@/hooks/useAuth'

export function Hero() {
  const router = useRouter()
  const { isLoading, isLoggedIn } = useAuth()

  const handleMainAction = () => {
    if (isLoggedIn) {
      router.push('/')
    } else {
      router.push('/auth/sign-up')
    }
  }
  // mt-[68px]
  return (
    <section className="relative w-full min-h-[calc(100dvh-70px)]  flex items-center justify-center">
      <div className="absolute -top-[400px] bottom-0 inset-x-0 pointer-events-none z-0 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
        <FallingLeaves />
      </div>
      <div className="container mx-auto px-6 md:px-8 lg:px-16 relative z-10 w-full py-10 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full">
          <div className="flex flex-col items-center lg:items-start space-y-4 lg:space-y-6 text-center lg:text-left w-full">
            <div className="space-y-2">
              <h2 className="text-base md:text-lg font-medium text-gray-600">
                bem vindo ao
              </h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal font-poppins leading-tight">
                <span className="bg-gradient-to-r from-[#8ec5a0] via-[#5a9e74] to-[#3a6b4d] text-transparent bg-clip-text">
                  Where&#39;s my
                  <br />
                  skincare
                </span>
              </h1>
            </div>
            <p className="text-base md:text-lg text-gray-500 max-w-lg leading-relaxed">
              O seu auto cuidado em um só lugar
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto justify-center lg:justify-start">
              <button
                onClick={handleMainAction}
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-[#8ec5a0] to-[#3a6b4d] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-70 cursor-pointer"
              >
                {isLoading
                  ? 'Carregando...'
                  : isLoggedIn
                    ? 'Cadastrar Produto'
                    : 'Começar Agora'}
              </button>
              <button className="w-full sm:w-auto border-2 border-[#5a9e74] text-[#3a6b4d] px-8 py-3 rounded-xl font-bold transition-all active:scale-95 cursor-pointer">
                Saber Mais
              </button>
            </div>
          </div>
          <div className="hidden lg:flex relative items-center justify-center w-full min-h-[500px]">
            <div className="relative w-full max-w-[320px] xl:max-w-[380px] aspect-[4/5] bg-gray-100 rounded-t-full shadow-2xl overflow-hidden isolate">
              <Image
                src="/skincare.png"
                alt="Produtos de Skincare"
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}