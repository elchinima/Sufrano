import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useRef, useEffect, useState, useCallback } from "../../../utils/runtime.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import { Link, useNavigate } from "../../../utils/router.js";
import { useAuth } from "../../../context/AuthContext.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useLang } from "../../../utils/useLang.js";
import { getFortuneTranslation } from "./Lang.js";
import { formatPromoPrizeTitle, formatPromoPrizeDescription } from "../Promos/Lang.js";
import Footer from "../../Footer/Footer.js";
import Navbar from "../../Elements/Navbar.js";
const partyPopperIcon = "/assets/icons/party-popper-animated.svg";
const smileyIcon = "/assets/icons/smiley-animated.svg";
const loaderIcon = "/assets/icons/loader-animated.svg";
const superPrizeIcon = "/assets/icons/super-prize.svg";
const freeDrinkIcon = "/assets/icons/free-drink.svg";
const freeDessertIcon = "/assets/icons/free-dessert.svg";
const discount15Icon = "/assets/icons/discount-15.svg";
const cashbackIcon = "/assets/icons/cashback.svg";
const discount25Icon = "/assets/icons/discount-50.svg";

const SEGMENTS = [
	{
		label: "SUPER PRIZE",
		icon: superPrizeIcon,
		prize: "30 AZN discount on orders of 100 AZN or more!"
	},
	{
		label: "FREE DRINK",
		icon: freeDrinkIcon,
		prize: "One free drink on orders with at least 10 AZN to pay!"
	},
	{
		label: "FREE DESSERT",
		icon: freeDessertIcon,
		prize: "One free dessert on orders with at least 10 AZN to pay!"
	},
	{
		label: "DISCOUNT UP TO 15%",
		icon: discount15Icon,
		prize: "15% discount (max 15 AZN) on orders of 50 AZN or more!"
	},
	{
		label: "CASHBACK ON PURCHASES",
		icon: cashbackIcon,
		prize: "Cashback on your next order!"
	},
	{
		label: "DISCOUNT UP TO 25%",
		icon: discount25Icon,
		prize: "25% discount (max 25 AZN) on orders of 50 AZN or more!"
	}
];
const NUM_SEGMENTS = SEGMENTS.length;
const ARC = 2 * Math.PI / NUM_SEGMENTS;
const RIM_PEGS = Array.from({ length: 12 }, (_, i) => i * 30);
const Fortune = () => {
	const navigate = useNavigate();
	const wheelRef = useRef(null);
	const rafRef = useRef(null);
	const rotationRef = useRef(0);
	const { user } = useAuth();
	const lang = useLang();
	const t = (k, params) => getFortuneTranslation(lang, k, params);
	const [spinning, setSpinning] = useState(false);
	const [canSpin, setCanSpin] = useState(false);
	const [cooldownEndsAt, setCooldownEndsAt] = useState(null);
	const [timeLeftStr, setTimeLeftStr] = useState("");
	const [promoChecked, setPromoChecked] = useState(false);
	const [prize, setPrize] = useState(null);
	const [showPrize, setShowPrize] = useState(false);
	const [serverPromo, setServerPromo] = useState(null);
	const [promoLoading, setPromoLoading] = useState(false);
	const [copiedCode, setCopiedCode] = useState(false);
	const handleCopyCode = useCallback((code) => {
		if (!code || !navigator?.clipboard) return;
		navigator.clipboard.writeText(code).then(() => {
			setCopiedCode(true);
			setTimeout(() => setCopiedCode(false), 2e3);
		}).catch(() => {});
	}, []);
	useEffect(() => {
		if (!user) return;
		const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
		fetchWithRefresh(`${apiUrl}/api/auth/promo`).then((r) => r.json()).then((data) => {
			if (data.hasPromo) {
				setServerPromo(data);
				setCanSpin(Boolean(data.canSpin));
				if (data.cooldownEndsAt) {
					setCooldownEndsAt(data.cooldownEndsAt);
				}
			} else {
				setCanSpin(true);
				setCooldownEndsAt(null);
			}
		}).catch(() => {
			setCanSpin(true);
		}).finally(() => {
			setPromoChecked(true);
		});
	}, [user]);
	useEffect(() => {
		if (canSpin || !cooldownEndsAt) {
			setTimeLeftStr("");
			return;
		}
		const updateTimer = () => {
			const now = new Date().getTime();
			const target = new Date(cooldownEndsAt).getTime();
			const diff = target - now;
			if (diff <= 0) {
				setCanSpin(true);
				setTimeLeftStr("");
				return;
			}
			const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
			const hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
			const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
			const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
			if (days > 0) {
				const dStr = t("time_days");
				const hStr = t("time_hours");
				const mStr = t("time_minutes");
				const sStr = t("time_seconds");
				setTimeLeftStr(`${days}${dStr} ${hours}${hStr} ${minutes}${mStr} ${seconds}${sStr}`);
			} else {
				setTimeLeftStr(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
			}
		};
		updateTimer();
		const interval = setInterval(updateTimer, 1e3);
		return () => clearInterval(interval);
	}, [canSpin, cooldownEndsAt]);
	const drawFrame = useCallback(() => {
		if (wheelRef.current) {
			wheelRef.current.style.transform = `rotate(${rotationRef.current}rad)`;
		}
	}, []);
	useEffect(() => {
		drawFrame();
	}, [drawFrame]);
	const spin = useCallback(async () => {
		if (spinning || !canSpin) return;
		setSpinning(true);
		setCanSpin(false);
		setPrize(null);
		setShowPrize(false);
		const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
		let serverResult = null;
		try {
			const res = await fetchWithRefresh(`${apiUrl}/api/auth/promo`, { method: "POST" });
			if (res.ok) {
				serverResult = await res.json();
			}
		} catch (_) {}
		if (!serverResult) {
			setSpinning(false);
			setCanSpin(true);
			return;
		}
		const winIdx = serverResult.segmentIndex;
		const seg = {
			label: serverResult.prizeName,
			prize: serverResult.prizeDescription,
			promoCode: serverResult.promoCode,
			barCode: serverResult.barCode,
			expiresAt: serverResult.expiresAt,
			cashbackPercent: serverResult.cashbackPercent
		};
		const jitter = (Math.random() - .5) * (ARC * .4);
		const targetAngle = -winIdx * ARC + jitter;
		const normalizedTarget = (targetAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
		let phase = "accelerating";
		let currentSpeed = 0;
		const maxSpeed = .015;
		const accel = 2e-5;
		const minSpinMs = 3e3 + Math.random() * 1e3;
		const startTime = performance.now();
		let decelStartTime = 0;
		let decelStartRotation = 0;
		let decelTotalDistance = 0;
		let decelDuration = 0;
		let lastTime = performance.now();
		const animate = (now) => {
			const dt = Math.min(now - lastTime, 50);
			lastTime = now;
			if (phase === "accelerating") {
				currentSpeed += accel * dt;
				if (currentSpeed >= maxSpeed) {
					currentSpeed = maxSpeed;
					phase = "spinning";
				}
				rotationRef.current += currentSpeed * dt;
			} else if (phase === "spinning") {
				rotationRef.current += currentSpeed * dt;
				if (now - startTime >= minSpinMs) {
					phase = "decelerating";
					decelStartTime = now;
					decelStartRotation = rotationRef.current;
					const baseDistance = currentSpeed * 3e3 / 3;
					const targetRot = decelStartRotation + baseDistance;
					const remainder = targetRot % (2 * Math.PI);
					let extraRot = normalizedTarget - remainder;
					if (extraRot < 0) extraRot += 2 * Math.PI;
					decelTotalDistance = baseDistance + extraRot;
					decelDuration = 3 * decelTotalDistance / currentSpeed;
				}
			} else if (phase === "decelerating") {
				const elapsed = now - decelStartTime;
				const t = Math.min(elapsed / decelDuration, 1);
				const easeOut = 1 - Math.pow(1 - t, 3);
				rotationRef.current = decelStartRotation + decelTotalDistance * easeOut;
				if (t >= 1) {
					setSpinning(false);
					setCanSpin(false);
					setPrize(seg);
					setServerPromo({
						promoCode: seg.promoCode,
						barCode: seg.barCode,
						expiresAt: seg.expiresAt,
						prizeName: seg.label,
						prizeDescription: seg.prize,
						isActive: true
					});
					setCooldownEndsAt(serverResult.cooldownEndsAt || seg.expiresAt);
					setShowPrize(true);
					drawFrame();
					return;
				}
			}
			drawFrame();
			rafRef.current = requestAnimationFrame(animate);
		};
		rafRef.current = requestAnimationFrame(animate);
	}, [
		spinning,
		canSpin,
		drawFrame
	]);
	useEffect(() => {
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);
	return /* @__PURE__ */ __h(motion.div, {
		className: "fortune-page",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .3 }
	}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "fortune-main" }, /* @__PURE__ */ __h("div", { className: "fortune-content-wrapper" }, /* @__PURE__ */ __h(motion.div, {
		className: "fortune-hero-text",
		initial: {
			opacity: 0,
			y: 30
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: .1,
			duration: .6,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	}, /* @__PURE__ */ __h("h1", null, user?.name ? t("hey_user", { name: user.name }) : t("hero_title")), /* @__PURE__ */ __h("p", null, t("hero_desc"))), /* @__PURE__ */ __h(motion.div, {
		className: "fortune-wheel-area",
		initial: {
			opacity: 0,
			scale: .85
		},
		animate: {
			opacity: 1,
			scale: 1
		},
		transition: {
			delay: .25,
			duration: .65,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	}, /* @__PURE__ */ __h("div", { className: `fortune-wheel-wrap${spinning ? " fortune-wheel-wrap--spinning" : ""}${canSpin && !spinning && promoChecked ? " fortune-wheel-wrap--ready" : ""}` }, /* @__PURE__ */ __h("div", {
		className: "fortune-wheel-halo",
		"aria-hidden": "true"
	}), /* @__PURE__ */ __h("div", {
		className: "fortune-pointer",
		"aria-hidden": "true"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 48 58",
		xmlns: "http://www.w3.org/2000/svg"
	}, /* @__PURE__ */ __h("defs", null, /* @__PURE__ */ __h("linearGradient", {
		id: "ptrGoldLeft",
		x1: "0%",
		y1: "0%",
		x2: "100%",
		y2: "100%"
	}, /* @__PURE__ */ __h("stop", {
		offset: "0%",
		stopColor: "#f7e7c4"
	}), /* @__PURE__ */ __h("stop", {
		offset: "100%",
		stopColor: "#c5a059"
	})), /* @__PURE__ */ __h("linearGradient", {
		id: "ptrGoldRight",
		x1: "0%",
		y1: "0%",
		x2: "100%",
		y2: "100%"
	}, /* @__PURE__ */ __h("stop", {
		offset: "0%",
		stopColor: "#d4b26f"
	}), /* @__PURE__ */ __h("stop", {
		offset: "100%",
		stopColor: "#8a6623"
	}))), /* @__PURE__ */ __h("polygon", {
		points: "24,55 5,12 24,18",
		fill: "url(#ptrGoldLeft)"
	}), /* @__PURE__ */ __h("polygon", {
		points: "24,55 43,12 24,18",
		fill: "url(#ptrGoldRight)"
	}), /* @__PURE__ */ __h("polygon", {
		points: "24,55 5,12 24,6 43,12",
		fill: "none",
		stroke: "#f3dfb6",
		strokeWidth: "1.4",
		strokeLinejoin: "round"
	}), /* @__PURE__ */ __h("circle", {
		cx: "24",
		cy: "13",
		r: "9",
		fill: "#4a070c",
		stroke: "#dfc288",
		strokeWidth: "2.2"
	}), /* @__PURE__ */ __h("circle", {
		cx: "24",
		cy: "13",
		r: "4",
		fill: "#dfc288"
	}))), /* @__PURE__ */ __h("div", {
		ref: wheelRef,
		className: "fortune-wheel",
		role: "img",
		"aria-label": "Wheel of Fortune",
		onClick: canSpin && !spinning && promoChecked ? spin : void 0
	}, /* @__PURE__ */ __h("div", {
		className: "fortune-wheel__pegs",
		"aria-hidden": "true"
	}, RIM_PEGS.map((deg, idx) => /* @__PURE__ */ __h("span", {
		key: deg,
		className: `fortune-wheel__peg${idx % 2 === 1 ? " fortune-wheel__peg--major" : ""}`,
		style: { "--peg-angle": `${deg}deg` }
	}))), /* @__PURE__ */ __h("div", { className: "fortune-wheel__disc" }, /* @__PURE__ */ __h("div", {
		className: "fortune-wheel__spokes",
		"aria-hidden": "true"
	}, /* @__PURE__ */ __h("span", { className: "fortune-wheel__spoke fortune-wheel__spoke--1" }), /* @__PURE__ */ __h("span", { className: "fortune-wheel__spoke fortune-wheel__spoke--2" }), /* @__PURE__ */ __h("span", { className: "fortune-wheel__spoke fortune-wheel__spoke--3" })), SEGMENTS.map((seg, idx) => /* @__PURE__ */ __h("div", {
		key: idx,
		className: "fortune-wheel__segment",
		style: { "--seg-angle": `${idx * 60}deg` }
	}, /* @__PURE__ */ __h("div", { className: "fortune-wheel__segment-content" }, /* @__PURE__ */ __h("div", {
		className: "fortune-wheel__icon-badge"
	}, /* @__PURE__ */ __h("img", {
		src: seg.icon,
		alt: seg.label,
		className: "fortune-wheel__icon",
		draggable: false
	})))))), /* @__PURE__ */ __h("div", {
		className: "fortune-wheel__center-hub",
		"aria-hidden": "true"
	}, /* @__PURE__ */ __h("span", { className: "fortune-wheel__center-cap" }, /* @__PURE__ */ __h("span", { className: "fortune-wheel__center-core" })))))), /* @__PURE__ */ __h(motion.button, {
		className: `cta-btn fortune-spin-btn lg${spinning ? " fortune-spin-btn--spinning" : ""}${!canSpin && !spinning && promoChecked ? " fortune-spin-btn--used" : ""}`,
		onClick: spin,
		disabled: spinning || !canSpin || !promoChecked,
		whileHover: canSpin && !spinning && promoChecked ? {
			scale: 1.04,
			y: -2
		} : {},
		whileTap: canSpin && !spinning && promoChecked ? { scale: .97 } : {}
	}, spinning ? /* @__PURE__ */ __h("span", { className: "fortune-spin-btn__inner" }, /* @__PURE__ */ __h("span", { className: "fortune-spin-dot" }), t("btn_spinning")) : !promoChecked ? /* @__PURE__ */ __h("span", { className: "fortune-spin-btn__inner" }, /* @__PURE__ */ __h("span", { className: "fortune-spin-dot" }), t("btn_loading")) : !canSpin ? timeLeftStr || (serverPromo?.isActive ? t("btn_cooldown_active") : t("btn_cooldown_weekly")) : t("btn_spin")), !canSpin && !spinning && promoChecked && /* @__PURE__ */ __h(motion.div, {
		className: "fortune-cooldown-box",
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { delay: .2 }
	}, /* @__PURE__ */ __h("p", { className: "fortune-note" }, serverPromo?.isActive ? t("note_active_promo") : t("note_already_spun")), serverPromo?.isActive && serverPromo?.promoCode && /* @__PURE__ */ __h("div", { className: "fortune-active-promo-pill" }, /* @__PURE__ */ __h("span", { className: "fortune-active-promo-pill__code" }, serverPromo.promoCode), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "fortune-active-promo-pill__copy",
		onClick: () => handleCopyCode(serverPromo.promoCode)
	}, copiedCode ? t("btn_copied") : t("btn_copy")))))), /* @__PURE__ */ __h(Footer, null), /* @__PURE__ */ __h(AnimatePresence, null, showPrize && prize && /* @__PURE__ */ __h(motion.div, {
		className: "fortune-prize-overlay",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		onClick: () => setShowPrize(false)
	}, /* @__PURE__ */ __h(motion.div, {
		className: "fortune-prize-modal",
		initial: {
			scale: .6,
			opacity: 0,
			y: 40
		},
		animate: {
			scale: 1,
			opacity: 1,
			y: 0
		},
		exit: {
			scale: .88,
			opacity: 0,
			y: 20
		},
		transition: {
			duration: .45,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		onClick: (e) => e.stopPropagation()
	}, prize.prize ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", { className: "prize-emoji" }, /* @__PURE__ */ __h("img", {
		src: partyPopperIcon,
		alt: "Party Popper",
		style: {
			width: "70px",
			height: "70px"
		}
	})), /* @__PURE__ */ __h("h2", { className: "prize-heading" }, t("prize_congratulations")), /* @__PURE__ */ __h("p", { className: "prize-label" }, formatPromoPrizeTitle(serverPromo || prize, lang)), /* @__PURE__ */ __h("p", { className: "prize-desc" }, formatPromoPrizeDescription(serverPromo || prize, lang)), promoLoading ? /* @__PURE__ */ __h("div", { style: {
		display: "flex",
		justifyContent: "center",
		margin: "12px 0"
	} }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading...",
		style: {
			width: "32px",
			height: "32px"
		}
	})) : serverPromo?.promoCode ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("p", { className: "prize-code-label" }, t("prize_your_code")), /* @__PURE__ */ __h("div", {
		className: "prize-code",
		onClick: () => handleCopyCode(serverPromo.promoCode),
		title: t("prize_copy_tooltip")
	}, serverPromo.promoCode, /* @__PURE__ */ __h("span", { className: "prize-code__badge" }, copiedCode ? t("btn_copied") : t("btn_copy"))), serverPromo.expiresAt && /* @__PURE__ */ __h("p", {
		className: "prize-code-label",
		style: {
			marginTop: "6px",
			fontSize: "0.75rem",
			opacity: .6
		}
	}, t("prize_valid_until"), new Date(serverPromo.expiresAt).toLocaleDateString(lang === "ru" ? "ru-RU" : lang === "az" ? "az-AZ" : "en-US")), /* @__PURE__ */ __h(Link, {
		to: "/promos",
		className: "cta-btn primary prize-view-promos-btn",
		style: {
			width: "100%",
			marginTop: "16px",
			marginBottom: "10px",
			display: "inline-block",
			textAlign: "center"
		}
	}, t("prize_btn_view_promos"))) : null) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", { className: "prize-emoji" }, /* @__PURE__ */ __h("img", {
		src: smileyIcon,
		alt: "Smiley",
		style: {
			width: "70px",
			height: "70px"
		}
	})), /* @__PURE__ */ __h("h2", { className: "prize-heading" }, t("prize_fallback_heading")), /* @__PURE__ */ __h("p", { className: "prize-desc" }, t("prize_fallback_desc"))), /* @__PURE__ */ __h("button", {
		className: "cta-btn secondary prize-close-btn",
		onClick: () => setShowPrize(false)
	}, t("prize_btn_close"))))));
};
export default Fortune;
