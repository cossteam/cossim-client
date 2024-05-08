import { $t, BASE_URL, WS_URL } from '@/shared'
import { getCookie, setCookie } from '@/utils/cookie'
import { Block, Button, Link, List, ListInput, NavRight, Navbar, Page, Popup } from 'framework7-react'
import { useState } from 'react'
import { toastMessage } from '@/shared'

const SetRequestUrl = () => {
	const [baseCustomUrl, setBaseCustomUrl] = useState<string>(getCookie(BASE_URL) ?? '')
	const [wsCustomUrl, setWsCustomUrl] = useState<string>(getCookie(WS_URL) ?? '')
	const [opened, setOpened] = useState<boolean>(false)

	const handleSubmit = () => {
		setCookie(BASE_URL, baseCustomUrl)
		setCookie(WS_URL, wsCustomUrl)
		toastMessage('设置成功')
		setOpened(false)
	}

	return (
		<Popup className="demo-popup-swipe" swipeToClose opened={opened} onPopupOpen={() => setOpened(true)}>
			<Page>
				<Navbar title="环境切换">
					<NavRight>
						<Link popupClose>{$t('关闭')}</Link>
					</NavRight>
				</Navbar>
				<Block>
					<List>
						<ListInput
							label="http地址"
							outline
							className="el-input"
							type="text"
							placeholder="Enter custom Base URL"
							value={baseCustomUrl}
							onChange={(e) => setBaseCustomUrl(e.target.value)}
						/>
						<ListInput
							label="ws地址"
							outline
							className="el-input"
							type="text"
							placeholder="Enter custom WS URL"
							value={wsCustomUrl}
							onChange={(e) => setWsCustomUrl(e.target.value)}
						/>
					</List>
					<Button className="mx-[16px] mb-5" fill round large onClick={handleSubmit}>
						设置服务器地址
					</Button>
				</Block>
			</Page>
		</Popup>
	)
}

export default SetRequestUrl
