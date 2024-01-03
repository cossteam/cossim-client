import React, { useState, useRef } from 'react'
import { f7, ListInput, List, LoginScreenTitle, BlockFooter, Icon, ListButton, Page } from 'framework7-react'
import { $t } from '@/i18n'
import { useUserStore } from '@/stores/user'

export default function Register() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')


	// const userStore = useUserStore()

	const signIn = () => {
		if (!username || !password || !password2) {
			f7.dialog.alert('内容不能为空')
			return
		}

		if (password !== password2) {
			// toastCenter.current = f7.toast.create({
			// 	text: $t('两次密码输入不一致'),
			// 	position: 'center',
			// 	closeTimeout: 2000
			// })
			// console.log(f7.dialog.alert);
			f7.dialog.alert('两次密码不一致')
			return
		}

		f7.dialog.preloader()
		setTimeout(() => {
			f7.dialog.close()
			window.location.href = '/'
		}, 1000)
	}

	return (
		<>
			<LoginScreenTitle>{$t('注册')}</LoginScreenTitle>
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
					<Icon icon="airplane" />
				</ListInput>
				<ListInput
					label={$t('密码')}
					type="password"
					placeholder={$t('请输入密码')}
					outline
					className="mb-3"
					value={password}
					onInput={(e) => {
						setPassword(e.target.value)
					}}
				>
					<Icon icon="device_phone_portrait" slot="media" />
				</ListInput>
				<ListInput
					label={$t('确认密码')}
					type="password"
					placeholder={$t('请确认密码')}
					outline
					className="mb-3"
					value={password2}
					onInput={(e) => {
						setPassword2(e.target.value)
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
					text={$t('注册')}
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
