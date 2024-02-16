import { Page, Navbar, Block } from 'framework7-react'

const NotFoundPage = () => (
	<Page>
		<Navbar title="该页面不存在" backLink="Back" />
		<Block strong inset>
			<p>Sorry</p>
			<p>Requested content not found.</p>
		</Block>
	</Page>
)

export default NotFoundPage
