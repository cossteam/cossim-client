import useUserStore from '@/stores/user'

export const isSelf = (userId: string) => userId === useUserStore.getState().userId
