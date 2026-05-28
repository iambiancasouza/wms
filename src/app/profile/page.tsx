'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Camera,
  Image as ImageIcon,
  LogOut,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StaticLeaves } from '@/components/layout/staticLeaves'
import { useAuth } from '@/providers/UserAuthProvider'
import { showToast } from '@/providers/ToasterProvider'
import {
  removeProfileAvatar,
  updateProfileAvatar
} from '@/services/profile.service'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, userName, supabase, refreshProfile } = useAuth()
  const libraryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false)

  const hasAvatar = Boolean(profile?.avatar_url)
  const isLoggedIn = Boolean(user)

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // router.push('/')
    router.refresh()
  }

  const handleAvatarPress = () => {
    if (!isLoggedIn) {
      handleLogin()
      return
    }

    setIsPhotoMenuOpen(true)
  }

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await updateProfileAvatar(file)
      await refreshProfile()
      showToast.success('Foto atualizada com sucesso.')
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error)
      showToast.error('Não foi possível atualizar a foto.')
    } finally {
      event.target.value = ''
      setIsPhotoMenuOpen(false)
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      await removeProfileAvatar()
      await refreshProfile()
      showToast.success('Foto removida com sucesso.')
    } catch (error) {
      console.error('Erro ao remover avatar:', error)
      showToast.error('Não foi possível remover a foto.')
    } finally {
      setIsPhotoMenuOpen(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f0f5ed]">
      <div className="fixed inset-0 pointer-events-none z-0">
        <StaticLeaves />
      </div>

      <div className="relative z-10 container mx-auto px-5 pt-8 pb-24">
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <section className="relative overflow-hidden rounded-[40px] border border-white/80 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-[#f7fbf5]/60 to-[#edf5ea]/80" />
            <div className="relative p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleAvatarPress}
                    className="relative w-20 h-20 rounded-[28px] overflow-hidden border border-white/80 bg-white shadow-lg flex items-center justify-center shrink-0 active:scale-95 transition-transform cursor-pointer"
                    aria-label="Alterar foto do perfil"
                  >
                    {hasAvatar ? (
                      <Image
                        src={profile?.avatar_url || ''}
                        alt={userName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#3a6b4d]/15 flex items-center justify-center text-[#3a6b4d]">
                        <Upload className="w-6 h-6" />
                      </div>
                    )}
                  </button>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#5f8c73]/60">
                      Meu perfil
                    </p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#3a6b4d] font-poppins tracking-tight">
                      {profile?.full_name || userName || 'Visitante'}
                    </h1>
                    <p className="text-sm text-[#5f8c73]">
                      {user?.email || 'Nenhum email informado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/80 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#3a6b4d]/50">
                  Informações
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white/70 border border-white px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5f8c73]/60">
                  Nome
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  {profile?.full_name || userName || 'Visitante'}
                </p>
              </div>

              <div className="rounded-2xl bg-white/70 border border-white px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5f8c73]/60">
                  Email
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500 break-all">
                  {user?.email || 'Não informado'}
                </p>
              </div>
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

      {isPhotoMenuOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/35 backdrop-blur-sm flex items-center justify-center px-5"
          onClick={() => setIsPhotoMenuOpen(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-[34px] bg-[#4a4a4a]/25 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] border border-white/10 overflow-hidden backdrop-blur-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-white/10">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.22em] text-white/45">
                  Foto do perfil
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 active:scale-95"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 space-y-1">
              <button
                type="button"
                onClick={() => libraryInputRef.current?.click()}
                className="w-full flex items-center gap-4 rounded-[24px] px-4 py-4 bg-white/6 hover:bg-white/12 transition-colors text-left active:scale-[0.99]"
              >
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-[22px] h-[22px]" strokeWidth={1.9} />
                </div>
                <div>
                  <p className="text-[17px] leading-none font-normal tracking-[-0.01em]">
                    Escolher da galeria
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center gap-4 rounded-[24px] px-4 py-2 bg-white/6 hover:bg-white/12 transition-colors text-left active:scale-[0.99]"
              >
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Camera className="w-[22px] h-[22px]" strokeWidth={1.9} />
                </div>
                <div>
                  <p className="text-[17px] leading-none font-normal tracking-[-0.01em]">
                    Usar a câmera
                  </p>
                </div>
              </button>

              {hasAvatar && (
                <button
                  type="button"
                  onClick={() => void handleRemoveAvatar()}
                  className="w-full flex items-center gap-4 rounded-[24px] px-4 py-4 bg-white/6 hover:bg-white/12 transition-colors text-left active:scale-[0.99]"
                >
                  <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Trash2 className="w-[22px] h-[22px]" strokeWidth={1.9} />
                  </div>
                  <div>
                    <p className="text-[17px] leading-none font-normal tracking-[-0.01em]">
                      Apagar a foto atual
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <input
        ref={libraryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleAvatarChange}
      />
    </div>
  )
}
