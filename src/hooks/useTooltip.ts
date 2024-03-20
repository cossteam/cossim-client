// import { createElement, useEffect } from 'react'
// import { createRoot } from 'react-dom/client'

// interface TooltipProps {}

// const useTooltip = (el: React.MutableRefObject<HTMLElement | null>) => {
// 	const render = (component: React.FC<any>, options?: ) => {
// 		const div = document.createElement('div')
// 		createRoot(div).render(createElement(component, { parentEl: longPressRef, item }))

// 		const observer = new MutationObserver((mutationsList) => {
// 			// 获取第一个子节点
// 			console.log('mutationsList', mutationsList)

// 			const firstChild = div.firstElementChild
// 			if (firstChild) {
// 				el.current?.appendChild(firstChild)
// 				// 停止观察器
// 				observer.disconnect()
// 			}
// 		})
// 	}

// 	return {
// 		render
// 	}
// }

// export default useTooltip
