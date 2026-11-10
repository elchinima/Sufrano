import { __h, __Fragment } from '../../../utils/runtime.js';
import React from "../../../utils/runtime.js";
import { motion } from "../../../utils/motion.js";
const CashboxProductGrid = ({ products, loading, onAddToCart, getProductPrice, onResetSearch, t }) => {
	if (loading) {
		return /* @__PURE__ */ __h("div", { className: "cashbox-grid cashbox-grid--loading" }, Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ __h("div", {
			key: i,
			className: "cashbox-card cashbox-card--skeleton"
		}, /* @__PURE__ */ __h("div", { className: "cashbox-card__skeleton-img" }), /* @__PURE__ */ __h("div", { className: "cashbox-card__skeleton-line" }), /* @__PURE__ */ __h("div", { className: "cashbox-card__skeleton-line cashbox-card__skeleton-line--short" }))));
	}
	if (products.length === 0) {
		return /* @__PURE__ */ __h("div", { className: "cashbox-grid__empty" }, /* @__PURE__ */ __h("div", { className: "cashbox-grid__empty-icon" }, "☕"), /* @__PURE__ */ __h("h3", null, t?.noProductsFound || "No Products Found"), /* @__PURE__ */ __h("p", null, t?.noProductsDesc || "Try adjusting your search query or select a different category"), onResetSearch && /* @__PURE__ */ __h("button", {
			type: "button",
			className: "cashbox-grid__empty-btn",
			onClick: onResetSearch
		}, t?.resetFilters || "Reset Filters"));
	}
	const getProductImage = (item) => {
		if (!item) return null;
		if (item.images && typeof item.images === "object") {
			const icon = item.images.icon || item.images.Icon;
			const img = item.images.image || item.images.Image;
			if (icon) return icon;
			if (img) return img;
		}
		if (typeof item.images === "string" && item.images.trim().startsWith("{")) {
			try {
				const parsed = JSON.parse(item.images);
				const icon = parsed.icon || parsed.Icon;
				const img = parsed.image || parsed.Image;
				if (icon) return icon;
				if (img) return img;
			} catch {}
		}
		return item.imageUrl || item.iconUrl || item.image || item.icon || null;
	};
	return /* @__PURE__ */ __h("div", { className: "cashbox-grid" }, products.map((item) => {
		const prodId = item._id || item.id;
		const price = getProductPrice(item);
		const name = item.displayName || item.name || t?.productDefault || "Product";
		const img = getProductImage(item);
		return /* @__PURE__ */ __h(motion.div, {
			key: prodId,
			className: "cashbox-card",
			whileTap: { scale: .98 },
			onClick: () => onAddToCart(item)
		}, /* @__PURE__ */ __h("div", { className: "cashbox-card__img-wrap" }, img ? /* @__PURE__ */ __h("img", {
			src: img,
			alt: name,
			className: "cashbox-card__img",
			loading: "lazy",
			onError: (e) => {
				e.currentTarget.style.display = "none";
				const ph = e.currentTarget.parentElement?.querySelector(".cashbox-card__img-placeholder");
				if (ph) ph.style.display = "flex";
			}
		}) : null, /* @__PURE__ */ __h("div", {
			className: "cashbox-card__img-placeholder",
			style: { display: img ? "none" : "flex" }
		}, "☕")), /* @__PURE__ */ __h("div", { className: "cashbox-card__info" }, /* @__PURE__ */ __h("span", {
			className: "cashbox-card__title",
			title: name
		}, name), /* @__PURE__ */ __h("div", { className: "cashbox-card__price-row" }, /* @__PURE__ */ __h("span", { className: "cashbox-card__price" }, price.toFixed(2), " ₼"), /* @__PURE__ */ __h("span", { className: "cashbox-card__add-badge" }, "+"))));
	}));
};
export default CashboxProductGrid;
