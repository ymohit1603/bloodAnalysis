import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: string = 'normal') {
  switch (status.toLowerCase()) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'low':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'normal':
    default:
      return 'text-green-600 bg-green-50 border-green-200'
  }
}

export function formatValue(value: string | number, unit: string) {
  return `${value} ${unit}`
}

export function saveToLocalStorage(key: string, value: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export function getFromLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }
  return null
}
