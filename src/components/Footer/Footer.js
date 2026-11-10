import { __h, __Fragment } from '../../utils/runtime.js';
import React, { useState, useEffect } from "../../utils/runtime.js";
import { motion } from "../../utils/motion.js";
import { Link } from "../../utils/router.js";
import AppDownloadBanner from "./AppDownloadBanner.js";
const logo = "/assets/icons/rednest_logo.png";
const getBakuYear = () => {
	try {
		return new Intl.DateTimeFormat("en-US", {
			timeZone: "Asia/Baku",
			year: "numeric"
		}).format(new Date());
	} catch {
		return new Date(Date.now() + 4 * 60 * 60 * 1e3).getUTCFullYear().toString();
	}
};
import { setStoredLanguage } from "../../utils/useLang.js";
import { useFooterData } from "../../utils/footerData.js";
const Footer = () => {
	const currentYear = getBakuYear();
	const { activeContent, instagramUrl, tiktokUrl, whatsappUrl, language } = useFooterData();
	const handleLanguageChange = (newLang) => {
		setStoredLanguage(newLang);
	};
	const description = activeContent?.description || activeContent?.Description || "";
	const quickLinksTitle = activeContent?.quickLinksTitle || activeContent?.QuickLinksTitle || "";
	const contactUsTitle = activeContent?.contactUsTitle || activeContent?.ContactUsTitle || "";
	const termsOfUseTitle = activeContent?.termsOfUseTitle || activeContent?.TermsOfUseTitle || "";
	const copyrightText = activeContent?.copyrightText || activeContent?.CopyrightText || "";
	const quickLinks = activeContent?.quickLinks || activeContent?.QuickLinks || [];
	const contactUs = activeContent?.contactUs || activeContent?.ContactUs || {};
	const address = contactUs.address || contactUs.Address || "";
	const phone = contactUs.phone || contactUs.Phone || "";
	const email = contactUs.email || contactUs.Email || "";
	return /* @__PURE__ */ __h(motion.footer, {
		className: "footer",
		initial: {
			opacity: 0,
			y: 50
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			amount: .1
		},
		transition: { duration: .6 }
	}, /* @__PURE__ */ __h("div", { className: "footer-content" }, /* @__PURE__ */ __h("div", { className: "footer-top" }, /* @__PURE__ */ __h("div", { className: "footer-col brand-col" }, /* @__PURE__ */ __h("div", { className: "footer-brand" }, /* @__PURE__ */ __h("img", {
		src: logo,
		alt: "Süfrano Logo",
		className: "footer-logo"
	}), /* @__PURE__ */ __h("span", null, "Süfrano")), description && /* @__PURE__ */ __h("p", { className: "brand-desc" }, description), /* @__PURE__ */ __h("div", { className: "social-links" }, instagramUrl && /* @__PURE__ */ __h("a", {
		href: instagramUrl,
		target: "_blank",
		rel: "noopener noreferrer",
		className: "social-link",
		"aria-label": "Instagram"
	}, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: "20",
		height: "20",
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
		height: "20",
		rx: "5",
		ry: "5"
	}), /* @__PURE__ */ __h("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }), /* @__PURE__ */ __h("line", {
		x1: "17.5",
		y1: "6.5",
		x2: "17.51",
		y2: "6.5"
	})), /* @__PURE__ */ __h("span", null, "Instagram")), tiktokUrl && /* @__PURE__ */ __h("a", {
		href: tiktokUrl,
		target: "_blank",
		rel: "noopener noreferrer",
		className: "social-link",
		"aria-label": "TikTok"
	}, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: "20",
		height: "20",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" })), /* @__PURE__ */ __h("span", null, "TikTok")), whatsappUrl && /* @__PURE__ */ __h("a", {
		href: whatsappUrl,
		target: "_blank",
		rel: "noopener noreferrer",
		className: "social-link",
		"aria-label": "WhatsApp"
	}, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: "20",
		height: "20",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" })), /* @__PURE__ */ __h("span", null, "WhatsApp")))), /* @__PURE__ */ __h("div", { className: "footer-col links-col" }, quickLinksTitle && /* @__PURE__ */ __h("h4", null, quickLinksTitle), /* @__PURE__ */ __h("ul", null, quickLinks.map((item, index) => /* @__PURE__ */ __h("li", { key: index }, /* @__PURE__ */ __h(Link, { to: item.link || item.Link || "/" }, item.title || item.Title))))), /* @__PURE__ */ __h("div", { className: "footer-col contact-col" }, contactUsTitle && /* @__PURE__ */ __h("h4", null, contactUsTitle), /* @__PURE__ */ __h("ul", null, address && /* @__PURE__ */ __h("li", null, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), /* @__PURE__ */ __h("circle", {
		cx: "12",
		cy: "10",
		r: "3"
	})), /* @__PURE__ */ __h("span", null, address)), phone && /* @__PURE__ */ __h("li", null, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })), /* @__PURE__ */ __h("span", null, phone)), email && /* @__PURE__ */ __h("li", null, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ __h("polyline", { points: "22,6 12,13 2,6" })), /* @__PURE__ */ __h("span", null, email))))), /* @__PURE__ */ __h(AppDownloadBanner, null), /* @__PURE__ */ __h("div", { className: "footer-bottom" }, /* @__PURE__ */ __h("div", { className: "language-switcher" }, /* @__PURE__ */ __h("select", {
		"aria-label": "Select language",
		value: language,
		onChange: (e) => handleLanguageChange(e.target.value)
	}, /* @__PURE__ */ __h("option", { value: "ru" }, "Русский"), /* @__PURE__ */ __h("option", { value: "en" }, "English"), /* @__PURE__ */ __h("option", { value: "az" }, "Azərbaycan"))), /* @__PURE__ */ __h("p", { className: "copyright" }, "© ", currentYear, " Süfrano", copyrightText ? `. ${copyrightText}` : ""), termsOfUseTitle && /* @__PURE__ */ __h("div", { className: "terms-link" }, /* @__PURE__ */ __h(Link, { to: "/rules" }, termsOfUseTitle)))));
};
export default Footer;
