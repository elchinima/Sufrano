import { __h, __Fragment } from '../utils/runtime.js';
import React, { useEffect, useState } from "../utils/runtime.js";
import { Navigate, useLocation } from "../utils/router.js";
import { useAuth } from "../context/AuthContext.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
const ALLOWED_CASHBOX_ROLES = [
	"staff",
	"leadstaff",
	"admin",
	"superadmin"
];
const ALLOWED_HISTORY_ROLES = [
	"leadstaff",
	"admin",
	"superadmin"
];
const cleanRole = (role) => (role || "").toLowerCase().replace(/[\s_-]+/g, "");
export const isAllowedCashboxRole = (role) => {
	if (!role) return false;
	return ALLOWED_CASHBOX_ROLES.includes(cleanRole(role));
};
export const isAllowedCashboxHistoryRole = (role) => {
	if (!role) return false;
	return ALLOWED_HISTORY_ROLES.includes(cleanRole(role));
};
const CashboxProtectedRoute = ({ children, allowedRoles = ALLOWED_CASHBOX_ROLES }) => {
	const { isAuthenticated, user, authLoading, fetchCurrentUser } = useAuth();
	const location = useLocation();
	const [checking, setChecking] = useState(false);
	useEffect(() => {
		const currentRole = user?.role || user?.Role;
		if (isAuthenticated && !currentRole && fetchCurrentUser) {
			setChecking(true);
			fetchCurrentUser().finally(() => setChecking(false));
		}
	}, [
		isAuthenticated,
		user,
		fetchCurrentUser
	]);
	if (authLoading || checking) {
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
	const role = user?.role || user?.Role;
	const isAllowed = allowedRoles.map(cleanRole).includes(cleanRole(role));
	if (!isAllowed) {
		return /* @__PURE__ */ __h(Navigate, {
			to: "/error?code=403",
			state: { from: location },
			replace: true
		});
	}
	return children;
};
export default CashboxProtectedRoute;
