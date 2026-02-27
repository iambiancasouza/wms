"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Bell, Calendar, AlertTriangle, Package } from "lucide-react" // Adicionei Package
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type NotificationItem = {
  id: string
  name: string
  expiry_date: string
  days_left: number
  quantity: number 
}

export function Notifications() {
  const supabase = createClient()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const checkExpirations = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date()
      
      // Buscando quantidade tbm
      const { data: products } = await supabase
        .from('products')
        .select('id, name, expiry_date, status, quantity')
        .eq('user_id', user.id)
        .neq('status', 'finished')
        .not('expiry_date', 'is', null)

      if (products) {
        const alerts: NotificationItem[] = []

        products.forEach((product) => {
          if (!product.expiry_date) return

          const expiry = new Date(product.expiry_date)
          const diffTime = expiry.getTime() - today.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          if (diffDays <= 30) {
            alerts.push({
              id: product.id,
              name: product.name,
              expiry_date: product.expiry_date,
              days_left: diffDays,
              quantity: product.quantity // Guardando qtd
            })
          }
        })

        alerts.sort((a, b) => a.days_left - b.days_left)
        setItems(alerts)
      }
    } catch (error) {
      console.error("Erro ao buscar notificações", error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    checkExpirations()
  }, [checkExpirations])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-black/5 transition-colors group outline-none"
      >
        <Bell className={`w-6 h-6 text-[#3a6b4d] transition-transform ${isOpen ? 'scale-110' : 'group-hover:scale-105'}`} strokeWidth={2} />
        
        {!isLoading && items.length > 0 && (
          <span className="absolute top-1.5 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-[#f2f7f4]"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-white/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100/50 bg-white/40">
            <h3 className="font-bold text-[#3a6b4d] text-sm uppercase tracking-wide">Notificações</h3>
            <span className="text-[10px] font-medium bg-[#3a6b4d]/10 text-[#3a6b4d] px-2 py-0.5 rounded-full">
              {items.length} alertas
            </span>
          </div>

          <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-gray-400">Carregando...</div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-2">
                  <Bell className="w-4 h-4 text-green-300" />
                </div>
                <p className="text-sm font-medium text-gray-600">Tudo em dia!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {items.map((item) => (
                  <Link href="/collection/products" key={item.id} onClick={() => setIsOpen(false)}>
                    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/60 transition-colors group cursor-pointer">
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${item.days_left < 0 ? 'bg-red-50 border-red-100 text-red-500' : 'bg-orange-50 border-orange-100 text-orange-500'}`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 truncate">{item.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {/* Info de Dias */}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <p className={`text-xs font-medium ${item.days_left < 0 ? 'text-red-500' : 'text-orange-500'}`}>
                              {item.days_left < 0 
                                ? `Venceu (${Math.abs(item.days_left)}d)` 
                                : item.days_left === 0 
                                  ? "Vence hoje" 
                                  : `${item.days_left} dias`
                              }
                            </p>
                          </div>
                          
                          {/* Info de Estoque (Nova) */}
                          {item.quantity > 1 && (
                            <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-md">
                                <Package className="w-3 h-3 text-gray-500" />
                                <span className="text-[10px] font-medium text-gray-600">
                                    + {item.quantity - 1} em estoque
                                </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="p-2 border-t border-gray-100/50 bg-gray-50/30">
              <Link href="/collection/products">
                <Button variant="ghost" className="w-full h-8 text-xs font-medium text-gray-500 hover:text-[#3a6b4d] hover:bg-white/50 rounded-xl">
                  Ver estoque completo
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}