/**
 * @description 小驼峰转换为横线连接
 * @param str
 */
export function transformNameToLine(str: string): string {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}
