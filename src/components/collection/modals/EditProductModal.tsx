// src/components/collection/modals/EditProductModal.tsx
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Loader2,
  Upload,
  X,
  DollarSign,
  Sun,
  Moon,
  Calendar
} from 'lucide-react'
import { showToast } from '@/providers/ToasterProvider'
import { Product } from '@/types/db'

const Category = [
  { id: 'all', label: 'Todos', icon: '✨' },
  { id: 'limpeza', label: 'Limpeza', icon: '🧼' },
  { id: 'tonico', label: 'Tônico/Essence', icon: '💧' },
  { id: 'hidratacao', label: 'Hidratação', icon: '🧴' },
  { id: 'antioxidante', label: 'Antioxidante', icon: '🍊' },
  { id: 'tratamento', label: 'Tratamento/Slow-aging', icon: '🧪' },
  { id: 'barreira', label: 'Barreira/Reparador', icon: '🛡️' },
  { id: 'protecao', label: 'Protetor', icon: '☀️' },
  { id: 'olhos', label: 'Área dos Olhos', icon: '👁️' },
  { id: 'beauty_tech', label: 'Dispositivo', icon: '⚡' },
  { id: 'outros', label: 'Outros', icon: '' }
]

export function EditProductModal({
  product,
  onClose,
  onUpdate
}: {
  product: Product
  onClose: () => void
  onUpdate: () => void
}) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    product.image_url
  )
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    name: product.name,
    brand: product.brand,
    category: product.category,
    usage: product.usage_frequency || 'both',
    status: product.status,
    quantity: product.quantity,
    price: product.price || '',
    opened_at: product.opened_at || '',
    expiry_date: product.expiry_date || '',
    review: product.review || ''
  })

  const usageOptions = ['am', 'both', 'pm']
  const activeIndex =
    usageOptions.indexOf(formData.usage) !== -1
      ? usageOptions.indexOf(formData.usage)
      : 1
  const translateX = activeIndex * 56

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      let image_url = product.image_url

      if (imageFile) {
        const {
          data: { user }
        } = await supabase.auth.getUser()
        if (user) {
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${user.id}/${Date.now()}.${fileExt}`
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, imageFile)
          if (uploadError) throw uploadError
          const {
            data: { publicUrl }
          } = supabase.storage.from('products').getPublicUrl(fileName)
          image_url = publicUrl
        }
      }

      const priceValue = formData.price ? Number(formData.price) : null

      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          brand: formData.brand,
          category: formData.category,
          usage_frequency: formData.usage,
          status: formData.status,
          quantity: Number(formData.quantity),
          price: priceValue,
          opened_at:
            formData.status === 'closed' ? null : formData.opened_at || null,
          expiry_date: formData.expiry_date || null,
          review: formData.review,
          image_url: image_url
        })
        .eq('id', product.id)

      if (error) throw error
      showToast.success('Produto atualizado!')
      onUpdate()
      onClose()
    } catch (error) {
      showToast.error('Erro ao atualizar')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 glass-overlay animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-xl rounded-[32px] w-full max-w-lg shadow-2xl border border-gray-100 relative flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-3 border-b-2 border-gray-100 rounded-t-[32px] z-10 shrink-0">
          <h2 className="text-lg font-bold text-[#3a6b4d] tracking-wide">
            Editar Produto
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 h-8 w-8 text-gray-500"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="edit-form" onSubmit={handleUpdate} className="space-y-6">
            {/* Foto Input */}
            <div className="flex justify-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-28 h-28 rounded-3xl border-2 border-dashed border-[#8ec5a0] bg-[#f9fbf8] flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:opacity-80 active:scale-95 transition-all shadow-sm group"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#5a9e74] mb-1 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Nome e Marca */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[#3a6b4d] text-xs font-semibold uppercase tracking-wider pl-1">
                  Nome
                </Label>
                <Input
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-xl border-gray-200 bg-gray-50/50 h-11 text-sm w-full focus-visible:ring-[#3a6b4d]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[#3a6b4d] text-xs font-semibold uppercase tracking-wider pl-1">
                  Marca
                </Label>
                <Input
                  value={formData.brand}
                  onChange={e =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="rounded-xl border-gray-200 bg-gray-50/50 h-11 text-sm w-full focus-visible:ring-[#3a6b4d]"
                />
              </div>
            </div>

            {/* Categoria e Uso */}
            <div className="flex gap-4 items-end">
              <div className="space-y-1 flex-[2] ">
                <Label className="text-[#3a6b4d] text-xs font-semibold uppercase pl-1">
                  Categoria
                </Label>
                <select
                  className="flex h-12 w-full rounded-full border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm focus:ring-2 focus:ring-[#8ec5a0] outline-none appearance-none text-gray-600 truncate"
                  value={formData.category}
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {Category.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 flex-1 shrink-0 ">
                <Label className="text-[#3a6b4d] text-xs font-semibold uppercase pl-1 text-center block mb-1">
                  Uso
                </Label>
                <div className="relative flex h-12 items-center justify-start gap-3 isolate">
                  <div
                    className="absolute top-0.5 left-0 w-11 h-11 rounded-full bg-[#3a6b4d]/10 border border-[#3a6b4d]/30 backdrop-blur-md shadow-[0_0_15px_rgba(58,107,77,0.2)] z-0 transition-transform duration-500 ease-spring"
                    style={{ transform: `translateX(${translateX}px)` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent rounded-full opacity-80" />
                  </div>
                  {[
                    {
                      id: 'am',
                      label: 'Manhã',
                      icon: <Sun className="w-5 h-5" />
                    },
                    {
                      id: 'both',
                      label: 'Ambos',
                      icon: (
                        <div className="flex -space-x-1">
                          <Sun className="w-4 h-4" />
                          <Moon className="w-4 h-4" />
                        </div>
                      )
                    },
                    {
                      id: 'pm',
                      label: 'Noite',
                      icon: <Moon className="w-5 h-5" />
                    }
                  ].map(item => {
                    const isActive = formData.usage === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, usage: item.id })
                        }
                        title={item.label}
                        className="relative w-11 h-11 rounded-full flex items-center justify-center z-10 transition-transform active:scale-90"
                      >
                        {!isActive && (
                          <div className="absolute inset-0 rounded-full border border-white/40 bg-white/20 -z-10" />
                        )}
                        <div
                          className={`transition-colors duration-300 ${isActive ? 'text-[#3a6b4d] scale-110' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          {item.icon}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Quantidade e Valor */}
            <div className="flex gap-3">
              <div className="space-y-1 flex-1">
                <Label className="text-[#3a6b4d] text-xs font-semibold uppercase pl-1">
                  Quantidade
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value)
                    })
                  }
                  className="rounded-xl border-gray-200 bg-gray-50/50 h-12 text-center w-full focus-visible:ring-[#3a6b4d]"
                />
              </div>
              <div className="space-y-1 flex-[1.5]">
                <Label className="text-[#3a6b4d] text-xs font-semibold uppercase pl-1">
                  Valor Pago
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="rounded-xl border-gray-200 bg-gray-50/50 h-12 text-sm pl-9 w-full focus-visible:ring-[#3a6b4d]"
                  />
                </div>
              </div>
            </div>

            {/* Status e Datas */}
            <div className="space-y-1.5">
              <Label className="text-[#3a6b4d] text-xs font-semibold uppercase tracking-wider pl-1">
                Estado Inicial
              </Label>
              <div className="flex p-1 bg-gray-100/80 rounded-xl border border-gray-200/50 relative w-full h-12">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'closed' })}
                  className={`flex-1 text-xs font-bold rounded-lg transition-all duration-200 ${formData.status === 'closed' ? 'bg-white text-[#3a6b4d] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Fechado
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status: 'open',
                      opened_at:
                        formData.opened_at ||
                        new Date().toISOString().split('T')[0]
                    })
                  }
                  className={`flex-1 text-xs font-bold rounded-lg transition-all duration-200 ${formData.status === 'open' ? 'bg-white text-[#3a6b4d] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Em Uso
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 relative">
                <Label
                  className={`text-xs font-semibold uppercase pl-1 transition-colors ${formData.status === 'closed' ? 'text-gray-400' : 'text-[#3a6b4d]'}`}
                >
                  Data de Abertura
                </Label>
                <div className="relative w-full">
                  <Input
                    type="date"
                    disabled={formData.status === 'closed'}
                    value={formData.opened_at}
                    onChange={e =>
                      setFormData({ ...formData, opened_at: e.target.value })
                    }
                    className={`rounded-xl border h-12 text-xs pl-10 w-full appearance-none transition-all ${formData.status === 'closed' ? 'bg-gray-100/50 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-gray-50/50 border-gray-200 text-gray-700 focus-visible:ring-[#3a6b4d]'}`}
                  />
                  <Calendar
                    className={`absolute left-3 top-4 w-4 h-4 pointer-events-none transition-colors ${formData.status === 'closed' ? 'text-gray-300' : 'text-gray-400'}`}
                  />
                </div>
              </div>
              <div className="space-y-1 relative">
                <Label className="text-[#3a6b4d] text-xs font-semibold uppercase pl-1">
                  Validade
                </Label>
                <div className="relative w-full">
                  <Input
                    type="date"
                    value={formData.expiry_date}
                    onChange={e =>
                      setFormData({ ...formData, expiry_date: e.target.value })
                    }
                    className="rounded-xl border-gray-200 bg-gray-50/50 h-12 text-xs pl-10 w-full appearance-none focus-visible:ring-[#3a6b4d]"
                  />
                  <Calendar className="absolute left-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-1">
              <Label className="text-[#3a6b4d] text-xs font-semibold uppercase pl-1">
                Notas
              </Label>
              <textarea
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm focus:ring-2 focus:ring-[#3a6b4d] outline-none min-h-[100px] resize-none text-gray-700 placeholder:text-gray-400 transition-all"
                value={formData.review}
                onChange={e =>
                  setFormData({ ...formData, review: e.target.value })
                }
                placeholder="Suas anotações..."
              />
            </div>

            <div className="pt-4 mt-6 border-t border-gray-100 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-xl border-gray-200 text-sm font-medium hover:bg-gray-50"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-[2] h-12 bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#3a6b4d]/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
