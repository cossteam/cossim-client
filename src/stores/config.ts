import { Language } from '@/lib/enum'
import { createPersistStore } from '@/lib/store'

interface ConfigState {
    sidebarWidth: number
    language: Language
}

const initialState: ConfigState = {
    sidebarWidth: 300,
    language: Language.ZH_CN
}

export const useConfigStore = createPersistStore(initialState, (set, get) => ({}), {
    name: 'coss-config',
    version: 1
    // migrate(state, version) {
    // return newState as any
    // }
})
