'use client'

import { useFormStatus } from 'react-dom'
import { type ComponentProps } from 'react'
import { cn } from  '@/utils/cn'

type Props = ComponentProps<'button'> & {
  pendingText?: string
}

export function SubmitButton({
  children,
  pendingText = 'Submitting...',
  className,
  ...props
}: Props) {
  const { pending, action } = useFormStatus()

  const isPending = pending && action === props.formAction

  return (
    <button
      {...props}
      className={cn(
        'bg-black h-8 flex items-center justify-center font-medium text-sm hover:bg-slate-800 transition-colors text-white rounded-md text-foreground',
        className
      )}
      type='submit'
      aria-disabled={pending}
    >
      {isPending ? pendingText : children}
    </button>
  )
}
