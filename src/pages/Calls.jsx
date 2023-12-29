import React, { useState } from "react";
import {
  f7,
  Icon,
  List,
  ListItem,
  Navbar,
  Link,
  Page,
  Segmented,
  Button,
  SwipeoutActions,
  SwipeoutButton,
} from "framework7-react";
import "./Calls.less";
import { calls, contacts } from "../data";

export default function Calls(props) {
  const { f7router } = props;
  const [callsTab, setCallsTab] = useState("all");
  const callsFormatted = calls
    .filter((call) => {
      if (callsTab === "missed") return call.type === "Missed";
      return true;
    })
    .map((call) => {
      const contact = contacts.filter(({ id }) => call.userId === id)[0];
      const dateFormatted = Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
        day: "numeric",
      }).format(call.date);
      return {
        ...call,
        dateFormatted,
        contact,
      };
    });
  const onLinkClick = (user) => {
    console.log("start new call with", user);
    f7.dialog.alert("Calls are not available in this demo");
  };
  const onUserSelect = (user) => {
    console.log("start new call with", user);
    f7.dialog.alert("Calls are not available in this demo");
  };
  const onInfoIconClick = (e, call) => {
    e.stopPropagation();
    f7router.navigate(`/profile/${call.userId}/`);
  };
  const onDeleteClick = (call) => {
    console.log("delete call", call);
    f7.dialog.alert("Delete");
  };

  return (
    <Page className="calls-page">
      <Navbar className="calls-navbar" titleLarge="Calls" large transparent>
        <Link slot="left">Edit</Link>
        <Segmented slot="title" strong className="calls-navbar-segmented">
          <Button
            active={callsTab === "all"}
            onClick={() => setCallsTab("all")}
          >
            All
          </Button>
          <Button
            active={callsTab === "missed"}
            onClick={() => setCallsTab("missed")}
          >
            Missed
          </Button>
        </Segmented>
        <Link
          slot="right"
          iconF7="phone_badge_plus"
          href="/contacts/"
          routeProps={{
            modalTitle: "New Call",
            onUserSelect,
          }}
        />
      </Navbar>
      <List noChevron mediaList dividers className="calls-list">
        {callsFormatted.map((call, index) => (
          <ListItem
            key={`${index}-${call.contact.name}`}
            link
            onClick={() => onLinkClick(call.contact)}
            swipeout
          >
            <img
              slot="media"
              src={`/avatars/${call.contact.avatar}`}
              loading="lazy"
              alt={call.contact.name}
            />
            <span
              slot="title"
              className={call.type === "Missed" ? "text-color-red" : ""}
            >
              {call.contact.name}
            </span>
            <div className="calls-list-item-text" slot="text">
              <Icon slot="text" f7="phone_fill" />
              <span slot="text">{call.type}</span>
            </div>
            <div className="calls-list-item-after" slot="after">
              <span>{call.dateFormatted}</span>
              {/* eslint-disable-next-line */}
              <span onClick={(e) => onInfoIconClick(e, call)}>
                <Icon
                  f7="info_circle"
                  className="link prevent-active-state-propagation"
                  textColor="primary"
                />
              </span>
            </div>
            <SwipeoutActions right>
              <SwipeoutButton
                color="red"
                overswipe
                close
                onClick={() => onDeleteClick(call)}
              >
                Delete
              </SwipeoutButton>
            </SwipeoutActions>
          </ListItem>
        ))}
      </List>
    </Page>
  );
}
