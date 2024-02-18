import { Button, Link, List, ListInput, LoginScreenTitle, theme, Preloader, Page, Block, f7 } from 'framework7-react'
import { At, Lock, ChevronLeft } from 'framework7-icons/react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

import { $t, USER_ID, TOKEN, ACCOUNT, cretaeIdentity } from '@/shared'
import UserService from '@/api/user'
import type { LoginData, RegisterData } from '@/types/api/user'
import { validEmail } from '@/utils/validate'
import './Auth.scss'
import { setCookie } from '@/utils/cookie'
import CommonStore from '@/db/common'

interface LoginScreenProps {
	defaultData?: RegisterData
}

const LoginScreen: React.FC<LoginScreenProps & RouterProps> = ({ f7router, defaultData }) => {
	const [fromData, setFromData] = useState<LoginData>({
		email: '123@qq.com',
		password: '123456qq'
	})

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

    // import { cloneDeep } from 'lodash-es'
    // console.dir(cloneDeep(decryptedData));
	const submit = async () => {
		try {
			if (!valid()) return

			// TODO： 后续希望传入一个唯一设备 id 给后端，后端那边判断是否新设备
			const { code, data, msg } = await UserService.loginApi(fromData)
            console.dir(data);
            
			if (code !== 200) return f7.dialog.alert(msg)

			const user_id = data?.user_info?.user_id

            console.log("user_id",user_id);
            

			const user = await CommonStore.findOneById(CommonStore.tables.users, 'user_id', user_id)
			if (!user) {
				// TODO: 进一步验证
				// f7.dialog.prompt($t('请输入你在旧设备导出的密钥对'), $t('验证新设备'), (name) => {
				// 	f7.dialog.confirm(`Are you sure that your name is ${name}?`, () => {
				// 		f7.dialog.alert(`Ok, your name is ${name}`)
				// 	})
				// })
				// return
				const reslut = await cretaeIdentity(user_id, fromData.email, true)
				await CommonStore.add(CommonStore.tables.users, {
					...reslut,
					// TODO: 验证设备后填充密钥
					keyPair: null,
					user_info: data?.user_info
				})
			} else {
				await CommonStore.update(CommonStore.tables.users, 'user_id', user_id, {
					...user,
					user_info: data?.user_info
				})
			}
			setCookie(USER_ID, data?.user_info?.user_id)
			setCookie(ACCOUNT, data?.user_info?.email)
			setCookie(TOKEN, data?.token)
			// location.reload()
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
		<Page loginScreen>
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
