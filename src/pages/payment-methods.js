(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/UserPages/PaymentMethods/AddCardModal.js
	__define("components/UserPages/PaymentMethods/AddCardModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useMemo } = __imp_0;
		const { Link } = __require("utils/router.js");
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const { useLang } = __require("utils/useLang.js");
		const { getPaymentMethodsTranslation } = __require("components/UserPages/PaymentMethods/Lang.js");
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
				color: "#e5c158"
			} }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Saving",
				style: {
					width: "16px",
					height: "16px"
				}
			}), t("card_btn_saving")) : t("card_btn_add"))))));
		};

		Object.defineProperty(exports, "getCardBrand", { enumerable: true, get: function () { return getCardBrand; } });
		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return AddCardModal; } });
	});
	//#endregion

	//#region components/UserPages/PaymentMethods/PaymentMethods.js
	__define("components/UserPages/PaymentMethods/PaymentMethods.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useMemo } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { Link, useNavigate } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const __imp_1 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Footer/Footer.js");
		const Footer = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const __imp_3 = __require("components/Elements/DeleteConfirmModal.js");
		const DeleteConfirmModal = __imp_3.default !== undefined ? __imp_3.default : __imp_3;
		const __imp_4 = __require("components/UserPages/PaymentMethods/AddCardModal.js");
		const AddCardModal = __imp_4.default !== undefined ? __imp_4.default : __imp_4;
		const __imp_5 = __require("components/UserPages/PaymentMethods/PaymentErrorModal.js");
		const PaymentErrorModal = __imp_5.default !== undefined ? __imp_5.default : __imp_5;
		const { useLang } = __require("utils/useLang.js");
		const { getPaymentMethodsTranslation } = __require("components/UserPages/PaymentMethods/Lang.js");
		const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
		const formatBakuDate = (dateStr) => {
			if (!dateStr) return "";
			try {
				const d = new Date(dateStr);
				if (isNaN(d.getTime())) return "";
				const day = String(d.getDate()).padStart(2, "0");
				const month = String(d.getMonth() + 1).padStart(2, "0");
				const year = d.getFullYear();
				return `${day}.${month}.${year}`;
			} catch {
				return "";
			}
		};
		const cardVariants = {
			hidden: {
				opacity: 0,
				y: 20,
				scale: .98
			},
			visible: (i) => ({
				opacity: 1,
				y: 0,
				scale: 1,
				transition: {
					delay: i * .05,
					duration: .4,
					ease: [
						.16,
						1,
						.3,
						1
					]
				}
			}),
			exit: {
				opacity: 0,
				scale: .96,
				transition: { duration: .2 }
			}
		};
		const PaymentMethods = () => {
			const { user } = useAuth();
			const navigate = useNavigate();
			const lang = useLang();
			const t = (id) => getPaymentMethodsTranslation(lang, id);
			const [cards, setCards] = useState([]);
			const [loading, setLoading] = useState(true);
			const [error, setError] = useState(null);
			const [isAddModalOpen, setIsAddModalOpen] = useState(false);
			const [addLoading, setAddLoading] = useState(false);
			const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
			const [errorModalMessage, setErrorModalMessage] = useState("");
			const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
			const [cardToDelete, setCardToDelete] = useState(null);
			const [deleteLoading, setDeleteLoading] = useState(false);
			const [toastMessage, setToastMessage] = useState(null);
			const [toastType, setToastType] = useState("success");
			const [settingDefaultId, setSettingDefaultId] = useState(null);
			const showToast = (msg, type = "success", duration = 3e3) => {
				setToastMessage(msg);
				setToastType(type);
				setTimeout(() => {
					setToastMessage(null);
				}, duration);
			};
			const fetchCards = async () => {
				setLoading(true);
				setError(null);
				try {
					let res = await fetchWithRefresh(`${apiUrl}/api/payment-methods`);
					if (!res.ok && res.status === 404) {
						res = await fetchWithRefresh(`${apiUrl}/api/paymentmethods`);
					}
					if (!res.ok) {
						throw new Error("Failed to load saved payment methods.");
					}
					const data = await res.json();
					setCards(Array.isArray(data) ? data : []);
				} catch (err) {
					console.error("Error fetching cards:", err);
					setError(err.message || "Unable to connect to server.");
				} finally {
					setLoading(false);
				}
			};
			useEffect(() => {
				fetchCards();
			}, []);
			const handleSaveCard = async (cardData) => {
				setAddLoading(true);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/payment-methods`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(cardData)
					});
					const data = await res.json();
					if (!res.ok) {
						throw new Error(data.message || "Failed to add card.");
					}
					setIsAddModalOpen(false);
					await fetchCards();
					showToast(t("pm_toast_added"));
				} catch (err) {
					setErrorModalMessage(err.message || "Failed to add card.");
					setIsErrorModalOpen(true);
				} finally {
					setAddLoading(false);
				}
			};
			const handleSetDefault = async (card) => {
				const cardId = card.id || card.Id;
				if (!card || card.isDefault || card.IsDefault || settingDefaultId) return;
				setSettingDefaultId(cardId);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/payment-methods/${cardId}/default`, { method: "PATCH" });
					if (!res.ok) {
						throw new Error("Failed to set default payment method.");
					}
					setCards((prev) => prev.map((c) => ({
						...c,
						isDefault: (c.id || c.Id) === cardId,
						IsDefault: (c.id || c.Id) === cardId
					})).sort((a, b) => (b.isDefault || b.IsDefault ? 1 : 0) - (a.isDefault || a.IsDefault ? 1 : 0)));
					showToast(`"${card.cardName || card.CardName || "Card"}" ${t("pm_toast_default")}`);
				} catch (err) {
					showToast(err.message || "Error setting default payment method.", "error");
				} finally {
					setSettingDefaultId(null);
				}
			};
			const handleConfirmDelete = async () => {
				if (!cardToDelete || deleteLoading) return;
				setDeleteLoading(true);
				try {
					const cardId = cardToDelete.id || cardToDelete.Id;
					const res = await fetchWithRefresh(`${apiUrl}/api/payment-methods/${cardId}`, { method: "DELETE" });
					if (!res.ok) {
						throw new Error("Failed to remove card.");
					}
					setCards((prev) => {
						const remaining = prev.filter((c) => (c.id || c.Id) !== cardId);
						const wasDefault = cardToDelete.isDefault || cardToDelete.IsDefault;
						if (wasDefault && remaining.length > 0 && !remaining.some((c) => c.isDefault || c.IsDefault)) {
							remaining[0].isDefault = true;
							remaining[0].IsDefault = true;
						}
						return remaining;
					});
					showToast(t("pm_toast_deleted"));
					setIsDeleteModalOpen(false);
					setCardToDelete(null);
				} catch (err) {
					showToast(err.message || "Error deleting payment card.", "error");
				} finally {
					setDeleteLoading(false);
				}
			};
			const isEmpty = !loading && cards.length === 0;
			return /* @__PURE__ */ __h(motion.div, {
				className: "payment-methods-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: `payment-methods-main ${isEmpty ? "payment-methods-main--empty" : ""}` }, /* @__PURE__ */ __h("div", { className: `payment-methods-container ${isEmpty ? "payment-methods-container--empty" : ""}` }, /* @__PURE__ */ __h(motion.div, {
				className: "payment-methods-hero",
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
			}, /* @__PURE__ */ __h("h1", null, t("pm_hero_title")), /* @__PURE__ */ __h("p", { className: "payment-methods-hero__desc" }, t("pm_hero_desc")), /* @__PURE__ */ __h("div", { className: "payment-methods-hero__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn primary-red payment-methods-hero__add-btn",
				onClick: () => {
					if (cards.length >= 3) {
						setErrorModalMessage(t("pm_limit_reached"));
						setIsErrorModalOpen(true);
					} else {
						setIsAddModalOpen(true);
					}
				}
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
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
			})), /* @__PURE__ */ __h("span", null, t("pm_btn_add"))))), loading ? /* @__PURE__ */ __h("div", { className: "payment-methods-loading-state" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "payment-methods-loader-icon"
			}), /* @__PURE__ */ __h("p", null, t("pm_loading"))) : error ? /* @__PURE__ */ __h("div", { className: "payment-methods-error-state" }, /* @__PURE__ */ __h("p", null, error), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm secondary",
				onClick: fetchCards
			}, t("pm_try_again"))) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", { className: "payment-methods-grid" }, /* @__PURE__ */ __h(AnimatePresence, null, cards.map((card, idx) => {
				const id = card.id || card.Id;
				const isDef = card.isDefault || card.IsDefault;
				const brand = (card.cardBrand || card.CardBrand || "Card").toLowerCase();
				const last4 = id ? String(id).padStart(4, "0") : "••••";
				const expiry = card.expiryDate || card.ExpiryDate || "MM/YY";
				const holder = card.cardholderName || card.CardholderName || user?.name || "CARDHOLDER";
				const title = card.cardName || card.CardName || (brand === "visa" ? "Visa Card" : brand === "mastercard" ? "Mastercard" : "Bank Card");
				const createdAt = card.createdAt || card.CreatedAt;
				return /* @__PURE__ */ __h(motion.div, {
					key: id,
					className: `payment-card ${isDef ? "payment-card--default" : ""}`,
					variants: cardVariants,
					initial: "hidden",
					animate: "visible",
					exit: "exit",
					custom: idx,
					layout: true
				}, /* @__PURE__ */ __h("div", { className: "payment-card__header" }, /* @__PURE__ */ __h("div", { className: "payment-card__title-group" }, /* @__PURE__ */ __h("div", { className: `payment-card__icon-badge payment-card__icon-badge--${brand}` }, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
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
				}))), /* @__PURE__ */ __h("div", { className: "payment-card__meta" }, /* @__PURE__ */ __h("h3", { className: "payment-card__title" }, title), createdAt ? /* @__PURE__ */ __h("span", { className: "payment-card__date" }, t("pm_added_on"), " ", formatBakuDate(createdAt)) : /* @__PURE__ */ __h("span", { className: "payment-card__date" }, brand.toUpperCase(), " Card"))), /* @__PURE__ */ __h("div", { className: "payment-card__badges" }, isDef && /* @__PURE__ */ __h("span", { className: "payment-card__badge-default" }, /* @__PURE__ */ __h("span", { className: "pulsing-dot" }), t("pm_badge_default")))), /* @__PURE__ */ __h("div", { className: "payment-card__body" }, /* @__PURE__ */ __h("div", { className: "payment-card__number-row" }, /* @__PURE__ */ __h("div", { className: "payment-card__number" }, /* @__PURE__ */ __h("span", { className: "dots-group" }, "••••"), /* @__PURE__ */ __h("span", { className: "last-digits" }, last4)), /* @__PURE__ */ __h("div", { className: "payment-card__brand-tag" }, brand === "visa" && /* @__PURE__ */ __h("span", { className: "tag-visa" }, "VISA"), brand === "mastercard" && /* @__PURE__ */ __h("span", { className: "tag-mc" }, "MC"), brand !== "visa" && brand !== "mastercard" && /* @__PURE__ */ __h("span", { className: "tag-generic" }, "CARD"))), /* @__PURE__ */ __h("div", { className: "payment-card__details-grid" }, /* @__PURE__ */ __h("div", { className: "payment-card__detail-item" }, /* @__PURE__ */ __h("span", { className: "payment-card__detail-label" }, t("pm_cardholder")), /* @__PURE__ */ __h("span", { className: "payment-card__detail-val" }, holder)), /* @__PURE__ */ __h("div", { className: "payment-card__detail-item" }, /* @__PURE__ */ __h("span", { className: "payment-card__detail-label" }, t("pm_expires")), /* @__PURE__ */ __h("span", { className: "payment-card__detail-val" }, expiry)))), /* @__PURE__ */ __h("div", { className: "payment-card__footer" }, /* @__PURE__ */ __h("div", { className: "payment-card__footer-left" }, !isDef && /* @__PURE__ */ __h("button", {
					type: "button",
					className: "payment-card__action-btn payment-card__action-btn--default",
					onClick: () => handleSetDefault(card),
					disabled: settingDefaultId === id,
					title: t("pm_set_default")
				}, settingDefaultId === id ? /* @__PURE__ */ __h("span", { style: {
					display: "flex",
					alignItems: "center",
					gap: "6px",
					color: "#e5c158"
				} }, /* @__PURE__ */ __h("img", {
					src: loaderIconRed,
					alt: "",
					style: {
						width: "14px",
						height: "14px"
					}
				}), /* @__PURE__ */ __h("span", null, t("pm_setting_default"))) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" })), /* @__PURE__ */ __h("span", null, t("pm_set_default"))))), /* @__PURE__ */ __h("div", { className: "payment-card__footer-right" }, /* @__PURE__ */ __h("button", {
					type: "button",
					className: "payment-card__action-btn payment-card__action-btn--delete",
					onClick: () => {
						setCardToDelete(card);
						setIsDeleteModalOpen(true);
					},
					title: t("pm_delete")
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })), /* @__PURE__ */ __h("span", null, t("pm_delete"))))));
			})))))), /* @__PURE__ */ __h(AddCardModal, {
				isOpen: isAddModalOpen,
				onClose: () => setIsAddModalOpen(false),
				onSave: handleSaveCard,
				loading: addLoading
			}), /* @__PURE__ */ __h(DeleteConfirmModal, {
				isOpen: isDeleteModalOpen,
				onClose: () => {
					setIsDeleteModalOpen(false);
					setCardToDelete(null);
				},
				onConfirm: handleConfirmDelete,
				itemName: cardToDelete ? `${cardToDelete.cardName || cardToDelete.CardName || "Card"} ${t("pm_ending_in")} ${cardToDelete.id || cardToDelete.Id ? String(cardToDelete.id || cardToDelete.Id).padStart(4, "0") : "••••"}` : t("pm_this_card"),
				loading: deleteLoading
			}), /* @__PURE__ */ __h(PaymentErrorModal, {
				isOpen: isErrorModalOpen,
				onClose: () => setIsErrorModalOpen(false),
				message: errorModalMessage,
				title: t("pm_limit_title")
			}), /* @__PURE__ */ __h("div", { className: "payment-methods-toast-container" }, /* @__PURE__ */ __h(AnimatePresence, null, toastMessage && /* @__PURE__ */ __h(motion.div, {
				className: `payment-methods-toast ${toastType === "error" ? "payment-methods-toast--error" : ""}`,
				initial: {
					opacity: 0,
					y: 20,
					scale: .95
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: 10,
					scale: .95
				},
				transition: { duration: .25 }
			}, toastType === "error" ? /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "20",
				height: "20",
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
			})) : /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "20",
				height: "20",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" })), /* @__PURE__ */ __h("span", null, toastMessage)))), /* @__PURE__ */ __h(Footer, null));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return PaymentMethods; } });
	});
	//#endregion

	var entryExports = __require("components/UserPages/PaymentMethods/PaymentMethods.js");
	__pages["payment-methods"] = entryExports.default || entryExports;
})();
