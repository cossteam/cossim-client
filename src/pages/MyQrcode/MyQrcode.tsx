import QRCode from 'qrcode.react'
import { Navbar, Page } from 'framework7-react'
import useUserStore from '@/stores/user'
import { useEffect, useState } from 'react'

const MyQrCode = () => {
	const userStore = useUserStore()
	const [userInfo, setUserInfo] = useState<any>({})

	useEffect(() => {
		console.log(userInfo)
		if (userStore.userInfo) {
			setUserInfo(userStore.userInfo)
		}
	}, [userStore.userInfo])

	return (
		<Page noToolbar>
			<Navbar backLink />
			<div className="h-full pt-32">
				<div className="flex px-14 mb-10 justify-start items-center gap-5">
					<div className="w-16 h-16 rounded-full overflow-hidden bg-black bg-opacity-10 flex justify-center items-center">
						<img src={userInfo?.avatar} alt="" className=" h-full object-cover bg-black bg-opacity-10" />
					</div>
					<div className="flex flex-col">
						<span className="font-bold text-lg" style={{ color: 'black', textAlign: 'center' }}>
							{userInfo?.nickname}
						</span>
						<span className="text-neutral-400">地区</span>
					</div>
				</div>
				{userInfo.user_id && (
					<>
						<div>
							<QRCode
								style={{ margin: '0 auto' }}
								value={'user_id:' + userInfo.user_id}
								size={256}
								level={'H'}
							/>
						</div>
						<div className="flex justify-center mt-10 text-neutral-400">
							<span>通过扫描上面的二维码，即可添加好友</span>
						</div>
					</>
				)}
			</div>
		</Page>
	)
}

export default MyQrCode
