import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useState, useEffect, useRef, useMemo } from "../../../utils/runtime.js";
import { motion } from "../../../utils/motion.js";
import { Link } from "../../../utils/router.js";
import Footer from "../../Footer/Footer.js";
import Navbar from "../../Elements/Navbar.js";
import FitText from "../../Elements/FitText.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
const productCardLoader = "/assets/icons/product-card-loader.svg";
const addIcon = "/assets/icons/add.svg";
const successIcon = "/assets/icons/success-animated.svg";
import { useBasket } from "../../../context/BasketContext.js";
import useSequentialImageLoader from "../../../utils/useSequentialImageLoader.js";
import { useLang } from "../../../utils/useLang.js";
import { getCatalogTranslation, getCategoryTitle } from "./Lang.js";
const CategorySection = ({ categoryObj, index, onAddItem, addedAnimations, loadedImages, lang }) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const scrollRef = useRef(null);
	const handleScroll = () => {
		if (!scrollRef.current) return;
		const container = scrollRef.current;
		const card = container.querySelector(".catalog-card");
		if (!card) return;
		const style = window.getComputedStyle(container);
		const gap = parseFloat(style.gap) || 16;
		const cardWidth = card.offsetWidth + gap;
		if (cardWidth > 0) {
			const scrollPos = container.scrollLeft;
			const newIndex = Math.round(scrollPos / cardWidth);
			setActiveIndex(Math.max(0, Math.min(newIndex, categoryObj.items.length - 1)));
		}
	};
	const scrollToIndex = (idx) => {
		if (!scrollRef.current) return;
		const container = scrollRef.current;
		const card = container.querySelector(".catalog-card");
		if (!card) return;
		const style = window.getComputedStyle(container);
		const gap = parseFloat(style.gap) || 16;
		const cardWidth = card.offsetWidth + gap;
		container.scrollTo({
			left: idx * cardWidth,
			behavior: "smooth"
		});
	};
	return /* @__PURE__ */ __h(motion.section, {
		key: index,
		className: "menu-category-section",
		initial: {
			opacity: 0,
			y: 50
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			amount: .1
		},
		transition: {
			duration: .5,
			delay: index * .1
		}
	}, /* @__PURE__ */ __h("h2", {
		className: "category-title",
		"data-id": "catalog_category_title"
	}, getCategoryTitle(lang, categoryObj.category)), /* @__PURE__ */ __h("div", {
		className: "catalog-grid",
		ref: scrollRef,
		onScroll: handleScroll
	}, categoryObj.items.map((item) => {
		const rawBasePrice = item.prices?.price ?? item.price;
		const basePriceNum = typeof rawBasePrice === "number" ? rawBasePrice : parseFloat(rawBasePrice) || 0;
		const rawDiscountPrice = item.prices?.discountPrice;
		const discountPriceNum = rawDiscountPrice !== undefined && rawDiscountPrice !== null && rawDiscountPrice !== "" ? typeof rawDiscountPrice === "number" ? rawDiscountPrice : parseFloat(rawDiscountPrice) : null;
		const hasDiscount = discountPriceNum !== null && !isNaN(discountPriceNum) && discountPriceNum > 0 && discountPriceNum < basePriceNum;
		const discountPercent = hasDiscount ? Math.round((1 - discountPriceNum / basePriceNum) * 100) : 0;
		const effectivePriceFormatted = hasDiscount ? discountPriceNum.toFixed(2) : basePriceNum.toFixed(2);
		const oldPriceFormatted = basePriceNum.toFixed(2);
		return /* @__PURE__ */ __h("div", {
			key: item.id,
			className: "catalog-card"
		}, /* @__PURE__ */ __h("div", { className: "card-image-container" }, item.images?.image || item.imageUrl ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
			src: item.images?.image || item.imageUrl,
			alt: item.name,
			loading: "lazy",
			onLoad: () => loadedImages.markLoaded?.(item.id),
			className: `item-image ${loadedImages[item.id] ? "loaded" : ""}`
		}), !loadedImages[item.id] && /* @__PURE__ */ __h("div", { className: "item-image-placeholder" }, /* @__PURE__ */ __h("span", { className: "placeholder-icon" }, item.icon || "☕"))) : /* @__PURE__ */ __h("div", { className: "item-image-placeholder" }, /* @__PURE__ */ __h("span", { className: "placeholder-icon" }, item.icon || "☕"))), /* @__PURE__ */ __h("div", { className: "card-content" }, /* @__PURE__ */ __h("div", { className: "card-header" }, /* @__PURE__ */ __h(FitText, {
			as: "h3",
			className: "item-name",
			maxFontSize: 1.3,
			minFontSize: .78
		}, item.name), /* @__PURE__ */ __h("div", { className: "item-price-container" }, hasDiscount && /* @__PURE__ */ __h("div", { className: "item-old-price-pill" }, /* @__PURE__ */ __h("span", { className: "discount-tag" }, "-", discountPercent, "%"), /* @__PURE__ */ __h("span", { className: "old-price" }, oldPriceFormatted, " ₼")), /* @__PURE__ */ __h("span", { className: "item-price" }, effectivePriceFormatted, " ₼"))), /* @__PURE__ */ __h("p", { className: "item-description" }, item.description)), /* @__PURE__ */ __h("button", {
			className: "add-to-cart-btn",
			onClick: () => onAddItem(item.id),
			"aria-label": getCatalogTranslation(lang, "catalog_add_btn"),
			"data-id": "catalog_add_btn"
		}, addedAnimations[item.id] ? /* @__PURE__ */ __h("object", {
			type: "image/svg+xml",
			data: successIcon,
			"aria-label": getCatalogTranslation(lang, "catalog_added_label"),
			"data-id": "catalog_added_label"
		}) : /* @__PURE__ */ __h("img", {
			src: addIcon,
			alt: getCatalogTranslation(lang, "catalog_add_btn")
		})));
	})), categoryObj.items.length > 1 && /* @__PURE__ */ __h("div", { className: "carousel-dots" }, categoryObj.items.map((_, i) => /* @__PURE__ */ __h("button", {
		key: i,
		className: `dot ${i === activeIndex ? "active" : ""}`,
		onClick: () => scrollToIndex(i),
		"aria-label": `Go to slide ${i + 1}`
	}))));
};
const Catalog = () => {
	const lang = useLang();
	const t = (dataId) => getCatalogTranslation(lang, dataId);
	const [addedAnimations, setAddedAnimations] = useState({});
	const [menuData, setMenuData] = useState([]);
	const [isMenuLoading, setIsMenuLoading] = useState(true);
	const { addItem, getItemQuantity } = useBasket();
	const [skeletonCount, setSkeletonCount] = useState(() => {
		if (typeof window === "undefined") return 3;
		const w = window.innerWidth;
		if (w < 768) return 1;
		if (w < 1150) return 2;
		return 3;
	});
	useEffect(() => {
		const handleResize = () => {
			const w = window.innerWidth;
			if (w < 768) setSkeletonCount(1);
			else if (w < 1150) setSkeletonCount(2);
			else setSkeletonCount(3);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const orderedItems = useMemo(() => {
		return menuData.flatMap((cat) => cat.items || []);
	}, [menuData]);
	const loadedImages = useSequentialImageLoader(orderedItems);
	const handleAddItem = (productId) => {
		const currentQty = getItemQuantity(productId);
		if (currentQty >= 100) {
			return;
		}
		addItem(productId);
		setAddedAnimations((prev) => ({
			...prev,
			[productId]: true
		}));
		setTimeout(() => {
			setAddedAnimations((prev) => {
				const next = { ...prev };
				delete next[productId];
				return next;
			});
		}, 1500);
	};
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
				const response = await fetch(`${apiUrl}/api/products?lang=${lang}`);
				if (response.ok) {
					const data = await response.json();
					setMenuData(data);
				}
			} catch (err) {
				console.error("Failed to fetch products:", err);
			} finally {
				setIsMenuLoading(false);
			}
		};
		fetchProducts();
	}, [lang]);
	return /* @__PURE__ */ __h(motion.div, {
		className: "catalog-page",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .3 }
	}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("main", { className: "catalog-main" }, /* @__PURE__ */ __h("div", { className: "catalog-hero" }, /* @__PURE__ */ __h("h1", { "data-id": "catalog_hero_title" }, t("catalog_hero_title")), /* @__PURE__ */ __h("p", { "data-id": "catalog_hero_subtitle" }, t("catalog_hero_subtitle"))), /* @__PURE__ */ __h("div", { className: "menu-categories" }, isMenuLoading ? /* @__PURE__ */ __h("div", { className: "catalog-grid skeleton-grid" }, Array.from({ length: skeletonCount }).map((_, i) => /* @__PURE__ */ __h("div", {
		key: i,
		className: "catalog-skeleton-card"
	}, /* @__PURE__ */ __h("img", {
		src: productCardLoader,
		alt: "Loading product",
		className: "skeleton-svg-img"
	})))) : menuData.map((categoryObj, index) => /* @__PURE__ */ __h(CategorySection, {
		key: index,
		categoryObj,
		index,
		onAddItem: handleAddItem,
		addedAnimations,
		loadedImages,
		lang
	})))), /* @__PURE__ */ __h(Footer, null));
};
export default Catalog;
