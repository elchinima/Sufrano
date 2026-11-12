(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/PublicPages/Reviews/Reviews.js
	__define("components/PublicPages/Reviews/Reviews.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useMemo, useCallback } = __imp_0;
		const { useSearchParams, useNavigate } = __require("utils/router.js");
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const __imp_1 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Footer/Footer.js");
		const Footer = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const __imp_3 = __require("components/PublicPages/Reviews/WriteReviewModal.js");
		const WriteReviewModal = __imp_3.default !== undefined ? __imp_3.default : __imp_3;
		const __imp_4 = __require("components/Elements/DeleteConfirmModal.js");
		const DeleteConfirmModal = __imp_4.default !== undefined ? __imp_4.default : __imp_4;
		const { useAuth } = __require("context/AuthContext.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { REVIEW_CATEGORIES, getAvatarGradient, formatBakuDateTime, formatTimeAgo, sortReviewsByLanguage } = __require("components/PublicPages/Reviews/reviewsData.js");
		const { useLang } = __require("utils/useLang.js");
		const { getReviewsTranslation, getReviewCategoryLabel } = __require("components/PublicPages/Reviews/Lang.js");
		const { getUserAvatarUrl, handleAvatarError } = __require("utils/avatar.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const Reviews = () => {
			const lang = useLang();
			const t = (dataId) => getReviewsTranslation(lang, dataId);
			const [searchParams, setSearchParams] = useSearchParams();
			const navigate = useNavigate();
			const { user, isAuthenticated } = useAuth();
			const [reviews, setReviews] = useState([]);
			const [loading, setLoading] = useState(true);
			const initialFilter = searchParams.get("filter") === "my" ? "my" : searchParams.get("filter") || "all";
			const [selectedCategory, setSelectedCategory] = useState(initialFilter);
			const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
			const [reviewToDelete, setReviewToDelete] = useState(null);
			const [isDeleting, setIsDeleting] = useState(false);
			const [toastMessage, setToastMessage] = useState(null);
			const [initialLikedReviews, setInitialLikedReviews] = useState(() => new Set());
			const fetchReviews = useCallback(async () => {
				try {
					const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
					const res = await fetchWithRefresh(`${apiUrl}/api/reviews`);
					if (res.ok) {
						const data = await res.json();
						const activeReviews = (data || []).filter((r) => r.userIsActive !== false);
						setReviews(activeReviews);
						const initialSet = new Set(activeReviews.filter((r) => r.userLiked).map((r) => r.id));
						setInitialLikedReviews(initialSet);
					}
				} catch (err) {
					console.error("Failed to load reviews:", err);
				} finally {
					setLoading(false);
				}
			}, []);
			useEffect(() => {
				const filterParam = searchParams.get("filter");
				if (filterParam === "my") {
					setSelectedCategory("my");
				} else if (filterParam) {
					setSelectedCategory(filterParam);
				} else {
					setSelectedCategory("all");
				}
			}, [searchParams]);
			useEffect(() => {
				document.title = "Süfrano";
				window.scrollTo(0, 0);
				fetchReviews();
				const handleOpenModal = () => {
					if (!isAuthenticated) {
						navigate("/login");
					} else {
						setIsWriteModalOpen(true);
					}
				};
				window.addEventListener("open-write-review-modal", handleOpenModal);
				return () => window.removeEventListener("open-write-review-modal", handleOpenModal);
			}, [isAuthenticated, fetchReviews]);
			const showToast = (msg) => {
				setToastMessage(msg);
				setTimeout(() => {
					setToastMessage(null);
				}, 4e3);
			};
			const handleSelectCategory = (catId) => {
				setSelectedCategory(catId);
				if (catId === "my") {
					setSearchParams({ filter: "my" });
				} else if (catId === "all") {
					setSearchParams({});
				} else {
					setSearchParams({ filter: catId.toLowerCase() });
				}
			};
			const handleToggleLike = async (review) => {
				if (!isAuthenticated) {
					navigate("/login");
					return;
				}
				if (review.isOwner) {
					showToast("⚠️ You cannot like your own review.");
					return;
				}
				if (review.userLiked) {
					if (!initialLikedReviews.has(review.id)) {
						return;
					}
					try {
						const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
						const res = await fetchWithRefresh(`${apiUrl}/api/reviews/${review.id}/like`, { method: "POST" });
						if (res.ok) {
							const data = await res.json();
							setReviews((prev) => prev.map((r) => r.id === review.id ? {
								...r,
								likes: data.likes,
								userLiked: false
							} : r));
							setInitialLikedReviews((prev) => {
								const next = new Set(prev);
								next.delete(review.id);
								return next;
							});
						}
					} catch {
						showToast("Failed to update like. Please try again.");
					}
				} else {
					try {
						const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
						const res = await fetchWithRefresh(`${apiUrl}/api/reviews/${review.id}/like`, { method: "POST" });
						if (res.ok) {
							const data = await res.json();
							setReviews((prev) => prev.map((r) => r.id === review.id ? {
								...r,
								likes: data.likes,
								userLiked: true
							} : r));
							setInitialLikedReviews((prev) => {
								const next = new Set(prev);
								next.delete(review.id);
								return next;
							});
						} else {
							const errData = await res.json().catch(() => ({}));
							showToast(errData.message || "Failed to like review.");
						}
					} catch {
						showToast("Failed to like review. Please try again.");
					}
				}
			};
			const handleConfirmDelete = async () => {
				if (!reviewToDelete) return;
				setIsDeleting(true);
				try {
					const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
					const res = await fetchWithRefresh(`${apiUrl}/api/reviews/${reviewToDelete.id}`, { method: "DELETE" });
					if (res.ok) {
						setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
						setReviewToDelete(null);
						showToast("🗑️ Review deleted. You can now leave a new review for this order whenever you like.");
					} else {
						const errData = await res.json().catch(() => ({}));
						showToast(errData.message || "Failed to delete review.");
					}
				} catch {
					showToast("Failed to delete review. Please try again.");
				} finally {
					setIsDeleting(false);
				}
			};
			const handleAddNewReview = (newReview) => {
				if (newReview && newReview.userIsActive !== false) {
					setReviews((prev) => [newReview, ...prev]);
				}
				showToast("🎉 Thank you! Your review was published successfully.");
			};
			const myReviewsCount = useMemo(() => {
				return reviews.filter((r) => r.isOwner || user && (r.userId === user.id || r.userId === user.Id)).length;
			}, [reviews, user]);
			const filteredReviews = useMemo(() => {
				let list = reviews;
				if (selectedCategory === "my") {
					list = reviews.filter((r) => r.isOwner || user && (r.userId === user.id || r.userId === user.Id));
				} else if (selectedCategory !== "all") {
					list = reviews.filter((r) => (r.category || "").toLowerCase() === selectedCategory.toLowerCase());
				}
				return sortReviewsByLanguage(list, lang);
			}, [
				reviews,
				selectedCategory,
				user,
				lang
			]);
			const averageRating = useMemo(() => {
				if (!reviews || reviews.length === 0) return "0.00";
				const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
				return (sum / reviews.length).toFixed(2);
			}, [reviews]);
			const renderStars = (ratingCount) => {
				const num = Number(ratingCount || 5);
				const formattedRating = num % 1 === 0 ? num : num.toFixed(1);
				return /* @__PURE__ */ __h("div", {
					className: "stars-wrapper",
					title: `${ratingCount} out of 5 stars`
				}, /* @__PURE__ */ __h("div", { className: "stars-row stars-row--desktop" }, [
					1,
					2,
					3,
					4,
					5
				].map((star) => /* @__PURE__ */ __h("svg", {
					key: star,
					viewBox: "0 0 24 24",
					width: "16",
					height: "16",
					fill: star <= Math.round(num) ? "#c5a059" : "rgba(255,255,255,0.2)",
					stroke: star <= Math.round(num) ? "#c5a059" : "rgba(255,255,255,0.2)",
					strokeWidth: "1"
				}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })))), /* @__PURE__ */ __h("div", { className: "stars-compact--mobile" }, /* @__PURE__ */ __h("span", { className: "rating-num" }, formattedRating), /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "14",
					height: "14",
					fill: "#c5a059",
					stroke: "#c5a059",
					strokeWidth: "1"
				}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }))));
			};
			const getCategoryBadge = (catName) => {
				const found = REVIEW_CATEGORIES.find((c) => c.id.toLowerCase() === (catName || "").toLowerCase());
				if (found && found.id !== "all") {
					return /* @__PURE__ */ __h("span", { className: "review-category-chip" }, found.icon, " ", getReviewCategoryLabel(lang, found.id));
				}
				return null;
			};
			return /* @__PURE__ */ __h(motion.div, {
				className: "reviews-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "reviews-main" }, /* @__PURE__ */ __h("div", { className: "reviews-ambient-glow reviews-ambient-glow--1" }), /* @__PURE__ */ __h("div", { className: "reviews-ambient-glow reviews-ambient-glow--2" }), /* @__PURE__ */ __h("div", { className: "reviews-container" }, /* @__PURE__ */ __h("div", { className: "reviews-hero" }, /* @__PURE__ */ __h("h1", { "data-id": "reviews_hero_title" }, t("reviews_hero_title")), /* @__PURE__ */ __h("p", { "data-id": "reviews_hero_subtitle" }, t("reviews_hero_subtitle")), /* @__PURE__ */ __h("div", { className: "reviews-overall-badge" }, /* @__PURE__ */ __h("div", { className: "overall-score" }, /* @__PURE__ */ __h("span", { className: "score-num" }, averageRating), /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "16",
				height: "16",
				fill: "#c5a059",
				stroke: "#c5a059",
				strokeWidth: "1"
			}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }))), /* @__PURE__ */ __h("span", { className: "score-divider" }, "·"), /* @__PURE__ */ __h("span", {
				className: "score-count",
				"data-id": "reviews_score_count"
			}, reviews.length, " ", reviews.length === 1 ? t("reviews_count_singular") : t("reviews_count_plural")))), /* @__PURE__ */ __h("div", { className: "reviews-categories-bar" }, isAuthenticated && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "reviews-category-btn reviews-category-btn--my",
				onClick: () => navigate("/reviews"),
				title: "Go to My Reviews page"
			}, /* @__PURE__ */ __h("span", { className: "cat-icon" }, "👤"), /* @__PURE__ */ __h("span", { "data-id": "reviews_my_reviews" }, t("reviews_my_reviews")), myReviewsCount > 0 && /* @__PURE__ */ __h("span", { className: "cat-count cat-count--my" }, myReviewsCount)), REVIEW_CATEGORIES.map((cat) => {
				const count = cat.id === "all" ? reviews.length : reviews.filter((r) => (r.category || "").toLowerCase() === cat.id.toLowerCase()).length;
				return /* @__PURE__ */ __h("button", {
					key: cat.id,
					type: "button",
					className: `reviews-category-btn ${selectedCategory === (cat.id === "all" ? "all" : cat.id.toLowerCase()) || selectedCategory === cat.id ? "active" : ""}`,
					onClick: () => handleSelectCategory(cat.id)
				}, /* @__PURE__ */ __h("span", { className: "cat-icon" }, cat.icon), /* @__PURE__ */ __h("span", { "data-id": `reviews_cat_${cat.id.toLowerCase()}` }, getReviewCategoryLabel(lang, cat.id)), count > 0 && /* @__PURE__ */ __h("span", { className: "cat-count" }, count));
			})), loading ? /* @__PURE__ */ __h("div", { className: "reviews-loading-wrapper" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading reviews",
				className: "reviews-loading-spinner"
			}), /* @__PURE__ */ __h("span", { "data-id": "reviews_loading" }, t("reviews_loading"))) : filteredReviews.length === 0 ? /* @__PURE__ */ __h("div", { className: "reviews-empty-state" }, /* @__PURE__ */ __h("div", { className: "reviews-empty-icon" }, selectedCategory === "my" ? /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.75"
			}, /* @__PURE__ */ __h("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })) : /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }))), /* @__PURE__ */ __h("h2", { "data-id": "reviews_empty_title" }, selectedCategory === "my" ? t("reviews_empty_my_title") : t("reviews_empty_all_title")), /* @__PURE__ */ __h("p", { "data-id": "reviews_empty_desc" }, selectedCategory === "my" ? t("reviews_empty_my_desc") : selectedCategory === "all" ? t("reviews_empty_all_desc") : t("reviews_empty_cat_desc")), selectedCategory === "my" && /* @__PURE__ */ __h("div", { className: "reviews-empty-actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm reviews-empty-cta",
				onClick: () => {
					if (!isAuthenticated) navigate("/login");
					else setIsWriteModalOpen(true);
				},
				"data-id": "reviews_write_btn"
			}, t("reviews_write_btn")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm reviews-empty-cta reviews-empty-cta--secondary",
				onClick: () => navigate("/orders"),
				"data-id": "reviews_card_view_order"
			}, t("reviews_card_view_order")))) : /* @__PURE__ */ __h("div", { className: "reviews-grid" }, /* @__PURE__ */ __h(AnimatePresence, { mode: "popLayout" }, filteredReviews.map((review, index) => {
				const isOwner = !!(review.isOwner || user && (review.userId === user.id || review.userId === user.Id));
				const authorFirstName = isOwner && user?.name ? user.name.split(" ")[0] : (review.author || "Customer").split(" ")[0];
				const isLiked = !!review.userLiked;
				const likesCount = review.likes || 0;
				return /* @__PURE__ */ __h(motion.div, {
					key: review.id,
					className: `review-card ${isOwner ? "review-card--owner" : ""}`,
					layout: true,
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						scale: .95
					},
					transition: {
						duration: .35,
						delay: Math.min(index * .04, .25)
					}
				}, /* @__PURE__ */ __h("div", { className: "review-card-top" }, /* @__PURE__ */ __h("div", { className: "author-info" }, /* @__PURE__ */ __h("div", {
					className: "author-avatar",
					style: { background: getAvatarGradient(review.id || review.userId || review.author) }
				}, /* @__PURE__ */ __h("img", {
					src: getUserAvatarUrl(review.avatarUrl),
					alt: authorFirstName,
					className: "author-avatar-img",
					onError: handleAvatarError
				})), /* @__PURE__ */ __h("div", { className: "author-details" }, /* @__PURE__ */ __h("div", { className: "author-name-row" }, /* @__PURE__ */ __h("span", { className: "author-name" }, authorFirstName), isOwner && /* @__PURE__ */ __h("span", { className: "review-owner-tag" }, "You")), /* @__PURE__ */ __h("span", {
					className: "review-date",
					title: "Time in Baku (UTC+4)"
				}, formatBakuDateTime(review.createdAt)))), /* @__PURE__ */ __h("div", { className: "review-card-top-right" }, /* @__PURE__ */ __h("div", { className: "review-card-rating" }, renderStars(review.rating)), isOwner && /* @__PURE__ */ __h("button", {
					type: "button",
					className: "review-card-delete-btn",
					onClick: () => setReviewToDelete(review),
					"aria-label": "Delete review",
					title: "Delete your review"
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "15",
					height: "15",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }), /* @__PURE__ */ __h("line", {
					x1: "10",
					y1: "11",
					x2: "10",
					y2: "17"
				}), /* @__PURE__ */ __h("line", {
					x1: "14",
					y1: "11",
					x2: "14",
					y2: "17"
				}))))), getCategoryBadge(review.category) && /* @__PURE__ */ __h("div", { className: "review-card-category-row" }, getCategoryBadge(review.category)), /* @__PURE__ */ __h("div", { className: "review-body" }, /* @__PURE__ */ __h("p", { className: "review-card-comment" }, review.comment)), /* @__PURE__ */ __h("div", { className: "review-card-footer" }, isOwner ? /* @__PURE__ */ __h("div", { className: "review-card-owner-footer" }, /* @__PURE__ */ __h("div", {
					className: "review-my-likes-badge",
					title: "Helpful likes received from customers"
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "15",
					height: "15",
					fill: "#c5a059",
					stroke: "#c5a059",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })), /* @__PURE__ */ __h("span", { "data-id": "reviews_likes_received" }, likesCount, " ", likesCount === 1 ? t("reviews_likes_singular") : t("reviews_likes_plural"))), /* @__PURE__ */ __h("button", {
					type: "button",
					className: "review-card-delete-text-btn",
					onClick: () => setReviewToDelete(review),
					"data-id": "reviews_card_delete"
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "13",
					height: "13",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })), /* @__PURE__ */ __h("span", null, t("reviews_card_delete")))) : /* @__PURE__ */ __h("button", {
					type: "button",
					className: `like-button ${isLiked ? "liked" : ""}`,
					onClick: () => handleToggleLike(review),
					"aria-label": t("reviews_helpful"),
					title: t("reviews_helpful"),
					"data-id": "reviews_helpful"
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "16",
					height: "16",
					fill: isLiked ? "#c5a059" : "none",
					stroke: isLiked ? "#c5a059" : "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })), /* @__PURE__ */ __h("span", null, t("reviews_helpful"), " (", likesCount, ")"))));
			}))))), /* @__PURE__ */ __h(WriteReviewModal, {
				isOpen: isWriteModalOpen,
				onClose: () => setIsWriteModalOpen(false),
				onSubmitReview: handleAddNewReview
			}), /* @__PURE__ */ __h(DeleteConfirmModal, {
				isOpen: !!reviewToDelete,
				onClose: () => !isDeleting && setReviewToDelete(null),
				onConfirm: handleConfirmDelete,
				title: t("reviews_delete_modal_title"),
				text: t("reviews_delete_modal_text"),
				confirmLabel: t("reviews_card_delete"),
				loading: isDeleting
			}), /* @__PURE__ */ __h("div", { className: "reviews-toast-container" }, /* @__PURE__ */ __h(AnimatePresence, null, toastMessage && /* @__PURE__ */ __h(motion.div, {
				className: "reviews-toast-notification",
				initial: {
					opacity: 0,
					y: 30,
					scale: .95
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: 20,
					scale: .95
				},
				transition: {
					type: "spring",
					damping: 20,
					stiffness: 300
				}
			}, /* @__PURE__ */ __h("span", null, toastMessage)))), /* @__PURE__ */ __h(Footer, null));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Reviews; } });
	});
	//#endregion

	var entryExports = __require("components/PublicPages/Reviews/Reviews.js");
	__pages["reviews"] = entryExports.default || entryExports;
})();
