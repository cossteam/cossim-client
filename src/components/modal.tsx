import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd'
import { memo } from 'react'

interface ModalProps extends AntdModalProps {
	children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = memo((props) => {
	return (
		<AntdModal centered footer={false} style={{ maxHeight: '80vh' }} {...props}>
			{props.children}
		</AntdModal>
	)
})

export default Modal
