import React from 'react'
import '@livekit/components-styles'
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks
} from '@livekit/components-react'
import { Track } from 'livekit-client'

const serverUrl = 'wss://coss-kn6tndc5.livekit.cloud'
const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDY5MjYwNTEsImlzcyI6IkFQSVp4Nldmdm9QU1BxWCIsIm5iZiI6MTcwNjgzOTY1MSwic3ViIjoicXVpY2tzdGFydCB1c2VyIHdtMzNocSIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.jvOiC5Jdxj81kgJnEPc6Dyrb3gGfb9TYlMdUA9eJWoA'

export default function App() {
	return (
		<LiveKitRoom
			video={true}
			audio={true}
			token={token}
			serverUrl={serverUrl}
			// Use the default LiveKit theme for nice styles.
			data-lk-theme="default"
			style={{ height: '100vh' }}
		>
			{/* Your custom component with basic video conferencing functionality. */}
			<MyVideoConference />
			{/* The RoomAudioRenderer takes care of room-wide audio for you. */}
			<RoomAudioRenderer />
			{/* Controls for the user to start/stop audio, video, and screen 
      share tracks and to leave the room. */}
			<ControlBar />
		</LiveKitRoom>
	)
}

function MyVideoConference() {
	// `useTracks` returns all camera and screen share tracks. If a user
	// joins without a published camera track, a placeholder track is returned.
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false }
		],
		{ onlySubscribed: false }
	)
	return (
		<GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
			{/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
			<ParticipantTile />
		</GridLayout>
	)
}
