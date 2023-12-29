/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from "react";
import $ from "dom7";

import { f7, App, Views, View, Toolbar, Link } from "framework7-react";

import routes from "../js/routes";

const AppComponent = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const previousTab = useRef("chats");

  useEffect(() => {
    // 修复手机上的视口比例
    if ((f7.device.ios || f7.device.android) && f7.device.standalone) {
      const viewPortElement = document.querySelector('meta[name="viewport"]');
      viewPortElement.setAttribute(
        "content",
        `${viewPortElement.getAttribute(
          "content",
        )}, maximum-scale=1, user-scalable=no`,
      );
    }
  }, []);

  // Framework7 Parameters
  const f7params = {
    name: "端对端加密",
    theme: "ios",
    routes,
    darkMode: "auto",
    colors: {
      primary: "#f36",
    },
    serviceWorker:
      process.env.NODE_ENV === "production"
        ? {
            path: "/service-worker.js",
          }
        : {},
  };
  function onTabLinkClick(tab) {
    if (previousTab.current !== activeTab) {
      previousTab.current = activeTab;
      return;
    }
    if (activeTab === tab) {
      $(`#view-${tab}`)[0].f7View.router.back();
    }
    previousTab.current = tab;
  }

  return (
    <App {...f7params}>
      <Views tabs className="safe-areas">
        <Toolbar tabbar icons bottom>
          <Link
            tabLink="#view-status"
            iconF7="status"
            text="Status"
            onClick={() => onTabLinkClick("status")}
          />
          <Link
            tabLink="#view-calls"
            iconF7="phone"
            text="Calls"
            onClick={() => onTabLinkClick("calls")}
          />
          <Link href="/camera/" tabLink iconF7="camera" text="Camera" />
          <Link
            tabLink="#view-chats"
            tabLinkActive
            iconF7="chat_bubble_2"
            text="Chats"
            onClick={() => onTabLinkClick("chats")}
          />
          <Link
            tabLink="#view-settings"
            iconF7="gear"
            text="Settings"
            onClick={() => onTabLinkClick("settings")}
          />
        </Toolbar>

        <View
          id="view-status"
          onTabShow={() => setActiveTab("status")}
          tab
          url="/status/"
        />
        <View
          id="view-calls"
          onTabShow={() => setActiveTab("calls")}
          tab
          url="/calls/"
        />
        <View
          id="view-chats"
          onTabShow={() => setActiveTab("chats")}
          tab
          tabActive
          url="/chats/"
          main
        />
        <View
          id="view-settings"
          onTabShow={() => setActiveTab("settings")}
          tab
          url="/settings/"
        />
      </Views>
    </App>
  );
};

export default AppComponent;
