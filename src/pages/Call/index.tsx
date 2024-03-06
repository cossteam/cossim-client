import clsx from 'clsx'
import { Icon, Link, Page, PageContent } from 'framework7-react'
import { useEffect, useState } from 'react'

const Call: React.FC<RouterProps> = (props) => {
	useEffect(() => {
		console.log('Call', props)
	}, [])

	const [isCallActive, setCallActive] = useState(false)
	const [isGroup, setIsGroup] = useState(false)
	const [videoEnable, setVideoEnable] = useState(false)
	const [frontCamera, setFrontCamera] = useState(true)
	const [audioEnable, setAudioEnable] = useState(true)
	const imgRul = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'

	useEffect(() => {
		setIsGroup(false)
	}, [])

	return (
		<Page noNavbar noToolbar>
			<PageContent className="h-full relative flex flex-col ">
				<div className={clsx('p-2 flex justify-end', isGroup ? 'w-full' : 'fixed top-0 right-0')}>
					{/* <Button onClick={() => setIsGroup(!isGroup)}>切换群聊模式</Button> */}
					<Link className="" iconF7="arrow_up_right_square" iconSize={30} popupClose />
				</div>
				<div
					className={clsx(
						'w-full relative',
						isGroup ? 'overflow-y-auto grid grid-cols-2 gap-0' : ' absolute top-1/4 flex justify-center'
					)}
				>
					<div
						className={clsx(
							'bg-[reba(0,0,0,0.75)]',
							isGroup ? 'flex flex-col justify-center items-center' : ''
						)}
					>
						<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
						<div className="mt-2 text-gray-500 flex flex-col items-center">
							<span className="font-medium">阿芬</span>
						</div>
					</div>
					{isGroup && (
						<>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
						</>
					)}
				</div>
				{/* bg-[rgba(0,0,0,0.75)] text-white */}
				<div className={clsx('text-gray-400', isGroup ? '' : 'w-full fixed bottom-0')}>
					<div className="p-4 flex flex-col justify-center items-center">
						<span className="font-bold">{isCallActive ? '通话中' : '空闲'}</span>
						<span className="font-bold">{isCallActive ? '20:00' : '00:00'}</span>
					</div>
					<div className="pt-4 pb-10 grid grid-cols-5 gap-x-0 gap-y-5">
						<div className="col-span-2 flex justify-center">
							<div className="flex flex-col justify-center items-center">
								<div
									className="p-4 rounded-full bg-[#F9BAA7] text-white"
									onClick={() => setAudioEnable(!audioEnable)}
								>
									<Icon f7={audioEnable ? 'mic_fill' : 'mic'} size={30} />
								</div>
							</div>
						</div>
						<div className="flex justify-center">
							{videoEnable && (
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full bg-[#F9BAA7] text-white"
										onClick={() => setFrontCamera(!frontCamera)}
									>
										<Icon f7={frontCamera ? 'camera_rotate_fill' : 'camera_rotate'} size={30} />
									</div>
								</div>
							)}
						</div>
						<div className="col-span-2 flex justify-center">
							<div className="flex flex-col justify-center items-center">
								<div
									className="p-4 rounded-full bg-[#B9B3DD] text-white"
									onClick={() => setVideoEnable(!videoEnable)}
								>
									<Icon f7={videoEnable ? 'videocam_fill' : 'videocam'} size={30} />
								</div>
							</div>
						</div>
						<div className="col-span-2 flex justify-center">
							{!isCallActive && (
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full text-white bg-[#F9BAA7] rotate-90"
										onClick={() => setCallActive(false)}
									>
										<Icon f7="phone_fill" size={30} />
									</div>
								</div>
							)}
						</div>
						<div className="flex justify-center">
							{isCallActive && (
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full text-white bg-[#F9BAA7] rotate-90"
										onClick={() => setCallActive(false)}
									>
										<Icon f7="phone_fill" size={30} />
									</div>
								</div>
							)}
						</div>
						<div className="col-span-2 flex justify-center">
							{!isCallActive && (
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full text-white bg-[#65C6B0]"
										onClick={() => setCallActive(true)}
									>
										<Icon f7="phone_fill" size={30} />
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</PageContent>
		</Page>
	)
}

export default Call
