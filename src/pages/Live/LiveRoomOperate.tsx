import { OwnEventEnum, useLiveStore } from '@/stores/live'
import { Link } from 'framework7-react'
import OperateButton from './OperateButton'

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
				<Link
					className="pt-1"
					iconF7="arrow_uturn_down_circle_fill"
					iconSize={30}
					// TODO: 最小化开启悬浮窗口
					onClick={() => liveStore.updateOpened(false)}
				/>
				<span></span>
				<span></span>
			</div>
			<div className="flex-1 flex overflow-scroll">{props.children && props.children}</div>
			{/* <div className="min-h-64 pt-4 flex flex-col bg-[rgb(0,0,0,0.05)]"> */}
			<div className="min-h-64 pt-4 flex flex-col">
				<div className="text-center">{liveStore.ownEventDesc(liveStore.ownEvent)}</div>
				<div className="flex-1 flex justify-evenly items-center">
					<OperateButton
						f7Icon={liveStore.audio ? 'mic_fill' : 'mic'}
						backgroundColor="#B9B3DD"
						text="麦克风"
						onClick={() =>
							liveStore.configMedia({
								audio: !liveStore.audio
							})
						}
					/>
					<OperateButton
						f7Icon={liveStore.video ? 'videocam_fill' : 'videocam'}
						backgroundColor="#B9B3DD"
						text="视频"
						onClick={() =>
							liveStore.configMedia({
								video: !liveStore.video
							})
						}
					/>
				</div>
				<div className="flex-1 flex justify-evenly items-center">
					{liveStore.ownEvent === OwnEventEnum.BUSY ? (
						<OperateButton
							f7Icon="phone_fill"
							iconClassName="rotate-90"
							text="挂断"
							backgroundColor="#F9BAA7"
							onClick={liveStore.hangup}
						/>
					) : (
						<OperateButton
							f7Icon="phone_fill"
							iconClassName="rotate-90"
							text="拒绝"
							backgroundColor="#F9BAA7"
							onClick={liveStore.refuse}
						/>
					)}
					{liveStore.ownEvent === OwnEventEnum.INVITED && (
						<OperateButton
							f7Icon="phone_fill"
							text="接听"
							backgroundColor="#65C6B0"
							onClick={liveStore.accept}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default LiveRoomOperate
