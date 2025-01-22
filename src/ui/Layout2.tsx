import * as React from "react";
import SlTabGroup from "@shoelace-style/shoelace/dist/react/tab-group";
import SlTabPanel from "@shoelace-style/shoelace/dist/react/tab-panel";
import SlTab from "@shoelace-style/shoelace/dist/react/tab";
import { Settings } from "./settings/Settings";
import { NumberTrainer } from "./number-trainer/NumberTrainer";
import { DateTrainer } from "./date-trainer/DateTrainer";

export const Layout2 = () => (
  <SlTabGroup>
    <SlTab slot="nav" panel="general">
      Home
    </SlTab>
    <SlTab slot="nav" panel="date-trainer">
      Date Trainer
    </SlTab>
    <SlTab slot="nav" panel="number-trainer">
      Number Trainer
    </SlTab>
    <SlTab slot="nav" panel="settings">
      Settings
    </SlTab>

    <SlTabPanel name="general">This is the general tab panel.</SlTabPanel>
    <SlTabPanel name="date-trainer">
      <DateTrainer />
    </SlTabPanel>
    <SlTabPanel name="number-trainer">
      <NumberTrainer />
    </SlTabPanel>
    <SlTabPanel name="settings">
      <Settings />
    </SlTabPanel>
  </SlTabGroup>
);
