import { Link } from 'framework7-react'

const OperateButton: React.FC<any> = (props: {
	f7Icon: string
	text?: string
	size?: string
	color?: string
	iconColor?: string
	iconRotate?: number
	backgroundColor?: string
	onClick?: () => void
}) => {
	return (
		<div className="flex flex-col justify-center items-center">
			<div
				className="p-4 rounded-full"
				style={{
					color: props.color ?? '#000',
					backgroundColor: props.backgroundColor ?? '#fff'
				}}
				onClick={props.onClick}
			>
				{/* <Icon
					f7={props.f7Icon}
					size={props.size ?? 30}
					style={{ transform: `rotate(${props.iconRotate ?? 0}deg)` }}
				/> */}
				<Link
					iconF7={props.f7Icon}
					style={{ color: props.iconColor ?? '#000', transform: `rotate(${props.iconRotate ?? 0}deg)` }}
				/>
			</div>
			{props.text && <span className="mt-2">{props.text ?? ''}</span>}
		</div>
	)
}

export default OperateButton
