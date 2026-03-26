import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types/db'
import { showToast } from '@/providers/ToasterProvider'
import { getFavoriteProducts, toggleFavoriteProduct } from '@/services/product.service'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFavorites = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

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