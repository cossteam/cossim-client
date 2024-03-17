import './styles/layout.scss'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { Carousel } from 'antd'
import Chats from '@/components/Chats/Chats'

const MobileLayout = () => {
	return (
		<>
			<Header title="COSS" />
			<Carousel className="app-layout" infinite={false}>
				<div className="app-layout-slide">
					<Chats />
				</div>
				<div className="app-layout-slide">2</div>
				<div className="app-layout-slide">3</div>
			</Carousel>
			<Footer />
		</>
	)
}

export default MobileLayout
