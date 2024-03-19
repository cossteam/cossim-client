import { f7, Button, Link, List, ListInput, Navbar, NavRight, Page } from 'framework7-react'
import {  useState } from 'react'
import { $t } from '@/shared'
import UserService from '@/api/user'
import useUserStore from '@/stores/user'

const ChangeUserID: React.FC<RouterProps> = ({ f7route, f7router }) => {
	console.log(f7route.query);

	// useEffect(() => {
	// 	setId(f7route.query.coss_id!)
	// }, [])

	const [isChangeID, setIsChangeID] = useState(false)
	const [id, setId] = useState('')

	const userStore = useUserStore()

	const handlerSubmit = () => {
		UserService.updateUserInfoApi({
			coss_id: id
		}).then(() => {
			userStore.update({ userInfo: {  ...userStore.userInfo, coss_id: id } })
			f7router.back();
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
					<div>
						<List className='mx-[16px]' strongIos outlineIos dividersIos form formStoreData>
							<ListInput
								name="name"
								type="text"
								onChange={(e) => setId(e.target.value)}
								clearButton
								defaultValue={userStore.userInfo?.coss_id}
								autofocus
							/>
						</List>
					</div>
				</div>
			}
		</Page>
	)
}

export default ChangeUserID
