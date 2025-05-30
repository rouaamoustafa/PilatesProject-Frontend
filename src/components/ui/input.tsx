import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        'border border-gray-300 rounded-md h-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
