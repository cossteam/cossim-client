/**
 * 用于测试模拟数据使用
 * 后续接入接口后删除并移除 @faker-js/faker 依赖
 * @author YuHong
 */
import { faker } from '@faker-js/faker'

export const generateChatList = (count: number = 10) => {
	return Array.from({ length: count }, () => {
		const isGroup = faker.datatype.boolean()
		return {
			id: faker.string.uuid(),
			dialog_avatar: faker.image.avatar(),
			dialog_name: faker.person.firstName(),
			dialog_create_at: faker.date.recent(),
			dialog_id: faker.number.int(),
			dialog_type: 0,
			dialog_unread_count: faker.number.int({ max: 200 }),
			top_at: faker.number.int({ min: 0, max: 1 }),
			[isGroup ? 'group_id' : 'user_id']: isGroup ? faker.number.int({ min: 0, max: 1000 }) : faker.string.uuid(),
			last_message: {
				content: faker.lorem.sentence(),
				is_burn_after_reading: faker.datatype.boolean(),
				is_label: faker.datatype.boolean(),
				msg_id: faker.number.int(),
				msg_type: faker.number.int({ min: 0, max: 10 }),
				send_time: faker.date.recent(),
				sender_id: faker.string.uuid(),
				sender_info: {
					user_id: faker.string.uuid(),
					name: faker.person.firstName(),
					avatar: faker.image.avatar()
				},
				reply: faker.number.int(),
				receiver_info: {}
			}
		}
	})
}

export const generateFriendList = (count: number = 10) => {
	return Array.from({ length: count }, () => {
		return {
			avatar: faker.image.avatar(),
			dialog_id: faker.number.int(),
			email: faker.internet.email(),
			id: faker.string.uuid(),
			nickname: faker.person.firstName(),
			remark: faker.lorem.sentence(4),
			signature: faker.lorem.sentence(4),
			status: faker.number.int({ min: 0, max: 1 }),
			tel: faker.phone.number(),
			user_id: faker.string.uuid()
		}
	})
}

export const generateMessageList = (count: number = 10) => {
	return Array.from({ length: count }, () => {
		return {
			at_all_user: faker.number.int({ min: 0, max: 1 }),
			content: faker.lorem.sentence(),
			create_at: faker.date.recent(),
			id: faker.number.int()
			// TODO: add more message type
		}
	})
}
