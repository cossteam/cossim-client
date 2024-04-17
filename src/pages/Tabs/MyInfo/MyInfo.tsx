import { List, ListItem, Navbar, Page } from 'framework7-react'
import {
	Bell,
	DeviceDesktop,
	DeviceTabletPortrait,
	EllipsesBubble,
	ExclamationmarkShield,
	GearAlt,
	Qrcode
} from 'framework7-icons/react'
import { useMemo, useState } from 'react'

import UserService from '@/api/user'
import { $t } from '@/shared'
import './MyInfo.scss'
import useUserStore from '@/stores/user'
import Avatar from '@/components/Avatar/Avatar'

const MyInfo: React.FC<RouterProps> = ({ f7router }) => {
	const [info, setInfo] = useState<any>({})
	const userStore = useUserStore()
	const userId = useMemo(() => userStore.userId, [])

	const loadUserInfo = async () => {
		try {
			const { data } = await UserService.getUserInfoApi({ user_id: userId })
			if (!data) {
				setInfo(userStore.userInfo)
				return
			}

			userStore.update({
				userInfo: data
			})
			setInfo(data)
		} catch (error) {
			console.log('获取用户信息错误', error)
			setInfo(userStore.userInfo)
		}
	}

	const settings = useMemo(
		() => [
			[
				{ title: $t('通知中心'), icon: <Bell className="coss_item__icon" />, link: '#' },
				{ title: $t('显示'), icon: <DeviceDesktop className="coss_item__icon" />, link: '#' },
				{ title: $t('隐私与安全'), icon: <ExclamationmarkShield className="coss_item__icon" />, link: '#' },
				{ title: $t('设备'), icon: <DeviceTabletPortrait className="coss_item__icon" />, link: '#' },
				{ title: $t('语言'), icon: <EllipsesBubble className="coss_item__icon" />, link: '#' }
			],
			[{ title: $t('设置'), icon: <GearAlt className="coss_item__icon" />, link: '#' }]
		],
		[]
	)

	return (
		<Page onPageAfterIn={loadUserInfo} className="bg-bgTertiary coss_info">
			<Navbar className="bg-bgPrimary hidden-navbar-bg coss_navbar" title={info?.nickname} large outline={false}>
				<span></span>
			</Navbar>
			<List strong mediaList className="coss_list">
				<ListItem
					link
					title={info?.email}
					text={info?.signature}
					className="coss_item__button"
					onClick={() => f7router.navigate(`/user_info/${info?.user_id}/`)}
				>
					<div className="w-12 h-12" slot="media">
						<Avatar src={info?.avatar} />
					</div>
					<Qrcode
						slot="after"
						className="text-3xl"
						onClick={(e) => {
							e.stopPropagation()
							f7router.navigate('/my_qrcode/')
						}}
					/>
				</ListItem>
			</List>

			{settings.map((item, index) => (
				<List strong className="coss_list" key={index} dividers>
					{item.map((child, current) => (
						<ListItem title={child.title} className="coss_item__button" link key={current}>
							<div slot="media">{child.icon}</div>
						</ListItem>
					))}
				</List>
			))}
		</Page>
	)
}

export default MyInfo
