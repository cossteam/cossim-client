import { Link } from 'framework7-react'
import { del } from '../script/tootip'
import useMessageStore from '@/stores/message'
import { tooltipType } from '@/shared'

const MessageSelect = () => {
	const messageStore = useMessageStore()

	// 转发
	const forward = async () => {
		await messageStore.update({ manualTipType: tooltipType.FORWARD })
	}
	// 删除
	const deleteMessage = async () => {
		await del([])
	}

	return (
		<div className="w-full flex justify-evenly items-center">
			<Link className="p-2" iconF7="arrow_up_right" onClick={forward} />
			<Link className="p-2" iconF7="trash" onClick={deleteMessage} />
		</div>
	)
}

export default MessageSelect
