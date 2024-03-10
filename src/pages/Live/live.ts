import { Room, RoomEvent, RoomOptions, VideoPresets } from 'livekit-client'

export default class LiveRoomClient {
	/**
	 * 房间根节点
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
	// private localAudioTrack: any

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
	 * @param rootNodeId 根节点
	 * @param serverUrl 服务器地址
	 * @param token 凭证
	 * @param options 通话配置
	 */
	constructor(rootNodeId: string, serverUrl: string, token: string, options?: RoomOptions) {
		this.rootNode = document.getElementById(rootNodeId)
		this.serverUrl = serverUrl
		this.token = token
		this.client = new Room({
			adaptiveStream: true,
			dynacast: true,
			videoCaptureDefaults: {
				resolution: VideoPresets.h90.resolution
				// resolution: VideoPresets.h720.resolution
			},
			...options
		})
		this.client.prepareConnection(serverUrl, token)
		this.init()
	}

	init() {
		this.client.on(RoomEvent.Connected, () => {
			console.log('Connected')
		})
		this.client.on(RoomEvent.TrackPublished, () => {
			console.log('TrackPublished')
		})
	}

	async createVideoTrack() {
		if (this.localVideoTrack) {
			this.client.localParticipant.setCameraEnabled(false)
			this.localVideoTrack = null
		}
		this.localVideoTrack = await this.client.localParticipant.setCameraEnabled(true)
		//播放本地视频
		const element = this.localVideoTrack.track.attach()
		this.rootNode?.appendChild(element)
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
