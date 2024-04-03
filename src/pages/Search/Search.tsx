import ReadEditor from '@/components/ReadEditor/ReadEditor'
import Avatar from '@/components/Avatar/Avatar'
import { $t, MESSAGE_TYPE } from '@/shared'
import useCacheStore from '@/stores/cache'
import useMessageStore from '@/stores/message'
import { useAsyncEffect } from '@reactuses/core'
import { List, ListItem, NavTitle, Navbar, Page, PageContent, Searchbar, Subnavbar } from 'framework7-react'
import { useCallback, useState } from 'react'

const Search: React.FC<RouterProps> = ({ f7router }) => {
	const cacheStore = useCacheStore()
	const messageStore = useMessageStore()

	const [keyword, setKeyword] = useState<string>('')
	const [dialogList, setDialogList] = useState<any[]>([])

	useAsyncEffect(
		async () => {
			const dialogs: any[] = []
			// console.log('keyword', keyword)
			if (keyword.trim() === '') {
				setDialogList([])
				return
			}
			// 遍历所有会话消息
			await Promise.all(
				cacheStore.cacheDialogs.map(async (dialog) => {
					const newDialog = { ...dialog, msgs: [] }
					const dialogAllMsg = await cacheStore.get(`${dialog.dialog_id}`)
					if (dialogAllMsg.length <= 0) return
					const dialogMsg = dialogAllMsg.filter((i: any) => i.msg_type === MESSAGE_TYPE.TEXT)
					if (dialogMsg.length <= 0) return
					const msgs = dialogMsg.filter((i: any) => handlerContent(i.content).indexOf(keyword) !== -1)
					if (dialog.dialog_name.indexOf(keyword) !== -1 || msgs.length > 0) {
						// console.log(dialog?.dialog_name, msgs)
						newDialog.msgs = msgs
						dialogs.push(newDialog)
					}
				})
			)
			// console.log('dialogs', dialogs)
			setDialogList(dialogs)
		},
		() => {},
		[keyword]
	)

	const handlerContent = useCallback((content: string) => {
		const doc = new DOMParser().parseFromString(content, 'text/html')
		const imgs = doc.querySelectorAll('img')

		// 替换图片
		if (imgs.length) {
			const span = document.createElement('span')
			span.textContent = $t('[图片]')
			// 全部替换为 文字
			for (let i = 0; i < imgs.length; i++) {
				imgs[i].replaceWith(span)
			}
			content = doc.body.innerHTML
		}
		return content
	}, [])

	const Row = (item: any) => {
		return item.msgs.map((msg: any) => {
			return (
				<ReadEditor
					content={
						(item?.group_id && msg?.sender_info?.name ? msg.sender_info?.name + ':' : '') +
						handlerContent(msg?.content ?? '')
					}
					className="dialog-read-editor"
				/>
			)
		})
	}

	return (
		<Page className="group-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<div className="">{$t('搜索')}</div>
				</NavTitle>
				<Subnavbar inner={false}>
					<Searchbar
						searchContainer=".contacts-list"
						placeholder={$t('输入关键字')}
						searchIn=".item-inner"
						outline={false}
						disableButtonText={$t('取消')}
						onChange={(e) => setKeyword(e.target.value)}
					/>
				</Subnavbar>
			</Navbar>
			<PageContent className="p-0">
				<List contactsList noChevron mediaList dividers>
					{dialogList.map((dialog: any) => (
						<ListItem
							key={dialog?.dialog_id}
							link
							onClick={async () => {
								messageStore.init({
									dialogId: dialog?.dialog_id ?? 0,
									receiverId: dialog?.user_id ?? dialog?.group_id ?? 0,
									isGroup: !!dialog?.group_id,
									receiverInfo: dialog
								})
								f7router?.navigate(
									`/message/${dialog?.user_id ?? dialog?.group_id}/${dialog?.dialog_id}/?is_group=${dialog?.user_id ? 'false' : 'true'}&dialog_name=${dialog?.dialog_name}`
								)
							}}
						>
							<Avatar slot="media" size={50} src={`${dialog?.dialog_avatar}`} />
							<span slot="title">{dialog?.dialog_name}</span>
							<span slot="footer">
								{`发现「${dialog.msgs.length}」条消息`}
								{Row(dialog)}
							</span>
						</ListItem>
					))}
				</List>
			</PageContent>
		</Page>
	)
}

export default Search
