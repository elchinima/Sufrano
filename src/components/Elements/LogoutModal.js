import { __h, __Fragment } from '../../utils/runtime.js';
import React from "../../utils/runtime.js";
import AnimatedModalWrapper from "./AnimatedModalWrapper.js";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
import { useLang } from "../../utils/useLang.js";
import { getWidgetTranslation } from "./Lang.js";
const LogoutModal = ({ isOpen, onClose, onConfirm, loading, title, text, confirmText }) => {
	const lang = useLang();
	const t = (id) => getWidgetTranslation(lang, id);
	const displayTitle = title || t("modal_logout_title");
	const displayText = text || t("modal_logout_text");
	const displayConfirmText = confirmText || t("modal_logout_confirm");
	return /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose: () => !loading && onClose(),
		targetBorderRadius: "24px"
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
	}, /* @__PURE__ */ __h("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), /* @__PURE__ */ __h("polyline", { points: "16 17 21 12 16 7" }), /* @__PURE__ */ __h("line", {
		x1: "21",
		y1: "12",
		x2: "9",
		y2: "12"
	}))), /* @__PURE__ */ __h("h3", { className: "rednest-modal__title" }, displayTitle), /* @__PURE__ */ __h("p", { className: "rednest-modal__text" }, displayText), /* @__PURE__ */ __h("div", { className: "rednest-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "rednest-modal__btn rednest-modal__btn--cancel",
		onClick: onClose,
		disabled: loading
	}, t("modal_logout_cancel")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "rednest-modal__btn rednest-modal__btn--danger",
		onClick: onConfirm,
		disabled: loading
	}, loading ? /* @__PURE__ */ __h("span", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		color: "#d4b475"
	} }, /* @__PURE__ */ __h("img", {
		src: loaderIconRed,
		alt: "Loading",
		style: {
			width: "18px",
			height: "18px"
		}
	}), t("modal_delete_deleting")) : displayConfirmText))));
};
export default LogoutModal;
