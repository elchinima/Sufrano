(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/AdminPages/Products/Products.js
	__define("components/AdminPages/Products/Products.js", function (exports, __require, module) {
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
		const DEFAULT_CATEGORIES = [
			"Main Drinks",
			"Specialty Drinks",
			"Desserts"
		];
		const cleanRole = (role) => (role || "").toLowerCase().replace(/\s+/g, "");
		const Products = () => {
			const { user } = useAuth();
			const [products, setProducts] = useState([]);
			const [loading, setLoading] = useState(true);
			const [searchQuery, setSearchQuery] = useState("");
			const [selectedCategory, setSelectedCategory] = useState("all");
			const [selectedStatus, setSelectedStatus] = useState("all");
			const [sortBy, setSortBy] = useState("name-asc");
			const [toast, setToast] = useState({
				message: "",
				type: "success"
			});
			const [isEditModalOpen, setIsEditModalOpen] = useState(false);
			const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
			const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
			const [activeProduct, setActiveProduct] = useState(null);
			const [isSaving, setIsSaving] = useState(false);
			const [isDeleting, setIsDeleting] = useState(false);
			const [form, setForm] = useState({
				nameTranslations: {
					AZ: "",
					EN: "",
					RU: ""
				},
				descriptionTranslations: {
					AZ: "",
					EN: "",
					RU: ""
				},
				price: "",
				discountPrice: "",
				category: "Main Drinks",
				imageUrl: "",
				iconUrl: "",
				isActive: true
			});
			const [langTab, setLangTab] = useState("AZ");
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const currentUserRole = cleanRole(user?.role || user?.Role);
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
			const getProductPriceInfo = (prod) => {
				if (!prod) return {
					basePrice: 0,
					discountPrice: null,
					hasDiscount: false,
					discountPercent: 0,
					effectivePrice: 0,
					formattedBasePrice: "0.00",
					formattedDiscountPrice: null,
					formattedEffectivePrice: "0.00"
				};
				const rawBase = prod.prices?.price !== undefined ? prod.prices.price : prod.price;
				const basePrice = typeof rawBase === "number" ? rawBase : parseFloat(rawBase) || 0;
				const rawDiscount = prod.prices?.discountPrice;
				const discountPrice = rawDiscount !== undefined && rawDiscount !== null && rawDiscount !== "" ? typeof rawDiscount === "number" ? rawDiscount : parseFloat(rawDiscount) : null;
				const hasDiscount = discountPrice !== null && !isNaN(discountPrice) && discountPrice > 0 && discountPrice < basePrice;
				const discountPercent = hasDiscount ? Math.round((1 - discountPrice / basePrice) * 100) : 0;
				const effectivePrice = hasDiscount ? discountPrice : basePrice;
				return {
					basePrice,
					discountPrice,
					hasDiscount,
					discountPercent,
					effectivePrice,
					formattedBasePrice: basePrice.toFixed(2),
					formattedDiscountPrice: discountPrice !== null && !isNaN(discountPrice) ? discountPrice.toFixed(2) : null,
					formattedEffectivePrice: effectivePrice.toFixed(2)
				};
			};
			const fetchProducts = useCallback(async () => {
				setLoading(true);
				try {
					let res = await fetchWithRefresh(`${apiUrl}/api/admin/products`);
					if (res.ok) {
						const data = await res.json();
						setProducts(Array.isArray(data) ? data : []);
					} else {
						res = await fetchWithRefresh(`${apiUrl}/api/products`);
						if (res.ok) {
							const data = await res.json();
							const flat = [];
							if (Array.isArray(data)) {
								data.forEach((group) => {
									if (Array.isArray(group.items)) {
										group.items.forEach((item) => {
											flat.push({
												...item,
												category: item.category || group.category || "Main Drinks"
											});
										});
									}
								});
							}
							setProducts(flat);
						} else {
							showToast("Failed to load products list", "error");
						}
					}
				} catch {
					showToast("Error connecting to server", "error");
				} finally {
					setLoading(false);
				}
			}, [apiUrl]);
			useEffect(() => {
				fetchProducts();
			}, [fetchProducts]);
			const allCategories = useMemo(() => {
				const set = new Set(DEFAULT_CATEGORIES);
				products.forEach((p) => {
					if (p.category) set.add(p.category);
				});
				return Array.from(set);
			}, [products]);
			const filteredProducts = useMemo(() => {
				return products.filter((item) => {
					const matchesSearch = !searchQuery.trim() || item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(searchQuery.toLowerCase());
					const matchesCat = selectedCategory === "all" || item.category?.toLowerCase() === selectedCategory.toLowerCase();
					const matchesStatus = selectedStatus === "all" || selectedStatus === "active" && item.isActive !== false || selectedStatus === "inactive" && item.isActive === false;
					return matchesSearch && matchesCat && matchesStatus;
				}).sort((a, b) => {
					const infoA = getProductPriceInfo(a);
					const infoB = getProductPriceInfo(b);
					const priceA = infoA.effectivePrice;
					const priceB = infoB.effectivePrice;
					const nameA = (a.name || "").toLowerCase();
					const nameB = (b.name || "").toLowerCase();
					switch (sortBy) {
						case "sold-desc": return (b.totalSold || 0) - (a.totalSold || 0);
						case "price-asc": return priceA - priceB;
						case "price-desc": return priceB - priceA;
						case "name-desc": return nameB.localeCompare(nameA);
						case "category": return (a.category || "").localeCompare(b.category || "") || nameA.localeCompare(nameB);
						case "name-asc":
						default: return nameA.localeCompare(nameB);
					}
				});
			}, [
				products,
				searchQuery,
				selectedCategory,
				selectedStatus,
				sortBy
			]);
			const stats = useMemo(() => {
				const total = products.length;
				const catCount = allCategories.length;
				const prices = products.map((p) => getProductPriceInfo(p).effectivePrice).filter((p) => p > 0);
				const avgPrice = prices.length > 0 ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : "0.00";
				const minPrice = prices.length > 0 ? Math.min(...prices).toFixed(2) : "0.00";
				const maxPrice = prices.length > 0 ? Math.max(...prices).toFixed(2) : "0.00";
				return {
					total,
					catCount,
					avgPrice,
					priceRange: `${minPrice} - ${maxPrice} ₼`
				};
			}, [products, allCategories]);
			const handleOpenCreate = () => {
				setActiveProduct(null);
				setLangTab("AZ");
				setForm({
					nameTranslations: {
						AZ: "",
						EN: "",
						RU: ""
					},
					descriptionTranslations: {
						AZ: "",
						EN: "",
						RU: ""
					},
					price: "",
					discountPrice: "",
					category: "Main Drinks",
					imageUrl: "",
					iconUrl: "",
					isActive: true
				});
				setIsEditModalOpen(true);
			};
			const handleOpenEdit = (product) => {
				setActiveProduct(product);
				setLangTab("AZ");
				const rawPrice = product.prices?.price ?? product.price;
				const rawDiscount = product.prices?.discountPrice;
				const nt = product.nameTranslations || {};
				const dt = product.descriptionTranslations || {};
				setForm({
					nameTranslations: {
						AZ: nt.AZ ?? nt.az ?? product.name ?? "",
						EN: nt.EN ?? nt.en ?? "",
						RU: nt.RU ?? nt.ru ?? ""
					},
					descriptionTranslations: {
						AZ: dt.AZ ?? dt.az ?? product.description ?? "",
						EN: dt.EN ?? dt.en ?? "",
						RU: dt.RU ?? dt.ru ?? ""
					},
					price: rawPrice !== undefined && rawPrice !== null ? String(rawPrice) : "",
					discountPrice: rawDiscount !== undefined && rawDiscount !== null ? String(rawDiscount) : "",
					category: product.category || "Main Drinks",
					imageUrl: product.images?.image || product.imageUrl || "",
					iconUrl: product.images?.icon || product.iconUrl || "",
					isActive: product.isActive !== false
				});
				setIsEditModalOpen(true);
			};
			const handleToggleActive = async (prod) => {
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/products/${prod.id}/toggle-active`, { method: "PATCH" });
					if (res.ok) {
						const data = await res.json().catch(() => ({}));
						showToast(data.message || "Product status updated.");
						setProducts((prev) => prev.map((p) => p.id === prod.id ? {
							...p,
							isActive: !p.isActive
						} : p));
					} else {
						showToast("Failed to update product status.", "error");
					}
				} catch {
					showToast("Network error while updating status.", "error");
				}
			};
			const handleOpenDetails = (product) => {
				setActiveProduct(product);
				setIsDetailsModalOpen(true);
			};
			const handleDeleteClick = (product) => {
				if (!isSuperAdmin) {
					showToast("Access denied. Only Super Admin can delete products.", "error");
					return;
				}
				setActiveProduct(product);
				setIsDeleteModalOpen(true);
			};
			const handleSaveProduct = async (e) => {
				e.preventDefault();
				const azName = form.nameTranslations.AZ.trim();
				if (!azName) {
					showToast("Azərbaycan dilində ad mütləqdir.", "error");
					setLangTab("AZ");
					return;
				}
				if (azName.length > 50) {
					showToast("Product name cannot exceed 50 characters.", "error");
					setLangTab("AZ");
					return;
				}
				if (form.nameTranslations.EN.trim().length > 50) {
					showToast("English name cannot exceed 50 characters.", "error");
					setLangTab("EN");
					return;
				}
				if (form.nameTranslations.RU.trim().length > 50) {
					showToast("Russian name cannot exceed 50 characters.", "error");
					setLangTab("RU");
					return;
				}
				if (form.descriptionTranslations.AZ.trim().length > 250) {
					showToast("AZ description cannot exceed 250 characters.", "error");
					setLangTab("AZ");
					return;
				}
				if (form.descriptionTranslations.EN.trim().length > 250) {
					showToast("EN description cannot exceed 250 characters.", "error");
					setLangTab("EN");
					return;
				}
				if (form.descriptionTranslations.RU.trim().length > 250) {
					showToast("RU description cannot exceed 250 characters.", "error");
					setLangTab("RU");
					return;
				}
				const numPrice = parseFloat(form.price);
				if (isNaN(numPrice) || numPrice < 0) {
					showToast("Please enter a valid regular price.", "error");
					return;
				}
				let numDiscountPrice = null;
				if (form.discountPrice && String(form.discountPrice).trim() !== "") {
					numDiscountPrice = parseFloat(form.discountPrice);
					if (isNaN(numDiscountPrice) || numDiscountPrice < 0) {
						showToast("Please enter a valid discount price.", "error");
						return;
					}
					if (numDiscountPrice >= numPrice) {
						showToast("Discount price must be less than regular price.", "error");
						return;
					}
				}
				setIsSaving(true);
				const payload = {
					name: azName,
					description: form.descriptionTranslations.AZ.trim(),
					nameTranslations: {
						AZ: form.nameTranslations.AZ.trim(),
						EN: form.nameTranslations.EN.trim(),
						RU: form.nameTranslations.RU.trim()
					},
					descriptionTranslations: {
						AZ: form.descriptionTranslations.AZ.trim(),
						EN: form.descriptionTranslations.EN.trim(),
						RU: form.descriptionTranslations.RU.trim()
					},
					price: numPrice,
					discountPrice: numDiscountPrice,
					prices: {
						price: numPrice,
						discountPrice: numDiscountPrice
					},
					category: form.category || "Main Drinks",
					imageUrl: form.imageUrl.trim(),
					iconUrl: form.iconUrl.trim(),
					isActive: form.isActive
				};
				try {
					const isEditing = Boolean(activeProduct?.id);
					const url = isEditing ? `${apiUrl}/api/admin/products/${activeProduct.id}` : `${apiUrl}/api/admin/products`;
					const method = isEditing ? "PUT" : "POST";
					const res = await fetchWithRefresh(url, {
						method,
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload)
					});
					if (res.ok) {
						showToast(isEditing ? "Product updated successfully." : "Product created successfully.");
						setIsEditModalOpen(false);
						fetchProducts();
					} else {
						const data = await res.json().catch(() => ({}));
						showToast(data.message || "Operation failed.", "error");
					}
				} catch {
					showToast("Connection error while saving product.", "error");
				} finally {
					setIsSaving(false);
				}
			};
			const handleConfirmDelete = async () => {
				if (!activeProduct?.id) return;
				setIsDeleting(true);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/products/${activeProduct.id}`, { method: "DELETE" });
					if (res.ok) {
						showToast("Product deleted successfully.");
						setIsDeleteModalOpen(false);
						setActiveProduct(null);
						fetchProducts();
					} else {
						const data = await res.json().catch(() => ({}));
						showToast(data.message || "Failed to delete product. Only Super Admin can delete products.", "error");
					}
				} catch {
					showToast("Network error while deleting product.", "error");
				} finally {
					setIsDeleting(false);
				}
			};
			const getCategoryClass = (cat) => {
				const c = (cat || "").toLowerCase();
				if (c.includes("main")) return "admin-products__category-badge--main";
				if (c.includes("special")) return "admin-products__category-badge--specialty";
				if (c.includes("dessert")) return "admin-products__category-badge--dessert";
				return "admin-products__category-badge--other";
			};
			return /* @__PURE__ */ __h(AdminLayout, null, /* @__PURE__ */ __h("div", { className: "admin-products" }, /* @__PURE__ */ __h(AnimatePresence, null, toast.message && /* @__PURE__ */ __h(motion.div, {
				className: `admin-products__toast ${toast.type === "error" ? "admin-products__toast--error" : ""}`,
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
			}, /* @__PURE__ */ __h("path", { d: "M20 6L9 17l-5-5" })), /* @__PURE__ */ __h("span", null, toast.message))), /* @__PURE__ */ __h("div", { className: "admin-products__header" }, /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h1", { className: "admin-products__title" }, "Products"), /* @__PURE__ */ __h("p", { className: "admin-products__subtitle" }, "Manage store catalog, prices, categories, and beverage/dessert items")), /* @__PURE__ */ __h("div", { className: "admin-products__header-actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-products__btn-primary",
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
			})), "Add Product"))), /* @__PURE__ */ __h("div", { className: "admin-products__stats" }, /* @__PURE__ */ __h("div", { className: "admin-products__stat-card" }, /* @__PURE__ */ __h("div", { className: "admin-products__stat-icon admin-products__stat-icon--total" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
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
			}))), /* @__PURE__ */ __h("div", { className: "admin-products__stat-info" }, /* @__PURE__ */ __h("span", { className: "admin-products__stat-value" }, stats.total), /* @__PURE__ */ __h("span", { className: "admin-products__stat-label" }, "Total Items"))), /* @__PURE__ */ __h("div", { className: "admin-products__stat-card" }, /* @__PURE__ */ __h("div", { className: "admin-products__stat-icon admin-products__stat-icon--categories" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("rect", {
				x: "3",
				y: "3",
				width: "7",
				height: "7",
				rx: "1"
			}), /* @__PURE__ */ __h("rect", {
				x: "14",
				y: "3",
				width: "7",
				height: "7",
				rx: "1"
			}), /* @__PURE__ */ __h("rect", {
				x: "3",
				y: "14",
				width: "7",
				height: "7",
				rx: "1"
			}), /* @__PURE__ */ __h("rect", {
				x: "14",
				y: "14",
				width: "7",
				height: "7",
				rx: "1"
			}))), /* @__PURE__ */ __h("div", { className: "admin-products__stat-info" }, /* @__PURE__ */ __h("span", { className: "admin-products__stat-value" }, stats.catCount), /* @__PURE__ */ __h("span", { className: "admin-products__stat-label" }, "Categories"))), /* @__PURE__ */ __h("div", { className: "admin-products__stat-card" }, /* @__PURE__ */ __h("div", { className: "admin-products__stat-icon admin-products__stat-icon--avg" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "1",
				x2: "12",
				y2: "23"
			}), /* @__PURE__ */ __h("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }))), /* @__PURE__ */ __h("div", { className: "admin-products__stat-info" }, /* @__PURE__ */ __h("span", { className: "admin-products__stat-value" }, stats.avgPrice, " ₼"), /* @__PURE__ */ __h("span", { className: "admin-products__stat-label" }, "Avg. Price"))), /* @__PURE__ */ __h("div", { className: "admin-products__stat-card" }, /* @__PURE__ */ __h("div", { className: "admin-products__stat-icon admin-products__stat-icon--range" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17" }), /* @__PURE__ */ __h("polyline", { points: "16 7 22 7 22 13" }))), /* @__PURE__ */ __h("div", { className: "admin-products__stat-info" }, /* @__PURE__ */ __h("span", { className: "admin-products__stat-value" }, stats.priceRange), /* @__PURE__ */ __h("span", { className: "admin-products__stat-label" }, "Price Range")))), /* @__PURE__ */ __h("div", { className: "admin-products__controls" }, /* @__PURE__ */ __h("div", { className: "admin-products__search" }, /* @__PURE__ */ __h("svg", {
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
				placeholder: "Search by product name or description...",
				value: searchQuery,
				onChange: (e) => setSearchQuery(e.target.value)
			}), searchQuery && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-products__search-clear",
				onClick: () => setSearchQuery("")
			}, "✕")), /* @__PURE__ */ __h("div", { className: "admin-products__filters" }, /* @__PURE__ */ __h("select", {
				className: "admin-products__select",
				value: selectedCategory,
				onChange: (e) => setSelectedCategory(e.target.value)
			}, /* @__PURE__ */ __h("option", { value: "all" }, "All Categories (", products.length, ")"), allCategories.map((cat) => {
				const count = products.filter((p) => (p.category || "").toLowerCase() === cat.toLowerCase()).length;
				return /* @__PURE__ */ __h("option", {
					key: cat,
					value: cat
				}, cat, " (", count, ")");
			})), /* @__PURE__ */ __h("select", {
				className: "admin-products__select",
				value: selectedStatus,
				onChange: (e) => setSelectedStatus(e.target.value)
			}, /* @__PURE__ */ __h("option", { value: "all" }, "All Status (", products.length, ")"), /* @__PURE__ */ __h("option", { value: "active" }, "Active (", products.filter((p) => p.isActive !== false).length, ")"), /* @__PURE__ */ __h("option", { value: "inactive" }, "Inactive (", products.filter((p) => p.isActive === false).length, ")")), /* @__PURE__ */ __h("select", {
				className: "admin-products__select",
				value: sortBy,
				onChange: (e) => setSortBy(e.target.value)
			}, /* @__PURE__ */ __h("option", { value: "name-asc" }, "Name (A-Z)"), /* @__PURE__ */ __h("option", { value: "name-desc" }, "Name (Z-A)"), /* @__PURE__ */ __h("option", { value: "sold-desc" }, "Units Sold (Most)"), /* @__PURE__ */ __h("option", { value: "price-asc" }, "Price (Low to High)"), /* @__PURE__ */ __h("option", { value: "price-desc" }, "Price (High to Low)"), /* @__PURE__ */ __h("option", { value: "category" }, "Category")))), loading ? /* @__PURE__ */ __h("div", { className: "admin-products__loading" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "admin-products__spinner"
			}), /* @__PURE__ */ __h("p", null, "Loading products catalog...")) : filteredProducts.length === 0 ? /* @__PURE__ */ __h("div", { className: "admin-products__empty" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
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
			})), /* @__PURE__ */ __h("h3", null, "No products found"), /* @__PURE__ */ __h("p", null, searchQuery || selectedCategory !== "all" ? "Try adjusting your search query or category filter." : "Your catalog is empty. Click \"Add Product\" above to create the first item.")) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", { className: "admin-products__table-wrapper" }, /* @__PURE__ */ __h("table", { className: "admin-products__table" }, /* @__PURE__ */ __h("thead", null, /* @__PURE__ */ __h("tr", null, /* @__PURE__ */ __h("th", null, "Product"), /* @__PURE__ */ __h("th", null, "Category"), /* @__PURE__ */ __h("th", null, "Price"), /* @__PURE__ */ __h("th", { className: "text-center" }, "Sold"), /* @__PURE__ */ __h("th", { className: "text-center" }, "Status"), /* @__PURE__ */ __h("th", null, "Actions"))), /* @__PURE__ */ __h("tbody", null, filteredProducts.map((prod, idx) => {
				const priceInfo = getProductPriceInfo(prod);
				const iconUrl = prod.images?.icon || prod.images?.image || prod.imageUrl;
				const actions = [
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
						onClick: () => handleOpenDetails(prod)
					},
					{
						label: "Edit Product",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2"
						}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })),
						onClick: () => handleOpenEdit(prod)
					},
					{
						label: prod.isActive !== false ? "Deactivate" : "Activate",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2"
						}, /* @__PURE__ */ __h("circle", {
							cx: "12",
							cy: "12",
							r: "10"
						}), prod.isActive !== false ? /* @__PURE__ */ __h("line", {
							x1: "4.93",
							y1: "4.93",
							x2: "19.07",
							y2: "19.07"
						}) : /* @__PURE__ */ __h("polyline", { points: "9 12 11 14 15 10" })),
						onClick: () => handleToggleActive(prod)
					},
					{
						label: "Delete Product",
						variant: "danger",
						locked: !isSuperAdmin,
						title: !isSuperAdmin ? "Only Super Admin can delete products" : "Delete",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2"
						}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })),
						onClick: () => handleDeleteClick(prod)
					}
				];
				return /* @__PURE__ */ __h("tr", { key: prod.id || idx }, /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-products__product-cell" }, /* @__PURE__ */ __h("div", { className: "admin-products__thumb-wrap" }, iconUrl ? /* @__PURE__ */ __h("img", {
					src: iconUrl,
					alt: prod.name,
					className: "admin-products__thumb-img",
					loading: "lazy",
					onError: (e) => {
						e.target.style.display = "none";
					}
				}) : /* @__PURE__ */ __h("span", { className: "admin-products__thumb-fallback" }, "☕")), /* @__PURE__ */ __h("div", { className: "admin-products__product-info" }, /* @__PURE__ */ __h("span", { className: "admin-products__product-name" }, prod.name)))), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("span", { className: `admin-products__category-badge ${getCategoryClass(prod.category)}` }, prod.category || "Main Drinks")), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h("div", { className: "admin-products__price-cell" }, priceInfo.hasDiscount ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", { className: "admin-products__price-strikethrough-wrap" }, /* @__PURE__ */ __h("span", { className: "admin-products__old-price" }, priceInfo.formattedBasePrice, " ₼"), /* @__PURE__ */ __h("span", { className: "admin-products__discount-tag" }, "-", priceInfo.discountPercent, "%")), /* @__PURE__ */ __h("span", { className: "admin-products__price-text admin-products__price-text--sale" }, priceInfo.formattedEffectivePrice, " ₼")) : /* @__PURE__ */ __h("span", { className: "admin-products__price-text" }, priceInfo.formattedBasePrice, " ₼"))), /* @__PURE__ */ __h("td", { className: "text-center" }, /* @__PURE__ */ __h("span", { className: "admin-products__sold-pill" }, prod.totalSold ?? 0)), /* @__PURE__ */ __h("td", { className: "text-center" }, /* @__PURE__ */ __h("span", {
					className: `admin-products__status-badge ${prod.isActive !== false ? "admin-products__status-badge--active" : "admin-products__status-badge--inactive"}`,
					onClick: () => handleToggleActive(prod),
					title: "Click to toggle status"
				}, prod.isActive !== false ? "Active" : "Inactive")), /* @__PURE__ */ __h("td", null, /* @__PURE__ */ __h(AdminTableActions, {
					actions,
					index: idx,
					total: filteredProducts.length
				})));
			})))), /* @__PURE__ */ __h("div", { className: "admin-products__mobile-grid" }, filteredProducts.map((prod, idx) => {
				const priceInfo = getProductPriceInfo(prod);
				const iconUrl = prod.images?.icon || prod.images?.image || prod.imageUrl;
				const actions = [
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
						onClick: () => handleOpenDetails(prod)
					},
					{
						label: "Edit Product",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2"
						}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })),
						onClick: () => handleOpenEdit(prod)
					},
					{
						label: prod.isActive !== false ? "Deactivate" : "Activate",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2"
						}, /* @__PURE__ */ __h("circle", {
							cx: "12",
							cy: "12",
							r: "10"
						}), prod.isActive !== false ? /* @__PURE__ */ __h("line", {
							x1: "4.93",
							y1: "4.93",
							x2: "19.07",
							y2: "19.07"
						}) : /* @__PURE__ */ __h("polyline", { points: "9 12 11 14 15 10" })),
						onClick: () => handleToggleActive(prod)
					},
					{
						label: "Delete Product",
						variant: "danger",
						locked: !isSuperAdmin,
						title: !isSuperAdmin ? "Only Super Admin can delete products" : "Delete",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2"
						}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })),
						onClick: () => handleDeleteClick(prod)
					}
				];
				return /* @__PURE__ */ __h("div", {
					key: prod.id || idx,
					className: "admin-products__mobile-card"
				}, /* @__PURE__ */ __h("div", { className: "admin-products__mobile-top" }, /* @__PURE__ */ __h("div", { className: "admin-products__thumb-wrap" }, iconUrl ? /* @__PURE__ */ __h("img", {
					src: iconUrl,
					alt: prod.name,
					className: "admin-products__thumb-img",
					loading: "lazy",
					onError: (e) => {
						e.target.style.display = "none";
					}
				}) : /* @__PURE__ */ __h("span", { className: "admin-products__thumb-fallback" }, "☕")), /* @__PURE__ */ __h("div", { className: "admin-products__mobile-main" }, /* @__PURE__ */ __h("div", { className: "admin-products__mobile-title-row" }, /* @__PURE__ */ __h("span", { className: "admin-products__product-name" }, prod.name), /* @__PURE__ */ __h("div", { className: "admin-products__mobile-price-wrap" }, priceInfo.hasDiscount ? /* @__PURE__ */ __h("div", { style: {
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					gap: 2
				} }, /* @__PURE__ */ __h("div", { style: {
					display: "flex",
					gap: 4,
					alignItems: "center"
				} }, /* @__PURE__ */ __h("span", { className: "admin-products__old-price" }, priceInfo.formattedBasePrice, " ₼"), /* @__PURE__ */ __h("span", { className: "admin-products__discount-tag" }, "-", priceInfo.discountPercent, "%")), /* @__PURE__ */ __h("span", {
					className: "admin-products__mobile-price",
					style: { color: "#4ade80" }
				}, priceInfo.formattedEffectivePrice, " ₼")) : /* @__PURE__ */ __h("span", { className: "admin-products__mobile-price" }, priceInfo.formattedBasePrice, " ₼"))), /* @__PURE__ */ __h("div", { className: "admin-products__mobile-tags" }, /* @__PURE__ */ __h("span", { className: `admin-products__category-badge ${getCategoryClass(prod.category)}` }, prod.category || "Main Drinks"), /* @__PURE__ */ __h("span", {
					className: `admin-products__status-badge ${prod.isActive !== false ? "admin-products__status-badge--active" : "admin-products__status-badge--inactive"}`,
					onClick: (e) => {
						e.stopPropagation();
						handleToggleActive(prod);
					},
					title: "Click to toggle status"
				}, prod.isActive !== false ? "Active" : "Inactive"), /* @__PURE__ */ __h("span", { className: "admin-products__mobile-sold-badge" }, prod.totalSold ?? 0, " sold"))), /* @__PURE__ */ __h("div", { className: "admin-products__mobile-actions" }, /* @__PURE__ */ __h(AdminTableActions, {
					actions,
					index: idx,
					total: filteredProducts.length
				}))));
			}))), /* @__PURE__ */ __h(AnimatePresence, null, isDetailsModalOpen && activeProduct && /* @__PURE__ */ __h("div", {
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
				className: "product-modal",
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
			}, /* @__PURE__ */ __h("div", { className: "product-modal__header" }, /* @__PURE__ */ __h("h3", null, "Product Details"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "product-modal__close-btn",
				onClick: () => setIsDetailsModalOpen(false)
			}, "✕")), /* @__PURE__ */ __h("div", { className: "product-modal__details" }, /* @__PURE__ */ __h("div", { className: "product-modal__details-top" }, activeProduct.images?.icon || activeProduct.images?.image || activeProduct.imageUrl ? /* @__PURE__ */ __h("img", {
				src: activeProduct.images?.icon || activeProduct.images?.image || activeProduct.imageUrl,
				alt: activeProduct.name,
				className: "product-modal__details-img"
			}) : /* @__PURE__ */ __h("div", {
				className: "product-modal__details-img",
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "2rem",
					background: "rgba(255,255,255,0.05)"
				}
			}, "☕"), /* @__PURE__ */ __h("div", { className: "product-modal__details-meta" }, /* @__PURE__ */ __h("h4", { style: {
				margin: 0,
				fontSize: "1.2rem",
				color: "#fff"
			} }, activeProduct.name), /* @__PURE__ */ __h("span", {
				className: `admin-products__category-badge ${getCategoryClass(activeProduct.category)}`,
				style: { alignSelf: "flex-start" }
			}, activeProduct.category || "Main Drinks"), (() => {
				const priceInfo = getProductPriceInfo(activeProduct);
				return /* @__PURE__ */ __h("div", { className: "product-modal__details-price" }, priceInfo.hasDiscount ? /* @__PURE__ */ __h("div", { style: {
					display: "flex",
					flexDirection: "column",
					gap: 2
				} }, /* @__PURE__ */ __h("span", { style: {
					fontSize: "0.85rem",
					color: "rgba(255,255,255,0.45)",
					textDecoration: "line-through",
					textDecorationColor: "#c5a059"
				} }, priceInfo.formattedBasePrice, " ₼"), /* @__PURE__ */ __h("div", { style: {
					display: "flex",
					alignItems: "center",
					gap: 8
				} }, /* @__PURE__ */ __h("span", { style: {
					color: "#4ade80",
					fontWeight: 700
				} }, priceInfo.formattedEffectivePrice, " ₼"), /* @__PURE__ */ __h("span", { className: "admin-products__discount-tag" }, "-", priceInfo.discountPercent, "%"))) : /* @__PURE__ */ __h("span", null, priceInfo.formattedBasePrice, " ₼"));
			})())), /* @__PURE__ */ __h("div", { className: "product-modal__details-box" }, /* @__PURE__ */ __h("span", null, "Translations"), [
				{
					code: "AZ",
					flag: "🇦🇿",
					label: "Azərbaycan"
				},
				{
					code: "EN",
					flag: "🇬🇧",
					label: "English"
				},
				{
					code: "RU",
					flag: "🇷🇺",
					label: "Русский"
				}
			].map(({ code, flag, label }) => {
				const nt = activeProduct.nameTranslations || {};
				const dt = activeProduct.descriptionTranslations || {};
				const name = nt[code] || nt[code.toLowerCase()] || "";
				const desc = dt[code] || dt[code.toLowerCase()] || "";
				const isEmpty = !name && !desc;
				return /* @__PURE__ */ __h("div", {
					key: code,
					style: {
						marginTop: 8,
						paddingTop: 8,
						borderTop: "1px solid rgba(255,255,255,0.06)"
					}
				}, /* @__PURE__ */ __h("div", { style: {
					display: "flex",
					alignItems: "center",
					gap: 6,
					marginBottom: 4
				} }, /* @__PURE__ */ __h("span", { style: { fontSize: "1rem" } }, flag), /* @__PURE__ */ __h("span", { style: {
					fontSize: "0.75rem",
					fontWeight: 700,
					color: "rgba(255,255,255,0.5)",
					textTransform: "uppercase"
				} }, label), code === "AZ" && /* @__PURE__ */ __h("span", { style: {
					fontSize: "0.68rem",
					color: "#c5a059",
					fontWeight: 700
				} }, "required")), isEmpty ? /* @__PURE__ */ __h("p", { style: {
					margin: 0,
					fontSize: "0.82rem",
					color: "rgba(255,255,255,0.25)",
					fontStyle: "italic"
				} }, "—") : /* @__PURE__ */ __h(__Fragment, null, name && /* @__PURE__ */ __h("p", { style: {
					margin: "0 0 2px",
					fontSize: "0.88rem",
					color: "#fff",
					fontWeight: 600
				} }, name), desc && /* @__PURE__ */ __h("p", { style: {
					margin: 0,
					fontSize: "0.82rem",
					color: "rgba(255,255,255,0.6)"
				} }, desc)));
			})), /* @__PURE__ */ __h("div", { className: "product-modal__details-row" }, /* @__PURE__ */ __h("div", { className: "product-modal__details-box" }, /* @__PURE__ */ __h("span", null, "Units Sold"), /* @__PURE__ */ __h("p", { style: {
				fontWeight: 700,
				color: "#fff",
				fontSize: "0.95rem"
			} }, activeProduct.totalSold ?? 0, " ", activeProduct.totalSold === 1 ? "unit" : "units")), /* @__PURE__ */ __h("div", { className: "product-modal__details-box" }, /* @__PURE__ */ __h("span", null, "Catalog Status"), /* @__PURE__ */ __h("div", { style: { marginTop: 4 } }, /* @__PURE__ */ __h("span", { className: `admin-products__status-badge ${activeProduct.isActive !== false ? "admin-products__status-badge--active" : "admin-products__status-badge--inactive"}` }, activeProduct.isActive !== false ? "Active (Visible in menu)" : "Inactive (Hidden)")))), /* @__PURE__ */ __h("div", { className: "product-modal__details-box" }, /* @__PURE__ */ __h("span", null, "Product ID"), /* @__PURE__ */ __h("p", { style: {
				fontFamily: "monospace",
				fontSize: "0.8rem",
				color: "#aaa"
			} }, activeProduct.id))), /* @__PURE__ */ __h("div", { className: "product-modal__footer" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-products__btn-secondary",
				onClick: () => setIsDetailsModalOpen(false)
			}, "Close"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-products__btn-primary",
				onClick: () => {
					setIsDetailsModalOpen(false);
					handleOpenEdit(activeProduct);
				}
			}, "Edit Product"))))), /* @__PURE__ */ __h(AnimatePresence, null, isEditModalOpen && /* @__PURE__ */ __h("div", {
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
				className: "product-modal",
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
			}, /* @__PURE__ */ __h("div", { className: "product-modal__header" }, /* @__PURE__ */ __h("h3", null, activeProduct ? "Edit Product" : "Add New Product"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "product-modal__close-btn",
				onClick: () => setIsEditModalOpen(false),
				disabled: isSaving
			}, "✕")), /* @__PURE__ */ __h("form", {
				className: "product-modal__form",
				onSubmit: handleSaveProduct
			}, /* @__PURE__ */ __h("div", { className: "product-modal__form-row" }, /* @__PURE__ */ __h("div", { className: "product-modal__form-group" }, /* @__PURE__ */ __h("div", { className: "product-modal__label-row" }, /* @__PURE__ */ __h("label", null, "Category *")), /* @__PURE__ */ __h("select", {
				value: form.category,
				onChange: (e) => setForm({
					...form,
					category: e.target.value
				})
			}, DEFAULT_CATEGORIES.map((c) => /* @__PURE__ */ __h("option", {
				key: c,
				value: c
			}, c)))), /* @__PURE__ */ __h("div", { className: "product-modal__form-group" }, /* @__PURE__ */ __h("div", { className: "product-modal__label-row" }, /* @__PURE__ */ __h("label", null, "Language *")), /* @__PURE__ */ __h("div", { className: "product-modal__lang-nav" }, [
				"AZ",
				"EN",
				"RU"
			].map((lang) => /* @__PURE__ */ __h("button", {
				key: lang,
				type: "button",
				className: `product-modal__lang-tab ${langTab === lang ? "product-modal__lang-tab--active" : ""}`,
				onClick: () => setLangTab(lang)
			}, lang === "AZ" && "🇦🇿", lang === "EN" && "🇬🇧", lang === "RU" && "🇷🇺", " ", lang, lang === "AZ" && /* @__PURE__ */ __h("span", { className: "product-modal__lang-required" }, "*"), lang !== "AZ" && !form.nameTranslations[lang].trim() && /* @__PURE__ */ __h("span", { className: "product-modal__lang-empty" }), lang !== "AZ" && form.nameTranslations[lang].trim() && /* @__PURE__ */ __h("span", { className: "product-modal__lang-filled" })))))), [
				"AZ",
				"EN",
				"RU"
			].map((lang) => langTab === lang && /* @__PURE__ */ __h("div", { key: lang }, /* @__PURE__ */ __h("div", { className: "product-modal__form-group" }, /* @__PURE__ */ __h("div", { className: "product-modal__label-row" }, /* @__PURE__ */ __h("label", null, lang === "AZ" && "Ad (Azərbaycan) *", lang === "EN" && "Name (English)", lang === "RU" && "Название (Русский)"), /* @__PURE__ */ __h("span", { className: `product-modal__counter ${form.nameTranslations[lang].length >= 50 ? "limit" : ""}` }, form.nameTranslations[lang].length, "/50")), /* @__PURE__ */ __h("input", {
				type: "text",
				placeholder: lang === "AZ" ? "məs. Ribay Steyk, Şef Salatı" : lang === "EN" ? "e.g. Ribeye Steak, Chef's Salad" : "напр. Рибай Стейк, Салат от шефа",
				value: form.nameTranslations[lang],
				maxLength: 50,
				onChange: (e) => setForm({
					...form,
					nameTranslations: {
						...form.nameTranslations,
						[lang]: e.target.value.slice(0, 50)
					}
				}),
				required: lang === "AZ"
			})), /* @__PURE__ */ __h("div", { className: "product-modal__form-group" }, /* @__PURE__ */ __h("div", { className: "product-modal__label-row" }, /* @__PURE__ */ __h("label", null, lang === "AZ" && "Təsvir (Azərbaycan)", lang === "EN" && "Description (English)", lang === "RU" && "Описание (Русский)"), /* @__PURE__ */ __h("span", { className: `product-modal__counter ${form.descriptionTranslations[lang].length >= 250 ? "limit" : ""}` }, form.descriptionTranslations[lang].length, "/250")), /* @__PURE__ */ __h("textarea", {
				placeholder: lang === "AZ" ? "Məhsulun dadı, inqrediyentlər haqqında..." : lang === "EN" ? "Enter product taste notes, ingredients..." : "Вкус, ингредиенты, особенности...",
				value: form.descriptionTranslations[lang],
				maxLength: 250,
				onChange: (e) => setForm({
					...form,
					descriptionTranslations: {
						...form.descriptionTranslations,
						[lang]: e.target.value.slice(0, 250)
					}
				})
			})))), /* @__PURE__ */ __h("div", { className: "product-modal__form-row" }, /* @__PURE__ */ __h("div", { className: "product-modal__form-group" }, /* @__PURE__ */ __h("div", { className: "product-modal__label-row" }, /* @__PURE__ */ __h("label", null, "Regular Price (₼) *")), /* @__PURE__ */ __h("input", {
				type: "number",
				step: "0.01",
				min: "0",
				placeholder: "e.g. 3.75",
				value: form.price,
				onChange: (e) => setForm({
					...form,
					price: e.target.value
				}),
				required: true
			})), /* @__PURE__ */ __h("div", { className: "product-modal__form-group" }, /* @__PURE__ */ __h("div", { className: "product-modal__label-row" }, /* @__PURE__ */ __h("label", null, "Discount Price (₼)"), form.price && form.discountPrice && parseFloat(form.discountPrice) < parseFloat(form.price) && parseFloat(form.discountPrice) > 0 && /* @__PURE__ */ __h("span", { className: "product-modal__discount-badge" }, "-", Math.round((1 - parseFloat(form.discountPrice) / parseFloat(form.price)) * 100), "%")), /* @__PURE__ */ __h("input", {
				type: "number",
				step: "0.01",
				min: "0",
				placeholder: "Optional sale price",
				value: form.discountPrice,
				onChange: (e) => setForm({
					...form,
					discountPrice: e.target.value
				})
			}))), /* @__PURE__ */ __h("div", { className: "product-modal__form-group" }, /* @__PURE__ */ __h("label", null, "Image URL (Photo)"), /* @__PURE__ */ __h("div", { className: "product-modal__image-preview-wrap" }, form.imageUrl ? /* @__PURE__ */ __h("img", {
				src: form.imageUrl,
				alt: "Image Preview",
				className: "product-modal__image-preview",
				onError: (e) => {
					e.target.style.display = "none";
				}
			}) : /* @__PURE__ */ __h("div", {
				className: "product-modal__image-preview",
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "1.4rem"
				}
			}, "☕"), /* @__PURE__ */ __h("div", { className: "product-modal__image-actions" }, /* @__PURE__ */ __h("input", {
				type: "url",
				placeholder: "https://... photo URL",
				value: form.imageUrl,
				onChange: (e) => setForm({
					...form,
					imageUrl: e.target.value
				})
			})))), /* @__PURE__ */ __h("div", { className: "product-modal__form-group" }, /* @__PURE__ */ __h("label", null, "Icon URL (Transparent WebP)"), /* @__PURE__ */ __h("div", { className: "product-modal__image-preview-wrap" }, form.iconUrl ? /* @__PURE__ */ __h("img", {
				src: form.iconUrl,
				alt: "Icon Preview",
				className: "product-modal__image-preview",
				onError: (e) => {
					e.target.style.display = "none";
				}
			}) : /* @__PURE__ */ __h("div", {
				className: "product-modal__image-preview",
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "1.4rem"
				}
			}, "☕"), /* @__PURE__ */ __h("div", { className: "product-modal__image-actions" }, /* @__PURE__ */ __h("input", {
				type: "url",
				placeholder: "https://... icon URL",
				value: form.iconUrl,
				onChange: (e) => setForm({
					...form,
					iconUrl: e.target.value
				})
			})))), /* @__PURE__ */ __h("div", { className: "product-modal__footer" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-products__btn-secondary",
				onClick: () => setIsEditModalOpen(false),
				disabled: isSaving
			}, "Cancel"), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "admin-products__btn-primary",
				disabled: isSaving
			}, isSaving ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Saving...",
				style: {
					width: 16,
					height: 16
				}
			}), "Saving...") : activeProduct ? "Save Changes" : "Create Product")))))), /* @__PURE__ */ __h(AnimatePresence, null, isDeleteModalOpen && activeProduct && /* @__PURE__ */ __h("div", {
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
				className: "product-modal",
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
			}, /* @__PURE__ */ __h("div", { className: "product-modal__header" }, /* @__PURE__ */ __h("h3", null, "Delete Product?"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "product-modal__close-btn",
				onClick: () => setIsDeleteModalOpen(false),
				disabled: isDeleting
			}, "✕")), /* @__PURE__ */ __h("div", { className: "product-modal__delete-box" }, activeProduct.images?.icon || activeProduct.images?.image || activeProduct.imageUrl ? /* @__PURE__ */ __h("img", {
				src: activeProduct.images?.icon || activeProduct.images?.image || activeProduct.imageUrl,
				alt: activeProduct.name,
				style: {
					width: 64,
					height: 64,
					borderRadius: 12,
					objectFit: "cover",
					background: "rgba(0, 0, 0, 0.45)",
					padding: 0,
					border: "1px solid rgba(255, 255, 255, 0.1)"
				}
			}) : /* @__PURE__ */ __h("div", { className: "product-modal__delete-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }))), /* @__PURE__ */ __h("p", { className: "product-modal__delete-text" }, "Are you sure you want to delete ", /* @__PURE__ */ __h("strong", null, "\"", activeProduct.name, "\""), "?"), /* @__PURE__ */ __h("div", { className: "product-modal__delete-warning" }, "This action will permanently delete this product from the menu catalog and database.")), /* @__PURE__ */ __h("div", { className: "product-modal__footer" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-products__btn-secondary",
				onClick: () => setIsDeleteModalOpen(false),
				disabled: isDeleting
			}, "Cancel"), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "admin-products__btn-primary",
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
			}), "Deleting...") : "Delete Product")))))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Products; } });
	});
	//#endregion

	var entryExports = __require("components/AdminPages/Products/Products.js");
	__pages["admin-products"] = entryExports.default || entryExports;
})();
