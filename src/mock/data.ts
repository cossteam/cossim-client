/**
 * 用于测试模拟数据使用
 * 后续接入接口后删除并移除 @faker-js/faker 依赖
 * @author YuHong
 */
import { faker } from '@faker-js/faker'

export const generateChatList = (count: number = 10) => {
	return Array.from({ length: count }, (_, index) => {
		const isGroup = faker.datatype.boolean()
		return {
			id: faker.string.uuid(),
			dialog_avatar: faker.image.avatar(),
			dialog_name: faker.person.firstName(),
			dialog_create_at: new Date(faker.date.recent()).getTime(),
			dialog_id: index + 1,
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
				send_time: new Date(faker.date.recent()).getTime(),
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
			create_at: new Date(faker.date.recent()).getTime(),
			id: faker.number.int(),
			is_brun_after_reading: faker.datatype.boolean(),
			is_label: faker.datatype.boolean(),
			msg_id: faker.string.uuid(),
			msg_send_state: faker.number.int({ min: 0, max: 2 }),
			read_at: new Date(faker.date.recent()).getTime(),
			receiver_id: faker.string.uuid(),
			receiver_info: {
				avatar: faker.image.avatar(),
				name: faker.person.fullName(),
				user_id: faker.string.uuid()
			},
			sender_info: {
				avatar: faker.image.avatar(),
				name: faker.person.fullName(),
				user_id: faker.string.uuid()
			},
			type: faker.number.int({ min: 0, max: 10 })
		}
	})
}

export const generateUserInfo = () => {
	return {
		avatar: faker.image.avatar(),
		email: faker.internet.email(),
		login_number: 0,
		nickname: faker.person.firstName(),
		user_id: faker.string.uuid()
	}
}

export const generateGroupInfo = () => {
	return {}
}


export interface Preferences {
	open_burn_after_reading: boolean;
	open_burn_after_reading_time_out: number;
	remark: string;
	silent_notification: boolean;
  }
  
export interface Contact {
	avatar: string;
	coss_id: string;
	dialog_id: number;
	email: string;
	nickname: string;
	preferences: Preferences;
	relation_status: number;
	signature: string;
	status: number;
	tel: string;
	user_id: string;
}

export interface ContactList{
	list: Record<string, Contact[]>;
	total: number;
}
  
const generateContact = (): Contact => {
	return {
		avatar: faker.image.avatar(),
		coss_id: faker.string.uuid(),
		dialog_id: faker.number.int(),
		email: faker.internet.email(),
		nickname: faker.person.firstName(),
		preferences: {
		open_burn_after_reading: faker.datatype.boolean(),
		open_burn_after_reading_time_out: faker.number.int({ min: 1, max: 60 }),
		remark: faker.lorem.sentence(4),
		silent_notification: faker.datatype.boolean()
		},
		relation_status: faker.number.int({ min: 0, max: 1 }),
		signature: faker.lorem.sentence(4),
		status: faker.number.int({ min: 0, max: 1 }),
		tel: faker.phone.number(),
		user_id: faker.string.uuid()
	};
};

export const groupContactsByInitial = (contacts: Contact[]): Record<string, Contact[]> => {
	return contacts.reduce((acc, contact) => {
		const initial = contact.nickname[0].toUpperCase();
		if (!acc[initial]) {
		acc[initial] = [];
		}
		acc[initial].push(contact);
		return acc;
	}, {} as Record<string, Contact[]>);
};

export const generateContactList = (count: number = 10) => {
	const contacts = Array.from({ length: count }, () => generateContact());
	const groupedContacts = groupContactsByInitial(contacts);
	return {
		list: groupedContacts,
		total: count
	};
};

