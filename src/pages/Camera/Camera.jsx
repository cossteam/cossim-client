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
		// initCamera()
		const cameraDevices = []
		navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
			for (const deviceInfo of deviceInfos) {
				if (deviceInfo.kind === 'videoinput') {
					cameraDevices.push({
						deviceId: deviceInfo.deviceId, // 摄像头的设备ID
						label: deviceInfo.label || 'camera' // 摄像头的设备名称
					})
				}
			}
		})

		// 兼容不同浏览器版本的getUserMedia
		function getUserMedia(constrains, success, error) {
			if (navigator.mediaDevices.getUserMedia) {
				//最新标准API
				navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error)
			} else if (navigator.webkitGetUserMedia) {
				//webkit内核浏览器
				navigator.webkitGetUserMedia(constrains).then(success).catch(error)
			} else if (navigator.mozGetUserMedia) {
				//Firefox浏览器
				navigator.mozGetUserMedia(constrains).then(success).catch(error)
			} else if (navigator.getUserMedia) {
				//旧版API
				navigator.getUserMedia(constrains).then(success).catch(error)
			}
		}

		// const videoDom = document.querySelector('#camera-shot-video')
		getUserMedia(
			{
				// video可直接传true，deviceId没传参数则使用默认的
				video: {
					width: 500,
					height: 500,
					deviceId:
						cameraDevices.length && cameraDevices[0].deviceId
							? { exact: cameraDevices[0].deviceId }
							: undefined
				},
				audio: false
			},
			(stream) => {
				// 播放视频流(兼容旧版video src)
				if ('srcObject' in videoElRef.current) {
					videoElRef.current.srcObject = stream
				} else {
					videoElRef.current.src = window.URL.createObjectURL(stream)
				}
				videoElRef.current.onloadedmetadata = function (e) {
					videoElRef.current.play()
				}
			},
			(err) => {
				console.log(err)
			}
		)
	}, [])

	// const onSuccess = (imageData) => {
	// 	console.log('拍照成功', imageData)
	// 	videoElRef.current.src = imageData
	// }

	// const onFail = (message) => {
	// 	console.log('拍照失败', message)
	// }

	// useEffect(() => {
	// 	const onDeviceReady = () => {
	// 		navigator.camera.getPicture(onSuccess, onFail, {
	// 			quality: 50,
	// 			destinationType: Camera.DestinationType.FILE_URI,
	// 			sourceType: Camera.PictureSourceType.CAMERA,
	// 			allowEdit: true
	// 		})
	// 	}

	// 	document.addEventListener('deviceready', onDeviceReady, false)

	// 	return () => {
	// 		document.removeEventListener('deviceready', onDeviceReady, false)
	// 	}
	// }, [])

	const back = () => {
		stopCamera()
		f7router.back()
	}

	return (
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
	)
}

Camera.propTypes = {
	f7router: PropType.object
}
