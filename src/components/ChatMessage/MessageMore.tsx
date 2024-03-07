import { useNewCallStore } from '@/stores/new_call'
import { Icon } from 'framework7-react'
import { Router } from 'framework7/types'
import { useEffect, useState } from 'react'

interface MessageMoreProps {
	id: string
	is_group: boolean
	f7router: Router.Router
	members: any[]
}

const MessageMore: React.FC<MessageMoreProps> = (props) => {
	const newCallStore = useNewCallStore()
	const [members, setMembers] = useState<any>()

	useEffect(() => {
		if (props?.members?.length > 0) {
			setMembers(props?.members)
		}
	}, [props.members])

	// 呼叫
	// const { call, updateEnablesVideo } = useCallStore()
	// const callTool = async (enableVideo: boolean) => {
	// 	try {
	// 		// 检查设备是否可用
	// 		await hasMike()
	// 		enableVideo && (await hasCamera())
	// 		f7.dialog.preloader($t('呼叫中...'))
	// 		// 是否开启摄像头
	// 		updateEnablesVideo(enableVideo)
	// 		const { code } = !is_group
	// 			? await call({ userInfo: { user_id: id } })
	// 			: await call({ groupInfo: { group_id: parseInt(id), member: members } })
	// 		console.log('call status', code)
	// 		code === 200 && props.f7router.navigate('/call/')
	// 	} catch (error: any) {
	// 		console.dir(error)
	// 		if (error?.code === 8) {
	// 			f7.dialog.alert($t('当前媒体设备不可用，无法接听来电'))
	// 			return
	// 		}
	// 		f7.dialog.alert($t(error?.message || '呼叫失败...'))
	// 	} finally {
	// 		f7.dialog.close()
	// 	}
	// }
	const callTool = (enableVideo: boolean) => {
		const id = props?.id
		const option = {
			audioEnabled: true,
			videoEnabled: enableVideo
		}
		const isGroup = Boolean(props.is_group)
		newCallStore.call(id, option, isGroup, members)
	}

	// 工具
	const tools = [
		{
			f7Icon: 'phone',
			text: '语音',
			func: () => callTool(false)
		},
		{
			f7Icon: 'videocam',
			text: '视频',
			func: () => callTool(true)
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
