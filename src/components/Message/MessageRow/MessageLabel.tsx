

interface MessageLabelProps {
	item: { [key: string]: any }
}

const MessageLabel: React.FC<MessageLabelProps> = (props) => {
	return (
		<div className="message-tip">
			<span className="message-tip__text">{props.item?.content}</span>
		</div>
	)
}

export default MessageLabel
