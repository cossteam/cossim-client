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
	/**
	 * 房间节点
	 */
	private rootNode: HTMLElement | null

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
	 * @param rootNodeId 根节点ID
	 * @param serverUrl 服务器地址
	 * @param token token
	 * @param options 通话配置
	 */
	constructor(rootNodeId: string, serverUrl: string, token: string, options?: RoomOptions) {
		this.rootNode = document.getElementById(rootNodeId)
		this.serverUrl = serverUrl
		this.token = token
		this.client = new Room({
			adaptiveStream: true,
			dynacast: true,
			audioCaptureDefaults: {},
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
				console.log('TrackPublication', publication)
				console.log('参与人', participant.videoTracks)
				if (track.kind === 'video') {
					const element: HTMLDivElement = document.createElement('div')
					element.className = 'video_box'
					element.appendChild(track.attach())
					this.rootNode?.appendChild(element)
				} else if (track.kind === 'audio') {
					track.attach().play()
				}
			}
		)
		// 监听用户离开
		this.client.on(
			RoomEvent.TrackUnsubscribed,
			(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
				console.log('监听用户离开', publication, participant)
				if (track.kind === 'video') {
					const el = track.attach()
					el.parentElement?.removeChild(el)
				} else if (track.kind === 'audio') {
					track.attach().pause()
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
		// const element = this.localAudioTrack.track.attach()
		// this.selfNode?.appendChild(element)
		// element?.play()
	}

	async createVideoTrack() {
		if (this.localVideoTrack) {
			this.client.localParticipant.setCameraEnabled(false)
			this.localVideoTrack = null
		}
		this.localVideoTrack = await this.client.localParticipant.setCameraEnabled(true)
		//播放本地视频
		const element: HTMLDivElement = document.createElement('div')
		element.className = 'self_video video_box'
		element.appendChild(this.localVideoTrack.track.attach())
		this.rootNode?.appendChild(element)
	}

	/**
	 * 关闭音频或者视频
	 */
	closeAorV(type: 'video' | 'audio') {
		console.log(type)
		if (type === 'audio') {
			// console.log('关闭音频', this.localAudioTrack)
			if (this.localAudioTrack) {
				this.client.localParticipant.setMicrophoneEnabled(false)
				console.log(this.localAudioTrack)
				this.localAudioTrack.track.detach()
				this.localAudioTrack = null
			}
		} else if (type === 'video') {
			// console.log('关闭视频', this.localVideoTrack)
			if (this.localVideoTrack) {
				this.client.localParticipant.setCameraEnabled(false)
				console.log(this.localVideoTrack)
				const el = this.localVideoTrack.track.attach()
				el.parentElement?.removeChild(el)
				this.localVideoTrack.track.detach()
				this.localVideoTrack = null
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
			if (this.rootNode) this.rootNode.innerHTML = ''
		}
		return this.client.disconnect()
	}
}
