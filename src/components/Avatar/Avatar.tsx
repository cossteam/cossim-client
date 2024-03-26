import React from 'react'

interface AvatarProps {
	src: string;
	size?: number;
	square?: boolean;
	color?: string;
	// 添加 style prop 接收任意 CSS 样式
	style?: React.CSSProperties;
	className?: string; // 保留 className 用于现有 CSS 类
}

const Avatar: React.FC<AvatarProps> = ({ src, size, square, color, style, className }) => {

	const combinedStyles = {
		...style, // 使用展开运算符合并行内样式
		width: size ? size : 55, // 未提供时使用默认大小
		height: size ? size : 55,
		color: color ? color : '#000'
	}

	return (
		<div className={className} style={combinedStyles}>
			<img src={src} style={{ borderRadius: square ? '8%' : '50%' }} alt="" className="w-full h-full" />
		</div>
	)
}

export default Avatar

