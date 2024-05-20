import { Button, Navbar, Page } from 'framework7-react'
import GroupService from '@/api/group.ts'
import RelationService from '@/api/relation.ts'
import React, { useEffect, useState } from 'react'
import Avatar from '@/components/Avatar/Avatar.tsx'
import { $t, toastMessage } from '@/shared'
import useLoading from '@/hooks/useLoading.ts'

const AddGroup: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const groupId = f7route.query.group_id as string
	const [groupInfo, setGroupInfo] = useState<any>()
	const { watchAsyncFn } = useLoading()
	useEffect(() => {
		watchAsyncFn(() =>
			GroupService.groupInfoApi({
				group_id: Number(groupId)
			})
				.then((res) => {
					if (res.code == 200) {
						setGroupInfo(res.data)
						// 已经在群聊
						if (res.data.preferences) {
							f7router.navigate(`/group_info/${groupId}/`, { reloadCurrent: true })
						}
					} else {
						toastMessage($t('获取群信息失败'))
						console.log('获取群信息失败', res)
					}
				})
				.catch((err) => {
					console.log('获取群聊失败', err)
				})
		)
	}, [])

	const addGroup = () => {
		RelationService.addGruop(Number(groupId), '').then((res) => {
			console.log('添加群', res)
			if (res.code == 200) {
				toastMessage($t('添加成功'))
				f7router.navigate('/dialog/')
			} else if (res.code == 400) {
				toastMessage($t('已加入群聊'))
			} else {
				toastMessage($t('添加失败'))
			}
		})
	}

	return (
		<Page noToolbar>
			<Navbar backLink />
			{groupInfo ? (
				<div className="flex w-full h-full flex-col items-center">
					<Avatar className="mt-20" square src={groupInfo.avatar} />
					<span>{groupInfo.name}</span>
					<Button className="w-52 mt-50" onClick={addGroup} fill large round>
						{$t('加入群聊')}
					</Button>
				</div>
			) : (
				<div className="flex w-full h-full justify-center items-center">
					<div>二维码失效</div>
				</div>
			)}
		</Page>
	)
}

export default AddGroup
