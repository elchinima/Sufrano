import { __h, __Fragment } from '../../../utils/runtime.js';
import React from "../../../utils/runtime.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
import { useLang } from "../../../utils/useLang.js";
import { getHomeTranslation } from "./Lang.js";
const SubscribeErrorModal = ({ isOpen, onClose, message, errorType, onOpenRegister }) => {
	const lang = useLang();
	const t = (id) => getHomeTranslation(lang, id);
	const isAlreadySubscribed = errorType === "ALREADY_SUBSCRIBED" || typeof message === "string" && message.toLowerCase().includes("already subscribed");
	const isAccountRequired = errorType === "ACCOUNT_NOT_FOUND" || typeof message === "string" && message.toLowerCase().includes("not registered");
	const title = isAlreadySubscribed ? lang === "ru" ? "Уже подписаны" : lang === "az" ? "Artıq abunə olmusunuz" : "Already Subscribed" : isAccountRequired ? lang === "ru" ? "Требуется аккаунт" : lang === "az" ? "Hesab tələb olunur" : "Account Required" : t("home_modal_err_title");
	return /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose,
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", {
		className: "rednest-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("div", { className: "rednest-modal__icon rednest-modal__icon--warning" }, isAlreadySubscribed ? /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ __h("polyline", { points: "22,6 12,13 2,6" })) : /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
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
	}))), /* @__PURE__ */ __h("h3", {
		className: "rednest-modal__title",
		"data-id": "home_modal_err_title"
	}, title), /* @__PURE__ */ __h("p", { className: "rednest-modal__text" }, message || (isAlreadySubscribed ? lang === "ru" ? "Этот адрес электронной почты уже подписан на рассылку. Если у вас возникли вопросы, свяжитесь со службой поддержки." : lang === "az" ? "Bu e-poç ünvanı artıq bülletenə abunədir. Suallarınız varsa, texniki dəstəklə əlaqə saxlayın." : "This email is already subscribed to the newsletter. If you have questions or need assistance, please contact technical support." : lang === "ru" ? "Этот адрес не зарегистрирован. Пожалуйста, сначала создайте аккаунт." : lang === "az" ? "Bu e-poç qeydiyyatdan keçməyib. Zəhmət olmasa, əvvəlcə hesab yaradın." : "This email is not registered. Please create an account first.")), /* @__PURE__ */ __h("div", { className: "rednest-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "rednest-modal__btn rednest-modal__btn--cancel",
		onClick: onClose,
		"data-id": "home_modal_err_close"
	}, t("home_modal_err_close")), isAlreadySubscribed && /* @__PURE__ */ __h("a", {
		href: "mailto:hello@sufrano.com?subject=Newsletter%20Subscription%20Support",
		className: "rednest-modal__btn rednest-modal__btn--danger",
		style: {
			textDecoration: "none",
			background: "#d97706",
			boxShadow: "0 4px 14px rgba(217, 119, 6, 0.35)"
		},
		onClick: onClose
	}, lang === "ru" ? "Служба поддержки" : lang === "az" ? "Dəstək xidməti" : "Contact Support"), !isAlreadySubscribed && isAccountRequired && onOpenRegister && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "rednest-modal__btn rednest-modal__btn--danger",
		style: {
			background: "#d4af37",
			boxShadow: "0 4px 14px rgba(212, 175, 55, 0.35)"
		},
		onClick: () => {
			onClose();
			onOpenRegister();
		},
		"data-id": "home_modal_err_create_acc"
	}, t("home_modal_err_create_acc")))));
};
export default SubscribeErrorModal;
