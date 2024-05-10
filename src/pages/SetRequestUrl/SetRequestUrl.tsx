import { $t } from '@/shared'
// import { setCookie } from '@/utils/cookie'
import { Block, Button, Link, List, ListInput, NavRight, Navbar, Page, Popup } from 'framework7-react'
import { useState } from 'react'
import { toastMessage } from '@/shared'
import useRequestStore from '@/stores/request'

const SetRequestUrl = () => {
	const requestStore = useRequestStore()

	const [baseCustomUrl, setBaseCustomUrl] = useState<string>(requestStore.currentBaseUrl)
	const [wsCustomUrl, setWsCustomUrl] = useState<string>(requestStore.currentWsUrl)
	const [opened, setOpened] = useState<boolean>(false)

	const handleSubmit = () => {
		requestStore.update({ currentBaseUrl: baseCustomUrl, currentWsUrl: wsCustomUrl })
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
							placeholder="请输入自定义http地址"
							value={baseCustomUrl}
							onChange={(e) => setBaseCustomUrl(e.target.value)}
						/>
						<ListInput
							label="ws地址"
							outline
							className="el-input"
							type="text"
							placeholder="请输入自定义ws地址"
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
