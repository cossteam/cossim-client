import React, { useState } from 'react'
import { Page, LoginScreen, Block, Button } from 'framework7-react'
import { $t } from '@/i18n'
import Login from './Login/Login'
import Register from './Register/Register'
import { mode, baseURL } from '@/utils/request'

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

	return (
		<Page>
			<Block className="flex justify-center h-3/5 pt-10">
				<h1 className="text-3xl font-semibold">COSS</h1>
			</Block>
			<Block>
				<h2>{baseURL[mode]}</h2>
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
					{login ? <Login disabled={disabled} /> : <Register disabled={disabled} />}
				</Page>
			</LoginScreen>
		</Page>
	)
}
