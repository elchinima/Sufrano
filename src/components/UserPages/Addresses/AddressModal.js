import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect } from "../../../utils/runtime.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
import { useLang } from "../../../utils/useLang.js";
import { getAddressesTranslation } from "./Lang.js";
const ButtonSpinner = () => /* @__PURE__ */ __h("img", {
	src: loaderIconRed,
	alt: "Loading...",
	className: "address-btn-spinner",
	style: {
		width: "18px",
		height: "18px"
	}
});
const AddressModal = ({ isOpen, onClose, onSave, addressToEdit, loading }) => {
	const lang = useLang();
	const t = (id) => getAddressesTranslation(lang, id);
	const isEditing = Boolean(addressToEdit && addressToEdit.id);
	const [title, setTitle] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [apartment, setApartment] = useState("");
	const [phone, setPhone] = useState("");
	const [notes, setNotes] = useState("");
	const [isDefault, setIsDefault] = useState(false);
	const [error, setError] = useState("");
	useEffect(() => {
		if (isOpen) {
			if (addressToEdit) {
				setTitle(addressToEdit.title || "");
				setAddress(addressToEdit.address || "");
				setCity(addressToEdit.city || "");
				setApartment(addressToEdit.apartment || "");
				setPhone(addressToEdit.phone || "");
				setNotes(addressToEdit.notes || "");
				setIsDefault(Boolean(addressToEdit.isDefault));
			} else {
				setTitle("");
				setAddress("");
				setCity("");
				setApartment("");
				setPhone("");
				setNotes("");
				setIsDefault(false);
			}
			setError("");
		}
	}, [isOpen, addressToEdit]);
	const handleClose = () => {
		if (loading) return;
		setError("");
		onClose();
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (loading) return;
		setError("");
		if (!address.trim()) {
			setError(t("modal_err_street"));
			return;
		}
		if (!city.trim()) {
			setError(t("modal_err_city"));
			return;
		}
		if (!phone.trim()) {
			setError(t("modal_err_phone"));
			return;
		}
		onSave({
			title: title.trim() || null,
			address: address.trim(),
			city: city.trim(),
			apartment: apartment.trim() || null,
			phone: phone.trim(),
			notes: notes.trim() || null,
			isDefault
		});
	};
	return /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose: handleClose,
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", {
		className: "address-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "address-modal__close",
		onClick: handleClose,
		disabled: loading,
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
	}))), /* @__PURE__ */ __h("div", { className: "address-modal__header" }, /* @__PURE__ */ __h("div", { className: "address-modal__icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), /* @__PURE__ */ __h("circle", {
		cx: "12",
		cy: "10",
		r: "3"
	}))), /* @__PURE__ */ __h("h2", { className: "address-modal__title" }, isEditing ? t("modal_title_edit") : t("modal_title_add")), /* @__PURE__ */ __h("p", { className: "address-modal__desc" }, isEditing ? t("modal_desc_edit") : t("modal_desc_add"))), /* @__PURE__ */ __h("form", {
		className: "address-modal__form",
		onSubmit: handleSubmit
	}, error && /* @__PURE__ */ __h("div", { className: "address-modal__error" }, /* @__PURE__ */ __h("svg", {
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
	})), /* @__PURE__ */ __h("span", null, error)), /* @__PURE__ */ __h("div", { className: "address-modal__row" }, /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-title" }, t("modal_label_title")), /* @__PURE__ */ __h("input", {
		id: "addr-title",
		type: "text",
		placeholder: t("modal_ph_title"),
		value: title,
		onChange: (e) => {
			setTitle(e.target.value);
			if (error) setError("");
		},
		maxLength: 40,
		disabled: loading
	})), /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-city" }, t("modal_label_city"), " ", /* @__PURE__ */ __h("span", { className: "address-modal__required" }, "*")), /* @__PURE__ */ __h("input", {
		id: "addr-city",
		type: "text",
		placeholder: t("modal_ph_city"),
		value: city,
		onChange: (e) => {
			setCity(e.target.value);
			if (error) setError("");
		},
		required: true,
		disabled: loading
	}))), /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-street" }, t("modal_label_street"), " ", /* @__PURE__ */ __h("span", { className: "address-modal__required" }, "*")), /* @__PURE__ */ __h("input", {
		id: "addr-street",
		type: "text",
		placeholder: t("modal_ph_street"),
		value: address,
		onChange: (e) => {
			setAddress(e.target.value);
			if (error) setError("");
		},
		required: true,
		disabled: loading
	})), /* @__PURE__ */ __h("div", { className: "address-modal__row" }, /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-apt" }, t("modal_label_apt")), /* @__PURE__ */ __h("input", {
		id: "addr-apt",
		type: "text",
		placeholder: t("modal_ph_apt"),
		value: apartment,
		onChange: (e) => setApartment(e.target.value),
		disabled: loading
	})), /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-phone" }, t("modal_label_phone"), " ", /* @__PURE__ */ __h("span", { className: "address-modal__required" }, "*")), /* @__PURE__ */ __h("input", {
		id: "addr-phone",
		type: "tel",
		placeholder: t("modal_ph_phone"),
		value: phone,
		onChange: (e) => {
			setPhone(e.target.value);
			if (error) setError("");
		},
		required: true,
		disabled: loading
	}))), /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-notes" }, t("modal_label_notes")), /* @__PURE__ */ __h("textarea", {
		id: "addr-notes",
		placeholder: t("modal_ph_notes"),
		value: notes,
		onChange: (e) => setNotes(e.target.value),
		rows: 2,
		maxLength: 200,
		disabled: loading
	})), /* @__PURE__ */ __h("div", {
		className: "address-modal__default-toggle",
		onClick: () => !loading && setIsDefault((prev) => !prev)
	}, /* @__PURE__ */ __h("span", { className: "address-modal__toggle-title" }, t("modal_toggle_default")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: `address-modal__switch ${isDefault ? "address-modal__switch--on" : ""}`,
		"aria-label": t("modal_toggle_default"),
		disabled: loading,
		onClick: (e) => {
			e.stopPropagation();
			if (!loading) setIsDefault((prev) => !prev);
		}
	}, /* @__PURE__ */ __h("span", { className: "address-modal__switch-handle" }))), /* @__PURE__ */ __h("div", { className: "address-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm address-modal__btn address-modal__btn--cancel",
		onClick: handleClose,
		disabled: loading
	}, t("modal_btn_cancel")), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "cta-btn sm address-modal__btn address-modal__btn--submit",
		disabled: loading || !address.trim() || !phone.trim() || !city.trim()
	}, loading ? /* @__PURE__ */ __h("span", { className: "address-loader-inner" }, /* @__PURE__ */ __h(ButtonSpinner, null), isEditing ? t("modal_btn_saving") : t("modal_btn_adding")) : isEditing ? t("modal_btn_save") : t("modal_btn_add"))))));
};
export default AddressModal;
