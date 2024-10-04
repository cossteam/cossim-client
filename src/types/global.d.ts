import { MESSAGE_SEND_STATE, MESSAGE_TYPE } from '@/utils/enum'
import { Storage } from '@/storage'
import { Toast } from 'react-hot-toast'
import { NotificationProps } from '@/components/notification'

export declare global {
    type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
    interface ResponseData<T = any> {
        code: number
        data: T
        msg: string
    }

    /** 会话 */
    interface ChatData {
        dialog_avatar: string
        dialog_name: string
        dialog_create_at: number
        dialog_id: number
        dialog_type: number
        dialog_unread_count: number
        top_at: number
        group_id?: number
        user_id?: string
        last_message: {
            content: string
            is_burn_after_reading: boolean
            is_label: boolean
            msg_id: number
            msg_type: number
            send_at: number
            sender_id: string
            sender_info: {
                user_id: string
                name: string
                avatar: string
            }
            reply: number
            receiver_info: {
                avatar: string
                name: string
                user_id: string
            }
        }
        draft?: string
    }

    /** 消息 */
    interface Message {
        dialog_id: number
        at_all_user: boolean
        content: string
        is_brun_after_reading: boolean
        is_label: boolean
        msg_id: number
        msg_send_state: MESSAGE_SEND_STATE
        read_at: number
        receiver_id: string
        sender_id: string
        receiver_info: {
            avatar: string
            name: string
            user_id: string
        }
        sender_info: {
            avatar: string
            name: string
            user_id: string
        }
        type: MESSAGE_TYPE
    }

    /** Electron 环境 */
    declare const __IS_ELECTRON__: boolean
    /** Web 环境 */
    declare const __IS_WEB__: boolean
    /** Android 环境 */
    declare const __IS_ANDROID__: boolean
    /** IOS 环境 */
    declare const __IS_IOS__: boolean
    /** 原生平台环境 */
    declare const __IS_NATIVE__: boolean

    interface SocketOptions {
        query?: string | { [key: string]: string }
        transports?: string[]
        path?: string
        hostname?: string
        secure?: boolean
        reconnection?: boolean
        reconnectionAttempts?: number
    }

    interface Socket {
        on(event: string, callback: (...args: any[]) => void): Socket
        once(event: string, callback: (...args: any[]) => void): Socket
        off(event: string, callback?: (...args: any[]) => void): Socket
        emit(event: string, ...args: any[]): Socket
        disconnect(): void
        close(): void
        id: string
        connected: boolean
    }
    /** sokcet.io */
    declare function io(url?: string, SocketOptions?: SocketOptions): Socket

    /** 本地存储 */
    declare const storage: Storage
    /** 提示 */
    declare function showToast(message: string, options?: Partial<Toast>): void
    /** 通知 */
    declare function showNotification(
        notificationOptions: Optional<NotificationProps, 't'>,
        options?: Partial<Toast>
    ): void
    interface Window {
        /** 本地存储 */
        storage: storage
        /** 提示 */
        showToast: showToast
        /** 通知 */
        showNotification: showNotification
    }
}
