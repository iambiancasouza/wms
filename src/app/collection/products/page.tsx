'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Package, Plus, ArrowUp, Loader2 } from 'lucide-react'

import { EditProductModal } from '@/components/modals/EditProductModal'
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal'
import { ProductCard } from '@/components/collection/ProductCard'

import { useProducts } from '@/hooks/useProducts'

function ProductsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const selectedCategory = searchParams.get('category') || 'all'

  const {
    filteredProducts,
    isLoading,
    editingProduct,
    setEditingProduct,
    deletingProduct,
    setDeletingProduct,
    showScrollTop,
    scrollToTop,
    fetchProducts,
    confirmDelete,
    toggleFavorite
  } = useProducts(query, selectedCategory)

  return (
    <div className="container mx-auto px-4 pb-20 mt-4">
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={fetchProducts}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={confirmDelete}
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 justify-items-center">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Package className="w-8 h-8 text-gray-300" />
          </div>

          <h3 className="text-lg font-bold text-gray-600">
            Nenhum produto encontrado
          </h3>

          <p className="text-sm text-gray-400 mb-6">
            {selectedCategory === 'all'
              ? 'Comece adicionando itens à sua coleção.'
              : 'Não há itens nesta categoria.'}
          </p>

          <Link href="/collection/newProduct">
            <Button className="bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white rounded-full px-8">
              Adicionar Novo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 animate-in fade-in duration-500">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleFavorite={toggleFavorite}
              onEdit={setEditingProduct}
              onDelete={setDeletingProduct}
            />
          ))}

          <Link href="/collection/newProduct" className="w-full aspect-[3/4]">
            <div className="group w-full h-full rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#3a6b4d] bg-white/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-gray-200 group-hover:bg-[#3a6b4d]/10 flex items-center justify-center transition-colors">
                <Plus className="h-6 w-6 text-gray-400 group-hover:text-[#3a6b4d]" />
              </div>

              <span className="text-xs font-bold text-gray-400 group-hover:text-[#3a6b4d] uppercase tracking-wide">
                Adicionar
              </span>
            </div>
          </Link>
        </div>
      )}

      <button
        onClick={scrollToTop}
        className={`fixed bottom-[68px] right-8 z-20 p-3 rounded-full shadow-xl bg-[#8ec5a0] text-white hover:bg-[#5a9e74]/10 hover:scale-110 transition-all duration-300 border border-white/20 ${
          showScrollTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        title="Voltar ao topo"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#3a6b4d]" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}