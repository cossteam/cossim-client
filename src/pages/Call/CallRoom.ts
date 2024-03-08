import { Room, RoomEvent, RoomOptions } from 'livekit-client'

interface JoinProps {
	serverUrl: string
	token: string
	audio: boolean
	video: boolean
	parentElement: HTMLElement
}

enum MediaType {
	AUDIO = 'audio',
	VIDEO = 'video'
}

const getMediaType = (type: string) => {
	switch (type) {
		case 'audio':
			return MediaType.AUDIO
		case 'video':
			return MediaType.VIDEO
		default:
			return undefined
	}
}

export class CallRoom {
	public client: Room
	private parentElement: HTMLElement | undefined
	private localAudioTrack: any // 本地音频流
	private localVideoTrack: any // 本地视频流
	// private screenVideoTrack: any // 本地屏幕共享流

	constructor() {
		const roomOptions: RoomOptions = {
			// automatically manage subscribed video quality // 自动管理订阅的视频质量
			adaptiveStream: true,
			// optimize publishing bandwidth and CPU for published tracks // 优化已发布曲目的发布带宽和CPU
			dynacast: true
		}
		// 创建房间
		this.client = new Room(roomOptions)
		//  注册事件
		this.init()
	}

	/**
	 * 初始化（事件处理）
	 */
	init() {
		this.client.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
			console.log('Trace已订阅', track, publication, participant)
			const element = track.attach()
			console.log(element)
			if (getMediaType(track.kind) === MediaType.VIDEO) {
				const element = this.localVideoTrack.track.attach()
				this.parentElement?.appendChild(element)
			} else if (getMediaType(track.kind) === MediaType.AUDIO) {
				track.attach().play()
			}
		})
	}

	/**
	 * 创建本地视频流
	 */
	async createVideoTrack() {
		console.log('创建本地视频流')
		if (this.localVideoTrack) {
			this.client.localParticipant.setCameraEnabled(false)
			this.localVideoTrack = null
		}
		this.localVideoTrack = await this.client.localParticipant.setCameraEnabled(true)
		console.log(this.localVideoTrack)
		const element = this.localVideoTrack.track.attach()
		this.parentElement?.appendChild(element)
	}

	/**
	 * 创建本地音频流
	 */
	async createAudioTrack() {
		console.log('创建本地音频流')
		if (this.localAudioTrack) {
			this.client.localParticipant.setMicrophoneEnabled(false)
			this.localAudioTrack = null
		}
		this.localAudioTrack = await this.client.localParticipant.setMicrophoneEnabled(true)
		console.log(this.localAudioTrack)
	}

	/**
	 * 关闭音频或者视频
	 */
	closeAorV(type: MediaType) {
		if (type === MediaType.VIDEO) {
			if (this.localVideoTrack) {
				this.client.localParticipant.setCameraEnabled(false)
				this.localVideoTrack = null
				// deleteChild(parentElement)
			}
		} else if (type === MediaType.AUDIO) {
			if (this.localAudioTrack) {
				this.client.localParticipant.setMicrophoneEnabled(false)
				this.localAudioTrack = null
			}
		}
	}

	/**
	 * 创建本地音视频流
	 * @param video 视频
	 * @param audio 音频
	 */
	createTracks(audio: boolean, video: boolean) {
		console.log('创建本地音视频流', audio, video)
		audio && this.createAudioTrack()
		video && this.createVideoTrack()
	}

	/**
	 * 加入房间
	 */
	async join({ serverUrl, token, audio, video, parentElement }: JoinProps) {
		try {
			this.parentElement = parentElement
			// 连接服务器
			await this.client.connect(serverUrl, token)
			console.log('已连接')
			this.createTracks(audio, video)
		} catch (error) {
			console.error('连接失败')
			console.dir(error)
		}
	}
}
