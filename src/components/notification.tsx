import { CloseOutlined } from '@ant-design/icons'
import { Flex, Avatar, Typography } from 'antd'
import toast, { Toast } from 'react-hot-toast'
import IconButton from '@/components/icon/icon-button'

export interface NotificationProps {
    t: Toast
    avatar?: string
    title: string
    content: string
}

const Notification: React.FC<NotificationProps> = ({ t, avatar, title, content }) => {
    return (
        <Flex
            className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-background shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
            <Flex className="flex-1 w-0 p-4">
                <Flex align="center">
                    {avatar && (
                        <Flex className="flex-shrink-0 pt-0.5">
                            <Avatar className="bg-gray-400" src={avatar} size={48} />
                        </Flex>
                    )}
                    <Flex className="ml-3 flex-1" vertical>
                        <Typography.Text className="text-sm font-medium text-gray-900">{title}</Typography.Text>
                        <Typography.Text className="mt-1 text-sm text-gray-500">{content}</Typography.Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex className="w-10" align="center" justify="center">
                <IconButton
                    buttonClassName="text-gray-500 hover:text-primary p-2"
                    onClick={() => toast.dismiss(t.id)}
                    component={CloseOutlined}
                />
            </Flex>
        </Flex>
    )
}

export default Notification
