import { X } from 'lucide-react'
import Link from 'next/link'

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sectionName: string;
}

export function AuthDrawer({ isOpen, onClose, sectionName }: AuthDrawerProps) {
  
  const mensagensPersonalizadas: Record<string, string> = {
    'Favoritos': 'Faça login ou crie sua conta para ver seus favoritos.',
    'Rotina': 'Faça login ou crie sua conta para registrar sua rotina.',
    'Coleção': 'Faça login ou crie sua conta para ver seu arsenal de auto-cuidado.',
    'Meu perfil': 'Faça login ou crie sua conta para acessar seu perfil.'
  }

  const mensagem = mensagensPersonalizadas[sectionName] || 'Para acessar essa seção, faça login ou crie sua conta. :)'

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[105] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-[110] bg-white/30 backdrop-blur-2xl border-t border-white/60 rounded-t-3xl p-7 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] ring-1 ring-inset ring-white/50 transform transition-transform duration-500 ease-out ${
          isOpen
            ? 'translate-y-0 pointer-events-auto'
            : 'translate-y-full pointer-events-none'
        }`}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-[#3a6b4d] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-5 mt-1">
          <div className="w-12 h-1 bg-gray-400/40 rounded-full mb-4" /> 
          
          <h2 className="text-xl font-bold text-[#3a6b4d] mt-1 font-poppins">Acesse sua conta</h2>
          
          <p className="text-sm text-gray-600 font-medium px-4">
            {mensagem}
          </p>

          <div className="w-full space-y-4 mt-6 pt-3">
            <Link 
              href="/auth/login" 
              onClick={onClose} 
              className="w-full flex justify-center bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white rounded-xl py-4 font-bold shadow-lg shadow-[#3a6b4d]/50 transition-all active:scale-95"
            >
              Fazer Login
            </Link>
            <Link 
              href="/auth/sign-up" 
              onClick={onClose} 
              className="w-full flex justify-center border-2 border-[#5a9e74] text-[#3a6b4d] hover:bg-[#f0f5ed] bg-white/40 rounded-xl py-3 font-bold transition-all active:scale-95"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
