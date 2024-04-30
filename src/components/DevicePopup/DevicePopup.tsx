import { $t, confirmMessage, toastMessage } from '@/shared'
import useUserStore from '@/stores/user'
import { Block, Link, NavRight, Navbar, Page, Popup, f7 } from 'framework7-react'
import { useEffect, useState } from 'react'
import CommInput from '../CommInput/CommInput'
import { decode } from 'js-base64'
import useCacheStore from '@/stores/cache'
import MsgService from '@/api/msg'
import dayjs from 'dayjs'

interface DevicePopupProps {
	opened?: boolean
}

const DevicePopup: React.FC<DevicePopupProps> = ({ opened = false }) => {
	const [popupOpened, setPopupOpened] = useState(opened)
	const [text, setText] = useState('')

	const userStore = useUserStore()
	const cacheStore = useCacheStore()

	// 如果是新设备登录
	useEffect(() => {
		if (userStore.lastLoginTime && userStore.isNewLogin && !cacheStore.cacheKeyPair) {
			setPopupOpened(true)
		}
	}, [])

	const handlerClick = () => {
		if (!text) return toastMessage('请输入密钥对')
		try {
			// const keyPair = JSON.parse(decode(text))
			const keyPair = { publicKey: text, privateKey: text }
			userStore.update({ isNewLogin: false })
			cacheStore.update({ cacheKeyPair: keyPair }, true)
			handlerBeforeClose()
		} catch (error) {
			toastMessage('密钥对格式不正确或错误')
		}
	}

	const handlerSkip = () => {
		const num = Math.floor(Math.random() * 1000000)
		confirmMessage('跳过验证后，您将无加使用加密通信功能。您确定要跳过验证吗？', '跳过验证', () => {
			f7.dialog.prompt(`请输入"${num}"确认跳过验证`, (password) => {
				if (num !== parseInt(password)) return toastMessage('验证失败，请重新输入')
				userStore.update({ isNewLogin: false })
				setPopupOpened(false)
			})
		})
	}

	const handlerBeforeClose = () => {
		confirmMessage(
			'是否同步历史消息？',
			'同步消息',
			async () => {
				// 拉取消息
				await loadMessages()
				// 同步历史消息
				cacheStore.update({ isSyncRemote: true }, true)
				setPopupOpened(false)
			},
			() => setPopupOpened(false)
		)
	}

	const loadMessages = async () => {
		loadUserMessages()
		loadGroupMessages()
	}

	const loadUserMessages = async () => {
		const userDialogs = cacheStore.cacheContacts.map((item) => item.dialog_id)
		const size = 2
		const next = async () => {
			const dialogIds = userDialogs.splice(0, size)
			try {
				const data: any[] = await Promise.allSettled(
					dialogIds.map((dialog_id) => {
						return MsgService.getUserMessageApi({
							dialog_id,
							start_at: dayjs().subtract(7, 'day').valueOf(),
							end_at: dayjs().valueOf(),
							page_num: 1,
							page_size: 1000
						})
					})
				)
				data.map((item, index) => {
					const msgs = item?.value?.data?.user_messages
					console.log(dialogIds[index], msgs)
				})
			} finally {
				if (userDialogs.length > 0) {
					next()
				}
			}
		}
		next()
	}

	const loadGroupMessages = async () => {
		// 拉取消息
		// const { data }: any = await MsgService.getGroupMessageApi({
		// 	group_id: -1,
		// 	page_num: 1,
		// 	page_size: 100
		// })
		// console.log('群聊', data)
	}

	return (
		// <Popup className="demo-popup" opened={true ?? popupOpened}>
		<Popup className="demo-popup" opened={popupOpened}>
			<Page>
				<Navbar title="新设备验证">
					<NavRight>
						<Link onClick={handlerClick}>{$t('验证')}</Link>
					</NavRight>
				</Navbar>
				<Block>
					<h2 className="mb-1">{$t('检测到新设备登录，请输入密钥对以验证身份:')}</h2>
					<CommInput
						onChange={(value) => setText(value)}
						placeholder="请输入密钥对"
						className="!px-0 !mt-0 mb-2"
					/>
					{/* <Button className="mb-5" fill large round>
						验证
					</Button> */}
					<p onClick={handlerSkip} className="mb-5 text-primary text-right">
						{$t('跳过验证')}
					</p>
					<p className="text-gray-500 mb-1">{$t('密钥对是指Coss客户端生成的密钥对，用于身份验证：')}</p>
					<ul className="text-gray-500">
						<li>1.{$t('打开手机上的Coss客户端')}</li>
						<li>2.{$t('点击“我的”')}</li>
						<li>3.{$t('点击“头像”')}</li>
						<li>4.{$t('点击“导出密钥对”')}</li>
						<li>5.{$t('复制密钥对并粘贴到此处')}</li>
					</ul>
				</Block>
			</Page>
		</Popup>
	)
}

export default DevicePopup
