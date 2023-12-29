import React, { useRef, useEffect } from "react";
import {
  List,
  ListItem,
  Navbar,
  Link,
  Page,
  ListButton,
} from "framework7-react";
import "./Profile.less";
import ListColorIcon from "../components/ListColorIcon";
import { contacts } from "../data";

export default function Profile(props) {
  const { f7route } = props;
  const userId = parseInt(f7route.params.id, 10);
  const contact = contacts.filter(({ id }) => id === userId)[0];

  const pageRef = useRef(null);
  const profileAvatarRef = useRef(null);
  useEffect(() => {
    // scroll page on half avatar size when page mounted
    const profileAvatarHeight = profileAvatarRef.current.offsetHeight;
    pageRef.current.el.querySelector(".page-content").scrollTop =
      profileAvatarHeight / 2;
  }, []);

  console.log("Profile");

  return (
    <Page ref={pageRef} className="profile-page" noToolbar>
      <Navbar title="Contact Info" backLink="Back" />
      <div className="profile-avatar-block" ref={profileAvatarRef}>
        <img src={`/avatars/${contact.avatar}`} />
      </div>
      <div className="profile-content">
        <List strong outline dividers mediaList className="no-margin-top">
          <ListItem title={contact.name} text="+1 222 333-44-55">
            <div slot="after" className="profile-actions-links">
              <Link iconF7="chat_bubble_fill" />
              <Link iconF7="camera_fill" />
              <Link iconF7="phone_fill" />
            </div>
          </ListItem>
          <ListItem subtitle={contact.status} text="27 Jun 2021" />
        </List>
        <List strong outline dividers>
          <ListItem link title="Media, Links, and Docs" after="1 758">
            <ListColorIcon color="#007BFD" icon="photo" slot="media" />
          </ListItem>
          <ListItem link title="Starred Messages" after="3">
            <ListColorIcon color="#FFC601" icon="star_fill" slot="media" />
          </ListItem>
          <ListItem link title="Chat Search">
            <ListColorIcon color="#FF8E35" icon="search" slot="media" />
          </ListItem>
        </List>

        <List strong outline dividers>
          <ListItem link title="Mute" after="No">
            <ListColorIcon color="#35C759" icon="speaker_3_fill" slot="media" />
          </ListItem>
          <ListItem link title="Wallpaper & Sound">
            <ListColorIcon color="#EC72D7" icon="camera_filters" slot="media" />
          </ListItem>
          <ListItem link title="Save to Camera Roll" after="Default">
            <ListColorIcon
              color="#FFC601"
              icon="square_arrow_down_fill"
              slot="media"
            />
          </ListItem>
        </List>

        <List strong outline dividers>
          <ListItem link title="Disappearing Messages" after="Off">
            <ListColorIcon color="#007BFD" icon="timer" slot="media" />
          </ListItem>
          <ListItem
            link
            title="Encription"
            footer="Messages and calls are end-to-end encrypted. Tap to verify."
          >
            <ListColorIcon color="#007BFD" icon="lock_fill" slot="media" />
          </ListItem>
        </List>

        <List strong outline dividers>
          <ListItem link title="Contact Details">
            <ListColorIcon color="#8E8E92" icon="person_circle" slot="media" />
          </ListItem>
        </List>

        <List strong outline dividers>
          <ListButton>Share Contact</ListButton>
          <ListButton>Export Chat</ListButton>
          <ListButton color="red">Clear Chat</ListButton>
        </List>
        <List strong outline dividers>
          <ListButton color="red">Block Contact</ListButton>
          <ListButton color="red">Report Contact</ListButton>
        </List>
      </div>
    </Page>
  );
}
