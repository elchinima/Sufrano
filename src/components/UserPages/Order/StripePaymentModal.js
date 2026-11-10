import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useMemo } from "../../../utils/runtime.js";
import { Link } from "../../../utils/router.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
const featureCardVisaMcIcon = "/assets/icons/feature-card-visa-mc.svg";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useLang } from "../../../utils/useLang.js";
import { getOrderTranslation } from "./Lang.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
import PaymentErrorModal from "../PaymentMethods/PaymentErrorModal.js";
const checkLuhn = (numStr) => {
	let sum = 0;
	let alternate = false;
	for (let i = numStr.length - 1; i >= 0; i--) {
		let n = parseInt(numStr.charAt(i), 10);
		if (isNaN(n)) return false;
		if (alternate) {
			n *= 2;
			if (n > 9) n -= 9;
		}
		sum += n;
		alternate = !alternate;
	}
	return sum % 10 === 0;
};
const getCardBrand = (digits) => {
	if (!digits) return null;
	if (digits.startsWith("4")) return "Visa";
	if (digits.length >= 2) {
		const firstTwo = parseInt(digits.slice(0, 2), 10);
		if (firstTwo >= 51 && firstTwo <= 55) return "Mastercard";
	}
	if (digits.length >= 4) {
		const firstFour = parseInt(digits.slice(0, 4), 10);
		if (firstFour >= 2221 && firstFour <= 2720) return "Mastercard";
	}
	return null;
};
const StripePaymentModal = ({ isOpen, onClose, serviceId, finalAmount, promoCode, onOrderSuccess }) => {
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
	const [savedCards, setSavedCards] = useState([]);
	const [loadingCards, setLoadingCards] = useState(true);
	const [viewMode, setViewMode] = useState("select");
	const [selectedCardId, setSelectedCardId] = useState(null);
	const [cardNumber, setCardNumber] = useState("");
	const [expiryDate, setExpiryDate] = useState("");
	const [cvc, setCvc] = useState("");
	const [cardholderName, setCardholderName] = useState("");
	const [cardName, setCardName] = useState("");
	const [saveCard, setSaveCard] = useState(true);
	const [agreedToRules, setAgreedToRules] = useState(false);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [isProcessing, setIsProcessing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
	const fetchCards = async () => {
		setLoadingCards(true);
		try {
			let res = await fetchWithRefresh(`${apiUrl}/api/payment-methods`);
			if (!res.ok && res.status === 404) {
				res = await fetchWithRefresh(`${apiUrl}/api/paymentmethods`);
			}
			if (res.ok) {
				const data = await res.json();
				const list = Array.isArray(data) ? data : [];
				setSavedCards(list);
				if (list.length > 0) {
					const def = list.find((c) => c.isDefault || c.IsDefault) || list[0];
					const defId = def.id !== undefined && def.id !== null ? def.id : def.Id;
					setSelectedCardId(defId);
					setViewMode("select");
				} else {
					setViewMode("new");
				}
			} else {
				console.warn("Failed to fetch payment methods in modal:", res.status);
				setViewMode("new");
			}
		} catch (err) {
			console.error("Error fetching payment methods in modal:", err);
			setViewMode("new");
		} finally {
			setLoadingCards(false);
		}
	};
	useEffect(() => {
		if (isOpen) {
			setCardNumber("");
			setExpiryDate("");
			setCvc("");
			setCardholderName("");
			setCardName("");
			setSaveCard(true);
			setAgreedToRules(false);
			setErrors({});
			setTouched({});
			setErrorMessage("");
			setIsProcessing(false);
			fetchCards();
		}
	}, [isOpen]);
	const cleanDigits = useMemo(() => cardNumber.replace(/\D/g, ""), [cardNumber]);
	const brand = useMemo(() => getCardBrand(cleanDigits), [cleanDigits]);
	const handleCardNumberChange = (e) => {
		const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
		const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
		setCardNumber(formatted);
	};
	const handleExpiryChange = (e) => {
		let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
		if (raw.length >= 2) {
			raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
		}
		setExpiryDate(raw);
	};
	const handleCvcChange = (e) => {
		const raw = e.target.value.replace(/\D/g, "").slice(0, 3);
		setCvc(raw);
	};
	const handleCardholderChange = (e) => {
		const val = e.target.value.toUpperCase();
		setCardholderName(val);
	};
	const handleBlur = (field) => {
		setTouched((prev) => ({
			...prev,
			[field]: true
		}));
	};
	const validateNewCardForm = () => {
		const newErrors = {};
		if (!cleanDigits) {
			newErrors.cardNumber = t("errCardNumberRequired");
		} else if (cleanDigits.length !== 16) {
			newErrors.cardNumber = t("errCardNumberDigits");
		} else if (!checkLuhn(cleanDigits)) {
			newErrors.cardNumber = t("errCardNumberInvalid");
		} else if (!brand) {
			newErrors.cardNumber = t("errCardBrandUnsupported");
		}
		if (!expiryDate) {
			newErrors.expiryDate = t("errExpiryRequired");
		} else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
			newErrors.expiryDate = t("errExpiryFormat");
		} else {
			const [m, y] = expiryDate.split("/").map((x) => parseInt(x, 10));
			if (m < 1 || m > 12) {
				newErrors.expiryDate = t("errExpiryMonth");
			} else {
				const now = new Date();
				const currentYear = now.getFullYear() % 100;
				const currentMonth = now.getMonth() + 1;
				if (y < currentYear || y === currentYear && m < currentMonth) {
					newErrors.expiryDate = t("errCardExpired");
				}
			}
		}
		if (!cvc) {
			newErrors.cvc = t("errCvcRequired");
		} else if (cvc.length !== 3) {
			newErrors.cvc = t("errCvcDigits");
		}
		if (cardholderName && cardholderName.trim().length < 3) {
			newErrors.cardholderName = t("errCardholderInvalid");
		}
		if (!agreedToRules) {
			newErrors.agreedToRules = t("errAgreedRequired");
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handlePayWithSavedCard = async (e) => {
		e.preventDefault();
		if (selectedCardId === null || selectedCardId === undefined || isProcessing) return;
		setIsProcessing(true);
		setErrorMessage("");
		try {
			const res = await fetchWithRefresh(`${apiUrl}/api/orders/cashier`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					paymentMethod: "OnlineCardDetails",
					promoCode
				})
			});
			const data = await res.json();
			if (res.ok && data.success) {
				onOrderSuccess(data);
			} else {
				const msg = data.message || t("errPaymentFailed");
				setErrorMessage(msg);
				setIsErrorModalOpen(true);
			}
		} catch (err) {
			const msg = err.message || t("errProcessingGeneral");
			setErrorMessage(msg);
			setIsErrorModalOpen(true);
		} finally {
			setIsProcessing(false);
		}
	};
	const handlePayWithNewCard = async (e) => {
		e.preventDefault();
		setTouched({
			cardNumber: true,
			expiryDate: true,
			cvc: true,
			cardholderName: true,
			agreedToRules: true
		});
		if (!validateNewCardForm() || isProcessing) return;
		setIsProcessing(true);
		setErrorMessage("");
		try {
			if (saveCard) {
				if (savedCards.length >= 3) {
					setErrorMessage(t("errMaxCardsReached"));
					setIsErrorModalOpen(true);
					setIsProcessing(false);
					return;
				}
				try {
					const saveRes = await fetchWithRefresh(`${apiUrl}/api/payment-methods`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							cardNumber: cleanDigits,
							expiryDate: expiryDate.trim(),
							cvc: cvc.trim(),
							cardholderName: cardholderName.trim(),
							cardName: cardName.trim() || undefined,
							isDefault: savedCards.length === 0
						})
					});
					if (!saveRes.ok) {
						const errData = await saveRes.json().catch(() => ({}));
						if (errData.message) {
							setErrorMessage(errData.message);
							setIsErrorModalOpen(true);
							setIsProcessing(false);
							return;
						}
					}
				} catch (saveErr) {
					console.error("Failed to save card:", saveErr);
				}
			}
			const orderRes = await fetchWithRefresh(`${apiUrl}/api/orders/cashier`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					paymentMethod: "OnlineCardDetails",
					promoCode
				})
			});
			const orderData = await orderRes.json();
			if (orderRes.ok && orderData.success) {
				onOrderSuccess(orderData);
			} else {
				const msg = orderData.message || t("errPaymentCheckInfo");
				setErrorMessage(msg);
				setIsErrorModalOpen(true);
			}
		} catch (err) {
			const msg = err.message || t("errProcessingGeneral");
			setErrorMessage(msg);
			setIsErrorModalOpen(true);
		} finally {
			setIsProcessing(false);
		}
	};
	const isNewCardValid = cleanDigits.length === 16 && brand && expiryDate.length === 5 && cvc.length === 3 && agreedToRules;
	return /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose,
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", {
		className: "stripe-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "stripe-modal__close",
		onClick: onClose,
		disabled: isProcessing,
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
	}))), /* @__PURE__ */ __h("div", { className: "stripe-modal__header" }, /* @__PURE__ */ __h("div", { className: "stripe-modal__icon" }, /* @__PURE__ */ __h("img", {
		src: featureCardVisaMcIcon,
		alt: "Card Payment"
	})), /* @__PURE__ */ __h("h3", { className: "stripe-modal__title" }, t("stripeModalTitle")), /* @__PURE__ */ __h("p", { className: "stripe-modal__desc" }, t("stripeAmountToPay"), " ", /* @__PURE__ */ __h("span", { className: "stripe-modal__amount" }, finalAmount, " ₼"))), loadingCards ? /* @__PURE__ */ __h("div", { className: "stripe-modal__loading" }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading",
		className: "stripe-spinner-lg"
	}), /* @__PURE__ */ __h("p", null, t("loadingOptions"))) : viewMode === "select" && savedCards.length > 0 ? /* @__PURE__ */ __h("form", {
		onSubmit: handlePayWithSavedCard,
		className: "saved-cards-form"
	}, /* @__PURE__ */ __h("div", { className: "saved-cards-header-row" }, /* @__PURE__ */ __h("span", { className: "saved-cards-header-title" }, t("selectSavedCard")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "add-new-card-link-btn",
		onClick: () => setViewMode("new"),
		disabled: isProcessing
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5"
	}, /* @__PURE__ */ __h("line", {
		x1: "12",
		y1: "5",
		x2: "12",
		y2: "19"
	}), /* @__PURE__ */ __h("line", {
		x1: "5",
		y1: "12",
		x2: "19",
		y2: "12"
	})), /* @__PURE__ */ __h("span", null, t("useNewCard")))), /* @__PURE__ */ __h("div", { className: "saved-cards-list" }, savedCards.map((card) => {
		const id = card.id !== undefined && card.id !== null ? card.id : card.Id;
		const isSelected = String(selectedCardId) === String(id);
		const isDef = card.isDefault || card.IsDefault;
		const cardBrand = (card.cardBrand || card.CardBrand || "Card").toLowerCase();
		const last4 = id !== undefined && id !== null ? String(id).padStart(4, "0") : "••••";
		const title = card.cardName || card.CardName || (cardBrand === "visa" ? "Visa Card" : cardBrand === "mastercard" ? "Mastercard" : "Bank Card");
		const expiry = card.expiryDate || card.ExpiryDate || "MM/YY";
		return /* @__PURE__ */ __h("div", {
			key: id,
			className: `saved-card-item ${isSelected ? "selected" : ""}`,
			onClick: () => setSelectedCardId(id)
		}, /* @__PURE__ */ __h("div", { className: "saved-card-item__radio" }, /* @__PURE__ */ __h("span", { className: `saved-card-radio-circle ${isSelected ? "active" : ""}` }, isSelected && /* @__PURE__ */ __h("span", { className: "saved-card-radio-dot" }))), /* @__PURE__ */ __h("div", { className: `saved-card-item__icon-badge saved-card-item__icon-badge--${cardBrand}` }, cardBrand === "visa" ? "VISA" : cardBrand === "mastercard" ? "MC" : "CARD"), /* @__PURE__ */ __h("div", { className: "saved-card-item__info" }, /* @__PURE__ */ __h("div", { className: "saved-card-item__title-row" }, /* @__PURE__ */ __h("span", { className: "saved-card-item__title" }, title), isDef && /* @__PURE__ */ __h("span", { className: "saved-card-item__badge-default" }, t("defaultBadge"))), /* @__PURE__ */ __h("div", { className: "saved-card-item__sub-row" }, /* @__PURE__ */ __h("span", { className: "saved-card-item__number" }, "•••• ", last4), /* @__PURE__ */ __h("span", { className: "saved-card-item__expiry" }, expiry))));
	})), /* @__PURE__ */ __h("div", { className: "stripe-checkout-actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm stripe-modal-btn stripe-modal-btn--cancel",
		onClick: onClose,
		disabled: isProcessing
	}, t("cancel")), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "cta-btn sm stripe-modal-btn stripe-modal-btn--submit",
		disabled: selectedCardId === null || selectedCardId === undefined || isProcessing
	}, isProcessing ? /* @__PURE__ */ __h("span", { className: "stripe-btn-loading" }, /* @__PURE__ */ __h("img", {
		src: loaderIconRed,
		alt: "Loading",
		className: "stripe-spinner"
	}), t("processing")) : t("payAmount", { amount: finalAmount })))) : /* @__PURE__ */ __h("form", {
		onSubmit: handlePayWithNewCard,
		className: "new-card-form",
		noValidate: true
	}, savedCards.length > 0 && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "back-to-saved-link",
		onClick: () => setViewMode("select"),
		disabled: isProcessing
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("line", {
		x1: "19",
		y1: "12",
		x2: "5",
		y2: "12"
	}), /* @__PURE__ */ __h("polyline", { points: "12 19 5 12 12 5" })), /* @__PURE__ */ __h("span", null, t("chooseFromSaved"))), /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "checkout-card-number" }, t("cardNumberLabel")), /* @__PURE__ */ __h("div", { className: "input-with-brand" }, /* @__PURE__ */ __h("input", {
		id: "checkout-card-number",
		type: "text",
		inputMode: "numeric",
		placeholder: "4123 4567 8901 2345",
		value: cardNumber,
		onChange: handleCardNumberChange,
		onBlur: () => handleBlur("cardNumber"),
		className: `form-input ${touched.cardNumber && errors.cardNumber ? "error" : ""}`,
		autoComplete: "cc-number",
		disabled: isProcessing
	}), /* @__PURE__ */ __h("div", { className: "brand-indicator" }, brand === "Visa" && /* @__PURE__ */ __h("span", { className: "badge-visa" }, "VISA"), brand === "Mastercard" && /* @__PURE__ */ __h("span", { className: "badge-mc" }, "MC"))), touched.cardNumber && errors.cardNumber && /* @__PURE__ */ __h("span", { className: "error-text" }, errors.cardNumber)), /* @__PURE__ */ __h("div", { className: "form-row" }, /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "checkout-card-expiry" }, t("expiryDateLabel")), /* @__PURE__ */ __h("input", {
		id: "checkout-card-expiry",
		type: "text",
		inputMode: "numeric",
		placeholder: "MM/YY",
		value: expiryDate,
		onChange: handleExpiryChange,
		onBlur: () => handleBlur("expiryDate"),
		className: `form-input ${touched.expiryDate && errors.expiryDate ? "error" : ""}`,
		autoComplete: "cc-exp",
		disabled: isProcessing
	}), touched.expiryDate && errors.expiryDate && /* @__PURE__ */ __h("span", { className: "error-text" }, errors.expiryDate)), /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "checkout-card-cvc" }, t("cvcLabel")), /* @__PURE__ */ __h("input", {
		id: "checkout-card-cvc",
		type: "password",
		inputMode: "numeric",
		placeholder: "•••",
		value: cvc,
		onChange: handleCvcChange,
		onBlur: () => handleBlur("cvc"),
		className: `form-input ${touched.cvc && errors.cvc ? "error" : ""}`,
		autoComplete: "cc-csc",
		disabled: isProcessing
	}), touched.cvc && errors.cvc && /* @__PURE__ */ __h("span", { className: "error-text" }, errors.cvc))), /* @__PURE__ */ __h("div", { className: "form-row" }, /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "checkout-cardholder-name" }, t("cardholderLabel")), /* @__PURE__ */ __h("input", {
		id: "checkout-cardholder-name",
		type: "text",
		placeholder: t("cardholderPlaceholder"),
		value: cardholderName,
		onChange: handleCardholderChange,
		onBlur: () => handleBlur("cardholderName"),
		className: "form-input",
		autoComplete: "cc-name",
		disabled: isProcessing
	})), /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "checkout-card-label" }, t("cardLabelLabel")), /* @__PURE__ */ __h("input", {
		id: "checkout-card-label",
		type: "text",
		placeholder: t("cardLabelPlaceholder"),
		value: cardName,
		onChange: (e) => setCardName(e.target.value),
		className: "form-input",
		disabled: isProcessing
	}))), /* @__PURE__ */ __h("div", { className: "checkboxes-row" }, /* @__PURE__ */ __h("label", { className: "custom-checkbox-label" }, /* @__PURE__ */ __h("input", {
		type: "checkbox",
		checked: saveCard,
		onChange: (e) => setSaveCard(e.target.checked),
		disabled: isProcessing
	}), /* @__PURE__ */ __h("span", { className: "checkbox-box" }), /* @__PURE__ */ __h("span", { className: "checkbox-text" }, t("saveCardCheckbox"))), /* @__PURE__ */ __h("label", { className: "custom-checkbox-label terms-label" }, /* @__PURE__ */ __h("input", {
		type: "checkbox",
		checked: agreedToRules,
		onChange: (e) => {
			setAgreedToRules(e.target.checked);
			if (e.target.checked) {
				setErrors((prev) => ({
					...prev,
					agreedToRules: null
				}));
			}
		},
		disabled: isProcessing
	}), /* @__PURE__ */ __h("span", { className: "checkbox-box" }), /* @__PURE__ */ __h("span", { className: "checkbox-text" }, t("agreeToRules"), " ", /* @__PURE__ */ __h(Link, {
		to: "/rules",
		target: "_blank",
		rel: "noopener noreferrer",
		className: "terms-link"
	}, t("paymentRulesLink"))))), touched.agreedToRules && errors.agreedToRules && /* @__PURE__ */ __h("span", {
		className: "error-text",
		style: {
			marginTop: "-4px",
			display: "block"
		}
	}, errors.agreedToRules), /* @__PURE__ */ __h("div", { className: "stripe-checkout-actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm stripe-modal-btn stripe-modal-btn--cancel",
		onClick: onClose,
		disabled: isProcessing
	}, t("cancel")), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "cta-btn sm stripe-modal-btn stripe-modal-btn--submit",
		disabled: !isNewCardValid || isProcessing
	}, isProcessing ? /* @__PURE__ */ __h("span", { className: "stripe-btn-loading" }, /* @__PURE__ */ __h("img", {
		src: loaderIconRed,
		alt: "Loading",
		className: "stripe-spinner"
	}), t("processing")) : t("payAmount", { amount: finalAmount })))))), /* @__PURE__ */ __h(PaymentErrorModal, {
		isOpen: isErrorModalOpen,
		onClose: () => setIsErrorModalOpen(false),
		message: errorMessage,
		title: t("paymentErrorTitle")
	}));
};
export default StripePaymentModal;
