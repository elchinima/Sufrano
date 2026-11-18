namespace Rednest.Api.Helpers;

public static class ErrorLocalizer
{
    private static readonly Dictionary<string, (string Az, string Ru, string En)> Translations =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["Cardholder name must contain only English letters without spaces (3-30 characters)."] = (
                "Kart sahibinin adı yalnız boşluqsuz ingilis hərflərindən ibarət olmalıdır (3-30 simvol).",
                "Имя владельца карты должно содержать только английские буквы без пробелов (от 3 до 30 символов).",
                "Cardholder name must contain only English letters without spaces (3-30 characters)."
            ),
            ["Cardholder name must contain only English letters without spaces."] = (
                "Kart sahibinin adı yalnız boşluqsuz ingilis hərflərindən ibarət olmalıdır.",
                "Имя владельца карты должно содержать только английские буквы без пробелов.",
                "Cardholder name must contain only English letters without spaces."
            ),
            ["Insufficient balance on your Süfrano account."] = (
                "Süfrano hesabınızda kifayət qədər balans yoxdur.",
                "Недостаточно средств на балансе вашего аккаунта Süfrano.",
                "Insufficient balance on your Süfrano account."
            ),
            ["15% discount applied (max 15 AZN)"] = (
                "15% endirim tətbiq edildi (maks. 15 AZN).",
                "Применена скидка 15% (макс. 15 AZN).",
                "15% discount applied (max 15 AZN)."
            ),
            ["25% discount applied (max 25 AZN)"] = (
                "25% endirim tətbiq edildi (maks. 25 AZN).",
                "Применена скидка 25% (макс. 25 AZN).",
                "25% discount applied (max 25 AZN)."
            ),
            ["15% discount applied"] = (
                "15% endirim tətbiq edildi.",
                "Применена скидка 15%.",
                "15% discount applied."
            ),
            ["25% discount applied"] = (
                "25% endirim tətbiq edildi.",
                "Применена скидка 25%.",
                "25% discount applied."
            ),
            ["Super prize: 30 AZN discount applied"] = (
                "Super hədiyyə: 30 AZN endirim tətbiq edildi.",
                "Суперприз: применена скидка 30 AZN.",
                "Super prize: 30 AZN discount applied."
            ),
            ["Free drink applied"] = (
                "Pulsuz içki tətbiq edildi.",
                "Бесплатный напиток применён.",
                "Free drink applied."
            ),
            ["Free dessert applied"] = (
                "Pulsuz desert tətbiq edildi.",
                "Бесплатный десерт применён.",
                "Free dessert applied."
            ),
            ["Basket is empty."] = (
                "Səbətiniz boşdur.",
                "Корзина пуста.",
                "Basket is empty."
            ),
            ["Items from basket not found in catalog."] = (
                "Səbətdəki məhsullar kataloqda tapılmadı.",
                "Товары из корзины не найдены в каталоге.",
                "Items from basket not found in catalog."
            ),
            ["Total amount is 0. Please checkout via cashier."] = (
                "Yekun məbləğ 0-dır. Zəhmət olmasa kassa vasitəsilə sifariş edin.",
                "Итоговая сумма равна 0. Пожалуйста, оформите заказ через кассу.",
                "Total amount is 0. Please checkout via cashier."
            ),
            ["PaymentIntentId is required."] = (
                "Ödəniş identifikatoru (PaymentIntentId) tələb olunur.",
                "Требуется идентификатор платежа (PaymentIntentId).",
                "PaymentIntentId is required."
            ),
            ["This payment intent does not belong to your account."] = (
                "Bu ödəniş cəhdi sizin hesabınıza aid deyil.",
                "Данный платёж не принадлежит вашей учетной записи.",
                "This payment intent does not belong to your account."
            ),
            ["Paid amount does not match the current order total."] = (
                "Ödənilən məbləğ cari sifariş məbləği ilə uyğun gəlmir.",
                "Оплаченная сумма не соответствует текущей сумме заказа.",
                "Paid amount does not match the current order total."
            ),
            ["Unsupported payment method for this endpoint. Online Stripe and Google Pay require Stripe confirmation."] = (
                "Bu keçid nöqtəsi üçün dəstəklənməyən ödəniş üsulu. Onlayn Stripe və Google Pay üçün Stripe təsdiqi tələb olunur.",
                "Неподдерживаемый способ оплаты для этого эндпоинта. Online Stripe и Google Pay требуют подтверждения через Stripe.",
                "Unsupported payment method for this endpoint. Online Stripe and Google Pay require Stripe confirmation."
            ),
            ["Valid payment card details or a saved card are required for online card payment."] = (
                "Onlayn kart ödənişi üçün düzgün kart məlumatları və ya yadda saxlanılmış kart tələb olunur.",
                "Для оплаты картой онлайн требуются действительные реквизиты карты или сохраненная карта.",
                "Valid payment card details or a saved card are required for online card payment."
            ),
            ["Order not found."] = (
                "Sifariş tapılmadı.",
                "Заказ не найден.",
                "Order not found."
            ),
            ["Order not found or does not belong to your account."] = (
                "Sifariş tapılmadı və ya hesabınıza aid deyil.",
                "Заказ не найден или не принадлежит вашей учетной записи.",
                "Order not found or does not belong to your account."
            ),
            ["Stripe secret key is not configured on the server."] = (
                "Serverdə Stripe açarı konfiqurasiya edilməyib.",
                "Секретный ключ Stripe не настроен на сервере.",
                "Stripe secret key is not configured on the server."
            ),

