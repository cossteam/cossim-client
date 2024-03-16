import { Icon, Link, Popup } from 'framework7-react'
import OperateButton from './OperateButton'
import { useEffect, useMemo, useState } from 'react'
import './index.scss'
import clsx from 'clsx'

const LiveRoomNew: React.FC = () => {
	useEffect(() => {
		setOpened(true)
	}, [])
	const [opened, setOpened] = useState(false)
	const isGroup = useMemo(() => {
		// return true
		return false
	}, [])
	const isBackend = useMemo(() => {
		return !opened
	}, [opened])
	return (
		<>
			<Popup
				opened={opened}
				tabletFullscreen
				closeByBackdropClick={false}
				className="bg-[rgba(0,0,0,.9)] text-white"
			>
				<div className="h-full flex flex-col justify-center items-center">
					<div className={clsx('w-full flex justify-between items-center', !isGroup ? 'absolute top-0' : '')}>
						<div className="flex-1 m-4 flex">
							<Link
								iconF7="arrow_uturn_down_circle_fill"
								color="white"
								onClick={() => {
									console.log('返回')
								}}
							/>
						</div>
						<div>
							<span>00:00</span>
						</div>
						<div className="flex-1 m-4 flex justify-end"></div>
					</div>
					<div className="w-full h-full overflow-y-auto">
						{Array.from({ length: 10 }).map((_, index) => {
							return (
								<div className="w-full h-full flex justify-center items-center overflow-hidden">
									<video
										key={index}
										className="max-w-none h-full"
										src="https://www.w3school.com.cn/example/html5/mov_bbb.mp4"
										autoPlay
										loop
										muted
										playsInline
									></video>
								</div>
							)
						})}
					</div>
					<div className={clsx('w-full', !isGroup ? 'absolute bottom-0' : '')}>
						{/* <div className="m-4 flex flex-col justify-evenly  items-center">
							<span>空闲</span>
						</div> */}
						<div className="m-4 flex justify-evenly items-center">
							<OperateButton f7Icon="mic_fill" text="麦克风" />
							<OperateButton f7Icon="phone_fill" iconRotate={134} backgroundColor="red" text="挂断" />
							<OperateButton f7Icon="videocam_fill" text="摄像头" />
						</div>
						{/* <div className="m-4 flex justify-evenly items-center">
							<OperateButton f7Icon="phone_fill" iconRotate={134} text="拒绝" />
							<OperateButton f7Icon="phone_fill" text="接通" />
						</div> */}
					</div>
				</div>
			</Popup>
			{isBackend && (
				<div
					className="show-live z-[9999] bg-[rgba(0,0,0,0.8)] text-white py-4 pl-3 pr-2 rounded-l-lg fixed top-[20%] right-0"
					onClick={() => {}}
				>
					<Icon f7="phone_fill" />
				</div>
			)}
		</>
	)
}

export default LiveRoomNew
