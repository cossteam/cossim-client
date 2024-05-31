import { PhoneFilled, RollbackOutlined } from '@ant-design/icons'
import { Avatar, Flex } from 'antd'
import clsx from 'clsx'
import React, { memo, useEffect, useRef, useState } from 'react'
import useMobile from '@/hooks/useMobile'
import useDraggable from '@/hooks/useDraggable'

export interface CallProps {
	mask?: boolean
}

const Call: React.FC<CallProps> = memo(() => {
	const { isMobile } = useMobile()
	const [open, setOpen] = useState(false)
	const [runningBackground, setRunningBackground] = useState(false)

	const el = useRef<HTMLDivElement>(null)
	const { isDraggable } = useDraggable(el.current)

	const [avatar, setAvatar] = useState('')

	useEffect(() => {
		setOpen(false)
		setAvatar('https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp')
		return () => {
			setOpen(false)
			setAvatar('')
		}
	}, [])

	return (
		<>
			<div
				className={clsx(
					'size-14 text-white bg-black bg-opacity-40 flex justify-center items-center rounded-sm fixed top-0 right-0 z-[9999]',
					open && runningBackground ? 'block' : 'hidden'
				)}
				onClick={() => setRunningBackground(false)}
			>
				<PhoneFilled className="text-2xl" />
				{isDraggable ? '拖动' : '未拖动'}
			</div>
			<div
				className={clsx(
					'w-screen h-screen text-white bg-black bg-opacity-40 fixed top-0 left-0 z-[9999]',
					open && !runningBackground ? 'block' : 'hidden'
				)}
			>
				<Flex
					ref={el}
					className={clsx(
						'relative p-4 rounded-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur overflow-hidden',
						isMobile ? 'w-full h-full' : 'w-[400px] h-[550px]'
					)}
					style={{
						backgroundColor: avatar ? '#000' : '#fff',
						color: !avatar ? 'black' : 'white'
					}}
					vertical
					justify="flex-start"
					align="center"
				>
					{avatar && (
						<div
							className="absolute inset-0 z-0"
							style={{
								backgroundImage: `url(${avatar})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
								filter: 'blur(20px)'
							}}
						/>
					)}
					<Flex className="w-full h-full z-10" vertical justify="center" align="center">
						<Flex className="w-full font-bold" justify="space-between">
							<div className="flex-1">
								<RollbackOutlined onClick={() => setRunningBackground(true)} />
							</div>
							<div className="">00:00</div>
							<div className="flex-1"></div>
						</Flex>
						<Flex className="flex-1 font-bold gap-2" vertical justify="center">
							<Avatar size={120} src={avatar} />
							<span className="text-xl text-center">ff1005</span>
						</Flex>
						<Flex className="gap-20">
							{/* 圆形按钮 */}
							<Flex className="gap-2" vertical align="center">
								<Flex
									className="size-16 text-2xl bg-red-500 rounded-full rotate-[-135deg]"
									justify="center"
								>
									<PhoneFilled />
								</Flex>
								<span className="text-sm">挂断</span>
							</Flex>
							<Flex className="gap-2" vertical align="center">
								<Flex className="size-16 text-2xl bg-green-500 rounded-full" justify="center">
									<PhoneFilled />
								</Flex>
								<span className="text-sm">接通</span>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</div>
		</>
	)
})

export default Call
