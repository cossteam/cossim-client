// 消息会话
export default class Chat {
    // ID、头像、昵称、未读消息数量、最后一条消息、时间
    constructor(id, avatar, name, unreadCount, lastMessage, time) {
        this.id = id;
        this.avatar = avatar;
        this.name = name;
        this.unreadCount = unreadCount;
        this.lastMessage = lastMessage;
        this.time = time;
    }
}