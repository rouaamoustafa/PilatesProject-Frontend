import { useSelector } from 'react-redux'
import { selectCartLines } from '@/store/selectors'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

export function CartTrigger({ onOpen }: { onOpen: () => void }) {
  const lines = useSelector(selectCartLines)
  const total = lines.length
  if (total === 0) return null

  return (
    <button
      onClick={onOpen}
      className="relative flex items-center p-2 rounded hover:bg-gray-100 transition"
    >
      <ShoppingCart className="w-7 h-7 text-[#2e372c]" />
      <span className="absolute -top-1 -right-1 bg-[#2e372c] text-white text-xs rounded-full px-1">
        {total}
      </span>
    </button>
  )
}
