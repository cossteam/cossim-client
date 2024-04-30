import {getWsUrl, getBaseUrl, setBaseUrl, setWsUrl} from '@/stores/requestUrl.ts'
import { Block, Button, f7, List, ListInput } from 'framework7-react'
import { useEffect, useState } from 'react'

const SetRequestUrl = () => {
	const [active, setActive] = useState(0)
	const options = [
		{
			id: 0,
			label: '正式环境',
			baseUrl: 'https://coss.gezi.vip/api/v1',
			wsUrl: 'wss://coss.gezi.vip/api/v1/push/ws'
		},
		{
			id: 1,
			label: '测试环境',
			baseUrl: 'https://tuo.gezi.vip/api/v1',
			wsUrl: 'wss://tuo.gezi.vip/api/v1/push/ws'
		}
	]

	const [baseCustomUrl, setBaseCustomUrl] = useState(getBaseUrl())
	const [wsCustomUrl, setWsCustomUrl] = useState(getWsUrl())

	useEffect(() => {
		setBaseCustomUrl(options[active].baseUrl)
		setWsCustomUrl(options[active].wsUrl)
	}, [active])

	const handleSubmit = () => {
		setBaseUrl(baseCustomUrl)
		setWsUrl(wsCustomUrl)
		f7.toast.create({
			text: "设置成功",
			position: 'center',
			closeTimeout: 2000,
		}).open()
	}

	return (
		<div>
			<Block>
				<List>
					<ListInput label='http地址' outline className="el-input" type='text' placeholder="Enter custom Base URL" value={baseCustomUrl} onChange={(e) => setBaseCustomUrl(e.target.value)} />
					<ListInput label='ws地址' outline className="el-input" type='text' placeholder="Enter custom WS URL" value={wsCustomUrl} onChange={(e) => setWsCustomUrl(e.target.value)} />
					<ListInput type='select' label="环境切换" value={active} onChange={(e) => setActive(e.target.value)}>
						{options.map((option) => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
					</ListInput>
				</List>
				<Button  className="mx-[16px] mb-5" fill round onClick={handleSubmit}>设置服务器地址</Button>
			</Block>
		</div>
	)
};

export default SetRequestUrl;
