import React, { useEffect, useState } from 'react'
import { Room } from 'livekit-client'
import { Button, Navbar, Page } from 'framework7-react'
import { useLiveStore } from '@/stores/live'
import { leaveLiveUserApi } from '@/api/live'
import { f7 } from 'framework7-react'

export default function App() {
	// 通话数据
	const { live, updateLive, updateLiveStatus } = useLiveStore()
	// const [room, setRoom] = useState(null)

	// 连接
	const joinLive = async () => {
		const { token, url } = live
		console.log('token', token)
		console.log('serverUrl', url)

		const room = new Room()
		room.localParticipant.setCameraEnabled(true)
		room.localParticipant.setMicrophoneEnabled(true)
		const { code, data } = await room.connect(url, token)
		console.log(code, data)
	}

	// 挂断
	const leaveLive = async () => {
		const { code, msg } = await leaveLiveUserApi({
			room: live.room
		})
		if (code === 200) {
			updateLiveStatus(-1)
			updateLive(null)
		}
		code !== 200 && f7.dialog.alert(msg)
	}

	// useEffect(() => {
	// 	if (live) {
	// 		joinLive()
	// 	}
	// 	return () => {
	// 		leaveLive()
	// 	}
	// }, [])

	return (
		<Page noToolbar className="">
			<Navbar className="messages-navbar bg-white" backLink></Navbar>
			<div className="p-4 flex flex-col gap-2">
				<Button color="blue" fill onClick={joinLive}>
					连接
				</Button>
				<Button color="blue" fill onClick={leaveLive}>
					挂断
				</Button>
			</div>
		</Page>
	)
}
