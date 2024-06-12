import useUserStore from '@/stores/user'

export const isSelf = (userId: string) => userId === useUserStore.getState().userId

export const isGroupDialog = (dialog: ChatData) => !!dialog.group_id
