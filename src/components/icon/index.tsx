import type { GetProps } from 'antd'
import Icon from '@ant-design/icons'

interface CustomIconProps extends GetProps<typeof Icon> {
	component: React.ForwardRefExoticComponent<any> | React.FC<React.SVGProps<SVGSVGElement>>
}

const CustomIcon: React.FC<Partial<CustomIconProps>> = (props) => {
	return <Icon component={props.component} {...props} />
}

export default CustomIcon
