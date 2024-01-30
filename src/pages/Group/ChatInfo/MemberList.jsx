import React, { useEffect, useState, useMemo } from 'react'
import { f7, Link, List, ListItem, NavRight, NavTitle, Navbar, Page, Searchbar, Subnavbar } from 'framework7-react'
import PropType from 'prop-types'
import { friendListApi } from '@/api/relation'
import { groupMemberApi, groupInviteApi, groupRemoveApi } from '@/api/group'
import { useUserStore } from '@/stores/user'

MemberList.propTypes = {
	type: PropType.string,
	id: PropType.string,
	f7router: PropType.object
}
export default function MemberList({ f7router, type: PageType, id: GroupId }) {
	// type: show plus minus
	console.log('MemberList', PageType, GroupId)
	// 标题
	const getTitle = () => {
		return {
			show: '成员列表',
			plus: '选择联系人',
			minus: '聊天成员'
		}[PageType]
	}

	const { user } = useUserStore()
	const [identity, setIdentity] = useState(null)

	// 成员列表
	const [members, setMembers] = useState([])
	// 获取成员列表
	const loadMembers = async () => {
		const { code, data } = await groupMemberApi({ group_id: GroupId })
		if (code === 200) {
			const identity = data.find((i) => i.user_id === user.user_id).identity
			identity && setIdentity(identity)
			setMembers(data)
		}
	}

	// 好友列表
	const [friends, setFriends] = useState([])
	// 获取好友列表
	const loadFriends = async () => {
		const { code, data: groups } = await friendListApi()
		if (code === 200) {
			const groupMember = []
			for (const group in groups) {
				if (Object.hasOwnProperty.call(groups, group)) {
					const groupItem = groups[group] || []
					for (const friend of groupItem) {
						groupMember.push({
							...friend,
							group
						})
					}
				}
			}
			setFriends(groupMember)
		}
	}
	// 排除好友
	const excludeFriends = useMemo(() => {
		return friends.filter((friend) => !members.find((member) => member.user_id === friend.user_id))
	}, [friends, members])
	// 排除成员
	const excludeMembers = useMemo(() => {
		// 排除群主、自己以及身份大于自己的成员
		// 0: 成员 1: 管理 2: 群主
		return members.filter(
			(member) => member.identity !== 2 && member.user_id !== user.user_id && member.identity < identity
		)
	}, [members])

	const loadList = async () => {
		f7.dialog.preloader('加载中...')
		await loadMembers()
		await loadFriends()
		f7.dialog.close()
	}

	useEffect(() => {
		loadList()
	}, [])

	// 当前选中的人员ID
	const [selected, setSelected] = useState([])
	const onMemberChange = (e, id) => {
		if (e.target.checked) {
			selected.indexOf(id) === -1 && setSelected([...selected, id])
		} else {
			setSelected(selected.filter((item) => item !== id))
		}
	}

	// 邀请
	const inviteMembers = async () => {
		try {
			f7.dialog.preloader('请稍后...')
			const { code, msg } = await groupInviteApi({
				group_id: parseInt(GroupId),
				member: selected
			})
			code === 200 && f7router.back()
			code !== 200 && f7.dialog.alert(msg)
		} catch (e) {
			f7.dialog.alert(e.message)
		} finally {
			f7.dialog.close()
		}
	}
	// 删除
	const removeMembers = async () => {
		f7.dialog.confirm('移除成员', '确定移除吗？', async () => {
			try {
				f7.dialog.preloader('请稍后...')
				const { code, msg } = await groupRemoveApi({
					group_id: parseInt(GroupId),
					member: selected
				})
				code === 200 && f7router.back()
				code !== 200 && f7.dialog.alert(msg)
			} catch (e) {
				f7.dialog.alert(e.message)
			} finally {
				f7.dialog.close()
			}
		})
	}

	return (
		<Page className="" noToolbar messagesContent>
			<Navbar className="messages-navbar bg-white" backLink>
				<NavTitle>
					<div className="">{getTitle()}</div>
				</NavTitle>
				<NavRight>
					{PageType === 'plus' && <Link onClick={inviteMembers}>邀请</Link>}
					{PageType === 'minus' && (
						<Link color="red" onClick={removeMembers}>
							删除
						</Link>
					)}
				</NavRight>
				<Subnavbar>
					<Searchbar searchContainer=".contacts-list" disableButton={false} />
				</Subnavbar>
			</Navbar>
			{PageType === 'plus' && (
				<List contactsList noChevron dividers>
					{excludeFriends.map((member, index) => (
						<ListItem
							key={index}
							checkbox
							checkboxIcon="end"
							media={member.avatar}
							title={member.nickname}
							subtitle={member.email}
							onChange={(e) => onMemberChange(e, member.user_id)}
						/>
					))}
				</List>
			)}
			{PageType === 'minus' && (
				<List contactsList noChevron dividers>
					{excludeMembers.map((member, index) => (
						<ListItem
							key={index}
							checkbox
							checkboxIcon="end"
							media={member.avatar}
							title={member.nickname}
							subtitle={member.email}
							onChange={(e) => onMemberChange(e, member.user_id)}
						/>
					))}
				</List>
			)}
			{PageType === 'show' && <div>成员展示列表</div>}
		</Page>
	)
}
