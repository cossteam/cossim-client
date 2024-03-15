import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

const Loading = () => {
	return (
		<div className="w-full h-screen bg-bgPrimary flex justify-center items-center">
			<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
		</div>
	)
}

export default Loading
