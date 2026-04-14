import Image from 'next/image'
import { Sparkles, Package, Heart, Calendar, Edit2, Trash2 } from 'lucide-react'
import { Product } from '@/types/db'
import { parseDateKey } from '@/lib/date'
import { format } from 'date-fns'

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''

  try {
    const dateOnly = dateString.split('T')[0]

    const safeDate = parseDateKey(dateOnly)

    return format(safeDate, 'dd/MM/yy')
  } catch {
    return dateString
  }
}

export function ProductCard({
  product,
  onToggleFavorite,
  onEdit,
  onDelete
}: {
  product: Product
  onToggleFavorite: (p: Product) => void
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
}) {
  const quantity = product.quantity ?? 1
  const brand = product.brand ?? ''
  const imageUrl = product.image_url ?? ''

  const showStockBadge = quantity > 1 && product.status !== 'finished'

  return (
    <div className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 bg-gray-900">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
          <Sparkles className="text-white/20 w-10 h-10" />
        </div>
      )}

      {/* Overlay */}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />

      {/* Header */}

      <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-start z-20">
        <div className="flex flex-col gap-1 items-start">
          <span
            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shadow-sm backdrop-blur-md
            ${
              product.status === 'open'
                ? 'bg-[#3a6b4d] text-white'
                : product.status === 'finished'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-500 text-white'
            }`}
          >
            {product.status === 'open'
              ? 'Em Uso'
              : product.status === 'finished'
                ? 'Acabou'
                : 'Fechado'}
          </span>

          {showStockBadge && (
            <span className="text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase shadow-sm backdrop-blur-md bg-white/20 text-white border border-white/10 flex items-center gap-1">
              <Package className="w-2 h-2" />+ {quantity - 1} Estoque
            </span>
          )}
        </div>

        <button
          onClick={e => {
            e.stopPropagation()
            onToggleFavorite(product)
          }}
          className="text-white/80 hover:text-red-400 transition-colors hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-5 h-5 drop-shadow-md ${
              product.is_favorite ? 'fill-red-500 text-red-500' : ''
            }`}
          />
        </button>
      </div>

      {/* Footer */}

      <div className="absolute w-full px-3 py-0.5 z-10 text-white flex flex-col justify-end h-full pointer-events-none">
        <div className="mt-auto pointer-events-auto">
          <h3 className="text-sm font-bold leading-tight mb-0.5 line-clamp-2 text-white shadow-black drop-shadow-md">
            {product.name}
          </h3>

          <p className="text-[10px] text-gray-300 mb-1.5 truncate">{brand}</p>

          <div className="h-px w-full bg-white/20 m-0.5" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-300 min-h-[1.25rem]">
              {product.opened_at && (
                <>
                  <Calendar className="w-3 h-3 text-[#3a6b4d]" />
                  <span className="text-[10px] font-medium tracking-wide">
                    {formatDate(product.opened_at)}
                  </span>
                </>
              )}
            </div>

            <div className="flex gap-1">
              <button
                onClick={e => {
                  e.stopPropagation()
                  onEdit(product)
                }}
                className="w-8 h-8 rounded-full text-white/80 hover:text-green-500 hover:bg-white/10 flex items-center justify-center transition-all"
                title="Editar"
              >
                <Edit2 className="w-5 h-5" />
              </button>

              <button
                onClick={e => {
                  e.stopPropagation()
                  onDelete(product)
                }}
                className="w-9 h-9 rounded-full text-white/80 hover:text-red-500 hover:bg-white/10 flex items-center justify-center transition-all"
                title={quantity > 1 ? 'Consumir 1 Unidade' : 'Finalizar'}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
