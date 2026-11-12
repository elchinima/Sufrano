import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect } from "../../../utils/runtime.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import { getUserAvatarUrl, handleAvatarError } from "../../../utils/avatar.js";
const CashboxOrderDetailModal = ({ order, isOpen, onClose, onUpdateOrder, t, canEdit = true }) => {
	const [activeTab, setActiveTab] = useState("info");
	const [selectedStatus, setSelectedStatus] = useState(order?.status || "Success");
	const [note, setNote] = useState(order?.note || "");
	const [isUpdating, setIsUpdating] = useState(false);
	const [updateError, setUpdateError] = useState("");
	const [copiedUserId, setCopiedUserId] = useState(false);
	useEffect(() => {
		if (order) {
			setSelectedStatus(order.status || "Success");
			setNote(order.note || "");
			setActiveTab("info");
		}
	}, [order]);
	const handleCopyUserId = (e, userId) => {
		e.stopPropagation();
		if (!userId) return;
		navigator.clipboard?.writeText(userId);
		setCopiedUserId(true);
		setTimeout(() => setCopiedUserId(false), 2e3);
	};
	if (!isOpen || !order) return null;
	const handleSave = async () => {
		setIsUpdating(true);
		setUpdateError("");
		try {
			await onUpdateOrder(order.id, {
				status: selectedStatus,
				note: note.trim()
			});
			onClose();
		} catch (err) {
			setUpdateError(err.message || "Failed to update order");
		} finally {
			setIsUpdating(false);
		}
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "Success": return /* @__PURE__ */ __h("span", { className: "cb-hist-badge cb-hist-badge--success" }, t?.history?.statusSuccess || "Success");
			case "Cancelled": return /* @__PURE__ */ __h("span", { className: "cb-hist-badge cb-hist-badge--danger" }, t?.history?.statusCancelled || "Cancelled");
			case "Refunded": return /* @__PURE__ */ __h("span", { className: "cb-hist-badge cb-hist-badge--warning" }, t?.history?.statusRefunded || "Refunded");
			case "Pending": return /* @__PURE__ */ __h("span", { className: "cb-hist-badge cb-hist-badge--info" }, t?.history?.statusPending || "Pending");
			case "Processing": return /* @__PURE__ */ __h("span", { className: "cb-hist-badge cb-hist-badge--info" }, t?.history?.statusProcessing || "Processing");
			default: return /* @__PURE__ */ __h("span", { className: "cb-hist-badge" }, status);
		}
	};
	const formattedDate = new Date(order.createdAt).toLocaleString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});
	return /* @__PURE__ */ __h(AnimatePresence, null, /* @__PURE__ */ __h("div", {
		className: "cb-detail-overlay",
		onClick: onClose
	}, /* @__PURE__ */ __h(motion.div, {
		className: "cb-detail-modal",
		initial: {
			opacity: 0,
			scale: .95,
			y: 15
		},
		animate: {
			opacity: 1,
			scale: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			scale: .95,
			y: 15
		},
		transition: { duration: .2 },
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("div", { className: "cb-detail-header" }, /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h2", { className: "cb-detail-title" }, t?.history?.orderDetails || "Details"), /* @__PURE__ */ __h("p", { className: "cb-detail-sub" }, "ID:", " ", /* @__PURE__ */ __h("code", {
		className: "cb-detail-id-code",
		title: "Click to copy full ID",
		onClick: () => navigator.clipboard?.writeText(order.id)
	}, /* @__PURE__ */ __h("span", { className: "cb-detail-id-full" }, order.id), /* @__PURE__ */ __h("span", { className: "cb-detail-id-short" }, "#", order.id.slice(0, 8))))), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cb-detail-close-btn",
		onClick: onClose
	}, "✕")), /* @__PURE__ */ __h("div", { className: "cb-detail-nav" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: `cb-detail-tab-btn ${activeTab === "info" ? "cb-detail-tab-btn--active" : ""}`,
		onClick: () => setActiveTab("info")
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		style: {
			width: 14,
			height: 14
		}
	}, /* @__PURE__ */ __h("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ __h("line", {
		x1: "12",
		y1: "16",
		x2: "12",
		y2: "12"
	}), /* @__PURE__ */ __h("line", {
		x1: "12",
		y1: "8",
		x2: "12.01",
		y2: "8"
	})), /* @__PURE__ */ __h("span", null, t?.history?.tabInfo || "Info")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: `cb-detail-tab-btn ${activeTab === "items" ? "cb-detail-tab-btn--active" : ""}`,
		onClick: () => setActiveTab("items")
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		style: {
			width: 14,
			height: 14
		}
	}, /* @__PURE__ */ __h("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }), /* @__PURE__ */ __h("line", {
		x1: "3",
		y1: "6",
		x2: "21",
		y2: "6"
	}), /* @__PURE__ */ __h("path", { d: "M16 10a4 4 0 0 1-8 0" })), /* @__PURE__ */ __h("span", null, t?.history?.tabProducts || "Məhsullar"), /* @__PURE__ */ __h("span", { className: "cb-detail-tab-count" }, order.products?.length || 0)), /* @__PURE__ */ __h("button", {
		type: "button",
		className: `cb-detail-tab-btn ${activeTab === "status" ? "cb-detail-tab-btn--active" : ""}`,
		onClick: () => setActiveTab("status")
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		style: {
			width: 14,
			height: 14
		}
	}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, t?.history?.tabStatus || "Status"))), /* @__PURE__ */ __h("div", { className: "cb-detail-body" }, activeTab === "info" && /* @__PURE__ */ __h(motion.div, {
		key: "info",
		initial: {
			opacity: 0,
			y: 6
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: { opacity: 0 },
		transition: { duration: .15 },
		className: "cb-tab-pane"
	}, /* @__PURE__ */ __h("div", { className: "cb-detail-meta-grid" }, /* @__PURE__ */ __h("div", { className: "cb-detail-meta-top" }, /* @__PURE__ */ __h("div", { className: "cb-detail-meta-item" }, /* @__PURE__ */ __h("span", { className: "cb-detail-meta-label" }, t?.history?.status || "Status"), /* @__PURE__ */ __h("div", { className: "cb-detail-status-inline" }, getStatusBadge(order.status))), /* @__PURE__ */ __h("div", { className: "cb-detail-meta-item" }, /* @__PURE__ */ __h("span", { className: "cb-detail-meta-label" }, t?.history?.payment || "Payment"), /* @__PURE__ */ __h("span", { className: "cb-detail-meta-val" }, order.payMethod === "Card" ? t?.history?.card || "Card" : t?.history?.cash || "Cash")), /* @__PURE__ */ __h("div", { className: "cb-detail-meta-item cb-detail-meta-item--date" }, /* @__PURE__ */ __h("span", { className: "cb-detail-meta-label" }, t?.history?.date || "Date"), /* @__PURE__ */ __h("span", { className: "cb-detail-meta-val" }, formattedDate)), order.promoCode && /* @__PURE__ */ __h("div", { className: "cb-detail-meta-item" }, /* @__PURE__ */ __h("span", { className: "cb-detail-meta-label" }, t?.promoCodeLabel || "Promo Code"), /* @__PURE__ */ __h("span", { className: "cb-detail-meta-val cb-detail-promo-tag" }, order.promoCode))), /* @__PURE__ */ __h("div", { className: "cb-detail-users-row" }, /* @__PURE__ */ __h("div", { className: "cb-detail-meta-item" }, /* @__PURE__ */ __h("span", { className: "cb-detail-meta-label" }, t?.history?.createdBy || t?.history?.cashier || "Cashier"), /* @__PURE__ */ __h("div", { className: "cb-detail-user-pill" }, /* @__PURE__ */ __h("img", {
		src: getUserAvatarUrl(order.cashierAvatar),
		alt: order.cashierName || "Cashier",
		className: "cb-detail-user-avatar",
		onError: handleAvatarError
	}), /* @__PURE__ */ __h("div", { className: "cb-detail-user-info" }, /* @__PURE__ */ __h("span", { className: "cb-detail-user-name" }, order.cashierName || "—"), order.userId && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cb-detail-user-id-btn",
		onClick: (e) => handleCopyUserId(e, order.userId),
		title: `Click to copy: ${order.userId}`
	}, /* @__PURE__ */ __h("span", null, "ID: ", order.userId.slice(0, 8), "..."), /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		style: {
			width: 11,
			height: 11
		}
	}, /* @__PURE__ */ __h("rect", {
		x: "9",
		y: "9",
		width: "13",
		height: "13",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })), copiedUserId && /* @__PURE__ */ __h("span", { className: "cb-detail-copied-badge" }, "Copied"))))), order.editedBy && /* @__PURE__ */ __h("div", { className: "cb-detail-meta-item" }, /* @__PURE__ */ __h("span", { className: "cb-detail-meta-label" }, t?.history?.editedBy || "Edited by"), /* @__PURE__ */ __h("div", { className: "cb-detail-user-pill" }, /* @__PURE__ */ __h("img", {
		src: getUserAvatarUrl(order.editorAvatar),
		alt: order.editedBy,
		className: "cb-detail-user-avatar",
		onError: handleAvatarError
	}), /* @__PURE__ */ __h("div", { className: "cb-detail-user-info" }, /* @__PURE__ */ __h("span", { className: "cb-detail-user-name" }, order.editedBy), order.editedAt && /* @__PURE__ */ __h("span", { className: "cb-detail-user-sub" }, new Date(order.editedAt).toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	}))))))), /* @__PURE__ */ __h("div", { className: "cb-detail-totals" }, /* @__PURE__ */ __h("div", { className: "cb-detail-total-row" }, /* @__PURE__ */ __h("span", null, t?.history?.subtotal || "Subtotal:"), /* @__PURE__ */ __h("span", null, order.initialAmount?.toFixed(2) || order.totalAmount?.toFixed(2), " ₼")), order.discountAmount > 0 && /* @__PURE__ */ __h("div", { className: "cb-detail-total-row cb-detail-total-row--discount" }, /* @__PURE__ */ __h("span", null, t?.history?.discount || "Discount:"), /* @__PURE__ */ __h("span", null, "-", order.discountAmount.toFixed(2), " ₼")), /* @__PURE__ */ __h("div", { className: "cb-detail-total-row cb-detail-total-row--final" }, /* @__PURE__ */ __h("span", null, t?.history?.total || "Total Paid:"), /* @__PURE__ */ __h("span", null, order.totalAmount?.toFixed(2), " ₼")))), activeTab === "items" && /* @__PURE__ */ __h(motion.div, {
		key: "items",
		initial: {
			opacity: 0,
			y: 6
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: { opacity: 0 },
		transition: { duration: .15 },
		className: "cb-tab-pane"
	}, /* @__PURE__ */ __h("div", { className: "cb-detail-products-section" }, /* @__PURE__ */ __h("div", { className: "cb-detail-products-list" }, order.products?.map((item, idx) => /* @__PURE__ */ __h("div", {
		key: item.productId || idx,
		className: "cb-detail-product-row"
	}, /* @__PURE__ */ __h("div", { className: "cb-detail-product-left" }, item.imageUrl ? /* @__PURE__ */ __h("img", {
		src: item.imageUrl,
		alt: item.name,
		className: "cb-detail-prod-img"
	}) : /* @__PURE__ */ __h("div", { className: "cb-detail-prod-fallback" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		style: {
			width: 16,
			height: 16
		}
	}, /* @__PURE__ */ __h("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }), /* @__PURE__ */ __h("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }), /* @__PURE__ */ __h("line", {
		x1: "6",
		y1: "1",
		x2: "6",
		y2: "4"
	}), /* @__PURE__ */ __h("line", {
		x1: "10",
		y1: "1",
		x2: "10",
		y2: "4"
	}), /* @__PURE__ */ __h("line", {
		x1: "14",
		y1: "1",
		x2: "14",
		y2: "4"
	}))), /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("div", { className: "cb-detail-prod-name" }, item.name), /* @__PURE__ */ __h("div", { className: "cb-detail-prod-cat" }, item.category))), /* @__PURE__ */ __h("div", { className: "cb-detail-product-right" }, /* @__PURE__ */ __h("div", { className: "cb-detail-prod-calc" }, item.quantity, " × ", item.price.toFixed(2), " ₼"), /* @__PURE__ */ __h("div", { className: "cb-detail-prod-total" }, (item.quantity * item.price).toFixed(2), " ₼")))))), /* @__PURE__ */ __h("div", { className: "cb-detail-totals" }, /* @__PURE__ */ __h("div", { className: "cb-detail-total-row" }, /* @__PURE__ */ __h("span", null, t?.history?.subtotal || "Subtotal:"), /* @__PURE__ */ __h("span", null, order.initialAmount?.toFixed(2) || order.totalAmount?.toFixed(2), " ₼")), order.discountAmount > 0 && /* @__PURE__ */ __h("div", { className: "cb-detail-total-row cb-detail-total-row--discount" }, /* @__PURE__ */ __h("span", null, t?.history?.discount || "Discount:"), /* @__PURE__ */ __h("span", null, "-", order.discountAmount.toFixed(2), " ₼")), /* @__PURE__ */ __h("div", { className: "cb-detail-total-row cb-detail-total-row--final" }, /* @__PURE__ */ __h("span", null, t?.history?.total || "Total Paid:"), /* @__PURE__ */ __h("span", null, order.totalAmount?.toFixed(2), " ₼")))), activeTab === "status" && /* @__PURE__ */ __h(motion.div, {
		key: "status",
		initial: {
			opacity: 0,
			y: 6
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: { opacity: 0 },
		transition: { duration: .15 },
		className: "cb-tab-pane"
	}, /* @__PURE__ */ __h("div", { className: "cb-detail-management" }, /* @__PURE__ */ __h("div", { className: "cb-detail-current-status-card" }, /* @__PURE__ */ __h("span", { className: "cb-detail-meta-label" }, t?.history?.status || "Current Status"), /* @__PURE__ */ __h("div", { style: { marginTop: 6 } }, getStatusBadge(order.status))), canEdit && /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", { className: "cb-detail-form-group" }, /* @__PURE__ */ __h("label", { className: "cb-detail-label" }, t?.history?.changeStatus || "Change Status"), /* @__PURE__ */ __h("div", { className: "cb-detail-status-chips" }, [
		"Success",
		"Refunded",
		"Cancelled",
		"Pending"
	].map((st) => /* @__PURE__ */ __h("button", {
		key: st,
		type: "button",
		className: `cb-detail-status-chip cb-detail-status-chip--${st.toLowerCase()} ${selectedStatus === st ? "cb-detail-status-chip--selected" : ""}`,
		onClick: () => setSelectedStatus(st)
	}, st === "Success" && (t?.history?.statusSuccess || "Success"), st === "Refunded" && (t?.history?.statusRefunded || "Refunded"), st === "Cancelled" && (t?.history?.statusCancelled || "Cancelled"), st === "Pending" && (t?.history?.statusPending || "Pending"))))), /* @__PURE__ */ __h("div", { className: "cb-detail-form-group" }, /* @__PURE__ */ __h("label", { className: "cb-detail-label" }, t?.history?.note || "Note"), /* @__PURE__ */ __h("textarea", {
		rows: 3,
		className: "cb-detail-textarea",
		placeholder: t?.history?.addNote || "Add optional note...",
		value: note,
		onChange: (e) => setNote(e.target.value)
	}))), order.editedBy && /* @__PURE__ */ __h("div", { className: "cb-detail-edited-info" }, /* @__PURE__ */ __h("div", { className: "cb-detail-edited-avatar-wrap" }, /* @__PURE__ */ __h("img", {
		src: getUserAvatarUrl(order.editorAvatar),
		alt: order.editedBy,
		className: "cb-detail-edited-mini-avatar",
		onError: handleAvatarError
	})), /* @__PURE__ */ __h("div", { className: "cb-detail-edited-text" }, /* @__PURE__ */ __h("span", null, t?.history?.editedBy || "Edited by:", " ", /* @__PURE__ */ __h("strong", null, order.editedBy)), order.editedAt && /* @__PURE__ */ __h("span", { className: "cb-detail-edited-date" }, " ", "(", new Date(order.editedAt).toLocaleString(), ")"))), updateError && /* @__PURE__ */ __h("div", { className: "cb-detail-error" }, updateError)))), /* @__PURE__ */ __h("div", { className: "cb-detail-footer" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cb-detail-cancel-btn",
		onClick: onClose
	}, t?.closeModal || "Close"), canEdit && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cb-detail-save-btn",
		onClick: handleSave,
		disabled: isUpdating
	}, isUpdating ? t?.searching || "Saving..." : t?.history?.saveChanges || "Save Changes")))));
};
export default CashboxOrderDetailModal;
