import { __h, __Fragment } from '../../utils/runtime.js';
import React, { useEffect, useState } from "../../utils/runtime.js";
import { createPortal } from "../../utils/runtime.js";
import { motion, AnimatePresence } from "../../utils/motion.js";
const modalStyles = `
.animated-modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: 99999;
}
.animated-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.animated-modal-container {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
}
.animated-modal-content {
  display: inline-flex;
  will-change: transform, opacity, border-radius;
  width: 100%;
  max-width: fit-content;
}
.animated-modal-content > * {
  border-radius: inherit !important;
}
@media (max-width: 480px) {
  .animated-modal-content {
    max-width: 100%;
  }
}
`;
const AnimatedModalWrapper = ({ isOpen, onClose, children, targetBorderRadius = "24px", zIndex = 99999 }) => {
	const [openPos, setOpenPos] = useState({
		x: window.innerWidth / 2,
		y: window.innerHeight / 2
	});
	const [closePos, setClosePos] = useState(null);
	useEffect(() => {
		const handleMouseDown = (e) => {
			if (!isOpen) {
				setOpenPos({
					x: e.clientX,
					y: e.clientY
				});
				setClosePos(null);
			} else {
				setClosePos({
					x: e.clientX,
					y: e.clientY
				});
			}
		};
		document.addEventListener("mousedown", handleMouseDown, true);
		return () => document.removeEventListener("mousedown", handleMouseDown, true);
	}, [isOpen]);
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);
	const originPos = closePos || openPos;
	const initialX = originPos.x - window.innerWidth / 2;
	const initialY = originPos.y - window.innerHeight / 2;
	const modalVariants = {
		hidden: {
			x: initialX,
			y: initialY,
			scale: .05,
			opacity: 0,
			borderRadius: "50%"
		},
		visible: {
			x: 0,
			y: 0,
			scale: 1,
			opacity: 1,
			borderRadius: targetBorderRadius,
			transition: {
				duration: .7,
				ease: [
					.16,
					1,
					.3,
					1
				],
				x: {
					delay: .05,
					duration: .65,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				y: {
					delay: .05,
					duration: .65,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				scale: {
					duration: .6,
					delay: .15,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				borderRadius: {
					duration: .6,
					delay: .15,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				opacity: { duration: .05 }
			}
		},
		exit: {
			x: initialX,
			y: initialY,
			scale: .05,
			opacity: 0,
			borderRadius: "50%",
			transition: {
				duration: .58,
				ease: [
					.16,
					1,
					.3,
					1
				],
				scale: {
					duration: .58,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				borderRadius: {
					duration: .58,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				opacity: {
					duration: .13,
					delay: .45
				}
			}
		}
	};
	const modalContent = /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("style", null, modalStyles), /* @__PURE__ */ __h(AnimatePresence, null, isOpen && /* @__PURE__ */ __h("div", {
		key: "modal-wrapper",
		className: "animated-modal-wrapper",
		style: { zIndex },
		onMouseDown: (e) => {
			if (e.target === e.currentTarget) {
				onClose();
			}
		}
	}, /* @__PURE__ */ __h(motion.div, {
		className: "animated-modal-backdrop",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .4 }
	}), /* @__PURE__ */ __h("div", {
		className: "animated-modal-container",
		style: { pointerEvents: "none" }
	}, /* @__PURE__ */ __h(motion.div, {
		className: "animated-modal-content",
		style: { pointerEvents: "auto" },
		variants: modalVariants,
		initial: "hidden",
		animate: "visible",
		exit: "exit"
	}, children)))));
	if (typeof document !== "undefined") {
		return createPortal(modalContent, document.body);
	}
	return modalContent;
};
export default AnimatedModalWrapper;
