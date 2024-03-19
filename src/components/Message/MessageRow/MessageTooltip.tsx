import { $t, TOOLTIP_TYPE } from '@/shared'
// import { useClickOutside } from '@reactuses/core'
import clsx from 'clsx'
import {
	ArrowUpRight,
	ArrowUturnLeft,
	BubbleLeftBubbleRight,
	Flag,
	SquareOnSquare,
	SquarePencil,
	TextAlignleft,
	Trash
} from 'framework7-icons/react'
import { Link } from 'framework7-react'
// import { useEffect, useState } from 'react'

interface MessageTooltipProps {
	parentEl: React.RefObject<HTMLDivElement>
	item: any
}

const MessageTooltip: React.FC<MessageTooltipProps> = (props) => {
	const tips = [
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
		},
		{
			name: TOOLTIP_TYPE.RECALL,
			title: $t('撤回'),
			icon: <ArrowUturnLeft className="tooltip__icon" />
		}
	]

	// const [visible, setVisible] = useState(false)

	const handlerClick = (item:any) => {
		console.log('111', item, props)
		// setVisible(true)
	}

	// useEffect(() => {
	// 	if (!visible) return
	// 	// @ts-ignore
	// 	props.parentEl.current?._tippy?.hide()
	// }, [visible])

	return (
		<div className="h-auto py-5 px-2 w-[250px] rounded relative z=100">
			<div className="flex flex-wrap">
				{tips.map((item, index) => (
					<Link
						onClick={() => handlerClick(item)}
						aria-expanded="true"
						key={item.name}
						className={clsx('w-1/5 py-3', index > 4 ? 'pb-0' : 'pt-0')}
					>
						<div className="flex flex-col items-center justify-center">
							<div className="mb-[6px]">{item?.icon}</div>
							<span className="text-[0.75rem] text-center whitespace-nowrap">{item?.title}</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}

export default MessageTooltip
