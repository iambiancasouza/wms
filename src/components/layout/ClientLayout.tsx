'use client'

import { useState, Suspense, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, ChevronDown, X, ArrowLeft, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StaticLeaves } from '@/components/layout/staticLeaves'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/navbar'

// --- CONFIGURAÇÃO DAS CATEGORIAS ---
const Category = [
  { id: 'all', label: 'Todos', icon: '✨' },
  { id: 'limpeza', label: 'Limpeza', icon: '🧼' },
  { id: 'tonico', label: 'Tônico/Essence', icon: '💧' },
  { id: 'hidratacao', label: 'Hidratação', icon: '🧴' },
  { id: 'antioxidante', label: 'Antioxidante', icon: '🍊' },
  { id: 'tratamento', label: 'Tratamento/Slow-aging', icon: '🧪' },
  { id: 'barreira', label: 'Barreira/Reparador', icon: '🛡️' },
  { id: 'protecao', label: 'Protetor', icon: '☀️' },
  { id: 'olhos', label: 'Área dos Olhos', icon: '👁️' },
  { id: 'beauty_tech', label: 'Dispositivo', icon: '⚡' }
]

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- LÓGICA DE ROTAS ---
  const isHome = pathname === '/'
  const isCollectionRoot = pathname.startsWith('/collection')
  const isProducts = pathname.includes('/collection/products')
  const isProcedures = pathname.includes('/collection/procedures')

  const hideHeader =
    pathname.includes('/collection/newProduct') || isHome || !isCollectionRoot

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const currentCategory = searchParams.get('category') || 'all'

  // --- RESETA INPUTS GLOBAIS ---
  useEffect(() => {
    const handleGlobalFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement
      if (
        target.tagName === 'INPUT' &&
        (target.type === 'text' || target.type === 'search')
      ) {
        target.value = ''
      }
    }
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement
      if (e.key === 'Enter' && target.tagName === 'INPUT') {
        setTimeout(() => {
          target.value = ''
          target.blur()
        }, 50)
      }
    }
    document.addEventListener('focusin', handleGlobalFocus)
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      document.removeEventListener('focusin', handleGlobalFocus)
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [])

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleCategorySelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', categoryId)
    router.push(`${pathname}?${params.toString()}`)
    setTimeout(() => setIsCategoryMenuOpen(false), 150)
  }

  return (
    <div className="relative min-h-[100dvh] w-full pb-4 overflow-x-hidden flex flex-col">
      {/* A Navbar aparece em todas as telas */}

      {/* Esconde a Navbar se estiver na rota /quiz */}
      {pathname !== '/quiz' && <Navbar />}
      {/* CABEÇALHO DA COLEÇÃO (Busca + Filtros) */}
      {!hideHeader && (
        <div className="pt-8">
          <StaticLeaves />
          <div className="relative z-10 container mx-auto px-4 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link href="/">
                <ArrowLeft className="w-5 h-5 text-[#3a6b4d]" />
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-[#3a6b4d] font-poppins tracking-tight">
                Minha Coleção
              </h1>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a6b4d]/70">
                  <Search className="w-4 h-4" />
                </div>
                <Input
                  placeholder="Buscar..."
                  className="w-full h-10 pl-10 rounded-full border-none bg-white/80 shadow-sm placeholder:text-gray-400 focus:ring-[#3a6b4d]/10 text-sm transition-all hover:bg-white"
                  defaultValue={searchParams.get('q')?.toString()}
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
              <Link href="/collection/newProduct">
                <Button
                  size="icon"
                  className="rounded-full bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white shadow-sm w-10 h-10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative z-10 container mx-auto px-4 mb-6">
            <div className="w-full bg-[#3a6b4d]/5 backdrop-blur-md p-1 rounded-2xl flex shadow-sm border border-[#3a6b4d]/10">
              <div
                onClick={() =>
                  isProducts
                    ? setIsCategoryMenuOpen(!isCategoryMenuOpen)
                    : router.push('/collection/products')
                }
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors duration-200 text-center cursor-pointer flex items-center justify-center ${
                  isProducts
                    ? 'bg-white opacity-70 text-[#3a6b4d] shadow-sm'
                    : 'text-[#3a6b4d]/60 hover:text-[#3a6b4d] hover:bg-[#3a6b4d]/10'
                }`}
              >
                Produtos
                <div
                  className={`w-0 overflow-visible flex justify-start transition-opacity duration-200 ${
                    isProducts ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <ChevronDown
                    className={`ml-1.5 w-4 h-4 shrink-0 transition-transform duration-300 ${
                      isCategoryMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
              <Link
                href="/collection/procedures"
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 text-center ${
                  isProcedures
                    ? 'bg-white opacity-70 text-[#3a6b4d] shadow-sm'
                    : 'text-[#3a6b4d]/60 hover:text-[#3a6b4d] hover:bg-[#3a6b4d]/10'
                }`}
              >
                Procedimentos
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div className={`relative flex-1`}>{children}</div>

      {/* MODAL DE CATEGORIAS */}
      {isCategoryMenuOpen && isProducts && (
        <div className="fixed inset-0 z-[100] flex justify-end md:justify-center items-end md:items-center">
          <div
            className="absolute inset-0 glass-overlay animate-in fade-in duration-300"
            onClick={() => setIsCategoryMenuOpen(false)}
          />
          <div className="relative w-full md:w-[400px] bg-white/40 rounded-t-[32px] md:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300 md:animate-in md:zoom-in-95 max-h-[80vh] flex flex-col overscroll-contain">
            <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-2">
              <h3 className="text-lg font-bold text-[#3a6b4d]">
                Filtrar Produtos
              </h3>
              <button
                onClick={() => setIsCategoryMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100/40 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-2 pr-2">
              {Category.map(cat => {
                const isSelected = currentCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full flex items-center justify-between p-1 rounded-xl border shadow-md backdrop-blur-lg transition-all duration-200 group ${
                      isSelected
                        ? 'bg-white/70 border-[#3a6b4d]/20 text-gray-600 shadow-md'
                        : 'bg-white/40 border-transparent text-gray-600 hover:bg-white/70 hover:border-[#3a6b4d]/20 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4 p-2">
                      <div className="pl-2">{cat.icon}</div>
                      <span className="font-medium text-x">{cat.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <Toaster
        position="top-center"
        richColors={false}
        theme="light"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              'backdrop-blur-xl shadow-xl rounded-[24px] p-4 flex items-center gap-3 w-full md:min-w-[356px] border font-sans transition-all duration-300',
            title: 'font-bold text-sm',
            description: 'text-xs opacity-90',
            success: 'bg-[#3a6b4d]/95 border-[#3a6b4d] text-[#1a3322]',
            error: 'bg-[#1a3322]/95 border-[#1a3322] text-[#f2fcf5]',
            default: 'bg-[#f0fdf4]/90 border-[#8ec5a0]/30 text-[#2f5e42]'
          }
        }}
      />
    </div>
  )
}

export default function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  )
}
