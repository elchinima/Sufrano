import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useCallback, useMemo } from "../../../utils/runtime.js";
import { motion, AnimatePresence } from "../../../utils/motion.js";
import AdminLayout from "../AdminLayout/AdminLayout.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useAuth } from "../../../context/AuthContext.js";
import { useAdminAuth } from "../../../context/AdminAuthContext.js";
import AdminTableActions from "../../Elements/AdminTableActions.js";

const loaderIcon = "/assets/icons/loader-animated.svg";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";

const cleanRole = (role) => (role || "").toLowerCase().replace(/\s+/g, "");
const PAGE_SIZE = 10;

const formatBakuDate = (isoStr) => {
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

const Advert = () => {
	const { user } = useAuth();
	const { adminRole } = useAdminAuth();
	const [adverts, setAdverts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedMedia, setSelectedMedia] = useState("all");
	const [sortBy, setSortBy] = useState("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const [toast, setToast] = useState({
		message: "",
		type: "success"
	});
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [activeAdvert, setActiveAdvert] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [copiedId, setCopiedId] = useState(null);
	const [form, setForm] = useState({
		title: "",
		description: "",
		mediaUrl: "",
		note: "",
		isActive: true
	});

	const apiUrl = window.__SUFRANO_API_URL__ || "";
	const currentUserRole = cleanRole(adminRole || user?.role || user?.Role);
	const canModify = currentUserRole === "admin" || currentUserRole === "superadmin";

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

	const fetchAdverts = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetchWithRefresh(`${apiUrl}/api/admin/adverts`);
			if (res.ok) {
				const data = await res.json();
				setAdverts(Array.isArray(data) ? data : []);
			} else {
				const errData = await res.json().catch(() => ({}));
				showToast(errData.message || "Failed to load adverts list", "error");
			}
		} catch {
			showToast("Error connecting to server", "error");
		} finally {
			setLoading(false);
		}
	}, [apiUrl]);

	useEffect(() => {
		fetchAdverts();
	}, [fetchAdverts]);

	const filteredAdverts = useMemo(() => {
		return adverts.filter((item) => {
			const q = searchQuery.trim().toLowerCase();
			const matchesSearch = !q ||
				(item.title || "").toLowerCase().includes(q) ||
				(item.description || "").toLowerCase().includes(q) ||
				(item.logs?.note || "").toLowerCase().includes(q) ||
				(item.id || "").toLowerCase().includes(q) ||
				(item.logs?.createUser?.name || "").toLowerCase().includes(q) ||
				(item.logs?.createUser?.email || "").toLowerCase().includes(q);

			const matchesStatus = selectedStatus === "all" ||
				(selectedStatus === "active" && item.isActive !== false) ||
				(selectedStatus === "inactive" && item.isActive === false);

			const hasMedia = Boolean(item.mediaUrl && item.mediaUrl.trim());
			const matchesMedia = selectedMedia === "all" ||
				(selectedMedia === "with-media" && hasMedia) ||
				(selectedMedia === "text-only" && !hasMedia);

			return matchesSearch && matchesStatus && matchesMedia;
		}).sort((a, b) => {
			const dateA = a.logs?.createDate ? new Date(a.logs.createDate).getTime() : 0;
			const dateB = b.logs?.createDate ? new Date(b.logs.createDate).getTime() : 0;
			const likesA = a.likesCount ?? (Array.isArray(a.likes) ? a.likes.length : 0);
			const likesB = b.likesCount ?? (Array.isArray(b.likes) ? b.likes.length : 0);
			const titleA = (a.title || "").toLowerCase();
			const titleB = (b.title || "").toLowerCase();

			switch (sortBy) {
				case "oldest": return dateA - dateB;
				case "likes-desc": return likesB - likesA || dateB - dateA;
				case "title-asc": return titleA.localeCompare(titleB);
				case "title-desc": return titleB.localeCompare(titleA);
				case "newest":
				default: return dateB - dateA;
			}
		});
	}, [adverts, searchQuery, selectedStatus, selectedMedia, sortBy]);

	const totalPages = Math.ceil(filteredAdverts.length / PAGE_SIZE) || 1;

	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, selectedStatus, selectedMedia, sortBy]);

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	const paginatedAdverts = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE;
		return filteredAdverts.slice(start, start + PAGE_SIZE);
	}, [filteredAdverts, currentPage]);

	const stats = useMemo(() => {
		const total = adverts.length;
		const active = adverts.filter((a) => a.isActive !== false).length;
		const inactive = adverts.filter((a) => a.isActive === false).length;
		const totalLikes = adverts.reduce((sum, a) => sum + (a.likesCount ?? (Array.isArray(a.likes) ? a.likes.length : 0)), 0);
		return {
			total,
			active,
			inactive,
			totalLikes
		};
	}, [adverts]);

	const handleCopyId = (id) => {
		if (!id) return;
		navigator.clipboard?.writeText(id);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2e3);
	};

	const handleOpenCreate = () => {
		setActiveAdvert(null);
		setForm({
			title: "",
			description: "",
			mediaUrl: "",
			note: "",
			isActive: true
		});
		setIsEditModalOpen(true);
	};

	const handleOpenEdit = (advert) => {
		if (!canModify) {
			showToast("Access denied. Only Admin and Super Admin roles can edit adverts.", "error");
			return;
		}
		setActiveAdvert(advert);
		setForm({
			title: advert.title || "",
			description: advert.description || "",
			mediaUrl: advert.mediaUrl || "",
			note: advert.logs?.note || "",
			isActive: advert.isActive !== false
		});
		setIsEditModalOpen(true);
	};

	const handleToggleActive = async (advert) => {
		if (!canModify) {
			showToast("Access denied. Only Admin and Super Admin roles can change advert status.", "error");
			return;
		}
		try {
			const res = await fetchWithRefresh(`${apiUrl}/api/admin/adverts/${advert.id}/toggle-active`, { method: "PATCH" });
			if (res.ok) {
				const data = await res.json().catch(() => ({}));
				showToast(data.message || "Advert status updated.");
				setAdverts((prev) => prev.map((a) => a.id === advert.id ? {
					...a,
					isActive: !a.isActive
				} : a));
				if (activeAdvert && activeAdvert.id === advert.id) {
					setActiveAdvert((prev) => prev ? { ...prev, isActive: !prev.isActive } : prev);
				}
			} else {
				const data = await res.json().catch(() => ({}));
				showToast(data.message || "Failed to update advert status.", "error");
			}
		} catch {
			showToast("Network error while updating status.", "error");
		}
	};

	const handleOpenDetails = (advert) => {
		setActiveAdvert(advert);
		setIsDetailsModalOpen(true);
	};

	const handleDeleteClick = (advert) => {
		if (!canModify) {
			showToast("Access denied. Only Admin and Super Admin roles can delete adverts.", "error");
			return;
		}
		setActiveAdvert(advert);
		setIsDeleteModalOpen(true);
	};

	const handleSaveAdvert = async (e) => {
		e.preventDefault();
		const isEditing = Boolean(activeAdvert?.id);
		if (isEditing && !canModify) {
			showToast("Access denied. Only Admin and Super Admin roles can edit adverts.", "error");
			return;
		}

		const trimmedTitle = form.title.trim();
		const trimmedDesc = form.description.trim();

		if (!trimmedTitle) {
			showToast("Advert title is required.", "error");
			return;
		}
		if (trimmedTitle.length > 120) {
			showToast("Advert title cannot exceed 120 characters.", "error");
			return;
		}
		if (!trimmedDesc) {
			showToast("Advert description is required.", "error");
			return;
		}
		if (trimmedDesc.length > 2000) {
			showToast("Advert description cannot exceed 2000 characters.", "error");
			return;
		}

		setIsSaving(true);
		const payload = {
			title: trimmedTitle,
			description: trimmedDesc,
			mediaUrl: form.mediaUrl.trim() || null,
			note: form.note.trim() || null,
			isActive: form.isActive
		};

		try {
			const url = isEditing ? `${apiUrl}/api/admin/adverts/${activeAdvert.id}` : `${apiUrl}/api/admin/adverts`;
			const method = isEditing ? "PUT" : "POST";
			const res = await fetchWithRefresh(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});

			if (res.ok) {
				showToast(isEditing ? "Advert updated successfully." : "Advert created successfully.");
				setIsEditModalOpen(false);
				fetchAdverts();
			} else {
				const data = await res.json().catch(() => ({}));
				showToast(data.message || "Operation failed.", "error");
			}
		} catch {
			showToast("Connection error while saving advert.", "error");
		} finally {
			setIsSaving(false);
		}
	};

	const handleConfirmDelete = async () => {
		if (!activeAdvert?.id) return;
		if (!canModify) {
			showToast("Access denied. Only Admin and Super Admin roles can delete adverts.", "error");
			return;
		}
		setIsDeleting(true);
		try {
			const res = await fetchWithRefresh(`${apiUrl}/api/admin/adverts/${activeAdvert.id}`, { method: "DELETE" });
			if (res.ok) {
				showToast("Advert deleted successfully.");
				setIsDeleteModalOpen(false);
				setActiveAdvert(null);
				fetchAdverts();
			} else {
				const data = await res.json().catch(() => ({}));
				showToast(data.message || "Failed to delete advert.", "error");
			}
		} catch {
			showToast("Network error while deleting advert.", "error");
		} finally {
			setIsDeleting(false);
		}
	};

	const buildRowActions = (adv) => [
		{
			label: "View Details",
			icon: /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }), /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "3"
			})),
			onClick: () => handleOpenDetails(adv)
		},
		{
			label: "Edit Advert",
			locked: !canModify,
			title: !canModify ? "Only Admin and Super Admin can edit adverts" : "Edit Advert",
			icon: /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })),
			onClick: () => handleOpenEdit(adv)
		},
		{
			label: adv.isActive !== false ? "Deactivate" : "Activate",
			locked: !canModify,
			title: !canModify ? "Only Admin and Super Admin can change status" : (adv.isActive !== false ? "Deactivate" : "Activate"),
			icon: /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), adv.isActive !== false ? /* @__PURE__ */ __h("line", {
				x1: "4.93",
				y1: "4.93",
				x2: "19.07",
				y2: "19.07"
			}) : /* @__PURE__ */ __h("polyline", { points: "9 12 11 14 15 10" })),
			onClick: () => handleToggleActive(adv)
		},
		{
			label: "Delete Advert",
			variant: "danger",
			locked: !canModify,
			title: !canModify ? "Only Admin and Super Admin can delete adverts" : "Delete Advert",
			icon: /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })),
			onClick: () => handleDeleteClick(adv)
		}
	];

	return /* @__PURE__ */ __h(AdminLayout, null, /* @__PURE__ */ __h("div", { className: "admin-advert" }, /* @__PURE__ */ __h(AnimatePresence, null, toast.message && /* @__PURE__ */ __h(motion.div, {
		className: `admin-advert__toast ${toast.type === "error" ? "admin-advert__toast--error" : ""}`,
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
	}, /* @__PURE__ */ __h("path", { d: "M20 6L9 17l-5-5" })), /* @__PURE__ */ __h("span", null, toast.message))), /* @__PURE__ */ __h("div", { className: "admin-advert__header" }, /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("div", { className: "admin-advert__title-row" }, /* @__PURE__ */ __h("h1", { className: "admin-advert__title" }, "Adverts"), /* @__PURE__ */ __h("span", { className: "admin-advert__role-badge" }, canModify ? "Full Access" : "Moderator Access (View & Add)")), /* @__PURE__ */ __h("p", { className: "admin-advert__subtitle" }, "Create and manage promotional announcements, media banners, visibility status, and likes")), /* @__PURE__ */ __h("div", { className: "admin-advert__header-actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__btn-secondary",
		onClick: fetchAdverts,
		disabled: loading
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("polyline", { points: "23 4 23 10 17 10" }), /* @__PURE__ */ __h("polyline", { points: "1 20 1 14 7 14" }), /* @__PURE__ */ __h("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })), "Refresh"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__btn-primary",
		onClick: handleOpenCreate
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
	})), "Add Advert"))), /* @__PURE__ */ __h("div", { className: "admin-advert__stats" }, /* @__PURE__ */ __h("div", { className: "admin-advert__stat-card" }, /* @__PURE__ */ __h("div", { className: "admin-advert__stat-icon admin-advert__stat-icon--total" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "m3 11 18-5v12L3 14v-3z" }), /* @__PURE__ */ __h("path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6" }))), /* @__PURE__ */ __h("div", { className: "admin-advert__stat-info" }, /* @__PURE__ */ __h("span", { className: "admin-advert__stat-value" }, stats.total), /* @__PURE__ */ __h("span", { className: "admin-advert__stat-label" }, "Total Adverts"))), /* @__PURE__ */ __h("div", { className: "admin-advert__stat-card" }, /* @__PURE__ */ __h("div", { className: "admin-advert__stat-icon admin-advert__stat-icon--active" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ __h("polyline", { points: "22 4 12 14.01 9 11.01" }))), /* @__PURE__ */ __h("div", { className: "admin-advert__stat-info" }, /* @__PURE__ */ __h("span", { className: "admin-advert__stat-value" }, stats.active), /* @__PURE__ */ __h("span", { className: "admin-advert__stat-label" }, "Active Campaigns"))), /* @__PURE__ */ __h("div", { className: "admin-advert__stat-card" }, /* @__PURE__ */ __h("div", { className: "admin-advert__stat-icon admin-advert__stat-icon--inactive" }, /* @__PURE__ */ __h("svg", {
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
	}))), /* @__PURE__ */ __h("div", { className: "admin-advert__stat-info" }, /* @__PURE__ */ __h("span", { className: "admin-advert__stat-value" }, stats.inactive), /* @__PURE__ */ __h("span", { className: "admin-advert__stat-label" }, "Inactive / Drafts"))), /* @__PURE__ */ __h("div", { className: "admin-advert__stat-card" }, /* @__PURE__ */ __h("div", { className: "admin-advert__stat-icon admin-advert__stat-icon--likes" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }))), /* @__PURE__ */ __h("div", { className: "admin-advert__stat-info" }, /* @__PURE__ */ __h("span", { className: "admin-advert__stat-value" }, stats.totalLikes), /* @__PURE__ */ __h("span", { className: "admin-advert__stat-label" }, "Total Likes")))), /* @__PURE__ */ __h("div", { className: "admin-advert__controls" }, /* @__PURE__ */ __h("div", { className: "admin-advert__search" }, /* @__PURE__ */ __h("svg", {
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
		placeholder: "Search by advert title, description, note, author, or ID...",
		value: searchQuery,
		onChange: (e) => setSearchQuery(e.target.value)
	}), searchQuery && /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__search-clear",
		onClick: () => setSearchQuery("")
	}, "✕")), /* @__PURE__ */ __h("div", { className: "admin-advert__filters" }, /* @__PURE__ */ __h("select", {
		className: "admin-advert__select",
		value: selectedStatus,
		onChange: (e) => setSelectedStatus(e.target.value)
	}, /* @__PURE__ */ __h("option", { value: "all" }, "All Status (", adverts.length, ")"), /* @__PURE__ */ __h("option", { value: "active" }, "Active (", stats.active, ")"), /* @__PURE__ */ __h("option", { value: "inactive" }, "Inactive (", stats.inactive, ")")), /* @__PURE__ */ __h("select", {
		className: "admin-advert__select",
		value: selectedMedia,
		onChange: (e) => setSelectedMedia(e.target.value)
	}, /* @__PURE__ */ __h("option", { value: "all" }, "All Media Types"), /* @__PURE__ */ __h("option", { value: "with-media" }, "With Media (", adverts.filter((a) => Boolean(a.mediaUrl && a.mediaUrl.trim())).length, ")"), /* @__PURE__ */ __h("option", { value: "text-only" }, "Text Only (", adverts.filter((a) => !a.mediaUrl || !a.mediaUrl.trim()).length, ")")), /* @__PURE__ */ __h("select", {
		className: "admin-advert__select",
		value: sortBy,
		onChange: (e) => setSortBy(e.target.value)
	}, /* @__PURE__ */ __h("option", { value: "newest" }, "Newest First"), /* @__PURE__ */ __h("option", { value: "oldest" }, "Oldest First"), /* @__PURE__ */ __h("option", { value: "likes-desc" }, "Most Liked"), /* @__PURE__ */ __h("option", { value: "title-asc" }, "Title (A-Z)"), /* @__PURE__ */ __h("option", { value: "title-desc" }, "Title (Z-A)")))), loading ? /* @__PURE__ */ __h("div", { className: "admin-advert__loading" }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading...",
		className: "admin-advert__spinner"
	}), /* @__PURE__ */ __h("p", null, "Loading adverts...")) : filteredAdverts.length === 0 ? /* @__PURE__ */ __h("div", { className: "admin-advert__empty" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("path", { d: "m3 11 18-5v12L3 14v-3z" }), /* @__PURE__ */ __h("path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6" })), /* @__PURE__ */ __h("h3", null, "No adverts found"), /* @__PURE__ */ __h("p", null, searchQuery || selectedStatus !== "all" || selectedMedia !== "all" ? "Try adjusting your search query or filters." : "No promotional adverts have been created yet. Click \"Add Advert\" above to publish one.")) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", { className: "admin-advert__table-wrapper" }, /* @__PURE__ */ __h("table", { className: "admin-advert__table" }, /* @__PURE__ */ __h("thead", null, /* @__PURE__ */ __h("tr", null, /* @__PURE__ */ __h("th", null, "Advert"), /* @__PURE__ */ __h("th", null, "Created / Logs"), /* @__PURE__ */ __h("th", { className: "text-center" }, "Likes"), /* @__PURE__ */ __h("th", { className: "text-center" }, "Status"), /* @__PURE__ */ __h("th", null, "Actions"))), /* @__PURE__ */ __h("tbody", null, paginatedAdverts.map((adv, idx) => {
		const likesCount = adv.likesCount ?? (Array.isArray(adv.likes) ? adv.likes.length : 0);
		const creator = adv.logs?.createUser;
		const updater = adv.logs?.updateUser;
		const actions = buildRowActions(adv);
		return /* @__PURE__ */ __h("tr", { key: adv.id || idx }, /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-advert__item-cell" }, /* @__PURE__ */ __h("div", { className: "admin-advert__thumb-wrap" }, adv.mediaUrl ? /* @__PURE__ */ __h("img", {
			src: adv.mediaUrl,
			alt: adv.title,
			className: "admin-advert__thumb-img",
			loading: "lazy",
			onError: (e) => {
				e.target.style.display = "none";
			}
		}) : /* @__PURE__ */ __h("span", { className: "admin-advert__thumb-fallback" }, "📢")), /* @__PURE__ */ __h("div", { className: "admin-advert__item-info" }, /* @__PURE__ */ __h("span", {
			className: "admin-advert__item-title",
			onClick: () => handleOpenDetails(adv)
		}, adv.title), /* @__PURE__ */ __h("span", { className: "admin-advert__item-desc" }, adv.description), adv.logs?.note && /* @__PURE__ */ __h("span", { className: "admin-advert__item-note" }, "Note: ", adv.logs.note)))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-advert__logs-cell" }, /* @__PURE__ */ __h("div", { className: "admin-advert__author-row" }, creator?.profilePictureUrl ? /* @__PURE__ */ __h("img", {
			src: creator.profilePictureUrl,
			alt: creator.name || "Author",
			className: "admin-advert__author-avatar"
		}) : /* @__PURE__ */ __h("div", { className: "admin-advert__author-avatar-fallback" }, (creator?.name || creator?.email || "A")[0].toUpperCase()), /* @__PURE__ */ __h("div", { className: "admin-advert__author-meta" }, /* @__PURE__ */ __h("span", { className: "admin-advert__author-name" }, creator?.name || creator?.email || "System Admin"), /* @__PURE__ */ __h("span", { className: "admin-advert__log-date" }, formatBakuDate(adv.logs?.createDate)))), adv.logs?.updateDate && /* @__PURE__ */ __h("span", { className: "admin-advert__updated-tag" }, "Edited ", formatBakuDate(adv.logs.updateDate), updater ? ` by ${updater.name || updater.email}` : ""))), /* @__PURE__ */ __h("td", { className: "text-center" }, /* @__PURE__ */ __h("span", { className: "admin-advert__likes-pill" }, /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: likesCount > 0 ? "currentColor" : "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}, /* @__PURE__ */ __h("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })), likesCount)), /* @__PURE__ */ __h("td", { className: "text-center" }, /* @__PURE__ */ __h("span", {
			className: `admin-advert__status-badge ${adv.isActive !== false ? "admin-advert__status-badge--active" : "admin-advert__status-badge--inactive"} ${!canModify ? "admin-advert__status-badge--locked" : ""}`,
			onClick: () => handleToggleActive(adv),
			title: canModify ? "Click to toggle status" : "Only Admin and Super Admin can toggle status"
		}, adv.isActive !== false ? "Active" : "Inactive")), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h(AdminTableActions, {
			actions,
			index: idx,
			total: paginatedAdverts.length
		})));
	})))), /* @__PURE__ */ __h("div", { className: "admin-advert__mobile-grid" }, paginatedAdverts.map((adv, idx) => {
		const likesCount = adv.likesCount ?? (Array.isArray(adv.likes) ? adv.likes.length : 0);
		const creator = adv.logs?.createUser;
		const actions = buildRowActions(adv);
		return /* @__PURE__ */ __h("div", {
			key: adv.id || idx,
			className: "admin-advert__mobile-card"
		}, /* @__PURE__ */ __h("div", { className: "admin-advert__mobile-top" }, /* @__PURE__ */ __h("div", { className: "admin-advert__thumb-wrap" }, adv.mediaUrl ? /* @__PURE__ */ __h("img", {
			src: adv.mediaUrl,
			alt: adv.title,
			className: "admin-advert__thumb-img",
			loading: "lazy",
			onError: (e) => {
				e.target.style.display = "none";
			}
		}) : /* @__PURE__ */ __h("span", { className: "admin-advert__thumb-fallback" }, "📢")), /* @__PURE__ */ __h("div", { className: "admin-advert__mobile-main" }, /* @__PURE__ */ __h("div", { className: "admin-advert__mobile-title-row" }, /* @__PURE__ */ __h("span", {
			className: "admin-advert__item-title",
			onClick: () => handleOpenDetails(adv)
		}, adv.title)), /* @__PURE__ */ __h("p", { className: "admin-advert__mobile-desc" }, adv.description), /* @__PURE__ */ __h("div", { className: "admin-advert__mobile-tags" }, /* @__PURE__ */ __h("span", {
			className: `admin-advert__status-badge ${adv.isActive !== false ? "admin-advert__status-badge--active" : "admin-advert__status-badge--inactive"} ${!canModify ? "admin-advert__status-badge--locked" : ""}`,
			onClick: (e) => {
				e.stopPropagation();
				handleToggleActive(adv);
			}
		}, adv.isActive !== false ? "Active" : "Inactive"), /* @__PURE__ */ __h("span", { className: "admin-advert__likes-pill" }, "♥ ", likesCount), /* @__PURE__ */ __h("span", { className: "admin-advert__mobile-date" }, formatBakuDate(adv.logs?.createDate), creator ? ` • ${creator.name || creator.email}` : ""))), /* @__PURE__ */ __h("div", { className: "admin-advert__mobile-actions" }, /* @__PURE__ */ __h(AdminTableActions, {
			actions,
			index: idx,
			total: paginatedAdverts.length
		}))));
	})), !loading && totalPages > 1 && /* @__PURE__ */ __h("div", { className: "admin-advert__pagination" }, /* @__PURE__ */ __h("div", { className: "admin-advert__pagination-info" }, "Showing ", (currentPage - 1) * PAGE_SIZE + 1, "–", Math.min(currentPage * PAGE_SIZE, filteredAdverts.length), " of ", filteredAdverts.length, " adverts"), /* @__PURE__ */ __h("div", { className: "admin-advert__pagination-controls" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__page-btn",
		onClick: () => setCurrentPage(1),
		disabled: currentPage === 1,
		title: "First page"
	}, "«"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__page-btn",
		onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
		disabled: currentPage === 1,
		title: "Previous page"
	}, "‹ Prev"), /* @__PURE__ */ __h("span", { className: "admin-advert__page-current" }, "Page ", currentPage, " of ", totalPages), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__page-btn",
		onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
		disabled: currentPage === totalPages,
		title: "Next page"
	}, "Next ›"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__page-btn",
		onClick: () => setCurrentPage(totalPages),
		disabled: currentPage === totalPages,
		title: "Last page"
	}, "»")))), /* @__PURE__ */ __h(AnimatePresence, null, isDetailsModalOpen && activeAdvert && /* @__PURE__ */ __h("div", {
		className: "animated-modal-overlay",
		style: {
			position: "fixed",
			inset: 0,
			backgroundColor: "rgba(0,0,0,0.7)",
			backdropFilter: "blur(10px)",
			zIndex: 9999,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "16px"
		},
		onClick: () => setIsDetailsModalOpen(false)
	}, /* @__PURE__ */ __h(motion.div, {
		className: "advert-modal",
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
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("div", { className: "advert-modal__header" }, /* @__PURE__ */ __h("h3", null, "Advert Details"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "advert-modal__close-btn",
		onClick: () => setIsDetailsModalOpen(false)
	}, "✕")), /* @__PURE__ */ __h("div", { className: "advert-modal__details" }, activeAdvert.mediaUrl && /* @__PURE__ */ __h("div", { className: "advert-modal__media-banner" }, /* @__PURE__ */ __h("img", {
		src: activeAdvert.mediaUrl,
		alt: activeAdvert.title,
		className: "advert-modal__media-img",
		onError: (e) => {
			e.target.style.display = "none";
		}
	})), /* @__PURE__ */ __h("div", { className: "advert-modal__details-head" }, /* @__PURE__ */ __h("h4", { className: "advert-modal__details-title" }, activeAdvert.title), /* @__PURE__ */ __h("div", { className: "advert-modal__details-badges" }, /* @__PURE__ */ __h("span", { className: `admin-advert__status-badge ${activeAdvert.isActive !== false ? "admin-advert__status-badge--active" : "admin-advert__status-badge--inactive"}` }, activeAdvert.isActive !== false ? "Active" : "Inactive"), /* @__PURE__ */ __h("span", { className: "admin-advert__likes-pill" }, "♥ ", activeAdvert.likesCount ?? (Array.isArray(activeAdvert.likes) ? activeAdvert.likes.length : 0), " likes"))), /* @__PURE__ */ __h("div", { className: "advert-modal__details-box" }, /* @__PURE__ */ __h("span", { className: "advert-modal__box-label" }, "Description"), /* @__PURE__ */ __h("p", { className: "advert-modal__details-desc" }, activeAdvert.description)), activeAdvert.logs?.note && /* @__PURE__ */ __h("div", { className: "advert-modal__details-box" }, /* @__PURE__ */ __h("span", { className: "advert-modal__box-label" }, "Log Note"), /* @__PURE__ */ __h("p", { className: "advert-modal__details-note" }, activeAdvert.logs.note)), /* @__PURE__ */ __h("div", { className: "advert-modal__details-row" }, /* @__PURE__ */ __h("div", { className: "advert-modal__details-box" }, /* @__PURE__ */ __h("span", { className: "advert-modal__box-label" }, "Created By"), /* @__PURE__ */ __h("p", { className: "advert-modal__box-val" }, activeAdvert.logs?.createUser?.name || activeAdvert.logs?.createUser?.email || "Admin"), /* @__PURE__ */ __h("span", { className: "advert-modal__box-sub" }, formatBakuDate(activeAdvert.logs?.createDate))), /* @__PURE__ */ __h("div", { className: "advert-modal__details-box" }, /* @__PURE__ */ __h("span", { className: "advert-modal__box-label" }, "Last Updated"), activeAdvert.logs?.updateDate ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("p", { className: "advert-modal__box-val" }, activeAdvert.logs?.updateUser?.name || activeAdvert.logs?.updateUser?.email || "Admin"), /* @__PURE__ */ __h("span", { className: "advert-modal__box-sub" }, formatBakuDate(activeAdvert.logs.updateDate))) : /* @__PURE__ */ __h("p", { className: "advert-modal__box-sub" }, "Never modified"))), /* @__PURE__ */ __h("div", { className: "advert-modal__details-box" }, /* @__PURE__ */ __h("span", { className: "advert-modal__box-label" }, "Advert ID"), /* @__PURE__ */ __h("div", { className: "advert-modal__id-row" }, /* @__PURE__ */ __h("code", null, activeAdvert.id), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "advert-modal__copy-btn",
		onClick: () => handleCopyId(activeAdvert.id)
	}, copiedId === activeAdvert.id ? "Copied" : "Copy")))), /* @__PURE__ */ __h("div", { className: "advert-modal__footer" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__btn-secondary",
		onClick: () => setIsDetailsModalOpen(false)
	}, "Close"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__btn-primary",
		onClick: () => {
			if (!canModify) {
				showToast("Access denied. Only Admin and Super Admin roles can edit adverts.", "error");
				return;
			}
			setIsDetailsModalOpen(false);
			handleOpenEdit(activeAdvert);
		},
		title: !canModify ? "Only Admin and Super Admin can edit adverts" : "Edit Advert"
	}, !canModify ? "🔒 Edit Advert" : "Edit Advert"))))), /* @__PURE__ */ __h(AnimatePresence, null, isEditModalOpen && /* @__PURE__ */ __h("div", {
		className: "animated-modal-overlay",
		style: {
			position: "fixed",
			inset: 0,
			backgroundColor: "rgba(0,0,0,0.7)",
			backdropFilter: "blur(10px)",
			zIndex: 9999,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "16px"
		},
		onClick: () => !isSaving && setIsEditModalOpen(false)
	}, /* @__PURE__ */ __h(motion.div, {
		className: "advert-modal",
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
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("div", { className: "advert-modal__header" }, /* @__PURE__ */ __h("h3", null, activeAdvert ? "Edit Advert" : "Add New Advert"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "advert-modal__close-btn",
		onClick: () => setIsEditModalOpen(false),
		disabled: isSaving
	}, "✕")), /* @__PURE__ */ __h("form", {
		className: "advert-modal__form",
		onSubmit: handleSaveAdvert
	}, /* @__PURE__ */ __h("div", { className: "advert-modal__form-group" }, /* @__PURE__ */ __h("div", { className: "advert-modal__label-row" }, /* @__PURE__ */ __h("label", null, "Title *"), /* @__PURE__ */ __h("span", { className: `advert-modal__counter ${form.title.length >= 120 ? "limit" : ""}` }, form.title.length, "/120")), /* @__PURE__ */ __h("input", {
		type: "text",
		placeholder: "Enter promotional headline or announcement title...",
		value: form.title,
		maxLength: 120,
		onChange: (e) => setForm({
			...form,
			title: e.target.value.slice(0, 120)
		}),
		required: true
	})), /* @__PURE__ */ __h("div", { className: "advert-modal__form-group" }, /* @__PURE__ */ __h("div", { className: "advert-modal__label-row" }, /* @__PURE__ */ __h("label", null, "Description *"), /* @__PURE__ */ __h("span", { className: `advert-modal__counter ${form.description.length >= 2000 ? "limit" : ""}` }, form.description.length, "/2000")), /* @__PURE__ */ __h("textarea", {
		placeholder: "Write the full promotional text, offer details, terms...",
		value: form.description,
		maxLength: 2000,
		rows: 4,
		onChange: (e) => setForm({
			...form,
			description: e.target.value.slice(0, 2000)
		}),
		required: true
	})), /* @__PURE__ */ __h("div", { className: "advert-modal__form-group" }, /* @__PURE__ */ __h("label", null, "Media URL (Optional Image / Banner)"), /* @__PURE__ */ __h("div", { className: "advert-modal__image-preview-wrap" }, form.mediaUrl ? /* @__PURE__ */ __h("img", {
		src: form.mediaUrl,
		alt: "Media Preview",
		className: "advert-modal__image-preview",
		onError: (e) => {
			e.target.style.display = "none";
		}
	}) : /* @__PURE__ */ __h("div", {
		className: "advert-modal__image-preview",
		style: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontSize: "1.4rem"
		}
	}, "📢"), /* @__PURE__ */ __h("div", { className: "advert-modal__image-actions" }, /* @__PURE__ */ __h("input", {
		type: "url",
		placeholder: "https://... media or banner URL",
		value: form.mediaUrl,
		onChange: (e) => setForm({
			...form,
			mediaUrl: e.target.value
		})
	})))), /* @__PURE__ */ __h("div", { className: "advert-modal__form-row" }, /* @__PURE__ */ __h("div", { className: "advert-modal__form-group" }, /* @__PURE__ */ __h("label", null, "Audit Note (Optional)"), /* @__PURE__ */ __h("input", {
		type: "text",
		placeholder: "Internal note stored in Logs...",
		value: form.note,
		maxLength: 250,
		onChange: (e) => setForm({
			...form,
			note: e.target.value
		})
	})), /* @__PURE__ */ __h("div", { className: "advert-modal__form-group" }, /* @__PURE__ */ __h("label", null, "Visibility Status"), /* @__PURE__ */ __h("select", {
		value: form.isActive ? "active" : "inactive",
		onChange: (e) => setForm({
			...form,
			isActive: e.target.value === "active"
		})
	}, /* @__PURE__ */ __h("option", { value: "active" }, "Active (Published)"), /* @__PURE__ */ __h("option", { value: "inactive" }, "Inactive (Hidden)")))), /* @__PURE__ */ __h("div", { className: "advert-modal__footer" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__btn-secondary",
		onClick: () => setIsEditModalOpen(false),
		disabled: isSaving
	}, "Cancel"), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "admin-advert__btn-primary",
		disabled: isSaving
	}, isSaving ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Saving...",
		style: {
			width: 16,
			height: 16
		}
	}), "Saving...") : activeAdvert ? "Save Changes" : "Publish Advert")))))), /* @__PURE__ */ __h(AnimatePresence, null, isDeleteModalOpen && activeAdvert && /* @__PURE__ */ __h("div", {
		className: "animated-modal-overlay",
		style: {
			position: "fixed",
			inset: 0,
			backgroundColor: "rgba(0,0,0,0.7)",
			backdropFilter: "blur(10px)",
			zIndex: 9999,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "16px"
		},
		onClick: () => !isDeleting && setIsDeleteModalOpen(false)
	}, /* @__PURE__ */ __h(motion.div, {
		className: "advert-modal",
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
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("div", { className: "advert-modal__header" }, /* @__PURE__ */ __h("h3", null, "Delete Advert?"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "advert-modal__close-btn",
		onClick: () => setIsDeleteModalOpen(false),
		disabled: isDeleting
	}, "✕")), /* @__PURE__ */ __h("div", { className: "advert-modal__delete-box" }, activeAdvert.mediaUrl ? /* @__PURE__ */ __h("img", {
		src: activeAdvert.mediaUrl,
		alt: activeAdvert.title,
		style: {
			width: 64,
			height: 64,
			borderRadius: 12,
			objectFit: "cover",
			background: "rgba(0, 0, 0, 0.45)",
			border: "1px solid rgba(255, 255, 255, 0.1)"
		}
	}) : /* @__PURE__ */ __h("div", { className: "advert-modal__delete-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }))), /* @__PURE__ */ __h("p", { className: "advert-modal__delete-text" }, "Are you sure you want to delete ", /* @__PURE__ */ __h("strong", null, "\"", activeAdvert.title, "\""), "?"), /* @__PURE__ */ __h("div", { className: "advert-modal__delete-warning" }, "This action will permanently remove this advert and its engagement history from the database.")), /* @__PURE__ */ __h("div", { className: "advert-modal__footer" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__btn-secondary",
		onClick: () => setIsDeleteModalOpen(false),
		disabled: isDeleting
	}, "Cancel"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "admin-advert__btn-primary",
		style: { background: "linear-gradient(135deg, #c5a059, #5c1224)" },
		onClick: handleConfirmDelete,
		disabled: isDeleting
	}, isDeleting ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
		src: loaderIconRed,
		alt: "Deleting...",
		style: {
			width: 16,
			height: 16
		}
	}), "Deleting...") : "Delete Advert")))))));
};

export default Advert;
