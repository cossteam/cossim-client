import { Button, Page } from 'framework7-react'

import './Call.scss'
import { useCallStore } from '@/stores/call'
import { CallStatus } from '@/shared'
import { useEffect } from 'react'

const Call: React.FC<RouterProps> = ({ f7router }) => {
	const { callInfo, status, reject, accept, hangup } = useCallStore()

	useEffect(() => {
		console.log(callInfo)
		// if (status === CallStatus.IDLE) {
		//     call()
		// }
	}, [])

	return (
		<Page noNavbar noToolbar>
			{status}
			{status === CallStatus.WAITING && (
				<>
					<Button
						raised
						fill
						round
						color="red"
						onClick={() => {
							reject(() => {
								f7router.back()
							})
						}}
					>
						拒绝
					</Button>
					<Button
						raised
						fill
						round
						onClick={() => {
							accept()
						}}
					>
						接通
					</Button>
				</>
			)}
			{[CallStatus.CALLING, CallStatus.CALLING].includes(status) && (
				<Button
					raised
					fill
					round
					color="red"
					onClick={() => {
						hangup(() => {
							f7router.back()
						})
					}}
				>
					挂断
				</Button>
			)}
		</Page>
	)
}

export default Call
