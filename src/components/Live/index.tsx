import CallService from '@/api/call'
import { Icon, Popup } from 'framework7-react'
import { Room, VideoPresets } from 'livekit-client'
import { useEffect, useRef, useState } from 'react'

/* 测试 */
const LiveRoom: React.FC = () => {
	/** 客户端 */
	const client = useRef<Room>()
	/** 隐藏房间 */
	const [hideRoom, setHideRoom] = useState(true)
	/** 通话中 */
	// const [calling, setCalling] = useState(false)
	const [calling] = useState(false)

	/** 初始化客户端 */
	const initClient = async () => {
		client.current = new Room({
			adaptiveStream: true,
			dynacast: true,
			videoCaptureDefaults: {
				// resolution: VideoPresets.h90.resolution
				resolution: VideoPresets.h720.resolution
			}
		})
		console.log(client.current)
	}

	/** 检查用户与好友是否有通话 */
	const checkCalling = async () => {
		const { code, data } = await CallService.getLiveInfoUserApi()
		console.log('检查通话', data)
		if (code === 200 && data) {
			initClient()
			setHideRoom(false)
		}
	}

	/** 初始化 */
	useEffect(() => {
		checkCalling()
	}, [])

	return (
		<>
			<Popup
				opened={!hideRoom}
				tabletFullscreen
				closeByBackdropClick={false}
				className="live-room bg-bgPrimary text-textPrimary"
			>
				123
			</Popup>
			{hideRoom && calling && (
				<div className="size-10 rounded-l-lg bg-black text-white opacity-50 transition-opacity-[0.3s] flex justify-center items-center fixed top-1/3 right-0 z-[99999]">
					<Icon f7="phone_fill" size={20} />
				</div>
			)}
		</>
	)
}

export default LiveRoom
