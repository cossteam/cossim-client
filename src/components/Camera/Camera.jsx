import React, { useRef } from 'react'
import { Link, Navbar, Popup, View, Page, Toolbar, PageContent } from 'framework7-react'
import './Camera.less'
import useCameraCapture from '@/shared/useCameraCapture'

export default function Camera() {
	const videoElRef = useRef(null)

	const { initCamera, stopCamera, changeCamera, errored } = useCameraCapture(videoElRef)
	return (
		<Popup swipeToClose="to-bottom" onPopupOpened={initCamera} onPopupClosed={stopCamera} className='camera-popup' >
			<View>
				<Page className="camera-page" pageContent={false}>
					<Navbar transparent bgColor="black">
						<Link slot="left" iconF7="xmark" color="white" popupClose />
						<Link slot="right" iconF7="bolt_badge_a_fill" color="white" />
					</Navbar>
					{!errored ? (
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
					) : (
						<PageContent>
							<div className="camera-error text-white">
								您的设备不支持相机API或您未提供使用该相机的权限
							</div>
						</PageContent>
					)}
				</Page>
			</View>
		</Popup>
	)
}
