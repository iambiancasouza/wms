'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import { Product } from '@/types/db'

function SortableProduct({ product, onRemove }: { product: Product; onRemove: (product: Product) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id })

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      onClick={() => onRemove(product)}
      title="Clique para remover ou arraste para reordenar"
      className="relative h-[100px] w-[100px] overflow-hidden rounded-full border border-[#8ec5a0]/30 bg-[#eef4f0] shadow-sm select-none"
      style={{ transform: CSS.Transform.toString(transform), transition, touchAction: 'none', WebkitTouchCallout: 'none' }}
    >
      {product.image_url ? (
        <Image src={product.image_url} alt={product.name} fill sizes="100px" draggable={false} className="object-cover" />
      ) : (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-2 text-center">
          <span className="w-full truncate text-[8px] font-black uppercase tracking-wider text-[#5a9e74]">{product.brand}</span>
          <span className="mt-0.5 line-clamp-2 w-full text-[10px] font-bold leading-tight text-[#1e3c2c]">{product.name}</span>
        </div>
      )}
    </button>
  )
}

export function RoutineProductGrid({ products, onChangeAction }: { products: Product[]; onChangeAction: (products: Product[]) => void }) {
  const didDragRef = useRef(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const clearDragFlag = () => {
    window.setTimeout(() => { didDragRef.current = false }, 0)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex(product => product.id === active.id)
      const newIndex = products.findIndex(product => product.id === over.id)
      if (oldIndex >= 0 && newIndex >= 0) onChangeAction(arrayMove(products, oldIndex, newIndex))
    }
    clearDragFlag()
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToParentElement]}
      autoScroll
      onDragStart={() => { didDragRef.current = true }}
      onDragEnd={handleDragEnd}
      onDragCancel={clearDragFlag}
    >
      <SortableContext items={products.map(product => product.id)} strategy={rectSortingStrategy}>
        <div className="grid w-full grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map(product => (
            <SortableProduct
              key={product.id}
              product={product}
              onRemove={item => {
                if (!didDragRef.current) onChangeAction(products.filter(product => product.id !== item.id))
              }}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
