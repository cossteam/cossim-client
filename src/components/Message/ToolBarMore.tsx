import { $t } from '@/shared'
import { useCallStore } from '@/stores/call'
import { hasCamera, hasMike } from '@/utils/media'
import { Icon, f7 } from 'framework7-react'
import { Router } from 'framework7/types'
import { useEffect, useState } from 'react'
import GroupService from '@/api/group'

interface ToolBarMoreProps {
	id: string
	is_group: boolean
	f7router: Router.Router
}

interface Tool {
	f7Icon: string
	text?: string
	// func?: () => Promise<void>
	params: boolean
}

const ToolBarMore: React.FC<ToolBarMoreProps> = (props) => {
	const { id, is_group } = props

	// 成员列表
	const [members, setMembers] = useState([])
	// 获取成员列表
	const loadMembers = async () => {
		const { code, data } = await GroupService.groupMemberApi({ group_id: props.id })
		const memberIds = data?.map((item: any) => item.user_id) ?? []
		code === 200 && setMembers(memberIds)
	}
	useEffect(() => {
		loadMembers()
	}, [])

	// 呼叫
	const { call, updateEnablesVideo } = useCallStore()
	const callTool = async (enableVideo: boolean) => {
		try {
			// 检查设备是否可用
			await hasMike()
			enableVideo && (await hasCamera())
			f7.dialog.preloader($t('呼叫中...'))
			// 是否开启摄像头
			updateEnablesVideo(enableVideo)
			const { code } = !is_group
				? await call({ userInfo: { user_id: id } })
				: await call({ groupInfo: { group_id: parseInt(id), member: members } })
			console.log('call status', code)
			code === 200 && props.f7router.navigate('/call/')
		} catch (error: any) {
			console.dir(error)
			if (error?.code === 8) {
				f7.dialog.alert($t('当前媒体设备不可用，无法接听来电'))
				return
			}
			f7.dialog.alert($t(error?.message || '呼叫失败...'))
		} finally {
			f7.dialog.close()
		}
	}

	// 工具
	const [tools] = useState<Tool[]>([
		{
			f7Icon: 'phone',
			text: '语音',
			// func: () => callTool(false)
			params: false
		},
		{
			f7Icon: 'videocam',
			text: '视频',
			// func: () => callTool(true)
			params: true
		}
	])
	return (
		<div className="toolbar-more w-full p-5 overflow-y-scroll grid grid-cols-5 gap-5">
			{tools.map((tool, toolIdx) => {
				return (
					<div
						key={toolIdx}
						className="toolbar-more__item size-16 bg-gray-50 rounded-lg text-black-500 flex flex-col justify-center items-center"
						onClick={() => callTool(tool.params)}
					>
						<Icon f7={tool.f7Icon} className="text-3xl mb-1" />
						<span className="text-xs">{tool.text}</span>
					</div>
				)
			})}
		</div>
	)
}

export default ToolBarMore
