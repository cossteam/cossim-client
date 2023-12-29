import React, { useState } from "react";
import {
  List,
  ListItem,
  Navbar,
  Page,
  BlockTitle,
  BlockFooter,
} from "framework7-react";
import "./Status.less";

export default function StatusPrivacy() {
  const [value, setValue] = useState(1);
  return (
    <Page className="status-page">
      <Navbar
        className="status-navbar"
        title="Status Privacy"
        backLink="Back"
      />
      <BlockTitle
        style={{
          textTransform: "uppercase",
          fontWeight: 400,
          fontSize: 14,
          opacity: 0.45,
        }}
      >
        Who will see my updates
      </BlockTitle>
      <List strong dividers outline>
        <ListItem
          checked={value === 1}
          onChange={() => setValue(1)}
          radio
          radioIcon="start"
          title="My Contacts"
          footer="Share with all of your contacts"
        />
        <ListItem
          checked={value === 2}
          onChange={() => setValue(2)}
          radio
          radioIcon="start"
          title="My Contacts Except..."
          footer="Share with your contacts except people you select"
        />
        <ListItem
          checked={value === 3}
          onChange={() => setValue(3)}
          radio
          radioIcon="start"
          title="Only Share With..."
          footer="Only share with selected contacts"
        />
      </List>
      <BlockFooter>
        Changes to your privacy settings won't affect status updates you've sent
        alredy.
      </BlockFooter>
    </Page>
  );
}
