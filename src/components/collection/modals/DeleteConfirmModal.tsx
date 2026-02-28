import { useEffect } from 'react'
import { AlertTriangle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'

export function DeleteConfirmModal({
  product,
  onClose,
  onConfirm
}: {
  product: Product
  onClose: () => void
  onConfirm: () => void
}) {
  const isConsumption = product.quantity > 1

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 glass-overlay animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-xs p-6 shadow-2xl border border-white/60 text-center relative ring-1 ring-black/5">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ring-1 ${isConsumption ? 'bg-orange-50 ring-orange-100' : 'bg-red-50 ring-red-100'}`}
        >
          {isConsumption ? (
            <Package className="w-6 h-6 text-orange-500" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-500" />
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {isConsumption ? 'Consumir 1 Unidade?' : 'Finalizar Produto?'}
        </h3>
        <p className="text-gray-500 text-xs mb-5 px-2 leading-relaxed">
          {isConsumption
            ? `Isso moverá 1 unidade para o histórico e resetará o status para "Fechado" (novo frasco).`
            : 'O produto será movido para sua lista de terminados.'}
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl border-gray-200 h-9 text-xs hover:bg-white"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 rounded-xl text-white h-9 text-xs shadow-lg ${isConsumption ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {isConsumption ? 'Confirmar' : 'Finalizar'}
          </Button>
        </div>
      </div>
    </div>
  )
}