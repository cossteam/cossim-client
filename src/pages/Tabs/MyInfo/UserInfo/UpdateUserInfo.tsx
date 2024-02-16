import { Link, List, ListInput, NavRight, Navbar, Page, f7 } from 'framework7-react'
import { useState } from 'react'

import { $t } from '@/shared'
import UserService from '@/api/user'
import CommonStore from '@/db/common'
import { validPassword } from '@/utils/validate'
import { removeAllCookie } from '@/utils/cookie'

const UpdateUserInfo: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const { default: defaultValue, title } = f7route.query
	const type = f7route.params.type

	// const { updateUser, removeUser } = useUserStore()

	const [text, setText] = useState<string>(defaultValue as string)

	const [oldPassword, setOldPassword] = useState<string>('')
	const [newPassword, setNewPassword] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')

	// const savePassWord = (praams) => {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			const { code, data, msg } = await updatePassWordApi(praams)
	// 			if (code === 200) {
	// 				resolve(data)
	// 			}
	// 			reject(new Error(msg))
	// 		} catch (error) {
	// 			reject(error)
	// 		}
	// 	})
	// }

	const updateUserInfo = async () => {
		try {
			f7.dialog.preloader($t('修改中...'))

			const params = { [type as string]: text }
			const { data } = await UserService.updateUserInfoApi(params)

			const user = await CommonStore.findOneById(CommonStore.tables.users, 'user_id', data?.user_id)
			if (user) {
				await CommonStore.update(CommonStore.tables.users, 'user_id', data?.user_id, {
					...user,
					user_info: {
						...user.user_info,
						...params
					}
				})
			}
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

		// f7.dialog.preloader('修改中...')
		// const api = KEY === 'password' ? savePassWord : saveUserInfo
		// await api(params)
		// if (KEY === 'password') {
		// 	f7.dialog.alert('请重新登录!', '密码修改成功', () => {
		// 		removeUser()
		// 		window.location.href = '/'
		// 	})
		// } else {
		// 	f7router.back()
		// }
		// console.log('text', text,defaultValue)
	}

	return (
		<Page noToolbar className="bg-bgTertiary">
			<Navbar className="hidden-navbar-bg" backLink title={title}>
				<NavRight>
					<Link onClick={() => save()}>{$t('完成')}</Link>
				</NavRight>
			</Navbar>

			{type !== 'password' ? (
				<List strongIos outlineIos dividersIos form formStoreData>
					<ListInput
						name="name"
						type="text"
						onChange={(e) => setText(e.target.value)}
						clearButton
						defaultValue={defaultValue}
						autofocus
					/>
				</List>
			) : (
				<List strongIos outlineIos dividersIos form formStoreData>
					<ListInput
						label={$t('旧密码')}
						name="old_password"
						type="password"
						onChange={(e) => setOldPassword(e.target.value)}
						clearButton
						placeholder={$t('请输入旧密码')}
					/>
					<ListInput
						label={$t('新密码')}
						name="new_password"
						type="password"
						onChange={(e) => setNewPassword(e.target.value)}
						clearButton
						placeholder={$t('请输入新密码')}
					/>
					<ListInput
						label={$t('确认密码')}
						name="confirm_password"
						type="password"
						onChange={(e) => setConfirmPassword(e.target.value)}
						clearButton
						placeholder={$t('请再次输入新密码')}
					/>
				</List>
			)}
		</Page>
	)
}

export default UpdateUserInfo
