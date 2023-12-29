import {
  View,
  Link,
  List,
  ListGroup,
  ListItem,
  Navbar,
  Page,
  Popup,
  Searchbar,
  Subnavbar,
  ListIndex,
  Icon,
} from "framework7-react";
import React from "react";
import { contacts } from "../data/index";

import "./Contacts.less";

export default function Contacts(props) {
  const { modalTitle, onUserSelect } = props;
  const contactsSorted = [...contacts].sort((a, b) =>
    b.name > a.name ? -1 : 1,
  );
  const groups = {};
  contactsSorted.forEach(({ name }) => {
    const key = name[0].toUpperCase();
    if (!groups[key]) groups[key] = [];
  });
  contactsSorted.forEach((contact) => {
    groups[contact.name[0].toUpperCase()].push(contact);
  });
  return (
    <Popup push>
      <View>
        <Page className="contacts-page">
          <Navbar title={modalTitle}>
            <Link slot="right" popupClose>
              Cancel
            </Link>
            <Subnavbar>
              <Searchbar
                searchContainer=".contacts-list"
                disableButton={false}
              />
            </Subnavbar>
          </Navbar>
          <ListIndex indexes={Object.keys(groups)} listEl=".contacts-list" />
          <List contactsList noChevron dividers>
            <ListItem link>
              <Icon
                className="contacts-list-icon"
                f7="person_3_fill"
                slot="media"
                color="primary"
              />
              <span slot="title" className="text-color-primary">
                New Group
              </span>
            </ListItem>
            <ListItem link>
              <Icon
                className="contacts-list-icon"
                f7="person_badge_plus_fill"
                slot="media"
                color="primary"
              />
              <span slot="title" className="text-color-primary">
                New Contact
              </span>
            </ListItem>
            {Object.keys(groups).map((groupKey) => (
              <ListGroup key={groupKey}>
                <ListItem groupTitle title={groupKey} />
                {groups[groupKey].map((contact) => (
                  <ListItem
                    key={contact.name}
                    link
                    title={contact.name}
                    footer={contact.status}
                    popupClose
                    onClick={() => onUserSelect(contact)}
                  >
                    <img slot="media" src={`/avatars/${contact.avatar}`} />
                  </ListItem>
                ))}
              </ListGroup>
            ))}
          </List>
        </Page>
      </View>
    </Popup>
  );
}
