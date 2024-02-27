import { $t } from '@/shared'
import { useCallStore } from '@/stores/call'
import { hasCamera, hasMike } from '@/utils/media'
import { Icon, f7 } from 'framework7-react'
import { Router } from 'framework7/types'
import { useState } from 'react'

interface ToolBarMoreProps {
	id: string | number
	is_group: boolean
	f7router: Router.Router
}

interface Tool {
	f7Icon: string
	text?: string
	func: () => void
}

const ToolBarMore: React.FC<ToolBarMoreProps> = (props) => {
	const { id, is_group } = props
	console.log(id, is_group)

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
			!is_group ? await call({ userInfo: { user_id: id } }) : await call({ userInfo: { user_id: id } })
			f7.dialog.close()
			props.f7router.navigate('/call/')
		} catch (error: any) {
			console.log(error?.code, error?.code === 8)
			console.dir(error)
			if (error?.code === 8) {
				f7.dialog.alert($t('当前媒体设备不可用，无法接听来电'))
				return
			}
			f7.dialog.alert($t(error?.message || '呼叫失败...'))
		}
	}

	const [tools] = useState<Tool[]>([
		{
			f7Icon: 'phone',
			// text: 'Call',
			func: () => callTool(false)
		},
		{
			f7Icon: 'videocam',
			// text: 'Call',
			func: () => callTool(true)
		}
	])
	return (
		<div className="toolbar-more w-full max-h-full overflow-y-auto grid grid-cols-4">
			{tools.map((tool, toolIdx) => {
				return (
					<div
						key={toolIdx}
						className="toolbar-more__item size-11  my-4 mx-auto text-black-500 flex flex-col justify-center items-center"
						onClick={tool.func}
					>
						<Icon f7={tool.f7Icon} className=" text-4xl" />
						<span className=" text-xs">{tool.text}</span>
					</div>
				)
			})}
		</div>
	)
}

export default ToolBarMore
