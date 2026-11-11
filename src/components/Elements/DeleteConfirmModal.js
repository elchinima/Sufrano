import { __h, __Fragment } from '../../utils/runtime.js';
import React from "../../utils/runtime.js";
import AnimatedModalWrapper from "./AnimatedModalWrapper.js";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
import { useLang } from "../../utils/useLang.js";
import { getWidgetTranslation } from "./Lang.js";
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, title, text, confirmLabel, loading }) => {
	const lang = useLang();
	const t = (id) => getWidgetTranslation(lang, id);
	const displayTitle = title || t("modal_delete_remove");
	const displayConfirmLabel = confirmLabel || t("modal_delete_remove");
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
	}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }), /* @__PURE__ */ __h("line", {
		x1: "10",
		y1: "11",
		x2: "10",
		y2: "17"
	}), /* @__PURE__ */ __h("line", {
		x1: "14",
		y1: "11",
		x2: "14",
		y2: "17"
	}))), /* @__PURE__ */ __h("h3", { className: "rednest-modal__title" }, displayTitle), /* @__PURE__ */ __h("p", { className: "rednest-modal__text" }, text || (itemName ? lang === "az" ? `${itemName} səbətinizdən silinsin?` : lang === "en" ? `Are you sure you want to remove ${itemName} from your basket?` : `Вы уверены, что хотите удалить ${itemName} из корзины?` : lang === "az" ? "Bu məhsulu silmək istədiyinizə əminsiniz?" : lang === "en" ? "Are you sure you want to remove this item?" : "Вы уверены, что хотите удалить этот элемент?")), /* @__PURE__ */ __h("div", { className: "rednest-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "rednest-modal__btn rednest-modal__btn--cancel",
		onClick: onClose,
		disabled: loading
	}, t("modal_delete_cancel")), /* @__PURE__ */ __h("button", {
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
	}), t("modal_delete_deleting")) : displayConfirmLabel))));
};
export default DeleteConfirmModal;
