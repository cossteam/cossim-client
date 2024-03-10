import { OwnEventEnum, useLiveStore } from '@/stores/live'
import { Page, PageContent, Popup } from 'framework7-react'
import { useEffect } from 'react'
import LiveRoomContent from './LiveRoomContent'
import LiveRoomOperate from './LiveRoomOperate'
import LiveRoomClient from './live'

const LiveRoom: React.FC = () => {
	// 通话状态
	const liveStore = useLiveStore()
	const ROOTNODEID = 'live-room-content'
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
				// eslint-disable-next-line no-case-declarations
				const url: any = 'ws://localhost:7880' ?? liveStore.serverUrl!
				// eslint-disable-next-line no-case-declarations
				const token: any =
					'eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6IjU1MCJ9LCJpc3MiOiJkZXZrZXkiLCJleHAiOjE3MTAxMjA1MjcsIm5iZiI6MCwic3ViIjoibW8ifQ.F7_33IT2WC-T-STkeCdkuD7isEaXnAkoW9ZP9cwZ7vk' ??
					liveStore.token
				liveRoomClient = new LiveRoomClient(ROOTNODEID, url, token)
				liveRoomClient
					.connect()
					.then(() => {
						liveRoomClient.createVideoTrack()
					})
					.catch((e) => {
						console.log(e)
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
						{!liveStore.isGroup && <LiveRoomContent id={ROOTNODEID} />}
					</div>
					<div className="absolute w-full h-full">
						{liveStore.isGroup ? (
							<LiveRoomOperate>
								<LiveRoomContent id={ROOTNODEID} />
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
