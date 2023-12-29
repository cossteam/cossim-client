import React from "react";
import { Icon } from "framework7-react";
import "./ListColorIcon.less";

export default function ListColorIcon(props) {
  const { icon, color } = props;
  return (
    <Icon
      className="list-color-icon"
      f7={icon}
      style={{ backgroundColor: color }}
    />
  );
}
