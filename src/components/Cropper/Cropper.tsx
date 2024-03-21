import { useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'

const CropperDemo = () => {
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)

	const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
		console.log(croppedArea, croppedAreaPixels)
	}

	return (
		<Cropper
			image={'https://p9-passport.byteacctimg.com/img/user-avatar/c5e6d8daf3b31af36b853cd6df324ca6~50x50.awebp'}
			crop={crop}
			zoom={zoom}
			aspect={4 / 3}
			onCropChange={setCrop}
			onCropComplete={onCropComplete}
			onZoomChange={setZoom}
		/>
	)
}

export default CropperDemo
