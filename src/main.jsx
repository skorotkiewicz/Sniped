import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.scss";

import { NostrProvider } from "./context/NostrProvider";

const relayUrls = [
  "wss://nos.lol",
  // "wss://no.str.cr",
  // "wss://grizzly.de1.hashbang.sh/nostr",
];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NostrProvider
      relayUrls={relayUrls}
      debug={import.meta.env.DEV ? true : false}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NostrProvider>
  </React.StrictMode>
);
