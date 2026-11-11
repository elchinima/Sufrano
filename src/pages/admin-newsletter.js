(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/AdminPages/Newsletter/Newsletter.js
	__define("components/AdminPages/Newsletter/Newsletter.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useCallback, useMemo } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const __imp_1 = __require("components/AdminPages/AdminLayout/AdminLayout.js");
		const AdminLayout = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { useAuth } = __require("context/AuthContext.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const formatDate = (dateStr) => {
			if (!dateStr) return "—";
			try {
				const d = new Date(dateStr);
				if (isNaN(d.getTime())) return "—";
				const formatter = new Intl.DateTimeFormat("en-GB", {
					timeZone: "Asia/Baku",
					day: "2-digit",
					month: "short",
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
				return d.toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "short",
					year: "numeric"
				});
			} catch {
				return "—";
			}
		};
		const fadeUp = {
			hidden: {
				opacity: 0,
				y: 14
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
		const Newsletter = () => {
			const { user } = useAuth();
			const [activeTab, setActiveTab] = useState("compose");
			const [stats, setStats] = useState({
				totalSubscribers: 0,
				totalCampaigns: 0,
				totalDelivered: 0,
				lastBroadcast: null
			});
			const [statsLoading, setStatsLoading] = useState(true);
			const [subscribers, setSubscribers] = useState([]);
			const [subscribersLoading, setSubscribersLoading] = useState(false);
			const [subscribersSearch, setSubscribersSearch] = useState("");
			const [subscribersFilter, setSubscribersFilter] = useState("all");
			const [history, setHistory] = useState([]);
			const [historyLoading, setHistoryLoading] = useState(false);
			const [itemToDelete, setItemToDelete] = useState(null);
			const [isDeleting, setIsDeleting] = useState(false);
			const baseUrl = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
			const [form, setForm] = useState({
				subject: "🎁 Exclusive Süfrano Club Offer: 20% Off Your Next Order!",
				preheader: "Unlock your special member reward this weekend only.",
				badge: "EXCLUSIVE OFFER",
				heading: "A Special Treat For You, {name}!",
				bodyHtml: `<p>Hello <strong>{name}</strong>,</p>
		<p>As a valued member of the <strong>Süfrano Club</strong>, we are thrilled to offer you an exclusive <strong>20% discount</strong> on our entire premium menu this week!</p>
		<p>Whether you're craving our handcrafted specialty coffee, signature cold brews, or artisanal sweet bites, your member discount is ready to be claimed.</p>
		<p style="padding:14px 18px;background:rgba(197, 160, 89,0.12);border-left:4px solid #c5a059;border-radius:6px;margin:20px 0;">
		  Use promo code <strong style="color:#d4b475;letter-spacing:1px;">SUFRANO20</strong> at checkout or show this email to our barista.
		</p>
		<p>Thank you for choosing Süfrano. We can't wait to craft your next favorite cup!</p>`,
				buttonText: "Order Online Now",
				buttonUrl: baseUrl ? `${baseUrl}/catalog` : "/catalog",
				senderName: "Süfrano"
			});
			const [previewDevice, setPreviewDevice] = useState("desktop");
			const [isTestModalOpen, setIsTestModalOpen] = useState(false);
			const [testEmailInput, setTestEmailInput] = useState("");
			const [isSendingTest, setIsSendingTest] = useState(false);
			const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
			const [isBroadcasting, setIsBroadcasting] = useState(false);
			const [confirmedSafety, setConfirmedSafety] = useState(false);
			const [toast, setToast] = useState({
				message: "",
				type: "success"
			});
			const [copiedId, setCopiedId] = useState(null);
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const showToast = (message, type = "success") => {
				const isErr = type === "error" || /failed|error|denied|invalid/i.test(message);
				setToast({
					message,
					type: isErr ? "error" : "success"
				});
			};
			useEffect(() => {
				if (!toast.message) return;
				const timer = setTimeout(() => setToast({
					message: "",
					type: "success"
				}), 4e3);
				return () => clearTimeout(timer);
			}, [toast]);
			const fetchStats = useCallback(async () => {
				try {
					setStatsLoading(true);
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/newsletter/stats`);
					if (res.ok) {
						const data = await res.json();
						setStats(data);
					}
				} catch (err) {
					console.error(err);
				} finally {
					setStatsLoading(false);
				}
			}, [apiUrl]);
			const fetchSubscribers = useCallback(async () => {
				try {
					setSubscribersLoading(true);
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/newsletter/subscribers`);
					if (res.ok) {
						const data = await res.json();
						setSubscribers(data || []);
					}
				} catch (err) {
					console.error(err);
					showToast("Failed to load subscribers.", "error");
				} finally {
					setSubscribersLoading(false);
				}
			}, [apiUrl]);
			const fetchHistory = useCallback(async () => {
				try {
					setHistoryLoading(true);
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/newsletter/history`);
					if (res.ok) {
						const data = await res.json();
						setHistory(data || []);
					}
				} catch (err) {
					console.error(err);
					showToast("Failed to load campaign history.", "error");
				} finally {
					setHistoryLoading(false);
				}
			}, [apiUrl]);
			useEffect(() => {
				fetchStats();
			}, [fetchStats]);
			useEffect(() => {
				if (activeTab === "subscribers") {
					fetchSubscribers();
				} else if (activeTab === "history") {
					fetchHistory();
				}
			}, [
				activeTab,
				fetchSubscribers,
				fetchHistory
			]);
			const handleInsertTag = (tag) => {
				setForm((prev) => ({
					...prev,
					bodyHtml: prev.bodyHtml + tag
				}));
			};
			const handleSendTest = async (e) => {
				e?.preventDefault();
				if (!testEmailInput.trim()) {
					showToast("Please enter a valid recipient email address.", "error");
					return;
				}
				if (!form.subject.trim()) {
					showToast("Please specify an email subject.", "error");
					return;
				}
				if (!form.bodyHtml.trim()) {
					showToast("Please enter email body content.", "error");
					return;
				}
				setIsSendingTest(true);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/newsletter/send-test`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							toEmail: testEmailInput.trim(),
							subject: form.subject,
							preheader: form.preheader,
							badge: form.badge,
							heading: form.heading,
							bodyHtml: form.bodyHtml,
							buttonText: form.buttonText,
							buttonUrl: form.buttonUrl,
							senderName: form.senderName
						})
					});
					if (res.ok) {
						const data = await res.json();
						showToast(data.message || "Test email sent successfully!");
						setIsTestModalOpen(false);
					} else {
						const err = await res.json().catch(() => ({}));
						showToast(err.message || "Failed to send test email.", "error");
					}
				} catch (err) {
					showToast("Network error while sending test email.", "error");
				} finally {
					setIsSendingTest(false);
				}
			};
			const handleBroadcast = async () => {
				if (!confirmedSafety) {
					showToast("Please confirm before broadcasting to all subscribers.", "error");
					return;
				}
				setIsBroadcasting(true);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/newsletter/broadcast`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							subject: form.subject,
							preheader: form.preheader,
							badge: form.badge,
							heading: form.heading,
							bodyHtml: form.bodyHtml,
							buttonText: form.buttonText,
							buttonUrl: form.buttonUrl,
							senderName: form.senderName
						})
					});
					if (res.ok) {
						const data = await res.json();
						showToast(data.message || "Broadcast completed successfully!");
						setIsBroadcastModalOpen(false);
						setConfirmedSafety(false);
						fetchStats();
						if (activeTab === "history") fetchHistory();
					} else {
						const err = await res.json().catch(() => ({}));
						showToast(err.message || "Failed to broadcast newsletter.", "error");
					}
				} catch (err) {
					showToast("Network error while broadcasting newsletter.", "error");
				} finally {
					setIsBroadcasting(false);
				}
			};
			const handleDeleteHistory = async () => {
				if (!itemToDelete) return;
				setIsDeleting(true);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/newsletter/history/${itemToDelete.id}`, { method: "DELETE" });
					if (res.ok) {
						setHistory((prev) => prev.filter((item) => item.id !== itemToDelete.id));
						showToast("Campaign record deleted successfully.");
						setItemToDelete(null);
						fetchStats();
					} else {
						const err = await res.json().catch(() => ({}));
						showToast(err.message || "Failed to delete record.", "error");
					}
				} catch (err) {
					showToast("Network error while deleting record.", "error");
				} finally {
					setIsDeleting(false);
				}
			};
			const handleLoadIntoComposer = (item) => {
				setForm({
					subject: item.subject || "",
					preheader: item.preheader || "",
					badge: item.badge || "",
					heading: item.heading || "",
					bodyHtml: item.plainText || item.contentHtml || "",
					buttonText: item.buttonText || "",
					buttonUrl: item.buttonUrl || "",
					senderName: item.senderName || "Süfrano"
				});
				setActiveTab("compose");
				showToast("Campaign loaded into composer.");
			};
			const handleCopy = (text, id) => {
				navigator.clipboard.writeText(text);
				setCopiedId(id);
				setTimeout(() => setCopiedId(null), 2e3);
			};
			const filteredSubscribers = useMemo(() => {
				return subscribers.filter((sub) => {
					const q = subscribersSearch.toLowerCase().trim();
					const matchQuery = !q || sub.name && sub.name.toLowerCase().includes(q) || sub.email && sub.email.toLowerCase().includes(q);
					if (!matchQuery) return false;
					if (subscribersFilter === "active") return sub.isActive;
					if (subscribersFilter === "subscribed") return sub.subscribe;
					if (subscribersFilter === "unsubscribed") return !sub.subscribe;
					return true;
				});
			}, [
				subscribers,
				subscribersSearch,
				subscribersFilter
			]);
			const replaceTags = useCallback((text) => {
				if (!text) return "";
				const safeRecipientName = user?.name || user?.Name || "Alex Rivers";
				const safeRecipientEmail = user?.email || user?.Email || "member@sufrano.com";
				const year = new Date().getFullYear().toString();
				return text.replace(/\{name\}/gi, safeRecipientName).replace(/\{email\}/gi, safeRecipientEmail).replace(/\{year\}/gi, year);
			}, [user]);
			const previewHtml = useMemo(() => {
				let body = form.bodyHtml || "<p style=\"color:rgba(255,255,255,0.4);\">No content entered yet...</p>";
				return replaceTags(body);
			}, [form.bodyHtml, replaceTags]);
			return /* @__PURE__ */ __h(AdminLayout, null, /* @__PURE__ */ __h("div", { className: "admin-newsletter" }, /* @__PURE__ */ __h(AnimatePresence, null, toast.message && /* @__PURE__ */ __h(motion.div, {
				className: `admin-newsletter__toast ${toast.type === "error" ? "admin-newsletter__toast--error" : ""}`,
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
				transition: { duration: .25 }
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
			}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" })), /* @__PURE__ */ __h("span", null, toast.message))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__header" }, /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h1", { className: "admin-newsletter__title" }, "Newsletter"), /* @__PURE__ */ __h("p", { className: "admin-newsletter__subtitle" }, "Compose, preview, and broadcast emails to active Süfrano Club subscribers.")), /* @__PURE__ */ __h("div", { className: "admin-newsletter__header-actions" }, activeTab !== "compose" && /* @__PURE__ */ __h("button", {
				className: "admin-newsletter__btn-primary",
				onClick: () => setActiveTab("compose")
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
			})), "New Campaign"))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__stats" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__stat-card" }, /* @__PURE__ */ __h("div", {
				className: "admin-newsletter__stat-icon",
				style: { "--accent": "#38bdf8" }
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ __h("circle", {
				cx: "9",
				cy: "7",
				r: "4"
			}), /* @__PURE__ */ __h("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }), /* @__PURE__ */ __h("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-value" }, statsLoading ? /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "admin-newsletter__loader-mini"
			}) : stats.totalSubscribers.toLocaleString()), /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-label" }, "Active Subscribers"), /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-sub" }, "Users with newsletter active"))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__stat-card" }, /* @__PURE__ */ __h("div", {
				className: "admin-newsletter__stat-icon",
				style: { "--accent": "#d4b475" }
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-value" }, statsLoading ? /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "admin-newsletter__loader-mini"
			}) : stats.totalCampaigns.toLocaleString()), /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-label" }, "Total Broadcasts"), /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-sub" }, "Campaigns sent"))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__stat-card" }, /* @__PURE__ */ __h("div", {
				className: "admin-newsletter__stat-icon",
				style: { "--accent": "#34d399" }
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" }))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-value" }, statsLoading ? /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "admin-newsletter__loader-mini"
			}) : stats.totalDelivered.toLocaleString()), /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-label" }, "Delivered Emails"), /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-sub" }, "Recipients reached"))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__stat-card" }, /* @__PURE__ */ __h("div", {
				className: "admin-newsletter__stat-icon",
				style: { "--accent": "#c084fc" }
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 16 14" }))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__stat-body" }, /* @__PURE__ */ __h("span", {
				className: "admin-newsletter__stat-value",
				style: { fontSize: stats.lastBroadcast ? "1.15rem" : "1.35rem" }
			}, statsLoading ? /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "admin-newsletter__loader-mini"
			}) : stats.lastBroadcast ? formatRelativeTime(stats.lastBroadcast) : "None"), /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-label" }, "Last Broadcast"), /* @__PURE__ */ __h("span", { className: "admin-newsletter__stat-sub" }, stats.lastBroadcast ? formatDate(stats.lastBroadcast) : "Ready to send")))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__controls" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__tabs" }, /* @__PURE__ */ __h("button", {
				className: `admin-newsletter__tab ${activeTab === "compose" ? "active" : ""}`,
				onClick: () => setActiveTab("compose")
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("line", {
				x1: "22",
				y1: "2",
				x2: "11",
				y2: "13"
			}), /* @__PURE__ */ __h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })), "Compose & Broadcast"), /* @__PURE__ */ __h("button", {
				className: `admin-newsletter__tab ${activeTab === "subscribers" ? "active" : ""}`,
				onClick: () => setActiveTab("subscribers")
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ __h("circle", {
				cx: "9",
				cy: "7",
				r: "4"
			}), /* @__PURE__ */ __h("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), /* @__PURE__ */ __h("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })), "Subscribers (", stats.totalSubscribers, ")"), /* @__PURE__ */ __h("button", {
				className: `admin-newsletter__tab ${activeTab === "history" ? "active" : ""}`,
				onClick: () => setActiveTab("history")
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 16 14" })), "Broadcast History (", stats.totalCampaigns, ")"))), activeTab === "compose" && /* @__PURE__ */ __h("div", { className: "admin-newsletter__compose-grid" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__panel" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__panel-title" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })), "Email Details"), /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-group" }, /* @__PURE__ */ __h("label", null, "Subject Line ", /* @__PURE__ */ __h("span", { className: "req" }, "*")), /* @__PURE__ */ __h("input", {
				type: "text",
				value: form.subject,
				onChange: (e) => setForm({
					...form,
					subject: e.target.value
				}),
				placeholder: "e.g. 🎁 Exclusive 20% Discount for Süfrano Members"
			})), /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-row" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-group" }, /* @__PURE__ */ __h("label", null, "Preheader Snippet"), /* @__PURE__ */ __h("input", {
				type: "text",
				value: form.preheader,
				onChange: (e) => setForm({
					...form,
					preheader: e.target.value
				}),
				placeholder: "Short preview in email list"
			})), /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-group" }, /* @__PURE__ */ __h("label", null, "Sender Name"), /* @__PURE__ */ __h("input", {
				type: "text",
				value: form.senderName,
				onChange: (e) => setForm({
					...form,
					senderName: e.target.value
				}),
				placeholder: "e.g. Süfrano"
			}))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-row" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-group" }, /* @__PURE__ */ __h("label", null, "Header Badge Tag"), /* @__PURE__ */ __h("input", {
				type: "text",
				value: form.badge,
				onChange: (e) => setForm({
					...form,
					badge: e.target.value
				}),
				placeholder: "e.g. SPECIAL OFFER, NEW ARRIVAL"
			})), /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-group" }, /* @__PURE__ */ __h("label", null, "Inner Title Heading"), /* @__PURE__ */ __h("input", {
				type: "text",
				value: form.heading,
				onChange: (e) => setForm({
					...form,
					heading: e.target.value
				}),
				placeholder: "e.g. A Special Treat For You, {name}!"
			}))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-group" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__tags-header" }, /* @__PURE__ */ __h("label", null, "Message Body (HTML Supported) ", /* @__PURE__ */ __h("span", { className: "req" }, "*")), /* @__PURE__ */ __h("div", { className: "admin-newsletter__tags-list" }, /* @__PURE__ */ __h("span", { className: "tags-label" }, "Tags:"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "tag-pill",
				onClick: () => handleInsertTag("{name}")
			}, "+", "{name}"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "tag-pill",
				onClick: () => handleInsertTag("{email}")
			}, "+", "{email}"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "tag-pill",
				onClick: () => handleInsertTag("{year}")
			}, "+", "{year}"))), /* @__PURE__ */ __h("textarea", {
				rows: 9,
				value: form.bodyHtml,
				onChange: (e) => setForm({
					...form,
					bodyHtml: e.target.value
				}),
				placeholder: "Enter HTML or plain formatted text for the email body..."
			})), /* @__PURE__ */ __h("div", { className: "admin-newsletter__cta-fieldset" }, /* @__PURE__ */ __h("div", { className: "cta-title" }, "Call-To-Action Button (Optional)"), /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-row" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-group" }, /* @__PURE__ */ __h("label", null, "Button Text"), /* @__PURE__ */ __h("input", {
				type: "text",
				value: form.buttonText,
				onChange: (e) => setForm({
					...form,
					buttonText: e.target.value
				}),
				placeholder: "e.g. Order Online Now"
			})), /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-group" }, /* @__PURE__ */ __h("label", null, "Target URL"), /* @__PURE__ */ __h("input", {
				type: "text",
				value: form.buttonUrl,
				onChange: (e) => setForm({
					...form,
					buttonUrl: e.target.value
				}),
				placeholder: `e.g. ${baseUrl ? `${baseUrl}/catalog` : "https://sufrano.onrender.com/catalog"}`
			})))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-bottom" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-newsletter__btn-secondary",
				onClick: () => {
					setTestEmailInput(user?.email || user?.Email || "");
					setIsTestModalOpen(true);
				}
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ __h("polyline", { points: "22,6 12,13 2,6" })), "Send Test Preview"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-newsletter__btn-primary",
				onClick: () => {
					if (!form.subject.trim()) {
						showToast("Please enter an email subject line.", "error");
						return;
					}
					if (!form.bodyHtml.trim()) {
						showToast("Please enter message body content.", "error");
						return;
					}
					setConfirmedSafety(false);
					setIsBroadcastModalOpen(true);
				}
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("line", {
				x1: "22",
				y1: "2",
				x2: "11",
				y2: "13"
			}), /* @__PURE__ */ __h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })), "Broadcast to ", stats.totalSubscribers, " Subscribers"))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__preview-panel" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__preview-top" }, /* @__PURE__ */ __h("div", { className: "preview-heading" }, /* @__PURE__ */ __h("span", { className: "live-indicator" }), "Live Email Simulator"), /* @__PURE__ */ __h("div", { className: "preview-toggle" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: `toggle-btn ${previewDevice === "desktop" ? "active" : ""}`,
				onClick: () => setPreviewDevice("desktop")
			}, "Desktop"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: `toggle-btn ${previewDevice === "mobile" ? "active" : ""}`,
				onClick: () => setPreviewDevice("mobile")
			}, "Mobile"))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__meta-box" }, /* @__PURE__ */ __h("div", { className: "meta-line" }, /* @__PURE__ */ __h("span", { className: "meta-lbl" }, "Subject:"), /* @__PURE__ */ __h("span", { className: "meta-txt subject" }, replaceTags(form.subject) || "(No subject)")), form.preheader && /* @__PURE__ */ __h("div", { className: "meta-line" }, /* @__PURE__ */ __h("span", { className: "meta-lbl" }, "Snippet:"), /* @__PURE__ */ __h("span", { className: "meta-txt snippet" }, replaceTags(form.preheader))), /* @__PURE__ */ __h("div", { className: "meta-line" }, /* @__PURE__ */ __h("span", { className: "meta-lbl" }, "From:"), /* @__PURE__ */ __h("span", { className: "meta-txt" }, form.senderName || "Süfrano", " <myrednest@gmail.com>"))), /* @__PURE__ */ __h("div", { className: `admin-newsletter__frame admin-newsletter__frame--${previewDevice}` }, /* @__PURE__ */ __h("div", { className: "email-canvas" }, /* @__PURE__ */ __h("div", { className: "email-header-art" }, /* @__PURE__ */ __h("h1", { className: "email-logo" }, "SÜFRANO"), /* @__PURE__ */ __h("div", { className: "email-sublogo" }, "Exclusive Member Newsletter")), /* @__PURE__ */ __h("div", { className: "email-body-area" }, form.badge && /* @__PURE__ */ __h("div", { className: "email-badge-pill" }, replaceTags(form.badge)), form.heading && /* @__PURE__ */ __h("h2", { className: "email-title" }, replaceTags(form.heading)), /* @__PURE__ */ __h("div", {
				className: "email-content-rendered",
				dangerouslySetInnerHTML: { __html: previewHtml }
			}), form.buttonText && /* @__PURE__ */ __h("div", { className: "email-btn-wrap" }, /* @__PURE__ */ __h("a", {
				href: replaceTags(form.buttonUrl) || "#",
				onClick: (e) => e.preventDefault(),
				className: "email-btn"
			}, replaceTags(form.buttonText)))), /* @__PURE__ */ __h("div", { className: "email-foot-area" }, /* @__PURE__ */ __h("p", null, "You are receiving this email because you subscribed to Süfrano Club updates."), /* @__PURE__ */ __h("p", null, "© ", new Date().getFullYear(), " Süfrano. All rights reserved.")))))), activeTab === "subscribers" && /* @__PURE__ */ __h("div", { className: "admin-newsletter__subscribers-wrapper" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__sub-filter-bar" }, /* @__PURE__ */ __h("div", { className: "admin-newsletter__search-box" }, /* @__PURE__ */ __h("svg", {
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
				type: "text",
				placeholder: "Search subscribers by name or email...",
				value: subscribersSearch,
				onChange: (e) => setSubscribersSearch(e.target.value)
			}), subscribersSearch && /* @__PURE__ */ __h("button", {
				className: "search-clear",
				onClick: () => setSubscribersSearch("")
			}, "×")), /* @__PURE__ */ __h("div", { className: "admin-newsletter__select-box" }, /* @__PURE__ */ __h("select", {
				value: subscribersFilter,
				onChange: (e) => setSubscribersFilter(e.target.value)
			}, /* @__PURE__ */ __h("option", { value: "all" }, "All Subscribers"), /* @__PURE__ */ __h("option", { value: "subscribed" }, "Subscribed Only"), /* @__PURE__ */ __h("option", { value: "unsubscribed" }, "Unsubscribed"), /* @__PURE__ */ __h("option", { value: "active" }, "Active Accounts")))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__table-card" }, subscribersLoading ? /* @__PURE__ */ __h("div", { className: "admin-newsletter__empty-box" }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Loading...",
				className: "admin-newsletter__loader-large"
			}), /* @__PURE__ */ __h("p", null, "Loading subscriber list...")) : filteredSubscribers.length === 0 ? /* @__PURE__ */ __h("div", { className: "admin-newsletter__empty-box" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}, /* @__PURE__ */ __h("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ __h("circle", {
				cx: "9",
				cy: "7",
				r: "4"
			}), /* @__PURE__ */ __h("line", {
				x1: "18",
				y1: "8",
				x2: "23",
				y2: "13"
			}), /* @__PURE__ */ __h("line", {
				x1: "23",
				y1: "8",
				x2: "18",
				y2: "13"
			})), /* @__PURE__ */ __h("h3", null, "No subscribers found"), /* @__PURE__ */ __h("p", null, "No user accounts match your current filter or search query.")) : /* @__PURE__ */ __h("div", { className: "table-responsive" }, /* @__PURE__ */ __h("table", { className: "admin-table" }, /* @__PURE__ */ __h("thead", null, /* @__PURE__ */ __h("tr", null, /* @__PURE__ */ __h("th", null, "Subscriber"), /* @__PURE__ */ __h("th", null, "Role"), /* @__PURE__ */ __h("th", { style: { textAlign: "right" } }, "Status"))), /* @__PURE__ */ __h("tbody", null, filteredSubscribers.map((sub, idx) => /* @__PURE__ */ __h(motion.tr, {
				key: sub.id,
				variants: fadeUp,
				initial: "hidden",
				animate: "show",
				custom: idx
			}, /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "user-cell" }, /* @__PURE__ */ __h("div", { className: "user-details" }, /* @__PURE__ */ __h("span", { className: "name" }, sub.name || "Anonymous User"), /* @__PURE__ */ __h("span", { className: "email" }, sub.email), /* @__PURE__ */ __h("button", {
				className: "copy-btn",
				onClick: () => handleCopy(sub.id, sub.id),
				title: "Copy User ID"
			}, /* @__PURE__ */ __h("code", null, sub.id.slice(0, 8), "..."), copiedId === sub.id ? /* @__PURE__ */ __h("span", { className: "copied-text" }, "Copied!") : /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("rect", {
				x: "9",
				y: "9",
				width: "13",
				height: "13",
				rx: "2",
				ry: "2"
			}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })))))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("span", { className: "badge badge--muted" }, sub.role || "Customer")), /* @__PURE__ */ __h("td", { style: { textAlign: "right" } }, /* @__PURE__ */ __h("span", { className: `badge ${sub.subscribe ? "badge--success" : "badge--muted"}` }, sub.subscribe ? "Subscribed" : "Unsubscribed"))))))))), activeTab === "history" && /* @__PURE__ */ __h("div", { className: "admin-newsletter__history-wrapper" }, historyLoading ? /* @__PURE__ */ __h("div", { className: "admin-newsletter__empty-box" }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Loading...",
				className: "admin-newsletter__loader-large"
			}), /* @__PURE__ */ __h("p", null, "Loading campaign history...")) : history.length === 0 ? /* @__PURE__ */ __h("div", { className: "admin-newsletter__empty-box" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}, /* @__PURE__ */ __h("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" })), /* @__PURE__ */ __h("h3", null, "No broadcasts yet"), /* @__PURE__ */ __h("p", null, "You haven't sent any email newsletters yet. Compose your first campaign to get started."), /* @__PURE__ */ __h("button", {
				className: "admin-newsletter__btn-primary",
				onClick: () => setActiveTab("compose"),
				style: { marginTop: "16px" }
			}, "Compose Campaign")) : /* @__PURE__ */ __h("div", { className: "admin-newsletter__history-cards" }, history.map((item, idx) => /* @__PURE__ */ __h(motion.div, {
				key: item.id,
				className: "admin-newsletter__history-item",
				variants: fadeUp,
				initial: "hidden",
				animate: "show",
				custom: idx
			}, /* @__PURE__ */ __h("div", { className: "item-main" }, /* @__PURE__ */ __h("div", { className: "item-meta-top" }, item.badge && /* @__PURE__ */ __h("span", { className: "item-badge" }, item.badge), /* @__PURE__ */ __h("span", { className: `badge ${item.status === "Sent" ? "badge--success" : item.status === "PartiallySent" ? "badge--warning" : "badge--danger"}` }, item.status), /* @__PURE__ */ __h("span", { className: "item-date" }, formatDate(item.createdAt), " (", formatRelativeTime(item.createdAt), ")")), /* @__PURE__ */ __h("h3", { className: "item-subject" }, item.subject), item.preheader && /* @__PURE__ */ __h("p", { className: "item-snippet" }, item.preheader), /* @__PURE__ */ __h("div", { className: "item-pills-bar" }, /* @__PURE__ */ __h("div", { className: "pill" }, /* @__PURE__ */ __h("span", { className: "lbl" }, "Recipients:"), /* @__PURE__ */ __h("span", { className: "val" }, item.recipientCount)), /* @__PURE__ */ __h("div", { className: "pill" }, /* @__PURE__ */ __h("span", { className: "lbl" }, "Delivered:"), /* @__PURE__ */ __h("span", { className: "val success" }, item.successCount)), item.failedCount > 0 && /* @__PURE__ */ __h("div", { className: "pill" }, /* @__PURE__ */ __h("span", { className: "lbl" }, "Failed:"), /* @__PURE__ */ __h("span", { className: "val danger" }, item.failedCount)), /* @__PURE__ */ __h("div", { className: "pill" }, /* @__PURE__ */ __h("span", { className: "lbl" }, "Sent By:"), /* @__PURE__ */ __h("span", { className: "val" }, item.sentByAdminName || "Admin")))), /* @__PURE__ */ __h("div", { className: "item-actions" }, /* @__PURE__ */ __h("button", {
				className: "admin-newsletter__btn-secondary-sm",
				onClick: () => handleLoadIntoComposer(item),
				title: "Load into Composer"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })), "Reuse"), /* @__PURE__ */ __h("button", {
				className: "admin-newsletter__btn-danger-sm",
				onClick: () => setItemToDelete(item),
				title: "Delete Record"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })), "Delete")))))), /* @__PURE__ */ __h(AnimatePresence, null, isTestModalOpen && /* @__PURE__ */ __h("div", {
				className: "admin-newsletter__modal-overlay",
				onClick: () => setIsTestModalOpen(false)
			}, /* @__PURE__ */ __h(motion.div, {
				className: "admin-newsletter__modal",
				initial: {
					opacity: 0,
					scale: .95
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: {
					opacity: 0,
					scale: .95
				},
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "admin-newsletter__modal-header" }, /* @__PURE__ */ __h("h3", { className: "admin-newsletter__modal-title" }, "Send Test Preview"), /* @__PURE__ */ __h("button", {
				className: "admin-newsletter__modal-close",
				onClick: () => setIsTestModalOpen(false)
			}, "×")), /* @__PURE__ */ __h("form", {
				onSubmit: handleSendTest,
				className: "admin-newsletter__modal-body"
			}, /* @__PURE__ */ __h("p", { className: "modal-description" }, "Send a real rendered test email to your inbox to inspect visual styling, typography, and buttons before broadcasting."), /* @__PURE__ */ __h("div", { className: "admin-newsletter__form-group" }, /* @__PURE__ */ __h("label", null, "Recipient Test Email"), /* @__PURE__ */ __h("input", {
				type: "email",
				required: true,
				value: testEmailInput,
				onChange: (e) => setTestEmailInput(e.target.value),
				placeholder: "e.g. your-email@example.com"
			})), /* @__PURE__ */ __h("div", { className: "admin-newsletter__modal-footer" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-newsletter__btn-secondary",
				onClick: () => setIsTestModalOpen(false),
				disabled: isSendingTest
			}, "Cancel"), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "admin-newsletter__btn-primary",
				disabled: isSendingTest
			}, isSendingTest ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Sending...",
				className: "admin-newsletter__loader-mini"
			}), "Sending...") : "Send Test Email")))))), /* @__PURE__ */ __h(AnimatePresence, null, isBroadcastModalOpen && /* @__PURE__ */ __h("div", {
				className: "admin-newsletter__modal-overlay",
				onClick: () => !isBroadcasting && setIsBroadcastModalOpen(false)
			}, /* @__PURE__ */ __h(motion.div, {
				className: "admin-newsletter__modal admin-newsletter__modal--danger",
				initial: {
					opacity: 0,
					scale: .95
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: {
					opacity: 0,
					scale: .95
				},
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "admin-newsletter__modal-header" }, /* @__PURE__ */ __h("h3", { className: "admin-newsletter__modal-title danger-title" }, /* @__PURE__ */ __h("svg", {
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
			})), "Confirm Broadcast"), !isBroadcasting && /* @__PURE__ */ __h("button", {
				className: "admin-newsletter__modal-close",
				onClick: () => setIsBroadcastModalOpen(false)
			}, "×")), /* @__PURE__ */ __h("div", { className: "admin-newsletter__modal-body" }, /* @__PURE__ */ __h("p", { className: "modal-description" }, "You are about to broadcast this email newsletter to all ", /* @__PURE__ */ __h("strong", null, stats.totalSubscribers, " active members"), "."), /* @__PURE__ */ __h("div", { className: "admin-newsletter__summary-card" }, /* @__PURE__ */ __h("div", { className: "summary-row" }, /* @__PURE__ */ __h("span", null, "Subject:"), /* @__PURE__ */ __h("strong", null, form.subject)), /* @__PURE__ */ __h("div", { className: "summary-row" }, /* @__PURE__ */ __h("span", null, "Subscribers:"), /* @__PURE__ */ __h("strong", null, stats.totalSubscribers, " members")), /* @__PURE__ */ __h("div", { className: "summary-row" }, /* @__PURE__ */ __h("span", null, "Sender:"), /* @__PURE__ */ __h("strong", null, form.senderName || "Süfrano", " <myrednest@gmail.com>"))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__safety-card" }, /* @__PURE__ */ __h("label", { className: "checkbox-label" }, /* @__PURE__ */ __h("input", {
				type: "checkbox",
				checked: confirmedSafety,
				onChange: (e) => setConfirmedSafety(e.target.checked),
				disabled: isBroadcasting
			}), /* @__PURE__ */ __h("span", null, "I understand that this action will immediately send emails to all subscribed users and cannot be undone."))), /* @__PURE__ */ __h("div", { className: "admin-newsletter__modal-footer" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-newsletter__btn-secondary",
				onClick: () => setIsBroadcastModalOpen(false),
				disabled: isBroadcasting
			}, "Cancel"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-newsletter__btn-danger",
				onClick: handleBroadcast,
				disabled: !confirmedSafety || isBroadcasting
			}, isBroadcasting ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Sending...",
				className: "admin-newsletter__loader-mini"
			}), "Broadcasting to ", stats.totalSubscribers, " Members...") : "Yes, Send Broadcast Now")))))), /* @__PURE__ */ __h(AnimatePresence, null, itemToDelete && /* @__PURE__ */ __h("div", {
				className: "admin-newsletter__modal-overlay",
				onClick: () => !isDeleting && setItemToDelete(null)
			}, /* @__PURE__ */ __h(motion.div, {
				className: "admin-newsletter__modal",
				initial: {
					opacity: 0,
					scale: .95
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: {
					opacity: 0,
					scale: .95
				},
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "admin-newsletter__modal-header" }, /* @__PURE__ */ __h("h3", { className: "admin-newsletter__modal-title" }, "Delete Broadcast Record"), /* @__PURE__ */ __h("button", {
				className: "admin-newsletter__modal-close",
				onClick: () => setItemToDelete(null)
			}, "×")), /* @__PURE__ */ __h("div", { className: "admin-newsletter__modal-body" }, /* @__PURE__ */ __h("p", { className: "modal-description" }, "Are you sure you want to delete the broadcast log for \"", /* @__PURE__ */ __h("strong", null, itemToDelete.subject), "\"? This log entry will be permanently removed."), /* @__PURE__ */ __h("div", { className: "admin-newsletter__modal-footer" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-newsletter__btn-secondary",
				onClick: () => setItemToDelete(null),
				disabled: isDeleting
			}, "Cancel"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-newsletter__btn-danger",
				onClick: handleDeleteHistory,
				disabled: isDeleting
			}, isDeleting ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Deleting...",
				className: "admin-newsletter__loader-mini"
			}), "Deleting...") : "Delete Record"))))))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Newsletter; } });
	});
	//#endregion

	var entryExports = __require("components/AdminPages/Newsletter/Newsletter.js");
	__pages["admin-newsletter"] = entryExports.default || entryExports;
})();
