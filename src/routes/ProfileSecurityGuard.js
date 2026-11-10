import { __h, __Fragment } from '../utils/runtime.js';
import React, { useEffect, useState } from "../utils/runtime.js";
import { useLocation } from "../utils/router.js";
import { useProfileSecurity } from "../context/ProfileSecurityContext.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
const ProfileSecurityGuard = ({ children }) => {
	const { isProfileUnlocked, requireProfileAccess, checkSecurityStatus } = useProfileSecurity();
	const location = useLocation();
	const [checking, setChecking] = useState(true);
	useEffect(() => {
		let isMounted = true;
		if (isProfileUnlocked) {
			setChecking(false);
			return;
		}
		setChecking(true);
		checkSecurityStatus().then((isVerified) => {
			if (isMounted) {
				if (!isVerified) {
					requireProfileAccess(location.pathname);
				}
				setChecking(false);
			}
		});
		return () => {
			isMounted = false;
		};
	}, [
		location.pathname,
		isProfileUnlocked,
		requireProfileAccess,
		checkSecurityStatus
	]);
	if (checking || !isProfileUnlocked) {
		return /* @__PURE__ */ __h("div", { style: {
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			background: "#0d0d0d"
		} }, /* @__PURE__ */ __h("img", {
			src: loaderIcon,
			alt: "Security check...",
			style: {
				width: "40px",
				height: "40px"
			}
		}));
	}
	return children;
};
export default ProfileSecurityGuard;
