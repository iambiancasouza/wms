'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Upload,
  Loader2,
  ChevronLeft,
  Calendar,
  DollarSign,
  Sun,
  Moon
} from 'lucide-react'
import { toast } from 'sonner'
import { StaticLeaves } from '@/components/layout/staticLeaves'
import { Product } from '@/types/product' 

interface ProductFormData {
  name: string
  brand: string
  category: string
  usage_frequency: 'am' | 'pm' | 'both'
  quantity: number | ''
  price: string
  opened_at: string
  expiry_date: string
  review: string
  status: 'closed' | 'open' | 'finished'
}

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    category: 'limpeza', 
    usage_frequency: 'both', 
    quantity: 1,
    price: '',
    opened_at: '',
    expiry_date: '',
    review: '',
    status: 'closed'
  })

  const usageOptions = ['am', 'both', 'pm']
  const activeIndex = usageOptions.indexOf(formData.usage_frequency)
  const translateX = activeIndex * 56

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      let image_url = null

      // Upload da Imagem
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, imageFile)
        
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)
        
        image_url = publicUrl
      }

      const priceValue = formData.price
        ? parseFloat(formData.price.replace(',', '.'))
        : null

      
      const newProduct: Omit<Product, 'id' | 'created_at'> = {
        user_id: user.id,
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        usage_frequency: formData.usage_frequency,
        quantity: Number(formData.quantity) || 1,
        price: priceValue,
        status: formData.status,
        opened_at: formData.opened_at || null,
        expiry_date: formData.expiry_date || null,
        review: formData.review || null,
        image_url: image_url,
        is_favorite: false 
      }

      const { error } = await supabase.from('products').insert(newProduct)

      if (error) throw error
      
      toast.success('Produto salvo!')
      router.push('/collection/products')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-3 max-w-lg relative">
      <StaticLeaves />
      
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Link href="/collection/products">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/50 -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-[#3a6b4d]" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-[#3a6b4d]">Novo Produto</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 relative z-10">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* FOTO */}
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
                <Upload className="w-8 h-8 text-[#5a9e74] mb-1 group-hover:scale-110 transition-transform" />
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

          {/* NOME E MARCA */}
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
                required
                placeholder="Ex: Gel de Limpeza"
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
                required
                placeholder="Ex: CeraVe"
                className="rounded-xl border-gray-200 bg-gray-50/50 h-11 text-sm w-full focus-visible:ring-[#3a6b4d]"
              />
            </div>
          </div>

          {/* LINHA 1: CATEGORIA + USO */}
          <div className="flex gap-4 items-start">
            <div className="space-y-1 flex-[1.5]">
              <Label className="text-[#3a6b4d] text-xs font-semibold uppercase pl-1">
                Categoria
              </Label>
              <div className="relative">
                <select
                  className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm focus:ring-2 focus:ring-[#3a6b4d] outline-none appearance-none text-gray-600"
                  value={formData.category}
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="limpeza">Limpeza</option>
                  <option value="tônico">Tônico/Essence</option>
                  <option value="hidratação">Hidratante</option>
                  <option value="antioxidante">Antioxidante</option>
                  <option value="tratamento">Tratamento/Slow-aging</option>
                  <option value="tratamento">Tretinoína</option>
                  <option value="tratamento">Ácido azeláico</option>
                  <option value="barreira">Barreira/Reparador</option>
                  <option value="olhos">Área dos olhos</option>
                  <option value="protecao">Protetor</option>
                  <option value="mascara">Máscara</option>
                  <option value="beauty_tech">Dispositivo</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 flex-1 min-w-fit">
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
                  { id: 'am', label: 'Manhã', icon: <Sun className="w-5 h-5" /> },
                  { id: 'both', label: 'Ambos', icon: <div className="flex -space-x-1"><Sun className="w-4 h-4" /><Moon className="w-4 h-4" /></div> },
                  { id: 'pm', label: 'Noite', icon: <Moon className="w-5 h-5" /> }
                ].map(item => {
                  const isActive = formData.usage_frequency === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, usage_frequency: item.id as 'am' | 'pm' | 'both' })
                      }
                      title={item.label}
                      className="relative w-11 h-11 rounded-full flex items-center justify-center z-10 transition-transform active:scale-90"
                    >
                      {!isActive && <div className="absolute inset-0 rounded-full border border-white/40 bg-white/20 -z-10" />}
                      <div className={`transition-colors duration-300 ${isActive ? 'text-[#3a6b4d] scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
                        {item.icon}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* LINHA 2: QTD + VALOR */}
          <div className="flex gap-3">
            <div className="space-y-1 flex-1">
              <Label className="text-[#3a6b4d] text-xs font-semibold uppercase pl-1">
                Quantidade
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="1"
                value={formData.quantity}
                onFocus={() => setFormData({ ...formData, quantity: '' })}
                onChange={e =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 0
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
                  placeholder="0.00"
                  value={formData.price}
                  onChange={e =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="rounded-xl border-gray-200 bg-gray-50/50 h-12 text-sm pl-9 w-full focus-visible:ring-[#3a6b4d]"
                />
              </div>
            </div>
          </div>

          {/* STATUS INICIAL */}
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
                    opened_at: formData.opened_at || new Date().toISOString().split('T')[0]
                  })
                }
                className={`flex-1 text-xs font-bold rounded-lg transition-all duration-200 ${formData.status === 'open' ? 'bg-white text-[#3a6b4d] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Em Uso
              </button>
            </div>
          </div>

          {/* DATAS */}
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

          {/* NOTAS */}
          <div className="space-y-1">
            <Label className="text-[#3a6b4d] text-xs font-semibold uppercase pl-1">
              Notas
            </Label>
            <textarea
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm focus:ring-2 focus:ring-[#3a6b4d] outline-none min-h-[100px] resize-none text-gray-700 placeholder:text-gray-400 transition-all"
              placeholder="Alguma nota sobre o produto? Aqui é o lugar!"
              value={formData.review}
              onChange={e =>
                setFormData({ ...formData, review: e.target.value })
              }
            />
          </div>

          {/* BOTÕES */}
          <div className="pt-2 flex gap-3">
            <Link href="/collection/products" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl border-gray-200 h-12 text-sm font-medium hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-[2] bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white rounded-xl h-12 text-sm font-bold shadow-lg shadow-[#3a6b4d]/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                'Salvar Produto'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}