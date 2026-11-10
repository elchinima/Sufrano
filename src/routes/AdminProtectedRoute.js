import { __h, __Fragment } from '../utils/runtime.js';
import React, { useEffect, useState } from "../utils/runtime.js";
import { Navigate, useLocation } from "../utils/router.js";
import { useAuth } from "../context/AuthContext.js";
import { useAdminAuth } from "../context/AdminAuthContext.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
const ALLOWED_ADMIN_ROLES = [
	"moderator",
	"admin",
	"super admin",
	"superadmin"
];
const cleanRole = (role) => (role || "").toLowerCase().replace(/\s+/g, "");
const isAllowedAdminRole = (role) => {
	if (!role) return false;
	return ALLOWED_ADMIN_ROLES.map(cleanRole).includes(cleanRole(role));
};
const AdminProtectedRoute = ({ children, requiredRoles }) => {
	const { isAuthenticated, user, authLoading } = useAuth();
	const { isAdminAuth, loading: adminLoading, verify } = useAdminAuth();
	const location = useLocation();
	const [checkingRoute, setCheckingRoute] = useState(true);
	const [verifiedRole, setVerifiedRole] = useState(null);
	useEffect(() => {
		let isMounted = true;
		setCheckingRoute(true);
		if (!isAuthenticated) {
			setCheckingRoute(false);
			return;
		}
		verify().then((res) => {
			if (isMounted) {
				if (res && res.role) {
					setVerifiedRole(res.role);
				} else {
					setVerifiedRole(null);
				}
				setCheckingRoute(false);
			}
		}).catch(() => {
			if (isMounted) {
				setCheckingRoute(false);
			}
		});
		return () => {
			isMounted = false;
		};
	}, [
		location.pathname,
		isAuthenticated,
		verify
	]);
	const activeRole = verifiedRole || user?.role || user?.Role;
	const hasAdminRole = isAllowedAdminRole(activeRole);
	const normalizedRole = cleanRole(activeRole);
	if (authLoading || isAuthenticated && (adminLoading || checkingRoute)) {
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
	if (!hasAdminRole) {
		return /* @__PURE__ */ __h(Navigate, {
			to: "/",
			state: {
				from: location,
				roleForbidden: true
			},
			replace: true
		});
	}
	if (!isAdminAuth) {
		return /* @__PURE__ */ __h(Navigate, {
			to: "/admin/login",
			state: { from: location },
			replace: true
		});
	}
	if (requiredRoles && requiredRoles.length > 0) {
		const normalizedRequired = requiredRoles.map(cleanRole);
		if (!normalizedRequired.includes(normalizedRole)) {
			return /* @__PURE__ */ __h(Navigate, {
				to: "/admin/dashboard",
				state: { accessDenied: true },
				replace: true
			});
		}
	}
	return children;
};
export default AdminProtectedRoute;
