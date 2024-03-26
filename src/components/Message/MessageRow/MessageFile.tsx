import clsx from 'clsx'
import { Icon } from 'framework7-react'
import { useMemo } from 'react'

interface MessageFileProps {
	className?: string
	item: { [key: string]: any }
}

const MessageFile: React.FC<MessageFileProps> = ({ className, item }) => {
	const content = useMemo(() => {
		try {
			return JSON.parse(item.content)
		} catch (error) {
			return null
		}
	}, [item.content])

	const url = useMemo(() => content?.url ?? '', [content?.url])
	const fileName = useMemo(() => content?.name ?? '未命名文件', [content?.name])
	const fileSize = useMemo(() => {
		const size = content?.size / 1048576
		if (size <= 0) return '0KB'
		return Math.ceil(size).toFixed(2) + 'MB'
	}, [content?.size])

	const download = () => {
		if (!url) return
		window.open(url, '_blank')
	}

	return (
		<div className={clsx('flex items-center', className)} onClick={download}>
			{/* 文件 */}
			<Icon className="mr-2" f7="doc_fill" size="42" />
			<div>
				<div>{fileName}</div>
				<div>{fileSize}</div>
			</div>
		</div>
	)
}

export default MessageFile
