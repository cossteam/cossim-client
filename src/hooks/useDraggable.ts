import { useEffect, useState } from 'react'

const useDraggable = (el: HTMLElement | null) => {
    const [isDraggable, setIsDraggable] = useState(false)

    const handleMouseDown = (e: MouseEvent) => {
        console.log(e)
        setIsDraggable(true)
    }

    const handleMouseUp = (e: MouseEvent) => {
        console.log(e)
        setIsDraggable(false)
    }

    useEffect(() => {
        console.log('useDraggable', el)
        if (!el) return
        el.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
            el.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [el])

    return {
        isDraggable
    }
}

export default useDraggable
