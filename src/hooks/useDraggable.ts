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
    el.addEventListener('mouseup', handleMouseUp)
    el.addEventListener('mousemove', (e) => {
      console.log(e)
    })
    return () => {
      el.removeEventListener('mousedown', handleMouseDown)
      el.removeEventListener('mouseup', handleMouseUp)
    }
  }, [el])

  return {
    isDraggable
  }
}

export default useDraggable
