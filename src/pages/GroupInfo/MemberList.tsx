import { MemberListType, USER_ID } from "@/shared";
import { getCookie } from "@/utils/cookie";
import { Link, List, ListItem, NavRight, Navbar, Page, Searchbar, Subnavbar, f7 } from "framework7-react"
import { useEffect, useMemo, useState } from "react";
import GroupService from '@/api/group'
import RelationService from '@/api/relation'
import "./MemberList.scss"

interface MemberListProps {
    group_id: string
    list_type: MemberListType  | string
}

const MemberList: React.FC<MemberListProps & RouterProps> = (props) => {
    
    console.log(props);
    
    const PageType = props.list_type

	// 标题
	const getTitle = () => {
		return {
			show: '成员列表',
			plus: '选择联系人',
			minus: '聊天成员'
		}[PageType]
	}

    const user_id = getCookie(USER_ID) || ''
	const [identity, setIdentity] = useState(null)

	// 成员列表
	const [members, setMembers] = useState([])
	// 获取成员列表
	const loadMembers = async () => {
		const { code, data } = await GroupService.groupMemberApi({ group_id: props.group_id })
		if (code === 200) {
			const identity = data.find((i: any) => i.user_id === user_id).identity
			identity && setIdentity(identity)
			setMembers(data)
		}
	}

	// 好友列表
	const [friends, setFriends] = useState<any[]>([])
	// 获取好友列表
	const loadFriends = async () => {
		const { code, data: groups } = await RelationService.getFriendListApi()
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
		return friends.filter((friend) => !members.find((member: any) => member.user_id === friend.user_id))
	}, [friends, members])
	// 排除成员
	const excludeMembers = useMemo(() => {
		// 排除群主、自己以及身份大于自己的成员
		// 0: 成员 1: 管理 2: 群主
		return members.filter(
			(member: any) => member.identity !== 2 && member.user_id !== user_id && member.identity < identity!
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
	const [selected, setSelected] = useState<any[]>([])
	const onMemberChange = (e: any, id: any) => {
		if (e.target.checked) {
			selected.indexOf(id) === -1 && setSelected([...selected, id])
		} else {
			setSelected(selected.filter((item) => item !== id))
		}
	}

	// 邀请
	const inviteMembers = async () => {
		try {
			f7.dialog.preloader('请稍候...')
			const { code, msg } = await GroupService.groupInviteApi({
				group_id: parseInt(props.group_id),
				member: selected
			})
			code === 200 && props.f7router.back()
			code !== 200 && f7.dialog.alert(msg)
		} catch (e: any) {
			f7.dialog.alert(e.message)
		} finally {
			f7.dialog.close()
		}
	}
	// 删除
	const removeMembers = async () => {
		f7.dialog.confirm('移除成员', '确定移除吗？', async () => {
			try {
				f7.dialog.preloader('请稍候...')
				const { code, msg } = await GroupService.groupRemoveApi({
					group_id: parseInt(props.group_id),
					member: selected
				})
				code === 200 && props.f7router.back()
				code !== 200 && f7.dialog.alert(msg)
			} catch (e: any) {
				f7.dialog.alert(e.message)
			} finally {
				f7.dialog.close()
			}
		})
	}

    return <Page noToolbar>
			<Navbar title={ PageType === MemberListType.MEMBERSHOW ? getTitle() : ''} backLink className="bg-bgPrimary hidden-navbar-bg" >
				{/* <NavTitle>
					<div className={PageType === MemberListType.MEMBERSHOW && 'mr-14'}>{getTitle()}</div>
				</NavTitle> */}
				<NavRight>
					{PageType === MemberListType.NOTMEMBER && <Link onClick={inviteMembers}>邀请</Link>}
					{PageType === MemberListType.MEMBER && (
						<Link color="red" onClick={removeMembers}>
							删除
						</Link>
					)}
				</NavRight>
				<Subnavbar>
					<Searchbar searchContainer=".contacts-list" disableButton={false} />
				</Subnavbar>
			</Navbar>
			{PageType === MemberListType.NOTMEMBER && (
				<List contactsList noChevron dividers className="member-list">
					{excludeFriends.map((member, index) => (
						<ListItem
							key={index}
							checkbox
                            // @ts-ignore
							checkboxIcon="end"
							media={member.avatar}
							title={member.nickname}
							subtitle={member.email}
							onChange={(e) => onMemberChange(e, member.user_id)}
						/>
					))}
				</List>
			)}
			{PageType === MemberListType.MEMBER && (
				<List contactsList noChevron dividers className="member-list">
					{excludeMembers.map((member: any, index) => (
						<ListItem
							key={index}
							checkbox
                              // @ts-ignore
							checkboxIcon="end"
							media={member.avatar}
							title={member.nickname}
							subtitle={member.email}
							onChange={(e) => onMemberChange(e, member.user_id)}
						/>
					))}
				</List>
			)}
			{PageType === MemberListType.MEMBERSHOW && (
				<List contactsList noChevron dividers className="member-list">
					{members.map((member: any, index) => (
						<ListItem key={index} media={member.avatar} title={member.nickname} footer={member.email}>
							<div slot="after" className="text-sm">
								{member.identity === 2 && <span>群主</span>}
								{member.identity === 1 && <span>管理员</span>}
								{member.identity === 0 && <span>成员</span>}
							</div>
						</ListItem>
					))}
				</List>
			)}
    </Page>
}

export default MemberList