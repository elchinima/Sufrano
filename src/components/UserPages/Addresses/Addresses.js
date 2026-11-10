import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useMemo } from "../../../utils/runtime.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import { Link, useNavigate } from "../../../utils/router.js";
import { useAuth } from "../../../context/AuthContext.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
import Navbar from "../../Elements/Navbar.js";
import Footer from "../../Footer/Footer.js";
import DeleteConfirmModal from "../../Elements/DeleteConfirmModal.js";
import AddressModal from "./AddressModal.js";
import PaymentErrorModal from "../PaymentMethods/PaymentErrorModal.js";
import { useLang } from "../../../utils/useLang.js";
import { getAddressesTranslation } from "./Lang.js";
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
export default Addresses;
