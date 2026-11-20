(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/PublicPages/Advert/Lang.js
	__define("components/PublicPages/Advert/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"subnav_advert": "Объявление",
				"subnav_review": "Отзывы",
				"advert_hero_title": "Объявление",
				"advert_hero_subtitle": "Актуальные акции, новости и специальные предложения от Süfrano.",
				"advert_count_singular": "активное объявление",
				"advert_count_plural": "активных объявлений",
				"advert_loading": "Загрузка объявлений...",
				"advert_empty_title": "Активных объявлений пока нет",
				"advert_empty_desc": "Следите за обновлениями — скоро здесь появятся новые акции и специальные предложения от Süfrano!",
				"advert_open_link": "Перейти",
				"advert_like": "Нравится"
			},
			en: {
				"subnav_advert": "Advert",
				"subnav_review": "Review",
				"advert_hero_title": "Advert",
				"advert_hero_subtitle": "Discover the latest promotions, news, and special offers from Süfrano.",
				"advert_count_singular": "active advert",
				"advert_count_plural": "active adverts",
				"advert_loading": "Loading adverts...",
				"advert_empty_title": "No active adverts yet",
				"advert_empty_desc": "Stay tuned — new promotions and special offers from Süfrano will appear here soon!",
				"advert_open_link": "Explore",
				"advert_like": "Like"
			},
			az: {
				"subnav_advert": "Elanlar",
				"subnav_review": "Rəylər",
				"advert_hero_title": "Elanlar",
				"advert_hero_subtitle": "Süfrano-dan ən son aksiyalar, xəbərlər və xüsusi təkliflərlə tanış olun.",
				"advert_count_singular": "aktiv elan",
				"advert_count_plural": "aktiv elan",
				"advert_loading": "Elanlar yüklənir...",
				"advert_empty_title": "Hələlik aktiv elan yoxdur",
				"advert_empty_desc": "Yenilikləri izləyin — tezliklə burada Süfrano-dan yeni aksiyalar və xüsusi təkliflər paylaşılacaq!",
				"advert_open_link": "Keçid et",
				"advert_like": "Bəyən"
			}
		};

		const getAdvertTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.ru;
			return dict[dataId] || translations.en[dataId] || dataId;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getAdvertTranslation", { enumerable: true, get: function () { return getAdvertTranslation; } });
	});
	//#endregion

	//#region components/PublicPages/Advert/Advert.js
	__define("components/PublicPages/Advert/Advert.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useCallback } = __imp_0;
		const { Link, useNavigate, useLocation } = __require("utils/router.js");
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const __imp_1 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Footer/Footer.js");
		const Footer = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const { useAuth } = __require("context/AuthContext.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { useLang } = __require("utils/useLang.js");
		const { translateError } = __require("utils/errorTranslator.js");
		const { getAdvertTranslation } = __require("components/PublicPages/Advert/Lang.js");

		const loaderIcon = "/assets/icons/loader-animated.svg";

		const formatBakuDate = (isoStr) => {
			if (!isoStr) return "";
			try {
				if (typeof isoStr === "string") {
					const match = isoStr.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
					if (match) {
						const [, year, month, day, hour, minute] = match;
						return `${day}.${month}.${year}, ${hour}:${minute}`;
					}
				}
				const d = new Date(isoStr);
				if (isNaN(d.getTime())) return "";
				const day = String(d.getDate()).padStart(2, "0");
				const month = String(d.getMonth() + 1).padStart(2, "0");
				const year = d.getFullYear();
				const hour = String(d.getHours()).padStart(2, "0");
				const minute = String(d.getMinutes()).padStart(2, "0");
				return `${day}.${month}.${year}, ${hour}:${minute}`;
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
					const res = await fetchWithRefresh(`${apiUrl}/api/adverts`);
					if (res.ok) {
						const data = await res.json();
						const activeList = (Array.isArray(data) ? data : []).filter((a) => a.isActive !== false);
						setAdverts(activeList);
					}
				} catch (err) {
					console.error("Failed to load adverts:", err);
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
					const res = await fetchWithRefresh(`${apiUrl}/api/adverts/${advert.id}/like`, { method: "POST" });
					if (res.ok) {
						const data = await res.json();
						setAdverts((prev) => prev.map((a) => a.id === advert.id ? {
							...a,
							likes: data.likes ?? data.likesCount ?? 0,
							likesCount: data.likesCount ?? data.likes ?? 0,
							userLiked: Boolean(data.userLiked)
						} : a));
					} else {
						const errData = await res.json().catch(() => ({}));
						showToast(translateError(errData.message, lang) || "Failed to update like.");
					}
				} catch {
					showToast("Failed to update like. Please try again.");
				}
			};

			return /* @__PURE__ */ __h(motion.div, {
				className: "advert-page",
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
				"data-id": "subnav_advert"
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
			}, /* @__PURE__ */ __h("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })), /* @__PURE__ */ __h("span", null, t("subnav_review"))))), /* @__PURE__ */ __h("main", { className: "advert-main" }, /* @__PURE__ */ __h("div", { className: "advert-ambient-glow advert-ambient-glow--1" }), /* @__PURE__ */ __h("div", { className: "advert-ambient-glow advert-ambient-glow--2" }), /* @__PURE__ */ __h("div", { className: "advert-container" }, /* @__PURE__ */ __h("div", { className: "advert-hero" }, /* @__PURE__ */ __h("h1", { "data-id": "advert_hero_title" }, t("advert_hero_title")), /* @__PURE__ */ __h("p", { "data-id": "advert_hero_subtitle" }, t("advert_hero_subtitle")), !loading && adverts.length > 0 && /* @__PURE__ */ __h("div", { className: "advert-overall-badge" }, /* @__PURE__ */ __h("span", { className: "advert-overall-dot" }), /* @__PURE__ */ __h("span", { className: "advert-overall-count" }, adverts.length, " ", adverts.length === 1 ? t("advert_count_singular") : t("advert_count_plural")))), loading ? /* @__PURE__ */ __h("div", { className: "advert-loading-wrapper" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading adverts",
				className: "advert-loading-spinner"
			}), /* @__PURE__ */ __h("span", { "data-id": "advert_loading" }, t("advert_loading"))) : adverts.length === 0 ? /* @__PURE__ */ __h("div", { className: "advert-empty-state" }, /* @__PURE__ */ __h("div", { className: "advert-empty-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.75",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "m3 11 18-5v12L3 14v-3z" }), /* @__PURE__ */ __h("path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6" }))), /* @__PURE__ */ __h("h2", { "data-id": "advert_empty_title" }, t("advert_empty_title")), /* @__PURE__ */ __h("p", { "data-id": "advert_empty_desc" }, t("advert_empty_desc"))) : /* @__PURE__ */ __h("div", { className: "advert-grid" }, /* @__PURE__ */ __h(AnimatePresence, { mode: "popLayout" }, adverts.map((advert, index) => {
				const hasLink = Boolean(advert.link && advert.link.trim());
				const hasMedia = Boolean(advert.mediaUrl && advert.mediaUrl.trim());
				const isLiked = Boolean(advert.userLiked);
				const likesCount = advert.likesCount ?? advert.likes ?? 0;
				const dateText = formatBakuDate(advert.createdAt);

				return /* @__PURE__ */ __h(motion.article, {
					key: advert.id || index,
					className: `advert-card ${hasLink ? "advert-card--clickable" : ""} ${!hasMedia ? "advert-card--text-only" : ""}`,
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
				}, hasMedia && /* @__PURE__ */ __h("div", { className: "advert-card__media" }, /* @__PURE__ */ __h("img", {
					src: advert.mediaUrl,
					alt: advert.title,
					className: "advert-card__img",
					loading: "lazy",
					onError: (e) => {
						e.target.parentElement.style.display = "none";
					}
				})), /* @__PURE__ */ __h("div", { className: "advert-card__content" }, /* @__PURE__ */ __h("div", { className: "advert-card__header" }, /* @__PURE__ */ __h("h2", { className: "advert-card__title" }, advert.title), dateText && /* @__PURE__ */ __h("span", { className: "advert-card__date" }, dateText)), /* @__PURE__ */ __h("p", { className: "advert-card__description" }, advert.description), /* @__PURE__ */ __h("div", { className: "advert-card__footer" }, /* @__PURE__ */ __h("button", {
					type: "button",
					className: `advert-like-btn ${isLiked ? "liked" : ""}`,
					onClick: (e) => handleToggleLike(e, advert),
					"aria-label": t("advert_like")
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "16",
					height: "16",
					fill: isLiked ? "#c5a059" : "none",
					stroke: isLiked ? "#c5a059" : "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })), /* @__PURE__ */ __h("span", null, t("advert_like"), " (", likesCount, ")")), hasLink && /* @__PURE__ */ __h("span", { className: "advert-card__cta" }, /* @__PURE__ */ __h("span", null, t("advert_open_link")), /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "15",
					height: "15",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2.2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("line", { x1: "5", y1: "12", x2: "19", y2: "12" }), /* @__PURE__ */ __h("polyline", { points: "12 5 19 12 12 19" }))))));
			}))))), /* @__PURE__ */ __h("div", { className: "advert-toast-container" }, /* @__PURE__ */ __h(AnimatePresence, null, toastMessage && /* @__PURE__ */ __h(motion.div, {
				className: "advert-toast-notification",
				initial: { opacity: 0, y: 30, scale: 0.95 },
				animate: { opacity: 1, y: 0, scale: 1 },
				exit: { opacity: 0, y: 20, scale: 0.95 },
				transition: { type: "spring", damping: 20, stiffness: 300 }
			}, /* @__PURE__ */ __h("span", null, toastMessage)))), /* @__PURE__ */ __h(Footer, null));
		};


		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Advert; } });
	});
	//#endregion

	var entryExports = __require("components/PublicPages/Advert/Advert.js");
	__pages["advert"] = entryExports.default || entryExports;
})();
