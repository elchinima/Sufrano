import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useRef, useCallback } from "../../../utils/runtime.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import { API_URL } from "../../../utils/config.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
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
		}, /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__header" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__prize-title" }, /* @__PURE__ */ __h("h4", null, prizeTitle), promo.prizeDescription && /* @__PURE__ */ __h("p", { className: "cashbox-promo-card__prize-desc" }, promo.prizeDescription)), /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__badges" }, isActive ? /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge cashbox-promo-badge--active" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge__dot" }), t?.active || "Active") : isExpired ? /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge cashbox-promo-badge--expired" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge__dot" }), t?.expired || "Expired") : /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge cashbox-promo-badge--inactive" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-badge__dot" }), t?.inactive || "Inactive"))), /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__owner" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__owner-avatar" }, promo.userAvatar ? /* @__PURE__ */ __h("img", {
			src: promo.userAvatar,
			alt: ownerDisplay
		}) : /* @__PURE__ */ __h("span", null, promo.userName?.charAt(0)?.toUpperCase() || "U")), /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__owner-info" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__owner-label" }, t?.accountOwner || "Account Owner"), /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__owner-name" }, ownerDisplay), promo.userEmail && /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__owner-email" }, promo.userEmail))), /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__codes" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__code-box" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-label" }, t?.promoCodeLabel || "Promo Code"), /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-value" }, promo.promoCode)), promo.barCode && /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__code-box cashbox-promo-card__code-box--barcode" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-label" }, t?.barcodeLabel || "Barcode Number"), /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-value cashbox-promo-card__code-value--barcode" }, promo.barCode)), promo.discountPercent > 0 && /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__discount-box" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-label" }, t?.discountLabel || "Discount"), /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__discount-value" }, "-", promo.discountPercent, "%")), promo.cashbackPercent > 0 && /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__discount-box" }, /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__code-label" }, t?.cashbackLabel || "Cashback"), /* @__PURE__ */ __h("span", { className: "cashbox-promo-card__discount-value" }, "+", promo.cashbackPercent, "%"))), isActive && /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__actions" }, appliedPromo?.id === promo.id || appliedPromo?.promoCode && String(appliedPromo.promoCode).toUpperCase() === String(promo.promoCode).toUpperCase() ? /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__applied-row" }, /* @__PURE__ */ __h("div", { className: "cashbox-promo-card__applied-status" }, /* @__PURE__ */ __h("svg", {
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
export default CashboxPromoModal;
