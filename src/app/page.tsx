// 'use client'

// import { useRouter } from 'next/navigation'
// import Image from 'next/image'
// import { FallingLeaves } from '@/components/layout/fallingLeaves'
// import { useAuth } from '@/hooks/useAuth'

// export default function Home() {
//   const router = useRouter()
//   const { isLoading, isLoggedIn } = useAuth()

//   const handleMainAction = () => {
//     if (isLoggedIn) {
//       router.push('/collection/newProduct')
//     } else {
//       router.push('/auth/sign-up')
//     }
//   }

//   return (
//     <main className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-[#f0f5ed] md:pb-0">
//       <FallingLeaves />

//       {/* Container principal centralizado */}
//       <div className="container mx-auto px-6 md:px-8 lg:px-16 relative z-10 w-full">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full">
//           {/* Lado Esquerdo: Textos e Botões */}
//           <div className="flex flex-col items-center lg:items-start space-y-4 lg:space-y-6 text-center lg:text-left w-full">
//             <div className="space-y-2">
//               <h2 className="text-base md:text-lg font-medium text-gray-600">
//                 bem vindo ao
//               </h2>
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal font-poppins leading-tight">
//                 <span className="bg-gradient-to-r from-[#8ec5a0] via-[#5a9e74] to-[#3a6b4d] text-transparent bg-clip-text">
//                   Where&#39;s my
//                   <br />
//                   skincare
//                 </span>
//               </h1>
//             </div>

//             <p className="text-base md:text-lg text-gray-500 max-w-lg leading-relaxed">
//               O seu auto cuidado em um só lugar
//             </p>

//             <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto justify-center lg:justify-start">
//               <button
//                 onClick={handleMainAction}
//                 disabled={isLoading}
//                 className="w-full sm:w-auto bg-gradient-to-r from-[#8ec5a0] to-[#3a6b4d] hover:from-[#7db58f] hover:to-[#2a5b3d] text-white px-8 py-3 rounded-xl font-bold text-base md:text-lg transition-all cursor-pointer shadow-lg shadow-[#3a6b4d]/20 active:scale-95 disabled:opacity-70 min-w-[200px]"
//               >
//                 {isLoading
//                   ? 'Carregando...'
//                   : isLoggedIn
//                     ? 'Cadastrar Produto'
//                     : 'Começar Agora'}
//               </button>

//               <button className="w-full sm:w-auto border-2 border-[#5a9e74] text-[#3a6b4d] hover:bg-[#f0f5ed] bg-transparent px-8 py-3 rounded-xl font-bold text-base md:text-lg transition-all cursor-pointer active:scale-95">
//                 Saber Mais
//               </button>
//             </div>
//           </div>

//           {/* Lado Direito: Imagem do Arco (Apenas Desktop) */}
//           {/* Lado Direito: Imagem do Arco (Apenas Desktop/Telas Maiores) */}
//           <div className="hidden lg:flex relative items-center justify-center w-full min-h-[500px]">
//             {/* Substituí w-auto por w-full max-w para garantir que o arco tenha largura física */}
//             <div className="relative w-full max-w-[320px] xl:max-w-[380px] aspect-[4/5] bg-gray-100 rounded-t-full shadow-2xl overflow-hidden isolate">
//               <Image
//                 src="/skincare.png"
//                 alt="Produtos de Skincare"
//                 fill
//                 sizes="(max-width: 1024px) 100vw, 400px"
//                 className="object-cover"
//                 priority
//               />
//               {/* Efeito de brilho e borda premium padronizados */}
//               <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none"></div>
//               <div className="absolute -inset-1 border border-[#a8d2b5]/30 -z-10 rounded-t-full"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }


// src/app/page.tsx
import { Hero } from '@/components/home/Hero'

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
     
    </main>
  )
}