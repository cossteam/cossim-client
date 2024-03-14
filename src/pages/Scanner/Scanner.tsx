import { Html5Qrcode } from 'html5-qrcode'
import { Navbar, Page } from 'framework7-react'
import { useEffect, useRef } from 'react'
import { hasCamera } from '@/utils/media.ts'

const QrScanner: React.FC<RouterProps> = ({ f7router }) => {
	// let QrCode: any = null
	const QrCode = useRef<Html5Qrcode>()

	useEffect(() => {
		getCameras()
		return () => {
			console.log(QrCode.current)
			if (QrCode.current)
				handleStop()
		}
	}, [])
	const getCameras = async () => {
		try {
			await hasCamera()
			Html5Qrcode.getCameras()
				.then((devices) => {
					console.log('获取设备信息成功', devices)
					if (devices && devices.length) {
						QrCode.current = new Html5Qrcode('reader')
						// start开始扫描
						start()
					}
				})
				.catch((err) => {
					// QrCode = new Html5Qrcode('reader')
					// handle err
					console.log('获取设备信息失败', err) // 获取设备信息失败
				})
		} catch (e) {
			console.log(e)
		}
	}
	const start = () => {
		QrCode.current?.start(
			{ facingMode: 'environment' },
			{
				fps: 20, // 设置每秒多少帧
				qrbox: { width: 250, height: 250 } // 设置取景范围
			},
			(decodedText: any) => {
				console.log('扫描结果', decodedText)
				handleStop()
				f7router?.navigate(`/personal_detail/${decodedText}/`)
			},
			(errorMessage: any) => {
				console.log('暂无额扫描结果', errorMessage)
			}
		)
			.catch((err: any) => {
				console.log(`Unable to start scanning, error: ${err}`)
			})
	}
	const handleStop = () => {
		console.log('摄像头状态', QrCode.current?.getState())
		if (QrCode.current?.getState() == 1)
			QrCode.current?.stop()
				.then((ignore: any) => {
					console.log('关闭摄像头', ignore)
				})
				.catch((err: any) => {
					console.log('关闭摄像头失败', err)
				})

	}

	return (
		<Page noToolbar>
			<Navbar backLink />
			<div className="w-full h-full">
				<div id="reader"></div>
			</div>
		</Page>
	)
}

export default QrScanner

