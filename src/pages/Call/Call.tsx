import { Button, Page } from 'framework7-react'

import './Call.scss'
import { useCallStore } from '@/stores/call'
import { CallStatus } from '@/shared'
import { useEffect } from 'react'

const Call: React.FC<RouterProps> = ({ f7router }) => {
	const { callInfo, status, call, reject, accept, hangup } = useCallStore()

	useEffect(() => {
		console.log(status)
		console.log(callInfo)
		// if (status === CallStatus.IDLE) {
		//     call()
		// }
	}, [])

	return (
		<Page noNavbar noToolbar>
			Call
			{status === CallStatus.CONNECTED && (
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
			{status === CallStatus.CONNECTED && (
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
