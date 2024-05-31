import { Flex } from 'antd'
import Quill from 'quill'
import { useEffect, useRef } from 'react'
import 'quill/dist/quill.core.css'
import '@/styles/quill.scss'

interface MessageInputProps {
	readOnly?: boolean
	placeholder?: string
	defaultValue?: string
	onChange?: (content: string) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({ readOnly = false, placeholder }) => {
	const messageInputRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!messageInputRef.current) return

		// const modules = {
		// mention: {
		// 	visable: true,
		// 	triggerChar: ['@'],
		// 	source: async () => {
		// 		try {
		// 			const { data } = await GroupService.groupMemberApi({ group_id: Number(props.id ?? 0) })
		// 			const members = [{ id: 0, name: '全体成员' }].concat(
		// 				data.list.map((v: any) => ({ ...v, name: v.nickname }))
		// 			)
		// 			return members
		// 		} catch (error) {
		// 			return []
		// 		}
		// 	},
		// 	onSelect: (item: any) => {
		// 		console.log('index', item)
		// 		if (item.id === 0) {
		// 			// msgStore.updateAtAllUser(true)
		// 			messageStore.update({ atAllUser: 1 })
		// 		} else {
		// 			// const atUsers = messageStore.atUsers.
		// 			messageStore.update({ atAllUser: 0, atUsers: [...messageStore.atUsers, item.user_id] })
		// 			// msgStore.updateAtAllUser(false)
		// 			// msgStore.updateAtUsers(item.user_id)
		// 		}
		// 	}
		// }
		// }
		const quill = new Quill(messageInputRef.current, {
			readOnly,
			placeholder
			// modules: props.is_group ? modules : {}
		})

		quill.on('text-change', () => {
			// console.log('text-change', quill.getSemanticHTML())
			// if (props.onChange) {
			// 	const content = quill.getSemanticHTML()
			// 	props.onChange(content)
			// }
		})

		// if (props.defaultValue) {
		// 	quill.root.innerHTML = props.defaultValue
		// }

		// setQuill(quill)

		return () => {
			quill.off('text-change')
		}
	}, [])

	return (
		<Flex className="flex-1 bg-gray-100 rounded-lg" align="center">
			<div className="w-full" ref={messageInputRef} />
		</Flex>
	)
}

export default MessageInput
