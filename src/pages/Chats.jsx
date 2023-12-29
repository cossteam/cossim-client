import React from "react";
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
} from "framework7-react";
import "./Chats.less";
import { contacts, chats } from "../data";
import DoubleTickIcon from "../components/DoubleTickIcon";

export default function Chats(props) {
  const { f7router } = props;
  const swipeoutUnread = () => {
    f7.dialog.alert("Unread");
  };
  const swipeoutPin = () => {
    f7.dialog.alert("Pin");
  };
  const swipeoutMore = () => {
    f7.dialog.alert("More");
  };
  const swipeoutArchive = () => {
    f7.dialog.alert("Archive");
  };
  const onUserSelect = (user) => {
    console.log("start new chat with", user);
    setTimeout(() => {
      f7router.navigate(`/chats/${user.id}/`);
    }, 300);
  };
  const chatsFormatted = chats.map((chat) => {
    const contact = contacts.filter((contact) => contact.id === chat.userId)[0];
    const lastMessage = chat.messages[chat.messages.length - 1];
    return {
      ...chat,
      lastMessageText: lastMessage.text,
      lastMessageDate: Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
        day: "numeric",
      }).format(lastMessage.date),
      lastMessageType: lastMessage.type,
      contact,
    };
  });
  return (
    <Page className="chats-page">
      <Navbar title="Chats" large transparent>
        <Link slot="left">Edit</Link>
        <Link
          slot="right"
          iconF7="square_pencil"
          href="/contacts/"
          routeProps={{
            modalTitle: "New Chat",
            onUserSelect,
          }}
        />
      </Navbar>
      <List noChevron dividers mediaList className="chats-list">
        {chatsFormatted.map((chat) => (
          <ListItem
            key={chat.userId}
            link={`/chats/${chat.userId}/`}
            title={chat.contact.name}
            after={chat.lastMessageDate}
            swipeout
          >
            <img
              slot="media"
              src={`/avatars/${chat.contact.avatar}`}
              loading="lazy"
              alt={chat.contact.name}
            />
            <span slot="text">
              {chat.lastMessageType === "sent" && <DoubleTickIcon />}

              {chat.lastMessageText}
            </span>
            <SwipeoutActions left>
              <SwipeoutButton
                close
                overswipe
                color="blue"
                onClick={swipeoutUnread}
              >
                <Icon f7="chat_bubble_fill" />
                <span>Unread</span>
              </SwipeoutButton>
              <SwipeoutButton close color="gray" onClick={swipeoutPin}>
                <Icon f7="pin_fill" />
                <span>Pin</span>
              </SwipeoutButton>
            </SwipeoutActions>
            <SwipeoutActions right>
              <SwipeoutButton close color="gray" onClick={swipeoutMore}>
                <Icon f7="ellipsis" />
                <span>More</span>
              </SwipeoutButton>
              <SwipeoutButton
                close
                overswipe
                color="light-blue"
                onClick={swipeoutArchive}
              >
                <Icon f7="archivebox_fill" />
                <span>Archive</span>
              </SwipeoutButton>
            </SwipeoutActions>
          </ListItem>
        ))}
      </List>
    </Page>
  );
}
