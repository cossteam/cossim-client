import { TOOLTIP_TYPE } from '@/shared'
import { PrivateChats } from '@/types/db/user-db'
import { create } from 'zustand'

export interface TooltipsStore {
	/** 当下选择的类型*/
	type: TOOLTIP_TYPE
	/** 当前选择的消息 */
	selectItem: PrivateChats | null
	/** 选择的人员或群 */
	selectMember: any[]
	/** 是否需要显示选择人员 */
	showSelectMember: boolean
	/** 是否需要显示消息多选框 */
	showSelect: boolean
	/** 选中的多条消息 */
	selectItems: PrivateChats[]
	/** 多选删除消息 */
	selectDelete: boolean

	/**
	 * 更新提示类型
	 * @param  {TOOLTIP_TYPE}  type 提示类型
	 */
	updateType: (type: TOOLTIP_TYPE) => void

	/**
	 * 更新当前选择的消息
	 * @param  {PrivateChats}  item 当前选择的消息
	 */
	updateSelectItem: (item: PrivateChats | null) => void

	/**
	 * 更新当前选择的人员或群
	 * @param  {any[]}  member 当前选择的人员或群
	 */
	updateSelectMember: (member: any[]) => void

	/**
	 * 更新是否需要显示选择人员
	 * @param  {boolean}  showSelectMember 是否需要显示选择人员
	 */
	updateShowSelectMember: (showSelectMember: boolean) => void

	/**
	 * 更新是否需要显示消息多选框
	 * @param  {boolean}  showSelect 是否需要显示消息多选框
	 */
	updateShowSelect: (showSelect: boolean) => void

	/**
	 * 更新选中的多条消息
	 * @param  {PrivateChats[]}  selectItems 选中的多条消息
	 */
	updateSelectItems: (selectItems: PrivateChats[]) => void

	/**
	 * 更新多选删除状态
	 * @param selectDelete
	 * @returns
	 */
	updateSelectDelete: (selectDelete: boolean) => void

	/**
	 * 清空所有
	 */
	clear: () => void
}

export const useTooltipsStore = create<TooltipsStore>((set) => ({
	type: TOOLTIP_TYPE.NONE,
	selectItem: null,
	selectMember: [],
	showSelectMember: false,
	showSelect: false,
	selectItems: [],
	selectDelete: false,

	updateType: (type: TOOLTIP_TYPE) => set({ type }),
	updateSelectItem: (item: PrivateChats | null) => set({ selectItem: item }),
	updateSelectMember: (member: any[]) => set({ selectMember: member }),
	updateShowSelectMember: (showSelectMember: boolean) => set({ showSelectMember }),
	updateShowSelect: (showSelect: boolean) => set({ showSelect }),
	updateSelectItems: (selectItems: PrivateChats[]) => set({ selectItems }),
	clear: () =>
		set({
			type: TOOLTIP_TYPE.NONE,
			selectItem: null,
			selectMember: [],
			showSelectMember: false,
			showSelect: false,
			selectItems: [],
            selectDelete: false
		}),

	updateSelectDelete: (selectDelete: boolean) => set({ selectDelete })
}))
