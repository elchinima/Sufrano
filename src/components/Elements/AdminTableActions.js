import { __h, __Fragment } from '../../utils/runtime.js';
import React, { useState, useRef, useEffect } from "../../utils/runtime.js";
import { motion, AnimatePresence } from "../../utils/motion.js";
const actionsIcon = "/assets/icons/actions.svg";
const AdminTableActions = ({ actions = [], index = 0, total = 1, align = "right", className = "" }) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef(null);
	const isLowestPart = total > 2 ? index >= total - 2 : index > 0 && index === total - 1;
	const direction = index === 0 || total <= 1 ? "down" : isLowestPart ? "up" : "down";
	useEffect(() => {
		if (!isOpen) return;
		const handleOutsideClick = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);
		document.addEventListener("touchstart", handleOutsideClick);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
			document.removeEventListener("touchstart", handleOutsideClick);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);
	const toggleMenu = (e) => {
		e.stopPropagation();
		setIsOpen((prev) => !prev);
	};
	const handleActionClick = (e, action) => {
		e.stopPropagation();
		setIsOpen(false);
		if (typeof action.onClick === "function") {
			action.onClick(e);
		}
	};
	return /* @__PURE__ */ __h("div", {
		ref: containerRef,
		className: `admin-table-actions ${isOpen ? "is-open" : ""} ${className}`
	}, /* @__PURE__ */ __h("button", {
		type: "button",
		className: `admin-table-actions__trigger ${isOpen ? "active" : ""}`,
		onClick: toggleMenu,
		"aria-haspopup": "true",
		"aria-expanded": isOpen,
		title: "Actions"
	}, /* @__PURE__ */ __h("img", {
		src: actionsIcon,
		alt: "Actions",
		className: "admin-table-actions__icon"
	})), /* @__PURE__ */ __h(AnimatePresence, null, isOpen && /* @__PURE__ */ __h(motion.div, {
		className: `admin-table-actions__dropdown admin-table-actions__dropdown--${direction} admin-table-actions__dropdown--align-${align}`,
		initial: {
			opacity: 0,
			scale: .92,
			y: direction === "up" ? 6 : -6
		},
		animate: {
			opacity: 1,
			scale: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			scale: .92,
			y: direction === "up" ? 6 : -6
		},
		transition: {
			duration: .18,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		onClick: (e) => e.stopPropagation()
	}, /* @__PURE__ */ __h("div", { className: "admin-table-actions__menu" }, actions.map((action, idx) => /* @__PURE__ */ __h("button", {
		key: idx,
		type: "button",
		className: `admin-table-actions__item ${action.variant ? `admin-table-actions__item--${action.variant}` : ""} ${action.locked ? "admin-table-actions__item--locked" : ""}`,
		disabled: action.disabled,
		onClick: (e) => handleActionClick(e, action),
		title: action.title || action.label
	}, action.icon && /* @__PURE__ */ __h("span", { className: "admin-table-actions__item-icon" }, action.icon), /* @__PURE__ */ __h("span", { className: "admin-table-actions__item-label" }, action.label), action.locked && /* @__PURE__ */ __h("span", {
		className: "admin-table-actions__item-lock",
		title: "Access restricted"
	}, /* @__PURE__ */ __h("svg", {
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
	}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }))), action.rightIcon && !action.locked && /* @__PURE__ */ __h("span", { className: "admin-table-actions__item-right-icon" }, action.rightIcon)))))));
};
export default AdminTableActions;
