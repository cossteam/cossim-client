import { FormBackground } from '@/components/common/form-background'
import { Button } from '@/ui/button'
import { FieldInput } from '@/ui/field-input'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCallback, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn, createFingerprint } from '@/lib/utils'
import { loginApi } from '@/http/user'
import { useAuthStore } from '@/stores/auth'
import { useNavigate } from 'react-router-dom'

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
        resolver: zodResolver(Validator),
        defaultValues: {
            email: '123@123.com',
            password: '123456'
        }
    })

    const variant = useCallback(
        (key: keyof TValidator) => {
            return errors[key] && errors[key]?.message ? 'error' : 'default'
        },
        [errors]
    )

    const update = useAuthStore((state) => state.update)
    const navigate = useNavigate()

    const [loading, setLoading] = useState<boolean>(false)
    const onSubmit = async (values: TValidator) => {
        console.log('login', values)
        setLoading(true)
        // 假登录
        update({ token: 'token123' })
        navigate('/')
        return
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
                return
            }
            console.log('data', data)

            // userStore.update({
            //     driverId,
            //     userId: data?.user_info?.user_id,
            //     token: data?.token,
            //     userInfo: data?.user_info
            // })
            // localSet(TOKEN, data?.token)
            // router.replace('/')
        } catch {
            console.log('登录失败')

            // showToast($t('登录失败, 请稍后再试'), { type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
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
