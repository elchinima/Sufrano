import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useCallback } from "../../../utils/runtime.js";
import { Link, useNavigate, useLocation } from "../../../utils/router.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import Navbar from "../../Elements/Navbar.js";
import Footer from "../../Footer/Footer.js";
import { useAuth } from "../../../context/AuthContext.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useLang } from "../../../utils/useLang.js";
import { translateError } from "../../../utils/errorTranslator.js";
import { getAdvertTranslation } from "./Lang.js";

const loaderIcon = "/assets/icons/loader-animated.svg";

const formatBakuDate = (isoStr) => {
	if (!isoStr) return "";
	try {
		if (typeof isoStr === "string") {
			const match = isoStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
			if (match) {
				const [, year, month, day] = match;
				return `${day}.${month}.${year}`;
			}
		}
		const d = new Date(isoStr);
		if (isNaN(d.getTime())) return "";
		const day = String(d.getDate()).padStart(2, "0");
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const year = d.getFullYear();
		return `${day}.${month}.${year}`;
	} catch {
		return "";
	}
};

const Advert = () => {
	const lang = useLang();
	const t = (dataId) => getAdvertTranslation(lang, dataId);
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthenticated } = useAuth();
	const [adverts, setAdverts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [toastMessage, setToastMessage] = useState(null);

	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => {
			setToastMessage(null);
		}, 4000);
	};

	const fetchAdverts = useCallback(async () => {
		setLoading(true);
		try {
			const apiUrl = window.__SUFRANO_API_URL__ || "";
			const endpoints = [
				`${apiUrl}/api/announcements`,
				`${apiUrl}/api/adverts`,
				`${apiUrl}/api/admin/adverts`
			];

			for (const url of endpoints) {
				try {
					const res = await fetchWithRefresh(url);
					if (res && res.ok) {
						const data = await res.json();
						const activeList = (Array.isArray(data) ? data : []).filter((a) => a.isActive !== false);
						setAdverts(activeList);
						break;
					}
				} catch {
					// try next fallback endpoint
				}
			}
		} catch (err) {
			console.error("Failed to load announcements:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		document.title = "Süfrano";
		window.scrollTo(0, 0);
		fetchAdverts();
	}, [fetchAdverts]);

	const handleAdvertClick = (advert) => {
		const rawLink = (advert?.link || "").trim();
		if (!rawLink) return;

		if (/^https?:\/\//i.test(rawLink)) {
			try {
				const url = new URL(rawLink);
				if (url.origin === window.location.origin) {
					navigate(url.pathname + url.search + url.hash);
					return;
				}
			} catch {}
			window.location.href = rawLink;
			return;
		}

		const targetPath = rawLink.startsWith("/") ? rawLink : `/${rawLink}`;
		navigate(targetPath);
	};

	const handleToggleLike = async (e, advert) => {
		e.stopPropagation();
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}
		try {
			const apiUrl = window.__SUFRANO_API_URL__ || "";
			let res = await fetchWithRefresh(`${apiUrl}/api/announcements/${advert.id}/like`, { method: "POST" }).catch(() => null);
			if (!res || res.status === 404) {
				res = await fetchWithRefresh(`${apiUrl}/api/adverts/${advert.id}/like`, { method: "POST" });
			}
			if (res && res.ok) {
				const data = await res.json();
				setAdverts((prev) => prev.map((a) => a.id === advert.id ? {
					...a,
					likes: data.likes ?? data.likesCount ?? 0,
					likesCount: data.likesCount ?? data.likes ?? 0,
					userLiked: Boolean(data.userLiked)
				} : a));
			} else if (res) {
				const errData = await res.json().catch(() => ({}));
				showToast(translateError(errData.message, lang) || "Failed to update like.");
			}
		} catch {
			showToast("Failed to update like. Please try again.");
		}
	};

	return /* @__PURE__ */ __h(motion.div, {
		className: "sufrano-board-page",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.3 }
	}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("div", { className: "community-subnav-bar" }, /* @__PURE__ */ __h("nav", {
		className: "community-subnav",
		"aria-label": "Secondary navigation"
	}, /* @__PURE__ */ __h(Link, {
		to: "/advert",
		className: `community-subnav__link ${location.pathname === "/advert" ? "active" : ""}`,
		"data-id": "subnav_board"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "m3 11 18-5v12L3 14v-3z" }), /* @__PURE__ */ __h("path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6" })), /* @__PURE__ */ __h("span", null, t("subnav_advert"))), /* @__PURE__ */ __h(Link, {
		to: "/review",
		className: `community-subnav__link ${location.pathname === "/review" ? "active" : ""}`,
		"data-id": "subnav_review"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })), /* @__PURE__ */ __h("span", null, t("subnav_review"))))), /* @__PURE__ */ __h("main", { className: "sufrano-board-main" }, /* @__PURE__ */ __h("div", { className: "sufrano-board-ambient-glow sufrano-board-ambient-glow--1" }), /* @__PURE__ */ __h("div", { className: "sufrano-board-ambient-glow sufrano-board-ambient-glow--2" }), /* @__PURE__ */ __h("div", { className: "sufrano-board-container" }, /* @__PURE__ */ __h("div", { className: "sufrano-board-hero" }, /* @__PURE__ */ __h("h1", { "data-id": "board_hero_title" }, t("advert_hero_title")), /* @__PURE__ */ __h("p", { "data-id": "board_hero_subtitle" }, t("advert_hero_subtitle")), !loading && adverts.length > 0 && /* @__PURE__ */ __h("div", { className: "sufrano-board-overall-badge" }, /* @__PURE__ */ __h("span", { className: "sufrano-board-overall-dot" }), /* @__PURE__ */ __h("span", { className: "sufrano-board-overall-count" }, adverts.length, " ", adverts.length === 1 ? t("advert_count_singular") : t("advert_count_plural")))), loading ? /* @__PURE__ */ __h("div", { className: "sufrano-board-loading-wrapper" }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading",
		className: "sufrano-board-loading-spinner"
	}), /* @__PURE__ */ __h("span", { "data-id": "board_loading" }, t("advert_loading"))) : adverts.length === 0 ? /* @__PURE__ */ __h("div", { className: "sufrano-board-empty-state" }, /* @__PURE__ */ __h("div", { className: "sufrano-board-empty-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.75",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "m3 11 18-5v12L3 14v-3z" }), /* @__PURE__ */ __h("path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6" }))), /* @__PURE__ */ __h("h2", { "data-id": "board_empty_title" }, t("advert_empty_title")), /* @__PURE__ */ __h("p", { "data-id": "board_empty_desc" }, t("advert_empty_desc"))) : /* @__PURE__ */ __h("div", { className: "sufrano-board-grid" }, /* @__PURE__ */ __h(AnimatePresence, { mode: "popLayout" }, adverts.map((advert, index) => {
		const hasLink = Boolean(advert.link && advert.link.trim());
		const hasMedia = Boolean(advert.mediaUrl && advert.mediaUrl.trim());
		const isLiked = Boolean(advert.userLiked);
		const likesCount = advert.likesCount ?? advert.likes ?? 0;
		const dateText = formatBakuDate(advert.createdAt);

		return /* @__PURE__ */ __h(motion.article, {
			key: advert.id || index,
			className: `sufrano-board-card ${hasLink ? "sufrano-board-card--clickable" : ""} ${!hasMedia ? "sufrano-board-card--text-only" : ""}`,
			layout: true,
			initial: { opacity: 0, y: 20 },
			animate: { opacity: 1, y: 0 },
			exit: { opacity: 0, scale: 0.95 },
			transition: { duration: 0.35, delay: Math.min(index * 0.05, 0.25) },
			onClick: hasLink ? () => handleAdvertClick(advert) : undefined,
			role: hasLink ? "link" : undefined,
			tabIndex: hasLink ? 0 : undefined,
			onKeyDown: hasLink ? (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleAdvertClick(advert);
				}
			} : undefined
		}, hasMedia && /* @__PURE__ */ __h("div", { className: "sufrano-board-card__media" }, /* @__PURE__ */ __h("img", {
			src: advert.mediaUrl,
			alt: advert.title,
			className: "sufrano-board-card__img",
			loading: "lazy",
			onError: (e) => {
				e.target.parentElement.style.display = "none";
			}
		})), /* @__PURE__ */ __h("div", { className: "sufrano-board-card__content" }, /* @__PURE__ */ __h("div", { className: "sufrano-board-card__header" }, /* @__PURE__ */ __h("h2", { className: "sufrano-board-card__title" }, advert.title), dateText && /* @__PURE__ */ __h("span", { className: "sufrano-board-card__date" }, dateText)), /* @__PURE__ */ __h("p", { className: "sufrano-board-card__description" }, advert.description), /* @__PURE__ */ __h("div", { className: "sufrano-board-card__footer" }, /* @__PURE__ */ __h("button", {
			type: "button",
			className: `sufrano-board-like-btn ${isLiked ? "liked" : ""}`,
			onClick: (e) => handleToggleLike(e, advert),
			"aria-label": t("advert_like")
		}, /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			width: "16",
			height: "16",
			fill: isLiked ? "#c5a059" : "none",
			stroke: isLiked ? "#c5a059" : "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })), /* @__PURE__ */ __h("span", null, t("advert_like"), " (", likesCount, ")")), hasLink && /* @__PURE__ */ __h("span", { className: "sufrano-board-card__cta" }, /* @__PURE__ */ __h("span", null, t("advert_open_link")), /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			width: "15",
			height: "15",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("line", { x1: "5", y1: "12", x2: "19", y2: "12" }), /* @__PURE__ */ __h("polyline", { points: "12 5 19 12 12 19" }))))));
	}))))), /* @__PURE__ */ __h("div", { className: "sufrano-board-toast-container" }, /* @__PURE__ */ __h(AnimatePresence, null, toastMessage && /* @__PURE__ */ __h(motion.div, {
		className: "sufrano-board-toast-notification",
		initial: { opacity: 0, y: 30, scale: 0.95 },
		animate: { opacity: 1, y: 0, scale: 1 },
		exit: { opacity: 0, y: 20, scale: 0.95 },
		transition: { type: "spring", damping: 20, stiffness: 300 }
	}, /* @__PURE__ */ __h("span", null, toastMessage)))), /* @__PURE__ */ __h(Footer, null));
};

export default Advert;
