import React from "react";
import { List, ListItem, Navbar, Link, Page } from "framework7-react";
import "./Settings.less";
import ListColorIcon from "../components/ListColorIcon";

export default function Settings() {
  return (
    <Page className="settings-page">
      <Navbar title="Settings" large transparent />
      <List strong dividers outline mediaList className="settings-profile-list">
        <ListItem link noChevron title="Vladimir" text="This is my status 🤘">
          <img slot="media" src="/avatars/vladimir-kharlampidi.jpg" />
          <Link
            slot="root"
            style={{
              position: "absolute",
              right: "16px",
              top: "16px",
            }}
            iconF7="qrcode"
          />
        </ListItem>
      </List>
      <List strong dividers outline>
        <ListItem link title="Starred Messages">
          <ListColorIcon color="#FFC601" icon="star_fill" slot="media" />
        </ListItem>
        <ListItem link title="Linked Devices">
          <ListColorIcon color="#09AC9F" icon="device_laptop" slot="media" />
        </ListItem>
      </List>

      <List strong dividers outline>
        <ListItem link title="Account">
          <ListColorIcon color="#007AFF" icon="person_fill" slot="media" />
        </ListItem>
        <ListItem link title="Chats">
          <ListColorIcon color="#4BD763" icon="chat_bubble" slot="media" />
        </ListItem>
        <ListItem link title="Notifications">
          <ListColorIcon color="#FE3C30" icon="app_badge" slot="media" />
        </ListItem>
        <ListItem link title="Storage and Data">
          <ListColorIcon
            color="#4BD763"
            icon="arrow_up_arrow_down"
            slot="media"
          />
        </ListItem>
      </List>

      <List strong dividers outline>
        <ListItem link title="Help">
          <ListColorIcon color="#007BFD" icon="info" slot="media" />
        </ListItem>
        <ListItem link title="Tell a Friend">
          <ListColorIcon color="#FF2C55" icon="heart_fill" slot="media" />
        </ListItem>
      </List>
    </Page>
  );
}
