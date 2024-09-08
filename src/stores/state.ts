import { createPersistStore } from '@/lib/store'
import type { User } from '@/types/common'

interface UserState {
    userId: string
    token: string
    userInfo: User
    driverId: string
}

const initialState: UserState = {
    userId: '',
    token: '',
    userInfo: null,
    driverId: ''
}

export const useUserStore = createPersistStore(initialState, (set, get) => ({}), {
    name: 'coss-user',
    version: 1
    // migrate(state, version) {
    // return newState as any
    // }
})
