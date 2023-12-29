import React, { useState } from "react";
import {
  Navbar,
  Page,
  List,
  ListItem,
  Subnavbar,
  Searchbar,
  Block,
  theme,
} from "framework7-react";

export default () => {
  const items = [];
  for (let i = 1; i <= 10000; i += 1) {
    items.push({
      title: `Item ${i}`,
      subtitle: `Subtitle ${i}`,
    });
  }
  const [vlData, setVlData] = useState({
    items: [],
    topPosition: 0,
  });

  const searchAll = (query, searchItems) => {
    const found = [];
    for (let i = 0; i < searchItems.length; i += 1) {
      if (
        searchItems[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
        query.trim() === ""
      )
        found.push(i);
    }
    return found; // return array with mathced indexes
  };
  const renderExternal = (vl, newData) => {
    setVlData({ ...newData });
  };
  return (
    <Page>
      <List
        strong
        outlineIos
        insetMd
        dividersIos
        className="searchbar-found"
        medialList
        virtualListß
        virtualListParams={{
          items,
          searchAll,
          renderExternal,
          height: theme.ios ? 63 : theme.mdß ? 73 : 77,
        }}
      >
        <ul>
          {vlData.items.map((item, index) => (
            <ListItem
              key={index}
              mediaItem
              link="#"
              // title={item.title}
              // subtitle={item.subtitle}
              style={{ top: `${vlData.topPosition}px` }}
              virtualListIndex={items.indexOf(item)}
            />
          ))}
        </ul>
      </List>
    </Page>
  );
};
