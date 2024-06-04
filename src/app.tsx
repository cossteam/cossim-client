import { ConfigProvider } from 'antd'
import { Suspense, memo, useEffect, useMemo, useState } from 'react'
import useCommonStore from '@/stores/common'
import Loading from '@/components/loading'
import { App as AppComponent } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { locale as dayjsLocale } from 'dayjs'
import { Locale } from 'antd/es/locale'
import Call from '@/components/call'
import BeforeRouter from './permission'
import useUserStore from '@/stores/user'
import Cache from './cache'
import { createStorage } from '@/storage'

const App = () => {
    const commonStore = useCommonStore()
    const userStore = useUserStore()

    const [locale, setLocal] = useState<Locale>(enUS)

    const isLogin = useMemo(() => !!userStore.token, [userStore.token])

    useEffect(() => {
        if (localStorage.getItem('locale') !== 'zh-CN') {
            setLocal(zhCN)
            dayjsLocale('zh-cn')
        } else {
            setLocal(enUS)
            dayjsLocale('en')
        }
    }, [])

    useEffect(() => {
        // console.log('isLogin', storage)
        if (isLogin && !storage) createStorage()
    }, [isLogin])

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: commonStore.themeColor,
                    borderRadius: 4,
                    fontSize: 16
                }
            }}
            locale={locale}
        >
            <AppComponent>
                <Suspense fallback={<Loading />}>
                    <BeforeRouter isLogin={isLogin} />
                </Suspense>
                <Call />
                {isLogin && storage && <Cache />}
            </AppComponent>
        </ConfigProvider>
    )
}

export default memo(App)
