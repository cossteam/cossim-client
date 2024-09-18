import { FormBackground } from '@/components/common/form-background'
import { Button } from '@/ui/button'
import { FieldInput } from '@/ui/field-input'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCallback, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { registerApi } from '@/http/user'

const Validator = z.object({
    nickname: z.string(),
    email: z
        .string()
        .min(1, {
            message: '请输入邮箱'
        })
        .email({
            message: '邮箱格式不正确'
        }),
    password: z
        .string()
        .min(1, {
            message: '请输入密码'
        })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
            message: '密码必须至少8个字符，包含字母和数字'
        }),
    confirm_password: z.string().min(1, {
        message: '请输入确认密码'
    })
})

export type TValidator = z.infer<typeof Validator>

const SignUpPage = () => {
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

    const [loading, setLoading] = useState<boolean>(false)
    const onSubmit = async (values: TValidator) => {
        setLoading(true)
        try {
            const { code, data, msg } = await registerApi({
                ...values
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
        <FormBackground type="sign-up">
            <form className="mt-8 grid grid-cols-6 gap-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="col-span-6">
                    <FieldInput
                        {...register('nickname')}
                        type="text"
                        placeholder="昵称"
                        variant={variant('nickname')}
                        message={errors.nickname?.message}
                    />
                </div>
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
                    <FieldInput
                        {...register('confirm_password')}
                        type="password"
                        placeholder="确认密码"
                        variant={variant('confirm_password')}
                        message={errors.confirm_password?.message}
                    />
                </div>
                <div className="col-span-6">
                    <Button
                        className="w-full"
                        type={loading ? 'button' : 'submit'}
                        variant={loading ? 'disabled' : 'default'}
                    >
                        <LoaderCircle className={cn('mr-2 animate-spin', { hidden: !loading })} size={16} />
                        注册
                    </Button>
                </div>
            </form>
        </FormBackground>
    )
}

export default SignUpPage
