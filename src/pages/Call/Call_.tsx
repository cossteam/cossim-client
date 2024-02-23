import { Button, Page } from 'framework7-react'
import { CallStatus } from '@/shared'
import { useCallStore } from '@/stores/call'
import '@livekit/components-styles'
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	PreJoin,
	RoomAudioRenderer,
	useTracks
} from '@livekit/components-react'
import { Track } from 'livekit-client'

const Call: React.FC<RouterProps> = ({ f7router }) => {
	console.log(f7router)
	const { callInfo, status, hangup } = useCallStore()
	console.log(status)

	return (
		<Page noNavbar noToolbar>
			{status === CallStatus.WAITING ? (
				<>
					<LiveKitRoom
						data-lk-theme="default"
						token={callInfo.wsInfo.token}
						serverUrl={callInfo.wsInfo.url}
						audio={true}
						video={true}
						screen={false}
					>
						<Button raised fill color="blue" className="mx-[20%]" onClick={hangup}>
							挂断
						</Button>
						<PreJoin />
					</LiveKitRoom>
				</>
			) : (
				<LiveKitRoom
					data-lk-theme="default"
					token={callInfo.wsInfo.token}
					serverUrl={callInfo.wsInfo.url}
					audio={true}
					video={true}
					screen={false}
				>
					<MyVideoConference />
					<RoomAudioRenderer />
					<ControlBar />
				</LiveKitRoom>
			)}
		</Page>
	)
}

function MyVideoConference() {
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			// { source: Track.Source.ScreenShareAudio, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false }
		],
		{ onlySubscribed: false }
	)
	return (
		<GridLayout tracks={tracks} style={{ height: 'calc(100% - var(--lk-control-bar-height))' }}>
			<ParticipantTile />
		</GridLayout>
	)
}

export default Call
