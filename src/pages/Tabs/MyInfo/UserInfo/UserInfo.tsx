import React, { useState } from 'react'
import { f7, Page, Navbar, List, ListItem, Button, Block, Popup } from 'framework7-react'
import { useClipboard } from '@reactuses/core'
import { encode } from 'js-base64'

import { $t, toastMessage } from '@/shared'
import UserService from '@/api/user'
import { removeAllCookie } from '@/utils/cookie'
import useUserStore, { defaultOptions } from '@/stores/user'
import '../MyInfo.scss'
import { Qrcode } from 'framework7-icons/react'
import Cropper from '@/components/Cropper/Cropper'
import Avatar from '@/components/Avatar/Avatar.tsx'
import useCacheStore from '@/stores/cache'

const Userinfo: React.FC<RouterProps> = ({ f7router }) => {
	const [userInfo, setUserInfo] = useState<any>({})
	const userStore = useUserStore()
	const cacheStore = useCacheStore()
	const [isOpened, setOpened] = useState(false)
	const [files, setFiles] = useState<any>()

	const logout = () => {
		f7.dialog.confirm($t('退出登录'), $t('确定要退出登录吗？'), async () => {
			try {
				console.log(userStore?.userInfo)

				f7.dialog.preloader($t('正在退出...'))
				await UserService.logoutApi({
					driver_id: userStore?.deviceId
				})
			} catch (error) {
				toastMessage($t('退出登录失败'))
			} finally {
				userStore.update(defaultOptions)
				removeAllCookie()
				f7router.navigate('/auth/')
				f7.dialog.close()
			}
		})
	}

	const [, copy] = useClipboard()
	const exportPreKey = async () => {
		try {
			if (cacheStore.cacheKeyPair) {
				const text = JSON.stringify(cacheStore.cacheKeyPair)

				console.log('text', text)

				copy(encode(text))
					.then(() => {
						toastMessage('已经成功导出到剪切板')
					})
					.catch(() => {
						toastMessage('导出失败')
					})
			} else {
				toastMessage('暂时不支持导出密钥')
			}
			// toastMessage($t('暂时不支持导出密钥'))
			// const keyPair: any = userStore.keyPair
			// if (keyPair) {
			// 	const text = exportKeyPair(keyPair)
			// 	copy(text)
			// 	return toastMessage($t('已经成功导出到剪切板'))
			// }
			// toastMessage($t('导出身份信息失败'))
		} catch (error) {
			toastMessage($t('导出身份信息失败'))
		}
	}

	const handleAvatarClick = () => {
		// 点击头像时触发文件选择器
		const fileInput = document.getElementById('avatar-input') as HTMLInputElement

		if (fileInput) {
			fileInput.click()
		}
	}

	const handlerComplete = (blob: Blob) => {
		const file = new File([blob], 'avatar.png', { type: 'image/png' })
		UserService.updateAvatarApi({ file }).then(async (res) => {
			if (res.code == 200) {
				setOpened(false)
				const _userInfo = {
					...userInfo,
					...res.data
				}
				setUserInfo(_userInfo)
				userStore.update({
					userInfo: _userInfo
				})
				toastMessage($t('修改成功'))
			} else {
				toastMessage($t('修改失败'))
			}
		})
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// 处理文件选择器的文件变化事件
		const selectedFile = event.target.files?.[0]
		if (selectedFile) {
			const blob = new Blob([selectedFile])
			const blobUrl = URL.createObjectURL(blob)
			setFiles(blobUrl)
			setOpened(true)
		}
	}

	const loadUserInfo = async () => {
		try {
			const { data } = await UserService.getUserInfoApi({ user_id: userStore.userId })
			if (!data) {
				setUserInfo(userStore.userInfo)
				return
			}
			userStore.update({
				userInfo: data
			})
			setUserInfo(data)
		} catch (error) {
			console.log('获取用户信息错误', error)
		}
	}

	return (
		<Page noToolbar onPageBeforeIn={loadUserInfo}>
			<Navbar backLink outline={false} title={$t('个人信息')} />
			<List className="coss_list" strong>
				<ListItem className="coss_item__bottom" title="头像" onClick={handleAvatarClick}>
					<div slot="after">
						<input
							type="file"
							id="avatar-input"
							style={{ display: 'none' }}
							onChange={handleFileChange}
							accept="image/*"
						/>
						{/* <div className="w-12 h-12 rounded-full bg-black bg-opacity-10 flex justify-center items-center">
							<img
								src={userInfo?.avatar}
								alt=""
								className="w-full h-full object-cover rounded-full bg-black bg-opacity-10"
							/>
						</div> */}
						<div className="w-16 h-16 rounded-full overflow-hidden bg-black bg-opacity-10 flex justify-center items-center">
							<Avatar src={userInfo?.avatar} />
						</div>
					</div>
				</ListItem>
				{/* <ListItem
					title={$t('状态')}
					className="coss_item__bottom"
					link={`/update_user_info/status/?default=${userInfo?.status}&title=${$t('状态')}`}
				>
					<div slot="after" className="max-w-[200px] text-ellipsis overflow-hidden">
						{userInfo?.status}
					</div>
				</ListItem> */}
				<ListItem
					link={`/update_user_info/nickname/?default=${userInfo?.nickname}&title=${$t('修改昵称')}`}
					title={$t('昵称')}
					className="coss_item__bottom"
					after={userInfo?.nickname}
				/>
				<ListItem
					link={`/update_user_info/signature/?default=${userInfo?.signature}&title=${$t('修改签名')}`}
					title={$t('签名')}
					className="coss_item__bottom"
				>
					<div slot="after" className="max-w-[200px] text-ellipsis overflow-hidden">
						{userInfo?.signature}
					</div>
				</ListItem>
				<ListItem
					// link={`/update_user_info/tel/?default=${userInfo?.tel || ''}&title=${$t('修改手机号')}`}
					title={$t('手机号')}
					className="coss_item__bottom"
					after={userInfo?.tel}
					onClick={() => {
						f7.dialog.alert($t('暂不支持修改手机号'))
					}}
				/>
			</List>

			<List className="coss_list" strong>
				<ListItem link title={$t('邮箱')} noChevron className="coss_item__bottom" after={userInfo?.email} />
				<ListItem
					title={$t('我的二维码')}
					className="coss_item__bottom"
					link
					onClick={() => f7router.navigate('/my_qrcode/')}
				>
					<Qrcode slot="after" className="text-3xl" />
				</ListItem>
				<ListItem
					link={`/change_user_id/?coss_id=${userInfo?.coss_id}`}
					title={$t('ID')}
					className="coss_item__bottom"
					after={userInfo?.coss_id}
				/>
			</List>

			<List className="coss_list" strong>
				<ListItem
					link={`/update_user_info/password/?default=${''}&title=${$t('修改密码')}`}
					title={$t('更改密码')}
					className="coss_item__bottom"
				/>
				<ListItem link={`/switch_account/`} title={$t('切换账号')} className="coss_item__bottom" />
			</List>

			<Block>
				<Button onClick={exportPreKey} fill large round className="mb-3">
					{$t('导出身份信息')}
				</Button>
				<Button color="red" onClick={() => logout()} fill large round>
					{$t('退出登录')}
				</Button>
			</Block>

			<Popup className=" bg-black" opened={isOpened}>
				<Cropper image={files} onCancel={() => setOpened(false)} onComplete={handlerComplete} />
			</Popup>
		</Page>
	)
}

export default Userinfo
