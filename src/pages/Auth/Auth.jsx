import React, { useState } from 'react'
import { Page, LoginScreen, Block, Button } from 'framework7-react'
import { $t } from '@/i18n'

import Login from './Login/Login'
import Register from './Register/Register'

export default function Auth() {
	const [loginScreenOpened, setLoginScreenOpened] = useState('')
	const [login, setLogin] = useState(true)

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
				<h1 className="text-3xl font-semibold">Coss</h1>
			</Block>

			<Block>
				<Button
					large
					fill
					onClick={() => {
						handleClick(true)
					}}
					className="mb-5"
				>
					{$t('登录')}
				</Button>
				<Button
					large
					tonal
					onClick={() => {
						handleClick(false)
					}}
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
				<Page loginScreen>
					{/* <LoginScreenTitle>Framework7</LoginScreenTitle>
					<List form>
						<ListInput
							label="Username"
							type="text"
							placeholder="Your username"
							value={username}
							onInput={(e) => {
								setUsername(e.target.value)
							}}
						/>
						<ListInput
							label="Password"
							type="password"
							placeholder="Your password"
							value={password}
							onInput={(e) => {
								setPassword(e.target.value)
							}}
						/>
					</List>
					<List inset>
						<ListButton onClick={signIn}>Sign In</ListButton>
						<BlockFooter>
							Some text about login information.
							<br />
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						</BlockFooter>
					</List> */}
					{login ? <Login /> : <Register />}
				</Page>
			</LoginScreen>
		</Page>
	)
}
