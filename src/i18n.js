import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

export const languages = ['zh-CN', 'ja', 'en', 'zh-TW']
export const defaultLanguage = 'zh-CN'

export const langs = languages.map((lang, index) => ({
	name: ['简体中文', '日本語', 'English', '繁體中文'][index],
	code: lang
}))

// 所有语言
const locales = Object.assign(
	{},
	// ...(await Promise.all(
	// 	languages.map(async (key) => {
	// 		const translationModule = await import(`./locales/${key}.json`)
	// 		return {
	// 			[key]: {
	// 				translation: translationModule.default
	// 			}
	// 		}
	// 	})
	// ))
	{
		'zh-CN': {
			translation: {
				hello: '你好',
				'hello-world': '你好, 世界',
				'hello-name': '你好, {{name}}',
				'hello-name-world': '你好, {{name}}, 世界'
			}
		}
	}
)
// console.log('locales', locales)

export default i18n.use(initReactI18next).init({
	resources: locales,
	fallbackLng: defaultLanguage,
	interpolation: {
		// React 已经可以避免 xss => https://www.i18next.com/translation-function/interpolation#unescape
		escapeValue: false
	}
})

/**
 * 简易翻译函数, 后续翻译插件匹配 $t
 * @param {string} ch 翻译的 key
 * @returns {string}
 */
// export function $t(ch) {
// 	// const { t } = useTranslation()
// 	return t(ch)
// }

export function $t(ch) {
	return ch
}
