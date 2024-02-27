import { $t, MemberListType, USER_ID } from '@/shared'
import { Icon, List, ListItem, Navbar, Page, Toggle, f7 } from 'framework7-react'
import { useEffect, useState } from 'react'
import GroupService from '@/api/group'
import { getCookie } from '@/utils/cookie'

const user_id = getCookie(USER_ID) || ''

interface GroupInfoProps {
	group_id: string
}

const GroupInfo: React.FC<GroupInfoProps & RouterProps> = (props) => {
	const { f7router, group_id: GroupId } = props
	// 聊天类型：group | friend

	// const { user } = useUserStore()
	const [identity, setIdentity] = useState(null)

	// 消息免打扰
	const [silence, setSilence] = useState(false)

	// 群聊信息
	const [groupInfo, setGroupInfo] = useState({
		name: ''
	})
	useEffect(() => {
		;(async () => {
			// 获取群聊信息
			const { code, data } = await GroupService.groupInfoApi({ group_id: GroupId })
			if (code !== 200) return
			console.log(data)
			code === 200 && setGroupInfo(data)
			const isSilence = data?.preferences?.silent_notification
			setSilence(isSilence === 1)
		})()
	}, [])

	// 群成员
	const [members, setMembers] = useState([])
	useEffect(() => {
		;(async () => {
			// 获取成员信息
			const { code, data } = await GroupService.groupMemberApi({ group_id: GroupId })
			if (code !== 200) return
			const identity = data.find((i: any) => i.user_id === user_id).identity
			identity && setIdentity(identity)
			setMembers(data)
		})()
	}, [props])

	// 退出群聊
	const quitGroup = async () => {
		f7.dialog.confirm('退出群聊', '确定要退出群聊吗？', async () => {
			try {
				f7.dialog.preloader('正在退出...')
				const { code, msg } = await GroupService.groupQuitApi({ group_id: parseInt(GroupId) })
				code === 200 && f7router.back()
				code !== 200 && f7.dialog.alert(msg)
			} catch (error: any) {
				f7.dialog.alert(error.message, '退出失败...')
			} finally {
				f7.dialog.close()
			}
		})
	}

	// 解散群聊
	const dissolveGroup = async () => {
		f7.dialog.confirm('解散群聊', '确定要解散群聊吗？', async () => {
			try {
				f7.dialog.preloader('正在解散...')
				const { code, msg } = await GroupService.groupDissolve({ group_id: GroupId })
				code === 200 && f7router.back()
				code !== 200 && f7.dialog.alert(msg)
			} catch (error: any) {
				f7.dialog.alert(error.message, '解散失败...')
			} finally {
				f7.dialog.close()
			}
		})
	}

	const onChangeChecked = async () => {
		const isSilence = !silence
		setSilence(isSilence)
		try {
			f7.dialog.preloader('请稍候...')
			const { code } = await GroupService.setGroupSilenceApi({
				group_id: parseInt(GroupId),
				is_silent: isSilence ? 1 : 0
			})
			if (code !== 200) return
		} catch (error: any) {
			f7.dialog.alert(error.message)
		} finally {
			f7.dialog.close()
		}
	}

	return (
		<Page noToolbar>
			<Navbar title={$t('群聊信息')} backLink className="bg-bgPrimary hidden-navbar-bg" />
			<List className="m-0 mb-3 bg-white" strong dividers outline>
				<ListItem noChevron>
					<div className="w-full flex flex-col justify-center items-center">
						<div className="mb-1 w-full grid grid-cols-5 gap-6">
							{members.slice(0, 23).map((item: any) => (
								<div key={item.user_id} className="w-12 h-[144rpx] flex flex-col items-center">
									<div className="min-w-12 min-h-12 bg-gray-200 rounded-lg overflow-hidden">
										<img src={item.avatar} alt="" />
									</div>
									<div className="w-12 min-w-12 min-h-6 flex-1 text-sm text-gray-400 max-w-12 overflow-hidden text-ellipsis">
										{item.nickname}
									</div>
								</div>
							))}
							<div
								className="w-12 h-12 flex flex-col justify-center items-center border-dashed border-[1px] border-gray-400 text-gray-500 rounded-lg"
								onClick={() =>
									f7router.navigate(`/group_info/${GroupId}/member/${MemberListType.NOTMEMBER}`)
								}
							>
								<Icon f7="plus" size={18} />
							</div>
							{identity && (
								<div
									className="w-12 h-12 flex flex-col justify-center items-center border-dashed border-[1px] border-gray-400 text-gray-500 rounded-lg"
									onClick={() =>
										f7router.navigate(`/group_info/${GroupId}/member/${MemberListType.MEMBER}`)
									}
								>
									<Icon f7="minus" size={18} />
								</div>
							)}
						</div>
						{members.length > 0 && (
							<div className="mb-1">
								<span
									className="text-sm text-gray-500"
									onClick={() =>
										f7router.navigate(`/group_info/${GroupId}/member/${MemberListType.MEMBERSHOW}`)
									}
								>
									查看更多群成员
								</span>
							</div>
						)}
					</div>
				</ListItem>
			</List>
			<List className="m-0 mb-3 bg-white" strong dividers outline>
				<ListItem link title="群聊名称">
					<div slot="after">
						<span>{groupInfo.name}</span>
					</div>
				</ListItem>
				{/* <ListItem link title="群二维码"></ListItem> */}
				<ListItem link title="群公告"></ListItem>
			</List>
			<List className="m-0 mb-3 bg-white" strong dividers outline noChevron>
				<ListItem title="消息免打扰">
					<Toggle slot="after" onChange={onChangeChecked} checked={silence} />
				</ListItem>
			</List>
			<List className="m-0 mb-3 bg-white" strong dividers outline>
				<ListItem noChevron link>
					<div
						slot="inner"
						className="w-full flex justify-center items-center"
						onClick={identity ? dissolveGroup : quitGroup}
					>
						<span className="text-sm text-red-500">{identity === 2 ? '解散群聊' : '退出群聊'}</span>
					</div>
				</ListItem>
			</List>
		</Page>
	)
}

export default GroupInfo
