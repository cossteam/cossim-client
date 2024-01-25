import React, { useState, useEffect } from 'react'
import { Page, LoginScreen, Block, Button } from 'framework7-react'
import { $t } from '@/i18n'
import Login from './Login/Login'
import Register from './Register/Register'
import Fingerprint2 from 'fingerprintjs2'

export default function Auth() {
	const [loginScreenOpened, setLoginScreenOpened] = useState('')
	const [login, setLogin] = useState(true)

	const [disabled, setDisabled] = useState(false)
	// 指纹
	const [fingerprint, setFingerprint] = useState('')
	// 用户信息
	const [data, setData] = useState(null)

	const handleClick = (isLogin) => {
		setLogin(isLogin)
		setLoginScreenOpened(true)
	}

	const handlerRegister = (defaultData) => {
		console.log('defaultData', defaultData)
		setData(defaultData)
		setLogin(true)
		setLoginScreenOpened(true)
	}

	const createFingerprintGenerator = () => {
		let fingerprint = ''
		Fingerprint2.get((components) => {
			// 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
			// 配置的值的数组
			const values = components.map((component) => component.value)
			// console.log(values[16]);
			// 生成浏览器指纹
			fingerprint = Fingerprint2.x64hash128(values.join(''), 31)
			setFingerprint(fingerprint)
		})
	}

	useEffect(() => {
		setTimeout(() => createFingerprintGenerator(), 500)
	}, [])

	return (
		<Page>
			<Block className="flex justify-center h-3/5 pt-10">
				<h1 className="text-3xl font-semibold">COSS</h1>
			</Block>

			<Block>
				<Button
					large
					fill
					onClick={() => {
						handleClick(true)
					}}
					className="mb-5"
					round
				>
					{$t('登录')}
				</Button>
				<Button
					large
					tonal
					onClick={() => {
						handleClick(false)
					}}
					round
				>
					{$t('注册')}
				</Button>
			</Block>

			<LoginScreen
				opened={loginScreenOpened}
				onLoginScreenClosed={() => {
					setLoginScreenOpened(false)
				}}
			>
				<Page loginScreen className="relative">
					<Button
						className="fixed top-5 left-3"
						onClick={() => {
							setDisabled(true)
							setLoginScreenOpened(false)
						}}
					>
						<i className="icon-back"></i>
					</Button>
					{login ? (
						<Login disabled={disabled} fingerprint={fingerprint} defaultData={data} />
					) : (
						<Register disabled={disabled} handlerRegister={handlerRegister} fingerprint={fingerprint} />
					)}
				</Page>
			</LoginScreen>
		</Page>
	)
}
