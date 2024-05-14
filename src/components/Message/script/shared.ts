/**
 * 将字符串消息 HTML 内容提取文本内容
 * @param content HTML 消息内容
 */
export function extractTextFromHTML(content: string) {
	const doc = new DOMParser().parseFromString(content, 'text/html')
	return doc.body.textContent || ''
}
