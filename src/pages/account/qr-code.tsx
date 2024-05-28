// import useUserStore from '@/stores/user'
import { $t } from '@/i18n'
import { Button, Flex, Form, QRCode } from 'antd'
import clsx from 'clsx'
import { NavigateOptions, useNavigate } from 'react-router'
// import QRCodeImg from '@/assets/qrcode.png'
import { useEffect, useState } from 'react'

const QRCodePage: React.FC = () => {
	// const userStore = useUserStore()
	const navigate = useNavigate()

	const [isExpire, setIsExpire] = useState(false)

	const toLogin = (options?: NavigateOptions | undefined) => {
		navigate('/account/login', options)
	}

	const toRegister = (options?: NavigateOptions | undefined) => {
		navigate('/account/register', options)
	}

	const reLoadQRCode = () => {
		window.location.reload()
		setIsExpire(false)
	}

	useEffect(() => {
		setTimeout(
			() => {
				setIsExpire(true)
			},
			// 1000 * 60 * 5
			3000
		)
	}, [])

	return (
		<>
			<Flex className="w-screen h-screen" vertical justify="center" align="center" gap="large">
				<div className="relative rounded-sm overflow-hidden">
					{/* <Image width={250} height={250} preview={false} src={QRCodeImg} />
					{isExpire && (
						<div
							className="w-full h-full bg-black opacity-90 flex justify-center items-center absolute top-0 right-0 text-white cursor-pointer"
							onClick={() => reLoadQRCode()}
						>
							{$t('点击刷新')}
						</div>
					)} */}
					<QRCode
						type="svg"
						value="https://www.coss.im/"
						status={isExpire ? 'expired' : 'active'}
						onRefresh={() => reLoadQRCode()}
					/>
				</div>
				<div className="text-center text-primary">{$t('请使用客户端APP扫码登录')}</div>
				<Form
					className={clsx('w-2/3 w750:min-w-[350px] w750:w-1/6')}
					layout="vertical"
					initialValues={{ email: '1005@qq.com', password: '123456qq' }}
				>
					<Form.Item>
						<Button
							size="large"
							type="primary"
							className="w-full"
							htmlType="submit"
							onClick={() => toLogin({ replace: true })}
						>
							{$t('邮箱登陆')}
						</Button>
					</Form.Item>
					<Form.Item>
						<Button
							type="text"
							className="w-full text-primary"
							onClick={() => toRegister({ replace: true })}
						>
							{$t('注册')}
						</Button>
					</Form.Item>
					{/* <Form.Item>
						<Flex justify="space-between">
							<span className="text-primary" onClick={() => toLogin({ replace: true })}>
								{$t('邮箱登陆')}
							</span>
							<span className="text-primary" onClick={() => toRegister({ replace: true })}>
								{$t('注册')}
							</span>
						</Flex>
					</Form.Item> */}
				</Form>
			</Flex>
		</>
	)
}

export default QRCodePage
