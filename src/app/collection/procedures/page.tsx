import { Sparkles } from 'lucide-react'

export default function ProceduresPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 ">
      <Sparkles className="w-12 h-12 text-[#3a6b4d]/40 mb-4" />
      <h3 className="text-lg font-bold text-[#3a6b4d]">Procedimentos</h3>
      <p className="text-sm text-gray-500 max-w-xs text-center mt-2">
        Em breve você poderá organizar seus tratamentos aqui.
      </p>
    </div>
  )
}
