import { Html5Qrcode } from 'html5-qrcode'
import { f7, Link, Navbar, Page, PageContent } from 'framework7-react'
import { useEffect } from 'react'
import { hasCamera } from '@/utils/media.ts'
import UserService from '@/api/user'
import { $t } from '@/shared'
import './Scanner.scss'

const QrScanner: React.FC<RouterProps> = ({ f7router }) => {
	let QrCode: Html5Qrcode | null = null

	useEffect(() => {
		getCameras()
		return () => {
			if (QrCode) handleStop()
		}
	}, [])

	/**
	 * 检测摄像头检查打开
	 * @returns
	 */
	function isCameraAvailable() {
		return navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				// 用户同意访问媒体设备并且设备可用，表示摄像头已打开
				stream.getTracks().forEach((track) => track.stop()) // 停止媒体流以释放资源
				return true
			})
			.catch((error) => {
				// 用户拒绝访问权限或者设备不可用，表示摄像头未打开
				console.error('Failed to access camera:', error)
				return false
			})
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

	const addPersional = async (userId: string | undefined) => {
		try {
			const { code } = await UserService.getUserInfoApi({ user_id: userId as string })
			if (code == 200) {
				console.log('获取用户状态', code)
				f7router?.navigate(`/personal_detail/${userId}/`, { reloadCurrent: true })
			}
		} catch (error) {
			f7.dialog.alert($t('该二维码已过期'))
		}
	}

	const addGroup = (groupId: string | undefined) => {
		console.log('群id', groupId, typeof groupId)
		console.log('群id', Number(groupId), typeof Number(groupId))
		f7router?.navigate(`/add_group/?group_id=${groupId}`, { reloadCurrent: true })
	}

	const handleScanner = (text: string) => {
		console.log('处理扫码', text)
		const type: string | undefined = text.match(/.*(?=:)/)?.[0]
		const content: string | undefined = text.match(/(?<=.*:).*/)?.[0]
		console.log('获取', type, content) // Output: 一段文本，

		switch (type) {
			case 'group_id':
				addGroup(content)
				break
			case 'user_id':
				addPersional(content)
				break
			default:
		}
	}

	const start = () => {
		QrCode?.start(
			{ facingMode: 'environment' },
			{
				fps: 10 // 设置每秒多少帧
				// qrbox: 400 // 设置取景范围
			},
			(decodedText: any) => {
				console.log('扫描结果', decodedText)
				handleScanner(decodedText)
				handleStop()
			},
			() => {
				// console.log('暂无额扫描结果', QrCode, errorMessage)
			}
		).catch((err: any) => {
			console.log(`Unable to start scanning, error: ${err}`)
		})
	}
	const handleStop = () => {
		console.log('摄像头状态', QrCode)
		isCameraAvailable()
			.then(() => {
				QrCode?.stop()
					.then((ignore: any) => {
						console.log('关闭摄像头', ignore)
					})
					.catch((err: any) => {
						console.log('关闭摄像头失败', err)
					})
			})
			.catch(() => {})
	}

	return (
		<Page noNavbar noToolbar>
			<Navbar backLink />
			<PageContent>
				<div className={'w-full flex justify-between items-center absolute'}>
					<div className="flex-1 m-4 flex">
						<Link iconF7="chevron_left_circle_fill" color="white" onClick={() => f7router.back()} />
					</div>
				</div>
				<div id="reader" className="w-full h-full overflow-hidden"></div>
			</PageContent>
		</Page>
	)
}

export default QrScanner
