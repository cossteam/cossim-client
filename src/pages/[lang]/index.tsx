import { $t } from '@/i18n'
import { Button } from 'antd'

const Home = () => {
	return (
		<p>
			{$t('你好assay')}
			<Button>{$t('点击我')}</Button>
		</p>
	)
}

export default Home
