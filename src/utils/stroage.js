import { storageName } from '@/stores/user'

/**
 * 获取本地存储
 * @param {string} name	存储名称
 * @returns
 */
export function getStorage(name = storageName) {
	const storage = window.localStorage.getItem(name)
	if (storage) {
		return JSON.parse(storage)
	} else {
		return null
	}
}
