import { __h, __Fragment } from '../../../utils/runtime.js';
import React from "../../../utils/runtime.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
import { useLang } from "../../../utils/useLang.js";
import { getPaymentMethodsTranslation } from "./Lang.js";
const PaymentErrorModal = ({ isOpen, onClose, message, title = "Card Error" }) => {
	const lang = useLang();
	const t = (id) => getPaymentMethodsTranslation(lang, id);
	return /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose,
		targetBorderRadius: "24px",
		zIndex: 100005
	}, /* @__PURE__ */ __h("div", {
		className: "rednest-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("div", { className: "rednest-modal__icon rednest-modal__icon--danger" }, /* @__PURE__ */ __h("svg", {
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
		x1: "15",
		y1: "9",
		x2: "9",
		y2: "15"
	}), /* @__PURE__ */ __h("line", {
		x1: "9",
		y1: "9",
		x2: "15",
		y2: "15"
	}))), /* @__PURE__ */ __h("h3", { className: "rednest-modal__title" }, title), /* @__PURE__ */ __h("p", { className: "rednest-modal__text" }, message || "An error occurred while processing your card."), /* @__PURE__ */ __h("div", { className: "rednest-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "rednest-modal__btn rednest-modal__btn--danger",
		onClick: onClose
	}, t("modal_understand")))));
};
export default PaymentErrorModal;
