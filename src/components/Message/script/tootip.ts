/**
 * @description 该文件主要处理长按消息时弹出的操作
 * @author YuHong
 * @date 2024/03/21 16:43:00
 */
import { MESSAGE_MARK, confirmMessage, tooltipType } from '@/shared'
import useMessageStore from '@/stores/new_message'
import { toastMessage } from '@/shared'
import { Clipboard } from '@capacitor/clipboard'
import { extractTextFromHTML } from './shared'
import MsgService from '@/api/msg'

// const ManualCloseList = [tooltipType.EDIT, tooltipType.FORWARD, tooltipType.REPLY, tooltipType.SELECT]
// let ManualType = tooltipType.NONE

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
async function del(selectMessages: any[]) {
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
		messageStore.update({ selectedMessages: [], selectedMessage: {}, tipType: tooltipType.NONE })
	}
}

/**
 * 标注消息
 */
async function mark() {
	const messageStore = useMessageStore.getState()
	try {
		const message = messageStore.selectedMessage
		console.log('message', message)

		const params = {
			msg_id: message?.msg_id,
			is_label: message?.is_label === MESSAGE_MARK.MARK ? MESSAGE_MARK.NOT_MARK : MESSAGE_MARK.MARK
		}
		const { code, msg } = messageStore.isGroup
			? await MsgService.labelGroupMessageApi(params)
			: await MsgService.labelUserMessageApi(params)

		if (code !== 200) throw new Error(msg)
	} catch (error: any) {
		toastMessage(error?.message ?? '标注失败')
	}
}

/**
 * 撤回消息
 */
async function recall() {
	const messageStore = useMessageStore.getState()
	try {
		const message = messageStore.selectedMessage
		const params = { msg_id: message.msg_id }
		const { code, msg } = messageStore.isGroup
			? await MsgService.revokeGroupMessageApi(params)
			: await MsgService.revokeUserMessageApi(params)
		if (code !== 200) throw new Error(msg)
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
