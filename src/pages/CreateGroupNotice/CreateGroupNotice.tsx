import { $t } from '@/shared'
import { Card, CardContent, Link, NavRight, Navbar, Page } from 'framework7-react'

const CreateGroupNotice: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const is_created = f7route.query.isCreated ?? true
	// const group_id = f7route.params.group_id

	return (
		<Page noToolbar className="bg-bgTertiary">
			<Navbar title={is_created ? $t('创建群公告') : $t('编辑群公告')} backLink className="bg-bgPrimary">
				<NavRight>
					<Link onClick={() => f7router.back()}>完成</Link>
				</NavRight>
			</Navbar>

			<Card className="coss_card_title">
				<CardContent className="flex justify-center flex-col items-center">
					<input
						className="bg-transparent"
						placeholder={$t('请输入群名称')}
						name="name"
						// value={group.name}
						// onChange={(e) => setGroup({ ...group, name: e.target.value })}
					/>
				</CardContent>
			</Card>
		</Page>
	)
}

export default CreateGroupNotice
