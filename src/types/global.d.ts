import { Router } from 'framework7/types'

export declare global {
	interface DataResponse<T = any> {
		code: number
		data: T
		msg: string
	}

	interface RouterProps {
		f7route: Router.Route
		f7router: Router.Router
	}

	/**
	 * @description 消息类型
	 */
	interface Message {
		msg_id: number
		[key: string]: any
	}
}
