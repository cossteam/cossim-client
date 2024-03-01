import { Page, Navbar, List, ListItem, Card, CardContent, Button, NavRight, f7 } from 'framework7-react'
import { Xmark } from 'framework7-icons/react'
import { useEffect, useMemo, useState } from 'react'

import { $t } from '@/shared'
import './AddGroup.scss'
import Contact from '@/components/Contact/Contact'
import { CreateGroupData } from '@/types/api/group'
import GroupService from '@/api/group'
import UserStore from '@/db/user'
import { useAsyncEffect } from '@reactuses/core'
import { pick } from 'lodash-es'

const AddGroup: React.FC<RouterProps> = ({ f7route, f7router }) => {
	// 群ID
	const group_id = useMemo(() => {
		return f7route?.query?.id
	}, [f7route?.query?.id])
	// 群信息
	const [group, setGroup] = useState<CreateGroupData>({
		name: '',
		avatar: 'https://cdn.framework7.io/placeholder/nature-1000x600-3.jpg',
		type: 0,
		max_members_limit: 500,
		member: []
	})
	// 获取群信息
	useAsyncEffect(
		async () => {
			try {
				const { code, data, msg } = await GroupService.groupInfoApi({ group_id })
				if (code !== 200) {
					f7.dialog.alert($t(msg || '获取群信息失败'))
					return
				}
				setGroup(pick(data, ['name', 'avatar', 'type', 'max_members_limit', 'member']))
			} catch (error: any) {
				f7.dialog.alert($t(error?.message || '获取群信息失败'))
			} finally {
				f7.dialog.close()
			}
		},
		() => {},
		[]
	)

	const [friends, setFriends] = useState<any[]>([])
	// const [maxMembers] = useState<number[]>([100, 500, 1000])

	// 创建群聊
	const createGroup = async () => {
		try {
			f7.dialog.preloader('创建中...')
			const { code, data, msg } = await GroupService.createGroupApi(group)
			if (code !== 200) {
				f7.dialog.alert(msg, $t('新建群聊失败'))
				return
			}

			// 添加会话
			const chat = {
				dialog_id: data?.dialog_id,
				group_id: data?.id,
				dialog_type: data?.type,
				dialog_name: data?.name,
				dialog_avatar: data?.avatar,
				dialog_unread_count: 0,
				last_message: {
					msg_type: 0,
					content: '',
					sender_id: '',
					send_time: 0,
					msg_id: 0
				},
				dialog_create_at: Date.now(),
				top_at: 0
			}

			await UserStore.add(UserStore.tables.dialogs, chat)
			f7router.back()
		} catch (error: any) {
			f7.dialog.alert($t(error?.message || '群聊创建失败'))
		} finally {
			f7.dialog.close()
		}
	}

	// 编辑群聊
	const editGroup = async () => {
		try {
			f7.dialog.preloader('修改中...')
			const { code, msg } = await GroupService.groupUpdateApi({
				...pick(group, ['name', 'avatar', 'type']),
				group_id: parseInt(group_id!)
			})
			if (code !== 200) {
				f7.dialog.alert($t(msg || '编辑群聊失败'))
				return
			}
			code === 200 && f7router.back()
		} catch (error: any) {
			f7.dialog.alert($t(error?.message || '编辑群聊失败'))
		} finally {
			f7.dialog.close()
		}
	}

	useEffect(() => {
		if (!friends.length) return
		const member = friends.map((v) => v.user_id)
		setGroup({ ...group, member })
	}, [friends])

	return (
		<Page noToolbar className="bg-bgTertiary relative">
			<Navbar
				backLink
				title={$t(group_id ? '修改群聊信息' : '新建群聊')}
				className="bg-bgPrimary hidden-navbar-bg"
			>
				<NavRight>
					<Button large disabled={!group.name} onClick={group_id ? editGroup : createGroup}>
						{$t('完成')}
					</Button>
				</NavRight>
			</Navbar>

			<Card title={$t('群头像和群名称')} className="coss_card_title">
				<CardContent className="flex justify-center flex-col items-center">
					<img className="w-20 h-20 rounded-full mb-5" src={group.avatar} />
					<input
						className="text-center bg-transparent"
						placeholder={$t('请输入群名称')}
						name="name"
						value={group.name}
						onChange={(e) => setGroup({ ...group, name: e.target.value })}
					/>
				</CardContent>
			</Card>

			<Card title={$t('群类型')} className="coss_card_title">
				<CardContent>
					<List strongIos dividersIos>
						<ListItem
							radio
							radioIcon="end"
							defaultChecked={group.type == 1 ? true : false}
							name="type"
							value="1"
							onChange={(e) => setGroup({ ...group, type: Number(e.target.value) })}
						>
							<span slot="title" className="text-base">
								{$t('公开')}
							</span>
						</ListItem>
						<ListItem
							radio
							radioIcon="end"
							defaultChecked={group.type == 0 ? true : false}
							name="type"
							value="0"
							onChange={(e) => setGroup({ ...group, type: Number(e.target.value) })}
						>
							<span slot="title" className="text-base">
								{$t('私有')}
							</span>
						</ListItem>
					</List>
				</CardContent>
			</Card>

			{/* <Card title={$t('群人数')} className="coss_card_title">
				<CardContent>
					<List strongIos outlineIos dividersIos>
						<ListItem
							title={$t('该群最大人数')}
							smartSelect
							smartSelectParams={{ openIn: 'sheet', sheetCloseLinkText: $t('完成') }}
						>
							<select
								name="number"
								defaultValue={group.max_members_limit}
								onChange={(e) => setGroup({ ...group, max_members_limit: Number(e.target.value) })}
							>
								{maxMembers.map((item, index) => (
									<option value={item} key={index}>
										{item}
									</option>
								))}
							</select>
						</ListItem>
					</List>
				</CardContent>
			</Card> */}

			{!group_id && (
				<Card title={$t('群成员')} className="coss_card_title">
					<CardContent padding={false}>
						<List>
							<ListItem link popupOpen=".contact-popup">
								{$t('从好友列表选取')}
							</ListItem>
						</List>
					</CardContent>
				</Card>
			)}

			<Card title={friends.length && $t('已选择')} className="coss_card_title">
				<CardContent padding={false}>
					<List>
						{friends.map((item, index) => (
							<ListItem key={index} link noChevron title={item?.nickname}>
								<img
									slot="media"
									src={item?.avatar}
									alt=""
									className="w-12 h-12 rounded-full object-cover"
								/>

								<Xmark slot="after" onClick={() => setFriends(friends.filter((v) => v !== item))} />
							</ListItem>
						))}
					</List>
				</CardContent>
			</Card>

			<Contact completed={setFriends} defaults={friends} />
		</Page>
	)
}

export default AddGroup