            ["Card number is required."] = (
                "Kart nömrəsi tələb olunur.",
                "Номер карты обязателен.",
                "Card number is required."
            ),
            ["Card number must be 16 digits."] = (
                "Kart nömrəsi 16 rəqəmdən ibarət olmalıdır.",
                "Номер карты должен состоять из 16 цифр.",
                "Card number must be 16 digits."
            ),
            ["Only Visa and Mastercard cards are supported."] = (
                "Yalnız Visa və Mastercard kartları dəstəklənir.",
                "Поддерживаются только карты Visa и Mastercard.",
                "Only Visa and Mastercard cards are supported."
            ),
            ["Invalid card number checksum (Luhn check failed)."] = (
                "Yanlış kart nömrəsi (Luhn yoxlaması uğursuz oldu).",
                "Неверный номер карты (контрольная сумма не совпадает).",
                "Invalid card number checksum (Luhn check failed)."
            ),
            ["Invalid or expired expiration date (format: MM/YY)."] = (
                "Yanlış və ya vaxtı bitmiş son istifadə tarixi (format: AA/İİ).",
                "Неверный или истекший срок действия карты (формат: ММ/ГГ).",
                "Invalid or expired expiration date (format: MM/YY)."
            ),
            ["CVC code must be exactly 3 digits."] = (
                "CVC kodu dəqiq 3 rəqəm olmalıdır.",
                "CVC-код должен состоять ровно из 3 цифр.",
                "CVC code must be exactly 3 digits."
            ),
            ["You can only save up to 3 payment cards. Please delete an existing card to add a new one."] = (
                "Yalnız 3 ödəniş kartı yadda saxlaya bilərsiniz. Yeni kart əlavə etmək üçün mövcud kartlardan birini silin.",
                "Вы можете сохранить не более 3 карт. Пожалуйста, удалите существующую карту, чтобы добавить новую.",
                "You can only save up to 3 payment cards. Please delete an existing card to add a new one."
            ),
            ["Invalid card number ending."] = (
                "Kart nömrəsinin sonluğu yanlışdır.",
                "Неверное окончание номера карты.",
                "Invalid card number ending."
            ),
            ["Payment method not found."] = (
                "Ödəniş üsulu tapılmadı.",
                "Способ оплаты не найден.",
                "Payment method not found."
            ),

            ["Address line is required."] = (
                "Ünvan mətni tələb olunur.",
                "Адресная строка обязательна.",
                "Address line is required."
            ),
            ["City is required."] = (
                "Şəhər tələb olunur.",
                "Город обязателен.",
                "City is required."
            ),
            ["Contact phone number is required."] = (
                "Əlaqə nömrəsi tələb olunur.",
                "Контактный номер телефона обязателен.",
                "Contact phone number is required."
            ),
            ["You can only save up to 3 delivery addresses. Please delete an existing address to add a new one."] = (
                "Yalnız 3 çatdırılma ünvanı yadda saxlaya bilərsiniz. Yenisini əlavə etmək üçün mövcud ünvanı silin.",
                "Вы можете сохранить не более 3 адресов доставки. Пожалуйста, удалите существующий адрес, чтобы добавить новый.",
                "You can only save up to 3 delivery addresses. Please delete an existing address to add a new one."
            ),
            ["Address not found."] = (
                "Ünvan tapılmadı.",
                "Адрес не найден.",
                "Address not found."
            ),

