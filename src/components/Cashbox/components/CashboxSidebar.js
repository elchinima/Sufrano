import { __h, __Fragment } from '../../../utils/runtime.js';
import React from "../../../utils/runtime.js";
const getCategoryIcon = (category) => {
	const cat = (category || "").toLowerCase();
	if (cat.includes("drink") || cat.includes("coffee") || cat.includes("main")) {
		return /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }), /* @__PURE__ */ __h("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }), /* @__PURE__ */ __h("line", {
			x1: "6",
			y1: "1",
			x2: "6",
			y2: "4"
		}), /* @__PURE__ */ __h("line", {
			x1: "10",
			y1: "1",
			x2: "10",
			y2: "4"
		}), /* @__PURE__ */ __h("line", {
			x1: "14",
			y1: "1",
			x2: "14",
			y2: "4"
		}));
	}
	if (cat.includes("tea") || cat.includes("specialty")) {
		return /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M2 15h14a4 4 0 0 0 4-4V7H2v4a4 4 0 0 0 4 4z" }), /* @__PURE__ */ __h("path", { d: "M6 19h10" }), /* @__PURE__ */ __h("path", { d: "M18 10h2a2 2 0 0 0 0-4h-2" }));
	}
	if (cat.includes("dessert") || cat.includes("bakery") || cat.includes("sweet") || cat.includes("cake")) {
		return /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" }), /* @__PURE__ */ __h("path", { d: "M4 16s2-1 4-1 4 1 4 1 2-1 4-1 4 1 4 1" }), /* @__PURE__ */ __h("path", { d: "M2 21h20" }), /* @__PURE__ */ __h("path", { d: "M12 7V4" }), /* @__PURE__ */ __h("circle", {
			cx: "12",
			cy: "3",
			r: "1"
		}));
	}
	if (cat.includes("sandwich") || cat.includes("food")) {
		return /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M3 11h18a2 2 0 0 0 2-2V7a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2z" }), /* @__PURE__ */ __h("path", { d: "M2 15h20" }), /* @__PURE__ */ __h("path", { d: "M4 19h16a2 2 0 0 0 2-2v-2H2v2a2 2 0 0 0 2 2z" }));
	}
	return /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("rect", {
		x: "3",
		y: "3",
		width: "7",
		height: "7",
		rx: "1.5"
	}), /* @__PURE__ */ __h("rect", {
		x: "14",
		y: "3",
		width: "7",
		height: "7",
		rx: "1.5"
	}), /* @__PURE__ */ __h("rect", {
		x: "3",
		y: "14",
		width: "7",
		height: "7",
		rx: "1.5"
	}), /* @__PURE__ */ __h("rect", {
		x: "14",
		y: "14",
		width: "7",
		height: "7",
		rx: "1.5"
	}));
};
const CashboxSidebar = ({ categories = [
	"All",
	"Main Drinks",
	"Specialty Drinks",
	"Desserts"
], selectedCategory, onSelectCategory, onPromoClick, hasAppliedPromo = false, t }) => {
	return /* @__PURE__ */ __h("aside", { className: "cashbox-sidebar" }, /* @__PURE__ */ __h("nav", { className: "cashbox-sidebar__nav" }, categories.map((cat) => {
		const isActive = selectedCategory === cat;
		const displayLabel = t?.categories?.[cat] || cat;
		return /* @__PURE__ */ __h("button", {
			key: cat,
			type: "button",
			className: `cashbox-sidebar__btn ${isActive ? "cashbox-sidebar__btn--active" : ""}`,
			onClick: () => onSelectCategory(cat)
		}, /* @__PURE__ */ __h("div", { className: "cashbox-sidebar__icon" }, getCategoryIcon(cat)), /* @__PURE__ */ __h("span", { className: "cashbox-sidebar__label" }, displayLabel));
	})), /* @__PURE__ */ __h("div", { className: "cashbox-sidebar__bottom" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: `cashbox-sidebar__btn cashbox-sidebar__promo-btn ${hasAppliedPromo ? "cashbox-sidebar__promo-btn--active" : ""}`,
		onClick: onPromoClick,
		title: hasAppliedPromo ? t?.promoActive || "Promo code active" : t?.promoCodes || "Promo"
	}, /* @__PURE__ */ __h("div", { className: "cashbox-sidebar__icon" }, hasAppliedPromo && /* @__PURE__ */ __h("span", { className: "cashbox-sidebar__promo-dot" }), /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" }), /* @__PURE__ */ __h("path", { d: "M9 9h.01" }), /* @__PURE__ */ __h("path", { d: "M15 15h.01" }), /* @__PURE__ */ __h("path", { d: "M16 8L8 16" }))), /* @__PURE__ */ __h("span", { className: "cashbox-sidebar__label" }, hasAppliedPromo ? t?.promoActiveCount ? t.promoActiveCount(1) : "Promo (1)" : t?.promoCodes || "Promo"))));
};
export default CashboxSidebar;
