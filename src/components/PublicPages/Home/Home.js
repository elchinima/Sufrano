import { __h, __Fragment } from '../../../utils/runtime.js';
import React, { useRef, useEffect, useState, useMemo } from "../../../utils/runtime.js";
import { motion } from "../../../utils/motion.js";
import { Link, useNavigate } from "../../../utils/router.js";
const logo = "/assets/icons/rednest_logo.png";
const premiumRoastIcon = "/assets/icons/premium_roast.svg";
const cozyAtmosphereIcon = "/assets/icons/cozy_atmosphere.svg";
const ecoFriendlyIcon = "/assets/icons/eco_friendly.svg";
const homeCardLoader = "/assets/icons/home-product-card-loader.svg";
const bgVideoUrl = "/assets/video/media_1.mp4";
const aboutImage = "/assets/images/about_image.png";
const cappuccinoImg = "/assets/images/product/Cappuccino.jpg";
import SubscribeModal from "./SubscribeModal.js";
import SubscribeErrorModal from "./SubscribeErrorModal.js";
import SubscribeSuccessModal from "./SubscribeSuccessModal.js";
import Footer from "../../Footer/Footer.js";
import Navbar from "../../Elements/Navbar.js";
import { useLang } from "../../../utils/useLang.js";
import { getHomeTranslation } from "./Lang.js";
let cachedBlobUrl = null;
let blobFetchPromise = null;
function getVideoBlobUrl() {
	if (cachedBlobUrl) return Promise.resolve(cachedBlobUrl);
	if (blobFetchPromise) return blobFetchPromise;
	const resolvedVideoUrl = (typeof window !== "undefined" && window.__SUFRANO_BASE__ ? window.__SUFRANO_BASE__ : "") + bgVideoUrl;
	blobFetchPromise = fetch(resolvedVideoUrl).then((res) => res.blob()).then((blob) => {
		cachedBlobUrl = URL.createObjectURL(blob);
		return cachedBlobUrl;
	}).catch(() => {
		blobFetchPromise = null;
		return resolvedVideoUrl;
	});
	return blobFetchPromise;
}
const Home = () => {
	const navigate = useNavigate();
	const lang = useLang();
	const t = (dataId) => getHomeTranslation(lang, dataId);
	const videoRef = useRef(null);
	const [videoBlobSrc, setVideoBlobSrc] = useState(cachedBlobUrl || "");
	const featuresGridRef = useRef(null);
	const features = useMemo(() => [
		{
			id: "feature_1",
			icon: premiumRoastIcon,
			alt: "Fine Dining",
			titleKey: "home_feature_1_title",
			descKey: "home_feature_1_desc"
		},
		{
			id: "feature_2",
			icon: cozyAtmosphereIcon,
			alt: "Cozy Atmosphere",
			titleKey: "home_feature_2_title",
			descKey: "home_feature_2_desc"
		},
		{
			id: "feature_3",
			icon: ecoFriendlyIcon,
			alt: "Eco-Friendly",
			titleKey: "home_feature_3_title",
			descKey: "home_feature_3_desc"
		}
	], []);
	useEffect(() => {
		const el = featuresGridRef.current;
		if (!el) return;
		let isDown = false;
		let startX = 0;
		let scrollLeft = 0;
		let hasMoved = false;
		const onMouseDown = (e) => {
			if (e.button !== 0) return;
			isDown = true;
			hasMoved = false;
			startX = e.pageX - el.offsetLeft;
			scrollLeft = el.scrollLeft;
			el.style.scrollSnapType = "none";
			el.style.scrollBehavior = "auto";
		};
		const onMouseMove = (e) => {
			if (!isDown) return;
			const x = e.pageX - el.offsetLeft;
			const walk = x - startX;
			if (Math.abs(walk) > 4) {
				hasMoved = true;
				el.style.cursor = "grabbing";
			}
			el.scrollLeft = scrollLeft - walk;
		};
		const onMouseUp = () => {
			if (!isDown) return;
			isDown = false;
			el.style.cursor = "";
			el.style.scrollSnapType = "x mandatory";
			el.style.scrollBehavior = "smooth";
		};
		el.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
		return () => {
			el.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, []);
	const [subscribeEmail, setSubscribeEmail] = useState("");
	const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [errorType, setErrorType] = useState("ACCOUNT_NOT_FOUND");
	const [successMessage, setSuccessMessage] = useState("");
	const [subscribeLoading, setSubscribeLoading] = useState(false);
	const [favoritesLoading, setFavoritesLoading] = useState(true);
	const [favoriteProducts, setFavoriteProducts] = useState([]);
	const [isDesktop, setIsDesktop] = useState(() => {
		if (typeof window !== "undefined") {
			return window.innerWidth > 768;
		}
		return true;
	});
	const [skeletonCount, setSkeletonCount] = useState(() => {
		if (typeof window === "undefined") return 4;
		const w = window.innerWidth;
		if (w < 640) return 1;
		if (w < 980) return 2;
		if (w < 1280) return 3;
		return 4;
	});
	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth > 768);
			const w = window.innerWidth;
			if (w < 640) setSkeletonCount(1);
			else if (w < 980) setSkeletonCount(2);
			else if (w < 1280) setSkeletonCount(3);
			else setSkeletonCount(4);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	useEffect(() => {
		if (!videoBlobSrc) {
			getVideoBlobUrl().then((url) => setVideoBlobSrc(url));
		}
	}, []);
	const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
	useEffect(() => {
		let isMounted = true;
		const fetchFavorites = async () => {
			setFavoritesLoading(true);
			try {
				const res = await fetch(`${apiUrl}/api/products/favorites?limit=4&lang=${lang}`);
				if (res.ok) {
					const data = await res.json();
					if (isMounted && Array.isArray(data)) {
						setFavoriteProducts(data);
					}
				}
			} catch (err) {
				console.error("Failed to load favorite products:", err);
			} finally {
				if (isMounted) {
					setFavoritesLoading(false);
				}
			}
		};
		fetchFavorites();
		return () => {
			isMounted = false;
		};
	}, [apiUrl, lang]);
	useEffect(() => {
		const videoEl = videoRef.current;
		if (!videoEl || !videoBlobSrc) return;
		videoEl.muted = true;
		videoEl.defaultMuted = true;
		videoEl.playsInline = true;
		let isIntersecting = true;
		const tryPlay = () => {
			if (isIntersecting && videoEl.paused) {
				videoEl.play().catch((error) => {
					console.log("Auto-play prevented", error);
				});
			}
		};
		tryPlay();
		videoEl.addEventListener("loadeddata", tryPlay);
		videoEl.addEventListener("canplay", tryPlay);
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				isIntersecting = entry.isIntersecting;
				if (videoRef.current) {
					if (entry.isIntersecting) {
						videoRef.current.play().catch((error) => {
							console.log("Auto-play prevented", error);
						});
					} else {
						videoRef.current.pause();
					}
				}
			});
		}, {
			rootMargin: "600px 0px 600px 0px",
			threshold: 0
		});
		observer.observe(videoEl);
		return () => {
			videoEl.removeEventListener("loadeddata", tryPlay);
			videoEl.removeEventListener("canplay", tryPlay);
			observer.unobserve(videoEl);
			observer.disconnect();
		};
	}, [videoBlobSrc]);
	const handleSubscribeSubmit = async (e) => {
		e.preventDefault();
		if (!subscribeEmail.trim() || subscribeLoading) return;
		setSubscribeLoading(true);
		try {
			const res = await fetch(`${apiUrl}/api/auth/subscribe/request`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: subscribeEmail.trim() })
			});
			const data = await res.json();
			if (!res.ok) {
				const err = new Error(data.message || "Subscription request failed.");
				err.errorType = data.errorType || (res.status === 409 || data.message?.toLowerCase().includes("already") ? "ALREADY_SUBSCRIBED" : "ACCOUNT_NOT_FOUND");
				throw err;
			}
			setIsSubscribeModalOpen(true);
		} catch (err) {
			setErrorMessage(err.message || "This email is not registered. Please create an account first.");
			setErrorType(err.errorType || (err.message?.toLowerCase().includes("already") ? "ALREADY_SUBSCRIBED" : "ACCOUNT_NOT_FOUND"));
			setIsErrorModalOpen(true);
		} finally {
			setSubscribeLoading(false);
		}
	};
	return /* @__PURE__ */ __h(motion.div, {
		className: "home-page",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .3 }
	}, /* @__PURE__ */ __h(Navbar, null), /* @__PURE__ */ __h("section", { className: "hero-section" }, videoBlobSrc && /* @__PURE__ */ __h("video", {
		ref: videoRef,
		autoPlay: true,
		loop: true,
		muted: true,
		playsInline: true,
		preload: "auto",
		className: "hero-video-bg",
		src: videoBlobSrc
	}), /* @__PURE__ */ __h("div", { className: "hero-overlay" }), /* @__PURE__ */ __h("div", { className: "hero-content" }, /* @__PURE__ */ __h("h1", {
		className: "hero-title",
		"data-id": "home_hero_title"
	}, t("home_hero_title")), /* @__PURE__ */ __h("p", {
		className: "hero-subtitle",
		"data-id": "home_hero_subtitle"
	}, t("home_hero_subtitle_1"), /* @__PURE__ */ __h("br", { className: "hero-subtitle-br" }), t("home_hero_subtitle_2")), /* @__PURE__ */ __h("div", { className: "hero-actions" }, /* @__PURE__ */ __h(Link, {
		to: "/catalog",
		className: "cta-btn lg",
		"data-id": "home_hero_btn"
	}, t("home_hero_btn"))))), /* @__PURE__ */ __h(motion.section, {
		className: "features-section",
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
			amount: .2
		},
		transition: { duration: .6 }
	}, /* @__PURE__ */ __h("div", {
		className: "features-grid",
		ref: featuresGridRef
	}, features.map((feature) => /* @__PURE__ */ __h("div", {
		key: feature.id,
		className: "feature-card"
	}, /* @__PURE__ */ __h("div", { className: "feature-icon" }, /* @__PURE__ */ __h("img", {
		src: feature.icon,
		alt: feature.alt,
		className: "feature-svg"
	})), /* @__PURE__ */ __h("h3", { "data-id": feature.titleKey }, t(feature.titleKey)), /* @__PURE__ */ __h("p", { "data-id": feature.descKey }, t(feature.descKey)))))), /* @__PURE__ */ __h(motion.section, {
		className: "popular-menu-section",
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
			amount: .2
		},
		transition: { duration: .6 }
	}, /* @__PURE__ */ __h("div", { className: "section-header" }, /* @__PURE__ */ __h("h2", { "data-id": "home_favorites_title" }, t("home_favorites_title")), /* @__PURE__ */ __h("p", { "data-id": "home_favorites_subtitle" }, t("home_favorites_subtitle"))), /* @__PURE__ */ __h("div", { className: "menu-grid" }, favoritesLoading ? Array.from({ length: skeletonCount }).map((_, i) => /* @__PURE__ */ __h("div", {
		key: i,
		className: "home-skeleton-card"
	}, /* @__PURE__ */ __h("img", {
		src: homeCardLoader,
		alt: "Loading product",
		className: "skeleton-svg-img"
	}))) : favoriteProducts.length === 0 ? /* @__PURE__ */ __h("div", { className: "empty-favorites" }, /* @__PURE__ */ __h("p", { "data-id": "home_favorites_empty" }, t("home_favorites_empty"))) : favoriteProducts.map((prod) => {
		const rawBasePrice = prod.prices?.price ?? prod.price;
		const basePriceNum = typeof rawBasePrice === "number" ? rawBasePrice : parseFloat(rawBasePrice) || 0;
		const rawDiscountPrice = prod.prices?.discountPrice;
		const discountPriceNum = rawDiscountPrice !== undefined && rawDiscountPrice !== null && rawDiscountPrice !== "" ? typeof rawDiscountPrice === "number" ? rawDiscountPrice : parseFloat(rawDiscountPrice) : null;
		const hasDiscount = discountPriceNum !== null && !isNaN(discountPriceNum) && discountPriceNum > 0 && discountPriceNum < basePriceNum;
		const discountPercent = hasDiscount ? Math.round((1 - discountPriceNum / basePriceNum) * 100) : 0;
		const effectivePriceFormatted = hasDiscount ? discountPriceNum.toFixed(2) : basePriceNum.toFixed(2);
		const oldPriceFormatted = basePriceNum.toFixed(2);
		return /* @__PURE__ */ __h("div", {
			key: prod.id,
			className: "menu-item-card"
		}, /* @__PURE__ */ __h("div", {
			className: "favorite-badge",
			"data-id": "home_favorites_badge"
		}, t("home_favorites_badge")), /* @__PURE__ */ __h("img", {
			src: prod.images?.image || prod.images?.icon || cappuccinoImg,
			alt: prod.name,
			className: "menu-img-placeholder",
			style: { objectFit: "cover" },
			loading: "lazy"
		}), /* @__PURE__ */ __h("div", { className: "menu-info" }, /* @__PURE__ */ __h("h4", { title: prod.name }, prod.name), /* @__PURE__ */ __h("p", { title: prod.description || "" }, prod.description || "Delicious handcrafted dish made with premium ingredients."), /* @__PURE__ */ __h("div", { className: `home-price-container ${hasDiscount ? "has-discount" : "no-discount"}` }, hasDiscount && /* @__PURE__ */ __h("div", { className: "home-old-price-pill" }, /* @__PURE__ */ __h("span", { className: "discount-tag" }, "-", discountPercent, "%"), /* @__PURE__ */ __h("span", { className: "old-price" }, oldPriceFormatted, " ₼")), /* @__PURE__ */ __h("span", { className: "price" }, effectivePriceFormatted, " ₼"))));
	})), /* @__PURE__ */ __h("div", { className: "section-actions" }, /* @__PURE__ */ __h(Link, {
		to: "/catalog",
		className: "cta-btn secondary",
		"data-id": "home_favorites_btn"
	}, t("home_favorites_btn")))), /* @__PURE__ */ __h(motion.section, {
		className: "about-us-section",
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
			amount: .2
		},
		transition: { duration: .6 }
	}, /* @__PURE__ */ __h("div", { className: "about-grid" }, /* @__PURE__ */ __h("div", { className: "about-content" }, /* @__PURE__ */ __h("h2", { "data-id": "home_about_title" }, t("home_about_title")), /* @__PURE__ */ __h("p", { "data-id": "home_about_p1" }, t("home_about_p1")), /* @__PURE__ */ __h("p", { "data-id": "home_about_p2" }, t("home_about_p2"))), isDesktop && /* @__PURE__ */ __h("div", { className: "about-visual" }, /* @__PURE__ */ __h("img", {
		src: aboutImage,
		alt: "The Süfrano Experience",
		className: "about-image",
		loading: "lazy"
	})))), /* @__PURE__ */ __h(motion.section, {
		className: "newsletter-section",
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
			amount: .2
		},
		transition: { duration: .6 }
	}, /* @__PURE__ */ __h("div", { className: "newsletter-container" }, /* @__PURE__ */ __h("h2", { "data-id": "home_club_title" }, t("home_club_title")), /* @__PURE__ */ __h("p", { "data-id": "home_club_desc" }, t("home_club_desc")), /* @__PURE__ */ __h("form", {
		className: "newsletter-form",
		onSubmit: handleSubscribeSubmit
	}, /* @__PURE__ */ __h("input", {
		type: "email",
		placeholder: t("home_club_placeholder"),
		value: subscribeEmail,
		onChange: (e) => setSubscribeEmail(e.target.value),
		required: true,
		"data-id": "home_club_placeholder"
	}), /* @__PURE__ */ __h("button", {
		type: "submit",
		className: "cta-btn",
		id: "subscribe-btn",
		disabled: subscribeLoading,
		"data-id": "home_club_btn"
	}, subscribeLoading ? t("home_club_btn_loading") : t("home_club_btn"))))), /* @__PURE__ */ __h(SubscribeModal, {
		isOpen: isSubscribeModalOpen,
		onClose: () => setIsSubscribeModalOpen(false),
		email: subscribeEmail,
		onSuccess: (msg) => {
			setSuccessMessage(msg);
			setIsSuccessModalOpen(true);
			setSubscribeEmail("");
		}
	}), /* @__PURE__ */ __h(SubscribeErrorModal, {
		isOpen: isErrorModalOpen,
		onClose: () => setIsErrorModalOpen(false),
		message: errorMessage,
		errorType,
		onOpenRegister: () => navigate("/login")
	}), /* @__PURE__ */ __h(SubscribeSuccessModal, {
		isOpen: isSuccessModalOpen,
		onClose: () => setIsSuccessModalOpen(false),
		message: successMessage
	}), /* @__PURE__ */ __h(Footer, null));
};
export default Home;
