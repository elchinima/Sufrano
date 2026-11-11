(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/UserPages/Addresses/Lang.js
	__define("components/UserPages/Addresses/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"addr_hero_title": "Адреса доставки",
				"addr_hero_desc": "Управление адресами доставки, выбор основного адреса и инструкции для курьера",
				"addr_btn_add": "Добавить новый адрес",
				"addr_limit_reached": "Вы можете сохранить максимум 3 адреса доставки. Пожалуйста, удалите существующий адрес, чтобы добавить новый.",
				"addr_limit_title": "Лимит адресов",
				"addr_loading": "Загрузка сохраненных адресов...",
				"addr_error_load": "Не удалось загрузить сохраненные адреса доставки.",
				"addr_try_again": "Попробовать снова",
				"addr_added_on": "Добавлен",
				"addr_fallback_title": "Адрес доставки",
				"addr_badge_default": "По умолчанию",
				"addr_city": "Город",
				"addr_apt": "Кв. / Этаж",
				"addr_phone": "Телефон",
				"addr_set_default": "Сделать основным",
				"addr_setting_default": "Сохранение...",
				"addr_edit": "Редактировать",
				"addr_delete": "Удалить",
				"addr_toast_updated": "Адрес успешно обновлен!",
				"addr_toast_added": "Новый адрес доставки добавлен!",
				"addr_toast_default": "установлен как основной адрес!",
				"addr_toast_deleted": "Адрес успешно удален.",
				"addr_this_address": "этот адрес",
				"modal_title_edit": "Редактировать адрес",
				"modal_title_add": "Добавить адрес доставки",
				"modal_desc_edit": "Обновите данные доставки и комментарий для курьера",
				"modal_desc_add": "Сохраните новый адрес для быстрого оформления заказа",
				"modal_label_title": "Название",
				"modal_ph_title": "например: Дом, Работа, Студия...",
				"modal_label_city": "Город",
				"modal_ph_city": "например: Баку",
				"modal_label_street": "Улица и номер дома",
				"modal_ph_street": "например: ул. Низами 48, дом 2",
				"modal_label_apt": "Квартира / Этаж / Подъезд",
				"modal_ph_apt": "например: кв. 14, этаж 3, под. 1",
				"modal_label_phone": "Контактный телефон",
				"modal_ph_phone": "например: +994 50 123 45 67",
				"modal_label_notes": "Инструкции для курьера / Код домофона",
				"modal_ph_notes": "например: Код домофона #1234. Оставьте у двери.",
				"modal_toggle_default": "Сделать основным",
				"modal_btn_cancel": "Отмена",
				"modal_btn_save": "Сохранить изменения",
				"modal_btn_add": "Добавить адрес",
				"modal_btn_saving": "Сохранение...",
				"modal_btn_adding": "Добавление...",
				"modal_err_street": "Пожалуйста, укажите улицу и номер дома.",
				"modal_err_city": "Пожалуйста, укажите город.",
				"modal_err_phone": "Пожалуйста, укажите контактный телефон."
			},
			en: {
				"addr_hero_title": "Delivery Addresses",
				"addr_hero_desc": "Manage your delivery locations, set default shipping destination, and configure courier instructions",
				"addr_btn_add": "Add New Address",
				"addr_limit_reached": "You can only save up to 3 delivery addresses. Please delete an existing address to add a new one.",
				"addr_limit_title": "Address Limit",
				"addr_loading": "Loading your saved addresses...",
				"addr_error_load": "Failed to load saved delivery addresses.",
				"addr_try_again": "Try Again",
				"addr_added_on": "Added",
				"addr_fallback_title": "Delivery Address",
				"addr_badge_default": "Default",
				"addr_city": "City",
				"addr_apt": "Apt / Floor",
				"addr_phone": "Phone",
				"addr_set_default": "Set Default",
				"addr_setting_default": "Setting...",
				"addr_edit": "Edit",
				"addr_delete": "Delete",
				"addr_toast_updated": "Address updated successfully!",
				"addr_toast_added": "New delivery address added!",
				"addr_toast_default": "set as default address!",
				"addr_toast_deleted": "Address removed successfully.",
				"addr_this_address": "this address",
				"modal_title_edit": "Edit Delivery Address",
				"modal_title_add": "Add Delivery Address",
				"modal_desc_edit": "Update your delivery details and instructions",
				"modal_desc_add": "Save a new delivery address for faster checkout",
				"modal_label_title": "Title",
				"modal_ph_title": "e.g. Home, Office, Gym...",
				"modal_label_city": "City",
				"modal_ph_city": "e.g. Baku",
				"modal_label_street": "Street Address",
				"modal_ph_street": "e.g. Nizami Street 48, Building 2",
				"modal_label_apt": "Apt / Floor / Entrance",
				"modal_ph_apt": "e.g. Apt 14, Floor 3, Ent. 1",
				"modal_label_phone": "Contact Phone",
				"modal_ph_phone": "e.g. +994 50 123 45 67",
				"modal_label_notes": "Courier Instructions / Intercom Code",
				"modal_ph_notes": "e.g. Intercom code #1234. Please leave at door.",
				"modal_toggle_default": "Set as default",
				"modal_btn_cancel": "Cancel",
				"modal_btn_save": "Save Changes",
				"modal_btn_add": "Add Address",
				"modal_btn_saving": "Saving...",
				"modal_btn_adding": "Adding...",
				"modal_err_street": "Please enter your street address.",
				"modal_err_city": "Please enter your city.",
				"modal_err_phone": "Please enter your contact phone number."
			},
			az: {
				"addr_hero_title": "Çatdırılma ünvanları",
				"addr_hero_desc": "Çatdırılma məkanlarınızı idarə edin, əsas ünvanı seçin və kuryer üçün təlimatlar qeyd edin",
				"addr_btn_add": "Yeni ünvan əlavə et",
				"addr_limit_reached": "Maksimum 3 çatdırılma ünvanı saxlaya bilərsiniz. Yenisini əlavə etmək üçün mövcud ünvanı silin.",
				"addr_limit_title": "Ünvan limiti",
				"addr_loading": "Yadda saxlanılmış ünvanlar yüklənir...",
				"addr_error_load": "Yadda saxlanılmış çatdırılma ünvanlarını yükləmək mümkün olmadı.",
				"addr_try_again": "Yenidən cəhd edin",
				"addr_added_on": "Əlavə edilib",
				"addr_fallback_title": "Çatdırılma ünvanı",
				"addr_badge_default": "Əsas",
				"addr_city": "Şəhər",
				"addr_apt": "Mənzil / Mərtəbə",
				"addr_phone": "Telefon",
				"addr_set_default": "Əsas et",
				"addr_setting_default": "Dəyişdirilir...",
				"addr_edit": "Düzəliş et",
				"addr_delete": "Sil",
				"addr_toast_updated": "Ünvan uğurla yeniləndi!",
				"addr_toast_added": "Yeni çatdırılma ünvanı əlavə edildi!",
				"addr_toast_default": "əsas ünvan olaraq təyin edildi!",
				"addr_toast_deleted": "Ünvan uğurla silindi.",
				"addr_this_address": "bu ünvan",
				"modal_title_edit": "Ünvanı redaktə et",
				"modal_title_add": "Çatdırılma ünvanı əlavə et",
				"modal_desc_edit": "Çatdırılma detallarını və kuryer təlimatlarını yeniləyin",
				"modal_desc_add": "Sürətli sifariş üçün yeni çatdırılma ünvanı yadda saxlayın",
				"modal_label_title": "Başlıq",
				"modal_ph_title": "məs: Ev, İş, Zal...",
				"modal_label_city": "Şəhər",
				"modal_ph_city": "məs: Bakı",
				"modal_label_street": "Küçə və ev nömrəsi",
				"modal_ph_street": "məs: Nizami küç. 48, bina 2",
				"modal_label_apt": "Mənzil / Mərtəbə / Blok",
				"modal_ph_apt": "məs: mənz. 14, mərt. 3, blok 1",
				"modal_label_phone": "Əlaqə nömrəsi",
				"modal_ph_phone": "məs: +994 50 123 45 67",
				"modal_label_notes": "Kuryer üçün qeydlər / Damafon kodu",
				"modal_ph_notes": "məs: Damafon kodu #1234. Qapıda qoyun.",
				"modal_toggle_default": "Əsas ünvan et",
				"modal_btn_cancel": "Ləğv et",
				"modal_btn_save": "Yadda saxla",
				"modal_btn_add": "Ünvanı əlavə et",
				"modal_btn_saving": "Saxlanılır...",
				"modal_btn_adding": "Əlavə edilir...",
				"modal_err_street": "Zəhmət olmasa küçə ünvanınızı qeyd edin.",
				"modal_err_city": "Zəhmət olmasa şəhəri qeyd edin.",
				"modal_err_phone": "Zəhmət olmasa əlaqə nömrəsini qeyd edin."
			}
		};
		const getAddressesTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.az || translations.ru;
			return dict[dataId] || translations.en && translations.en[dataId] || dataId;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getAddressesTranslation", { enumerable: true, get: function () { return getAddressesTranslation; } });
	});
	//#endregion

	//#region components/UserPages/Addresses/AddressModal.js
	__define("components/UserPages/Addresses/AddressModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect } = __imp_0;
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const { useLang } = __require("utils/useLang.js");
		const { getAddressesTranslation } = __require("components/UserPages/Addresses/Lang.js");
		const ButtonSpinner = () => /* @__PURE__ */ __h("img", {
			src: loaderIconRed,
			alt: "Loading...",
			className: "address-btn-spinner",
			style: {
				width: "18px",
				height: "18px"
			}
		});
		const AddressModal = ({ isOpen, onClose, onSave, addressToEdit, loading }) => {
			const lang = useLang();
			const t = (id) => getAddressesTranslation(lang, id);
			const isEditing = Boolean(addressToEdit && addressToEdit.id);
			const [title, setTitle] = useState("");
			const [address, setAddress] = useState("");
			const [city, setCity] = useState("");
			const [apartment, setApartment] = useState("");
			const [phone, setPhone] = useState("");
			const [notes, setNotes] = useState("");
			const [isDefault, setIsDefault] = useState(false);
			const [error, setError] = useState("");
			useEffect(() => {
				if (isOpen) {
					if (addressToEdit) {
						setTitle(addressToEdit.title || "");
						setAddress(addressToEdit.address || "");
						setCity(addressToEdit.city || "");
						setApartment(addressToEdit.apartment || "");
						setPhone(addressToEdit.phone || "");
						setNotes(addressToEdit.notes || "");
						setIsDefault(Boolean(addressToEdit.isDefault));
					} else {
						setTitle("");
						setAddress("");
						setCity("");
						setApartment("");
						setPhone("");
						setNotes("");
						setIsDefault(false);
					}
					setError("");
				}
			}, [isOpen, addressToEdit]);
			const handleClose = () => {
				if (loading) return;
				setError("");
				onClose();
			};
			const handleSubmit = (e) => {
				e.preventDefault();
				if (loading) return;
				setError("");
				if (!address.trim()) {
					setError(t("modal_err_street"));
					return;
				}
				if (!city.trim()) {
					setError(t("modal_err_city"));
					return;
				}
				if (!phone.trim()) {
					setError(t("modal_err_phone"));
					return;
				}
				onSave({
					title: title.trim() || null,
					address: address.trim(),
					city: city.trim(),
					apartment: apartment.trim() || null,
					phone: phone.trim(),
					notes: notes.trim() || null,
					isDefault
				});
			};
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose: handleClose,
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "address-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "address-modal__close",
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
			}))), /* @__PURE__ */ __h("div", { className: "address-modal__header" }, /* @__PURE__ */ __h("div", { className: "address-modal__icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "10",
				r: "3"
			}))), /* @__PURE__ */ __h("h2", { className: "address-modal__title" }, isEditing ? t("modal_title_edit") : t("modal_title_add")), /* @__PURE__ */ __h("p", { className: "address-modal__desc" }, isEditing ? t("modal_desc_edit") : t("modal_desc_add"))), /* @__PURE__ */ __h("form", {
				className: "address-modal__form",
				onSubmit: handleSubmit
			}, error && /* @__PURE__ */ __h("div", { className: "address-modal__error" }, /* @__PURE__ */ __h("svg", {
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
			})), /* @__PURE__ */ __h("span", null, error)), /* @__PURE__ */ __h("div", { className: "address-modal__row" }, /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-title" }, t("modal_label_title")), /* @__PURE__ */ __h("input", {
				id: "addr-title",
				type: "text",
				placeholder: t("modal_ph_title"),
				value: title,
				onChange: (e) => {
					setTitle(e.target.value);
					if (error) setError("");
				},
				maxLength: 40,
				disabled: loading
			})), /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-city" }, t("modal_label_city"), " ", /* @__PURE__ */ __h("span", { className: "address-modal__required" }, "*")), /* @__PURE__ */ __h("input", {
				id: "addr-city",
				type: "text",
				placeholder: t("modal_ph_city"),
				value: city,
				onChange: (e) => {
					setCity(e.target.value);
					if (error) setError("");
				},
				required: true,
				disabled: loading
			}))), /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-street" }, t("modal_label_street"), " ", /* @__PURE__ */ __h("span", { className: "address-modal__required" }, "*")), /* @__PURE__ */ __h("input", {
				id: "addr-street",
				type: "text",
				placeholder: t("modal_ph_street"),
				value: address,
				onChange: (e) => {
					setAddress(e.target.value);
					if (error) setError("");
				},
				required: true,
				disabled: loading
			})), /* @__PURE__ */ __h("div", { className: "address-modal__row" }, /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-apt" }, t("modal_label_apt")), /* @__PURE__ */ __h("input", {
				id: "addr-apt",
				type: "text",
				placeholder: t("modal_ph_apt"),
				value: apartment,
				onChange: (e) => setApartment(e.target.value),
				disabled: loading
			})), /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-phone" }, t("modal_label_phone"), " ", /* @__PURE__ */ __h("span", { className: "address-modal__required" }, "*")), /* @__PURE__ */ __h("input", {
				id: "addr-phone",
				type: "tel",
				placeholder: t("modal_ph_phone"),
				value: phone,
				onChange: (e) => {
					setPhone(e.target.value);
					if (error) setError("");
				},
				required: true,
				disabled: loading
			}))), /* @__PURE__ */ __h("div", { className: "address-modal__field" }, /* @__PURE__ */ __h("label", { htmlFor: "addr-notes" }, t("modal_label_notes")), /* @__PURE__ */ __h("textarea", {
				id: "addr-notes",
				placeholder: t("modal_ph_notes"),
				value: notes,
				onChange: (e) => setNotes(e.target.value),
				rows: 2,
				maxLength: 200,
				disabled: loading
			})), /* @__PURE__ */ __h("div", {
				className: "address-modal__default-toggle",
				onClick: () => !loading && setIsDefault((prev) => !prev)
			}, /* @__PURE__ */ __h("span", { className: "address-modal__toggle-title" }, t("modal_toggle_default")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: `address-modal__switch ${isDefault ? "address-modal__switch--on" : ""}`,
				"aria-label": t("modal_toggle_default"),
				disabled: loading,
				onClick: (e) => {
					e.stopPropagation();
					if (!loading) setIsDefault((prev) => !prev);
				}
			}, /* @__PURE__ */ __h("span", { className: "address-modal__switch-handle" }))), /* @__PURE__ */ __h("div", { className: "address-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm address-modal__btn address-modal__btn--cancel",
				onClick: handleClose,
				disabled: loading
			}, t("modal_btn_cancel")), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "cta-btn sm address-modal__btn address-modal__btn--submit",
				disabled: loading || !address.trim() || !phone.trim() || !city.trim()
			}, loading ? /* @__PURE__ */ __h("span", { className: "address-loader-inner" }, /* @__PURE__ */ __h(ButtonSpinner, null), isEditing ? t("modal_btn_saving") : t("modal_btn_adding")) : isEditing ? t("modal_btn_save") : t("modal_btn_add"))))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return AddressModal; } });
	});
	//#endregion

	//#region components/UserPages/Addresses/Addresses.js
	__define("components/UserPages/Addresses/Addresses.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useMemo } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { Link, useNavigate } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const __imp_1 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Footer/Footer.js");
		const Footer = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const __imp_3 = __require("components/Elements/DeleteConfirmModal.js");
		const DeleteConfirmModal = __imp_3.default !== undefined ? __imp_3.default : __imp_3;
		const __imp_4 = __require("components/UserPages/Addresses/AddressModal.js");
		const AddressModal = __imp_4.default !== undefined ? __imp_4.default : __imp_4;
		const __imp_5 = __require("components/UserPages/PaymentMethods/PaymentErrorModal.js");
		const PaymentErrorModal = __imp_5.default !== undefined ? __imp_5.default : __imp_5;
		const { useLang } = __require("utils/useLang.js");
		const { getAddressesTranslation } = __require("components/UserPages/Addresses/Lang.js");
		const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
		const formatBakuDate = (dateStr) => {
			if (!dateStr) return "";
			try {
				const d = new Date(dateStr);
				if (isNaN(d.getTime())) return "";
				const day = String(d.getDate()).padStart(2, "0");
				const month = String(d.getMonth() + 1).padStart(2, "0");
				const year = d.getFullYear();
				return `${day}.${month}.${year}`;
			} catch {
				return "";
			}
		};
		const cardVariants = {
			hidden: {
				opacity: 0,
				y: 20,
				scale: .98
			},
			visible: (i) => ({
				opacity: 1,
				y: 0,
				scale: 1,
				transition: {
					delay: i * .05,
					duration: .4,
					ease: [
						.16,
						1,
						.3,
						1
					]
				}
			}),
			exit: {
				opacity: 0,
				scale: .96,
				transition: { duration: .2 }
			}
		};
		const Addresses = () => {
			const { user } = useAuth();
			const navigate = useNavigate();
			const lang = useLang();
			const t = (id) => getAddressesTranslation(lang, id);
			const [addresses, setAddresses] = useState([]);
			const [loading, setLoading] = useState(true);
			const [error, setError] = useState(null);
			const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
			const [addressToEdit, setAddressToEdit] = useState(null);
			const [modalLoading, setModalLoading] = useState(false);
			const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
			const [errorModalMessage, setErrorModalMessage] = useState("");
			const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
			const [addressToDelete, setAddressToDelete] = useState(null);
			const [deleteLoading, setDeleteLoading] = useState(false);
			const [toastMessage, setToastMessage] = useState(null);
			const [toastType, setToastType] = useState("success");
			const [settingDefaultId, setSettingDefaultId] = useState(null);
			const showToast = (msg, type = "success", duration = 3e3) => {
				setToastMessage(msg);
				setToastType(type);
				setTimeout(() => {
					setToastMessage(null);
				}, duration);
			};
			const fetchAddresses = async () => {
				setLoading(true);
				setError(null);
				try {
					let res = await fetchWithRefresh(`${apiUrl}/api/addresses`);
					if (!res.ok && res.status === 404) {
						res = await fetchWithRefresh(`${apiUrl}/api/adresses`);
					}
					if (!res.ok) {
						throw new Error("Failed to load saved delivery addresses.");
					}
					const data = await res.json();
					setAddresses(Array.isArray(data) ? data : []);
				} catch (err) {
					console.error("Error fetching addresses:", err);
					setError(err.message || "Unable to connect to server.");
				} finally {
					setLoading(false);
				}
			};
			useEffect(() => {
				fetchAddresses();
			}, []);
			const handleSaveAddress = async (formData) => {
				setModalLoading(true);
				try {
					const isEditing = Boolean(addressToEdit && addressToEdit.id);
					const endpoint = isEditing ? `/api/addresses/${addressToEdit.id}` : "/api/addresses";
					const url = `${apiUrl}${endpoint}`;
					const method = isEditing ? "PUT" : "POST";
					const res = await fetchWithRefresh(url, {
						method,
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(formData)
					});
					if (!res.ok) {
						const data = await res.json().catch(() => ({}));
						throw new Error(data.message || "Failed to save address.");
					}
					const savedAddress = await res.json();
					if (isEditing) {
						setAddresses((prev) => {
							const updated = prev.map((item) => item.id === savedAddress.id ? savedAddress : formData.isDefault ? {
								...item,
								isDefault: false
							} : item);
							return updated.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
						});
						showToast(t("addr_toast_updated"));
					} else {
						setAddresses((prev) => {
							const updated = formData.isDefault ? prev.map((item) => ({
								...item,
								isDefault: false
							})) : [...prev];
							return [savedAddress, ...updated].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
						});
						showToast(t("addr_toast_added"));
					}
					setIsAddressModalOpen(false);
					setAddressToEdit(null);
				} catch (err) {
					setErrorModalMessage(err.message || "Error saving address.");
					setIsErrorModalOpen(true);
				} finally {
					setModalLoading(false);
				}
			};
			const handleSetDefault = async (address) => {
				if (!address || address.isDefault || settingDefaultId) return;
				setSettingDefaultId(address.id);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/addresses/${address.id}/default`, { method: "PATCH" });
					if (!res.ok) {
						throw new Error("Failed to set default address.");
					}
					setAddresses((prev) => prev.map((a) => ({
						...a,
						isDefault: a.id === address.id
					})).sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)));
					showToast(`"${address.title || address.address}" ${t("addr_toast_default")}`);
				} catch (err) {
					showToast(err.message || "Error setting default address.", "error");
				} finally {
					setSettingDefaultId(null);
				}
			};
			const handleConfirmDelete = async () => {
				if (!addressToDelete || deleteLoading) return;
				setDeleteLoading(true);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/addresses/${addressToDelete.id}`, { method: "DELETE" });
					if (!res.ok) {
						throw new Error("Failed to remove address.");
					}
					setAddresses((prev) => {
						const remaining = prev.filter((a) => a.id !== addressToDelete.id);
						if (addressToDelete.isDefault && remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
							remaining[0].isDefault = true;
						}
						return remaining;
					});
					showToast(t("addr_toast_deleted"));
					setIsDeleteModalOpen(false);
					setAddressToDelete(null);
				} catch (err) {
					showToast(err.message || "Error deleting address.", "error");
				} finally {
					setDeleteLoading(false);
				}
			};
			const isEmpty = !loading && addresses.length === 0;
			return /* @__PURE__ */ __h(motion.div, {
				className: "addresses-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: `addresses-main ${isEmpty ? "addresses-main--empty" : ""}` }, /* @__PURE__ */ __h("div", { className: `addresses-container ${isEmpty ? "addresses-container--empty" : ""}` }, /* @__PURE__ */ __h(motion.div, {
				className: "addresses-hero",
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
			}, /* @__PURE__ */ __h("h1", null, t("addr_hero_title")), /* @__PURE__ */ __h("p", { className: "addresses-hero__desc" }, t("addr_hero_desc")), /* @__PURE__ */ __h("div", { className: "addresses-hero__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn primary-red addresses-hero__add-btn",
				onClick: () => {
					if (addresses.length >= 3) {
						setErrorModalMessage(t("addr_limit_reached"));
						setIsErrorModalOpen(true);
					} else {
						setAddressToEdit(null);
						setIsAddressModalOpen(true);
					}
				}
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
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
			})), /* @__PURE__ */ __h("span", null, t("addr_btn_add"))))), loading ? /* @__PURE__ */ __h("div", { className: "addresses-loading-state" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "addresses-loader-icon"
			}), /* @__PURE__ */ __h("p", null, t("addr_loading"))) : error ? /* @__PURE__ */ __h("div", { className: "addresses-error-state" }, /* @__PURE__ */ __h("p", null, error), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm secondary",
				onClick: fetchAddresses
			}, t("addr_try_again"))) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", { className: "addresses-grid" }, /* @__PURE__ */ __h(AnimatePresence, null, addresses.map((addr, idx) => /* @__PURE__ */ __h(motion.div, {
				key: addr.id,
				className: `address-card ${addr.isDefault ? "address-card--default" : ""}`,
				variants: cardVariants,
				initial: "hidden",
				animate: "visible",
				exit: "exit",
				custom: idx,
				layout: true
			}, /* @__PURE__ */ __h("div", { className: "address-card__header" }, /* @__PURE__ */ __h("div", { className: "address-card__title-group" }, /* @__PURE__ */ __h("div", { className: "address-card__icon-badge" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "10",
				r: "3"
			}))), /* @__PURE__ */ __h("div", { className: "address-card__meta" }, addr.title ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("h3", { className: "address-card__title" }, addr.title), addr.createdAt && /* @__PURE__ */ __h("span", { className: "address-card__date" }, t("addr_added_on"), " ", formatBakuDate(addr.createdAt))) : /* @__PURE__ */ __h("span", { className: "address-card__date address-card__date--standalone" }, addr.createdAt ? `${t("addr_added_on")} ${formatBakuDate(addr.createdAt)}` : t("addr_fallback_title")))), /* @__PURE__ */ __h("div", { className: "address-card__badges" }, addr.isDefault && /* @__PURE__ */ __h("span", { className: "address-card__badge-default" }, /* @__PURE__ */ __h("span", { className: "pulsing-dot" }), t("addr_badge_default")))), /* @__PURE__ */ __h("div", { className: "address-card__body" }, /* @__PURE__ */ __h("div", { className: "address-card__street" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "10",
				r: "3"
			})), /* @__PURE__ */ __h("span", null, addr.address)), /* @__PURE__ */ __h("div", { className: "address-card__details-grid" }, addr.city && /* @__PURE__ */ __h("div", { className: "address-card__detail-item" }, /* @__PURE__ */ __h("span", { className: "address-card__detail-label" }, t("addr_city")), /* @__PURE__ */ __h("span", { className: "address-card__detail-val" }, addr.city)), addr.apartment && /* @__PURE__ */ __h("div", { className: "address-card__detail-item" }, /* @__PURE__ */ __h("span", { className: "address-card__detail-label" }, t("addr_apt")), /* @__PURE__ */ __h("span", { className: "address-card__detail-val" }, addr.apartment)), addr.phone && /* @__PURE__ */ __h("div", { className: "address-card__detail-item" }, /* @__PURE__ */ __h("span", { className: "address-card__detail-label" }, t("addr_phone")), /* @__PURE__ */ __h("span", { className: "address-card__detail-val" }, addr.phone))), addr.notes && /* @__PURE__ */ __h("div", { className: "address-card__note-box" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })), /* @__PURE__ */ __h("span", null, addr.notes))), /* @__PURE__ */ __h("div", { className: "address-card__footer" }, /* @__PURE__ */ __h("div", { className: "address-card__footer-left" }, !addr.isDefault && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "address-card__action-btn address-card__action-btn--default",
				onClick: () => handleSetDefault(addr),
				disabled: settingDefaultId === addr.id,
				title: t("addr_set_default")
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" })), /* @__PURE__ */ __h("span", null, settingDefaultId === addr.id ? t("addr_setting_default") : t("addr_set_default")))), /* @__PURE__ */ __h("div", { className: "address-card__footer-right" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "address-card__action-btn address-card__action-btn--edit",
				onClick: () => {
					setAddressToEdit(addr);
					setIsAddressModalOpen(true);
				},
				title: t("addr_edit")
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })), /* @__PURE__ */ __h("span", null, t("addr_edit"))), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "address-card__action-btn address-card__action-btn--delete",
				onClick: () => {
					setAddressToDelete(addr);
					setIsDeleteModalOpen(true);
				},
				title: t("addr_delete")
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })), /* @__PURE__ */ __h("span", null, t("addr_delete")))))))))))), /* @__PURE__ */ __h(AddressModal, {
				isOpen: isAddressModalOpen,
				onClose: () => {
					setIsAddressModalOpen(false);
					setAddressToEdit(null);
				},
				onSave: handleSaveAddress,
				addressToEdit,
				loading: modalLoading
			}), /* @__PURE__ */ __h(DeleteConfirmModal, {
				isOpen: isDeleteModalOpen,
				onClose: () => {
					setIsDeleteModalOpen(false);
					setAddressToDelete(null);
				},
				onConfirm: handleConfirmDelete,
				itemName: addressToDelete ? addressToDelete.title ? `"${addressToDelete.title}" (${addressToDelete.address})` : `"${addressToDelete.address}"` : t("addr_this_address"),
				loading: deleteLoading
			}), /* @__PURE__ */ __h(PaymentErrorModal, {
				isOpen: isErrorModalOpen,
				onClose: () => setIsErrorModalOpen(false),
				message: errorModalMessage,
				title: t("addr_limit_title")
			}), /* @__PURE__ */ __h("div", { className: "addresses-toast-container" }, /* @__PURE__ */ __h(AnimatePresence, null, toastMessage && /* @__PURE__ */ __h(motion.div, {
				className: `addresses-toast ${toastType === "error" ? "addresses-toast--error" : ""}`,
				initial: {
					opacity: 0,
					y: 20,
					scale: .95
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: 10,
					scale: .95
				},
				transition: { duration: .25 }
			}, toastType === "error" ? /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "20",
				height: "20",
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
			})) : /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "20",
				height: "20",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" })), /* @__PURE__ */ __h("span", null, toastMessage)))), /* @__PURE__ */ __h(Footer, null));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Addresses; } });
	});
	//#endregion

	var entryExports = __require("components/UserPages/Addresses/Addresses.js");
	__pages["addresses"] = entryExports.default || entryExports;
})();
