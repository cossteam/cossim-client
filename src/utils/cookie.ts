import Cookies from 'js-cookie'

/**
 * 获取cookie
 *
 * @param name
 * @returns
 */
export const getCookie = (name: string): string | undefined => Cookies.get(name)

/**
 * 设置具有给定名称和值以及可选属性的 cookie。
 *
 * @param {string} name -cookie 的名称
 * @param {string} value -cookie的值
 * @param {Cookie.CookieAttributes}  cookie 的可选属性
 * @return {void}
 */

export const setCookie = (name: string, value: string, options?: Cookies.CookieAttributes) => {
	Cookies.set(name, value, {
		// 默认永久
		expires: new Date('9999-12-31T23:59:59'),
		...options
	})
}

/**
 * 删除cookie
 *
 * @param name
 * @returns
 */
export const removeCookie = (name: string) => Cookies.remove(name)

/**
 * 判断cookie是否存在
 *
 * @param name
 * @returns
 */
export const hasCookie = (name: string) => Cookies.get(name) !== undefined

/**
 * 移除所有 cookie
 */
export const removeAllCookie = () => {
	const keys = Object.keys(Cookies.get())
	keys.forEach((key: string) => {
		Cookies.remove(key)
	})
}
