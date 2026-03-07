"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LeafProps {
  size: number
  left: number
  delay: number
  duration: number
  type: number
  blur?: boolean
}

const leafTypes = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 160">
    <path d="M50,0 C70,40 90,80 50,160 C10,80 30,40 50,0 Z" fill="#7db956"/>
    <path d="M50,0 C50,40 50,120 50,160" fill="none" stroke="#7db956" strokeOpacity="0.6" strokeWidth="2"/>
  </svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140">
    <path d="M60,0 C90,30 120,70 60,140 C0,70 30,30 60,0 Z" fill="#6ca744"/>
    <path d="M60,0 C60,40 60,100 60,140" fill="none" stroke="#6ca744" strokeOpacity="0.6" strokeWidth="2"/>
  </svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 180">
    <path d="M50,0 C75,45 85,90 50,180 C15,90 25,45 50,0 Z" fill="#5b9333"/>
    <path d="M50,0 C50,45 50,135 50,180" fill="none" stroke="#5b9333" strokeOpacity="0.6" strokeWidth="2"/>
  </svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100">
    <path d="M40,0 C60,25 70,50 40,100 C10,50 20,25 40,0 Z" fill="#4d8326"/>
    <path d="M40,0 C40,25 40,75 40,100" fill="none" stroke="#4d8326" strokeOpacity="0.6" strokeWidth="1.5"/>
  </svg>`,
]

function Leaf({ size, left, delay, duration, type, blur }: LeafProps) {
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(leafTypes[type % leafTypes.length])}`

  return (
    <div
      className={cn("absolute animate-fall", blur && "blur-[2px]")}
      style={{
        left: `${left}%`,
        top: "-15vh",
        width: `${size}px`,
        height: `${size * 1.6}px`,
        backgroundImage: `url("${svgUrl}")`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}

export function FallingLeaves() {
  const [leaves, setLeaves] = useState<LeafProps[]>([])

  useEffect(() => {
    // Usamos setTimeout para evitar o erro de 'cascading renders' apontado pelo ESLint
    const timeoutId = setTimeout(() => {
      const leafCount = window.innerWidth < 768 ? 20 : 35
      const newLeaves: LeafProps[] = []

      for (let i = 0; i < leafCount; i++) {
        newLeaves.push({
          size: Math.random() * (window.innerWidth < 768 ? 20 : 40) + 15,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 10 + Math.random() * 15,
          type: Math.floor(Math.random() * leafTypes.length),
          blur: Math.random() < 0.3,
        })
      }
      setLeaves(newLeaves)
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {leaves.map((leaf, index) => (
        <Leaf key={index} {...leaf} />
      ))}
    </div>
  )
}