import React, { useState, useEffect } from 'react'
import { Page, LoginScreen, Block, Button, Preloader } from 'framework7-react'
import { $t } from '@/i18n'
import { useUserStore } from '@/stores/user'
import Login from './Login/Login'
import Register from './Register/Register'
import { getPgpKeyApi } from '@/api/user'

export default function Auth() {
	const [loginScreenOpened, setLoginScreenOpened] = useState('')
	const [login, setLogin] = useState(true)

	const [disabled, setDisabled] = useState(false)

	function handleClick(isLogin) {
		setLogin(isLogin)
		setLoginScreenOpened(true)
	}

	// const [username, setUsername] = useState('')
	// const [password, setPassword] = useState('')

	// const signIn = () => {
	// 	f7.dialog.alert(`Username: ${username}<br>Password: ${password}`, () => {
	// 		f7.loginScreen.close()
	// 	})
	// }
    
	// 用户信息
	const userStore = useUserStore()
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		getPgpKeyApi()
			.then(({ code, data }) => {
				if (code === 200) {
					const { public_key } = data
					userStore.updateServiceKey(public_key)
				}
			})
			.finally(() => {
				setLoading(false)
			})
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
						!loading && handleClick(true)
					}}
					className="mb-5"
					round
				>
					{$t('登录')}
					{loading && <Preloader size="16" color="white" className="" />}
				</Button>
				<Button
					large
					tonal
					onClick={() => {
						!loading && handleClick(false)
					}}
					round
				>
					{$t('注册')}
					{loading && <Preloader size="16" color="white" className="" />}
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
					{login ? <Login disabled={disabled} /> : <Register disabled={disabled} />}
				</Page>
			</LoginScreen>
		</Page>
	)
}
