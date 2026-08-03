import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-none px-8 py-3.5 text-base font-bold transition-all active:scale-95'
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-container hover:text-on-primary-container',
    outline: 'border border-white text-white hover:bg-white/10',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
