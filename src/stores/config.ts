import { createPersistStore } from '@/lib/store'

interface ConfigState {
    sidebarWidth: number
}

const initialState: ConfigState = {
    sidebarWidth: 300
}

export const useConfigStore = createPersistStore(initialState, (set, get) => ({}), {
    name: 'coss-config',
    version: 1
    // migrate(state, version) {
    // return newState as any
    // }
})

// 2000 试用期 三月
// 5000 试用期过后 保底 5k  有提成
