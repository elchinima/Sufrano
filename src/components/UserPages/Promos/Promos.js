import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect } from "../../../utils/runtime.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import { Link } from "../../../utils/router.js";
import { useAuth } from "../../../context/AuthContext.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { encodeCode128 } from "../../../utils/code128.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
import Footer from "../../Footer/Footer.js";
import Navbar from "../../Elements/Navbar.js";
const superPrizeIcon = "/assets/icons/super-prize.svg";
const freeDrinkIcon = "/assets/icons/free-drink.svg";
const freeDessertIcon = "/assets/icons/free-dessert.svg";
const discount25Icon = "/assets/icons/discount-25.svg";
const cashbackIcon = "/assets/icons/cashback.svg";
const discount50Icon = "/assets/icons/discount-50.svg";
const defaultGiftIcon = "/assets/icons/gift-animated.svg";
const ticketAnimatedIcon = "/assets/icons/ticket-animated.svg";
const fortuneWheelDarkIcon = "/assets/icons/fortune-wheel-dark.svg";
import { useLang } from "../../../utils/useLang.js";
import { getPromosTranslation } from "./Lang.js";
const PRIZE_TYPE_ICONS = {
	SuperPrize: superPrizeIcon,
	FreeDrink: freeDrinkIcon,
	FreeDessert: freeDessertIcon,
	Discount25: discount25Icon,
	Discount50: discount50Icon,
	DiscountCustom: discount25Icon,
	CashbackOnPurchases: cashbackIcon
};
const formatDate = (dateStr) => {
	if (!dateStr) return "—";
	try {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return "—";
		const formatter = new Intl.DateTimeFormat("en-GB", {
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
const BarcodeVisual = ({ code }) => {
	const binaryString = React.useMemo(() => {
		return encodeCode128(code);
	}, [code]);
	if (!binaryString) return null;
	const quietZone = 10;
	const totalWidth = binaryString.length + quietZone * 2;
	const height = 44;
	return /* @__PURE__ */ __h("div", {
		className: "promo-barcode-wrap",
		title: `Barcode: ${code}`
	}, /* @__PURE__ */ __h("svg", {
		viewBox: `0 0 ${totalWidth} ${height}`,
		className: "promo-barcode-svg",
		preserveAspectRatio: "none"
	}, /* @__PURE__ */ __h("rect", {
		width: totalWidth,
		height,
		fill: "#ffffff"
	}), binaryString.split("").map((bit, idx) => {
		if (bit === "1") {
			return /* @__PURE__ */ __h("rect", {
				key: idx,
				x: quietZone + idx,
				y: 0,
				width: 1,
				height,
				fill: "#000000"
			});
		}
		return null;
	})), /* @__PURE__ */ __h("span", { className: "promo-barcode-number" }, code));
};
const Promos = () => {
	const { user } = useAuth();
	const lang = useLang();
	const t = (id) => getPromosTranslation(lang, id);
	const [promos, setPromos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filter, setFilter] = useState("all");
	const [copiedCode, setCopiedCode] = useState(null);
	const [inputCode, setInputCode] = useState("");
	const [isActivating, setIsActivating] = useState(false);
	const [activationMessage, setActivationMessage] = useState(null);
	const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
	const fetchPromos = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetchWithRefresh(`${apiUrl}/api/auth/promos`);
			if (!res.ok) {
				throw new Error("Failed to load promo codes");
			}
			const data = await res.json();
			setPromos(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || "Error loading promos");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (user) {
			fetchPromos();
		}
	}, [user]);
	useEffect(() => {
		if (activationMessage) {
			const timer = setTimeout(() => {
				setActivationMessage(null);
			}, 5e3);
			return () => clearTimeout(timer);
		}
	}, [activationMessage]);
	const handleCopy = (code) => {
		if (!code) return;
		navigator.clipboard.writeText(code);
		setCopiedCode(code);
		setTimeout(() => {
			setCopiedCode(null);
		}, 2e3);
	};
	const handleActivatePromo = async (e) => {
		e.preventDefault();
		if (!inputCode.trim()) return;
		setIsActivating(true);
		setActivationMessage(null);
		try {
			const res = await fetchWithRefresh(`${apiUrl}/api/auth/promos/activate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ promoCode: inputCode.trim() })
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setActivationMessage({
					type: "error",
					text: data.message || t("promos_activate_error")
				});
				return;
			}
			setActivationMessage({
				type: "success",
				text: data.message || t("promos_activate_success")
			});
			setInputCode("");
			fetchPromos();
		} catch (err) {
			setActivationMessage({
				type: "error",
				text: err.message || t("promos_activate_network_error")
			});
		} finally {
			setIsActivating(false);
		}
	};
	const filteredPromos = promos.filter((p) => {
		if (filter === "active") return p.isActive;
		if (filter === "expired") return !p.isActive || p.isExpired;
		return true;
	});
	const activeCount = promos.filter((p) => p.isActive).length;
	const expiredCount = promos.filter((p) => !p.isActive || p.isExpired).length;
	return /* @__PURE__ */ __h(motion.div, {
		className: "promos-page",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .3 }
	}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "promos-main" }, /* @__PURE__ */ __h("div", { className: "promos-container" }, /* @__PURE__ */ __h(motion.div, {
		className: "promos-hero-text",
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .5,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	}, /* @__PURE__ */ __h("h1", null, t("promos_hero_title")), /* @__PURE__ */ __h("p", { className: "promos-hero-desc" }, t("promos_hero_desc"))), /* @__PURE__ */ __h(motion.div, {
		className: "promos-activate-card",
		initial: {
			opacity: 0,
			y: 15
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .4,
			delay: .1
		}
	}, /* @__PURE__ */ __h("div", { className: "promos-activate-card__content" }, /* @__PURE__ */ __h("div", { className: "promos-activate-card__text" }, /* @__PURE__ */ __h("div", { className: "promos-activate-card__badge" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		width: "14",
		height: "14",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5"
	}, /* @__PURE__ */ __h("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })), /* @__PURE__ */ __h("span", null, t("promos_badge_redeem"))), /* @__PURE__ */ __h("h3", null, t("promos_card_title")), /* @__PURE__ */ __h("p", null, t("promos_card_desc"))), /* @__PURE__ */ __h("form", {
		onSubmit: handleActivatePromo,
		className: "promos-activate-card__form"
	}, /* @__PURE__ */ __h("div", { className: "promos-activate-card__input-wrap" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		width: "18",
		height: "18",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		className: "input-icon"
	}, /* @__PURE__ */ __h("path", { d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" }), /* @__PURE__ */ __h("line", {
		x1: "12",
		y1: "9",
		x2: "12",
		y2: "15"
	})), /* @__PURE__ */ __h("input", {
		type: "text",
		placeholder: t("promos_input_placeholder"),
		value: inputCode,
		onChange: (e) => setInputCode(e.target.value.toUpperCase().replace(/\s+/g, "")),
		disabled: isActivating,
		maxLength: 32
	}), inputCode && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "input-clear-btn",
		onClick: () => setInputCode(""),
		"aria-label": "Clear code"
	}, "✕")), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "promos-activate-card__btn",
		disabled: isActivating || !inputCode.trim()
	}, isActivating ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
		src: loaderIconRed,
		alt: "",
		className: "spinner-inline"
	}), /* @__PURE__ */ __h("span", null, t("promos_btn_activating"))) : /* @__PURE__ */ __h("span", null, t("promos_btn_activate"))))), /* @__PURE__ */ __h(AnimatePresence, null, activationMessage && /* @__PURE__ */ __h(motion.div, {
		className: `promos-activate-feedback ${activationMessage.type === "success" ? "promos-activate-feedback--success" : "promos-activate-feedback--error"}`,
		initial: {
			opacity: 0,
			height: 0,
			marginTop: 0
		},
		animate: {
			opacity: 1,
			height: "auto",
			marginTop: 14
		},
		exit: {
			opacity: 0,
			height: 0,
			marginTop: 0
		}
	}, activationMessage.type === "success" ? /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5"
	}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })) : /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5"
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
	})), /* @__PURE__ */ __h("span", null, activationMessage.text), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "close-msg",
		onClick: () => setActivationMessage(null)
	}, "✕")))), /* @__PURE__ */ __h("div", { className: "promos-filters" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: `promos-filter-btn ${filter === "all" ? "active" : ""}`,
		onClick: () => setFilter("all")
	}, t("promos_filter_all"), " (", promos.length, ")"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: `promos-filter-btn ${filter === "active" ? "active" : ""}`,
		onClick: () => setFilter("active")
	}, t("promos_filter_active"), " (", activeCount, ")"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: `promos-filter-btn ${filter === "expired" ? "active" : ""}`,
		onClick: () => setFilter("expired")
	}, t("promos_filter_expired"), " (", expiredCount, ")")), loading ? /* @__PURE__ */ __h("div", { className: "promos-loading-state" }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading...",
		className: "promos-loader-icon"
	}), /* @__PURE__ */ __h("p", null, t("promos_loading"))) : error ? /* @__PURE__ */ __h("div", { className: "promos-error-state" }, /* @__PURE__ */ __h("p", null, error), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm",
		onClick: fetchPromos
	}, t("promos_try_again"))) : filteredPromos.length === 0 ? /* @__PURE__ */ __h(motion.div, {
		className: "promos-empty-card",
		initial: {
			opacity: 0,
			scale: .95
		},
		animate: {
			opacity: 1,
			scale: 1
		},
		transition: { duration: .4 }
	}, /* @__PURE__ */ __h("div", { className: "promos-empty-icon" }, /* @__PURE__ */ __h("img", {
		src: ticketAnimatedIcon,
		alt: "Promo codes",
		className: "promos-empty-icon-img"
	})), /* @__PURE__ */ __h("h3", null, filter === "active" ? t("promos_empty_active_title") : filter === "expired" ? t("promos_empty_expired_title") : t("promos_empty_all_title")), /* @__PURE__ */ __h("p", null, filter === "active" ? t("promos_empty_active_desc") : t("promos_empty_all_desc")), /* @__PURE__ */ __h(Link, {
		to: "/fortune",
		className: "cta-btn sm promos-empty-btn"
	}, /* @__PURE__ */ __h("img", {
		src: fortuneWheelDarkIcon,
		alt: "",
		className: "promos-empty-btn-icon"
	}), /* @__PURE__ */ __h("span", null, t("promos_empty_btn_spin")))) : /* @__PURE__ */ __h(motion.div, {
		className: "promos-grid",
		layout: true,
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		transition: { duration: .4 }
	}, /* @__PURE__ */ __h(AnimatePresence, null, filteredPromos.map((promo, idx) => {
		const icon = PRIZE_TYPE_ICONS[promo.prizeType] || defaultGiftIcon;
		const isCopied = copiedCode === promo.promoCode;
		const isActive = promo.isActive;
		return /* @__PURE__ */ __h(motion.div, {
			key: promo.id || idx,
			className: `promo-ticket-card ${isActive ? "promo-ticket--active" : "promo-ticket--expired"}`,
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				scale: .95
			},
			transition: {
				duration: .35,
				delay: idx * .05
			}
		}, /* @__PURE__ */ __h("div", { className: "promo-ticket__header" }, /* @__PURE__ */ __h("div", { className: "promo-ticket__icon-badge" }, /* @__PURE__ */ __h("img", {
			src: icon,
			alt: promo.prizeName,
			className: "promo-ticket__icon-img"
		})), /* @__PURE__ */ __h("div", { className: "promo-ticket__title-group" }, /* @__PURE__ */ __h("span", { className: `promo-status-badge ${isActive ? "badge-active" : "badge-expired"}` }, isActive ? t("promos_status_active") : t("promos_status_expired")), /* @__PURE__ */ __h("h3", { className: "promo-ticket__name" }, promo.prizeName), /* @__PURE__ */ __h("p", { className: "promo-ticket__desc" }, promo.prizeDescription))), /* @__PURE__ */ __h("div", { className: "promo-ticket__divider" }, /* @__PURE__ */ __h("span", { className: "promo-ticket__notch promo-ticket__notch--left" }), /* @__PURE__ */ __h("span", { className: "promo-ticket__dashed-line" }), /* @__PURE__ */ __h("span", { className: "promo-ticket__notch promo-ticket__notch--right" })), /* @__PURE__ */ __h("div", { className: "promo-ticket__body" }, /* @__PURE__ */ __h("div", { className: "promo-code-box" }, /* @__PURE__ */ __h("div", { className: "promo-code-text-group" }, /* @__PURE__ */ __h("span", { className: "promo-code-label" }, t("promos_label_code")), /* @__PURE__ */ __h("span", { className: "promo-code-value" }, promo.promoCode)), /* @__PURE__ */ __h("button", {
			type: "button",
			className: `promo-copy-btn ${isCopied ? "copied" : ""}`,
			onClick: () => handleCopy(promo.promoCode),
			title: t("promos_btn_copy")
		}, isCopied ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
			width: "14",
			height: "14",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5"
		}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, t("promos_btn_copied"))) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
			width: "14",
			height: "14",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("rect", {
			x: "9",
			y: "9",
			width: "13",
			height: "13",
			rx: "2",
			ry: "2"
		}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })), /* @__PURE__ */ __h("span", null, t("promos_btn_copy"))))), promo.barCode && /* @__PURE__ */ __h(BarcodeVisual, { code: promo.barCode }), /* @__PURE__ */ __h("div", { className: "promo-dates-row" }, /* @__PURE__ */ __h("div", { className: "promo-date-item" }, /* @__PURE__ */ __h("span", { className: "promo-date-label" }, t("promos_date_activated")), /* @__PURE__ */ __h("span", { className: "promo-date-val" }, formatDate(promo.activatedAt))), /* @__PURE__ */ __h("div", { className: "promo-date-item" }, /* @__PURE__ */ __h("span", { className: "promo-date-label" }, t("promos_date_expires")), /* @__PURE__ */ __h("span", { className: "promo-date-val" }, formatDate(promo.expiresAt)))), isActive && /* @__PURE__ */ __h("div", { className: "promo-ticket__actions" }, /* @__PURE__ */ __h(Link, {
			to: "/catalog",
			className: "promo-action-btn"
		}, t("promos_btn_use")))));
	}))))), /* @__PURE__ */ __h(Footer, null));
};
export default Promos;
