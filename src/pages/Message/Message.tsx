import MessageCompoent from '@/components/Message'
import { Page } from 'framework7-react'

const Message: React.FC<RouterProps> = ({ f7route, f7router }) => {
	return (
		<Page noToolbar className="coss_message transition-all relative">
			<MessageCompoent f7route={f7route} f7router={f7router} />
		</Page>
	)
}

export default Message
