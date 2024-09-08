import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd'
import { useMemo } from 'react'
import useMobile from '@/hooks/useMobile'

interface ModalProps extends AntdModalProps {
    children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = (props) => {
    const { height } = useMobile()
    const options = useMemo<AntdModalProps>(
        () => ({
            style: { maxHeight: height / 1.1, overflowY: 'auto' },
            centered: true,
            ...props
        }),
        [props]
    )
    return <AntdModal {...options}>{props.children}</AntdModal>
}

export default Modal
