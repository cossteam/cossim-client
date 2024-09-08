import { SMALL_SCREEN } from './constants'

export const isSmallScreen = () => document.body.clientWidth <= SMALL_SCREEN
export const isBigScreen = () => !isSmallScreen()
