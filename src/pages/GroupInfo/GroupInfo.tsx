/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 *
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *            佛祖保佑       永不宕机     永无BUG
 *	           佛曰:
 *                   写字楼里写字间，写字间里程序员；
 *                   程序人员写程序，又拿程序换酒钱。
 *                   酒醒只在网上坐，酒醉还来网下眠；
 *                   酒醉酒醒日复日，网上网下年复年。
 *                   但愿老死电脑间，不愿鞠躬老板前；
 *                   奔驰宝马贵者趣，公交自行程序员。
 *                   别人笑我忒疯癫，我笑自己命太贱；
 *                   不见满街漂亮妹，哪个归得程序员？
 *
 * Author       : YuHong
 * Date         : 2024-01-29 15:51:08
 * LastEditors  : YuHong
 */
import { $t, MemberListType, USER_ID } from '@/shared'
import { Icon, List, ListItem, Navbar, Page, Toggle, f7 } from 'framework7-react'
import { useEffect, useState } from 'react'
import GroupService from '@/api/group'
import { getCookie } from '@/utils/cookie'
import Avatar from '@/components/Avatar/Avatar.tsx'

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
	const [groupInfo, setGroupInfo] = useState<any>()

	useEffect(() => {
		;(async () => {
			// 获取群聊信息
			const { code, data } = await GroupService.groupInfoApi({ group_id: GroupId })
			if (code !== 200) return
			code === 200 && setGroupInfo(data)
			const isSilence = data?.preferences?.silent_notification
			setSilence(isSilence === 1)
		})()
	}, [props])

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
				const { code, msg } = await GroupService.groupQuitApi({ group_id: Number(GroupId) })
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
				const { code, msg } = await GroupService.groupDissolve({ group_id: Number(GroupId) })
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
				group_id: Number(GroupId),
				is_silent: isSilence ? 1 : 0
			})
			if (code !== 200) return
		} catch (error: any) {
			f7.dialog.alert(error.message)
		} finally {
			f7.dialog.close()
		}
	}

	//! 解决傻逼底部导航栏莫名其妙的显示问题
	const handlerToolbar = (show: boolean = false) => {
		const framework7Root = document.getElementById('framework7-root')
		if (framework7Root) {
			show ? framework7Root.classList.remove('hidden-toolbar') : framework7Root.classList.add('hidden-toolbar')
		}
	}

	return (
		<Page noToolbar onPageBeforeIn={() => handlerToolbar(false)} onPageBeforeOut={() => handlerToolbar(true)}>
			<Navbar title={$t('群聊信息')} backLink className="bg-bgPrimary hidden-navbar-bg" />
			<List className="m-0 mb-3 bg-white" strong dividers outline>
				<ListItem noChevron>
					<div className="w-full flex flex-col justify-center items-center">
						<div className="mb-1 w-full grid grid-cols-5 gap-6">
							{members.slice(0, 23).map((item: any) => (
								<div key={item.user_id} className="w-12 h-[144rpx] flex flex-col items-center">
									<div className="min-w-12 min-h-12 overflow-hidden">
										<Avatar size={50} square src={item.avatar} />
									</div>

									<div style={{
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis'
									}} className="w-12 min-w-12 min-h-6 flex-1 text-sm text-gray-400 max-w-12 overflow-hidden text-ellipsis">
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
				<ListItem title="群聊名称" link={identity === 2 ? `/add_group/?id=${groupInfo?.id}` : ''}>
					<div slot="after">
						<span>{groupInfo?.name}</span>
					</div>
				</ListItem>
				<ListItem link={`/group_notice/${GroupId}/?identity=${identity}`} title="群公告"></ListItem>
				<ListItem link={`/group_qrcode/?group_id=${GroupId}`} title="群二维码"></ListItem>
				<ListItem link={`/group_user_display_name/?group_id=${GroupId}&remark=${groupInfo?.preferences.remark}`} title="我在群组的昵称" after={groupInfo?.preferences.remark} />
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
