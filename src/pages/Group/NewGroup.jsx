import { $t } from '@/i18n'
import { Card, CardContent, CardFooter, CardHeader, Link, NavRight, NavTitle, Navbar, Page } from 'framework7-react'
import React from 'react'
import { useState } from 'react'

export default function NewGroup() {
	const [group, setGroup] = useState({
		avatar: 'https://cdn.framework7.io/placeholder/nature-1000x600-3.jpg',
		name: '群名称',
		type: 0, // 0: 公开群组 1: 私有群组
		max_members_limit: 0
	})

	return (
		<Page className="bg-gray-50" noToolbar>
			<Navbar>
				<NavTitle>{$t('新建群组')}</NavTitle>
				<NavRight>
					<Link>{$t('完成')}</Link>
				</NavRight>
			</Navbar>
			<Card className="m-0 py-6 mb-4" outlineMd>
				<CardHeader className="flex flex-col justify-center">
					<img className="w-20 h-20 rounded-full mb-5" src={group.avatar} />
					<input className="text-center" value={group.name}></input>
				</CardHeader>
			</Card>
			<Card className="m-0 mb-4" outlineMd>
				<CardHeader className="flex">
					<span className="text-slate-400">{$t('群类型')}</span>
				</CardHeader>
			</Card>
			<Card className="m-0 mb-4" outlineMd>
				<CardHeader className="flex">
					<span className="text-slate-400">{$t('群成员')}</span>
				</CardHeader>
			</Card>
		</Page>
	)
}
