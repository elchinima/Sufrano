import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect } from "../../../utils/runtime.js";
import { Link, useNavigate, useSearchParams } from "../../../utils/router.js";
import { motion } from "../../../utils/motion.js";
import Footer from "../../Footer/Footer.js";
import Navbar from "../../Elements/Navbar.js";
import { useLang } from "../../../utils/useLang.js";
import { getErrorPageTranslation } from "./Lang.js";
const HTTP_ERROR_REGISTRY = {
	400: {
		badge: "400 • Bad Request",
		badgeClass: "error-badge--warning",
		title: "Bad Request",
		desc: "The server could not understand your request. Please verify your input and try again.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
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
		}))
	},
	401: {
		badge: "401 • Unauthorized",
		badgeClass: "error-badge--auth",
		title: "Authentication Required",
		desc: "You need to be signed in with valid credentials to access this area.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("rect", {
			x: "3",
			y: "11",
			width: "18",
			height: "11",
			rx: "2",
			ry: "2"
		}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }))
	},
	403: {
		badge: "403 • Forbidden",
		badgeClass: "error-badge--danger",
		title: "Access Denied",
		desc: "You don't have the required permissions to view or perform this action.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
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
			x1: "4.93",
			y1: "4.93",
			x2: "19.07",
			y2: "19.07"
		}))
	},
	404: {
		badge: "404 • Page Not Found",
		badgeClass: "error-badge--404",
		title: "Page Not Found",
		desc: "The page or resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
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
		}))
	},
	405: {
		badge: "405 • Method Not Allowed",
		badgeClass: "error-badge--warning",
		title: "Method Not Allowed",
		desc: "The HTTP method used is not supported for the requested resource.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
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
			x1: "8",
			y1: "12",
			x2: "16",
			y2: "12"
		}))
	},
	408: {
		badge: "408 • Request Timeout",
		badgeClass: "error-badge--warning",
		title: "Request Timeout",
		desc: "The server timed out waiting for the request to complete. Please check your network connection.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 14 14" }))
	},
	409: {
		badge: "409 • Conflict",
		badgeClass: "error-badge--warning",
		title: "Request Conflict",
		desc: "The request could not be completed due to a conflict with the current state of the resource.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), /* @__PURE__ */ __h("line", {
			x1: "12",
			y1: "9",
			x2: "12",
			y2: "13"
		}), /* @__PURE__ */ __h("line", {
			x1: "12",
			y1: "17",
			x2: "12.01",
			y2: "17"
		}))
	},
	413: {
		badge: "413 • Payload Too Large",
		badgeClass: "error-badge--warning",
		title: "Payload Too Large",
		desc: "The file or request payload sent exceeds the maximum allowed upload limit.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ __h("polyline", { points: "17 8 12 3 7 8" }), /* @__PURE__ */ __h("line", {
			x1: "12",
			y1: "3",
			x2: "12",
			y2: "15"
		}))
	},
	422: {
		badge: "422 • Unprocessable",
		badgeClass: "error-badge--warning",
		title: "Unprocessable Content",
		desc: "The request was well-formed but contained semantic errors that prevented processing.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
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
		}))
	},
	429: {
		badge: "429 • Slow Down",
		badgeClass: "error-badge--429",
		title: "Too Many Requests",
		desc: "You've sent too many requests in a short time. Please take a sip of coffee and wait a moment before trying again.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 16 14" })),
		defaultRetrySeconds: 30
	},
	500: {
		badge: "500 • Server Error",
		badgeClass: "error-badge--500",
		title: "Internal Server Error",
		desc: "Our server encountered an unexpected error. Our engineering team has been notified.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), /* @__PURE__ */ __h("line", {
			x1: "12",
			y1: "9",
			x2: "12",
			y2: "13"
		}), /* @__PURE__ */ __h("line", {
			x1: "12",
			y1: "17",
			x2: "12.01",
			y2: "17"
		})),
		defaultRetrySeconds: 10
	},
	502: {
		badge: "502 • Bad Gateway",
		badgeClass: "error-badge--server",
		title: "Bad Gateway",
		desc: "The server received an invalid response from the upstream gateway. Please try again momentarily.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("rect", {
			x: "2",
			y: "2",
			width: "20",
			height: "8",
			rx: "2",
			ry: "2"
		}), /* @__PURE__ */ __h("rect", {
			x: "2",
			y: "14",
			width: "20",
			height: "8",
			rx: "2",
			ry: "2"
		}), /* @__PURE__ */ __h("line", {
			x1: "6",
			y1: "6",
			x2: "6.01",
			y2: "6"
		}), /* @__PURE__ */ __h("line", {
			x1: "6",
			y1: "18",
			x2: "6.01",
			y2: "18"
		})),
		defaultRetrySeconds: 10
	},
	503: {
		badge: "503 • Service Unavailable",
		badgeClass: "error-badge--server",
		title: "Service Unavailable",
		desc: "The server is temporarily unavailable or undergoing maintenance. We will be back online shortly.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("path", { d: "M18.36 6.64a9 9 0 1 1-12.73 0" }), /* @__PURE__ */ __h("line", {
			x1: "12",
			y1: "2",
			x2: "12",
			y2: "12"
		})),
		defaultRetrySeconds: 15
	},
	504: {
		badge: "504 • Gateway Timeout",
		badgeClass: "error-badge--server",
		title: "Gateway Timeout",
		desc: "The upstream server took too long to respond. Please refresh the page in a few moments.",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 14 14" })),
		defaultRetrySeconds: 10
	}
};
const getLocalizedErrorDetails = (code, lang) => {
	const t = (id) => getErrorPageTranslation(lang, id);
	const mapping = {
		400: {
			badge: t("error_400_badge"),
			title: t("error_400_title"),
			desc: t("error_400_desc")
		},
		401: {
			badge: t("error_401_badge"),
			title: t("error_401_title"),
			desc: t("error_401_desc")
		},
		403: {
			badge: t("error_403_badge"),
			title: t("error_403_title"),
			desc: t("error_403_desc")
		},
		404: {
			badge: t("error_404_badge"),
			title: t("error_404_title"),
			desc: t("error_404_desc")
		},
		405: {
			badge: t("error_405_badge"),
			title: t("error_405_title"),
			desc: t("error_405_desc")
		},
		408: {
			badge: t("error_408_badge"),
			title: t("error_408_title"),
			desc: t("error_408_desc")
		},
		409: {
			badge: t("error_409_badge"),
			title: t("error_409_title"),
			desc: t("error_409_desc")
		},
		413: {
			badge: t("error_413_badge"),
			title: t("error_413_title"),
			desc: t("error_413_desc")
		},
		422: {
			badge: t("error_422_badge"),
			title: t("error_422_title"),
			desc: t("error_422_desc")
		},
		429: {
			badge: t("error_429_badge"),
			title: t("error_429_title"),
			desc: t("error_429_desc")
		},
		500: {
			badge: t("error_500_badge"),
			title: t("error_500_title"),
			desc: t("error_500_desc")
		},
		502: {
			badge: t("error_502_badge"),
			title: t("error_502_title"),
			desc: t("error_502_desc")
		},
		503: {
			badge: t("error_503_badge"),
			title: t("error_503_title"),
			desc: t("error_503_desc")
		},
		504: {
			badge: t("error_504_badge"),
			title: t("error_504_title"),
			desc: t("error_504_desc")
		}
	};
	return mapping[code] || {
		badge: `${code} • ${code >= 500 ? t("error_badge_server") : t("error_badge_request")}`,
		title: code >= 500 ? t("error_badge_server") : t("error_badge_request"),
		desc: t("error_fallback_desc")
	};
};
const ErrorPage = ({ defaultCode = "429" }) => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const lang = useLang();
	const t = (id) => getErrorPageTranslation(lang, id);
	const codeParam = searchParams.get("code") || defaultCode;
	const numCode = parseInt(codeParam, 10) || 500;
	const baseConfig = HTTP_ERROR_REGISTRY[numCode] || {
		badgeClass: numCode >= 500 ? "error-badge--server" : "error-badge--warning",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
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
		})),
		defaultRetrySeconds: numCode === 429 ? 30 : 0
	};
	const localizedDetails = getLocalizedErrorDetails(numCode, lang);
	const backendTitle = searchParams.get("title");
	const backendMessage = searchParams.get("message");
	const title = backendTitle || localizedDetails.title;
	const description = backendMessage || localizedDetails.desc;
	const badgeText = localizedDetails.badge;
	const retryParam = parseInt(searchParams.get("retry"), 10);
	const initialRetry = !isNaN(retryParam) && retryParam > 0 ? retryParam : baseConfig.defaultRetrySeconds || 0;
	const [timeLeft, setTimeLeft] = useState(initialRetry);
	const [isRetrying, setIsRetrying] = useState(false);
	useEffect(() => {
		if (initialRetry <= 0) return;
		setTimeLeft(initialRetry);
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1e3);
		return () => clearInterval(timer);
	}, [initialRetry, codeParam]);
	const handleRetry = () => {
		setIsRetrying(true);
		setTimeout(() => {
			navigate(-1);
		}, 600);
	};
	const progressPercent = initialRetry > 0 ? Math.max(0, Math.min(100, (initialRetry - timeLeft) / initialRetry * 100)) : 100;
	return /* @__PURE__ */ __h(motion.div, {
		className: "error-page",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .3 }
	}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "error-main" }, /* @__PURE__ */ __h("div", { className: "error-ambient-bg" }), /* @__PURE__ */ __h(motion.div, {
		className: "error-card",
		initial: {
			opacity: 0,
			scale: .94,
			y: 20
		},
		animate: {
			opacity: 1,
			scale: 1,
			y: 0
		},
		transition: {
			duration: .45,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	}, /* @__PURE__ */ __h("div", { className: `error-badge ${baseConfig.badgeClass}` }, /* @__PURE__ */ __h("span", { className: "error-badge__dot" }), /* @__PURE__ */ __h("span", null, badgeText)), /* @__PURE__ */ __h("div", { className: "error-icon-wrapper" }, baseConfig.icon), /* @__PURE__ */ __h("h1", { className: "error-code-title" }, numCode), /* @__PURE__ */ __h("h2", { className: "error-title" }, title), /* @__PURE__ */ __h("p", { className: "error-description" }, description), initialRetry > 0 && /* @__PURE__ */ __h("div", { className: "error-countdown-container" }, /* @__PURE__ */ __h("div", { className: "error-countdown-header" }, /* @__PURE__ */ __h("span", null, t("error_cooldown_active")), /* @__PURE__ */ __h("span", { className: "countdown-timer-value" }, timeLeft > 0 ? `${timeLeft}s ${t("error_remaining")}` : t("error_ready_retry"))), /* @__PURE__ */ __h("div", { className: "error-countdown-bar-wrap" }, /* @__PURE__ */ __h("div", {
		className: "error-countdown-bar-fill",
		style: { width: `${progressPercent}%` }
	}))), /* @__PURE__ */ __h("div", { className: "error-actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn",
		onClick: handleRetry,
		disabled: timeLeft > 0 || isRetrying
	}, isRetrying ? t("error_btn_retrying") : timeLeft > 0 ? `${t("error_btn_wait")} ${timeLeft}s` : t("error_btn_try_again")), /* @__PURE__ */ __h(Link, {
		to: "/",
		className: "cta-btn secondary"
	}, t("error_btn_home")), /* @__PURE__ */ __h(Link, {
		to: "/catalog",
		className: "cta-btn secondary"
	}, t("error_btn_menu"))))), /* @__PURE__ */ __h(Footer, null));
};
export default ErrorPage;
