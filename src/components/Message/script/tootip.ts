/**
 * @description 该文件主要处理长按消息时弹出的操作
 * @author YuHong
 * @date 2024/03/21 16:43:00
 */
import { tooltipType } from '@/shared'
import useMessageStore from '@/stores/new_message'
import { toastMessage } from '@/shared'
import { Clipboard } from '@capacitor/clipboard'
import { extractTextFromHTML } from './shared'

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
 * 长按处理不同类型的操作
 * @param {tooltipType} type 操作类型
 * @param {any} item 消息数据
 * @returns
 */
export default function tooltipStatMachine(type: tooltipType, item: any) {
	console.log('type', type, item)

	const messageStore = useMessageStore.getState()

	// 有限状态机，根据不同的操作类型进行不同的操作
	switch (type) {
		case tooltipType.COPY:
			copy(item?.content)
			break
		default:
			return
	}

	// 如果是手动关闭的操作类型，附加值给 ManualType
	if (messageStore.manualTipType === tooltipType.NONE) {
		messageStore.update({ tipType: tooltipType.NONE })
		return
	}

	// if (!ManualCloseList.includes(ManualType)) {
	// 	messageStore.update({ tipType: tooltipType.NONE })
	// 	ManualType = tooltipType.NONE
	// }

	// const messageStore = useMessageStore.getState()
	// const isManualCloseList = [tooltipType.EDIT, tooltipType.FORWARD, tooltipType.REPLY, tooltipType.SELECT]
	// useMessageStore.subscribe(async ({ tipType }) => {
	// 	if (tipType !== tooltipType.NONE) {
	// 		const messageStore = useMessageStore.getState()
	// 		console.log('当前选项', tipType)
	// 		switch (tipType) {
	// 			case tooltipType.COPY:
	// 				copy(messageStore.selectedMessage?.content)
	// 				break
	// 			// 	break
	// 			default:
	// 				// messageStore.update({ isManualClose: true })
	// 				return
	// 		}
	//         console.log("messageStore.manualTipType",messageStore.manualTipType);
	// 		if (messageStore.manualTipType !== tooltipType.NONE) return
	// 		messageStore.update({ tipType: tooltipType.NONE })
	// 	}
	// })
}
