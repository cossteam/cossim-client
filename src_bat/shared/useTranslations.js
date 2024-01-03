import { useTranslation } from 'react-i18next'

// export default function useTranslations() {
// 	const { t: $t } = useTranslation()

// 	return $t
// }

export function $t(ch) {
	const { t } = useTranslation()
	return t(ch)
}
