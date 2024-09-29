import { MESSAGE_SEND_STATE, MESSAGE_TYPE } from '@/utils/enum'

const generateTestMessages = (): Message[] => {
    const messages = [];
    for (let i = 0; i < 20; i++) {
        messages.push({
            dialog_id: i,
            at_all_user: i % 2 === 0,
            content: `这是第${i}条消息的内容`,
            is_brun_after_reading: i % 3 === 0,
            is_label: i % 4 === 0,
            msg_id: i,
            msg_send_state: i % 5 === 0 ? MESSAGE_SEND_STATE.SENDING : MESSAGE_SEND_STATE.SUCCESS,
            read_at: Date.now(),
            receiver_id: `receiver_${i}`,
            sender_id: `sender_${i}`,
            receiver_info: {
                avatar: `avatar_${i}`,
                name: `receiver_name_${i}`,
                user_id: `receiver_user_id_${i}`
            },
            sender_info: {
                avatar: `avatar_${i}`,
                name: `sender_name_${i}`,
                user_id: `sender_user_id_${i}`
            },
            type: MESSAGE_TYPE.TEXT
        });
    }
    return messages;
};

export default generateTestMessages;