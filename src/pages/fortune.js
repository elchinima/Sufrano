(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/UserPages/Fortune/Fortune.js
	__define("components/UserPages/Fortune/Fortune.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useRef, useEffect, useState, useCallback } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { Link, useNavigate } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const __imp_1 = __require("components/Footer/Footer.js");
		const Footer = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const partyPopperIcon = "/assets/icons/party-popper-animated.svg";
		const smileyIcon = "/assets/icons/smiley-animated.svg";
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const fortuneImg = "/assets/images/fortune_image_low.png";
		const SEGMENTS = [
			{
				label: "SUPER PRIZE",
				prize: "Super prize: Special exclusive Süfrano gift!"
			},
			{
				label: "FREE DRINK",
				prize: "One free drink of your choice!"
			},
			{
				label: "FREE DESSERT",
				prize: "One free dessert with your next order!"
			},
			{
				label: "DISCOUNT UP TO 25%",
				prize: "25% discount on your next order!"
			},
			{
				label: "CASHBACK ON PURCHASES",
				prize: "Cashback on your next coffee purchase!"
			},
			{
				label: "DISCOUNT UP TO 50%",
				prize: "50% discount on your next order!"
			}
		];
		const NUM_SEGMENTS = SEGMENTS.length;
		const ARC = 2 * Math.PI / NUM_SEGMENTS;
		function drawWheel(canvas, rotation, image) {
			const ctx = canvas.getContext("2d");
			const W = canvas.width;
			const H = canvas.height;
			const cx = W / 2;
			const cy = H / 2;
			ctx.clearRect(0, 0, W, H);
			if (!image) return;
			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate(rotation);
			ctx.drawImage(image, -cx, -cy, W, H);
			ctx.restore();
		}
		const Fortune = () => {
			const navigate = useNavigate();
			const canvasRef = useRef(null);
			const rafRef = useRef(null);
			const rotationRef = useRef(0);
			const imageRef = useRef(null);
			const { user } = useAuth();
			const [spinning, setSpinning] = useState(false);
			const [canSpin, setCanSpin] = useState(false);
			const [cooldownEndsAt, setCooldownEndsAt] = useState(null);
			const [timeLeftStr, setTimeLeftStr] = useState("");
			const [promoChecked, setPromoChecked] = useState(false);
			const [prize, setPrize] = useState(null);
			const [showPrize, setShowPrize] = useState(false);
			const [serverPromo, setServerPromo] = useState(null);
			const [promoLoading, setPromoLoading] = useState(false);
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
						setTimeLeftStr(`${days}d ${hours}h ${minutes}m ${seconds}s`);
					} else {
						setTimeLeftStr(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
					}
				};
				updateTimer();
				const interval = setInterval(updateTimer, 1e3);
				return () => clearInterval(interval);
			}, [canSpin, cooldownEndsAt]);
			const drawFrame = useCallback(() => {
				if (canvasRef.current) {
					drawWheel(canvasRef.current, rotationRef.current, imageRef.current);
				}
			}, []);
			useEffect(() => {
				const img = new Image();
				img.src = fortuneImg;
				img.onload = () => {
					imageRef.current = img;
					drawFrame();
				};
				if (img.complete) {
					imageRef.current = img;
					drawFrame();
				}
			}, [drawFrame]);
			useEffect(() => {
				const canvas = canvasRef.current;
				if (!canvas) return;
				const resize = () => {
					const size = Math.min(canvas.parentElement?.clientWidth ?? 436, 436);
					const dpr = window.devicePixelRatio || 1;
					canvas.width = size * dpr;
					canvas.height = size * dpr;
					canvas.style.width = `${size}px`;
					canvas.style.height = `${size}px`;
					drawFrame();
				};
				resize();
				window.addEventListener("resize", resize);
				return () => window.removeEventListener("resize", resize);
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
			}, /* @__PURE__ */ __h("h1", null, user?.name ? `Hey, ${user.name}!` : "🎡 Wheel of Fortune"), /* @__PURE__ */ __h("p", null, "Spin the wheel and win an exclusive Süfrano reward!")), /* @__PURE__ */ __h(motion.div, {
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
			}, /* @__PURE__ */ __h("div", { className: "fortune-wheel-wrap" }, /* @__PURE__ */ __h("div", {
				className: "fortune-pointer",
				"aria-hidden": "true"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 36 44",
				xmlns: "http://www.w3.org/2000/svg"
			}, /* @__PURE__ */ __h("polygon", {
				points: "18,42 1,5 35,5",
				fill: "#c5a059",
				stroke: "#dfc288",
				strokeWidth: "1.5"
			}), /* @__PURE__ */ __h("circle", {
				cx: "18",
				cy: "8",
				r: "4.5",
				fill: "#24050d"
			}))), /* @__PURE__ */ __h("canvas", {
				ref: canvasRef,
				className: "fortune-canvas"
			})), /* @__PURE__ */ __h(motion.button, {
				className: `cta-btn fortune-spin-btn lg${spinning ? " fortune-spin-btn--spinning" : ""}${!canSpin && !spinning && promoChecked ? " fortune-spin-btn--used" : ""}`,
				onClick: spin,
				disabled: spinning || !canSpin || !promoChecked,
				whileHover: canSpin && !spinning && promoChecked ? {
					scale: 1.04,
					y: -2
				} : {},
				whileTap: canSpin && !spinning && promoChecked ? { scale: .97 } : {}
			}, spinning ? /* @__PURE__ */ __h("span", { className: "fortune-spin-btn__inner" }, /* @__PURE__ */ __h("span", { className: "fortune-spin-dot" }), "Spinning...") : !promoChecked ? /* @__PURE__ */ __h("span", { className: "fortune-spin-btn__inner" }, /* @__PURE__ */ __h("span", { className: "fortune-spin-dot" }), "Loading...") : !canSpin ? timeLeftStr || (serverPromo?.isActive ? "Promo already active!" : "1 spin per week") : "Spin the Wheel!"), !canSpin && !spinning && promoChecked && /* @__PURE__ */ __h(motion.div, {
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
			}, /* @__PURE__ */ __h("p", { className: "fortune-note" }, serverPromo?.isActive ? "You have an active promo code ✨" : "You have already spun the wheel this week."))))), /* @__PURE__ */ __h(Footer, null), /* @__PURE__ */ __h(AnimatePresence, null, showPrize && prize && /* @__PURE__ */ __h(motion.div, {
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
			})), /* @__PURE__ */ __h("h2", { className: "prize-heading" }, "Congratulations!"), /* @__PURE__ */ __h("p", { className: "prize-label" }, prize.label), /* @__PURE__ */ __h("p", { className: "prize-desc" }, prize.prize), promoLoading ? /* @__PURE__ */ __h("div", { style: {
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
			})) : serverPromo?.promoCode ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("p", { className: "prize-code-label" }, "Your promo code"), /* @__PURE__ */ __h("div", { className: "prize-code" }, serverPromo.promoCode), serverPromo.expiresAt && /* @__PURE__ */ __h("p", {
				className: "prize-code-label",
				style: {
					marginTop: "6px",
					fontSize: "0.75rem",
					opacity: .6
				}
			}, "Valid until ", new Date(serverPromo.expiresAt).toLocaleDateString())) : null) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", { className: "prize-emoji" }, /* @__PURE__ */ __h("img", {
				src: smileyIcon,
				alt: "Smiley",
				style: {
					width: "70px",
					height: "70px"
				}
			})), /* @__PURE__ */ __h("h2", { className: "prize-heading" }, "Better luck next time!"), /* @__PURE__ */ __h("p", { className: "prize-desc" }, "Don't worry — there's always tomorrow's spin!")), /* @__PURE__ */ __h("button", {
				className: "cta-btn secondary prize-close-btn",
				onClick: () => setShowPrize(false)
			}, "Close")))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Fortune; } });
	});
	//#endregion

	var entryExports = __require("components/UserPages/Fortune/Fortune.js");
	__pages["fortune"] = entryExports.default || entryExports;
})();
