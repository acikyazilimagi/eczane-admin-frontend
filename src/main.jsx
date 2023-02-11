import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import "./index.css";
import { Provider } from "use-http";
import { useHTTPOptions } from "./config/useHttp.js";

ReactDOM.render(
  <React.StrictMode>
    <Provider url={useHTTPOptions.url} options={useHTTPOptions}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);
