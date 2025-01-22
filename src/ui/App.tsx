import * as React from "react";
import { createRoot } from "react-dom/client";

import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import "./index.css";
// import { Layout } from "./Layout";
import { Layout2 } from "./Layout2";
import { Layout3 } from "./Layout3";

setBasePath("/dist/shoelace");

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <Layout3 />
    </React.StrictMode>
);
