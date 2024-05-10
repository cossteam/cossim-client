// 用户的备注
import { Link, Navbar, NavRight, Page } from 'framework7-react'
import { useState } from 'react'
import RelationService from '@/api/relation'
import { toastMessage } from '@/shared'
import CommInput from '@/components/CommInput/CommInput'
import useLoading from '@/hooks/useLoading'
import useCacheStore from '@/stores/cache'

const UserRemark: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const oldRemark = f7route.query.remark
	const [remark, setRemark] = useState()
	const userId = f7route.query.user_id
	const { watchAsyncFn } = useLoading()
	const cacheStore = useCacheStore()

	const handlerSubmit = () => {
		watchAsyncFn(() =>
			RelationService.setUserRemark({
				user_id: userId!,
				remark: remark!
			})
				.then(() => {
					// 修改
					cacheStore.updateCacheContactsObj(
						cacheStore.cacheDialogs.map((item) => {
							if (item?.user_id === userId) {
								item.dialog_name = remark
							}
							return item
						})
					)
					f7router.back(`/profile/${userId}/`)
				})
				.catch(() => {
					toastMessage('修改失败')
				})
		)
	}

	return (
		<Page noToolbar>
			<Navbar backLink>
				<NavRight>
					<Link onClick={handlerSubmit}>提交</Link>
				</NavRight>
			</Navbar>
			<div className="flex h-full flex-col">
				<div>
					<h1 className="text-center text-xl font-bold mt-10 mb-5">设定备注</h1>
					<CommInput title="备注" defaultValue={oldRemark} onChange={(value: any) => setRemark(value)} />
				</div>
			</div>
		</Page>
	)
}

export default UserRemark
