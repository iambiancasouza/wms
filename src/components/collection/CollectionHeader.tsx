'use client'

import { useState, Suspense, useCallback, memo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, ChevronDown, X, ArrowLeft, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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

const CategoryMenu = memo(
  ({
    isOpen,
    onClose,
    currentCategory,
    onSelect
  }: {
    isOpen: boolean
    onClose: () => void
    currentCategory: string
    onSelect: (categoryId: string) => void
  }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-[100] flex justify-end md:justify-center items-end md:items-center">
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onClose}
        />
        <div className="relative w-full md:w-[400px] bg-white rounded-t-[32px] md:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300 md:animate-in md:zoom-in-95 max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b pb-4">
            <h3 className="text-lg font-bold text-[#3a6b4d]">
              Filtrar Produtos
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 space-y-2 pr-2 custom-scrollbar">
            {Category.map(cat => {
              const isSelected = currentCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelect(cat.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-gray-50 border-[#8ec5a0] text-[#3a6b4d] font-bold shadow-sm'
                      : 'bg-white border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)

CategoryMenu.displayName = 'CategoryMenu'

function CollectionHeaderContent() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)

  const isProducts = pathname.includes('/collection/products')
  const isProcedures = pathname.includes('/collection/procedures')
  const isNewProduct = pathname.includes('/collection/newProduct')

  const currentCategory = searchParams.get('category') || 'all'

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) params.set('q', term)
      else params.delete('q')
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('category', categoryId)
      router.push(`${pathname}?${params.toString()}`)
      setTimeout(() => setIsCategoryMenuOpen(false), 150)
    },
    [pathname, router, searchParams]
  )

  const toggleCategoryMenu = useCallback(() => {
    setIsCategoryMenuOpen(prev => !prev)
  }, [])

  const closeCategoryMenu = useCallback(() => {
    setIsCategoryMenuOpen(false)
  }, [])

  if (isNewProduct) return null

  return (
    <>
      <div className="pt-6 pb-6 w-full z-10">
        <div className="container mx-auto px-4 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link href="/" aria-label="Voltar para home">
              <ArrowLeft className="w-5 h-5 text-[#3a6b4d]" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-[#3a6b4d] font-poppins tracking-tight">
              Minha Coleção
            </h1>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a6b4d]/70" />
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
                className="rounded-full bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white shadow-sm w-10 h-10 transition-all hover:scale-105 active:scale-95"
                aria-label="Adicionar novo produto"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="w-full bg-[#3a6b4d]/5 backdrop-blur-md p-1 rounded-2xl flex shadow-sm border border-[#3a6b4d]/10 relative z-20">
            <button
              onClick={
                isProducts
                  ? toggleCategoryMenu
                  : () => router.push('/collection/products')
              }
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center ${
                isProducts
                  ? 'bg-white text-[#3a6b4d] shadow-sm'
                  : 'text-[#3a6b4d]/60 hover:text-[#3a6b4d] hover:bg-[#3a6b4d]/10'
              }`}
              aria-expanded={isCategoryMenuOpen}
              aria-haspopup="true"
            >
              Produtos
              {isProducts && (
                <ChevronDown
                  className={`ml-1.5 w-4 h-4 transition-transform duration-300 ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
                />
              )}
            </button>
            <Link
              href="/collection/procedures"
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 text-center flex items-center justify-center ${
                isProcedures
                  ? 'bg-white text-[#3a6b4d] shadow-sm'
                  : 'text-[#3a6b4d]/60 hover:text-[#3a6b4d] hover:bg-[#3a6b4d]/10'
              }`}
            >
              Procedimentos
            </Link>
          </div>
        </div>
      </div>

      <CategoryMenu
        isOpen={isCategoryMenuOpen && isProducts}
        onClose={closeCategoryMenu}
        currentCategory={currentCategory}
        onSelect={handleCategorySelect}
      />
    </>
  )
}

export const CollectionHeader = memo(function CollectionHeader() {
  return (
    <Suspense
      fallback={<div className="h-[120px] w-full bg-gray-50 animate-pulse" />}
    >
      <CollectionHeaderContent />
    </Suspense>
  )
})
