import { Flexboard, FlexboardSidebar, FlexboardContent } from '@/components//common/flex-board'
import SidebarSearch from '@/components/common/sidebar-search'
import ContactList from '@/components/contacts/contact-list'
import ContactProfile from '@/components/contacts/contact-profile'

const FriendsPage = () => {
    return (
        <Flexboard>
            <FlexboardSidebar>
                <SidebarSearch />
                <ContactList />
            </FlexboardSidebar>
            <FlexboardContent>
                <ContactProfile />
            </FlexboardContent>
        </Flexboard>
    )
}

export default FriendsPage
