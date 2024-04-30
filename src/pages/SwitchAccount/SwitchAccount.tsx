import { f7, Icon, Navbar, Page } from 'framework7-react'
import Avatar from '@/components/Avatar/Avatar.tsx'
import React, { useEffect, useState } from 'react'
import { Device } from '@capacitor/device'
import UserService from '@/api/user.ts'
import { ACCOUNT, TOKEN, USER_ID } from '@/shared'
import { setCookie } from '@/utils/cookie.ts'
import useUserStore from '@/stores/user.ts'
import useLoading from '@/hooks/useLoading.ts'

const style = {
	margin: '0 20px',
	marginBottom: '10px',
	background: 'var(--coss-background-primary)',
	padding: '15px',
	borderRadius: '5px'
}

const SwitchAccount: React.FC<RouterProps> = ({ f7router }) => {
	const [userList, setUserList] = useState<any[any]>()
	const userId = localStorage.getItem('__USER_ID__')
	useEffect(() => {
		const temp: any = localStorage.getItem('user_list')
		setUserList(JSON.parse(temp))
		console.log('账号列表数据', userList)
	}, [])
	const { watchAsyncFn } = useLoading()

	const userStore = useUserStore()
	const submit = async (index: number) => {
		console.log('切换账号', userList)
		if (userId == userList[index].user_id) return;

		const { identifier: driver_id } = await Device.getId()
		console.log(userList.password)

		const { code, data, msg } = await watchAsyncFn(() =>
			UserService.loginApi({
				password: userList[index].password,
				email: userList[index].email,
				driver_id,
				platform: 'ios',
				driver_token: '7bd439461e80d13a889e08d0c351fdcfa2c697b920536b4a3787ecf69a5206dc'
			})
		)

		console.log('登录', data)
		if (code !== 200) {
			f7.dialog.alert(msg)
			return
		}

		setCookie(USER_ID, data?.user_info?.user_id)
		setCookie(ACCOUNT, data?.user_info?.email)
		setCookie(TOKEN, data?.token)

		userStore.update({
			userId: data?.user_info?.user_id,
			token: data?.token,
			userInfo: data?.user_info,
			deviceId: driver_id
		})
		location.reload()
	}

	return (
		<Page className='bg-bgTertiary' noToolbar>
			<Navbar backLink />
			<h1 className="text-center mt-20 text-2xl">点击头像切换账号</h1>
			<div className="mt-20 ">
				{userList &&
					userList.map((item: any, index: number) => {
						return (
							<div onClick={() => submit(index)} key={item.user_id} style={style} className="flex">
								<Avatar square src={item.avatar} />
								<div className="flex flex-col flex-1 justify-center ml-2">
									<div className="flex w-full justify-between">
										<span className="text-lg">{item.nickname}</span>
										{userId == item.user_id && <span className="text-green-600">目前使用</span>}
									</div>
									<span className="text-textSecondary">{item.coss_id}</span>
								</div>
							</div>
						)
					})}
				<div
					onClick={() => f7router.navigate(`/login/?switch_account=${true}`)}
					style={style}
					className="flex items-center"
				>
					<div className="w-12 h-12 flex flex-col justify-center items-center border-dashed border-[1px] border-gray-400 text-gray-500 rounded-lg">
						<Icon f7="plus" size={18} />
					</div>
					<div className="ml-2 text-textSecondary text-lg">
						<span>新增账号</span>
					</div>
				</div>
			</div>
		</Page>
	)
}

export default SwitchAccount
