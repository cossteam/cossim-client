import { $t, TOOLTIP_TYPE } from '@/shared'
import { useChatStore } from '@/stores/chat'
import { useTooltipsStore } from '@/stores/tooltips'
import { Ellipsis } from 'framework7-icons/react'
import { Link, NavRight, Navbar } from 'framework7-react'
import { useMemo } from 'react'

const MessageHeader = () => {
	const chatStore = useChatStore()
	const tooltipStore = useTooltipsStore()

	// 是否是系统通知
	const is_system = useMemo(
		() => chatStore.receiver_info.receiver_id === '10001',
		[chatStore.receiver_info.receiver_id]
	)

	return (
		<div className="min-h-12 bg-bgPrimary">
			<Navbar
				title="1111"
				subtitle="[在线]"
				backLink
				outline={false}
				className="coss_message_navbar"
				onClickBack={() => chatStore.updateOpened(false)}
			>
				<NavRight>
					{tooltipStore.type === TOOLTIP_TYPE.SELECT ? (
						<Link
							onClick={() => {
								tooltipStore.updateType(TOOLTIP_TYPE.NONE)
								tooltipStore.updateShowSelect(false)
							}}
						>
							{$t('取消')}
						</Link>
					) : (
						!is_system && (
							<Link
								href={
									chatStore.receiver_info.is_group
										? `/group_info/${chatStore.receiver_info.receiver_id}/`
										: `/profile/${chatStore.receiver_info.receiver_id}/?from_page=message&dialog_id=${chatStore.receiver_info.dialog_id}`
								}
								onClick={() => chatStore.updateBeforeJump(true)}
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
