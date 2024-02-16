import { useEffect, useRef } from 'react'

interface AvatarProps extends React.HtmlHTMLAttributes<HTMLElement> {
	name: string
	url: string
}

/**
 * 计算颜色的对比度
 *
 * @param bgColor
 * @returns
 */
const getContrastColor = (bgColor: string) => {
	// 将背景色转换为RGB格式
	const rgb = parseInt(bgColor.substring(1), 16)
	const r = (rgb >> 16) & 0xff
	const g = (rgb >> 8) & 0xff
	const b = (rgb >> 0) & 0xff

	// 根据颜色亮度选择文字颜色
	const brightness = (r * 299 + g * 587 + b * 114) / 1000
	return brightness > 125 ? 'black' : 'white'
}

const Avatar: React.FC<AvatarProps> = ({ name, url, ...props }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	useEffect(() => {
		if (url) return

		// 绘制 canvas 头像
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// 生成随机背景色
		const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)

		// 设置背景色
		ctx.fillStyle = randomColor
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		// 生成文字颜色
		const textColor = getContrastColor(randomColor)

		// 绘制文字
		ctx.font = '48px Arial'
		ctx.fillStyle = textColor
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText(name[0].toLocaleUpperCase(), canvas.width / 2, canvas.height / 2)
	}, [url, name])

	return url ? <img {...props} src={url} alt={name} /> : <canvas {...props} ref={canvasRef}></canvas>
}

export default Avatar
