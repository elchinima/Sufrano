import { __h, __Fragment } from '../../utils/runtime.js';
import React from "../../utils/runtime.js";
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null
		};
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
	}
	handleReload = () => {
		window.location.reload();
	};
	handleGoHome = () => {
		window.location.href = "/";
	};
	render() {
		if (this.state.hasError) {
			return /* @__PURE__ */ __h("div", { style: {
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#24050d",
				backgroundImage: "radial-gradient(circle at top right, rgba(212, 175, 55, 0.15) 0%, transparent 50%), radial-gradient(circle at bottom left, #24050d 0%, #4a0e1c 100%)",
				color: "#fff",
				fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
				padding: "24px"
			} }, /* @__PURE__ */ __h("div", { style: {
				textAlign: "center",
				maxWidth: "480px"
			} }, /* @__PURE__ */ __h("div", { style: {
				fontSize: "64px",
				marginBottom: "16px"
			} }, "☕"), /* @__PURE__ */ __h("h1", { style: {
				fontSize: "24px",
				fontWeight: 700,
				marginBottom: "12px",
				letterSpacing: "-0.02em"
			} }, "Something went wrong"), /* @__PURE__ */ __h("p", { style: {
				fontSize: "15px",
				color: "rgba(255,255,255,0.7)",
				marginBottom: "32px",
				lineHeight: 1.6
			} }, "An unexpected error occurred. Please try refreshing the page or go back to the homepage."), /* @__PURE__ */ __h("div", { style: {
				display: "flex",
				gap: "12px",
				justifyContent: "center",
				flexWrap: "wrap"
			} }, /* @__PURE__ */ __h("button", {
				onClick: this.handleReload,
				style: {
					padding: "12px 28px",
					borderRadius: "12px",
					border: "none",
					background: "#d4af37",
					color: "#fff",
					fontWeight: 600,
					fontSize: "14px",
					cursor: "pointer",
					transition: "background 0.2s",
					fontFamily: "inherit"
				},
				onMouseOver: (e) => e.target.style.background = "#e5c158",
				onMouseOut: (e) => e.target.style.background = "#d4af37"
			}, "Refresh page"), /* @__PURE__ */ __h("button", {
				onClick: this.handleGoHome,
				style: {
					padding: "12px 28px",
					borderRadius: "12px",
					border: "1px solid rgba(255,255,255,0.2)",
					background: "rgba(255,255,255,0.1)",
					color: "#fff",
					fontWeight: 600,
					fontSize: "14px",
					cursor: "pointer",
					transition: "background 0.2s",
					fontFamily: "inherit",
					backdropFilter: "blur(8px)"
				},
				onMouseOver: (e) => e.target.style.background = "rgba(255,255,255,0.15)",
				onMouseOut: (e) => e.target.style.background = "rgba(255,255,255,0.1)"
			}, "Go to homepage"))));
		}
		return this.props.children;
	}
}
export default ErrorBoundary;
