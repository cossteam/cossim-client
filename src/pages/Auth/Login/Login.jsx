import React, { useState } from 'react'
import { f7, ListInput, List, LoginScreenTitle, Button, theme, Preloader, Link } from 'framework7-react'
import { $t } from '@/i18n'
import { useUserStore } from '@/stores/user'
import { At, Lock } from 'framework7-icons/react'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { loginApi } from '@/api/user'
import { validEmail } from '@/utils/validate'
import '../Auth.less'
import { clsx } from 'clsx'
// import PGP from '@/utils/PGP'

Login.propTypes = {
	disabled: PropTypes.bool.isRequired
}

export default function Login({ disabled }) {
	// 表单数据
	const [fromData, setFromData] = useState({ email: '1005@qq.com', password: '123456qq', public_key: '1' })

	// 错误提示
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')

	// 登录loading
	const [loading, setLoading] = useState(false)

	// 用户信息
	const userStore = useUserStore()

	// 错误信息列表
	const errorList = {
		emailEmpty: $t('邮箱不能为空'),
		emailFormat: $t('邮箱格式不正确'),
		passwordEmpty: $t('密码不能为空'),
		errorMessage: $t('登录失败，请稍后重试！'),
		serverError: $t('服务器错误，请稍后重试！')
	}

	// 登录
	const signIn = async () => {
		try {
			// 判断是否正在登录
			if (loading) return

			// 初步校验
			if (!fromData.email.trim()) return setEmailError(errorList.emailEmpty)
			if (!validEmail(fromData.email.trim())) return setEmailError(errorList.emailFormat)
			if (!fromData.password.trim()) return setPasswordError(errorList.passwordEmpty)

			// loading
			setLoading(true)
			// 登录
			let decryptedData = await loginApi({ ...fromData, public_key: '1' })

			/*
			// 生成客户端公钥
			const { privateKey, publicKey, revocationCertificate } = await PGP.generateKeys()
			userStore.updateClientKeys({ privateKey, publicKey, revocationCertificate })
			const newFromData = { ...fromData, public_key: publicKey }
			setFromData(newFromData)
			// AES256 加密表单数据
			const passwords = ['coss']
			const messageEncrypted = await PGP.encryptAES256(JSON.stringify(newFromData), passwords[0])
			// 使用服务端公钥加密AES256密钥
			const passwordsEncrypted = await PGP.encrypt({
				text: passwords[0],
				key: userStore.serviceKey
			})

			// 登录
			const res = await loginApi({
				message: messageEncrypted,
				secret: passwordsEncrypted
			})
			 */
			// AES256解密
			// const decrypted = await PGP.decryptAES256(decryptedData.message, await PGP.decrypt(decryptedData.secret))
			// decryptedData = JSON.parse(decrypted)
			// console.log('res', decryptedData)

			// 无论登录成功与否都需要关闭 loading
			if (decryptedData) setLoading(false)

			if (decryptedData.code !== 200) return f7.dialog.alert(decryptedData.msg || errorList.errorMessage)
			if (decryptedData.data.token) userStore.updateToken(decryptedData.data.token)
			if (decryptedData.data.user_info) userStore.updateUser(decryptedData.data.user_info)

			userStore.updateLogin(true)
			setLoading(false)
			window.location.href = '/'
		} catch (err) {
			console.log(err.message)
			f7.dialog.alert(err.message || errorList.serverError)
			setLoading(false)
		}
	}

	// 返回时需要操作
	useEffect(() => {
		if (disabled) {
			setFromData({ email: '', password: '' })
			setEmailError('')
			setPasswordError('')
			setLoading(false)
		}
	}, [disabled])

	return (
		<>
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
					{/* <Link href="#" className="text-sm text-blue-500">
						忘记密码
					</Link> */}
				</p>
			</List>
			<List inset>
				<Button onClick={signIn} large className="mx-[16px] mb-5" fill round text={$t('登录')}>
					{loading && <Preloader size="16" color="white" className="" />}
				</Button>
			</List>
		</>
	)
}
