import React from 'react'
import {
	f7,
	List,
	ListItem,
	Navbar,
	Link,
	Page,
	SwipeoutActions,
	SwipeoutButton,
	Icon,
	Popover
} from 'framework7-react'
import './Chats/Chats.less'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import { Search, Plus, Person2Alt, PersonBadgePlusFill } from 'framework7-icons/react'
import { $t } from '@/i18n'
// import SearchComponent from '@/components/Search/Search'
import WebDB from '@/db'
import { getChatList } from '@/api/msg'
import { useEffect } from 'react'
import _ from 'lodash-es'
import { useLiveQuery } from 'dexie-react-hooks'

export default function Chats() {


	return <Page className="chats-page"></Page>
}
