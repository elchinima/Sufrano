(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/PublicPages/Rules/Lang.js
	__define("components/PublicPages/Rules/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"rules_badge": "Правила и политики",
				"rules_title": "Условия использования",
				"rules_subtitle": "Ознакомьтесь с правилами предоставления услуг, политиками и рекомендациями.",
				"rules_section_title": "Пользовательское соглашение",
				"rules_placeholder": "Содержимое условий использования в данный момент обновляется. Пожалуйста, зайдите позже для ознакомления с подробными правилами, условиями сервиса и соглашением.",
				"rules_status_draft": "Статус: Черновик",
				"rules_last_modified": "Последнее обновление:",
				"rules_btn_home": "На главную",
				"rules_btn_menu": "Смотреть меню"
			},
			en: {
				"rules_badge": "Legal & Policies",
				"rules_title": "Terms of Use",
				"rules_subtitle": "Please review our terms of service, policies, and guidelines.",
				"rules_section_title": "Terms of Service",
				"rules_placeholder": "The content for the Terms of Use is currently being updated. Please check back soon for our comprehensive rules, terms of service, and user agreements.",
				"rules_status_draft": "Status: Draft",
				"rules_last_modified": "Last modified:",
				"rules_btn_home": "Back to Home",
				"rules_btn_menu": "Explore Menu"
			},
			az: {
				"rules_badge": "Hüquqi qaydalar və siyasət",
				"rules_title": "İstifadə qaydaları",
				"rules_subtitle": "Xidmət şərtlərimiz, siyasətlərimiz və qaydalarımızla tanış olun.",
				"rules_section_title": "İstifadəçi razılaşması",
				"rules_placeholder": "İstifadə qaydalarının məzmunu hazırda yenilənir. Ətraflı qaydalar, xidmət şərtləri və istifadəçi razılaşmaları ilə tanış olmaq üçün tezliklə yenidən baxın.",
				"rules_status_draft": "Status: Qaralama",
				"rules_last_modified": "Son yenilənmə:",
				"rules_btn_home": "Ana səhifəyə qayıt",
				"rules_btn_menu": "Menyuya baxın"
			}
		};
		const getRulesTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.az || translations.ru;
			return dict[dataId] || translations.en[dataId] || dataId;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getRulesTranslation", { enumerable: true, get: function () { return getRulesTranslation; } });
	});
	//#endregion

	//#region components/PublicPages/Rules/Rules.js
	__define("components/PublicPages/Rules/Rules.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useEffect } = __imp_0;
		const { Link } = __require("utils/router.js");
		const { motion } = __require("utils/motion.js");
		const __imp_1 = __require("components/Footer/Footer.js");
		const Footer = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const { useLang } = __require("utils/useLang.js");
		const { getRulesTranslation } = __require("components/PublicPages/Rules/Lang.js");
		const Rules = () => {
			const lang = useLang();
			const t = (id) => getRulesTranslation(lang, id);
			useEffect(() => {
				document.title = "Süfrano";
				window.scrollTo(0, 0);
			}, []);
			const localeMap = {
				ru: "ru-RU",
				az: "az-AZ",
				en: "en-US"
			};
			const formattedDate = new Date().toLocaleDateString(localeMap[lang] || "az-AZ", {
				year: "numeric",
				month: "long",
				day: "numeric"
			});
			return /* @__PURE__ */ __h(motion.div, {
				className: "rules-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "rules-main" }, /* @__PURE__ */ __h("div", { className: "rules-ambient-bg" }), /* @__PURE__ */ __h("div", { className: "rules-container" }, /* @__PURE__ */ __h(motion.div, {
				className: "rules-hero",
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .5,
					delay: .1
				}
			}, /* @__PURE__ */ __h("div", { className: "rules-badge" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				width: "16",
				height: "16"
			}, /* @__PURE__ */ __h("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ __h("polyline", { points: "14 2 14 8 20 8" }), /* @__PURE__ */ __h("line", {
				x1: "16",
				y1: "13",
				x2: "8",
				y2: "13"
			}), /* @__PURE__ */ __h("line", {
				x1: "16",
				y1: "17",
				x2: "8",
				y2: "17"
			}), /* @__PURE__ */ __h("polyline", { points: "10 9 9 9 8 9" })), /* @__PURE__ */ __h("span", null, t("rules_badge"))), /* @__PURE__ */ __h("h1", { className: "rules-title" }, t("rules_title")), /* @__PURE__ */ __h("p", { className: "rules-subtitle" }, t("rules_subtitle"))), /* @__PURE__ */ __h(motion.div, {
				className: "rules-card",
				initial: {
					opacity: 0,
					y: 30
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .5,
					delay: .2
				}
			}, /* @__PURE__ */ __h("div", { className: "rules-empty-state" }, /* @__PURE__ */ __h("div", { className: "rules-empty-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }), /* @__PURE__ */ __h("path", { d: "M9 12l2 2 4-4" }))), /* @__PURE__ */ __h("h2", { className: "rules-section-title" }, t("rules_section_title")), /* @__PURE__ */ __h("p", { className: "rules-placeholder-text" }, t("rules_placeholder")), /* @__PURE__ */ __h("div", { className: "rules-meta-info" }, /* @__PURE__ */ __h("span", { className: "rules-meta-tag" }, t("rules_status_draft")), /* @__PURE__ */ __h("span", { className: "rules-meta-tag" }, t("rules_last_modified"), " ", formattedDate))), /* @__PURE__ */ __h("div", { className: "rules-actions" }, /* @__PURE__ */ __h(Link, {
				to: "/",
				className: "cta-btn secondary"
			}, t("rules_btn_home")), /* @__PURE__ */ __h(Link, {
				to: "/catalog",
				className: "cta-btn"
			}, t("rules_btn_menu")))))), /* @__PURE__ */ __h(Footer, null));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Rules; } });
	});
	//#endregion

	var entryExports = __require("components/PublicPages/Rules/Rules.js");
	__pages["rules"] = entryExports.default || entryExports;
})();
