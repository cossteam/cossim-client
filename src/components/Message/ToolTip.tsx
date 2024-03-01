import { useClickOutside } from '@reactuses/core'
import clsx from 'clsx'
import { Link } from 'framework7-react'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { $t, TOOLTIP_TYPE } from '@/shared'
import {
	ArrowUpRight,
	SquareOnSquare,
	Trash,
	Flag,
	SquarePencil,
	BubbleLeftBubbleRight,
	TextAlignleft
} from 'framework7-icons/react'
import { createRoot } from 'react-dom/client'
import { useMessageStore } from '@/stores/message'

interface ToolTipProps {
	el: HTMLElement
	onSelect: (type: TOOLTIP_TYPE, msg_id: number) => void
	is_group?: boolean
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

	const selectChange = useCallback((type: TOOLTIP_TYPE, msg_id: number) => onSelect(type, msg_id), [onSelect])

	useClickOutside(tooltipRef, () => {
		currentRef.current!.style.zIndex = '1'
		setVisible(false)
	})

	const divRef = useRef<HTMLDivElement | null>(null)
	useClickOutside(divRef, () => {
		divRef.current?.remove()
	})

	const [show, setShow] = useState<boolean>(true)

	const [tips, setTips] = useState<any[]>([
		{
			name: TOOLTIP_TYPE.COPY,
			title: $t('复制'),
			icon: <SquareOnSquare className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.FORWARD,
			title: $t('转发'),
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.EDIT,
			title: $t('编辑'),
			icon: <SquarePencil className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.DELETE,
			title: $t('删除'),
			icon: <Trash className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.SELECT,
			title: $t('多选'),
			icon: <TextAlignleft className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.REPLY,
			title: $t('回复'),
			icon: <BubbleLeftBubbleRight className="tooltip__icon" />
		},
		{
			name: TOOLTIP_TYPE.MARK,
			title: $t('标注'),
			icon: <Flag className="tooltip__icon" />
		}
	])

	// 边界控制
	useEffect(() => {
		if (!el) return

		const lis = document.querySelectorAll('li.coss_list_item')
		const { id = 0, index = 0, label = 0 } = el.dataset
		setMsgId(Number(id))

		const tip = tips.find((v) => v.name === TOOLTIP_TYPE.MARK)
		tip.title = $t(Number(label) === 0 ? $t('标注') : $t('取消标注'))
		setTips(tips)

		const currentEl = lis[Number(index)] as HTMLLIElement
		currentRef.current = currentEl

		currentEl.style.zIndex = '2'

		const tooltipEl = tooltipRef.current!
		const elRect = el.getBoundingClientRect()

		// 如果消息已经超出屏幕范围，不显示
		if (
			elRect.top < tooltipEl.offsetHeight + 156 &&
			elRect.height + tooltipEl.offsetHeight > document.documentElement.clientHeight
		) {
			setShow(false)
			divRef.current = document.createElement('div')
			divRef.current.style.position = 'fixed'
			divRef.current.style.zIndex = '9999999'
			divRef.current.style.height = 'auto'
			divRef.current.style.top = '40%'
			divRef.current.style.minHeight = '100px'
			divRef.current.style.width = '400px'
			createRoot(divRef.current).render(
				<ToolTipView
					tooltipRef={tooltipRef}
					triangleRef={triangleRef}
					tips={tips}
					onSelect={selectChange}
					setVisible={() => divRef.current?.remove()}
					msgId={Number(id)}
					top={top}
					className="text-[1rem]"
				/>
			)
			document.body.appendChild(divRef.current)
			return
		}
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

	useEffect(() => {
		!visible && (currentRef.current!.style.zIndex = '1')
	}, [visible])

	if (!visible || !show) return null

	return (
		<ToolTipView
			tooltipRef={tooltipRef}
			triangleRef={triangleRef}
			tips={tips}
			onSelect={onSelect}
			setVisible={setVisible}
			msgId={msgId}
			top={top}
			className="absolute"
		/>
	)
}

interface ToolTipViewProps {
	tooltipRef: RefObject<HTMLDivElement>
	triangleRef: RefObject<HTMLDivElement>
	tips: any[]
	onSelect: (type: TOOLTIP_TYPE, msg_id: number) => void
	setVisible: (visible: boolean) => void
	msgId: number
	className?: string
	top: boolean
}

const ToolTipView: React.FC<ToolTipViewProps> = ({
	tooltipRef,
	triangleRef,
	tips,
	onSelect,
	setVisible,
	msgId,
	className,
	top
}) => {
	const { updateTrgger } = useMessageStore()

	const handlerClick = (item: any) => {
		onSelect(item.name, msgId)
		setVisible(false)
		updateTrgger(true)
	}

	return (
		<div
			className={clsx(
				'w-[260px] bg-black text-white rounded z-[9999] m-auto left-0 right-0 animate__animated  animate__faster animate__fadeIn',
				top ? 'top-[calc(100%+10px)] bottom-auto ' : 'bottom-[calc(100%+10px)] top-auto',
				className
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
			<div className="h-auto py-5 px-2">
				<div className="flex flex-wrap">
					{tips.map((item, index) => (
						<div key={item.name} className={clsx('w-1/5 py-3', index > 4 ? 'pb-0' : 'pt-0')}>
							<Link onClick={() => handlerClick(item)} className="w-full">
								<div className="flex flex-col items-center justify-center">
									<div className="mb-[6px]">{item.icon}</div>
									<span className="text-[0.75rem] text-center whitespace-nowrap">{item.title}</span>
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
