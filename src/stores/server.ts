import { createPersistStore } from '@/lib/store'

interface ServerState {}

const initialState: ServerState = {}

export const useServerStore = createPersistStore(initialState, () => ({}), {
    name: 'coss-server',
    version: 1
})
