import { $t } from '@/shared'
import { Icon, Link, List, ListInput, NavLeft, NavRight, NavTitle, Navbar, Page, Popup } from 'framework7-react'

import './Remark.scss'
import { useState } from 'react'

interface RemarkProps {
	title?: string
	opened: boolean
	onPopupClosed: (value: boolean) => void
	send: (text: string) => Promise<void>
}

const Remark: React.FC<RemarkProps> = ({ opened, onPopupClosed, title, send }) => {
	const [text, setText] = useState<string>('')

	return (
		<Popup opened={opened} onPopupClosed={() => onPopupClosed(false)}>
			<Page className="bg-bgTertiary">
				<Navbar className="hidden-navbar-bg bg-bgPrimary coss_remark">
					<NavLeft>
						<Link popupClose>
							<Icon icon="icon-back"></Icon>
						</Link>
					</NavLeft>
					<NavTitle>{title || $t('添加好友')}</NavTitle>
					<NavRight>
						<Link
							onClick={async () => {
								await send(text)
								onPopupClosed(false)
							}}
						>
							{$t('发送')}
						</Link>
					</NavRight>
				</Navbar>

				<List strongIos outlineIos dividersIos form formStoreData className="bg-bgPrimary">
					<ListInput
						name="name"
						type="text"
						onChange={(e) => setText(e.target.value)}
						clearButton
						autofocus
						placeholder={$t('请输入备注信息')}
					/>
				</List>
			</Page>
		</Popup>
	)
}

export default Remark
