import { __h, __Fragment } from '../../../utils/runtime.js';
import React from "../../../utils/runtime.js";
import { useNavigate } from "../../../utils/router.js";
import { useAuth } from "../../../context/AuthContext.js";
import { isAllowedCashboxHistoryRole } from "../../../routes/CashboxProtectedRoute.js";
import { getUserAvatarUrl, handleAvatarError } from "../../../utils/avatar.js";
const logo = "/assets/icons/rednest_logo.png";
const CashboxTopBar = ({ cashierName, cashierAvatar, searchQuery, setSearchQuery, searchPlaceholder, t, isHistory = false }) => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const canAccessHistory = isAllowedCashboxHistoryRole(user?.role || user?.Role);
	return /* @__PURE__ */ __h("header", { className: "cashbox-topbar" }, /* @__PURE__ */ __h("div", {
		className: "cashbox-topbar__brand",
		onClick: () => navigate(isHistory ? "/cashbox" : "/")
	}, /* @__PURE__ */ __h("img", {
		src: logo,
		alt: "Süfrano",
		className: "cashbox-topbar__logo"
	}), /* @__PURE__ */ __h("span", { className: "cashbox-topbar__brand-text" }, "Süfrano"), /* @__PURE__ */ __h("span", { className: "cashbox-topbar__badge" }, "POS")), setSearchQuery && /* @__PURE__ */ __h("div", { className: "cashbox-topbar__search" }, /* @__PURE__ */ __h("svg", {
		className: "cashbox-topbar__search-icon",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("circle", {
		cx: "11",
		cy: "11",
		r: "8"
	}), /* @__PURE__ */ __h("line", {
		x1: "21",
		y1: "21",
		x2: "16.65",
		y2: "16.65"
	})), /* @__PURE__ */ __h("input", {
		type: "text",
		value: searchQuery || "",
		onChange: (e) => setSearchQuery(e.target.value),
		placeholder: searchPlaceholder || t?.searchPlaceholder || "Search products by name or category...",
		className: "cashbox-topbar__search-input"
	}), searchQuery && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-topbar__search-clear",
		onClick: () => setSearchQuery(""),
		title: t?.clearSearch || "Clear search"
	}, "✕")), /* @__PURE__ */ __h("div", { className: "cashbox-topbar__meta" }, isHistory ? /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-topbar__history-btn",
		onClick: () => navigate("/cashbox"),
		title: t?.history?.cashboxButton || t?.history?.backToCashbox || "Cashbox"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("rect", {
		x: "2",
		y: "3",
		width: "20",
		height: "14",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ __h("line", {
		x1: "8",
		y1: "21",
		x2: "16",
		y2: "21"
	}), /* @__PURE__ */ __h("line", {
		x1: "12",
		y1: "17",
		x2: "12",
		y2: "21"
	})), /* @__PURE__ */ __h("span", { className: "cashbox-topbar__history-text" }, t?.history?.cashboxButton || t?.history?.backToCashbox || "Cashbox")) : canAccessHistory && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-topbar__history-btn",
		onClick: () => navigate("/cashbox/history"),
		title: t?.history?.title || "Cashbox History"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 16 14" })), /* @__PURE__ */ __h("span", { className: "cashbox-topbar__history-text" }, t?.history?.historyButton || "History")), /* @__PURE__ */ __h("div", { className: "cashbox-topbar__chip" }, /* @__PURE__ */ __h("div", { className: "cashbox-topbar__avatar" }, /* @__PURE__ */ __h("img", {
		src: getUserAvatarUrl(cashierAvatar),
		alt: cashierName,
		className: "cashbox-topbar__avatar-img",
		onError: handleAvatarError
	})), /* @__PURE__ */ __h("span", null, /* @__PURE__ */ __h("span", { className: "cashbox-topbar__cashier-label" }, t?.cashier || "Cashier:", " "), /* @__PURE__ */ __h("strong", null, cashierName)))));
};
export default CashboxTopBar;
