import React from "react";
import {
  Icon,
  List,
  ListItem,
  Navbar,
  Link,
  Page,
  BlockTitle,
} from "framework7-react";
import "./Status.less";

import { statuses, contacts } from "../data";

export default function Status() {
  const statusesFormatted = statuses.map((status) => {
    const contact = contacts.filter(({ id }) => status.userId === id)[0];
    const timeDiff = new Date().getTime() - status.date;
    return {
      ...status,
      hoursAgo: `${Math.floor(timeDiff / 60 / 60 / 1000)}h ago`,
      contact,
    };
  });
  return (
    <Page className="status-page">
      <Navbar className="status-navbar" title="Status" large transparent>
        <Link slot="left" href="/status-privacy/">
          Privacy
        </Link>
      </Navbar>
      <List mediaList noChevron strong dividers outline className="status-list">
        <ListItem title="My Status" text="Add to my status">
          <Link slot="media">
            <img
              src="/avatars/vladimir-kharlampidi.jpg"
              loading="lazy"
              alt="Vladimir Kharlampidi"
            />
            <Icon f7="plus_circle_fill" />
          </Link>
          <div className="status-list-links" slot="after">
            <Link iconF7="camera_fill" href="/camera/" />
            <Link iconF7="pencil" />
          </div>
        </ListItem>
      </List>
      <BlockTitle
        style={{
          textTransform: "uppercase",
          fontWeight: 400,
          fontSize: 14,
          opacity: 0.45,
        }}
      >
        Recent
      </BlockTitle>
      <List mediaList noChevron strong dividers outline className="status-list">
        {statusesFormatted.map((status) => (
          <ListItem
            key={status.userId}
            title={status.contact.name}
            link
            text={status.hoursAgo}
          >
            <img
              src={`/avatars/${status.contact.avatar}`}
              className="status-highlight"
              loading="lazy"
              alt={status.contact.name}
              slot="media"
            />
          </ListItem>
        ))}
      </List>
    </Page>
  );
}
