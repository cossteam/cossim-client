import { List, ListItem, Navbar, Page } from 'framework7-react'
import { useEffect, useState } from 'react'
import useLoading from '@/hooks/useLoading.ts'
import RelationService from '@/api/relation.ts'
import Avatar from '@/components/Avatar/Avatar.tsx'

const BlackList = () => {
	const { watchAsyncFn } = useLoading()
	const [blackList, setBlackList] = useState<[any]>([''])

	useEffect(() => {
		watchAsyncFn(() =>
			RelationService.getBlackList().then((res) => {
				setBlackList(res.data.list)
				console.log('黑名单', res)
			})
		)
	}, [])

	return (
		<Page noToolbar>
			<Navbar backLink title="黑名单" />
			<List contactsList noChevron dividers outline className="h-full bg-bgPrimary">
				{blackList?.map((contact: any, index: number) => (
					<ListItem
						key={index}
						footer={contact?.signature}
						popupClose
						link={`/profile/${contact.user_id}/?dialog_id=${contact?.dialog_id}`}
					>
						<span slot="title">{contact?.nickname}</span>
						<div slot="media">
							<Avatar size={50} src={contact?.avatar} />
						</div>
					</ListItem>
				))}
			</List>
		</Page>
	)
}

export default BlackList
