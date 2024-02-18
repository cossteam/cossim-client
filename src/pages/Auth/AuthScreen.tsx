import { Block, Button, Page } from 'framework7-react'

import { $t } from '@/shared'
import { APP_NAME } from '@/shared'

const AuthScreen: React.FC<RouterProps> = ({ f7router }) => {
	return (
		<Page noToolbar>
			<Block className="flex justify-center h-3/5 pt-10">
				<h1 className="text-3xl font-semibold">{APP_NAME}</h1>
			</Block>

			<Block>
				<Button large fill onClick={() => f7router.navigate('/login/')} className="mb-5" round>
					{$t('登录')}
				</Button>
				<Button large tonal onClick={() => f7router.navigate('/register/')} round>
					{$t('注册')}
				</Button>
			</Block>
		</Page>
	)
}

export default AuthScreen
