import { __h, __Fragment } from '../../../utils/runtime.js';
import React from "../../../utils/runtime.js";
const CashboxReceipt = ({ cartItems, onUpdateQty, onRemoveItem, onClearCart, subtotal = 0, promoDiscount = 0, totalAmount = 0, appliedPromo = null, onRemovePromo, onOpenPromoModal, t }) => {
	return /* @__PURE__ */ __h("div", { className: "cashbox-receipt" }, /* @__PURE__ */ __h("div", { className: "cashbox-receipt__zigzag" }), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__header" }, /* @__PURE__ */ __h("div", { className: "cashbox-receipt__header-top" }, /* @__PURE__ */ __h("span", { className: "cashbox-receipt__title" }, t?.electronicReceipt || "Electronic Receipt"), cartItems.length > 0 && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-receipt__clear-btn",
		onClick: onClearCart,
		title: t?.clearReceiptTitle || "Clear receipt"
	}, t?.clearReceipt || "Clear")), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__divider-dashed" })), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__body" }, cartItems.length === 0 ? /* @__PURE__ */ __h("div", { className: "cashbox-receipt__empty" }, /* @__PURE__ */ __h("span", null, t?.receiptEmpty || "Receipt is empty"), /* @__PURE__ */ __h("small", null, t?.receiptEmptyDesc || "Select beverages or desserts from the catalog")) : /* @__PURE__ */ __h("div", { className: "cashbox-receipt__items" }, cartItems.map((item) => {
		const lineTotal = (item.price * item.qty).toFixed(2);
		return /* @__PURE__ */ __h("div", {
			key: item.id,
			className: "cashbox-receipt__row"
		}, item.image && /* @__PURE__ */ __h("div", { className: "cashbox-receipt__thumb-wrap" }, /* @__PURE__ */ __h("img", {
			src: item.image,
			alt: "",
			className: "cashbox-receipt__thumb-img",
			onError: (e) => {
				e.currentTarget.parentElement.style.display = "none";
			}
		})), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__col-name" }, /* @__PURE__ */ __h("span", { className: "cashbox-receipt__item-name" }, item.name), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__stepper" }, /* @__PURE__ */ __h("button", {
			type: "button",
			onClick: () => onUpdateQty(item.id, -1),
			className: "cashbox-receipt__step-btn",
			title: t?.decreaseQty || "Decrease quantity"
		}, "-"), /* @__PURE__ */ __h("span", { className: "cashbox-receipt__qty" }, "x", item.qty), /* @__PURE__ */ __h("button", {
			type: "button",
			onClick: () => onUpdateQty(item.id, 1),
			className: "cashbox-receipt__step-btn",
			title: t?.increaseQty || "Increase quantity"
		}, "+"), /* @__PURE__ */ __h("button", {
			type: "button",
			onClick: () => onRemoveItem(item.id),
			className: "cashbox-receipt__del-btn",
			title: t?.removeItem || "Remove item"
		}, "✕"))), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__col-price" }, /* @__PURE__ */ __h("span", { className: "cashbox-receipt__item-total" }, lineTotal, " ₼")));
	})), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__promo-section" }, appliedPromo ? /* @__PURE__ */ __h("div", { className: "cashbox-receipt__promo-card" }, /* @__PURE__ */ __h("div", { className: "cashbox-receipt__promo-header" }, /* @__PURE__ */ __h("div", { className: "cashbox-receipt__promo-badge" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" }), /* @__PURE__ */ __h("path", { d: "M9 9h.01" }), /* @__PURE__ */ __h("path", { d: "M15 15h.01" }), /* @__PURE__ */ __h("path", { d: "M16 8L8 16" })), /* @__PURE__ */ __h("span", null, appliedPromo.promoCode)), onRemovePromo && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-receipt__promo-remove",
		onClick: onRemovePromo,
		title: t?.removePromo || "Remove promo code"
	}, "✕")), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__promo-details" }, /* @__PURE__ */ __h("span", { className: "cashbox-receipt__promo-prize" }, appliedPromo.prizeName || t?.promoDiscount || "Promo Discount"), promoDiscount > 0 && /* @__PURE__ */ __h("span", { className: "cashbox-receipt__promo-amount" }, "-", promoDiscount.toFixed(2), " ₼"))) : /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-receipt__add-promo-btn",
		onClick: onOpenPromoModal
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" }), /* @__PURE__ */ __h("path", { d: "M9 9h.01" }), /* @__PURE__ */ __h("path", { d: "M15 15h.01" }), /* @__PURE__ */ __h("path", { d: "M16 8L8 16" })), /* @__PURE__ */ __h("span", null, t?.usePromoCode || "Use Promo Code")))), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__footer" }, /* @__PURE__ */ __h("div", { className: "cashbox-receipt__divider-dashed" }), promoDiscount > 0 && /* @__PURE__ */ __h("div", { className: "cashbox-receipt__subtotal-group" }, /* @__PURE__ */ __h("div", { className: "cashbox-receipt__summary-row" }, /* @__PURE__ */ __h("span", { className: "cashbox-receipt__summary-label" }, t?.subtotal || "Subtotal:"), /* @__PURE__ */ __h("span", { className: "cashbox-receipt__summary-val" }, subtotal.toFixed(2), " ₼")), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__summary-row cashbox-receipt__summary-row--discount" }, /* @__PURE__ */ __h("span", { className: "cashbox-receipt__summary-label" }, t?.promoDiscountLabel ? t.promoDiscountLabel(appliedPromo?.promoCode) : `Promo Discount ${appliedPromo ? `(${appliedPromo.promoCode})` : ""}:`), /* @__PURE__ */ __h("span", { className: "cashbox-receipt__summary-val" }, "-", promoDiscount.toFixed(2), " ₼"))), /* @__PURE__ */ __h("div", { className: "cashbox-receipt__total-row" }, /* @__PURE__ */ __h("span", { className: "cashbox-receipt__total-label" }, t?.total || "Total:"), /* @__PURE__ */ __h("span", { className: "cashbox-receipt__total-val" }, totalAmount.toFixed(2), " ₼"))));
};
export default CashboxReceipt;
