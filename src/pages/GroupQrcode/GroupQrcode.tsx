import QRCode from 'qrcode.react'
import { Navbar, Page } from 'framework7-react'
import { useEffect, useState } from 'react'
import GroupService from '@/api/group'
import { $t } from '@/shared'

const GroupQrcode: React.FC<RouterProps> = ({f7route}) => {
	const [groupInfo, setGroupInfo] = useState<any>();
	console.log(f7route.query);
	
	const groupId = f7route.query.group_id
	useEffect(() => {
		;(async () => {
			// 获取群聊信息
			const { code, data } = await GroupService.groupInfoApi({ group_id: groupId })
			if (code !== 200) return
			code === 200 && setGroupInfo(data)
		})()
	}, [groupId])


	return (
		<Page noToolbar>
			<Navbar backLink />
			<div className="h-full pt-32">
				<div className="flex flex-col px-14 mb-10 justify-start items-center gap-5">
					<div className="w-16 h-16 rounded-full overflow-hidden bg-black bg-opacity-10 flex justify-center items-center">
						<img src={groupInfo?.avatar} alt="" className=" h-full object-cover bg-black bg-opacity-10" />
					</div>
					<div className="flex flex-col">
						<span className="font-bold text-lg" style={{ color: 'black', textAlign: 'center' }}>
							{$t('群组 : ')}{groupInfo?.name}
						</span>
					</div>
				</div>
				<div>
					<QRCode style={{ margin: '0 auto' }} value={'group:' + groupId!} size={256} level={'H'} />
				</div>
				<div className="flex justify-center mt-10 text-neutral-400">
					<span>通过扫描上面的二维码，即可添加群聊</span>
				</div>
			</div>
		</Page>
	)
}

export default GroupQrcode
