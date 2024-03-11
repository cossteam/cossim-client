import { OwnEventEnum, useLiveStore } from '@/stores/live'
import { Page, PageContent, Popup } from 'framework7-react'
import { useEffect } from 'react'
import LiveRoomContent from './LiveRoomContent'
import LiveRoomOperate from './LiveRoomOperate'
import LiveRoomClient from './live'

const LiveRoom: React.FC = () => {
	// 通话状态
	const liveStore = useLiveStore()
	const SELF_NODE_ID = 'self_node'
	const OTHERS_NODE_ID = 'others_node'
	let liveRoomClient: LiveRoomClient

	// 监听我的通话事件
	useEffect(() => {
		console.log(liveStore.ownEventDesc(liveStore.ownEvent))
		switch (liveStore.ownEvent) {
			case OwnEventEnum.IDLE:
				// 空闲
				break
			case OwnEventEnum.WAITING:
				// 等待中
				break
			case OwnEventEnum.INVITED:
				// 被邀请
				liveStore.updateOpened(true)
				break
			case OwnEventEnum.REFUSE:
				// 已拒绝
				break
			case OwnEventEnum.REFUSED:
				// 被拒绝
				liveStore.refused()
				break
			case OwnEventEnum.BUSY:
				// 通话中
				console.log(liveStore.serverUrl, liveStore.token)
				if (liveStore.serverUrl === null || liveStore.token == null) return
				liveRoomClient = new LiveRoomClient(SELF_NODE_ID, OTHERS_NODE_ID, liveStore.serverUrl, liveStore.token)
				liveRoomClient
					.connect()
					.then(() => {
						liveRoomClient.createAudioTrack()
						liveRoomClient.createVideoTrack()
					})
					.catch((e: any) => {
						console.log('WS连接失败，以挂断', e)
						liveStore.hangup()
					})
				break
			case OwnEventEnum.HANGUP:
				// 已挂断
				break
			case OwnEventEnum.HANGED:
				// 被挂断
				liveStore.hanged()
				break
		}
		return () => {
			liveRoomClient?.disconnect()
		}
	}, [liveStore.ownEvent])

	/*
	 * 监听麦克风和摄像头状态
	 */
	useEffect(() => {
		if (!liveStore.audio) {
			liveRoomClient?.closeAorV('audio')
			console.log('关闭麦克风')
		} else if (liveStore.audio) {
			liveRoomClient?.createAudioTrack()
		}
	}, [liveStore.audio])
	useEffect(() => {
		if (!liveStore.video) {
			liveRoomClient?.closeAorV('video')
			console.log('关闭摄像头')
		} else if (liveStore.video) {
			liveRoomClient?.createVideoTrack()
		}
	}, [liveStore.video])

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
						{!liveStore.isGroup && <LiveRoomContent selfId={SELF_NODE_ID} othersId={OTHERS_NODE_ID} />}
					</div>
					<div className="absolute w-full h-full">
						{liveStore.isGroup ? (
							<LiveRoomOperate>
								<LiveRoomContent selfId={SELF_NODE_ID} othersId={OTHERS_NODE_ID} />
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
