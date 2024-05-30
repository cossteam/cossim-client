import { Flex } from 'antd'
import useMobile from '@/hooks/useMobile'
import { useEffect, useState } from 'react'

export interface CallProps {
	mask?: boolean
}

const Call = () => {
	const { isMobile } = useMobile()
	const [mask, setMask] = useState(false)

	useEffect(() => {
		if (isMobile) {
			setMask(true)
		}
	}, [])

	const CallLayout = () => {
		return (
			<Flex
				className="w-screen h-screen text-white bg-black bg-opacity-40 fixed top-0 left-0 z-[9999]"
				vertical
				justify="flex-start"
				align="flex-start"
			>
				<div className="r w-[400px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">call</div>
			</Flex>
		)
	}

	return <>{mask ? <CallLayout /> : <CallLayout />}</>
}

export default Call
