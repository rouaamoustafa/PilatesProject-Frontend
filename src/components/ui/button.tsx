'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import clsx     from 'clsx'

/* ------------------------------------------------------------------ */
/* Types that work on any React ≥ 17                                  */

export type Variant = 'default' | 'outline' | 'destructive'
export type Size    = 'sm' | 'md' | 'icon'

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'> {
  /* extra props */
  variant?: Variant
  size?:    Size
  asChild?: boolean
}

/* ------------------------------------------------------------------ */
/* Styles (unchanged)                                                 */

const base =
  'inline-flex items-center justify-center rounded-md font-medium ' +
  'transition focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
  'disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  default    : 'bg-teal-600 text-white hover:bg-blue-700 focus:ring-teal-500',
  outline    : 'border border-gray-300 hover:bg-gray-50 focus:ring-gray-300',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
}

const sizes: Record<Size, string> = {
  sm  : 'h-8  px-3 text-sm',
  md  : 'h-10 px-4',
  icon: 'h-8  w-8 p-0',
}

/* ------------------------------------------------------------------ */
/* Component                                                          */

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button (
  { className, variant = 'default', size = 'md', asChild = false, ...props },
  ref,
) {
  const Comp: any = asChild ? Slot : 'button'

  return (
    <Comp
      ref={ref}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
})

Button.displayName = 'Button'
