import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useCallback, useMemo } from "../../../utils/runtime.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import AdminLayout from "../AdminLayout/AdminLayout.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useAuth } from "../../../context/AuthContext.js";
import DeleteConfirmModal from "../../Elements/DeleteConfirmModal.js";
import AdminTableActions from "../../Elements/AdminTableActions.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
const PAGE_SIZE = 12;
const CATEGORIES = [
	"All Categories",
	"Products",
	"Service",
	"Delivery",
	"Staff"
];
const STATUSES = [
	"All Statuses",
	"Published",
	"Verification",
	"Pending",
	"Cancelled"
];
const RATINGS = [
	{
		value: "all",
		label: "All Ratings"
	},
	{
		value: "5",
		label: "5.0"
	},
	{
		value: "4",
		label: "4.0"
	},
	{
		value: "3",
		label: "3.0"
	},
	{
		value: "2",
		label: "2.0"
	},
	{
		value: "1",
		label: "1.0"
	}
];
const formatDate = (isoStr) => {
	if (!isoStr) return "—";
	try {
		if (typeof isoStr === "string") {
			const match = isoStr.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
			if (match) {
				const [, year, month, day, hour, minute] = match;
				return `${day}.${month}.${year}, ${hour}:${minute}`;
			}
		}
		const d = new Date(isoStr);
		if (isNaN(d.getTime())) return "—";
		const day = String(d.getDate()).padStart(2, "0");
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const year = d.getFullYear();
		const hour = String(d.getHours()).padStart(2, "0");
		const minute = String(d.getMinutes()).padStart(2, "0");
		return `${day}.${month}.${year}, ${hour}:${minute}`;
	} catch {
		return "—";
	}
};
const formatRelativeTime = (dateStr) => {
	if (!dateStr) return "Never";
	try {
		let d;
		if (typeof dateStr === "string") {
			const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):?(\d{2})?/);
			if (match) {
				const [, year, month, day, hour, minute, second] = match;
				d = Date.UTC(+year, +month - 1, +day, +hour, +minute, +(second || 0));
			}
		}
		if (!d) {
			const parsed = new Date(dateStr);
			if (isNaN(parsed.getTime())) return "Never";
			d = parsed.getTime();
		}
		const nowUtc = Date.now();
		const nowBaku = nowUtc + 4 * 36e5;
		const diffMs = Math.max(0, nowBaku - d);
		const diffMins = Math.floor(diffMs / 6e4);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);
		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays}d ago`;
		return formatDate(dateStr);
	} catch {
		return "—";
	}
};
const getStatusBadge = (status) => {
	const s = (status || "").toLowerCase();
	if (s === "published") return {
		label: "Published",
		className: "badge badge--success"
	};
	if (s === "verification") return {
		label: "Verification",
		className: "badge badge--warning"
	};
	if (s === "pending") return {
		label: "Pending",
		className: "badge badge--info"
	};
	if (s === "cancelled") return {
		label: "Cancelled",
		className: "badge badge--danger"
	};
	return {
		label: status || "Pending",
		className: "badge badge--muted"
	};
};
const getCategoryBadge = (cat) => {
	const c = (cat || "").toLowerCase();
	if (c === "delivery") return {
		label: "Delivery",
		className: "badge badge--info"
	};
	if (c === "products") return {
		label: "Products",
		className: "badge badge--success"
	};
	if (c === "service") return {
		label: "Service",
		className: "badge badge--warning"
	};
	if (c === "staff") return {
		label: "Staff",
		className: "badge badge--purple"
	};
	return {
		label: cat || "General",
		className: "badge badge--muted"
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
const AdminReviews = () => {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [toast, setToast] = useState({
		message: "",
		type: "success"
	});
	const [searchInput, setSearchInput] = useState("");
	const [statusFilter, setStatusFilter] = useState("All Statuses");
	const [categoryFilter, setCategoryFilter] = useState("All Categories");
	const [ratingFilter, setRatingFilter] = useState("all");
	const [sortBy, setSortBy] = useState("newest");
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const [selectedReview, setSelectedReview] = useState(null);
	const [reviewToDelete, setReviewToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [updatingReviewId, setUpdatingReviewId] = useState(null);
	const { user } = useAuth();
	const [copiedId, setCopiedId] = useState(null);
	const currentUserRole = (user?.role || user?.Role || "").toLowerCase().replace(/\s+/g, "");
	const isSuperAdmin = currentUserRole === "superadmin" || currentUserRole === "super admin";
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
	const fetchReviews = useCallback(async () => {
		setError("");
		try {
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const res = await fetchWithRefresh(`${apiUrl}/api/admin/reviews`, { credentials: "include" });
			if (!res.ok) {
				throw new Error(`Failed to load reviews (${res.status})`);
			}
			const data = await res.json();
			setReviews(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error("Error loading reviews:", err);
			setError(err.message || "Failed to load reviews.");
		} finally {
			setLoading(false);
		}
	}, []);
	useEffect(() => {
		window.scrollTo(0, 0);
		fetchReviews();
	}, [fetchReviews]);
	useEffect(() => {
		if (selectedReview || reviewToDelete) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [selectedReview, reviewToDelete]);
	const stats = useMemo(() => {
		const total = reviews.length;
		const verification = reviews.filter((r) => r.status === "Verification").length;
		const published = reviews.filter((r) => r.status === "Published").length;
		const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / total).toFixed(1) : "0.0";
		return {
			total,
			verification,
			published,
			avgRating
		};
	}, [reviews]);
	const filteredReviews = useMemo(() => {
		return reviews.filter((r) => {
			if (statusFilter !== "All Statuses" && r.status !== statusFilter) {
				return false;
			}
			if (categoryFilter !== "All Categories" && r.category !== categoryFilter) {
				return false;
			}
			if (ratingFilter !== "all") {
				const target = Number(ratingFilter);
				const rVal = Math.round(Number(r.rating) || 0);
				if (rVal !== target) return false;
			}
			if (searchInput.trim()) {
				const query = searchInput.toLowerCase().trim();
				const userName = (r.user?.name || "").toLowerCase();
				const userEmail = (r.user?.email || "").toLowerCase();
				const comment = (r.comment || "").toLowerCase();
				const reviewId = (r.id || "").toLowerCase();
				const orderId = (r.orderId || "").toLowerCase();
				return userName.includes(query) || userEmail.includes(query) || comment.includes(query) || reviewId.includes(query) || orderId.includes(query);
			}
			return true;
		}).sort((a, b) => {
			if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
			if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
			if (sortBy === "rating_high") return (Number(b.rating) || 0) - (Number(a.rating) || 0);
			if (sortBy === "rating_low") return (Number(a.rating) || 0) - (Number(b.rating) || 0);
			if (sortBy === "likes") return (b.likesCount || 0) - (a.likesCount || 0);
			return 0;
		});
	}, [
		reviews,
		statusFilter,
		categoryFilter,
		ratingFilter,
		searchInput,
		sortBy
	]);
	const visibleReviews = useMemo(() => {
		return filteredReviews.slice(0, visibleCount);
	}, [filteredReviews, visibleCount]);
	const handleUpdateStatus = async (reviewId, newStatus) => {
		setUpdatingReviewId(reviewId);
		try {
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const res = await fetchWithRefresh(`${apiUrl}/api/admin/reviews/${reviewId}/status`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ status: newStatus })
			});
			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.message || "Failed to update review status.");
			}
			setReviews((prev) => prev.map((r) => r.id === reviewId ? {
				...r,
				status: newStatus,
				statusUpdatedAt: new Date().toISOString()
			} : r));
			if (selectedReview && selectedReview.id === reviewId) {
				setSelectedReview((prev) => ({
					...prev,
					status: newStatus,
					statusUpdatedAt: new Date().toISOString()
				}));
			}
			showToast(`Status updated to "${newStatus}"`);
		} catch (err) {
			console.error("Error changing status:", err);
			showToast(err.message);
		} finally {
			setUpdatingReviewId(null);
		}
	};
	const handleDeleteReview = async () => {
		if (!reviewToDelete) return;
		if (!isSuperAdmin) {
			showToast("Access denied. Only Super Admin can delete reviews.");
			setReviewToDelete(null);
			return;
		}
		setIsDeleting(true);
		try {
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const res = await fetchWithRefresh(`${apiUrl}/api/admin/reviews/${reviewToDelete.id}`, {
				method: "DELETE",
				credentials: "include"
			});
			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.message || "Failed to delete review.");
			}
			setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
			if (selectedReview && selectedReview.id === reviewToDelete.id) {
				setSelectedReview(null);
			}
			showToast("Review deleted successfully");
			setReviewToDelete(null);
		} catch (err) {
			console.error("Error deleting review:", err);
			showToast(err.message);
		} finally {
			setIsDeleting(false);
		}
	};
	const copyToClipboard = (text, id) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		showToast(`Copied: ${text.slice(0, 16)}...`);
		setTimeout(() => setCopiedId(null), 2e3);
	};
	return /* @__PURE__ */ __h(AdminLayout, null, /* @__PURE__ */ __h("div", { className: "admin-reviews" }, /* @__PURE__ */ __h(AnimatePresence, null, toast.message && /* @__PURE__ */ __h(motion.div, {
		className: `admin-reviews__toast ${toast.type === "error" ? "admin-reviews__toast--error" : ""}`,
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
		className: "admin-reviews__header",
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
	}, /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h1", { className: "admin-reviews__title" }, "Reviews"), /* @__PURE__ */ __h("p", { className: "admin-reviews__subtitle" }, "Customer feedback, ratings, and moderation controls"))), /* @__PURE__ */ __h("div", { className: "admin-reviews__stats" }, /* @__PURE__ */ __h(motion.div, {
		className: "admin-reviews__stat-card",
		style: { "--accent": "#c5a059" },
		custom: 0,
		variants: fadeUp,
		initial: "hidden",
		animate: "show"
	}, /* @__PURE__ */ __h("div", { className: "admin-reviews__stat-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }))), /* @__PURE__ */ __h("div", { className: "admin-reviews__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-value" }, loading ? "..." : stats.total), /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-label" }, "Total Reviews"), /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-sub" }, "Across all categories"))), /* @__PURE__ */ __h(motion.div, {
		className: "admin-reviews__stat-card",
		style: { "--accent": "#c5a059" },
		custom: 1,
		variants: fadeUp,
		initial: "hidden",
		animate: "show"
	}, /* @__PURE__ */ __h("div", { className: "admin-reviews__stat-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ __h("path", { d: "M12 6v6l4 2" }))), /* @__PURE__ */ __h("div", { className: "admin-reviews__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-value highlight" }, loading ? "..." : stats.avgRating), /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-label" }, "Average Rating"), /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-sub" }, "Out of 5.0"))), /* @__PURE__ */ __h(motion.div, {
		className: "admin-reviews__stat-card",
		style: {
			"--accent": "#c5a059",
			cursor: "pointer"
		},
		custom: 2,
		variants: fadeUp,
		initial: "hidden",
		animate: "show",
		onClick: () => setStatusFilter("Verification")
	}, /* @__PURE__ */ __h("div", { className: "admin-reviews__stat-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }), /* @__PURE__ */ __h("line", {
		x1: "12",
		y1: "9",
		x2: "12",
		y2: "13"
	}), /* @__PURE__ */ __h("line", {
		x1: "12",
		y1: "17",
		x2: "12.01",
		y2: "17"
	}))), /* @__PURE__ */ __h("div", { className: "admin-reviews__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-value" }, loading ? "..." : stats.verification), /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-label" }, "Verification"), /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-sub" }, "Needs attention"))), /* @__PURE__ */ __h(motion.div, {
		className: "admin-reviews__stat-card",
		style: {
			"--accent": "#10b981",
			cursor: "pointer"
		},
		custom: 3,
		variants: fadeUp,
		initial: "hidden",
		animate: "show",
		onClick: () => setStatusFilter("Published")
	}, /* @__PURE__ */ __h("div", { className: "admin-reviews__stat-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" }))), /* @__PURE__ */ __h("div", { className: "admin-reviews__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-value" }, loading ? "..." : stats.published), /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-label" }, "Published"), /* @__PURE__ */ __h("span", { className: "admin-reviews__stat-sub" }, "Live on site")))), /* @__PURE__ */ __h("div", { className: "admin-reviews__controls" }, /* @__PURE__ */ __h("div", { className: "admin-reviews__search-wrap" }, /* @__PURE__ */ __h("svg", {
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
		id: "admin-reviews-search",
		type: "text",
		placeholder: "Search by author, email, review text, or order ID...",
		value: searchInput,
		onChange: (e) => setSearchInput(e.target.value)
	}), searchInput && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-reviews__search-clear",
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
	})))), /* @__PURE__ */ __h("div", { className: "admin-reviews__filters" }, /* @__PURE__ */ __h("div", { className: "admin-reviews__select-wrap" }, /* @__PURE__ */ __h("select", {
		id: "admin-reviews-status-filter",
		value: statusFilter,
		onChange: (e) => setStatusFilter(e.target.value)
	}, STATUSES.map((st) => /* @__PURE__ */ __h("option", {
		key: st,
		value: st
	}, st)))), /* @__PURE__ */ __h("div", { className: "admin-reviews__select-wrap" }, /* @__PURE__ */ __h("select", {
		id: "admin-reviews-category-filter",
		value: categoryFilter,
		onChange: (e) => setCategoryFilter(e.target.value)
	}, CATEGORIES.map((cat) => /* @__PURE__ */ __h("option", {
		key: cat,
		value: cat
	}, cat)))), /* @__PURE__ */ __h("div", { className: "admin-reviews__select-wrap" }, /* @__PURE__ */ __h("select", {
		id: "admin-reviews-rating-filter",
		value: ratingFilter,
		onChange: (e) => setRatingFilter(e.target.value)
	}, RATINGS.map((r) => /* @__PURE__ */ __h("option", {
		key: r.value,
		value: r.value
	}, r.label)))), /* @__PURE__ */ __h("div", { className: "admin-reviews__select-wrap" }, /* @__PURE__ */ __h("select", {
		id: "admin-reviews-sort",
		value: sortBy,
		onChange: (e) => setSortBy(e.target.value)
	}, /* @__PURE__ */ __h("option", { value: "newest" }, "Newest First"), /* @__PURE__ */ __h("option", { value: "oldest" }, "Oldest First"), /* @__PURE__ */ __h("option", { value: "rating_high" }, "Highest Rating"), /* @__PURE__ */ __h("option", { value: "rating_low" }, "Lowest Rating"), /* @__PURE__ */ __h("option", { value: "likes" }, "Most Liked"))))), error && /* @__PURE__ */ __h("div", { className: "admin-reviews__error-banner" }, /* @__PURE__ */ __h("svg", {
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
		onClick: () => fetchReviews()
	}, "Try Again")), loading && /* @__PURE__ */ __h("div", { className: "admin-reviews__loading" }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading...",
		className: "admin-reviews__spinner"
	}), /* @__PURE__ */ __h("span", null, "Loading customer reviews...")), !loading && filteredReviews.length === 0 && /* @__PURE__ */ __h("div", { className: "admin-reviews__empty" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })), /* @__PURE__ */ __h("h3", null, "No Reviews Found"), /* @__PURE__ */ __h("p", null, searchInput || statusFilter !== "All Statuses" || categoryFilter !== "All Categories" || ratingFilter !== "all" ? "No reviews match your filter criteria." : "There are currently no reviews in the system.")), !loading && filteredReviews.length > 0 && /* @__PURE__ */ __h("div", { className: "admin-reviews__table-card" }, /* @__PURE__ */ __h("div", { className: "admin-reviews__table-responsive" }, /* @__PURE__ */ __h("table", { className: "admin-reviews__table" }, /* @__PURE__ */ __h("thead", null, /* @__PURE__ */ __h("tr", null, /* @__PURE__ */ __h("th", null, "Customer"), /* @__PURE__ */ __h("th", null, "Order"), /* @__PURE__ */ __h("th", null, "Category"), /* @__PURE__ */ __h("th", null, "Rating"), /* @__PURE__ */ __h("th", null, "Status"), /* @__PURE__ */ __h("th", null, "Date"), /* @__PURE__ */ __h("th", { className: "text-right" }, "Actions"))), /* @__PURE__ */ __h("tbody", null, visibleReviews.map((r, i) => {
		const statusBadge = getStatusBadge(r.status);
		const catBadge = getCategoryBadge(r.category);
		return /* @__PURE__ */ __h(motion.tr, {
			key: r.id,
			custom: i,
			variants: fadeUp,
			initial: "hidden",
			animate: "show"
		}, /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-reviews__customer-cell" }, /* @__PURE__ */ __h("div", { className: "customer-info" }, /* @__PURE__ */ __h("span", { className: "customer-name" }, r.user?.name || "Anonymous User"), /* @__PURE__ */ __h("span", { className: "customer-email" }, r.user?.email || "—")))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("button", {
			type: "button",
			className: "admin-reviews__copy-id",
			onClick: () => copyToClipboard(r.orderId, `order-${r.id}`),
			title: "Click to copy Order ID"
		}, /* @__PURE__ */ __h("code", null, "#", String(r.orderId || "").slice(0, 8)), copiedId === `order-${r.id}` ? /* @__PURE__ */ __h("span", { className: "copied-tag" }, "✓") : /* @__PURE__ */ __h("svg", {
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
		}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("span", { className: catBadge.className }, catBadge.label)), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-reviews__rating-cell" }, /* @__PURE__ */ __h("span", { className: "rating-num" }, Number(r.rating || 0).toFixed(1)))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-reviews__status-select-wrap" }, /* @__PURE__ */ __h("select", {
			className: statusBadge.className,
			value: r.status || "Pending",
			disabled: updatingReviewId === r.id,
			onChange: (e) => handleUpdateStatus(r.id, e.target.value)
		}, /* @__PURE__ */ __h("option", { value: "Published" }, "Published"), /* @__PURE__ */ __h("option", { value: "Verification" }, "Verification"), /* @__PURE__ */ __h("option", { value: "Pending" }, "Pending"), /* @__PURE__ */ __h("option", { value: "Cancelled" }, "Cancelled")))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-reviews__date-cell" }, /* @__PURE__ */ __h("span", { className: "date-main" }, formatDate(r.createdAt)), /* @__PURE__ */ __h("span", { className: "date-rel" }, formatRelativeTime(r.createdAt)))), /* @__PURE__ */ __h("td", { className: "text-right" }, /* @__PURE__ */ __h(AdminTableActions, {
			index: i,
			total: visibleReviews.length,
			actions: [{
				label: "View Details",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }), /* @__PURE__ */ __h("circle", {
					cx: "12",
					cy: "12",
					r: "3"
				})),
				onClick: () => setSelectedReview(r)
			}, {
				label: "Delete Review",
				variant: "danger",
				locked: !isSuperAdmin,
				title: isSuperAdmin ? "Delete Review" : "Access denied (Super Admin only)",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })),
				onClick: () => {
					if (!isSuperAdmin) {
						showToast("Access denied. Only Super Admin can delete reviews.");
					} else {
						setReviewToDelete(r);
					}
				}
			}]
		})));
	}))))), filteredReviews.length > visibleCount && !loading && /* @__PURE__ */ __h("div", { className: "admin-reviews__load-more" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-reviews__btn-secondary",
		onClick: () => setVisibleCount((prev) => prev + PAGE_SIZE)
	}, "Load More Reviews (", filteredReviews.length - visibleCount, " remaining)")), /* @__PURE__ */ __h(AnimatePresence, null, selectedReview && /* @__PURE__ */ __h("div", {
		className: "admin-reviews__modal-backdrop",
		onClick: () => setSelectedReview(null)
	}, /* @__PURE__ */ __h(motion.div, {
		className: "admin-reviews__modal",
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
	}, /* @__PURE__ */ __h("div", { className: "admin-reviews__modal-header" }, /* @__PURE__ */ __h("div", { className: "modal-title-wrap" }, /* @__PURE__ */ __h("h2", null, "Review Details"), /* @__PURE__ */ __h("div", { className: "admin-reviews__modal-chips" }, /* @__PURE__ */ __h("code", null, "ID: ", selectedReview.id), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "copy-btn",
		onClick: () => copyToClipboard(selectedReview.id, "modal-id")
	}, copiedId === "modal-id" ? "Copied!" : "Copy"))), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-reviews__modal-close",
		onClick: () => setSelectedReview(null)
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
	})))), /* @__PURE__ */ __h("div", { className: "admin-reviews__modal-body" }, /* @__PURE__ */ __h("div", { className: "admin-reviews__detail-row" }, /* @__PURE__ */ __h("div", { className: "admin-reviews__detail-box" }, /* @__PURE__ */ __h("span", { className: "label" }, "Customer"), /* @__PURE__ */ __h("span", { className: "val" }, selectedReview.user?.name || "Anonymous User"), /* @__PURE__ */ __h("span", { className: "sub-val" }, selectedReview.user?.email || "No email registered")), /* @__PURE__ */ __h("div", { className: "admin-reviews__detail-box" }, /* @__PURE__ */ __h("span", { className: "label" }, "Order Reference"), /* @__PURE__ */ __h("span", { className: "val code-val" }, "#", String(selectedReview.orderId || "").slice(0, 16)))), /* @__PURE__ */ __h("div", { className: "admin-reviews__detail-row" }, /* @__PURE__ */ __h("div", { className: "admin-reviews__detail-box" }, /* @__PURE__ */ __h("span", { className: "label" }, "Category"), /* @__PURE__ */ __h("span", { className: "val" }, selectedReview.category)), /* @__PURE__ */ __h("div", { className: "admin-reviews__detail-box" }, /* @__PURE__ */ __h("span", { className: "label" }, "Rating"), /* @__PURE__ */ __h("span", { className: "val highlight" }, Number(selectedReview.rating || 0).toFixed(1)))), /* @__PURE__ */ __h("div", { className: "admin-reviews__comment-card" }, /* @__PURE__ */ __h("span", { className: "label" }, "Customer Review"), /* @__PURE__ */ __h("p", null, selectedReview.comment || /* @__PURE__ */ __h("em", null, "No text provided."))), /* @__PURE__ */ __h("div", { className: "admin-reviews__detail-row" }, /* @__PURE__ */ __h("div", { className: "admin-reviews__detail-box" }, /* @__PURE__ */ __h("span", { className: "label" }, "Created Date"), /* @__PURE__ */ __h("span", { className: "val" }, formatDate(selectedReview.createdAt))), /* @__PURE__ */ __h("div", { className: "admin-reviews__detail-box" }, /* @__PURE__ */ __h("span", { className: "label" }, "Status"), /* @__PURE__ */ __h("span", { className: "val" }, selectedReview.status)))), /* @__PURE__ */ __h("div", { className: "admin-reviews__modal-footer" }, /* @__PURE__ */ __h("div", { className: "status-change-group" }, /* @__PURE__ */ __h("label", null, "Change Status:"), /* @__PURE__ */ __h("select", {
		value: selectedReview.status,
		onChange: (e) => handleUpdateStatus(selectedReview.id, e.target.value)
	}, /* @__PURE__ */ __h("option", { value: "Published" }, "Published"), /* @__PURE__ */ __h("option", { value: "Verification" }, "Verification"), /* @__PURE__ */ __h("option", { value: "Pending" }, "Pending"), /* @__PURE__ */ __h("option", { value: "Cancelled" }, "Cancelled"))), /* @__PURE__ */ __h("div", { className: "footer-actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: `admin-reviews__btn-danger${!isSuperAdmin ? " admin-reviews__btn-danger--locked" : ""}`,
		onClick: () => {
			if (!isSuperAdmin) {
				showToast("Access denied. Only Super Admin can delete reviews.");
			} else {
				const r = selectedReview;
				setSelectedReview(null);
				setReviewToDelete(r);
			}
		},
		title: isSuperAdmin ? "Delete" : "Access denied (Super Admin only)"
	}, !isSuperAdmin && /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		style: {
			width: "13px",
			height: "13px",
			marginRight: "6px",
			verticalAlign: "-1px"
		}
	}, /* @__PURE__ */ __h("rect", {
		x: "3",
		y: "11",
		width: "18",
		height: "11",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })), "Delete")))))), /* @__PURE__ */ __h(DeleteConfirmModal, {
		isOpen: !!reviewToDelete,
		onClose: () => !isDeleting && setReviewToDelete(null),
		onConfirm: handleDeleteReview,
		title: "Delete Review",
		text: "Are you sure you want to permanently delete this customer review? This action cannot be undone.",
		confirmLabel: "Delete Review",
		loading: isDeleting
	})));
};
export default AdminReviews;
