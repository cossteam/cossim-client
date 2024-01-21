import { $t } from '@/i18n'
import { Card, CardContent, CardHeader, Link, List, ListItem, NavRight, NavTitle, Navbar, Page } from 'framework7-react'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { f7 } from 'framework7-react'
import PropType from 'prop-types'
import { friendListApi } from '@/api/relation'
import { groupInfoApi, groupCreateApi } from '@/api/group'

NewGroup.propTypes = {
	f7route: PropType.object.isRequired
	// f7router: PropType.object.isRequired
}
export default function NewGroup({ f7route }) {
	const GroupId = f7route.query.id // 群号 /（TODO：用户ID）
	const [group, setGroup] = useState({
		avatar: 'https://cdn.framework7.io/placeholder/nature-1000x600-3.jpg',
		name: '',
		type: 0, // 0: 公开群组 1: 私有群组
		max_members_limit: 250,
		member: []
	})

	// 更新群组信息
	const updateGroup = (obj) => {
		setGroup({
			...group,
			...obj
		})
	}

	// 获取群聊信息
	useEffect(() => {
		;(async () => {
			if (!GroupId) return
			try {
				f7.dialog.preloader('请稍候...')
				const { code, data, msg } = await groupInfoApi({ gid: GroupId })
				if (code === 200) {
					updateGroup(data)
					return
				}
				f7.dialog.alert(msg, '群聊信息获取失败')
			} catch (error) {
				f7.dialog.alert(error.message, '群聊信息获取失败')
			} finally {
				f7.dialog.close()
			}
		})()
	}, [GroupId])

	// 选择群成员
	const groupMemberChange = (e, user_id) => {
		// const checked = e.target.checked
		const member = [...group.member]
		const index = member.indexOf(user_id)
		if (index > -1) {
			member.splice(index, 1)
		} else {
			member.push(user_id)
		}
		updateGroup({
			member
		})
	}

	// 输入事件
	const onInput = (e) => {
		updateGroup({
			[e.target.name]: e.target.value
		})
	}

	// 好友列表
	const [friends, setFriends] = useState([])
	useEffect(() => {
		;(async () => {
			const { code, data: groups } = await friendListApi()
			if (code !== 200) return
			const friends = []
			for (const group in groups) {
				if (Object.hasOwnProperty.call(groups, group)) {
					const groupItem = groups[group] || []
					for (const friend of groupItem) {
						friends.push({
							...friend,
							group
						})
					}
				}
			}
			setFriends(friends)
		})()
	}, [])

	// 新建群聊
	const createGroup = async () => {
		if (!group.name) {
			f7.dialog.alert('请输入群名称', '新建群聊失败')
			return
		}
		// if (!group.member.length) {
		// 	f7.dialog.alert('请选择群成员', '新建群聊失败')
		// 	return
		// }
		group['type'] = parseInt(group?.type)
		try {
			f7.dialog.preloader('创建中...')
			const { code, data, msg } = await groupCreateApi(group)
			if (code === 200) {
				console.log(data)
				window.location.href = '/' // 刷新页面
				// f7router.back()
				// 修改会话列表
				return
			}
			f7.dialog.alert(msg, '新建群聊失败')
		} catch (error) {
			f7.dialog.alert(error.message, '群聊创建失败')
		} finally {
			f7.dialog.close()
		}
	}

	return (
		<Page className="bg-gray-50 p-4" noToolbar>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>{$t(GroupId ? '群组设置' : '新建群组')}</NavTitle>
				<NavRight>
					<Link onClick={() => createGroup()}>{$t('完成')}</Link>
				</NavRight>
			</Navbar>
			<Card className="m-0 py-6 mb-4" outlineMd>
				<CardHeader className="flex flex-col justify-center">
					<img className="w-20 h-20 rounded-full mb-5" src={group.avatar} />
					<input
						className="text-center bg-transparent"
						placeholder={$t('请输入群名称')}
						name="name"
						value={group.name}
						onChange={onInput}
					/>
				</CardHeader>
			</Card>
			<Card className="m-0 mb-4" outlineMd>
				<CardHeader className="flex">
					<span className="text-xl text-slate-400">{$t('群类型')}</span>
				</CardHeader>
				<CardContent>
					<List strongIos outlineIos dividersIos>
						<ListItem
							radio
							radioIcon="end"
							title={$t('加密')}
							defaultChecked={group.type == 1 ? true : false}
							name="type"
							value="1"
							onChange={(e) => updateGroup({ [e.target.name]: e.target.value })}
						/>
						<ListItem
							radio
							radioIcon="end"
							title={$t('常规')}
							defaultChecked={group.type == 0 ? true : false}
							name="type"
							value="0"
							onChange={(e) => updateGroup({ [e.target.name]: e.target.value })}
						/>
					</List>
				</CardContent>
			</Card>
			<Card className="m-0 mb-4" outlineMd>
				<CardHeader className="flex">
					<span className="text-xl text-slate-400">{$t('群成员')}</span>
				</CardHeader>
				<CardContent>
					<List strongIos outlineIos dividersIos>
						{friends.map((friend) => (
							<ListItem
								key={friend.user_id}
								checkbox
								checkboxIcon="end"
								onChange={(e) => groupMemberChange(e, friend.user_id)}
							>
								<img slot="media" className="w-12 h-12 rounded-full" src={friend.avatar} alt="" />
								<span slot="title" className="text-xl">
									{friend.nick_name}
								</span>
								<span slot="footer" className="text-base">
									{friend.email}
								</span>
								<span slot="after">{friend.group}</span>
							</ListItem>
						))}
					</List>
				</CardContent>
			</Card>
		</Page>
	)
}
