import type { UploadFile } from '@/types/api/storage'
import request from '@/utils/request'

class StorageServiceImpl {
	private baseUrl: string = '/storage'

	/**
	 * 上传文件
	 *
	 * @param {UploadFile}  上传文件参数
	 */
	uploadFile(data: UploadFile): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/files`,
			method: 'post',
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			data
		})
	}
}

const StorageService = new StorageServiceImpl()

export default StorageService
