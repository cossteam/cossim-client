import { $t } from '@/i18n'
import { Button } from 'antd'

const Home = () => {
	return (
		<p>
			{$t('你好assay')}
			<Button type="primary">{$t('点ss击我222')}</Button>
		</p>
	)
}

export default Home
