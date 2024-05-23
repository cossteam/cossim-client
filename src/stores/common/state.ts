import { CommonOptions } from '@/types/store'
import { THEME } from '@/utils/enum'

export const initialState: CommonOptions = {
	theme: THEME.LIGHT,
	themeColor: '#00b96b'
}
