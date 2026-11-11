import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useMemo, useCallback } from "../../../utils/runtime.js";
import { useNavigate } from "../../../utils/router.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import { API_URL } from "../../../utils/config.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useAuth } from "../../../context/AuthContext.js";
import { useLang } from "../../../utils/useLang.js";
import { getCashboxTranslation } from "../Lang.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
import CashboxTopBar from "../components/CashboxTopBar.js";
import CashboxOrderDetailModal from "./CashboxOrderDetailModal.js";
const CashboxHistory = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const lang = useLang();
	const t = useMemo(() => getCashboxTranslation(lang), [lang]);
	const [orders, setOrders] = useState([]);
	const [summary, setSummary] = useState(null);
	const [totalCount, setTotalCount] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(20);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [toast, setToast] = useState("");
	const [selectedOrder, setSelectedOrder] = useState(null);
	const cashierName = user?.name || user?.username || user?.Name || t?.unknownUser || "Unknown User";
	const cashierAvatar = user?.profilePictureUrl || user?.ProfilePictureUrl || user?.avatarUrl || user?.avatar || null;
	const showToast = (msg) => {
		setToast(msg);
		setTimeout(() => setToast(""), 3e3);
	};
	const fetchHistory = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				pageSize: pageSize.toString(),
				lang: lang || "az"
			});
			const res = await fetchWithRefresh(`${API_URL}/api/cashbox/history?${params.toString()}`);
			if (!res.ok) {
				if (res.status === 403) {
					throw new Error("Access denied. Lead Staff, Admin or Super Admin role required.");
				}
				throw new Error(`Failed to load history (${res.status})`);
			}
			const data = await res.json();
			setOrders(data.orders || []);
			setTotalCount(data.totalCount || 0);
			setTotalPages(data.totalPages || 1);
			setSummary(data.summary || null);
		} catch (err) {
			console.error("Failed to fetch cashbox history:", err);
			setError(err.message || t?.history?.loadError || "Failed to load history");
		} finally {
			setLoading(false);
		}
	}, [
		page,
		pageSize,
		lang,
		t
	]);
	useEffect(() => {
		fetchHistory();
	}, [fetchHistory]);
	const handleUpdateOrder = async (orderId, updateData) => {
		const res = await fetchWithRefresh(`${API_URL}/api/cashbox/orders/${orderId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updateData)
		});
		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			throw new Error(data.message || "Failed to update order");
		}
		const data = await res.json().catch(() => ({}));
		if (data.order) {
			setSelectedOrder((prev) => prev && prev.id === orderId ? {
				...prev,
				...data.order
			} : prev);
			setOrders((prev) => prev.map((o) => o.id === orderId ? {
				...o,
				...data.order
			} : o));
		}
		showToast(t?.history?.statusUpdated || "Status successfully updated");
		await fetchHistory();
	};
	const copyToClipboard = (text) => {
		navigator.clipboard?.writeText(text);
		showToast(`Copied ID: ${text.slice(0, 8)}...`);
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
	return /* @__PURE__ */ __h("div", { className: "cb-history-page" }, /* @__PURE__ */ __h(AnimatePresence, null, toast && /* @__PURE__ */ __h(motion.div, {
		className: "cb-history-toast",
		initial: {
			opacity: 0,
			y: -20,
			scale: .95
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		exit: {
			opacity: 0,
			y: -20,
			scale: .95
		},
		transition: { duration: .2 }
	}, /* @__PURE__ */ __h("span", null, toast))), /* @__PURE__ */ __h(CashboxTopBar, {
		cashierName,
		cashierAvatar,
		t,
		isHistory: true
	}), /* @__PURE__ */ __h("main", { className: "cb-history-main" }, summary && /* @__PURE__ */ __h("div", { className: "cb-history-metrics" }, /* @__PURE__ */ __h("div", { className: "cb-metric-card" }, /* @__PURE__ */ __h("div", { className: "cb-metric-card__icon cb-metric-card__icon--rev" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("line", {
		x1: "12",
		y1: "1",
		x2: "12",
		y2: "23"
	}), /* @__PURE__ */ __h("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }))), /* @__PURE__ */ __h("div", { className: "cb-metric-card__info" }, /* @__PURE__ */ __h("span", { className: "cb-metric-card__label" }, t?.history?.totalRevenue || "Total Revenue"), /* @__PURE__ */ __h("span", { className: "cb-metric-card__value" }, summary.totalRevenue?.toFixed(2), " ₼"))), /* @__PURE__ */ __h("div", { className: "cb-metric-card" }, /* @__PURE__ */ __h("div", { className: "cb-metric-card__icon cb-metric-card__icon--orders" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
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
	}))), /* @__PURE__ */ __h("div", { className: "cb-metric-card__info" }, /* @__PURE__ */ __h("span", { className: "cb-metric-card__label" }, t?.history?.totalOrders || "Total Orders"), /* @__PURE__ */ __h("span", { className: "cb-metric-card__value" }, summary.totalOrders))), /* @__PURE__ */ __h("div", { className: "cb-metric-card" }, /* @__PURE__ */ __h("div", { className: "cb-metric-card__icon cb-metric-card__icon--cash" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("rect", {
		x: "2",
		y: "6",
		width: "20",
		height: "12",
		rx: "2"
	}), /* @__PURE__ */ __h("circle", {
		cx: "12",
		cy: "12",
		r: "2"
	}), /* @__PURE__ */ __h("path", { d: "M6 12h.01M18 12h.01" }))), /* @__PURE__ */ __h("div", { className: "cb-metric-card__info" }, /* @__PURE__ */ __h("span", { className: "cb-metric-card__label" }, t?.history?.cashTotal || "Cash"), /* @__PURE__ */ __h("span", { className: "cb-metric-card__value" }, summary.cashRevenue?.toFixed(2), " ₼"))), /* @__PURE__ */ __h("div", { className: "cb-metric-card" }, /* @__PURE__ */ __h("div", { className: "cb-metric-card__icon cb-metric-card__icon--card" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.2",
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
	}))), /* @__PURE__ */ __h("div", { className: "cb-metric-card__info" }, /* @__PURE__ */ __h("span", { className: "cb-metric-card__label" }, t?.history?.cardTotal || "Card"), /* @__PURE__ */ __h("span", { className: "cb-metric-card__value" }, summary.cardRevenue?.toFixed(2), " ₼")))), loading && orders.length === 0 ? /* @__PURE__ */ __h("div", { className: "cb-history-loading" }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading...",
		className: "cb-history-spinner"
	}), /* @__PURE__ */ __h("p", null, t?.history?.loadingHistory || "Loading history...")) : error ? /* @__PURE__ */ __h("div", { className: "cb-history-error" }, /* @__PURE__ */ __h("div", { className: "cb-history-error__icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "#c5a059",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		style: {
			width: 44,
			height: 44
		}
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
	}))), /* @__PURE__ */ __h("h3", null, error), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cb-history-retry-btn",
		onClick: fetchHistory
	}, t?.history?.refresh || "Retry")) : orders.length === 0 ? /* @__PURE__ */ __h("div", { className: "cb-history-empty" }, /* @__PURE__ */ __h("div", { className: "cb-history-empty__icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "rgba(255,255,255,0.3)",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		style: {
			width: 48,
			height: 48
		}
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
	}))), /* @__PURE__ */ __h("h3", null, t?.history?.noOrdersFound || "No Orders Found")) : /* @__PURE__ */ __h("div", { className: "cb-history-table-container" }, /* @__PURE__ */ __h("table", { className: "cb-history-table" }, /* @__PURE__ */ __h("thead", null, /* @__PURE__ */ __h("tr", null, /* @__PURE__ */ __h("th", null, t?.history?.orderId || "Order #"), /* @__PURE__ */ __h("th", null, t?.history?.date || "Date"), /* @__PURE__ */ __h("th", null, t?.history?.cashier || "Cashier"), /* @__PURE__ */ __h("th", null, t?.history?.items || "Items"), /* @__PURE__ */ __h("th", null, t?.history?.payment || "Payment"), /* @__PURE__ */ __h("th", null, t?.history?.status || "Status"), /* @__PURE__ */ __h("th", null, t?.history?.total || "Total"), /* @__PURE__ */ __h("th", { style: { textAlign: "right" } }, t?.history?.actions || "Actions"))), /* @__PURE__ */ __h("tbody", null, orders.map((order) => {
		const dateStr = new Date(order.createdAt).toLocaleString(undefined, {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
		return /* @__PURE__ */ __h("tr", {
			key: order.id,
			className: "cb-history-row",
			onClick: () => setSelectedOrder(order)
		}, /* @__PURE__ */ __h("td", { className: "cb-history-cell-id" }, /* @__PURE__ */ __h("span", {
			className: "cb-history-id-code",
			title: "Click to copy full ID",
			onClick: (e) => {
				e.stopPropagation();
				copyToClipboard(order.id);
			}
		}, "#", order.id.slice(0, 8))), /* @__PURE__ */ __h("td", { className: "cb-history-cell-date" }, dateStr), /* @__PURE__ */ __h("td", { className: "cb-history-cell-cashier" }, /* @__PURE__ */ __h("div", {
			className: "cb-history-cashier-pill",
			title: order.userId ? `User ID: ${order.userId}${order.cashierEmail ? ` (${order.cashierEmail})` : ""}` : order.cashierEmail || ""
		}, order.cashierAvatar ? /* @__PURE__ */ __h("img", {
			src: order.cashierAvatar,
			alt: order.cashierName || "Cashier",
			className: "cb-history-cashier-avatar"
		}) : /* @__PURE__ */ __h("span", { className: "cb-history-cashier-avatar-fallback" }, (order.cashierName || "C")[0]?.toUpperCase()), /* @__PURE__ */ __h("span", { className: "cb-history-cashier-name" }, order.cashierName || "—"))), /* @__PURE__ */ __h("td", { className: "cb-history-cell-items" }, /* @__PURE__ */ __h("div", { className: "cb-history-items-summary" }, /* @__PURE__ */ __h("span", { className: "cb-history-items-count" }, t?.history?.itemCount ? t.history.itemCount(order.itemCount) : `${order.itemCount} items`), /* @__PURE__ */ __h("span", { className: "cb-history-items-preview" }, order.products?.map((p) => `${p.name} (${p.quantity})`).join(", ")))), /* @__PURE__ */ __h("td", { className: "cb-history-cell-pay" }, /* @__PURE__ */ __h("span", { className: `cb-hist-pay-badge cb-hist-pay-badge--${order.payMethod.toLowerCase()}` }, order.payMethod === "Card" ? t?.history?.card || "Card" : t?.history?.cash || "Cash")), /* @__PURE__ */ __h("td", { className: "cb-history-cell-status" }, getStatusBadge(order.status)), /* @__PURE__ */ __h("td", { className: "cb-history-cell-total" }, /* @__PURE__ */ __h("div", { className: "cb-history-total-group" }, /* @__PURE__ */ __h("span", { className: "cb-history-amount" }, order.totalAmount?.toFixed(2), " ₼"), order.promoCode && /* @__PURE__ */ __h("span", {
			className: "cb-history-promo-applied",
			title: `Promo: ${order.promoCode}`
		}, order.promoCode))), /* @__PURE__ */ __h("td", {
			className: "cb-history-cell-actions-td",
			style: { textAlign: "right" }
		}, /* @__PURE__ */ __h("div", { className: "cb-history-cell-actions" }, /* @__PURE__ */ __h("button", {
			type: "button",
			className: "cb-history-action-btn",
			onClick: (e) => {
				e.stopPropagation();
				setSelectedOrder(order);
			},
			title: t?.history?.viewDetails || "Details"
		}, /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }), /* @__PURE__ */ __h("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		})), /* @__PURE__ */ __h("span", null, t?.history?.viewDetails || "Details")))));
	}))), /* @__PURE__ */ __h("div", { className: "cb-history-cards" }, orders.map((order) => {
		const dateStr = new Date(order.createdAt).toLocaleString(undefined, {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
		return /* @__PURE__ */ __h("div", {
			key: order.id,
			className: "cb-history-card",
			onClick: () => setSelectedOrder(order)
		}, /* @__PURE__ */ __h("div", { className: "cb-history-card__header" }, /* @__PURE__ */ __h("span", { className: "cb-history-id-code" }, "#", order.id.slice(0, 8)), getStatusBadge(order.status)), /* @__PURE__ */ __h("div", { className: "cb-history-card__items-preview" }, order.products?.map((p) => `${p.name} × ${p.quantity}`).join(", ")), /* @__PURE__ */ __h("div", { className: "cb-history-card__footer" }, /* @__PURE__ */ __h("div", { className: "cb-history-card__meta" }, /* @__PURE__ */ __h("div", {
			className: "cb-history-card__cashier",
			title: order.userId ? `User ID: ${order.userId}` : ""
		}, order.cashierAvatar ? /* @__PURE__ */ __h("img", {
			src: order.cashierAvatar,
			alt: order.cashierName || "",
			className: "cb-history-card__cashier-avatar"
		}) : /* @__PURE__ */ __h("span", { className: "cb-history-card__cashier-avatar-fallback" }, (order.cashierName || "C")[0]?.toUpperCase()), /* @__PURE__ */ __h("span", null, order.cashierName || "—")), /* @__PURE__ */ __h("span", null, "•"), /* @__PURE__ */ __h("span", null, dateStr), /* @__PURE__ */ __h("span", null, "•"), /* @__PURE__ */ __h("span", null, order.payMethod === "Card" ? t?.history?.card || "Card" : t?.history?.cash || "Cash")), /* @__PURE__ */ __h("div", { className: "cb-history-card__amount" }, order.totalAmount?.toFixed(2), " ₼")));
	}))), totalPages > 1 && /* @__PURE__ */ __h("div", { className: "cb-history-pagination" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cb-page-btn",
		disabled: page <= 1,
		onClick: () => setPage((p) => Math.max(1, p - 1))
	}, "←"), /* @__PURE__ */ __h("span", { className: "cb-page-info" }, t?.history?.pageOf ? t.history.pageOf(page, totalPages) : `Page ${page} of ${totalPages}`), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cb-page-btn",
		disabled: page >= totalPages,
		onClick: () => setPage((p) => Math.min(totalPages, p + 1))
	}, "→"))), /* @__PURE__ */ __h(CashboxOrderDetailModal, {
		order: selectedOrder,
		isOpen: Boolean(selectedOrder),
		onClose: () => setSelectedOrder(null),
		onUpdateOrder: handleUpdateOrder,
		t,
		canEdit: true
	}));
};
export default CashboxHistory;
