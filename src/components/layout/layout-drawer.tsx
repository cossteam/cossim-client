import { generateUserInfo } from '@/mock/data'
import { Avatar, Drawer, DrawerProps, Flex, Divider, Typography } from 'antd'
import React, { memo } from 'react'

const userInfo = generateUserInfo()

const LayoutDrawer: React.FC<Partial<DrawerProps>> = memo((props) => {
	return (
		<Drawer placement="left" closable={false} {...props}>
			<Flex align="top">
				<Avatar className="mr-5" src={userInfo.avatar} size={64} />
				<Flex vertical>
					<Typography.Title level={4}>{userInfo.nickname}</Typography.Title>
					<Typography.Text>{userInfo.email}</Typography.Text>
				</Flex>
			</Flex>

			<Divider />
			<Flex vertical>
				<p>1</p>
			</Flex>
		</Drawer>
	)
})

export default LayoutDrawer
