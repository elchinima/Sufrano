(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/UserPages/Reviews/Reviews.js
	__define("components/UserPages/Reviews/Reviews.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useMemo, useCallback } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { Link, useNavigate } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { useProfileSecurity } = __require("context/ProfileSecurityContext.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const __imp_1 = __require("components/Elements/Navbar.js");
		const Navbar = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Footer/Footer.js");
		const Footer = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const __imp_3 = __require("components/Elements/DeleteConfirmModal.js");
		const DeleteConfirmModal = __imp_3.default !== undefined ? __imp_3.default : __imp_3;
		const __imp_4 = __require("components/PublicPages/Reviews/WriteReviewModal.js");
		const WriteReviewModal = __imp_4.default !== undefined ? __imp_4.default : __imp_4;
		const { REVIEW_CATEGORIES, getAvatarGradient, formatBakuDateTime, sortReviewsByLanguage } = __require("components/PublicPages/Reviews/reviewsData.js");
		const { useLang } = __require("utils/useLang.js");
		const { getUserAvatarUrl, handleAvatarError } = __require("utils/avatar.js");
		const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
		const Reviews = () => {
			const lang = useLang();
			const { user } = useAuth();
			const { isProfileUnlocked, requireProfileAccess } = useProfileSecurity();
			const navigate = useNavigate();
			const [reviews, setReviews] = useState([]);
			const [loading, setLoading] = useState(true);
			const [error, setError] = useState(null);
			const [selectedCategory, setSelectedCategory] = useState("all");
			const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
			const [reviewToDelete, setReviewToDelete] = useState(null);
			const [isDeleting, setIsDeleting] = useState(false);
			const [toastMessage, setToastMessage] = useState(null);
			const fetchMyReviews = useCallback(async () => {
				setLoading(true);
				setError(null);
				try {
					let res = await fetchWithRefresh(`${apiUrl}/api/reviews/my`);
					if (!res.ok) {
						res = await fetchWithRefresh(`${apiUrl}/api/reviews`);
					}
					if (!res.ok) {
						throw new Error("Failed to load your reviews.");
					}
					const data = await res.json();
					const list = (Array.isArray(data) ? data : []).filter((r) => r.userIsActive !== false);
					const myReviews = list.filter((r) => r.isOwner || user && (r.userId === user.id || r.userId === user.Id));
					setReviews(myReviews);
				} catch (err) {
					console.error("Error fetching personal reviews:", err);
					setError(err.message || "Could not load your reviews. Please try again.");
				} finally {
					setLoading(false);
				}
			}, [user]);
			useEffect(() => {
				document.title = "My Reviews · Süfrano";
				window.scrollTo(0, 0);
				if (user) {
					fetchMyReviews();
				}
			}, [user, fetchMyReviews]);
			const showToast = (msg) => {
				setToastMessage(msg);
				setTimeout(() => {
					setToastMessage(null);
				}, 4e3);
			};
			const handleConfirmDelete = async () => {
				if (!reviewToDelete) return;
				setIsDeleting(true);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/reviews/${reviewToDelete.id}`, { method: "DELETE" });
					if (res.ok) {
						setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
						setReviewToDelete(null);
						showToast("🗑️ Review deleted successfully. You can write a new review for this order whenever you like.");
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
				setReviews((prev) => [newReview, ...prev]);
				showToast("🎉 Thank you! Your review has been submitted and is pending AI moderation.");
			};
			const filteredReviews = useMemo(() => {
				let list = reviews;
				if (selectedCategory !== "all") {
					list = reviews.filter((r) => (r.category || "").toLowerCase() === selectedCategory.toLowerCase());
				}
				return sortReviewsByLanguage(list, lang);
			}, [
				reviews,
				selectedCategory,
				lang
			]);
			const totalLikes = useMemo(() => {
				return reviews.reduce((sum, r) => sum + (Number(r.likes) || 0), 0);
			}, [reviews]);
			const averageRating = useMemo(() => {
				if (!reviews || reviews.length === 0) return "0.00";
				const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
				return (sum / reviews.length).toFixed(2);
			}, [reviews]);
			const renderStars = (ratingCount) => {
				const num = Number(ratingCount || 5);
				const formattedRating = num % 1 === 0 ? num : num.toFixed(1);
				return /* @__PURE__ */ __h("div", {
					className: "user-reviews-stars",
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
					width: "15",
					height: "15",
					fill: star <= Math.round(num) ? "#c5a059" : "rgba(255,255,255,0.2)",
					stroke: star <= Math.round(num) ? "#c5a059" : "rgba(255,255,255,0.2)",
					strokeWidth: "1"
				}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })))), /* @__PURE__ */ __h("div", { className: "stars-compact--mobile" }, /* @__PURE__ */ __h("span", { className: "rating-num" }, formattedRating), /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "13",
					height: "13",
					fill: "#c5a059",
					stroke: "#c5a059",
					strokeWidth: "1"
				}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }))));
			};
			const getCategoryBadge = (catName) => {
				const found = REVIEW_CATEGORIES.find((c) => c.id.toLowerCase() === (catName || "").toLowerCase());
				if (found && found.id !== "all") {
					return /* @__PURE__ */ __h("span", { className: "user-review-chip" }, found.icon, " ", found.label);
				}
				return null;
			};
			const getStatusBadge = (statusStr) => {
				const s = String(statusStr || "Published").toLowerCase();
				if (s === "pending") {
					return /* @__PURE__ */ __h("span", {
						className: "user-review-status-badge user-review-status-badge--pending",
						title: "Review is being checked by AI moderation"
					}, /* @__PURE__ */ __h("svg", {
						viewBox: "0 0 24 24",
						width: "12",
						height: "12",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2"
					}, /* @__PURE__ */ __h("circle", {
						cx: "12",
						cy: "12",
						r: "10"
					}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 16 14" })), "Pending");
				}
				if (s === "verification") {
					return /* @__PURE__ */ __h("span", {
						className: "user-review-status-badge user-review-status-badge--verification",
						title: "Review is pending manual verification"
					}, /* @__PURE__ */ __h("svg", {
						viewBox: "0 0 24 24",
						width: "12",
						height: "12",
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
					})), "Verification");
				}
				if (s === "cancelled") {
					return /* @__PURE__ */ __h("span", {
						className: "user-review-status-badge user-review-status-badge--cancelled",
						title: "Review cancelled"
					}, /* @__PURE__ */ __h("svg", {
						viewBox: "0 0 24 24",
						width: "12",
						height: "12",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2"
					}, /* @__PURE__ */ __h("circle", {
						cx: "12",
						cy: "12",
						r: "10"
					}), /* @__PURE__ */ __h("line", {
						x1: "15",
						y1: "9",
						x2: "9",
						y2: "15"
					}), /* @__PURE__ */ __h("line", {
						x1: "9",
						y1: "9",
						x2: "15",
						y2: "15"
					})), "Cancelled");
				}
				return /* @__PURE__ */ __h("span", {
					className: "user-review-status-badge user-review-status-badge--published",
					title: "Review published and public"
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "12",
					height: "12",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), "Published");
			};
			return /* @__PURE__ */ __h(motion.div, {
				className: "user-reviews-page",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 }
			}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "user-reviews-main" }, /* @__PURE__ */ __h("div", { className: "user-reviews-ambient-glow user-reviews-ambient-glow--1" }), /* @__PURE__ */ __h("div", { className: "user-reviews-ambient-glow user-reviews-ambient-glow--2" }), /* @__PURE__ */ __h("div", { className: "user-reviews-container" }, /* @__PURE__ */ __h(motion.div, {
				className: "user-reviews-hero",
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .5,
					ease: [
						.16,
						1,
						.3,
						1
					]
				}
			}, /* @__PURE__ */ __h("div", { className: "user-reviews-hero__top" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "user-reviews-back-btn",
				onClick: () => {
					if (isProfileUnlocked) {
						navigate("/profile");
					} else {
						requireProfileAccess("/profile");
					}
				},
				title: "Back to Profile"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "18",
				height: "18",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("line", {
				x1: "19",
				y1: "12",
				x2: "5",
				y2: "12"
			}), /* @__PURE__ */ __h("polyline", { points: "12 19 5 12 12 5" })), /* @__PURE__ */ __h("span", null, "Profile"))), /* @__PURE__ */ __h("h1", null, "My Reviews"), /* @__PURE__ */ __h("p", { className: "user-reviews-hero__desc" }, "View your feedback on completed orders, check community reactions, and manage your reviews"), reviews.length > 0 && /* @__PURE__ */ __h("div", { className: "user-reviews-stats-bar" }, /* @__PURE__ */ __h("div", { className: "user-reviews-stat-card" }, /* @__PURE__ */ __h("span", { className: "stat-label" }, "Total Reviews"), /* @__PURE__ */ __h("strong", { className: "stat-value" }, reviews.length)), /* @__PURE__ */ __h("div", { className: "user-reviews-stat-card" }, /* @__PURE__ */ __h("span", { className: "stat-label" }, "Total Likes Received"), /* @__PURE__ */ __h("strong", { className: "stat-value text-red" }, "❤️ ", totalLikes)), /* @__PURE__ */ __h("div", { className: "user-reviews-stat-card" }, /* @__PURE__ */ __h("span", { className: "stat-label" }, "Avg Rating Given"), /* @__PURE__ */ __h("strong", { className: "stat-value text-amber" }, "★ ", averageRating))), /* @__PURE__ */ __h("div", { className: "user-reviews-hero-actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm user-reviews-hero-btn",
				onClick: () => setIsWriteModalOpen(true)
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "16",
				height: "16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })), /* @__PURE__ */ __h("span", null, "Write a Review")), /* @__PURE__ */ __h(Link, {
				to: "/review",
				className: "cta-btn sm user-reviews-hero-btn user-reviews-hero-btn--secondary"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "16",
				height: "16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ __h("circle", {
				cx: "9",
				cy: "7",
				r: "4"
			}), /* @__PURE__ */ __h("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), /* @__PURE__ */ __h("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })), /* @__PURE__ */ __h("span", null, "All Community Reviews")))), reviews.length > 1 && /* @__PURE__ */ __h("div", { className: "user-reviews-categories-bar" }, REVIEW_CATEGORIES.map((cat) => {
				const count = cat.id === "all" ? reviews.length : reviews.filter((r) => (r.category || "").toLowerCase() === cat.id.toLowerCase()).length;
				return /* @__PURE__ */ __h("button", {
					key: cat.id,
					type: "button",
					className: `user-reviews-cat-btn ${selectedCategory === cat.id ? "active" : ""}`,
					onClick: () => setSelectedCategory(cat.id)
				}, /* @__PURE__ */ __h("span", null, cat.icon), /* @__PURE__ */ __h("span", null, cat.label), count > 0 && /* @__PURE__ */ __h("span", { className: "cat-count" }, count));
			})), loading ? /* @__PURE__ */ __h("div", { className: "user-reviews-loading" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "user-reviews-spinner"
			}), /* @__PURE__ */ __h("p", null, "Loading your reviews...")) : error ? /* @__PURE__ */ __h("div", { className: "user-reviews-error" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "#c5a059",
				strokeWidth: "2",
				width: "36",
				height: "36"
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
			})), /* @__PURE__ */ __h("p", null, error), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm",
				onClick: () => fetchMyReviews()
			}, "Try Again")) : filteredReviews.length === 0 ? /* @__PURE__ */ __h(motion.div, {
				className: "user-reviews-empty",
				initial: {
					opacity: 0,
					scale: .95
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				transition: { duration: .35 }
			}, /* @__PURE__ */ __h("div", { className: "user-reviews-empty-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.75"
			}, /* @__PURE__ */ __h("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }))), /* @__PURE__ */ __h("h2", null, selectedCategory === "all" ? "No reviews written yet" : "No reviews in this category"), /* @__PURE__ */ __h("p", null, selectedCategory === "all" ? "Share your experience with Süfrano after completing an order to help fellow guests!" : "You do not have any reviews submitted under this category."), /* @__PURE__ */ __h("div", { className: "user-reviews-empty-actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm user-reviews-empty-btn",
				onClick: () => setIsWriteModalOpen(true)
			}, "Write a Review"), /* @__PURE__ */ __h(Link, {
				to: "/orders",
				className: "cta-btn sm user-reviews-empty-btn user-reviews-empty-btn--secondary"
			}, "View Orders"))) : /* @__PURE__ */ __h("div", { className: "user-reviews-grid" }, /* @__PURE__ */ __h(AnimatePresence, { mode: "popLayout" }, filteredReviews.map((review, index) => {
				const authorFirstName = user?.name ? user.name.split(" ")[0] : (review.author || "You").split(" ")[0];
				const likesCount = Number(review.likes) || 0;
				const avatarUrl = getUserAvatarUrl(user?.profilePictureUrl || user?.ProfilePictureUrl || review.avatarUrl);
				return /* @__PURE__ */ __h(motion.div, {
					key: review.id,
					className: "user-review-card",
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
				}, /* @__PURE__ */ __h("div", { className: "user-review-card__header" }, /* @__PURE__ */ __h("div", { className: "user-review-card__author" }, /* @__PURE__ */ __h("div", {
					className: "user-review-card__avatar",
					style: { background: getAvatarGradient(review.id || user?.id || authorFirstName) }
				}, /* @__PURE__ */ __h("img", {
					src: avatarUrl,
					alt: authorFirstName,
					className: "user-review-card__avatar-img",
					onError: handleAvatarError
				})), /* @__PURE__ */ __h("div", { className: "user-review-card__author-details" }, /* @__PURE__ */ __h("div", { className: "user-review-card__name-row" }, /* @__PURE__ */ __h("span", { className: "user-review-card__name" }, authorFirstName), /* @__PURE__ */ __h("span", { className: "user-review-card__you-badge" }, "You"), getStatusBadge(review.status)), /* @__PURE__ */ __h("span", {
					className: "user-review-card__date",
					title: "Time in Baku (UTC+4)"
				}, formatBakuDateTime(review.createdAt)))), /* @__PURE__ */ __h("div", { className: "user-review-card__header-right" }, /* @__PURE__ */ __h("div", { className: "user-review-card__rating" }, renderStars(review.rating)), /* @__PURE__ */ __h("button", {
					type: "button",
					className: "user-review-card__delete-icon-btn",
					onClick: () => setReviewToDelete(review),
					title: "Delete this review",
					"aria-label": "Delete this review"
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
				}))))), getCategoryBadge(review.category) && /* @__PURE__ */ __h("div", { className: "user-review-card__category-row" }, getCategoryBadge(review.category)), /* @__PURE__ */ __h("div", { className: "user-review-card__body" }, /* @__PURE__ */ __h("p", { className: "user-review-card__comment" }, review.comment)), /* @__PURE__ */ __h("div", { className: "user-review-card__footer" }, /* @__PURE__ */ __h("div", {
					className: "user-review-card__likes-stat",
					title: "Total helpful likes from other customers"
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "15",
					height: "15",
					fill: "#c5a059",
					stroke: "#c5a059",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })), /* @__PURE__ */ __h("span", null, likesCount, " ", likesCount === 1 ? "like received" : "likes received")), /* @__PURE__ */ __h("button", {
					type: "button",
					className: "user-review-card__delete-btn",
					onClick: () => setReviewToDelete(review)
				}, /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					width: "14",
					height: "14",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })), /* @__PURE__ */ __h("span", null, "Delete Review"))));
			}))))), /* @__PURE__ */ __h(WriteReviewModal, {
				isOpen: isWriteModalOpen,
				onClose: () => setIsWriteModalOpen(false),
				onSubmitReview: handleAddNewReview
			}), /* @__PURE__ */ __h(DeleteConfirmModal, {
				isOpen: !!reviewToDelete,
				onClose: () => !isDeleting && setReviewToDelete(null),
				onConfirm: handleConfirmDelete,
				title: "Delete Review",
				text: "Are you sure you want to delete your review? You will be able to write a new review for this order again.",
				confirmLabel: "Delete Review",
				loading: isDeleting
			}), /* @__PURE__ */ __h("div", { className: "user-reviews-toast-container" }, /* @__PURE__ */ __h(AnimatePresence, null, toastMessage && /* @__PURE__ */ __h(motion.div, {
				className: "user-reviews-toast",
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

	var entryExports = __require("components/UserPages/Reviews/Reviews.js");
	__pages["user-reviews"] = entryExports.default || entryExports;
})();
