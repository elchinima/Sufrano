import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useCallback, useMemo } from "../../../utils/runtime.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import AdminLayout from "../AdminLayout/AdminLayout.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useAuth } from "../../../context/AuthContext.js";
const featureCashIcon = "/assets/icons/feature-cash.svg";
const featureCardIcon = "/assets/icons/feature-card-visa-mc.svg";
const featureWalletIcon = "/assets/icons/feature-wallet.svg";
const featureStripeIcon = "/assets/icons/feature-stripe.svg";
const featureGPayIcon = "/assets/icons/feature-gpay.svg";
const cashierIcon = "/assets/icons/cashier-register.svg";
const onlineIcon = "/assets/icons/online-card.svg";
const logo = "/assets/icons/rednest_logo.png";
const loaderIcon = "/assets/icons/loader-animated.svg";
import AdminTableActions from "../../Elements/AdminTableActions.js";
const PAGE_SIZE = 15;
const ORDER_STATUSES = [
	"Pending Payment",
	"Paid Online",
	"Preparing",
	"Ready for Pickup",
	"Completed",
	"Cancelled"
];
const PAYMENT_METHODS = {
	0: {
		label: "Cash Desk",
		icon: featureCashIcon
	},
	CashDeskCash: {
		label: "Cash Desk",
		icon: featureCashIcon
	},
	1: {
		label: "Card at Register",
		icon: featureCardIcon
	},
	CashDeskCard: {
		label: "Card at Register",
		icon: featureCardIcon
	},
	2: {
		label: "Wallet Balance",
		icon: featureWalletIcon
	},
	OnlineBalance: {
		label: "Wallet Balance",
		icon: featureWalletIcon
	},
	3: {
		label: "Bank Card",
		icon: featureCardIcon
	},
	OnlineCardDetails: {
		label: "Bank Card",
		icon: featureCardIcon
	},
	4: {
		label: "Stripe",
		icon: featureStripeIcon
	},
	OnlineStripe: {
		label: "Stripe",
		icon: featureStripeIcon
	},
	5: {
		label: "Google Pay",
		icon: featureGPayIcon
	},
	OnlineGooglePay: {
		label: "Google Pay",
		icon: featureGPayIcon
	}
};
const getPaymentInfo = (method) => {
	if (method === undefined || method === null) {
		return {
			label: "Cashier Desk",
			icon: cashierIcon
		};
	}
	return PAYMENT_METHODS[method] || {
		label: String(method),
		icon: onlineIcon
	};
};
const formatCurrency = (val) => {
	const num = typeof val === "number" ? val : parseFloat(val) || 0;
	return `${num.toFixed(2)} ₼`;
};
const formatBakuDate = (isoStr) => {
	if (!isoStr) return "—";
	try {
		const d = new Date(isoStr);
		if (isNaN(d.getTime())) return "—";
		const formatter = new Intl.DateTimeFormat("ru-RU", {
			timeZone: "Asia/Baku",
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false
		});
		return formatter.format(d);
	} catch {
		return "—";
	}
};
const formatRelativeTime = (dateStr) => {
	if (!dateStr) return "Never";
	try {
		const d = new Date(dateStr);
		const now = new Date();
		const diffMs = now - d;
		const diffMins = Math.floor(diffMs / 6e4);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);
		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return d.toLocaleDateString("ru-RU", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric"
		});
	} catch {
		return "—";
	}
};
const getStatusBadge = (status) => {
	const s = String(status || "").toLowerCase();
	if (s.includes("paid online")) {
		return {
			className: "status-badge status-badge--paid",
			label: "Paid Online",
			dotColor: "#10b981"
		};
	}
	if (s.includes("pending")) {
		return {
			className: "status-badge status-badge--pending",
			label: "Pending Payment",
			dotColor: "#c5a059"
		};
	}
	if (s.includes("prep") || s.includes("process")) {
		return {
			className: "status-badge status-badge--preparing",
			label: "Preparing",
			dotColor: "#38bdf8"
		};
	}
	if (s.includes("ready")) {
		return {
			className: "status-badge status-badge--ready",
			label: "Ready for Pickup",
			dotColor: "#34d399"
		};
	}
	if (s.includes("cancel")) {
		return {
			className: "status-badge status-badge--cancelled",
			label: "Cancelled",
			dotColor: "#c5a059"
		};
	}
	return {
		className: "status-badge status-badge--completed",
		label: "Completed",
		dotColor: "#22c55e"
	};
};
const fadeUp = {
	hidden: {
		opacity: 0,
		y: 16
	},
	show: (i) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * .04,
			duration: .35,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	})
};
const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [toast, setToast] = useState({
		message: "",
		type: "success"
	});
	const [searchInput, setSearchInput] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [paymentFilter, setPaymentFilter] = useState("all");
	const [sortBy, setSortBy] = useState("latest");
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
	const [orderToDelete, setOrderToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [updatingOrderId, setUpdatingOrderId] = useState(null);
	const { user } = useAuth();
	const [copiedId, setCopiedId] = useState(null);
	const currentUserRole = (user?.role || user?.Role || "").toLowerCase().replace(/\s+/g, "");
	const isSuperAdmin = currentUserRole === "superadmin" || currentUserRole === "super admin";
	const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
	const showToast = (message, type = "success") => {
		const isErr = type === "error" || /denied|failed|error|restricted/i.test(message);
		setToast({
			message,
			type: isErr ? "error" : "success"
		});
		setTimeout(() => setToast({
			message: "",
			type: "success"
		}), 5e3);
	};
	const fetchOrders = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const res = await fetchWithRefresh(`${apiUrl}/api/admin/orders`);
			if (res.ok) {
				const data = await res.json();
				setOrders(Array.isArray(data) ? data : []);
			} else {
				setError("Failed to load orders list from server.");
			}
		} catch {
			setError("Connection error while fetching orders.");
		} finally {
			setLoading(false);
		}
	}, [apiUrl]);
	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);
	useEffect(() => {
		if (selectedReceiptOrder || orderToDelete) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [selectedReceiptOrder, orderToDelete]);
	const copyToClipboard = (text, id) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		showToast(`Copied: ${text.slice(0, 16)}...`);
		setTimeout(() => setCopiedId(null), 2e3);
	};
	const handleUpdateStatus = async (orderId, newStatus) => {
		setUpdatingOrderId(orderId);
		try {
			const res = await fetchWithRefresh(`${apiUrl}/api/admin/orders/${orderId}/status`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus })
			});
			if (res.ok) {
				setOrders((prev) => prev.map((o) => o.id === orderId ? {
					...o,
					status: newStatus
				} : o));
				if (selectedReceiptOrder && selectedReceiptOrder.id === orderId) {
					setSelectedReceiptOrder((prev) => prev ? {
						...prev,
						status: newStatus
					} : null);
				}
				showToast(`Order status updated to "${newStatus}"`);
			} else {
				const data = await res.json().catch(() => ({}));
				showToast(data.message || "Failed to update order status");
			}
		} catch {
			showToast("Network error while updating status");
		} finally {
			setUpdatingOrderId(null);
		}
	};
	const handleDeleteOrder = async () => {
		if (!orderToDelete) return;
		if (!isSuperAdmin) {
			showToast("Access denied. Only Super Admin can delete orders.");
			setOrderToDelete(null);
			return;
		}
		setIsDeleting(true);
		try {
			const res = await fetchWithRefresh(`${apiUrl}/api/admin/orders/${orderToDelete.id}`, { method: "DELETE" });
			if (res.ok) {
				setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
				if (selectedReceiptOrder && selectedReceiptOrder.id === orderToDelete.id) {
					setSelectedReceiptOrder(null);
				}
				showToast("Order deleted successfully");
				setOrderToDelete(null);
			} else {
				const data = await res.json().catch(() => ({}));
				showToast(data.message || "Failed to delete order");
			}
		} catch {
			showToast("Network error while deleting order");
		} finally {
			setIsDeleting(false);
		}
	};
	const stats = useMemo(() => {
		const totalCount = orders.length;
		const totalRevenue = orders.reduce((sum, o) => sum + (o.payment?.totalAmount || 0), 0);
		const activeCount = orders.filter((o) => {
			const s = (o.status || "").toLowerCase();
			return !s.includes("complete") && !s.includes("cancel");
		}).length;
		const completedCount = orders.filter((o) => {
			const s = (o.status || "").toLowerCase();
			return s.includes("complete");
		}).length;
		return {
			totalCount,
			totalRevenue,
			activeCount,
			completedCount
		};
	}, [orders]);
	const filteredOrders = useMemo(() => {
		let list = [...orders];
		if (searchInput.trim()) {
			const q = searchInput.toLowerCase().trim();
			list = list.filter((o) => {
				const idMatch = String(o.id || "").toLowerCase().includes(q);
				const nameMatch = (o.user?.name || "").toLowerCase().includes(q);
				const emailMatch = (o.user?.email || "").toLowerCase().includes(q);
				const promoMatch = (o.payment?.promoCode || "").toLowerCase().includes(q);
				const itemMatch = (o.items || []).some((item) => (item.name || "").toLowerCase().includes(q));
				return idMatch || nameMatch || emailMatch || promoMatch || itemMatch;
			});
		}
		if (statusFilter !== "all") {
			list = list.filter((o) => {
				const s = (o.status || "").toLowerCase();
				return s === statusFilter.toLowerCase();
			});
		}
		if (paymentFilter !== "all") {
			list = list.filter((o) => {
				const m = String(o.payment?.paymentMethod || "");
				return m.toLowerCase() === paymentFilter.toLowerCase();
			});
		}
		list.sort((a, b) => {
			if (sortBy === "latest") {
				return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
			}
			if (sortBy === "oldest") {
				return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
			}
			if (sortBy === "highest") {
				return (b.payment?.totalAmount || 0) - (a.payment?.totalAmount || 0);
			}
			if (sortBy === "lowest") {
				return (a.payment?.totalAmount || 0) - (b.payment?.totalAmount || 0);
			}
			if (sortBy === "items") {
				return (b.itemsCount || 0) - (a.itemsCount || 0);
			}
			return 0;
		});
		return list;
	}, [
		orders,
		searchInput,
		statusFilter,
		paymentFilter,
		sortBy
	]);
	const visibleOrders = useMemo(() => {
		return filteredOrders.slice(0, visibleCount);
	}, [filteredOrders, visibleCount]);
	const hasMore = visibleCount < filteredOrders.length;
	return /* @__PURE__ */ __h(AdminLayout, null, /* @__PURE__ */ __h("div", { className: "admin-orders" }, /* @__PURE__ */ __h(AnimatePresence, null, toast.message && /* @__PURE__ */ __h(motion.div, {
		className: `admin-orders__toast ${toast.type === "error" ? "admin-orders__toast--error" : ""}`,
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
		}
	}, toast.type === "error" ? /* @__PURE__ */ __h("svg", {
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
	})) : /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), /* @__PURE__ */ __h("span", null, toast.message))), /* @__PURE__ */ __h(motion.div, {
		className: "admin-orders__header",
		initial: {
			opacity: 0,
			y: -16
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .4,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	}, /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h1", { className: "admin-orders__title" }, "Orders"), /* @__PURE__ */ __h("p", { className: "admin-orders__subtitle" }, "Real-time feed of customer coffee receipts, orders, and payment statuses"))), /* @__PURE__ */ __h("div", { className: "admin-orders__stats" }, /* @__PURE__ */ __h(motion.div, {
		className: "admin-orders__stat-card",
		style: { "--accent": "#c5a059" },
		custom: 0,
		variants: fadeUp,
		initial: "hidden",
		animate: "show"
	}, /* @__PURE__ */ __h("div", { className: "admin-orders__stat-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" }), /* @__PURE__ */ __h("path", { d: "M3 6h18" }), /* @__PURE__ */ __h("path", { d: "M16 10a4 4 0 0 1-8 0" }))), /* @__PURE__ */ __h("div", { className: "admin-orders__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-orders__stat-value" }, loading ? "..." : stats.totalCount), /* @__PURE__ */ __h("span", { className: "admin-orders__stat-label" }, "Total Orders"), /* @__PURE__ */ __h("span", { className: "admin-orders__stat-sub" }, "Across all users"))), /* @__PURE__ */ __h(motion.div, {
		className: "admin-orders__stat-card",
		style: { "--accent": "#c5a059" },
		custom: 1,
		variants: fadeUp,
		initial: "hidden",
		animate: "show"
	}, /* @__PURE__ */ __h("div", { className: "admin-orders__stat-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ __h("path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }), /* @__PURE__ */ __h("path", { d: "M12 18V6" }))), /* @__PURE__ */ __h("div", { className: "admin-orders__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-orders__stat-value highlight" }, loading ? "..." : formatCurrency(stats.totalRevenue)), /* @__PURE__ */ __h("span", { className: "admin-orders__stat-label" }, "Total Revenue"), /* @__PURE__ */ __h("span", { className: "admin-orders__stat-sub" }, "Gross sales volume"))), /* @__PURE__ */ __h(motion.div, {
		className: "admin-orders__stat-card",
		style: { "--accent": "#38bdf8" },
		custom: 2,
		variants: fadeUp,
		initial: "hidden",
		animate: "show"
	}, /* @__PURE__ */ __h("div", { className: "admin-orders__stat-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 16 14" }))), /* @__PURE__ */ __h("div", { className: "admin-orders__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-orders__stat-value" }, loading ? "..." : stats.activeCount), /* @__PURE__ */ __h("span", { className: "admin-orders__stat-label" }, "In Progress"), /* @__PURE__ */ __h("span", { className: "admin-orders__stat-sub" }, "Pending or preparing"))), /* @__PURE__ */ __h(motion.div, {
		className: "admin-orders__stat-card",
		style: { "--accent": "#10b981" },
		custom: 3,
		variants: fadeUp,
		initial: "hidden",
		animate: "show"
	}, /* @__PURE__ */ __h("div", { className: "admin-orders__stat-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" }))), /* @__PURE__ */ __h("div", { className: "admin-orders__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-orders__stat-value" }, loading ? "..." : stats.completedCount), /* @__PURE__ */ __h("span", { className: "admin-orders__stat-label" }, "Completed"), /* @__PURE__ */ __h("span", { className: "admin-orders__stat-sub" }, "Delivered & finalized")))), /* @__PURE__ */ __h("div", { className: "admin-orders__controls" }, /* @__PURE__ */ __h("div", { className: "admin-orders__search-wrap" }, /* @__PURE__ */ __h("svg", {
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
		id: "admin-orders-search",
		type: "text",
		placeholder: "Search by order ID, customer name, email, product, promo...",
		value: searchInput,
		onChange: (e) => setSearchInput(e.target.value)
	}), searchInput && /* @__PURE__ */ __h("button", {
		className: "admin-orders__search-clear",
		onClick: () => setSearchInput(""),
		"aria-label": "Clear search"
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
	})))), /* @__PURE__ */ __h("div", { className: "admin-orders__filters" }, /* @__PURE__ */ __h("div", { className: "admin-orders__select-wrap" }, /* @__PURE__ */ __h("select", {
		id: "admin-orders-status-filter",
		value: statusFilter,
		onChange: (e) => setStatusFilter(e.target.value)
	}, /* @__PURE__ */ __h("option", { value: "all" }, "All Statuses (", orders.length, ")"), ORDER_STATUSES.map((st) => /* @__PURE__ */ __h("option", {
		key: st,
		value: st
	}, st)))), /* @__PURE__ */ __h("div", { className: "admin-orders__select-wrap" }, /* @__PURE__ */ __h("select", {
		id: "admin-orders-payment-filter",
		value: paymentFilter,
		onChange: (e) => setPaymentFilter(e.target.value)
	}, /* @__PURE__ */ __h("option", { value: "all" }, "All Payments"), /* @__PURE__ */ __h("option", { value: "OnlineStripe" }, "Stripe"), /* @__PURE__ */ __h("option", { value: "OnlineCardDetails" }, "Bank Card"), /* @__PURE__ */ __h("option", { value: "OnlineBalance" }, "Wallet Balance"), /* @__PURE__ */ __h("option", { value: "OnlineGooglePay" }, "Google Pay"), /* @__PURE__ */ __h("option", { value: "CashDeskCash" }, "Cash Desk"), /* @__PURE__ */ __h("option", { value: "CashDeskCard" }, "Card at Register"))), /* @__PURE__ */ __h("div", { className: "admin-orders__select-wrap" }, /* @__PURE__ */ __h("select", {
		id: "admin-orders-sort",
		value: sortBy,
		onChange: (e) => setSortBy(e.target.value)
	}, /* @__PURE__ */ __h("option", { value: "latest" }, "Latest First"), /* @__PURE__ */ __h("option", { value: "oldest" }, "Oldest First"), /* @__PURE__ */ __h("option", { value: "highest" }, "Highest Amount"), /* @__PURE__ */ __h("option", { value: "lowest" }, "Lowest Amount"), /* @__PURE__ */ __h("option", { value: "items" }, "Most Items"))))), error && /* @__PURE__ */ __h("div", { className: "admin-orders__error-banner" }, /* @__PURE__ */ __h("svg", {
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
	})), /* @__PURE__ */ __h("span", null, error), /* @__PURE__ */ __h("button", { onClick: fetchOrders }, "Try Again")), loading && /* @__PURE__ */ __h("div", { className: "admin-orders__loading" }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading...",
		className: "admin-orders__spinner"
	}), /* @__PURE__ */ __h("span", null, "Loading orders feed...")), !loading && filteredOrders.length === 0 && /* @__PURE__ */ __h("div", { className: "admin-orders__empty" }, /* @__PURE__ */ __h("div", { className: "admin-orders__empty-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.5"
	}, /* @__PURE__ */ __h("path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" }), /* @__PURE__ */ __h("path", { d: "M3 6h18" }), /* @__PURE__ */ __h("path", { d: "M16 10a4 4 0 0 1-8 0" }))), /* @__PURE__ */ __h("h3", null, "No orders found"), /* @__PURE__ */ __h("p", null, searchInput || statusFilter !== "all" || paymentFilter !== "all" ? "No orders match your filter criteria." : "No orders have been placed in the system yet."), (searchInput || statusFilter !== "all" || paymentFilter !== "all") && /* @__PURE__ */ __h("button", {
		className: "admin-orders__btn-secondary",
		onClick: () => {
			setSearchInput("");
			setStatusFilter("all");
			setPaymentFilter("all");
		}
	}, "Reset Filters")), !loading && filteredOrders.length > 0 && /* @__PURE__ */ __h("div", { className: "admin-orders__table-card" }, /* @__PURE__ */ __h("div", { className: "admin-orders__table-responsive" }, /* @__PURE__ */ __h("table", { className: "admin-orders__table" }, /* @__PURE__ */ __h("thead", null, /* @__PURE__ */ __h("tr", null, /* @__PURE__ */ __h("th", null, "Order ID"), /* @__PURE__ */ __h("th", null, "Customer"), /* @__PURE__ */ __h("th", null, "Payment & Total"), /* @__PURE__ */ __h("th", null, "Status"), /* @__PURE__ */ __h("th", null, "Date & Time"), /* @__PURE__ */ __h("th", { className: "text-right" }, "Actions"))), /* @__PURE__ */ __h("tbody", null, visibleOrders.map((order, i) => {
		const badge = getStatusBadge(order.status);
		const payInfo = getPaymentInfo(order.payment?.paymentMethod);
		const shortId = order.id ? order.id.slice(0, 8).toUpperCase() : "UNKNOWN";
		return /* @__PURE__ */ __h(motion.tr, {
			key: order.id,
			custom: i,
			variants: fadeUp,
			initial: "hidden",
			animate: "show"
		}, /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-orders__id-cell" }, /* @__PURE__ */ __h("button", {
			className: `id-copy-tag${copiedId === order.id ? " copied" : ""}`,
			onClick: () => copyToClipboard(order.id, order.id),
			title: "Click to copy full Order ID"
		}, /* @__PURE__ */ __h("code", null, "#", shortId), copiedId === order.id ? /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5"
		}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })) : /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("rect", {
			x: "9",
			y: "9",
			width: "13",
			height: "13",
			rx: "2"
		}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }))))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-orders__customer-cell" }, /* @__PURE__ */ __h("div", { className: "customer-info" }, /* @__PURE__ */ __h("span", { className: "customer-name" }, order.user?.name || "Guest / Unnamed"), /* @__PURE__ */ __h("span", { className: "customer-email" }, order.user?.email || "—")))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-orders__payment-cell" }, /* @__PURE__ */ __h("span", { className: "total-val" }, formatCurrency(order.payment?.totalAmount)), /* @__PURE__ */ __h("div", { className: "payment-method-row" }, /* @__PURE__ */ __h("img", {
			src: payInfo.icon,
			alt: "",
			className: "pay-icon"
		}), /* @__PURE__ */ __h("span", { className: "pay-label" }, payInfo.label)), order.payment?.discountAmount > 0 && /* @__PURE__ */ __h("span", { className: "discount-tag" }, "Promo: -", formatCurrency(order.payment.discountAmount)))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-orders__status-cell" }, /* @__PURE__ */ __h("div", { className: "status-changer-wrap" }, /* @__PURE__ */ __h("select", {
			className: badge.className,
			value: order.status,
			disabled: updatingOrderId === order.id,
			onChange: (e) => handleUpdateStatus(order.id, e.target.value)
		}, ORDER_STATUSES.map((st) => /* @__PURE__ */ __h("option", {
			key: st,
			value: st
		}, st)))))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-orders__date-cell" }, /* @__PURE__ */ __h("span", { className: "date-main" }, formatBakuDate(order.createdAt)), /* @__PURE__ */ __h("span", { className: "date-rel" }, formatRelativeTime(order.createdAt)))), /* @__PURE__ */ __h("td", { className: "text-right" }, /* @__PURE__ */ __h(AdminTableActions, {
			index: i,
			total: visibleOrders.length,
			actions: [{
				label: "View Receipt",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
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
				}), /* @__PURE__ */ __h("polyline", { points: "10 9 9 9 8 9" })),
				onClick: () => setSelectedReceiptOrder(order)
			}, {
				label: "Delete Order",
				variant: "danger",
				locked: !isSuperAdmin,
				title: isSuperAdmin ? "Delete Order" : "Access denied (Super Admin only)",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })),
				onClick: () => {
					if (!isSuperAdmin) {
						showToast("Access denied. Only Super Admin can delete orders.");
					} else {
						setOrderToDelete(order);
					}
				}
			}]
		})));
	}))))), hasMore && !loading && /* @__PURE__ */ __h("div", { className: "admin-orders__load-more" }, /* @__PURE__ */ __h("button", {
		className: "admin-orders__btn-secondary",
		onClick: () => setVisibleCount((prev) => prev + PAGE_SIZE)
	}, "Load More Orders (", filteredOrders.length - visibleCount, " remaining)")), /* @__PURE__ */ __h(AnimatePresence, null, selectedReceiptOrder && /* @__PURE__ */ __h("div", {
		className: "admin-orders__modal-backdrop",
		onClick: () => setSelectedReceiptOrder(null)
	}, /* @__PURE__ */ __h(motion.div, {
		className: "admin-orders__modal admin-orders__modal--receipt",
		initial: {
			opacity: 0,
			scale: .95,
			y: 20
		},
		animate: {
			opacity: 1,
			scale: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			scale: .95,
			y: 20
		},
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("div", { className: "admin-orders__modal-header" }, /* @__PURE__ */ __h("div", { className: "modal-title-wrap" }, /* @__PURE__ */ __h("div", { className: "modal-logo-brand" }, /* @__PURE__ */ __h("img", {
		src: logo,
		alt: "Süfrano",
		className: "modal-brand-logo"
	}), /* @__PURE__ */ __h("h2", null, "Order Receipt")), /* @__PURE__ */ __h("p", { className: "order-id-sub" }, "ID: ", /* @__PURE__ */ __h("code", null, "...", selectedReceiptOrder.id ? selectedReceiptOrder.id.slice(-7) : ""), /* @__PURE__ */ __h("button", {
		className: `copy-chip-btn${copiedId === "modal-order-id" ? " copied" : ""}`,
		onClick: () => copyToClipboard(selectedReceiptOrder.id, "modal-order-id"),
		title: "Click to copy full Order ID"
	}, copiedId === "modal-order-id" ? /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5"
	}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })) : /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("rect", {
		x: "9",
		y: "9",
		width: "13",
		height: "13",
		rx: "2"
	}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })), /* @__PURE__ */ __h("span", null, "Copy")))), /* @__PURE__ */ __h("button", {
		className: "admin-orders__modal-close",
		onClick: () => setSelectedReceiptOrder(null)
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
	})))), /* @__PURE__ */ __h("div", { className: "admin-orders__modal-body" }, /* @__PURE__ */ __h("div", { className: "receipt-meta-grid" }, /* @__PURE__ */ __h("div", { className: "meta-card customer-card" }, /* @__PURE__ */ __h("span", { className: "meta-label" }, "Customer Info"), /* @__PURE__ */ __h("div", { className: "customer-preview" }, /* @__PURE__ */ __h("div", { className: "customer-meta" }, /* @__PURE__ */ __h("strong", null, selectedReceiptOrder.user?.name || "Guest / Unnamed"), /* @__PURE__ */ __h("span", null, selectedReceiptOrder.user?.email || "—")))), /* @__PURE__ */ __h("div", { className: "meta-card" }, /* @__PURE__ */ __h("span", { className: "meta-label" }, "Order Status"), /* @__PURE__ */ __h("div", { className: "status-changer-inline" }, /* @__PURE__ */ __h("select", {
		className: getStatusBadge(selectedReceiptOrder.status).className,
		value: selectedReceiptOrder.status,
		disabled: updatingOrderId === selectedReceiptOrder.id,
		onChange: (e) => handleUpdateStatus(selectedReceiptOrder.id, e.target.value)
	}, ORDER_STATUSES.map((st) => /* @__PURE__ */ __h("option", {
		key: st,
		value: st
	}, st))))), /* @__PURE__ */ __h("div", { className: "meta-card" }, /* @__PURE__ */ __h("span", { className: "meta-label" }, "Created At (Baku Time)"), /* @__PURE__ */ __h("strong", { className: "meta-value" }, formatBakuDate(selectedReceiptOrder.createdAt))), /* @__PURE__ */ __h("div", { className: "meta-card" }, /* @__PURE__ */ __h("span", { className: "meta-label" }, "Payment Method"), /* @__PURE__ */ __h("div", { className: "pay-method-flex" }, /* @__PURE__ */ __h("img", {
		src: getPaymentInfo(selectedReceiptOrder.payment?.paymentMethod).icon,
		alt: "",
		className: "pay-icon"
	}), /* @__PURE__ */ __h("span", null, getPaymentInfo(selectedReceiptOrder.payment?.paymentMethod).label)))), /* @__PURE__ */ __h("div", { className: "receipt-items-section" }, /* @__PURE__ */ __h("h3", null, "Ordered Items (", selectedReceiptOrder.items?.length || 0, ")"), /* @__PURE__ */ __h("div", { className: "receipt-items-table-wrap" }, /* @__PURE__ */ __h("table", { className: "receipt-items-table" }, /* @__PURE__ */ __h("thead", null, /* @__PURE__ */ __h("tr", null, /* @__PURE__ */ __h("th", null, "Item"), /* @__PURE__ */ __h("th", null, "Category"), /* @__PURE__ */ __h("th", { className: "text-center" }, "Qty"), /* @__PURE__ */ __h("th", { className: "text-right" }, "Unit Price"), /* @__PURE__ */ __h("th", { className: "text-right" }, "Total"))), /* @__PURE__ */ __h("tbody", null, (selectedReceiptOrder.items || []).map((it, idx) => {
		const itemIcon = it.images?.icon || it.images?.image || it.imageUrl;
		return /* @__PURE__ */ __h("tr", { key: idx }, /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "item-name-cell" }, itemIcon ? /* @__PURE__ */ __h("img", {
			src: itemIcon,
			alt: it.name || "Product",
			className: "item-thumb"
		}) : null, /* @__PURE__ */ __h("strong", null, it.name || "Product"))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("span", { className: "category-pill" }, it.category || "General")), /* @__PURE__ */ __h("td", { className: "text-center" }, /* @__PURE__ */ __h("span", { className: "qty-tag" }, it.quantity)), /* @__PURE__ */ __h("td", { className: "text-right" }, formatCurrency(it.unitPrice)), /* @__PURE__ */ __h("td", { className: "text-right highlight" }, formatCurrency(it.unitPrice * it.quantity)));
	}))))), (selectedReceiptOrder.notes?.CustomerNote || selectedReceiptOrder.notes?.KitchenNote || selectedReceiptOrder.notes?.Comment) && /* @__PURE__ */ __h("div", { className: "receipt-notes-section" }, /* @__PURE__ */ __h("h3", null, "Order Notes & Instructions"), /* @__PURE__ */ __h("div", { className: "notes-grid" }, selectedReceiptOrder.notes?.CustomerNote && /* @__PURE__ */ __h("div", { className: "note-card" }, /* @__PURE__ */ __h("span", { className: "note-type" }, "Customer Note"), /* @__PURE__ */ __h("p", null, selectedReceiptOrder.notes.CustomerNote)), selectedReceiptOrder.notes?.KitchenNote && /* @__PURE__ */ __h("div", { className: "note-card" }, /* @__PURE__ */ __h("span", { className: "note-type" }, "Kitchen Note"), /* @__PURE__ */ __h("p", null, selectedReceiptOrder.notes.KitchenNote)), selectedReceiptOrder.notes?.Comment && /* @__PURE__ */ __h("div", { className: "note-card" }, /* @__PURE__ */ __h("span", { className: "note-type" }, "Order Comment"), /* @__PURE__ */ __h("p", null, selectedReceiptOrder.notes.Comment)))), /* @__PURE__ */ __h("div", { className: "receipt-payment-summary" }, /* @__PURE__ */ __h("h3", null, "Payment Breakdown"), /* @__PURE__ */ __h("div", { className: "summary-rows" }, /* @__PURE__ */ __h("div", { className: "summary-row" }, /* @__PURE__ */ __h("span", null, "Original Subtotal"), /* @__PURE__ */ __h("span", null, formatCurrency(selectedReceiptOrder.payment?.originalTotal || selectedReceiptOrder.payment?.totalAmount))), selectedReceiptOrder.payment?.discountAmount > 0 && /* @__PURE__ */ __h("div", { className: "summary-row discount" }, /* @__PURE__ */ __h("span", null, "Discount ", selectedReceiptOrder.payment?.promoCode ? `(${selectedReceiptOrder.payment.promoCode})` : ""), /* @__PURE__ */ __h("span", null, "-", formatCurrency(selectedReceiptOrder.payment.discountAmount))), selectedReceiptOrder.payment?.paymentIntentId && /* @__PURE__ */ __h("div", { className: "summary-row" }, /* @__PURE__ */ __h("span", null, "Stripe Intent ID"), /* @__PURE__ */ __h("code", { className: "intent-code" }, selectedReceiptOrder.payment.paymentIntentId)), /* @__PURE__ */ __h("div", { className: "summary-row total-row" }, /* @__PURE__ */ __h("span", null, "Total Paid"), /* @__PURE__ */ __h("span", { className: "final-total" }, formatCurrency(selectedReceiptOrder.payment?.totalAmount))))), /* @__PURE__ */ __h("div", { className: "receipt-modal-actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-orders__btn-secondary",
		onClick: () => window.print()
	}, "Print Receipt"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn",
		onClick: () => setSelectedReceiptOrder(null)
	}, "Close Receipt")))))), /* @__PURE__ */ __h(AnimatePresence, null, orderToDelete && /* @__PURE__ */ __h("div", {
		className: "admin-orders__modal-backdrop",
		onClick: () => setOrderToDelete(null)
	}, /* @__PURE__ */ __h(motion.div, {
		className: "admin-orders__modal admin-orders__modal--delete",
		initial: {
			opacity: 0,
			scale: .95,
			y: 20
		},
		animate: {
			opacity: 1,
			scale: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			scale: .95,
			y: 20
		},
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("div", { className: "admin-orders__modal-header" }, /* @__PURE__ */ __h("h2", null, "Delete Order"), /* @__PURE__ */ __h("button", {
		className: "admin-orders__modal-close",
		onClick: () => setOrderToDelete(null)
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
	})))), /* @__PURE__ */ __h("div", { className: "delete-modal-body" }, /* @__PURE__ */ __h("div", { className: "delete-warning-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
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
	}))), /* @__PURE__ */ __h("h3", null, "Are you sure you want to delete this order?"), /* @__PURE__ */ __h("p", null, "Order ", /* @__PURE__ */ __h("code", null, "#", orderToDelete.id.slice(0, 8).toUpperCase()), " for", " ", /* @__PURE__ */ __h("strong", null, orderToDelete.user?.name || orderToDelete.user?.email || "Customer"), " with total", " ", /* @__PURE__ */ __h("strong", null, formatCurrency(orderToDelete.payment?.totalAmount)), " will be permanently removed from the database."), /* @__PURE__ */ __h("div", { className: "delete-modal-actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-orders__btn-secondary",
		onClick: () => setOrderToDelete(null),
		disabled: isDeleting
	}, "Cancel"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "delete-confirm-btn",
		onClick: handleDeleteOrder,
		disabled: isDeleting
	}, isDeleting ? "Deleting..." : "Delete Order"))))))));
};
export default Orders;
