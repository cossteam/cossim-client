import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useConfigStore } from '@/stores/config'

import { Language } from '@/lib/enum'

import translationCN from './locales/zh-cn/translation.json'
import translationEN from './locales/en/translation.json'

i18next.use(initReactI18next).init(
    {
        lng: useConfigStore.getState().language || Language.ZH_CN,
        debug: false,
        resources: {
            en: {
                translation: translationEN
            },
            zhCN: {
                translation: translationCN
            }
        }
    },
    (err) => {
        if (err) {
            console.error('i18n init error:', err)
        }
    }
)

export const t = (key: string) => i18next.t(key)

export default i18next
