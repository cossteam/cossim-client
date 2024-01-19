import React from 'react'
import { Page, Navbar, Link, Block } from 'framework7-react'
import PropType from 'prop-types'

ChatBox.propTypes = {
	user: PropType.object.isRequired
}

export default function ChatBox(props) {
	return (
		<Page>
			<Navbar className="messages-navbar" backLink backLinkShowText={false}>
				<Link slot="right" iconF7="videocam" />
				<Link slot="right" iconF7="phone" />
				<Link slot="title" href={`/profile/${props?.user?.user_id}/`} className="title-profile-link">
					<img src={props?.user?.avatar} loading="lazy" />
					<div>
						<div>{props?.user?.nick_name}</div>
						<div className="subtitle">online</div>
					</div>
				</Link>
			</Navbar>

            <Block></Block>
		</Page>
	)
}
