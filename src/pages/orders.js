(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/UserPages/Orders/Lang.js
	__define("components/UserPages/Orders/Lang.js", function (exports, __require, module) {
		const translations = {
			az: {
				title: "Sifarişlərim",
				subtitle: "Qəbzlərinizə, sifariş tarixçənizə baxın və statusları canlı izləyin",
				all: "Hamısı",
				pending: "Gözləmədə",
				completed: "Tamamlanıb",
				cancelled: "Ləğv edilib",
				searchPlaceholder: "Sifariş ID və ya məhsul üzrə axtarış...",
				loadingOrders: "Sifarişləriniz yüklənir...",
				loadError: "Sifarişlərinizi yükləmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.",
				tryAgain: "Yenidən cəhd et",
				noMatching: "Uyğun sifariş tapılmadı",
				noFilterOrders: "{filter} statusunda sifariş tapılmadı",
				noOrdersYet: "Hələ heç bir sifariş yoxdur",
				searchHint: "Başqa açar sözlə axtarmağı və ya axtarışı təmizləməyi yoxlayın.",
				emptyHint: "Nəfis yeməklər, zərif içkilər və xüsusi desertlərimizlə özünüzü sevindirin!",
				browseMenu: "Menyuya bax",
				copy: "Kopyala",
				copied: "Kopyalandı!",
				copyFullId: "Tam sifariş ID-sini kopyalayın",
				copiedToast: "Sifariş ID buferə kopyalandı!",
				qty: "Say",
				totalAmount: "Ümumi məbləğ:",
				receiptDetails: "Qəbz detalları",
				orderAgain: "Yenidən sifariş et",
				adding: "Əlavə edilir...",
				reorderSuccess: "{count} məhsul səbətə əlavə edildi!",
				reorderError: "Məhsulları səbətə əlavə etmək mümkün olmadı.",
				saved: "Qənaət",
				artisanCoffee: "Xüsusi Təam",
				coffeeItem: "Menyu Məhsulu",
				statusPaidOnline: "Onlayn ödənilib",
				statusPending: "Ödəniş gözlənilir",
				statusPreparing: "Hazırlanır",
				statusReady: "Götürülməyə hazırdır",
				statusCancelled: "Ləğv edilib",
				statusCompleted: "Tamamlanıb",
				payCashDesk: "Kassa (Nağd)",
				payCardRegister: "Kassada kartla",
				payWalletBalance: "Balans hesabı",
				payBankCard: "Bank kartı",
				payStripe: "Stripe",
				payGooglePay: "Google Pay",
				payCashier: "Kassada ödəniş",
				receiptTitle: "SÜFRANO",
				receiptSub: "Restoran & Nəfis Mətbəx",
				receiptNumber: "Qəbz nömrəsi:",
				dateTime: "Tarix və Saat:",
				itemCol: "MƏHSUL",
				qtyCol: "SAY",
				totalCol: "CƏMİ",
				subtotal: "Məhsulların cəmi",
				discount: "Endirim",
				paymentMethod: "Ödəniş üsulu",
				totalPaid: "Ödənilmiş yekun məbləğ",
				close: "Bağla",
				reorderThis: "Bunu yenidən sifariş et"
			},
			ru: {
				title: "Мои заказы",
				subtitle: "Просматривайте чеки, историю заказов и отслеживайте статусы в реальном времени",
				all: "Все",
				pending: "В ожидании",
				completed: "Завершенные",
				cancelled: "Отмененные",
				searchPlaceholder: "Поиск по номеру заказа или названию...",
				loadingOrders: "Загрузка ваших заказов...",
				loadError: "Не удалось загрузить заказы. Пожалуйста, попробуйте снова.",
				tryAgain: "Попробовать снова",
				noMatching: "Заказы не найдены",
				noFilterOrders: "Заказов со статусом «{filter}» не найдено",
				noOrdersYet: "Заказов пока нет",
				searchHint: "Попробуйте изменить поисковый запрос или очистите строку поиска.",
				emptyHint: "Побалуйте себя изысканными блюдами, авторскими напитками и великолепными десертами!",
				browseMenu: "В меню",
				copy: "Копировать",
				copied: "Скопировано!",
				copyFullId: "Скопировать полный номер заказа",
				copiedToast: "Номер заказа скопирован в буфер обмена!",
				qty: "Кол-во",
				totalAmount: "Итоговая сумма:",
				receiptDetails: "Детали чека",
				orderAgain: "Повторить заказ",
				adding: "Добавление...",
				reorderSuccess: "{count} товар(ов) добавлено в корзину!",
				reorderError: "Не удалось добавить товары в корзину.",
				saved: "Экономия",
				artisanCoffee: "Авторское блюдо",
				coffeeItem: "Позиция меню",
				statusPaidOnline: "Оплачено онлайн",
				statusPending: "Ожидает оплаты",
				statusPreparing: "Готовится",
				statusReady: "Готов к выдаче",
				statusCancelled: "Отменен",
				statusCompleted: "Завершен",
				payCashDesk: "Касса (Наличные)",
				payCardRegister: "Картой на кассе",
				payWalletBalance: "Баланс кошелька",
				payBankCard: "Банковская карта",
				payStripe: "Stripe",
				payGooglePay: "Google Pay",
				payCashier: "Оплата на кассе",
				receiptTitle: "SÜFRANO",
				receiptSub: "Ресторан & Авторская кухня",
				receiptNumber: "Номер чека:",
				dateTime: "Дата и время:",
				itemCol: "ТОВАР",
				qtyCol: "КОЛ-ВО",
				totalCol: "ИТОГО",
				subtotal: "Стоимость товаров",
				discount: "Скидка",
				paymentMethod: "Способ оплаты",
				totalPaid: "Итого оплачено",
				close: "Закрыть",
				reorderThis: "Повторить этот заказ"
			},
			en: {
				title: "My Orders",
				subtitle: "Review your receipts, order history, and track live statuses",
				all: "All",
				pending: "Pending",
				completed: "Completed",
				cancelled: "Cancelled",
				searchPlaceholder: "Search by order ID or item...",
				loadingOrders: "Loading your orders...",
				loadError: "Could not load your orders. Please try again.",
				tryAgain: "Try Again",
				noMatching: "No matching orders found",
				noFilterOrders: "No {filter} orders found",
				noOrdersYet: "No orders placed yet",
				searchHint: "Try searching with a different keyword or clear your search query.",
				emptyHint: "Treat yourself to exquisite dishes, signature drinks, and artisan desserts!",
				browseMenu: "Browse Menu",
				copy: "Copy",
				copied: "Copied!",
				copyFullId: "Copy full Order ID",
				copiedToast: "Order ID copied to clipboard!",
				qty: "Qty",
				totalAmount: "Total Amount:",
				receiptDetails: "Receipt Details",
				orderAgain: "Order Again",
				adding: "Adding...",
				reorderSuccess: "Added {count} item(s) to your basket!",
				reorderError: "Could not add items to basket.",
				saved: "Saved",
				artisanCoffee: "Artisan Dish",
				coffeeItem: "Menu Item",
				statusPaidOnline: "Paid Online",
				statusPending: "Pending Payment",
				statusPreparing: "Preparing",
				statusReady: "Ready for Pickup",
				statusCancelled: "Cancelled",
				statusCompleted: "Completed",
				payCashDesk: "Cash Desk",
				payCardRegister: "Card at Register",
				payWalletBalance: "Wallet Balance",
				payBankCard: "Bank Card",
				payStripe: "Stripe",
				payGooglePay: "Google Pay",
				payCashier: "Pay at Cashier",
				receiptTitle: "SÜFRANO",
				receiptSub: "Restaurant & Fine Dining",
				receiptNumber: "Receipt Number:",
				dateTime: "Date & Time:",
				itemCol: "ITEM",
				qtyCol: "QTY",
				totalCol: "TOTAL",
				subtotal: "Subtotal",
				discount: "Discount",
				paymentMethod: "Payment Method",
				totalPaid: "Total Amount Paid",
				close: "Close",
				reorderThis: "Reorder This"
			}
		};
		const getOrdersTranslation = (lang, id) => {
			return translations[lang]?.[id] || translations.az?.[id] || translations.en?.[id] || id;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getOrdersTranslation", { enumerable: true, get: function () { return getOrdersTranslation; } });
	});
	//#endregion

	//#region components/UserPages/Orders/Orders.js
	__define("components/UserPages/Orders/Orders.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useMemo } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { Link, useNavigate } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { useBasket } = __require("context/BasketContext.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const featureCashIcon = "/assets/icons/feature-cash.svg";
		const featureCardIcon = "/assets/icons/feature-card-visa-mc.svg";
		const featureWalletIcon = "/assets/icons/feature-wallet.svg";
		const featureStripeIcon = "/assets/icons/feature-stripe.svg";
		const featureGPayIcon = "/assets/icons/feature-gpay.svg";
		const featurePromoIcon = "/assets/icons/feature-promo.svg";
		const cashierIcon = "/assets/icons/cashier-register.svg";
		const onlineIcon = "/assets/icons/online-card.svg";
		const cartIcon = "/assets/icons/cart-animated.svg";
		const logo = "/assets/icons/rednest_logo.png";
		const __imp_1 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Footer/Footer.js");
		const Footer = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const __imp_3 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_3.default !== undefined ? __imp_3.default : __imp_3;
		const { useLang } = __require("utils/useLang.js");
		const { getOrdersTranslation } = __require("components/UserPages/Orders/Lang.js");
		const getPaymentMethods = (t) => ({
			0: {
				label: t("payCashDesk"),
				icon: featureCashIcon
			},
			CashDeskCash: {
				label: t("payCashDesk"),
				icon: featureCashIcon
			},
			1: {
				label: t("payCardRegister"),
				icon: featureCardIcon
			},
			CashDeskCard: {
				label: t("payCardRegister"),
				icon: featureCardIcon
			},
			2: {
				label: t("payWalletBalance"),
				icon: featureWalletIcon
			},
			OnlineBalance: {
				label: t("payWalletBalance"),
				icon: featureWalletIcon
			},
			3: {
				label: t("payBankCard"),
				icon: featureCardIcon
			},
			OnlineCardDetails: {
				label: t("payBankCard"),
				icon: featureCardIcon
			},
			4: {
				label: t("payStripe"),
				icon: featureStripeIcon
			},
			OnlineStripe: {
				label: t("payStripe"),
				icon: featureStripeIcon
			},
			5: {
				label: t("payGooglePay"),
				icon: featureGPayIcon
			},
			OnlineGooglePay: {
				label: t("payGooglePay"),
				icon: featureGPayIcon
			}
		});
		const getPaymentInfo = (method, t) => {
			if (method === undefined || method === null) {
				return {
					label: t("payCashier"),
					icon: cashierIcon
				};
			}
			const methods = getPaymentMethods(t);
			return methods[method] || {
				label: String(method),
				icon: onlineIcon
			};
		};
		const formatBakuDate = (isoStr) => {
			if (!isoStr) return "—";
			try {
				const d = new Date(isoStr);
				if (isNaN(d.getTime())) return "—";
				const formatter = new Intl.DateTimeFormat("en-GB", {
					timeZone: "Asia/Baku",
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					hour12: false
				});
				const parts = formatter.formatToParts(d);
				const day = parts.find((p) => p.type === "day")?.value || "00";
				const month = parts.find((p) => p.type === "month")?.value || "00";
				const year = parts.find((p) => p.type === "year")?.value || "0000";
				const hour = parts.find((p) => p.type === "hour")?.value || "00";
				const minute = parts.find((p) => p.type === "minute")?.value || "00";
				return `${day}.${month}.${year}, ${hour}:${minute}`;
			} catch {
				return new Date(isoStr).toLocaleDateString("ru-RU");
			}
		};
		const getShortId = (id) => {
			if (!id) return "00000000";
			const str = String(id).replace(/-/g, "");
			return str.slice(0, 8).toUpperCase();
		};
		const getStatusBadge = (status, t) => {
			const s = String(status || "").toLowerCase();
			if (s.includes("paid online") || s === "paid online") {
				return {
					className: "orders-status--paid-online",
					label: t("statusPaidOnline"),
					dotColor: "#10b981"
				};
			}
			if (s.includes("pending")) {
				return {
					className: "orders-status--pending",
					label: t("statusPending"),
					dotColor: "#c5a059"
				};
			}
			if (s.includes("prep") || s.includes("process")) {
				return {
					className: "orders-status--preparing",
					label: t("statusPreparing"),
					dotColor: "#38bdf8"
				};
			}
			if (s.includes("ready")) {
				return {
					className: "orders-status--ready",
					label: t("statusReady"),
					dotColor: "#34d399"
				};
			}
			if (s.includes("cancel")) {
				return {
					className: "orders-status--cancelled",
					label: t("statusCancelled"),
					dotColor: "#c5a059"
				};
			}
			return {
				className: "orders-status--completed",
				label: t("statusCompleted"),
				dotColor: "#22c55e"
			};
		};
		const Orders = () => {
			const lang = useLang();
			const t = (id) => getOrdersTranslation(lang, id);
			const { user } = useAuth();
			const { addItem } = useBasket();
			const navigate = useNavigate();
			const [orders, setOrders] = useState([]);
			const [loading, setLoading] = useState(true);
			const [error, setError] = useState(null);
			const [activeFilter, setActiveFilter] = useState("all");
			const [searchQuery, setSearchQuery] = useState("");
			const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
			const [copiedId, setCopiedId] = useState(null);
			const [toastMessage, setToastMessage] = useState(null);
			const [reorderingId, setReorderingId] = useState(null);
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const showToast = (msg, duration = 3e3) => {
				setToastMessage(msg);
				setTimeout(() => {
					setToastMessage(null);
				}, duration);
			};
			const fetchOrders = async () => {
				setLoading(true);
				setError(null);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/orders/history`);
					if (!res.ok) {
						throw new Error("Failed to load orders history");
					}
					const data = await res.json();
					const list = Array.isArray(data.orders) ? data.orders : [];
					setOrders(list);
				} catch (err) {
					console.error("Error fetching orders:", err);
					setError(err.message || t("loadError"));
				} finally {
					setLoading(false);
				}
			};
			useEffect(() => {
				if (user) {
					fetchOrders();
				}
			}, [user]);
			const handleCopyId = (id) => {
				if (!id) return;
				navigator.clipboard.writeText(id);
				setCopiedId(id);
				showToast(t("copiedToast"));
				setTimeout(() => {
					setCopiedId(null);
				}, 2e3);
			};
			const handleReorder = async (order) => {
				if (!order.items || order.items.length === 0) return;
				setReorderingId(order.id);
				try {
					for (const item of order.items) {
						const prodId = item.productId || item.id;
						const qty = item.quantity || 1;
						for (let q = 0; q < qty; q++) {
							await addItem(prodId);
						}
					}
					showToast(t("reorderSuccess").replace("{count}", order.items.length));
				} catch (err) {
					console.error("Reorder error:", err);
					showToast(t("reorderError"));
				} finally {
					setReorderingId(null);
				}
			};
			const filteredOrders = useMemo(() => {
				return orders.filter((order) => {
					const statusStr = String(order.status || "").toLowerCase();
					if (activeFilter === "pending" && !statusStr.includes("pending")) {
						return false;
					}
					if (activeFilter === "completed" && !statusStr.includes("complete")) {
						return false;
					}
					if (activeFilter === "cancelled" && !statusStr.includes("cancel")) {
						return false;
					}
					if (searchQuery.trim()) {
						const query = searchQuery.toLowerCase().trim();
						const idMatches = String(order.id || "").toLowerCase().includes(query);
						const itemMatches = (order.items || []).some((it) => String(it.name || "").toLowerCase().includes(query));
						const promoMatches = String(order.payment?.promoCode || "").toLowerCase().includes(query);
						return idMatches || itemMatches || promoMatches;
					}
					return true;
				});
			}, [
				orders,
				activeFilter,
				searchQuery
			]);
			return /* @__PURE__ */ __h(motion.div, {
				className: "orders-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "orders-main" }, /* @__PURE__ */ __h("div", { className: "orders-container" }, /* @__PURE__ */ __h(motion.div, {
				className: "orders-hero",
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
			}, /* @__PURE__ */ __h("h1", null, t("title")), /* @__PURE__ */ __h("p", { className: "orders-hero__desc" }, t("subtitle"))), /* @__PURE__ */ __h("div", { className: "orders-controls" }, /* @__PURE__ */ __h("div", { className: "orders-filters" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: `orders-filter-btn ${activeFilter === "all" ? "active" : ""}`,
				onClick: () => setActiveFilter("all")
			}, t("all")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: `orders-filter-btn ${activeFilter === "pending" ? "active" : ""}`,
				onClick: () => setActiveFilter("pending")
			}, t("pending")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: `orders-filter-btn ${activeFilter === "completed" ? "active" : ""}`,
				onClick: () => setActiveFilter("completed")
			}, t("completed")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: `orders-filter-btn ${activeFilter === "cancelled" ? "active" : ""}`,
				onClick: () => setActiveFilter("cancelled")
			}, t("cancelled"))), orders.length > 2 && /* @__PURE__ */ __h("div", { className: "orders-search-box" }, /* @__PURE__ */ __h("svg", {
				className: "orders-search-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("circle", {
				cx: "11",
				cy: "11",
				r: "8"
			}), /* @__PURE__ */ __h("line", {
				x1: "21",
				y1: "21",
				x2: "16.65",
				y2: "16.65"
			})), /* @__PURE__ */ __h("input", {
				type: "text",
				placeholder: t("searchPlaceholder"),
				value: searchQuery,
				onChange: (e) => setSearchQuery(e.target.value),
				className: "orders-search-input"
			}), searchQuery && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "orders-search-clear",
				onClick: () => setSearchQuery("")
			}, "✕"))), loading ? /* @__PURE__ */ __h("div", { className: "orders-loading-state" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "orders-loader-icon"
			}), /* @__PURE__ */ __h("p", null, t("loadingOrders"))) : error ? /* @__PURE__ */ __h("div", { className: "orders-error-state" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "#c5a059",
				strokeWidth: "2",
				width: "36",
				height: "36"
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
			})), /* @__PURE__ */ __h("p", null, error), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm",
				onClick: () => fetchOrders()
			}, t("tryAgain"))) : filteredOrders.length === 0 ? /* @__PURE__ */ __h(motion.div, {
				className: "orders-empty-card",
				initial: {
					opacity: 0,
					scale: .95
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				transition: { duration: .35 }
			}, /* @__PURE__ */ __h("div", { className: "orders-empty-icon" }, /* @__PURE__ */ __h("img", {
				src: cartIcon,
				alt: "No orders",
				className: "orders-empty-icon-img"
			})), /* @__PURE__ */ __h("h3", null, searchQuery ? t("noMatching") : activeFilter !== "all" ? t("noFilterOrders").replace("{filter}", t(activeFilter)) : t("noOrdersYet")), /* @__PURE__ */ __h("p", null, searchQuery ? t("searchHint") : t("emptyHint")), /* @__PURE__ */ __h(Link, {
				to: "/catalog",
				className: "cta-btn sm orders-empty-btn"
			}, /* @__PURE__ */ __h("span", null, t("browseMenu")))) : /* @__PURE__ */ __h(motion.div, {
				className: "orders-list",
				layout: true,
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(AnimatePresence, null, filteredOrders.map((order, idx) => {
				const statusInfo = getStatusBadge(order.status, t);
				const payInfo = getPaymentInfo(order.payment?.paymentMethod, t);
				const shortId = getShortId(order.id);
				const itemCount = (order.items || []).reduce((s, it) => s + (it.quantity || 1), 0);
				const discount = Number(order.payment?.discountAmount || 0);
				const total = Number(order.payment?.totalAmount || 0).toFixed(2);
				const originalTotal = Number(order.payment?.originalTotal || total).toFixed(2);
				const isReordering = reorderingId === order.id;
				return /* @__PURE__ */ __h(motion.div, {
					key: order.id,
					className: "order-card",
					layout: true,
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
						duration: .3,
						delay: idx * .05
					}
				}, /* @__PURE__ */ __h("div", { className: "order-card__header" }, /* @__PURE__ */ __h("div", { className: "order-card__id-group" }, /* @__PURE__ */ __h("div", { className: "order-card__id-badge" }, /* @__PURE__ */ __h("span", { className: "order-card__id" }, shortId), /* @__PURE__ */ __h("button", {
					type: "button",
					className: "order-card__copy-btn",
					onClick: () => handleCopyId(order.id),
					title: t("copyFullId")
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					width: "14",
					height: "14"
				}, /* @__PURE__ */ __h("rect", {
					x: "9",
					y: "9",
					width: "13",
					height: "13",
					rx: "2",
					ry: "2"
				}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })), /* @__PURE__ */ __h("span", null, copiedId === order.id ? t("copied") : t("copy")))), /* @__PURE__ */ __h("span", { className: "order-card__date" }, formatBakuDate(order.createdAt))), /* @__PURE__ */ __h("div", { className: `order-card__status-badge ${statusInfo.className}` }, /* @__PURE__ */ __h("span", {
					className: "order-card__status-dot",
					style: { backgroundColor: statusInfo.dotColor }
				}), /* @__PURE__ */ __h("span", null, statusInfo.label))), /* @__PURE__ */ __h("div", { className: "order-card__items-section" }, /* @__PURE__ */ __h("div", { className: "order-card__items-list" }, (order.items || []).map((item, iIdx) => {
					const unitPrice = Number(item.unitPrice || 0).toFixed(2);
					const itemTotal = (Number(item.unitPrice || 0) * (item.quantity || 1)).toFixed(2);
					return /* @__PURE__ */ __h("div", {
						key: item.productId || iIdx,
						className: "order-card__item-row"
					}, /* @__PURE__ */ __h("div", { className: "order-card__item-thumb" }, item.images?.icon || item.images?.image || item.imageUrl ? /* @__PURE__ */ __h("img", {
						src: item.images?.icon || item.images?.image || item.imageUrl,
						alt: item.name || "Product"
					}) : /* @__PURE__ */ __h("div", { className: "order-card__item-thumb-placeholder" }, "🍽️")), /* @__PURE__ */ __h("div", { className: "order-card__item-info" }, /* @__PURE__ */ __h("div", { className: "order-card__item-name-row" }, /* @__PURE__ */ __h("span", { className: "order-card__item-name" }, item.name || t("artisanCoffee")), item.category && /* @__PURE__ */ __h("span", { className: "order-card__item-category" }, item.category)), /* @__PURE__ */ __h("div", { className: "order-card__item-meta" }, /* @__PURE__ */ __h("span", { className: "order-card__item-qty" }, t("qty"), ": ", item.quantity || 1), /* @__PURE__ */ __h("span", { className: "order-card__item-unit" }, "× ", unitPrice, " ₼"))), /* @__PURE__ */ __h("div", { className: "order-card__item-total" }, itemTotal, " ₼"));
				}))), /* @__PURE__ */ __h("div", { className: "order-card__footer" }, /* @__PURE__ */ __h("div", { className: "order-card__payment-info" }, /* @__PURE__ */ __h("div", { className: "order-card__method-pill" }, /* @__PURE__ */ __h("img", {
					src: payInfo.icon,
					alt: "",
					className: "order-card__method-icon"
				}), /* @__PURE__ */ __h("span", null, payInfo.label)), discount > 0 && /* @__PURE__ */ __h("div", { className: "order-card__discount-pill" }, /* @__PURE__ */ __h("img", {
					src: featurePromoIcon,
					alt: "",
					className: "order-card__method-icon"
				}), /* @__PURE__ */ __h("span", null, t("saved"), " −", discount.toFixed(2), " ₼", order.payment?.promoPrizeName ? ` (${order.payment.promoPrizeName})` : ""))), /* @__PURE__ */ __h("div", { className: "order-card__total-wrap" }, /* @__PURE__ */ __h("span", { className: "order-card__total-label" }, t("totalAmount")), /* @__PURE__ */ __h("span", { className: "order-card__total-value" }, total, " ₼"))), /* @__PURE__ */ __h("div", { className: "order-card__actions" }, /* @__PURE__ */ __h("button", {
					type: "button",
					className: "cta-btn sm order-card__action-btn order-card__action-btn--receipt",
					onClick: () => setSelectedReceiptOrder(order)
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
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
				}), /* @__PURE__ */ __h("polyline", { points: "10 9 9 9 8 9" })), /* @__PURE__ */ __h("span", null, t("receiptDetails"))), /* @__PURE__ */ __h("button", {
					type: "button",
					className: "cta-btn sm order-card__action-btn order-card__action-btn--reorder",
					onClick: () => handleReorder(order),
					disabled: isReordering
				}, isReordering ? /* @__PURE__ */ __h("span", { style: {
					display: "flex",
					alignItems: "center",
					gap: "6px",
					color: "#d4b475"
				} }, /* @__PURE__ */ __h("img", {
					src: loaderIconRed,
					alt: "",
					style: {
						width: "15px",
						height: "15px"
					}
				}), t("adding")) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					width: "16",
					height: "16"
				}, /* @__PURE__ */ __h("path", { d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" })), /* @__PURE__ */ __h("span", null, t("orderAgain"))))));
			}))))), /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen: Boolean(selectedReceiptOrder),
				onClose: () => setSelectedReceiptOrder(null),
				targetBorderRadius: "24px"
			}, selectedReceiptOrder && /* @__PURE__ */ __h("div", { className: "orders-receipt-modal" }, /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__header" }, /* @__PURE__ */ __h("img", {
				src: logo,
				alt: "Süfrano",
				className: "orders-receipt-modal__logo"
			}), /* @__PURE__ */ __h("h3", { className: "orders-receipt-modal__brand" }, t("receiptTitle")), /* @__PURE__ */ __h("p", { className: "orders-receipt-modal__sub" }, t("receiptSub")), /* @__PURE__ */ __h("span", { className: "orders-receipt-modal__divider-line" })), /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__meta" }, /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__meta-row" }, /* @__PURE__ */ __h("span", null, t("receiptNumber")), /* @__PURE__ */ __h("strong", null, getShortId(selectedReceiptOrder.id))), /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__meta-row" }, /* @__PURE__ */ __h("span", null, t("dateTime")), /* @__PURE__ */ __h("span", null, formatBakuDate(selectedReceiptOrder.createdAt)))), /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__items" }, /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__items-header" }, /* @__PURE__ */ __h("span", null, t("itemCol")), /* @__PURE__ */ __h("span", null, t("qtyCol")), /* @__PURE__ */ __h("span", null, t("totalCol"))), (selectedReceiptOrder.items || []).map((it, idx) => /* @__PURE__ */ __h("div", {
				key: it.productId || idx,
				className: "orders-receipt-modal__item-row"
			}, /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__item-desc" }, /* @__PURE__ */ __h("span", { className: "orders-receipt-modal__item-title" }, it.name || t("coffeeItem")), /* @__PURE__ */ __h("span", { className: "orders-receipt-modal__item-sub" }, "@ ", Number(it.unitPrice || 0).toFixed(2), " ₼")), /* @__PURE__ */ __h("span", { className: "orders-receipt-modal__item-qty" }, it.quantity || 1), /* @__PURE__ */ __h("span", { className: "orders-receipt-modal__item-price" }, (Number(it.unitPrice || 0) * (it.quantity || 1)).toFixed(2), " ₼")))), /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__totals" }, /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__totals-row" }, /* @__PURE__ */ __h("span", null, t("subtotal")), /* @__PURE__ */ __h("span", null, Number(selectedReceiptOrder.payment?.originalTotal || selectedReceiptOrder.payment?.totalAmount || 0).toFixed(2), " ₼")), Number(selectedReceiptOrder.payment?.discountAmount || 0) > 0 && /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__totals-row discount" }, /* @__PURE__ */ __h("span", null, t("discount"), " ", selectedReceiptOrder.payment?.promoPrizeName ? `(${selectedReceiptOrder.payment.promoPrizeName})` : ""), /* @__PURE__ */ __h("span", null, "−", Number(selectedReceiptOrder.payment.discountAmount).toFixed(2), " ₼")), /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__totals-row method" }, /* @__PURE__ */ __h("span", null, t("paymentMethod")), /* @__PURE__ */ __h("span", null, getPaymentInfo(selectedReceiptOrder.payment?.paymentMethod, t).label)), /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__totals-row grand-total" }, /* @__PURE__ */ __h("span", null, t("totalPaid")), /* @__PURE__ */ __h("span", null, Number(selectedReceiptOrder.payment?.totalAmount || 0).toFixed(2), " ₼"))), /* @__PURE__ */ __h("div", { className: "orders-receipt-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm orders-receipt-modal__btn orders-receipt-modal__btn--close",
				onClick: () => setSelectedReceiptOrder(null)
			}, t("close")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm orders-receipt-modal__btn orders-receipt-modal__btn--reorder",
				onClick: () => {
					handleReorder(selectedReceiptOrder);
					setSelectedReceiptOrder(null);
				}
			}, t("reorderThis"))))), /* @__PURE__ */ __h("div", { className: "orders-toast-container" }, /* @__PURE__ */ __h(AnimatePresence, null, toastMessage && /* @__PURE__ */ __h(motion.div, {
				className: "orders-toast",
				initial: {
					opacity: 0,
					y: 30,
					scale: .95
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: 20,
					scale: .95
				},
				transition: { duration: .25 }
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "#22c55e",
				strokeWidth: "2",
				width: "18",
				height: "18"
			}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, toastMessage)))), /* @__PURE__ */ __h(Footer, null));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Orders; } });
	});
	//#endregion

	var entryExports = __require("components/UserPages/Orders/Orders.js");
	__pages["orders"] = entryExports.default || entryExports;
})();
