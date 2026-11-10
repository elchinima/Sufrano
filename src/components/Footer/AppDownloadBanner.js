import { __h, __Fragment } from '../../utils/runtime.js';
import React, { useMemo, useState, useEffect, useRef } from "../../utils/runtime.js";
import { motion, AnimatePresence } from "../../utils/motion.js";
import { useLang } from "../../utils/useLang.js";
const summerModel = "/assets/images/footer_image_summer.png";
const winterModel = "/assets/images/footer_image_winter.png";
const addIcon = "/assets/icons/add.svg";
const isWinterSeason = () => {
	const month = new Date().getMonth();
	return month >= 9 || month <= 2;
};
const BANNER_CONTENT = {
	ru: {
		title: "Скачай приложение — забери кофе в подарок!",
		features: [
			{
				step: "1",
				title: "1. Скачай приложение",
				desc: "Доступно на iOS и Android",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("rect", {
					x: "5",
					y: "2",
					width: "14",
					height: "20",
					rx: "3",
					ry: "3"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "18",
					x2: "12.01",
					y2: "18"
				}), /* @__PURE__ */ __h("polyline", { points: "9 9 12 12 15 9" }), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "6",
					x2: "12",
					y2: "12"
				}))
			},
			{
				step: "2",
				title: "2. Крути Колесо Фортуны",
				desc: "Выигрывай подарки каждый день",
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
				}), /* @__PURE__ */ __h("circle", {
					cx: "12",
					cy: "12",
					r: "3"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "2",
					x2: "12",
					y2: "5"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "19",
					x2: "12",
					y2: "22"
				}), /* @__PURE__ */ __h("line", {
					x1: "2",
					y1: "12",
					x2: "5",
					y2: "12"
				}), /* @__PURE__ */ __h("line", {
					x1: "19",
					y1: "12",
					x2: "22",
					y2: "12"
				}), /* @__PURE__ */ __h("line", {
					x1: "4.93",
					y1: "4.93",
					x2: "7.05",
					y2: "7.05"
				}), /* @__PURE__ */ __h("line", {
					x1: "16.95",
					y1: "16.95",
					x2: "19.07",
					y2: "19.07"
				}), /* @__PURE__ */ __h("line", {
					x1: "4.93",
					y1: "19.07",
					x2: "7.05",
					y2: "16.95"
				}), /* @__PURE__ */ __h("line", {
					x1: "16.95",
					y1: "7.05",
					x2: "19.07",
					y2: "4.93"
				}))
			},
			{
				step: "3",
				title: "3. Забирай призы и кэшбэк",
				desc: "До 20% с каждой чашки кофе",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("polyline", { points: "20 12 20 22 4 22 4 12" }), /* @__PURE__ */ __h("rect", {
					x: "2",
					y: "7",
					width: "20",
					height: "5"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "22",
					x2: "12",
					y2: "7"
				}), /* @__PURE__ */ __h("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }), /* @__PURE__ */ __h("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }))
			}
		],
		appStore: {
			subtitle: "Скачать",
			title: "App Store"
		},
		googlePlay: {
			subtitle: "Скачать",
			title: "Google Play"
		}
	},
	az: {
		title: "Tətbiqi yüklə — hədiyyə qəhvə qazan!",
		features: [
			{
				step: "1",
				title: "1. Tətbiqi yüklə",
				desc: "iOS və Android üçün əlçatandır",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("rect", {
					x: "5",
					y: "2",
					width: "14",
					height: "20",
					rx: "3",
					ry: "3"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "18",
					x2: "12.01",
					y2: "18"
				}), /* @__PURE__ */ __h("polyline", { points: "9 9 12 12 15 9" }), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "6",
					x2: "12",
					y2: "12"
				}))
			},
			{
				step: "2",
				title: "2. Bəxt Çarxını fırlat",
				desc: "Hər gün yeni hədiyyələr qazan",
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
				}), /* @__PURE__ */ __h("circle", {
					cx: "12",
					cy: "12",
					r: "3"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "2",
					x2: "12",
					y2: "5"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "19",
					x2: "12",
					y2: "22"
				}), /* @__PURE__ */ __h("line", {
					x1: "2",
					y1: "12",
					x2: "5",
					y2: "12"
				}), /* @__PURE__ */ __h("line", {
					x1: "19",
					y1: "12",
					x2: "22",
					y2: "12"
				}), /* @__PURE__ */ __h("line", {
					x1: "4.93",
					y1: "4.93",
					x2: "7.05",
					y2: "7.05"
				}), /* @__PURE__ */ __h("line", {
					x1: "16.95",
					y1: "16.95",
					x2: "19.07",
					y2: "19.07"
				}), /* @__PURE__ */ __h("line", {
					x1: "4.93",
					y1: "19.07",
					x2: "7.05",
					y2: "16.95"
				}), /* @__PURE__ */ __h("line", {
					x1: "16.95",
					y1: "7.05",
					x2: "19.07",
					y2: "4.93"
				}))
			},
			{
				step: "3",
				title: "3. Mükafatlar və keşbek qazan",
				desc: "Hər fincandan 20%-dək keşbek",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("polyline", { points: "20 12 20 22 4 22 4 12" }), /* @__PURE__ */ __h("rect", {
					x: "2",
					y: "7",
					width: "20",
					height: "5"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "22",
					x2: "12",
					y2: "7"
				}), /* @__PURE__ */ __h("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }), /* @__PURE__ */ __h("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }))
			}
		],
		appStore: {
			subtitle: "Yüklə",
			title: "App Store"
		},
		googlePlay: {
			subtitle: "Yüklə",
			title: "Google Play"
		}
	},
	en: {
		title: "Download the app — get a free coffee!",
		features: [
			{
				step: "1",
				title: "1. Download the app",
				desc: "Available for iOS & Android",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("rect", {
					x: "5",
					y: "2",
					width: "14",
					height: "20",
					rx: "3",
					ry: "3"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "18",
					x2: "12.01",
					y2: "18"
				}), /* @__PURE__ */ __h("polyline", { points: "9 9 12 12 15 9" }), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "6",
					x2: "12",
					y2: "12"
				}))
			},
			{
				step: "2",
				title: "2. Spin Fortune Wheel",
				desc: "Win fresh prizes every day",
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
				}), /* @__PURE__ */ __h("circle", {
					cx: "12",
					cy: "12",
					r: "3"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "2",
					x2: "12",
					y2: "5"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "19",
					x2: "12",
					y2: "22"
				}), /* @__PURE__ */ __h("line", {
					x1: "2",
					y1: "12",
					x2: "5",
					y2: "12"
				}), /* @__PURE__ */ __h("line", {
					x1: "19",
					y1: "12",
					x2: "22",
					y2: "12"
				}), /* @__PURE__ */ __h("line", {
					x1: "4.93",
					y1: "4.93",
					x2: "7.05",
					y2: "7.05"
				}), /* @__PURE__ */ __h("line", {
					x1: "16.95",
					y1: "16.95",
					x2: "19.07",
					y2: "19.07"
				}), /* @__PURE__ */ __h("line", {
					x1: "4.93",
					y1: "19.07",
					x2: "7.05",
					y2: "16.95"
				}), /* @__PURE__ */ __h("line", {
					x1: "16.95",
					y1: "7.05",
					x2: "19.07",
					y2: "4.93"
				}))
			},
			{
				step: "3",
				title: "3. Get rewards & cashback",
				desc: "Up to 20% on every order",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("polyline", { points: "20 12 20 22 4 22 4 12" }), /* @__PURE__ */ __h("rect", {
					x: "2",
					y: "7",
					width: "20",
					height: "5"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "22",
					x2: "12",
					y2: "7"
				}), /* @__PURE__ */ __h("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }), /* @__PURE__ */ __h("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }))
			}
		],
		appStore: {
			subtitle: "Download",
			title: "App Store"
		},
		googlePlay: {
			subtitle: "Get it on",
			title: "Google Play"
		}
	}
};
const AppDownloadBanner = () => {
	const currentLang = useLang() || "ru";
	const content = useMemo(() => {
		return BANNER_CONTENT[currentLang] || BANNER_CONTENT.ru;
	}, [currentLang]);
	const [isMobile, setIsMobile] = useState(() => {
		if (typeof window !== "undefined") {
			return window.innerWidth <= 900;
		}
		return false;
	});
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 900);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const featureRefs = useRef([]);
	const [marqueeState, setMarqueeState] = useState(null);
	const handleFeatureClick = (e, idx) => {
		e.stopPropagation();
		if (marqueeState && marqueeState.index === idx) {
			return;
		}
		const cardEl = featureRefs.current[idx];
		if (!cardEl) return;
		const descEl = cardEl.querySelector(".feature-desc");
		const titleEl = cardEl.querySelector(".feature-title");
		const descOverflows = descEl ? descEl.scrollWidth > descEl.clientWidth + 1 : false;
		const titleOverflows = titleEl ? titleEl.scrollWidth > titleEl.clientWidth + 1 : false;
		if (descOverflows || titleOverflows) {
			const descWidth = descEl ? descEl.scrollWidth : 0;
			const titleWidth = titleEl ? titleEl.scrollWidth : 0;
			const descDuration = Math.max(5, Math.min(14, Math.round((descWidth + 36) / 35)));
			const titleDuration = Math.max(5, Math.min(14, Math.round((titleWidth + 36) / 35)));
			setMarqueeState({
				index: idx,
				descOverflow: descOverflows,
				titleOverflow: titleOverflows,
				descDuration,
				titleDuration
			});
		} else {
			setMarqueeState(null);
		}
	};
	useEffect(() => {
		if (!marqueeState) return;
		const handleClickOutside = (e) => {
			const activeCard = featureRefs.current[marqueeState.index];
			if (activeCard && !activeCard.contains(e.target)) {
				setMarqueeState(null);
			}
		};
		const timer = setTimeout(() => {
			document.addEventListener("click", handleClickOutside);
		}, 0);
		return () => {
			clearTimeout(timer);
			document.removeEventListener("click", handleClickOutside);
		};
	}, [marqueeState]);
	useEffect(() => {
		setMarqueeState(null);
	}, [currentLang]);
	const [isVisible, setIsVisible] = useState(() => {
		try {
			const hiddenUntil = localStorage.getItem("rednest_app_banner_hidden_until");
			if (hiddenUntil) {
				const time = parseInt(hiddenUntil, 10);
				if (!isNaN(time) && Date.now() < time) {
					return false;
				}
			}
		} catch {
			return true;
		}
		return true;
	});
	const handleDismiss = (e) => {
		e.stopPropagation();
		try {
			const hideUntil = Date.now() + 24 * 60 * 60 * 1e3;
			localStorage.setItem("rednest_app_banner_hidden_until", hideUntil.toString());
		} catch {}
		setIsVisible(false);
	};
	const isWinter = isWinterSeason();
	const modelImg = isWinter ? winterModel : summerModel;
	const modelAlt = isWinter ? "Süfrano Winter Coffee App" : "Süfrano Summer Coffee App";
	return /* @__PURE__ */ __h(AnimatePresence, null, isVisible && /* @__PURE__ */ __h(motion.section, {
		className: "rednest-app-banner",
		initial: {
			opacity: 0,
			y: 35
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -25,
			scale: .96,
			height: 0,
			marginTop: 0,
			marginBottom: 0,
			transition: {
				duration: .4,
				ease: "easeInOut"
			}
		},
		transition: {
			duration: .6,
			ease: "easeOut"
		}
	}, /* @__PURE__ */ __h("div", { className: "banner-inner" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "banner-close-btn",
		onClick: handleDismiss,
		"aria-label": "Close"
	}, /* @__PURE__ */ __h("img", {
		src: addIcon,
		alt: "",
		className: "banner-close-icon"
	})), /* @__PURE__ */ __h("div", { className: "banner-ambient-glow" }), !isMobile && /* @__PURE__ */ __h("div", { className: "banner-model-col" }, /* @__PURE__ */ __h("div", { className: "model-glow-ring" }), /* @__PURE__ */ __h("img", {
		src: modelImg,
		alt: modelAlt,
		className: "model-img",
		loading: "lazy"
	})), /* @__PURE__ */ __h("div", { className: "banner-center-col" }, /* @__PURE__ */ __h("h3", { className: "banner-title" }, content.title), /* @__PURE__ */ __h("div", { className: "banner-features-track" }, content.features.map((feature, idx) => {
		const isCardActive = marqueeState?.index === idx;
		const isDescMarquee = isCardActive && marqueeState.descOverflow;
		const isTitleMarquee = isCardActive && marqueeState.titleOverflow;
		return /* @__PURE__ */ __h(motion.div, {
			key: idx,
			ref: (el) => {
				featureRefs.current[idx] = el;
			},
			className: `banner-feature-card ${isCardActive ? "is-marquee-active" : ""}`,
			onClick: (e) => handleFeatureClick(e, idx),
			initial: {
				opacity: 0,
				x: -20
			},
			whileInView: {
				opacity: 1,
				x: 0
			},
			viewport: { once: true },
			transition: {
				duration: .5,
				delay: .08 * (idx + 1),
				ease: "easeOut"
			},
			animate: { x: [
				0,
				8,
				0
			] },
			transitionRepeat: {
				repeat: Infinity,
				duration: 4 + idx * .7,
				ease: "easeInOut"
			},
			whileHover: {
				x: 12,
				scale: 1.015,
				transition: { duration: .2 }
			}
		}, /* @__PURE__ */ __h("div", { className: "feature-icon-box" }, feature.icon), /* @__PURE__ */ __h("div", { className: "feature-text" }, /* @__PURE__ */ __h("span", {
			className: `feature-title ${isTitleMarquee ? "is-marquee" : ""}`,
			title: feature.title
		}, isTitleMarquee ? /* @__PURE__ */ __h("span", {
			className: "marquee-track",
			style: { animationDuration: `${marqueeState.titleDuration}s` }
		}, /* @__PURE__ */ __h("span", { className: "marquee-item" }, feature.title), /* @__PURE__ */ __h("span", {
			className: "marquee-item",
			"aria-hidden": "true"
		}, feature.title)) : feature.title), /* @__PURE__ */ __h("span", {
			className: `feature-desc ${isDescMarquee ? "is-marquee" : ""}`,
			title: feature.desc
		}, isDescMarquee ? /* @__PURE__ */ __h("span", {
			className: "marquee-track",
			style: { animationDuration: `${marqueeState.descDuration}s` }
		}, /* @__PURE__ */ __h("span", { className: "marquee-item" }, feature.desc), /* @__PURE__ */ __h("span", {
			className: "marquee-item",
			"aria-hidden": "true"
		}, feature.desc)) : feature.desc)));
	}))), /* @__PURE__ */ __h("div", { className: "banner-stores-col" }, /* @__PURE__ */ __h("a", {
		href: "https://apps.apple.com",
		target: "_blank",
		rel: "noopener noreferrer",
		className: "store-btn apple-btn",
		"aria-label": "Download Süfrano App on App Store"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		className: "store-icon",
		fill: "currentColor"
	}, /* @__PURE__ */ __h("path", { d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.03-.49 2.65-1.24z" })), /* @__PURE__ */ __h("div", { className: "store-text" }, /* @__PURE__ */ __h("span", { className: "store-sub" }, content.appStore.subtitle), /* @__PURE__ */ __h("span", { className: "store-name" }, content.appStore.title))), /* @__PURE__ */ __h("a", {
		href: "https://play.google.com",
		target: "_blank",
		rel: "noopener noreferrer",
		className: "store-btn google-btn",
		"aria-label": "Download Süfrano App on Google Play"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		className: "store-icon",
		fill: "currentColor"
	}, /* @__PURE__ */ __h("path", { d: "M3.609 1.814L13.793 12 3.61 22.186c-.365-.32-.61-.795-.61-1.35V3.164c0-.555.245-1.03.61-1.35zm11.242 11.244l2.128 2.127-11.83 6.786 9.702-8.913zm0-2.116L4.747 2.03l11.83 6.784-2.126 2.128zm1.06 1.058l3.15 1.807c.883.506.883 1.332 0 1.838l-3.15 1.808-1.92-1.92 1.92-1.733z" })), /* @__PURE__ */ __h("div", { className: "store-text" }, /* @__PURE__ */ __h("span", { className: "store-sub" }, content.googlePlay.subtitle), /* @__PURE__ */ __h("span", { className: "store-name" }, content.googlePlay.title)))))));
};
export default AppDownloadBanner;
