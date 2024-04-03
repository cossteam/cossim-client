import useMessageStore from '@/stores/message'
import { extractTextFromHTML } from '../script/shared'
import { useMemo } from 'react'
import { $t, tooltipType } from '@/shared'
import { Link } from 'framework7-react'
import { XmarkCircle } from 'framework7-icons/react'
// import { ReadEditor } from '@/Editor'

const MessageBlockquote = () => {
	const messageStore = useMessageStore()

	return useMemo(() => {
		const content = extractTextFromHTML(messageStore.selectedMessage?.content ?? '')

		if ([tooltipType.EDIT, tooltipType.REPLY].includes(messageStore.manualTipType)) {
			return (
				<div className="px-2 flex justify-between w-full mb-2 items-center">
					<div className="border-primary border-l-4 pl-2 max-w-[85%]">
						<p className="text-primary">
							{messageStore.tipType === tooltipType.EDIT
								? $t('编辑')
								: messageStore.selectedMessage?.sender_info?.name ?? $t('回复')}
						</p>
						<p className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{content}</p>
						{/* <ReadEditor
							content={messageStore.selectedMessage?.content}
							className="px-0 whitespace-nowrap text-ellipsis overflow-hidden w-full line-clamp-1"
						/> */}
					</div>
					<Link
						className="pr-2 text-lg"
						onClick={() => messageStore.update({ manualTipType: tooltipType.NONE, content: '' })}
					>
						<XmarkCircle className="text-textTertiary" />
					</Link>
				</div>
			)
		}

		return null
	}, [messageStore.manualTipType, messageStore.selectedMessage])
}

export default MessageBlockquote
