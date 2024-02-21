import { Page } from 'framework7-react'

// import '@livekit/components-styles'
import { Room } from 'livekit-client'

import './Call.scss'
import { useCallStore } from '@/stores/call'
import { CallStatus, getStatusDescription } from '@/shared'
import { useEffect } from 'react'
import { PhoneFill } from 'framework7-icons/react'

const Call: React.FC<RouterProps> = ({ f7router }) => {
	const { callInfo, status, reject, accept, hangup } = useCallStore()

	useEffect(() => {
		;(async () => {
			if (status !== CallStatus.CALLING || !callInfo?.wsInfo) return
			console.log(getStatusDescription(status), callInfo?.wsInfo)
			const room = new Room()
			await room.connect(callInfo.wsInfo.url, callInfo.wsInfo.token)
		})()
	}, [status, callInfo?.wsInfo])

	return (
		<Page className="p-4 bg-bgPrimary flex flex-col justify-center items-center">
			<div>{getStatusDescription(status)}</div>
			{status === CallStatus.WAITING && (
				<>
					{/* 拒绝 */}
					<PhoneFill
						className="w-[30px] h-[30px] text-red-500"
						onClick={async () => {
							await reject()
							f7router.back()
						}}
					/>
					{/* 接通 */}
					<PhoneFill
						className="w-[30px] h-[30px] text-green-500"
						onClick={async () => {
							await accept()
						}}
					/>
				</>
			)}
			{[CallStatus.CALLING].includes(status) && (
				// 挂断
				<PhoneFill
					className="w-[30px] h-[30px] text-red-500"
					onClick={async () => {
						await hangup()
						f7router.back()
					}}
				/>
			)}
		</Page>
	)
}

export default Call
