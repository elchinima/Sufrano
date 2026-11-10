import { __h, __Fragment } from '../../../utils/runtime.js';
import React from "../../../utils/runtime.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
import { useLang } from "../../../utils/useLang.js";
import { getHomeTranslation } from "./Lang.js";
const SubscribeSuccessModal = ({ isOpen, onClose, message }) => {
	const lang = useLang();
	const t = (id) => getHomeTranslation(lang, id);
	return /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose,
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", {
		className: "rednest-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("div", { className: "rednest-modal__icon rednest-modal__icon--success" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" }))), /* @__PURE__ */ __h("h3", {
		className: "rednest-modal__title",
		"data-id": "home_modal_succ_title"
	}, t("home_modal_succ_title")), /* @__PURE__ */ __h("p", { className: "rednest-modal__text" }, message || "Successfully subscribed to the Süfrano Club!"), /* @__PURE__ */ __h("div", { className: "rednest-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "rednest-modal__btn rednest-modal__btn--success",
		onClick: onClose,
		"data-id": "home_modal_succ_btn"
	}, t("home_modal_succ_btn")))));
};
export default SubscribeSuccessModal;