            ["Rating must be between 1.00 and 5.00."] = (
                "Qiymətləndirmə 1.00 ilə 5.00 arasında olmalıdır.",
                "Рейтинг должен быть от 1.00 до 5.00.",
                "Rating must be between 1.00 and 5.00."
            ),
            ["Comment must be at least 5 characters long."] = (
                "Rəy ən azı 5 simvoldan ibarət olmalıdır.",
                "Отзыв должен содержать не менее 5 символов.",
                "Comment must be at least 5 characters long."
            ),
            ["Comment cannot exceed 300 characters."] = (
                "Rəy 300 simvoldan çox ola bilməz.",
                "Отзыв не должен превышать 300 символов.",
                "Comment cannot exceed 300 characters."
            ),
            ["Invalid category. Allowed values: Delivery, Products, Service, Staff."] = (
                "Yanlış kateqoriya. İcazə verilən dəyərlər: Çatdırılma, Məhsullar, Xidmət, Heyət.",
                "Неверная категория. Допустимые значения: Доставка, Продукты, Обслуживание, Персонал.",
                "Invalid category. Allowed values: Delivery, Products, Service, Staff."
            ),
            ["Reviews can only be submitted after the order status is Complete."] = (
                "Rəy yalnız sifariş statusu Tamamlandı olduqdan sonra yazıla bilər.",
                "Отзыв можно оставить только после того, как заказ будет выполнен.",
                "Reviews can only be submitted after the order status is Complete."
            ),
            ["You have already submitted a review for this order."] = (
                "Bu sifariş üçün artıq rəy bildirmisiniz.",
                "Вы уже оставили отзыв для этого заказа.",
                "You have already submitted a review for this order."
            ),
            ["Review not found."] = (
                "Rəy tapılmadı.",
                "Отзыв не найден.",
                "Review not found."
            ),
            ["You cannot like your own review."] = (
                "Öz rəyinizə bəyənmə qoya bilməzsiniz.",
                "Вы не можете оценивать собственный отзыв.",
                "You cannot like your own review."
            ),

