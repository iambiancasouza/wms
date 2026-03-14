'use client'

import { Toaster, toast } from 'sonner'
import { motion, Variants } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'

const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: -40, 
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 25,
      mass: 0.8,
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
}

interface CustomToastProps {
  id: string | number
  title: string
  icon: React.ReactNode
  type: 'success' | 'error' | 'default'
}

const CustomToastContent = ({ title, icon, type }: CustomToastProps) => {
  const typeStyles = {
    success: {
      glow: 'shadow-[6px_12px_30px_rgba(58,107,77,0.4)]',
      border: 'border-[#3a6b4d]/30',
      bg: 'bg-[#3a6b4d]/60',
      text: 'text-[#e9f7ef]'
    },
    error: {
      glow: 'shadow-[6px_12px_30px_rgba(169,92,66,0.4)]',
      border: 'border-[#A95C42]/30',
      bg: 'bg-[#A95C42]/50',
      text: 'text-white'
    },
    default: {
      glow: 'shadow-[6px_12px_30px_rgba(142,197,160,0.3)]',
      border: 'border-[#8ec5a0]/30',
      bg: 'bg-[#8ec5a0]/50',
      text: 'text-[#2f5e42]'
    }
  }

  const styles = typeStyles[type]

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`
        relative flex items-center gap-4
        w-full max-w-sm
        px-5 py-3
        rounded-full
        border
        backdrop-blur-md
        isolate
        will-change-[transform,opacity,backdrop-filter]
        ${styles.bg}
        ${styles.border}
        ${styles.glow}
        ${styles.text}
      `}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>

      <span className="font-semibold text-[15px] tracking-wide">
        {title}
      </span>
    </motion.div>
  )
}

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      expand={false}
      gap={12}
      visibleToasts={3}
      toastOptions={{
        duration: 3500,
        className: 'bg-transparent border-none shadow-none !p-0 !m-0 overflow-visible transition-none',
        style: {
          transition: 'none',
        }
      }}
    />
  )
}

export const showToast = {
  success: (title: string) => {
    toast.custom((t) => (
      <CustomToastContent
        id={t}
        title={title}
        icon={<CheckCircle className="w-5 h-5" />}
        type="success"
      />
    ))
  },

  error: (title: string) => {
    toast.custom((t) => (
      <CustomToastContent
        id={t}
        title={title}
        icon={<AlertTriangle className="w-5 h-5" />}
        type="error"
      />
    ))
  },

  default: (title: string) => {
    toast.custom((t) => (
      <CustomToastContent
        id={t}
        title={title}
        icon={<Info className="w-5 h-5" />}
        type="default"
      />
    ))
  }
}