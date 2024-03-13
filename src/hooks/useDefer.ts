import { useRef } from 'react'

/**
 * 使用 defer 优化白屏时间
 *
 * @param max   最大渲染数
 * @returns
 * @example 
 * {
 *      Array.from({ length: 100 }).map((_,index)=> startDefer(index) ? <div>自定义内容<div> : null)
 * }
 */
const useDefer = (max: number = 20) => {
	const frameCount = useRef<number>(0)
	let refId: number

	const updateFrameCount = () => {
		refId = requestAnimationFrame(() => {
			frameCount.current++
			if (frameCount.current >= max) {
				return
			}
			updateFrameCount()
		})
	}

	updateFrameCount()

    // 开始渲染
	const startDefer = (n: number) => frameCount.current >= n
    // 取消渲染
	const cancelDefer = () => cancelAnimationFrame(refId)

	return {
		startDefer,
		cancelDefer
	}
}

export default useDefer
