import React, { useState } from 'react'
import { f7, ListInput, List, LoginScreenTitle, Button, theme, Preloader } from 'framework7-react'
import { $t } from '@/i18n'
import { Lock, At } from 'framework7-icons/react'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { registerApi } from '@/api/user'
import { validEmail, validPassword } from '@/utils/validate'
import '../Auth.less'
import { clsx } from 'clsx'

import commonService from '@/db/common'
// import { generateKeyPair } from '@/utils/signal/signal-crypto'
import { generateKeyPair } from '@/utils/tweetnacl'

/**
 * 生成用户 id
 * @param {string} id 用户 id
 */
async function createInfo(options) {
	try {
		// 生成用户信息
		const keyPair = await generateKeyPair()
		// 存储到本地数据库
		await commonService.add(commonService.TABLES.HISTORY, {
			id: options.id,
			data: {
				keyPair,
				account: options.account,
				createTime: Date.now(),
				updateTime: Date.now(),
				// 指纹信息
				fingerprint: options.fingerprint,
				// 用于判断是否是第一次注册
				isFirst: true,
				// 设备信息
				// platform: options.platform
				// 上一次登录时间
				lastLoginTime: 0
			}
		})
		// TODO: 生成 signal 身份
	} catch (error) {
		console.error('生成用户信息失败', error)
	}
}

export default function Register({ disabled, handlerRegister, fingerprint }) {
	console.log("fingerprint",fingerprint);

	// 表单数据
	const [fromData, setFromData] = useState({
		nickname: '',
		email: '',
		password: '',
		confirm_password: ''
	})

	// 错误提示
	const [nicknameError, setNicknameError] = useState(false)
	const [emailError, setEmailError] = useState(false)
	const [passwordError, setPasswordError] = useState(false)
	const [confirmPasswordError, setConfirmPasswordError] = useState(false)

	// 登录loading
	const [loading, setLoading] = useState(false)

	// 错误信息列表
	const errorList = {
		emailEmpty: $t('邮箱不能为空'),
		emailFormat: $t('邮箱格式不正确'),
		passwordEmpty: $t('密码不能为空'),
		passwordFormat: $t('密码必须由数字+字母组成且6位以上'),
		confirmPasswordEmpty: $t('确认密码不能为空'),
		passwordConfirm: $t('两次密码不一致'),
		usernameEmpty: $t('用户名不能为空'),
		registerSuccess: $t('注册成功')
	}

	// 登录
	const signIn = async () => {
		try {
			// 判断是否正在登录
			if (loading) return

			// 校验邮箱
			if (!fromData.email.trim()) return setEmailError(errorList.emailEmpty)
			if (!validEmail(fromData.email.trim())) return setEmailError(errorList.emailFormat)

			// 校验密码
			if (!fromData.password.trim()) return setPasswordError(errorList.passwordEmpty)
			if (!validPassword(fromData.password.trim())) return setPasswordError(errorList.passwordFormat)

			// 校验确认密码
			if (!fromData.confirm_password.trim()) return setConfirmPasswordError(errorList.confirmPasswordEmpty)
			if (fromData.password.trim() !== fromData.confirm_password.trim())
				return setConfirmPasswordError(errorList.passwordConfirm)

			// loading
			setLoading(true)

			// 注册
			const decryptedData = await registerApi(fromData)
			if (decryptedData.code !== 200) return f7.dialog.alert(decryptedData.msg || '注册失败')

			// 生成用户信息
			await createInfo({
				id: decryptedData.data?.user_id,
				account: fromData.email.trim(),
				fingerprint
			})

			// 注册成功
			f7.dialog.alert(errorList.registerSuccess, () => handlerRegister(fromData))
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	// 返回时需要操作
	useEffect(() => {
		if (disabled) {
			setFromData({ email: '', password: '', confirm_password: '', nickname: '' })
			setEmailError('')
			setPasswordError('')
			setConfirmPasswordError('')
			setLoading(false)
		}
	}, [disabled])

	return (
		<>
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
						setNicknameError(false)
					}}
					floatingLabel
					errorMessage={nicknameError}
					errorMessageForce={!!nicknameError}
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
						setEmailError(false)
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
						setPasswordError(false)
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
						setConfirmPasswordError(false)
					}}
					floatingLabel
					errorMessage={confirmPasswordError}
					errorMessageForce={!!confirmPasswordError}
				>
					<At slot="media" className={clsx('w-5 h-5 text-icon-60', theme.ios && 'mt-1')} />
				</ListInput>
			</List>
			<List inset>
				<Button onClick={signIn} large className="mx-[16px]" fill round text={$t('注册')}>
					{loading && <Preloader size="16" color="white" />}
				</Button>
			</List>
		</>
	)
}

Register.propTypes = {
	disabled: PropTypes.bool.isRequired,
	handlerRegister: PropTypes.func,
	fingerprint: PropTypes.string
}
