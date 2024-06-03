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
    cacheContactList: ContactData[]
    /** @description 缓存群组列表 */
    cacheGroupList: GroupData[]
    /** @description 缓存消息未读数 */
    cacheMessageUnread: number
    /** @description 缓存申请列表 */
    cacheRequestList: RequestData[]
}

export interface CacheStoreMethods {
    /** @description 更新某个值 */
    update: (options: Partial<StorageOptions>) => Promise<void>
}

// 通用仓库
export type CommonStore = CommonOptions & CommonStoreMethods
// 用户仓库
export type UserStore = UserOptions & UserStoreMethods
// 通话仓库
export type CallStore = CallOptions & CallStoreMethods
// 本地存储仓库
export type CacheStore = CacheOptions & CacheStoreMethods
