import { Link, Message, Messagebar, Messages, NavTitle, Navbar, Page } from 'framework7-react'
import React from 'react'
import PropType from 'prop-types'
import { $t } from '@/i18n'

GroupChat.propTypes = {
	f7route: PropType.object.isRequired
}
export default function GroupChat({ f7route }) {
	return (
		<Page className="chat-group-page messages-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<div className="mr-16">{$t('群组')}</div>
				</NavTitle>
			</Navbar>
			<Messages>
				<Message>1</Message>
				<Message>2</Message>
				<Message>3</Message>
			</Messages>
			<Messagebar>
				<Link slot="inner-start" iconF7="plus" />
				<Link slot="after-area" className="messagebar-sticker-link" iconF7="smiley" onClick={() => {}} />
				<Link slot="inner-end" className="messagebar-send-link" iconF7="paperplane_fill" onClick={() => {}} />
			</Messagebar>
		</Page>
	)
}
