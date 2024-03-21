// 在群组中用户展示的名称
import { f7, Link, Navbar, NavRight, Page } from 'framework7-react'
import { useState } from 'react'
import RelationService from '@/api/relation'
import { $t } from '@/shared'
import CommInput from '@/components/CommInput/CommInput'

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
				<h1 className='text-center text-xl font-bold mt-10 mb-1'>我在群组的昵称</h1>
				<div className="flex justify-center mb-10 text-neutral-800">
					<span>昵称修改后,只会在本群内展示,群成员都可见.</span>
				</div>
				<CommInput  defaultValue={remark} onChange={(value: any) => setRemark(value)} />
				</div>
			</div>
		</Page>
	)
}

export default GroupUserDisplayName