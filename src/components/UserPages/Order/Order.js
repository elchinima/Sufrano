import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useRef, useMemo } from "../../../utils/runtime.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import { Link, useNavigate, useLocation } from "../../../utils/router.js";
import { useAuth } from "../../../context/AuthContext.js";
import { useBasket } from "../../../context/BasketContext.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useLang } from "../../../utils/useLang.js";
import { getOrderTranslation } from "./Lang.js";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
const featureCashIcon = "/assets/icons/feature-cash.svg";
const featureWalletIcon = "/assets/icons/feature-wallet.svg";
const featureCardVisaMcIcon = "/assets/icons/feature-card-visa-mc.svg";
const featureStripeIcon = "/assets/icons/feature-stripe.svg";
const featureGPayIcon = "/assets/icons/feature-gpay.svg";
const featureCashbackIcon = "/assets/icons/feature-cashback.svg";
const featureNfcIcon = "/assets/icons/feature-nfc.svg";
const featurePromoIcon = "/assets/icons/feature-promo.svg";
const cashierIcon = "/assets/icons/cashier-register.svg";
const onlineIcon = "/assets/icons/online-card.svg";
import Footer from "../../Footer/Footer.js";
import Navbar from "../../Elements/Navbar.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
const StripePaymentModal = React.lazy(() => import("./StripePaymentModal.js"));
const springTransition = {
	type: "spring",
	stiffness: 280,
	damping: 24
};
const smoothEase = [
	.16,
	1,
	.3,
	1
];
const cardVariants = {
	hidden: {
		opacity: 0,
		y: 28,
		scale: .96
	},
	visible: (i) => ({
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			delay: .1 + i * .1,
			duration: .45,
			ease: smoothEase
		}
	})
};
const stepPanelVariants = {
	hidden: {
		opacity: 0,
		y: 20,
		scale: .98
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: .4,
			ease: smoothEase
		}
	},
	exit: {
		opacity: 0,
		y: 12,
		scale: .98,
		transition: {
			duration: .25,
			ease: [
				.4,
				0,
				1,
				1
			]
		}
	}
};
const FeaturePill = ({ icon, label }) => /* @__PURE__ */ __h("span", { className: "feature-pill" }, /* @__PURE__ */ __h("img", {
	src: icon,
	alt: "",
	className: "feature-pill__icon"
}), /* @__PURE__ */ __h("span", null, label));
const getOnlinePaymentServices = (t) => [
	{
		id: "OnlineStripe",
		name: "Stripe",
		title: t("serviceStripeTitle"),
		desc: t("serviceStripeDesc"),
		icon: featureStripeIcon,
		badge: t("popularBadge")
	},
	{
		id: "OnlineBalance",
		name: "Süfrano Balance",
		title: t("serviceBalanceTitle"),
		desc: t("serviceBalanceDesc"),
		icon: featureWalletIcon,
		badge: t("instantSpeedBadge"),
		isBalance: true
	},
	{
		id: "OnlineCardDetails",
		name: "Visa & Mastercard",
		title: t("serviceCardsTitle"),
		desc: t("serviceCardsDesc"),
		icon: featureCardVisaMcIcon,
		badge: t("cardsBadge")
	},
	{
		id: "OnlineGooglePay",
		name: "Google Pay",
		title: t("serviceGPayTitle"),
		desc: t("serviceGPayDesc"),
		icon: featureGPayIcon,
		badge: t("oneTapBadge")
	}
];
const Order = () => {
	const lang = useLang();
	const t = (id, params) => {
		let str = getOrderTranslation(lang, id);
		if (params && typeof str === "string") {
			Object.entries(params).forEach(([key, val]) => {
				str = str.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
			});
		}
		return str;
	};
	const onlineServices = useMemo(() => getOnlinePaymentServices(t), [lang]);
	const { user, updateUser } = useAuth();
	const { items, clearBasket } = useBasket();
	const location = useLocation();
	const navigate = useNavigate();
	const [products, setProducts] = useState({});
	const [productsLoading, setProductsLoading] = useState(true);
	const [userPromos, setUserPromos] = useState([]);
	const [selectedPromoCode, setSelectedPromoCode] = useState(location.state?.selectedPromoCode || "");
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [isOnlinePaymentModalOpen, setIsOnlinePaymentModalOpen] = useState(false);
	const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
	const [selectedOnlineService, setSelectedOnlineService] = useState("OnlineStripe");
	const [onlineModalError, setOnlineModalError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [orderSuccessData, setOrderSuccessData] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const stepBoxRef = useRef(null);
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
				console.error("Failed to fetch products in Order:", err);
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
					setSelectedPromoCode((prev) => {
						if (prev && (prev === "NONE" || actives.some((p) => p.promoCode === prev))) {
							return prev;
						}
						return actives[0].promoCode;
					});
				}
			}
		}).catch(() => {});
	}, [user]);
	const activePromo = useMemo(() => {
		if (!selectedPromoCode || selectedPromoCode === "NONE") return null;
		return userPromos.find((p) => p.promoCode === selectedPromoCode) || null;
	}, [selectedPromoCode, userPromos]);
	useEffect(() => {
		if (selectedMethod && stepBoxRef.current) {
			const timer = setTimeout(() => {
				stepBoxRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [selectedMethod]);
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
	const grandTotal = useMemo(() => {
		return enrichedItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
	}, [enrichedItems]);
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
		if (pType === "cashbackonpurchases" || pType === "4" || pName.includes("CASHBACK")) {
			return 0;
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
	const finalAmount = Math.max(0, parseFloat(grandTotal) - promoDiscountAmount).toFixed(2);
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
	const handleSelectMethod = (method) => {
		setSelectedMethod(method);
		setErrorMessage("");
	};
	const handlePlaceOrder = async (paymentMethod = "CashDeskCash") => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		setErrorMessage("");
		setOnlineModalError("");
		try {
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const response = await fetchWithRefresh(`${apiUrl}/api/orders/cashier`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					paymentMethod,
					promoCode: activePromo ? activePromo.promoCode : null
				})
			});
			const data = await response.json();
			if (response.ok && data.success) {
				if (data.remainingBalance !== undefined && data.remainingBalance !== null && updateUser) {
					updateUser({ balance: data.remainingBalance });
				}
				clearBasket();
				setIsOnlinePaymentModalOpen(false);
				setOrderSuccessData({
					id: data.id,
					status: data.status || (paymentMethod === "OnlineBalance" ? "Paid Online" : "Pending Payment"),
					createdAt: data.createdAt,
					items: data.items || [],
					payment: data.payment || {},
					notes: data.notes || {},
					cashbackEarned: data.cashbackEarned || 0
				});
			} else {
				const msg = data.message || t("orderFailed");
				setErrorMessage(msg);
				setOnlineModalError(msg);
			}
		} catch (err) {
			console.error("Error placing order:", err);
			const msg = t("orderNetworkError");
			setErrorMessage(msg);
			setOnlineModalError(msg);
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleStripeOrderSuccess = (data) => {
		if (data.remainingBalance !== undefined && data.remainingBalance !== null && updateUser) {
			updateUser({ balance: data.remainingBalance });
		}
		clearBasket();
		setIsStripeModalOpen(false);
		setOrderSuccessData({
			id: data.id,
			status: data.status || "Paid Online",
			createdAt: data.createdAt,
			items: data.items || [],
			payment: data.payment || {},
			notes: data.notes || {},
			cashbackEarned: data.cashbackEarned || 0
		});
	};
	const handleSelectOnlineServiceSubmit = () => {
		setIsOnlinePaymentModalOpen(false);
		if (selectedOnlineService === "OnlineBalance") {
			handlePlaceOrder("OnlineBalance");
		} else {
			setIsStripeModalOpen(true);
		}
	};
	const handleCloseSuccessModal = () => {
		setOrderSuccessData(null);
		navigate("/catalog");
	};
	const formatPaymentMethod = (pm) => {
		switch (pm) {
			case "OnlineStripe": return t("methodStripe");
			case "OnlineBalance": return t("methodBalance");
			case "OnlineCardDetails": return t("methodCards");
			case "OnlineGooglePay": return t("methodGPay");
			case "CashDeskCard": return t("methodCashierCard");
			case "CashDeskCash":
			default: return t("methodCashierCash");
		}
	};
	return /* @__PURE__ */ __h(motion.div, {
		className: "order-page",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .3 }
	}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "order-main" }, /* @__PURE__ */ __h("div", { className: "order-container" }, /* @__PURE__ */ __h(motion.div, {
		className: "order-hero-text",
		initial: {
			opacity: 0,
			y: 24,
			filter: "blur(8px)"
		},
		animate: {
			opacity: 1,
			y: 0,
			filter: "blur(0px)"
		},
		transition: {
			duration: .6,
			ease: smoothEase
		}
	}, /* @__PURE__ */ __h(motion.div, {
		className: "order-step-badge",
		initial: {
			opacity: 0,
			scale: .7
		},
		animate: {
			opacity: 1,
			scale: 1
		},
		transition: {
			delay: .2,
			...springTransition
		}
	}, t("stepBadge")), /* @__PURE__ */ __h(motion.h1, {
		initial: {
			opacity: 0,
			y: 16
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: .1,
			duration: .5,
			ease: smoothEase
		}
	}, t("heroTitle")), /* @__PURE__ */ __h(motion.p, {
		className: "order-hero-desc",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		transition: {
			delay: .25,
			duration: .4
		}
	}, t("heroDesc"))), itemCount === 0 && !orderSuccessData && !productsLoading ? /* @__PURE__ */ __h(motion.div, {
		className: "order-empty-card",
		initial: {
			opacity: 0,
			scale: .95
		},
		animate: {
			opacity: 1,
			scale: 1
		}
	}, /* @__PURE__ */ __h("p", null, t("emptyBasket")), /* @__PURE__ */ __h(Link, {
		to: "/catalog",
		className: "cta-btn sm order-empty-btn"
	}, t("browseMenu"))) : /* @__PURE__ */ __h("div", { className: "order-methods-container" }, /* @__PURE__ */ __h("div", { className: "order-methods-grid" }, /* @__PURE__ */ __h(motion.div, {
		custom: 0,
		variants: cardVariants,
		initial: "hidden",
		animate: "visible",
		className: `order-method-card ${selectedMethod === "cashier" ? "selected" : ""} ${selectedMethod && selectedMethod !== "cashier" ? "unselected" : ""}`,
		onClick: () => handleSelectMethod("cashier"),
		whileHover: {
			y: -4,
			transition: { duration: .2 }
		},
		whileTap: { scale: .98 }
	}, /* @__PURE__ */ __h("div", { className: "order-method-card__top" }, /* @__PURE__ */ __h("div", { className: "order-method-card__icon-wrap" }, /* @__PURE__ */ __h("img", {
		src: cashierIcon,
		alt: t("payAtCashier"),
		className: "order-method-card__icon"
	})), /* @__PURE__ */ __h("div", { className: "order-method-card__title-group" }, /* @__PURE__ */ __h("span", { className: "order-method-card__badge" }, t("inStoreBadge")), /* @__PURE__ */ __h("h2", { className: "order-method-card__title" }, t("payAtCashier")), /* @__PURE__ */ __h("span", { className: "order-method-card__subtitle" }, t("payAtCashierCounter")))), /* @__PURE__ */ __h("div", { className: "order-method-card__details" }, /* @__PURE__ */ __h("p", { className: "order-method-card__desc" }, t("cashierDesc")), /* @__PURE__ */ __h(AnimatePresence, { initial: false }, !selectedMethod && /* @__PURE__ */ __h(motion.div, {
		className: "order-method-card__features-wrap",
		initial: {
			opacity: 0,
			height: 0
		},
		animate: {
			opacity: 1,
			height: "auto"
		},
		exit: {
			opacity: 0,
			height: 0
		},
		transition: {
			duration: .35,
			ease: smoothEase
		}
	}, /* @__PURE__ */ __h("div", { className: "order-method-card__features" }, /* @__PURE__ */ __h(FeaturePill, {
		icon: featureCashIcon,
		label: t("cashPayment")
	}), /* @__PURE__ */ __h(FeaturePill, {
		icon: featureNfcIcon,
		label: t("cardNfc")
	}), /* @__PURE__ */ __h(FeaturePill, {
		icon: featurePromoIcon,
		label: t("usePromoCodes")
	}))))), /* @__PURE__ */ __h("div", { className: "order-method-card__footer" }, /* @__PURE__ */ __h("span", { className: `order-method-card__radio-btn ${selectedMethod === "cashier" ? "selected" : ""}` }, selectedMethod === "cashier" ? t("selectedBadge") : t("chooseCashier")))), /* @__PURE__ */ __h(motion.div, {
		custom: 1,
		variants: cardVariants,
		initial: "hidden",
		animate: "visible",
		className: `order-method-card ${selectedMethod === "online" ? "selected" : ""} ${selectedMethod && selectedMethod !== "online" ? "unselected" : ""}`,
		onClick: () => handleSelectMethod("online"),
		whileHover: {
			y: -4,
			transition: { duration: .2 }
		},
		whileTap: { scale: .98 }
	}, /* @__PURE__ */ __h("div", { className: "order-method-card__top" }, /* @__PURE__ */ __h("div", { className: "order-method-card__icon-wrap" }, /* @__PURE__ */ __h("img", {
		src: onlineIcon,
		alt: t("payOnline"),
		className: "order-method-card__icon"
	})), /* @__PURE__ */ __h("div", { className: "order-method-card__title-group" }, /* @__PURE__ */ __h("span", { className: "order-method-card__badge badge-online" }, t("instantBadge")), /* @__PURE__ */ __h("h2", { className: "order-method-card__title" }, t("payOnline")), /* @__PURE__ */ __h("span", { className: "order-method-card__subtitle" }, t("payOnlineInstantly")))), /* @__PURE__ */ __h("div", { className: "order-method-card__details" }, /* @__PURE__ */ __h("p", { className: "order-method-card__desc" }, t("onlineDesc")), /* @__PURE__ */ __h(AnimatePresence, { initial: false }, !selectedMethod && /* @__PURE__ */ __h(motion.div, {
		className: "order-method-card__features-wrap",
		initial: {
			opacity: 0,
			height: 0
		},
		animate: {
			opacity: 1,
			height: "auto"
		},
		exit: {
			opacity: 0,
			height: 0
		},
		transition: {
			duration: .35,
			ease: smoothEase
		}
	}, /* @__PURE__ */ __h("div", { className: "order-method-card__features" }, /* @__PURE__ */ __h(FeaturePill, {
		icon: featureCardVisaMcIcon,
		label: t("visaMastercard")
	}), /* @__PURE__ */ __h(FeaturePill, {
		icon: featureWalletIcon,
		label: t("payViaBalance")
	}), /* @__PURE__ */ __h(FeaturePill, {
		icon: featureStripeIcon,
		label: t("payViaStripe")
	}), /* @__PURE__ */ __h(FeaturePill, {
		icon: featureGPayIcon,
		label: t("googlePay")
	}), /* @__PURE__ */ __h(FeaturePill, {
		icon: featureCashbackIcon,
		label: t("earnCashback")
	}), /* @__PURE__ */ __h(FeaturePill, {
		icon: featurePromoIcon,
		label: t("usePromoCodes")
	}))))), /* @__PURE__ */ __h("div", { className: "order-method-card__footer" }, /* @__PURE__ */ __h("span", { className: `order-method-card__radio-btn ${selectedMethod === "online" ? "selected" : ""}` }, selectedMethod === "online" ? t("selectedBadge") : t("chooseOnline")))))), /* @__PURE__ */ __h(AnimatePresence, { mode: "wait" }, selectedMethod && itemCount > 0 && /* @__PURE__ */ __h(motion.div, {
		ref: stepBoxRef,
		className: "order-step-content",
		variants: stepPanelVariants,
		initial: "hidden",
		animate: "visible",
		exit: "exit",
		key: selectedMethod
	}, /* @__PURE__ */ __h("div", { className: "order-step-box" }, /* @__PURE__ */ __h("div", { className: "order-step-header" }, /* @__PURE__ */ __h("div", { className: "order-step-info" }, /* @__PURE__ */ __h("h3", null, t("selectedPayment"), " ", /* @__PURE__ */ __h("span", null, selectedMethod === "cashier" ? t("payAtCashier") : t("payOnline"))), /* @__PURE__ */ __h("p", null, selectedMethod === "cashier" ? t("cashierStepDesc") : t("onlineStepDesc"))), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "order-change-btn",
		onClick: () => setSelectedMethod(null)
	}, t("changeMethod"))), userPromos.length >= 2 && /* @__PURE__ */ __h("div", { className: "order-promo-selector" }, /* @__PURE__ */ __h("div", { className: "order-promo-label" }, /* @__PURE__ */ __h("span", null, t("selectPromo")), /* @__PURE__ */ __h("span", { className: "count" }, t("promosAvailable", { count: userPromos.length }))), /* @__PURE__ */ __h("select", {
		value: selectedPromoCode,
		onChange: (e) => setSelectedPromoCode(e.target.value),
		className: "order-promo-select"
	}, userPromos.map((p) => /* @__PURE__ */ __h("option", {
		key: p.id,
		value: p.promoCode
	}, p.promoCode, " — ", p.prizeName)), /* @__PURE__ */ __h("option", { value: "NONE" }, t("dontUsePromo")))), /* @__PURE__ */ __h("div", { className: "order-summary-pill-row" }, /* @__PURE__ */ __h("div", { className: "order-summary-pill" }, /* @__PURE__ */ __h("span", { className: "label" }, t("itemsCount")), /* @__PURE__ */ __h("span", { className: "value" }, itemCount, " ", t("itemsSuffix"))), promoDiscountAmount > 0 && /* @__PURE__ */ __h("div", { className: "order-summary-pill promo" }, /* @__PURE__ */ __h("span", { className: "label" }, t("discountLabel")), /* @__PURE__ */ __h("span", { className: "value" }, "−", promoDiscountAmount.toFixed(2), " ₼")), /* @__PURE__ */ __h("div", { className: "order-summary-pill total" }, /* @__PURE__ */ __h("span", { className: "label" }, t("totalToPay")), /* @__PURE__ */ __h("span", { className: "value" }, finalAmount, " ₼"))), errorMessage && /* @__PURE__ */ __h("div", { className: "order-error-message" }, "⚠️ ", errorMessage), /* @__PURE__ */ __h("div", { className: "order-actions-row" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "order-confirm-btn",
		disabled: isSubmitting || itemCount === 0,
		onClick: () => {
			if (selectedMethod === "cashier") {
				handlePlaceOrder("CashDeskCash");
			} else {
				setIsOnlinePaymentModalOpen(true);
			}
		}
	}, isSubmitting ? /* @__PURE__ */ __h("span", { className: "order-btn-loading" }, /* @__PURE__ */ __h("img", {
		src: loaderIconRed,
		alt: "Loading",
		className: "order-spinner"
	}), t("placingOrder")) : selectedMethod === "cashier" ? t("confirmOrder") : t("continueOnline")), /* @__PURE__ */ __h(Link, {
		to: "/basket",
		className: "order-back-btn"
	}, t("backToBasket")))))))), /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen: isOnlinePaymentModalOpen,
		onClose: () => setIsOnlinePaymentModalOpen(false),
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", {
		className: "online-payment-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "online-payment-modal__close",
		onClick: () => setIsOnlinePaymentModalOpen(false),
		"aria-label": "Close modal"
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
	}))), /* @__PURE__ */ __h("div", { className: "online-payment-modal__header" }, /* @__PURE__ */ __h("div", { className: "online-payment-modal__icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
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
	}))), /* @__PURE__ */ __h("h3", { className: "online-payment-modal__title" }, t("onlineModalTitle")), /* @__PURE__ */ __h("p", { className: "online-payment-modal__desc" }, t("onlineModalDesc"), " ", /* @__PURE__ */ __h("span", { className: "online-payment-modal__amount" }, finalAmount, " ₼"))), /* @__PURE__ */ __h("div", { className: "online-payment-modal__services" }, onlineServices.map((service) => {
		const isSelected = selectedOnlineService === service.id;
		const userBalance = typeof user?.balance === "number" ? user.balance : parseFloat(user?.balance || "0");
		return /* @__PURE__ */ __h("div", {
			key: service.id,
			className: `online-payment-service-card ${isSelected ? "selected" : ""}`,
			onClick: () => setSelectedOnlineService(service.id)
		}, /* @__PURE__ */ __h("div", { className: "online-payment-service-card__icon-wrap" }, /* @__PURE__ */ __h("img", {
			src: service.icon,
			alt: service.title,
			className: "online-payment-service-card__icon"
		})), /* @__PURE__ */ __h("div", { className: "online-payment-service-card__info" }, /* @__PURE__ */ __h("span", { className: "online-payment-service-card__title" }, service.title), /* @__PURE__ */ __h("span", { className: "online-payment-service-card__desc" }, service.desc), service.badge && /* @__PURE__ */ __h("div", { className: "online-payment-service-card__badge-row" }, /* @__PURE__ */ __h("span", { className: "online-payment-service-card__badge" }, service.isBalance ? `${t("balancePrefix")} ${userBalance.toFixed(2)} ₼` : service.badge))), /* @__PURE__ */ __h("div", { className: "online-payment-service-card__radio" }, /* @__PURE__ */ __h("span", { className: `online-radio-dot ${isSelected ? "active" : ""}` }, isSelected && /* @__PURE__ */ __h("span", { className: "online-radio-dot__inner" }))));
	})), /* @__PURE__ */ __h("div", { className: "online-payment-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm online-payment-modal__btn online-payment-modal__btn--cancel",
		onClick: () => setIsOnlinePaymentModalOpen(false)
	}, t("cancel")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm online-payment-modal__btn online-payment-modal__btn--submit",
		onClick: handleSelectOnlineServiceSubmit
	}, selectedOnlineService === "OnlineBalance" ? t("payWithBalance") : t("continueToPayment"))))), /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen: Boolean(orderSuccessData),
		onClose: handleCloseSuccessModal,
		targetBorderRadius: "24px"
	}, orderSuccessData && /* @__PURE__ */ __h("div", {
		className: "order-success-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "order-success-modal__close",
		onClick: handleCloseSuccessModal,
		"aria-label": "Close modal"
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
	}))), /* @__PURE__ */ __h("div", { className: "order-success-modal__header" }, /* @__PURE__ */ __h("div", { className: "order-success-modal__icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" }))), /* @__PURE__ */ __h("div", { className: "order-success-modal__status-badge" }, /* @__PURE__ */ __h("span", { className: "pulsing-dot" }), orderSuccessData.status === "Paid Online" ? t("statusPaidOnline") : orderSuccessData.status === "Pending Payment" ? t("statusPendingPayment") : orderSuccessData.status), /* @__PURE__ */ __h("h2", { className: "order-success-modal__title" }, t("orderSuccessTitle")), /* @__PURE__ */ __h("p", { className: "order-success-modal__desc" }, t("orderSuccessDesc"))), /* @__PURE__ */ __h("div", { className: "order-success-modal__number-card" }, /* @__PURE__ */ __h("div", { className: "order-success-modal__number-info" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__number-label" }, t("orderNumberLabel")), /* @__PURE__ */ __h("span", { className: "order-success-modal__number-sub" }, t("mentionAtCounter"))), /* @__PURE__ */ __h("span", { className: "order-success-modal__number-value" }, orderSuccessData.id ? String(orderSuccessData.id).replace(/-/g, "").slice(-7).toUpperCase() : "")), /* @__PURE__ */ __h("div", { className: "order-success-modal__details" }, /* @__PURE__ */ __h("div", { className: "order-success-modal__detail-row" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-label" }, t("itemsCount").replace(":", "")), /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-value" }, orderSuccessData.items?.reduce((sum, p) => sum + p.quantity, 0) || 0, " ", t("itemsSuffix"))), orderSuccessData.payment?.discountAmount > 0 && /* @__PURE__ */ __h("div", { className: "order-success-modal__detail-row discount" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-label" }, t("promoDiscount")), /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-value" }, "−", orderSuccessData.payment.discountAmount.toFixed(2), " ₼")), orderSuccessData.cashbackEarned > 0 && /* @__PURE__ */ __h("div", { className: "order-success-modal__detail-row cashback" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-label" }, t("cashbackAdded")), /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-value" }, "+", Number(orderSuccessData.cashbackEarned).toFixed(2), " ₼")), /* @__PURE__ */ __h("div", { className: "order-success-modal__detail-row" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-label" }, t("paymentMethodLabel")), /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-value" }, formatPaymentMethod(orderSuccessData.payment?.paymentMethod))), /* @__PURE__ */ __h("div", { className: "order-success-modal__detail-row total" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-label" }, t("totalToPay").replace(":", "")), /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-value" }, orderSuccessData.payment?.totalAmount?.toFixed(2), " ₼"))), /* @__PURE__ */ __h("div", { className: "order-success-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm order-success-modal__btn order-success-modal__btn--cancel",
		onClick: handleCloseSuccessModal
	}, t("backToMenu")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm order-success-modal__btn order-success-modal__btn--submit",
		onClick: () => {
			setOrderSuccessData(null);
			navigate("/orders");
		}
	}, t("viewOrders"))))), isStripeModalOpen && /* @__PURE__ */ __h(React.Suspense, { fallback: null }, /* @__PURE__ */ __h(StripePaymentModal, {
		isOpen: isStripeModalOpen,
		onClose: () => setIsStripeModalOpen(false),
		serviceId: selectedOnlineService,
		finalAmount,
		promoCode: activePromo ? activePromo.promoCode : null,
		onOrderSuccess: handleStripeOrderSuccess
	})), /* @__PURE__ */ __h(Footer, null));
};
export default Order;
