import { useClickOutside } from '@reactuses/core'
import clsx from 'clsx'
import { Link } from 'framework7-react'
import { useEffect, useRef, useState } from 'react'
import { TOOLTIP_TYPE } from '@/shared'
import { ArrowUpRight } from 'framework7-icons/react'

interface ToolTipProps {
	el: HTMLElement
	onSelect: (type: TOOLTIP_TYPE, msg_id: number) => void
}

const ToolTip: React.FC<ToolTipProps> = ({ el, onSelect }) => {
	const tooltipRef = useRef<HTMLDivElement | null>(null)
	const triangleRef = useRef<HTMLDivElement | null>(null)

	// 控制显示隐藏
	const [visible, setVisible] = useState<boolean>(true)
	// 是否触发上下边界
	const [top, setTop] = useState<boolean>(false)
	// msg_id
	const [msgId, setMsgId] = useState<number>(0)

	// 当前选中的元素
	const currentRef = useRef<HTMLLIElement | null>(null)

	useClickOutside(tooltipRef, () => {
		currentRef.current!.style.zIndex = '1'
		setVisible(false)
	})

	// 边界控制
	useEffect(() => {
		if (!el) return

		const lis = document.querySelectorAll('li.coss_list_item')

		const { id = 0, index = 0 } = el.dataset
		setMsgId(Number(id))

		const currentEl = lis[Number(index)] as HTMLLIElement
		currentRef.current = currentEl

		currentEl.style.zIndex = '2'

		const tooltipEl = tooltipRef.current!
		const elRect = el.getBoundingClientRect()

		// 控制上边界
		elRect.top < tooltipEl.offsetHeight + 156 ? setTop(true) : setTop(false)

		// 控制左右边界
		if (elRect.width <= 150) {
			const isLeft = elRect.left <= 100
			// 控制弹窗
			tooltipEl.style.left = isLeft ? '-40px' : 'auto'
			tooltipEl.style.right = isLeft ? 'auto' : '-40px'
			// 修改小三角的位置
			triangleRef.current!.style.left = isLeft ? elRect.width / 2 + 40 + 'px' : 'auto'
			triangleRef.current!.style.right = isLeft ? 'auto' : elRect.width / 2 + 40 + 'px'
		}
	}, [el])

	const tips = [
		{
			name: TOOLTIP_TYPE.COPY,
			title: '复制',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.FORWARD,
			title: '转发',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.EDIT,
			title: '编辑',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.DELETE,
			title: '删除',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.SELECT,
			title: '多选',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.REPLY,
			title: '回复',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.MARK,
			title: '标注',
			icon: <ArrowUpRight className="tooltip__icon" />
		}
	]

	useEffect(() => {
		!visible && (currentRef.current!.style.zIndex = '1')
	}, [visible])

	if (!visible) return null

	return (
		<div
			className={clsx(
				'absolute w-[220px] bg-black text-white rounded z-[9999] m-auto left-0 right-0 animate__animated  animate__faster animate__fadeIn',
				top ? 'top-[calc(100%+10px)] bottom-auto ' : 'bottom-[calc(100%+10px)] top-auto'
			)}
			ref={tooltipRef}
		>
			<div
				className={clsx(
					'absolute w-0 h-0 border-[5px] border-transparent m-auto left-0 right-0',
					top ? 'border-b-black bottom-full' : 'border-t-black top-full'
				)}
				ref={triangleRef}
			/>
			<div className="h-auto p-4 py-5">
				<div className="flex flex-wrap">
					{tips.map((item, index) => (
						<div key={item.name} className={clsx('w-1/4 p-2', index > 3 ? 'pb-0' : 'pt-0')}>
							<Link
								onClick={() => {
									setVisible(false)
									onSelect(item.name, msgId)
								}}
								className="w-full"
							>
								<div className="flex flex-col items-center justify-center">
									<div className="mb-[6px]">{item.icon}</div>
									<span className="text-[0.75rem]">{item.title}</span>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default ToolTip
