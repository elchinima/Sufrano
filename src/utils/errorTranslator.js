import { getStoredLanguage } from "./useLang.js";

const ERROR_ENTRIES = [
	{
		az: "Kart sahibinin adı yalnız boşluqsuz ingilis hərflərindən ibarət olmalıdır (3-30 simvol).",
		ru: "Имя владельца карты должно содержать только английские буквы без пробелов (от 3 до 30 символов).",
		en: "Cardholder name must contain only English letters without spaces (3-30 characters)."
	},
	{
		az: "Kart sahibinin adı yalnız boşluqsuz ingilis hərflərindən ibarət olmalıdır.",
		ru: "Имя владельца карты должно содержать только английские буквы без пробелов.",
		en: "Cardholder name must contain only English letters without spaces."
	},
	{
		az: "Süfrano hesabınızda kifayət qədər balans yoxdur.",
		ru: "Недостаточно средств на балансе вашего аккаунта Süfrano.",
		en: "Insufficient balance on your Süfrano account."
	},
	{
		az: "15% endirim tətbiq edildi (maks. 15 AZN).",
		ru: "Применена скидка 15% (макс. 15 AZN).",
		en: "15% discount applied (max 15 AZN)"
	},
	{
		az: "25% endirim tətbiq edildi (maks. 25 AZN).",
		ru: "Применена скидка 25% (макс. 25 AZN).",
		en: "25% discount applied (max 25 AZN)"
	},
	{
		az: "15% endirim tətbiq edildi.",
		ru: "Применена скидка 15%.",
		en: "15% discount applied"
	},
	{
		az: "25% endirim tətbiq edildi.",
		ru: "Применена скидка 25%.",
		en: "25% discount applied"
	},
	{
		az: "Super hədiyyə: 30 AZN endirim tətbiq edildi.",
		ru: "Суперприз: применена скидка 30 AZN.",
		en: "Super prize: 30 AZN discount applied"
	},
	{
		az: "Pulsuz içki tətbiq edildi.",
		ru: "Бесплатный напиток применён.",
		en: "Free drink applied"
	},
	{
		az: "Pulsuz desert tətbiq edildi.",
		ru: "Бесплатный десерт применён.",
		en: "Free dessert applied"
	},
	{
		az: "Səbətiniz boşdur.",
		ru: "Корзина пуста.",
		en: "Basket is empty."
	},
	{
		az: "Səbətdəki məhsullar kataloqda tapılmadı.",
		ru: "Товары из корзины не найдены в каталоге.",
		en: "Items from basket not found in catalog."
	},
	{
		az: "Yekun məbləğ 0-dır. Zəhmət olmasa kassa vasitəsilə sifariş edin.",
		ru: "Итоговая сумма равна 0. Пожалуйста, оформите заказ через кассу.",
		en: "Total amount is 0. Please checkout via cashier."
	},
	{
		az: "Ödəniş identifikatoru (PaymentIntentId) tələb olunur.",
		ru: "Требуется идентификатор платежа (PaymentIntentId).",
		en: "PaymentIntentId is required."
	},
	{
		az: "Bu ödəniş cəhdi sizin hesabınıza aid deyil.",
		ru: "Данный платёж не принадлежит вашей учетной записи.",
		en: "This payment intent does not belong to your account."
	},
	{
		az: "Ödənilən məbləğ cari sifariş məbləği ilə uyğun gəlmir.",
		ru: "Оплаченная сумма не соответствует текущей сумме заказа.",
		en: "Paid amount does not match the current order total."
	},
	{
		az: "Bu keçid nöqtəsi üçün dəstəklənməyən ödəniş üsulu. Onlayn Stripe və Google Pay üçün Stripe təsdiqi tələb olunur.",
		ru: "Неподдерживаемый способ оплаты для этого эндпоинта. Online Stripe и Google Pay требуют подтверждения через Stripe.",
		en: "Unsupported payment method for this endpoint. Online Stripe and Google Pay require Stripe confirmation."
	},
	{
		az: "Onlayn kart ödənişi üçün düzgün kart məlumatları və ya yadda saxlanılmış kart tələb olunur.",
		ru: "Для оплаты картой онлайн требуются действительные реквизиты карты или сохраненная карта.",
		en: "Valid payment card details or a saved card are required for online card payment."
	},
	{
		az: "Sifariş tapılmadı.",
		ru: "Заказ не найден.",
		en: "Order not found."
	},
	{
		az: "Sifariş tapılmadı və ya hesabınıza aid deyil.",
		ru: "Заказ не найден или не принадлежит вашей учетной записи.",
		en: "Order not found or does not belong to your account."
	},
	{
		az: "Serverdə Stripe açarı konfiqurasiya edilməyib.",
		ru: "Секретный ключ Stripe не настроен на сервере.",
		en: "Stripe secret key is not configured on the server."
	},

	{
		az: "Kart nömrəsi tələb olunur.",
		ru: "Номер карты обязателен.",
		en: "Card number is required."
	},
	{
		az: "Kart nömrəsi 16 rəqəmdən ibarət olmalıdır.",
		ru: "Номер карты должен состоять из 16 цифр.",
		en: "Card number must be 16 digits."
	},
	{
		az: "Yalnız Visa və Mastercard kartları dəstəklənir.",
		ru: "Поддерживаются только карты Visa и Mastercard.",
		en: "Only Visa and Mastercard cards are supported."
	},
	{
		az: "Yanlış kart nömrəsi (Luhn yoxlaması uğursuz oldu).",
		ru: "Неверный номер карты (контрольная сумма не совпадает).",
		en: "Invalid card number checksum (Luhn check failed)."
	},
	{
		az: "Yanlış və ya vaxtı bitmiş son istifadə tarixi (format: AA/İİ).",
		ru: "Неверный или истекший срок действия карты (формат: ММ/ГГ).",
		en: "Invalid or expired expiration date (format: MM/YY)."
	},
	{
		az: "CVC kodu dəqiq 3 rəqəm olmalıdır.",
		ru: "CVC-код должен состоять ровно из 3 цифр.",
		en: "CVC code must be exactly 3 digits."
	},
	{
		az: "Yalnız 3 ödəniş kartı yadda saxlaya bilərsiniz. Yeni kart əlavə etmək üçün mövcud kartlardan birini silin.",
		ru: "Вы можете сохранить не более 3 карт. Пожалуйста, удалите существующую карту, чтобы добавить новую.",
		en: "You can only save up to 3 payment cards. Please delete an existing card to add a new one."
	},
	{
		az: "Kart nömrəsinin sonluğu yanlışdır.",
		ru: "Неверное окончание номера карты.",
		en: "Invalid card number ending."
	},
	{
		az: "Ödəniş üsulu tapılmadı.",
		ru: "Способ оплаты не найден.",
		en: "Payment method not found."
	},

	{
		az: "Ünvan mətni tələb olunur.",
		ru: "Адресная строка обязательна.",
		en: "Address line is required."
	},
	{
		az: "Şəhər tələb olunur.",
		ru: "Город обязателен.",
		en: "City is required."
	},
	{
		az: "Əlaqə nömrəsi tələb olunur.",
		ru: "Контактный номер телефона обязателен.",
		en: "Contact phone number is required."
	},
	{
		az: "Yalnız 3 çatdırılma ünvanı yadda saxlaya bilərsiniz. Yenisini əlavə etmək üçün mövcud ünvanı silin.",
		ru: "Вы можете сохранить не более 3 адресов доставки. Пожалуйста, удалите существующий адрес, чтобы добавить новый.",
		en: "You can only save up to 3 delivery addresses. Please delete an existing address to add a new one."
	},
	{
		az: "Ünvan tapılmadı.",
		ru: "Адрес не найден.",
		en: "Address not found."
	},

	{
		az: "Qiymətləndirmə 1.00 ilə 5.00 arasında olmalıdır.",
		ru: "Рейтинг должен быть от 1.00 до 5.00.",
		en: "Rating must be between 1.00 and 5.00."
	},
	{
		az: "Rəy ən azı 5 simvoldan ibarət olmalıdır.",
		ru: "Отзыв должен содержать не менее 5 символов.",
		en: "Comment must be at least 5 characters long."
	},
	{
		az: "Rəy 300 simvoldan çox ola bilməz.",
		ru: "Отзыв не должен превышать 300 символов.",
		en: "Comment cannot exceed 300 characters."
	},
	{
		az: "Yanlış kateqoriya. İcazə verilən dəyərlər: Çatdırılma, Məhsullar, Xidmət, Heyət.",
		ru: "Неверная категория. Допустимые значения: Доставка, Продукты, Обслуживание, Персонал.",
		en: "Invalid category. Allowed values: Delivery, Products, Service, Staff."
	},
	{
		az: "Rəy yalnız sifariş statusu Tamamlandı olduqdan sonra yazıla bilər.",
		ru: "Отзыв можно оставить только после того, как заказ будет выполнен.",
		en: "Reviews can only be submitted after the order status is Complete."
	},
	{
		az: "Bu sifariş üçün artıq rəy bildirmisiniz.",
		ru: "Вы уже оставили отзыв для этого заказа.",
		en: "You have already submitted a review for this order."
	},
	{
		az: "Rəy tapılmadı.",
		ru: "Отзыв не найден.",
		en: "Review not found."
	},
	{
		az: "Öz rəyinizə bəyənmə qoya bilməzsiniz.",
		ru: "Вы не можете оценивать собственный отзыв.",
		en: "You cannot like your own review."
	},

	{
		az: "Yanlış e-poçt və ya şifrə.",
		ru: "Неверный логин или пароль.",
		en: "Invalid credentials"
	},
	{
		az: "Yanlış e-poçt və ya şifrə.",
		ru: "Неверный логин или пароль.",
		en: "Invalid credentials."
	},
	{
		az: "Hesabınız dayandırılıb və ya bloklanıb.",
		ru: "Ваша учетная запись заблокирована или приостановлена.",
		en: "Your account has been suspended or blocked."
	},
	{
		az: "Giriş qadağandır. Bot və ya AI roluna malik hesablara daxil olmaq qadağandır.",
		ru: "Доступ запрещен. Вход в учетные записи с ролью Bot или AI запрещен.",
		en: "Access denied. Logging into accounts with the Bot or AI role is prohibited."
	},
	{
		az: "Bot və AI hesabları üçün giriş qadağandır.",
		ru: "Доступ запрещен для учетных записей Bot и AI.",
		en: "Access denied for Bot and AI accounts."
	},
	{
		az: "Giriş qadağandır. Bot və AI hesabları daxil ola bilməz.",
		ru: "Доступ запрещен. Учетные записи Bot и AI не могут войти в систему.",
		en: "Access denied. Bot and AI accounts cannot sign in."
	},
	{
		az: "Sistem hesabları interaktiv daxil ola bilməz.",
		ru: "Системные учетные записи не могут войти интерактивно.",
		en: "System accounts cannot sign in interactively."
	},
	{
		az: "E-poçt və təsdiq kodu tələb olunur.",
		ru: "Требуется электронная почта и код подтверждения.",
		en: "Email and verification code are required"
	},
	{
		az: "E-poçt və təsdiq kodu tələb olunur.",
		ru: "Требуется электронная почта и код подтверждения.",
		en: "Email and verification code are required."
	},
	{
		az: "E-poçt ünvanı tələb olunur.",
		ru: "Электронная почта обязательна.",
		en: "Email is required"
	},
	{
		az: "E-poçt ünvanı tələb olunur.",
		ru: "Электронная почта обязательна.",
		en: "Email is required."
	},
	{
		az: "Təsdiq kodu tələb olunur.",
		ru: "Требуется код подтверждения.",
		en: "Verification code is required."
	},
	{
		az: "Yanlış və ya vaxtı bitmiş təsdiq kodu.",
		ru: "Неверный или истекший код подтверждения.",
		en: "Invalid or expired verification code"
	},
	{
		az: "Yanlış və ya vaxtı bitmiş təsdiq kodu.",
		ru: "Неверный или истекший код подтверждения.",
		en: "Invalid or expired verification code."
	},
	{
		az: "Yanlış təsdiq kodu.",
		ru: "Неверный код подтверждения.",
		en: "Invalid verification code"
	},
	{
		az: "Yanlış təsdiq kodu. Zəhmət olmasa kodu yoxlayıb yenidən cəhd edin.",
		ru: "Неверный код подтверждения. Пожалуйста, проверьте код и попробуйте снова.",
		en: "Invalid verification code. Please check the code and try again."
	},
	{
		az: "Təsdiq kodunun vaxtı bitib. Zəhmət olmasa yeni kod tələb edin.",
		ru: "Срок действия кода подтверждения истек. Пожалуйста, запросите новый код.",
		en: "Verification code has expired. Please request a new code."
	},
	{
		az: "Həddindən artıq uğursuz cəhd. Zəhmət olmasa yenidən daxil olun.",
		ru: "Слишком много неудачных попыток. Пожалуйста, войдите снова.",
		en: "Too many failed verification attempts. Please sign in again."
	},
	{
		az: "Zəhmət olmasa yeni kod tələb etməzdən əvvəl ən azı 60 saniyə gözləyin.",
		ru: "Пожалуйста, подождите не менее 60 секунд перед запросом нового кода.",
		en: "Please wait at least 60 seconds before requesting a new verification code."
	},
	{
		az: "Bu e-poçt qeydiyyatdan keçməyib. Zəhmət olmasa əvvəlcə qeydiyyatdan keçin.",
		ru: "Этот адрес электронной почты не зарегистрирован. Пожалуйста, сначала создайте аккаунт.",
		en: "This email is not registered. Please create an account first."
	},
	{
		az: "Bu e-poçt qeydiyyatdan keçməyib.",
		ru: "Этот адрес электронной почты не зарегистрирован.",
		en: "This email is not registered."
	},
	{
		az: "Bu e-poçt ünvanı ilə hesab tapılmadı.",
		ru: "Аккаунт с таким адресом электронной почты не найден.",
		en: "No account found with this email address."
	},
	{
		az: "Bu e-poçt artıq bülletenə abunədir. Əgər kömək lazımdırsa və ya abunəliyi dəyişmək istəyirsinizsə, hello@sufrano.com ünvanı ilə əlaqə saxlayın.",
		ru: "Этот адрес уже подписан на рассылку. Если вам нужна помощь или вы хотите изменить подписку, обратитесь в службу поддержки: hello@sufrano.com.",
		en: "This email is already subscribed to the newsletter. If you need assistance or wish to change your subscription, please contact technical support at hello@sufrano.com."
	},
	{
		az: "Yeni şifrə tələb olunur.",
		ru: "Требуется новый пароль.",
		en: "New password is required."
	},
	{
		az: "Şifrə ən azı 6 simvoldan ibarət olmalıdır.",
		ru: "Пароль должен содержать не менее 6 символов.",
		en: "Password must be at least 6 characters long."
	},
	{
		az: "Hesab tapılmadı. Google ilə daxil olmazdan əvvəl e-poçt və şifrənizlə qeydiyyatdan keçin.",
		ru: "Аккаунт не найден. Пожалуйста, сначала зарегистрируйтесь с помощью почты и пароля перед входом через Google.",
		en: "Account not found. Please register first with your email and password before signing in with Google."
	},
	{
		az: "Cari şifrə yanlışdır.",
		ru: "Текущий пароль неверен.",
		en: "Current password is incorrect."
	},
	{
		az: "Yeni şifrə cari şifrə ilə eyni ola bilməz.",
		ru: "Новый пароль не может совпадать с текущим паролем.",
		en: "New password cannot be the same as the current password."
	},
	{
		az: "Yeni şifrə və təsdiqi uyğun gəlmir.",
		ru: "Новый пароль и подтверждение не совпадают.",
		en: "New password and confirmation do not match."
	},
	{
		az: "Ad boş ola bilməz.",
		ru: "Имя не может быть пустым.",
		en: "Name cannot be empty."
	},
	{
		az: "Ad boşluq simvolu ehtiva edə bilməz.",
		ru: "Имя не может содержать пробелы.",
		en: "Name cannot contain spaces."
	},
	{
		az: "Ad boşluq simvolu ehtiva etməməlidir.",
		ru: "Имя не должно содержать пробелы.",
		en: "Name must not contain spaces."
	},
	{
		az: "Ad 50 simvoldan çox ola bilməz.",
		ru: "Имя не может превышать 50 символов.",
		en: "Name cannot exceed 50 characters."
	},
	{
		az: "Bu hesab üçün İki Mərhələli Təsdiqləmə aktivləşdirilməyib.",
		ru: "Двухфакторная аутентификация не включена для этого аккаунта.",
		en: "Two-Factor Authentication is not enabled for this account"
	},
	{
		az: "Cari aktiv sessiyanı ləğv etmək mümkün deyil.",
		ru: "Невозможно отозвать текущую активную сессию.",
		en: "Cannot revoke the current active session."
	},
	{
		az: "İstifadəçi sessiyası tapılmadı.",
		ru: "Запись сессии пользователя не найдена.",
		en: "User session record not found."
	},
	{
		az: "İstifadəçi tapılmadı.",
		ru: "Пользователь не найден.",
		en: "User not found."
	},
	{
		az: "İstifadəçi tapılmadı.",
		ru: "Пользователь не найден.",
		en: "User not found"
	},
	{
		az: "Təhlükəsizlik təsdiqi tələb olunur. Zəhmət olmasa hesab şifrənizi daxil edin.",
		ru: "Требуется проверка безопасности. Пожалуйста, введите пароль от вашей учетной записи.",
		en: "Security verification required. Please enter your account password."
	},
	{
		az: "Google hesabı e-poçt ünvanı təqdim etmir.",
		ru: "Аккаунт Google не предоставил адрес электронной почты.",
		en: "Google account does not provide an email address."
	},
	{
		az: "Google e-poçt ünvanı təsdiqlənməyib.",
		ru: "Адрес электронной почты Google не подтвержден.",
		en: "Google email is not verified."
	},
	{
		az: "Google giriş nişanı almaq mümkün olmadı.",
		ru: "Не удалось получить токен доступа Google.",
		en: "Failed to obtain Google access token."
	},
	{
		az: "Yeniləmə nişanı yanlışdır, ləğv edilib və ya vaxtı bitib.",
		ru: "Токен обновления недействителен, отозван или истек.",
		en: "Invalid, terminated or expired refresh token"
	},

	{
		az: "Sifarişdə ən azı bir məhsul olmalıdır.",
		ru: "Заказ должен содержать хотя бы один товар.",
		en: "Order must contain at least one item."
	},
	{
		az: "Promokod tapılmadı.",
		ru: "Промокод не найден.",
		en: "Promo code not found."
	},
	{
		az: "Promokodun vaxtı bitib və ya artıq istifadə olunub.",
		ru: "Срок действия промокода истек или он уже был использован.",
		en: "Promo code is expired or has already been used."
	},
	{
		az: "Kassa sifarişi tapılmadı.",
		ru: "Заказ на кассе не найден.",
		en: "Cashbox order not found."
	},

	{
		az: "Qısa müddətdə həddindən artıq sorğu göndərdiniz. Zəhmət olmasa yenidən cəhd etməzdən əvvəl bir qədər gözləyin.",
		ru: "Вы сделали слишком много запросов за короткое время. Пожалуйста, подождите немного перед повторной попыткой.",
		en: "You have made too many requests in a short period. Please wait a moment before trying again."
	},
	{
		az: "İcazə verilmədi.",
		ru: "Не авторизован.",
		en: "Unauthorized."
	},
	{
		az: "Sifarişi rəsmiləşdirmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.",
		ru: "Не удалось оформить заказ. Пожалуйста, попробуйте снова.",
		en: "Failed to place order. Please try again."
	},
	{
		az: "Sifariş zamanı xəta baş verdi. Zəhmət olmasa internet bağlantınızı yoxlayın.",
		ru: "Произошла ошибка при оформлении заказа. Пожалуйста, проверьте подключение к интернету.",
		en: "An error occurred while placing the order. Please check your internet connection."
	},
	{
		az: "Ödəniş baş tutmadı. Zəhmət olmasa yenidən cəhd edin.",
		ru: "Оплата не удалась. Пожалуйста, попробуйте снова.",
		en: "Payment failed. Please try again."
	},
	{
		az: "Ödəniş icrası zamanı xəta baş verdi.",
		ru: "Произошла ошибка при обработке платежа.",
		en: "An error occurred while processing the payment."
	}
];

