import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { initializeFirebase } from "./fire";
import App from "./core/components/App";
import store from "./store";

initializeFirebase();

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
