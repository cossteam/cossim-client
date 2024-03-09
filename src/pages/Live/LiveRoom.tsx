import { OwnEventEnum, useLiveStore } from '@/stores/live'
import { Page, PageContent, Popup } from 'framework7-react'
import { useEffect } from 'react'
import LiveRoomContent from './LiveRoomContent'
import LiveRoomOperate from './LiveRoomOperate'
import { SocketEvent } from '@/shared'

const LiveRoom: React.FC = () => {
	// 通话状态
	const liveStore = useLiveStore()

	// 被呼叫
	const callMe = () => {
		liveStore.updateOpened(true)
	}
	// 关闭通话页面
	const closeLive = (beforeClose?: () => void) => {
		beforeClose && beforeClose()
		setTimeout(() => {
			liveStore.updateOpened(false)
		}, 2000)
	}

	// 监听对方通话事件
	useEffect(() => {
		switch (liveStore.event) {
			case SocketEvent.UserCallReqEvent:
			case SocketEvent.GroupCallReqEvent:
				callMe()
				break
			case SocketEvent.UserCallRejectEvent:
			case SocketEvent.GroupCallRejectEvent:
				closeLive()
				break
			case SocketEvent.UserCallHangupEvent:
			case SocketEvent.GroupCallHangupEvent:
				closeLive()
				break
		}
	}, [liveStore.event])

	// 监听我的通话事件
	useEffect(() => {
		console.log(liveStore.ownEventDesc(liveStore.ownEvent))
		switch (liveStore.ownEvent) {
			case OwnEventEnum.IDLE:
				break
			case OwnEventEnum.WAITING:
				break
			case OwnEventEnum.REFUSE:
				break
			case OwnEventEnum.BUSY:
				break
			case OwnEventEnum.HANGUP:
				break
		}
	}, [liveStore.ownEvent])

	// 监听页面开关
	useEffect(() => {
		if (!liveStore.opened) {
			return
		}
	}, [liveStore.opened])

	return (
		<Popup opened={liveStore.opened} tabletFullscreen closeByBackdropClick={false}>
			<Page noNavbar noToolbar>
				<PageContent className=" bg-[rgba(0,0,0,0.73)] text-white ">
					<div className="absolute w-full h-full">
						{!liveStore.isGroup && <LiveRoomContent id="live-room-content" />}
					</div>
					<div className="absolute w-full h-full">
						{liveStore.isGroup ? (
							<LiveRoomOperate>
								<LiveRoomContent id="live-room-content" />
							</LiveRoomOperate>
						) : (
							<LiveRoomOperate />
						)}
					</div>
				</PageContent>
			</Page>
		</Popup>
	)
}

export default LiveRoom
