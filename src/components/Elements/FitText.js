import { __h } from '../../utils/runtime.js';
import React, { useRef, useState, useLayoutEffect, useEffect } from "../../utils/runtime.js";
const FitText = ({ children, as: Component = "span", maxFontSize, minFontSize, unit, className = "", style = {}, ...props }) => {
	const containerRef = useRef(null);
	const textRef = useRef(null);
	const [overflowPx, setOverflowPx] = useState(0);
	const updateOverflow = () => {
		const container = containerRef.current;
		const text = textRef.current;
		if (!container || !text) return;
		const availableWidth = container.clientWidth;
		if (availableWidth <= 0) return;
		const naturalWidth = text.scrollWidth;
		const diff = Math.ceil(naturalWidth - availableWidth);
		setOverflowPx(diff > 1 ? diff : 0);
	};
	useLayoutEffect(() => {
		updateOverflow();
	}, [children]);
	useEffect(() => {
		const container = containerRef.current;
		const text = textRef.current;
		if (!container) return;
		const resizeObserver = new ResizeObserver(() => {
			updateOverflow();
		});
		resizeObserver.observe(container);
		if (text) resizeObserver.observe(text);
		if (document.fonts && document.fonts.ready) {
			document.fonts.ready.then(updateOverflow).catch(() => {});
		}
		return () => {
			resizeObserver.disconnect();
		};
	}, [children]);
	const isOverflowing = overflowPx > 0;
	const durationSec = isOverflowing ? Math.min(12, Math.max(4.5, overflowPx / 22 + 3.5)).toFixed(2) : 0;
	const titleText = typeof children === "string" ? children : undefined;
	return /* @__PURE__ */ __h(Component, {
		ref: containerRef,
		className: `fit-text-container ${isOverflowing ? "fit-text-container--sliding" : ""} ${className}`.trim(),
		title: props.title ?? titleText,
		style: {
			display: "block",
			width: "100%",
			minWidth: 0,
			overflow: "hidden",
			whiteSpace: "nowrap",
			textOverflow: "clip",
			...(isOverflowing ? { textAlign: "left" } : {}),
			...style
		},
		...props
	}, /* @__PURE__ */ __h("span", {
		ref: textRef,
		className: `fit-text-inner ${isOverflowing ? "fit-text-inner--sliding" : ""}`.trim(),
		style: {
			display: "inline-block",
			whiteSpace: "nowrap",
			...(isOverflowing ? {
				"--fit-text-offset": `-${overflowPx}px`,
				"--fit-text-duration": `${durationSec}s`
			} : {})
		}
	}, children));
};
export default FitText;