            ["Invalid credentials"] = (
                "Yanlış e-poçt və ya şifrə.",
                "Неверный логин или пароль.",
                "Invalid credentials."
            ),
            ["Invalid credentials."] = (
                "Yanlış e-poçt və ya şifrə.",
                "Неверный логин или пароль.",
                "Invalid credentials."
            ),
            ["Your account has been suspended or blocked."] = (
                "Hesabınız dayandırılıb və ya bloklanıb.",
                "Ваша учетная запись заблокирована или приостановлена.",
                "Your account has been suspended or blocked."
            ),
            ["Access denied. Logging into accounts with the Bot or AI role is prohibited."] = (
                "Giriş qadağandır. Bot və ya AI roluna malik hesablara daxil olmaq qadağandır.",
                "Доступ запрещен. Вход в учетные записи с ролью Bot или AI запрещен.",
                "Access denied. Logging into accounts with the Bot or AI role is prohibited."
            ),
            ["Access denied. Logging into accounts with the Bot or AI role is prohibited"] = (
                "Giriş qadağandır. Bot və ya AI roluna malik hesablara daxil olmaq qadağandır.",
                "Доступ запрещен. Вход в учетные записи с ролью Bot или AI запрещен.",
                "Access denied. Logging into accounts with the Bot or AI role is prohibited."
            ),
            ["Access denied for Bot and AI accounts."] = (
                "Bot və AI hesabları üçün giriş qadağandır.",
                "Доступ запрещен для учетных записей Bot и AI.",
                "Access denied for Bot and AI accounts."
            ),
            ["Access denied for Bot and AI accounts"] = (
                "Bot və AI hesabları üçün giriş qadağandır.",
                "Доступ запрещен для учетных записей Bot и AI.",
                "Access denied for Bot and AI accounts."
            ),
            ["Access denied. Bot and AI accounts cannot sign in."] = (
                "Giriş qadağandır. Bot və AI hesabları daxil ola bilməz.",
                "Доступ запрещен. Учетные записи Bot и AI не могут войти в систему.",
                "Access denied. Bot and AI accounts cannot sign in."
            ),
            ["Access denied. Bot and AI accounts cannot sign in"] = (
                "Giriş qadağandır. Bot və AI hesabları daxil ola bilməz.",
                "Доступ запрещен. Учетные записи Bot и AI не могут войти в систему.",
                "Access denied. Bot and AI accounts cannot sign in."
            ),
            ["System accounts cannot sign in interactively."] = (
                "Sistem hesabları interaktiv daxil ola bilməz.",
                "Системные учетные записи не могут войти интерактивно.",
                "System accounts cannot sign in interactively."
            ),
            ["Email and verification code are required"] = (
                "E-poçt və təsdiq kodu tələb olunur.",
                "Требуется электронная почта и код подтверждения.",
                "Email and verification code are required."
            ),
            ["Email and verification code are required."] = (
                "E-poçt və təsdiq kodu tələb olunur.",
                "Требуется электронная почта и код подтверждения.",
                "Email and verification code are required."
            ),
            ["Email is required"] = (
                "E-poçt ünvanı tələb olunur.",
                "Электронная почта обязательна.",
                "Email is required."
            ),
            ["Email is required."] = (
                "E-poçt ünvanı tələb olunur.",
                "Электронная почта обязательна.",
                "Email is required."
            ),
            ["Verification code is required."] = (
                "Təsdiq kodu tələb olunur.",
                "Требуется код подтверждения.",
                "Verification code is required."
            ),
            ["Invalid or expired verification code"] = (
                "Yanlış və ya vaxtı bitmiş təsdiq kodu.",
                "Неверный или истекший код подтверждения.",
                "Invalid or expired verification code."
            ),
            ["Invalid or expired verification code."] = (
                "Yanlış və vaxtı bitmiş təsdiq kodu.",
                "Неверный или истекший код подтверждения.",
                "Invalid or expired verification code."
            ),
            ["Invalid verification code"] = (
                "Yanlış təsdiq kodu.",
                "Неверный код подтверждения.",
                "Invalid verification code."
            ),
            ["Invalid verification code. Please check the code and try again."] = (
                "Yanlış təsdiq kodu. Zəhmət olmasa kodu yoxlayıb yenidən cəhd edin.",
                "Неверный код подтверждения. Пожалуйста, проверьте код и попробуйте снова.",
                "Invalid verification code. Please check the code and try again."
            ),
            ["Verification code has expired. Please request a new code."] = (
                "Təsdiq kodunun vaxtı bitib. Zəhmət olmasa yeni kod tələb edin.",
                "Срок действия кода подтверждения истек. Пожалуйста, запросите новый код.",
                "Verification code has expired. Please request a new code."
            ),
            ["Too many failed verification attempts. Please sign in again."] = (
                "Həddindən artıq uğursuz cəhd. Zəhmət olmasa yenidən daxil olun.",
                "Слишком много неудачных попыток. Пожалуйста, войдите снова.",
                "Too many failed verification attempts. Please sign in again."
            ),
            ["Please wait at least 60 seconds before requesting a new verification code."] = (
                "Zəhmət olmasa yeni kod tələb etməzdən əvvəl ən azı 60 saniyə gözləyin.",
                "Пожалуйста, подождите не менее 60 секунд перед запросом нового кода.",
                "Please wait at least 60 seconds before requesting a new verification code."
            ),
            ["This email is not registered. Please create an account first."] = (
                "Bu e-poçt qeydiyyatdan keçməyib. Zəhmət olmasa əvvəlcə qeydiyyatdan keçin.",
                "Этот адрес электронной почты не зарегистрирован. Пожалуйста, сначала создайте аккаунт.",
                "This email is not registered. Please create an account first."
            ),
            ["This email is not registered."] = (
                "Bu e-poçt qeydiyyatdan keçməyib.",
                "Этот адрес электронной почты не зарегистрирован.",
                "This email is not registered."
            ),
            ["No account found with this email address."] = (
                "Bu e-poçt ünvanı ilə hesab tapılmadı.",
                "Аккаунт с таким адресом электронной почты не найден.",
                "No account found with this email address."
            ),
            ["This email is already subscribed to the newsletter. If you need assistance or wish to change your subscription, please contact technical support at hello@sufrano.com."] = (
                "Bu e-poçt artıq bülletenə abunədir. Əgər kömək lazımdırsa və ya abunəliyi dəyişmək istəyirsinizsə, hello@sufrano.com ünvanı ilə əlaqə saxlayın.",
                "Этот адрес уже подписан на рассылку. Если вам нужна помощь или вы хотите изменить подписку, обратитесь в службу поддержки: hello@sufrano.com.",
                "This email is already subscribed to the newsletter. If you need assistance or wish to change your subscription, please contact technical support at hello@sufrano.com."
            ),
            ["New password is required."] = (
                "Yeni şifrə tələb olunur.",
                "Требуется новый пароль.",
                "New password is required."
            ),
            ["Password must be at least 6 characters long."] = (
                "Şifrə ən azı 6 simvoldan ibarət olmalıdır.",
                "Пароль должен содержать не менее 6 символов.",
                "Password must be at least 6 characters long."
            ),
            ["Account not found. Please register first with your email and password before signing in with Google."] = (
                "Hesab tapılmadı. Google ilə daxil olmazdan əvvəl e-poçt və şifrənizlə qeydiyyatdan keçin.",
                "Аккаунт не найден. Пожалуйста, сначала зарегистрируйтесь с помощью почты и пароля перед входом через Google.",
                "Account not found. Please register first with your email and password before signing in with Google."
            ),
            ["Current password is incorrect."] = (
                "Cari şifrə yanlışdır.",
                "Текущий пароль неверен.",
                "Current password is incorrect."
            ),
            ["New password cannot be the same as the current password."] = (
                "Yeni şifrə cari şifrə ilə eyni ola bilməz.",
                "Новый пароль не может совпадать с текущим паролем.",
                "New password cannot be the same as the current password."
            ),
            ["New password and confirmation do not match."] = (
                "Yeni şifrə və təsdiqi uyğun gəlmir.",
                "Новый пароль и подтверждение не совпадают.",
                "New password and confirmation do not match."
            ),
            ["Name cannot be empty."] = (
                "Ad boş ola bilməz.",
                "Имя не может быть пустым.",
                "Name cannot be empty."
            ),
            ["Name cannot contain spaces."] = (
                "Ad boşluq simvolu ehtiva edə bilməz.",
                "Имя не может содержать пробелы.",
                "Name cannot contain spaces."
            ),
            ["Name must not contain spaces."] = (
                "Ad boşluq simvolu ehtiva etməməlidir.",
                "Имя не должно содержать пробелы.",
                "Name must not contain spaces."
            ),
            ["Name cannot exceed 50 characters."] = (
                "Ad 50 simvoldan çox ola bilməz.",
                "Имя не может превышать 50 символов.",
                "Name cannot exceed 50 characters."
            ),
            ["Two-Factor Authentication is not enabled for this account"] = (
                "Bu hesab üçün İki Mərhələli Təsdiqləmə aktivləşdirilməyib.",
                "Двухфакторная аутентификация не включена для этого аккаунта.",
                "Two-Factor Authentication is not enabled for this account."
            ),
            ["Cannot revoke the current active session."] = (
                "Cari aktiv sessiyanı ləğv etmək mümkün deyil.",
                "Невозможно отозвать текущую активную сессию.",
                "Cannot revoke the current active session."
            ),
            ["User session record not found."] = (
                "İstifadəçi sessiyası tapılmadı.",
                "Запись сессии пользователя не найдена.",
                "User session record not found."
            ),
            ["User not found."] = (
                "İstifadəçi tapılmadı.",
                "Пользователь не найден.",
                "User not found."
            ),
            ["User not found"] = (
                "İstifadəçi tapılmadı.",
                "Пользователь не найден.",
                "User not found."
            ),
            ["Security verification required. Please enter your account password."] = (
                "Təhlükəsizlik təsdiqi tələb olunur. Zəhmət olmasa hesab şifrənizi daxil edin.",
                "Требуется проверка безопасности. Пожалуйста, введите пароль от вашей учетной записи.",
                "Security verification required. Please enter your account password."
            ),
            ["Google account does not provide an email address."] = (
                "Google hesabı e-poçt ünvanı təqdim etmir.",
                "Аккаунт Google не предоставил адрес электронной почты.",
                "Google account does not provide an email address."
            ),
            ["Google email is not verified."] = (
                "Google e-poçt ünvanı təsdiqlənməyib.",
                "Адрес электронной почты Google не подтвержден.",
                "Google email is not verified."
            ),
            ["Failed to obtain Google access token."] = (
                "Google giriş nişanı almaq mümkün olmadı.",
                "Не удалось получить токен доступа Google.",
                "Failed to obtain Google access token."
            ),
            ["Invalid, terminated or expired refresh token"] = (
                "Yeniləmə nişanı yanlışdır, ləğv edilib və ya vaxtı bitib.",
                "Токен обновления недействителен, отозван или истек.",
                "Invalid, terminated or expired refresh token."
            ),

