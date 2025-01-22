import * as React from "react";
import SlTabGroup from "@shoelace-style/shoelace/dist/react/tab-group";
import SlTabPanel from "@shoelace-style/shoelace/dist/react/tab-panel";
import SlTab from "@shoelace-style/shoelace/dist/react/tab";

export const Layout2 = () => (
  <SlTabGroup placement="start">
    <SlTab slot="nav" panel="general">
      General
    </SlTab>
    <SlTab slot="nav" panel="custom">
      Custom
    </SlTab>
    <SlTab slot="nav" panel="advanced">
      Advanced
    </SlTab>
    <SlTab slot="nav" panel="disabled" disabled>
      Disabled
    </SlTab>

    <SlTabPanel name="general">This is the general tab panel.</SlTabPanel>
    <SlTabPanel name="custom">This is the custom tab panel.</SlTabPanel>
    <SlTabPanel name="advanced">This is the advanced tab panel.</SlTabPanel>
    <SlTabPanel name="disabled">This is a disabled tab panel.</SlTabPanel>
  </SlTabGroup>
);
