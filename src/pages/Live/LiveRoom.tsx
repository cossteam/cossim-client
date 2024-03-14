import { OwnEventEnum, useLiveStore } from '@/stores/live'
import { Icon, Page, PageContent, Popup } from 'framework7-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import LiveRoomContent from './LiveRoomContent'
import LiveRoomOperate from './LiveRoomOperate'
import LiveRoomClient from './live'

const LiveRoom: React.FC = () => {
	// 通话状态
	const liveStore = useLiveStore()
	const ROOT_NODE_ID = 'LIVEROOM_ROOT_NODE_ID'
	const [connect, setConnect] = useState(false)

	const liveRoomClient = useRef<LiveRoomClient | null>(null)

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
				// 获取通话配置
				liveStore.configMedia({
					audio: true,
					video: false
				})
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
				if (liveStore.serverUrl === null || liveStore.token === null) return
				liveRoomClient.current = new LiveRoomClient(ROOT_NODE_ID, liveStore.serverUrl, liveStore.token)
				liveRoomClient.current
					.connect()
					.then(() => {
						liveStore.audio && liveRoomClient.current?.createAudioTrack()
						liveStore.video && liveRoomClient.current?.createVideoTrack()
						setConnect(true)
					})
					.catch((e: any) => {
						console.log('WS连接失败，以挂断', e)
						setConnect(false)
						// liveStore.hangup()
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
			liveRoomClient.current?.disconnect()
		}
	}, [liveStore.ownEvent])

	/*
	 * 监听麦克风和摄像头状态
	 */
	useEffect(() => {
		if (!connect) return
		if (!liveStore.audio) {
			console.log('关闭麦克风', liveRoomClient.current?.client)
			liveRoomClient.current?.closeAorV('audio')
		} else if (liveStore.audio) {
			liveRoomClient.current?.createAudioTrack()
			console.log('开启麦克风')
		}
	}, [liveStore.audio])
	useEffect(() => {
		if (!connect) return
		if (!liveStore.video) {
			console.log('关闭摄像头', liveRoomClient.current?.client)
			liveRoomClient.current?.closeAorV('video')
		} else if (liveStore.video) {
			liveRoomClient.current?.createVideoTrack()
			console.log('开启摄像头')
		}
	}, [liveStore.video])

	// 监听页面开关
	useEffect(() => {
		if (!liveStore.opened) {
			return
		}
	}, [liveStore.opened])

	const isGroup = useMemo(() => liveStore.isGroup, [liveStore.isGroup])

	return (
		<>
			<Popup opened={liveStore.opened} tabletFullscreen closeByBackdropClick={false}>
				<Page noNavbar noToolbar>
					<PageContent className=" bg-[rgba(0,0,0,0.73)] text-white ">
						<LiveRoomOperate>
							<LiveRoomContent isGroup={isGroup} rootNodeId={ROOT_NODE_ID} />
						</LiveRoomOperate>
					</PageContent>
				</Page>
			</Popup>
			{!liveStore.opened && liveStore.ownEvent !== OwnEventEnum.IDLE && (
				<div
					className="show-live z-[9999] bg-[rgba(0,0,0,0.8)] text-white py-4 pl-3 pr-2 rounded-l-lg fixed top-[20%] right-0"
					onClick={() => liveStore.updateOpened(!liveStore.opened)}
				>
					<Icon f7="phone_fill" />
				</div>
			)}
		</>
	)
}

export default LiveRoom
