import { useEffect, useState } from 'react'

const useElementSize = (ref: React.RefObject<HTMLDivElement>) => {
    const [size, setSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const element = ref.current
        console.log('element', element)

        if (element) {
            setSize({ width: element.offsetWidth, height: element.offsetHeight })
            const observer = new ResizeObserver(() => {
                setSize({ width: element.offsetWidth, height: element.offsetHeight })
                observer.observe(element)
                return () => {
                    observer.disconnect()
                }
            })
        }
    }, [ref])

    return [size.width, size.height]
}

export default useElementSize
