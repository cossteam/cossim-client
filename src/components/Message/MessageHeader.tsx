import { Link, Navbar, NavRight } from 'framework7-react'
import useMessageStore from '@/stores/new_message'
import { $t, tooltipType } from '@/shared'
import { useMemo } from 'react'
import { Ellipsis } from 'framework7-icons/react'

const MessageHeader = () => {
	const messageStore = useMessageStore()

	// 是否是系统通知
	const is_system = useMemo(() => messageStore.receiverId === '10001', [messageStore.receiverId])

	return (
		<div className="min-h-12 bg-bgPrimary sticky top-0 z-50">
			<Navbar
				title={messageStore?.receiverInfo?.dialog_name}
				subtitle="[在线]"
				backLink
				outline={false}
				className="coss_message_navbar"
			>
				<NavRight>
					{messageStore.manualTipType === tooltipType.SELECT ? (
						<Link
							onClick={() =>
								messageStore.update({
									manualTipType: tooltipType.NONE,
									selectedMessages: [],
									selectedMessage: null
								})
							}
						>
							{$t('取消')}
						</Link>
					) : (
						!is_system && (
							<Link
								href={
									messageStore.isGroup
										? `/group_info/${messageStore.receiverId}/`
										: `/profile/${messageStore.receiverId}/?from_page=message&dialog_id=${messageStore.dialogId}`
								}
							>
								<Ellipsis className="w-6 h-6 mr-2" />
							</Link>
						)
					)}
				</NavRight>
			</Navbar>
		</div>
	)
}

export default MessageHeader
