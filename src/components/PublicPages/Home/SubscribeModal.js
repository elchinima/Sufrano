import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useRef } from "../../../utils/runtime.js";
const logo = "/assets/icons/rednest_logo.png";
const loaderIcon = "/assets/icons/loader-animated.svg";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
import { useLang } from "../../../utils/useLang.js";
import { getHomeTranslation } from "./Lang.js";
const LoaderIcon = () => /* @__PURE__ */ __h("img", {
	src: loaderIcon,
	alt: "Loading...",
	style: {
		width: "20px",
		height: "20px"
	}
});
const SubscribeModal = ({ isOpen, onClose, email, onSuccess }) => {
	const lang = useLang();
	const t = (id) => getHomeTranslation(lang, id);
	const [digits, setDigits] = useState([
		"",
		"",
		"",
		""
	]);
	const [timer, setTimer] = useState(900);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const inputRefs = [
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null)
	];
	const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
	useEffect(() => {
		let interval = null;
		if (isOpen) {
			setDigits([
				"",
				"",
				"",
				""
			]);
			setTimer(900);
			setError("");
			interval = setInterval(() => {
				setTimer((prev) => prev > 0 ? prev - 1 : 0);
			}, 1e3);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isOpen]);
	useEffect(() => {
		if (isOpen && inputRefs[0].current) {
			setTimeout(() => inputRefs[0].current?.focus(), 150);
		}
	}, [isOpen]);
	const formatTimer = (seconds) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s < 10 ? "0" : ""}${s}`;
	};
	const handleDigitChange = (index, value) => {
		const cleanVal = value.replace(/\D/g, "");
		if (!cleanVal) {
			const next = [...digits];
			next[index] = "";
			setDigits(next);
			return;
		}
		if (cleanVal.length > 1) {
			const pasted = cleanVal.slice(0, 4).split("");
			const next = [...digits];
			for (let i = 0; i < 4; i++) {
				next[i] = pasted[i] || "";
			}
			setDigits(next);
			const focusIndex = Math.min(pasted.length, 3);
			inputRefs[focusIndex].current?.focus();
			return;
		}
		const next = [...digits];
		next[index] = cleanVal.slice(-1);
		setDigits(next);
		if (index < 3) {
			inputRefs[index + 1].current?.focus();
		}
	};
	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !digits[index] && index > 0) {
			inputRefs[index - 1].current?.focus();
		}
	};
	const handlePaste = (e) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
		if (pastedData) {
			const next = [
				"",
				"",
				"",
				""
			];
			for (let i = 0; i < pastedData.length; i++) {
				next[i] = pastedData[i];
			}
			setDigits(next);
			const focusIndex = Math.min(pastedData.length, 3);
			inputRefs[focusIndex].current?.focus();
		}
	};
	const handleVerify = async (e) => {
		e.preventDefault();
		const code = digits.join("");
		if (code.length < 4) {
			setError("Please enter the 4-digit code.");
			return;
		}
		if (loading) return;
		setLoading(true);
		setError("");
		try {
			const response = await fetch(`${apiUrl}/api/auth/subscribe/verify`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					code
				})
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Verification failed");
			}
			onSuccess(data.message || "Successfully subscribed to the Süfrano Club!");
			onClose();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose
	}, /* @__PURE__ */ __h("div", {
		className: "subscribe-modal-content",
		onMouseDown: (e) => e.stopPropagation(),
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "subscribe-modal-close",
		onClick: onClose,
		"aria-label": "Close modal"
	}, /* @__PURE__ */ __h("svg", {
		width: "24",
		height: "24",
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg"
	}, /* @__PURE__ */ __h("path", {
		d: "M18 6L6 18M6 6L18 18",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}))), /* @__PURE__ */ __h("div", { className: "subscribe-modal-header" }, /* @__PURE__ */ __h("img", {
		src: logo,
		alt: "Süfrano Logo",
		className: "subscribe-modal-logo"
	}), /* @__PURE__ */ __h("h2", { "data-id": "home_club_title" }, t("home_club_title")), /* @__PURE__ */ __h("p", { "data-id": "home_modal_sub_desc" }, t("home_modal_sub_desc"), " ", /* @__PURE__ */ __h("strong", null, email))), /* @__PURE__ */ __h("form", {
		className: "subscribe-modal-form",
		onSubmit: handleVerify
	}, /* @__PURE__ */ __h("div", {
		className: "two-factor-inputs",
		onPaste: handlePaste
	}, digits.map((digit, idx) => /* @__PURE__ */ __h("input", {
		key: idx,
		ref: inputRefs[idx],
		type: "text",
		inputMode: "numeric",
		maxLength: 4,
		value: digit,
		onChange: (e) => handleDigitChange(idx, e.target.value),
		onKeyDown: (e) => handleKeyDown(idx, e),
		className: "two-factor-digit",
		autoComplete: "one-time-code"
	}))), /* @__PURE__ */ __h("div", { className: "subscribe-timer-info" }, timer > 0 ? /* @__PURE__ */ __h("span", null, "Code expires in ", /* @__PURE__ */ __h("strong", { className: "timer-value" }, formatTimer(timer))) : /* @__PURE__ */ __h("span", { className: "timer-expired" }, "Code has expired. Please enter your email again.")), error && /* @__PURE__ */ __h("div", { className: "subscribe-error-msg" }, error), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "cta-btn subscribe-submit-btn",
		disabled: loading || digits.join("").length < 4 || timer === 0,
		"data-id": "home_modal_sub_confirm_btn"
	}, loading ? /* @__PURE__ */ __h("span", { style: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "8px"
	} }, /* @__PURE__ */ __h(LoaderIcon, null), " Confirming...") : t("home_modal_sub_confirm_btn")))));
};
export default SubscribeModal;
