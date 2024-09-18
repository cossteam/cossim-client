import { Flexboard, FlexboardSidebar, FlexboardContent } from '@/components//common/flex-board'
import SidebarSearch from '@/components/common/sidebar-search'
import ContactList from '@/components/contacts/contact-list'

import { Outlet } from 'react-router-dom'

const ContactsPage = () => {
    return (
        <Flexboard>
            <FlexboardSidebar>
                <SidebarSearch />
                <ContactList />
            </FlexboardSidebar>
            <FlexboardContent>
                <Outlet />
            </FlexboardContent>
        </Flexboard>
    )
}

export default ContactsPage
