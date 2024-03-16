import { Icon, Link, Popup } from 'framework7-react'
import OperateButton from './OperateButton'
import { useEffect, useMemo, useState } from 'react'
import './index.scss'
import clsx from 'clsx'

const LiveRoomNew: React.FC = () => {
	const [opened, setOpened] = useState(false)
	useEffect(() => {
		if (opened) return
		setTimeout(() => {
			setOpened(true)
		}, 1000)
	}, [opened])
	const [isBackend] = useState(false)
	const isGroup = useMemo(() => {
		// return true
		return false
	}, [])
	const [avctiv, setAvctiv] = useState(-1)
	const videoSize = useMemo(() => {
		const width = document.body.clientWidth
		return width > 0 ? Math.floor(width / 2) : 0
	}, [document.body.clientWidth])
	const [videosTop, setVideosTop] = useState(0)
	const onVideosScroll = (e: any) => {
		setVideosTop(e.target.scrollTop)
	}
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
								onClick={() => setOpened(!opened)}
							/>
						</div>
						<div>
							<span>00:00</span>
						</div>
						<div className="flex-1 m-4 flex justify-end"></div>
					</div>
					{!isGroup ? (
						<div id="videos" className="w-full h-full">
							{/* 监听房间内用户数量变化时，将 avctiv 设置为 0 （默认先添加自己的视频流） */}
							{Array.from({ length: 2 }).map((_, index) => {
								return (
									<div
										className="flex justify-center items-center overflow-hidden"
										style={{
											width: avctiv === index ? `100px` : `100%`,
											height: avctiv === index ? `150px` : `100%`,
											position: avctiv === index ? 'fixed' : 'relative',
											top: avctiv === index ? `3%` : 'auto',
											right: avctiv === index ? `5%` : 'auto',
											zIndex: avctiv === index ? 999 : 0
										}}
										onClick={() => setAvctiv(index)}
									>
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
					) : (
						<div
							id="videos"
							className="w-full h-full max-h-fit flex flex-wrap"
							style={{
								overflowY: avctiv === -1 ? 'auto' : 'hidden',
								position: 'relative'
							}}
							onScroll={onVideosScroll}
						>
							{Array.from({ length: 10 }).map((_, index) => {
								return (
									<div
										className="flex justify-center items-center overflow-hidden"
										style={{
											width: avctiv === index ? `100%` : `${videoSize}px`,
											height: avctiv === index ? `100%` : `${videoSize}px`,
											position: avctiv === index ? 'absolute' : 'relative',
											top: avctiv === index ? `${videosTop}px` : 'auto',
											left: avctiv === index ? 0 : 'auto',
											zIndex: avctiv === index ? 999 : 0
										}}
										onClick={() => setAvctiv(avctiv === index ? -1 : index)}
									>
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
					)}
					<div className={clsx('w-full', !isGroup ? 'absolute bottom-0' : '')}>
						<div className="m-4 flex flex-col justify-evenly  items-center">
							<span>空闲</span>
						</div>
						<div className="m-4 flex justify-evenly items-center">
							<OperateButton f7Icon="mic_fill" text="麦克风" />
							<OperateButton
								f7Icon="phone_fill"
								text="挂断"
								iconRotate={134}
								iconColor="#fff"
								backgroundColor="#ff4949"
							/>
							<OperateButton f7Icon="videocam_fill" text="摄像头" />
						</div>
						<div className="m-4 flex justify-evenly items-center">
							<OperateButton
								f7Icon="phone_fill"
								text="拒绝"
								iconRotate={134}
								iconColor="#fff"
								backgroundColor="#ff4949"
							/>
							<OperateButton
								f7Icon="phone_fill"
								text="挂断"
								iconRotate={134}
								iconColor="#fff"
								backgroundColor="#ff4949"
							/>
							<OperateButton f7Icon="phone_fill" text="接通" iconColor="#fff" backgroundColor="#43d143" />
						</div>
					</div>
				</div>
			</Popup>
			{isBackend && (
				<div
					className="show-live z-[9999] bg-[rgba(0,0,0,0.8)] text-white py-3 px-2 rounded-l-lg fixed top-[20%] right-0"
					onClick={() => {}}
				>
					<Icon f7="phone_fill" size={20} />
				</div>
			)}
		</>
	)
}

export default LiveRoomNew
