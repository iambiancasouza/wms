'use client'

import Image from 'next/image'
import { Heart, Sparkles } from 'lucide-react'
import { StaticLeaves } from '@/components/layout/staticLeaves'
import { useFavorites } from '@/hooks/useFavorites'

export default function FavoritesPage() {
  const { favorites, isLoading, removeFavorite } = useFavorites()

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden bg-[#f0f5ed]">
      <div className="fixed inset-0 pointer-events-none z-0">
        <StaticLeaves />
      </div>

      <div className="container mx-auto px-5 pt-8 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-[#3a6b4d] font-poppins tracking-tight">
            Meus Favoritos
          </h1>
        </div>

        {/* --- LISTA DE FAVORITOS --- */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 justify-items-center">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="w-full aspect-[3/4] bg-white/40 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-sm relative">
              <Heart className="w-10 h-10 text-gray-400" />
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#f0f5ed] rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-xs font-bold text-gray-500">0</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#1e3c2c]">
              Nenhum favorito ainda
            </h3>
            <p className="text-sm text-[#5f8c73] mb-6 max-w-xs mx-auto">
              Você ainda não tem nenhum favorito.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 animate-in fade-in duration-500 pb-20">
            {favorites.map(product => (
              <div
                key={product.id}
                className="group relative w-full aspect-[3/4] rounded-[24px] overflow-hidden shadow-lg transition-all duration-300 bg-[#1e3c2c]"
              >
                {/* Imagem */}
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2a4f3a] to-[#1e3c2c] flex items-center justify-center">
                    <Sparkles className="text-white/20 w-10 h-10" />
                  </div>
                )}

                {/* Overlay Escuro */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300" />

                {/* Header Card (Status e Coração) */}
                <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start z-20">
                  <span
                    className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${
                      product.status === 'open'
                        ? 'bg-[#8ec5a0]/90 text-[#1e3c2c]'
                        : product.status === 'finished'
                          ? 'bg-[#c78255]/90 text-white'
                          : 'bg-white/80 text-gray-700'
                    }`}
                  >
                    {product.status === 'open'
                      ? 'Em Uso'
                      : product.status === 'finished'
                        ? 'Acabou'
                        : 'Fechado'}
                  </span>

                  <button
                    onClick={e => {
                      e.stopPropagation()
                      removeFavorite(product)
                    }}
                    className="p-1.5 bg-black/20 backdrop-blur-md rounded-full text-red-400 hover:text-red-500 hover:scale-110 hover:bg-white/90 active:scale-95 transition-all"
                    title="Remover dos favoritos"
                  >
                    <Heart className="w-4 h-4 fill-current drop-shadow-md" />
                  </button>
                </div>

                {/* Footer Card */}
                <div className="absolute bottom-0 left-0 w-full px-3 py-1 z-10 text-white flex flex-col justify-end h-full pointer-events-none">
                  <div className="mt-auto pointer-events-auto">
                    <h3 className="text-sm font-bold leading-tight mb-0.5 line-clamp-2 text-white shadow-black drop-shadow-md">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-gray-300 mb-3 truncate font-medium">
                      {product.brand}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
