// 用户的备注
import { f7, Link, List, ListInput, Navbar, NavRight, Page } from 'framework7-react'
import { useState } from 'react'
import RelationService from '@/api/relation'
import { $t } from '@/shared'
import CommInput from '@/components/CommInput/CommInput'
import { value } from 'dom7'

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
				<h1 className='text-center text-xl font-bold mt-10 mb-5'>设定备注</h1>
					<CommInput title='备注' defaultValue={oldRemark} onChange={(value: any) => setRemark(value)} />
				</div>
			</div>
		</Page>
	)
}

export default UserRemark