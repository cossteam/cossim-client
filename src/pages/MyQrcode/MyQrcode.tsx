import QRCode from 'qrcode.react';
import { Navbar, Page } from 'framework7-react'
import { useLiveQuery } from 'dexie-react-hooks'
import CommonStore from '@/db/common.ts'
import { getCookie } from '@/utils/cookie.ts'
import { USER_ID } from '@/shared'

const MyQrCode = () => {
	const userId: string | null = localStorage.getItem('__USER_ID__')

	const user = useLiveQuery(async () => {
		return await CommonStore.findOneById(
			CommonStore.tables.users,
			'user_id',
			getCookie(USER_ID)!
		)
	})
	const userInfo = user?.user_info

	return (
		<Page noToolbar>
			<Navbar backLink />
			<div className='h-full pt-32'>
				<div className='flex px-12 mb-10 justify-start items-center gap-5'>
					<img className="w-16 h-16 rounded bg-black bg-opacity-10" src={userInfo?.avatar} alt="" />
					<div className='flex flex-col'>
						<span className='font-bold text-lg' style={{ color: 'black', textAlign: 'center' }}>{userInfo?.nickname}</span>
						<span className='text-neutral-400'>地区</span>
					</div>
				</div>
				<div>
					<QRCode
						imageSettings={{
							src: userInfo?.avatar,
							height: 70,
							width: 70,
							excavate: true
						}}
						style={{ margin: '0 auto' }} value={userId!} size={256} level={'H'} />
				</div>
				<div className='flex justify-center mt-10 text-neutral-400'>
					<span>通过扫描上面的二维码，即可添加好友</span>
				</div>

			</div>

		</Page>
	);
};

export default MyQrCode;