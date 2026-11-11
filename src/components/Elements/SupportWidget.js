import { __h, __Fragment } from '../../utils/runtime.js';
import React, { useState, useEffect } from "../../utils/runtime.js";
import { useLocation, useNavigate } from "../../utils/router.js";
import { useAuth } from "../../context/AuthContext.js";
const smileyAnimated = "/assets/icons/smiley-animated.svg";
import { useLang } from "../../utils/useLang.js";
import { getWidgetTranslation } from "./Lang.js";
const supportStyles = `
.support-widget-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0;
  pointer-events: none;
  transform: translateY(20px) scale(0.8);
}
body.mobile-menu-open .support-widget-container {
  opacity: 0 !important;
  pointer-events: none !important;
}
.support-widget-container.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}
@media (max-width: 768px) {
  .support-widget-container {
    bottom: 20px;
    right: 20px;
  }
  .support-tooltip {
    font-size: 0.76rem;
    padding: 10px 14px;
  }
}
.support-tooltip {
  position: absolute;
  right: calc(100% + 15px);
  background: rgba(24, 3, 9, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(197, 160, 89, 0.4);
  padding: 12px 18px;
  border-radius: 12px 12px 0 12px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transform: translate(15px, -50px) scale(0.9);
  pointer-events: none;
  box-shadow: 0 0 14px rgba(197, 160, 89, 0.16), 0 6px 20px rgba(0, 0, 0, 0.4);
}
.support-widget-container:hover .support-tooltip {
  visibility: visible;
  animation: supportTooltipPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes supportTooltipPop {
  0% {
    opacity: 0;
    transform: translate(15px, -50px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translate(0, -50px) scale(1);
  }
}
.support-widget {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: rgba(24, 3, 9, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(197, 160, 89, 0.42);
  box-shadow: 0 0 14px rgba(197, 160, 89, 0.18), 0 0 30px rgba(197, 160, 89, 0.08), 0 6px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}
.support-widget img {
  width: 40px;
  height: 40px;
}
.support-widget:hover {
  transform: scale(1.12) translateY(-5px);
  background: rgba(36, 5, 13, 0.96);
  border-color: rgba(223, 194, 136, 0.7);
  box-shadow: 0 0 20px rgba(197, 160, 89, 0.32), 0 0 40px rgba(197, 160, 89, 0.14), 0 8px 24px rgba(0, 0, 0, 0.5);
}
.support-widget:active {
  transform: scale(0.95);
}
@media (max-width: 768px) {
  .support-widget {
    width: 55px;
    height: 55px;
  }
  .support-widget img {
    width: 34px;
    height: 34px;
  }
}
`;
const SupportWidget = () => {
	const lang = useLang();
	const t = (id) => getWidgetTranslation(lang, id);
	const location = useLocation();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isFooterVisible, setIsFooterVisible] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			let isAtBottom = false;
			const footer = document.querySelector("footer");
			if (footer) {
				const footerRect = footer.getBoundingClientRect();
				if (footerRect.top <= window.innerHeight - 60) {
					isAtBottom = true;
				}
			} else {
				isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100;
			}
			setIsScrolled(scrollY >= 10);
			setIsFooterVisible(isAtBottom);
		};
		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, [location.pathname]);
	const hiddenPaths = [
		"/login",
		"/fortune",
		"/profile",
		"/sessions",
		"/promos",
		"/order",
		"/orders",
		"/error"
	];
	if (hiddenPaths.includes(location.pathname) || location.pathname.startsWith("/admin") || location.pathname.startsWith("/cashbox")) {
		return null;
	}
	const isVisible = isScrolled && !isFooterVisible;
	return /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("style", null, supportStyles), /* @__PURE__ */ __h("div", { className: `support-widget-container ${isVisible ? "visible" : ""}` }, /* @__PURE__ */ __h("span", {
		className: "support-tooltip",
		"data-id": "widget_support_tooltip"
	}, t("widget_support_tooltip")), /* @__PURE__ */ __h("button", {
		className: "support-widget",
		"aria-label": t("widget_support_aria"),
		"data-id": "widget_support_aria",
		onClick: () => {
			if (!isAuthenticated) {
				navigate("/login");
			}
		}
	}, /* @__PURE__ */ __h("img", {
		src: smileyAnimated,
		alt: "Support"
	}))));
};
export default SupportWidget;
