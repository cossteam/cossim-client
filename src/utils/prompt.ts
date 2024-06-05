import toast, { Toast } from 'react-hot-toast'
import Notification, { NotificationProps } from '@/components/notification'
import { createElement } from 'react'

const commonToastOptions: Partial<Toast> = {
    duration: 3000,
    position: 'top-center'
}

// Show a toast message
export const showToast = (message: string, options?: Partial<Toast>) => {
    toast(message, {
        ...commonToastOptions,
        ...options
    })
}

const CommonNotificationOptions: Partial<Toast> = {
    duration: 3000,
    position: 'top-right'
}

// Show a notification message
export const showNotification = (notificationOptions: Optional<NotificationProps, 't'>, options?: Partial<Toast>) => {
    toast.custom((t) => createElement(Notification, { t, ...notificationOptions }), {
        ...CommonNotificationOptions,
        ...options
    })
}
