import { __h, __Fragment } from '../../utils/runtime.js';
import React, { useState, useRef, useEffect } from "../../utils/runtime.js";
import { Link, useNavigate } from "../../utils/router.js";
import { useAuth } from "../../context/AuthContext.js";
import { useProfileSecurity } from "../../context/ProfileSecurityContext.js";
import { useLang } from "../../utils/useLang.js";
import { getWidgetTranslation } from "./Lang.js";
import LogoutModal from "./LogoutModal.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
import { isAllowedCashboxRole } from "../../routes/CashboxProtectedRoute.js";
const UserNavPills = ({ onMenuClose }) => {
	const { user, authLoading, logout, isAuthenticated } = useAuth();
	const { isProfileUnlocked, requireProfileAccess, lockProfile } = useProfileSecurity();
	const lang = useLang();
	const t = (id) => getWidgetTranslation(lang, id);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const userMenuRef = useRef(null);
	const navigate = useNavigate();
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
				setIsUserMenuOpen(false);
			}
		};
		if (isUserMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isUserMenuOpen]);
	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			lockProfile();
			await logout();
			setIsLogoutModalOpen(false);
			setIsUserMenuOpen(false);
			if (onMenuClose) onMenuClose();
			navigate("/");
		} catch (err) {
			console.error("Logout failed:", err);
		} finally {
			setIsLoggingOut(false);
		}
	};
	if (authLoading) {
		return /* @__PURE__ */ __h("div", {
			className: "user-nav-loader-capsule",
			"aria-label": "Loading"
		}, /* @__PURE__ */ __h("img", {
			src: loaderIcon,
			alt: "Loading",
			className: "user-nav-loader-spinner"
		}));
	}
	if (!user && !isAuthenticated) {
		return /* @__PURE__ */ __h(Link, {
			to: "/login",
			className: "cta-btn sm user-nav-login-btn",
			onClick: () => onMenuClose && onMenuClose()
		}, t("user_nav_login"));
	}
	const avatarUrl = user?.profilePictureUrl || user?.ProfilePictureUrl || null;
	const userName = user?.name || user?.Name || "User";
	const rawBalance = user?.balance ?? user?.Balance ?? 0;
	const formattedBalance = Number(rawBalance || 0).toFixed(2);
	const userRole = user?.role || user?.Role;
	const canAccessCashbox = isAllowedCashboxRole(userRole);
	const handleProfileClick = () => {
		setIsUserMenuOpen(false);
		if (onMenuClose) onMenuClose();
	};
	return /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", {
		className: "user-nav-capsule-wrapper",
		ref: userMenuRef
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "user-nav-capsule",
		onClick: () => setIsUserMenuOpen((prev) => !prev),
		"aria-expanded": isUserMenuOpen,
		"aria-haspopup": "true"
	}, /* @__PURE__ */ __h("div", {
		className: "user-nav-capsule__avatar",
		title: `Profile - ${userName}`
	}, avatarUrl ? /* @__PURE__ */ __h("img", {
		src: avatarUrl,
		alt: userName,
		className: "user-nav-capsule__avatar-img"
	}) : /* @__PURE__ */ __h("span", { className: "user-nav-capsule__avatar-fallback" }, userName ? userName.charAt(0).toUpperCase() : "U")), /* @__PURE__ */ __h("span", { className: "user-nav-capsule__info-row" }, /* @__PURE__ */ __h("span", { className: "user-nav-capsule__name" }, userName), /* @__PURE__ */ __h("span", { className: "user-nav-capsule__divider" }), /* @__PURE__ */ __h("span", { className: "user-nav-capsule__balance" }, /* @__PURE__ */ __h("span", { className: "user-nav-capsule__balance-amount" }, formattedBalance), /* @__PURE__ */ __h("span", { className: "user-nav-capsule__balance-symbol" }, "₼")), /* @__PURE__ */ __h("svg", {
		className: `user-nav-capsule__chevron ${isUserMenuOpen ? "open" : ""}`,
		viewBox: "0 0 24 24",
		width: "14",
		height: "14",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("polyline", { points: "6 9 12 15 18 9" })))), /* @__PURE__ */ __h("div", { className: `user-nav-capsule__dropdown-wrapper ${isUserMenuOpen ? "open" : ""}` }, /* @__PURE__ */ __h("div", { className: "user-nav-capsule__dropdown" }, /* @__PURE__ */ __h("div", { className: "user-nav-capsule__dropdown-inner" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "user-nav-capsule__dropdown-item",
		onClick: () => {
			setIsUserMenuOpen(false);
			if (onMenuClose) onMenuClose();
			if (isProfileUnlocked) {
				navigate("/profile");
			} else {
				requireProfileAccess("/profile");
			}
		}
	}, t("user_nav_profile")), /* @__PURE__ */ __h(Link, {
		to: "/promos",
		className: "user-nav-capsule__dropdown-item",
		onClick: handleProfileClick
	}, t("user_nav_promos")), /* @__PURE__ */ __h(Link, {
		to: "/admin/dashboard",
		className: "user-nav-capsule__dropdown-item",
		onClick: handleProfileClick
	}, t("user_nav_admin")), canAccessCashbox && /* @__PURE__ */ __h(Link, {
		to: "/cashbox",
		className: "user-nav-capsule__dropdown-item",
		onClick: handleProfileClick
	}, t("user_nav_pos")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "user-nav-capsule__dropdown-item",
		onClick: () => {
			setIsUserMenuOpen(false);
			if (onMenuClose) onMenuClose();
			setIsLogoutModalOpen(true);
		}
	}, t("user_nav_logout")))))), /* @__PURE__ */ __h(LogoutModal, {
		isOpen: isLogoutModalOpen,
		onClose: () => setIsLogoutModalOpen(false),
		onConfirm: handleLogout,
		loading: isLoggingOut
	}));
};
export default UserNavPills;
