import LoadingComponent from '@/components/Loading/Loading'
import { createRoot } from 'react-dom/client'
import React from 'react'

/**
 * Loading hook
 * @param {boolean} show  loading show or hide
 * @returns { hide,show }
 */
export default function useLoading() {
	const div = document.createElement('div')
	div.setAttribute('style', `position: fixed; top: 0; left: 0;right: 0; bottom: 0; z-index: 99999999;`)

	/**
	 * show loading
	 */
	function show() {
		document.body.appendChild(div)
		createRoot(div).render(React.createElement(LoadingComponent))
	}

	/**
	 * hide loading
	 */
	function hide() {
		document.body.removeChild(div)
	}

	return { hide, show }
}
