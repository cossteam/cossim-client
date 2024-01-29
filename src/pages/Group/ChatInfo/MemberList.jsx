import { NavTitle, Navbar, Page } from 'framework7-react'
import React from 'react'
import PropType from 'prop-types'
import { friendListApi } from '@/api/relation'
import { groupMemberApi } from '@/api/group'
import { useEffect } from 'react'

MemberList.propTypes = {
	type: PropType.string,
	id: PropType.string
}
export default function MemberList({ type, id }) {
	// type: show plus minus
	console.log('MemberList', type, id)
	// 标题
	const getTitle = () => {
		return {
			show: '成员列表',
			plus: '选择联系人',
			minus: '聊天成员'
		}[type]
	}

	useEffect(() => {
		// friendListApi()
		// groupMemberApi({ groupId: id })
	}, [])

	return (
		<Page className="" noToolbar messagesContent>
			<Navbar className="messages-navbar bg-white" backLink>
				<NavTitle>
					<div className="mr-16">{getTitle()}</div>
				</NavTitle>
			</Navbar>
			<div>
				<h1>MemberList</h1>
			</div>
		</Page>
	)
}
