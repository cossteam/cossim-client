import { Icon } from 'framework7-react'

const OperateButton: React.FC<any> = (props: {
	f7Icon: string
	text?: string
	size?: string
	color?: string
	backgroundColor?: string
	onClick?: () => void
}) => {
	return (
		<div className="flex flex-col justify-center items-center">
			<div
				className="p-4 rounded-full"
				style={{
					color: props.color ?? '#FFFFFF',
					backgroundColor: props.backgroundColor ?? '#F9BAA7'
				}}
				onClick={props.onClick}
			>
				<Icon f7={props.f7Icon} size={props.size ?? 30} />
			</div>
			{props.text && <span className="mt-2">{props.text}</span>}
		</div>
	)
}

export default OperateButton
