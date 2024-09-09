import { cn } from '@/lib/utils'
import { useConfigStore } from '@/stores/config'
import { Children, isValidElement, useCallback, useEffect, useRef, useState } from 'react'

interface FlexboardCommonProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export const FlexboardSidebar: React.FC<FlexboardCommonProps> = ({ children, className, ...props }) => (
    <div className={cn('flex-1 h-full overflow-auto py-3', className)} {...props}>
        {children}
    </div>
)
export const FlexboardContent: React.FC<FlexboardCommonProps> = ({ children, className, ...props }) => (
    <div className={cn('flex-1 h-full overflow-auto bg-secondary', className)} {...props}>
        {children}
    </div>
)

interface FlexboardProps {
    children: React.ReactNode
    minWidth?: number
    maxWidth?: number
}

export const Flexboard: React.FC<FlexboardProps> = ({ children, minWidth = 200, maxWidth = 600 }) => {
    const sidebarRef = useRef<HTMLDivElement | null>(null)
    const [isResizing, setIsResizing] = useState(false)
    const sidebarWidth = useConfigStore((state) => state.sidebarWidth)
    const updateSidebarWidth = useConfigStore((state) => state.update)

    const startResizing = useCallback(() => {
        setIsResizing(true)
    }, [])

    const stopResizing = useCallback(() => {
        setIsResizing(false)
    }, [])

    const resize = useCallback(
        (mouseMoveEvent: MouseEvent) => {
            if (isResizing && sidebarRef.current) {
                const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left
                if (newWidth < minWidth || newWidth > maxWidth) return
                updateSidebarWidth({ sidebarWidth: newWidth })
            }
        },
        [isResizing]
    )

    useEffect(() => {
        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', stopResizing)
        return () => {
            window.removeEventListener('mousemove', resize)
            window.removeEventListener('mouseup', stopResizing)
        }
    }, [resize, stopResizing])

    let sidebarContent: React.ReactNode = null
    let rightContent: React.ReactNode = null

    Children.forEach(children, (child) => {
        if (isValidElement(child)) {
            if (child.type === FlexboardSidebar) {
                sidebarContent = child
            } else if (child.type === FlexboardContent) {
                rightContent = child
            }
        }
    })

    return (
        <div className="h-screen flex flex-row">
            <div
                ref={sidebarRef}
                className="flex-grow-0 flex-shrink-0 flex h-full border-r border-gray-200"
                style={{ width: sidebarWidth, minWidth, maxWidth }}
            >
                {sidebarContent}
                <div
                    className="flex-grow-0 flex-shrink-0 cursor-ew-resize basis-1.5 resize-x"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        startResizing()
                    }}
                />
            </div>
            {rightContent}
        </div>
    )
}
