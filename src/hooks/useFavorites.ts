import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types/db'
import { showToast } from '@/providers/ToasterProvider'
import { useAuth } from '@/providers/UserAuthProvider'
import { getFavoriteProducts, toggleFavoriteProduct } from '@/services/product.service'

export function useFavorites() {
  const { user, isLoading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const data = await getFavoriteProducts()
      setFavorites(data)
    } catch (error) {
      console.error(error)
      showToast.error('Erro ao carregar favoritos')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    fetchFavorites()
  }, [authLoading, fetchFavorites])

  const removeFavorite = async (product: Product) => {
    setFavorites(current => current.filter(p => p.id !== product.id))
    showToast.default('Removido dos favoritos')

    try {
      await toggleFavoriteProduct(product.id, false)
    } catch {
      setFavorites(current => [...current, product])
      showToast.error('Erro ao atualizar favorito')
    }
  }

  return {
    favorites,
    isLoading,
    removeFavorite
  }
}
