import { __h, __Fragment } from '../../../utils/runtime.js';
import React from "../../../utils/runtime.js";
import { motion } from "../../../utils/motion.js";
const BANKNOTES = [
	5,
	20,
	50,
	100
];
const CashboxNumpad = ({ receivedAmount, changeAmount, totalAmount, onNumpadPress, onBanknoteClick, onPayCard, onPayCash }) => {
	return /* @__PURE__ */ __h("div", { className: "cashbox-numpad" }, /* @__PURE__ */ __h("div", { className: "cashbox-numpad__grid" }, /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key",
		onClick: () => onNumpadPress("7")
	}, "7"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key",
		onClick: () => onNumpadPress("8")
	}, "8"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key",
		onClick: () => onNumpadPress("9")
	}, "9"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key cashbox-numpad__key--note",
		onClick: () => onBanknoteClick(5)
	}, "5₼"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key",
		onClick: () => onNumpadPress("4")
	}, "4"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key",
		onClick: () => onNumpadPress("5")
	}, "5"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key",
		onClick: () => onNumpadPress("6")
	}, "6"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key cashbox-numpad__key--note",
		onClick: () => onBanknoteClick(20)
	}, "20₼"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key",
		onClick: () => onNumpadPress("1")
	}, "1"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key",
		onClick: () => onNumpadPress("2")
	}, "2"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key",
		onClick: () => onNumpadPress("3")
	}, "3"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key cashbox-numpad__key--note",
		onClick: () => onBanknoteClick(50)
	}, "50₼"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key cashbox-numpad__key--fn",
		onClick: () => onNumpadPress(".")
	}, "."), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key",
		onClick: () => onNumpadPress("0")
	}, "0"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key cashbox-numpad__key--fn",
		onClick: () => onNumpadPress("⌫"),
		title: "Backspace"
	}, "⌫"), /* @__PURE__ */ __h("button", {
		type: "button",
		className: "cashbox-numpad__key cashbox-numpad__key--note",
		onClick: () => onBanknoteClick(100)
	}, "100₼")), /* @__PURE__ */ __h("div", { className: "cashbox-numpad__tender" }, /* @__PURE__ */ __h("div", { className: "cashbox-numpad__tender-row" }, /* @__PURE__ */ __h("span", { className: "cashbox-numpad__tender-label" }, "Received:"), /* @__PURE__ */ __h("span", { className: "cashbox-numpad__tender-val" }, receivedAmount, " ₼"), /* @__PURE__ */ __h("span", { className: "cashbox-numpad__tender-sep" }, "|"), /* @__PURE__ */ __h("span", { className: "cashbox-numpad__tender-label" }, "Change:"), /* @__PURE__ */ __h("span", { className: `cashbox-numpad__tender-val ${changeAmount > 0 ? "cashbox-numpad__tender-val--green" : ""}` }, changeAmount.toFixed(2), " ₼"))), /* @__PURE__ */ __h("div", { className: "cashbox-numpad__actions" }, /* @__PURE__ */ __h(motion.button, {
		type: "button",
		className: "cashbox-numpad__pay-btn cashbox-numpad__pay-btn--card",
		whileTap: { scale: .97 },
		onClick: onPayCard
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("rect", {
		x: "2",
		y: "5",
		width: "20",
		height: "14",
		rx: "2"
	}), /* @__PURE__ */ __h("line", {
		x1: "2",
		y1: "10",
		x2: "22",
		y2: "10"
	})), /* @__PURE__ */ __h("span", null, "Pay by Card")), /* @__PURE__ */ __h(motion.button, {
		type: "button",
		className: "cashbox-numpad__pay-btn cashbox-numpad__pay-btn--cash",
		whileTap: { scale: .97 },
		onClick: onPayCash
	}, /* @__PURE__ */ __h("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2"
	}, /* @__PURE__ */ __h("rect", {
		x: "2",
		y: "6",
		width: "20",
		height: "12",
		rx: "2"
	}), /* @__PURE__ */ __h("circle", {
		cx: "12",
		cy: "12",
		r: "2"
	}), /* @__PURE__ */ __h("path", { d: "M6 12h.01M18 12h.01" })), /* @__PURE__ */ __h("span", null, "Cash Payment"))));
};
export default CashboxNumpad;
