(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/UserPages/Profile/Lang.js
	__define("components/UserPages/Profile/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"profile_hero_title": "Мой профиль",
				"profile_hero_desc": "Управление безопасностью аккаунта и персональными данными",
				"profile_avatar_add": "Добавить",
				"profile_avatar_change": "Изменить",
				"profile_avatar_delete": "Удалить",
				"profile_field_name": "Имя",
				"profile_field_email": "Электронная почта",
				"profile_badge_locked": "Заблокировано",
				"profile_row_password_title": "Сменить пароль",
				"profile_row_password_desc": "Обновите пароль вашей учетной записи для повышения безопасности",
				"profile_row_password_btn": "Сменить пароль",
				"profile_row_sessions_title": "Активные сессии",
				"profile_row_sessions_desc": "Просмотр и управление устройствами, с которых выполнен вход",
				"profile_row_sessions_btn": "Все сессии",
				"profile_row_2fa_title": "Двухфакторная аутентификация (2FA)",
				"profile_row_2fa_desc": "Дополнительный уровень безопасности при входе в аккаунт",
				"profile_row_2fa_enabled": "Включено",
				"profile_row_2fa_disabled": "Отключено",
				"profile_row_payments_title": "Способы оплаты",
				"profile_row_payments_desc": "Управление банковскими картами и балансом кошелька",
				"profile_row_payments_btn": "Способы оплаты",
				"profile_row_orders_title": "История заказов",
				"profile_row_orders_desc": "Просмотр прошлых заказов, чеков и текущих статусов",
				"profile_row_orders_btn": "Мои заказы",
				"profile_row_addresses_title": "Адреса доставки",
				"profile_row_addresses_desc": "Добавляйте и редактируйте адреса для быстрой доставки",
				"profile_row_addresses_btn": "Мои адреса",
				"profile_row_reviews_title": "Мои отзывы",
				"profile_row_reviews_desc": "Ваши оценки и впечатления о блюдах и сервисе Süfrano",
				"profile_row_reviews_btn": "Мои отзывы",
				"profile_row_fortune_title": "Колесо фортуны",
				"profile_row_fortune_desc": "Вращайте колесо и выигрывайте скидки и подарки",
				"profile_row_fortune_btn": "К колесу",
				"profile_row_promos_title": "Промокоды и подарки",
				"profile_row_promos_desc": "Ваши активные промокоды, подарки и скидочные штрихкоды",
				"profile_row_promos_btn": "Мои промокоды",
				"profile_payments_modal_title": "Способы оплаты",
				"profile_payments_modal_desc": "Управление способами оплаты будет доступно в ближайшем обновлении.",
				"profile_orders_modal_title": "История заказов",
				"profile_orders_modal_desc": "История и отслеживание заказов будут доступны в ближайшем обновлении.",
				"profile_modal_got_it": "Понятно",
				"profile_delete_avatar_title": "Удалить фото профиля?",
				"profile_delete_avatar_text": "Это навсегда удалит ваше фото и вернет стандартный аватар. Вы сможете загрузить новое фото в любое время.",
				"profile_delete_avatar_cancel": "Отмена",
				"profile_delete_avatar_confirm": "Удалить",
				"profile_delete_avatar_deleting": "Удаление...",
				"profile_toast_avatar_updated": "Фотография профиля успешно обновлена.",
				"profile_toast_avatar_deleted": "Фотография профиля удалена.",
				"profile_toast_password_changed": "Пароль успешно изменен.",
				"pwd_modal_title": "Смена пароля",
				"pwd_modal_desc": "Введите текущий пароль и укажите надежный новый.",
				"pwd_modal_current": "Текущий пароль",
				"pwd_modal_current_placeholder": "Введите текущий пароль",
				"pwd_modal_new": "Новый пароль",
				"pwd_modal_new_placeholder": "Минимум 6 символов",
				"pwd_modal_confirm": "Подтверждение нового пароля",
				"pwd_modal_confirm_placeholder": "Повторите новый пароль",
				"pwd_modal_btn_cancel": "Отмена",
				"pwd_modal_btn_submit": "Обновить пароль",
				"pwd_modal_btn_updating": "Обновление...",
				"pwd_err_current_required": "Пожалуйста, введите текущий пароль.",
				"pwd_err_new_required": "Пожалуйста, введите новый пароль.",
				"pwd_err_length": "Новый пароль должен содержать минимум 6 символов.",
				"pwd_err_same": "Новый пароль не может совпадать с текущим.",
				"pwd_err_mismatch": "Пароли не совпадают.",
				"pwd_err_conn": "Ошибка подключения. Пожалуйста, попробуйте снова.",
				"pwd_success": "Пароль успешно изменен.",
				"crop_modal_title": "Кадрирование фотографии",
				"crop_modal_hint": "Перетащите и настройте масштаб в квадратной области",
				"crop_modal_cancel": "Отмена",
				"crop_modal_apply": "Применить",
				"crop_modal_saving": "Сохранение..."
			},
			en: {
				"profile_hero_title": "My Profile",
				"profile_hero_desc": "Manage your account security and personal details",
				"profile_avatar_add": "Add",
				"profile_avatar_change": "Change",
				"profile_avatar_delete": "Delete",
				"profile_field_name": "Name",
				"profile_field_email": "Email",
				"profile_badge_locked": "Locked",
				"profile_row_password_title": "Change Password",
				"profile_row_password_desc": "Update your account password for enhanced security",
				"profile_row_password_btn": "Change Password",
				"profile_row_sessions_title": "Active Sessions",
				"profile_row_sessions_desc": "View and manage devices currently logged into your account",
				"profile_row_sessions_btn": "View Sessions",
				"profile_row_2fa_title": "Two-Factor Authentication (2FA)",
				"profile_row_2fa_desc": "Add an additional layer of security during sign in",
				"profile_row_2fa_enabled": "Enabled",
				"profile_row_2fa_disabled": "Disabled",
				"profile_row_payments_title": "Payment Methods",
				"profile_row_payments_desc": "Manage your credit cards, Google Pay, and wallet balances",
				"profile_row_payments_btn": "Manage Payments",
				"profile_row_orders_title": "Order History",
				"profile_row_orders_desc": "View past orders, receipts, and order statuses",
				"profile_row_orders_btn": "View Orders",
				"profile_row_addresses_title": "Delivery Addresses",
				"profile_row_addresses_desc": "Add and manage your default delivery destinations",
				"profile_row_addresses_btn": "Manage Addresses",
				"profile_row_reviews_title": "Your Reviews",
				"profile_row_reviews_desc": "View and manage your reviews on products and services",
				"profile_row_reviews_btn": "My Reviews",
				"profile_row_fortune_title": "Wheel of Fortune",
				"profile_row_fortune_desc": "Spin to win discounts, free drinks, and gifts",
				"profile_row_fortune_btn": "Spin Fortune",
				"profile_row_promos_title": "Promocodes & Gifts",
				"profile_row_promos_desc": "View your active promos, discounts, and prize barcodes",
				"profile_row_promos_btn": "My Promos",
				"profile_payments_modal_title": "Payment Methods",
				"profile_payments_modal_desc": "Payment method management will be available in an upcoming update.",
				"profile_orders_modal_title": "Order History",
				"profile_orders_modal_desc": "Order history and tracking will be available in an upcoming update.",
				"profile_modal_got_it": "Got it",
				"profile_delete_avatar_title": "Delete Profile Photo?",
				"profile_delete_avatar_text": "This will permanently remove your photo and restore the default avatar. You can upload a new one anytime.",
				"profile_delete_avatar_cancel": "Cancel",
				"profile_delete_avatar_confirm": "Delete",
				"profile_delete_avatar_deleting": "Deleting...",
				"profile_toast_avatar_updated": "Profile photo updated successfully.",
				"profile_toast_avatar_deleted": "Profile photo removed.",
				"profile_toast_password_changed": "Password changed successfully.",
				"pwd_modal_title": "Change Password",
				"pwd_modal_desc": "Enter your current password and choose a secure new one.",
				"pwd_modal_current": "Current Password",
				"pwd_modal_current_placeholder": "Enter current password",
				"pwd_modal_new": "New Password",
				"pwd_modal_new_placeholder": "At least 6 characters",
				"pwd_modal_confirm": "Confirm New Password",
				"pwd_modal_confirm_placeholder": "Repeat new password",
				"pwd_modal_btn_cancel": "Cancel",
				"pwd_modal_btn_submit": "Update Password",
				"pwd_modal_btn_updating": "Updating...",
				"pwd_err_current_required": "Please enter your current password.",
				"pwd_err_new_required": "Please enter a new password.",
				"pwd_err_length": "New password must be at least 6 characters long.",
				"pwd_err_same": "New password cannot be the same as current password.",
				"pwd_err_mismatch": "Passwords do not match.",
				"pwd_err_conn": "Connection error. Please try again.",
				"pwd_success": "Password changed successfully.",
				"crop_modal_title": "Crop & Position Photo",
				"crop_modal_hint": "Drag to move and use slider to zoom into square",
				"crop_modal_cancel": "Cancel",
				"crop_modal_apply": "Apply",
				"crop_modal_saving": "Saving..."
			},
			az: {
				"profile_hero_title": "Mənim profilim",
				"profile_hero_desc": "Hesab təhlükəsizliyinizi və şəxsi məlumatlarınızı idarə edin",
				"profile_avatar_add": "Əlavə et",
				"profile_avatar_change": "Dəyiş",
				"profile_avatar_delete": "Sil",
				"profile_field_name": "Ad",
				"profile_field_email": "E-poçt",
				"profile_badge_locked": "Kilidlənib",
				"profile_row_password_title": "Şifrəni dəyiş",
				"profile_row_password_desc": "Təhlükəsizliyi artırmaq üçün hesabınızın şifrəsini yeniləyin",
				"profile_row_password_btn": "Şifrəni dəyiş",
				"profile_row_sessions_title": "Aktiv sessiyalar",
				"profile_row_sessions_desc": "Hesabınıza daxil olan cihazları nəzərdən keçirin və idarə edin",
				"profile_row_sessions_btn": "Sessiyalara bax",
				"profile_row_2fa_title": "İki mərhələli autentifikasiya (2FA)",
				"profile_row_2fa_desc": "Giriş zamanı əlavə təhlükəsizlik qatı əlavə edin",
				"profile_row_2fa_enabled": "Aktiv",
				"profile_row_2fa_disabled": "Deaktiv",
				"profile_row_payments_title": "Ödəniş üsulları",
				"profile_row_payments_desc": "Bank kartlarınızı və balansınızı idarə edin",
				"profile_row_payments_btn": "Ödənişləri idarə et",
				"profile_row_orders_title": "Sifariş tarixçəsi",
				"profile_row_orders_desc": "Əvvəlki sifarişlərinizə, qəbzlərə və sifariş statuslarına baxın",
				"profile_row_orders_btn": "Sifarişlərə bax",
				"profile_row_addresses_title": "Çatdırılma ünvanları",
				"profile_row_addresses_desc": "Sürətli çatdırılma üçün ünvanlarınızı idarə edin",
				"profile_row_addresses_btn": "Ünvanlara bax",
				"profile_row_reviews_title": "Mənim rəylərim",
				"profile_row_reviews_desc": "Məhsullar və xidmətlər haqqında yazdığınız rəylər",
				"profile_row_reviews_btn": "Rəylərimə bax",
				"profile_row_fortune_title": "Hədiyyə çarxı",
				"profile_row_fortune_desc": "Çarxı fırladın və endirimlər, pulsuz içkilər qazanın",
				"profile_row_fortune_btn": "Çarxı fırlat",
				"profile_row_promos_title": "Promokodlar və hədiyyələr",
				"profile_row_promos_desc": "Aktiv promokodlarınıza və hədiyyə barkodlarınıza baxın",
				"profile_row_promos_btn": "Promokodlarım",
				"profile_payments_modal_title": "Ödəniş üsulları",
				"profile_payments_modal_desc": "Ödəniş üsullarının idarə edilməsi tezliklə təqdim olunacaq.",
				"profile_orders_modal_title": "Sifariş tarixçəsi",
				"profile_orders_modal_desc": "Sifariş tarixçəsi və izlənməsi tezliklə təqdim olunacaq.",
				"profile_modal_got_it": "Aydındır",
				"profile_delete_avatar_title": "Profil şəklini sil?",
				"profile_delete_avatar_text": "Bu əməliyyat profil şəklinizi həmişəlik siləcək və standart avatarı bərpa edəcək. İstənilən vaxt yeni şəkil yükləyə bilərsiniz.",
				"profile_delete_avatar_cancel": "Ləğv et",
				"profile_delete_avatar_confirm": "Sil",
				"profile_delete_avatar_deleting": "Silinir...",
				"profile_toast_avatar_updated": "Profil şəkli uğurla yeniləndi.",
				"profile_toast_avatar_deleted": "Profil şəkli silindi.",
				"profile_toast_password_changed": "Şifrə uğurla dəyişdirildi.",
				"pwd_modal_title": "Şifrəni dəyiş",
				"pwd_modal_desc": "Cari şifrənizi daxil edin və yeni etibarlı şifrə təyin edin.",
				"pwd_modal_current": "Cari şifrə",
				"pwd_modal_current_placeholder": "Cari şifrəni daxil edin",
				"pwd_modal_new": "Yeni şifrə",
				"pwd_modal_new_placeholder": "Ən azı 6 simvol",
				"pwd_modal_confirm": "Yeni şifrənin təsdiqi",
				"pwd_modal_confirm_placeholder": "Yeni şifrəni təkrarlayın",
				"pwd_modal_btn_cancel": "Ləğv et",
				"pwd_modal_btn_submit": "Şifrəni yenilə",
				"pwd_modal_btn_updating": "Yenilənir...",
				"pwd_err_current_required": "Zəhmət olmasa cari şifrənizi daxil edin.",
				"pwd_err_new_required": "Zəhmət olmasa yeni şifrə daxil edin.",
				"pwd_err_length": "Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır.",
				"pwd_err_same": "Yeni şifrə cari şifrə ilə eyni ola bilməz.",
				"pwd_err_mismatch": "Şifrələr uyğun gəlmir.",
				"pwd_err_conn": "Bağlantı xətası. Zəhmət olmasa yenidən cəhd edin.",
				"pwd_success": "Şifrə uğurla dəyişdirildi.",
				"crop_modal_title": "Profil şəklini kəs",
				"crop_modal_hint": "Şəkli tənzimləmək üçün sürükləyin və miqyası dəyişin",
				"crop_modal_cancel": "Ləğv et",
				"crop_modal_apply": "Tətbiq et",
				"crop_modal_saving": "Saxlanılır..."
			}
		};
		const getProfileTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.az || translations.ru;
			return dict[dataId] || translations.en && translations.en[dataId] || dataId;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getProfileTranslation", { enumerable: true, get: function () { return getProfileTranslation; } });
	});
	//#endregion

	//#region components/UserPages/Profile/ImageCropperModal.js
	__define("components/UserPages/Profile/ImageCropperModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useRef, useEffect, useCallback } = __imp_0;
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const { useLang } = __require("utils/useLang.js");
		const { getProfileTranslation } = __require("components/UserPages/Profile/Lang.js");
		const CROP_BOX_SIZE = 260;
		const ImageCropperModal = ({ isOpen, imageSrc, fileName, onClose, onCrop, loading }) => {
			const lang = useLang();
			const t = (id) => getProfileTranslation(lang, id);
			const [zoom, setZoom] = useState(1);
			const [offset, setOffset] = useState({
				x: 0,
				y: 0
			});
			const [imageLoaded, setImageLoaded] = useState(false);
			const [naturalDimensions, setNaturalDimensions] = useState({
				width: 0,
				height: 0
			});
			const imageRef = useRef(null);
			const isDraggingRef = useRef(false);
			const dragStartRef = useRef({
				x: 0,
				y: 0
			});
			const startOffsetRef = useRef({
				x: 0,
				y: 0
			});
			useEffect(() => {
				if (isOpen && imageSrc) {
					setZoom(1);
					setOffset({
						x: 0,
						y: 0
					});
					setImageLoaded(false);
					const img = new Image();
					img.onload = () => {
						setNaturalDimensions({
							width: img.naturalWidth,
							height: img.naturalHeight
						});
						setImageLoaded(true);
					};
					img.src = imageSrc;
				}
			}, [isOpen, imageSrc]);
			const baseScale = naturalDimensions.width && naturalDimensions.height ? Math.max(CROP_BOX_SIZE / naturalDimensions.width, CROP_BOX_SIZE / naturalDimensions.height) : 1;
			const currentScale = baseScale * zoom;
			const currentWidth = naturalDimensions.width * currentScale;
			const currentHeight = naturalDimensions.height * currentScale;
			const maxOffsetX = Math.max(0, (currentWidth - CROP_BOX_SIZE) / 2);
			const maxOffsetY = Math.max(0, (currentHeight - CROP_BOX_SIZE) / 2);
			const clampOffset = useCallback((x, y, scaleVal) => {
				const s = baseScale * scaleVal;
				const w = naturalDimensions.width * s;
				const h = naturalDimensions.height * s;
				const maxX = Math.max(0, (w - CROP_BOX_SIZE) / 2);
				const maxY = Math.max(0, (h - CROP_BOX_SIZE) / 2);
				return {
					x: Math.max(-maxX, Math.min(maxX, x)),
					y: Math.max(-maxY, Math.min(maxY, y))
				};
			}, [baseScale, naturalDimensions]);
			const handleZoomChange = (newZoom) => {
				const nextZoom = Math.max(1, Math.min(3, newZoom));
				setZoom(nextZoom);
				setOffset((prev) => clampOffset(prev.x, prev.y, nextZoom));
			};
			const handleMouseDown = (e) => {
				e.preventDefault();
				isDraggingRef.current = true;
				dragStartRef.current = {
					x: e.clientX,
					y: e.clientY
				};
				startOffsetRef.current = { ...offset };
			};
			const handleMouseMove = useCallback((e) => {
				if (!isDraggingRef.current) return;
				const dx = e.clientX - dragStartRef.current.x;
				const dy = e.clientY - dragStartRef.current.y;
				const rawX = startOffsetRef.current.x + dx;
				const rawY = startOffsetRef.current.y + dy;
				setOffset(clampOffset(rawX, rawY, zoom));
			}, [clampOffset, zoom]);
			const handleMouseUp = useCallback(() => {
				isDraggingRef.current = false;
			}, []);
			useEffect(() => {
				window.addEventListener("mousemove", handleMouseMove);
				window.addEventListener("mouseup", handleMouseUp);
				return () => {
					window.removeEventListener("mousemove", handleMouseMove);
					window.removeEventListener("mouseup", handleMouseUp);
				};
			}, [handleMouseMove, handleMouseUp]);
			const handleTouchStart = (e) => {
				if (e.touches.length === 1) {
					isDraggingRef.current = true;
					dragStartRef.current = {
						x: e.touches[0].clientX,
						y: e.touches[0].clientY
					};
					startOffsetRef.current = { ...offset };
				}
			};
			const handleTouchMove = (e) => {
				if (!isDraggingRef.current || e.touches.length !== 1) return;
				const dx = e.touches[0].clientX - dragStartRef.current.x;
				const dy = e.touches[0].clientY - dragStartRef.current.y;
				const rawX = startOffsetRef.current.x + dx;
				const rawY = startOffsetRef.current.y + dy;
				setOffset(clampOffset(rawX, rawY, zoom));
			};
			const handleTouchEnd = () => {
				isDraggingRef.current = false;
			};
			const handleApplyCrop = () => {
				if (!imageRef.current || !imageLoaded) return;
				const img = imageRef.current;
				const scale = baseScale * zoom;
				const cropInImgSpace = CROP_BOX_SIZE / scale;
				const centerImgX = naturalDimensions.width / 2 - offset.x / scale;
				const centerImgY = naturalDimensions.height / 2 - offset.y / scale;
				const srcX = centerImgX - cropInImgSpace / 2;
				const srcY = centerImgY - cropInImgSpace / 2;
				const srcSize = cropInImgSpace;
				const outputSize = Math.min(Math.max(naturalDimensions.width, naturalDimensions.height), 800);
				const canvas = document.createElement("canvas");
				canvas.width = outputSize;
				canvas.height = outputSize;
				const ctx = canvas.getContext("2d");
				if (!ctx) return;
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = "high";
				ctx.drawImage(img, Math.max(0, srcX), Math.max(0, srcY), srcSize, srcSize, 0, 0, outputSize, outputSize);
				canvas.toBlob((blob) => {
					if (!blob) return;
					const croppedFile = new File([blob], fileName || "profile-avatar.jpg", { type: "image/jpeg" });
					onCrop(croppedFile);
				}, "image/jpeg", .95);
			};
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose: () => !loading && onClose(),
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", { className: "profile-cropper-modal" }, /* @__PURE__ */ __h("h3", { className: "profile-cropper-modal__title" }, t("crop_modal_title")), /* @__PURE__ */ __h("p", { className: "profile-cropper-modal__subtitle" }, t("crop_modal_hint")), /* @__PURE__ */ __h("div", {
				className: "profile-cropper-viewport",
				style: {
					width: `${CROP_BOX_SIZE}px`,
					height: `${CROP_BOX_SIZE}px`
				},
				onMouseDown: handleMouseDown,
				onTouchStart: handleTouchStart,
				onTouchMove: handleTouchMove,
				onTouchEnd: handleTouchEnd
			}, imageSrc && /* @__PURE__ */ __h("img", {
				ref: imageRef,
				src: imageSrc,
				alt: "Crop preview",
				className: "profile-cropper-img",
				style: {
					width: `${currentWidth}px`,
					height: `${currentHeight}px`,
					transform: `translate(${offset.x}px, ${offset.y}px)`
				},
				draggable: false
			}), /* @__PURE__ */ __h("div", { className: "profile-cropper-overlay" }), /* @__PURE__ */ __h("div", { className: "profile-cropper-circle-guide" })), /* @__PURE__ */ __h("div", { className: "profile-cropper-controls" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "profile-cropper-zoom-btn",
				onClick: () => handleZoomChange(zoom - .2),
				disabled: zoom <= 1 || loading,
				"aria-label": "Zoom out"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("line", {
				x1: "5",
				y1: "12",
				x2: "19",
				y2: "12"
			}))), /* @__PURE__ */ __h("input", {
				type: "range",
				min: "1",
				max: "3",
				step: "0.01",
				value: zoom,
				onChange: (e) => handleZoomChange(parseFloat(e.target.value)),
				className: "profile-cropper-slider",
				disabled: loading
			}), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "profile-cropper-zoom-btn",
				onClick: () => handleZoomChange(zoom + .2),
				disabled: zoom >= 3 || loading,
				"aria-label": "Zoom in"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
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
			})))), /* @__PURE__ */ __h("div", { className: "profile-cropper-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-modal__btn profile-modal__btn--cancel",
				onClick: onClose,
				disabled: loading
			}, t("crop_modal_cancel")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-modal__btn profile-modal__btn--confirm-delete",
				onClick: handleApplyCrop,
				disabled: loading || !imageLoaded
			}, loading ? /* @__PURE__ */ __h("span", { style: {
				display: "flex",
				alignItems: "center",
				gap: "8px",
				color: "#d4b475"
			} }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Saving...",
				style: {
					width: "16px",
					height: "16px",
					flexShrink: 0
				}
			}), t("crop_modal_saving")) : t("crop_modal_apply")))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return ImageCropperModal; } });
	});
	//#endregion

	//#region components/UserPages/Profile/ChangePasswordModal.js
	__define("components/UserPages/Profile/ChangePasswordModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState } = __imp_0;
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { useLang } = __require("utils/useLang.js");
		const { getProfileTranslation } = __require("components/UserPages/Profile/Lang.js");
		const ButtonSpinner = () => /* @__PURE__ */ __h("img", {
			src: loaderIconRed,
			alt: "Loading...",
			className: "pwd-btn-spinner",
			style: {
				width: "18px",
				height: "18px"
			}
		});
		const EyeIcon = ({ visible }) => visible ? /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: "pwd-eye-icon"
		}, /* @__PURE__ */ __h("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }), /* @__PURE__ */ __h("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		})) : /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: "pwd-eye-icon"
		}, /* @__PURE__ */ __h("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }), /* @__PURE__ */ __h("line", {
			x1: "1",
			y1: "1",
			x2: "23",
			y2: "23"
		}));
		const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
			const lang = useLang();
			const t = (id) => getProfileTranslation(lang, id);
			const [currentPassword, setCurrentPassword] = useState("");
			const [newPassword, setNewPassword] = useState("");
			const [confirmPassword, setConfirmPassword] = useState("");
			const [showCurrent, setShowCurrent] = useState(false);
			const [showNew, setShowNew] = useState(false);
			const [showConfirm, setShowConfirm] = useState(false);
			const [loading, setLoading] = useState(false);
			const [error, setError] = useState("");
			const resetForm = () => {
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
				setShowCurrent(false);
				setShowNew(false);
				setShowConfirm(false);
				setError("");
			};
			const handleClose = () => {
				if (loading) return;
				resetForm();
				onClose();
			};
			const handleSubmit = async (e) => {
				e.preventDefault();
				if (loading) return;
				setError("");
				if (!currentPassword.trim()) {
					setError(t("pwd_err_current_required"));
					return;
				}
				if (!newPassword.trim()) {
					setError(t("pwd_err_new_required"));
					return;
				}
				if (newPassword.length < 6) {
					setError(t("pwd_err_length"));
					return;
				}
				if (newPassword === currentPassword) {
					setError(t("pwd_err_same"));
					return;
				}
				if (newPassword !== confirmPassword) {
					setError(t("pwd_err_mismatch"));
					return;
				}
				setLoading(true);
				try {
					const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
					const response = await fetchWithRefresh(`${apiUrl}/api/auth/change-password`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							currentPassword,
							newPassword,
							confirmPassword
						})
					});
					const data = await response.json().catch(() => ({}));
					if (response.ok) {
						resetForm();
						onSuccess(data.message || t("pwd_success"));
						onClose();
					} else {
						setError(data.message || "Failed to change password.");
					}
				} catch (err) {
					console.error("Password change error:", err);
					setError(t("pwd_err_conn"));
				} finally {
					setLoading(false);
				}
			};
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose: handleClose,
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "change-password-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "change-password-modal__close",
				onClick: handleClose,
				disabled: loading,
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
			}))), /* @__PURE__ */ __h("div", { className: "change-password-modal__header" }, /* @__PURE__ */ __h("div", { className: "change-password-modal__icon" }, /* @__PURE__ */ __h("svg", {
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
			}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }))), /* @__PURE__ */ __h("h2", { className: "change-password-modal__title" }, t("pwd_modal_title")), /* @__PURE__ */ __h("p", { className: "change-password-modal__desc" }, t("pwd_modal_desc"))), /* @__PURE__ */ __h("form", {
				className: "change-password-modal__form",
				onSubmit: handleSubmit
			}, error && /* @__PURE__ */ __h("div", { className: "change-password-modal__error" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
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
			})), /* @__PURE__ */ __h("span", null, error)), /* @__PURE__ */ __h("div", { className: "pwd-input-group" }, /* @__PURE__ */ __h("label", { htmlFor: "current-password" }, t("pwd_modal_current")), /* @__PURE__ */ __h("div", { className: "pwd-input-wrap" }, /* @__PURE__ */ __h("input", {
				id: "current-password",
				type: showCurrent ? "text" : "password",
				placeholder: t("pwd_modal_current_placeholder"),
				value: currentPassword,
				onChange: (e) => {
					setCurrentPassword(e.target.value);
					if (error) setError("");
				},
				disabled: loading,
				autoComplete: "current-password"
			}), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "pwd-toggle-btn",
				onClick: () => setShowCurrent(!showCurrent),
				tabIndex: -1,
				"aria-label": showCurrent ? "Hide password" : "Show password"
			}, /* @__PURE__ */ __h(EyeIcon, { visible: showCurrent })))), /* @__PURE__ */ __h("div", { className: "pwd-input-group" }, /* @__PURE__ */ __h("label", { htmlFor: "new-password" }, t("pwd_modal_new")), /* @__PURE__ */ __h("div", { className: "pwd-input-wrap" }, /* @__PURE__ */ __h("input", {
				id: "new-password",
				type: showNew ? "text" : "password",
				placeholder: t("pwd_modal_new_placeholder"),
				value: newPassword,
				onChange: (e) => {
					setNewPassword(e.target.value);
					if (error) setError("");
				},
				disabled: loading,
				autoComplete: "new-password"
			}), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "pwd-toggle-btn",
				onClick: () => setShowNew(!showNew),
				tabIndex: -1,
				"aria-label": showNew ? "Hide password" : "Show password"
			}, /* @__PURE__ */ __h(EyeIcon, { visible: showNew })))), /* @__PURE__ */ __h("div", { className: "pwd-input-group" }, /* @__PURE__ */ __h("label", { htmlFor: "confirm-password" }, t("pwd_modal_confirm")), /* @__PURE__ */ __h("div", { className: "pwd-input-wrap" }, /* @__PURE__ */ __h("input", {
				id: "confirm-password",
				type: showConfirm ? "text" : "password",
				placeholder: t("pwd_modal_confirm_placeholder"),
				value: confirmPassword,
				onChange: (e) => {
					setConfirmPassword(e.target.value);
					if (error) setError("");
				},
				disabled: loading,
				autoComplete: "new-password"
			}), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "pwd-toggle-btn",
				onClick: () => setShowConfirm(!showConfirm),
				tabIndex: -1,
				"aria-label": showConfirm ? "Hide password" : "Show password"
			}, /* @__PURE__ */ __h(EyeIcon, { visible: showConfirm })))), /* @__PURE__ */ __h("div", { className: "change-password-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm change-password-modal__btn change-password-modal__btn--cancel",
				onClick: handleClose,
				disabled: loading
			}, t("pwd_modal_btn_cancel")), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "cta-btn sm change-password-modal__btn change-password-modal__btn--submit",
				disabled: loading
			}, loading ? /* @__PURE__ */ __h("span", { className: "pwd-loader-inner" }, /* @__PURE__ */ __h(ButtonSpinner, null), t("pwd_modal_btn_updating")) : t("pwd_modal_btn_submit"))))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return ChangePasswordModal; } });
	});
	//#endregion

	//#region components/UserPages/Profile/Profile.js
	__define("components/UserPages/Profile/Profile.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useRef, useEffect } = __imp_0;
		const { Link, useNavigate } = __require("utils/router.js");
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { useAuth } = __require("context/AuthContext.js");
		const __imp_1 = __require("components/Footer/Footer.js");
		const Footer = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const __imp_3 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_3.default !== undefined ? __imp_3.default : __imp_3;
		const __imp_4 = __require("components/UserPages/Profile/ImageCropperModal.js");
		const ImageCropperModal = __imp_4.default !== undefined ? __imp_4.default : __imp_4;
		const __imp_5 = __require("components/UserPages/Profile/ChangePasswordModal.js");
		const ChangePasswordModal = __imp_5.default !== undefined ? __imp_5.default : __imp_5;
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const { useLang } = __require("utils/useLang.js");
		const { getProfileTranslation } = __require("components/UserPages/Profile/Lang.js");
		const { DEFAULT_USER_AVATAR, getUserAvatarUrl, handleAvatarError, isDefaultAvatarUrl } = __require("utils/avatar.js");
		const ALLOWED_TYPES = [
			"image/png",
			"image/jpeg",
			"image/jpg"
		];
		const MAX_SIZE_MB = 10;
		const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
		const Profile = () => {
			const { user, logout, updateUser, authLoading } = useAuth();
			const navigate = useNavigate();
			const lang = useLang();
			const t = (id) => getProfileTranslation(lang, id);
			const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
			const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
			const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
			const [isDeleteAvatarModalOpen, setIsDeleteAvatarModalOpen] = useState(false);
			const [isCropModalOpen, setIsCropModalOpen] = useState(false);
			const [cropperImageSrc, setCropperImageSrc] = useState("");
			const [cropperFileName, setCropperFileName] = useState("");
			const [avatarUploading, setAvatarUploading] = useState(false);
			const [avatarDeleting, setAvatarDeleting] = useState(false);
			const [error, setError] = useState("");
			const [success, setSuccess] = useState("");
			const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
			const fileInputRef = useRef(null);
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const rawAvatarUrl = user?.profilePictureUrl || user?.ProfilePictureUrl || null;
			const hasCustomAvatar = !isDefaultAvatarUrl(rawAvatarUrl);
			const avatarUrl = getUserAvatarUrl(rawAvatarUrl);
			const renderChangeAvatarBtn = (extraClass) => /* @__PURE__ */ __h("button", {
				type: "button",
				className: `cta-btn sm profile-btn ${extraClass}`,
				onClick: () => fileInputRef.current?.click(),
				disabled: avatarUploading || avatarDeleting
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				className: "btn-icon"
			}, /* @__PURE__ */ __h("path", { d: "M12 20h9" }), /* @__PURE__ */ __h("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" })), t("profile_avatar_change"));
			const userName = user?.name || user?.Name || "User";
			const userEmail = user?.email || user?.Email || "user@sufrano.com";
			const showSuccess = (msg) => {
				setSuccess(msg);
				setTimeout(() => setSuccess(""), 3500);
			};
			const showError = (msg) => {
				setError(msg);
				setTimeout(() => setError(""), 4e3);
			};
			const validateFile = (file) => {
				if (!ALLOWED_TYPES.includes(file.type)) {
					showError(`"${file.name}" has an invalid format. Allowed: PNG, JPG, JPEG.`);
					return false;
				}
				if (file.size > MAX_SIZE_BYTES) {
					showError(`"${file.name}" exceeds ${MAX_SIZE_MB} MB.`);
					return false;
				}
				return true;
			};
			const handleFileSelect = (e) => {
				const file = e.target.files[0];
				e.target.value = "";
				if (!file) return;
				if (!validateFile(file)) return;
				const reader = new FileReader();
				reader.onload = () => {
					setCropperImageSrc(reader.result);
					setCropperFileName(file.name);
					setIsCropModalOpen(true);
				};
				reader.readAsDataURL(file);
			};
			const handleCropComplete = async (croppedFile) => {
				setAvatarUploading(true);
				setError("");
				try {
					const formData = new FormData();
					formData.append("file", croppedFile);
					const res = await fetch(`${apiUrl}/api/auth/profile/picture`, {
						method: "POST",
						credentials: "include",
						body: formData
					});
					if (res.ok) {
						const data = await res.json();
						updateUser({
							profilePictureUrl: data.profilePictureUrl,
							ProfilePictureUrl: data.profilePictureUrl
						});
						showSuccess(t("profile_toast_avatar_updated"));
						setIsCropModalOpen(false);
						setCropperImageSrc("");
					} else {
						const data = await res.json().catch(() => ({}));
						showError(data.message || "Failed to upload photo.");
					}
				} catch {
					showError("Connection error. Please try again.");
				} finally {
					setAvatarUploading(false);
				}
			};
			const handleConfirmDeleteAvatar = async () => {
				if (!hasCustomAvatar) return;
				setAvatarDeleting(true);
				setError("");
				try {
					const res = await fetch(`${apiUrl}/api/auth/profile/picture`, {
						method: "DELETE",
						credentials: "include"
					});
					if (res.ok) {
						const data = await res.json().catch(() => ({}));
						const nextAvatarUrl = data.profilePictureUrl || DEFAULT_USER_AVATAR;
						updateUser({
							profilePictureUrl: nextAvatarUrl,
							ProfilePictureUrl: nextAvatarUrl
						});
						showSuccess(t("profile_toast_avatar_deleted"));
						setIsDeleteAvatarModalOpen(false);
					} else {
						const data = await res.json().catch(() => ({}));
						showError(data.message || "Failed to remove photo.");
					}
				} catch {
					showError("Connection error. Please try again.");
				} finally {
					setAvatarDeleting(false);
				}
			};
			const [twoFactorLoading, setTwoFactorLoading] = useState(false);
			useEffect(() => {
				if (user) {
					setTwoFactorEnabled(Boolean(user.twoFactorEnabled ?? user.TwoFactorEnabled));
				}
			}, [user]);
			const handleToggle2FA = async () => {
				if (twoFactorLoading) return;
				setTwoFactorLoading(true);
				try {
					const res = await fetch(`${apiUrl}/api/auth/2fa/toggle`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({ enabled: !twoFactorEnabled })
					});
					if (res.ok) {
						const data = await res.json();
						setTwoFactorEnabled(data.twoFactorEnabled);
						updateUser({
							twoFactorEnabled: data.twoFactorEnabled,
							TwoFactorEnabled: data.twoFactorEnabled
						});
						showSuccess(`Two-Factor Authentication ${data.twoFactorEnabled ? "enabled" : "disabled"}.`);
					} else {
						const data = await res.json().catch(() => ({}));
						showError(data.message || "Failed to update Two-Factor Authentication.");
					}
				} catch {
					showError("Connection error. Please try again.");
				} finally {
					setTwoFactorLoading(false);
				}
			};
			return /* @__PURE__ */ __h(motion.div, {
				className: "profile-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "profile-main" }, /* @__PURE__ */ __h("div", { className: "profile-container" }, /* @__PURE__ */ __h(motion.div, {
				className: "profile-hero-text",
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
			}, /* @__PURE__ */ __h("h1", null, t("profile_hero_title")), /* @__PURE__ */ __h("p", { className: "profile-hero-desc" }, t("profile_hero_desc"))), /* @__PURE__ */ __h(motion.div, {
				className: "profile-card",
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
					duration: .55,
					ease: [
						.16,
						1,
						.3,
						1
					]
				}
			}, /* @__PURE__ */ __h("div", { className: "profile-card__avatar-section" }, /* @__PURE__ */ __h("div", { className: "profile-avatar-wrapper" }, /* @__PURE__ */ __h("div", { className: `profile-avatar-circle ${avatarUploading ? "loading" : ""}` }, /* @__PURE__ */ __h("img", {
				src: avatarUrl,
				alt: userName,
				className: "profile-avatar-img",
				onError: handleAvatarError
			}), avatarUploading && /* @__PURE__ */ __h("div", { className: "profile-avatar-overlay" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Uploading",
				className: "profile-avatar-loader"
			})))), /* @__PURE__ */ __h("input", {
				ref: fileInputRef,
				type: "file",
				accept: ".png,.jpg,.jpeg,image/png,image/jpeg",
				onChange: handleFileSelect,
				style: { display: "none" }
			}), /* @__PURE__ */ __h("div", { className: "profile-avatar-actions" }, !hasCustomAvatar ? renderChangeAvatarBtn("profile-btn--add") : /* @__PURE__ */ __h("div", { className: "profile-avatar-btn-group" }, renderChangeAvatarBtn("profile-btn--change"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-btn profile-btn--delete",
				onClick: () => setIsDeleteAvatarModalOpen(true),
				disabled: avatarUploading || avatarDeleting
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				className: "btn-icon"
			}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })), t("profile_avatar_delete"))))), /* @__PURE__ */ __h("div", { className: "profile-card__info-section" }, /* @__PURE__ */ __h("div", { className: "profile-field-group" }, /* @__PURE__ */ __h("label", { className: "profile-field-label" }, t("profile_field_name")), /* @__PURE__ */ __h("div", { className: "profile-field-input-wrap" }, /* @__PURE__ */ __h("input", {
				type: "text",
				className: "profile-field-input",
				value: userName,
				readOnly: true,
				disabled: true
			}), /* @__PURE__ */ __h("span", { className: "profile-field-badge" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("rect", {
				x: "3",
				y: "11",
				width: "18",
				height: "11",
				rx: "2",
				ry: "2"
			}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })), t("profile_badge_locked")))), /* @__PURE__ */ __h("div", { className: "profile-field-group" }, /* @__PURE__ */ __h("label", { className: "profile-field-label" }, t("profile_field_email")), /* @__PURE__ */ __h("div", { className: "profile-field-input-wrap" }, /* @__PURE__ */ __h("input", {
				type: "email",
				className: "profile-field-input",
				value: userEmail,
				readOnly: true,
				disabled: true
			}), /* @__PURE__ */ __h("span", { className: "profile-field-badge" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("rect", {
				x: "3",
				y: "11",
				width: "18",
				height: "11",
				rx: "2",
				ry: "2"
			}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })), t("profile_badge_locked")))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_password_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_password_desc"))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-action-btn",
				onClick: () => setIsPasswordModalOpen(true)
			}, t("profile_row_password_btn"))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_sessions_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_sessions_desc"))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-action-btn",
				onClick: () => navigate("/sessions")
			}, t("profile_row_sessions_btn"))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_2fa_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_2fa_desc"))), /* @__PURE__ */ __h("div", { className: "profile-2fa-toggle-wrap" }, /* @__PURE__ */ __h("span", { className: `profile-2fa-status ${twoFactorEnabled ? "active" : ""}` }, twoFactorEnabled ? t("profile_row_2fa_enabled") : t("profile_row_2fa_disabled")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: `profile-switch ${twoFactorEnabled ? "profile-switch--on" : ""}`,
				onClick: handleToggle2FA,
				"aria-label": "Toggle Two-Factor Authentication"
			}, /* @__PURE__ */ __h("span", { className: "profile-switch__handle" })))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_addresses_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_addresses_desc"))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-action-btn",
				onClick: () => navigate("/addresses")
			}, t("profile_row_addresses_btn"))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_payments_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_payments_desc"))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-action-btn",
				onClick: () => navigate("/payment-methods")
			}, t("profile_row_payments_btn"))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_orders_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_orders_desc"))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-action-btn",
				onClick: () => navigate("/orders")
			}, t("profile_row_orders_btn"))), /* @__PURE__ */ __h("div", { className: "profile-field-group profile-action-row" }, /* @__PURE__ */ __h("div", { className: "profile-action-text" }, /* @__PURE__ */ __h("div", { className: "profile-action-title" }, t("profile_row_reviews_title")), /* @__PURE__ */ __h("p", { className: "profile-action-desc" }, t("profile_row_reviews_desc"))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-action-btn",
				onClick: () => navigate("/reviews")
			}, t("profile_row_reviews_btn"))))))), /* @__PURE__ */ __h(ChangePasswordModal, {
				isOpen: isPasswordModalOpen,
				onClose: () => setIsPasswordModalOpen(false),
				onSuccess: (msg) => showSuccess(msg)
			}), /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen: isPaymentsModalOpen,
				onClose: () => setIsPaymentsModalOpen(false),
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", { className: "profile-modal" }, /* @__PURE__ */ __h("div", { className: "profile-modal__icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("rect", {
				x: "1",
				y: "4",
				width: "22",
				height: "16",
				rx: "2",
				ry: "2"
			}), /* @__PURE__ */ __h("line", {
				x1: "1",
				y1: "10",
				x2: "23",
				y2: "10"
			}))), /* @__PURE__ */ __h("h3", { className: "profile-modal__title" }, t("profile_payments_modal_title")), /* @__PURE__ */ __h("p", { className: "profile-modal__text" }, t("profile_payments_modal_desc")), /* @__PURE__ */ __h("div", { className: "profile-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-modal__btn",
				onClick: () => setIsPaymentsModalOpen(false)
			}, t("profile_modal_got_it"))))), /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen: isOrdersModalOpen,
				onClose: () => setIsOrdersModalOpen(false),
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", { className: "profile-modal" }, /* @__PURE__ */ __h("div", { className: "profile-modal__icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }), /* @__PURE__ */ __h("line", {
				x1: "3",
				y1: "6",
				x2: "21",
				y2: "6"
			}), /* @__PURE__ */ __h("path", { d: "M16 10a4 4 0 0 1-8 0" }))), /* @__PURE__ */ __h("h3", { className: "profile-modal__title" }, t("profile_orders_modal_title")), /* @__PURE__ */ __h("p", { className: "profile-modal__text" }, t("profile_orders_modal_desc")), /* @__PURE__ */ __h("div", { className: "profile-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-modal__btn",
				onClick: () => setIsOrdersModalOpen(false)
			}, t("profile_modal_got_it"))))), /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen: hasCustomAvatar && isDeleteAvatarModalOpen,
				onClose: () => !avatarDeleting && setIsDeleteAvatarModalOpen(false),
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", { className: "profile-modal" }, /* @__PURE__ */ __h("div", { className: "profile-modal__icon profile-modal__icon--danger" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }), /* @__PURE__ */ __h("line", {
				x1: "10",
				y1: "11",
				x2: "10",
				y2: "17"
			}), /* @__PURE__ */ __h("line", {
				x1: "14",
				y1: "11",
				x2: "14",
				y2: "17"
			}))), /* @__PURE__ */ __h("h3", { className: "profile-modal__title" }, t("profile_delete_avatar_title")), /* @__PURE__ */ __h("p", { className: "profile-modal__text" }, t("profile_delete_avatar_text")), /* @__PURE__ */ __h("div", { className: "profile-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-modal__btn profile-modal__btn--cancel",
				onClick: () => setIsDeleteAvatarModalOpen(false),
				disabled: avatarDeleting
			}, t("profile_delete_avatar_cancel")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm profile-modal__btn profile-modal__btn--confirm-delete",
				onClick: handleConfirmDeleteAvatar,
				disabled: avatarDeleting
			}, avatarDeleting ? /* @__PURE__ */ __h("span", { style: {
				display: "flex",
				alignItems: "center",
				gap: "8px",
				color: "#d4b475"
			} }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Deleting...",
				style: {
					width: "16px",
					height: "16px",
					flexShrink: 0
				}
			}), t("profile_delete_avatar_deleting")) : t("profile_delete_avatar_confirm"))))), /* @__PURE__ */ __h(ImageCropperModal, {
				isOpen: isCropModalOpen,
				imageSrc: cropperImageSrc,
				fileName: cropperFileName,
				onClose: () => {
					setIsCropModalOpen(false);
					setCropperImageSrc("");
				},
				onCrop: handleCropComplete,
				loading: avatarUploading
			}), /* @__PURE__ */ __h("div", { className: "profile-toast-container" }, /* @__PURE__ */ __h(AnimatePresence, null, error && /* @__PURE__ */ __h(motion.div, {
				className: "profile-toast profile-toast--error",
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
				stroke: "currentColor",
				strokeWidth: "2"
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
			})), /* @__PURE__ */ __h("span", null, error), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "profile-toast__close",
				onClick: () => setError(""),
				"aria-label": "Close"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
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
			})))), success && /* @__PURE__ */ __h(motion.div, {
				className: "profile-toast profile-toast--success",
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
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, success), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "profile-toast__close",
				onClick: () => setSuccess(""),
				"aria-label": "Close"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
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
			})))))), /* @__PURE__ */ __h(Footer, null));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Profile; } });
	});
	//#endregion

	var entryExports = __require("components/UserPages/Profile/Profile.js");
	__pages["profile"] = entryExports.default || entryExports;
})();
