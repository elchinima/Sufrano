import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useRef, useEffect } from "../../../utils/runtime.js";
import { Link, useNavigate } from "../../../utils/router.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import { useAuth } from "../../../context/AuthContext.js";
import Footer from "../../Footer/Footer.js";
import Navbar from "../../Elements/Navbar.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
import ImageCropperModal from "./ImageCropperModal.js";
import ChangePasswordModal from "./ChangePasswordModal.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
import { useLang } from "../../../utils/useLang.js";
import { getProfileTranslation } from "./Lang.js";
import { DEFAULT_USER_AVATAR, getUserAvatarUrl, handleAvatarError, isDefaultAvatarUrl } from "../../../utils/avatar.js";
const ALLOWED_TYPES = [
	"image/png",
	"image/jpeg",
	"image/jpg"
];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const Profile = () => {
	const { user, logout, updateUser, authLoading } = useAuth();
	const navigate = useNavigate();
	const lang = useLang();
	const t = (id) => getProfileTranslation(lang, id);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
	const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
	const [isDeleteAvatarModalOpen, setIsDeleteAvatarModalOpen] = useState(false);
	const [isCropModalOpen, setIsCropModalOpen] = useState(false);
	const [cropperImageSrc, setCropperImageSrc] = useState("");
	const [cropperFileName, setCropperFileName] = useState("");
	const [avatarUploading, setAvatarUploading] = useState(false);
	const [avatarDeleting, setAvatarDeleting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
	const fileInputRef = useRef(null);
	const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
	const rawAvatarUrl = user?.profilePictureUrl || user?.ProfilePictureUrl || null;
	const hasCustomAvatar = !isDefaultAvatarUrl(rawAvatarUrl);
	const avatarUrl = getUserAvatarUrl(rawAvatarUrl);
	const renderChangeAvatarBtn = (extraClass) => /* @__PURE__ */ __h("button", {
		type: "button",
		className: `cta-btn sm profile-btn ${extraClass}`,
		onClick: () => fileInputRef.current?.click(),
		disabled: avatarUploading || avatarDeleting
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		className: "btn-icon"
	}, /* @__PURE__ */ __h("path", { d: "M12 20h9" }), /* @__PURE__ */ __h("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" })), t("profile_avatar_change"));
	const userName = user?.name || user?.Name || "User";
	const userEmail = user?.email || user?.Email || "user@sufrano.com";
	const showSuccess = (msg) => {
		setSuccess(msg);
		setTimeout(() => setSuccess(""), 3500);
	};
	const showError = (msg) => {
		setError(msg);
		setTimeout(() => setError(""), 4e3);
	};
	const validateFile = (file) => {
		if (!ALLOWED_TYPES.includes(file.type)) {
			showError(`"${file.name}" has an invalid format. Allowed: PNG, JPG, JPEG.`);
			return false;
		}
		if (file.size > MAX_SIZE_BYTES) {
			showError(`"${file.name}" exceeds ${MAX_SIZE_MB} MB.`);
			return false;
		}
		return true;
	};
	const handleFileSelect = (e) => {
		const file = e.target.files[0];
		e.target.value = "";
		if (!file) return;
		if (!validateFile(file)) return;
		const reader = new FileReader();
		reader.onload = () => {
			setCropperImageSrc(reader.result);
			setCropperFileName(file.name);
			setIsCropModalOpen(true);
		};
		reader.readAsDataURL(file);
	};
	const handleCropComplete = async (croppedFile) => {
		setAvatarUploading(true);
		setError("");
		try {
			const formData = new FormData();
			formData.append("file", croppedFile);
			const res = await fetch(`${apiUrl}/api/auth/profile/picture`, {
				method: "POST",
				credentials: "include",
				body: formData
			});
			if (res.ok) {
				const data = await res.json();
				updateUser({
					profilePictureUrl: data.profilePictureUrl,
					ProfilePictureUrl: data.profilePictureUrl
				});
				showSuccess(t("profile_toast_avatar_updated"));
				setIsCropModalOpen(false);
				setCropperImageSrc("");
			} else {
				const data = await res.json().catch(() => ({}));
				showError(data.message || "Failed to upload photo.");
			}
		} catch {
			showError("Connection error. Please try again.");
		} finally {
			setAvatarUploading(false);
		}
	};
	const handleConfirmDeleteAvatar = async () => {
		if (!hasCustomAvatar) return;
		setAvatarDeleting(true);
		setError("");
		try {
			const res = await fetch(`${apiUrl}/api/auth/profile/picture`, {
				method: "DELETE",
				credentials: "include"
			});
			if (res.ok) {
				const data = await res.json().catch(() => ({}));
				const nextAvatarUrl = data.profilePictureUrl || DEFAULT_USER_AVATAR;
				updateUser({
					profilePictureUrl: nextAvatarUrl,
					ProfilePictureUrl: nextAvatarUrl
				});
				showSuccess(t("profile_toast_avatar_deleted"));
				setIsDeleteAvatarModalOpen(false);
			} else {
				const data = await res.json().catch(() => ({}));
				showError(data.message || "Failed to remove photo.");
			}
		} catch {
			showError("Connection error. Please try again.");
		} finally {
			setAvatarDeleting(false);
		}
	};
	const [twoFactorLoading, setTwoFactorLoading] = useState(false);
	useEffect(() => {
		if (user) {
			setTwoFactorEnabled(Boolean(user.twoFactorEnabled ?? user.TwoFactorEnabled));
		}
	}, [user]);
	const handleToggle2FA = async () => {
		if (twoFactorLoading) return;
		setTwoFactorLoading(true);
		try {
			const res = await fetch(`${apiUrl}/api/auth/2fa/toggle`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ enabled: !twoFactorEnabled })
			});
			if (res.ok) {
				const data = await res.json();
				setTwoFactorEnabled(data.twoFactorEnabled);
				updateUser({
					twoFactorEnabled: data.twoFactorEnabled,
					TwoFactorEnabled: data.twoFactorEnabled
				});
				showSuccess(`Two-Factor Authentication ${data.twoFactorEnabled ? "enabled" : "disabled"}.`);
			} else {
				const data = await res.json().catch(() => ({}));
				showError(data.message || "Failed to update Two-Factor Authentication.");
			}
		} catch {
			showError("Connection error. Please try again.");
		} finally {
			setTwoFactorLoading(false);
		}
	};
	return /* @__PURE__ */ __h(motion.div, {
		className: "profile-page",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .3 }
	}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "profile-main" }, /* @__PURE__ */ __h("div", { className: "profile-container" }, /* @__PURE__ */ __h(motion.div, {
		className: "profile-hero-text",
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
	}, /* @__PURE__ */ __h("h1", null, t("profile_hero_title")), /* @__PURE__ */ __h("p", { className: "profile-hero-desc" }, t("profile_hero_desc"))), /* @__PURE__ */ __h(motion.div, {
		className: "profile-card",
		initial: {
			opacity: 0,
			y: 30
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: .1,
			duration: .55,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	}, /* @__PURE__ */ __h("div", { className: "profile-card__avatar-section" }, /* @__PURE__ */ __h("div", { className: "profile-avatar-wrapper" }, /* @__PURE__ */ __h("div", { className: `profile-avatar-circle ${avatarUploading ? "loading" : ""}` }, /* @__PURE__ */ __h("img", {
		src: avatarUrl,
		alt: userName,
		className: "profile-avatar-img",
		onError: handleAvatarError
	}), avatarUploading && /* @__PURE__ */ __h("div", { className: "profile-avatar-overlay" }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Uploading",
		className: "profile-avatar-loader"
	})))), /* @__PURE__ */ __h("input", {
		ref: fileInputRef,
		type: "file",
		accept: ".png,.jpg,.jpeg,image/png,image/jpeg",
		onChange: handleFileSelect,
		style: { display: "none" }
	}), /* @__PURE__ */ __h("div", { className: "profile-avatar-actions" }, !hasCustomAvatar ? renderChangeAvatarBtn("profile-btn--add") : /* @__PURE__ */ __h("div", { className: "profile-avatar-btn-group" }, renderChangeAvatarBtn("profile-btn--change"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-btn profile-btn--delete",
		onClick: () => setIsDeleteAvatarModalOpen(true),
		disabled: avatarUploading || avatarDeleting
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		className: "btn-icon"
	}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })), t("profile_avatar_delete"))))), /* @__PURE__ */ __h("div", { className: "profile-card__info-section" }, /* @__PURE__ */ __h("div", { className: "profile-field-group" }, /* @__PURE__ */ __h("label", { className: "profile-field-label" }, t("profile_field_name")), /* @__PURE__ */ __h("div", { className: "profile-field-input-wrap" }, /* @__PURE__ */ __h("input", {
		type: "text",
		className: "profile-field-input",
		value: userName,
		readOnly: true,
		disabled: true
	}), /* @__PURE__ */ __h("span", { className: "profile-field-badge" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("rect", {
		x: "3",
		y: "11",
		width: "18",
		height: "11",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })), t("profile_badge_locked")))), /* @__PURE__ */ __h("div", { className: "profile-field-group" }, /* @__PURE__ */ __h("label", { className: "profile-field-label" }, t("profile_field_email")), /* @__PURE__ */ __h("div", { className: "profile-field-input-wrap" }, /* @__PURE__ */ __h("input", {
		type: "email",
		className: "profile-field-input",
		value: userEmail,
		readOnly: true,
		disabled: true
	}), /* @__PURE__ */ __h("span", { className: "profile-field-badge" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("rect", {
		x: "3",
		y: "11",
		width: "18",
		height: "11",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })), t("profile_badge_locked")))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_password_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_password_desc"))), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-action-btn",
		onClick: () => setIsPasswordModalOpen(true)
	}, t("profile_row_password_btn"))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_sessions_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_sessions_desc"))), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-action-btn",
		onClick: () => navigate("/sessions")
	}, t("profile_row_sessions_btn"))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_2fa_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_2fa_desc"))), /* @__PURE__ */ __h("div", { className: "profile-2fa-toggle-wrap" }, /* @__PURE__ */ __h("span", { className: `profile-2fa-status ${twoFactorEnabled ? "active" : ""}` }, twoFactorEnabled ? t("profile_row_2fa_enabled") : t("profile_row_2fa_disabled")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: `profile-switch ${twoFactorEnabled ? "profile-switch--on" : ""}`,
		onClick: handleToggle2FA,
		"aria-label": "Toggle Two-Factor Authentication"
	}, /* @__PURE__ */ __h("span", { className: "profile-switch__handle" })))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_addresses_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_addresses_desc"))), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-action-btn",
		onClick: () => navigate("/addresses")
	}, t("profile_row_addresses_btn"))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_payments_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_payments_desc"))), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-action-btn",
		onClick: () => navigate("/payment-methods")
	}, t("profile_row_payments_btn"))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_orders_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_orders_desc"))), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-action-btn",
		onClick: () => navigate("/orders")
	}, t("profile_row_orders_btn"))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_reviews_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_reviews_desc"))), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-action-btn",
		onClick: () => navigate("/reviews")
	}, t("profile_row_reviews_btn"))))))), /* @__PURE__ */ __h(ChangePasswordModal, {
		isOpen: isPasswordModalOpen,
		onClose: () => setIsPasswordModalOpen(false),
		onSuccess: (msg) => showSuccess(msg)
	}), /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen: isPaymentsModalOpen,
		onClose: () => setIsPaymentsModalOpen(false),
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", { className: "profile-modal" }, /* @__PURE__ */ __h("div", { className: "profile-modal__icon" }, /* @__PURE__ */ __h("svg", {
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
	}))), /* @__PURE__ */ __h("h3", { className: "profile-modal__title" }, t("profile_payments_modal_title")), /* @__PURE__ */ __h("p", { className: "profile-modal__text" }, t("profile_payments_modal_desc")), /* @__PURE__ */ __h("div", { className: "profile-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-modal__btn",
		onClick: () => setIsPaymentsModalOpen(false)
	}, t("profile_modal_got_it"))))), /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen: isOrdersModalOpen,
		onClose: () => setIsOrdersModalOpen(false),
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", { className: "profile-modal" }, /* @__PURE__ */ __h("div", { className: "profile-modal__icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }), /* @__PURE__ */ __h("line", {
		x1: "3",
		y1: "6",
		x2: "21",
		y2: "6"
	}), /* @__PURE__ */ __h("path", { d: "M16 10a4 4 0 0 1-8 0" }))), /* @__PURE__ */ __h("h3", { className: "profile-modal__title" }, t("profile_orders_modal_title")), /* @__PURE__ */ __h("p", { className: "profile-modal__text" }, t("profile_orders_modal_desc")), /* @__PURE__ */ __h("div", { className: "profile-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-modal__btn",
		onClick: () => setIsOrdersModalOpen(false)
	}, t("profile_modal_got_it"))))), /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen: hasCustomAvatar && isDeleteAvatarModalOpen,
		onClose: () => !avatarDeleting && setIsDeleteAvatarModalOpen(false),
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", { className: "profile-modal" }, /* @__PURE__ */ __h("div", { className: "profile-modal__icon profile-modal__icon--danger" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
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
	}))), /* @__PURE__ */ __h("h3", { className: "profile-modal__title" }, t("profile_delete_avatar_title")), /* @__PURE__ */ __h("p", { className: "profile-modal__text" }, t("profile_delete_avatar_text")), /* @__PURE__ */ __h("div", { className: "profile-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-modal__btn profile-modal__btn--cancel",
		onClick: () => setIsDeleteAvatarModalOpen(false),
		disabled: avatarDeleting
	}, t("profile_delete_avatar_cancel")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm profile-modal__btn profile-modal__btn--confirm-delete",
		onClick: handleConfirmDeleteAvatar,
		disabled: avatarDeleting
	}, avatarDeleting ? /* @__PURE__ */ __h("span", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		color: "#d4b475"
	} }, /* @__PURE__ */ __h("img", {
		src: loaderIconRed,
		alt: "Deleting...",
		style: {
			width: "16px",
			height: "16px",
			flexShrink: 0
		}
	}), t("profile_delete_avatar_deleting")) : t("profile_delete_avatar_confirm"))))), /* @__PURE__ */ __h(ImageCropperModal, {
		isOpen: isCropModalOpen,
		imageSrc: cropperImageSrc,
		fileName: cropperFileName,
		onClose: () => {
			setIsCropModalOpen(false);
			setCropperImageSrc("");
		},
		onCrop: handleCropComplete,
		loading: avatarUploading
	}), /* @__PURE__ */ __h("div", { className: "profile-toast-container" }, /* @__PURE__ */ __h(AnimatePresence, null, error && /* @__PURE__ */ __h(motion.div, {
		className: "profile-toast profile-toast--error",
		initial: {
			opacity: 0,
			y: 30,
			scale: .95
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		exit: {
			opacity: 0,
			y: 20,
			scale: .95
		},
		transition: { duration: .25 }
	}, /* @__PURE__ */ __h("svg", {
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
	})), /* @__PURE__ */ __h("span", null, error), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "profile-toast__close",
		onClick: () => setError(""),
		"aria-label": "Close"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
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
	})))), success && /* @__PURE__ */ __h(motion.div, {
		className: "profile-toast profile-toast--success",
		initial: {
			opacity: 0,
			y: 30,
			scale: .95
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		exit: {
			opacity: 0,
			y: 20,
			scale: .95
		},
		transition: { duration: .25 }
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, success), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "profile-toast__close",
		onClick: () => setSuccess(""),
		"aria-label": "Close"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
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
	})))))), /* @__PURE__ */ __h(Footer, null));
};
export default Profile;
