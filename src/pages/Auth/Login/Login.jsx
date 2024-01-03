import React, { useState } from 'react'
import { f7, ListInput, List, LoginScreenTitle, BlockFooter, Icon, ListButton, Button } from 'framework7-react'
import { $t } from '@/i18n'
import { useUserStore } from '@/stores/user'

export default function Login() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const userStore = useUserStore()

	const signIn = () => {
		if (username === '' || password === '') {
			f7.dialog.alert('内容不能为空')
			return
		}

		// TODO: 登录对接接口
		userStore.updateLogin(true)

		f7.dialog.preloader()
		setTimeout(() => {
			f7.dialog.close()
			window.location.href = '/'
		}, 1000)
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
				<ListButton
					onClick={signIn}
					large
					fill
					text={$t('登录')}
					className="mx-[16px] rounded bg-primary"
					color="white"
				></ListButton>
				{/* <BlockFooter>
					Some text about login information.
					<br />
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				</BlockFooter> */}
			</List>
		</>
	)
}
