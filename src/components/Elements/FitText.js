import { __h } from '../../utils/runtime.js';
import React from "../../utils/runtime.js";
const FitText = ({ children, as: Component = "span", maxFontSize, minFontSize, unit, className = "", style = {}, ...props }) => {
	const titleText = typeof children === "string" ? children : undefined;
	return /* @__PURE__ */ __h(Component, {
		className: `fit-text-container ${className}`.trim(),
		title: props.title ?? titleText,
		style: {
			display: "block",
			width: "100%",
			minWidth: 0,
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
			...style
		},
		...props
	}, children);
};
export default FitText;
