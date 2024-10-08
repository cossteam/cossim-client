/**
 * 用于测试模拟数据使用
 * 后续接入接口后删除并移除 @faker-js/faker 依赖
 * @author YuHong
 */
import { Contact } from '@/interface/model/contact'
import { DialogListItem, Message } from '@/interface/model/dialog'
import { faker } from '@faker-js/faker'

export const generateChatList = (count: number = 10): DialogListItem[] => {
    return Array.from({ length: count }, (_, index) => {
        const isGroup = faker.datatype.boolean()
        return {
            id: faker.string.uuid(),
            dialog_avatar: faker.image.avatar(),
            dialog_name: faker.person.firstName(),
            dialog_create_at: new Date(faker.date.recent()).getTime(),
            dialog_id: index + 1,
            dialog_type: 0,
            dialog_unread_count: faker.number.int({ max: 30 }),
            top_at: faker.number.int({ min: 0, max: 1 }),
            [isGroup ? 'group_id' : 'user_id']: isGroup ? faker.number.int({ min: 0, max: 1000 }) : faker.string.uuid(),
            last_message: {
                content: faker.lorem.sentence(),
                is_burn_after_reading: faker.datatype.boolean(),
                is_label: faker.datatype.boolean(),
                msg_id: faker.number.int(),
                msg_type: faker.number.int({ min: 0, max: 10 }),
                send_time: new Date(faker.date.recent()).getTime(),
                send_at: new Date(faker.date.recent()).getTime(),
                sender_id: faker.string.uuid(),
                sender_info: {
                    user_id: faker.string.uuid(),
                    name: faker.person.firstName(),
                    avatar: faker.image.avatar()
                },
                reply: faker.number.int(),
                receiver_info: {
                    user_id: faker.string.uuid(),
                    name: faker.person.firstName(),
                    avatar: faker.image.avatar()
                }
            }
        }
    })
}

export const generateFriendList = (count: number = 10): Contact[] => {
    return Array.from({ length: count }, () => {
        const nickname = faker.person.firstName()
        return {
            avatar: faker.image.avatar(),
            dialog_id: faker.number.int(),
            email: faker.internet.email(),
            id: faker.string.uuid(),
            nickname,
            remark: faker.lorem.sentence(4),
            signature: faker.lorem.sentence(4),
            status: faker.number.int({ min: 0, max: 1 }),
            tel: faker.phone.number(),
            user_id: faker.string.uuid(),
            coss_id: faker.string.uuid(),
            preferences: {
                open_burn_after_reading: false,
                open_burn_after_reading_time_out: 10,
                remark: '',
                silent_notification: false
            },
            relation_status: 1,
            group: nickname[0]
        }
    })
}

export const generateMessageList = (count: number = 10): Message[] => {
    return Array.from({ length: count }, (_, index) => {
        return {
            at_all_user: faker.datatype.boolean(),
            // content: faker.lorem.sentence({ min: 10, max: 40 }),
            content: `内容 ${faker.string.uuid()}`,
            create_at: new Date(faker.date.recent()).getTime(),
            dialog_id: 1,
            is_brun_after_reading: faker.datatype.boolean(),
            is_label: faker.datatype.boolean(),
            msg_id: faker.number.int(),
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
            type: faker.number.int({ min: 0, max: 10 }),
            sender_id: faker.number.int({ min: 0, max: 1 }) ? '1' : '2',
            is_burn_after_reading: faker.datatype.boolean(),
            is_at_all: faker.datatype.boolean(),
            is_reply: faker.datatype.boolean(),
            reply_id: faker.number.int(),
            msg_type: faker.number.int({ min: 0, max: 10 }),
            send_at: new Date(faker.date.recent()).getTime(),
            reply: 0
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

// export interface Preferences {
//     open_burn_after_reading: boolean
//     open_burn_after_reading_time_out: number
//     remark: string
//     silent_notification: boolean
// }

// export interface Contact {
//     avatar: string
//     coss_id: string
//     dialog_id?: number
//     email: string
//     nickname: string
//     preferences?: Preferences
//     relation_status?: number
//     signature: string
//     status?: number
//     tel?: string
//     user_id: string
// }

export interface ContactList {
    list: Record<string, Contact[]>
    total: number
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
    }
}

export const groupContactsByInitial = (contacts: Contact[]): Record<string, Contact[]> => {
    return contacts.reduce(
        (acc, contact) => {
            const initial = contact.nickname[0].toUpperCase()
            if (!acc[initial]) {
                acc[initial] = []
            }
            acc[initial].push(contact)
            return acc
        },
        {} as Record<string, Contact[]>
    )
}

export const generateContactList = (count: number = 10) => {
    const contacts = Array.from({ length: count }, () => generateContact())
    const groupedContacts = groupContactsByInitial(contacts)
    return {
        list: groupedContacts,
        total: count
    }
}

// export interface ContactList {
// 	list: { [key: string]: Contact[] };
// 	total: number;
//   }

// export const useContactList = () => {
// 	const [contactList, setContactList] = useState<ContactList>({ list: {}, total: 0 });

// 	useEffect(() => {
// 	  const contacts = generateContactList(10); // Change the number as needed
// 	  setContactList(contacts);
// 	}, []);

// 	return contactList;
// };

export const createGroup = (value: any) => {
    return value
}
