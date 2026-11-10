import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useEffect, useState, useCallback } from "../../../utils/runtime.js";
import { useNavigate } from "../../../utils/router.js";
import { motion } from "../../../utils/motion.js";
import AdminLayout from "../AdminLayout/AdminLayout.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useAuth } from "../../../context/AuthContext.js";
const cleanRole = (role) => (role || "").toLowerCase().replace(/\s+/g, "");
const fadeUp = {
	hidden: {
		opacity: 0,
		y: 20
	},
	show: (i) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * .04,
			duration: .45,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	})
};
const StatCard = ({ icon, label, value, sub, accent, index, isLive }) => /* @__PURE__ */ __h(motion.div, {
	className: "dashboard-stat",
	style: { "--accent": accent },
	custom: index,
	variants: fadeUp,
	initial: "hidden",
	animate: "show"
}, /* @__PURE__ */ __h("div", { className: "dashboard-stat__icon" }, icon, isLive && /* @__PURE__ */ __h("span", { className: "dashboard-stat__live-dot" })), /* @__PURE__ */ __h("div", { className: "dashboard-stat__body" }, /* @__PURE__ */ __h("div", { className: "dashboard-stat__val-row" }, /* @__PURE__ */ __h("span", { className: "dashboard-stat__value" }, value)), /* @__PURE__ */ __h("span", { className: "dashboard-stat__label" }, label), sub && /* @__PURE__ */ __h("span", { className: "dashboard-stat__sub" }, sub)));
const Dashboard = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [monthlyStats, setMonthlyStats] = useState({
		monthName: "",
		bakuCurrentTime: "",
		productsSold: "—",
		profitFormatted: "—",
		registrations: "—",
		onlineUsers: "—",
		averageRatingFormatted: "—",
		ratingUsersCount: "—",
		promosCreated: "—",
		promoSpentFormatted: "—",
		emailsSentToday: "—",
		emailsDailyLimit: 300,
		emailsRemainingToday: "—",
		emailsMonthlyTotal: "—"
	});
	const [storageStats, setStorageStats] = useState({
		fileCount: "—",
		totalKb: "—"
	});
	const [loading, setLoading] = useState(true);
	const currentUserRole = cleanRole(user?.role || user?.Role);
	const canAccessDatabase = currentUserRole === "admin" || currentUserRole === "superadmin";
	const loadData = useCallback(async () => {
		setLoading(true);
		const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
		try {
			const statsRes = await fetchWithRefresh(`${apiUrl}/api/admin/stats`);
			if (statsRes.ok) {
				const data = await statsRes.json();
				setMonthlyStats({
					monthName: data.monthName || "",
					bakuCurrentTime: data.bakuCurrentTime || "",
					productsSold: data.productsSold ?? 0,
					profitFormatted: data.profitFormatted || `${(data.profit || 0).toFixed(2)} ₼`,
					registrations: data.registrations ?? 0,
					onlineUsers: data.onlineUsers ?? 0,
					averageRatingFormatted: data.averageRatingFormatted ?? "0.0",
					ratingUsersCount: data.ratingUsersCount ?? 0,
					promosCreated: data.promosCreated ?? 0,
					promoSpentFormatted: data.promoSpentFormatted || `${(data.promoSpent || 0).toFixed(2)} ₼`,
					emailsSentToday: data.emailsSentToday ?? 0,
					emailsDailyLimit: data.emailsDailyLimit ?? 300,
					emailsRemainingToday: data.emailsRemainingToday ?? 300,
					emailsMonthlyTotal: data.emailsMonthlyTotal ?? 0
				});
			}
			if (canAccessDatabase) {
				const filesRes = await fetchWithRefresh(`${apiUrl}/api/admin/files`);
				if (filesRes.ok) {
					const files = await filesRes.json();
					const totalKb = files.reduce((sum, f) => sum + (f.sizeKb || 0), 0);
					setStorageStats({
						fileCount: files.length,
						totalKb: totalKb < 1024 ? `${Math.round(totalKb)} KB` : `${(totalKb / 1024).toFixed(1)} MB`
					});
				}
			}
		} catch (err) {
			console.error("Error fetching dashboard stats:", err);
		} finally {
			setLoading(false);
		}
	}, [canAccessDatabase]);
	useEffect(() => {
		loadData();
	}, [loadData]);
	return /* @__PURE__ */ __h(AdminLayout, null, /* @__PURE__ */ __h("div", { className: "dashboard" }, /* @__PURE__ */ __h(motion.div, {
		className: "dashboard__header",
		initial: {
			opacity: 0,
			y: -16
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .45,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	}, /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h1", { className: "dashboard__title" }, "Dashboard"), /* @__PURE__ */ __h("p", { className: "dashboard__subtitle" }, "Overview of your Süfrano admin panel")), canAccessDatabase && /* @__PURE__ */ __h(motion.button, {
		id: "dashboard-go-database",
		className: "cta-btn dashboard__cta",
		onClick: () => navigate("/admin/database"),
		whileHover: {
			scale: 1.03,
			translateY: -2
		},
		whileTap: { scale: .97 }
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("ellipse", {
		cx: "12",
		cy: "5",
		rx: "9",
		ry: "3"
	}), /* @__PURE__ */ __h("path", { d: "M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" }), /* @__PURE__ */ __h("path", { d: "M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" })), "Go to Database")), /* @__PURE__ */ __h("div", { className: "dashboard__section" }, /* @__PURE__ */ __h("div", { className: "dashboard__section-header" }, /* @__PURE__ */ __h("div", { className: "dashboard__section-title-wrap" }, /* @__PURE__ */ __h("span", { className: "dashboard__section-dot" }), /* @__PURE__ */ __h("h2", { className: "dashboard__section-title" }, "Current Month Statistics")), /* @__PURE__ */ __h("div", { className: "dashboard__badges" }, monthlyStats.monthName && /* @__PURE__ */ __h("span", { className: "dashboard__badge dashboard__badge--month" }, monthlyStats.monthName), /* @__PURE__ */ __h("span", { className: "dashboard__badge dashboard__badge--timezone" }, "UTC+4 (Baku)"))), /* @__PURE__ */ __h("div", { className: "dashboard__stats dashboard__stats--grid-4" }, /* @__PURE__ */ __h(StatCard, {
		index: 0,
		accent: "#f59e0b",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" }), /* @__PURE__ */ __h("path", { d: "M3 6h18" }), /* @__PURE__ */ __h("path", { d: "M16 10a4 4 0 0 1-8 0" })),
		label: "Products Sold",
		value: loading ? "..." : monthlyStats.productsSold,
		sub: "Excluding cancelled orders"
	}), /* @__PURE__ */ __h(StatCard, {
		index: 1,
		accent: "#10b981",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("line", {
			x1: "12",
			y1: "1",
			x2: "12",
			y2: "23"
		}), /* @__PURE__ */ __h("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })),
		label: "Monthly Revenue",
		value: loading ? "..." : monthlyStats.profitFormatted,
		sub: "Total from active orders"
	}), /* @__PURE__ */ __h(StatCard, {
		index: 2,
		accent: "#6366f1",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ __h("circle", {
			cx: "8.5",
			cy: "7",
			r: "4"
		}), /* @__PURE__ */ __h("line", {
			x1: "20",
			y1: "8",
			x2: "20",
			y2: "14"
		}), /* @__PURE__ */ __h("line", {
			x1: "23",
			y1: "11",
			x2: "17",
			y2: "11"
		})),
		label: "New Registrations",
		value: loading ? "..." : monthlyStats.registrations,
		sub: "Users registered this month"
	}), /* @__PURE__ */ __h(StatCard, {
		index: 3,
		accent: "#22c55e",
		isLive: true,
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" })),
		label: "Online Now",
		value: loading ? "..." : monthlyStats.onlineUsers,
		sub: "Active in last 15 minutes"
	}), /* @__PURE__ */ __h(StatCard, {
		index: 4,
		accent: "#eab308",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })),
		label: "Average Rating",
		value: loading ? "..." : `${monthlyStats.averageRatingFormatted} ★`,
		sub: "Based on reviews this month"
	}), /* @__PURE__ */ __h(StatCard, {
		index: 5,
		accent: "#06b6d4",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }), /* @__PURE__ */ __h("path", { d: "M9 10h.01" }), /* @__PURE__ */ __h("path", { d: "M15 10h.01" }), /* @__PURE__ */ __h("path", { d: "M12 10h.01" })),
		label: "Users Rated",
		value: loading ? "..." : monthlyStats.ratingUsersCount,
		sub: "Unique reviewers this month"
	}), /* @__PURE__ */ __h(StatCard, {
		index: 6,
		accent: "#a855f7",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" }), /* @__PURE__ */ __h("line", {
			x1: "12",
			y1: "9",
			x2: "12",
			y2: "15"
		})),
		label: "Promos Created",
		value: loading ? "..." : monthlyStats.promosCreated,
		sub: "Created this month"
	}), /* @__PURE__ */ __h(StatCard, {
		index: 7,
		accent: "#f43f5e",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M19 5L5 19" }), /* @__PURE__ */ __h("circle", {
			cx: "6.5",
			cy: "6.5",
			r: "2.5"
		}), /* @__PURE__ */ __h("circle", {
			cx: "17.5",
			cy: "17.5",
			r: "2.5"
		})),
		label: "Promo Discounts",
		value: loading ? "..." : monthlyStats.promoSpentFormatted,
		sub: "Total discounts applied"
	}))), canAccessDatabase && /* @__PURE__ */ __h("div", { className: "dashboard__section" }, /* @__PURE__ */ __h("div", { className: "dashboard__section-header" }, /* @__PURE__ */ __h("div", { className: "dashboard__section-title-wrap" }, /* @__PURE__ */ __h("span", { className: "dashboard__section-dot dashboard__section-dot--storage" }), /* @__PURE__ */ __h("h2", { className: "dashboard__section-title" }, "Media Storage")), /* @__PURE__ */ __h("span", { className: "dashboard__badge dashboard__badge--storage" }, "Supabase Storage")), /* @__PURE__ */ __h("div", { className: "dashboard__stats" }, /* @__PURE__ */ __h(StatCard, {
		index: 8,
		accent: "#d4af37",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ __h("polyline", { points: "14 2 14 8 20 8" }), /* @__PURE__ */ __h("line", {
			x1: "12",
			y1: "18",
			x2: "12",
			y2: "12"
		}), /* @__PURE__ */ __h("line", {
			x1: "9",
			y1: "15",
			x2: "15",
			y2: "15"
		})),
		label: "Files in storage",
		value: loading ? "..." : storageStats.fileCount,
		sub: "Supabase Storage · admin-files"
	}), /* @__PURE__ */ __h(StatCard, {
		index: 9,
		accent: "#fb923c",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" })),
		label: "Storage used",
		value: loading ? "..." : storageStats.totalKb,
		sub: "All WebP files combined"
	}))), /* @__PURE__ */ __h("div", { className: "dashboard__section" }, /* @__PURE__ */ __h("div", { className: "dashboard__section-header" }, /* @__PURE__ */ __h("div", { className: "dashboard__section-title-wrap" }, /* @__PURE__ */ __h("span", { className: "dashboard__section-dot dashboard__section-dot--email" }), /* @__PURE__ */ __h("h2", { className: "dashboard__section-title" }, "Emails Sent (Brevo)")), /* @__PURE__ */ __h("span", { className: "dashboard__badge dashboard__badge--email" }, "Brevo")), /* @__PURE__ */ __h("div", { className: "dashboard__stats" }, /* @__PURE__ */ __h(StatCard, {
		index: 10,
		accent: "#22ba38",
		icon: /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("rect", {
			x: "2",
			y: "4",
			width: "20",
			height: "16",
			rx: "2"
		}), /* @__PURE__ */ __h("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })),
		label: "Emails Sent (Brevo)",
		value: loading ? "..." : `${monthlyStats.emailsSentToday} / ${monthlyStats.emailsDailyLimit}`,
		sub: `${monthlyStats.emailsRemainingToday} left today · ${monthlyStats.emailsMonthlyTotal} this month`
	})))));
};
export default Dashboard;
