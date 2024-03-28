/**
 * 转发需要字段，会话id，如果是个人就是receiver_id，群聊是group_id, 还需要判断要转发的人是否是阅后即焚的
 */

import { $t, customSort } from '@/shared'
import {
	Button,
	Icon,
	Link,
	List,
	ListItem,
	NavLeft,
	NavRight,
	NavTitle,
	Navbar,
	Page,
	Popup,
	View
} from 'framework7-react'
import '../styles/MessageForward.scss'
import useCacheStore from '@/stores/cache'
import clsx from 'clsx'
import { useState } from 'react'

interface MessageForwardProps {
	opened: boolean
	openedClose: () => void
	selectComplate: (selectList: any[]) => void
}

/**
 * 生成选中的格式内容
 *
 * @returns
 */
const generateSelectContent = (selectList: any[]) => {
	return selectList.map((item) => {
		const isGroup = item?.group_id ? true : false
		const dialogReceiverId = isGroup ? item?.group_id : item?.user_id
		return {
			dialog_id: item.dialog_id,
			dialog_receiver_id: dialogReceiverId,
			isGroup
		}
	})
}

const MessageForward: React.FC<MessageForwardProps> = (props) => {
	const cacheStore = useCacheStore()
	const [selectList, setSelectList] = useState<any[]>([])

	const dialogChange = (checked: boolean, item: any) => {
		const list = checked ? [...selectList, item] : selectList.filter((i) => i.dialog_id !== item.dialog_id)
		setSelectList(list)
	}

	return (
		<Popup className="contact-popup" onPopupClosed={props.openedClose} opened={props.opened}>
			<View>
				<Page noToolbar>
					<Navbar className="hidden-navbar-bg bg-bgPrimary coss_contact_navbar">
						<NavLeft>
							<Link popupClose>
								<Icon icon="icon-back"></Icon>
							</Link>
						</NavLeft>
						<NavTitle>{$t('转发')}</NavTitle>
						<NavRight>
							<Button popupClose onClick={() => props.selectComplate(generateSelectContent(selectList))}>
								{$t('完成')}
							</Button>
						</NavRight>

						{/* TODO：搜索全局 */}
						{/* <Subnavbar inner={false}>
							<Searchbar
								searchContainer=".contacts-list"
								placeholder={$t('搜索联系人')}
								searchIn=".item-title"
								outline={false}
								disableButtonText={$t('取消')}
							/>
						</Subnavbar> */}
					</Navbar>

					{/* 最近会话 */}
					{/* {cacheStore.cacheDialogs.length > 0 && (
						<p className="text-[0.75rem] pl-5 pt-5 pb-2 text-gray-500">{$t('最近聊天')}</p>
					)} */}
					<List contactsList noChevron dividers className="bg-bgPrimary">
						{cacheStore.cacheDialogs.sort(customSort).map((item, index) => {
							return (
								<ListItem
									className={clsx(item.top_at !== 0 && 'bg-bgSecondary')}
									key={item?.dialog_id + `${index}`}
									title={item?.dialog_name}
									checkbox
									// @ts-ignore
									checkboxIcon="end"
									onChange={(e) => dialogChange(e.target.checked, item)}
								>
									<img
										slot="media"
										src={`${item?.dialog_avatar}`}
										loading="lazy"
										className="w-12 h-12 rounded-full object-cover bg-black bg-opacity-10"
									/>
								</ListItem>
							)
						})}
					</List>
				</Page>
			</View>
		</Popup>
	)
}

export default MessageForward
