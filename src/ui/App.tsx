import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { Layout } from "./Layout";

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "./index.css";

setBasePath("/dist/shoelace");

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <Layout />
    </React.StrictMode>
);
