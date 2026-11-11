import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useMemo } from "../../../utils/runtime.js";
import { Link } from "../../../utils/router.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
import { useLang } from "../../../utils/useLang.js";
import { getPaymentMethodsTranslation } from "./Lang.js";
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
export const getCardBrand = (digits) => {
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
const AddCardModal = ({ isOpen, onClose, onSave, loading }) => {
	const lang = useLang();
	const t = (id) => getPaymentMethodsTranslation(lang, id);
	const [cardNumber, setCardNumber] = useState("");
	const [expiryDate, setExpiryDate] = useState("");
	const [cvc, setCvc] = useState("");
	const [cardholderName, setCardholderName] = useState("");
	const [cardName, setCardName] = useState("");
	const [isDefault, setIsDefault] = useState(false);
	const [agreedToRules, setAgreedToRules] = useState(false);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	useEffect(() => {
		if (isOpen) {
			setCardNumber("");
			setExpiryDate("");
			setCvc("");
			setCardholderName("");
			setCardName("");
			setIsDefault(false);
			setAgreedToRules(false);
			setErrors({});
			setTouched({});
		}
	}, [isOpen]);
	const cleanDigits = useMemo(() => cardNumber.replace(/\D/g, ""), [cardNumber]);
	const brand = useMemo(() => getCardBrand(cleanDigits), [cleanDigits]);
	const handleCardNumberChange = (e) => {
		const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
		const parts = raw.match(/[\s\S]{1,4}/g) || [];
		setCardNumber(parts.join(" "));
	};
	const handleExpiryChange = (e) => {
		let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
		if (raw.length >= 3) {
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
	const validate = () => {
		const newErrors = {};
		if (!cleanDigits) {
			newErrors.cardNumber = t("card_err_num_req");
		} else if (cleanDigits.length < 16) {
			newErrors.cardNumber = t("card_err_num_len");
		} else if (!brand) {
			newErrors.cardNumber = t("card_err_brand");
		} else if (!checkLuhn(cleanDigits)) {
			newErrors.cardNumber = t("card_err_luhn");
		}
		if (!expiryDate) {
			newErrors.expiryDate = t("card_err_exp_req");
		} else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
			newErrors.expiryDate = t("card_err_exp_fmt");
		} else {
			const [mStr, yStr] = expiryDate.split("/");
			const month = parseInt(mStr, 10);
			const year = parseInt(yStr, 10) + 2e3;
			const now = new Date();
			const currentYear = now.getFullYear();
			const currentMonth = now.getMonth() + 1;
			if (month < 1 || month > 12) {
				newErrors.expiryDate = t("card_err_exp_month");
			} else if (year < currentYear || year === currentYear && month < currentMonth) {
				newErrors.expiryDate = t("card_err_exp_past");
			}
		}
		if (!cvc) {
			newErrors.cvc = t("card_err_cvc_req");
		} else if (cvc.length !== 3) {
			newErrors.cvc = t("card_err_cvc_len");
		}
		if (cardholderName && cardholderName.trim().length < 3) {
			newErrors.cardholderName = t("card_err_holder");
		}
		if (!agreedToRules) {
			newErrors.agreedToRules = t("card_err_rules");
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setTouched({
			cardNumber: true,
			expiryDate: true,
			cvc: true,
			cardholderName: true,
			agreedToRules: true
		});
		if (!validate()) return;
		onSave({
			cardNumber: cleanDigits,
			expiryDate: expiryDate.trim(),
			cvc: cvc.trim(),
			cardholderName: cardholderName.trim(),
			cardName: cardName.trim() || undefined,
			isDefault
		});
	};
	const isFormValid = cleanDigits.length === 16 && brand && expiryDate.length === 5 && cvc.length === 3 && agreedToRules;
	return /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose: () => !loading && onClose(),
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", {
		className: "add-card-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "add-card-modal__close-btn",
		onClick: onClose,
		disabled: loading,
		"aria-label": "Close modal"
	}, "✕"), /* @__PURE__ */ __h("div", { className: "add-card-modal__header" }, /* @__PURE__ */ __h("div", { className: "add-card-modal__icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("rect", {
		x: "1",
		y: "4",
		width: "22",
		height: "16",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ __h("line", {
		x1: "1",
		y1: "10",
		x2: "23",
		y2: "10"
	}))), /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h3", { className: "add-card-modal__title" }, t("card_modal_title")), /* @__PURE__ */ __h("p", { className: "add-card-modal__subtitle" }, t("card_modal_subtitle")))), /* @__PURE__ */ __h("div", { className: `card-preview ${brand ? `card-preview--${brand.toLowerCase()}` : ""}` }, /* @__PURE__ */ __h("div", { className: "card-preview__top" }, /* @__PURE__ */ __h("div", { className: "card-preview__chip" }, /* @__PURE__ */ __h("div", { className: "card-preview__chip-lines" })), /* @__PURE__ */ __h("div", { className: "card-preview__contactless" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5"
	}, /* @__PURE__ */ __h("path", { d: "M8.5 16.5a5 5 0 0 1 0-9" }), /* @__PURE__ */ __h("path", { d: "M12 19a8.5 8.5 0 0 1 0-14" }), /* @__PURE__ */ __h("path", { d: "M15.5 21.5a12 12 0 0 1 0-19" }))), /* @__PURE__ */ __h("div", { className: "card-preview__brand-badge" }, brand === "Visa" && /* @__PURE__ */ __h("span", { className: "brand-logo brand-logo--visa" }, "VISA"), brand === "Mastercard" && /* @__PURE__ */ __h("div", { className: "brand-logo--mc" }, /* @__PURE__ */ __h("span", { className: "mc-circle mc-circle--red" }), /* @__PURE__ */ __h("span", { className: "mc-circle mc-circle--yellow" })), !brand && /* @__PURE__ */ __h("span", { className: "brand-logo--generic" }, "CARD"))), /* @__PURE__ */ __h("div", { className: "card-preview__number" }, cardNumber || "•••• •••• •••• ••••"), /* @__PURE__ */ __h("div", { className: "card-preview__bottom" }, /* @__PURE__ */ __h("div", { className: "card-preview__holder" }, /* @__PURE__ */ __h("span", { className: "card-preview__label" }, t("pm_cardholder").toUpperCase()), /* @__PURE__ */ __h("span", { className: "card-preview__val" }, cardholderName || "NAME SURNAME")), /* @__PURE__ */ __h("div", { className: "card-preview__expires" }, /* @__PURE__ */ __h("span", { className: "card-preview__label" }, t("pm_expires").toUpperCase()), /* @__PURE__ */ __h("span", { className: "card-preview__val" }, expiryDate || "MM/YY")))), /* @__PURE__ */ __h("form", {
		className: "add-card-form",
		onSubmit: handleSubmit,
		noValidate: true
	}, /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "card-number" }, t("card_number")), /* @__PURE__ */ __h("div", { className: "input-with-brand" }, /* @__PURE__ */ __h("input", {
		id: "card-number",
		type: "text",
		inputMode: "numeric",
		placeholder: "4123 4567 8901 2345",
		value: cardNumber,
		onChange: handleCardNumberChange,
		onBlur: () => handleBlur("cardNumber"),
		className: `form-input ${touched.cardNumber && errors.cardNumber ? "error" : ""}`,
		autoComplete: "cc-number",
		disabled: loading
	}), /* @__PURE__ */ __h("div", { className: "brand-indicator" }, brand === "Visa" && /* @__PURE__ */ __h("span", { className: "badge-visa" }, "VISA"), brand === "Mastercard" && /* @__PURE__ */ __h("span", { className: "badge-mc" }, "MC"))), touched.cardNumber && errors.cardNumber && /* @__PURE__ */ __h("span", { className: "error-text" }, errors.cardNumber)), /* @__PURE__ */ __h("div", { className: "form-row" }, /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "card-expiry" }, t("card_expiry")), /* @__PURE__ */ __h("input", {
		id: "card-expiry",
		type: "text",
		inputMode: "numeric",
		placeholder: "MM/YY",
		value: expiryDate,
		onChange: handleExpiryChange,
		onBlur: () => handleBlur("expiryDate"),
		className: `form-input ${touched.expiryDate && errors.expiryDate ? "error" : ""}`,
		autoComplete: "cc-exp",
		disabled: loading
	}), touched.expiryDate && errors.expiryDate && /* @__PURE__ */ __h("span", { className: "error-text" }, errors.expiryDate)), /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "card-cvc" }, t("card_cvc")), /* @__PURE__ */ __h("input", {
		id: "card-cvc",
		type: "password",
		inputMode: "numeric",
		placeholder: "•••",
		value: cvc,
		onChange: handleCvcChange,
		onBlur: () => handleBlur("cvc"),
		className: `form-input ${touched.cvc && errors.cvc ? "error" : ""}`,
		autoComplete: "cc-csc",
		disabled: loading
	}), touched.cvc && errors.cvc && /* @__PURE__ */ __h("span", { className: "error-text" }, errors.cvc))), /* @__PURE__ */ __h("div", { className: "form-row" }, /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "cardholder-name" }, t("card_holder_label")), /* @__PURE__ */ __h("input", {
		id: "cardholder-name",
		type: "text",
		placeholder: t("card_holder_ph"),
		value: cardholderName,
		onChange: handleCardholderChange,
		onBlur: () => handleBlur("cardholderName"),
		className: "form-input",
		autoComplete: "cc-name",
		disabled: loading
	})), /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "card-label" }, t("card_name_label")), /* @__PURE__ */ __h("input", {
		id: "card-label",
		type: "text",
		placeholder: t("card_name_ph"),
		value: cardName,
		onChange: (e) => setCardName(e.target.value),
		className: "form-input",
		disabled: loading
	}))), /* @__PURE__ */ __h("div", { className: "checkboxes-row" }, /* @__PURE__ */ __h("label", { className: "custom-checkbox-label" }, /* @__PURE__ */ __h("input", {
		type: "checkbox",
		checked: isDefault,
		onChange: (e) => setIsDefault(e.target.checked),
		disabled: loading
	}), /* @__PURE__ */ __h("span", { className: "checkbox-box" }), /* @__PURE__ */ __h("span", { className: "checkbox-text" }, t("card_set_default"))), /* @__PURE__ */ __h("label", { className: "custom-checkbox-label terms-label" }, /* @__PURE__ */ __h("input", {
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
		disabled: loading
	}), /* @__PURE__ */ __h("span", { className: "checkbox-box" }), /* @__PURE__ */ __h("span", { className: "checkbox-text" }, t("card_agree_prefix"), /* @__PURE__ */ __h(Link, {
		to: "/rules",
		target: "_blank",
		rel: "noopener noreferrer",
		className: "terms-link"
	}, t("card_agree_rules"))))), touched.agreedToRules && errors.agreedToRules && /* @__PURE__ */ __h("span", {
		className: "error-text",
		style: {
			marginTop: "-4px",
			display: "block"
		}
	}, errors.agreedToRules), /* @__PURE__ */ __h("div", { className: "add-card-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn secondary sm",
		onClick: onClose,
		disabled: loading
	}, t("card_btn_cancel")), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "cta-btn primary sm",
		disabled: loading || !isFormValid
	}, loading ? /* @__PURE__ */ __h("span", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		color: "#d4b475"
	} }, /* @__PURE__ */ __h("img", {
		src: loaderIconRed,
		alt: "Saving",
		style: {
			width: "16px",
			height: "16px"
		}
	}), t("card_btn_saving")) : t("card_btn_add"))))));
};
export default AddCardModal;
