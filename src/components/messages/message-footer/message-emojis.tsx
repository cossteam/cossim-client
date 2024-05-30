import { Flex } from 'antd'
import React from 'react'
import Picker from '@emoji-mart/react'
import useCommonStore from '@/stores/common'
import data from '@/assets/json/emojis.json'

export interface MessageEmojisProps {}

console.log('data', data)

const MessageEmojis: React.FC<MessageEmojisProps> = () => {
	const commonStore = useCommonStore()
	return (
		<Flex className="container--filter emojis-picker w-[400px]">
			<Picker
				className="!w-full"
				data={data}
				onEmojiSelect={(emojis: any) => console.log(emojis)}
				dynamicWidth={true}
				locale={commonStore.lang}
				previewPosition="none"
				searchPosition="none"
				emojiSize="30"
				emojiButtonSize="48"
				// theme={getCookie(THEME) ?? 'light'}
			/>
		</Flex>
	)
}

export default MessageEmojis
