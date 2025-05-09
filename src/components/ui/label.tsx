import React from 'react'

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(function Label({ children, ...props }, ref) {
  return (
    <label ref={ref} className="block text-sm font-medium text-gray-700" {...props}>
      {children}
    </label>
  )
})
