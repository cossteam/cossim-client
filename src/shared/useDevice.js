import { useState, useEffect } from 'react'

export default function useDevice() {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			const isMobileDevice = window.innerWidth < 768 // 设置一个阈值，例如 768 像素
			setIsMobile(isMobileDevice)
		}

		// 初始化时执行一次，然后每当窗口大小改变时执行
		handleResize()
		window.addEventListener('resize', handleResize)

		// 组件卸载时移除事件监听器
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return isMobile
}
