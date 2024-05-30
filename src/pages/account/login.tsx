import React, { memo } from 'react'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Form, Input, Avatar, Flex, Checkbox } from 'antd'
import { $t } from '@/i18n'
import clsx from 'clsx'
import { NavigateOptions, useNavigate } from 'react-router'
import useUserStore from '@/stores/user'
import { createFingerprint } from '@/utils/fingerprint'

const Login: React.FC = memo(() => {
	const userStore = useUserStore()
	const navigate = useNavigate()

	const onFinish = async (values: any) => {
		console.log('Received values of form: ', values)
		try {
			await userStore.login({
				driver_id: createFingerprint(),
				driver_token: 'ff1005',
				email: values.email,
				password: values.password,
				platform: 'android'
			})
			navigate('/dashboard', {
				replace: true
			})
		} catch (error) {
			console.log(error)
		}
	}

	const toQRCode = (options?: NavigateOptions | undefined) => {
		navigate('/account/qr-code', options)
	}

	const toRegister = (options?: NavigateOptions | undefined) => {
		navigate('/account/register', options)
	}

	return (
		<>
			<Flex className="w-screen h-screen" vertical justify="center" align="center" gap="large">
				<Avatar
					size={120}
					src={'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'}
				/>
				<Form
					className={clsx('w-2/3 mobile:min-w-[350px] mobile:w-1/6')}
					layout="vertical"
					initialValues={{ email: '1005@qq.com', password: '123456qq' }}
					onFinish={onFinish}
				>
					<Form.Item
						label={$t('邮箱')}
						name="email"
						rules={[
							() => ({
								validator: (_, value) => {
									if (!value) {
										return Promise.reject($t('请输入邮箱'))
									}
									if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
										return Promise.reject($t('邮箱格式不正确'))
									}
									return Promise.resolve()
								}
							})
						]}
					>
						<Input size="large" prefix={<MailOutlined />} placeholder={$t('邮箱')} />
					</Form.Item>
					<Form.Item
						label={$t('密码')}
						name="password"
						rules={[
							() => ({
								validator: (_, value) => {
									if (value.length < 6) {
										return Promise.reject($t('密码长度不能小于6'))
									}
									return Promise.resolve()
								}
							})
						]}
					>
						<Input size="large" prefix={<LockOutlined />} type="password" placeholder={$t('密码')} />
					</Form.Item>
					<Form.Item>
						<Flex justify="space-between">
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox>{$t('记住我')}</Checkbox>
							</Form.Item>

							<a className="text-primary" href="">
								{$t('忘记密码')}
							</a>
						</Flex>
					</Form.Item>
					<Form.Item>
						<Button size="large" type="primary" htmlType="submit" className="w-full">
							{$t('登陆')}
						</Button>
					</Form.Item>
					<Form.Item>
						<Flex justify="space-between">
							<span className="text-primary" onClick={() => toQRCode({ replace: true })}>
								{$t('扫码登陆')}
							</span>
							<span className="text-primary" onClick={() => toRegister({ replace: true })}>
								{$t('注册')}
							</span>
						</Flex>
					</Form.Item>
				</Form>
			</Flex>
		</>
	)
})

export default Login
