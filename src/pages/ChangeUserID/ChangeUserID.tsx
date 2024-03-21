import { f7, Button, Link, List, ListInput, Navbar, NavRight, Page } from 'framework7-react'
import {  useState } from 'react'
import { $t } from '@/shared'
import UserService from '@/api/user'
import useUserStore from '@/stores/user'
import CommInput from '@/components/CommInput/CommInput'

const ChangeUserID: React.FC<RouterProps> = ({ f7route, f7router }) => {

	const [isChangeID, setIsChangeID] = useState(false)
	const [id, setId] = useState('')

	const userStore = useUserStore()

	const handlerSubmit = () => {
		UserService.updateUserInfoApi({
			coss_id: id
		}).then((res) => {
			if (res.code == 200) {
				userStore.update({ userInfo: {  ...userStore.userInfo, coss_id: id } })
				f7router.back();
			} else {
				f7.dialog.alert($t('修改失败'))
			}
		}).catch(() => {
			f7.dialog.alert($t('修改失败'))
		})
	}
	return (
		<Page noToolbar>
			<Navbar backLink>
				{isChangeID &&
					<NavRight><Link onClick={handlerSubmit}>提交</Link></NavRight>
				}
			</Navbar>
			{isChangeID ||
				<div className="flex h-full flex-col justify-center gap-y-52">
					<div>
						<h2 className="text-center font-bold text-xl">{$t('用户ID')}: {userStore.userInfo?.coss_id}</h2>
						<p className="text-center text-gray-400">{$t('修改用户ID后，将无法找回原用户ID')}</p>
					</div>
					<div className="flex justify-center">
						<Button className='w-52' onClick={() => setIsChangeID(!isChangeID)} fill large round>
							{$t('修改用户ID')}
						</Button>
					</div>
				</div>
			}
			{isChangeID &&
				<div className="flex h-full flex-col">
					<h1 className='text-center text-xl font-bold mt-10 mb-5'>修改用户ID</h1>
					<div>
						<CommInput defaultValue={userStore.userInfo?.coss_id} onChange={(value: any) => setId(value)} />
					</div>
				</div>
			}
		</Page>
	)
}

export default ChangeUserID
