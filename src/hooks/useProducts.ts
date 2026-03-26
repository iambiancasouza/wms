import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types/db'
import { showToast } from '@/providers/ToasterProvider'
import { getProducts, toggleFavoriteProduct, deleteProduct } from '@/services/product.service'

export function useProducts(query: string, selectedCategory: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error(error)
      showToast.error('Erro ao carregar coleção')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const confirmDelete = async () => {
    if (!deletingProduct) return

    try {
      const result = await deleteProduct(deletingProduct)
      
      const durationMsg = result.diffDays ? `Duração: ${result.diffDays} dias.` : ''

      if (result.action === 'decremented') {
        setProducts(current =>
          current.map(p =>
            p.id === deletingProduct.id
              ? {
                  ...p,
                  quantity: result.newQty!,
                  status: 'closed',
                  opened_at: null,
                  expiry_date: null
                }
              : p
          )
        )
        showToast.success(`1 unidade finalizada. ${durationMsg || 'Estoque atualizado.'}`)
      } else {
        setProducts(current => current.filter(p => p.id !== deletingProduct.id))
        showToast.success(`Produto finalizado! ${durationMsg}`)
      }
    } catch (error) {
      console.error(error)
      showToast.error('Erro ao processar')
    } finally {
      setDeletingProduct(null)
    }
  }

  const toggleFavorite = async (product: Product) => {
    const newStatus = !product.is_favorite

    setProducts(current =>
      current.map(p => (p.id === product.id ? { ...p, is_favorite: newStatus } : p))
    )

    try {
      await toggleFavoriteProduct(product.id, newStatus)
      if (newStatus) {
        showToast.success('Adicionado aos favoritos 💚')
      } else {
        showToast.default('Removido dos favoritos')
      }
    } catch {
      setProducts(current =>
        current.map(p => (p.id === product.id ? { ...p, is_favorite: !newStatus } : p))
      )
      showToast.error('Erro ao atualizar favorito')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesQuery =
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.brand ?? '').toLowerCase().includes(query.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory

    return matchesQuery && matchesCategory
  })

  return {
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
  }
}