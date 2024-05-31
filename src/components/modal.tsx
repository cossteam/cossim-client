import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd'
import { useMemo } from 'react'

interface ModalProps extends AntdModalProps {
  children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = (props) => {
  const options = useMemo<AntdModalProps>(
    () => ({
      style: { maxHeight: '80vh' },
      ...props
    }),
    [props]
  )
  return <AntdModal {...options}>{props.children}</AntdModal>
}

export default Modal
