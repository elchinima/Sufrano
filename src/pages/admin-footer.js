(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/AdminPages/Footer/Footer.js
	__define("components/AdminPages/Footer/Footer.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useCallback, useMemo } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const __imp_1 = __require("components/AdminPages/AdminLayout/AdminLayout.js");
		const AdminLayout = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { fetchFooterData } = __require("utils/footerData.js");

		const logo = "/assets/icons/rednest_logo.png";
		const loaderIcon = "/assets/icons/loader-animated.svg";

		const LANG_CONFIGS = [
			{ code: "RU", key: "footerRU", dbKey: "FooterRU", label: "Русский", native: "RU" },
			{ code: "EN", key: "footerEN", dbKey: "FooterEN", label: "English", native: "EN" },
			{ code: "AZ", key: "footerAZ", dbKey: "FooterAZ", label: "Azərbaycan", native: "AZ" }
		];

		const PRESET_QUICK_LINKS = [
			{ link: "/", RU: "Главная", EN: "Home", AZ: "Ana səhifə" },
			{ link: "/catalog", RU: "Каталог", EN: "Catalog", AZ: "Kataloq" },
			{ link: "/review", RU: "Отзывы", EN: "Reviews", AZ: "Rəylər" },
			{ link: "/fortune", RU: "Колесо фортуны", EN: "Wheel of Fortune", AZ: "Şans çarxı" },
			{ link: "/promos", RU: "Промокоды", EN: "Promo Codes", AZ: "Promo kodlar" },
			{ link: "/orders", RU: "Мои заказы", EN: "My Orders", AZ: "Sifarişlərim" },
			{ link: "/basket", RU: "Корзина", EN: "Basket", AZ: "Səbət" },
			{ link: "/rules", RU: "Правила", EN: "Rules", AZ: "Qaydalar" }
		];

		const RECOMMENDED_DEFAULTS = {
			RU: {
				description: "Восточная элегантность, авторские десерты и премиальное качество в каждой детали.",
				quickLinksTitle: "Быстрые ссылки",
				contactUsTitle: "Контакты",
				termsOfUseTitle: "Условия использования",
				copyrightText: "Все права защищены.",
				socialMedia: {
					instagram: "https://instagram.com/sufrano",
					tikTok: "https://tiktok.com/@sufrano",
					whatsApp: "+994501234567"
				},
				quickLinks: [
					{ title: "Главная", link: "/" },
					{ title: "Каталог", link: "/catalog" },
					{ title: "Отзывы", link: "/review" },
					{ title: "Колесо фортуны", link: "/fortune" }
				],
				contactUs: {
					address: "г. Баку, Азербайджан",
					phone: "+994 50 123 45 67",
					email: "info@sufrano.com"
				}
			},
			EN: {
				description: "Eastern elegance, artisan treats, and premium quality crafted in every detail.",
				quickLinksTitle: "Quick Links",
				contactUsTitle: "Contact Us",
				termsOfUseTitle: "Terms of Use",
				copyrightText: "All rights reserved.",
				socialMedia: {
					instagram: "https://instagram.com/sufrano",
					tikTok: "https://tiktok.com/@sufrano",
					whatsApp: "+994501234567"
				},
				quickLinks: [
					{ title: "Home", link: "/" },
					{ title: "Catalog", link: "/catalog" },
					{ title: "Reviews", link: "/review" },
					{ title: "Wheel of Fortune", link: "/fortune" }
				],
				contactUs: {
					address: "Baku, Azerbaijan",
					phone: "+994 50 123 45 67",
					email: "info@sufrano.com"
				}
			},
			AZ: {
				description: "Hər detalda Şərq zərifliyi, xüsusi ləzzətlər və premium keyfiyyət.",
				quickLinksTitle: "Sürətli keçidlər",
				contactUsTitle: "Bizimlə əlaqə",
				termsOfUseTitle: "İstifadə şərtləri",
				copyrightText: "Bütün hüquqlar qorunur.",
				socialMedia: {
					instagram: "https://instagram.com/sufrano",
					tikTok: "https://tiktok.com/@sufrano",
					whatsApp: "+994501234567"
				},
				quickLinks: [
					{ title: "Ana səhifə", link: "/" },
					{ title: "Kataloq", link: "/catalog" },
					{ title: "Rəylər", link: "/review" },
					{ title: "Şans çarxı", link: "/fortune" }
				],
				contactUs: {
					address: "Bakı şəhəri, Azərbaycan",
					phone: "+994 50 123 45 67",
					email: "info@sufrano.com"
				}
			}
		};

		const createEmptyLangContent = () => ({
			description: "",
			quickLinksTitle: "",
			contactUsTitle: "",
			termsOfUseTitle: "",
			copyrightText: "",
			socialMedia: {
				instagram: "",
				tikTok: "",
				whatsApp: ""
			},
			quickLinks: [],
			contactUs: {
				address: "",
				phone: "",
				email: ""
			}
		});

		const normalizeLangContent = (raw) => {
			const src = raw && typeof raw === "object" ? raw : {};
			const social = src.socialMedia || src.SocialMedia || {};
			const contact = src.contactUs || src.ContactUs || {};
			const rawLinks = Array.isArray(src.quickLinks) ? src.quickLinks : (Array.isArray(src.QuickLinks) ? src.QuickLinks : []);

			return {
				description: String(src.description ?? src.Description ?? ""),
				quickLinksTitle: String(src.quickLinksTitle ?? src.QuickLinksTitle ?? ""),
				contactUsTitle: String(src.contactUsTitle ?? src.ContactUsTitle ?? ""),
				termsOfUseTitle: String(src.termsOfUseTitle ?? src.TermsOfUseTitle ?? ""),
				copyrightText: String(src.copyrightText ?? src.CopyrightText ?? ""),
				socialMedia: {
					instagram: String(social.instagram ?? social.Instagram ?? ""),
					tikTok: String(social.tikTok ?? social.TikTok ?? social.tiktok ?? ""),
					whatsApp: String(social.whatsApp ?? social.WhatsApp ?? social.whatsapp ?? "")
				},
				quickLinks: rawLinks.map((item) => ({
					title: String(item?.title ?? item?.Title ?? ""),
					link: String(item?.link ?? item?.Link ?? "")
				})),
				contactUs: {
					address: String(contact.address ?? contact.Address ?? ""),
					phone: String(contact.phone ?? contact.Phone ?? ""),
					email: String(contact.email ?? contact.Email ?? "")
				}
			};
		};

		const toDbPascalContent = (lang) => {
			const item = normalizeLangContent(lang);
			return {
				Description: item.description.trim(),
				QuickLinksTitle: item.quickLinksTitle.trim(),
				ContactUsTitle: item.contactUsTitle.trim(),
				TermsOfUseTitle: item.termsOfUseTitle.trim(),
				CopyrightText: item.copyrightText.trim(),
				SocialMedia: {
					Instagram: item.socialMedia.instagram.trim(),
					TikTok: item.socialMedia.tikTok.trim(),
					WhatsApp: item.socialMedia.whatsApp.trim()
				},
				QuickLinks: item.quickLinks
					.filter((q) => q.title.trim() || q.link.trim())
					.map((q) => ({
						Title: q.title.trim(),
						Link: q.link.trim()
					})),
				ContactUs: {
					Address: item.contactUs.address.trim(),
					Phone: item.contactUs.phone.trim(),
					Email: item.contactUs.email.trim()
				}
			};
		};

		const normalizeSocialUrl = (type, value) => {
			if (!value || typeof value !== "string") return "";
			const trimmed = value.trim();
			if (!trimmed) return "";
			if (type === "whatsapp") {
				if (/^https?:\/\//i.test(trimmed)) return trimmed;
				const digits = trimmed.replace(/\D/g, "");
				return digits ? `https://wa.me/${digits}` : "";
			}
			if (!/^https?:\/\//i.test(trimmed)) {
				return `https://${trimmed}`;
			}
			return trimmed;
		};

		const formatDateBaku = (dateStr) => {
			if (!dateStr) return "Never";
			try {
				const d = new Date(dateStr);
				if (isNaN(d.getTime())) return "—";
				return new Intl.DateTimeFormat("ru-RU", {
					timeZone: "Asia/Baku",
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					hour12: false
				}).format(d);
			} catch {
				return "—";
			}
		};

		const formatRelativeTime = (dateStr) => {
			if (!dateStr) return "Not saved";
			try {
				const d = new Date(dateStr);
				if (isNaN(d.getTime())) return "—";
				const diffMins = Math.floor((Date.now() - d.getTime()) / 6e4);
				const diffHours = Math.floor(diffMins / 60);
				const diffDays = Math.floor(diffHours / 24);
				if (diffMins < 1) return "Just now";
				if (diffMins < 60) return `${diffMins}m ago`;
				if (diffHours < 24) return `${diffHours}h ago`;
				if (diffDays < 7) return `${diffDays}d ago`;
				return formatDateBaku(dateStr).split(",")[0];
			} catch {
				return "—";
			}
		};

		const getBakuYear = () => {
			try {
				const str = new Intl.DateTimeFormat("en-US", {
					timeZone: "Asia/Baku",
					year: "numeric"
				}).format(new Date());
				return parseInt(str, 10) || (/* @__PURE__ */ new Date()).getFullYear();
			} catch {
				return (/* @__PURE__ */ new Date()).getFullYear();
			}
		};

		const isLanguageComplete = (lang) => {
			if (!lang) return false;
			const hasTexts = Boolean(lang.description.trim() && lang.quickLinksTitle.trim() && lang.contactUsTitle.trim() && lang.termsOfUseTitle.trim());
			const hasContactOrLink = lang.quickLinks.some((q) => q.title.trim() && q.link.trim()) || Boolean(lang.contactUs.address.trim() || lang.contactUs.phone.trim() || lang.contactUs.email.trim());
			return hasTexts && hasContactOrLink;
		};

		const fadeUp = {
			hidden: { opacity: 0, y: 16 },
			show: (i) => ({
				opacity: 1,
				y: 0,
				transition: {
					delay: i * 0.05,
					duration: 0.4,
					ease: [0.16, 1, 0.3, 1]
				}
			})
		};

		const svgIcon = (paths, size = 16) => /* @__PURE__ */ __h("svg", {
			width: size,
			height: size,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, ...paths);

		const Footer = () => {
			const { user } = useAuth();
			const currentUserRole = (user?.role || user?.Role || "").toLowerCase().replace(/\s+/g, "");
			const hasUserContext = Boolean(user);
			const isSuperAdmin = !hasUserContext || currentUserRole === "superadmin";

			const [footerState, setFooterState] = useState({
				footerRU: createEmptyLangContent(),
				footerEN: createEmptyLangContent(),
				footerAZ: createEmptyLangContent()
			});
			const [savedSnapshot, setSavedSnapshot] = useState("");
			const [dbExists, setDbExists] = useState(false);
			const [updatedAt, setUpdatedAt] = useState(null);
			const [activeLang, setActiveLang] = useState("RU");
			const [previewMode, setPreviewMode] = useState("preview");
			const [previewLangOpen, setPreviewLangOpen] = useState(false);
			const [loading, setLoading] = useState(true);
			const [saving, setSaving] = useState(false);
			const [error, setError] = useState("");
			const [copiedJson, setCopiedJson] = useState(false);
			const [defaultsModalOpen, setDefaultsModalOpen] = useState(false);
			const [toast, setToast] = useState({ message: "", type: "success" });

			const apiUrl = window.__SUFRANO_API_URL__ || "";
			const currentYear = useMemo(() => getBakuYear(), []);

			const showToast = useCallback((message, type = "success") => {
				const isErr = type === "error" || /denied|failed|error|restricted|invalid|missing/i.test(message);
				setToast({ message, type: isErr ? "error" : "success" });
				setTimeout(() => setToast({ message: "", type: "success" }), 4500);
			}, []);

			const loadFooter = useCallback(async () => {
				if (hasUserContext && !isSuperAdmin) {
					setLoading(false);
					setError("Access denied. Footer management is restricted to Super Admin only.");
					return;
				}
				setLoading(true);
				setError("");
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/footer`);
					if (res.status === 403 || res.status === 401) {
						setError("Access denied. Super Admin privileges are required to view or edit Footer configuration.");
						return;
					}
					if (!res.ok) {
						setError(`Failed to load footer configuration (HTTP ${res.status}).`);
						return;
					}
					const data = await res.json();
					const nextState = {
						footerRU: normalizeLangContent(data?.footerRU ?? data?.FooterRU),
						footerEN: normalizeLangContent(data?.footerEN ?? data?.FooterEN),
						footerAZ: normalizeLangContent(data?.footerAZ ?? data?.FooterAZ)
					};
					setFooterState(nextState);
					setSavedSnapshot(JSON.stringify(nextState));
					setDbExists(Boolean(data?.exists));
					setUpdatedAt(data?.updatedAt || null);
				} catch {
					setError("Connection error while fetching footer settings.");
				} finally {
					setLoading(false);
				}
			}, [apiUrl, hasUserContext, isSuperAdmin]);

			useEffect(() => {
				loadFooter();
			}, [loadFooter]);

			const activeMeta = useMemo(
				() => LANG_CONFIGS.find((l) => l.code === activeLang) || LANG_CONFIGS[0],
				[activeLang]
			);
			const currentContent = footerState[activeMeta.key] || createEmptyLangContent();
			const hasUnsavedChanges = useMemo(
				() => Boolean(savedSnapshot) && JSON.stringify(footerState) !== savedSnapshot,
				[footerState, savedSnapshot]
			);

			const stats = useMemo(() => {
				const counts = {};
				let totalLinks = 0;
				let configuredLangs = 0;
				for (const cfg of LANG_CONFIGS) {
					const content = footerState[cfg.key];
					const len = (content?.quickLinks || []).filter((q) => q.title.trim() || q.link.trim()).length;
					counts[cfg.code] = len;
					totalLinks += len;
					if (isLanguageComplete(content)) configuredLangs++;
				}
				return { counts, totalLinks, configuredLangs };
			}, [footerState]);

			const updateActiveContent = (updater) => {
				setFooterState((prev) => {
					const cur = prev[activeMeta.key];
					const nextVal = typeof updater === "function" ? updater(cur) : updater;
					return { ...prev, [activeMeta.key]: nextVal };
				});
			};

			const setTopField = (field, value) => {
				updateActiveContent((cur) => ({ ...cur, [field]: value }));
			};

			const setNestedField = (group, field, value) => {
				updateActiveContent((cur) => ({
					...cur,
					[group]: { ...cur[group], [field]: value }
				}));
			};

			const addQuickLink = (preset = null) => {
				updateActiveContent((cur) => ({
					...cur,
					quickLinks: [
						...cur.quickLinks,
						preset ? { title: preset[activeLang] || preset.EN, link: preset.link } : { title: "", link: "/" }
					]
				}));
			};

			const updateQuickLink = (idx, field, value) => {
				updateActiveContent((cur) => ({
					...cur,
					quickLinks: cur.quickLinks.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
				}));
			};

			const moveQuickLink = (idx, delta) => {
				updateActiveContent((cur) => {
					const target = idx + delta;
					if (target < 0 || target >= cur.quickLinks.length) return cur;
					const next = [...cur.quickLinks];
					const [moved] = next.splice(idx, 1);
					next.splice(target, 0, moved);
					return { ...cur, quickLinks: next };
				});
			};

			const removeQuickLink = (idx) => {
				updateActiveContent((cur) => ({
					...cur,
					quickLinks: cur.quickLinks.filter((_, i) => i !== idx)
				}));
			};

			const syncGroupAcrossLanguages = (groupKey, fieldsToCopy = null) => {
				const source = currentContent[groupKey] || {};
				setFooterState((prev) => {
					const next = { ...prev };
					for (const cfg of LANG_CONFIGS) {
						if (cfg.key === activeMeta.key) continue;
						const targetGroup = { ...(next[cfg.key][groupKey] || {}) };
						if (Array.isArray(fieldsToCopy)) {
							for (const f of fieldsToCopy) {
								targetGroup[f] = source[f] || "";
							}
						} else {
							Object.assign(targetGroup, source);
						}
						next[cfg.key] = { ...next[cfg.key], [groupKey]: targetGroup };
					}
					return next;
				});
				showToast(
					groupKey === "socialMedia"
						? `Social channels synced from ${activeLang} to all languages.`
						: `Phone & email synced from ${activeLang} to all languages.`,
					"success"
				);
			};

			const applyRecommendedDefaults = (scope) => {
				if (scope === "active") {
					const def = RECOMMENDED_DEFAULTS[activeLang];
					updateActiveContent(() => normalizeLangContent(def));
					showToast(`Recommended defaults loaded for ${activeLang}. Click Save Footer to commit.`, "success");
				} else {
					setFooterState({
						footerRU: normalizeLangContent(RECOMMENDED_DEFAULTS.RU),
						footerEN: normalizeLangContent(RECOMMENDED_DEFAULTS.EN),
						footerAZ: normalizeLangContent(RECOMMENDED_DEFAULTS.AZ)
					});
					showToast("Recommended defaults loaded for RU, EN, and AZ. Click Save Footer to commit.", "success");
				}
				setDefaultsModalOpen(false);
			};

			const validateBeforeSave = () => {
				for (const cfg of LANG_CONFIGS) {
					const c = footerState[cfg.key];
					if (!c.quickLinksTitle.trim()) {
						setActiveLang(cfg.code);
						return `${cfg.code}: "Quick Links Title" cannot be empty.`;
					}
					if (!c.contactUsTitle.trim()) {
						setActiveLang(cfg.code);
						return `${cfg.code}: "Contact Us Title" cannot be empty.`;
					}
					if (!c.termsOfUseTitle.trim()) {
						setActiveLang(cfg.code);
						return `${cfg.code}: "Terms of Use Title" cannot be empty.`;
					}
					for (let i = 0; i < c.quickLinks.length; i++) {
						const q = c.quickLinks[i];
						const hasTitle = Boolean(q.title.trim());
						const hasLink = Boolean(q.link.trim());
						if (hasTitle !== hasLink) {
							setActiveLang(cfg.code);
							return `${cfg.code}: Quick link #${i + 1} requires both Title and Route / URL.`;
						}
					}
				}
				return null;
			};

			const handleSave = async () => {
				if (!isSuperAdmin) {
					showToast("Access denied. Super Admin only.", "error");
					return;
				}
				const validationError = validateBeforeSave();
				if (validationError) {
					showToast(validationError, "error");
					return;
				}
				setSaving(true);
				try {
					const payload = {
						footerRU: toDbPascalContent(footerState.footerRU),
						footerEN: toDbPascalContent(footerState.footerEN),
						footerAZ: toDbPascalContent(footerState.footerAZ)
					};
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/footer`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload)
					});
					const data = await res.json().catch(() => ({}));
					if (!res.ok) {
						showToast(data?.message || `Failed to save footer (HTTP ${res.status}).`, "error");
						return;
					}
					const savedState = {
						footerRU: normalizeLangContent(data?.footerRU ?? payload.footerRU),
						footerEN: normalizeLangContent(data?.footerEN ?? payload.footerEN),
						footerAZ: normalizeLangContent(data?.footerAZ ?? payload.footerAZ)
					};
					setFooterState(savedState);
					setSavedSnapshot(JSON.stringify(savedState));
					setDbExists(true);
					setUpdatedAt(data?.updatedAt || (/* @__PURE__ */ new Date()).toISOString());
					await fetchFooterData();
					showToast("Footer saved to PostgreSQL & public cache refreshed.", "success");
				} catch {
					showToast("Network error while saving footer settings.", "error");
				} finally {
					setSaving(false);
				}
			};

			const dbPayloadPreview = useMemo(() => ({
				UpdatedAt: updatedAt || "(set by NOW() on save)",
				FooterRU: toDbPascalContent(footerState.footerRU),
				FooterEN: toDbPascalContent(footerState.footerEN),
				FooterAZ: toDbPascalContent(footerState.footerAZ)
			}), [footerState, updatedAt]);

			const handleCopyJson = async () => {
				try {
					await navigator.clipboard.writeText(JSON.stringify(dbPayloadPreview, null, 2));
					setCopiedJson(true);
					setTimeout(() => setCopiedJson(false), 2000);
					showToast("DB JSONB payload copied to clipboard.", "success");
				} catch {
					showToast("Failed to copy JSON.", "error");
				}
			};

			const socialPreviewUrls = useMemo(() => ({
				instagram: normalizeSocialUrl("instagram", currentContent.socialMedia.instagram),
				tiktok: normalizeSocialUrl("tiktok", currentContent.socialMedia.tikTok),
				whatsapp: normalizeSocialUrl("whatsapp", currentContent.socialMedia.whatsApp)
			}), [currentContent.socialMedia]);

			const statCards = [
				{
					label: "DB Record Status",
					value: dbExists ? "Active Row" : "Empty Table",
					sub: dbExists ? 'PostgreSQL "Footer" initialized' : "0 rows — save to INSERT",
					highlight: !dbExists,
					icon: svgIcon([
						/* @__PURE__ */ __h("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }),
						/* @__PURE__ */ __h("path", { d: "M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" }),
						/* @__PURE__ */ __h("path", { d: "M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" })
					], 20)
				},
				{
					label: "Localized Columns",
					value: `${stats.configuredLangs} / 3`,
					sub: "FooterRU · FooterEN · FooterAZ",
					highlight: stats.configuredLangs === 3,
					icon: svgIcon([
						/* @__PURE__ */ __h("circle", { cx: "12", cy: "12", r: "10" }),
						/* @__PURE__ */ __h("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
						/* @__PURE__ */ __h("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
					], 20)
				},
				{
					label: "Total Quick Links",
					value: stats.totalLinks,
					sub: `RU: ${stats.counts.RU || 0} · EN: ${stats.counts.EN || 0} · AZ: ${stats.counts.AZ || 0}`,
					highlight: false,
					icon: svgIcon([
						/* @__PURE__ */ __h("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
						/* @__PURE__ */ __h("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
					], 20)
				},
				{
					label: "Last DB Update",
					value: formatRelativeTime(updatedAt),
					sub: updatedAt ? `${formatDateBaku(updatedAt)} (Baku)` : "Awaiting initial commit",
					highlight: false,
					icon: svgIcon([
						/* @__PURE__ */ __h("circle", { cx: "12", cy: "12", r: "10" }),
						/* @__PURE__ */ __h("polyline", { points: "12 6 12 12 16 14" })
					], 20)
				}
			];

			const renderLivePreview = () => {
				const validLinks = currentContent.quickLinks.filter((q) => q.title.trim() || q.link.trim());
				const copyText = currentContent.copyrightText.trim();
				return /* @__PURE__ */ __h("div", { className: "admin-footer__preview-card" },
					/* @__PURE__ */ __h("div", { className: "preview-brand-col" },
						/* @__PURE__ */ __h("div", { className: "preview-brand-head" },
							/* @__PURE__ */ __h("img", { src: logo, alt: "Süfrano", className: "preview-logo" }),
							/* @__PURE__ */ __h("span", { className: "preview-lang-pill" }, activeLang)
						),
						/* @__PURE__ */ __h("p", { className: "preview-description" },
							currentContent.description.trim() || "Brand description will appear here..."
						),
						/* @__PURE__ */ __h("div", { className: "preview-socials" },
							[
								{ label: "Instagram", url: socialPreviewUrls.instagram, badge: "IG" },
								{ label: "TikTok", url: socialPreviewUrls.tiktok, badge: "TT" },
								{ label: "WhatsApp", url: socialPreviewUrls.whatsapp, badge: "WA" }
							].map((s) => /* @__PURE__ */ __h("span", {
								key: s.label,
								className: `preview-social-chip ${s.url ? "is-active" : "is-empty"}`,
								title: s.url || `${s.label} not set`
							},
								/* @__PURE__ */ __h("strong", null, s.badge),
								/* @__PURE__ */ __h("span", null, s.url ? "Linked" : "Empty")
							))
						)
					),
					/* @__PURE__ */ __h("div", { className: "preview-columns" },
						/* @__PURE__ */ __h("div", { className: "preview-col" },
							/* @__PURE__ */ __h("h4", { className: "preview-col-title" }, currentContent.quickLinksTitle.trim() || "Quick Links"),
							validLinks.length === 0
								? /* @__PURE__ */ __h("p", { className: "preview-empty-note" }, "No quick links configured")
								: /* @__PURE__ */ __h("ul", { className: "preview-links-list" },
									validLinks.map((q, idx) => /* @__PURE__ */ __h("li", { key: idx },
										/* @__PURE__ */ __h("span", { className: "preview-link-title" }, q.title.trim() || "(untitled)"),
										/* @__PURE__ */ __h("code", { className: "preview-link-route" }, q.link.trim() || "/")
									))
								)
						),
						/* @__PURE__ */ __h("div", { className: "preview-col" },
							/* @__PURE__ */ __h("h4", { className: "preview-col-title" }, currentContent.contactUsTitle.trim() || "Contact Us"),
							/* @__PURE__ */ __h("div", { className: "preview-contact-list" },
								/* @__PURE__ */ __h("div", { className: "preview-contact-item" },
									svgIcon([
										/* @__PURE__ */ __h("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
										/* @__PURE__ */ __h("circle", { cx: "12", cy: "10", r: "3" })
									], 14),
									/* @__PURE__ */ __h("span", null, currentContent.contactUs.address.trim() || "Address not set")
								),
								/* @__PURE__ */ __h("div", { className: "preview-contact-item" },
									svgIcon([/* @__PURE__ */ __h("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })], 14),
									/* @__PURE__ */ __h("span", null, currentContent.contactUs.phone.trim() || "Phone not set")
								),
								/* @__PURE__ */ __h("div", { className: "preview-contact-item" },
									svgIcon([
										/* @__PURE__ */ __h("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
										/* @__PURE__ */ __h("polyline", { points: "22,6 12,13 2,6" })
									], 14),
									/* @__PURE__ */ __h("span", null, currentContent.contactUs.email.trim() || "Email not set")
								)
							)
						)
					),
					/* @__PURE__ */ __h("div", { className: "preview-bottom-bar" },
						/* @__PURE__ */ __h("div", { className: "preview-copyright" },
							/* @__PURE__ */ __h("span", null, `© ${currentYear} Süfrano${copyText ? `. ${copyText}` : ""}`),
							/* @__PURE__ */ __h("span", { className: "preview-terms-link" },
								currentContent.termsOfUseTitle.trim() || "Terms of Use",
								/* @__PURE__ */ __h("small", null, " (/rules)")
							)
						),
						/* @__PURE__ */ __h("div", { className: "preview-lang-switch" },
							/* @__PURE__ */ __h("button", {
								type: "button",
								className: "preview-lang-trigger",
								onClick: () => setPreviewLangOpen((o) => !o)
							},
								/* @__PURE__ */ __h("span", null, activeLang),
								svgIcon([/* @__PURE__ */ __h("polyline", { points: "6 9 12 15 18 9" })], 12)
							),
							previewLangOpen && /* @__PURE__ */ __h("div", { className: "preview-lang-menu" },
								LANG_CONFIGS.map((l) => /* @__PURE__ */ __h("button", {
									key: l.code,
									type: "button",
									className: l.code === activeLang ? "active" : "",
									onClick: () => {
										setActiveLang(l.code);
										setPreviewLangOpen(false);
									}
								}, l.code))
							)
						)
					)
				);
			};

			return /* @__PURE__ */ __h(AdminLayout, null,
				/* @__PURE__ */ __h("div", { className: "admin-footer" },
					/* @__PURE__ */ __h(AnimatePresence, null,
						toast.message && /* @__PURE__ */ __h(motion.div, {
							initial: { opacity: 0, y: -20, scale: 0.95 },
							animate: { opacity: 1, y: 0, scale: 1 },
							exit: { opacity: 0, y: -20, scale: 0.95 },
							className: `admin-footer__toast admin-footer__toast--${toast.type}`
						},
							toast.type === "success"
								? svgIcon([/* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })], 18)
								: svgIcon([
									/* @__PURE__ */ __h("circle", { cx: "12", cy: "12", r: "10" }),
									/* @__PURE__ */ __h("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
									/* @__PURE__ */ __h("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
								], 18),
							/* @__PURE__ */ __h("span", null, toast.message)
						)
					),
					/* @__PURE__ */ __h(motion.div, {
						className: "admin-footer__header",
						initial: "hidden",
						animate: "show",
						variants: fadeUp,
						custom: 0
					},
						/* @__PURE__ */ __h("div", { className: "admin-footer__title-wrap" },
							/* @__PURE__ */ __h("div", { className: "admin-footer__title-row" },
								/* @__PURE__ */ __h("h1", { className: "admin-footer__title" }, "Footer"),
								/* @__PURE__ */ __h("span", { className: "admin-footer__role-pill" },
									svgIcon([
										/* @__PURE__ */ __h("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })
									], 12),
									"Super Admin Only"
								),
								hasUnsavedChanges && /* @__PURE__ */ __h("span", { className: "admin-footer__dirty-pill" }, "Unsaved Changes")
							),
							/* @__PURE__ */ __h("p", { className: "admin-footer__subtitle" },
								'Manage PostgreSQL "Footer" JSONB columns (FooterRU, FooterEN, FooterAZ), navigation links, contacts, and social channels'
							)
						),
						/* @__PURE__ */ __h("div", { className: "admin-footer__header-actions" },
							/* @__PURE__ */ __h("button", {
								type: "button",
								className: "admin-footer__btn-secondary",
								onClick: () => setDefaultsModalOpen(true),
								disabled: loading || saving || Boolean(error)
							},
								svgIcon([
									/* @__PURE__ */ __h("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })
								], 15),
								"Fill Defaults"
							),
							/* @__PURE__ */ __h("button", {
								type: "button",
								className: "admin-footer__btn-primary",
								onClick: handleSave,
								disabled: loading || saving || Boolean(error)
							},
								saving
									? /* @__PURE__ */ __h("img", { src: loaderIcon, alt: "", className: "btn-spinner" })
									: svgIcon([
										/* @__PURE__ */ __h("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
										/* @__PURE__ */ __h("polyline", { points: "17 21 17 13 7 13 7 21" }),
										/* @__PURE__ */ __h("polyline", { points: "7 3 7 8 15 8" })
									], 15),
								saving ? "Saving..." : (dbExists ? "Save Footer" : "Create Footer Row")
							)
						)
					),
					error
						? /* @__PURE__ */ __h("div", { className: "admin-footer__error-banner" },
							/* @__PURE__ */ __h("div", { className: "error-left" },
								svgIcon([
									/* @__PURE__ */ __h("circle", { cx: "12", cy: "12", r: "10" }),
									/* @__PURE__ */ __h("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
									/* @__PURE__ */ __h("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
								], 18),
								/* @__PURE__ */ __h("span", null, error)
							),
							isSuperAdmin && /* @__PURE__ */ __h("button", { type: "button", onClick: loadFooter }, "Retry")
						)
						: loading
							? /* @__PURE__ */ __h("div", { className: "admin-footer__loading" },
								/* @__PURE__ */ __h("img", { src: loaderIcon, alt: "Loading..." }),
								/* @__PURE__ */ __h("span", null, 'Loading PostgreSQL "Footer" configuration...')
							)
							: /* @__PURE__ */ __h(__Fragment, null,
								!dbExists && /* @__PURE__ */ __h(motion.div, {
									className: "admin-footer__init-banner",
									initial: { opacity: 0, y: 8 },
									animate: { opacity: 1, y: 0 }
								},
									/* @__PURE__ */ __h("div", { className: "init-banner__body" },
										svgIcon([
											/* @__PURE__ */ __h("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
											/* @__PURE__ */ __h("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
											/* @__PURE__ */ __h("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
										], 20),
										/* @__PURE__ */ __h("div", null,
											/* @__PURE__ */ __h("strong", null, 'Table "Footer" has 0 rows in Supabase'),
											/* @__PURE__ */ __h("p", null, "Public /api/footer returns 404 until the initial row is inserted. Load recommended defaults or fill the fields below and click Create Footer Row.")
										)
									),
									/* @__PURE__ */ __h("button", {
										type: "button",
										className: "admin-footer__btn-secondary",
										onClick: () => applyRecommendedDefaults("all")
									}, "Load Defaults (RU / EN / AZ)")
								),
								/* @__PURE__ */ __h(motion.div, {
									className: "admin-footer__stats",
									initial: "hidden",
									animate: "show",
									variants: fadeUp,
									custom: 1
								},
									statCards.map((card) => /* @__PURE__ */ __h("div", { key: card.label, className: "admin-footer__stat-card" },
										/* @__PURE__ */ __h("div", { className: "admin-footer__stat-icon" }, card.icon),
										/* @__PURE__ */ __h("div", { className: "admin-footer__stat-body" },
											/* @__PURE__ */ __h("span", { className: `admin-footer__stat-value${card.highlight ? " highlight" : ""}` }, card.value),
											/* @__PURE__ */ __h("span", { className: "admin-footer__stat-label" }, card.label),
											/* @__PURE__ */ __h("span", { className: "admin-footer__stat-sub" }, card.sub)
										)
									))
								),
								/* @__PURE__ */ __h(motion.div, {
									className: "admin-footer__controls",
									initial: "hidden",
									animate: "show",
									variants: fadeUp,
									custom: 2
								},
									/* @__PURE__ */ __h("div", { className: "admin-footer__lang-tabs", role: "tablist" },
										LANG_CONFIGS.map((cfg) => {
											const complete = isLanguageComplete(footerState[cfg.key]);
											const isActive = cfg.code === activeLang;
											return /* @__PURE__ */ __h("button", {
												key: cfg.code,
												type: "button",
												role: "tab",
												"aria-selected": isActive,
												className: `admin-footer__lang-tab ${isActive ? "active" : ""}`,
												onClick: () => setActiveLang(cfg.code)
											},
												/* @__PURE__ */ __h("span", { className: `lang-dot ${complete ? "complete" : "incomplete"}` }),
												/* @__PURE__ */ __h("span", { className: "lang-code" }, cfg.code),
												/* @__PURE__ */ __h("span", { className: "lang-name" }, cfg.label),
												/* @__PURE__ */ __h("span", { className: "lang-count" }, stats.counts[cfg.code] || 0)
											);
										})
									),
									/* @__PURE__ */ __h("div", { className: "admin-footer__view-switch" },
										/* @__PURE__ */ __h("button", {
											type: "button",
											className: previewMode === "preview" ? "active" : "",
											onClick: () => setPreviewMode("preview")
										}, "Live Preview"),
										/* @__PURE__ */ __h("button", {
											type: "button",
											className: previewMode === "json" ? "active" : "",
											onClick: () => setPreviewMode("json")
										}, "DB JSONB")
									)
								),
								/* @__PURE__ */ __h(motion.div, {
									className: "admin-footer__grid",
									initial: "hidden",
									animate: "show",
									variants: fadeUp,
									custom: 3
								},
									/* @__PURE__ */ __h("div", { className: "admin-footer__editor" },
										/* @__PURE__ */ __h("section", { className: "admin-footer__card" },
											/* @__PURE__ */ __h("div", { className: "admin-footer__card-head" },
												/* @__PURE__ */ __h("div", null,
													/* @__PURE__ */ __h("h2", null, `Brand & Legal · ${activeLang}`),
													/* @__PURE__ */ __h("p", null, `Stored inside "${activeMeta.dbKey}" jsonb column`)
												),
												/* @__PURE__ */ __h("span", { className: "admin-footer__schema-tag" }, activeMeta.dbKey)
											),
											/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
												/* @__PURE__ */ __h("label", null, "Brand Description"),
												/* @__PURE__ */ __h("textarea", {
													rows: 3,
													value: currentContent.description,
													placeholder: "Short brand tagline displayed under the Süfrano logo...",
													onChange: (e) => setTopField("description", e.target.value)
												})
											),
											/* @__PURE__ */ __h("div", { className: "admin-footer__field-row" },
												/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
													/* @__PURE__ */ __h("label", null,
														"Terms of Use Title ",
														/* @__PURE__ */ __h("span", { className: "field-req" }, "*")
													),
													/* @__PURE__ */ __h("input", {
														type: "text",
														value: currentContent.termsOfUseTitle,
														placeholder: "Terms of Use",
														onChange: (e) => setTopField("termsOfUseTitle", e.target.value)
													}),
													/* @__PURE__ */ __h("span", { className: "field-hint" }, "Renders as a router link to /rules")
												),
												/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
													/* @__PURE__ */ __h("label", null, "Copyright Text"),
													/* @__PURE__ */ __h("input", {
														type: "text",
														value: currentContent.copyrightText,
														placeholder: "All rights reserved.",
														onChange: (e) => setTopField("copyrightText", e.target.value)
													}),
													/* @__PURE__ */ __h("span", { className: "field-hint" },
														`Output: "© ${currentYear} Süfrano${currentContent.copyrightText.trim() ? `. ${currentContent.copyrightText.trim()}` : ""}"`
													)
												)
											)
										),
										/* @__PURE__ */ __h("section", { className: "admin-footer__card" },
											/* @__PURE__ */ __h("div", { className: "admin-footer__card-head" },
												/* @__PURE__ */ __h("div", null,
													/* @__PURE__ */ __h("h2", null, `Quick Links · ${activeLang}`),
													/* @__PURE__ */ __h("p", null, "Navigation column heading & internal/external routes")
												),
												/* @__PURE__ */ __h("button", {
													type: "button",
													className: "admin-footer__btn-mini-gold",
													onClick: () => addQuickLink(null)
												}, "+ Add Link")
											),
											/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
												/* @__PURE__ */ __h("label", null,
													"Column Heading ",
													/* @__PURE__ */ __h("span", { className: "field-req" }, "*")
												),
												/* @__PURE__ */ __h("input", {
													type: "text",
													value: currentContent.quickLinksTitle,
													placeholder: "Quick Links",
													onChange: (e) => setTopField("quickLinksTitle", e.target.value)
												})
											),
											/* @__PURE__ */ __h("div", { className: "admin-footer__presets" },
												/* @__PURE__ */ __h("span", { className: "presets-label" }, "Quick Add Route:"),
												/* @__PURE__ */ __h("div", { className: "presets-chips" },
													PRESET_QUICK_LINKS.map((preset) => {
														const exists = currentContent.quickLinks.some((q) => q.link.trim() === preset.link);
														return /* @__PURE__ */ __h("button", {
															key: preset.link,
															type: "button",
															className: `preset-chip ${exists ? "added" : ""}`,
															onClick: () => addQuickLink(preset),
															title: `Add ${preset[activeLang]} (${preset.link})`
														}, `${preset[activeLang]} (${preset.link})`);
													})
												)
											),
											currentContent.quickLinks.length === 0
												? /* @__PURE__ */ __h("div", { className: "admin-footer__empty-links" },
													"No quick links yet for ",
													activeLang,
													". Add links manually or click a preset route above."
												)
												: /* @__PURE__ */ __h("div", { className: "admin-footer__links-list" },
													currentContent.quickLinks.map((item, idx) => /* @__PURE__ */ __h("div", { key: idx, className: "admin-footer__link-row" },
														/* @__PURE__ */ __h("span", { className: "link-index" }, `#${idx + 1}`),
														/* @__PURE__ */ __h("input", {
															type: "text",
															value: item.title,
															placeholder: "Link label (e.g. Catalog)",
															onChange: (e) => updateQuickLink(idx, "title", e.target.value)
														}),
														/* @__PURE__ */ __h("input", {
															type: "text",
															value: item.link,
															placeholder: "/catalog",
															className: "input-mono",
															onChange: (e) => updateQuickLink(idx, "link", e.target.value)
														}),
														/* @__PURE__ */ __h("div", { className: "link-row-actions" },
															/* @__PURE__ */ __h("button", {
																type: "button",
																className: "icon-btn",
																title: "Move up",
																disabled: idx === 0,
																onClick: () => moveQuickLink(idx, -1)
															}, svgIcon([/* @__PURE__ */ __h("polyline", { points: "18 15 12 9 6 15" })], 14)),
															/* @__PURE__ */ __h("button", {
																type: "button",
																className: "icon-btn",
																title: "Move down",
																disabled: idx === currentContent.quickLinks.length - 1,
																onClick: () => moveQuickLink(idx, 1)
															}, svgIcon([/* @__PURE__ */ __h("polyline", { points: "6 9 12 15 18 9" })], 14)),
															/* @__PURE__ */ __h("button", {
																type: "button",
																className: "icon-btn danger",
																title: "Remove link",
																onClick: () => removeQuickLink(idx)
															}, svgIcon([
																/* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }),
																/* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
															], 14))
														)
													))
												)
										),
										/* @__PURE__ */ __h("section", { className: "admin-footer__card" },
											/* @__PURE__ */ __h("div", { className: "admin-footer__card-head" },
												/* @__PURE__ */ __h("div", null,
													/* @__PURE__ */ __h("h2", null, `Contact Us · ${activeLang}`),
													/* @__PURE__ */ __h("p", null, "Displayed in Contact column and localized by language")
												),
												/* @__PURE__ */ __h("button", {
													type: "button",
													className: "admin-footer__btn-mini",
													onClick: () => syncGroupAcrossLanguages("contactUs", ["phone", "email"]),
													title: "Copy Phone and Email from current language to RU, EN, and AZ"
												}, "Sync Phone & Email → All")
											),
											/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
												/* @__PURE__ */ __h("label", null,
													"Column Heading ",
													/* @__PURE__ */ __h("span", { className: "field-req" }, "*")
												),
												/* @__PURE__ */ __h("input", {
													type: "text",
													value: currentContent.contactUsTitle,
													placeholder: "Contact Us",
													onChange: (e) => setTopField("contactUsTitle", e.target.value)
												})
											),
											/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
												/* @__PURE__ */ __h("label", null, "Address"),
												/* @__PURE__ */ __h("input", {
													type: "text",
													value: currentContent.contactUs.address,
													placeholder: "Baku, Azerbaijan...",
													onChange: (e) => setNestedField("contactUs", "address", e.target.value)
												})
											),
											/* @__PURE__ */ __h("div", { className: "admin-footer__field-row" },
												/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
													/* @__PURE__ */ __h("label", null, "Phone"),
													/* @__PURE__ */ __h("input", {
														type: "text",
														value: currentContent.contactUs.phone,
														placeholder: "+994 50 123 45 67",
														onChange: (e) => setNestedField("contactUs", "phone", e.target.value)
													})
												),
												/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
													/* @__PURE__ */ __h("label", null, "Email"),
													/* @__PURE__ */ __h("input", {
														type: "email",
														value: currentContent.contactUs.email,
														placeholder: "info@sufrano.com",
														onChange: (e) => setNestedField("contactUs", "email", e.target.value)
													})
												)
											)
										),
										/* @__PURE__ */ __h("section", { className: "admin-footer__card" },
											/* @__PURE__ */ __h("div", { className: "admin-footer__card-head" },
												/* @__PURE__ */ __h("div", null,
													/* @__PURE__ */ __h("h2", null, `Social Media · ${activeLang}`),
													/* @__PURE__ */ __h("p", null, "Used across public Footer and mobile Navbar drawer")
												),
												/* @__PURE__ */ __h("button", {
													type: "button",
													className: "admin-footer__btn-mini",
													onClick: () => syncGroupAcrossLanguages("socialMedia"),
													title: "Copy Instagram, TikTok, and WhatsApp to RU, EN, and AZ"
												}, "Sync Socials → All")
											),
											/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
												/* @__PURE__ */ __h("label", null, "Instagram URL"),
												/* @__PURE__ */ __h("input", {
													type: "text",
													value: currentContent.socialMedia.instagram,
													placeholder: "https://instagram.com/sufrano",
													onChange: (e) => setNestedField("socialMedia", "instagram", e.target.value)
												}),
												socialPreviewUrls.instagram && /* @__PURE__ */ __h("span", { className: "field-hint" }, `Normalized: ${socialPreviewUrls.instagram}`)
											),
											/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
												/* @__PURE__ */ __h("label", null, "TikTok URL"),
												/* @__PURE__ */ __h("input", {
													type: "text",
													value: currentContent.socialMedia.tikTok,
													placeholder: "https://tiktok.com/@sufrano",
													onChange: (e) => setNestedField("socialMedia", "tikTok", e.target.value)
												}),
												socialPreviewUrls.tiktok && /* @__PURE__ */ __h("span", { className: "field-hint" }, `Normalized: ${socialPreviewUrls.tiktok}`)
											),
											/* @__PURE__ */ __h("div", { className: "admin-footer__field" },
												/* @__PURE__ */ __h("label", null, "WhatsApp (Phone or wa.me URL)"),
												/* @__PURE__ */ __h("input", {
													type: "text",
													value: currentContent.socialMedia.whatsApp,
													placeholder: "+994501234567 or https://wa.me/994501234567",
													onChange: (e) => setNestedField("socialMedia", "whatsApp", e.target.value)
												}),
												socialPreviewUrls.whatsapp && /* @__PURE__ */ __h("span", { className: "field-hint" }, `Normalized: ${socialPreviewUrls.whatsapp}`)
											)
										)
									),
									/* @__PURE__ */ __h("aside", { className: "admin-footer__aside" },
										/* @__PURE__ */ __h("div", { className: "admin-footer__aside-sticky" },
											/* @__PURE__ */ __h("div", { className: "admin-footer__aside-header" },
												/* @__PURE__ */ __h("div", null,
													/* @__PURE__ */ __h("h3", null, previewMode === "preview" ? `Live Preview (${activeLang})` : 'PostgreSQL "Footer" JSONB'),
													/* @__PURE__ */ __h("p", null, previewMode === "preview" ? "Matches public Footer.js & footerData.js" : "Exact serialized schema sent on Save")
												),
												previewMode === "json" && /* @__PURE__ */ __h("button", {
													type: "button",
													className: "admin-footer__btn-mini",
													onClick: handleCopyJson
												}, copiedJson ? "Copied" : "Copy JSON")
											),
											previewMode === "preview"
												? renderLivePreview()
												: /* @__PURE__ */ __h("pre", { className: "admin-footer__json-pre" }, JSON.stringify(dbPayloadPreview, null, 2))
										)
									)
								)
							),
					/* @__PURE__ */ __h(AnimatePresence, null,
						defaultsModalOpen && /* @__PURE__ */ __h(motion.div, {
							className: "admin-footer__modal-backdrop",
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							exit: { opacity: 0 },
							onClick: () => setDefaultsModalOpen(false)
						},
							/* @__PURE__ */ __h(motion.div, {
								className: "admin-footer__modal",
								initial: { opacity: 0, scale: 0.94, y: 12 },
								animate: { opacity: 1, scale: 1, y: 0 },
								exit: { opacity: 0, scale: 0.94, y: 12 },
								onClick: (e) => e.stopPropagation()
							},
								/* @__PURE__ */ __h("div", { className: "admin-footer__modal-header" },
									/* @__PURE__ */ __h("div", null,
										/* @__PURE__ */ __h("h2", null, "Fill Recommended Defaults"),
										/* @__PURE__ */ __h("p", null, "Populate structured Süfrano footer copy, quick links, and sample contacts")
									),
									/* @__PURE__ */ __h("button", {
										type: "button",
										className: "admin-footer__modal-close",
										onClick: () => setDefaultsModalOpen(false)
									}, svgIcon([
										/* @__PURE__ */ __h("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
										/* @__PURE__ */ __h("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
									], 15))
								),
								/* @__PURE__ */ __h("div", { className: "admin-footer__modal-body" },
									/* @__PURE__ */ __h("p", null,
										`You can populate defaults for the active language (${activeLang}) only, or initialize all three languages (RU, EN, AZ) at once. Existing unsaved edits in the selected target will be replaced until saved or reloaded.`
									)
								),
								/* @__PURE__ */ __h("div", { className: "admin-footer__modal-footer" },
									/* @__PURE__ */ __h("button", {
										type: "button",
										className: "admin-footer__btn-secondary",
										onClick: () => setDefaultsModalOpen(false)
									}, "Cancel"),
									/* @__PURE__ */ __h("button", {
										type: "button",
										className: "admin-footer__btn-secondary",
										onClick: () => applyRecommendedDefaults("active")
									}, `Only ${activeLang}`),
									/* @__PURE__ */ __h("button", {
										type: "button",
										className: "admin-footer__btn-primary",
										onClick: () => applyRecommendedDefaults("all")
									}, "All 3 Languages")
								)
							)
						)
					)
				)
			);
		};


		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Footer; } });
	});
	//#endregion

	var entryExports = __require("components/AdminPages/Footer/Footer.js");
	__pages["admin-footer"] = entryExports.default || entryExports;
})();
