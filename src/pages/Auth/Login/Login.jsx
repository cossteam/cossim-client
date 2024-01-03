import React, { useState } from 'react'
import {
	Navbar,
	Page,
	LoginScreen,
	ListInput,
	List,
	ListItem,
	Block,
	Button,
	LoginScreenTitle,
	BlockFooter,
	ListButton,
	f7,
	Icon,
	Link
} from 'framework7-react'
import { $t } from '@/i18n'

export default function Login() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const signIn = () => {
		// f7.dialog.alert(`Username: ${username}<br>Password: ${password}`, () => {
		// 	f7.loginScreen.close()
		// })
		// TODO: 登录

	}

	return (
		<>
			<LoginScreenTitle>{$t('登录')}</LoginScreenTitle>
			<List form>
				<ListInput
					label={$t('手机号')}
					type="text"
					placeholder={$t('请输入手机号')}
					outline
					className="mb-3"
					value={username}
					onInput={(e) => {
						setUsername(e.target.value)
					}}
				>
					<Icon icon="airplane" slot="media" />
				</ListInput>
				<ListInput
					label={$t('密码')}
					type="password"
					placeholder={$t('请输入密码')}
					outline
					value={password}
					onInput={(e) => {
						setPassword(e.target.value)
					}}
				>
					<Icon icon="device_phone_portrait" slot="media" />
				</ListInput>
				{/* <p className='mx-[16px]'>
					<Link href="/test/">{$t('验证码登录')}</Link>
				</p> */}
			</List>
			<List inset>
				<Button onClick={signIn} large fill text={$t('登录')} className="mx-[16px] rounded"></Button>
				<BlockFooter>
					Some text about login information.
					<br />
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				</BlockFooter>
			</List>
		</>
	)
}
