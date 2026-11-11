(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region utils/code128.js
	__define("utils/code128.js", function (exports, __require, module) {
		const CODE128_PATTERNS = [
			"11011001100",
			"11001101100",
			"11001100110",
			"10010011000",
			"10010001100",
			"10001001100",
			"10011001000",
			"10011000100",
			"10001100100",
			"11001001000",
			"11001000100",
			"11000100100",
			"10110011100",
			"10011011100",
			"10011001110",
			"10111001100",
			"10011101100",
			"10011100110",
			"11001110010",
			"11001011100",
			"11001001110",
			"11011100100",
			"11001110100",
			"11101101110",
			"11101001100",
			"11100101100",
			"11100100110",
			"11101100100",
			"11100110100",
			"11100110010",
			"11011011000",
			"11011000110",
			"11000110110",
			"10100011000",
			"10001011000",
			"10001000110",
			"10110001000",
			"10001101000",
			"10001100010",
			"11010001000",
			"11000101000",
			"11000100010",
			"10110111000",
			"10110001110",
			"10001101110",
			"10111011000",
			"10111000110",
			"10001110110",
			"11101110110",
			"11010001110",
			"11000101110",
			"11011101000",
			"11011100010",
			"11011101110",
			"11101011000",
			"11101000110",
			"11100010110",
			"11101101000",
			"11101100010",
			"11100011010",
			"11101111010",
			"11001000010",
			"11110001010",
			"10100110000",
			"10100001100",
			"10010110000",
			"10010000110",
			"10000101100",
			"10000100110",
			"10110010000",
			"10110000100",
			"10011010000",
			"10011000010",
			"10000110100",
			"10000110010",
			"11000010010",
			"11001010000",
			"11110111010",
			"11000010100",
			"10001111010",
			"10100111100",
			"10010111100",
			"10010011110",
			"10111100100",
			"10011110100",
			"10011110010",
			"11110100100",
			"11110010100",
			"11110010010",
			"11011011110",
			"11011110110",
			"11110110110",
			"10101111000",
			"10100011110",
			"10001011110",
			"10111101000",
			"10111100010",
			"11110101000",
			"11110100010",
			"10111011110",
			"10111101110",
			"11101011110",
			"11110101110",
			"11010000100",
			"11010010000",
			"11010011100",
			"1100011101011"
		];
		const START_B = 104;
		const STOP = 106;
		function encodeCode128(text) {
			if (!text) return "";
			const cleanText = String(text);
			const codes = [START_B];
			for (let i = 0; i < cleanText.length; i++) {
				const code = cleanText.charCodeAt(i) - 32;
				if (code >= 0 && code <= 95) {
					codes.push(code);
				}
			}
			let checksum = codes[0];
			for (let i = 1; i < codes.length; i++) {
				checksum += codes[i] * i;
			}
			checksum %= 103;
			codes.push(checksum);
			codes.push(STOP);
			return codes.map((c) => CODE128_PATTERNS[c] || "").join("");
		}

		Object.defineProperty(exports, "encodeCode128", { enumerable: true, get: function () { return encodeCode128; } });
	});
	//#endregion

	//#region components/UserPages/Promos/Lang.js
	__define("components/UserPages/Promos/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"promos_hero_title": "Мои промокоды",
				"promos_hero_desc": "Ваши эксклюзивные награды, скидки и бонусы за вращение Колеса Фортуны",
				"promos_badge_redeem": "Активация",
				"promos_card_title": "Есть промокод?",
				"promos_card_desc": "Введите промокод или подарочный код для получения скидки или подарка.",
				"promos_input_placeholder": "Введите код (напр. RED-DISC-7X9K)",
				"promos_btn_activate": "Активировать",
				"promos_btn_activating": "Активация...",
				"promos_activate_success": "Промокод успешно активирован! Теперь вы можете использовать его в заказе.",
				"promos_activate_error": "Не удалось активировать промокод. Пожалуйста, проверьте правильность кода.",
				"promos_activate_network_error": "Ошибка подключения. Пожалуйста, попробуйте снова.",
				"promos_filter_all": "Все",
				"promos_filter_active": "Активные",
				"promos_filter_expired": "Истекшие",
				"promos_loading": "Загрузка ваших промокодов...",
				"promos_try_again": "Попробовать снова",
				"promos_empty_active_title": "Сейчас нет активных промокодов",
				"promos_empty_expired_title": "Нет истекших промокодов",
				"promos_empty_all_title": "У вас пока нет промокодов",
				"promos_empty_active_desc": "Вращайте Колесо Фортуны, чтобы выигрывать бесплатные напитки, десерты и скидки!",
				"promos_empty_all_desc": "Участвуйте в мини-игре Колесо Фортуны и открывайте эксклюзивные бонусы Süfrano.",
				"promos_empty_btn_spin": "Вращать Колесо Фортуны",
				"promos_status_active": "● Активен",
				"promos_status_expired": "Истек / Использован",
				"promos_label_code": "ПРОМОКОД",
				"promos_btn_copy": "Копировать",
				"promos_btn_copied": "Скопировано!",
				"promos_date_activated": "Активирован:",
				"promos_date_expires": "Действует до:",
				"promos_btn_use": "Перейти в меню →"
			},
			en: {
				"promos_hero_title": "My Promo Codes",
				"promos_hero_desc": "Your exclusive rewards, discounts, and wheel spin bonuses",
				"promos_badge_redeem": "Redeem Code",
				"promos_card_title": "Have a Promo Code?",
				"promos_card_desc": "Enter your gift or event promo code to claim your special discount or reward.",
				"promos_input_placeholder": "Enter code (e.g. RED-DISC-7X9K)",
				"promos_btn_activate": "Activate",
				"promos_btn_activating": "Activating...",
				"promos_activate_success": "Promo code successfully activated! You can now use it on your next order.",
				"promos_activate_error": "Failed to activate promo code. Please check the code.",
				"promos_activate_network_error": "Network error occurred. Please try again.",
				"promos_filter_all": "All",
				"promos_filter_active": "Active",
				"promos_filter_expired": "Expired",
				"promos_loading": "Loading your promo codes...",
				"promos_try_again": "Try Again",
				"promos_empty_active_title": "No active promo codes right now",
				"promos_empty_expired_title": "No expired promo codes",
				"promos_empty_all_title": "No promo codes yet",
				"promos_empty_active_desc": "Spin the Wheel of Fortune to win free drinks, desserts, and discounts!",
				"promos_empty_all_desc": "Play the Fortune mini-game to unlock exclusive Süfrano perks and discounts.",
				"promos_empty_btn_spin": "Spin Fortune Wheel",
				"promos_status_active": "● Active",
				"promos_status_expired": "Expired / Used",
				"promos_label_code": "PROMO CODE",
				"promos_btn_copy": "Copy",
				"promos_btn_copied": "Copied!",
				"promos_date_activated": "Activated:",
				"promos_date_expires": "Expires:",
				"promos_btn_use": "Use in Menu →"
			},
			az: {
				"promos_hero_title": "Promokodlarım",
				"promos_hero_desc": "Hədiyyə Çarxından qazandığınız xüsusi mükafatlar, endirimlər və bonuslar",
				"promos_badge_redeem": "Aktivasiya",
				"promos_card_title": "Promokodunuz var?",
				"promos_card_desc": "Xüsusi endirim və ya hədiyyə əldə etmək üçün tədbir və ya hədiyyə promokodunuzu daxil edin.",
				"promos_input_placeholder": "Kodu daxil edin (məs: RED-DISC-7X9K)",
				"promos_btn_activate": "Aktivləşdir",
				"promos_btn_activating": "Aktivləşdirilir...",
				"promos_activate_success": "Promokod uğurla aktivləşdirildi! Növbəti sifarişinizdə istifadə edə bilərsiniz.",
				"promos_activate_error": "Promokodu aktivləşdirmək mümkün olmadı. Kodu yoxlayın.",
				"promos_activate_network_error": "Şəbəkə xətası baş verdi. Zəhmət olmasa yenidən cəhd edin.",
				"promos_filter_all": "Hamısı",
				"promos_filter_active": "Aktiv",
				"promos_filter_expired": "Müddəti bitmiş",
				"promos_loading": "Promokodlarınız yüklənir...",
				"promos_try_again": "Yenidən cəhd edin",
				"promos_empty_active_title": "Hazırda aktiv promokodunuz yoxdur",
				"promos_empty_expired_title": "Müddəti bitmiş promokod yoxdur",
				"promos_empty_all_title": "Hələ ki promokodunuz yoxdur",
				"promos_empty_active_desc": "Pulsuz içkilər, desertlər və endirimlər qazanmaq üçün Hədiyyə Çarxını fırladın!",
				"promos_empty_all_desc": "Eksklüziv Süfrano üstünlüklərini əldə etmək üçün Hədiyyə Çarxını sınayın.",
				"promos_empty_btn_spin": "Hədiyyə Çarxını Fırlat",
				"promos_status_active": "● Aktiv",
				"promos_status_expired": "Bitib / İstifadə olunub",
				"promos_label_code": "PROMOKOD",
				"promos_btn_copy": "Kopyala",
				"promos_btn_copied": "Kopyalandı!",
				"promos_date_activated": "Aktivləşdirilib:",
				"promos_date_expires": "Bitmə vaxtı:",
				"promos_btn_use": "Menyuda istifadə et →"
			}
		};
		const getPromosTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.az || translations.ru;
			return dict[dataId] || translations.en && translations.en[dataId] || dataId;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getPromosTranslation", { enumerable: true, get: function () { return getPromosTranslation; } });
	});
	//#endregion

	//#region components/UserPages/Promos/Promos.js
	__define("components/UserPages/Promos/Promos.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { Link } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { encodeCode128 } = __require("utils/code128.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const __imp_1 = __require("components/Footer/Footer.js");
		const Footer = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const superPrizeIcon = "/assets/icons/super-prize.svg";
		const freeDrinkIcon = "/assets/icons/free-drink.svg";
		const freeDessertIcon = "/assets/icons/free-dessert.svg";
		const discount25Icon = "/assets/icons/discount-25.svg";
		const cashbackIcon = "/assets/icons/cashback.svg";
		const discount50Icon = "/assets/icons/discount-50.svg";
		const defaultGiftIcon = "/assets/icons/gift-animated.svg";
		const ticketAnimatedIcon = "/assets/icons/ticket-animated.svg";
		const fortuneWheelDarkIcon = "/assets/icons/fortune-wheel-dark.svg";
		const { useLang } = __require("utils/useLang.js");
		const { getPromosTranslation } = __require("components/UserPages/Promos/Lang.js");
		const PRIZE_TYPE_ICONS = {
			SuperPrize: superPrizeIcon,
			FreeDrink: freeDrinkIcon,
			FreeDessert: freeDessertIcon,
			Discount25: discount25Icon,
			Discount50: discount50Icon,
			DiscountCustom: discount25Icon,
			CashbackOnPurchases: cashbackIcon
		};
		const formatDate = (dateStr) => {
			if (!dateStr) return "—";
			try {
				const d = new Date(dateStr);
				if (isNaN(d.getTime())) return "—";
				const formatter = new Intl.DateTimeFormat("en-GB", {
					timeZone: "Asia/Baku",
					day: "2-digit",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					hour12: false
				});
				return formatter.format(d);
			} catch {
				return "—";
			}
		};
		const BarcodeVisual = ({ code }) => {
			const binaryString = React.useMemo(() => {
				return encodeCode128(code);
			}, [code]);
			if (!binaryString) return null;
			const quietZone = 10;
			const totalWidth = binaryString.length + quietZone * 2;
			const height = 44;
			return /* @__PURE__ */ __h("div", {
				className: "promo-barcode-wrap",
				title: `Barcode: ${code}`
			}, /* @__PURE__ */ __h("svg", {
				viewBox: `0 0 ${totalWidth} ${height}`,
				className: "promo-barcode-svg",
				preserveAspectRatio: "none"
			}, /* @__PURE__ */ __h("rect", {
				width: totalWidth,
				height,
				fill: "#ffffff"
			}), binaryString.split("").map((bit, idx) => {
				if (bit === "1") {
					return /* @__PURE__ */ __h("rect", {
						key: idx,
						x: quietZone + idx,
						y: 0,
						width: 1,
						height,
						fill: "#000000"
					});
				}
				return null;
			})), /* @__PURE__ */ __h("span", { className: "promo-barcode-number" }, code));
		};
		const Promos = () => {
			const { user } = useAuth();
			const lang = useLang();
			const t = (id) => getPromosTranslation(lang, id);
			const [promos, setPromos] = useState([]);
			const [loading, setLoading] = useState(true);
			const [error, setError] = useState(null);
			const [filter, setFilter] = useState("all");
			const [copiedCode, setCopiedCode] = useState(null);
			const [inputCode, setInputCode] = useState("");
			const [isActivating, setIsActivating] = useState(false);
			const [activationMessage, setActivationMessage] = useState(null);
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const fetchPromos = async () => {
				setLoading(true);
				setError(null);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/auth/promos`);
					if (!res.ok) {
						throw new Error("Failed to load promo codes");
					}
					const data = await res.json();
					setPromos(Array.isArray(data) ? data : []);
				} catch (err) {
					setError(err.message || "Error loading promos");
				} finally {
					setLoading(false);
				}
			};
			useEffect(() => {
				if (user) {
					fetchPromos();
				}
			}, [user]);
			useEffect(() => {
				if (activationMessage) {
					const timer = setTimeout(() => {
						setActivationMessage(null);
					}, 5e3);
					return () => clearTimeout(timer);
				}
			}, [activationMessage]);
			const handleCopy = (code) => {
				if (!code) return;
				navigator.clipboard.writeText(code);
				setCopiedCode(code);
				setTimeout(() => {
					setCopiedCode(null);
				}, 2e3);
			};
			const handleActivatePromo = async (e) => {
				e.preventDefault();
				if (!inputCode.trim()) return;
				setIsActivating(true);
				setActivationMessage(null);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/auth/promos/activate`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ promoCode: inputCode.trim() })
					});
					const data = await res.json().catch(() => ({}));
					if (!res.ok) {
						setActivationMessage({
							type: "error",
							text: data.message || t("promos_activate_error")
						});
						return;
					}
					setActivationMessage({
						type: "success",
						text: data.message || t("promos_activate_success")
					});
					setInputCode("");
					fetchPromos();
				} catch (err) {
					setActivationMessage({
						type: "error",
						text: err.message || t("promos_activate_network_error")
					});
				} finally {
					setIsActivating(false);
				}
			};
			const filteredPromos = promos.filter((p) => {
				if (filter === "active") return p.isActive;
				if (filter === "expired") return !p.isActive || p.isExpired;
				return true;
			});
			const activeCount = promos.filter((p) => p.isActive).length;
			const expiredCount = promos.filter((p) => !p.isActive || p.isExpired).length;
			return /* @__PURE__ */ __h(motion.div, {
				className: "promos-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "promos-main" }, /* @__PURE__ */ __h("div", { className: "promos-container" }, /* @__PURE__ */ __h(motion.div, {
				className: "promos-hero-text",
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
					ease: [
						.16,
						1,
						.3,
						1
					]
				}
			}, /* @__PURE__ */ __h("h1", null, t("promos_hero_title")), /* @__PURE__ */ __h("p", { className: "promos-hero-desc" }, t("promos_hero_desc"))), /* @__PURE__ */ __h(motion.div, {
				className: "promos-activate-card",
				initial: {
					opacity: 0,
					y: 15
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .4,
					delay: .1
				}
			}, /* @__PURE__ */ __h("div", { className: "promos-activate-card__content" }, /* @__PURE__ */ __h("div", { className: "promos-activate-card__text" }, /* @__PURE__ */ __h("div", { className: "promos-activate-card__badge" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "14",
				height: "14",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5"
			}, /* @__PURE__ */ __h("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })), /* @__PURE__ */ __h("span", null, t("promos_badge_redeem"))), /* @__PURE__ */ __h("h3", null, t("promos_card_title")), /* @__PURE__ */ __h("p", null, t("promos_card_desc"))), /* @__PURE__ */ __h("form", {
				onSubmit: handleActivatePromo,
				className: "promos-activate-card__form"
			}, /* @__PURE__ */ __h("div", { className: "promos-activate-card__input-wrap" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "18",
				height: "18",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				className: "input-icon"
			}, /* @__PURE__ */ __h("path", { d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" }), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "9",
				x2: "12",
				y2: "15"
			})), /* @__PURE__ */ __h("input", {
				type: "text",
				placeholder: t("promos_input_placeholder"),
				value: inputCode,
				onChange: (e) => setInputCode(e.target.value.toUpperCase().replace(/\s+/g, "")),
				disabled: isActivating,
				maxLength: 32
			}), inputCode && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "input-clear-btn",
				onClick: () => setInputCode(""),
				"aria-label": "Clear code"
			}, "✕")), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "promos-activate-card__btn",
				disabled: isActivating || !inputCode.trim()
			}, isActivating ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "",
				className: "spinner-inline"
			}), /* @__PURE__ */ __h("span", null, t("promos_btn_activating"))) : /* @__PURE__ */ __h("span", null, t("promos_btn_activate"))))), /* @__PURE__ */ __h(AnimatePresence, null, activationMessage && /* @__PURE__ */ __h(motion.div, {
				className: `promos-activate-feedback ${activationMessage.type === "success" ? "promos-activate-feedback--success" : "promos-activate-feedback--error"}`,
				initial: {
					opacity: 0,
					height: 0,
					marginTop: 0
				},
				animate: {
					opacity: 1,
					height: "auto",
					marginTop: 14
				},
				exit: {
					opacity: 0,
					height: 0,
					marginTop: 0
				}
			}, activationMessage.type === "success" ? /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "16",
				height: "16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5"
			}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })) : /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "16",
				height: "16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "8",
				x2: "12",
				y2: "12"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "16",
				x2: "12.01",
				y2: "16"
			})), /* @__PURE__ */ __h("span", null, activationMessage.text), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "close-msg",
				onClick: () => setActivationMessage(null)
			}, "✕")))), /* @__PURE__ */ __h("div", { className: "promos-filters" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: `promos-filter-btn ${filter === "all" ? "active" : ""}`,
				onClick: () => setFilter("all")
			}, t("promos_filter_all"), " (", promos.length, ")"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: `promos-filter-btn ${filter === "active" ? "active" : ""}`,
				onClick: () => setFilter("active")
			}, t("promos_filter_active"), " (", activeCount, ")"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: `promos-filter-btn ${filter === "expired" ? "active" : ""}`,
				onClick: () => setFilter("expired")
			}, t("promos_filter_expired"), " (", expiredCount, ")")), loading ? /* @__PURE__ */ __h("div", { className: "promos-loading-state" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "promos-loader-icon"
			}), /* @__PURE__ */ __h("p", null, t("promos_loading"))) : error ? /* @__PURE__ */ __h("div", { className: "promos-error-state" }, /* @__PURE__ */ __h("p", null, error), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm",
				onClick: fetchPromos
			}, t("promos_try_again"))) : filteredPromos.length === 0 ? /* @__PURE__ */ __h(motion.div, {
				className: "promos-empty-card",
				initial: {
					opacity: 0,
					scale: .95
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				transition: { duration: .4 }
			}, /* @__PURE__ */ __h("div", { className: "promos-empty-icon" }, /* @__PURE__ */ __h("img", {
				src: ticketAnimatedIcon,
				alt: "Promo codes",
				className: "promos-empty-icon-img"
			})), /* @__PURE__ */ __h("h3", null, filter === "active" ? t("promos_empty_active_title") : filter === "expired" ? t("promos_empty_expired_title") : t("promos_empty_all_title")), /* @__PURE__ */ __h("p", null, filter === "active" ? t("promos_empty_active_desc") : t("promos_empty_all_desc")), /* @__PURE__ */ __h(Link, {
				to: "/fortune",
				className: "cta-btn sm promos-empty-btn"
			}, /* @__PURE__ */ __h("img", {
				src: fortuneWheelDarkIcon,
				alt: "",
				className: "promos-empty-btn-icon"
			}), /* @__PURE__ */ __h("span", null, t("promos_empty_btn_spin")))) : /* @__PURE__ */ __h(motion.div, {
				className: "promos-grid",
				layout: true,
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { duration: .4 }
			}, /* @__PURE__ */ __h(AnimatePresence, null, filteredPromos.map((promo, idx) => {
				const icon = PRIZE_TYPE_ICONS[promo.prizeType] || defaultGiftIcon;
				const isCopied = copiedCode === promo.promoCode;
				const isActive = promo.isActive;
				return /* @__PURE__ */ __h(motion.div, {
					key: promo.id || idx,
					className: `promo-ticket-card ${isActive ? "promo-ticket--active" : "promo-ticket--expired"}`,
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						scale: .95
					},
					transition: {
						duration: .35,
						delay: idx * .05
					}
				}, /* @__PURE__ */ __h("div", { className: "promo-ticket__header" }, /* @__PURE__ */ __h("div", { className: "promo-ticket__icon-badge" }, /* @__PURE__ */ __h("img", {
					src: icon,
					alt: promo.prizeName,
					className: "promo-ticket__icon-img"
				})), /* @__PURE__ */ __h("div", { className: "promo-ticket__title-group" }, /* @__PURE__ */ __h("span", { className: `promo-status-badge ${isActive ? "badge-active" : "badge-expired"}` }, isActive ? t("promos_status_active") : t("promos_status_expired")), /* @__PURE__ */ __h("h3", { className: "promo-ticket__name" }, promo.prizeName), /* @__PURE__ */ __h("p", { className: "promo-ticket__desc" }, promo.prizeDescription))), /* @__PURE__ */ __h("div", { className: "promo-ticket__divider" }, /* @__PURE__ */ __h("span", { className: "promo-ticket__notch promo-ticket__notch--left" }), /* @__PURE__ */ __h("span", { className: "promo-ticket__dashed-line" }), /* @__PURE__ */ __h("span", { className: "promo-ticket__notch promo-ticket__notch--right" })), /* @__PURE__ */ __h("div", { className: "promo-ticket__body" }, /* @__PURE__ */ __h("div", { className: "promo-code-box" }, /* @__PURE__ */ __h("div", { className: "promo-code-text-group" }, /* @__PURE__ */ __h("span", { className: "promo-code-label" }, t("promos_label_code")), /* @__PURE__ */ __h("span", { className: "promo-code-value" }, promo.promoCode)), /* @__PURE__ */ __h("button", {
					type: "button",
					className: `promo-copy-btn ${isCopied ? "copied" : ""}`,
					onClick: () => handleCopy(promo.promoCode),
					title: t("promos_btn_copy")
				}, isCopied ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
					width: "14",
					height: "14",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2.5"
				}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, t("promos_btn_copied"))) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
					width: "14",
					height: "14",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("rect", {
					x: "9",
					y: "9",
					width: "13",
					height: "13",
					rx: "2",
					ry: "2"
				}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })), /* @__PURE__ */ __h("span", null, t("promos_btn_copy"))))), promo.barCode && /* @__PURE__ */ __h(BarcodeVisual, { code: promo.barCode }), /* @__PURE__ */ __h("div", { className: "promo-dates-row" }, /* @__PURE__ */ __h("div", { className: "promo-date-item" }, /* @__PURE__ */ __h("span", { className: "promo-date-label" }, t("promos_date_activated")), /* @__PURE__ */ __h("span", { className: "promo-date-val" }, formatDate(promo.activatedAt))), /* @__PURE__ */ __h("div", { className: "promo-date-item" }, /* @__PURE__ */ __h("span", { className: "promo-date-label" }, t("promos_date_expires")), /* @__PURE__ */ __h("span", { className: "promo-date-val" }, formatDate(promo.expiresAt)))), isActive && /* @__PURE__ */ __h("div", { className: "promo-ticket__actions" }, /* @__PURE__ */ __h(Link, {
					to: "/catalog",
					className: "promo-action-btn"
				}, t("promos_btn_use")))));
			}))))), /* @__PURE__ */ __h(Footer, null));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Promos; } });
	});
	//#endregion

	var entryExports = __require("components/UserPages/Promos/Promos.js");
	__pages["promos"] = entryExports.default || entryExports;
})();
