import { __h, __Fragment } from '../utils/runtime.js';
import React, { useEffect, useRef } from "../utils/runtime.js";
import { Navigate, useLocation } from "../utils/router.js";
import { useAuth } from "../context/AuthContext.js";
const AUTH_CHECK_TTL_MS = 5 * 60 * 1e3;
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, authLoading, checkAuthStatus } = useAuth();
	const location = useLocation();
	const lastCheckRef = useRef(0);
	useEffect(() => {
		if (checkAuthStatus) {
			const now = Date.now();
			if (now - lastCheckRef.current > AUTH_CHECK_TTL_MS) {
				lastCheckRef.current = now;
				checkAuthStatus();
			}
		}
	}, [location.pathname, checkAuthStatus]);
	if (authLoading) {
		return null;
	}
	if (!isAuthenticated) {
		return /* @__PURE__ */ __h(Navigate, {
			to: "/login",
			state: { from: location },
			replace: true
		});
	}
	return children;
};
export default ProtectedRoute;
