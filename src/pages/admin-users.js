(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/AdminPages/Users/Users.js
	__define("components/AdminPages/Users/Users.js", function (exports, __require, module) {
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
		const __imp_2 = __require("components/Elements/AdminTableActions.js");
		const AdminTableActions = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const PAGE_SIZE = 10;
		const formatCurrency = (val) => {
			const num = typeof val === "number" ? val : parseFloat(val) || 0;
			return `${num.toFixed(2)} ₼`;
		};
		const formatDate = (dateStr) => {
			if (!dateStr) return "—";
			try {
				const d = new Date(dateStr);
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
		const getInitials = (name, email) => {
			if (name && name.trim()) {
				const parts = name.trim().split(/\s+/);
				if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
				return name.slice(0, 2).toUpperCase();
			}
			if (email && email.trim()) {
				return email.slice(0, 2).toUpperCase();
			}
			return "U";
		};
		const ALL_ROLES = [
			"Customer",
			"Bot",
			"AI",
			"Staff",
			"Lead Staff",
			"Support",
			"Moderator",
			"Admin",
			"Super Admin"
		];
		const ASSIGNABLE_ROLES = [
			"Customer",
			"Staff",
			"Lead Staff",
			"Support",
			"Moderator",
			"Admin",
			"Super Admin"
		];
		const ROLE_LEVELS = {
			Customer: 0,
			Bot: 0,
			AI: 0,
			Staff: 1,
			"Lead Staff": 2,
			LeadStaff: 2,
			Support: 3,
			Moderator: 4,
			Admin: 5,
			"Super Admin": 6,
			SuperAdmin: 6
		};
		const getRoleLevel = (role) => {
			return ROLE_LEVELS[role] ?? 0;
		};
		const getRoleBadgeClass = (role) => {
			switch (role) {
				case "Super Admin":
				case "SuperAdmin": return "badge--danger";
				case "Admin": return "badge--primary";
				case "Moderator": return "badge--warning";
				case "Support": return "badge--info";
				case "Lead Staff":
				case "LeadStaff": return "badge--cyan";
				case "Staff": return "badge--teal";
				case "Bot":
				case "AI": return "badge--purple";
				case "Customer":
				default: return "badge--muted";
			}
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
					delay: i * .05,
					duration: .4,
					ease: [
						.16,
						1,
						.3,
						1
					]
				}
			})
		};
		const Users = () => {
			const { user: currentUser } = useAuth();
			const [users, setUsers] = useState([]);
			const [loading, setLoading] = useState(true);
			const [error, setError] = useState("");
			const [toast, setToast] = useState({
				message: "",
				type: "success"
			});
			const [searchInput, setSearchInput] = useState("");
			const [statusFilter, setStatusFilter] = useState("all");
			const [sortBy, setSortBy] = useState("lastActive");
			const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
			const [selectedUserId, setSelectedUserId] = useState(null);
			const [userDetails, setUserDetails] = useState(null);
			const [loadingDetails, setLoadingDetails] = useState(false);
			const [detailsTab, setDetailsTab] = useState("overview");
			const [editingUser, setEditingUser] = useState(null);
			const [editForm, setEditForm] = useState({
				name: "",
				email: "",
				balance: 0,
				role: "Customer",
				isActive: true,
				twoFactorEnabled: false,
				subscribe: false
			});
			const [isSavingUser, setIsSavingUser] = useState(false);
			const [copiedId, setCopiedId] = useState(null);
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
			const fetchUsers = useCallback(async () => {
				setLoading(true);
				setError("");
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/users`);
					if (res.ok) {
						const data = await res.json();
						setUsers(Array.isArray(data) ? data : []);
					} else {
						setError("Failed to load users list.");
					}
				} catch {
					setError("Connection error while fetching users.");
				} finally {
					setLoading(false);
				}
			}, [apiUrl]);
			useEffect(() => {
				fetchUsers();
			}, [fetchUsers]);
			const loadUserDetails = async (userId) => {
				setSelectedUserId(userId);
				setDetailsTab("overview");
				setLoadingDetails(true);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/users/${userId}`);
					if (res.ok) {
						const data = await res.json();
						setUserDetails(data);
					} else {
						showToast("Failed to load detailed profile.");
					}
				} catch {
					showToast("Error loading user profile.");
				} finally {
					setLoadingDetails(false);
				}
			};
			const openEditModal = (user) => {
				setEditingUser(user);
				const is2Fa = user.twoFactorEnabled !== undefined ? user.twoFactorEnabled : user.session?.twoFactorEnabled ?? false;
				const isSub = user.subscribe !== undefined ? user.subscribe : user.session?.subscribe ?? false;
				const isActive = user.isActive !== undefined ? user.isActive : user.session?.isActive !== false;
				setEditForm({
					name: user.name || "",
					email: user.email || "",
					balance: user.balance || 0,
					role: user.role || "Customer",
					isActive: isActive !== false,
					twoFactorEnabled: !!is2Fa,
					subscribe: !!isSub
				});
			};
			const isEditingSelf = Boolean(currentUser && editingUser && (currentUser.id && String(currentUser.id).toLowerCase() === String(editingUser.id).toLowerCase() || currentUser.Id && String(currentUser.Id).toLowerCase() === String(editingUser.id).toLowerCase() || currentUser.email && editingUser.email && currentUser.email.toLowerCase() === editingUser.email.toLowerCase()));
			const currentUserRole = currentUser?.role || currentUser?.Role || "Customer";
			const currentUserLevel = getRoleLevel(currentUserRole);
			const targetUserRole = editingUser?.role || "Customer";
			const targetUserLevel = getRoleLevel(targetUserRole);
			const isSuperAdmin = currentUserLevel >= 5 || currentUserRole === "Super Admin" || currentUserRole === "SuperAdmin";
			const isTargetSystemRole = targetUserRole === "Bot" || targetUserRole === "AI";
			const isTargetEqualOrHigherRole = !isEditingSelf && targetUserLevel >= currentUserLevel;
			const allowedRolesToAssign = ASSIGNABLE_ROLES.filter((r) => getRoleLevel(r) < currentUserLevel);
			let isRoleDisabled = false;
			let roleHelperText = "";
			if (isEditingSelf) {
				isRoleDisabled = true;
				roleHelperText = "You cannot change your own role.";
			} else if (isTargetEqualOrHigherRole) {
				isRoleDisabled = true;
				roleHelperText = `You cannot modify the role of a user with an equal or higher role (${targetUserRole}).`;
			} else if (isTargetSystemRole) {
				isRoleDisabled = true;
				roleHelperText = "System roles (Bot and AI) can only be modified directly in the database.";
			} else if (allowedRolesToAssign.length === 0) {
				isRoleDisabled = true;
				roleHelperText = "You do not have permission to assign roles.";
			} else {
				roleHelperText = `You can only assign roles lower than your role (${currentUserRole}).`;
			}
			const handleSaveUser = async (e) => {
				e.preventDefault();
				if (!editingUser) return;
				if (isTargetEqualOrHigherRole) {
					showToast(`You cannot modify data of a user with an equal or higher role (${editingUser.role}).`, "error");
					return;
				}
				if (isEditingSelf && editForm.isActive === false) {
					showToast("You cannot deactivate or block your own account.", "error");
					return;
				}
				if (editForm.role !== editingUser.role) {
					if (isTargetSystemRole || editForm.role === "Bot" || editForm.role === "AI") {
						showToast("System roles (Bot and AI) can only be modified directly in the database.", "error");
						return;
					}
					const newRoleLevel = getRoleLevel(editForm.role);
					if (isEditingSelf) {
						showToast("You cannot change your own role.", "error");
						return;
					}
					if (targetUserLevel >= currentUserLevel) {
						showToast("You cannot modify the role of a user with an equal or higher role than yours.", "error");
						return;
					}
					if (newRoleLevel >= currentUserLevel) {
						showToast(`You cannot assign your own role (${currentUserRole}) or a higher role.`, "error");
						return;
					}
				}
				setIsSavingUser(true);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/users/${editingUser.id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							name: editForm.name,
							email: editForm.email,
							balance: parseFloat(editForm.balance) || 0,
							role: editForm.role,
							isActive: editForm.isActive,
							twoFactorEnabled: editForm.twoFactorEnabled,
							subscribe: editForm.subscribe
						})
					});
					const data = await res.json();
					if (res.ok) {
						showToast("User profile updated successfully.");
						setEditingUser(null);
						fetchUsers();
						if (selectedUserId === editingUser.id) {
							loadUserDetails(editingUser.id);
						}
					} else {
						alert(data.message || "Failed to update user.");
					}
				} catch {
					alert("Error updating user.");
				} finally {
					setIsSavingUser(false);
				}
			};
			const copyToClipboard = (text, id) => {
				navigator.clipboard.writeText(text);
				setCopiedId(id);
				setTimeout(() => setCopiedId(null), 2e3);
			};
			const stats = useMemo(() => {
				const total = users.length;
				const active = users.filter((u) => u.isActive !== false).length;
				const blocked = users.filter((u) => u.isActive === false).length;
				const totalBalance = users.reduce((sum, u) => sum + (parseFloat(u.balance) || 0), 0);
				const totalOrders = users.reduce((sum, u) => sum + (u.ordersCount || 0), 0);
				return {
					total,
					active,
					blocked,
					totalBalance,
					totalOrders
				};
			}, [users]);
			const filteredUsers = useMemo(() => {
				let list = [...users];
				if (searchInput.trim()) {
					const q = searchInput.toLowerCase().trim();
					list = list.filter((u) => (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.id || "").toLowerCase().includes(q));
				}
				if (statusFilter === "active") {
					list = list.filter((u) => u.isActive !== false);
				} else if (statusFilter === "blocked") {
					list = list.filter((u) => u.isActive === false);
				}
				list.sort((a, b) => {
					if (sortBy === "lastActive") {
						const timeA = new Date(a.lastActiveAt || a.createdAt || 0).getTime();
						const timeB = new Date(b.lastActiveAt || b.createdAt || 0).getTime();
						return timeB - timeA;
					}
					if (sortBy === "name") {
						return (a.name || a.email || "").localeCompare(b.name || b.email || "");
					}
					if (sortBy === "balance") {
						return (parseFloat(b.balance) || 0) - (parseFloat(a.balance) || 0);
					}
					if (sortBy === "orders") {
						return (b.ordersCount || 0) - (a.ordersCount || 0);
					}
					return 0;
				});
				return list;
			}, [
				users,
				searchInput,
				statusFilter,
				sortBy
			]);
			const visibleUsers = useMemo(() => {
				return filteredUsers.slice(0, visibleCount);
			}, [filteredUsers, visibleCount]);
			const hasMore = visibleCount < filteredUsers.length;
			return /* @__PURE__ */ __h(AdminLayout, null, /* @__PURE__ */ __h("div", { className: "admin-users" }, /* @__PURE__ */ __h(AnimatePresence, null, toast.message && /* @__PURE__ */ __h(motion.div, {
				className: `admin-users__toast ${toast.type === "error" ? "admin-users__toast--error" : ""}`,
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
				className: "admin-users__header",
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
			}, /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h1", { className: "admin-users__title" }, "Users"), /* @__PURE__ */ __h("p", { className: "admin-users__subtitle" }, "Manage registered accounts, view profiles, and edit balances"))), /* @__PURE__ */ __h("div", { className: "admin-users__stats" }, /* @__PURE__ */ __h(motion.div, {
				className: "admin-users__stat-card",
				style: { "--accent": "#c5a059" },
				custom: 0,
				variants: fadeUp,
				initial: "hidden",
				animate: "show"
			}, /* @__PURE__ */ __h("div", { className: "admin-users__stat-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ __h("circle", {
				cx: "9",
				cy: "7",
				r: "4"
			}), /* @__PURE__ */ __h("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), /* @__PURE__ */ __h("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }))), /* @__PURE__ */ __h("div", { className: "admin-users__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-users__stat-value" }, loading ? "..." : stats.total), /* @__PURE__ */ __h("span", { className: "admin-users__stat-label" }, "Total Users"), /* @__PURE__ */ __h("span", { className: "admin-users__stat-sub" }, stats.active, " active"))), /* @__PURE__ */ __h(motion.div, {
				className: "admin-users__stat-card",
				style: { "--accent": "#10b981" },
				custom: 1,
				variants: fadeUp,
				initial: "hidden",
				animate: "show"
			}, /* @__PURE__ */ __h("div", { className: "admin-users__stat-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" }))), /* @__PURE__ */ __h("div", { className: "admin-users__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-users__stat-value" }, loading ? "..." : stats.active), /* @__PURE__ */ __h("span", { className: "admin-users__stat-label" }, "Active Accounts"), /* @__PURE__ */ __h("span", { className: "admin-users__stat-sub" }, "In good standing"))), /* @__PURE__ */ __h(motion.div, {
				className: "admin-users__stat-card",
				style: { "--accent": "#c5a059" },
				custom: 2,
				variants: fadeUp,
				initial: "hidden",
				animate: "show"
			}, /* @__PURE__ */ __h("div", { className: "admin-users__stat-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("line", {
				x1: "4.93",
				y1: "4.93",
				x2: "19.07",
				y2: "19.07"
			}))), /* @__PURE__ */ __h("div", { className: "admin-users__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-users__stat-value" }, loading ? "..." : stats.blocked), /* @__PURE__ */ __h("span", { className: "admin-users__stat-label" }, "Blocked Accounts"), /* @__PURE__ */ __h("span", { className: "admin-users__stat-sub" }, "Suspended access"))), /* @__PURE__ */ __h(motion.div, {
				className: "admin-users__stat-card",
				style: { "--accent": "#c5a059" },
				custom: 3,
				variants: fadeUp,
				initial: "hidden",
				animate: "show"
			}, /* @__PURE__ */ __h("div", { className: "admin-users__stat-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }), /* @__PURE__ */ __h("path", { d: "M12 18V6" }))), /* @__PURE__ */ __h("div", { className: "admin-users__stat-body" }, /* @__PURE__ */ __h("span", { className: "admin-users__stat-value" }, loading ? "..." : formatCurrency(stats.totalBalance)), /* @__PURE__ */ __h("span", { className: "admin-users__stat-label" }, "Total Balance"), /* @__PURE__ */ __h("span", { className: "admin-users__stat-sub" }, stats.totalOrders, " orders placed")))), /* @__PURE__ */ __h("div", { className: "admin-users__controls" }, /* @__PURE__ */ __h("div", { className: "admin-users__search-wrap" }, /* @__PURE__ */ __h("svg", {
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
				id: "admin-users-search",
				type: "text",
				placeholder: "Search by name, email, or user ID...",
				value: searchInput,
				onChange: (e) => setSearchInput(e.target.value)
			}), searchInput && /* @__PURE__ */ __h("button", {
				className: "admin-users__search-clear",
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
			})))), /* @__PURE__ */ __h("div", { className: "admin-users__filters" }, /* @__PURE__ */ __h("div", { className: "admin-users__select-wrap" }, /* @__PURE__ */ __h("select", {
				id: "admin-users-status-filter",
				value: statusFilter,
				onChange: (e) => setStatusFilter(e.target.value)
			}, /* @__PURE__ */ __h("option", { value: "all" }, "All Statuses (", users.length, ")"), /* @__PURE__ */ __h("option", { value: "active" }, "Active Accounts"), /* @__PURE__ */ __h("option", { value: "blocked" }, "Blocked Accounts"))), /* @__PURE__ */ __h("div", { className: "admin-users__select-wrap" }, /* @__PURE__ */ __h("select", {
				id: "admin-users-sort",
				value: sortBy,
				onChange: (e) => setSortBy(e.target.value)
			}, /* @__PURE__ */ __h("option", { value: "lastActive" }, "Latest Active"), /* @__PURE__ */ __h("option", { value: "name" }, "Name / Email (A-Z)"), /* @__PURE__ */ __h("option", { value: "balance" }, "Highest Balance"), /* @__PURE__ */ __h("option", { value: "orders" }, "Most Orders"))))), error && /* @__PURE__ */ __h("div", { className: "admin-users__error-banner" }, /* @__PURE__ */ __h("svg", {
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
			})), /* @__PURE__ */ __h("span", null, error), /* @__PURE__ */ __h("button", { onClick: fetchUsers }, "Try Again")), loading && /* @__PURE__ */ __h("div", { className: "admin-users__loading" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "admin-users__spinner"
			}), /* @__PURE__ */ __h("span", null, "Loading user accounts...")), !loading && filteredUsers.length === 0 && /* @__PURE__ */ __h("div", { className: "admin-users__empty" }, /* @__PURE__ */ __h("div", { className: "admin-users__empty-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}, /* @__PURE__ */ __h("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ __h("circle", {
				cx: "9",
				cy: "7",
				r: "4"
			}), /* @__PURE__ */ __h("line", {
				x1: "19",
				y1: "8",
				x2: "19",
				y2: "14"
			}), /* @__PURE__ */ __h("line", {
				x1: "22",
				y1: "11",
				x2: "16",
				y2: "11"
			}))), /* @__PURE__ */ __h("h3", null, "No users found"), /* @__PURE__ */ __h("p", null, searchInput || statusFilter !== "all" ? "No user accounts match your search filters." : "No users registered yet."), (searchInput || statusFilter !== "all") && /* @__PURE__ */ __h("button", {
				className: "admin-users__btn-secondary",
				onClick: () => {
					setSearchInput("");
					setStatusFilter("all");
				}
			}, "Reset Filters")), !loading && filteredUsers.length > 0 && /* @__PURE__ */ __h("div", { className: "admin-users__table-card" }, /* @__PURE__ */ __h("div", { className: "admin-users__table-responsive" }, /* @__PURE__ */ __h("table", { className: "admin-users__table" }, /* @__PURE__ */ __h("thead", null, /* @__PURE__ */ __h("tr", null, /* @__PURE__ */ __h("th", null, "User"), /* @__PURE__ */ __h("th", null, "Role"), /* @__PURE__ */ __h("th", null, "Status"), /* @__PURE__ */ __h("th", null, "Balance"), /* @__PURE__ */ __h("th", null, "Orders & Spent"), /* @__PURE__ */ __h("th", null, "Last Active"), /* @__PURE__ */ __h("th", { className: "text-right" }, "Actions"))), /* @__PURE__ */ __h("tbody", null, visibleUsers.map((u, i) => /* @__PURE__ */ __h(motion.tr, {
				key: u.id,
				custom: i,
				variants: fadeUp,
				initial: "hidden",
				animate: "show"
			}, /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-users__user-cell" }, /* @__PURE__ */ __h("div", { className: "admin-users__avatar" }, u.profilePictureUrl ? /* @__PURE__ */ __h("img", {
				src: u.profilePictureUrl,
				alt: u.name || u.email
			}) : /* @__PURE__ */ __h("span", null, getInitials(u.name, u.email))), /* @__PURE__ */ __h("div", { className: "admin-users__user-info" }, /* @__PURE__ */ __h("span", { className: "admin-users__user-name" }, u.name || "Unnamed User"), /* @__PURE__ */ __h("span", { className: "admin-users__user-email" }, u.email), /* @__PURE__ */ __h("button", {
				className: "admin-users__copy-id",
				onClick: () => copyToClipboard(u.id, u.id),
				title: "Click to copy User ID"
			}, /* @__PURE__ */ __h("code", null, u.id.slice(0, 8), "..."), copiedId === u.id ? /* @__PURE__ */ __h("span", { className: "copied-tag" }, "Copied!") : /* @__PURE__ */ __h("svg", {
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
			}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })))))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("span", { className: `badge ${getRoleBadgeClass(u.role)}` }, u.role || "Customer")), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-users__badges" }, u.isActive !== false ? /* @__PURE__ */ __h("span", { className: "badge badge--success" }, "Active") : /* @__PURE__ */ __h("span", { className: "badge badge--danger" }, "Blocked"))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-users__balance-cell" }, /* @__PURE__ */ __h("span", { className: "admin-users__balance-val" }, formatCurrency(u.balance)))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-users__orders-cell" }, /* @__PURE__ */ __h("span", { className: "admin-users__orders-count" }, u.ordersCount, " ", u.ordersCount === 1 ? "order" : "orders"), /* @__PURE__ */ __h("span", { className: "admin-users__orders-spent" }, "Spent: ", formatCurrency(u.totalSpent)))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-users__last-active-cell" }, /* @__PURE__ */ __h("span", { className: "admin-users__date-main" }, formatDate(u.lastActiveAt || u.createdAt)), /* @__PURE__ */ __h("span", { className: "admin-users__date-rel" }, formatRelativeTime(u.lastActiveAt || u.createdAt)))), /* @__PURE__ */ __h("td", { className: "text-right" }, (() => {
				const isSelf = Boolean(currentUser && (currentUser.id && String(currentUser.id).toLowerCase() === String(u.id).toLowerCase() || currentUser.Id && String(currentUser.Id).toLowerCase() === String(u.id).toLowerCase() || currentUser.email && u.email && currentUser.email.toLowerCase() === u.email.toLowerCase()));
				const targetLevel = getRoleLevel(u.role);
				const canEdit = isSelf || currentUserLevel > targetLevel;
				return /* @__PURE__ */ __h(AdminTableActions, {
					index: i,
					total: visibleUsers.length,
					actions: [{
						label: "View Profile",
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
						onClick: () => loadUserDetails(u.id)
					}, {
						label: "Edit User & Balance",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2"
						}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })),
						locked: !canEdit,
						title: canEdit ? "Edit User & Balance" : `Access denied (Cannot edit equal or higher role: ${u.role})`,
						onClick: () => {
							if (!canEdit) {
								showToast(`You cannot modify data of a user with an equal or higher role (${u.role}).`, "error");
								return;
							}
							openEditModal(u);
						}
					}]
				});
			})()))))))), hasMore && !loading && /* @__PURE__ */ __h("div", { className: "admin-users__load-more" }, /* @__PURE__ */ __h("button", {
				className: "admin-users__btn-secondary",
				onClick: () => setVisibleCount((prev) => prev + PAGE_SIZE)
			}, "Load More Users (", filteredUsers.length - visibleCount, " remaining)")), /* @__PURE__ */ __h(AnimatePresence, null, selectedUserId && /* @__PURE__ */ __h("div", {
				className: "admin-users__modal-backdrop",
				onClick: () => setSelectedUserId(null)
			}, /* @__PURE__ */ __h(motion.div, {
				className: "admin-users__modal admin-users__modal--details",
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
			}, loadingDetails ? /* @__PURE__ */ __h("div", { className: "admin-users__modal-loading" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "admin-users__spinner"
			}), /* @__PURE__ */ __h("span", null, "Loading detailed user info...")) : userDetails ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", { className: "admin-users__modal-header" }, /* @__PURE__ */ __h("div", { className: "admin-users__modal-identity" }, /* @__PURE__ */ __h("div", { className: "admin-users__avatar admin-users__avatar--lg" }, userDetails.profilePictureUrl ? /* @__PURE__ */ __h("img", {
				src: userDetails.profilePictureUrl,
				alt: userDetails.name || userDetails.email
			}) : /* @__PURE__ */ __h("span", null, getInitials(userDetails.name, userDetails.email))), /* @__PURE__ */ __h("div", { className: "admin-users__modal-meta" }, /* @__PURE__ */ __h("h2", null, userDetails.name || "Unnamed User"), /* @__PURE__ */ __h("p", null, userDetails.email), /* @__PURE__ */ __h("div", { className: "admin-users__modal-chips" }, /* @__PURE__ */ __h("code", null, "ID: ", userDetails.id), /* @__PURE__ */ __h("button", {
				className: "copy-btn",
				onClick: () => copyToClipboard(userDetails.id, "modal-id")
			}, copiedId === "modal-id" ? "Copied!" : "Copy")))), /* @__PURE__ */ __h("button", {
				className: "admin-users__modal-close",
				onClick: () => setSelectedUserId(null),
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
			})))), /* @__PURE__ */ __h("div", { className: "admin-users__modal-tabs-wrap" }, /* @__PURE__ */ __h("div", { className: "admin-users__modal-tabs" }, /* @__PURE__ */ __h("button", {
				className: `tab-btn${detailsTab === "overview" ? " active" : ""}`,
				onClick: () => setDetailsTab("overview")
			}, /* @__PURE__ */ __h("span", null, "Overview")), /* @__PURE__ */ __h("button", {
				className: `tab-btn${detailsTab === "addresses" ? " active" : ""}`,
				onClick: () => setDetailsTab("addresses")
			}, /* @__PURE__ */ __h("span", null, "Addresses"), /* @__PURE__ */ __h("span", { className: "tab-badge" }, userDetails.addresses?.length || 0)), /* @__PURE__ */ __h("button", {
				className: `tab-btn${detailsTab === "cards" ? " active" : ""}`,
				onClick: () => setDetailsTab("cards")
			}, /* @__PURE__ */ __h("span", null, "Cards"), /* @__PURE__ */ __h("span", { className: "tab-badge" }, userDetails.paymentMethods?.length || 0)), /* @__PURE__ */ __h("button", {
				className: `tab-btn${detailsTab === "orders" ? " active" : ""}`,
				onClick: () => setDetailsTab("orders")
			}, /* @__PURE__ */ __h("span", null, "Orders"), /* @__PURE__ */ __h("span", { className: "tab-badge" }, userDetails.orders?.length || 0)), /* @__PURE__ */ __h("button", {
				className: `tab-btn${detailsTab === "promos" ? " active" : ""}`,
				onClick: () => setDetailsTab("promos")
			}, /* @__PURE__ */ __h("span", null, "Promos"), /* @__PURE__ */ __h("span", { className: "tab-badge" }, userDetails.promos?.length || 0)))), /* @__PURE__ */ __h("div", { className: "admin-users__modal-body" }, detailsTab === "overview" && /* @__PURE__ */ __h("div", { className: "admin-users__details-overview" }, /* @__PURE__ */ __h("div", { className: "admin-users__info-grid" }, /* @__PURE__ */ __h("div", { className: "info-item" }, /* @__PURE__ */ __h("span", { className: "label" }, "Current Balance"), /* @__PURE__ */ __h("span", { className: "value highlight" }, formatCurrency(userDetails.balance))), /* @__PURE__ */ __h("div", { className: "info-item" }, /* @__PURE__ */ __h("span", { className: "label" }, "Account Status"), /* @__PURE__ */ __h("span", { className: "value" }, userDetails.session?.isActive !== false ? /* @__PURE__ */ __h("span", { className: "badge badge--success" }, "Active") : /* @__PURE__ */ __h("span", { className: "badge badge--danger" }, "Blocked / Suspended"))), /* @__PURE__ */ __h("div", { className: "info-item" }, /* @__PURE__ */ __h("span", { className: "label" }, "Two-Factor Auth"), /* @__PURE__ */ __h("span", { className: "value" }, userDetails.session?.twoFactorEnabled ? /* @__PURE__ */ __h("span", { className: "badge badge--success" }, "Enabled") : /* @__PURE__ */ __h("span", { className: "badge badge--muted" }, "Disabled"))), /* @__PURE__ */ __h("div", { className: "info-item" }, /* @__PURE__ */ __h("span", { className: "label" }, "Newsletter"), /* @__PURE__ */ __h("span", { className: "value" }, userDetails.session?.subscribe ? /* @__PURE__ */ __h("span", { className: "badge badge--info" }, "Subscribed") : /* @__PURE__ */ __h("span", { className: "badge badge--muted" }, "Not Subscribed"))), /* @__PURE__ */ __h("div", { className: "info-item" }, /* @__PURE__ */ __h("span", { className: "label" }, "Total Orders"), /* @__PURE__ */ __h("span", { className: "value" }, userDetails.orders?.length || 0)), /* @__PURE__ */ __h("div", { className: "info-item" }, /* @__PURE__ */ __h("span", { className: "label" }, "Registration IP"), /* @__PURE__ */ __h("span", { className: "value" }, userDetails.session?.registrationIp || "Not recorded"))), /* @__PURE__ */ __h("div", { className: "admin-users__quick-actions" }, /* @__PURE__ */ __h("div", { className: "actions-row" }, (() => {
				const isSelf = Boolean(currentUser && (currentUser.id && String(currentUser.id).toLowerCase() === String(userDetails.id).toLowerCase() || currentUser.Id && String(currentUser.Id).toLowerCase() === String(userDetails.id).toLowerCase() || currentUser.email && userDetails.email && currentUser.email.toLowerCase() === userDetails.email.toLowerCase()));
				const targetLevel = getRoleLevel(userDetails.role);
				const canEdit = isSelf || currentUserLevel > targetLevel;
				return canEdit ? /* @__PURE__ */ __h("button", {
					className: "admin-users__btn-secondary",
					onClick: () => openEditModal(userDetails)
				}, "Edit Profile / Balance") : /* @__PURE__ */ __h("button", {
					className: "admin-users__btn-secondary admin-users__btn-secondary--locked",
					onClick: () => showToast(`You cannot modify data of a user with an equal or higher role (${userDetails.role}).`, "error"),
					title: `Access denied (Cannot edit equal or higher role: ${userDetails.role})`
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					style: {
						width: 14,
						height: 14,
						marginRight: 6
					}
				}, /* @__PURE__ */ __h("rect", {
					x: "3",
					y: "11",
					width: "18",
					height: "11",
					rx: "2",
					ry: "2"
				}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })), "Edit Restricted (", userDetails.role, ")");
			})()))), detailsTab === "addresses" && /* @__PURE__ */ __h("div", { className: "admin-users__details-addresses" }, userDetails.addresses && userDetails.addresses.length > 0 ? /* @__PURE__ */ __h("div", { className: "addresses-list" }, userDetails.addresses.map((a, idx) => /* @__PURE__ */ __h("div", {
				key: idx,
				className: "address-card"
			}, /* @__PURE__ */ __h("div", { className: "address-card__header" }, /* @__PURE__ */ __h("strong", null, a.title || "Address"), a.isDefault && /* @__PURE__ */ __h("span", { className: "badge badge--info" }, "Default")), /* @__PURE__ */ __h("p", { className: "address-card__main" }, a.address, " ", a.apartment ? `, Apt ${a.apartment}` : ""), /* @__PURE__ */ __h("p", { className: "address-card__city" }, a.city), a.phone && /* @__PURE__ */ __h("p", { className: "address-card__phone" }, "📞 ", a.phone), a.notes && /* @__PURE__ */ __h("p", { className: "address-card__notes" }, "Note: ", a.notes)))) : /* @__PURE__ */ __h("div", { className: "empty-subtab" }, "No saved delivery addresses.")), detailsTab === "cards" && /* @__PURE__ */ __h("div", { className: "admin-users__details-cards" }, userDetails.paymentMethods && userDetails.paymentMethods.length > 0 ? /* @__PURE__ */ __h("div", { className: "cards-list" }, userDetails.paymentMethods.map((pm, idx) => /* @__PURE__ */ __h("div", {
				key: idx,
				className: "card-item"
			}, /* @__PURE__ */ __h("div", { className: "card-item__icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
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
			}))), /* @__PURE__ */ __h("div", { className: "card-item__info" }, /* @__PURE__ */ __h("strong", null, pm.cardBrand || "Card", " •••• ", pm.last4 || (pm.id > 0 ? String(pm.id).padStart(4, "0") : "••••")), /* @__PURE__ */ __h("span", null, pm.cardholderName || "Cardholder"), pm.expiryDate && /* @__PURE__ */ __h("span", null, "Exp: ", pm.expiryDate)), pm.isDefault && /* @__PURE__ */ __h("span", { className: "badge badge--info" }, "Default")))) : /* @__PURE__ */ __h("div", { className: "empty-subtab" }, "No saved payment methods.")), detailsTab === "orders" && /* @__PURE__ */ __h("div", { className: "admin-users__details-orders" }, userDetails.orders && userDetails.orders.length > 0 ? /* @__PURE__ */ __h("div", { className: "orders-list" }, userDetails.orders.map((o) => /* @__PURE__ */ __h("div", {
				key: o.id,
				className: "order-card"
			}, /* @__PURE__ */ __h("div", { className: "order-card__header" }, /* @__PURE__ */ __h("span", { className: "order-card__date" }, formatDate(o.createdAt)), /* @__PURE__ */ __h("span", { className: "badge badge--info" }, o.status)), /* @__PURE__ */ __h("div", { className: "order-card__body" }, /* @__PURE__ */ __h("div", { className: "order-card__info" }, /* @__PURE__ */ __h("span", null, o.itemsCount, " ", o.itemsCount === 1 ? "item" : "items"), /* @__PURE__ */ __h("span", { className: "order-card__dot" }, "•"), /* @__PURE__ */ __h("span", null, o.paymentMethod || "Online")), /* @__PURE__ */ __h("strong", { className: "order-card__total" }, formatCurrency(o.totalAmount)))))) : /* @__PURE__ */ __h("div", { className: "empty-subtab" }, "No orders placed by this user yet.")), detailsTab === "promos" && /* @__PURE__ */ __h("div", { className: "admin-users__details-promos" }, userDetails.promos && userDetails.promos.length > 0 ? /* @__PURE__ */ __h("div", { className: "promos-list" }, userDetails.promos.map((p) => /* @__PURE__ */ __h("div", {
				key: p.id,
				className: "promo-card"
			}, /* @__PURE__ */ __h("div", { className: "promo-card__header" }, /* @__PURE__ */ __h("strong", null, p.prizeInfo?.prizeName || "Promo Prize"), p.isActive ? /* @__PURE__ */ __h("span", { className: "badge badge--success" }, "Active") : /* @__PURE__ */ __h("span", { className: "badge badge--muted" }, "Used / Inactive")), /* @__PURE__ */ __h("div", { className: "promo-card__code" }, /* @__PURE__ */ __h("code", null, p.codes?.promoCode)), /* @__PURE__ */ __h("p", { className: "promo-card__desc" }, p.prizeInfo?.prizeDescription), /* @__PURE__ */ __h("div", { className: "promo-card__dates" }, /* @__PURE__ */ __h("span", null, "Activated: ", formatDate(p.dates?.activatedAt)), /* @__PURE__ */ __h("span", null, "Expires: ", formatDate(p.dates?.expiresAt)))))) : /* @__PURE__ */ __h("div", { className: "empty-subtab" }, "No promo codes awarded to this user.")))) : null))), /* @__PURE__ */ __h(AnimatePresence, null, editingUser && /* @__PURE__ */ __h("div", {
				className: "admin-users__modal-backdrop",
				onClick: () => setEditingUser(null)
			}, /* @__PURE__ */ __h(motion.div, {
				className: "admin-users__modal admin-users__modal--edit",
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
			}, /* @__PURE__ */ __h("div", { className: "admin-users__modal-header" }, /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h2", null, "Edit User Account"), /* @__PURE__ */ __h("p", null, editingUser.email)), /* @__PURE__ */ __h("button", {
				className: "admin-users__modal-close",
				onClick: () => setEditingUser(null)
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
			})))), /* @__PURE__ */ __h("form", {
				onSubmit: handleSaveUser,
				className: "admin-users__edit-form"
			}, isTargetEqualOrHigherRole && /* @__PURE__ */ __h("div", { className: "admin-users__role-warning" }, /* @__PURE__ */ __h("svg", {
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
			}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })), /* @__PURE__ */ __h("span", null, "You cannot modify data of a user with an equal or higher role (", editingUser.role, ").")), /* @__PURE__ */ __h("div", { className: "form-row" }, /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", null, "Name"), /* @__PURE__ */ __h("input", {
				type: "text",
				disabled: isTargetEqualOrHigherRole,
				value: editForm.name,
				onChange: (e) => setEditForm({
					...editForm,
					name: e.target.value
				}),
				placeholder: "e.g. John Doe"
			})), /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", null, "Email Address"), /* @__PURE__ */ __h("input", {
				type: "email",
				required: true,
				disabled: isTargetEqualOrHigherRole,
				value: editForm.email,
				onChange: (e) => setEditForm({
					...editForm,
					email: e.target.value
				}),
				placeholder: "user@example.com"
			}))), /* @__PURE__ */ __h("div", { className: "form-row" }, /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", { style: {
				display: "flex",
				alignItems: "center",
				gap: 6
			} }, /* @__PURE__ */ __h("span", null, "User Balance (₼)"), (!isSuperAdmin || isTargetEqualOrHigherRole) && /* @__PURE__ */ __h("span", {
				title: isTargetEqualOrHigherRole ? "Access denied (Equal or higher role user)" : "Access denied (Super Admin only)",
				style: {
					display: "inline-flex",
					alignItems: "center",
					color: "rgba(255,255,255,0.45)"
				}
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				style: {
					width: "13px",
					height: "13px"
				}
			}, /* @__PURE__ */ __h("rect", {
				x: "3",
				y: "11",
				width: "18",
				height: "11",
				rx: "2",
				ry: "2"
			}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })))), /* @__PURE__ */ __h("input", {
				type: "number",
				step: "0.01",
				min: "0",
				disabled: !isSuperAdmin || isTargetEqualOrHigherRole,
				value: editForm.balance,
				onChange: (e) => setEditForm({
					...editForm,
					balance: e.target.value
				}),
				placeholder: "0.00",
				title: isTargetEqualOrHigherRole ? "Access denied (Equal or higher role user)" : !isSuperAdmin ? "Access denied (Super Admin only)" : ""
			})), /* @__PURE__ */ __h("div", { className: "form-group" }, /* @__PURE__ */ __h("label", null, "User Role"), /* @__PURE__ */ __h("select", {
				value: editForm.role,
				disabled: isRoleDisabled || isTargetEqualOrHigherRole,
				onChange: (e) => setEditForm({
					...editForm,
					role: e.target.value
				})
			}, !allowedRolesToAssign.includes(editForm.role) && /* @__PURE__ */ __h("option", { value: editForm.role }, editForm.role), allowedRolesToAssign.map((r) => /* @__PURE__ */ __h("option", {
				key: r,
				value: r
			}, r))), roleHelperText && /* @__PURE__ */ __h("small", { className: "admin-users__field-hint" }, roleHelperText))), /* @__PURE__ */ __h("div", { className: "toggles-section" }, /* @__PURE__ */ __h("label", { className: `toggle-item${isEditingSelf || isTargetEqualOrHigherRole ? " toggle-item--disabled" : ""}` }, /* @__PURE__ */ __h("input", {
				type: "checkbox",
				checked: isEditingSelf ? true : editForm.isActive,
				disabled: isEditingSelf || isTargetEqualOrHigherRole,
				onChange: (e) => !isEditingSelf && !isTargetEqualOrHigherRole && setEditForm({
					...editForm,
					isActive: e.target.checked
				})
			}), /* @__PURE__ */ __h("span", { className: "toggle-label" }, /* @__PURE__ */ __h("strong", null, "Account Active"), /* @__PURE__ */ __h("small", null, isEditingSelf ? "You cannot block or deactivate your own account" : isTargetEqualOrHigherRole ? "You cannot change active status of a user with an equal or higher role" : "Uncheck to block user from logging in"))), /* @__PURE__ */ __h("label", { className: `toggle-item${isTargetEqualOrHigherRole ? " toggle-item--disabled" : ""}` }, /* @__PURE__ */ __h("input", {
				type: "checkbox",
				disabled: isTargetEqualOrHigherRole,
				checked: editForm.twoFactorEnabled,
				onChange: (e) => !isTargetEqualOrHigherRole && setEditForm({
					...editForm,
					twoFactorEnabled: e.target.checked
				})
			}), /* @__PURE__ */ __h("span", { className: "toggle-label" }, /* @__PURE__ */ __h("strong", null, "Two-Factor Authentication (2FA)"), /* @__PURE__ */ __h("small", null, "Require OTP verification during sign-in"))), /* @__PURE__ */ __h("label", { className: `toggle-item${isTargetEqualOrHigherRole ? " toggle-item--disabled" : ""}` }, /* @__PURE__ */ __h("input", {
				type: "checkbox",
				disabled: isTargetEqualOrHigherRole,
				checked: editForm.subscribe,
				onChange: (e) => !isTargetEqualOrHigherRole && setEditForm({
					...editForm,
					subscribe: e.target.checked
				})
			}), /* @__PURE__ */ __h("span", { className: "toggle-label" }, /* @__PURE__ */ __h("strong", null, "Newsletter Subscription"), /* @__PURE__ */ __h("small", null, "Receive promotional emails and updates")))), /* @__PURE__ */ __h("div", { className: "admin-users__modal-actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-users__btn-secondary",
				onClick: () => setEditingUser(null)
			}, "Cancel"), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "cta-btn",
				disabled: isSavingUser || isTargetEqualOrHigherRole
			}, isSavingUser ? /* @__PURE__ */ __h("span", { className: "btn-loader" }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Saving...",
				className: "btn-loader__icon"
			}), "Saving Changes...") : "Save User"))))))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Users; } });
	});
	//#endregion

	var entryExports = __require("components/AdminPages/Users/Users.js");
	__pages["admin-users"] = entryExports.default || entryExports;
})();
