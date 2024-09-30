import { LoginParams, LogoutParams } from './api'
import { GroupData, RequestData, ContactData } from './storage'

export interface CommonOptions {
    /**
     * @description 当前主题  'light' | 'dark'
     * @default 'light'
     */
    theme: 'light' | 'dark'
    /** @description 主题色 */
    themeColor: string
    /** @description 语言 */
    lang: string
    /** @description 记录上一次记录的会话 id */
    lastDialogId: number
    /** @description  记录历史表情 */
    historyEmoji: string[]
}

export interface CommonStoreMethods {
    /** @description 初始化操作，数据初始化，主题初始化等 */
    init(): Promise<void>
    /** @description 更新某个值 */
    update: (options: Partial<CommonOptions>) => Promise<void>
}

export interface UserOptions {
    /*** @description 用户 id*/
    userId: string
    /*** @description 用户所有信息*/
    userInfo: any
    /** @description token */
    token: string
}

export interface UserStoreMethods {
    /** @description 更新某个值 */
    update: (options: Partial<UserOptions>) => Promise<void>
    login: (params: LoginParams) => Promise<ResponseData<any>>
    logout: (params: LogoutParams) => Promise<ResponseData<any>>
    clear: () => Promise<void>
}

export interface CallOptions {
    /** @description 当前通话 id */
    callId: string
    /** @description 当前通话类型 */
    callType: string
    /** @description 当前通话状态 */
    callStatus: string
    /** @description 当前通话是否是视频通话 */
    isVideo: boolean
    /** @description 当前通话是否是音频通话 */
    isAudio: boolean
    /** @description 当前通话是否是群聊 */
    isGroup: boolean
}

export interface CallStoreMethods {
    /** @description 更新某个值 */
    update: (options: Partial<CallOptions>) => Promise<void>
    /** @description 创建通话 */
    create: (
        callId: string,
        callType: string,
        isVideo: boolean,
        isAudio: boolean,
        isGroup: boolean
    ) => Promise<ResponseData<any>>
    /** @description 加入通话 */
    join: (
        callId: string,
        callType: string,
        isVideo: boolean,
        isAudio: boolean,
        isGroup: boolean
    ) => Promise<ResponseData<any>>
    /** @description 离开通话 */
    leave: () => Promise<ResponseData<any>>
    /** @description 拒绝通话 */
    reject: () => Promise<ResponseData<any>>
    /** @description 挂断通话 */
    hangup: () => Promise<ResponseData<any>>
}

/** @description 缓存聊天记录 */
// cacheChatRecord: ChatRecordData[]
/** @description 缓存消息列表, 包括未读消息 */
// cacheMessageList: Message[]
export interface CacheOptions {
    /** @description 缓存会话列表 */
    cacheChatList: ChatData[]
    /** @description 缓存联系人列表 */
    // cacheContactList: ContactData[]
    /** @description 缓存群组列表 */
    cacheGroupsList: GroupData[]
    /** @description 缓存消息未读数 */
    cacheMessageUnread: number
    /** @description 缓存申请列表 */
    cacheRequestList: RequestData[]
    /** @description 缓存用户信息映射  */
    // cacheUserMap: { [userId: string]: Contact };  // 键为用户 ID，值为 Contact 对象
}

// 基础缓存方法
export interface BaseCacheStoreMethods {
    /** @description 更新某个值 */
    update: (options: Partial<StorageOptions>) => Promise<void>
}

// 用户相关方法
export interface UserCacheStoreMethods {
    /** @description 获取用户信息 */
    getUserInfo: (userId: string) => Promise<Contact>
}

export interface ContactsOptions {
    /** @description 缓存联系人列表 */
    cacheContactList: ContactData[]
    /** @description 缓存黑名单列表 */
    // cacheBlacklist: Contact[];  // 存储被加入黑名单的用户ID列表
}

// 联系人相关方法
export interface ContactsCacheStoreMethods extends BaseCacheStoreMethods {
    /**
     * @description 添加联系人
     * @param contact - 要添加的联系人对象
     */
    addContact: (contact: Contact) => void;

    /**
     * @description 删除联系人
     * @param userId - 要删除的联系人的用户 ID
     */
    deleteContact: (userId: string) => void;

    /**
     * @description 判断是否为联系人
     * @param userId - 要判断的用户 ID
     * @returns 是否为联系人
     */
    isContact: (userId: string) => boolean;

    /**
     * @description 将用户加入黑名单
     * @param userId - 要加入黑名单的用户 ID
     */
    addToBlacklist: (userId: string) => void;

    /**
     * @description 将用户从黑名单中移除
     * @param userId - 要移除的用户 ID
     */
    removeFromBlacklist: (userId: string) => void;

    /**
     * @description 判断用户是否在黑名单中
     * @param userId - 要判断的用户 ID
     * @returns 用户是否在黑名单中
     */
    isInBlacklist: (userId: string) => boolean;
}

// 组合所有方法
export interface CacheStoreMethods extends BaseCacheStoreMethods { }

export interface MessagesOptions {
    /** @description 是否是群聊 */
    isGroup: boolean
    /** @description 会话信息 */
    chatInfo: ChatData | null
    /** @description 接收者 id */
    receiverId: string | number
    /** @description 草稿 */
    draft: string
}

export interface MessagesStoreMethods {
    /** @description 更新某个值 */
    update: (options: Partial<MessagesOptions>) => Promise<void>
}

// 通用仓库
export type CommonStore = CommonOptions & CommonStoreMethods
// 用户仓库
export type UserStore = UserOptions & UserStoreMethods
// 通话仓库
export type CallStore = CallOptions & CallStoreMethods
// 本地存储仓库
export type CacheStore = CacheOptions & CacheStoreMethods
// 消息仓库
export type MessagesStore = MessagesOptions & MessagesStoreMethods
// 联系人仓库
export type ContactsStore = ContactsOptions & ContactsCacheStoreMethods