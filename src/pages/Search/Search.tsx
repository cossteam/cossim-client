import { $t } from '@/shared'
import { List, NavTitle, Navbar, Page } from 'framework7-react'

const Search: React.FC<RouterProps> = () => {
	return (
		<Page className="group-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<div className="">{$t('搜索')}</div>
				</NavTitle>
			</Navbar>
			<List contactsList noChevron dividers></List>
		</Page>
	)
}

export default Search
