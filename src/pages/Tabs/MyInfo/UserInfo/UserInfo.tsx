import React, { useEffect, useState } from 'react'
import { f7, Page, Navbar, List, ListItem, Button, Block } from 'framework7-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useClipboard } from '@reactuses/core'

import { $t, exportKeyPair } from '@/shared'
import CommonStore from '@/db/common'
import UserService from '@/api/user'
import { removeAllCookie } from '@/utils/cookie'
import '../MyInfo.scss'

const Userinfo: React.FC<RouterProps> = ({ f7router, f7route }) => {
	const [userInfo, setUserInfo] = useState<any>({})

	const user = useLiveQuery(async () => {
		const reslut = await CommonStore.findOneById(
			CommonStore.tables.users,
			'user_id',
			f7route.params.user_id as string
		)
		setUserInfo(reslut?.user_info)
		console.log('reslut?.user_info', reslut)

		return reslut
	})

	const logout = () => {
		f7.dialog.confirm($t('退出登录'), $t('确定要退出登录吗？'), async () => {
			try {
				f7.dialog.preloader($t('正在退出...'))
				await UserService.logoutApi({
					login_number: userInfo?.login_number
				})
			} catch (error) {
				f7.dialog.alert($t('退出登录失败'))
			} finally {
				removeAllCookie()
				f7router.navigate('/auth/')
				f7.dialog.close()
			}
		})
	}

	const [, copy] = useClipboard()
	const exportPreKey = async () => {
		try {
			const keyPair = user?.keyPair
			if (keyPair) {
				const text = exportKeyPair(keyPair)
				copy(text)
				return f7.dialog.alert($t('已经成功导出到剪切板'))
			}
			f7.dialog.alert($t('导出身份信息失败'))
		} catch (error) {
			f7.dialog.alert($t('导出身份信息失败'))
		}
	}

	return (
		<Page className="bg-bgTertiary" noToolbar>
			<Navbar className="bg-bgPrimary hidden-navbar-bg" backLink outline={false} title={$t('个人信息')} />
			<List className="coss_list" strong>
				<ListItem link title="头像">
					<div slot="after">
						<img className="w-12 h-12 rounded-full" src={userInfo?.avatar} alt="" />
					</div>
				</ListItem>
				{/* <ListItem
					title={$t('状态')}
					className="coss_item__bottom"
					link={`/update_user_info/status/?default=${userInfo?.status}&title=${$t('状态')}`}
				>
					<div slot="after" className="max-w-[200px] text-ellipsis overflow-hidden">
						{userInfo?.status}
					</div>
				</ListItem> */}
				<ListItem
					link={`/update_user_info/nickname/?default=${userInfo?.nickname}&title=${$t('修改昵称')}`}
					title={$t('昵称')}
					className="coss_item__bottom"
					after={userInfo?.nickname}
				/>
				<ListItem
					link={`/update_user_info/signature/?default=${userInfo?.signature}&title=${$t('修改签名')}`}
					title={$t('签名')}
					className="coss_item__bottom"
				>
					<div slot="after" className="max-w-[200px] text-ellipsis overflow-hidden">
						{userInfo?.signature}
					</div>
				</ListItem>
				<ListItem
					link={`/update_user_info/tel/?default=${userInfo?.tel || ''}&title=${$t('修改手机号')}`}
					title={$t('手机号')}
					className="coss_item__bottom"
					after={userInfo?.tel}
				/>
			</List>

			<List className="coss_list" strong>
				<ListItem link title={$t('邮箱')} noChevron className="coss_item__bottom" after={userInfo?.email} />
				<ListItem link title={$t('我的二维码')} noChevron className="coss_item__bottom" />
			</List>

			<List className="coss_list" strong>
				<ListItem
					link={`/update_user_info/password/?default=${''}&title=${$t('修改密码')}`}
					title={$t('更改密码')}
					className="coss_item__bottom"
				/>
			</List>

			<Block>
				<Button onClick={exportPreKey} fill large round className="mb-3">
					{$t('导出身份信息')}
				</Button>
				<Button color="red" onClick={() => logout()} fill large round>
					{$t('退出登录')}
				</Button>
			</Block>
		</Page>
	)
}

export default Userinfo
