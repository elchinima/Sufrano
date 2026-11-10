import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState } from "../../../utils/runtime.js";
import { useNavigate, Navigate, useLocation } from "../../../utils/router.js";
import { motion } from "../../../utils/motion.js";
const logo = "/assets/icons/rednest_logo.png";
const loaderIcon = "/assets/icons/loader-animated.svg";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
import { useAdminAuth } from "../../../context/AdminAuthContext.js";
import { useAuth } from "../../../context/AuthContext.js";
const LoaderIcon = () => /* @__PURE__ */ __h("img", {
	src: loaderIconRed,
	alt: "Loading...",
	style: {
		width: "20px",
		height: "20px"
	}
});
const ALLOWED_ADMIN_ROLES = [
	"moderator",
	"admin",
	"super admin",
	"superadmin"
];
const isAllowedAdminRole = (role) => {
	if (!role) return false;
	const clean = String(role).toLowerCase().trim();
	return ALLOWED_ADMIN_ROLES.includes(clean);
};
const AdminLogin = () => {
	const { adminLogin, isAdminAuth, loading: adminLoading } = useAdminAuth();
	const { isAuthenticated, user, authLoading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const currentUserRole = user?.role || user?.Role;
	const hasAdminRole = isAllowedAdminRole(currentUserRole);
	if (authLoading || adminLoading) {
		return /* @__PURE__ */ __h("div", { className: "admin-loading-screen" }, /* @__PURE__ */ __h("img", {
			src: loaderIcon,
			alt: "Loading...",
			className: "admin-loading-spinner"
		}));
	}
	if (!isAuthenticated) {
		return /* @__PURE__ */ __h(Navigate, {
			to: "/login",
			state: { from: location },
			replace: true
		});
	}
	if (isAdminAuth && hasAdminRole) {
		return /* @__PURE__ */ __h(Navigate, {
			to: "/admin/dashboard",
			replace: true
		});
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!hasAdminRole) {
			setError(`Access denied.`);
			return;
		}
		setLoading(true);
		try {
			const res = await adminLogin(password);
			if (res && res.ok) {
				navigate("/admin/dashboard", { replace: true });
			} else {
				setError(res?.message || "Incorrect password. Please try again.");
			}
		} catch {
			setError("Connection error. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ __h(motion.div, {
		className: "admin-login-page",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .3 }
	}, /* @__PURE__ */ __h("div", { className: "admin-login-overlay" }), /* @__PURE__ */ __h("div", { className: "admin-login-container" }, /* @__PURE__ */ __h("div", { className: "admin-login-card-split" }, /* @__PURE__ */ __h("div", { className: "admin-login-left" }, /* @__PURE__ */ __h("div", { className: "admin-login-left__content" }, /* @__PURE__ */ __h("img", {
		src: logo,
		alt: "Süfrano",
		className: "admin-login-left__logo"
	}), /* @__PURE__ */ __h("h2", null, "Admin Panel"), /* @__PURE__ */ __h("p", null, "Manage your content, assets and storage from one secure place."))), /* @__PURE__ */ __h("div", { className: "admin-login-right" }, /* @__PURE__ */ __h("div", { className: "admin-login-header" }, /* @__PURE__ */ __h("img", {
		src: logo,
		alt: "Süfrano",
		className: "admin-login-header__logo"
	}), /* @__PURE__ */ __h("h2", null, "Welcome back"), /* @__PURE__ */ __h("p", null, "Enter your admin password to access the panel.")), !hasAdminRole && /* @__PURE__ */ __h("div", { className: "admin-login-restricted-banner" }, /* @__PURE__ */ __h("svg", {
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
	})), /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("strong", null, "Access Restricted"))), /* @__PURE__ */ __h("form", {
		className: "admin-login-form",
		onSubmit: handleSubmit,
		id: "admin-login-form"
	}, /* @__PURE__ */ __h("div", { className: "input-group" }, /* @__PURE__ */ __h("label", { htmlFor: "admin-password" }, "Password"), /* @__PURE__ */ __h("input", {
		id: "admin-password",
		type: "password",
		placeholder: "Enter admin password",
		value: password,
		onChange: (e) => setPassword(e.target.value),
		autoComplete: "current-password",
		required: true
	})), /* @__PURE__ */ __h("div", {
		className: "error-wrapper",
		style: {
			minHeight: "24px",
			marginBottom: "0.5rem"
		}
	}, error && /* @__PURE__ */ __h("div", { className: "admin-login-error" }, error)), /* @__PURE__ */ __h("button", {
		id: "admin-login-submit",
		type: "submit",
		className: "cta-btn admin-login-submit",
		disabled: loading
	}, loading ? /* @__PURE__ */ __h("span", { className: "admin-login-submit__loader" }, /* @__PURE__ */ __h(LoaderIcon, null), "Signing in...") : "Sign In"))))));
};
export default AdminLogin;
