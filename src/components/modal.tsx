import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd'

interface ModalProps extends AntdModalProps {
	children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = (props) => {
	return (
		<AntdModal centered footer={false} style={{ maxHeight: '80vh' }} {...props}>
			{props.children}
		</AntdModal>
	)
}

export default Modal
