import React from 'react'
import { Navbar, NavLeft, NavTitle, Link, Page, Block, Popup } from 'framework7-react'
import PropTypes from 'prop-types'
import { ChevronLeft } from 'framework7-icons/react'
// import qrCode  from 'qrcodejs'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect,useState } from 'react'
// import { $t } from '@/i18n'

export default function QRCode(props) {
	// const qrcodeRef = useRef(null)
	const [isClose, setIsClose] = useState(false)

	useEffect(() => {
		// console.log(qrCode)
		// const qrcode = new qrCode('qrcode', {
		// 	text: 'https://www.runoob.com',
		// 	width: 160,
		// 	height: 160,
		// 	colorDark: '#000000',
		// 	colorLight: '#ffffff'
		// 	// correctLevel: qrCode.CorrectLevel.H
		// })
		// qrcode.makeCode('https://www.runoob.com')
	}, [])

	const close = () => {
		setIsClose(true)
		props.close()
	}

	return (
		<Popup className="qrcode-popup" opened={props.opened}>
			<Page>
				<Navbar>
					<NavLeft>
						<Link popupClose={isClose} onClick={close}>
							<ChevronLeft className="w-5 h-5" />
						</Link>
					</NavLeft>
					<NavTitle>{props.title}</NavTitle>
				</Navbar>

				<Block className="w-full flex h-[calc(100vh-44px)] justify-center items-center my-0">
					<QRCodeSVG value="/auth/" size={200} />,
				</Block>
			</Page>
		</Popup>
	)
}

QRCode.propTypes = {
	title: PropTypes.string,
	className: PropTypes.string,
	placeholder: PropTypes.string,
	opened: PropTypes.bool,
	close: PropTypes.func
}
