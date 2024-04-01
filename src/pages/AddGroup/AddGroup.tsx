import { Button, Navbar, Page } from 'framework7-react'
import GroupService from '@/api/group.ts'
import RelationService from '@/api/relation.ts'
import React, { useEffect, useState } from 'react'
import Avatar from '@/components/Avatar/Avatar.tsx'
import { $t, toastMessage } from '@/shared'

const AddGroup: React.FC<RouterProps> = ({ f7route }) => {
	const groupId = f7route.query.group_id as string
	const [groupInfo, setGroupInfo] = useState<any>()
	useEffect(() => {
		GroupService.groupInfoApi({
			group_id: groupId
		}).then(res => {
			console.log('群信息', res)
			if (res.code == 200) {
				setGroupInfo(res.data)
			} else {
				toastMessage($t('二维码无效'))
			}

		})
	}, [])

	const addGroup = () => {
		RelationService.addGruop(groupId).then(res => {
			if (res.code == 200) {
				toastMessage($t('添加成功'))
			} else {
				toastMessage($t('添加失败'))
			}
		})
	}

	return (
		<Page>
			<Navbar backLink />
			{
				groupInfo ? (
					<div>
						<Avatar square src={groupInfo.avatar} />
						<span>{groupInfo.name}</span>
						<Button className='w-52' onClick={addGroup}  fill large round>
							{$t('加入群聊')}
						</Button>
					</div>
				) : (
					<div>
						<div>二维码失效</div>
					</div>
				)
			}

		</Page>
	)
}

export default AddGroup