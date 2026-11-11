(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/PublicPages/Auth/GoogleAuth.js
	__define("components/PublicPages/Auth/GoogleAuth.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useEffect, useState, useRef } = __imp_0;
		const { useSearchParams, useNavigate, Link } = __require("utils/router.js");
		const { motion } = __require("utils/motion.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { ensureClientHintsHeaders } = __require("utils/clientHints.js");
		const { useLang } = __require("utils/useLang.js");
		const { getAuthTranslation } = __require("components/PublicPages/Auth/Lang.js");
		const logo = "/assets/icons/rednest_logo.png";
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const GoogleAuth = () => {
			const lang = useLang();
			const t = (id) => getAuthTranslation(lang, id);
			const [searchParams] = useSearchParams();
			const navigate = useNavigate();
			const { login, isAuthenticated } = useAuth();
			const [status, setStatus] = useState("processing");
			const [errorMessage, setErrorMessage] = useState("");
			const exchangeAttempted = useRef(false);
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			useEffect(() => {
				if (isAuthenticated) {
					navigate("/", { replace: true });
					return;
				}
				if (exchangeAttempted.current) return;
				const code = searchParams.get("code");
				const errorParam = searchParams.get("error");
				const errorDescription = searchParams.get("error_description");
				if (errorParam) {
					setStatus("error");
					setErrorMessage(errorDescription || "Google authorization was canceled or denied.");
					return;
				}
				if (!code) {
					navigate("/login", { replace: true });
					return;
				}
				exchangeAttempted.current = true;
				const handleGoogleExchange = async () => {
					try {
						const clientHeaders = await ensureClientHintsHeaders();
						const redirectUri = `${window.location.origin}/google-auth`;
						const response = await fetch(`${apiUrl}/api/auth/google`, {
							method: "POST",
							credentials: "include",
							headers: {
								"Content-Type": "application/json",
								...clientHeaders
							},
							body: JSON.stringify({
								code,
								redirectUri
							})
						});
						const data = await response.json().catch(() => ({}));
						if (!response.ok) {
							if (response.status === 404 || data.errorType === "ACCOUNT_NOT_FOUND") {
								setStatus("account_not_found");
								setErrorMessage(data.message || "Account not found. Please register first before signing in with Google.");
								return;
							}
							throw new Error(data.message || "Failed to authenticate with Google. Please try again.");
						}
						localStorage.setItem("rednest_auth", "true");
						if (data.user) {
							login(data.user);
						}
						navigate("/", { replace: true });
					} catch (err) {
						setStatus("error");
						setErrorMessage(err.message || "An unexpected error occurred during Google sign-in.");
					}
				};
				handleGoogleExchange();
			}, [
				searchParams,
				navigate,
				isAuthenticated,
				login,
				apiUrl
			]);
			return /* @__PURE__ */ __h(motion.div, {
				className: "google-auth-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .25 }
			}, /* @__PURE__ */ __h("div", { className: "google-auth-card" }, /* @__PURE__ */ __h(Link, {
				to: "/",
				className: "google-auth-brand"
			}, /* @__PURE__ */ __h("img", {
				src: logo,
				alt: "Süfrano",
				className: "google-auth-logo"
			})), status === "processing" && /* @__PURE__ */ __h("div", { className: "google-auth-state google-auth-state--processing" }, /* @__PURE__ */ __h("div", { className: "google-auth-spinner" }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Processing..."
			})), /* @__PURE__ */ __h("h2", null, t("google_connecting_title")), /* @__PURE__ */ __h("p", null, t("google_connecting_desc"))), status === "account_not_found" && /* @__PURE__ */ __h("div", { className: "google-auth-state google-auth-state--not-found" }, /* @__PURE__ */ __h("div", { className: "google-auth-icon-badge google-auth-icon-badge--warning" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "32",
				height: "32",
				fill: "none",
				stroke: "currentColor",
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
			}))), /* @__PURE__ */ __h("h2", null, t("google_not_found_title")), /* @__PURE__ */ __h("p", { className: "google-auth-error-desc" }, errorMessage || t("google_not_found_desc")), /* @__PURE__ */ __h("div", { className: "google-auth-actions" }, /* @__PURE__ */ __h(Link, {
				to: "/login",
				className: "cta-btn google-auth-btn"
			}, t("google_not_found_btn")))), status === "error" && /* @__PURE__ */ __h("div", { className: "google-auth-state google-auth-state--error" }, /* @__PURE__ */ __h("div", { className: "google-auth-icon-badge google-auth-icon-badge--danger" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "32",
				height: "32",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("line", {
				x1: "15",
				y1: "9",
				x2: "9",
				y2: "15"
			}), /* @__PURE__ */ __h("line", {
				x1: "9",
				y1: "9",
				x2: "15",
				y2: "15"
			}))), /* @__PURE__ */ __h("h2", null, t("google_error_title")), /* @__PURE__ */ __h("p", { className: "google-auth-error-desc" }, errorMessage), /* @__PURE__ */ __h("div", { className: "google-auth-actions" }, /* @__PURE__ */ __h(Link, {
				to: "/login",
				className: "cta-btn google-auth-btn"
			}, t("google_error_btn"))))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return GoogleAuth; } });
	});
	//#endregion

	var entryExports = __require("components/PublicPages/Auth/GoogleAuth.js");
	__pages["google-auth"] = entryExports.default || entryExports;
})();
