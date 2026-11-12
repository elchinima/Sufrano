(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/UserPages/Order/Lang.js
	__define("components/UserPages/Order/Lang.js", function (exports, __require, module) {
		const translations = {
			az: {
				stepBadge: "Sifariş & Ödəniş",
				heroTitle: "Ödəniş üsulunu seçin",
				heroDesc: "Sifarişiniz üçün necə ödəmək istədiyinizi seçin.",
				emptyBasket: "Səbətiniz boşdur. Sifariş vermək üçün menyudan məhsullar əlavə edin.",
				browseMenu: "Menyuya bax",
				inStoreBadge: "Məkanda təhvil",
				payAtCashier: "Kassada ödəniş",
				payAtCashierCounter: "Kassa piştaxtasında ödəniş",
				cashierDesc: "Təzə hazırlanmış sifarişinizi kassa piştaxtasından götürərkən nağd və ya kartla ödəyin.",
				cashPayment: "Nağd ödəniş",
				cardNfc: "Kart və NFC",
				usePromoCodes: "Promokodlardan istifadə",
				selectedBadge: "✓ Seçildi",
				chooseCashier: "Kassanı seçin",
				instantBadge: "Sürətli və Təmassız",
				payOnline: "Onlayn ödəniş",
				payOnlineInstantly: "Dərhal onlayn ödəyin",
				onlineDesc: "Sifarişinizin dərhal hazırlanması üçün bank kartınız və ya Süfrano balansınızla təhlükəsiz ödəyin.",
				visaMastercard: "Visa və ya Mastercard",
				payViaBalance: "Balansla ödəniş",
				payViaStripe: "Stripe ilə ödəniş",
				googlePay: "Google Pay",
				earnCashback: "Keşbek qazanın",
				chooseOnline: "Onlaynı seçin",
				selectedPayment: "Seçilmiş ödəniş:",
				cashierStepDesc: "Sifarişiniz mətbəxə göndəriləcək və təhvil alarkən məkanda ödənilmək üçün qeyd ediləcək.",
				onlineStepDesc: "Sifarişin dərhal təsdiqlənməsi üçün təhlükəsiz onlayn ödənişə keçilir.",
				changeMethod: "Üsulu dəyiş",
				selectPromo: "Tətbiq olunacaq promokodu seçin:",
				promosAvailable: "{count} ədəd mövcuddur",
				dontUsePromo: "Heç bir promokod istifadə etmə",
				itemsCount: "Məhsullar:",
				itemsSuffix: "məhsul",
				discountLabel: "Endirim:",
				totalToPay: "Ödəniləcək yekun:",
				confirmOrder: "Sifarişi təsdiqlə və rəsmiləşdir",
				continueOnline: "Onlayn ödənişə keç",
				placingOrder: "Sifariş rəsmiləşdirilir...",
				backToBasket: "Səbətə qayıt",
				orderFailed: "Sifarişi rəsmiləşdirmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.",
				orderNetworkError: "Sifariş zamanı xəta baş verdi. Zəhmət olmasa internet bağlantınızı yoxlayın.",
				onlineModalTitle: "Onlayn Ödəniş Xidməti",
				onlineModalDesc: "Ödəniş üsulunu seçin",
				cancel: "Ləğv et",
				payWithBalance: "Balansla ödə",
				continueToPayment: "Ödənişə davam et",
				popularBadge: "Məşhur",
				instantSpeedBadge: "Dərhal",
				cardsBadge: "Kartlar",
				oneTapBadge: "1 Toxunuşla",
				balancePrefix: "Balans:",
				serviceStripeTitle: "Stripe ilə ödəniş",
				serviceStripeDesc: "Sürətli və təhlükəsiz beynəlxalq ödəniş",
				serviceBalanceTitle: "Süfrano Balansı",
				serviceBalanceDesc: "Hesab balansınızdan dərhal ödəniş",
				serviceCardsTitle: "Visa və ya Mastercard",
				serviceCardsDesc: "Debet və ya kredit kartı ilə ödəniş",
				serviceGPayTitle: "Google Pay",
				serviceGPayDesc: "Google Pay ilə bir toxunuşla ödəniş",
				orderSuccessTitle: "Sifariş Uğurla Rəsmiləşdirildi!",
				orderSuccessDesc: "Sifariş mətbəxə göndərildi. Təhvil alarkən sifariş nömrənizi təqdim edin.",
				orderNumberLabel: "Sifariş Nömrəsi",
				mentionAtCounter: "Bunu piştaxtada bildirin",
				promoDiscount: "Promokod endirimi",
				cashbackAdded: "Keşbek əlavə olundu",
				paymentMethodLabel: "Ödəniş üsulu",
				backToMenu: "Menyuya qayıt",
				viewOrders: "Sifarişlərə bax",
				statusPaidOnline: "Onlayn ödənilib",
				statusPendingPayment: "Ödəniş gözlənilir",
				methodStripe: "Stripe",
				methodBalance: "Süfrano Hesab Balansı",
				methodCards: "Visa / Mastercard",
				methodGPay: "Google Pay",
				methodCashierCard: "Kassada ödəniş (Kart / NFC)",
				methodCashierCash: "Kassada ödəniş",
				stripeModalTitle: "Kart və Onlayn Ödəniş",
				stripeAmountToPay: "Ödəniləcək məbləğ:",
				loadingOptions: "Ödəniş seçimləri yüklənir...",
				selectSavedCard: "Yadda saxlanılmış kartı seçin",
				useNewCard: "Yeni kartdan istifadə et",
				chooseFromSaved: "Yadda saxlanılmış kartlardan seç",
				defaultBadge: "ƏSAS",
				payAmount: "Ödə {amount} ₼",
				processing: "İcra olunur...",
				cardNumberLabel: "Kart Nömrəsi",
				expiryDateLabel: "Bitmə Tarixi",
				cvcLabel: "CVC / CVV",
				cardholderLabel: "Kart Sahibi (İxtiyari)",
				cardLabelLabel: "Kartın Adı (İxtiyari)",
				cardholderPlaceholder: "məs. ELCHIN",
				cardLabelPlaceholder: "məs. Maaş Kartı",
				saveCardCheckbox: "Kartı gələcək ödənişlər üçün yadda saxla",
				agreeToRules: "Razıyam: ",
				paymentRulesLink: "Ödəniş Qaydaları",
				paymentErrorTitle: "Ödəniş Xətası",
				errCardNumberRequired: "Kart nömrəsi tələb olunur.",
				errCardNumberDigits: "Kart nömrəsi 16 rəqəmdən ibarət olmalıdır.",
				errCardNumberInvalid: "Yanlış kart nömrəsi.",
				errCardBrandUnsupported: "Yalnız Visa və Mastercard qəbul edilir.",
				errExpiryRequired: "Bitmə tarixi tələb olunur.",
				errExpiryFormat: "Format AA/İİ olmalıdır.",
				errExpiryMonth: "Yanlış ay.",
				errCardExpired: "Kartın vaxtı bitib.",
				errCvcRequired: "CVC tələb olunur.",
				errCvcDigits: "3 rəqəm olmalıdır.",
				errCardholderInvalid: "Zəhmət olmasa düzgün kart sahibi adı daxil edin.",
				errAgreedRequired: "Ödəniş qaydaları ilə razılaşmalısınız.",
				errMaxCardsReached: "Ən çox 3 kart yadda saxlaya bilərsiniz. Zəhmət olmasa \"Yadda saxla\" işarəsini silin və ya mövcud kartı silin.",
				errPaymentFailed: "Ödəniş baş tutmadı. Zəhmət olmasa yenidən cəhd edin.",
				errPaymentCheckInfo: "Ödəniş baş tutmadı. Zəhmət olmasa kart məlumatlarını yoxlayın.",
				errProcessingGeneral: "Ödəniş icrası zamanı xəta baş verdi."
			},
			ru: {
				stepBadge: "Оформление & Оплата",
				heroTitle: "Выберите способ оплаты",
				heroDesc: "Выберите наиболее удобный способ оплаты вашего заказа.",
				emptyBasket: "Ваша корзина пуста. Добавьте товары из меню, чтобы оформить заказ.",
				browseMenu: "В меню",
				inStoreBadge: "Самовывоз",
				payAtCashier: "Оплата на кассе",
				payAtCashierCounter: "Оплата у стойки кассы",
				cashierDesc: "Оплатите наличными или банковской картой при получении свежеприготовленного заказа у стойки ресторана.",
				cashPayment: "Оплата наличными",
				cardNfc: "Карта и NFC",
				usePromoCodes: "Использование промокодов",
				selectedBadge: "✓ Выбрано",
				chooseCashier: "Выбрать кассу",
				instantBadge: "Быстро и бесконтактно",
				payOnline: "Оплатить онлайн",
				payOnlineInstantly: "Мгновенная онлайн-оплата",
				onlineDesc: "Безопасная оплата картой или с баланса Süfrano для немедленного начала приготовления заказа.",
				visaMastercard: "Visa или Mastercard",
				payViaBalance: "Оплата с баланса",
				payViaStripe: "Оплата через Stripe",
				googlePay: "Google Pay",
				earnCashback: "Получайте кешбэк",
				chooseOnline: "Выбрать онлайн",
				selectedPayment: "Выбранный способ:",
				cashierStepDesc: "Ваш заказ будет отправлен на кухню и отмечен для оплаты при получении в ресторане.",
				onlineStepDesc: "Переход к безопасной онлайн-оплате для моментального подтверждения заказа.",
				changeMethod: "Изменить",
				selectPromo: "Выберите промокод:",
				promosAvailable: "доступно: {count}",
				dontUsePromo: "Не использовать промокод",
				itemsCount: "Товары:",
				itemsSuffix: "тов.",
				discountLabel: "Скидка:",
				totalToPay: "Итого к оплате:",
				confirmOrder: "Подтвердить и заказать",
				continueOnline: "Перейти к онлайн-оплате",
				placingOrder: "Оформление заказа...",
				backToBasket: "Назад в корзину",
				orderFailed: "Не удалось оформить заказ. Пожалуйста, попробуйте снова.",
				orderNetworkError: "Произошла ошибка при оформлении заказа. Проверьте интернет-соединение.",
				onlineModalTitle: "Онлайн-сервис оплаты",
				onlineModalDesc: "Выберите способ оплаты",
				cancel: "Отмена",
				payWithBalance: "Оплатить с баланса",
				continueToPayment: "Продолжить к оплате",
				popularBadge: "Популярно",
				instantSpeedBadge: "Мгновенно",
				cardsBadge: "Карты",
				oneTapBadge: "В 1 клик",
				balancePrefix: "Баланс:",
				serviceStripeTitle: "Оплата через Stripe",
				serviceStripeDesc: "Быстрая и безопасная международная оплата",
				serviceBalanceTitle: "Баланс Süfrano",
				serviceBalanceDesc: "Моментальная оплата с вашего счета Süfrano",
				serviceCardsTitle: "Visa или Mastercard",
				serviceCardsDesc: "Оплата дебетовой или кредитной картой",
				serviceGPayTitle: "Google Pay",
				serviceGPayDesc: "Оплата в одно касание через Google Pay",
				orderSuccessTitle: "Заказ успешно оформлен!",
				orderSuccessDesc: "Заказ отправлен на кухню. Назовите номер заказа при получении.",
				orderNumberLabel: "Номер заказа",
				mentionAtCounter: "Назовите этот номер на кассе",
				promoDiscount: "Скидка по промокоду",
				cashbackAdded: "Начислен кешбэк",
				paymentMethodLabel: "Способ оплаты",
				backToMenu: "В меню",
				viewOrders: "Мои заказы",
				statusPaidOnline: "Оплачено онлайн",
				statusPendingPayment: "Ожидает оплаты",
				methodStripe: "Stripe",
				methodBalance: "Баланс аккаунта Süfrano",
				methodCards: "Visa / Mastercard",
				methodGPay: "Google Pay",
				methodCashierCard: "Оплата на кассе (Карта / NFC)",
				methodCashierCash: "Оплата на кассе",
				stripeModalTitle: "Оплата картой онлайн",
				stripeAmountToPay: "Сумма к оплате:",
				loadingOptions: "Загрузка вариантов оплаты...",
				selectSavedCard: "Выберите сохраненную карту",
				useNewCard: "Новая карта",
				chooseFromSaved: "Выбрать из сохраненных карт",
				defaultBadge: "ОСНОВНАЯ",
				payAmount: "Оплатить {amount} ₼",
				processing: "Обработка...",
				cardNumberLabel: "Номер карты",
				expiryDateLabel: "Срок действия",
				cvcLabel: "CVC / CVV",
				cardholderLabel: "Имя на карте (необязательно)",
				cardLabelLabel: "Название карты (необязательно)",
				cardholderPlaceholder: "напр. ELCHIN",
				cardLabelPlaceholder: "напр. Зарплатная",
				saveCardCheckbox: "Сохранить карту для будущих платежей",
				agreeToRules: "Согласен с ",
				paymentRulesLink: "Правилами оплаты",
				paymentErrorTitle: "Ошибка оплаты",
				errCardNumberRequired: "Введите номер карты.",
				errCardNumberDigits: "Номер карты должен состоять из 16 цифр.",
				errCardNumberInvalid: "Неверный номер карты.",
				errCardBrandUnsupported: "Принимаются только Visa и Mastercard.",
				errExpiryRequired: "Укажите срок действия карты.",
				errExpiryFormat: "Формат должен быть ММ/ГГ.",
				errExpiryMonth: "Неверный месяц.",
				errCardExpired: "Срок действия карты истек.",
				errCvcRequired: "Введите CVC/CVV код.",
				errCvcDigits: "Должно быть 3 цифры.",
				errCardholderInvalid: "Введите корректное имя владельца карты.",
				errAgreedRequired: "Необходимо согласиться с правилами оплаты.",
				errMaxCardsReached: "Можно сохранить не более 3 карт. Снимите галочку «Сохранить карту» или удалите одну из существующих.",
				errPaymentFailed: "Не удалось провести оплату. Попробуйте снова.",
				errPaymentCheckInfo: "Оплата не прошла. Пожалуйста, проверьте данные карты.",
				errProcessingGeneral: "Произошла ошибка при обработке платежа."
			},
			en: {
				stepBadge: "Checkout & Payment",
				heroTitle: "Choose Payment Method",
				heroDesc: "Select how you would like to pay for your order.",
				emptyBasket: "Your basket is empty. Add items from the menu to place an order.",
				browseMenu: "Browse Menu",
				inStoreBadge: "In-Store Pickup",
				payAtCashier: "Pay at Cashier",
				payAtCashierCounter: "Pay at Cashier Counter",
				cashierDesc: "Pay with cash or bank card in person when you pick up your fresh order at the restaurant counter.",
				cashPayment: "Cash Payment",
				cardNfc: "Card & NFC",
				usePromoCodes: "Use Promo Codes",
				selectedBadge: "✓ Selected",
				chooseCashier: "Choose Cashier",
				instantBadge: "Instant & Contactless",
				payOnline: "Pay Online",
				payOnlineInstantly: "Pay Online Instantly",
				onlineDesc: "Pay securely online with your credit/debit card or Süfrano balance for immediate preparation.",
				visaMastercard: "Visa or Mastercard",
				payViaBalance: "Pay via Balance",
				payViaStripe: "Pay via Stripe",
				googlePay: "Google Pay",
				earnCashback: "Earn Cashback",
				chooseOnline: "Choose Online",
				selectedPayment: "Selected Payment:",
				cashierStepDesc: "Your order will be sent to the kitchen and marked for in-store payment upon pickup.",
				onlineStepDesc: "Proceeding with secure online payment for immediate order confirmation.",
				changeMethod: "Change Method",
				selectPromo: "Select Promo Code to Apply:",
				promosAvailable: "{count} available",
				dontUsePromo: "Don't use any promo code",
				itemsCount: "Items:",
				itemsSuffix: "items",
				discountLabel: "Discount:",
				totalToPay: "Total to Pay:",
				confirmOrder: "Confirm & Place Order",
				continueOnline: "Continue to Online Payment",
				placingOrder: "Placing Order...",
				backToBasket: "Back to Basket",
				orderFailed: "Failed to place order. Please try again.",
				orderNetworkError: "An error occurred while placing your order. Please check your connection.",
				onlineModalTitle: "Online Payment Service",
				onlineModalDesc: "Select a payment method",
				cancel: "Cancel",
				payWithBalance: "Pay with Balance",
				continueToPayment: "Continue to Payment",
				popularBadge: "Popular",
				instantSpeedBadge: "Instant",
				cardsBadge: "Cards",
				oneTapBadge: "1-Tap",
				balancePrefix: "Balance:",
				serviceStripeTitle: "Pay with Stripe",
				serviceStripeDesc: "Fast and secure international payment",
				serviceBalanceTitle: "Süfrano Balance",
				serviceBalanceDesc: "Instant payment from your account balance",
				serviceCardsTitle: "Visa or Mastercard",
				serviceCardsDesc: "Debit or credit card payment",
				serviceGPayTitle: "Google Pay",
				serviceGPayDesc: "One-tap checkout with Google Pay",
				orderSuccessTitle: "Order Placed Successfully!",
				orderSuccessDesc: "Order sent to kitchen. Show your order number at the counter.",
				orderNumberLabel: "Order Number",
				mentionAtCounter: "Mention this at counter",
				promoDiscount: "Promo Discount",
				cashbackAdded: "Cashback Added",
				paymentMethodLabel: "Payment Method",
				backToMenu: "Back to Menu",
				viewOrders: "View Orders",
				statusPaidOnline: "Paid Online",
				statusPendingPayment: "Pending Payment",
				methodStripe: "Stripe",
				methodBalance: "Süfrano Account Balance",
				methodCards: "Visa / Mastercard",
				methodGPay: "Google Pay",
				methodCashierCard: "Pay at Cashier (Card / NFC)",
				methodCashierCash: "Pay at Cashier",
				stripeModalTitle: "Card & Online Payment",
				stripeAmountToPay: "Amount to pay:",
				loadingOptions: "Loading payment options...",
				selectSavedCard: "Select Saved Card",
				useNewCard: "Use New Card",
				chooseFromSaved: "Choose from saved cards",
				defaultBadge: "DEFAULT",
				payAmount: "Pay {amount} ₼",
				processing: "Processing...",
				cardNumberLabel: "Card Number",
				expiryDateLabel: "Expiry Date",
				cvcLabel: "CVC / CVV",
				cardholderLabel: "Cardholder (Optional)",
				cardLabelLabel: "Card Label (Optional)",
				cardholderPlaceholder: "e.g. ELCHIN",
				cardLabelPlaceholder: "e.g. Salary Card",
				saveCardCheckbox: "Save card for future payments",
				agreeToRules: "Agree to ",
				paymentRulesLink: "Payment Rules",
				paymentErrorTitle: "Payment Error",
				errCardNumberRequired: "Card number is required.",
				errCardNumberDigits: "Card number must be 16 digits.",
				errCardNumberInvalid: "Invalid card number.",
				errCardBrandUnsupported: "Only Visa and Mastercard are accepted.",
				errExpiryRequired: "Expiry date is required.",
				errExpiryFormat: "Format must be MM/YY.",
				errExpiryMonth: "Invalid month.",
				errCardExpired: "Card has expired.",
				errCvcRequired: "CVC is required.",
				errCvcDigits: "Must be 3 digits.",
				errCardholderInvalid: "Please enter a valid cardholder name.",
				errAgreedRequired: "You must agree to the payment rules.",
				errMaxCardsReached: "You can only save up to 3 payment cards. Please uncheck \"Save card\" or delete an existing card.",
				errPaymentFailed: "Payment failed. Please try again.",
				errPaymentCheckInfo: "Payment failed. Please check your card information.",
				errProcessingGeneral: "An error occurred during payment processing."
			}
		};
		const getOrderTranslation = (lang, id) => {
			return translations[lang]?.[id] || translations.az?.[id] || translations.en?.[id] || id;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getOrderTranslation", { enumerable: true, get: function () { return getOrderTranslation; } });
	});
	//#endregion

	//#region components/UserPages/Order/StripePaymentModal.js
	__define("components/UserPages/Order/StripePaymentModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useMemo } = __imp_0;
		const { Link } = __require("utils/router.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const featureCardVisaMcIcon = "/assets/icons/feature-card-visa-mc.svg";
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { useLang } = __require("utils/useLang.js");
		const { getOrderTranslation } = __require("components/UserPages/Order/Lang.js");
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/UserPages/PaymentMethods/PaymentErrorModal.js");
		const PaymentErrorModal = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const checkLuhn = (numStr) => {
			let sum = 0;
			let alternate = false;
			for (let i = numStr.length - 1; i >= 0; i--) {
				let n = parseInt(numStr.charAt(i), 10);
				if (isNaN(n)) return false;
				if (alternate) {
					n *= 2;
					if (n > 9) n -= 9;
				}
				sum += n;
				alternate = !alternate;
			}
			return sum % 10 === 0;
		};
		const getCardBrand = (digits) => {
			if (!digits) return null;
			if (digits.startsWith("4")) return "Visa";
			if (digits.length >= 2) {
				const firstTwo = parseInt(digits.slice(0, 2), 10);
				if (firstTwo >= 51 && firstTwo <= 55) return "Mastercard";
			}
			if (digits.length >= 4) {
				const firstFour = parseInt(digits.slice(0, 4), 10);
				if (firstFour >= 2221 && firstFour <= 2720) return "Mastercard";
			}
			return null;
		};
		const StripePaymentModal = ({ isOpen, onClose, serviceId, finalAmount, promoCode, onOrderSuccess }) => {
			const lang = useLang();
			const t = (id, params) => {
				let str = getOrderTranslation(lang, id);
				if (params && typeof str === "string") {
					Object.entries(params).forEach(([key, val]) => {
						str = str.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
					});
				}
				return str;
			};
			const [savedCards, setSavedCards] = useState([]);
			const [loadingCards, setLoadingCards] = useState(true);
			const [viewMode, setViewMode] = useState("select");
			const [selectedCardId, setSelectedCardId] = useState(null);
			const [cardNumber, setCardNumber] = useState("");
			const [expiryDate, setExpiryDate] = useState("");
			const [cvc, setCvc] = useState("");
			const [cardholderName, setCardholderName] = useState("");
			const [cardName, setCardName] = useState("");
			const [saveCard, setSaveCard] = useState(true);
			const [agreedToRules, setAgreedToRules] = useState(false);
			const [errors, setErrors] = useState({});
			const [touched, setTouched] = useState({});
			const [isProcessing, setIsProcessing] = useState(false);
			const [errorMessage, setErrorMessage] = useState("");
			const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const fetchCards = async () => {
				setLoadingCards(true);
				try {
					let res = await fetchWithRefresh(`${apiUrl}/api/payment-methods`);
					if (!res.ok && res.status === 404) {
						res = await fetchWithRefresh(`${apiUrl}/api/paymentmethods`);
					}
					if (res.ok) {
						const data = await res.json();
						const list = Array.isArray(data) ? data : [];
						setSavedCards(list);
						if (list.length > 0) {
							const def = list.find((c) => c.isDefault || c.IsDefault) || list[0];
							const defId = def.id !== undefined && def.id !== null ? def.id : def.Id;
							setSelectedCardId(defId);
							setViewMode("select");
						} else {
							setViewMode("new");
						}
					} else {
						console.warn("Failed to fetch payment methods in modal:", res.status);
						setViewMode("new");
					}
				} catch (err) {
					console.error("Error fetching payment methods in modal:", err);
					setViewMode("new");
				} finally {
					setLoadingCards(false);
				}
			};
			useEffect(() => {
				if (isOpen) {
					setCardNumber("");
					setExpiryDate("");
					setCvc("");
					setCardholderName("");
					setCardName("");
					setSaveCard(true);
					setAgreedToRules(false);
					setErrors({});
					setTouched({});
					setErrorMessage("");
					setIsProcessing(false);
					fetchCards();
				}
			}, [isOpen]);
			const cleanDigits = useMemo(() => cardNumber.replace(/\D/g, ""), [cardNumber]);
			const brand = useMemo(() => getCardBrand(cleanDigits), [cleanDigits]);
			const handleCardNumberChange = (e) => {
				const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
				const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
				setCardNumber(formatted);
			};
			const handleExpiryChange = (e) => {
				let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
				if (raw.length >= 2) {
					raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
				}
				setExpiryDate(raw);
			};
			const handleCvcChange = (e) => {
				const raw = e.target.value.replace(/\D/g, "").slice(0, 3);
				setCvc(raw);
			};
			const handleCardholderChange = (e) => {
				const val = e.target.value.toUpperCase();
				setCardholderName(val);
			};
			const handleBlur = (field) => {
				setTouched((prev) => ({
					...prev,
					[field]: true
				}));
			};
			const validateNewCardForm = () => {
				const newErrors = {};
				if (!cleanDigits) {
					newErrors.cardNumber = t("errCardNumberRequired");
				} else if (cleanDigits.length !== 16) {
					newErrors.cardNumber = t("errCardNumberDigits");
				} else if (!checkLuhn(cleanDigits)) {
					newErrors.cardNumber = t("errCardNumberInvalid");
				} else if (!brand) {
					newErrors.cardNumber = t("errCardBrandUnsupported");
				}
				if (!expiryDate) {
					newErrors.expiryDate = t("errExpiryRequired");
				} else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
					newErrors.expiryDate = t("errExpiryFormat");
				} else {
					const [m, y] = expiryDate.split("/").map((x) => parseInt(x, 10));
					if (m < 1 || m > 12) {
						newErrors.expiryDate = t("errExpiryMonth");
					} else {
						const now = new Date();
						const currentYear = now.getFullYear() % 100;
						const currentMonth = now.getMonth() + 1;
						if (y < currentYear || y === currentYear && m < currentMonth) {
							newErrors.expiryDate = t("errCardExpired");
						}
					}
				}
				if (!cvc) {
					newErrors.cvc = t("errCvcRequired");
				} else if (cvc.length !== 3) {
					newErrors.cvc = t("errCvcDigits");
				}
				if (cardholderName && cardholderName.trim().length < 3) {
					newErrors.cardholderName = t("errCardholderInvalid");
				}
				if (!agreedToRules) {
					newErrors.agreedToRules = t("errAgreedRequired");
				}
				setErrors(newErrors);
				return Object.keys(newErrors).length === 0;
			};
			const handlePayWithSavedCard = async (e) => {
				e.preventDefault();
				if (selectedCardId === null || selectedCardId === undefined || isProcessing) return;
				setIsProcessing(true);
				setErrorMessage("");
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/orders/cashier`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							paymentMethod: "OnlineCardDetails",
							promoCode
						})
					});
					const data = await res.json();
					if (res.ok && data.success) {
						onOrderSuccess(data);
					} else {
						const msg = data.message || t("errPaymentFailed");
						setErrorMessage(msg);
						setIsErrorModalOpen(true);
					}
				} catch (err) {
					const msg = err.message || t("errProcessingGeneral");
					setErrorMessage(msg);
					setIsErrorModalOpen(true);
				} finally {
					setIsProcessing(false);
				}
			};
			const handlePayWithNewCard = async (e) => {
				e.preventDefault();
				setTouched({
					cardNumber: true,
					expiryDate: true,
					cvc: true,
					cardholderName: true,
					agreedToRules: true
				});
				if (!validateNewCardForm() || isProcessing) return;
				setIsProcessing(true);
				setErrorMessage("");
				try {
					if (saveCard) {
						if (savedCards.length >= 3) {
							setErrorMessage(t("errMaxCardsReached"));
							setIsErrorModalOpen(true);
							setIsProcessing(false);
							return;
						}
						try {
							const saveRes = await fetchWithRefresh(`${apiUrl}/api/payment-methods`, {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									cardNumber: cleanDigits,
									expiryDate: expiryDate.trim(),
									cvc: cvc.trim(),
									cardholderName: cardholderName.trim(),
									cardName: cardName.trim() || undefined,
									isDefault: savedCards.length === 0
								})
							});
							if (!saveRes.ok) {
								const errData = await saveRes.json().catch(() => ({}));
								if (errData.message) {
									setErrorMessage(errData.message);
									setIsErrorModalOpen(true);
									setIsProcessing(false);
									return;
								}
							}
						} catch (saveErr) {
							console.error("Failed to save card:", saveErr);
						}
					}
					const orderRes = await fetchWithRefresh(`${apiUrl}/api/orders/cashier`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							paymentMethod: "OnlineCardDetails",
							promoCode
						})
					});
					const orderData = await orderRes.json();
					if (orderRes.ok && orderData.success) {
						onOrderSuccess(orderData);
					} else {
						const msg = orderData.message || t("errPaymentCheckInfo");
						setErrorMessage(msg);
						setIsErrorModalOpen(true);
					}
				} catch (err) {
					const msg = err.message || t("errProcessingGeneral");
					setErrorMessage(msg);
					setIsErrorModalOpen(true);
				} finally {
					setIsProcessing(false);
				}
			};
			const isNewCardValid = cleanDigits.length === 16 && brand && expiryDate.length === 5 && cvc.length === 3 && agreedToRules;
			return /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose,
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "stripe-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "stripe-modal__close",
				onClick: onClose,
				disabled: isProcessing,
				"aria-label": "Close modal"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("line", {
				x1: "18",
				y1: "6",
				x2: "6",
				y2: "18"
			}), /* @__PURE__ */ __h("line", {
				x1: "6",
				y1: "6",
				x2: "18",
				y2: "18"
			}))), /* @__PURE__ */ __h("div", { className: "stripe-modal__header" }, /* @__PURE__ */ __h("div", { className: "stripe-modal__icon" }, /* @__PURE__ */ __h("img", {
				src: featureCardVisaMcIcon,
				alt: "Card Payment"
			})), /* @__PURE__ */ __h("h3", { className: "stripe-modal__title" }, t("stripeModalTitle")), /* @__PURE__ */ __h("p", { className: "stripe-modal__desc" }, t("stripeAmountToPay"), " ", /* @__PURE__ */ __h("span", { className: "stripe-modal__amount" }, finalAmount, " ₼"))), loadingCards ? /* @__PURE__ */ __h("div", { className: "stripe-modal__loading" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading",
				className: "stripe-spinner-lg"
			}), /* @__PURE__ */ __h("p", null, t("loadingOptions"))) : viewMode === "select" && savedCards.length > 0 ? /* @__PURE__ */ __h("form", {
				onSubmit: handlePayWithSavedCard,
				className: "saved-cards-form"
			}, /* @__PURE__ */ __h("div", { className: "saved-cards-header-row" }, /* @__PURE__ */ __h("span", { className: "saved-cards-header-title" }, t("selectSavedCard")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "add-new-card-link-btn",
				onClick: () => setViewMode("new"),
				disabled: isProcessing
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5"
			}, /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "5",
				x2: "12",
				y2: "19"
			}), /* @__PURE__ */ __h("line", {
				x1: "5",
				y1: "12",
				x2: "19",
				y2: "12"
			})), /* @__PURE__ */ __h("span", null, t("useNewCard")))), /* @__PURE__ */ __h("div", { className: "saved-cards-list" }, savedCards.map((card) => {
				const id = card.id !== undefined && card.id !== null ? card.id : card.Id;
				const isSelected = String(selectedCardId) === String(id);
				const isDef = card.isDefault || card.IsDefault;
				const cardBrand = (card.cardBrand || card.CardBrand || "Card").toLowerCase();
				const last4 = id !== undefined && id !== null ? String(id).padStart(4, "0") : "••••";
				const title = card.cardName || card.CardName || (cardBrand === "visa" ? "Visa Card" : cardBrand === "mastercard" ? "Mastercard" : "Bank Card");
				const expiry = card.expiryDate || card.ExpiryDate || "MM/YY";
				return /* @__PURE__ */ __h("div", {
					key: id,
					className: `saved-card-item ${isSelected ? "selected" : ""}`,
					onClick: () => setSelectedCardId(id)
				}, /* @__PURE__ */ __h("div", { className: "saved-card-item__radio" }, /* @__PURE__ */ __h("span", { className: `saved-card-radio-circle ${isSelected ? "active" : ""}` }, isSelected && /* @__PURE__ */ __h("span", { className: "saved-card-radio-dot" }))), /* @__PURE__ */ __h("div", { className: `saved-card-item__icon-badge saved-card-item__icon-badge--${cardBrand}` }, cardBrand === "visa" ? "VISA" : cardBrand === "mastercard" ? "MC" : "CARD"), /* @__PURE__ */ __h("div", { className: "saved-card-item__info" }, /* @__PURE__ */ __h("div", { className: "saved-card-item__title-row" }, /* @__PURE__ */ __h("span", { className: "saved-card-item__title" }, title), isDef && /* @__PURE__ */ __h("span", { className: "saved-card-item__badge-default" }, t("defaultBadge"))), /* @__PURE__ */ __h("div", { className: "saved-card-item__sub-row" }, /* @__PURE__ */ __h("span", { className: "saved-card-item__number" }, "•••• ", last4), /* @__PURE__ */ __h("span", { className: "saved-card-item__expiry" }, expiry))));
			})), /* @__PURE__ */ __h("div", { className: "stripe-checkout-actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm stripe-modal-btn stripe-modal-btn--cancel",
				onClick: onClose,
				disabled: isProcessing
			}, t("cancel")), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "cta-btn sm stripe-modal-btn stripe-modal-btn--submit",
				disabled: selectedCardId === null || selectedCardId === undefined || isProcessing
			}, isProcessing ? /* @__PURE__ */ __h("span", { className: "stripe-btn-loading" }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Loading",
				className: "stripe-spinner"
			}), t("processing")) : t("payAmount", { amount: finalAmount })))) : /* @__PURE__ */ __h("form", {
				onSubmit: handlePayWithNewCard,
				className: "new-card-form",
				noValidate: true
			}, savedCards.length > 0 && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "back-to-saved-link",
				onClick: () => setViewMode("select"),
				disabled: isProcessing
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("line", {
				x1: "19",
				y1: "12",
				x2: "5",
				y2: "12"
			}), /* @__PURE__ */ __h("polyline", { points: "12 19 5 12 12 5" })), /* @__PURE__ */ __h("span", null, t("chooseFromSaved"))), /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "checkout-card-number" }, t("cardNumberLabel")), /* @__PURE__ */ __h("div", { className: "input-with-brand" }, /* @__PURE__ */ __h("input", {
				id: "checkout-card-number",
				type: "text",
				inputMode: "numeric",
				placeholder: "4123 4567 8901 2345",
				value: cardNumber,
				onChange: handleCardNumberChange,
				onBlur: () => handleBlur("cardNumber"),
				className: `form-input ${touched.cardNumber && errors.cardNumber ? "error" : ""}`,
				autoComplete: "cc-number",
				disabled: isProcessing
			}), /* @__PURE__ */ __h("div", { className: "brand-indicator" }, brand === "Visa" && /* @__PURE__ */ __h("span", { className: "badge-visa" }, "VISA"), brand === "Mastercard" && /* @__PURE__ */ __h("span", { className: "badge-mc" }, "MC"))), touched.cardNumber && errors.cardNumber && /* @__PURE__ */ __h("span", { className: "error-text" }, errors.cardNumber)), /* @__PURE__ */ __h("div", { className: "form-row" }, /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "checkout-card-expiry" }, t("expiryDateLabel")), /* @__PURE__ */ __h("input", {
				id: "checkout-card-expiry",
				type: "text",
				inputMode: "numeric",
				placeholder: "MM/YY",
				value: expiryDate,
				onChange: handleExpiryChange,
				onBlur: () => handleBlur("expiryDate"),
				className: `form-input ${touched.expiryDate && errors.expiryDate ? "error" : ""}`,
				autoComplete: "cc-exp",
				disabled: isProcessing
			}), touched.expiryDate && errors.expiryDate && /* @__PURE__ */ __h("span", { className: "error-text" }, errors.expiryDate)), /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "checkout-card-cvc" }, t("cvcLabel")), /* @__PURE__ */ __h("input", {
				id: "checkout-card-cvc",
				type: "password",
				inputMode: "numeric",
				placeholder: "•••",
				value: cvc,
				onChange: handleCvcChange,
				onBlur: () => handleBlur("cvc"),
				className: `form-input ${touched.cvc && errors.cvc ? "error" : ""}`,
				autoComplete: "cc-csc",
				disabled: isProcessing
			}), touched.cvc && errors.cvc && /* @__PURE__ */ __h("span", { className: "error-text" }, errors.cvc))), /* @__PURE__ */ __h("div", { className: "form-row" }, /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "checkout-cardholder-name" }, t("cardholderLabel")), /* @__PURE__ */ __h("input", {
				id: "checkout-cardholder-name",
				type: "text",
				placeholder: t("cardholderPlaceholder"),
				value: cardholderName,
				onChange: handleCardholderChange,
				onBlur: () => handleBlur("cardholderName"),
				className: "form-input",
				autoComplete: "cc-name",
				disabled: isProcessing
			})), /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { htmlFor: "checkout-card-label" }, t("cardLabelLabel")), /* @__PURE__ */ __h("input", {
				id: "checkout-card-label",
				type: "text",
				placeholder: t("cardLabelPlaceholder"),
				value: cardName,
				onChange: (e) => setCardName(e.target.value),
				className: "form-input",
				disabled: isProcessing
			}))), /* @__PURE__ */ __h("div", { className: "checkboxes-row" }, /* @__PURE__ */ __h("label", { className: "custom-checkbox-label" }, /* @__PURE__ */ __h("input", {
				type: "checkbox",
				checked: saveCard,
				onChange: (e) => setSaveCard(e.target.checked),
				disabled: isProcessing
			}), /* @__PURE__ */ __h("span", { className: "checkbox-box" }), /* @__PURE__ */ __h("span", { className: "checkbox-text" }, t("saveCardCheckbox"))), /* @__PURE__ */ __h("label", { className: "custom-checkbox-label terms-label" }, /* @__PURE__ */ __h("input", {
				type: "checkbox",
				checked: agreedToRules,
				onChange: (e) => {
					setAgreedToRules(e.target.checked);
					if (e.target.checked) {
						setErrors((prev) => ({
							...prev,
							agreedToRules: null
						}));
					}
				},
				disabled: isProcessing
			}), /* @__PURE__ */ __h("span", { className: "checkbox-box" }), /* @__PURE__ */ __h("span", { className: "checkbox-text" }, t("agreeToRules"), " ", /* @__PURE__ */ __h(Link, {
				to: "/rules",
				target: "_blank",
				rel: "noopener noreferrer",
				className: "terms-link"
			}, t("paymentRulesLink"))))), touched.agreedToRules && errors.agreedToRules && /* @__PURE__ */ __h("span", {
				className: "error-text",
				style: {
					marginTop: "-4px",
					display: "block"
				}
			}, errors.agreedToRules), /* @__PURE__ */ __h("div", { className: "stripe-checkout-actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm stripe-modal-btn stripe-modal-btn--cancel",
				onClick: onClose,
				disabled: isProcessing
			}, t("cancel")), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "cta-btn sm stripe-modal-btn stripe-modal-btn--submit",
				disabled: !isNewCardValid || isProcessing
			}, isProcessing ? /* @__PURE__ */ __h("span", { className: "stripe-btn-loading" }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Loading",
				className: "stripe-spinner"
			}), t("processing")) : t("payAmount", { amount: finalAmount })))))), /* @__PURE__ */ __h(PaymentErrorModal, {
				isOpen: isErrorModalOpen,
				onClose: () => setIsErrorModalOpen(false),
				message: errorMessage,
				title: t("paymentErrorTitle")
			}));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return StripePaymentModal; } });
	});
	//#endregion

	//#region components/UserPages/Order/Order.js
	__define("components/UserPages/Order/Order.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useRef, useMemo } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { Link, useNavigate, useLocation } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { useBasket } = __require("context/BasketContext.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { useLang } = __require("utils/useLang.js");
		const { getOrderTranslation } = __require("components/UserPages/Order/Lang.js");
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const featureCashIcon = "/assets/icons/feature-cash.svg";
		const featureWalletIcon = "/assets/icons/feature-wallet.svg";
		const featureCardVisaMcIcon = "/assets/icons/feature-card-visa-mc.svg";
		const featureStripeIcon = "/assets/icons/feature-stripe.svg";
		const featureGPayIcon = "/assets/icons/feature-gpay.svg";
		const featureCashbackIcon = "/assets/icons/feature-cashback.svg";
		const featureNfcIcon = "/assets/icons/feature-nfc.svg";
		const featurePromoIcon = "/assets/icons/feature-promo.svg";
		const cashierIcon = "/assets/icons/cashier-register.svg";
		const onlineIcon = "/assets/icons/online-card.svg";
		const __imp_1 = __require("components/Footer/Footer.js");
		const Footer = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const __imp_3 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_3.default !== undefined ? __imp_3.default : __imp_3;
		const StripePaymentModal = React.lazy(() => Promise.resolve(__require("components/UserPages/Order/StripePaymentModal.js")));
		const springTransition = {
			type: "spring",
			stiffness: 280,
			damping: 24
		};
		const smoothEase = [
			.16,
			1,
			.3,
			1
		];
		const cardVariants = {
			hidden: {
				opacity: 0,
				y: 28,
				scale: .96
			},
			visible: (i) => ({
				opacity: 1,
				y: 0,
				scale: 1,
				transition: {
					delay: .1 + i * .1,
					duration: .45,
					ease: smoothEase
				}
			})
		};
		const stepPanelVariants = {
			hidden: {
				opacity: 0,
				y: 20,
				scale: .98
			},
			visible: {
				opacity: 1,
				y: 0,
				scale: 1,
				transition: {
					duration: .4,
					ease: smoothEase
				}
			},
			exit: {
				opacity: 0,
				y: 12,
				scale: .98,
				transition: {
					duration: .25,
					ease: [
						.4,
						0,
						1,
						1
					]
				}
			}
		};
		const FeaturePill = ({ icon, label }) => /* @__PURE__ */ __h("span", { className: "feature-pill" }, /* @__PURE__ */ __h("img", {
			src: icon,
			alt: "",
			className: "feature-pill__icon"
		}), /* @__PURE__ */ __h("span", null, label));
		const getOnlinePaymentServices = (t) => [
			{
				id: "OnlineStripe",
				name: "Stripe",
				title: t("serviceStripeTitle"),
				desc: t("serviceStripeDesc"),
				icon: featureStripeIcon,
				badge: t("popularBadge")
			},
			{
				id: "OnlineBalance",
				name: "Süfrano Balance",
				title: t("serviceBalanceTitle"),
				desc: t("serviceBalanceDesc"),
				icon: featureWalletIcon,
				badge: t("instantSpeedBadge"),
				isBalance: true
			},
			{
				id: "OnlineCardDetails",
				name: "Visa & Mastercard",
				title: t("serviceCardsTitle"),
				desc: t("serviceCardsDesc"),
				icon: featureCardVisaMcIcon,
				badge: t("cardsBadge")
			},
			{
				id: "OnlineGooglePay",
				name: "Google Pay",
				title: t("serviceGPayTitle"),
				desc: t("serviceGPayDesc"),
				icon: featureGPayIcon,
				badge: t("oneTapBadge")
			}
		];
		const Order = () => {
			const lang = useLang();
			const t = (id, params) => {
				let str = getOrderTranslation(lang, id);
				if (params && typeof str === "string") {
					Object.entries(params).forEach(([key, val]) => {
						str = str.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
					});
				}
				return str;
			};
			const onlineServices = useMemo(() => getOnlinePaymentServices(t), [lang]);
			const { user, updateUser } = useAuth();
			const { items, clearBasket } = useBasket();
			const location = useLocation();
			const navigate = useNavigate();
			const [products, setProducts] = useState({});
			const [productsLoading, setProductsLoading] = useState(true);
			const [userPromos, setUserPromos] = useState([]);
			const [selectedPromoCode, setSelectedPromoCode] = useState(location.state?.selectedPromoCode || "");
			const [selectedMethod, setSelectedMethod] = useState(null);
			const [isOnlinePaymentModalOpen, setIsOnlinePaymentModalOpen] = useState(false);
			const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
			const [selectedOnlineService, setSelectedOnlineService] = useState("OnlineStripe");
			const [onlineModalError, setOnlineModalError] = useState("");
			const [isSubmitting, setIsSubmitting] = useState(false);
			const [orderSuccessData, setOrderSuccessData] = useState(null);
			const [errorMessage, setErrorMessage] = useState("");
			const stepBoxRef = useRef(null);
			useEffect(() => {
				const fetchProducts = async () => {
					try {
						const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
						const response = await fetch(`${apiUrl}/api/products`);
						if (response.ok) {
							const data = await response.json();
							const productMap = {};
							data.forEach((categoryGroup) => {
								categoryGroup.items.forEach((item) => {
									productMap[item.id] = {
										...item,
										category: item.category || categoryGroup.category
									};
								});
							});
							setProducts(productMap);
						}
					} catch (err) {
						console.error("Failed to fetch products in Order:", err);
					} finally {
						setProductsLoading(false);
					}
				};
				fetchProducts();
			}, []);
			useEffect(() => {
				if (!user) return;
				const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
				fetchWithRefresh(`${apiUrl}/api/auth/promos`).then((r) => r.json()).then((data) => {
					if (Array.isArray(data)) {
						const actives = data.filter((p) => p.isActive && !p.isExpired);
						setUserPromos(actives);
						if (actives.length > 0) {
							setSelectedPromoCode((prev) => {
								if (prev && (prev === "NONE" || actives.some((p) => p.promoCode === prev))) {
									return prev;
								}
								return actives[0].promoCode;
							});
						}
					}
				}).catch(() => {});
			}, [user]);
			const activePromo = useMemo(() => {
				if (!selectedPromoCode || selectedPromoCode === "NONE") return null;
				return userPromos.find((p) => p.promoCode === selectedPromoCode) || null;
			}, [selectedPromoCode, userPromos]);
			useEffect(() => {
				if (selectedMethod && stepBoxRef.current) {
					const timer = setTimeout(() => {
						stepBoxRef.current?.scrollIntoView({
							behavior: "smooth",
							block: "center"
						});
					}, 100);
					return () => clearTimeout(timer);
				}
			}, [selectedMethod]);
			const enrichedItems = useMemo(() => {
				return items.map((item) => {
					const product = products[item.productId];
					if (!product) return null;
					const unitPrice = parseFloat(product.prices?.discountPrice || product.prices?.price || product.price || 0);
					const totalPrice = (unitPrice * item.quantity).toFixed(2);
					return {
						...item,
						product,
						unitPrice,
						totalPrice
					};
				}).filter(Boolean);
			}, [items, products]);
			const grandTotal = useMemo(() => {
				return enrichedItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
			}, [enrichedItems]);
			const promoDiscountAmount = useMemo(() => {
				if (!activePromo || !activePromo.isActive || enrichedItems.length === 0) return 0;
				const numericTotal = parseFloat(grandTotal) || 0;
				if (numericTotal <= 0) return 0;
				const pType = String(activePromo.prizeType || "").toLowerCase();
				const pName = String(activePromo.prizeName || "").toUpperCase();
				const discPercent = activePromo.discountPercent || (pType === "discount25" || pName.includes("25%") ? 25 : pType === "discount50" || pName.includes("50%") ? 50 : 0);
				if (discPercent > 0) {
					return Math.round(numericTotal * discPercent) / 100;
				}
				if (pType === "cashbackonpurchases" || pType === "4" || pName.includes("CASHBACK")) {
					return 0;
				}
				if (pType === "superprize" || pType === "0" || pName.includes("SUPER")) {
					return Math.min(numericTotal, 25);
				}
				if (pType === "freedrink" || pType === "1" || pName.includes("DRINK")) {
					const drinks = enrichedItems.filter((x) => {
						const cat = (x.product?.category || "").toLowerCase();
						return cat.includes("drink");
					});
					if (drinks.length === 0) return 0;
					const totalQty = drinks.reduce((sum, x) => sum + x.quantity, 0);
					const totalPrice = drinks.reduce((sum, x) => sum + x.unitPrice * x.quantity, 0);
					return Math.round(totalPrice / totalQty * 100) / 100;
				}
				if (pType === "freedessert" || pType === "2" || pName.includes("DESSERT")) {
					const desserts = enrichedItems.filter((x) => {
						const cat = (x.product?.category || "").toLowerCase();
						return cat.includes("dessert");
					});
					if (desserts.length === 0) return 0;
					const totalQty = desserts.reduce((sum, x) => sum + x.quantity, 0);
					const totalPrice = desserts.reduce((sum, x) => sum + x.unitPrice * x.quantity, 0);
					return Math.round(totalPrice / totalQty * 100) / 100;
				}
				return 0;
			}, [
				activePromo,
				enrichedItems,
				grandTotal
			]);
			const finalAmount = Math.max(0, parseFloat(grandTotal) - promoDiscountAmount).toFixed(2);
			const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
			const handleSelectMethod = (method) => {
				setSelectedMethod(method);
				setErrorMessage("");
			};
			const handlePlaceOrder = async (paymentMethod = "CashDeskCash") => {
				if (isSubmitting) return;
				setIsSubmitting(true);
				setErrorMessage("");
				setOnlineModalError("");
				try {
					const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
					const response = await fetchWithRefresh(`${apiUrl}/api/orders/cashier`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							paymentMethod,
							promoCode: activePromo ? activePromo.promoCode : null
						})
					});
					const data = await response.json();
					if (response.ok && data.success) {
						if (data.remainingBalance !== undefined && data.remainingBalance !== null && updateUser) {
							updateUser({ balance: data.remainingBalance });
						}
						clearBasket();
						setIsOnlinePaymentModalOpen(false);
						setOrderSuccessData({
							id: data.id,
							status: data.status || (paymentMethod === "OnlineBalance" ? "Paid Online" : "Pending Payment"),
							createdAt: data.createdAt,
							items: data.items || [],
							payment: data.payment || {},
							notes: data.notes || {},
							cashbackEarned: data.cashbackEarned || 0
						});
					} else {
						const msg = data.message || t("orderFailed");
						setErrorMessage(msg);
						setOnlineModalError(msg);
					}
				} catch (err) {
					console.error("Error placing order:", err);
					const msg = t("orderNetworkError");
					setErrorMessage(msg);
					setOnlineModalError(msg);
				} finally {
					setIsSubmitting(false);
				}
			};
			const handleStripeOrderSuccess = (data) => {
				if (data.remainingBalance !== undefined && data.remainingBalance !== null && updateUser) {
					updateUser({ balance: data.remainingBalance });
				}
				clearBasket();
				setIsStripeModalOpen(false);
				setOrderSuccessData({
					id: data.id,
					status: data.status || "Paid Online",
					createdAt: data.createdAt,
					items: data.items || [],
					payment: data.payment || {},
					notes: data.notes || {},
					cashbackEarned: data.cashbackEarned || 0
				});
			};
			const handleSelectOnlineServiceSubmit = () => {
				setIsOnlinePaymentModalOpen(false);
				if (selectedOnlineService === "OnlineBalance") {
					handlePlaceOrder("OnlineBalance");
				} else {
					setIsStripeModalOpen(true);
				}
			};
			const handleCloseSuccessModal = () => {
				setOrderSuccessData(null);
				navigate("/catalog");
			};
			const formatPaymentMethod = (pm) => {
				switch (pm) {
					case "OnlineStripe": return t("methodStripe");
					case "OnlineBalance": return t("methodBalance");
					case "OnlineCardDetails": return t("methodCards");
					case "OnlineGooglePay": return t("methodGPay");
					case "CashDeskCard": return t("methodCashierCard");
					case "CashDeskCash":
					default: return t("methodCashierCash");
				}
			};
			return /* @__PURE__ */ __h(motion.div, {
				className: "order-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "order-main" }, /* @__PURE__ */ __h("div", { className: "order-container" }, /* @__PURE__ */ __h(motion.div, {
				className: "order-hero-text",
				initial: {
					opacity: 0,
					y: 24,
					filter: "blur(8px)"
				},
				animate: {
					opacity: 1,
					y: 0,
					filter: "blur(0px)"
				},
				transition: {
					duration: .6,
					ease: smoothEase
				}
			}, /* @__PURE__ */ __h(motion.div, {
				className: "order-step-badge",
				initial: {
					opacity: 0,
					scale: .7
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				transition: {
					delay: .2,
					...springTransition
				}
			}, t("stepBadge")), /* @__PURE__ */ __h(motion.h1, {
				initial: {
					opacity: 0,
					y: 16
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					delay: .1,
					duration: .5,
					ease: smoothEase
				}
			}, t("heroTitle")), /* @__PURE__ */ __h(motion.p, {
				className: "order-hero-desc",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: {
					delay: .25,
					duration: .4
				}
			}, t("heroDesc"))), itemCount === 0 && !orderSuccessData && !productsLoading ? /* @__PURE__ */ __h(motion.div, {
				className: "order-empty-card",
				initial: {
					opacity: 0,
					scale: .95
				},
				animate: {
					opacity: 1,
					scale: 1
				}
			}, /* @__PURE__ */ __h("p", null, t("emptyBasket")), /* @__PURE__ */ __h(Link, {
				to: "/catalog",
				className: "cta-btn sm order-empty-btn"
			}, t("browseMenu"))) : /* @__PURE__ */ __h("div", { className: "order-methods-container" }, /* @__PURE__ */ __h("div", { className: "order-methods-grid" }, /* @__PURE__ */ __h(motion.div, {
				custom: 0,
				variants: cardVariants,
				initial: "hidden",
				animate: "visible",
				className: `order-method-card ${selectedMethod === "cashier" ? "selected" : ""} ${selectedMethod && selectedMethod !== "cashier" ? "unselected" : ""}`,
				onClick: () => handleSelectMethod("cashier"),
				whileHover: {
					y: -4,
					transition: { duration: .2 }
				},
				whileTap: { scale: .98 }
			}, /* @__PURE__ */ __h("div", { className: "order-method-card__top" }, /* @__PURE__ */ __h("div", { className: "order-method-card__icon-wrap" }, /* @__PURE__ */ __h("img", {
				src: cashierIcon,
				alt: t("payAtCashier"),
				className: "order-method-card__icon"
			})), /* @__PURE__ */ __h("div", { className: "order-method-card__title-group" }, /* @__PURE__ */ __h("span", { className: "order-method-card__badge" }, t("inStoreBadge")), /* @__PURE__ */ __h("h2", { className: "order-method-card__title" }, t("payAtCashier")), /* @__PURE__ */ __h("span", { className: "order-method-card__subtitle" }, t("payAtCashierCounter")))), /* @__PURE__ */ __h("div", { className: "order-method-card__details" }, /* @__PURE__ */ __h("p", { className: "order-method-card__desc" }, t("cashierDesc")), /* @__PURE__ */ __h(AnimatePresence, { initial: false }, !selectedMethod && /* @__PURE__ */ __h(motion.div, {
				className: "order-method-card__features-wrap",
				initial: {
					opacity: 0,
					height: 0
				},
				animate: {
					opacity: 1,
					height: "auto"
				},
				exit: {
					opacity: 0,
					height: 0
				},
				transition: {
					duration: .35,
					ease: smoothEase
				}
			}, /* @__PURE__ */ __h("div", { className: "order-method-card__features" }, /* @__PURE__ */ __h(FeaturePill, {
				icon: featureCashIcon,
				label: t("cashPayment")
			}), /* @__PURE__ */ __h(FeaturePill, {
				icon: featureNfcIcon,
				label: t("cardNfc")
			}), /* @__PURE__ */ __h(FeaturePill, {
				icon: featurePromoIcon,
				label: t("usePromoCodes")
			}))))), /* @__PURE__ */ __h("div", { className: "order-method-card__footer" }, /* @__PURE__ */ __h("span", { className: `order-method-card__radio-btn ${selectedMethod === "cashier" ? "selected" : ""}` }, selectedMethod === "cashier" ? t("selectedBadge") : t("chooseCashier")))), /* @__PURE__ */ __h(motion.div, {
				custom: 1,
				variants: cardVariants,
				initial: "hidden",
				animate: "visible",
				className: `order-method-card ${selectedMethod === "online" ? "selected" : ""} ${selectedMethod && selectedMethod !== "online" ? "unselected" : ""}`,
				onClick: () => handleSelectMethod("online"),
				whileHover: {
					y: -4,
					transition: { duration: .2 }
				},
				whileTap: { scale: .98 }
			}, /* @__PURE__ */ __h("div", { className: "order-method-card__top" }, /* @__PURE__ */ __h("div", { className: "order-method-card__icon-wrap" }, /* @__PURE__ */ __h("img", {
				src: onlineIcon,
				alt: t("payOnline"),
				className: "order-method-card__icon"
			})), /* @__PURE__ */ __h("div", { className: "order-method-card__title-group" }, /* @__PURE__ */ __h("span", { className: "order-method-card__badge badge-online" }, t("instantBadge")), /* @__PURE__ */ __h("h2", { className: "order-method-card__title" }, t("payOnline")), /* @__PURE__ */ __h("span", { className: "order-method-card__subtitle" }, t("payOnlineInstantly")))), /* @__PURE__ */ __h("div", { className: "order-method-card__details" }, /* @__PURE__ */ __h("p", { className: "order-method-card__desc" }, t("onlineDesc")), /* @__PURE__ */ __h(AnimatePresence, { initial: false }, !selectedMethod && /* @__PURE__ */ __h(motion.div, {
				className: "order-method-card__features-wrap",
				initial: {
					opacity: 0,
					height: 0
				},
				animate: {
					opacity: 1,
					height: "auto"
				},
				exit: {
					opacity: 0,
					height: 0
				},
				transition: {
					duration: .35,
					ease: smoothEase
				}
			}, /* @__PURE__ */ __h("div", { className: "order-method-card__features" }, /* @__PURE__ */ __h(FeaturePill, {
				icon: featureCardVisaMcIcon,
				label: t("visaMastercard")
			}), /* @__PURE__ */ __h(FeaturePill, {
				icon: featureWalletIcon,
				label: t("payViaBalance")
			}), /* @__PURE__ */ __h(FeaturePill, {
				icon: featureStripeIcon,
				label: t("payViaStripe")
			}), /* @__PURE__ */ __h(FeaturePill, {
				icon: featureGPayIcon,
				label: t("googlePay")
			}), /* @__PURE__ */ __h(FeaturePill, {
				icon: featureCashbackIcon,
				label: t("earnCashback")
			}), /* @__PURE__ */ __h(FeaturePill, {
				icon: featurePromoIcon,
				label: t("usePromoCodes")
			}))))), /* @__PURE__ */ __h("div", { className: "order-method-card__footer" }, /* @__PURE__ */ __h("span", { className: `order-method-card__radio-btn ${selectedMethod === "online" ? "selected" : ""}` }, selectedMethod === "online" ? t("selectedBadge") : t("chooseOnline")))))), /* @__PURE__ */ __h(AnimatePresence, { mode: "wait" }, selectedMethod && itemCount > 0 && /* @__PURE__ */ __h(motion.div, {
				ref: stepBoxRef,
				className: "order-step-content",
				variants: stepPanelVariants,
				initial: "hidden",
				animate: "visible",
				exit: "exit",
				key: selectedMethod
			}, /* @__PURE__ */ __h("div", { className: "order-step-box" }, /* @__PURE__ */ __h("div", { className: "order-step-header" }, /* @__PURE__ */ __h("div", { className: "order-step-info" }, /* @__PURE__ */ __h("h3", null, t("selectedPayment"), " ", /* @__PURE__ */ __h("span", null, selectedMethod === "cashier" ? t("payAtCashier") : t("payOnline"))), /* @__PURE__ */ __h("p", null, selectedMethod === "cashier" ? t("cashierStepDesc") : t("onlineStepDesc"))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "order-change-btn",
				onClick: () => setSelectedMethod(null)
			}, t("changeMethod"))), userPromos.length >= 2 && /* @__PURE__ */ __h("div", { className: "order-promo-selector" }, /* @__PURE__ */ __h("div", { className: "order-promo-label" }, /* @__PURE__ */ __h("span", null, t("selectPromo")), /* @__PURE__ */ __h("span", { className: "count" }, t("promosAvailable", { count: userPromos.length }))), /* @__PURE__ */ __h("select", {
				value: selectedPromoCode,
				onChange: (e) => setSelectedPromoCode(e.target.value),
				className: "order-promo-select"
			}, userPromos.map((p) => /* @__PURE__ */ __h("option", {
				key: p.id,
				value: p.promoCode
			}, p.promoCode, " — ", p.prizeName)), /* @__PURE__ */ __h("option", { value: "NONE" }, t("dontUsePromo")))), /* @__PURE__ */ __h("div", { className: "order-summary-pill-row" }, /* @__PURE__ */ __h("div", { className: "order-summary-pill" }, /* @__PURE__ */ __h("span", { className: "label" }, t("itemsCount")), /* @__PURE__ */ __h("span", { className: "value" }, itemCount, " ", t("itemsSuffix"))), promoDiscountAmount > 0 && /* @__PURE__ */ __h("div", { className: "order-summary-pill promo" }, /* @__PURE__ */ __h("span", { className: "label" }, t("discountLabel")), /* @__PURE__ */ __h("span", { className: "value" }, "−", promoDiscountAmount.toFixed(2), " ₼")), /* @__PURE__ */ __h("div", { className: "order-summary-pill total" }, /* @__PURE__ */ __h("span", { className: "label" }, t("totalToPay")), /* @__PURE__ */ __h("span", { className: "value" }, finalAmount, " ₼"))), errorMessage && /* @__PURE__ */ __h("div", { className: "order-error-message" }, "⚠️ ", errorMessage), /* @__PURE__ */ __h("div", { className: "order-actions-row" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "order-confirm-btn",
				disabled: isSubmitting || itemCount === 0,
				onClick: () => {
					if (selectedMethod === "cashier") {
						handlePlaceOrder("CashDeskCash");
					} else {
						setIsOnlinePaymentModalOpen(true);
					}
				}
			}, isSubmitting ? /* @__PURE__ */ __h("span", { className: "order-btn-loading" }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Loading",
				className: "order-spinner"
			}), t("placingOrder")) : selectedMethod === "cashier" ? t("confirmOrder") : t("continueOnline")), /* @__PURE__ */ __h(Link, {
				to: "/basket",
				className: "order-back-btn"
			}, t("backToBasket")))))))), /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen: isOnlinePaymentModalOpen,
				onClose: () => setIsOnlinePaymentModalOpen(false),
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "online-payment-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "online-payment-modal__close",
				onClick: () => setIsOnlinePaymentModalOpen(false),
				"aria-label": "Close modal"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("line", {
				x1: "18",
				y1: "6",
				x2: "6",
				y2: "18"
			}), /* @__PURE__ */ __h("line", {
				x1: "6",
				y1: "6",
				x2: "18",
				y2: "18"
			}))), /* @__PURE__ */ __h("div", { className: "online-payment-modal__header" }, /* @__PURE__ */ __h("div", { className: "online-payment-modal__icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("rect", {
				x: "2",
				y: "5",
				width: "20",
				height: "14",
				rx: "2"
			}), /* @__PURE__ */ __h("line", {
				x1: "2",
				y1: "10",
				x2: "22",
				y2: "10"
			}))), /* @__PURE__ */ __h("h3", { className: "online-payment-modal__title" }, t("onlineModalTitle")), /* @__PURE__ */ __h("p", { className: "online-payment-modal__desc" }, t("onlineModalDesc"), " ", /* @__PURE__ */ __h("span", { className: "online-payment-modal__amount" }, finalAmount, " ₼"))), /* @__PURE__ */ __h("div", { className: "online-payment-modal__services" }, onlineServices.map((service) => {
				const isSelected = selectedOnlineService === service.id;
				const userBalance = typeof user?.balance === "number" ? user.balance : parseFloat(user?.balance || "0");
				return /* @__PURE__ */ __h("div", {
					key: service.id,
					className: `online-payment-service-card ${isSelected ? "selected" : ""}`,
					onClick: () => setSelectedOnlineService(service.id)
				}, /* @__PURE__ */ __h("div", { className: "online-payment-service-card__icon-wrap" }, /* @__PURE__ */ __h("img", {
					src: service.icon,
					alt: service.title,
					className: "online-payment-service-card__icon"
				})), /* @__PURE__ */ __h("div", { className: "online-payment-service-card__info" }, /* @__PURE__ */ __h("span", { className: "online-payment-service-card__title" }, service.title), /* @__PURE__ */ __h("span", { className: "online-payment-service-card__desc" }, service.desc), service.badge && /* @__PURE__ */ __h("div", { className: "online-payment-service-card__badge-row" }, /* @__PURE__ */ __h("span", { className: "online-payment-service-card__badge" }, service.isBalance ? `${t("balancePrefix")} ${userBalance.toFixed(2)} ₼` : service.badge))), /* @__PURE__ */ __h("div", { className: "online-payment-service-card__radio" }, /* @__PURE__ */ __h("span", { className: `online-radio-dot ${isSelected ? "active" : ""}` }, isSelected && /* @__PURE__ */ __h("span", { className: "online-radio-dot__inner" }))));
			})), /* @__PURE__ */ __h("div", { className: "online-payment-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm online-payment-modal__btn online-payment-modal__btn--cancel",
				onClick: () => setIsOnlinePaymentModalOpen(false)
			}, t("cancel")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm online-payment-modal__btn online-payment-modal__btn--submit",
				onClick: handleSelectOnlineServiceSubmit
			}, selectedOnlineService === "OnlineBalance" ? t("payWithBalance") : t("continueToPayment"))))), /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen: Boolean(orderSuccessData),
				onClose: handleCloseSuccessModal,
				targetBorderRadius: "24px"
			}, orderSuccessData && /* @__PURE__ */ __h("div", {
				className: "order-success-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "order-success-modal__close",
				onClick: handleCloseSuccessModal,
				"aria-label": "Close modal"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("line", {
				x1: "18",
				y1: "6",
				x2: "6",
				y2: "18"
			}), /* @__PURE__ */ __h("line", {
				x1: "6",
				y1: "6",
				x2: "18",
				y2: "18"
			}))), /* @__PURE__ */ __h("div", { className: "order-success-modal__header" }, /* @__PURE__ */ __h("div", { className: "order-success-modal__icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" }))), /* @__PURE__ */ __h("div", { className: "order-success-modal__status-badge" }, /* @__PURE__ */ __h("span", { className: "pulsing-dot" }), orderSuccessData.status === "Paid Online" ? t("statusPaidOnline") : orderSuccessData.status === "Pending Payment" ? t("statusPendingPayment") : orderSuccessData.status), /* @__PURE__ */ __h("h2", { className: "order-success-modal__title" }, t("orderSuccessTitle")), /* @__PURE__ */ __h("p", { className: "order-success-modal__desc" }, t("orderSuccessDesc"))), /* @__PURE__ */ __h("div", { className: "order-success-modal__number-card" }, /* @__PURE__ */ __h("div", { className: "order-success-modal__number-info" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__number-label" }, t("orderNumberLabel")), /* @__PURE__ */ __h("span", { className: "order-success-modal__number-sub" }, t("mentionAtCounter"))), /* @__PURE__ */ __h("span", { className: "order-success-modal__number-value" }, orderSuccessData.id ? String(orderSuccessData.id).replace(/-/g, "").slice(-7).toUpperCase() : "")), /* @__PURE__ */ __h("div", { className: "order-success-modal__details" }, /* @__PURE__ */ __h("div", { className: "order-success-modal__detail-row" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-label" }, t("itemsCount").replace(":", "")), /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-value" }, orderSuccessData.items?.reduce((sum, p) => sum + p.quantity, 0) || 0, " ", t("itemsSuffix"))), orderSuccessData.payment?.discountAmount > 0 && /* @__PURE__ */ __h("div", { className: "order-success-modal__detail-row discount" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-label" }, t("promoDiscount")), /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-value" }, "−", orderSuccessData.payment.discountAmount.toFixed(2), " ₼")), orderSuccessData.cashbackEarned > 0 && /* @__PURE__ */ __h("div", { className: "order-success-modal__detail-row cashback" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-label" }, t("cashbackAdded")), /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-value" }, "+", Number(orderSuccessData.cashbackEarned).toFixed(2), " ₼")), /* @__PURE__ */ __h("div", { className: "order-success-modal__detail-row" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-label" }, t("paymentMethodLabel")), /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-value" }, formatPaymentMethod(orderSuccessData.payment?.paymentMethod))), /* @__PURE__ */ __h("div", { className: "order-success-modal__detail-row total" }, /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-label" }, t("totalToPay").replace(":", "")), /* @__PURE__ */ __h("span", { className: "order-success-modal__detail-value" }, orderSuccessData.payment?.totalAmount?.toFixed(2), " ₼"))), /* @__PURE__ */ __h("div", { className: "order-success-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm order-success-modal__btn order-success-modal__btn--cancel",
				onClick: handleCloseSuccessModal
			}, t("backToMenu")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm order-success-modal__btn order-success-modal__btn--submit",
				onClick: () => {
					setOrderSuccessData(null);
					navigate("/orders");
				}
			}, t("viewOrders"))))), isStripeModalOpen && /* @__PURE__ */ __h(React.Suspense, { fallback: null }, /* @__PURE__ */ __h(StripePaymentModal, {
				isOpen: isStripeModalOpen,
				onClose: () => setIsStripeModalOpen(false),
				serviceId: selectedOnlineService,
				finalAmount,
				promoCode: activePromo ? activePromo.promoCode : null,
				onOrderSuccess: handleStripeOrderSuccess
			})), /* @__PURE__ */ __h(Footer, null));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Order; } });
	});
	//#endregion

	var entryExports = __require("components/UserPages/Order/Order.js");
	__pages["order"] = entryExports.default || entryExports;
})();
