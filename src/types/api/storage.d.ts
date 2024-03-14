export interface UploadFile {
	file: File | FormData
	/**
	 * 上传类型
	 * 0：音频
	 * 1：图片
	 * 2：文件
	 * 3：视频
	 */
	type: number
}
