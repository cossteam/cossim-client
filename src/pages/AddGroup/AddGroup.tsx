import { Page, Navbar } from 'framework7-react'

import { $t } from '@/shared'

const AddGroup = () => {
	return (
		<Page noToolbar className="bg-bgTertiary">
			<Navbar backLink title={$t('新建群聊')} className="bg-bgPrimary hidden-navbar-bg"></Navbar>
		</Page>
	)
}

export default AddGroup
