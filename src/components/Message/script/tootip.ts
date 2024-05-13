/**
 * @description 该文件主要处理长按消息时弹出的操作
 * @author YuHong
 * @date 2024/03/21 16:43:00
 */
import { confirmMessage, tooltipType } from '@/shared'
import useMessageStore from '@/stores/message'
import { toastMessage } from '@/shared'
import { Clipboard } from '@capacitor/clipboard'
import { extractTextFromHTML } from './shared'
import MsgService from '@/api/msg'

/**
 * 复制文本
 *
 * @param text
 */
async function copy(text: string) {
	const string = extractTextFromHTML(text)
	Clipboard.write({ string })
		.then(() => toastMessage('复制成功'))
		.catch(() => toastMessage('复制失败'))
}

/**
 * 删除消息
 *
 * @param {any[]} selectMessages 选中的消息列表
 */
export async function del(selectMessages: any[]) {
	const messageStore = useMessageStore.getState()
	try {
		if (!selectMessages.length) selectMessages = messageStore.selectedMessages

		confirmMessage('你确实删除该消息吗？', '删除消息', async () => {
			selectMessages.map((item: any) => {
				messageStore.deleteMessage(item)
			})
		})
	} catch {
		toastMessage('删除失败')
	} finally {
		messageStore.update({
			selectedMessages: [],
			selectedMessage: {},
			tipType: tooltipType.NONE,
			manualTipType: tooltipType.NONE
		})
	}
}

/**
 * 标注消息
 */
async function mark() {
	const messageStore = useMessageStore.getState()
	try {
		const message = messageStore.selectedMessage

		const params = {
			is_label: message?.is_label === true ? false : true
		}

		const { code, msg } = messageStore.isGroup
			? await MsgService.labelGroupMessageApi(message?.msg_id, params)
			: await MsgService.labelUserMessageApi(message?.msg_id, params)

		if (code !== 200) throw new Error(msg)
	} catch (error: any) {
		toastMessage(error?.message ?? '标注失败')
	}
}

/**
 * 撤回消息
 */
export async function recall(message?: Message) {
	const messageStore = useMessageStore.getState()
	try {
		const msg = message ? message : messageStore.selectedMessage
		// const params = { msg_id: msg.msg_id }
		const { code, msg: error } = messageStore.isGroup
			? await MsgService.revokeGroupMessageApi(msg.msg_id)
			: await MsgService.revokeUserMessageApi(msg.msg_id)
		if (code !== 200) throw new Error(error)
		messageStore.deleteMessage(message)
	} catch (error: any) {
		toastMessage(error?.message ?? '撤回失败')
	}
}

/**
 * 长按处理不同类型的操作
 * @param {tooltipType} type 操作类型
 * @param {any} item 消息数据
 * @returns
 */
export default function tooltipStatMachine(type: tooltipType, item: any) {
	const messageStore = useMessageStore.getState()

	// 有限状态机，根据不同的操作类型进行不同的操作
	switch (type) {
		case tooltipType.COPY:
			copy(item?.content)
			break
		case tooltipType.DELETE:
			del([messageStore.selectedMessage])
			break
		case tooltipType.MARK:
			mark()
			break
		case tooltipType.RECALL:
			recall()
			break
		default:
			return
	}

	messageStore.update({ tipType: tooltipType.NONE })
}
