import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState } from "../../../utils/runtime.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useLang } from "../../../utils/useLang.js";
import { getProfileTranslation } from "./Lang.js";
const ButtonSpinner = () => /* @__PURE__ */ __h("img", {
	src: loaderIconRed,
	alt: "Loading...",
	className: "pwd-btn-spinner",
	style: {
		width: "18px",
		height: "18px"
	}
});
const EyeIcon = ({ visible }) => visible ? /* @__PURE__ */ __h("svg", {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className: "pwd-eye-icon"
}, /* @__PURE__ */ __h("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }), /* @__PURE__ */ __h("circle", {
	cx: "12",
	cy: "12",
	r: "3"
})) : /* @__PURE__ */ __h("svg", {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className: "pwd-eye-icon"
}, /* @__PURE__ */ __h("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }), /* @__PURE__ */ __h("line", {
	x1: "1",
	y1: "1",
	x2: "23",
	y2: "23"
}));
const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
	const lang = useLang();
	const t = (id) => getProfileTranslation(lang, id);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const resetForm = () => {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setShowCurrent(false);
		setShowNew(false);
		setShowConfirm(false);
		setError("");
	};
	const handleClose = () => {
		if (loading) return;
		resetForm();
		onClose();
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;
		setError("");
		if (!currentPassword.trim()) {
			setError(t("pwd_err_current_required"));
			return;
		}
		if (!newPassword.trim()) {
			setError(t("pwd_err_new_required"));
			return;
		}
		if (newPassword.length < 6) {
			setError(t("pwd_err_length"));
			return;
		}
		if (newPassword === currentPassword) {
			setError(t("pwd_err_same"));
			return;
		}
		if (newPassword !== confirmPassword) {
			setError(t("pwd_err_mismatch"));
			return;
		}
		setLoading(true);
		try {
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const response = await fetchWithRefresh(`${apiUrl}/api/auth/change-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					currentPassword,
					newPassword,
					confirmPassword
				})
			});
			const data = await response.json().catch(() => ({}));
			if (response.ok) {
				resetForm();
				onSuccess(data.message || t("pwd_success"));
				onClose();
			} else {
				setError(data.message || "Failed to change password.");
			}
		} catch (err) {
			console.error("Password change error:", err);
			setError(t("pwd_err_conn"));
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose: handleClose,
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", {
		className: "change-password-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "change-password-modal__close",
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
	}))), /* @__PURE__ */ __h("div", { className: "change-password-modal__header" }, /* @__PURE__ */ __h("div", { className: "change-password-modal__icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("rect", {
		x: "3",
		y: "11",
		width: "18",
		height: "11",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }))), /* @__PURE__ */ __h("h2", { className: "change-password-modal__title" }, t("pwd_modal_title")), /* @__PURE__ */ __h("p", { className: "change-password-modal__desc" }, t("pwd_modal_desc"))), /* @__PURE__ */ __h("form", {
		className: "change-password-modal__form",
		onSubmit: handleSubmit
	}, error && /* @__PURE__ */ __h("div", { className: "change-password-modal__error" }, /* @__PURE__ */ __h("svg", {
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
	})), /* @__PURE__ */ __h("span", null, error)), /* @__PURE__ */ __h("div", { className: "pwd-input-group" }, /* @__PURE__ */ __h("label", { htmlFor: "current-password" }, t("pwd_modal_current")), /* @__PURE__ */ __h("div", { className: "pwd-input-wrap" }, /* @__PURE__ */ __h("input", {
		id: "current-password",
		type: showCurrent ? "text" : "password",
		placeholder: t("pwd_modal_current_placeholder"),
		value: currentPassword,
		onChange: (e) => {
			setCurrentPassword(e.target.value);
			if (error) setError("");
		},
		disabled: loading,
		autoComplete: "current-password"
	}), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "pwd-toggle-btn",
		onClick: () => setShowCurrent(!showCurrent),
		tabIndex: -1,
		"aria-label": showCurrent ? "Hide password" : "Show password"
	}, /* @__PURE__ */ __h(EyeIcon, { visible: showCurrent })))), /* @__PURE__ */ __h("div", { className: "pwd-input-group" }, /* @__PURE__ */ __h("label", { htmlFor: "new-password" }, t("pwd_modal_new")), /* @__PURE__ */ __h("div", { className: "pwd-input-wrap" }, /* @__PURE__ */ __h("input", {
		id: "new-password",
		type: showNew ? "text" : "password",
		placeholder: t("pwd_modal_new_placeholder"),
		value: newPassword,
		onChange: (e) => {
			setNewPassword(e.target.value);
			if (error) setError("");
		},
		disabled: loading,
		autoComplete: "new-password"
	}), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "pwd-toggle-btn",
		onClick: () => setShowNew(!showNew),
		tabIndex: -1,
		"aria-label": showNew ? "Hide password" : "Show password"
	}, /* @__PURE__ */ __h(EyeIcon, { visible: showNew })))), /* @__PURE__ */ __h("div", { className: "pwd-input-group" }, /* @__PURE__ */ __h("label", { htmlFor: "confirm-password" }, t("pwd_modal_confirm")), /* @__PURE__ */ __h("div", { className: "pwd-input-wrap" }, /* @__PURE__ */ __h("input", {
		id: "confirm-password",
		type: showConfirm ? "text" : "password",
		placeholder: t("pwd_modal_confirm_placeholder"),
		value: confirmPassword,
		onChange: (e) => {
			setConfirmPassword(e.target.value);
			if (error) setError("");
		},
		disabled: loading,
		autoComplete: "new-password"
	}), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "pwd-toggle-btn",
		onClick: () => setShowConfirm(!showConfirm),
		tabIndex: -1,
		"aria-label": showConfirm ? "Hide password" : "Show password"
	}, /* @__PURE__ */ __h(EyeIcon, { visible: showConfirm })))), /* @__PURE__ */ __h("div", { className: "change-password-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm change-password-modal__btn change-password-modal__btn--cancel",
		onClick: handleClose,
		disabled: loading
	}, t("pwd_modal_btn_cancel")), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "cta-btn sm change-password-modal__btn change-password-modal__btn--submit",
		disabled: loading
	}, loading ? /* @__PURE__ */ __h("span", { className: "pwd-loader-inner" }, /* @__PURE__ */ __h(ButtonSpinner, null), t("pwd_modal_btn_updating")) : t("pwd_modal_btn_submit"))))));
};
export default ChangePasswordModal;
