import { Icon } from 'framework7-react'
import { useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import getCroppedImg from './cropImage'

const CropperDemo = ({
	image = 'https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000',
	onComplete,
	onCancel
}: {
	image: any
	onComplete: (image: any) => any
	onCancel?: () => any
}) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [rotation, setRotation] = useState(0)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

	const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels)
	}
	const showCroppedImage = async () => {
		try {
			const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation)
			onComplete(croppedImage)
			console.log('donee', { croppedImage })
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<div>
			<div>
				<Cropper
					image={image}
					crop={crop}
					zoom={zoom}
					rotation={rotation}
					cropShape="round"
					aspect={1 / 1}
					onCropChange={setCrop}
					onRotationChange={setRotation}
					onCropComplete={onCropComplete}
					onZoomChange={setZoom}
				/>
			</div>

			<div style={{ position: 'fixed', width: '100%', bottom: '3em', color: '#ffffff' }}>
				<div className="flex px-10 justify-between items-center">
					<span
						onClick={() => {
							setRotation(rotation + 90)
							console.log(rotation)
						}}
					>
						<Icon f7="rotate_right_fill"></Icon>
					</span>
					<span
						onClick={() => setRotation(0)}
						style={{ fontSize: '16px', fontWeight: 'bold', color: rotation == 0 ? '#666' : '#ffffff' }}
					>
						还原
					</span>
				</div>
				<div className="w-full h-[1px] my-10 bg-slate-900 "></div>
				<div className="flex px-10 justify-between items-center">
					<span onClick={onCancel} style={{ fontSize: '16px', fontWeight: 'bold' }}>
						取消
					</span>
					<span onClick={showCroppedImage} style={{ fontSize: '16px', fontWeight: 'bold' }}>
						完成
					</span>
				</div>
			</div>
		</div>
	)
}

export default CropperDemo
