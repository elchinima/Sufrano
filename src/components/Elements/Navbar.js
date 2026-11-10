import { __h, __Fragment } from '../../utils/runtime.js';
import React, { useState, useEffect } from "../../utils/runtime.js";
import { Link, useLocation } from "../../utils/router.js";
const logo = "/assets/icons/rednest_logo.png";
import UserNavPills from "./UserNavPills.js";
import { useLang } from "../../utils/useLang.js";
import { useFooterData } from "../../utils/footerData.js";
import { getWidgetTranslation } from "./Lang.js";
const Navbar = () => {
	const lang = useLang();
	const t = (id) => getWidgetTranslation(lang, id);
	const { instagramUrl, tiktokUrl, whatsappUrl } = useFooterData();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const isHome = location.pathname === "/" || location.pathname === "/home";
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	useEffect(() => {
		if (isMenuOpen) {
			document.body.classList.add("mobile-menu-open");
		} else {
			document.body.classList.remove("mobile-menu-open");
		}
		return () => {
			document.body.classList.remove("mobile-menu-open");
		};
	}, [isMenuOpen]);
	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);
	const handleCloseMenu = () => setIsMenuOpen(false);
	return /* @__PURE__ */ __h("header", { className: `home-header ${isHome ? "home-header--home" : ""} ${isScrolled ? "home-header--scrolled" : "home-header--transparent"}` }, /* @__PURE__ */ __h("div", { className: "logo-container" }, /* @__PURE__ */ __h(Link, {
		to: "/",
		onClick: handleCloseMenu,
		style: {
			textDecoration: "none",
			display: "flex",
			alignItems: "center",
			gap: "0.5rem"
		}
	}, /* @__PURE__ */ __h("img", {
		src: logo,
		alt: "Süfrano Logo",
		className: "logo"
	}), /* @__PURE__ */ __h("span", { className: "brand-name" }, "Süfrano"))), /* @__PURE__ */ __h("div", { className: `nav-menu ${isMenuOpen ? "open" : ""}` }, /* @__PURE__ */ __h(UserNavPills, { onMenuClose: handleCloseMenu }), /* @__PURE__ */ __h("nav", { className: "nav-links" }, /* @__PURE__ */ __h(Link, {
		to: "/",
		className: `nav-link ${location.pathname === "/" ? "active" : ""}`,
		onClick: handleCloseMenu,
		"data-id": "nav_home"
	}, /* @__PURE__ */ __h("svg", {
		className: "nav-link__icon",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" }), /* @__PURE__ */ __h("path", { d: "M9 21V12h6v9" })), /* @__PURE__ */ __h("span", null, t("nav_home"))), /* @__PURE__ */ __h(Link, {
		to: "/catalog",
		className: `nav-link ${location.pathname === "/catalog" ? "active" : ""}`,
		onClick: handleCloseMenu,
		"data-id": "nav_menu"
	}, /* @__PURE__ */ __h("svg", {
		className: "nav-link__icon",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("rect", {
		x: "3",
		y: "3",
		width: "7",
		height: "7",
		rx: "1"
	}), /* @__PURE__ */ __h("rect", {
		x: "14",
		y: "3",
		width: "7",
		height: "7",
		rx: "1"
	}), /* @__PURE__ */ __h("rect", {
		x: "3",
		y: "14",
		width: "7",
		height: "7",
		rx: "1"
	}), /* @__PURE__ */ __h("rect", {
		x: "14",
		y: "14",
		width: "7",
		height: "7",
		rx: "1"
	})), /* @__PURE__ */ __h("span", null, t("nav_menu"))), /* @__PURE__ */ __h(Link, {
		to: "/review",
		className: `nav-link ${location.pathname === "/review" || location.pathname === "/reviews" ? "active" : ""}`,
		onClick: handleCloseMenu,
		"data-id": "nav_review"
	}, /* @__PURE__ */ __h("svg", {
		className: "nav-link__icon",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" })), /* @__PURE__ */ __h("span", null, t("nav_review")))), /* @__PURE__ */ __h("div", { className: "nav-menu__footer" }, /* @__PURE__ */ __h("div", { className: "nav-menu__social" }, instagramUrl && /* @__PURE__ */ __h("a", {
		href: instagramUrl,
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": "Instagram"
	}, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
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
	}))), tiktokUrl && /* @__PURE__ */ __h("a", {
		href: tiktokUrl,
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": "TikTok"
	}, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" }))), whatsappUrl && /* @__PURE__ */ __h("a", {
		href: whatsappUrl,
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": "WhatsApp"
	}, /* @__PURE__ */ __h("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" })))))), /* @__PURE__ */ __h("div", {
		className: `menu-overlay ${isMenuOpen ? "open" : ""}`,
		onClick: handleCloseMenu
	}), /* @__PURE__ */ __h("button", {
		className: "mobile-menu-btn",
		onClick: () => setIsMenuOpen(!isMenuOpen),
		"aria-label": "Toggle menu"
	}, isMenuOpen ? "✕" : "☰"));
};
export default Navbar;
