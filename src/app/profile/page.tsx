'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Sparkles, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StaticLeaves } from '@/components/layout/staticLeaves'
import { useAuth } from '@/providers/UserAuthProvider'

export default function ProfilePage() {
  const router = useRouter()
  const { user, userName, supabase } = useAuth()
  const isLoggedIn = Boolean(user)

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f0f5ed]">
      <div className="fixed inset-0 pointer-events-none z-0">
        <StaticLeaves />
      </div>

      <div className="relative z-10 container mx-auto px-5 pt-8 pb-24">
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <section className="relative overflow-hidden rounded-[40px] border border-white/80 bg-white/65 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-[#f7fbf5]/60 to-[#edf5ea]/80" />
            <div className="relative p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-[28px] border border-white/80 bg-white shadow-lg flex items-center justify-center shrink-0">
                    <UserRound className="w-8 h-8 text-[#3a6b4d]" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#5f8c73]/60">
                      Meu perfil
                    </p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#3a6b4d] font-poppins tracking-tight">
                      {userName || 'Visitante'}
                    </h1>
                    <p className="text-sm text-[#5f8c73]">
                      {isLoggedIn ? user?.email : 'Nenhuma sessão ativa'}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#dbe7d4] bg-white/75 px-4 py-2 text-[#3a6b4d] shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Em desenvolvimento
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/80 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-3">
              <div className=" px-2 py-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5f8c73]/60">
                  Status
                </p>
                <p className="mt-2 text-sm font-medium text-gray-400">
                  Esta área ainda está sendo construída. <br/>Em breve você poderá
                  editar seus dados por aqui.
                </p>
            </div>
          </section>

          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              className="w-full h-12 rounded-2xl bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white shadow-lg shadow-[#3a6b4d]/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              className="w-full h-12 rounded-2xl bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white shadow-lg shadow-[#3a6b4d]/20"
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
