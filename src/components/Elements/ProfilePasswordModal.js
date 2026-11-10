import { __h, __Fragment } from '../../utils/runtime.js';
import React, { useState, useEffect, useRef } from "../../utils/runtime.js";
import AnimatedModalWrapper from "./AnimatedModalWrapper.js";
const logo = "/assets/icons/rednest_logo.png";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
import { fetchWithRefresh } from "../../utils/fetchWithRefresh.js";
import { useLang } from "../../utils/useLang.js";
import { getWidgetTranslation } from "./Lang.js";
const EyeIcon = ({ visible }) => visible ? /* @__PURE__ */ __h("svg", {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round"
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
	strokeLinejoin: "round"
}, /* @__PURE__ */ __h("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }), /* @__PURE__ */ __h("line", {
	x1: "1",
	y1: "1",
	x2: "23",
	y2: "23"
}));
const ProfilePasswordModal = ({ isOpen, onClose, onSuccess, title, description }) => {
	const lang = useLang();
	const t = (id) => getWidgetTranslation(lang, id);
	const displayTitle = title || t("modal_security_title");
	const displayDescription = description || t("modal_security_desc");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const inputRef = useRef(null);
	useEffect(() => {
		if (isOpen) {
			setPassword("");
			setError("");
			setShowPassword(false);
			const timer = setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
				}
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);
	const handleClose = () => {
		if (loading) return;
		setError("");
		setPassword("");
		onClose();
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;
		if (!password.trim()) {
			setError(lang === "az" ? "Hesabınızın şifrəsini daxil edin." : lang === "en" ? "Please enter your account password." : "Пожалуйста, введите пароль вашей учетной записи.");
			if (inputRef.current) inputRef.current.focus();
			return;
		}
		setLoading(true);
		setError("");
		try {
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const response = await fetchWithRefresh(`${apiUrl}/api/auth/verify-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
				skipAuthRedirect: true
			});
			const data = await response.json().catch(() => ({}));
			if (response.ok) {
				setPassword("");
				setError("");
				if (onSuccess) {
					onSuccess();
				}
			} else {
				setError(data.message || (lang === "az" ? "Yanlış şifrə. Yenidən cəhd edin." : lang === "en" ? "Incorrect password. Please try again." : "Неверный пароль. Попробуйте еще раз."));
				if (inputRef.current) {
					inputRef.current.select();
				}
			}
		} catch {
			setError(lang === "az" ? "Bağlantı xətası. Yenidən cəhd edin." : lang === "en" ? "Connection error. Please try again." : "Ошибка подключения. Попробуйте еще раз.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose: handleClose,
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", {
		className: "profile-auth-card-split",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "profile-auth-close-btn",
		onClick: handleClose,
		disabled: loading,
		"aria-label": "Close"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
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
	}))), /* @__PURE__ */ __h("div", { className: "profile-auth-card-left" }, /* @__PURE__ */ __h("div", { className: "profile-auth-card-left__content" }, /* @__PURE__ */ __h("img", {
		src: logo,
		alt: "Süfrano",
		className: "profile-auth-card-left__logo"
	}), /* @__PURE__ */ __h("h2", null, "Süfrano"), /* @__PURE__ */ __h("p", null, lang === "az" ? "Şəxsi məlumatlarınıza və hesab ayarlarına təhlükəsiz giriş üçün şifrənizi təsdiqləyin." : lang === "en" ? "Confirm your password to securely access your personal details and account settings." : "Подтвердите пароль для безопасного доступа к личным данным и настройкам аккаунта."))), /* @__PURE__ */ __h("div", { className: "profile-auth-card-right" }, /* @__PURE__ */ __h("div", { className: "profile-auth-header" }, /* @__PURE__ */ __h("img", {
		src: logo,
		alt: "Süfrano",
		className: "profile-auth-header__mobile-logo"
	}), /* @__PURE__ */ __h("h2", null, displayTitle), /* @__PURE__ */ __h("p", null, displayDescription)), /* @__PURE__ */ __h("form", {
		onSubmit: handleSubmit,
		className: "profile-auth-form",
		noValidate: true
	}, /* @__PURE__ */ __h("div", { className: "profile-auth-input-group" }, /* @__PURE__ */ __h("label", { htmlFor: "profile-auth-password" }, lang === "az" ? "Şifrə" : lang === "en" ? "Password" : "Пароль"), /* @__PURE__ */ __h("div", { className: "profile-auth-input-wrap" }, /* @__PURE__ */ __h("input", {
		ref: inputRef,
		id: "profile-auth-password",
		type: showPassword ? "text" : "password",
		placeholder: t("modal_security_placeholder"),
		value: password,
		onChange: (e) => {
			setPassword(e.target.value);
			if (error) setError("");
		},
		className: error ? "has-error" : "",
		disabled: loading,
		autoComplete: "current-password"
	}), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "profile-auth-toggle-pwd",
		onClick: () => setShowPassword((prev) => !prev),
		tabIndex: -1,
		"aria-label": showPassword ? "Hide password" : "Show password"
	}, /* @__PURE__ */ __h(EyeIcon, { visible: showPassword })))), error && /* @__PURE__ */ __h("div", {
		className: "profile-auth-error",
		role: "alert"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
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
	})), /* @__PURE__ */ __h("span", null, error)), /* @__PURE__ */ __h("div", { className: "profile-auth-actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "profile-auth-cancel-btn",
		onClick: handleClose,
		disabled: loading
	}, t("modal_logout_cancel")), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "profile-auth-submit-btn",
		disabled: loading
	}, loading ? /* @__PURE__ */ __h("img", {
		src: loaderIconRed,
		alt: "Loading...",
		className: "profile-auth-btn-spinner"
	}) : t("modal_security_unlock")))))));
};
export default ProfilePasswordModal;
