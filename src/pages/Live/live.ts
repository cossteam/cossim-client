import {
	RemoteParticipant,
	RemoteTrack,
	RemoteTrackPublication,
	Room,
	RoomEvent,
	RoomOptions,
	VideoPresets
} from 'livekit-client'

export default class LiveRoomClient {
	public NODEID_OTHERS_ID = 'live-content-others'
	public NODEID_SELF_ID = 'live-content-self'
	/**
	 * 房间根节点
	 */
	private othersNode: HTMLElement | null
	private selfNode: HTMLElement | null

	/**
	 * 服务器地址
	 */
	private serverUrl: string

	/**
	 * 房间token
	 */
	private token: string

	/**
	 * 本地客服端
	 */
	public client: Room

	/**
	 * 本地音频流
	 */
	private localAudioTrack: any

	/**
	 * 本地视频流
	 */
	private localVideoTrack: any

	/**
	 * 本地投屏流
	 */
	// private screenVideoTrack: any

	/**
	 * LiveKit 客户端
	 * @param othersNode 根节点
	 * @param serverUrl 服务器地址
	 * @param token 凭证
	 * @param options 通话配置
	 */
	constructor(selfNodeId: string, othersNodeId: string, serverUrl: string, token: string, options?: RoomOptions) {
		this.selfNode = document.getElementById(selfNodeId)
		this.othersNode = document.getElementById(othersNodeId)
		this.serverUrl = serverUrl
		this.token = token
		this.client = new Room({
			adaptiveStream: true,
			dynacast: true,
			videoCaptureDefaults: {
				// resolution: VideoPresets.h90.resolution
				resolution: VideoPresets.h720.resolution
			},
			...options
		})
		this.client.prepareConnection(serverUrl, token)
		this.init()
	}

	init() {
		// 处理跟踪订阅  participant.identity 创建连接时userId
		this.client.on(
			RoomEvent.TrackSubscribed,
			(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
				if (track.kind === 'video') {
					console.log('publication', publication)
					console.log('participant', participant)
					console.log('identity', participant.identity, publication.mimeType)
					this.othersNode?.appendChild(track.attach())
				} else if (track.kind === 'audio') {
					console.log('publication', publication.mimeType)
					console.log('participant', participant)
					console.log('identity', participant.identity, publication.mimeType)
					this.othersNode?.appendChild(track.attach())
					track.attach().play()
				}
			}
		)
		// 监听用户离开
		this.client.on(
			RoomEvent.TrackUnsubscribed,
			(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
				// if (track.kind === 'video') {
				//     deleteChild(participant.identity)
				// } else if (track.kind === 'audio') {
				// 	track.attach().pause()
				// }
				if (track.kind === 'video') {
					console.log('publication', publication)
					console.log('participant', participant)
					console.log('identity', participant.identity, publication.mimeType)
					this.othersNode?.appendChild(track.attach())
				} else if (track.kind === 'audio') {
					console.log('publication', publication.mimeType)
					console.log('participant', participant)
					console.log('identity', participant.identity, publication.mimeType)
					track.attach().play()
				}
			}
		)
		// 关闭音频或者视频 只监听 video
		this.client.on(
			RoomEvent.TrackMuted,
			() => {}
			// (publication: RemoteTrackPublication, participant: RemoteParticipant) => {
			//     if (participant.identity !== this.options.userId && publication.kind === 'video') {
			//         deleteChild(participant.identity)
			//     }
			// }
		)
		// 打开音频或者视频
		this.client.on(
			RoomEvent.TrackUnmuted,
			() => {}
			// (publication: RemoteTrackPublication, participant: RemoteParticipant) => {
			// 	// 这里过滤掉自己的音视频变化。也可以不过滤在上面删除挂载dom操作
			// 	if (participant.identity !== this.options.userId && publication.kind === 'video') {
			// 		if (publication.track) {
			// 			attachTrack(publication.track.attach(), participant.identity)
			// 		}
			// 	}
			// }
		)
	}

	async createAudioTrack() {
		if (this.localAudioTrack) {
			this.client.localParticipant.setMicrophoneEnabled(false)
			this.localAudioTrack = null
		}
		this.localAudioTrack = await this.client.localParticipant.setMicrophoneEnabled(true)
		//播放本地音频
		const element = this.localAudioTrack.track.attach()
		this.selfNode?.appendChild(element)
		element?.play()
	}

	async createVideoTrack() {
		if (this.localVideoTrack) {
			this.client.localParticipant.setCameraEnabled(false)
			this.localVideoTrack = null
		}
		this.localVideoTrack = await this.client.localParticipant.setCameraEnabled(true)
		//播放本地视频
		const element = this.localVideoTrack.track.attach()
		this.selfNode?.appendChild(element)
	}

	/**
	 * 关闭音频或者视频
	 */
	closeAorV(type: 'video' | 'audio') {
		console.log(type)

		if (type === 'video') {
			if (this.localVideoTrack) {
				this.client.localParticipant.setCameraEnabled(false)
				this.localVideoTrack.track.detach()
				this.localVideoTrack = null
			}
		} else if (type === 'audio') {
			if (this.localAudioTrack) {
				this.client.localParticipant.setMicrophoneEnabled(false)
				this.localAudioTrack.track.detach()
				this.localAudioTrack = null
			}
		}
	}

	connect() {
		return this.client.connect(this.serverUrl, this.token)
	}

	disconnect() {
		if (this.localVideoTrack) {
			this.client.localParticipant.setCameraEnabled(false)
			this.localVideoTrack = null
			if (this.selfNode) this.selfNode.innerHTML = ''
			if (this.othersNode) this.othersNode.innerHTML = ''
		}
		return this.client.disconnect()
	}
}
