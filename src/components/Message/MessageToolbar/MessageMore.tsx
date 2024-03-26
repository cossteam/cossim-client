import { useLiveRoomStore } from '@/stores/liveRoom'
import useMessageStore from '@/stores/new_message'
import { useAsyncEffect, useFileDialog } from '@reactuses/core'
import clsx from 'clsx'
import { Icon } from 'framework7-react'
import { useEffect, useMemo, useRef, useState } from 'react'

interface MessageMoreProps {
	members: any[]
	onSelectFiles?: (files: FileList) => void
	className?: string
}

const MessageMore: React.FC<MessageMoreProps> = (props) => {
	const messageStore = useMessageStore()

	const id = useMemo(() => messageStore.receiverId, [messageStore.receiverId])
	const isGroup = useMemo(() => messageStore.isGroup, [messageStore.isGroup])

	const [media, openAlbum, resetMedia] = useFileDialog({
		multiple: true,
		accept: 'image/*, video/*'
	})
	const [files, openFolder, resetFiles] = useFileDialog({
		multiple: true,
		accept: '*'
	})
	const liveRoomStore = useLiveRoomStore()
	const [members, setMembers] = useState<any>()

	// 监听群成员变化
	useEffect(() => {
		if (props?.members?.length > 0) {
			setMembers(props?.members)
		}
	}, [props.members])

	// 文件选择
	const selectFiles = (isFile: boolean = false) => {
		if (isFile) {
			resetFiles()
			openFolder()
			return
		}
		resetMedia()
		openAlbum()
	}
	// 相机
	useAsyncEffect(
		async () => {
			if (!media || !media?.length) return
			props.onSelectFiles && props.onSelectFiles(media)
		},
		() => {},
		[media]
	)
	//  文件
	useAsyncEffect(
		async () => {
			if (!files || !files?.length) return
			// console.log('files', files)

			props.onSelectFiles && props.onSelectFiles(files)
		},
		() => {},
		[files]
	)
	// 相册
	const fileInputRef = useRef<any>()
	const handleFileChange = (e: any) => {
		props.onSelectFiles && props.onSelectFiles(e.target.files)
	}

	// 工具栏选项
	const tools = [
		{
			f7Icon: 'camera',
			text: '录像',
			func: () => selectFiles()
		},
		{
			f7Icon: 'doc',
			text: '文件',
			func: () => selectFiles(true)
		},
		{
			f7Icon: 'phone',
			text: '语音',
			func: () => liveRoomStore.call({ recipient: id, isGroup: isGroup, members, video: false })
		},
		{
			f7Icon: 'videocam',
			text: '视频',
			func: () => liveRoomStore.call({ recipient: id, isGroup: isGroup, members, video: true })
		}
	]

	return (
		<div className={clsx('toolbar-more w-full p-5 overflow-y-scroll grid grid-cols-5 gap-5', props.className)}>
			<div
				className="toolbar-more__item size-16 bg-gray-50 rounded-lg text-black-500 flex flex-col justify-center items-center"
				onClick={() => {
					fileInputRef.current.value = null
					fileInputRef.current.click()
				}}
			>
				<Icon f7="photo" className="text-3xl mb-1" />
				<span className="text-xs">相册</span>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*, video/*"
					multiple
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
			</div>
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