const LOOKUP_MAP = new Map();

for (const entry of ERROR_ENTRIES) {
	if (entry.az) LOOKUP_MAP.set(entry.az.trim().toLowerCase(), entry);
	if (entry.ru) LOOKUP_MAP.set(entry.ru.trim().toLowerCase(), entry);
	if (entry.en) LOOKUP_MAP.set(entry.en.trim().toLowerCase(), entry);
}

function normalizeLang(lang) {
	if (!lang) return getStoredLanguage() || "az";
	const l = String(lang).trim().toLowerCase();
	if (l.startsWith("ru")) return "ru";
	if (l.startsWith("en")) return "en";
	return "az";
}

export function translateError(errorOrMessage, lang) {
	if (!errorOrMessage) return "";
	let raw = "";
	if (typeof errorOrMessage === "string") {
		raw = errorOrMessage;
	} else if (errorOrMessage && typeof errorOrMessage === "object") {
		raw = errorOrMessage.message || errorOrMessage.error || String(errorOrMessage);
	}
	raw = String(raw).trim();
	if (!raw) return "";

	const targetLang = normalizeLang(lang);
	const lower = raw.toLowerCase();

	if (LOOKUP_MAP.has(lower)) {
		const entry = LOOKUP_MAP.get(lower);
		return entry[targetLang] || entry.az || raw;
	}

	const cardMatch = raw.match(/^(?:A card ending in (\d+) is already registered in your account\.|Sonluğu (\d+) ilə bitən kart artıq hesabınızda qeydiyyatdan keçib\.|Карта с окончанием (\d+) уже зарегистрирована в вашей учетной записи\.)$/i);
	if (cardMatch) {
		const digits = cardMatch[1] || cardMatch[2] || cardMatch[3];
		if (targetLang === "ru") return `Карта с окончанием ${digits} уже зарегистрирована в вашей учетной записи.`;
		if (targetLang === "en") return `A card ending in ${digits} is already registered in your account.`;
		return `Sonluğu ${digits} ilə bitən kart artıq hesabınızda qeydiyyatdan keçib.`;
	}

	const statusMatch = raw.match(/^(?:Payment status is '([^']+)'. Payment has not succeeded yet\.|Ödəniş statusu '([^']+)'. Ödəniş hələ uğurla tamamlanmayıb\.|Статус платежа '([^']+)'. Оплата еще не завершена успешно\.)$/i);
	if (statusMatch) {
		const st = statusMatch[1] || statusMatch[2] || statusMatch[3];
		if (targetLang === "ru") return `Статус платежа '${st}'. Оплата еще не завершена успешно.`;
		if (targetLang === "en") return `Payment status is '${st}'. Payment has not succeeded yet.`;
		return `Ödəniş statusu '${st}'. Ödəniş hələ uğurla tamamlanmayıb.`;
	}

	const roleMatch = raw.match(/^(?:Invalid role specified: '([^']*)'\.|Göstərilən rol yanlışdır: '([^']*)'\.|Указана неверная роль: '([^']*)'\.)$/i);
	if (roleMatch) {
		const r = roleMatch[1] || roleMatch[2] || roleMatch[3];
		if (targetLang === "ru") return `Указана неверная роль: '${r}'.`;
		if (targetLang === "en") return `Invalid role specified: '${r}'.`;
		return `Göstərilən rol yanlışdır: '${r}'.`;
	}

	const reviewMatch = raw.match(/^(?:Invalid review status: '([^']*)'\.|Rəyin statusu yanlışdır: '([^']*)'\.|Неверный статус отзыва: '([^']*)'\.)$/i);
	if (reviewMatch) {
		const s = reviewMatch[1] || reviewMatch[2] || reviewMatch[3];
		if (targetLang === "ru") return `Неверный статус отзыва: '${s}'.`;
		if (targetLang === "en") return `Invalid review status: '${s}'.`;
		return `Rəyin statusu yanlışdır: '${s}'.`;
	}

	const cashboxMatch = raw.match(/^(?:Invalid status\. Allowed values: (.*)|Yanlış status\. İcazə verilən dəyərlər: (.*)|Неверный статус\. Допустимые значения: (.*))$/i);
	if (cashboxMatch) {
		const v = cashboxMatch[1] || cashboxMatch[2] || cashboxMatch[3];
		if (targetLang === "ru") return `Неверный статус. Допустимые значения: ${v}`;
		if (targetLang === "en") return `Invalid status. Allowed values: ${v}`;
		return `Yanlış status. İcazə verilən dəyərlər: ${v}`;
	}

	return raw;
}

export default translateError;