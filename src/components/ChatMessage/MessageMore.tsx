import { useLiveStore } from '@/stores/live'
import { useAsyncEffect, useFileDialog } from '@reactuses/core'
import { Icon } from 'framework7-react'
import { Router } from 'framework7/types'
import { useEffect, useState } from 'react'

interface MessageMoreProps {
	id: string
	is_group: boolean
	f7router: Router.Router
	members: any[]
	onSelectFiles?: (files: FileList) => void
}

const MessageMore: React.FC<MessageMoreProps> = (props) => {
	const [files, open, reset] = useFileDialog({
		multiple: true,
		accept: 'image/*, video/*'
		// capture: 'user' // user | environment
	})
	const liveStore = useLiveStore()
	const [members, setMembers] = useState<any>()

	// 监听群成员变化
	useEffect(() => {
		if (props?.members?.length > 0) {
			setMembers(props?.members)
		}
	}, [props.members])

	// 文件选择
	const openAlbum = () => {
		reset()
		open()
	}
	useAsyncEffect(
		async () => {
			if (!files || !files?.length) return
			props.onSelectFiles && props.onSelectFiles(files)
		},
		() => {},
		[files]
	)

	// 工具栏选项
	const tools = [
		{
			f7Icon: 'photo',
			text: '相册',
			func: () => openAlbum()
		},
		{
			f7Icon: 'phone',
			text: '语音',
			func: () => liveStore.call({ id: props.id, isGroup: props.is_group, members, audio: true, video: false })
		},
		{
			f7Icon: 'videocam',
			text: '视频',
			func: () => liveStore.call({ id: props.id, isGroup: props.is_group, members, audio: true, video: true })
		}
	]

	return (
		<div className="toolbar-more w-full p-5 overflow-y-scroll grid grid-cols-5 gap-5">
			{tools.map((tool, toolIdx) => {
				return (
					<div
						key={toolIdx}
						className="toolbar-more__item size-16 bg-gray-50 rounded-lg text-black-500 flex flex-col justify-center items-center"
						onClick={tool.func}
					>
						<Icon f7={tool.f7Icon} className="text-3xl mb-1" />
						<span className="text-xs">{tool.text}</span>
					</div>
				)
			})}
		</div>
	)
}

export default MessageMore
