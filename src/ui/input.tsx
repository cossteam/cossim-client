import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

const inputVariants = cva(
    'flex w-full rounded-sm border outline-none bg-background/60 text-sm p-2 backdrop-opacity-50 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'border-transparent hover:border-gray-500 focus:border-primary',
                error: 'border-red-500 hover:border-red-500 focus:border-primary'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, variant, ...props }, ref) => {
    return (
        <input
            className={cn(inputVariants({ variant, className }))}
            autoComplete="off"
            aria-autocomplete="none"
            ref={ref}
            {...props}
        />
    )
})

Input.displayName = 'Input'

export { Input, inputVariants }
