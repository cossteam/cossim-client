import CallService from '@/api/call'
import { Icon, Popup } from 'framework7-react'
import { useEffect, useState } from 'react'

const LiveRoom: React.FC = () => {
	/** 隐藏房间 */
	const [hideRoom, setHideRoom] = useState(true)
	/** 通话中 */
	const [calling, setCalling] = useState(false)

	/** 检查用户与好友是否有通话 */
	const checkCalling = async () => {
		const { code, data } = await CallService.getLiveInfoUserApi()
		if (code === 200 && data) {
			setHideRoom(false)
		}
	}

	/** 加入通话 */
	const joinRoom = async () => {}

	/** 拒绝通话 */
	const rejectRoom = async () => {}

	/** 离开通话 */
	const leaveRoom = async () => {}

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
