import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/db'
import { createNotification } from '@/services/notification.service'
import { formatDateKey, getTodayLocal } from '@/lib/date'

export async function getProducts() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Product[]
}

export async function toggleFavoriteProduct(productId: string, isFavorite: boolean) {
  const supabase = createClient()
  const { error } = await supabase
    .from('products')
    .update({ is_favorite: isFavorite })
    .eq('id', productId)

  if (error) throw error
}

export async function deleteProduct(product: Product) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let diffDays = 0

  if (user) {
    if (product.opened_at) {
      const start = new Date(product.opened_at)
      const diffTime = Math.abs(Date.now() - start.getTime())
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    await supabase.from('finished_products').insert({
      user_id: user.id,
      name: product.name,
      brand: product.brand,
      image_url: product.image_url,
      category: product.category,
      started_at: product.opened_at,
      finished_at: formatDateKey(getTodayLocal()),
      duration_days: diffDays || null,
      review: product.review
    })
  }

  const currentQty = product.quantity ?? 1

  if (currentQty > 1) {
    const newQty = currentQty - 1
    const { error } = await supabase
      .from('products')
      .update({
        quantity: newQty,
        status: 'closed',
        opened_at: null,
        expiry_date: null
      })
      .eq('id', product.id)

    if (error) throw error
    return { action: 'decremented', newQty, diffDays }
  } else {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (error) throw error
    return { action: 'deleted', diffDays }
  }
}

export async function openProductsIfClosed(
  supabase: ReturnType<typeof createClient>,
  products: Product[],
  routineDate: string
) {
  if (!products || products.length === 0) return

  const ids = products.map(p => p.id)

  const { data, error } = await supabase
    .from('products')
    .update({
      status: 'open',
      opened_at: routineDate
    })
    .in('id', ids)
    .eq('status', 'closed')
    .select('id')

  if (error) {
    console.error('Erro ao atualizar produtos automaticamente:', error)
    return
  }

  if (!data || data.length === 0) return

  await Promise.all(
    data.map(({ id }) => {
      const product = products.find(p => p.id === id)
      if (!product) return

      return createNotification(
        product.user_id,
        'Novo produto na rotina',
        `${product.name} começou a ser usado hoje.`
      )
    })
  )
}

export async function getFavoriteProducts() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_favorite', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Product[]
}