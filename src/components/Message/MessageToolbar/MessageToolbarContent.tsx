import useMessageStore from '@/stores/new_message'
import MessageEmojis from './MessageEmojis'
import MessageMore from './MessageMore'
import {
	emojiOrMore,
	fileBase64,
	fileMessageType,
	fileTypeText,
	getImageOrVideoSize,
	getVideoCover,
	msgType,
	toastMessage,
	uploadFile
} from '@/shared'
import clsx from 'clsx'
import { useMemo } from 'react'
import useCacheStore from '@/stores/cache'
import { sendMessage } from '../script/message'
import { generateMessage } from '@/utils/data'
// import { generateMessage } from '@/utils/data'

const MessageToolbarContent = () => {
	const messageStore = useMessageStore()
	const cacheStore = useCacheStore()

	const isNone = useMemo(() => messageStore.toolbarType === emojiOrMore.NONE, [messageStore.toolbarType])
	const isEmoji = useMemo(() => messageStore.toolbarType === emojiOrMore.EMOJI, [messageStore.toolbarType])
	const isMore = useMemo(() => messageStore.toolbarType === emojiOrMore.MORE, [messageStore.toolbarType])

	const handlerSelectFiles = async (files: FileList) => {
		// console.log('files', files)

		for (const file of files) {
			let fileMsg
			const type = file.type
			const typeText = fileTypeText(type)
			if (file.size > 1024 * 1024 * 500) {
				toastMessage('文件过大[仅支持不超过500M的文件]')
			}

			// console.log('file', file)

			// if (file) {
			//     const { width, height } = await cacheStore.getImageSize(file)
			// 	const reader = new FileReader()
			// 	reader.onload = function () {
			//         const img = new Image()
			//         img.src = reader.result as string
			// 		img.onload = function () {
			// 			console.log('宽度:', img.width, '高度:', img.height)
			// 		}
			// 	}
			// 	reader.readAsDataURL(file)
			// }

			try {
				const msg_type = fileMessageType(type)
				const videoCover = msg_type === msgType.VIDEO ? await getVideoCover(file) : ''

				const data = {
					content: typeText,
					cover: videoCover,
					url: await fileBase64(file),
					size: file.size,
					name: file.name,
					file_id: '',
					width: 0,
					height: 0
				}

				const message = generateMessage({
					content: JSON.stringify(data),
					msg_type
				})

				messageStore.createMessage(message)

				// 上传文件
				fileMsg = await uploadFile(file)

				data.url = fileMsg.url
				data.file_id = fileMsg.file_id

				const { width, height } = await getImageOrVideoSize(
					msg_type === msgType.VIDEO ? videoCover : fileMsg.url
				)

				await sendMessage({
					content: JSON.stringify({ ...data, width, height }),
					msg_type,
					isUpdate: false
				})
			} catch (error: any) {
				// if (!fileMsg) return
				toastMessage(error?.message ?? '发送失败')
			}
		}
	}

	return (
		<div
			className={clsx('w-full h-[300px] flex overflow-hidden', isNone && 'hidden')}
			style={{ height: cacheStore.keyboardHeight }}
		>
			<MessageEmojis
				onSelectEmojis={(emoji) => messageStore.update({ selectedEmojis: emoji.native })}
				className={clsx('w-full', !isEmoji && 'hidden')}
			/>
			<MessageMore
				members={[]}
				className={clsx('w-full', !isMore && 'hidden')}
				onSelectFiles={handlerSelectFiles}
			/>
		</div>
	)
}

export default MessageToolbarContent
