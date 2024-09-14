import { FormBackground } from '@/components/form-background'
import { Button } from '@/ui/button'
import { FieldInput } from '@/ui/field-input'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCallback, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn, createFingerprint } from '@/lib/utils'
import { getUserInfoApi, loginApi } from '@/api/user'
import { useAuthStore } from '@/stores/auth'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/stores/user'
import { $t } from '@/i18n'
import Login from '@/components/login.tsx'
import { message } from 'antd'

const Validator = z.object({
    email: z
        .string()
        .min(1, {
            message: '请输入邮箱'
        })
        .email({
            message: '邮箱格式不正确'
        }),
    password: z.string().min(1, {
        message: '请输入密码'
    })
})

export type TValidator = z.infer<typeof Validator>

function SignInPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TValidator>({
        resolver: zodResolver(Validator)
    })

    const variant = useCallback(
        (key: keyof TValidator) => {
            return errors[key] && errors[key]?.message ? 'error' : 'default'
        },
        [errors]
    )

    const update = useAuthStore((state) => state.update)
    const navigate = useNavigate()

        // const userStore = useUserStore()


    const [loading, setLoading] = useState<boolean>(false)
    const onSubmit = async (values: TValidator) => {
        console.log('login', values)
        setLoading(true)
        // 假登录
        // update({ token: 'token123' })
        // navigate('/')
        // return
        try {
            const driverId = createFingerprint()
            const { code, data, msg } = await loginApi({
                driver_id: driverId,
                driver_token: 'ff1005',
                email: values.email,
                password: values.password,
                platform: 'android'
            })
            if (code !== 200) {
                // showToast(msg, { type: 'error' })
                message.error('登录失败: ' + msg);
                return
            }
            console.log('data', data)

            update({
                driverId,
                userId: data?.user_info?.user_id,
                token: data?.token,
                userInfo: data?.user_info
            })

            // 异步获取用户信息
            Promise.resolve().then(async () => {
                try {
                    const userInfoResponse = await getUserInfoApi({ id: data?.user_info?.user_id });
                    console.log('userInfoResponse', userInfoResponse)
                    const mergedUserInfo = { ...data?.user_info, ...userInfoResponse.data };
                update({ userInfo: mergedUserInfo });
                } catch (error) {
                    console.error('获取用户信息失败:', error);
                }
            });

            navigate('/dashboard')
        } catch(e) {
            console.error('登录失败', e)
            message.error('登录失败, 请稍后再试');
            // showToast($t('登录失败, 请稍后再试'), { type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        // <Login></Login>
        <FormBackground>
            <form className="mt-8 grid grid-cols-6 gap-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="col-span-6">
                    <FieldInput
                        {...register('email')}
                        type="text"
                        placeholder="邮箱"
                        variant={variant('email')}
                        message={errors.email?.message}
                    />
                </div>
                <div className="col-span-6">
                    <FieldInput
                        {...register('password')}
                        type="password"
                        placeholder="密码"
                        variant={variant('password')}
                        message={errors.password?.message}
                    />
                </div>
                <div className="col-span-6">
                    <Button
                        className="w-full"
                        type={loading ? 'button' : 'submit'}
                        variant={loading ? 'disabled' : 'default'}
                    >
                        <LoaderCircle className={cn('mr-2 animate-spin', { hidden: !loading })} size={16} />
                        登录
                    </Button>
                </div>
            </form>
        </FormBackground>
    )
}

export default SignInPage
