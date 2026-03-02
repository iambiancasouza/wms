'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Package, Plus, ArrowUp } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types/product'

import { EditProductModal } from '@/components/collection/modals/EditProductModal'
import { DeleteConfirmModal } from '@/components/collection/modals/DeleteConfirmModal'
import { ProductCard } from '@/components/collection/ProductCard'


export default function ProductsPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const selectedCategory = searchParams.get('category') || 'all'

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setProducts(data || [])
    } catch {
      toast.error('Erro ao carregar coleção')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const confirmDelete = async () => {
    if (!deletingProduct) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      let durationMsg = ''

      if (user) {
        let diffDays = 0
        if (deletingProduct.opened_at) {
          const start = new Date(deletingProduct.opened_at)
          const diffTime = Math.abs(new Date().getTime() - start.getTime())
          diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          durationMsg = `Duração: ${diffDays} dias.`
        }
        await supabase.from('finished_products').insert({
          user_id: user.id, name: deletingProduct.name, brand: deletingProduct.brand,
          image_url: deletingProduct.image_url, category: deletingProduct.category,
          started_at: deletingProduct.opened_at, finished_at: new Date().toISOString(),
          duration_days: diffDays > 0 ? diffDays : null, review: deletingProduct.review
        })
      }

      if (deletingProduct.quantity > 1) {
        const newQty = deletingProduct.quantity - 1
        await supabase.from('products').update({
          quantity: newQty, status: 'closed', opened_at: null, expiry_date: null
        }).eq('id', deletingProduct.id)
        
        setProducts(current => current.map(p => p.id === deletingProduct.id 
          ? { ...p, quantity: newQty, status: 'closed', opened_at: null, expiry_date: null } : p))
        toast.success(`1 unidade finalizada. ${durationMsg || 'Estoque atualizado.'}`)
      } else {
        await supabase.from('products').delete().eq('id', deletingProduct.id)
        setProducts(products.filter(p => p.id !== deletingProduct.id))
        toast.success(`Produto finalizado! ${durationMsg}`)
      }
    } catch (error) {
      toast.error('Erro ao processar')
      console.log(error)
    } finally {
      setDeletingProduct(null)
    }
  }

  // Lógica de Favoritar
  const toggleFavorite = async (product: Product) => {
    const newStatus = !product.is_favorite
    setProducts(current => current.map(p => p.id === product.id ? { ...p, is_favorite: newStatus } : p))
    try {
      await supabase.from('products').update({ is_favorite: newStatus }).eq('id', product.id)
      newStatus ? toast.success('Adicionado aos seus favoritos 💚') : toast.info('Removido dos seus favoritos')
    } catch {
      setProducts(current => current.map(p => p.id === product.id ? { ...p, is_favorite: !newStatus } : p))
      toast.error('Erro ao atualizar favorito')
    }
  }

  // Filtragem
  const filteredProducts = products.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchesQuery && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 pb-20 mt-4">
      {/* Modais */}
      {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onUpdate={fetchProducts} />}
      {deletingProduct && <DeleteConfirmModal product={deletingProduct} onClose={() => setDeletingProduct(null)} onConfirm={confirmDelete} />}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 justify-items-center">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl" />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        
        <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-600">Nenhum produto encontrado</h3>
          <p className="text-sm text-gray-400 mb-6">{selectedCategory === 'all' ? 'Comece adicionando itens à sua coleção.' : 'Não há itens na categoria selecionada.'}</p>
          <Link href="/collection/newProduct">
            <Button className="bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white rounded-full px-8">Adicionar Novo</Button>
          </Link>
        </div>
      ) : (
        
        /* Grid Renderizando o novo ProductCard */
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
              <span className="text-xs font-bold text-gray-400 group-hover:text-[#3a6b4d] uppercase tracking-wide">Adicionar</span>
            </div>
          </Link>
        </div>
      )}

      {/* Botão de Voltar ao Topo */}
      <button onClick={scrollToTop} className={`fixed bottom-16 right-8 z-20 p-3 rounded-full shadow-xl bg-[#8ec5a0] text-white hover:bg-[#5a9e74]/10 hover:scale-110 transition-all duration-300 ease-in-out border border-white/20 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`} title="Voltar ao topo">
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  )
}