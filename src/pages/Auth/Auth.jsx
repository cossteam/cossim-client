import React, { useState, useEffect } from 'react'
import { Page, LoginScreen, Block, Button, Popover, List, ListItem } from 'framework7-react'
import { $t } from '@/i18n'
import Login from './Login/Login'
import Register from './Register/Register'
import Fingerprint2 from 'fingerprintjs2'
import LongPressWrap from '../Group/LongPressWrap'
import { Link } from 'framework7-icons/react'

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
			console.log(components);
			// 生成浏览器指纹
			fingerprint = Fingerprint2.x64hash128(values.join(''), 31)
			setFingerprint(fingerprint)
		})
	}

	useEffect(() => {
		setTimeout(() => createFingerprintGenerator(), 500)
	}, [])

	// 消息操作菜单
	const [msgEl, setMsgEL] = useState(null)
	const [msgMenuOpened, setMsgMenuOpened] = useState(false)
	const onMsgLongPress = (e, msg) => {
		console.log('longPress', e, msg)
		// console.log(e.target.offsetParent.offsetParent.offsetTop)
		// setMsgEL(e.target.offsetParent.offsetParent)
		// setMsgEL(e.srcElement)
		setMsgMenuOpened(true)
	}

	useEffect(() => {
		const handler = () => {
			setMsgMenuOpened(false)
			console.log('click')
		}
		document.body.addEventListener('click', handler)
		return () => {
			document.body.removeEventListener('click', handler)
		}
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
					<Link popoverOpen=".popover-menu">
						<LongPressWrap onLongPress={(e) => onMsgLongPress(e, '这是一个消息')}>
							{$t('登录')}
						</LongPressWrap>
					</Link>
				</Button>
				<Popover
					className="popover-menu"
					// opened={msgMenuOpened}
					// targetEl={msgEl}
					// backdrop={false}
					// arrow={false}
				>
					<span>菜单</span>
				</Popover>
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
