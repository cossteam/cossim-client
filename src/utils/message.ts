import { useAuthStore } from '@/stores/auth'
// import useUserStore from '@/stores/user'

// export const isSelf = (userId: string) => userId === useUserStore.getState().userId
export const isSelf = (userId: string) => userId === useAuthStore.getState().userId


export const isGroupDialog = (dialog: ChatData) => !!dialog.group_id
