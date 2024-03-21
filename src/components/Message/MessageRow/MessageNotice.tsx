interface MessageNoticeProps {
	item: { [key: string]: any }
}

const MessageNotice: React.FC<MessageNoticeProps> = (props) => {
	return (
		<div className="message-tip">
			<span className="message-tip__text">{props.item?.content}</span>
		</div>
	)
}

export default MessageNotice
