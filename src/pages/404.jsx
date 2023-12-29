import React from "react";
import { Page, Navbar, Block } from "framework7-react";

const NotFound = () => (
  <Page>
    <Navbar title="Not found" backLink="Back" />
    <Block strong>
      <p>Sorry</p>
      <p>Requested content not found.</p>
    </Block>
  </Page>
);

export default NotFound;
