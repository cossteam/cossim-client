import { Html5Qrcode } from 'html5-qrcode'
import { f7, Navbar, Page } from 'framework7-react'
import { useEffect } from 'react'
import { hasCamera } from '@/utils/media.ts'
import UserService from '@/api/user'
import { $t } from '@/shared'

const QrScanner: React.FC<RouterProps> = ({ f7router, f7route }) => {
	let QrCode: any = null

	useEffect(() => {
		console.log(f7router, f7route);
		
		getCameras()
		return () => {
			console.log(QrCode)
			if (QrCode)
				handleStop()
		}
	}, [])
	/**
	 * 检测摄像头检查打开
	 * @returns 
	 */
	function isCameraAvailable() {
		return navigator.mediaDevices.getUserMedia({ video: true })
			.then(stream => {
				// 用户同意访问媒体设备并且设备可用，表示摄像头已打开
				stream.getTracks().forEach(track => track.stop()); // 停止媒体流以释放资源
				return true;
			})
			.catch(error => {
				// 用户拒绝访问权限或者设备不可用，表示摄像头未打开
				console.error('Failed to access camera:', error);
				return false;
			});
	}
	const getCameras = async () => {
		try {
			await hasCamera()
			Html5Qrcode.getCameras()
				.then((devices) => {
					console.log('获取设备信息成功', devices)
					if (devices && devices.length) {
						QrCode = new Html5Qrcode('reader')
						// start开始扫描
						start()
					}
				})
				.catch((err) => {
					console.log('获取设备信息失败', err) // 获取设备信息失败
				})
		} catch (e) {
			console.log(e)
		}
	}

	const addPersional = async (userId: string) => {
		try {
			const { code } = await UserService.getUserInfoApi({ user_id: userId })
			if (code == 200) {
				console.log('获取用户状态', code);			
				f7router?.navigate(`/personal_detail/${userId}/`)
			}
		} catch (error) {
			f7.dialog.alert($t('该二维码已过期'))
		}
	}

	const handleScanner = (text: string) => {
		const type: any = text.match(/.*(?=:)/)?.[0]
		const content: any = text.match(/(?<=.*:).*/)?.[0]
		console.log('获取',type, content); // Output: 一段文本，

		switch(type) {
			case 'group_id': 

				break;
			case 'user_id':
				addPersional(content)
				break;
			default:
		}
	}

	const start = () => {
		QrCode?.start(
			{ facingMode: 'environment' },
			{
				fps: 20, // 设置每秒多少帧
				qrbox: { width: 250, height: 250 } // 设置取景范围
			},
			(decodedText: any) => {
				console.log('扫描结果', decodedText)
				handleScanner(decodedText)
				handleStop()
			},
			(errorMessage: any) => {
				console.log('暂无额扫描结果', QrCode, errorMessage)
			}
		)
			.catch((err: any) => {
				console.log(`Unable to start scanning, error: ${err}`)
			})
	}
	const handleStop = () => {
		console.log('摄像头状态', QrCode)
		isCameraAvailable().then(() => {
			QrCode?.stop()
				.then((ignore: any) => {
					console.log('关闭摄像头', ignore)
				})
				.catch((err: any) => {
					console.log('关闭摄像头失败', err)
				})
		}).catch(() => {

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

