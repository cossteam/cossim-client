import { LKFeatureContext, LiveKitRoomProps, RoomContext, useLiveKitRoom } from '@livekit/components-react'

export function CallRoom(props: React.PropsWithChildren<LiveKitRoomProps>) {
	const { room, htmlProps } = useLiveKitRoom(props)
	return (
		<div {...htmlProps}>
			{room && (
				<RoomContext.Provider value={room}>
					<LKFeatureContext.Provider value={props.featureFlags}>{props.children}</LKFeatureContext.Provider>
				</RoomContext.Provider>
			)}
		</div>
	)
}
