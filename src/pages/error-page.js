(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/PublicPages/ErrorPage/Lang.js
	__define("components/PublicPages/ErrorPage/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"error_badge_server": "Ошибка сервера",
				"error_badge_request": "Ошибка запроса",
				"error_cooldown_active": "Ограничение активно",
				"error_remaining": "осталось",
				"error_ready_retry": "Готово к повторной попытке",
				"error_btn_retrying": "Повторная попытка...",
				"error_btn_wait": "Подождите",
				"error_btn_try_again": "Попробовать снова",
				"error_btn_home": "На главную",
				"error_btn_menu": "Смотреть меню",
				"error_400_badge": "400 • Неверный запрос",
				"error_400_title": "Неверный запрос",
				"error_400_desc": "Сервер не смог обработать ваш запрос. Пожалуйста, проверьте данные и попробуйте снова.",
				"error_401_badge": "401 • Требуется авторизация",
				"error_401_title": "Требуется авторизация",
				"error_401_desc": "Вам необходимо войти в систему для доступа к этому разделу.",
				"error_403_badge": "403 • Доступ запрещен",
				"error_403_title": "Доступ ограничен",
				"error_403_desc": "У вас нет необходимых прав для просмотра этой страницы или выполнения действия.",
				"error_404_badge": "404 • Страница не найдена",
				"error_404_title": "Страница не найдена",
				"error_404_desc": "Запрошенная страница могла быть удалена, перемещена или временно недоступна.",
				"error_405_badge": "405 • Метод не поддерживается",
				"error_405_title": "Метод не разрешен",
				"error_405_desc": "Используемый HTTP-метод не поддерживается для данного ресурса.",
				"error_408_badge": "408 • Время ожидания истекло",
				"error_408_title": "Таймаут запроса",
				"error_408_desc": "Сервер слишком долго ждал ответ. Проверьте интернет-соединение.",
				"error_409_badge": "409 • Конфликт",
				"error_409_title": "Конфликт запроса",
				"error_409_desc": "Запрос не может быть выполнен из-за конфликта с текущим состоянием ресурса.",
				"error_413_badge": "413 • Слишком большой объем",
				"error_413_title": "Слишком большой объем данных",
				"error_413_desc": "Отправленный файл или запрос превышает максимально допустимый размер.",
				"error_422_badge": "422 • Ошибка обработки",
				"error_422_title": "Необрабатываемые данные",
				"error_422_desc": "Запрос синтаксически корректен, но содержит семантические ошибки.",
				"error_429_badge": "429 • Слишком много запросов",
				"error_429_title": "Слишком много запросов",
				"error_429_desc": "Вы отправили слишком много запросов за короткое время. Сделайте паузу и повторите попытку через минуту.",
				"error_500_badge": "500 • Ошибка сервера",
				"error_500_title": "Внутренняя ошибка сервера",
				"error_500_desc": "На сервере произошла непредвиденная ошибка. Наша команда уже оповещена.",
				"error_502_badge": "502 • Ошибка шлюза",
				"error_502_title": "Плохой шлюз",
				"error_502_desc": "Сервер получил недопустимый ответ от вышестоящего сервера. Попробуйте еще раз позже.",
				"error_503_badge": "503 • Сервис недоступен",
				"error_503_title": "Сервис временно недоступен",
				"error_503_desc": "Сервер временно недоступен или проводятся технические работы. Скоро все заработает.",
				"error_504_badge": "504 • Таймаут шлюза",
				"error_504_title": "Время ожидания шлюза истекло",
				"error_504_desc": "Вышестоящий сервер не ответил вовремя. Пожалуйста, обновите страницу через минуту.",
				"error_fallback_desc": "Произошла непредвиденная ошибка при обработке вашего запроса."
			},
			en: {
				"error_badge_server": "Server Error",
				"error_badge_request": "Request Error",
				"error_cooldown_active": "Cooldown active",
				"error_remaining": "remaining",
				"error_ready_retry": "Ready to retry",
				"error_btn_retrying": "Retrying...",
				"error_btn_wait": "Wait",
				"error_btn_try_again": "Try Again",
				"error_btn_home": "Back to Home",
				"error_btn_menu": "Explore Menu",
				"error_400_badge": "400 • Bad Request",
				"error_400_title": "Bad Request",
				"error_400_desc": "The server could not understand your request. Please verify your input and try again.",
				"error_401_badge": "401 • Unauthorized",
				"error_401_title": "Authentication Required",
				"error_401_desc": "You need to be signed in with valid credentials to access this area.",
				"error_403_badge": "403 • Forbidden",
				"error_403_title": "Access Denied",
				"error_403_desc": "You don't have the required permissions to view or perform this action.",
				"error_404_badge": "404 • Page Not Found",
				"error_404_title": "Page Not Found",
				"error_404_desc": "The page or resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
				"error_405_badge": "405 • Method Not Allowed",
				"error_405_title": "Method Not Allowed",
				"error_405_desc": "The HTTP method used is not supported for the requested resource.",
				"error_408_badge": "408 • Request Timeout",
				"error_408_title": "Request Timeout",
				"error_408_desc": "The server timed out waiting for the request to complete. Please check your network connection.",
				"error_409_badge": "409 • Conflict",
				"error_409_title": "Request Conflict",
				"error_409_desc": "The request could not be completed due to a conflict with the current state of the resource.",
				"error_413_badge": "413 • Payload Too Large",
				"error_413_title": "Payload Too Large",
				"error_413_desc": "The file or request payload sent exceeds the maximum allowed upload limit.",
				"error_422_badge": "422 • Unprocessable",
				"error_422_title": "Unprocessable Content",
				"error_422_desc": "The request was well-formed but contained semantic errors that prevented processing.",
				"error_429_badge": "429 • Slow Down",
				"error_429_title": "Too Many Requests",
				"error_429_desc": "You've sent too many requests in a short time. Please take a moment and wait before trying again.",
				"error_500_badge": "500 • Server Error",
				"error_500_title": "Internal Server Error",
				"error_500_desc": "Our server encountered an unexpected error. Our engineering team has been notified.",
				"error_502_badge": "502 • Bad Gateway",
				"error_502_title": "Bad Gateway",
				"error_502_desc": "The server received an invalid response from the upstream gateway. Please try again momentarily.",
				"error_503_badge": "503 • Service Unavailable",
				"error_503_title": "Service Unavailable",
				"error_503_desc": "The server is temporarily unavailable or undergoing maintenance. We will be back online shortly.",
				"error_504_badge": "504 • Gateway Timeout",
				"error_504_title": "Gateway Timeout",
				"error_504_desc": "The upstream server took too long to respond. Please refresh the page in a few moments.",
				"error_fallback_desc": "An unexpected issue occurred while processing your request."
			},
			az: {
				"error_badge_server": "Server xətası",
				"error_badge_request": "Sorğu xətası",
				"error_cooldown_active": "Gözləmə müddəti aktivdir",
				"error_remaining": "qalıb",
				"error_ready_retry": "Yenidən cəhd etmək mümkündür",
				"error_btn_retrying": "Yenidən cəhd edilir...",
				"error_btn_wait": "Gözləyin",
				"error_btn_try_again": "Yenidən cəhd et",
				"error_btn_home": "Ana səhifə",
				"error_btn_menu": "Menyuya baxın",
				"error_400_badge": "400 • Səhv sorğu",
				"error_400_title": "Səhv sorğu",
				"error_400_desc": "Server sorğunuzu emal edə bilmədi. Zəhmət olmasa daxil etdiyiniz məlumatları yoxlayıb yenidən cəhd edin.",
				"error_401_badge": "401 • İcazə tələb olunur",
				"error_401_title": "Giriş tələb olunur",
				"error_401_desc": "Bu bölməyə daxil olmaq üçün hesabınıza giriş etməlisiniz.",
				"error_403_badge": "403 • Giriş qadağandır",
				"error_403_title": "Giriş məhdudlaşdırılıb",
				"error_403_desc": "Bu səhifəyə baxmaq və ya əməliyyatı yerinə yetirmək üçün tələb olunan icazəniz yoxdur.",
				"error_404_badge": "404 • Səhifə tapılmadı",
				"error_404_title": "Səhifə tapılmadı",
				"error_404_desc": "Axtardığınız səhifə silinmiş, adı dəyişdirilmiş və ya müvəqqəti olaraq əlçatmaz ola bilər.",
				"error_405_badge": "405 • Metod dəstəklənmir",
				"error_405_title": "İcazə verilməyən metod",
				"error_405_desc": "İstifadə olunan HTTP metodu bu resurs üçün dəstəklənmir.",
				"error_408_badge": "408 • Gözləmə vaxtı bitdi",
				"error_408_title": "Sorğu vaxtı bitdi",
				"error_408_desc": "Server sorğunu tamamlamaq üçün çox gözlədi. Şəbəkə bağlantınızı yoxlayın.",
				"error_409_badge": "409 • Ziddiyyət",
				"error_409_title": "Sorğu ziddiyyəti",
				"error_409_desc": "Resursun cari vəziyyəti ilə ziddiyyət səbəbindən sorğu tamamlana bilmədi.",
				"error_413_badge": "413 • Həcm çox böyükdür",
				"error_413_title": "Məlumat həcmi həddindən artıqdır",
				"error_413_desc": "Göndərilən fayl və ya sorğu icazə verilən maksimum ölçünü aşır.",
				"error_422_badge": "422 • Emal edilə bilməyən məzmun",
				"error_422_title": "Emal edilə bilməyən məzmun",
				"error_422_desc": "Sorğu düzgün formatdadır, lakin emalına mane olan semantik səhvlər var.",
				"error_429_badge": "429 • Həddindən artıq sorğu",
				"error_429_title": "Çox sayda sorğu",
				"error_429_desc": "Qısa müddətdə çox sayda sorğu göndərdiniz. Zəhmət olmasa bir qədər fasilə verin və yenidən cəhd edin.",
				"error_500_badge": "500 • Server xətası",
				"error_500_title": "Daxili server xətası",
				"error_500_desc": "Serverimizdə gözlənilməz xəta baş verdi. Mühəndislərimizə artıq məlumat verilib.",
				"error_502_badge": "502 • Şlüz xətası",
				"error_502_title": "Yanlış şlüz",
				"error_502_desc": "Server əsas qovşaqdan yanlış cavab aldı. Zəhmət olmasa bir az sonra yenidən cəhd edin.",
				"error_503_badge": "503 • Xidmət əlçatan deyil",
				"error_503_title": "Xidmət müvəqqəti dayandırılıb",
				"error_503_desc": "Serverdə texniki işlər gedir və ya müvəqqəti əlçatan deyil. Tezliklə bərpa olunacaq.",
				"error_504_badge": "504 • Şlüz vaxtı bitdi",
				"error_504_title": "Şlüz gözləmə vaxtı bitdi",
				"error_504_desc": "Əsas server vaxtında cavab vermədi. Bir neçə dəqiqədən sonra səhifəni yeniləyin.",
				"error_fallback_desc": "Sorğunuz emal edilərkən gözlənilməz problem baş verdi."
			}
		};
		const getErrorPageTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.az || translations.ru;
			return dict[dataId] || translations.en[dataId] || dataId;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getErrorPageTranslation", { enumerable: true, get: function () { return getErrorPageTranslation; } });
	});
	//#endregion

	//#region components/PublicPages/ErrorPage/ErrorPage.js
	__define("components/PublicPages/ErrorPage/ErrorPage.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect } = __imp_0;
		const { Link, useNavigate, useSearchParams } = __require("utils/router.js");
		const { motion } = __require("utils/motion.js");
		const __imp_1 = __require("components/Footer/Footer.js");
		const Footer = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const { useLang } = __require("utils/useLang.js");
		const { getErrorPageTranslation } = __require("components/PublicPages/ErrorPage/Lang.js");
		const HTTP_ERROR_REGISTRY = {
			400: {
				badge: "400 • Bad Request",
				badgeClass: "error-badge--warning",
				title: "Bad Request",
				desc: "The server could not understand your request. Please verify your input and try again.",
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
				}))
			},
			401: {
				badge: "401 • Unauthorized",
				badgeClass: "error-badge--auth",
				title: "Authentication Required",
				desc: "You need to be signed in with valid credentials to access this area.",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("rect", {
					x: "3",
					y: "11",
					width: "18",
					height: "11",
					rx: "2",
					ry: "2"
				}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }))
			},
			403: {
				badge: "403 • Forbidden",
				badgeClass: "error-badge--danger",
				title: "Access Denied",
				desc: "You don't have the required permissions to view or perform this action.",
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
				}), /* @__PURE__ */ __h("line", {
					x1: "4.93",
					y1: "4.93",
					x2: "19.07",
					y2: "19.07"
				}))
			},
			404: {
				badge: "404 • Page Not Found",
				badgeClass: "error-badge--404",
				title: "Page Not Found",
				desc: "The page or resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
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
				}), /* @__PURE__ */ __h("line", {
					x1: "15",
					y1: "9",
					x2: "9",
					y2: "15"
				}), /* @__PURE__ */ __h("line", {
					x1: "9",
					y1: "9",
					x2: "15",
					y2: "15"
				}))
			},
			405: {
				badge: "405 • Method Not Allowed",
				badgeClass: "error-badge--warning",
				title: "Method Not Allowed",
				desc: "The HTTP method used is not supported for the requested resource.",
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
				}), /* @__PURE__ */ __h("line", {
					x1: "8",
					y1: "12",
					x2: "16",
					y2: "12"
				}))
			},
			408: {
				badge: "408 • Request Timeout",
				badgeClass: "error-badge--warning",
				title: "Request Timeout",
				desc: "The server timed out waiting for the request to complete. Please check your network connection.",
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
				}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 14 14" }))
			},
			409: {
				badge: "409 • Conflict",
				badgeClass: "error-badge--warning",
				title: "Request Conflict",
				desc: "The request could not be completed due to a conflict with the current state of the resource.",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "9",
					x2: "12",
					y2: "13"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "17",
					x2: "12.01",
					y2: "17"
				}))
			},
			413: {
				badge: "413 • Payload Too Large",
				badgeClass: "error-badge--warning",
				title: "Payload Too Large",
				desc: "The file or request payload sent exceeds the maximum allowed upload limit.",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ __h("polyline", { points: "17 8 12 3 7 8" }), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "3",
					x2: "12",
					y2: "15"
				}))
			},
			422: {
				badge: "422 • Unprocessable",
				badgeClass: "error-badge--warning",
				title: "Unprocessable Content",
				desc: "The request was well-formed but contained semantic errors that prevented processing.",
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
				}))
			},
			429: {
				badge: "429 • Slow Down",
				badgeClass: "error-badge--429",
				title: "Too Many Requests",
				desc: "You've sent too many requests in a short time. Please take a moment and wait before trying again.",
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
				}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 16 14" })),
				defaultRetrySeconds: 30
			},
			500: {
				badge: "500 • Server Error",
				badgeClass: "error-badge--500",
				title: "Internal Server Error",
				desc: "Our server encountered an unexpected error. Our engineering team has been notified.",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "9",
					x2: "12",
					y2: "13"
				}), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "17",
					x2: "12.01",
					y2: "17"
				})),
				defaultRetrySeconds: 10
			},
			502: {
				badge: "502 • Bad Gateway",
				badgeClass: "error-badge--server",
				title: "Bad Gateway",
				desc: "The server received an invalid response from the upstream gateway. Please try again momentarily.",
				icon: /* @__PURE__ */ __h("svg", {
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
					height: "8",
					rx: "2",
					ry: "2"
				}), /* @__PURE__ */ __h("rect", {
					x: "2",
					y: "14",
					width: "20",
					height: "8",
					rx: "2",
					ry: "2"
				}), /* @__PURE__ */ __h("line", {
					x1: "6",
					y1: "6",
					x2: "6.01",
					y2: "6"
				}), /* @__PURE__ */ __h("line", {
					x1: "6",
					y1: "18",
					x2: "6.01",
					y2: "18"
				})),
				defaultRetrySeconds: 10
			},
			503: {
				badge: "503 • Service Unavailable",
				badgeClass: "error-badge--server",
				title: "Service Unavailable",
				desc: "The server is temporarily unavailable or undergoing maintenance. We will be back online shortly.",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("path", { d: "M18.36 6.64a9 9 0 1 1-12.73 0" }), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "2",
					x2: "12",
					y2: "12"
				})),
				defaultRetrySeconds: 15
			},
			504: {
				badge: "504 • Gateway Timeout",
				badgeClass: "error-badge--server",
				title: "Gateway Timeout",
				desc: "The upstream server took too long to respond. Please refresh the page in a few moments.",
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
				}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 14 14" })),
				defaultRetrySeconds: 10
			}
		};
		const getLocalizedErrorDetails = (code, lang) => {
			const t = (id) => getErrorPageTranslation(lang, id);
			const mapping = {
				400: {
					badge: t("error_400_badge"),
					title: t("error_400_title"),
					desc: t("error_400_desc")
				},
				401: {
					badge: t("error_401_badge"),
					title: t("error_401_title"),
					desc: t("error_401_desc")
				},
				403: {
					badge: t("error_403_badge"),
					title: t("error_403_title"),
					desc: t("error_403_desc")
				},
				404: {
					badge: t("error_404_badge"),
					title: t("error_404_title"),
					desc: t("error_404_desc")
				},
				405: {
					badge: t("error_405_badge"),
					title: t("error_405_title"),
					desc: t("error_405_desc")
				},
				408: {
					badge: t("error_408_badge"),
					title: t("error_408_title"),
					desc: t("error_408_desc")
				},
				409: {
					badge: t("error_409_badge"),
					title: t("error_409_title"),
					desc: t("error_409_desc")
				},
				413: {
					badge: t("error_413_badge"),
					title: t("error_413_title"),
					desc: t("error_413_desc")
				},
				422: {
					badge: t("error_422_badge"),
					title: t("error_422_title"),
					desc: t("error_422_desc")
				},
				429: {
					badge: t("error_429_badge"),
					title: t("error_429_title"),
					desc: t("error_429_desc")
				},
				500: {
					badge: t("error_500_badge"),
					title: t("error_500_title"),
					desc: t("error_500_desc")
				},
				502: {
					badge: t("error_502_badge"),
					title: t("error_502_title"),
					desc: t("error_502_desc")
				},
				503: {
					badge: t("error_503_badge"),
					title: t("error_503_title"),
					desc: t("error_503_desc")
				},
				504: {
					badge: t("error_504_badge"),
					title: t("error_504_title"),
					desc: t("error_504_desc")
				}
			};
			return mapping[code] || {
				badge: `${code} • ${code >= 500 ? t("error_badge_server") : t("error_badge_request")}`,
				title: code >= 500 ? t("error_badge_server") : t("error_badge_request"),
				desc: t("error_fallback_desc")
			};
		};
		const ErrorPage = ({ defaultCode = "429" }) => {
			const [searchParams] = useSearchParams();
			const navigate = useNavigate();
			const lang = useLang();
			const t = (id) => getErrorPageTranslation(lang, id);
			const codeParam = searchParams.get("code") || defaultCode;
			const numCode = parseInt(codeParam, 10) || 500;
			const baseConfig = HTTP_ERROR_REGISTRY[numCode] || {
				badgeClass: numCode >= 500 ? "error-badge--server" : "error-badge--warning",
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
				})),
				defaultRetrySeconds: numCode === 429 ? 30 : 0
			};
			const localizedDetails = getLocalizedErrorDetails(numCode, lang);
			const backendTitle = searchParams.get("title");
			const backendMessage = searchParams.get("message");
			const title = backendTitle || localizedDetails.title;
			const description = backendMessage || localizedDetails.desc;
			const badgeText = localizedDetails.badge;
			const retryParam = parseInt(searchParams.get("retry"), 10);
			const initialRetry = !isNaN(retryParam) && retryParam > 0 ? retryParam : baseConfig.defaultRetrySeconds || 0;
			const [timeLeft, setTimeLeft] = useState(initialRetry);
			const [isRetrying, setIsRetrying] = useState(false);
			useEffect(() => {
				if (initialRetry <= 0) return;
				setTimeLeft(initialRetry);
				const timer = setInterval(() => {
					setTimeLeft((prev) => {
						if (prev <= 1) {
							clearInterval(timer);
							return 0;
						}
						return prev - 1;
					});
				}, 1e3);
				return () => clearInterval(timer);
			}, [initialRetry, codeParam]);
			const handleRetry = () => {
				setIsRetrying(true);
				setTimeout(() => {
					navigate(-1);
				}, 600);
			};
			const progressPercent = initialRetry > 0 ? Math.max(0, Math.min(100, (initialRetry - timeLeft) / initialRetry * 100)) : 100;
			return /* @__PURE__ */ __h(motion.div, {
				className: "error-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "error-main" }, /* @__PURE__ */ __h("div", { className: "error-ambient-bg" }), /* @__PURE__ */ __h(motion.div, {
				className: "error-card",
				initial: {
					opacity: 0,
					scale: .94,
					y: 20
				},
				animate: {
					opacity: 1,
					scale: 1,
					y: 0
				},
				transition: {
					duration: .45,
					ease: [
						.16,
						1,
						.3,
						1
					]
				}
			}, /* @__PURE__ */ __h("div", { className: `error-badge ${baseConfig.badgeClass}` }, /* @__PURE__ */ __h("span", { className: "error-badge__dot" }), /* @__PURE__ */ __h("span", null, badgeText)), /* @__PURE__ */ __h("div", { className: "error-icon-wrapper" }, baseConfig.icon), /* @__PURE__ */ __h("h1", { className: "error-code-title" }, numCode), /* @__PURE__ */ __h("h2", { className: "error-title" }, title), /* @__PURE__ */ __h("p", { className: "error-description" }, description), initialRetry > 0 && /* @__PURE__ */ __h("div", { className: "error-countdown-container" }, /* @__PURE__ */ __h("div", { className: "error-countdown-header" }, /* @__PURE__ */ __h("span", null, t("error_cooldown_active")), /* @__PURE__ */ __h("span", { className: "countdown-timer-value" }, timeLeft > 0 ? `${timeLeft}s ${t("error_remaining")}` : t("error_ready_retry"))), /* @__PURE__ */ __h("div", { className: "error-countdown-bar-wrap" }, /* @__PURE__ */ __h("div", {
				className: "error-countdown-bar-fill",
				style: { width: `${progressPercent}%` }
			}))), /* @__PURE__ */ __h("div", { className: "error-actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn",
				onClick: handleRetry,
				disabled: timeLeft > 0 || isRetrying
			}, isRetrying ? t("error_btn_retrying") : timeLeft > 0 ? `${t("error_btn_wait")} ${timeLeft}s` : t("error_btn_try_again")), /* @__PURE__ */ __h(Link, {
				to: "/",
				className: "cta-btn secondary"
			}, t("error_btn_home")), /* @__PURE__ */ __h(Link, {
				to: "/catalog",
				className: "cta-btn secondary"
			}, t("error_btn_menu"))))), /* @__PURE__ */ __h(Footer, null));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return ErrorPage; } });
	});
	//#endregion

	var entryExports = __require("components/PublicPages/ErrorPage/ErrorPage.js");
	__pages["error-page"] = entryExports.default || entryExports;
})();
