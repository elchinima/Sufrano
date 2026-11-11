(function () {
	var __define = window.__SUFRANO_DEFINE__;
	var __require = window.__SUFRANO_REQUIRE__;
	var __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

	//#region components/AdminPages/Database/Database.js
	__define("components/AdminPages/Database/Database.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useRef, useEffect, useCallback, useMemo } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const __imp_1 = __require("components/AdminPages/AdminLayout/AdminLayout.js");
		const AdminLayout = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { useAdminAuth } = __require("context/AdminAuthContext.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const cleanRole = (role) => (role || "").toLowerCase().replace(/\s+/g, "");
		const ALLOWED_TYPES = [
			"image/png",
			"image/jpeg",
			"image/jpg"
		];
		const MAX_SIZE_MB = 10;
		const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
		const PAGE_SIZE = 8;
		const formatSize = (kb) => {
			if (kb < 1024) return `${Math.round(kb)} KB`;
			return `${(kb / 1024).toFixed(1)} MB`;
		};
		const Database = () => {
			const { user } = useAuth();
			const { adminRole } = useAdminAuth();
			const [files, setFiles] = useState([]);
			const [searchInput, setSearchInput] = useState("");
			const [appliedSearch, setAppliedSearch] = useState("");
			const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
			const [loading, setLoading] = useState(true);
			const [uploading, setUploading] = useState(false);
			const [uploadProgress, setUploadProgress] = useState(0);
			const [dragOver, setDragOver] = useState(false);
			const [error, setError] = useState("");
			const [success, setSuccess] = useState("");
			const [copiedUrl, setCopiedUrl] = useState("");
			const [deletingFile, setDeletingFile] = useState("");
			const [previewFile, setPreviewFile] = useState(null);
			const [fileToDelete, setFileToDelete] = useState(null);
			const inputRef = useRef(null);
			const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
			const currentUserRole = cleanRole(adminRole || user?.role || user?.Role);
			const isSuperAdmin = currentUserRole === "superadmin" || currentUserRole === "super admin";
			const filteredFiles = useMemo(() => {
				let list = [...files];
				if (appliedSearch.trim()) {
					const q = appliedSearch.toLowerCase().trim();
					list = list.filter((f) => (f.fileName || "").toLowerCase().includes(q));
				}
				return list.sort((a, b) => (parseFloat(a.sizeKb) || 0) - (parseFloat(b.sizeKb) || 0));
			}, [files, appliedSearch]);
			const visibleFiles = useMemo(() => {
				return filteredFiles.slice(0, visibleCount);
			}, [filteredFiles, visibleCount]);
			const hasMore = visibleCount < filteredFiles.length;
			const handleLoadMore = () => {
				setVisibleCount((prev) => prev + PAGE_SIZE);
			};
			const handleSearchSubmit = (e) => {
				if (e) e.preventDefault();
				setAppliedSearch(searchInput.trim());
			};
			const handleSearchKeyDown = (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					setAppliedSearch(searchInput.trim());
				}
			};
			const handleClearSearch = () => {
				setSearchInput("");
				setAppliedSearch("");
			};
			useEffect(() => {
				setVisibleCount(PAGE_SIZE);
			}, [appliedSearch]);
			const fetchFiles = useCallback(async () => {
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/files`);
					if (res.ok) {
						const data = await res.json();
						setFiles(data);
					}
				} catch {
					setError("Failed to load file list.");
				} finally {
					setLoading(false);
				}
			}, [apiUrl]);
			useEffect(() => {
				fetchFiles();
			}, [fetchFiles]);
			useEffect(() => {
				const handleKeyDown = (e) => {
					if (e.key === "Escape") {
						if (fileToDelete && !deletingFile) {
							setFileToDelete(null);
						} else if (previewFile) {
							setPreviewFile(null);
						}
					}
				};
				if (previewFile || fileToDelete) {
					document.body.style.overflow = "hidden";
					window.addEventListener("keydown", handleKeyDown);
				} else {
					document.body.style.overflow = "";
				}
				return () => {
					document.body.style.overflow = "";
					window.removeEventListener("keydown", handleKeyDown);
				};
			}, [
				previewFile,
				fileToDelete,
				deletingFile
			]);
			const showSuccess = (msg) => {
				setSuccess(msg);
				setTimeout(() => setSuccess(""), 3500);
			};
			const showError = (msg) => {
				setError(msg);
				setTimeout(() => setError(""), 4e3);
			};
			const validateFile = (file) => {
				if (!ALLOWED_TYPES.includes(file.type)) {
					showError(`"${file.name}" has an invalid format. Allowed: PNG, JPG, JPEG.`);
					return false;
				}
				if (file.size > MAX_SIZE_BYTES) {
					showError(`"${file.name}" exceeds ${MAX_SIZE_MB} MB.`);
					return false;
				}
				const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
				if (!nameWithoutExt || !/^[a-zA-Z0-9\s._\-()]+$/.test(nameWithoutExt) || !/[a-zA-Z0-9]/.test(nameWithoutExt)) {
					showError(`"${file.name}": File name must contain only English letters and numbers. Russian/Cyrillic characters are not supported.`);
					return false;
				}
				return true;
			};
			const uploadFile = async (file) => {
				if (!validateFile(file)) return;
				setUploading(true);
				setUploadProgress(0);
				setError("");
				const interval = setInterval(() => {
					setUploadProgress((p) => p < 85 ? p + Math.random() * 12 : p);
				}, 200);
				try {
					const formData = new FormData();
					formData.append("file", file);
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/upload`, {
						method: "POST",
						body: formData
					});
					clearInterval(interval);
					setUploadProgress(100);
					if (res.ok) {
						const data = await res.json();
						showSuccess(`Uploaded: ${data.fileName} (${formatSize(data.sizeKb)})`);
						await fetchFiles();
					} else {
						const data = await res.json().catch(() => ({}));
						showError(data.message || "Upload failed.");
					}
				} catch {
					clearInterval(interval);
					showError("Connection error. Please try again.");
				} finally {
					setTimeout(() => {
						setUploading(false);
						setUploadProgress(0);
					}, 600);
				}
			};
			const handleDrop = (e) => {
				e.preventDefault();
				setDragOver(false);
				const file = e.dataTransfer.files[0];
				if (file) uploadFile(file);
			};
			const handleFileInput = (e) => {
				const file = e.target.files[0];
				if (file) uploadFile(file);
				e.target.value = "";
			};
			const handleCopyUrl = async (url, fileName) => {
				try {
					await navigator.clipboard.writeText(url);
					setCopiedUrl(fileName);
					setTimeout(() => setCopiedUrl(""), 2e3);
				} catch {
					showError("Could not copy link to clipboard.");
				}
			};
			const handleConfirmDelete = async () => {
				if (!fileToDelete) return;
				if (!isSuperAdmin) {
					showError("Access denied. Only Super Admin can delete database files.");
					setFileToDelete(null);
					return;
				}
				const fileName = fileToDelete.fileName;
				setDeletingFile(fileName);
				try {
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/files/${encodeURIComponent(fileName)}`, { method: "DELETE" });
					if (res.ok) {
						showSuccess(`"${fileName}" deleted.`);
						setFiles((prev) => prev.filter((f) => f.fileName !== fileName));
						if (previewFile?.fileName === fileName) {
							setPreviewFile(null);
						}
						setFileToDelete(null);
					} else {
						const data = await res.json().catch(() => ({}));
						showError(data.message || "Failed to delete file.");
					}
				} catch {
					showError("Connection error. Please try again.");
				} finally {
					setDeletingFile("");
				}
			};
			return /* @__PURE__ */ __h(AdminLayout, null, /* @__PURE__ */ __h("div", { className: "database" }, /* @__PURE__ */ __h(motion.div, {
				className: "database__header",
				initial: {
					opacity: 0,
					y: -16
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .45,
					ease: [
						.16,
						1,
						.3,
						1
					]
				}
			}, /* @__PURE__ */ __h("div", null, /* @__PURE__ */ __h("h1", { className: "database__title" }, "Database"), /* @__PURE__ */ __h("p", { className: "database__subtitle" }, "Manage images in Supabase Storage")), /* @__PURE__ */ __h("span", { className: "database__bucket-badge" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("ellipse", {
				cx: "12",
				cy: "5",
				rx: "9",
				ry: "3"
			}), /* @__PURE__ */ __h("path", { d: "M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" }), /* @__PURE__ */ __h("path", { d: "M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" })), "admin-files")), /* @__PURE__ */ __h(AnimatePresence, null, error && /* @__PURE__ */ __h(motion.div, {
				className: "database__alert database__alert--error",
				initial: {
					opacity: 0,
					y: -10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: -10
				},
				transition: { duration: .25 }
			}, /* @__PURE__ */ __h("svg", {
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
			})), error), success && /* @__PURE__ */ __h(motion.div, {
				className: "database__alert database__alert--success",
				initial: {
					opacity: 0,
					y: -10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: -10
				},
				transition: { duration: .25 }
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), success)), /* @__PURE__ */ __h(motion.div, {
				id: "database-dropzone",
				className: `database__dropzone${dragOver ? " database__dropzone--over" : ""}${uploading ? " database__dropzone--uploading" : ""}`,
				onDragOver: (e) => {
					e.preventDefault();
					setDragOver(true);
				},
				onDragLeave: () => setDragOver(false),
				onDrop: handleDrop,
				onClick: () => !uploading && inputRef.current?.click(),
				initial: {
					opacity: 0,
					scale: .98
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				transition: {
					delay: .1,
					duration: .45
				}
			}, /* @__PURE__ */ __h("input", {
				ref: inputRef,
				id: "database-file-input",
				type: "file",
				accept: ".png,.jpg,.jpeg,image/png,image/jpeg",
				onChange: handleFileInput,
				style: { display: "none" }
			}), uploading ? /* @__PURE__ */ __h("div", { className: "database__upload-progress" }, /* @__PURE__ */ __h("div", { className: "database__progress-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "16 16 12 12 8 16" }), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "12",
				x2: "12",
				y2: "21"
			}), /* @__PURE__ */ __h("path", { d: "M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" }))), /* @__PURE__ */ __h("p", { className: "database__progress-label" }, "Compressing & uploading..."), /* @__PURE__ */ __h("div", { className: "database__progress-bar" }, /* @__PURE__ */ __h(motion.div, {
				className: "database__progress-fill",
				animate: { width: `${uploadProgress}%` },
				transition: { duration: .3 }
			})), /* @__PURE__ */ __h("span", { className: "database__progress-pct" }, Math.round(uploadProgress), "%")) : /* @__PURE__ */ __h("div", { className: "database__dropzone-content" }, /* @__PURE__ */ __h("div", { className: `database__dropzone-icon${dragOver ? " database__dropzone-icon--over" : ""}` }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}, /* @__PURE__ */ __h("polyline", { points: "16 16 12 12 8 16" }), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "12",
				x2: "12",
				y2: "21"
			}), /* @__PURE__ */ __h("path", { d: "M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" }))), /* @__PURE__ */ __h("p", { className: "database__dropzone-title" }, dragOver ? "Release to upload" : "Drop an image here or click to browse"), /* @__PURE__ */ __h("p", { className: "database__dropzone-hint" }, "PNG, JPG, JPEG · max ", MAX_SIZE_MB, " MB · English file names only"), /* @__PURE__ */ __h("div", { className: "database__dropzone-badges" }, /* @__PURE__ */ __h("span", { className: "database__badge" }, "PNG"), /* @__PURE__ */ __h("span", { className: "database__badge" }, "JPG"), /* @__PURE__ */ __h("span", { className: "database__badge" }, "JPEG"), /* @__PURE__ */ __h("span", { className: "database__badge" }, "A-Z only"), /* @__PURE__ */ __h("span", { className: "database__badge database__badge--arrow" }, "→ WebP")))), /* @__PURE__ */ __h("div", { className: "database__files-header" }, /* @__PURE__ */ __h("div", { className: "database__files-header-left" }, /* @__PURE__ */ __h("h2", { className: "database__files-title" }, "Uploaded files", !loading && /* @__PURE__ */ __h("span", { className: "database__files-count" }, visibleFiles.length, " of ", filteredFiles.length))), /* @__PURE__ */ __h("form", {
				className: "database__search-wrap",
				onSubmit: handleSearchSubmit
			}, /* @__PURE__ */ __h("svg", {
				className: "database__search-icon",
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
				id: "database-search-input",
				type: "text",
				placeholder: "Search by file name...",
				value: searchInput,
				onChange: (e) => {
					const val = e.target.value;
					setSearchInput(val);
					if (!val.trim() && appliedSearch) {
						setAppliedSearch("");
					}
				},
				onKeyDown: handleSearchKeyDown,
				className: "database__search-input"
			}), searchInput && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "database__search-clear",
				onClick: handleClearSearch,
				title: "Clear search"
			}, "✕"))), loading ? /* @__PURE__ */ __h("div", { className: "database__loading" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading...",
				className: "database__spinner"
			}), /* @__PURE__ */ __h("span", null, "Loading storage files...")) : files.length === 0 ? /* @__PURE__ */ __h(motion.div, {
				className: "database__empty",
				initial: { opacity: 0 },
				animate: { opacity: 1 }
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}, /* @__PURE__ */ __h("rect", {
				x: "3",
				y: "3",
				width: "18",
				height: "18",
				rx: "2"
			}), /* @__PURE__ */ __h("circle", {
				cx: "8.5",
				cy: "8.5",
				r: "1.5"
			}), /* @__PURE__ */ __h("polyline", { points: "21 15 16 10 5 21" })), /* @__PURE__ */ __h("p", null, "No files uploaded yet")) : filteredFiles.length === 0 ? /* @__PURE__ */ __h(motion.div, {
				className: "database__empty",
				initial: { opacity: 0 },
				animate: { opacity: 1 }
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}, /* @__PURE__ */ __h("circle", {
				cx: "11",
				cy: "11",
				r: "8"
			}), /* @__PURE__ */ __h("line", {
				x1: "21",
				y1: "21",
				x2: "16.65",
				y2: "16.65"
			})), /* @__PURE__ */ __h("p", null, "No files match \"", appliedSearch, "\""), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm",
				onClick: handleClearSearch,
				style: { marginTop: "8px" }
			}, "Clear Search")) : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h(motion.div, {
				className: "database__grid",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .15 }
			}, /* @__PURE__ */ __h(AnimatePresence, null, visibleFiles.map((file, i) => /* @__PURE__ */ __h(motion.div, {
				key: file.fileName,
				className: "database__file-card",
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
					scale: .9
				},
				transition: {
					delay: i * .04,
					duration: .3
				},
				layout: true
			}, /* @__PURE__ */ __h("div", {
				className: "database__file-img",
				onClick: () => setPreviewFile(file),
				title: "Click to view large preview"
			}, /* @__PURE__ */ __h("img", {
				src: file.publicUrl,
				alt: file.fileName,
				loading: "lazy",
				decoding: "async"
			}), /* @__PURE__ */ __h("div", { className: "database__file-img-overlay" }, /* @__PURE__ */ __h("svg", {
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
			}), /* @__PURE__ */ __h("line", {
				x1: "11",
				y1: "8",
				x2: "11",
				y2: "14"
			}), /* @__PURE__ */ __h("line", {
				x1: "8",
				y1: "11",
				x2: "14",
				y2: "11"
			})))), /* @__PURE__ */ __h("div", { className: "database__file-info" }, /* @__PURE__ */ __h("p", {
				className: "database__file-name database__file-name--clickable",
				onClick: () => setPreviewFile(file),
				title: "Click to view large preview"
			}, file.fileName), /* @__PURE__ */ __h("div", { className: "database__file-meta" }, /* @__PURE__ */ __h("span", { className: "database__file-badge" }, "WebP"), /* @__PURE__ */ __h("span", { className: "database__file-size" }, formatSize(file.sizeKb))), /* @__PURE__ */ __h("div", { className: "database__file-actions" }, /* @__PURE__ */ __h("button", {
				id: `database-copy-${i}`,
				className: `database__file-btn database__file-btn--copy${copiedUrl === file.fileName ? " database__file-btn--copied" : ""}`,
				onClick: () => handleCopyUrl(file.publicUrl, file.fileName),
				title: "Copy URL"
			}, copiedUrl === file.fileName ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), "Copied") : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
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
			}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })), "Copy URL")), /* @__PURE__ */ __h("button", {
				id: `database-delete-${i}`,
				className: `database__file-btn database__file-btn--delete${!isSuperAdmin ? " database__file-btn--locked" : ""}`,
				onClick: () => {
					if (!isSuperAdmin) {
						showError("Access denied. Only Super Admin can delete files.");
					} else {
						setFileToDelete(file);
					}
				},
				disabled: deletingFile === file.fileName,
				title: isSuperAdmin ? "Delete file" : "Access denied (Super Admin only)"
			}, isSuperAdmin ? /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }), /* @__PURE__ */ __h("path", { d: "M10 11v6M14 11v6" }), /* @__PURE__ */ __h("path", { d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" })) : /* @__PURE__ */ __h("svg", {
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
			}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }))))))))), hasMore && /* @__PURE__ */ __h("div", { className: "database__load-more-wrap" }, /* @__PURE__ */ __h("button", {
				id: "database-load-more-btn",
				type: "button",
				className: "cta-btn secondary database__load-more-btn",
				onClick: handleLoadMore
			}, /* @__PURE__ */ __h("span", null, "Show More"), /* @__PURE__ */ __h("span", { className: "database__load-more-count" }, "(", filteredFiles.length - visibleCount, " remaining)"))))), /* @__PURE__ */ __h(AnimatePresence, null, previewFile && /* @__PURE__ */ __h(motion.div, {
				className: "database-preview-overlay",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .2 },
				onClick: () => setPreviewFile(null)
			}, /* @__PURE__ */ __h(motion.div, {
				className: "database-preview-modal",
				initial: {
					scale: .92,
					opacity: 0,
					y: 15
				},
				animate: {
					scale: 1,
					opacity: 1,
					y: 0
				},
				exit: {
					scale: .92,
					opacity: 0,
					y: 15
				},
				transition: {
					type: "spring",
					bounce: .15,
					duration: .35
				},
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "database-preview-header" }, /* @__PURE__ */ __h("div", { className: "database-preview-title-wrap" }, /* @__PURE__ */ __h("h3", {
				className: "database-preview-filename",
				title: previewFile.fileName
			}, previewFile.fileName), /* @__PURE__ */ __h("div", { className: "database-preview-badges" }, /* @__PURE__ */ __h("span", { className: "database__file-badge" }, "WebP"), /* @__PURE__ */ __h("span", { className: "database__file-size" }, formatSize(previewFile.sizeKb)))), /* @__PURE__ */ __h("button", {
				className: "database-preview-close",
				onClick: () => setPreviewFile(null),
				"aria-label": "Close preview",
				title: "Close (Esc)"
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
			})))), /* @__PURE__ */ __h("div", { className: "database-preview-img-container" }, /* @__PURE__ */ __h("img", {
				src: previewFile.publicUrl,
				alt: previewFile.fileName,
				className: "database-preview-img"
			})), /* @__PURE__ */ __h("div", { className: "database-preview-footer" }, /* @__PURE__ */ __h("div", { className: "database-preview-url-box" }, /* @__PURE__ */ __h("span", { className: "database-preview-url-text" }, previewFile.publicUrl)), /* @__PURE__ */ __h("div", { className: "database-preview-actions" }, /* @__PURE__ */ __h("button", {
				className: `database-preview-btn database-preview-btn--copy${copiedUrl === previewFile.fileName ? " database-preview-btn--copied" : ""}`,
				onClick: () => handleCopyUrl(previewFile.publicUrl, previewFile.fileName)
			}, copiedUrl === previewFile.fileName ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "20 6 9 17 4 12" })), "Copied URL") : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
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
			}), /* @__PURE__ */ __h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })), "Copy URL")), /* @__PURE__ */ __h("a", {
				href: previewFile.publicUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "database-preview-btn database-preview-btn--external"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }), /* @__PURE__ */ __h("polyline", { points: "15 3 21 3 21 9" }), /* @__PURE__ */ __h("line", {
				x1: "10",
				y1: "14",
				x2: "21",
				y2: "3"
			})), "Open Original"), /* @__PURE__ */ __h("button", {
				className: `database-preview-btn database-preview-btn--delete${!isSuperAdmin ? " database-preview-btn--locked" : ""}`,
				onClick: () => {
					if (!isSuperAdmin) {
						showError("Access denied. Only Super Admin can delete files.");
					} else {
						setFileToDelete(previewFile);
					}
				},
				title: isSuperAdmin ? "Delete file" : "Access denied (Super Admin only)"
			}, isSuperAdmin ? /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }), /* @__PURE__ */ __h("path", { d: "M10 11v6M14 11v6" }), /* @__PURE__ */ __h("path", { d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" })) : /* @__PURE__ */ __h("svg", {
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
			}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })), isSuperAdmin ? "Delete" : "Delete (Super Admin only)")))))), /* @__PURE__ */ __h(AnimatePresence, null, fileToDelete && /* @__PURE__ */ __h(motion.div, {
				className: "database-delete-overlay",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .2 },
				onClick: () => !deletingFile && setFileToDelete(null)
			}, /* @__PURE__ */ __h(motion.div, {
				className: "database-delete-modal",
				initial: {
					scale: .92,
					opacity: 0,
					y: 15
				},
				animate: {
					scale: 1,
					opacity: 1,
					y: 0
				},
				exit: {
					scale: .92,
					opacity: 0,
					y: 15
				},
				transition: {
					type: "spring",
					bounce: .15,
					duration: .35
				},
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "database-delete-icon-wrap" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }), /* @__PURE__ */ __h("path", { d: "M10 11v6M14 11v6" }), /* @__PURE__ */ __h("path", { d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" }), /* @__PURE__ */ __h("line", {
				x1: "4",
				y1: "6",
				x2: "20",
				y2: "6"
			}))), /* @__PURE__ */ __h("h3", { className: "database-delete-title" }, "Delete File"), /* @__PURE__ */ __h("p", { className: "database-delete-desc" }, "Are you sure you want to permanently delete this file from storage? This action cannot be undone."), /* @__PURE__ */ __h("div", { className: "database-delete-file-preview" }, /* @__PURE__ */ __h("img", {
				src: fileToDelete.publicUrl,
				alt: fileToDelete.fileName,
				className: "database-delete-thumbnail"
			}), /* @__PURE__ */ __h("div", { className: "database-delete-file-info" }, /* @__PURE__ */ __h("span", {
				className: "database-delete-file-name",
				title: fileToDelete.fileName
			}, fileToDelete.fileName), /* @__PURE__ */ __h("span", { className: "database-delete-file-size" }, formatSize(fileToDelete.sizeKb), " · WebP"))), /* @__PURE__ */ __h("div", { className: "database-delete-actions" }, /* @__PURE__ */ __h("button", {
				id: "database-cancel-delete-btn",
				className: "database-delete-btn database-delete-btn--cancel",
				onClick: () => setFileToDelete(null),
				disabled: !!deletingFile
			}, "Cancel"), /* @__PURE__ */ __h("button", {
				id: "database-confirm-delete-btn",
				className: "database-delete-btn database-delete-btn--danger",
				onClick: handleConfirmDelete,
				disabled: !!deletingFile
			}, deletingFile ? /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Deleting...",
				style: {
					width: 16,
					height: 16
				}
			}), "Deleting...") : /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }), /* @__PURE__ */ __h("path", { d: "M10 11v6M14 11v6" }), /* @__PURE__ */ __h("path", { d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" })), "Delete")))))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Database; } });
	});
	//#endregion

	var entryExports = __require("components/AdminPages/Database/Database.js");
	__pages["admin-database"] = entryExports.default || entryExports;
})();
