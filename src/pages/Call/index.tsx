import clsx from 'clsx'
import { Icon, Link, Page, PageContent } from 'framework7-react'
import { useEffect, useState } from 'react'

const Call: React.FC<RouterProps> = () => {
	useEffect(() => {
		console.log('Call')
	}, [])

	const [isGroup, setIsGroup] = useState(false)
	const [videoEnable, setVideoEnable] = useState(false)
	const [frontCamera, setFrontCamera] = useState(true)
	const [audioEnable, setAudioEnable] = useState(true)
	const [isCallActive, setCallActive] = useState(false)
	const imgRul = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'

	useEffect(() => {
		setTimeout(() => {
			setIsGroup(false)
		})
	}, [])

	return (
		// <Page noNavbar noToolbar className="bg-[#040415] text-white">
		<Page noNavbar noToolbar>
			<PageContent className="h-full flex flex-col items-center">
				<div className="w-full h-16 px-2 flex justify-end">
					<Link className="px-2" popupClose>
						<Icon f7="arrow_up_right_square" size={20} />
					</Link>
				</div>
				<div className="flex-1 w-full flex flex-col">
					<div
						className={clsx(
							'h-3/5',
							isGroup
								? 'overflow-y-scroll grid grid-cols-2 gap-0'
								: 'flex flex-col justify-center items-center'
						)}
					>
						<div className="flex flex-col justify-center items-center">
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
							</>
						)}
					</div>
					<div className="h-2/5 grid grid-rows-6 grid-cols-6 gap-0">
						{/* <div className="h-2/5 flex justify-center bg-slate-500"> */}
						<div className="row-span-1 col-span-6 flex justify-center items-center">
							<span className="">20:00</span>
						</div>
						<div className="row-span-2 col-span-1 grid grid-rows-1 grid-cols-3 gap-0"></div>
						<div className="row-span-2 col-span-4 grid grid-rows-1 grid-cols-3 gap-0">
							<div className="flex justify-center">
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
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full bg-[#F9BAA7] text-white"
										onClick={() => setFrontCamera(!frontCamera)}
									>
										<Icon f7={frontCamera ? 'camera_rotate_fill' : 'camera_rotate'} size={30} />
									</div>
								</div>
							</div>
							<div className="flex justify-center">
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full bg-[#B9B3DD] text-white"
										onClick={() => setVideoEnable(!videoEnable)}
									>
										<Icon f7="videocam_fill" size={30} />
									</div>
								</div>
							</div>
						</div>
						<div className="row-span-2 col-span-1 grid grid-rows-1 grid-cols-3 gap-0"></div>
						<div className="row-span-2 col-span-1 grid grid-rows-1 grid-cols-3 gap-0"></div>
						<div className={clsx('row-span-2 col-span-4 grid grid-rows-1 grid-cols-3 gap-0')}>
							<div className="flex justify-center">
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full text-white bg-[#F9BAA7] rotate-90"
										onClick={() => setCallActive(!isCallActive)}
									>
										<Icon f7="phone_fill" size={30} />
									</div>
								</div>
							</div>
							<div></div>
							<div className="flex justify-center">
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full text-white bg-[#65C6B0]"
										onClick={() => setCallActive(!isCallActive)}
									>
										<Icon f7="phone_fill" size={30} />
									</div>
								</div>
							</div>
						</div>
						<div className="row-span-2 col-span-1 grid grid-rows-1 grid-cols-3 gap-0"></div>
						<div className="row-span-1 col-span-6"></div>
					</div>
				</div>
			</PageContent>
		</Page>
	)
}

export default Call
