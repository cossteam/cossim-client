import { Drawer, DrawerProps } from 'antd'
import React, { memo } from 'react'

const Sidebar: React.FC<Partial<DrawerProps>> = memo((props) => {
	return (
		<Drawer placement="left" closable={false} {...props}>
			<p>Some contents...</p>
			<p>Some contents...</p>
			<p>Some contents...</p>
		</Drawer>
	)
})

export default Sidebar
