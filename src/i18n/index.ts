import { LANG } from '@/utils/constants'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { LANGUAGE_TYPE } from '@/utils/enum'

export const langs = [
    { code: LANGUAGE_TYPE.ZH, name: '中文' },
    { code: LANGUAGE_TYPE.EN, name: 'English' },
    { code: LANGUAGE_TYPE.TC, name: '繁體中文' }
]

export const languages = langs.map((lang) => lang.code)
export const defaultLanguage = 'zh'

export const languageInit = async () => {
    i18next.use(LanguageDetector).init({
        detection: {
            lookupLocalStorage: LANG
        },
        // resources: locales,
        fallbackLng: defaultLanguage,
        // debug: false,
        interpolation: {
            escapeValue: false
        }
    })
    for (const key of languages) {
        const translationModule = await import(`./locales/${key}.json`)
        i18next.addResourceBundle(key, 'translation', translationModule.default, true, true)
    }
}

export const $t = i18next.t
