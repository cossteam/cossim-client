import React, { useState, useEffect } from 'react'
import { f7, Icon, List, ListItem, NavTitle, Navbar, Page } from 'framework7-react'
import PropType from 'prop-types'
import { groupInfoApi, groupMemberApi, groupQuitApi, groupDissolve } from '@/api/group'
import { useUserStore } from '@/stores/user'

ChatInfo.propTypes = {
	type: PropType.string,
	id: PropType.string,
	f7router: PropType.object
}
export default function ChatInfo(props) {
	const { f7router, type, id: GroupId } = props
	// 聊天类型：group | friend

	const { user } = useUserStore()
	const [identity, setIdentity] = useState(null)

	// 群聊信息
	const [groupInfo, setGroupInfo] = useState({})
	useEffect(() => {
		// 获取群聊信息
		groupInfoApi({ group_id: GroupId }).then(({ code, data }) => {
			console.log(data)
			code === 200 && setGroupInfo(data)
		})
	}, [])

	// 群成员
	const [members, setMembers] = useState([])
	useEffect(() => {
		if (type === 'group') {
			// 获取群信息
			// 获取成员信息
			groupMemberApi({ group_id: GroupId }).then(({ code, data }) => {
				if (code === 200) {
					const identity = data.find((i) => i.user_id === user.user_id).identity
					identity && setIdentity(identity)
					setMembers(data)
				}
			})
		}
	}, [props])

	// 退出群聊
	const quitGroup = async () => {
		f7.dialog.confirm('退出群聊', '确定要退出群聊吗？', async () => {
			try {
				f7.dialog.preloader('正在退出...')
				const { code, msg } = await groupQuitApi({ group_id: parseInt(GroupId) })
				code === 200 && f7router.back()
				code !== 200 && f7.dialog.alert(msg)
			} catch (error) {
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
				const { code, msg } = await groupDissolve({ group_id: GroupId })
				code === 200 && f7router.back()
				code !== 200 && f7.dialog.alert(msg)
			} catch (error) {
				f7.dialog.alert(error.message, '解散失败...')
			} finally {
				f7.dialog.close()
			}
		})
	}

	return (
		<Page className="chatinfo-page bg-gray-100" noToolbar messagesContent>
			<Navbar className="messages-navbar bg-white" backLink>
				<NavTitle>
					<div className="mr-16">聊天信息</div>
				</NavTitle>
			</Navbar>
			<List className="m-0 mb-3 bg-white" strong dividers outline>
				<ListItem noChevron>
					<div className="w-full flex flex-col justify-center items-center">
						<div className="mb-6 w-full grid grid-cols-5 gap-6">
							{members.slice(0, 23).map((item) => (
								<div key={item.user_id} className="w-12 h-12 flex flex-col items-center">
									<img className="rounded-lg" src={item.avatar} alt="" />
									<div className="text-sm text-gray-400">{item.nickname}</div>
								</div>
							))}
							<div
								className="w-12 h-12 flex flex-col justify-center items-center border-dashed border-[1px] border-gray-400 text-gray-500 rounded-lg"
								onClick={() => f7router.navigate(`/memberlist/${'plus'}/${GroupId}/`)}
							>
								<Icon f7="plus" size={18} />
							</div>
							{identity && (
								<div
									className="w-12 h-12 flex flex-col justify-center items-center border-dashed border-[1px] border-gray-400 text-gray-500 rounded-lg"
									onClick={() => f7router.navigate(`/memberlist/${'minus'}/${GroupId}/`)}
								>
									<Icon f7="minus" size={18} />
								</div>
							)}
						</div>
						{members.length > 23 && (
							<div className="mb-1">
								<span
									className="text-sm text-gray-500"
									onClick={() => f7router.navigate(`/memberlist/${'show'}/${GroupId}/`)}
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
