import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useMemo } from "../../../utils/runtime.js";
import AnimatedModalWrapper from "../../Elements/AnimatedModalWrapper.js";
import OrderSelectModal from "./OrderSelectModal.js";
import { REVIEW_CATEGORIES, formatBakuDateTime } from "./reviewsData.js";
import { fetchWithRefresh } from "../../../utils/fetchWithRefresh.js";
import { useLang } from "../../../utils/useLang.js";
import { getReviewsTranslation, getReviewCategoryLabel, getReviewRatingLabel } from "./Lang.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
const loaderIconRed = "/assets/icons/loader-animated-red.svg";
const WriteReviewModal = ({ isOpen, onClose, onSubmitReview }) => {
	const lang = useLang();
	const t = (id) => getReviewsTranslation(lang, id);
	const [rating, setRating] = useState(5);
	const [hoverRating, setHoverRating] = useState(0);
	const [category, setCategory] = useState("Delivery");
	const [comment, setComment] = useState("");
	const [eligibleOrders, setEligibleOrders] = useState([]);
	const [selectedOrderId, setSelectedOrderId] = useState("");
	const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
	const [loadingOrders, setLoadingOrders] = useState(true);
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);
	useEffect(() => {
		if (!isOpen) return;
		setRating(5);
		setHoverRating(0);
		setCategory("Delivery");
		setComment("");
		setError("");
		setSubmitting(false);
		setLoadingOrders(true);
		setIsOrderModalOpen(false);
		const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
		fetchWithRefresh(`${apiUrl}/api/reviews/eligible-orders`).then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				setEligibleOrders(data || []);
				if (data && data.length > 0) {
					setSelectedOrderId(data[0].id);
				} else {
					setSelectedOrderId("");
				}
			} else {
				setEligibleOrders([]);
				setSelectedOrderId("");
			}
		}).catch(() => {
			setEligibleOrders([]);
			setSelectedOrderId("");
		}).finally(() => {
			setLoadingOrders(false);
		});
	}, [isOpen]);
	const handleClose = () => {
		if (submitting) return;
		setError("");
		setIsOrderModalOpen(false);
		onClose();
	};
	const selectedOrder = useMemo(() => {
		return eligibleOrders.find((o) => o.id === selectedOrderId) || null;
	}, [eligibleOrders, selectedOrderId]);
	const activeRating = hoverRating || rating;
	const currentLabel = getReviewRatingLabel(lang, activeRating);
	const sliderPercentage = (activeRating - 1) / 4 * 100;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (submitting) return;
		setError("");
		if (!selectedOrderId) {
			setError("Please select a completed order for this review.");
			return;
		}
		if (!comment.trim() || comment.trim().length < 5) {
			setError("Please write at least 5 characters for your review.");
			return;
		}
		if (comment.trim().length > 300) {
			setError("Review comment cannot exceed 300 characters.");
			return;
		}
		setSubmitting(true);
		try {
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const response = await fetchWithRefresh(`${apiUrl}/api/reviews`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					orderId: selectedOrderId,
					category,
					rating: Number(rating),
					comment: comment.trim(),
					language: lang === "ru" ? "Russian" : lang === "az" ? "Azerbaijani" : "English"
				})
			});
			const data = await response.json();
			if (response.ok) {
				onSubmitReview(data);
				onClose();
			} else {
				setError(data.message || "Failed to submit review. Please try again.");
			}
		} catch (err) {
			setError("A network error occurred. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h(AnimatedModalWrapper, {
		isOpen,
		onClose: handleClose,
		targetBorderRadius: "24px"
	}, /* @__PURE__ */ __h("div", {
		className: "review-modal",
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "review-modal__close",
		onClick: handleClose,
		disabled: submitting,
		"aria-label": "Close modal"
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
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
	}))), /* @__PURE__ */ __h("div", { className: "review-modal__header" }, /* @__PURE__ */ __h("div", { className: "review-modal__icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" }))), /* @__PURE__ */ __h("h2", {
		className: "review-modal__title",
		"data-id": "reviews_modal_title"
	}, t("reviews_modal_title")), /* @__PURE__ */ __h("p", {
		className: "review-modal__desc",
		"data-id": "reviews_modal_desc"
	}, t("reviews_modal_desc"))), loadingOrders ? /* @__PURE__ */ __h("div", { className: "review-modal__loader" }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading",
		className: "review-modal__spinner"
	}), /* @__PURE__ */ __h("span", { "data-id": "reviews_modal_loading_orders" }, t("reviews_modal_loading_orders"))) : eligibleOrders.length === 0 ? /* @__PURE__ */ __h("div", { className: "review-modal__empty-orders" }, /* @__PURE__ */ __h("div", { className: "review-modal__empty-icon" }, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.5"
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
	}))), /* @__PURE__ */ __h("h3", { "data-id": "reviews_modal_empty_title" }, t("reviews_modal_empty_title")), /* @__PURE__ */ __h("p", { "data-id": "reviews_modal_empty_desc" }, t("reviews_modal_empty_desc")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm review-modal__btn--close",
		onClick: handleClose,
		"data-id": "reviews_modal_cancel"
	}, t("reviews_modal_cancel"))) : /* @__PURE__ */ __h("form", {
		className: "review-modal__form",
		onSubmit: handleSubmit
	}, error && /* @__PURE__ */ __h("div", { className: "review-modal__error" }, /* @__PURE__ */ __h("svg", {
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
	})), /* @__PURE__ */ __h("span", null, error)), /* @__PURE__ */ __h("div", { className: "review-modal__field review-modal__field--rating-top" }, /* @__PURE__ */ __h("div", { className: "review-modal__rating-header" }, /* @__PURE__ */ __h("span", {
		className: "review-modal__label-title",
		"data-id": "reviews_modal_rating_label"
	}, t("reviews_modal_rating_label"), " ", /* @__PURE__ */ __h("span", { className: "review-modal__required" }, "*")), /* @__PURE__ */ __h("div", { className: "review-modal__rating-pill" }, /* @__PURE__ */ __h("span", { className: "review-modal__rating-val" }, Math.round(rating)), /* @__PURE__ */ __h("svg", {
		className: "review-modal__rating-star",
		viewBox: "0 0 24 24",
		width: "14.5",
		height: "14.5",
		fill: "#c5a059",
		stroke: "#c5a059",
		strokeWidth: "1"
	}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })), /* @__PURE__ */ __h("span", { className: "review-modal__rating-sep" }, "·"), /* @__PURE__ */ __h("span", { className: "review-modal__rating-text" }, currentLabel))), /* @__PURE__ */ __h("div", { className: "review-modal__slider-wrapper" }, /* @__PURE__ */ __h("input", {
		type: "range",
		min: "1",
		max: "5",
		step: "1",
		value: rating,
		onChange: (e) => {
			setRating(Number(e.target.value));
		},
		className: "review-modal__slider",
		style: { background: `linear-gradient(90deg, #c5a059 0%, #c5a059 ${sliderPercentage}%, rgba(255, 255, 255, 0.12) ${sliderPercentage}%)` },
		"aria-label": "Slide to adjust rating"
	}), /* @__PURE__ */ __h("div", { className: "review-modal__slider-ticks" }, /* @__PURE__ */ __h("span", {
		className: rating >= 1 ? "active" : "",
		onClick: () => setRating(1)
	}, "1"), /* @__PURE__ */ __h("span", {
		className: rating >= 2 ? "active" : "",
		onClick: () => setRating(2)
	}, "2"), /* @__PURE__ */ __h("span", {
		className: rating >= 3 ? "active" : "",
		onClick: () => setRating(3)
	}, "3"), /* @__PURE__ */ __h("span", {
		className: rating >= 4 ? "active" : "",
		onClick: () => setRating(4)
	}, "4"), /* @__PURE__ */ __h("span", {
		className: rating >= 5 ? "active" : "",
		onClick: () => setRating(5)
	}, "5")))), /* @__PURE__ */ __h("div", { className: "review-modal__row" }, /* @__PURE__ */ __h("div", { className: "review-modal__field review-modal__col" }, /* @__PURE__ */ __h("label", {
		htmlFor: "rev-category",
		"data-id": "reviews_modal_category"
	}, t("reviews_modal_category"), " ", /* @__PURE__ */ __h("span", { className: "review-modal__required" }, "*")), /* @__PURE__ */ __h("select", {
		id: "rev-category",
		value: category,
		onChange: (e) => setCategory(e.target.value),
		disabled: submitting
	}, REVIEW_CATEGORIES.filter((c) => c.id !== "all").map((c) => /* @__PURE__ */ __h("option", {
		key: c.id,
		value: c.id
	}, c.icon, " ", getReviewCategoryLabel(lang, c.id))))), /* @__PURE__ */ __h("div", { className: "review-modal__field review-modal__col" }, /* @__PURE__ */ __h("label", { "data-id": "reviews_modal_select_order" }, t("reviews_modal_select_order"), " ", /* @__PURE__ */ __h("span", { className: "review-modal__required" }, "*")), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "review-modal__order-trigger",
		onClick: () => setIsOrderModalOpen(true),
		disabled: submitting,
		title: "Click to choose completed order"
	}, selectedOrder ? /* @__PURE__ */ __h("div", { className: "review-modal__order-trigger-info" }, /* @__PURE__ */ __h("span", { className: "review-modal__order-trigger-id" }, "#", selectedOrder.id.slice(0, 8).toUpperCase()), /* @__PURE__ */ __h("span", { className: "review-modal__order-trigger-price" }, Number(selectedOrder.totalAmount || 0).toFixed(2), " ₼")) : /* @__PURE__ */ __h("span", {
		className: "review-modal__order-trigger-placeholder",
		"data-id": "reviews_modal_choose_order"
	}, t("reviews_modal_choose_order")), /* @__PURE__ */ __h("svg", {
		className: "review-modal__order-trigger-chevron",
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("polyline", { points: "6 9 12 15 18 9" }))))), /* @__PURE__ */ __h("div", { className: "review-modal__field" }, /* @__PURE__ */ __h("div", { className: "review-modal__label-row" }, /* @__PURE__ */ __h("label", {
		htmlFor: "rev-comment",
		"data-id": "reviews_modal_your_review"
	}, t("reviews_modal_your_review"), " ", /* @__PURE__ */ __h("span", { className: "review-modal__required" }, "*")), /* @__PURE__ */ __h("span", { className: `review-modal__counter ${comment.length >= 300 ? "limit" : ""}` }, comment.length, "/300")), /* @__PURE__ */ __h("textarea", {
		id: "rev-comment",
		className: "review-modal__textarea--tall",
		placeholder: t("reviews_modal_placeholder"),
		"data-id": "reviews_modal_placeholder",
		value: comment,
		onChange: (e) => {
			setComment(e.target.value.slice(0, 300));
			if (error) setError("");
		},
		maxLength: 300,
		rows: 7,
		required: true,
		disabled: submitting
	})), /* @__PURE__ */ __h("div", { className: "review-modal__actions" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cta-btn sm review-modal__btn review-modal__btn--cancel",
		onClick: handleClose,
		disabled: submitting,
		"data-id": "reviews_modal_cancel"
	}, t("reviews_modal_cancel")), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "cta-btn sm review-modal__btn review-modal__btn--submit",
		disabled: submitting || !selectedOrderId || !comment.trim(),
		"data-id": "reviews_modal_submit"
	}, submitting ? /* @__PURE__ */ __h("span", { className: "review-btn-loader" }, /* @__PURE__ */ __h("img", {
		src: loaderIconRed,
		alt: "Submitting...",
		style: {
			width: "18px",
			height: "18px"
		}
	}), t("reviews_modal_submitting")) : t("reviews_modal_submit")))))), /* @__PURE__ */ __h(OrderSelectModal, {
		isOpen: isOrderModalOpen,
		onClose: () => setIsOrderModalOpen(false),
		orders: eligibleOrders,
		selectedOrderId,
		onSelectOrder: (id) => setSelectedOrderId(id)
	}));
};
export default WriteReviewModal;
