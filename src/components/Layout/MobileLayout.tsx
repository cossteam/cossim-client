import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import './styles/layout.scss'
import Header from './Header/Header'

const MobileLayout = () => {
	return (
		<>
			<Header />
			<Swiper className="app-layout">
				<SwiperSlide className="app-layout-slide">主页</SwiperSlide>
				<SwiperSlide className="app-layout-slide">联系人</SwiperSlide>
				<SwiperSlide className="app-layout-slide">我的</SwiperSlide>
			</Swiper>
		</>
	)
}

export default MobileLayout
