import { forwardRef } from 'react'
import { Input, InputProps } from './input'

interface FieldInputProps extends InputProps {
    message?: string
}

const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(({ message, ...props }, ref) => {
    return (
        <div className="w-full">
            <Input {...props} ref={ref} />
            {message && <div className="text-xs text-red-500 mt-0.5">{message}</div>}
        </div>
    )
})

FieldInput.displayName = 'FieldInput'

export { type FieldInputProps, FieldInput }
