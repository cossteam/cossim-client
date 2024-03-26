import VideoCover from '@/utils/videoCover'
import { msgType } from '.'
import StorageService from '@/api/storage'

/**
 * 获取文件类型
 *
 * @param type
 * @returns
 */
export const fileTypeText = (type: string) => {
	switch (type) {
		case 'image/*':
			return '图片'
		case 'video/*':
			return '视频'
		default:
			return '文件'
	}
}

/**
 * 获取消息类型
 *
 * @param type
 * @returns
 */
export const fileMessageType = (type: string): msgType => {
	switch (
		type
			.split('/')
			.map((part, index) => (index === 0 ? part : '*'))
			.join('/')
	) {
		case 'image/*':
			return msgType.IMAGE
		case 'video/*':
			return msgType.VIDEO
		default:
			return msgType.FILE
	}
}

/**
 * 把文件转为 base64
 *
 * @param file
 * @returns
 */
export const fileBase64 = (file: File): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = (e: any) => {
			resolve(e.target.result)
		}
		reader.onerror = (e) => {
			reject(e)
		}
	})
}

/**
 * 获取视频第一帧
 *
 * @param file
 * @returns
 */
export const getVideoCover = async (file: File) => {
	return new Promise<string>((resolve, reject) => {
		try {
			const videoCover = new VideoCover({
				url: URL.createObjectURL(file),
				currentTime: 1,
				imgWidth: 800,
				quality: 0.95,
				imageType: 'image/jpeg',
				isCheckImageColor: true
			})
			videoCover.getVideoCover((img) => {
				resolve(img)
			})
		} catch (error) {
			reject(error)
		}
	})
}

/**
 * 文件上传
 *
 * @param file
 * @returns
 */
export const uploadFile = (file: File) => {
	return new Promise<{
		url: string
		file_id: string
	}>((resolve, reject) => {
		StorageService.uploadFile({
			file: file,
			type: 2
		})
			.then(({ code, data }: any) => {
				if (code !== 200) {
					reject(null)
					return
				}
				resolve(data)
			})
			.catch((err) => {
				console.log(err)
				reject(err)
			})
	})
}

/**
 * 获取图片或视频宽高
 *
 * @param file
 */
export const getImageOrVideoSize = (url: string) => {
	return new Promise<{ width: number; height: number }>((resolve) => {
		const img = new Image()
		img.src = url

		img.onload = () => {
			resolve({ width: img.width, height: img.height })
			img.remove()
		}

		img.onerror = () => {
			resolve({ width: 200, height: 300 })
			img.remove()
		}
	})
}
