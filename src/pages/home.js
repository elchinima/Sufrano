(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/PublicPages/Home/Lang.js
	__define("components/PublicPages/Home/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"home_hero_title": "Пробудите ваши чувства",
				"home_hero_subtitle_1": "Оцените богатый, насыщенный вкус наших изысканных авторских блюд.",
				"home_hero_subtitle_2": "Создано со страстью, подано с безупречностью.",
				"home_hero_btn": "Смотреть меню",
				"home_feature_1_title": "Изысканная кухня",
				"home_feature_1_desc": "Свежие отборные ингредиенты для незабываемого вкуса.",
				"home_feature_2_title": "Уютная атмосфера",
				"home_feature_2_desc": "Идеальное место для отдыха, работы или встреч с друзьями.",
				"home_feature_3_title": "Экологичность",
				"home_feature_3_desc": "Мы заботимся об экологии и используем перерабатываемую упаковку.",
				"home_favorites_title": "Наши любимые",
				"home_favorites_subtitle": "Попробуйте блюда и напитки, которые наши гости выбирают чаще всего.",
				"home_favorites_badge": "Любимые",
				"home_favorites_empty": "На данный момент нет доступных товаров.",
				"home_favorites_btn": "Всё меню",
				"home_about_title": "Атмосфера Süfrano",
				"home_about_p1": "В Süfrano мы верим, что гастрономия — это не просто еда, а настоящее искусство. Мы тщательно отбираем свежие фермерские ингредиенты, чтобы каждое блюдо было наполнено страстью и заботой.",
				"home_about_p2": "Наши шеф-повара — настоящие мастера своего дела, вкладывающие душу в каждое авторское блюдо. Окунитесь в наш уют и откройте новые грани вкуса.",
				"home_club_title": "Вступайте в Süfrano Club",
				"home_club_desc": "Подпишитесь, чтобы первыми получать эксклюзивные предложения, новости о сезонном меню и секреты шеф-повара прямо на почту.",
				"home_club_placeholder": "Введите ваш email",
				"home_club_btn": "Подписаться",
				"home_club_btn_loading": "Отправка...",
				"home_modal_sub_title": "Подтверждение подписки",
				"home_modal_sub_desc": "Мы отправили 4-значный код на",
				"home_modal_sub_confirm_btn": "Подтвердить",
				"home_modal_sub_resend_btn": "Отправить снова",
				"home_modal_sub_cancel_btn": "Отмена",
				"home_modal_err_title": "Ошибка подписки",
				"home_modal_err_create_acc": "Создать аккаунт",
				"home_modal_err_close": "Закрыть",
				"home_modal_succ_title": "Успешно!",
				"home_modal_succ_btn": "Отлично!"
			},
			en: {
				"home_hero_title": "Awaken Your Senses",
				"home_hero_subtitle_1": "Experience the rich, refined flavors of our gourmet culinary creations.",
				"home_hero_subtitle_2": "Crafted with passion, served with perfection.",
				"home_hero_btn": "Explore Menu",
				"home_feature_1_title": "Fine Dining",
				"home_feature_1_desc": "Crafted with the finest fresh ingredients for an unforgettable taste.",
				"home_feature_2_title": "Cozy Atmosphere",
				"home_feature_2_desc": "A perfect environment to relax, work, or catch up with friends.",
				"home_feature_3_title": "Eco-Friendly",
				"home_feature_3_desc": "Committed to sustainable practices and 100% recyclable packaging.",
				"home_favorites_title": "Our Favorites",
				"home_favorites_subtitle": "Discover the dishes and drinks our guests love the most.",
				"home_favorites_badge": "Favorite",
				"home_favorites_empty": "No products currently available.",
				"home_favorites_btn": "View Full Menu",
				"home_about_title": "The Süfrano Experience",
				"home_about_p1": "At Süfrano, we believe that dining is more than just a meal—it's an art. We meticulously source our ingredients from sustainable local and global farms, ensuring every dish is crafted with passion and culinary excellence.",
				"home_about_p2": "Our chefs are artisans, dedicated to crafting perfection into every signature dish and culinary specialty. Step into our cozy atmosphere and let us awaken your senses.",
				"home_club_title": "Join the Süfrano Club",
				"home_club_desc": "Subscribe to receive exclusive offers, seasonal menu announcements, and culinary secrets directly to your inbox.",
				"home_club_placeholder": "Enter your email address",
				"home_club_btn": "Subscribe",
				"home_club_btn_loading": "Sending...",
				"home_modal_sub_title": "Confirm Subscription",
				"home_modal_sub_desc": "We sent a 4-digit code to",
				"home_modal_sub_confirm_btn": "Confirm",
				"home_modal_sub_resend_btn": "Resend Code",
				"home_modal_sub_cancel_btn": "Cancel",
				"home_modal_err_title": "Subscription Error",
				"home_modal_err_create_acc": "Create Account",
				"home_modal_err_close": "Close",
				"home_modal_succ_title": "Success!",
				"home_modal_succ_btn": "Great!"
			},
			az: {
				"home_hero_title": "Hisslərinizi oyadın",
				"home_hero_subtitle_1": "Xüsusi kulinariya incilərimizin zəngin və incə dadını kəşf edin.",
				"home_hero_subtitle_2": "Ehtirasla hazırlanmış, mükəmməlliklə təqdim edilmişdir.",
				"home_hero_btn": "Menyuya baxın",
				"home_feature_1_title": "Nəfis mətbəx",
				"home_feature_1_desc": "Unudulmaz dad üçün ən təzə və seçilmiş təbii inqrediyentlər.",
				"home_feature_2_title": "Rahat atmosfer",
				"home_feature_2_desc": "İstirahət etmək, işləmək və ya dostlarla görüşmək üçün mükəmməl məkan.",
				"home_feature_3_title": "Ekoloji təmiz",
				"home_feature_3_desc": "Davamlı təcrübələrə və 100% təkrar emal olunan qablaşdırmaya sadiqik.",
				"home_favorites_title": "Sevimlilərimiz",
				"home_favorites_subtitle": "Qonaqlarımızın ən çox sevdiyi təamları və içkiləri kəşf edin.",
				"home_favorites_badge": "Sevimli",
				"home_favorites_empty": "Hazırda heç bir məhsul yoxdur.",
				"home_favorites_btn": "Bütün menyu",
				"home_about_title": "Süfrano təcrübəsi",
				"home_about_p1": "Süfrano-da biz inanırıq ki, qastronomiya sadəcə yemək deyil — bu, bir incəsənətdir. Hər bir təamdan zövq almağınız üçün inqrediyentləri ən yaxşı ekoloji təsərrüfatlardan diqqətlə seçirik.",
				"home_about_p2": "Aşpazlarımız hər bir xüsusi təama və şah əsərə mükəmməllik qatan sənətkarlardır. Rahat atmosferimizə daxil olun və hisslərinizi oyatmağımıza icazə verin.",
				"home_club_title": "Süfrano Klubuna qoşulun",
				"home_club_desc": "Eksklüziv təklifləri, yeni mövsümi menyu xəbərlərini və baş aşpazdan tövsiyələri birbaşa poçtunuza almaq üçün abunə olun.",
				"home_club_placeholder": "E-poçt ünvanınızı daxil edin",
				"home_club_btn": "Abunə ol",
				"home_club_btn_loading": "Göndərilir...",
				"home_modal_sub_title": "Abunəliyi təsdiqləyin",
				"home_modal_sub_desc": "4 rəqəmli kodu göndərdik:",
				"home_modal_sub_confirm_btn": "Təsdiqlə",
				"home_modal_sub_resend_btn": "Kodu yenidən göndər",
				"home_modal_sub_cancel_btn": "Ləğv et",
				"home_modal_err_title": "Abunəlik xətası",
				"home_modal_err_create_acc": "Hesab yarat",
				"home_modal_err_close": "Bağla",
				"home_modal_succ_title": "Uğurlu!",
				"home_modal_succ_btn": "Əla!"
			}
		};
		const getHomeTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.ru;
			return dict[dataId] || translations.en[dataId] || dataId;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getHomeTranslation", { enumerable: true, get: function () { return getHomeTranslation; } });
	});
	//#endregion

	//#region components/PublicPages/Home/SubscribeModal.js
	__define("components/PublicPages/Home/SubscribeModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useRef } = __imp_0;
		const logo = "/assets/icons/rednest_logo.png";
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const { useLang } = __require("utils/useLang.js");
		const { getHomeTranslation } = __require("components/PublicPages/Home/Lang.js");
		const LoaderIcon = () => /* @__PURE__ */ __h("img", {
			src: loaderIcon,
			alt: "Loading...",
			style: {
				width: "20px",
				height: "20px"
			}
		});
		const SubscribeModal = ({ isOpen, onClose, email, onSuccess }) => {
			const lang = useLang();
			const t = (id) => getHomeTranslation(lang, id);
			const [digits, setDigits] = useState([
				"",
				"",
				"",
				""
			]);
			const [timer, setTimer] = useState(900);
			const [loading, setLoading] = useState(false);
			const [error, setError] = useState("");
			const inputRefs = [
				useRef(null),
				useRef(null),
				useRef(null),
				useRef(null)
			];
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			useEffect(() => {
				let interval = null;
				if (isOpen) {
					setDigits([
						"",
						"",
						"",
						""
					]);
					setTimer(900);
					setError("");
					interval = setInterval(() => {
						setTimer((prev) => prev > 0 ? prev - 1 : 0);
					}, 1e3);
				}
				return () => {
					if (interval) clearInterval(interval);
				};
			}, [isOpen]);
			useEffect(() => {
				if (isOpen && inputRefs[0].current) {
					setTimeout(() => inputRefs[0].current?.focus(), 150);
				}
			}, [isOpen]);
			const formatTimer = (seconds) => {
				const m = Math.floor(seconds / 60);
				const s = seconds % 60;
				return `${m}:${s < 10 ? "0" : ""}${s}`;
			};
			const handleDigitChange = (index, value) => {
				const cleanVal = value.replace(/\D/g, "");
				if (!cleanVal) {
					const next = [...digits];
					next[index] = "";
					setDigits(next);
					return;
				}
				if (cleanVal.length > 1) {
					const pasted = cleanVal.slice(0, 4).split("");
					const next = [...digits];
					for (let i = 0; i < 4; i++) {
						next[i] = pasted[i] || "";
					}
					setDigits(next);
					const focusIndex = Math.min(pasted.length, 3);
					inputRefs[focusIndex].current?.focus();
					return;
				}
				const next = [...digits];
				next[index] = cleanVal.slice(-1);
				setDigits(next);
				if (index < 3) {
					inputRefs[index + 1].current?.focus();
				}
			};
			const handleKeyDown = (index, e) => {
				if (e.key === "Backspace" && !digits[index] && index > 0) {
					inputRefs[index - 1].current?.focus();
				}
			};
			const handlePaste = (e) => {
				e.preventDefault();
				const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
				if (pastedData) {
					const next = [
						"",
						"",
						"",
						""
					];
					for (let i = 0; i < pastedData.length; i++) {
						next[i] = pastedData[i];
					}
					setDigits(next);
					const focusIndex = Math.min(pastedData.length, 3);
					inputRefs[focusIndex].current?.focus();
				}
			};
			const handleVerify = async (e) => {
				e.preventDefault();
				const code = digits.join("");
				if (code.length < 4) {
					setError("Please enter the 4-digit code.");
					return;
				}
				if (loading) return;
				setLoading(true);
				setError("");
				try {
					const response = await fetch(`${apiUrl}/api/auth/subscribe/verify`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email,
							code
						})
					});
					const data = await response.json();
					if (!response.ok) {
						throw new Error(data.message || "Verification failed");
					}
					onSuccess(data.message || "Successfully subscribed to the Süfrano Club!");
					onClose();
				} catch (err) {
					setError(err.message);
				} finally {
					setLoading(false);
				}
			};
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose
			}, /* @__PURE__ */ __h("div", {
				className: "subscribe-modal-content",
				onMouseDown: (e) => e.stopPropagation(),
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "subscribe-modal-close",
				onClick: onClose,
				"aria-label": "Close modal"
			}, /* @__PURE__ */ __h("svg", {
				width: "24",
				height: "24",
				viewBox: "0 0 24 24",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg"
			}, /* @__PURE__ */ __h("path", {
				d: "M18 6L6 18M6 6L18 18",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}))), /* @__PURE__ */ __h("div", { className: "subscribe-modal-header" }, /* @__PURE__ */ __h("img", {
				src: logo,
				alt: "Süfrano Logo",
				className: "subscribe-modal-logo"
			}), /* @__PURE__ */ __h("h2", { "data-id": "home_club_title" }, t("home_club_title")), /* @__PURE__ */ __h("p", { "data-id": "home_modal_sub_desc" }, t("home_modal_sub_desc"), " ", /* @__PURE__ */ __h("strong", null, email))), /* @__PURE__ */ __h("form", {
				className: "subscribe-modal-form",
				onSubmit: handleVerify
			}, /* @__PURE__ */ __h("div", {
				className: "two-factor-inputs",
				onPaste: handlePaste
			}, digits.map((digit, idx) => /* @__PURE__ */ __h("input", {
				key: idx,
				ref: inputRefs[idx],
				type: "text",
				inputMode: "numeric",
				maxLength: 4,
				value: digit,
				onChange: (e) => handleDigitChange(idx, e.target.value),
				onKeyDown: (e) => handleKeyDown(idx, e),
				className: "two-factor-digit",
				autoComplete: "one-time-code"
			}))), /* @__PURE__ */ __h("div", { className: "subscribe-timer-info" }, timer > 0 ? /* @__PURE__ */ __h("span", null, "Code expires in ", /* @__PURE__ */ __h("strong", { className: "timer-value" }, formatTimer(timer))) : /* @__PURE__ */ __h("span", { className: "timer-expired" }, "Code has expired. Please enter your email again.")), error && /* @__PURE__ */ __h("div", { className: "subscribe-error-msg" }, error), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "cta-btn subscribe-submit-btn",
				disabled: loading || digits.join("").length < 4 || timer === 0,
				"data-id": "home_modal_sub_confirm_btn"
			}, loading ? /* @__PURE__ */ __h("span", { style: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: "8px"
			} }, /* @__PURE__ */ __h(LoaderIcon, null), " Confirming...") : t("home_modal_sub_confirm_btn")))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return SubscribeModal; } });
	});
	//#endregion

	//#region components/PublicPages/Home/SubscribeErrorModal.js
	__define("components/PublicPages/Home/SubscribeErrorModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const { useLang } = __require("utils/useLang.js");
		const { getHomeTranslation } = __require("components/PublicPages/Home/Lang.js");
		const SubscribeErrorModal = ({ isOpen, onClose, message, errorType, onOpenRegister }) => {
			const lang = useLang();
			const t = (id) => getHomeTranslation(lang, id);
			const isAlreadySubscribed = errorType === "ALREADY_SUBSCRIBED" || typeof message === "string" && message.toLowerCase().includes("already subscribed");
			const isAccountRequired = errorType === "ACCOUNT_NOT_FOUND" || typeof message === "string" && message.toLowerCase().includes("not registered");
			const title = isAlreadySubscribed ? lang === "ru" ? "Уже подписаны" : lang === "az" ? "Artıq abunə olmusunuz" : "Already Subscribed" : isAccountRequired ? lang === "ru" ? "Требуется аккаунт" : lang === "az" ? "Hesab tələb olunur" : "Account Required" : t("home_modal_err_title");
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose,
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "rednest-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "rednest-modal__icon rednest-modal__icon--warning" }, isAlreadySubscribed ? /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ __h("polyline", { points: "22,6 12,13 2,6" })) : /* @__PURE__ */ __h("svg", {
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
			}))), /* @__PURE__ */ __h("h3", {
				className: "rednest-modal__title",
				"data-id": "home_modal_err_title"
			}, title), /* @__PURE__ */ __h("p", { className: "rednest-modal__text" }, message || (isAlreadySubscribed ? lang === "ru" ? "Этот адрес электронной почты уже подписан на рассылку. Если у вас возникли вопросы, свяжитесь со службой поддержки." : lang === "az" ? "Bu e-poç ünvanı artıq bülletenə abunədir. Suallarınız varsa, texniki dəstəklə əlaqə saxlayın." : "This email is already subscribed to the newsletter. If you have questions or need assistance, please contact technical support." : lang === "ru" ? "Этот адрес не зарегистрирован. Пожалуйста, сначала создайте аккаунт." : lang === "az" ? "Bu e-poç qeydiyyatdan keçməyib. Zəhmət olmasa, əvvəlcə hesab yaradın." : "This email is not registered. Please create an account first.")), /* @__PURE__ */ __h("div", { className: "rednest-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "rednest-modal__btn rednest-modal__btn--cancel",
				onClick: onClose,
				"data-id": "home_modal_err_close"
			}, t("home_modal_err_close")), isAlreadySubscribed && /* @__PURE__ */ __h("a", {
				href: "mailto:hello@sufrano.com?subject=Newsletter%20Subscription%20Support",
				className: "rednest-modal__btn rednest-modal__btn--danger",
				style: {
					textDecoration: "none",
					background: "#9e7a36",
					boxShadow: "0 4px 14px rgba(158, 122, 54, 0.35)"
				},
				onClick: onClose
			}, lang === "ru" ? "Служба поддержки" : lang === "az" ? "Dəstək xidməti" : "Contact Support"), !isAlreadySubscribed && isAccountRequired && onOpenRegister && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "rednest-modal__btn rednest-modal__btn--danger",
				style: {
					background: "#c5a059",
					boxShadow: "0 4px 14px rgba(197, 160, 89, 0.35)"
				},
				onClick: () => {
					onClose();
					onOpenRegister();
				},
				"data-id": "home_modal_err_create_acc"
			}, t("home_modal_err_create_acc")))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return SubscribeErrorModal; } });
	});
	//#endregion

	//#region components/PublicPages/Home/SubscribeSuccessModal.js
	__define("components/PublicPages/Home/SubscribeSuccessModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const { useLang } = __require("utils/useLang.js");
		const { getHomeTranslation } = __require("components/PublicPages/Home/Lang.js");
		const SubscribeSuccessModal = ({ isOpen, onClose, message }) => {
			const lang = useLang();
			const t = (id) => getHomeTranslation(lang, id);
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose,
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "rednest-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "rednest-modal__icon rednest-modal__icon--success" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" }))), /* @__PURE__ */ __h("h3", {
				className: "rednest-modal__title",
				"data-id": "home_modal_succ_title"
			}, t("home_modal_succ_title")), /* @__PURE__ */ __h("p", { className: "rednest-modal__text" }, message || "Successfully subscribed to the Süfrano Club!"), /* @__PURE__ */ __h("div", { className: "rednest-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "rednest-modal__btn rednest-modal__btn--success",
				onClick: onClose,
				"data-id": "home_modal_succ_btn"
			}, t("home_modal_succ_btn")))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return SubscribeSuccessModal; } });
	});
	//#endregion

	//#region components/PublicPages/Home/Home.js
	__define("components/PublicPages/Home/Home.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useRef, useEffect, useState, useMemo } = __imp_0;
		const { motion } = __require("utils/motion.js");
		const { Link, useNavigate } = __require("utils/router.js");
		const logo = "/assets/icons/rednest_logo.png";
		const premiumRoastIcon = "/assets/icons/premium_roast.svg";
		const cozyAtmosphereIcon = "/assets/icons/cozy_atmosphere.svg";
		const ecoFriendlyIcon = "/assets/icons/eco_friendly.svg";
		const homeCardLoader = "/assets/icons/home-product-card-loader.svg";
		const bgVideoUrl = "/assets/video/media_1.mp4";
		const aboutImage = "/assets/images/about_image.png";
		const cappuccinoImg = "/assets/images/product/Cappuccino.jpg";
		const __imp_1 = __require("components/PublicPages/Home/SubscribeModal.js");
		const SubscribeModal = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/PublicPages/Home/SubscribeErrorModal.js");
		const SubscribeErrorModal = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const __imp_3 = __require("components/PublicPages/Home/SubscribeSuccessModal.js");
		const SubscribeSuccessModal = __imp_3.default !== undefined ? __imp_3.default : __imp_3;
		const __imp_4 = __require("components/Footer/Footer.js");
		const Footer = __imp_4.default !== undefined ? __imp_4.default : __imp_4;
		const __imp_5 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_5.default !== undefined ? __imp_5.default : __imp_5;
		const { useLang } = __require("utils/useLang.js");
		const { getHomeTranslation } = __require("components/PublicPages/Home/Lang.js");
		let cachedBlobUrl = null;
		let blobFetchPromise = null;
		function getVideoBlobUrl() {
			if (cachedBlobUrl) return Promise.resolve(cachedBlobUrl);
			if (blobFetchPromise) return blobFetchPromise;
			const resolvedVideoUrl = (typeof window !== "undefined" && window.__SUFRANO_BASE__ ? window.__SUFRANO_BASE__ : "") + bgVideoUrl;
			blobFetchPromise = fetch(resolvedVideoUrl).then((res) => res.blob()).then((blob) => {
				cachedBlobUrl = URL.createObjectURL(blob);
				return cachedBlobUrl;
			}).catch(() => {
				blobFetchPromise = null;
				return resolvedVideoUrl;
			});
			return blobFetchPromise;
		}
		const Home = () => {
			const navigate = useNavigate();
			const lang = useLang();
			const t = (dataId) => getHomeTranslation(lang, dataId);
			const videoRef = useRef(null);
			const [videoBlobSrc, setVideoBlobSrc] = useState(cachedBlobUrl || "");
			const featuresGridRef = useRef(null);
			const features = useMemo(() => [
				{
					id: "feature_1",
					icon: premiumRoastIcon,
					alt: "Fine Dining",
					titleKey: "home_feature_1_title",
					descKey: "home_feature_1_desc"
				},
				{
					id: "feature_2",
					icon: cozyAtmosphereIcon,
					alt: "Cozy Atmosphere",
					titleKey: "home_feature_2_title",
					descKey: "home_feature_2_desc"
				},
				{
					id: "feature_3",
					icon: ecoFriendlyIcon,
					alt: "Eco-Friendly",
					titleKey: "home_feature_3_title",
					descKey: "home_feature_3_desc"
				}
			], []);
			useEffect(() => {
				const el = featuresGridRef.current;
				if (!el) return;
				let isDown = false;
				let startX = 0;
				let scrollLeft = 0;
				let hasMoved = false;
				const onMouseDown = (e) => {
					if (e.button !== 0) return;
					isDown = true;
					hasMoved = false;
					startX = e.pageX - el.offsetLeft;
					scrollLeft = el.scrollLeft;
					el.style.scrollSnapType = "none";
					el.style.scrollBehavior = "auto";
				};
				const onMouseMove = (e) => {
					if (!isDown) return;
					const x = e.pageX - el.offsetLeft;
					const walk = x - startX;
					if (Math.abs(walk) > 4) {
						hasMoved = true;
						el.style.cursor = "grabbing";
					}
					el.scrollLeft = scrollLeft - walk;
				};
				const onMouseUp = () => {
					if (!isDown) return;
					isDown = false;
					el.style.cursor = "";
					el.style.scrollSnapType = "x mandatory";
					el.style.scrollBehavior = "smooth";
				};
				el.addEventListener("mousedown", onMouseDown);
				window.addEventListener("mousemove", onMouseMove);
				window.addEventListener("mouseup", onMouseUp);
				return () => {
					el.removeEventListener("mousedown", onMouseDown);
					window.removeEventListener("mousemove", onMouseMove);
					window.removeEventListener("mouseup", onMouseUp);
				};
			}, []);
			const [subscribeEmail, setSubscribeEmail] = useState("");
			const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
			const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
			const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
			const [errorMessage, setErrorMessage] = useState("");
			const [errorType, setErrorType] = useState("ACCOUNT_NOT_FOUND");
			const [successMessage, setSuccessMessage] = useState("");
			const [subscribeLoading, setSubscribeLoading] = useState(false);
			const [favoritesLoading, setFavoritesLoading] = useState(true);
			const [favoriteProducts, setFavoriteProducts] = useState([]);
			const [isDesktop, setIsDesktop] = useState(() => {
				if (typeof window !== "undefined") {
					return window.innerWidth > 768;
				}
				return true;
			});
			const [skeletonCount, setSkeletonCount] = useState(() => {
				if (typeof window === "undefined") return 4;
				const w = window.innerWidth;
				if (w < 640) return 1;
				if (w < 980) return 2;
				if (w < 1280) return 3;
				return 4;
			});
			useEffect(() => {
				const handleResize = () => {
					setIsDesktop(window.innerWidth > 768);
					const w = window.innerWidth;
					if (w < 640) setSkeletonCount(1);
					else if (w < 980) setSkeletonCount(2);
					else if (w < 1280) setSkeletonCount(3);
					else setSkeletonCount(4);
				};
				window.addEventListener("resize", handleResize);
				return () => window.removeEventListener("resize", handleResize);
			}, []);
			useEffect(() => {
				if (!videoBlobSrc) {
					getVideoBlobUrl().then((url) => setVideoBlobSrc(url));
				}
			}, []);
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			useEffect(() => {
				let isMounted = true;
				const fetchFavorites = async () => {
					setFavoritesLoading(true);
					try {
						const res = await fetch(`${apiUrl}/api/products/favorites?limit=4&lang=${lang}`);
						if (res.ok) {
							const data = await res.json();
							if (isMounted && Array.isArray(data)) {
								setFavoriteProducts(data);
							}
						}
					} catch (err) {
						console.error("Failed to load favorite products:", err);
					} finally {
						if (isMounted) {
							setFavoritesLoading(false);
						}
					}
				};
				fetchFavorites();
				return () => {
					isMounted = false;
				};
			}, [apiUrl, lang]);
			useEffect(() => {
				const videoEl = videoRef.current;
				if (!videoEl || !videoBlobSrc) return;
				videoEl.muted = true;
				videoEl.defaultMuted = true;
				videoEl.playsInline = true;
				let isIntersecting = true;
				const tryPlay = () => {
					if (isIntersecting && videoEl.paused) {
						videoEl.play().catch((error) => {
							console.log("Auto-play prevented", error);
						});
					}
				};
				tryPlay();
				videoEl.addEventListener("loadeddata", tryPlay);
				videoEl.addEventListener("canplay", tryPlay);
				const observer = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
						isIntersecting = entry.isIntersecting;
						if (videoRef.current) {
							if (entry.isIntersecting) {
								videoRef.current.play().catch((error) => {
									console.log("Auto-play prevented", error);
								});
							} else {
								videoRef.current.pause();
							}
						}
					});
				}, {
					rootMargin: "600px 0px 600px 0px",
					threshold: 0
				});
				observer.observe(videoEl);
				return () => {
					videoEl.removeEventListener("loadeddata", tryPlay);
					videoEl.removeEventListener("canplay", tryPlay);
					observer.unobserve(videoEl);
					observer.disconnect();
				};
			}, [videoBlobSrc]);
			const handleSubscribeSubmit = async (e) => {
				e.preventDefault();
				if (!subscribeEmail.trim() || subscribeLoading) return;
				setSubscribeLoading(true);
				try {
					const res = await fetch(`${apiUrl}/api/auth/subscribe/request`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email: subscribeEmail.trim() })
					});
					const data = await res.json();
					if (!res.ok) {
						const err = new Error(data.message || "Subscription request failed.");
						err.errorType = data.errorType || (res.status === 409 || data.message?.toLowerCase().includes("already") ? "ALREADY_SUBSCRIBED" : "ACCOUNT_NOT_FOUND");
						throw err;
					}
					setIsSubscribeModalOpen(true);
				} catch (err) {
					setErrorMessage(err.message || "This email is not registered. Please create an account first.");
					setErrorType(err.errorType || (err.message?.toLowerCase().includes("already") ? "ALREADY_SUBSCRIBED" : "ACCOUNT_NOT_FOUND"));
					setIsErrorModalOpen(true);
				} finally {
					setSubscribeLoading(false);
				}
			};
			return /* @__PURE__ */ __h(motion.div, {
				className: "home-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("section", { className: "hero-section" }, videoBlobSrc && /* @__PURE__ */ __h("video", {
				ref: videoRef,
				autoPlay: true,
				loop: true,
				muted: true,
				playsInline: true,
				preload: "auto",
				className: "hero-video-bg",
				src: videoBlobSrc
			}), /* @__PURE__ */ __h("div", { className: "hero-overlay" }), /* @__PURE__ */ __h("div", { className: "hero-content" }, /* @__PURE__ */ __h("h1", {
				className: "hero-title",
				"data-id": "home_hero_title"
			}, t("home_hero_title")), /* @__PURE__ */ __h("p", {
				className: "hero-subtitle",
				"data-id": "home_hero_subtitle"
			}, t("home_hero_subtitle_1"), /* @__PURE__ */ __h("br", { className: "hero-subtitle-br" }), t("home_hero_subtitle_2")), /* @__PURE__ */ __h("div", { className: "hero-actions" }, /* @__PURE__ */ __h(Link, {
				to: "/catalog",
				className: "cta-btn lg",
				"data-id": "home_hero_btn"
			}, t("home_hero_btn"))))), /* @__PURE__ */ __h(motion.section, {
				className: "features-section",
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
					amount: .2
				},
				transition: { duration: .6 }
			}, /* @__PURE__ */ __h("div", {
				className: "features-grid",
				ref: featuresGridRef
			}, features.map((feature) => /* @__PURE__ */ __h("div", {
				key: feature.id,
				className: "feature-card"
			}, /* @__PURE__ */ __h("div", { className: "feature-icon" }, /* @__PURE__ */ __h("img", {
				src: feature.icon,
				alt: feature.alt,
				className: "feature-svg"
			})), /* @__PURE__ */ __h("h3", { "data-id": feature.titleKey }, t(feature.titleKey)), /* @__PURE__ */ __h("p", { "data-id": feature.descKey }, t(feature.descKey)))))), /* @__PURE__ */ __h(motion.section, {
				className: "popular-menu-section",
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
					amount: .2
				},
				transition: { duration: .6 }
			}, /* @__PURE__ */ __h("div", { className: "section-header" }, /* @__PURE__ */ __h("h2", { "data-id": "home_favorites_title" }, t("home_favorites_title")), /* @__PURE__ */ __h("p", { "data-id": "home_favorites_subtitle" }, t("home_favorites_subtitle"))), /* @__PURE__ */ __h("div", { className: "menu-grid" }, favoritesLoading ? Array.from({ length: skeletonCount }).map((_, i) => /* @__PURE__ */ __h("div", {
				key: i,
				className: "home-skeleton-card"
			}, /* @__PURE__ */ __h("img", {
				src: homeCardLoader,
				alt: "Loading product",
				className: "skeleton-svg-img"
			}))) : favoriteProducts.length === 0 ? /* @__PURE__ */ __h("div", { className: "empty-favorites" }, /* @__PURE__ */ __h("p", { "data-id": "home_favorites_empty" }, t("home_favorites_empty"))) : favoriteProducts.map((prod) => {
				const rawBasePrice = prod.prices?.price ?? prod.price;
				const basePriceNum = typeof rawBasePrice === "number" ? rawBasePrice : parseFloat(rawBasePrice) || 0;
				const rawDiscountPrice = prod.prices?.discountPrice;
				const discountPriceNum = rawDiscountPrice !== undefined && rawDiscountPrice !== null && rawDiscountPrice !== "" ? typeof rawDiscountPrice === "number" ? rawDiscountPrice : parseFloat(rawDiscountPrice) : null;
				const hasDiscount = discountPriceNum !== null && !isNaN(discountPriceNum) && discountPriceNum > 0 && discountPriceNum < basePriceNum;
				const discountPercent = hasDiscount ? Math.round((1 - discountPriceNum / basePriceNum) * 100) : 0;
				const effectivePriceFormatted = hasDiscount ? discountPriceNum.toFixed(2) : basePriceNum.toFixed(2);
				const oldPriceFormatted = basePriceNum.toFixed(2);
				return /* @__PURE__ */ __h("div", {
					key: prod.id,
					className: "menu-item-card"
				}, /* @__PURE__ */ __h("div", {
					className: "favorite-badge",
					"data-id": "home_favorites_badge"
				}, t("home_favorites_badge")), /* @__PURE__ */ __h("img", {
					src: prod.images?.image || prod.images?.icon || cappuccinoImg,
					alt: prod.name,
					className: "menu-img-placeholder",
					style: { objectFit: "cover" },
					loading: "lazy"
				}), /* @__PURE__ */ __h("div", { className: "menu-info" }, /* @__PURE__ */ __h("h4", { title: prod.name }, prod.name), /* @__PURE__ */ __h("p", { title: prod.description || "" }, prod.description || "Delicious handcrafted dish made with premium ingredients."), /* @__PURE__ */ __h("div", { className: `home-price-container ${hasDiscount ? "has-discount" : "no-discount"}` }, hasDiscount && /* @__PURE__ */ __h("div", { className: "home-old-price-pill" }, /* @__PURE__ */ __h("span", { className: "discount-tag" }, "-", discountPercent, "%"), /* @__PURE__ */ __h("span", { className: "old-price" }, oldPriceFormatted, " ₼")), /* @__PURE__ */ __h("span", { className: "price" }, effectivePriceFormatted, " ₼"))));
			})), /* @__PURE__ */ __h("div", { className: "section-actions" }, /* @__PURE__ */ __h(Link, {
				to: "/catalog",
				className: "cta-btn secondary",
				"data-id": "home_favorites_btn"
			}, t("home_favorites_btn")))), /* @__PURE__ */ __h(motion.section, {
				className: "about-us-section",
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
					amount: .2
				},
				transition: { duration: .6 }
			}, /* @__PURE__ */ __h("div", { className: "about-grid" }, /* @__PURE__ */ __h("div", { className: "about-content" }, /* @__PURE__ */ __h("h2", { "data-id": "home_about_title" }, t("home_about_title")), /* @__PURE__ */ __h("p", { "data-id": "home_about_p1" }, t("home_about_p1")), /* @__PURE__ */ __h("p", { "data-id": "home_about_p2" }, t("home_about_p2"))), isDesktop && /* @__PURE__ */ __h("div", { className: "about-visual" }, /* @__PURE__ */ __h("img", {
				src: aboutImage,
				alt: "The Süfrano Experience",
				className: "about-image",
				loading: "lazy"
			})))), /* @__PURE__ */ __h(motion.section, {
				className: "newsletter-section",
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
					amount: .2
				},
				transition: { duration: .6 }
			}, /* @__PURE__ */ __h("div", { className: "newsletter-container" }, /* @__PURE__ */ __h("h2", { "data-id": "home_club_title" }, t("home_club_title")), /* @__PURE__ */ __h("p", { "data-id": "home_club_desc" }, t("home_club_desc")), /* @__PURE__ */ __h("form", {
				className: "newsletter-form",
				onSubmit: handleSubscribeSubmit
			}, /* @__PURE__ */ __h("input", {
				type: "email",
				placeholder: t("home_club_placeholder"),
				value: subscribeEmail,
				onChange: (e) => setSubscribeEmail(e.target.value),
				required: true,
				"data-id": "home_club_placeholder"
			}), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "cta-btn",
				id: "subscribe-btn",
				disabled: subscribeLoading,
				"data-id": "home_club_btn"
			}, subscribeLoading ? t("home_club_btn_loading") : t("home_club_btn"))))), /* @__PURE__ */ __h(SubscribeModal, {
				isOpen: isSubscribeModalOpen,
				onClose: () => setIsSubscribeModalOpen(false),
				email: subscribeEmail,
				onSuccess: (msg) => {
					setSuccessMessage(msg);
					setIsSuccessModalOpen(true);
					setSubscribeEmail("");
				}
			}), /* @__PURE__ */ __h(SubscribeErrorModal, {
				isOpen: isErrorModalOpen,
				onClose: () => setIsErrorModalOpen(false),
				message: errorMessage,
				errorType,
				onOpenRegister: () => navigate("/login")
			}), /* @__PURE__ */ __h(SubscribeSuccessModal, {
				isOpen: isSuccessModalOpen,
				onClose: () => setIsSuccessModalOpen(false),
				message: successMessage
			}), /* @__PURE__ */ __h(Footer, null));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Home; } });
	});
	//#endregion

	var entryExports = __require("components/PublicPages/Home/Home.js");
	__pages["home"] = entryExports.default || entryExports;
})();
