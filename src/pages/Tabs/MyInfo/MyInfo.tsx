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
import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import UserService from '@/api/user'
import { getCookie } from '@/utils/cookie'
import { $t, USER_ID } from '@/shared'
import CommonStore from '@/db/common'
import './MyInfo.scss'

const user_id = getCookie(USER_ID) || ''

const MyInfo = () => {
	const [info, setInfo] = useState<any>({})

	const userInfo = useLiveQuery(async () => {
		return await CommonStore.findOneById(CommonStore.tables.users, 'user_id', user_id)
	})

	const updateInfo = async () => {
		const user = await CommonStore.findOneById(CommonStore.tables.users, 'user_id', user_id)
		setInfo(user?.user_info)
		return user
	}

	const onPageInit = async () => {
		try {
			const user = await updateInfo()
			const { data } = await UserService.getUserInfoApi({ user_id })

			if (!user || !data) return

			await CommonStore.update(CommonStore.tables.users, 'user_id', user_id, {
				...user,
				user_info: {
					...user?.user_info,
					data
				}
			})

			await updateInfo()
		} catch (error) {
			console.log('获取用户信息错误', error)
		}
	}

	useEffect(() => {
		if (!userInfo) return
		setInfo(userInfo?.user_info)
	}, [userInfo])

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
		<Page onPageInit={onPageInit} className="bg-bgTertiary coss_info">
			<Navbar
				title={info?.nickname}
				large
				className="bg-bgPrimary hidden-navbar-bg coss_navbar"
				outline={false}
			/>
			<List strong mediaList className="coss_list">
				<ListItem
					link={`/user_info/${info?.user_id}/`}
					title={info?.email}
					text={info?.signature}
					className="coss_item__button"
				>
					<div className="w-12 h-12" slot="media">
						<img src={info?.avatar} alt="" className="w-full h-full object-cover rounded-full" />
					</div>
					<Qrcode slot="after" className="text-3xl" />
				</ListItem>
			</List>

			{settings.map((item, index) => (
				<List strong className="coss_list" key={index}>
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
