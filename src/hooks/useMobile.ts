import { SMALL_SCREEN } from '@/utils/constants'
import { useWindowSize } from '@reactuses/core'
import { useEffect, useState } from 'react'

function useMobile() {
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const { width, height } = useWindowSize()

    useEffect(() => {
        setIsMobile(width <= SMALL_SCREEN)
    }, [width])

    return {
        isMobile,
        width,
        height
    }
}

export default useMobile
