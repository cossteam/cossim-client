interface MessageErrorProps {
	item: { [key: string]: any }
}

const MessageError: React.FC<MessageErrorProps> = (props) => {
	return (
		<div className="message-tip">
			<span className="message-tip__text !text-red-500">{props.item?.content}</span>
		</div>
	)
}

export default MessageError
