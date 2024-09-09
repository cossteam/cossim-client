import { createPersistStore } from '@/lib/store'
import { generateUserInfo } from '@/mock/data'

interface UserState {
    userId: string
    token: string
    userInfo: any
    driverId: string
}

const userInfo = generateUserInfo()

const initialState: UserState = {
    userId: userInfo.user_id,
    token: '',
    userInfo,
    driverId: '123'
}

export const useAuthStore = createPersistStore(initialState, (set, get) => ({}), {
    name: 'coss-auth',
    version: 1
    // migrate(state, version) {
    // return newState as any
    // }
})
