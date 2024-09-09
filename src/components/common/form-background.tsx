import { cn } from '@/lib/utils'
import style from '@/styles/module/form-background.module.css'
import { buttonVariants } from '@/ui/button'
import { Link } from 'react-router-dom'

export interface FormBackgroundProps {
    children: React.ReactNode
    type?: 'sign-in' | 'sign-up'
}

export const FormBackground: React.FC<FormBackgroundProps> = ({ children, type = 'sign-in' }) => {
    return (
        <section className={cn('relative overflow-hidden w-full min-h-screen', style['form-background'])}>
            <div className={cn('-top-[300px] size-[600px] bg-[#ff359b]', style['form-color'])} />
            <div className={cn('-bottom-[350px] left-[100px] size-[500px] bg-[#fffd87]', style['form-color'])} />
            <div className={cn('bottom-[50px] right-[100px] size-[500px] bg-[#00d2ff]', style['form-color'])} />

            <div className="relative max-w-sm mx-auto">
                {/* 背景圆 */}
                <div
                    className={cn('top-[60px] -right-[60px] size-[100px]', style['form-circle'])}
                    style={{ '--x': 0 }}
                />
                <div
                    className={cn('top-[150px] -left-[100px] size-[120px]', style['form-circle'])}
                    style={{ '--x': 1 }}
                />
                <div
                    className={cn('bottom-[80px] left-[100px] size-[80px]', style['form-circle'])}
                    style={{ '--x': 2 }}
                />
                <div
                    className={cn('bottom-[300px] -right-[100px] size-[60px]', style['form-circle'])}
                    style={{ '--x': 3 }}
                />
                <div
                    className={cn('bottom-[200px] -left-[140px] size-[80px]', style['form-circle'])}
                    style={{ '--x': 4 }}
                />

                {/*  登录框  */}
                <div className="container flex justify-center items-center min-h-screen relative z-10">
                    <div className="py-8 lg:py-12">
                        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                            欢迎来到 COSS 😍
                        </h1>

                        <p className="mt-4 leading-relaxed text-gray-500">
                            COSS 旨在满足现代用户对高效、安全和便捷的在线通讯需求。
                        </p>
                        {children}
                        <div className="mt-5 text-sm text-gray-500">
                            {type === 'sign-in' ? (
                                <div className="flex justify-between">
                                    <p>
                                        没有账号？
                                        <Link
                                            className={buttonVariants({
                                                variant: 'link',
                                                size: 'link'
                                            })}
                                            to="/sign-up"
                                        >
                                            注册
                                        </Link>
                                    </p>
                                    <p>找回密码</p>
                                </div>
                            ) : (
                                <div>
                                    已有账号？
                                    <Link
                                        className={buttonVariants({
                                            variant: 'link',
                                            size: 'link'
                                        })}
                                        to="/sign-in"
                                    >
                                        登录
                                    </Link>{' '}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
