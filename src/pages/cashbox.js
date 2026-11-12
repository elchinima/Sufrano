(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/Cashbox/components/CashboxSidebar.js
	__define("components/Cashbox/components/CashboxSidebar.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
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

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return CashboxSidebar; } });
	});
	//#endregion

	//#region components/Cashbox/components/CashboxProductGrid.js
	__define("components/Cashbox/components/CashboxProductGrid.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { motion } = __require("utils/motion.js");
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

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return CashboxProductGrid; } });
	});
	//#endregion

	//#region components/Cashbox/components/CashboxReceipt.js
	__define("components/Cashbox/components/CashboxReceipt.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
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

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return CashboxReceipt; } });
	});
	//#endregion

	//#region components/Cashbox/components/CashboxPromoModal.js
	__define("components/Cashbox/components/CashboxPromoModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useRef, useCallback } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { API_URL } = __require("utils/config.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { getUserAvatarUrl, handleAvatarError } = __require("utils/avatar.js");
		const formatDate = (dateStr, lang = "az") => {
			if (!dateStr) return "—";
			try {
				const d = new Date(dateStr);
				if (isNaN(d.getTime())) return "—";
				const locale = lang === "az" ? "az-AZ" : lang === "ru" ? "ru-RU" : "en-GB";
				const formatter = new Intl.DateTimeFormat(locale, {
					timeZone: "Asia/Baku",
					day: "2-digit",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					hour12: false
				});
				return formatter.format(d);
			} catch {
				return "—";
			}
		};
		const CashboxPromoModal = ({ isOpen, onClose, appliedPromo = null, onApplyPromo, onRemovePromo, lang = "az", t }) => {
			const [query, setQuery] = useState("");
			const [loading, setLoading] = useState(false);
			const [results, setResults] = useState([]);
			const [hasSearched, setHasSearched] = useState(false);
			const [error, setError] = useState("");
			const inputRef = useRef(null);
			useEffect(() => {
				if (isOpen) {
					setQuery("");
					setResults([]);
					setHasSearched(false);
					setError("");
					setTimeout(() => {
						inputRef.current?.focus();
					}, 100);
				}
			}, [isOpen]);
			useEffect(() => {
				const handleKeyDown = (e) => {
					if (e.key === "Escape" && isOpen) {
						onClose();
					}
				};
				window.addEventListener("keydown", handleKeyDown);
				return () => window.removeEventListener("keydown", handleKeyDown);
			}, [isOpen, onClose]);
			const handleSearch = useCallback(async (searchVal) => {
				const term = (searchVal !== undefined ? searchVal : query).trim();
				if (!term) return;
				setLoading(true);
				setError("");
				setHasSearched(true);
				try {
					const res = await fetchWithRefresh(`${API_URL}/api/cashbox/promos/search?query=${encodeURIComponent(term)}`);
					if (res.ok) {
						const data = await res.json();
						const promoList = Array.isArray(data) ? data : [];
						const activePromos = promoList.filter((promo) => promo.isActive && !promo.isExpired);
						setResults(activePromos);
					} else {
						const errData = await res.json().catch(() => ({}));
						setError(errData.message || t?.promoSearchError || "Failed to search promo codes.");
					}
				} catch (err) {
					console.error("Error searching promo codes in cashbox:", err);
					setError(t?.promoNetworkError || "Network error while searching promo codes.");
				} finally {
					setLoading(false);
				}
			}, [query, t]);
			const handleSubmit = (e) => {
				e.preventDefault();
				handleSearch();
			};
			const getTranslatedPrize = (name) => {
				if (!name) return t?.promoDiscount || "Promo Discount";
				const n = String(name).toLowerCase();
				if (n.includes("free drink")) return t?.freeDrink || name;
				if (n.includes("free dessert")) return t?.freeDessert || name;
				if (n.includes("super prize")) return t?.superPrize || name;
				if (n.includes("25%")) return t?.discount25 || name;
				if (n.includes("50%")) return t?.discount50 || name;
				return name;
			};
			return /* @__PURE__ */ __h(AnimatePresence, null, isOpen && /* @__PURE__ */ __h(motion.div, {
				className: "cashbox-modal-backdrop cashbox-promo-backdrop",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				onClick: onClose
			}, /* @__PURE__ */ __h(motion.div, {
				className: "cashbox-promo-modal",
				initial: {
					opacity: 0,
					scale: .95,
					y: 20
				},
				animate: {
					opacity: 1,
					scale: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					scale: .95,
					y: 20
				},
				transition: {
					type: "spring",
					damping: 26,
					stiffness: 320
				},
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__header" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__title-group" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" }), /* @__PURE__ */ __h("path", { d: "M9 9h.01" }), /* @__PURE__ */ __h("path", { d: "M15 15h.01" }), /* @__PURE__ */ __h("path", { d: "M16 8L8 16" }))), /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h3", { className: "cashbox-promo-modal__title" }, t?.promoModalTitle || "Promo Code Lookup"), /* @__PURE__ */ __h("p", { className: "cashbox-promo-modal__subtitle" }, t?.promoModalSubtitle || "Search by barcode or promo code number"))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cashbox-promo-modal__close-btn",
				onClick: onClose,
				title: t?.closeModal || "Close modal",
				"aria-label": t?.closeModal || "Close modal"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.2",
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
			})))), /* @__PURE__ */ __h("form", {
				onSubmit: handleSubmit,
				className: "cashbox-promo-modal__search-form"
			}, /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__input-wrap" }, /* @__PURE__ */ __h("svg", {
				className: "cashbox-promo-modal__search-icon",
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
				ref: inputRef,
				type: "text",
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: t?.promoInputPlaceholder || "Barcode or promo code...",
				className: "cashbox-promo-modal__input"
			}), query && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cashbox-promo-modal__clear-btn",
				onClick: () => {
					setQuery("");
					setResults([]);
					setHasSearched(false);
					inputRef.current?.focus();
				},
				title: t?.clearSearch || "Clear search"
			}, "✕")), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "cashbox-promo-modal__submit-btn",
				disabled: loading || !query.trim()
			}, loading ? t?.searching || "Searching..." : t?.search || "Search")), /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__body" }, error && /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__error" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "8",
				x2: "12",
				y2: "12"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "16",
				x2: "12.01",
				y2: "16"
			})), /* @__PURE__ */ __h("span", null, error)), !hasSearched && !loading && /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__empty" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__empty-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}, /* @__PURE__ */ __h("rect", {
				x: "3",
				y: "4",
				width: "18",
				height: "16",
				rx: "2"
			}), /* @__PURE__ */ __h("line", {
				x1: "7",
				y1: "8",
				x2: "7",
				y2: "16"
			}), /* @__PURE__ */ __h("line", {
				x1: "11",
				y1: "8",
				x2: "11",
				y2: "16"
			}), /* @__PURE__ */ __h("line", {
				x1: "15",
				y1: "8",
				x2: "15",
				y2: "16"
			}), /* @__PURE__ */ __h("line", {
				x1: "17",
				y1: "8",
				x2: "17",
				y2: "16"
			}))), /* @__PURE__ */ __h("p", { className: "cashbox-promo-modal__empty-title" }, t?.scanOrEnter || "Scan or enter barcode / code"), /* @__PURE__ */ __h("p", { className: "cashbox-promo-modal__empty-text" }, t?.scanOrEnterDesc || "Enter customer's promo code or barcode to check validity, discount amount, and account owner.")), loading && /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__loading" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__spinner" }), /* @__PURE__ */ __h("span", null, t?.searchingDb || "Searching promo codes in database...")), hasSearched && !loading && results.length === 0 && !error && /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__empty" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__empty-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("line", {
				x1: "15",
				y1: "9",
				x2: "9",
				y2: "15"
			}), /* @__PURE__ */ __h("line", {
				x1: "9",
				y1: "9",
				x2: "15",
				y2: "15"
			}))), /* @__PURE__ */ __h("p", { className: "cashbox-promo-modal__empty-title" }, t?.noActivePromo || "No active promo code found"), /* @__PURE__ */ __h("p", { className: "cashbox-promo-modal__empty-text" }, t?.noActivePromoDesc ? t.noActivePromoDesc(query) : `No active promo codes match "${query}".`)), results.length > 0 && /* @__PURE__ */ __h("div", { className: "cashbox-promo-modal__results" }, results.map((promo) => {
				const isExpired = promo.isExpired;
				const isActive = promo.isActive && !isExpired;
				const prizeTitle = getTranslatedPrize(promo.prizeName);
				const ownerDisplay = promo.userName === "Unclaimed (Public Promo)" ? t?.unclaimedPublic || promo.userName : promo.userName === "Anonymous Customer" ? t?.anonymousCustomer || promo.userName : promo.userName || t?.accountOwner || "User";
				return /* @__PURE__ */ __h("div", {
					key: promo.id,
					className: `cashbox-promo-card ${isActive ? "cashbox-promo-card--active" : "cashbox-promo-card--expired"}`
				}, /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__header" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__prize-title" }, /* @__PURE__ */ __h("h4", null, prizeTitle), promo.prizeDescription && /* @__PURE__ */ __h("p", { className: "cashbox-promo-card__prize-desc" }, promo.prizeDescription)), /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__badges" }, isActive ? /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge cashbox-promo-badge--active" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge__dot" }), t?.active || "Active") : isExpired ? /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge cashbox-promo-badge--expired" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge__dot" }), t?.expired || "Expired") : /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge cashbox-promo-badge--inactive" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge__dot" }), t?.inactive || "Inactive"))), /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__owner" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__owner-avatar" }, /* @__PURE__ */ __h("img", {
					src: getUserAvatarUrl(promo.userAvatar),
					alt: ownerDisplay,
					onError: handleAvatarError
				})), /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__owner-info" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__owner-label" }, t?.accountOwner || "Account Owner"), /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__owner-name" }, ownerDisplay), promo.userEmail && /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__owner-email" }, promo.userEmail))), /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__codes" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__code-box" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-label" }, t?.promoCodeLabel || "Promo Code"), /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-value" }, promo.promoCode)), promo.barCode && /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__code-box cashbox-promo-card__code-box--barcode" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-label" }, t?.barcodeLabel || "Barcode Number"), /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-value cashbox-promo-card__code-value--barcode" }, promo.barCode)), promo.discountPercent > 0 && /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__discount-box" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-label" }, t?.discountLabel || "Discount"), /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__discount-value" }, "-", promo.discountPercent, "%")), promo.cashbackPercent > 0 && /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__discount-box" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-label" }, t?.cashbackLabel || "Cashback"), /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__discount-value" }, "+", promo.cashbackPercent, "%"))), isActive && /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__actions" }, appliedPromo?.id === promo.id || appliedPromo?.promoCode && String(appliedPromo.promoCode).toUpperCase() === String(promo.promoCode).toUpperCase() ? /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__applied-row" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__applied-status" }, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2.5"
				}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, t?.appliedToReceipt || "Applied to Receipt")), /* @__PURE__ */ __h("button", {
					type: "button",
					className: "cashbox-promo-card__remove-btn",
					onClick: () => onRemovePromo && onRemovePromo(),
					title: t?.removeFromReceipt || "Remove from receipt"
				}, t?.remove || "Remove")) : /* @__PURE__ */ __h(motion.button, {
					type: "button",
					className: "cashbox-promo-card__apply-btn",
					whileTap: { scale: .97 },
					onClick: () => {
						if (onApplyPromo) {
							onApplyPromo(promo);
							onClose();
						}
					}
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, t?.applyToOrder || "Apply to Order"))), /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__footer" }, /* @__PURE__ */ __h("span", null, t?.activated || "Activated:", " ", formatDate(promo.activatedAt, lang)), /* @__PURE__ */ __h("span", { className: isExpired ? "cashbox-promo-card__date--expired" : "" }, t?.expires || "Expires:", " ", formatDate(promo.expiresAt, lang))));
			}))))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return CashboxPromoModal; } });
	});
	//#endregion

	//#region components/Cashbox/Cashbox.js
	__define("components/Cashbox/Cashbox.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useMemo, useCallback } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { API_URL } = __require("utils/config.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { useLang } = __require("utils/useLang.js");
		const { getCashboxTranslation } = __require("components/Cashbox/Lang.js");
		const __imp_1 = __require("components/Cashbox/components/CashboxTopBar.js");
		const CashboxTopBar = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Cashbox/components/CashboxSidebar.js");
		const CashboxSidebar = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const __imp_3 = __require("components/Cashbox/components/CashboxProductGrid.js");
		const CashboxProductGrid = __imp_3.default !== undefined ? __imp_3.default : __imp_3;
		const __imp_4 = __require("components/Cashbox/components/CashboxReceipt.js");
		const CashboxReceipt = __imp_4.default !== undefined ? __imp_4.default : __imp_4;
		const __imp_5 = __require("components/Cashbox/components/CashboxPromoModal.js");
		const CashboxPromoModal = __imp_5.default !== undefined ? __imp_5.default : __imp_5;
		const Cashbox = () => {
			const { user } = useAuth();
			const lang = useLang();
			const t = useMemo(() => getCashboxTranslation(lang), [lang]);
			const [products, setProducts] = useState([]);
			const [categories, setCategories] = useState([
				"All",
				"Starters & Salads",
				"Soups",
				"Main Dishes",
				"Desserts",
				"Beverages"
			]);
			const [loading, setLoading] = useState(true);
			const [selectedCategory, setSelectedCategory] = useState("All");
			const [searchQuery, setSearchQuery] = useState("");
			const [cartItems, setCartItems] = useState([]);
			const [appliedPromo, setAppliedPromo] = useState(null);
			const [toast, setToast] = useState("");
			const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
			const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
			const [isDesktopSplit, setIsDesktopSplit] = useState(false);
			const [isMobilePaymentModalOpen, setIsMobilePaymentModalOpen] = useState(false);
			const cashierName = user?.name || user?.username || user?.Name || t.unknownUser || "Unknown User";
			const cashierAvatar = user?.profilePictureUrl || user?.ProfilePictureUrl || user?.avatarUrl || user?.avatar || null;
			const fetchInitData = useCallback(async () => {
				setLoading(true);
				try {
					const res = await fetchWithRefresh(`${API_URL}/api/cashbox/init?lang=${encodeURIComponent(lang || "az")}`);
					if (res.ok) {
						const data = await res.json();
						if (Array.isArray(data.products)) {
							setProducts(data.products);
						}
						if (Array.isArray(data.categories) && data.categories.length > 0) {
							setCategories(data.categories);
						}
					}
				} catch (err) {
					console.error("Failed to load cashbox data:", err);
				} finally {
					setLoading(false);
				}
			}, [lang]);
			useEffect(() => {
				fetchInitData();
			}, [fetchInitData]);
			useEffect(() => {
				if (products.length > 0 && cartItems.length > 0) {
					setCartItems((prev) => prev.map((item) => {
						const prod = products.find((p) => (p._id || p.id) === item.productId);
						if (prod) {
							return {
								...item,
								name: prod.displayName || prod.name || item.name,
								category: prod.category || item.category
							};
						}
						return item;
					}));
				}
			}, [products]);
			const filteredProducts = useMemo(() => {
				const q = searchQuery.trim().toLowerCase();
				return products.filter((item) => {
					const name = (item.displayName || item.name || "").toLowerCase();
					const desc = (item.displayDescription || item.description || "").toLowerCase();
					const category = (item.category || "").toLowerCase();
					const matchesSearch = !q || name.includes(q) || desc.includes(q) || category.includes(q);
					if (!matchesSearch) return false;
					if (selectedCategory === "All") return true;
					return item.category?.toLowerCase() === selectedCategory.toLowerCase();
				});
			}, [
				products,
				searchQuery,
				selectedCategory
			]);
			const getProductPrice = (item) => {
				const raw = item.prices?.price !== undefined ? item.prices.price : item.price;
				const base = typeof raw === "number" ? raw : parseFloat(raw) || 0;
				return Number(base.toFixed(2));
			};
			const addToCart = (product) => {
				const prodId = product._id || product.id;
				const price = getProductPrice(product);
				const prodName = product.displayName || product.name || "Item";
				const prodImg = product.imageUrl || product.image || "";
				const prodCategory = product.category || "General";
				setCartItems((prev) => {
					const existingIdx = prev.findIndex((i) => i.productId === prodId);
					if (existingIdx > -1) {
						const next = [...prev];
						next[existingIdx] = {
							...next[existingIdx],
							qty: next[existingIdx].qty + 1
						};
						return next;
					}
					return [...prev, {
						id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
						productId: prodId,
						name: prodName,
						image: prodImg,
						category: prodCategory,
						price,
						qty: 1
					}];
				});
			};
			const updateItemQty = (id, delta) => {
				setCartItems((prev) => {
					return prev.map((item) => {
						if (item.id === id) {
							const nextQty = item.qty + delta;
							return nextQty > 0 ? {
								...item,
								qty: nextQty
							} : null;
						}
						return item;
					}).filter(Boolean);
				});
			};
			const removeCartItem = (id) => {
				setCartItems((prev) => prev.filter((i) => i.id !== id));
			};
			const clearCart = () => {
				setCartItems([]);
				setAppliedPromo(null);
			};
			const subtotal = useMemo(() => {
				const sum = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
				return Number(sum.toFixed(2));
			}, [cartItems]);
			const promoDiscount = useMemo(() => {
				if (!appliedPromo || cartItems.length === 0 || subtotal <= 0) return 0;
				const pType = String(appliedPromo.prizeType || "").toLowerCase();
				const pName = String(appliedPromo.prizeName || "").toUpperCase();
				const discPercent = appliedPromo.discountPercent || (pType === "discount25" || pName.includes("25%") ? 25 : pType === "discount50" || pName.includes("50%") ? 50 : 0);
				if (discPercent > 0) {
					return Number(Math.min(subtotal, subtotal * discPercent / 100).toFixed(2));
				}
				if (pType === "superprize" || pType === "0" || pName.includes("SUPER")) {
					return Number(Math.min(subtotal, 25).toFixed(2));
				}
				if (pType === "freedrink" || pType === "1" || pName.includes("DRINK")) {
					const drinks = cartItems.filter((item) => {
						const cat = (item.category || "").toLowerCase();
						return cat.includes("drink") || cat.includes("beverage") || cat.includes("coffee") || cat.includes("tea");
					});
					if (drinks.length === 0) return 0;
					const totalDrinkQty = drinks.reduce((sum, x) => sum + x.qty, 0);
					const totalDrinkPrice = drinks.reduce((sum, x) => sum + x.price * x.qty, 0);
					const avgDrinkPrice = totalDrinkPrice / totalDrinkQty;
					return Number(Math.min(subtotal, avgDrinkPrice).toFixed(2));
				}
				if (pType === "freedessert" || pType === "2" || pName.includes("DESSERT")) {
					const desserts = cartItems.filter((item) => {
						const cat = (item.category || "").toLowerCase();
						return cat.includes("dessert") || cat.includes("sweet") || cat.includes("cake") || cat.includes("bakery");
					});
					if (desserts.length === 0) return 0;
					const totalDessertQty = desserts.reduce((sum, x) => sum + x.qty, 0);
					const totalDessertPrice = desserts.reduce((sum, x) => sum + x.price * x.qty, 0);
					const avgDessertPrice = totalDessertPrice / totalDessertQty;
					return Number(Math.min(subtotal, avgDessertPrice).toFixed(2));
				}
				return 0;
			}, [
				appliedPromo,
				cartItems,
				subtotal
			]);
			const totalAmount = useMemo(() => {
				return Number(Math.max(0, subtotal - promoDiscount).toFixed(2));
			}, [subtotal, promoDiscount]);
			const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
			const showToast = (msg) => {
				setToast(msg);
				setTimeout(() => setToast(""), 3500);
			};
			const handleApplyPromo = (promo) => {
				setAppliedPromo(promo);
				showToast(t.promoAppliedToast ? t.promoAppliedToast(promo.promoCode) : `Promo code ${promo.promoCode} applied!`);
			};
			const handleRemovePromo = () => {
				setAppliedPromo(null);
				showToast(t.promoRemovedToast || "Promo code removed from receipt.");
			};
			useEffect(() => {
				if (cartItems.length === 0) {
					setIsDesktopSplit(false);
					setIsMobilePaymentModalOpen(false);
				}
			}, [cartItems.length]);
			const handleConfirmOrder = async (payMethod = "Cash") => {
				if (cartItems.length === 0) {
					showToast(t.receiptEmptyToast || "Receipt is empty! Please add products.");
					return;
				}
				try {
					const res = await fetchWithRefresh(`${API_URL}/api/cashbox/orders`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							payMethod,
							products: cartItems.map((item) => ({
								productId: item.productId,
								quantity: item.qty
							})),
							initialAmount: subtotal,
							promoCodeId: appliedPromo ? appliedPromo.promoCode : null,
							totalAmount
						})
					});
					if (!res.ok) {
						const errData = await res.json().catch(() => ({}));
						showToast(errData.message || t.orderFailedToast || "Failed to process order.");
						return;
					}
					const usedCode = appliedPromo?.promoCode;
					const successMsg = payMethod === "Card" ? t.orderConfirmedCard ? t.orderConfirmedCard(totalAmount.toFixed(2), usedCode) : `Order confirmed (Card): ${totalAmount.toFixed(2)} ₼` : t.orderConfirmedCash ? t.orderConfirmedCash(totalAmount.toFixed(2), usedCode) : `Order confirmed (Cash): ${totalAmount.toFixed(2)} ₼`;
					showToast(successMsg);
					clearCart();
					setIsReceiptModalOpen(false);
					setIsMobilePaymentModalOpen(false);
					setIsDesktopSplit(false);
				} catch (err) {
					console.error("Failed to confirm cashbox order:", err);
					showToast(t.orderNetworkErrorToast || "Network error while processing order.");
				}
			};
			return /* @__PURE__ */ __h("div", { className: "cashbox-view" }, /* @__PURE__ */ __h(AnimatePresence, null, toast && /* @__PURE__ */ __h(motion.div, {
				className: "cashbox-view__toast",
				initial: {
					opacity: 0,
					y: -20,
					scale: .95
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: -20,
					scale: .95
				}
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" })), /* @__PURE__ */ __h("span", null, toast))), /* @__PURE__ */ __h(CashboxTopBar, {
				cashierName,
				cashierAvatar,
				searchQuery,
				setSearchQuery,
				t
			}), /* @__PURE__ */ __h("div", { className: "cashbox-view__workspace" }, /* @__PURE__ */ __h(CashboxSidebar, {
				categories,
				selectedCategory,
				onSelectCategory: setSelectedCategory,
				onPromoClick: () => setIsPromoModalOpen(true),
				hasAppliedPromo: Boolean(appliedPromo),
				t
			}), /* @__PURE__ */ __h("main", { className: "cashbox-view__catalog" }, /* @__PURE__ */ __h(CashboxProductGrid, {
				products: filteredProducts,
				loading,
				onAddToCart: addToCart,
				getProductPrice,
				onResetSearch: () => {
					setSearchQuery("");
					setSelectedCategory("All");
				},
				t
			})), /* @__PURE__ */ __h("aside", { className: "cashbox-view__checkout" }, /* @__PURE__ */ __h(CashboxReceipt, {
				cartItems,
				onUpdateQty: updateItemQty,
				onRemoveItem: removeCartItem,
				onClearCart: clearCart,
				subtotal,
				promoDiscount,
				totalAmount,
				appliedPromo,
				onRemovePromo: handleRemovePromo,
				onOpenPromoModal: () => setIsPromoModalOpen(true),
				t
			}), /* @__PURE__ */ __h("div", { className: "cashbox-confirm-container" }, /* @__PURE__ */ __h(AnimatePresence, { mode: "wait" }, !isDesktopSplit ? /* @__PURE__ */ __h(motion.button, {
				key: "confirm-single",
				type: "button",
				className: "cashbox-confirm-btn",
				whileTap: { scale: .98 },
				onClick: () => {
					if (cartItems.length === 0) {
						showToast(t.receiptEmptyToast || "Receipt is empty! Please add products.");
						return;
					}
					setIsDesktopSplit(true);
				},
				disabled: cartItems.length === 0,
				initial: {
					opacity: 0,
					scale: .98
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: {
					opacity: 0,
					scale: .98
				},
				transition: { duration: .18 }
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5"
			}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, t.confirm)) : /* @__PURE__ */ __h(motion.div, {
				key: "confirm-split",
				className: "cashbox-confirm-split-wrap",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .18 }
			}, /* @__PURE__ */ __h(motion.button, {
				type: "button",
				className: "cashbox-confirm-split-btn cashbox-confirm-split-btn--cash",
				initial: {
					x: -24,
					opacity: 0,
					scale: .92
				},
				animate: {
					x: 0,
					opacity: 1,
					scale: 1
				},
				exit: {
					x: -20,
					opacity: 0
				},
				transition: {
					type: "spring",
					stiffness: 450,
					damping: 26
				},
				whileHover: { scale: 1.02 },
				whileTap: { scale: .96 },
				onClick: () => handleConfirmOrder("Cash")
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("rect", {
				x: "2",
				y: "6",
				width: "20",
				height: "12",
				rx: "2"
			}), /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "2"
			}), /* @__PURE__ */ __h("path", { d: "M6 12h.01M18 12h.01" })), /* @__PURE__ */ __h("span", null, t.cash)), /* @__PURE__ */ __h(motion.button, {
				type: "button",
				className: "cashbox-confirm-split-btn cashbox-confirm-split-btn--card",
				initial: {
					x: 24,
					opacity: 0,
					scale: .92
				},
				animate: {
					x: 0,
					opacity: 1,
					scale: 1
				},
				exit: {
					x: 20,
					opacity: 0
				},
				transition: {
					type: "spring",
					stiffness: 450,
					damping: 26
				},
				whileHover: { scale: 1.02 },
				whileTap: { scale: .96 },
				onClick: () => handleConfirmOrder("Card")
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("rect", {
				x: "2",
				y: "5",
				width: "20",
				height: "14",
				rx: "2"
			}), /* @__PURE__ */ __h("line", {
				x1: "2",
				y1: "10",
				x2: "22",
				y2: "10"
			})), /* @__PURE__ */ __h("span", null, t.card)), /* @__PURE__ */ __h(motion.button, {
				type: "button",
				className: "cashbox-confirm-split-cancel",
				onClick: () => setIsDesktopSplit(false),
				title: t.cancel,
				"aria-label": t.cancelSplit || t.cancel,
				initial: {
					scale: 0,
					opacity: 0
				},
				animate: {
					scale: 1,
					opacity: 1
				},
				exit: {
					scale: 0,
					opacity: 0
				},
				transition: { duration: .15 },
				whileHover: { scale: 1.08 },
				whileTap: { scale: .9 }
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5"
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
			})))))))), /* @__PURE__ */ __h(motion.button, {
				type: "button",
				className: "cashbox-mobile-trigger",
				onClick: () => setIsReceiptModalOpen(true),
				whileTap: { scale: .96 },
				"aria-label": t.electronicReceipt || "Electronic Receipt"
			}, /* @__PURE__ */ __h("div", { className: "cashbox-mobile-trigger__left" }, /* @__PURE__ */ __h("div", { className: "cashbox-mobile-trigger__icon-wrap" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6l-3-4z" }), /* @__PURE__ */ __h("line", {
				x1: "3",
				y1: "6",
				x2: "21",
				y2: "6"
			}), /* @__PURE__ */ __h("path", { d: "M16 10a4 4 0 0 1-8 0" })), totalItemsCount > 0 && /* @__PURE__ */ __h("span", { className: "cashbox-mobile-trigger__badge" }, totalItemsCount)), /* @__PURE__ */ __h("span", { className: "cashbox-mobile-trigger__label" }, t.electronicReceipt || "Electronic Receipt")), /* @__PURE__ */ __h("div", { className: "cashbox-mobile-trigger__right" }, /* @__PURE__ */ __h("span", { className: "cashbox-mobile-trigger__amount" }, totalAmount.toFixed(2), " ", /* @__PURE__ */ __h("span", { className: "currency-symbol" }, "₼")), /* @__PURE__ */ __h("div", { className: "cashbox-mobile-trigger__chevron-wrap" }, /* @__PURE__ */ __h("svg", {
				className: "cashbox-mobile-trigger__chevron",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("polyline", { points: "18 15 12 9 6 15" }))))), /* @__PURE__ */ __h(AnimatePresence, null, isReceiptModalOpen && /* @__PURE__ */ __h(motion.div, {
				className: "cashbox-modal-backdrop",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				onClick: () => setIsReceiptModalOpen(false)
			}, /* @__PURE__ */ __h(motion.div, {
				className: "cashbox-modal",
				initial: {
					opacity: 0,
					y: 100,
					scale: .96
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: 100,
					scale: .96
				},
				transition: {
					type: "spring",
					damping: 25,
					stiffness: 300
				},
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "cashbox-modal__header" }, /* @__PURE__ */ __h("div", { className: "cashbox-modal__title-group" }, /* @__PURE__ */ __h("h3", { className: "cashbox-modal__title" }, t.currentOrder || "Current Order"), cartItems.length > 0 && /* @__PURE__ */ __h("span", { className: "cashbox-modal__items-count" }, cartItems.reduce((acc, it) => acc + (it.qty || it.quantity || 1), 0))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cashbox-modal__close-btn",
				onClick: () => setIsReceiptModalOpen(false),
				title: t.closeReceipt || "Close receipt",
				"aria-label": t.closeReceipt || "Close receipt"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.2",
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
			})))), /* @__PURE__ */ __h("div", { className: "cashbox-modal__scrollable" }, /* @__PURE__ */ __h(CashboxReceipt, {
				cartItems,
				onUpdateQty: updateItemQty,
				onRemoveItem: removeCartItem,
				onClearCart: clearCart,
				subtotal,
				promoDiscount,
				totalAmount,
				appliedPromo,
				onRemovePromo: handleRemovePromo,
				onOpenPromoModal: () => setIsPromoModalOpen(true),
				t
			}), /* @__PURE__ */ __h(motion.button, {
				type: "button",
				className: "cashbox-confirm-btn",
				whileTap: { scale: .98 },
				onClick: () => {
					if (cartItems.length === 0) {
						showToast(t.receiptEmptyToast || "Receipt is empty! Please add products.");
						return;
					}
					setIsMobilePaymentModalOpen(true);
				},
				disabled: cartItems.length === 0
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5"
			}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, t.confirm)))))), /* @__PURE__ */ __h(AnimatePresence, null, isMobilePaymentModalOpen && /* @__PURE__ */ __h(motion.div, {
				className: "cashbox-modal-backdrop cashbox-paymethod-backdrop",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				onClick: () => setIsMobilePaymentModalOpen(false)
			}, /* @__PURE__ */ __h(motion.div, {
				className: "cashbox-paymethod-modal",
				initial: {
					opacity: 0,
					y: 50,
					scale: .94
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: 50,
					scale: .94
				},
				transition: {
					type: "spring",
					damping: 25,
					stiffness: 320
				},
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "cashbox-paymethod-modal__header" }, /* @__PURE__ */ __h("div", { className: "cashbox-paymethod-modal__title-group" }, /* @__PURE__ */ __h("div", { className: "cashbox-paymethod-modal__icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("rect", {
				x: "2",
				y: "5",
				width: "20",
				height: "14",
				rx: "2"
			}), /* @__PURE__ */ __h("line", {
				x1: "2",
				y1: "10",
				x2: "22",
				y2: "10"
			}))), /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h3", { className: "cashbox-paymethod-modal__title" }, t.selectPayMethod || "Payment Method"), /* @__PURE__ */ __h("p", { className: "cashbox-paymethod-modal__total" }, t.totalToPay || t.total || "Total:", " ", /* @__PURE__ */ __h("span", null, totalAmount.toFixed(2), " ₼")))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cashbox-modal__close-btn",
				onClick: () => setIsMobilePaymentModalOpen(false),
				title: t.closeModal || "Close",
				"aria-label": t.closeModal || "Close"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.2",
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
			})))), /* @__PURE__ */ __h("div", { className: "cashbox-paymethod-modal__options" }, /* @__PURE__ */ __h(motion.button, {
				type: "button",
				className: "cashbox-paymethod-card cashbox-paymethod-card--cash",
				whileTap: { scale: .97 },
				onClick: () => handleConfirmOrder("Cash")
			}, /* @__PURE__ */ __h("div", { className: "cashbox-paymethod-card__icon-wrap" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("rect", {
				x: "2",
				y: "6",
				width: "20",
				height: "12",
				rx: "2"
			}), /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "2"
			}), /* @__PURE__ */ __h("path", { d: "M6 12h.01M18 12h.01" }))), /* @__PURE__ */ __h("div", { className: "cashbox-paymethod-card__info" }, /* @__PURE__ */ __h("span", { className: "cashbox-paymethod-card__title" }, t.cash), /* @__PURE__ */ __h("span", { className: "cashbox-paymethod-card__desc" }, t.cashDesc)), /* @__PURE__ */ __h("div", { className: "cashbox-paymethod-card__arrow" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5"
			}, /* @__PURE__ */ __h("polyline", { points: "9 18 15 12 9 6" })))), /* @__PURE__ */ __h(motion.button, {
				type: "button",
				className: "cashbox-paymethod-card cashbox-paymethod-card--card",
				whileTap: { scale: .97 },
				onClick: () => handleConfirmOrder("Card")
			}, /* @__PURE__ */ __h("div", { className: "cashbox-paymethod-card__icon-wrap" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("rect", {
				x: "2",
				y: "5",
				width: "20",
				height: "14",
				rx: "2"
			}), /* @__PURE__ */ __h("line", {
				x1: "2",
				y1: "10",
				x2: "22",
				y2: "10"
			}))), /* @__PURE__ */ __h("div", { className: "cashbox-paymethod-card__info" }, /* @__PURE__ */ __h("span", { className: "cashbox-paymethod-card__title" }, t.card), /* @__PURE__ */ __h("span", { className: "cashbox-paymethod-card__desc" }, t.cardDesc)), /* @__PURE__ */ __h("div", { className: "cashbox-paymethod-card__arrow" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5"
			}, /* @__PURE__ */ __h("polyline", { points: "9 18 15 12 9 6" })))))))), /* @__PURE__ */ __h(CashboxPromoModal, {
				isOpen: isPromoModalOpen,
				onClose: () => setIsPromoModalOpen(false),
				appliedPromo,
				onApplyPromo: handleApplyPromo,
				onRemovePromo: handleRemovePromo,
				lang,
				t
			}));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Cashbox; } });
	});
	//#endregion

	var entryExports = __require("components/Cashbox/Cashbox.js");
	__pages["cashbox"] = entryExports.default || entryExports;
})();
