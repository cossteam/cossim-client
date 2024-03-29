interface EmptyProps {
	className?: string
	tips?: string
}

const Empty: React.FC<EmptyProps> = ({ tips = '暂无数据', ...props }) => {
	return (
		<div className="h-full text-gray-400 flex justify-center items-center" {...props}>
			{tips}
		</div>
	)
}

export default Empty
