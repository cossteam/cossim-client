import { Badge, Button, List, ListItem, NavTitle, Navbar, Page, Segmented } from 'framework7-react'
import { useState } from 'react'
import { useAsyncEffect } from '@reactuses/core'
import { isEqual, omitBy, isEmpty } from 'lodash-es'

import RelationService from '@/api/relation'
import { $t, ApplyStatus, ApplyType, USER_ID } from '@/shared'
import { getCookie } from '@/utils/cookie'
import GroupService from '@/api/group'
import UserStore from '@/db/user'

const user_id = getCookie(USER_ID) || ''

const ApplyList = () => {
	const [type, setType] = useState<ApplyType>(ApplyType.FRIEND)
	const [applyList, setApplyList] = useState<any[]>([])

	const [applyFriendTotal, setApplyFriendTotal] = useState<number>(0)
	const [applyGroupTotal, setApplyGroupTotal] = useState<number>(0)

	const updateApplyList = async () => {
		const applyList = await UserStore.findAll(UserStore.tables.apply_list)

        // 设置好友申请中的总数
		const applyFriendTotal = applyList.filter(
			(v) => v?.status === ApplyStatus.PENDING && !v?.receiver_info?.user_id && v?.sender_id !== user_id
		).length
		const applyGroupTotal = applyList.filter(
			(v) => v?.status === ApplyStatus.PENDING && !v?.sender_id && v?.receiver_info?.user_id !== user_id
		).length
		setApplyFriendTotal(applyFriendTotal)
		setApplyGroupTotal(applyGroupTotal)

		const newApplyList = applyList.filter((v) => (type === ApplyType.FRIEND ? v?.sender_id : !v?.sender_id))
		setApplyList(newApplyList)
		return newApplyList
	}

	useAsyncEffect(
		async () => {
			try {
				const applyList = await updateApplyList()

				const { data } =
					type === ApplyType.FRIEND
						? await RelationService.friendApplyListApi({ user_id })
						: await GroupService.groupRequestListApi({ user_id })

				// 如果没有就需要添加到本地数据库
				if (!applyList.length) {
					await UserStore.bulkAdd(UserStore.tables.apply_list, data)
					await updateApplyList()
					return
				}

				// @ts-ignore 对比两个对象中是否有不同
				const diffApplyList = omitBy(data, (item, key) => isEqual(item, applyList[key]))

				if (!isEmpty(diffApplyList)) {
					// 找到最新的值
					Object.entries(diffApplyList).forEach(async ([, value]) => {
						await UserStore.update(UserStore.tables.apply_list, 'id', value.id, {
							...value
						})
					})
				}
			} catch (error) {
				console.error('获取申请列表失败', error)
			}
		},
		() => {},
		[type]
	)

	return (
		<Page noToolbar className="bg-bgTertiary">
			<Navbar backLink className="coss_applylist_navbar bg-bgPrimary hidden-navbar-bg">
				<NavTitle>
					<Segmented strong>
						<Button active={type === ApplyType.FRIEND} onClick={() => setType(ApplyType.FRIEND)}>
							{$t('好友申请')}{' '}
							{applyFriendTotal !== 0 && (
								<Badge color="red" className="ml-1">
									{applyFriendTotal}
								</Badge>
							)}
						</Button>
						<Button active={type === ApplyType.GROUP} onClick={() => setType(ApplyType.GROUP)}>
							{$t('群聊申请')}{' '}
							{applyGroupTotal !== 0 && (
								<Badge color="red" className="ml-1">
									{applyGroupTotal}
								</Badge>
							)}
						</Button>
					</Segmented>
				</NavTitle>
			</Navbar>

			<List strongIos className="mt-0" mediaList>
				{applyList.map((item, index) => (
					<ListItem key={index} text={item?.remark || $t('对方没有留言')}>
						<div slot="media" className="w-12 h-12">
							<img
								src={item?.receiver_info?.user_avatar}
								alt=""
								className="w-full h-full object-cover rounded-full"
							/>
						</div>

						<span slot="title">
							{type === ApplyType.FRIEND ? (
								<span>{item?.receiver_info?.user_name}</span>
							) : (
								<>
									{item?.sender_info?.user_name || item?.receiver_info?.user_name}
									<span className=" text-xs text-gray-500 mx-1">{$t('邀请你加入群聊')}</span>
									<span>{item?.group_name}</span>
								</>
							)}
						</span>

						<div slot="content" className="pr-2">
							{[ApplyStatus.PENDING, ApplyStatus.INVITE_RECEIVER].includes(item.status) ? (
								user_id === (item?.sender_id || item?.sender_info?.user_id) ? (
									<Button className="text-sm text-gray-500 " disabled>
										{type === ApplyType.FRIEND ? $t('等待对方同意') : $t('申请中')}
									</Button>
								) : (
									<div className="flex">
										<Button className="text-sm text-red-500">拒绝</Button>
										<Button className="text-sm text-primary">同意</Button>
									</div>
								)
							) : ApplyStatus.ACCEPT === item.status ? (
								<Button className="text-sm text-primary" disabled>
									{$t('已同意')}
								</Button>
							) : (
								<Button className="text-sm text-primary text-red-500 " disabled>
									{$t('已拒绝')}
								</Button>
							)}
						</div>
					</ListItem>
				))}
			</List>
		</Page>
	)
}

export default ApplyList
