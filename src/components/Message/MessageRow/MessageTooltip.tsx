import { $t, TOOLTIP_TYPE, msgType } from '@/shared'
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
import useMessageStore from '@/stores/new_message'
import { useMemo } from 'react'

interface MessageTooltipProps {
	item: any
}

const tips = [
	{
		name: TOOLTIP_TYPE.COPY,
		title: $t('复制'),
		icon: <SquareOnSquare className="text-lg" />
	},
	{
		name: TOOLTIP_TYPE.FORWARD,
		title: $t('转发'),
		icon: <ArrowUpRight className="text-lg" />
	},
	{
		name: TOOLTIP_TYPE.EDIT,
		title: $t('编辑'),
		icon: <SquarePencil className="text-lg" />
	},
	{
		name: TOOLTIP_TYPE.DELETE,
		title: $t('删除'),
		icon: <Trash className="text-lg" />
	},
	{
		name: TOOLTIP_TYPE.SELECT,
		title: $t('多选'),
		icon: <TextAlignleft className="text-lg" />
	},
	{
		name: TOOLTIP_TYPE.REPLY,
		title: $t('回复'),
		icon: <BubbleLeftBubbleRight className="text-lg" />
	},
	{
		name: TOOLTIP_TYPE.MARK,
		title: $t('标注'),
		icon: <Flag className="text-lg" />
	},
	{
		name: TOOLTIP_TYPE.RECALL,
		title: $t('撤回'),
		icon: <ArrowUturnLeft className="text-lg" />
	}
]

const MessageTooltip: React.FC<MessageTooltipProps> = ({ item }) => {
	const messageStore = useMessageStore()

	const tooltips = useMemo(() => {
		// 当前消息是通话
		if (item?.type === msgType.CALL) {
			return tips.filter((tip) => tip.name === TOOLTIP_TYPE.DELETE)
		}

	
		// 如果当前消息已经超过撤回时间
		// if (isOverRecallTime(item?.created_at)) {
		// 	return tips.filter((tip) => tip.name !== TOOLTIP_TYPE.RECALL)
		// }

		return tips
	}, [item])

	const handlerClick = (data: any) => {
		messageStore.update({ tipType: data.name, selectedMessage: item })
	}

	return (
		<div className="h-auto py-5 px-2 w-[250px] rounded relative z=100">
			<div className="flex flex-wrap">
				{tooltips.map((item, index) => (
					<Link
						onClick={() => handlerClick(item)}
						aria-expanded="true"
						key={item.name}
						className={clsx('w-1/5 py-3 text-[1rem]', index > 4 ? 'pb-0' : 'pt-0')}
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
