// 用户的备注
import { f7, Link, List, ListInput, Navbar, NavRight, Page } from 'framework7-react'
import { useState } from 'react'
import RelationService from '@/api/relation'
import { $t } from '@/shared'

const UserRemark: React.FC<RouterProps> = ({f7route, f7router}) => {
	const oldRemark = f7route.query.remark
	const [remark, setRemark] = useState()
	const userId = f7route.query.user_id
	console.log(userId, remark);
	
	const handlerSubmit = () => {
		RelationService.setUserRemark({
			user_id: userId!,
			remark: remark!
		}).then(() => {
			f7router.back();
		}).catch(() => {
			f7.dialog.alert($t('修改失败'))
		})
	}

	return (
		<Page noToolbar>
			<Navbar backLink>
				<NavRight><Link onClick={handlerSubmit}>提交</Link></NavRight>
			</Navbar>
			<div className="flex h-full flex-col">
				<div>
					<List strongIos outlineIos dividersIos form formStoreData>
						<ListInput
							name="name"
							type="text"
							clearButton
							onChange={(e) => setRemark(e.target.value)}
							defaultValue={oldRemark}
							autofocus
						/>
					</List>
				</div>
			</div>
		</Page>
	)
}

export default UserRemark