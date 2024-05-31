import { create } from 'zustand'
import { CallStore, CallStoreMethods, CallOptions } from '@/types/store'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

const states: CallOptions = {
	callId: '',
	callType: '',
	callStatus: '',
	isVideo: false,
	isAudio: false,
	isGroup: false
}

const actions = (set: any): CallStoreMethods => ({
	update: async (options) => set(options),
	create: function (
		callId: string,
		callType: string,
		isVideo: boolean,
		isAudio: boolean,
		isGroup: boolean
	): Promise<ResponseData<any>> {
		console.log('create', callId, callType, isVideo, isAudio, isGroup)
		return Promise.resolve({
			code: 200,
			data: {
				callId,
				callType,
				isVideo,
				isAudio,
				isGroup
			},
			msg: 'success'
		})
	},
	join: function (
		callId: string,
		callType: string,
		isVideo: boolean,
		isAudio: boolean,
		isGroup: boolean
	): Promise<ResponseData<any>> {
		console.log('join', callId, callType, isVideo, isAudio, isGroup)
		return Promise.resolve({
			code: 0,
			data: {
				callId: '123',
				callType: 'video',
				isVideo: true,
				isAudio: true,
				isGroup: true
			},
			msg: 'success'
		})
	},
	leave: function (): Promise<ResponseData<any>> {
		console.log('leave')
		return Promise.resolve({
			code: 0,
			data: {},
			msg: 'success'
		})
	},
	reject: function (): Promise<ResponseData<any>> {
		console.log('reject')
		return Promise.resolve({
			code: 0,
			data: {},
			msg: 'success'
		})
	},
	hangup: function (): Promise<ResponseData<any>> {
		console.log('hangup')
		return Promise.resolve({
			code: 0,
			data: {},
			msg: 'success'
		})
	}
})

const commonStore = (set: any): CallStore => ({
	...states,
	...actions(set)
})

const useCallStore = create(
	devtools(
		persist(commonStore, {
			name: 'COSS_CALL_STORE',
			storage: createJSONStorage(() => localStorage)
		})
	)
)

export default useCallStore