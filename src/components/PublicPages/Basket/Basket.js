import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useRef, useMemo } from "../../../utils/runtime.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import { Link, useNavigate } from "../../../utils/router.js";
const cartAnimated = "/assets/icons/cart-animated.svg";
const giftAnimated = "/assets/icons/gift-animated.svg";
const loaderIcon = "/assets/icons/loader-animated.svg";
import Footer from "../../Footer/Footer.js";
import Navbar from "../../Elements/Navbar.js";
import DeleteConfirmModal from "../../Elements/DeleteConfirmModal.js";
import FitText from "../../Elements/FitText.js";
import { useAuth } from "../../../context/AuthContext.js";
import { useBasket } from "../../../context/BasketContext.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import useSequentialImageLoader from "../../../utils/useSequentialImageLoader.js";
import { useLang } from "../../../utils/useLang.js";
import { getBasketTranslation, formatLocalizedPrizeName } from "./Lang.js";
const Basket = () => {
	const { user, logout, authLoading } = useAuth();
	const { items, addItem, removeItem, deleteItem, loading: basketLoading } = useBasket();
	const navigate = useNavigate();
	const lang = useLang();
	const t = (id) => getBasketTranslation(lang, id);
	const [products, setProducts] = useState({});
	const [productsLoading, setProductsLoading] = useState(true);
	const [itemToDelete, setItemToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [flashingItemIds, setFlashingItemIds] = useState({});
	const [userPromos, setUserPromos] = useState([]);
	const [selectedPromoCode, setSelectedPromoCode] = useState("");
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
				const response = await fetch(`${apiUrl}/api/products`);
				if (response.ok) {
					const data = await response.json();
					const productMap = {};
					data.forEach((categoryGroup) => {
						categoryGroup.items.forEach((item) => {
							productMap[item.id] = {
								...item,
								category: item.category || categoryGroup.category
							};
						});
					});
					setProducts(productMap);
				}
			} catch (err) {
				console.error("Failed to fetch products:", err);
			} finally {
				setProductsLoading(false);
			}
		};
		fetchProducts();
	}, []);
	useEffect(() => {
		if (!user) return;
		const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
		fetchWithRefresh(`${apiUrl}/api/auth/promos`).then((r) => r.json()).then((data) => {
			if (Array.isArray(data)) {
				const actives = data.filter((p) => p.isActive && !p.isExpired);
				setUserPromos(actives);
				if (actives.length > 0) {
					setSelectedPromoCode(actives[0].promoCode);
				}
			}
		}).catch(() => {});
	}, [user]);
	const activePromo = useMemo(() => {
		if (!selectedPromoCode || selectedPromoCode === "NONE") return null;
		return userPromos.find((p) => p.promoCode === selectedPromoCode) || null;
	}, [selectedPromoCode, userPromos]);
	const handleConfirmDelete = async () => {
		if (!itemToDelete) return;
		const productId = itemToDelete.productId;
		setItemToDelete(null);
		setIsDeleting(false);
		try {
			await deleteItem(productId);
		} catch (err) {
			console.error("Failed to delete item:", err);
		}
	};
	const handleDecrease = (item) => {
		if (item.quantity <= 1) {
			setItemToDelete(item);
		} else {
			removeItem(item.productId);
		}
	};
	const handleIncrease = (item) => {
		if (item.quantity >= 100) {
			setFlashingItemIds((prev) => ({
				...prev,
				[item.productId]: true
			}));
			setTimeout(() => {
				setFlashingItemIds((prev) => {
					const next = { ...prev };
					delete next[item.productId];
					return next;
				});
			}, 2500);
			return;
		}
		addItem(item.productId);
	};
	const isLoading = authLoading || basketLoading || productsLoading;
	const enrichedItems = useMemo(() => {
		return items.map((item) => {
			const product = products[item.productId];
			if (!product) return null;
			const unitPrice = parseFloat(product.prices?.discountPrice || product.prices?.price || product.price || 0);
			const totalPrice = (unitPrice * item.quantity).toFixed(2);
			return {
				...item,
				product,
				unitPrice,
				totalPrice
			};
		}).filter(Boolean);
	}, [items, products]);
	const orderedBasketItems = useMemo(() => {
		return enrichedItems.map((item) => ({
			id: item.productId,
			imageUrl: item.product?.images?.icon || item.product?.images?.image || item.product?.imageUrl
		}));
	}, [enrichedItems]);
	const loadedImages = useSequentialImageLoader(orderedBasketItems);
	const grandTotal = enrichedItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
	const promoDiscountAmount = useMemo(() => {
		if (!activePromo || !activePromo.isActive || enrichedItems.length === 0) return 0;
		const numericTotal = parseFloat(grandTotal) || 0;
		if (numericTotal <= 0) return 0;
		const pType = String(activePromo.prizeType || "").toLowerCase();
		const pName = String(activePromo.prizeName || "").toUpperCase();
		const discPercent = activePromo.discountPercent || (pType === "discount25" || pName.includes("25%") ? 25 : pType === "discount50" || pName.includes("50%") ? 50 : 0);
		if (discPercent > 0) {
			return Math.round(numericTotal * discPercent) / 100;
		}
		if (pType === "superprize" || pType === "0" || pName.includes("SUPER")) {
			return Math.min(numericTotal, 25);
		}
		if (pType === "freedrink" || pType === "1" || pName.includes("DRINK")) {
			const drinks = enrichedItems.filter((x) => {
				const cat = (x.product?.category || "").toLowerCase();
				return cat.includes("drink");
			});
			if (drinks.length === 0) return 0;
			const totalQty = drinks.reduce((sum, x) => sum + x.quantity, 0);
			const totalPrice = drinks.reduce((sum, x) => sum + x.unitPrice * x.quantity, 0);
			return Math.round(totalPrice / totalQty * 100) / 100;
		}
		if (pType === "freedessert" || pType === "2" || pName.includes("DESSERT")) {
			const desserts = enrichedItems.filter((x) => {
				const cat = (x.product?.category || "").toLowerCase();
				return cat.includes("dessert");
			});
			if (desserts.length === 0) return 0;
			const totalQty = desserts.reduce((sum, x) => sum + x.quantity, 0);
			const totalPrice = desserts.reduce((sum, x) => sum + x.unitPrice * x.quantity, 0);
			return Math.round(totalPrice / totalQty * 100) / 100;
		}
		return 0;
	}, [
		activePromo,
		enrichedItems,
		grandTotal
	]);
	const discountedTotal = Math.max(0, parseFloat(grandTotal) - promoDiscountAmount).toFixed(2);
	return /* @__PURE__ */ __h(motion.div, {
		className: "basket-page",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .3 }
	}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "basket-main" }, /* @__PURE__ */ __h("div", { className: "basket-hero" }, /* @__PURE__ */ __h("h1", null, t("basket_hero_title")), /* @__PURE__ */ __h("p", null, t("basket_hero_subtitle"))), isLoading ? /* @__PURE__ */ __h("div", { className: "basket-loading" }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading"
	})) : enrichedItems.length === 0 ? /* @__PURE__ */ __h(motion.div, {
		className: "basket-empty",
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .5 }
	}, /* @__PURE__ */ __h("div", { className: "empty-icon" }, /* @__PURE__ */ __h("img", {
		src: cartAnimated,
		alt: "Cart"
	})), /* @__PURE__ */ __h("h2", null, t("basket_empty_title")), /* @__PURE__ */ __h("p", null, t("basket_empty_subtitle")), /* @__PURE__ */ __h(Link, {
		to: "/catalog",
		className: "cta-btn"
	}, t("basket_empty_btn"))) : /* @__PURE__ */ __h("div", { className: "basket-content" }, /* @__PURE__ */ __h("div", { className: "basket-items" }, /* @__PURE__ */ __h(AnimatePresence, null, enrichedItems.map((item, index) => /* @__PURE__ */ __h(motion.div, {
		key: item.productId,
		className: "basket-item",
		initial: {
			opacity: 0,
			y: 15
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			x: -20,
			height: 0,
			marginBottom: 0,
			padding: 0
		},
		transition: {
			duration: .25,
			delay: index * .03
		},
		layout: true
	}, /* @__PURE__ */ __h("div", { className: "basket-item-image" }, item.product?.images?.icon || item.product?.images?.image || item.product?.imageUrl ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
		src: item.product?.images?.icon || item.product?.images?.image || item.product?.imageUrl,
		alt: item.product.name,
		loading: "lazy",
		onLoad: () => loadedImages.markLoaded?.(item.productId),
		className: loadedImages[item.productId] ? "loaded" : ""
	}), !loadedImages[item.productId] && /* @__PURE__ */ __h("div", { className: "basket-item-image-placeholder" }, "☕")) : /* @__PURE__ */ __h("div", { className: "basket-item-image-placeholder" }, "☕")), /* @__PURE__ */ __h("div", { className: "basket-item-body" }, /* @__PURE__ */ __h("div", { className: "basket-item-main" }, /* @__PURE__ */ __h("div", { className: "basket-item-info" }, /* @__PURE__ */ __h(FitText, {
		as: "h3",
		className: "basket-item-name",
		maxFontSize: 1.15,
		minFontSize: .72
	}, item.product.name), /* @__PURE__ */ __h("span", { className: "basket-item-unit-price" }, item.unitPrice.toFixed(2), " ₼ ", t("basket_unit_price"))), /* @__PURE__ */ __h("button", {
		className: "basket-item-delete mobile-delete",
		onClick: () => setItemToDelete(item),
		"aria-label": "Remove item"
	}, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6l-1 14H6L5 6" }), /* @__PURE__ */ __h("path", { d: "M10 11v6M14 11v6" }), /* @__PURE__ */ __h("path", { d: "M9 6V4h6v2" })))), /* @__PURE__ */ __h("div", { className: "basket-item-controls" }, /* @__PURE__ */ __h("div", { className: "basket-item-quantity" }, /* @__PURE__ */ __h("button", {
		className: "qty-btn",
		onClick: () => handleDecrease(item),
		"aria-label": "Decrease quantity"
	}, "−"), /* @__PURE__ */ __h("span", { className: `qty-value ${flashingItemIds[item.productId] ? "qty-limit-flash" : ""}` }, item.quantity), /* @__PURE__ */ __h("button", {
		className: "qty-btn",
		onClick: () => handleIncrease(item),
		"aria-label": "Increase quantity"
	}, "+")), /* @__PURE__ */ __h("div", { className: "basket-item-total" }, /* @__PURE__ */ __h("span", { className: "basket-item-total-price" }, item.totalPrice, " ₼")), /* @__PURE__ */ __h("button", {
		className: "basket-item-delete desktop-delete",
		onClick: () => setItemToDelete(item),
		"aria-label": "Remove item"
	}, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6l-1 14H6L5 6" }), /* @__PURE__ */ __h("path", { d: "M10 11v6M14 11v6" }), /* @__PURE__ */ __h("path", { d: "M9 6V4h6v2" }))))))))), /* @__PURE__ */ __h(motion.div, {
		className: "basket-summary",
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .4,
			delay: .2
		}
	}, /* @__PURE__ */ __h("h2", null, t("basket_summary_title")), /* @__PURE__ */ __h("div", { className: "summary-lines" }, enrichedItems.map((item) => /* @__PURE__ */ __h("div", {
		key: item.productId,
		className: "summary-line"
	}, /* @__PURE__ */ __h("span", { className: "summary-line-name" }, item.product.name, /* @__PURE__ */ __h("span", { className: "summary-line-qty" }, " × ", item.quantity)), /* @__PURE__ */ __h("span", { className: "summary-line-price" }, item.totalPrice, " ₼")))), userPromos.length >= 2 && /* @__PURE__ */ __h("div", { className: "basket-promo-selector" }, /* @__PURE__ */ __h("div", { className: "promo-selector-label" }, /* @__PURE__ */ __h("span", null, t("basket_promo_label")), /* @__PURE__ */ __h("span", { className: "promo-count" }, userPromos.length, " ", t("basket_promo_active"))), /* @__PURE__ */ __h("select", {
		value: selectedPromoCode,
		onChange: (e) => setSelectedPromoCode(e.target.value),
		className: "basket-promo-select"
	}, userPromos.map((p) => /* @__PURE__ */ __h("option", {
		key: p.id,
		value: p.promoCode
	}, p.promoCode, " — ", formatLocalizedPrizeName(p.prizeName, lang))), /* @__PURE__ */ __h("option", { value: "NONE" }, t("basket_promo_none")))), /* @__PURE__ */ __h("div", { className: "summary-divider" }), promoDiscountAmount > 0 && /* @__PURE__ */ __h("div", { className: "summary-subtotal" }, /* @__PURE__ */ __h("span", null, t("basket_subtotal")), /* @__PURE__ */ __h("span", null, grandTotal, " ₼")), promoDiscountAmount > 0 && /* @__PURE__ */ __h(AnimatePresence, null, /* @__PURE__ */ __h(motion.div, {
		className: "summary-promo-row",
		initial: {
			opacity: 0,
			y: -6
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: { opacity: 0 },
		transition: { duration: .3 }
	}, /* @__PURE__ */ __h("span", { className: "summary-promo-label" }, /* @__PURE__ */ __h("img", {
		src: giftAnimated,
		alt: "Promo gift",
		className: "summary-promo-icon"
	}), /* @__PURE__ */ __h("span", null, formatLocalizedPrizeName(activePromo?.prizeName, lang))), /* @__PURE__ */ __h("span", { className: "summary-promo-discount" }, "−", promoDiscountAmount.toFixed(2), " ₼"))), /* @__PURE__ */ __h("div", { className: "summary-total" }, /* @__PURE__ */ __h("span", null, t("basket_total")), /* @__PURE__ */ __h("span", { className: "summary-total-price" }, discountedTotal, " ₼")), /* @__PURE__ */ __h("button", {
		className: "cta-btn basket-checkout-btn",
		onClick: () => navigate("/order", { state: { selectedPromoCode: activePromo ? activePromo.promoCode : null } })
	}, t("basket_btn_checkout")), /* @__PURE__ */ __h(Link, {
		to: "/catalog",
		className: "cta-btn secondary basket-continue-btn"
	}, t("basket_btn_continue"))))), /* @__PURE__ */ __h(DeleteConfirmModal, {
		isOpen: !!itemToDelete,
		onClose: () => setItemToDelete(null),
		onConfirm: handleConfirmDelete,
		itemName: itemToDelete?.product?.name,
		loading: isDeleting
	}), /* @__PURE__ */ __h(Footer, null));
};
export default Basket;
