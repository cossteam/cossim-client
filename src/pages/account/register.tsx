import React, { useState } from 'react'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Avatar, Flex } from 'antd'
import { $t } from '@/i18n'
import clsx from 'clsx'
import { NavigateOptions, useNavigate } from 'react-router-dom'
import { registerApi } from '@/api/user'
import useUserStore from '@/stores/user'

const Register: React.FC = () => {
    const navigate = useNavigate()
    const userStore = useUserStore()
    const [loading, setLoading] = useState(false)

    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            const { code, data, msg } = await registerApi({
                nickname: values.nickname,
                email: values.email,
                password: values.password,
                confirm_password: values.confirm_password
                // public_key: values.public_key
            })
            if (code !== 200) throw new Error(msg)
            userStore.update({ userId: data?.user_id })
            // await cretaeIdentity(data.user_id, fromData.email)
            toLogin({
                replace: true,
                state: { email: values.email, password: values.password }
            })
        } catch (message: any) {
            showToast(message, { type: 'error' })
            // messageApi.open({
            //     type: 'error',
            //     content: '注册失败，请稍后重试'
            // })
        } finally {
            setLoading(false)
        }
    }

    const toQRCode = (options?: NavigateOptions | undefined) => {
        navigate('/account/qr-code', options)
    }

    const toLogin = (options?: NavigateOptions | undefined) => {
        navigate('/account/login', options)
    }

    return (
        <Flex className="w-screen h-screen" vertical justify="center" align="center" gap="large">
            <Avatar
                size={120}
                src={'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'}
            />
            <Form
                className={clsx('w-2/3 mobile:min-w-[350px] mobile:w-1/6')}
                layout="vertical"
                initialValues={{ email: '', password: '123456qq', public_key: '123' }}
                onFinish={onFinish}
            >
                <Form.Item label={$t('用户名')} name="nickname">
                    <Input prefix={<UserOutlined />} placeholder={$t('用户名')} />
                </Form.Item>
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
                    <Input prefix={<MailOutlined />} placeholder={$t('邮箱')} />
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
                <Form.Item
                    label={$t('确认密码')}
                    name="confirm_password"
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (value && value === getFieldValue('password')) {
                                    return Promise.resolve()
                                }
                                return Promise.reject($t('两次密码不一致'))
                            }
                        })
                    ]}
                >
                    <Input prefix={<LockOutlined />} type="password" placeholder={$t('确认密码')} />
                </Form.Item>
                <Form.Item>
                    <Button size="large" type="primary" htmlType="submit" className="w-full" loading={loading}>
                        {$t('注册')}
                    </Button>
                </Form.Item>
                {/* <Form.Item>
					<Button type="text" className="w-full text-primary" onClick={() => toLogin({ replace: true })}>
						{$t('登陆')}
					</Button>
				</Form.Item> */}
                <Form.Item>
                    <Flex justify="space-between">
                        <span className="text-primary" onClick={() => toQRCode({ replace: true })}>
                            {$t('扫码登陆')}
                        </span>
                        <span className="text-primary" onClick={() => toLogin({ replace: true })}>
                            {$t('邮箱登陆')}
                        </span>
                    </Flex>
                </Form.Item>
            </Form>
        </Flex>
    )
}

export default Register
