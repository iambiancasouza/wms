'use client'

import Image from 'next/image'
import { CheckCircle2, Circle } from 'lucide-react'
import { Product } from '@/types/product'

interface RoutineCardProps {
  product: Product;
  isCompleted: boolean;
  onToggleAction: () => void;
}

export function RoutineCard({ product, isCompleted, onToggleAction }: RoutineCardProps) {
  return (
    <div 
      onClick={onToggleAction}
      className={`relative flex items-center gap-4 p-4 rounded-[24px] border transition-all duration-300 cursor-pointer group
        ${isCompleted 
          ? 'bg-[#3a6b4d]/20 border-[#3a6b4d]/30 shadow-inner' 
          : 'bg-white/40 backdrop-blur-xl border-white/60 shadow-lg hover:bg-white/60'
        }`}
    >
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/40 shrink-0">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-[#f0f5ed] flex items-center justify-center text-[#3a6b4d]/30 text-xs font-bold">
            WMS
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-bold truncate ${isCompleted ? 'text-[#3a6b4d] line-through opacity-60' : 'text-gray-600'}`}>
          {product.name}
        </h4>
        <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">
          {product.brand}
        </p>
      </div>

      <div className="shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="w-6 h-6 text-[#3a6b4d] animate-in zoom-in" />
        ) : (
          <Circle className="w-6 h-6 text-gray-300 group-hover:text-[#8ec5a0] transition-colors" />
        )}
      </div>
    </div>
  )
}