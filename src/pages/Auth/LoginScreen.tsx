import { Button, Link, List, ListInput, LoginScreenTitle, theme, Preloader, Page, Block, f7 } from 'framework7-react'
import { At, Lock, ChevronLeft } from 'framework7-icons/react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

import { $t, USER_ID, TOKEN, ACCOUNT, getFingerPrintID } from '@/shared'
import UserService from '@/api/user'
import type { LoginData, RegisterData } from '@/types/api/user'
import { validEmail } from '@/utils/validate'
import './Auth.scss'
import { setCookie } from '@/utils/cookie'
// import { Device } from '@capacitor/device'
import useUserStore from '@/stores/user'
// import { cloneDeep } from 'lodash-es'

interface LoginScreenProps {
	defaultData?: RegisterData
}

const LoginScreen: React.FC<LoginScreenProps & RouterProps> = ({ f7router, f7route, defaultData }) => {
	const [fromData, setFromData] = useState<LoginData>({
		email: '1@qq.com',
		password: '123456qqq'
	})

	const switchAccount = f7route.query?.switch_account

	// 错误提示
	const [emailError, setEmailError] = useState<string>('')
	const [passwordError, setPasswordError] = useState<string>('')

	// 登录loading
	const [loading, setLoading] = useState<boolean>(false)

	const valid = (): boolean => {
		let pass = false
		// 判断是否正在登录
		if (loading) return pass

		// 初步校验
		if (!fromData.email.trim()) {
			setEmailError($t('邮箱不能为空'))
			return pass
		}

		if (!validEmail(fromData.email.trim())) {
			setEmailError($t('邮箱格式不正确'))
			return pass
		}

		if (!fromData.password.trim()) {
			setPasswordError($t('密码不能为空'))
			return pass
		}

		pass = true
		setLoading(true)
		return pass
	}

	const userStore = useUserStore()

	const submit = async () => {
		try {
			if (!valid()) return

			// const { identifier: deviceId } = await Device.getId()
			// console.log('deviceId', await Device.getInfo(), deviceId)

			const deviceId = await getFingerPrintID()

			const { code, data, msg } = await UserService.loginApi({
				...fromData,
				driver_id: deviceId,
				platform: theme.ios ? 'ios' : 'android',
				driver_token: '7bd439461e80d13a889e08d0c351fdcfa2c697b920536b4a3787ecf69a5206dc'
			})

			if (code !== 200) {
				f7.dialog.alert(msg)
				return
			}

			const userList: any = localStorage.getItem('user_list')
			if (userList && switchAccount) {
				const temp = JSON.parse(userList)
				temp.push({ ...data.user_info, ...fromData })
				localStorage.setItem('user_list', JSON.stringify([...temp]))
			} else {
				localStorage.setItem('user_list', JSON.stringify([{ ...data.user_info, ...fromData }]))
			}

			setCookie(USER_ID, data?.user_info?.user_id)
			setCookie(ACCOUNT, data?.user_info?.email)
			setCookie(TOKEN, data?.token)

			location.reload()

			userStore.update({
				userId: data?.user_info?.user_id,
				token: data?.token,
				userInfo: data?.user_info,
				deviceId,
				lastLoginTime: data?.user_info?.last_login_time ?? 1,
				loginNumber: data?.user_info?.login_number ?? 0,
				isNewLogin: data?.user_info?.new_device_login ?? false
			})
		} catch (error) {
			console.error('登录失败', error)
			f7.dialog.alert($t('登录失败,请稍后重试'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (defaultData) {
			setFromData({ email: defaultData.email, password: defaultData.password })
		}
	}, [defaultData])

	return (
		<Page loginScreen noToolbar>
			<Block className="fixed top-0 left-0">
				<ChevronLeft className="text-2xl text-primary" onClick={() => f7router.back()} />
			</Block>
			<Block className="px-2">
				<LoginScreenTitle>{$t('登录')}</LoginScreenTitle>
				<List form>
					<ListInput
						label={$t('邮箱')}
						type="text"
						placeholder={$t('请输入邮箱')}
						className="el-input"
						outline
						value={fromData.email}
						onInput={(e) => {
							setFromData({ ...fromData, email: e.target.value })
							setEmailError('')
						}}
						floatingLabel
						errorMessage={emailError}
						errorMessageForce={!!emailError}
					>
						<At slot="media" className={clsx('w-5 h-5 text-icon-60', theme.ios && 'mt-1')} />
					</ListInput>
					<ListInput
						label={$t('密码')}
						type="password"
						placeholder={$t('请输入密码')}
						value={fromData.password}
						onInput={(e) => {
							setFromData({ ...fromData, password: e.target.value })
							setPasswordError('')
						}}
						outline
						floatingLabel
						errorMessage={passwordError}
						errorMessageForce={!!passwordError}
					>
						<Lock slot="media" className={clsx('w-5 h-5 text-icon-60', theme.ios && 'mt-1')} />
					</ListInput>

					<p className="mx-[18px] mt-[6px] flex justify-end">
						<Link href="#" className="text-sm text-blue-500">
							验证码登录
						</Link>
					</p>
				</List>
				<List inset>
					<Button onClick={submit} large className="mx-[16px] mb-5" fill round text={$t('登录')}>
						{loading && <Preloader size="18" color="white" />}
					</Button>
				</List>
			</Block>
		</Page>
	)
}

export default LoginScreen

// 0bc73fd0-5014-4967-a65b-ee1959aab39a
// 0bc73fd0-5014-4967-a65b-ee1959aab39a
