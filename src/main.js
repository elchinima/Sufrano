import { __h, __Fragment } from './utils/runtime.js';
import { StrictMode } from "./utils/runtime.js";
import { createRoot } from "./utils/runtime.js";
import App from "./App.js";
import { initGlobalRateLimitInterceptor } from "./utils/rateLimitInterceptor.js";
initGlobalRateLimitInterceptor();
createRoot(document.getElementById("root")).render(/* @__PURE__ */ __h(StrictMode, null, /* @__PURE__ */ __h(App, null)));
