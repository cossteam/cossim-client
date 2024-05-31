import { create } from 'zustand'
import { UserOptions, UserStoreMethods, UserStore } from '@/types/store'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { LoginParams, LogoutParams } from '@/types/api'
import { loginApi, logoutApi } from '@/api/user'

const states: UserOptions = {
    userId: '',
    userInfo: null,
    token: ''
}

const actions = (set: any): UserStoreMethods => ({
    update: async (options) => set(options),
    login: async (params: LoginParams) => {
        try {
            const { code, data } = await loginApi(params)
            console.log(code, data)
            if (code === 200) {
                set({
                    userId: data.user_info.user_id,
                    userInfo: data.user_info,
                    token: data.token
                })
                return Promise.resolve(data)
            }
            return Promise.reject(data)
        } catch (error) {
            console.log('错误', error)
            return Promise.reject(error)
        }
    },
    logout: async (params: LogoutParams) => {
        try {
            const { code, data } = await logoutApi(params)
            console.log(code, data)
            if (code === 200) {
                return Promise.resolve(data)
            }
            return Promise.reject(data)
        } catch (error) {
            console.log('错误', error)
            return Promise.reject(error)
        } finally {
            set({
                userId: '',
                userInfo: null,
                token: ''
            })
        }
    }
})

const commonStore = (set: any): UserStore => ({
    ...states,
    ...actions(set)
})

const useUserStore = create(
    devtools(
        persist(commonStore, {
            name: 'COSS_USER_STORE',
            storage: createJSONStorage(() => localStorage)
        })
    )
)

export default useUserStore