            ["Order must contain at least one item."] = (
                "Sifarişdə ən azı bir məhsul olmalıdır.",
                "Заказ должен содержать хотя бы один товар.",
                "Order must contain at least one item."
            ),
            ["Promo code not found."] = (
                "Promokod tapılmadı.",
                "Промокод не найден.",
                "Promo code not found."
            ),
            ["Promo code is expired or has already been used."] = (
                "Promokodun vaxtı bitib və ya artıq istifadə olunub.",
                "Срок действия промокода истек или он уже был использован.",
                "Promo code is expired or has already been used."
            ),
            ["Cashbox order not found."] = (
                "Kassa sifarişi tapılmadı.",
                "Заказ на кассе не найден.",
                "Cashbox order not found."
            ),

            ["You must be logged in with an active account to access the admin panel."] = (
                "İnzibatçı panelinə daxil olmaq üçün aktiv hesabınızla daxil olmalısınız.",
                "Для доступа к панели администратора необходимо войти с активным аккаунтом.",
                "You must be logged in with an active account to access the admin panel."
            ),
            ["Admin session invalid or expired."] = (
                "İnzibatçı sessiyası yanlışdır və ya vaxtı bitib.",
                "Сессия администратора недействительна или истекла.",
                "Admin session invalid or expired."
            ),
            ["Admin session expired or invalid."] = (
                "İnzibatçı sessiyası yanlışdır və ya vaxtı bitib.",
                "Сессия администратора недействительна или истекла.",
                "Admin session invalid or expired."
            ),
            ["Incorrect password."] = (
                "Yanlış şifrə.",
                "Неверный пароль.",
                "Incorrect password."
            ),
            ["Account suspended."] = (
                "Hesab dayandırılıb.",
                "Учетная запись заблокирована.",
                "Account suspended."
            ),
            ["User account not found."] = (
                "İstifadəçi hesabı tapılmadı.",
                "Аккаунт пользователя не найден.",
                "User account not found."
            ),
            ["You cannot deactivate or block your own account."] = (
                "Öz hesabınızı deaktiv və ya blok edə bilməzsiniz.",
                "Вы не можете деактивировать или заблокировать свою учетную запись.",
                "You cannot deactivate or block your own account."
            ),
            ["This email is already registered to another account."] = (
                "Bu e-poçt artıq başqa hesabda qeydiyyatdan keçib.",
                "Этот адрес электронной почты уже зарегистрирован на другой аккаунт.",
                "This email is already registered to another account."
            ),
            ["System roles 'Bot' and 'AI' cannot be assigned via the admin panel."] = (
                "Sistem rolları ('Bot' və 'AI') admin paneli vasitəsilə təyin edilə bilməz.",
                "Системные роли «Bot» и «AI» не могут быть назначены через панель администратора.",
                "System roles 'Bot' and 'AI' cannot be assigned via the admin panel."
            ),
            ["You cannot change your own role."] = (
                "Öz rolunuzu dəyişə bilməzsiniz.",
                "Вы не можете изменить свою собственную роль.",
                "You cannot change your own role."
            ),
            ["You cannot modify the role of a user with an equal or higher role than yours."] = (
                "Siz öz rolunuzla bərabər və ya daha yüksək rolu olan istifadəçinin rolunu dəyişə bilməzsiniz.",
                "Вы не можете изменять роль пользователя с равной или более высокой ролью, чем ваша.",
                "You cannot modify the role of a user with an equal or higher role than yours."
            ),
            ["You cannot assign your own role or a higher role to any user."] = (
                "İstifadəçiyə öz rolunuzu və ya daha yüksək rolu təyin edə bilməzsiniz.",
                "Вы не можете назначить пользователю свою или более высокую роль.",
                "You cannot assign your own role or a higher role to any user."
            ),
            ["You cannot terminate your own active sessions from the admin panel."] = (
                "Admin panelindən öz aktiv sessiyanızı sonlandıra bilməzsiniz.",
                "Вы не можете завершить свои собственные активные сессии из панели администратора.",
                "You cannot terminate your own active sessions from the admin panel."
            ),
            ["You cannot delete your own account."] = (
                "Öz hesabınızı silə bilməzsiniz.",
                "Вы не можете удалить свою учетную запись.",
                "You cannot delete your own account."
            ),
            ["System accounts cannot be deleted."] = (
                "Sistem hesabları silinə bilməz.",
                "Системные учетные записи не могут быть удалены.",
                "System accounts cannot be deleted."
            ),
            ["Status cannot be empty."] = (
                "Status boş ola bilməz.",
                "Статус не может быть пустым.",
                "Status cannot be empty."
            ),
            ["File not selected."] = (
                "Fayl seçilməyib.",
                "Файл не выбран.",
                "File not selected."
            ),
            ["File exceeds 10 MB limit."] = (
                "Fayl 10 MB limitini aşır.",
                "Размер файла превышает 10 МБ.",
                "File exceeds 10 MB limit."
            ),
            ["Allowed formats: PNG, JPG, JPEG."] = (
                "İcazə verilən formatlar: PNG, JPG, JPEG.",
                "Допустимые форматы: PNG, JPG, JPEG.",
                "Allowed formats: PNG, JPG, JPEG."
            ),
            ["Product name is required."] = (
                "Məhsulun adı tələb olunur.",
                "Название продукта обязательно.",
                "Product name is required."
            ),
            ["Product name cannot exceed 50 characters."] = (
                "Məhsulun adı 50 simvoldan çox ola bilməz.",
                "Название продукта не может превышать 50 символов.",
                "Product name cannot exceed 50 characters."
            ),
            ["Product description cannot exceed 250 characters."] = (
                "Məhsulun təsviri 250 simvoldan çox ola bilməz.",
                "Описание продукта не может превышать 250 символов.",
                "Product description cannot exceed 250 characters."
            ),
            ["A valid product price is required."] = (
                "Düzgün məhsul qiyməti tələb olunur.",
                "Требуется указать действительную цену продукта.",
                "A valid product price is required."
            ),
            ["Discount price cannot be negative."] = (
                "Endirimli qiymət mənfi ola bilməz.",
                "Цена со скидкой не может быть отрицательной.",
                "Discount price cannot be negative."
            ),
            ["Product not found."] = (
                "Məhsul tapılmadı.",
                "Продукт не найден.",
                "Product not found."
            ),
            ["Recipient test email address is required."] = (
                "Alıcının test e-poçt ünvanı tələb olunur.",
                "Требуется тестовый адрес электронной почты получателя.",
                "Recipient test email address is required."
            ),
            ["Email subject is required."] = (
                "Məktubun mövzusu tələb olunur.",
                "Тема письма обязательна.",
                "Email subject is required."
            ),
            ["Email body content is required."] = (
                "Məktubun mətni tələb olunur.",
                "Текст письма обязателен.",
                "Email body content is required."
            ),
            ["No active subscribed users found in the system."] = (
                "Sistemdə heç bir aktiv abunəçi tapılmadı.",
                "В системе не найдено активных подписчиков.",
                "No active subscribed users found in the system."
            ),
            ["Unauthorized."] = (
                "İcazə verilmədi.",
                "Не авторизован.",
                "Unauthorized."
            ),
            ["You have made too many requests in a short period. Please wait a moment before trying again."] = (
                "Qısa müddətdə həddindən artıq sorğu göndərdiniz. Zəhmət olmasa yenidən cəhd etməzdən əvvəl bir qədər gözləyin.",
                "Вы сделали слишком много запросов за короткое время. Пожалуйста, подождите немного перед повторной попыткой.",
                "You have made too many requests in a short period. Please wait a moment before trying again."
            )
        };

    public static string NormalizeLanguage(string? lang)
    {
        if (string.IsNullOrWhiteSpace(lang)) return "az";
        var l = lang.Trim().ToLowerInvariant();
        if (l.StartsWith("ru")) return "ru";
        if (l.StartsWith("en")) return "en";
        if (l.StartsWith("az")) return "az";
        return "az";
    }

    public static string GetLanguage(HttpContext? context)
    {
        if (context == null) return "az";

        if (context.Request.Query.TryGetValue("lang", out var queryLang) && !string.IsNullOrWhiteSpace(queryLang))
        {
            return NormalizeLanguage(queryLang);
        }

        if (context.Request.Headers.TryGetValue("X-Language", out var xLang) && !string.IsNullOrWhiteSpace(xLang))
        {
            return NormalizeLanguage(xLang);
        }

        if (context.Request.Headers.TryGetValue("Accept-Language", out var acceptLang) && !string.IsNullOrWhiteSpace(acceptLang))
        {
            var firstLang = acceptLang.ToString().Split(',', ';')[0].Trim();
            return NormalizeLanguage(firstLang);
        }

        return "az";
    }

    public static string Localize(string message, string lang)
    {
        if (string.IsNullOrWhiteSpace(message)) return message;
        var normalizedLang = NormalizeLanguage(lang);

        var trimmed = message.Trim();
        if (Translations.TryGetValue(trimmed, out var entry))
        {
            return normalizedLang switch
            {
                "ru" => entry.Ru,
                "en" => entry.En,
                _ => entry.Az
            };
        }

        var cardMatch = Regex.Match(trimmed, @"^A card ending in (\d+) is already registered in your account\.$", RegexOptions.IgnoreCase);
        if (cardMatch.Success)
        {
            var digits = cardMatch.Groups[1].Value;
            return normalizedLang switch
            {
                "ru" => $"Карта с окончанием {digits} уже зарегистрирована в вашей учетной записи.",
                "en" => $"A card ending in {digits} is already registered in your account.",
                _ => $"Sonluğu {digits} ilə bitən kart artıq hesabınızda qeydiyyatdan keçib."
            };
        }

        var statusMatch = Regex.Match(trimmed, @"^Payment status is '([^']+)'. Payment has not succeeded yet\.$", RegexOptions.IgnoreCase);
        if (statusMatch.Success)
        {
            var st = statusMatch.Groups[1].Value;
            return normalizedLang switch
            {
                "ru" => $"Статус платежа '{st}'. Оплата еще не завершена успешно.",
                "en" => $"Payment status is '{st}'. Payment has not succeeded yet.",
                _ => $"Ödəniş statusu '{st}'. Ödəniş hələ uğurla tamamlanmayıb."
            };
        }

        var roleMatch = Regex.Match(trimmed, @"^Invalid role specified: '([^']*)'\.$", RegexOptions.IgnoreCase);
        if (roleMatch.Success)
        {
            var r = roleMatch.Groups[1].Value;
            return normalizedLang switch
            {
                "ru" => $"Указана неверная роль: '{r}'.",
                "en" => $"Invalid role specified: '{r}'.",
                _ => $"Göstərilən rol yanlışdır: '{r}'."
            };
        }

        var reviewStatusMatch = Regex.Match(trimmed, @"^Invalid review status: '([^']*)'\.$", RegexOptions.IgnoreCase);
        if (reviewStatusMatch.Success)
        {
            var s = reviewStatusMatch.Groups[1].Value;
            return normalizedLang switch
            {
                "ru" => $"Неверный статус отзыва: '{s}'.",
                "en" => $"Invalid review status: '{s}'.",
                _ => $"Rəyin statusu yanlışdır: '{s}'."
            };
        }

        var cashboxStatusMatch = Regex.Match(trimmed, @"^Invalid status\. Allowed values: (.*)$", RegexOptions.IgnoreCase);
        if (cashboxStatusMatch.Success)
        {
            var vals = cashboxStatusMatch.Groups[1].Value;
            return normalizedLang switch
            {
                "ru" => $"Неверный статус. Допустимые значения: {vals}",
                "en" => $"Invalid status. Allowed values: {vals}",
                _ => $"Yanlış status. İcazə verilən dəyərlər: {vals}"
            };
        }

        return message;
    }

    public static string Localize(HttpContext? context, string message)
    {
        return Localize(message, GetLanguage(context));
    }

    public static string Localize(this ControllerBase controller, string message)
    {
        return Localize(controller.HttpContext, message);
    }
}
