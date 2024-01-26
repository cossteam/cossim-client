import React, { useRef } from 'react'
import { Link, Navbar, Popup, View, Page, Toolbar, PageContent, f7 } from 'framework7-react'
import './Camera.less'
import useCameraCapture from '@/shared/useCameraCapture'
import PropType from 'prop-types'
import { useEffect } from 'react'

export default function Camera({ f7router }) {
	const videoElRef = useRef(null)

	const { initCamera, stopCamera, changeCamera, errored } = useCameraCapture(videoElRef)

	useEffect(() => {
		initCamera()
	}, [])

	useEffect(() => {
		const onDeviceReady = () => {
			console.log(navigator.camera)
			f7.dialog.alert(navigator.camera)
		}

		document.addEventListener('deviceready', onDeviceReady, false)

		return () => {
			document.removeEventListener('deviceready', onDeviceReady, false)
		}
	}, [])

	const back = () => {
		stopCamera()
		f7router.back()
	}

	return (
		// <Popup swipeToClose="to-bottom" onPopupOpened={initCamera} onPopupClosed={stopCamera}  className="camera-popup">
		// 	<View>
		<Page className="camera-page" pageContent={false} noToolbar>
			<Navbar transparent bgColor="black">
				<Link slot="left" iconF7="xmark" color="white" onClick={back} />
				<Link slot="right" iconF7="bolt_badge_a_fill" color="white" />
			</Navbar>
			{/* {!errored ? ( */}
			<>
				<Toolbar bottom outline={false}>
					按住可播放视频，轻按可拍摄照片
				</Toolbar>
				<div className="camera-toolbar">
					<Link iconF7="photo" color="white" />
					<Link iconF7="circle" color="white" />
					<Link iconF7="camera_rotate" color="white" onClick={changeCamera} />
				</div>
				<PageContent>
					<video ref={videoElRef} autoPlay muted playsInline />
				</PageContent>
			</>
			{/* ) : (
				<PageContent>
					<div className="camera-error text-white">您的设备不支持相机API或您未提供使用该相机的权限</div>
				</PageContent>
			)} */}
		</Page>
		// </View>
		// </Popup>
	)
}

Camera.propTypes = {
	f7router: PropType.object
}
