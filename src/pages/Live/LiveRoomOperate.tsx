import { OwnEventEnum, useLiveStore } from '@/stores/live'
import { Icon, Link } from 'framework7-react'

const LiveRoomOperate: React.FC<any> = (props: any) => {
	// 通话状态
	const liveStore = useLiveStore()

	// /** 拒绝接通 */
	// const refuse = () => {
	// }
	// /** 接通电话 */
	// const accept = () => {
	// }
	// /** 挂断电话 */
	// const hangup = () => {
	// }

	return (
		<div className="h-full flex flex-col" {...props}>
			<div className="h-16 px-4 flex justify-between items-center">
				<span></span>
				<span></span>
				<Link
					className="pt-1"
					iconF7="arrow_uturn_down_circle_fill"
					iconSize={30}
					// TODO: 最小化开启悬浮窗口
					onClick={() => liveStore.updateOpened(false)}
				/>
			</div>
			<div className="flex-1 flex overflow-scroll">{props.children && props.children}</div>
			<div className="min-h-64 flex justify-center items-center">
				<div className="flex flex-col justify-center items-center">
					<div
						className="p-4 rounded-full text-white bg-[#F9BAA7]"
						onClick={liveStore.ownEvent === OwnEventEnum.BUSY ? liveStore.hangup : liveStore.refuse}
					>
						<Icon className="rotate-90" f7="phone_fill" size={30} />
					</div>
					<span className="mt-2">{liveStore.ownEvent === OwnEventEnum.BUSY ? '挂断' : '拒绝'}</span>
				</div>
				{liveStore.ownEvent === OwnEventEnum.WAITING && (
					<div className="flex flex-col justify-center items-center">
						<div className="p-4 rounded-full text-white bg-[#65C6B0]" onClick={() => liveStore.accept()}>
							<Icon f7="phone_fill" size={30} />
						</div>
						<span className="mt-2">接听</span>
					</div>
				)}
			</div>
		</div>
	)
}

export default LiveRoomOperate
