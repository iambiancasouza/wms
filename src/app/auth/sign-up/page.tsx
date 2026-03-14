"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { StaticLeaves } from "@/components/layout/staticLeaves"

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Erro Google:", error)
      showToast.error("Erro ao iniciar login com Google")
      setIsGoogleLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      })

      if (error) throw error
      
      router.push("/")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast.error(error.message || "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    /* fixed inset-0 trava a tela completamente. pb-16 compensa a BottomNavbar */
    <div className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-[#f0f5ed] px-4 pb-16 md:pb-0">
      
      <StaticLeaves />

      {/* Cartão Principal (Padronizado com AuthDrawer) */}
      <div className="relative z-10 w-full max-w-[400px] bg-white/30 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.1)] ring-1 ring-inset ring-white/50 animate-in fade-in zoom-in-95 duration-500">
        
        {/* CABEÇALHO (Seta + Textos alinhados) */}
        <div className="relative w-full mb-6 flex flex-col items-center">
          <Link 
            href="/" 
            className="absolute left-0 top-0 p-2 rounded-full transition-colors text-gray-500 hover:text-[#3a6b4d] bg-white/30 hover:bg-white/50 backdrop-blur-md"
            title="Voltar para Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="text-center px-3">
            <h1 className="text-2xl font-bold text-[#3a6b4d] font-poppins pt-1">Crie sua conta</h1>
            <p className="text-sm text-gray-500 font-normal mt-1">Para organizar sua rotina de autocuidado.</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 rounded-xl bg-white/50 backdrop-blur-md border border-[#5e9873]/20 ring-1 ring-inset ring-white/60 shadow-[0_4px_10px_rgba(0,0,0,0.05)] text-gray-700 font-bold hover:bg-white/70 hover:shadow-[0_6px_15px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-[#3a6b4d]" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            <span>Continuar com Google</span>
          </Button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#5e9873]/20" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold">
              <span className="bg-[#eaf0e8] px-3 text-gray-500 rounded-full ring-1 ring-[#5e9873]/10">Ou com email</span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="space-y-1">
              <Label className="text-[#3a6b4d] text-[11px] font-bold uppercase tracking-wider ml-1">Nome</Label>
              <Input 
                placeholder="Como quer ser chamado?" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full h-11 px-4 rounded-xl bg-white/40 backdrop-blur-md border border-[#5e9873]/30 ring-1 ring-inset ring-[#5e9873]/20 text-gray-800 placeholder:text-gray-400 shadow-sm focus:bg-white/60 focus:ring-2 focus:ring-[#3a6b4d]/40 focus:border-transparent outline-none transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[#3a6b4d] text-[11px] font-bold uppercase tracking-wider ml-1">Email</Label>
              <Input 
                type="email" 
                placeholder="seu@email.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full h-11 px-4 rounded-xl bg-white/40 backdrop-blur-md border border-[#5e9873]/30 ring-1 ring-inset ring-[#5e9873]/20 text-gray-800 placeholder:text-gray-400 shadow-sm focus:bg-white/60 focus:ring-2 focus:ring-[#3a6b4d]/40 focus:border-transparent outline-none transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[#3a6b4d] text-[11px] font-bold uppercase tracking-wider ml-1">Senha</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha segura" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full h-11 px-4 pr-11 rounded-xl bg-white/40 backdrop-blur-md border border-[#5e9873]/30 ring-1 ring-inset ring-[#5e9873]/20 text-gray-800 placeholder:text-gray-400 shadow-sm focus:bg-white/60 focus:ring-2 focus:ring-[#3a6b4d]/40 focus:border-transparent outline-none transition-all duration-300"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#3a6b4d] transition-colors outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 mt-2 flex items-center justify-center rounded-xl bg-[#3a6b4d] ring-1 ring-inset ring-white/30 shadow-lg shadow-[#3a6b4d]/30 text-white font-bold text-base hover:bg-[#2a4f3a] hover:shadow-[#3a6b4d]/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Criar Conta"}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600 font-medium">
            Já tem uma conta?{" "}
            <Link href="/auth/login" className="font-bold text-[#3a6b4d] hover:underline transition-all">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
