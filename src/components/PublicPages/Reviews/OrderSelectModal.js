import { __h, __Fragment } from '../../../utils/runtime.js';
import React from "../../../utils/runtime.js";
import { motion } from "../../../utils/motion.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
import { formatBakuDateTime } from "./reviewsData.js";
import { useLang } from "../../../utils/useLang.js";
import { getReviewsTranslation } from "./Lang.js";
const OrderSelectModal = ({ isOpen, onClose, orders = [], selectedOrderId, onSelectOrder }) => {
	const lang = useLang();
	const t = (id) => getReviewsTranslation(lang, id);
	if (!isOpen) return null;
	return /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose,
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", {
		className: "order-select-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "order-select-modal__close",
		onClick: onClose,
		"aria-label": "Close order selector"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("line", {
		x1: "18",
		y1: "6",
		x2: "6",
		y2: "18"
	}), /* @__PURE__ */ __h("line", {
		x1: "6",
		y1: "6",
		x2: "18",
		y2: "18"
	}))), /* @__PURE__ */ __h("div", { className: "order-select-modal__header" }, /* @__PURE__ */ __h("div", { className: "order-select-modal__icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }), /* @__PURE__ */ __h("line", {
		x1: "3",
		y1: "6",
		x2: "21",
		y2: "6"
	}), /* @__PURE__ */ __h("path", { d: "M16 10a4 4 0 0 1-8 0" }))), /* @__PURE__ */ __h("h2", {
		className: "order-select-modal__title",
		"data-id": "reviews_order_select_title"
	}, t("reviews_order_select_title")), /* @__PURE__ */ __h("p", {
		className: "order-select-modal__desc",
		"data-id": "reviews_order_select_desc"
	}, t("reviews_order_select_desc"))), /* @__PURE__ */ __h("div", { className: "order-select-modal__list" }, orders.map((order) => {
		const isSelected = order.id === selectedOrderId;
		const shortId = order.id.slice(0, 8).toUpperCase();
		const total = Number(order.totalAmount || 0).toFixed(2);
		const items = order.items || [];
		return /* @__PURE__ */ __h(motion.div, {
			key: order.id,
			className: `order-select-card ${isSelected ? "order-select-card--selected" : ""}`,
			onClick: () => {
				onSelectOrder(order.id);
				onClose();
			},
			whileHover: { scale: 1.01 },
			whileTap: { scale: .99 }
		}, /* @__PURE__ */ __h("div", { className: "order-select-card__top" }, /* @__PURE__ */ __h("div", { className: "order-select-card__id-group" }, /* @__PURE__ */ __h("span", { className: "order-select-card__id" }, t("reviews_order_card_order"), " #", shortId), /* @__PURE__ */ __h("span", {
			className: "order-select-card__date",
			title: "Time in Baku (UTC+4)"
		}, formatBakuDateTime(order.createdAt))), /* @__PURE__ */ __h("div", { className: "order-select-card__price-group" }, /* @__PURE__ */ __h("span", { className: "order-select-card__price" }, total, " ₼"), /* @__PURE__ */ __h("div", { className: `order-select-card__radio ${isSelected ? "active" : ""}` }, isSelected && /* @__PURE__ */ __h("div", { className: "order-select-card__radio-dot" })))), items.length > 0 && /* @__PURE__ */ __h("div", { className: "order-select-card__items" }, items.map((item, idx) => {
			const iconUrl = item.images?.icon || item.images?.image || item.imageUrl;
			return /* @__PURE__ */ __h("div", {
				key: idx,
				className: "order-select-card__item-chip",
				title: `${item.name} (x${item.quantity || 1})`
			}, /* @__PURE__ */ __h("div", { className: "order-select-card__item-img-wrapper" }, iconUrl ? /* @__PURE__ */ __h("img", {
				src: iconUrl,
				alt: item.name || "Product",
				className: "order-select-card__item-img"
			}) : /* @__PURE__ */ __h("span", { className: "order-select-card__item-fallback" }, "☕")), /* @__PURE__ */ __h("span", { className: "order-select-card__item-name" }, item.name || "Coffee Item"), /* @__PURE__ */ __h("span", { className: "order-select-card__item-qty" }, "x", item.quantity || 1));
		})));
	})), /* @__PURE__ */ __h("div", { className: "order-select-modal__footer" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm order-select-modal__btn",
		onClick: onClose
	}, "Done"))));
};
export default OrderSelectModal;
