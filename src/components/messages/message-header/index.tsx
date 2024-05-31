import {
  MoreOutlined,
  SearchOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  NotificationOutlined
} from '@ant-design/icons'
import { Flex, Typography, Dropdown, Divider } from 'antd'
import { useMemo } from 'react'
import IconButton from '@/components/icon/icon-button'
import { $t } from '@/i18n'
import useCallStore from '@/stores/call'

const MessageHeader = () => {
  const callStore = useCallStore()

  const call = (video: boolean) => {
    if (callStore.isAudio || callStore.isVideo) return
    callStore.create(`${Date.now()}`, video ? 'video' : 'audio', video, !video, false)
  }

  return (
    <Flex className="mobile:min-h-16 min-h-16 bg-background pl-5 pr-3" justify="center" vertical>
      <Flex justify="space-between">
        <Flex vertical>
          <Typography.Text className="text-base">NotionNext 交流群</Typography.Text>
          <Typography.Text className="text-gray-500 text-sm">664位成员</Typography.Text>
        </Flex>
        <Flex align="center" gap={10}>
          <IconButton className="text-xl text-gray-500" component={SearchOutlined} />
          <IconButton
            className="text-xl text-gray-500"
            component={PhoneOutlined}
            onClick={() => call(true)}
          />
          <IconButton
            className="text-xl text-gray-500"
            component={VideoCameraOutlined}
            onClick={() => call(false)}
          />
          <Dropdown
            // menu={{ items }}
            trigger={['click']}
            dropdownRender={() => <DropdownRender />}
          >
            <a onClick={(e) => e.preventDefault()}>
              <IconButton className="text-xl text-gray-500" component={MoreOutlined} />
            </a>
          </Dropdown>
        </Flex>
      </Flex>
    </Flex>
  )
}

const DropdownRender = () => {
  const items = useMemo(
    () => [
      {
        type: 'item',
        title: $t('消息免打扰'),
        key: '0',
        icon: <NotificationOutlined className="text-lg text-gray-500" />
      },
      {
        type: 'divider'
      },
      {
        type: 'item',
        title: '2nd menu item',
        key: '1',
        icon: <NotificationOutlined className="text-lg text-gray-500" />
      },
      {
        type: 'item',
        title: '3rd menu item',
        key: '3',
        icon: <NotificationOutlined className="text-lg text-gray-500" />
      }
    ],
    []
  )

  return (
    <Flex className="bg-background px-4 py-3 rounded-md shadow-custom" vertical>
      {items &&
        items.map((item, index) =>
          item.type === 'item' ? (
            <Flex className="w-full mb-4 last-of-type:mb-0" key={index} gap={10}>
              {item?.icon}
              <Typography.Text className="text-sm">{item.title}</Typography.Text>
            </Flex>
          ) : (
            <Divider className="mb-2 -mt-1" key={index} />
          )
        )}
    </Flex>
  )
}

export default MessageHeader
