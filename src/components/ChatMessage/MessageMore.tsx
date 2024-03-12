import { useLiveStore } from '@/stores/live'
import { Icon } from 'framework7-react'
import { Router } from 'framework7/types'
import { useEffect, useRef, useState } from 'react'

interface MessageMoreProps {
	id: string
	is_group: boolean
	f7router: Router.Router
	members: any[]
	onSelectImages: (images: string[]) => void
}

const MessageMore: React.FC<MessageMoreProps> = (props) => {
	const liveStore = useLiveStore()
	const [members, setMembers] = useState<any>()

	// 获取成员
	useEffect(() => {
		if (props?.members?.length > 0) {
			setMembers(props?.members)
		}
	}, [props.members])

	// 访问相册
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [selectedFiles, setSelectedFiles] = useState([])
	const handleFileChange = (event: any) => {
		const files = event.target.files
		const filesBase64: any = []
		for (const file of files) {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = (e: any) => {
				// 获取文件的Base64数据
				const base64Data = e.target.result
				filesBase64.push(base64Data)
				console.log(filesBase64)
			}
		}
		setSelectedFiles(filesBase64)
	}
	const openAlbum = () => {
		fileInputRef.current?.click()
	}
	useEffect(() => {
		if (selectedFiles.length <= 0) return
		console.log('选中', selectedFiles)
	}, [selectedFiles])

	// 工具
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
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*, video/*"
				multiple
				className="hidden"
				onChange={handleFileChange}
			/>
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
