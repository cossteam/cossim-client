// 在群组中用户展示的名称
import { f7, Link, List, ListInput, Navbar, NavRight, Page } from 'framework7-react'
import { useState } from 'react'
import RelationService from '@/api/relation'
import { $t } from '@/shared'

const GroupUserDisplayName: React.FC<RouterProps> = ({f7route, f7router}) => {
	const groupId = f7route.query.group_id!
	const remark = f7route.query.remark
	const [remark_, setRemark] = useState<any>()
	console.log(f7route.query);
	
	const handlerSubmit = () => {
		RelationService.setGroupUserDisplayName({
			group_id: parseInt(groupId),
			remark: remark_
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
					<List className='mx-[16px]' strongIos outlineIos dividersIos form formStoreData>
						<ListInput
							name="name"
							type="text"
							clearButton
							onChange={(e) => setRemark(e.target.value)}
							defaultValue={remark}
							autofocus
						/>
					</List>
				</div>
			</div>
		</Page>
	)
}

export default GroupUserDisplayName