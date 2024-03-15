import { PrivateChats } from '@/types/db/user-db'
import clsx from 'clsx'
import { Icon } from 'framework7-react'
import { useMemo } from 'react'

interface MessageFileProps {
	className?: string
	msg: PrivateChats
}

const MessageFile: React.FC<MessageFileProps> = ({ className, msg }) => {
	const content = useMemo(() => {
		try {
			return JSON.parse(msg.content)
		} catch (error) {
			return null
		}
	}, [msg.content])

	const url = useMemo(() => content?.url ?? '', [content?.url])
	const fileName = useMemo(() => content?.name ?? '未命名文件', [content?.name])

	const download = () => {
		if (!url) return
		window.open(url, '_blank')
	}

	return (
		<div className={clsx('flex', className)} onClick={download}>
			{/* 文件 */}
			<Icon f7="doc_fill" size="24px" />
			<div>{fileName}</div>
		</div>
	)
}

export default MessageFile
