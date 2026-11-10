import { __h, __Fragment } from './utils/runtime.js';
import React from "./utils/runtime.js";
import AppRoutes from "./routes/AppRoutes.js";
import ErrorBoundary from "./components/Elements/ErrorBoundary.js";
function App() {
	return /* @__PURE__ */ __h(ErrorBoundary, null, /* @__PURE__ */ __h("div", { className: "app-container" }, /* @__PURE__ */ __h(AppRoutes, null)));
}
export default App;
