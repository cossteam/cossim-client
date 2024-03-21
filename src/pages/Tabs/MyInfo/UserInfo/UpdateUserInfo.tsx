import { Link, NavRight, Navbar, Page, f7 } from 'framework7-react'
import { useState } from 'react'

import { $t } from '@/shared'
import UserService from '@/api/user'
import { validPassword } from '@/utils/validate'
import { removeAllCookie } from '@/utils/cookie'
import useUserStore from '@/stores/user'
import CommInput from '@/components/CommInput/CommInput'

const UpdateUserInfo: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const { default: defaultValue, title } = f7route.query
	const type = f7route.params.type
	const userStore = useUserStore()

	const [text, setText] = useState<string>(defaultValue as string)

	const [oldPassword, setOldPassword] = useState<string>('')
	const [newPassword, setNewPassword] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')

	const updateUserInfo = async () => {
		try {
			f7.dialog.preloader($t('修改中...'))

			const params = { [type as string]: text }
			const { code, data, msg } = await UserService.updateUserInfoApi(params)
			if (code !== 200) {
				return f7.dialog.alert($t(msg))
			}
			userStore.update({
				userInfo: {
					...userStore.userInfo,
					...data
				}
			})
			f7router.back()
		} catch (error) {
			console.error('更新用户信息失败', error)
			f7.dialog.alert($t('更新用户信息失败'))
		} finally {
			f7.dialog.close()
		}
	}

	const updatePassword = async () => {
		if (!oldPassword || !newPassword || !confirmPassword) return f7.dialog.alert($t('内容不能留空'))
		if (newPassword !== confirmPassword) return f7.dialog.alert($t('两次密码不一致'))
		if (!validPassword(newPassword)) return f7.dialog.alert($t('新密码强度太弱'))

		try {
			f7.dialog.preloader($t('修改中...'))
			const { code, msg } = await UserService.updatePassWordApi({
				old_password: oldPassword,
				password: newPassword,
				confirm_password: confirmPassword
			})
			if (code !== 200) throw new Error(msg)

			f7.dialog.alert($t('修改密码成功'), $t('请重新登录'), () => {
				removeAllCookie()
				location.reload()
			})
		} catch (error: any) {
			f7.dialog.alert(error.message || $t('修改密码失败'))
		} finally {
			f7.dialog.close()
		}
	}

	const save = async () => {
		if (type === 'password') return await updatePassword()
		if (text === defaultValue || !text) return f7.dialog.alert($t('请输入修改内容'))
		await updateUserInfo()
	}

	return (
		<Page noToolbar>
			<Navbar className="hidden-navbar-bg" backLink title={title}>
				<NavRight>
					<Link onClick={() => save()}>{$t('完成')}</Link>
				</NavRight>
			</Navbar>

			{type !== 'password' ? (
				<div>
					<CommInput defaultValue={defaultValue} onChange={(value: any) => setText(value)} />
				</div>
				
			) : (
				<div>
					<CommInput title={$t('旧密码')} placeholder={$t('请输入旧密码')} type='password'  onChange={(value: any) => setOldPassword(value)} />
					<CommInput title={$t('新密码')} placeholder={$t('请输入新密码')} type='password' onChange={(value: any) => setNewPassword(value)} />
					<CommInput title={$t('确认密码')} placeholder={$t('请再次输入新密码')} type='password' onChange={(value: any) => setConfirmPassword(value)} />
				</div>
			)}
		</Page>
	)
}

export default UpdateUserInfo
