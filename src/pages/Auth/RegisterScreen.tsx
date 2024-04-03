import { Button, List, ListInput, LoginScreenTitle, theme, Preloader, Page, Block, f7 } from 'framework7-react'
import { At, ChevronLeft, Lock } from 'framework7-icons/react'
import { useState } from 'react'
import clsx from 'clsx'

import { $t } from '@/shared'
import type { RegisterData } from '@/types/api/user'
import './Auth.scss'
import { validEmail, validPassword } from '@/utils/validate'
import UserService from '@/api/user'
// import useCacheStore from '@/stores/cache'
import useUserStore from '@/stores/user'

const RegisterScreen: React.FC<RouterProps> = ({ f7router }) => {
	const [fromData, setFromData] = useState<RegisterData>({
		nickname: '',
		email: '',
		password: '',
		confirm_password: ''
	})

	// 错误提示
	const [emailError, setEmailError] = useState<string>('')
	const [passwordError, setPasswordError] = useState<string>('')
	const [confirmPasswordError, setConfirmPasswordError] = useState<string>('')

	// 登录loading
	const [loading, setLoading] = useState<boolean>(false)

	const userStore = useUserStore()
	// const cacheStore = useCacheStore()

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
		if (!validPassword(fromData.password.trim())) {
			setPasswordError($t('密码强度不够'))
			return pass
		}
		if (!fromData.confirm_password.trim()) {
			setConfirmPasswordError($t('确认密码不能为空'))
			return pass
		}
		if (fromData.password.trim() !== fromData.confirm_password.trim()) {
			setConfirmPasswordError($t('两次密码不一致'))
			return pass
		}

		pass = true
		setLoading(true)
		return pass
	}

	const submit = async () => {
		try {
			if (!valid()) return

			const { code, data, msg } = await UserService.registerApi(fromData)
			if (code !== 200) {
				f7.dialog.alert(msg)
				return
			}
			userStore.update({ userId: data?.user_id })
			// await cretaeIdentity(data.user_id, fromData.email)
			f7router.navigate('/login/', { props: { defaultData: fromData } })
		} catch {
			f7.dialog.alert($t('注册失败,请稍后重试'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Page loginScreen noToolbar>
			<Block className="fixed top-0 left-0">
				<ChevronLeft className="text-2xl text-primary" onClick={() => f7router.back()} />
			</Block>
			<Block className="px-2">
				<LoginScreenTitle>{$t('注册')}</LoginScreenTitle>
				<List form>
					<ListInput
						label={$t('用户名')}
						type="text"
						placeholder={$t('请输入用户名')}
						outline
						value={fromData.nickname}
						onInput={(e) => {
							setFromData({ ...fromData, nickname: e.target.value })
						}}
						floatingLabel
						className="el-input"
					>
						<Lock slot="media" className={clsx('w-5 h-5 text-icon-60', theme.ios && 'mt-1')} />
					</ListInput>
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
						className="el-input"
						outline
						value={fromData.password}
						onInput={(e) => {
							setFromData({ ...fromData, password: e.target.value })
							setPasswordError('')
						}}
						floatingLabel
						errorMessage={passwordError}
						errorMessageForce={!!passwordError}
					>
						<Lock slot="media" className={clsx('w-5 h-5 text-icon-60', theme.ios && 'mt-1')} />
					</ListInput>
					<ListInput
						label={$t('确认密码')}
						type="password"
						placeholder={$t('请输入确认密码')}
						className="el-input"
						outline
						value={fromData.confirm_password}
						onInput={(e) => {
							setFromData({ ...fromData, confirm_password: e.target.value })
							setConfirmPasswordError('')
						}}
						floatingLabel
						errorMessage={confirmPasswordError}
						errorMessageForce={!!confirmPasswordError}
					>
						<At slot="media" className={clsx('w-5 h-5 text-icon-60', theme.ios && 'mt-1')} />
					</ListInput>
				</List>
				<List inset>
					<Button onClick={submit} large className="mx-[16px] mb-5" fill round text={$t('注册')}>
						{loading && <Preloader size="18" color="white" />}
					</Button>
				</List>
			</Block>
		</Page>
	)
}

export default RegisterScreen
