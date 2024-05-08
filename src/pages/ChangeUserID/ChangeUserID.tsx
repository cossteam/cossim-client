import { f7, Button, Link, Navbar, NavRight, Page } from 'framework7-react'
import { useState } from 'react'
import { $t } from '@/shared'
import UserService from '@/api/user'
import useUserStore from '@/stores/user'
import CommInput from '@/components/CommInput/CommInput'
import useLoading from '@/hooks/useLoading'

const ChangeUserID: React.FC<RouterProps> = ({ f7router }) => {
	const [isChangeID, setIsChangeID] = useState(false)
	const [id, setId] = useState('')
	const [verify, setVerify] = useState(true)

	const userStore = useUserStore()
	const { watchAsyncFn } = useLoading()
	const handlerSubmit = () => {
		const regex = /^[a-zA-Z0-9_]{10,20}$/
		if (regex.test(id)) {
			setVerify(true)
			watchAsyncFn(() => {
				return UserService.updateUserInfoApi({
					coss_id: id
				})
					.then((res) => {
						if (res.code == 200) {
							userStore.update({ userInfo: { ...userStore.userInfo, coss_id: id } })
							f7router.back()
						} else {
							f7.dialog.alert($t(res.msg))
						}
					})
					.catch(() => {
						f7.dialog.alert($t('修改失败'))
					})
			})
		} else setVerify(false)
	}
	return (
		<Page noToolbar>
			<Navbar backLink>
				{isChangeID && (
					<NavRight>
						<Link onClick={handlerSubmit}>提交</Link>
					</NavRight>
				)}
			</Navbar>
			{isChangeID || (
				<div className="flex h-full flex-col justify-center gap-y-52">
					<div>
						<h2 className="text-center font-bold text-xl">
							{$t('用户ID')}: {userStore.userInfo?.coss_id}
						</h2>
						<p className="text-center text-gray-400">{$t('修改用户ID后，将无法找回原用户ID')}</p>
					</div>
					<div className="flex justify-center">
						<Button className="w-52" onClick={() => setIsChangeID(!isChangeID)} fill large round>
							{$t('修改用户ID')}
						</Button>
					</div>
				</div>
			)}
			{isChangeID && (
				<div className="flex h-full flex-col">
					<h1 className="text-center text-xl font-bold mt-10 mb-5">修改用户ID</h1>
					<div>
						<CommInput defaultValue={userStore.userInfo?.coss_id} onChange={(value: any) => setId(value)} />
					</div>
					<span style={{ color: verify ? '#bbb' : 'red' }} className="px-5 mt-5">
						只能包含大小写字母、数字和下划线，并且长度在10到20个字符之间
					</span>
				</div>
			)}
		</Page>
	)
}

export default ChangeUserID
