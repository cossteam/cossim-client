import { CSSProperties } from 'react'

export type VideoStyle = CSSProperties & {
	autoplay?: boolean
	loop?: boolean
	muted?: boolean
}
