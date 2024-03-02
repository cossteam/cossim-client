/**
 * 全局状态管理
 * @author YuHong
 * @date 2024-02-23
 */
import { create } from 'zustand'
// import { MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND, MESSAGE_TYPE, USER_ID, addMarkMessage, initMessage } from '@/shared'
// import UserStore from '@/db/user'
// import type { PrivateChats } from '@/types/db/user-db'
// import MsgService from '@/api/msg'
// import { getCookie } from '@/utils/cookie'
// import { updateDatabaseMessage } from '@/shared'
// import CommonStore from '@/db/common'
// import { v4 as uuidv4 } from 'uuid'
// import { isEqual, omitBy, isEmpty } from 'lodash-es'

// const user_id = getCookie(USER_ID) || ''

export interface StateStore {
	is_chat_update: boolean
	is_contacts_update: boolean
	unread: {
		msg: number
		apply: number
	}
	updateChat: (update: boolean) => void
	updateContacts: (update: boolean) => void
	updateUnread: (data: any) => void
}

export const useStateStore = create<StateStore>((set) => ({
	is_chat_update: true,
	is_contacts_update: false,
	unread: {
		msg: 0,
		apply: 0
	},
	updateChat: (update) => {
		set({ is_chat_update: update })
	},
	updateContacts: (update) => {
		set({ is_contacts_update: update })
	},
	updateUnread: (unread) => {
		set({ unread })
	}
}))
