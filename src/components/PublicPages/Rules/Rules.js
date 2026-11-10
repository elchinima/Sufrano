import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useEffect } from "../../../utils/runtime.js";
import { Link } from "../../../utils/router.js";
import { motion } from "../../../utils/motion.js";
import Footer from "../../Footer/Footer.js";
import Navbar from "../../Elements/Navbar.js";
import { useLang } from "../../../utils/useLang.js";
import { getRulesTranslation } from "./Lang.js";
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
export default Rules;
