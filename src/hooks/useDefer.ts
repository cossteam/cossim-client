import { useEffect, useState } from 'react'

/**
 * 使用 defer 优化白屏时间
 *
 * @param max   最大渲染数
 * @example
 * {
 *      Array.from({ length: 100 }).map((_,index)=> defer(index) ? <div>自定义内容<div> : null)
 * }
 */
const useDefer = (max = 20) => {
    const [isRendering, setIsRendering] = useState<boolean>(true)
    const [isRenderFinish, setIsRenderFinish] = useState<boolean>(false)

    let frameCount = 0
    let refId = 0

    const updateFrameCount = () => {
        refId = requestAnimationFrame(() => {
            frameCount++
            if (frameCount >= max) {
                cancelAnimationFrame(refId)
                setIsRendering(false)
                setIsRenderFinish(true)
                return
            }
            updateFrameCount()
        })
    }

    useEffect(() => {
        if (!max) return
        return () => cancelAnimationFrame(refId)
    }, [max])

    const defer = (n: number) => {
        if (!refId && !!max) updateFrameCount()
        return n <= max
    }

    return {
        defer,
        isRendering,
        isRenderFinish
    }
}

export default useDefer
