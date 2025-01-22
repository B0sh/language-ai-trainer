import * as React from "react";
import { createRoot } from "react-dom/client";

import "@shoelace-style/shoelace/dist/themes/light.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import "./index.css";
// import { Layout } from "./Layout";
import { Layout2 } from "./Layout2";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.1/cdn/"
);

const root = createRoot(document.body);
root.render(
  <React.StrictMode>
    <Layout2 />
  </React.StrictMode>
);
