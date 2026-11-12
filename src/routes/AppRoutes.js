import { __h, __Fragment } from '../utils/runtime.js';
import React, { Suspense, lazy, useEffect } from "../utils/runtime.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "../utils/router.js";
import { AnimatePresence } from "../utils/motion.js";
import { loadPage } from "../utils/pageLoader.js";
const Home = lazy(() => loadPage("home", () => import("../components/PublicPages/Home/Home.js")));
const Catalog = lazy(() => loadPage("catalog", () => import("../components/PublicPages/Catalog/Catalog.js")));
const Auth = lazy(() => loadPage("auth", () => import("../components/PublicPages/Auth/Auth.js")));
const GoogleAuth = lazy(() => loadPage("google-auth", () => import("../components/PublicPages/Auth/GoogleAuth.js")));
const Fortune = lazy(() => loadPage("fortune", () => import("../components/UserPages/Fortune/Fortune.js")));
const Profile = lazy(() => loadPage("profile", () => import("../components/UserPages/Profile/Profile.js")));
const Promos = lazy(() => loadPage("promos", () => import("../components/UserPages/Promos/Promos.js")));
const Sessions = lazy(() => loadPage("sessions", () => import("../components/UserPages/Sessions/Sessions.js")));
const Order = lazy(() => loadPage("order", () => import("../components/UserPages/Order/Order.js")));
const Orders = lazy(() => loadPage("orders", () => import("../components/UserPages/Orders/Orders.js")));
const Addresses = lazy(() => loadPage("addresses", () => import("../components/UserPages/Addresses/Addresses.js")));
const PaymentMethods = lazy(() => loadPage("payment-methods", () => import("../components/UserPages/PaymentMethods/PaymentMethods.js")));
const UserReviews = lazy(() => loadPage("user-reviews", () => import("../components/UserPages/Reviews/Reviews.js")));
const Basket = lazy(() => loadPage("basket", () => import("../components/PublicPages/Basket/Basket.js")));
const AdminLogin = lazy(() => loadPage("admin-login", () => import("../components/AdminPages/AdminLogin/AdminLogin.js")));
const Dashboard = lazy(() => loadPage("admin-dashboard", () => import("../components/AdminPages/Dashboard/Dashboard.js")));
const AdminProducts = lazy(() => loadPage("admin-products", () => import("../components/AdminPages/Products/Products.js")));
const AdminOrders = lazy(() => loadPage("admin-orders", () => import("../components/AdminPages/Orders/Orders.js")));
const Users = lazy(() => loadPage("admin-users", () => import("../components/AdminPages/Users/Users.js")));
const Database = lazy(() => loadPage("admin-database", () => import("../components/AdminPages/Database/Database.js")));
const AdminReviews = lazy(() => loadPage("admin-reviews", () => import("../components/AdminPages/Reviews/Reviews.js")));
const AdminPromos = lazy(() => loadPage("admin-promos", () => import("../components/AdminPages/Promos/Promos.js")));
const AdminNewsletter = lazy(() => loadPage("admin-newsletter", () => import("../components/AdminPages/Newsletter/Newsletter.js")));
const AdminLogs = lazy(() => loadPage("admin-logs", () => import("../components/AdminPages/AdminLogs/AdminLogs.js")));
const AdminFooter = lazy(() => loadPage("admin-footer", () => import("../components/AdminPages/Footer/Footer.js")));
const Cashbox = lazy(() => loadPage("cashbox", () => import("../components/Cashbox/Cashbox.js")));
const CashboxHistory = lazy(() => loadPage("cashbox-history", () => import("../components/Cashbox/History/CashboxHistory.js")));
import ProtectedRoute from "./ProtectedRoute.js";
import ProfileSecurityGuard from "./ProfileSecurityGuard.js";
import AdminProtectedRoute from "./AdminProtectedRoute.js";
import CashboxProtectedRoute from "./CashboxProtectedRoute.js";
const ErrorPage = lazy(() => loadPage("error-page", () => import("../components/PublicPages/ErrorPage/ErrorPage.js")));
const Rules = lazy(() => loadPage("rules", () => import("../components/PublicPages/Rules/Rules.js")));
const Reviews = lazy(() => loadPage("reviews", () => import("../components/PublicPages/Reviews/Reviews.js")));
import ScrollToTop from "../components/Elements/ScrollToTop.js";
import SupportWidget from "../components/Elements/SupportWidget.js";
import BuyNowWidget from "../components/Elements/BuyNowWidget.js";
import FortuneWidget from "../components/Elements/FortuneWidget.js";
import { AuthProvider } from "../context/AuthContext.js";
import { AdminAuthProvider } from "../context/AdminAuthContext.js";
import { BasketProvider } from "../context/BasketContext.js";
import { ProfileSecurityProvider } from "../context/ProfileSecurityContext.js";
const AnimatedRoutes = () => {
	const location = useLocation();
	useEffect(() => {
		const cleanStripe = () => {
			const selectors = [
				"iframe[src*=\"link.stripe.com\"]",
				"iframe[src*=\"stripe.com\"]",
				"iframe[name*=\"__privateStripe\"]",
				"[class*=\"LinkFloating\"]",
				"[class*=\"link-floating\"]",
				"[data-testid*=\"link-floating\"]",
				"[class*=\"stripe-floating\"]",
				"[class*=\"FloatingButton\"]",
				"[class*=\"floating-button\"]"
			];
			selectors.forEach((sel) => {
				document.querySelectorAll(sel).forEach((el) => {
					try {
						el.remove();
					} catch {}
				});
			});
		};
		cleanStripe();
		const timer1 = setTimeout(cleanStripe, 100);
		const timer2 = setTimeout(cleanStripe, 500);
		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
		};
	}, [location.pathname]);
	return /* @__PURE__ */ __h(Suspense, { fallback: /* @__PURE__ */ __h("div", { style: {
		minHeight: "100vh",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	} }, /* @__PURE__ */ __h("img", {
		src: loaderIcon,
		alt: "Loading...",
		style: {
			width: 48,
			height: 48
		}
	})) }, /* @__PURE__ */ __h(AnimatePresence, { mode: "wait" }, /* @__PURE__ */ __h(Routes, {
		location,
		key: location.pathname
	}, /* @__PURE__ */ __h(Route, {
		path: "/",
		element: /* @__PURE__ */ __h(Home, null)
	}), /* @__PURE__ */ __h(Route, {
		path: "/home",
		element: /* @__PURE__ */ __h(Navigate, {
			to: "/",
			replace: true
		})
	}), /* @__PURE__ */ __h(Route, {
		path: "/catalog",
		element: /* @__PURE__ */ __h(Catalog, null)
	}), /* @__PURE__ */ __h(Route, {
		path: "/login",
		element: /* @__PURE__ */ __h(Auth, null)
	}), /* @__PURE__ */ __h(Route, {
		path: "/google-auth",
		element: /* @__PURE__ */ __h(GoogleAuth, null)
	}), /* @__PURE__ */ __h(Route, {
		path: "/fortune",
		element: /* @__PURE__ */ __h(ProtectedRoute, null, /* @__PURE__ */ __h(Fortune, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/profile",
		element: /* @__PURE__ */ __h(ProtectedRoute, null, /* @__PURE__ */ __h(ProfileSecurityGuard, null, /* @__PURE__ */ __h(Profile, null)))
	}), /* @__PURE__ */ __h(Route, {
		path: "/addresses",
		element: /* @__PURE__ */ __h(ProtectedRoute, null, /* @__PURE__ */ __h(ProfileSecurityGuard, null, /* @__PURE__ */ __h(Addresses, null)))
	}), /* @__PURE__ */ __h(Route, {
		path: "/adresses",
		element: /* @__PURE__ */ __h(Navigate, {
			to: "/addresses",
			replace: true
		})
	}), /* @__PURE__ */ __h(Route, {
		path: "/payment-methods",
		element: /* @__PURE__ */ __h(ProtectedRoute, null, /* @__PURE__ */ __h(ProfileSecurityGuard, null, /* @__PURE__ */ __h(PaymentMethods, null)))
	}), /* @__PURE__ */ __h(Route, {
		path: "/promos",
		element: /* @__PURE__ */ __h(ProtectedRoute, null, /* @__PURE__ */ __h(Promos, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/sessions",
		element: /* @__PURE__ */ __h(ProtectedRoute, null, /* @__PURE__ */ __h(ProfileSecurityGuard, null, /* @__PURE__ */ __h(Sessions, null)))
	}), /* @__PURE__ */ __h(Route, {
		path: "/basket",
		element: /* @__PURE__ */ __h(ProtectedRoute, null, /* @__PURE__ */ __h(Basket, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/order",
		element: /* @__PURE__ */ __h(ProtectedRoute, null, /* @__PURE__ */ __h(Order, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/orders",
		element: /* @__PURE__ */ __h(ProtectedRoute, null, /* @__PURE__ */ __h(ProfileSecurityGuard, null, /* @__PURE__ */ __h(Orders, null)))
	}), /* @__PURE__ */ __h(Route, {
		path: "/reviews",
		element: /* @__PURE__ */ __h(ProtectedRoute, null, /* @__PURE__ */ __h(ProfileSecurityGuard, null, /* @__PURE__ */ __h(UserReviews, null)))
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/login",
		element: /* @__PURE__ */ __h(AdminLogin, null)
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin",
		element: /* @__PURE__ */ __h(Navigate, {
			to: "/admin/dashboard",
			replace: true
		})
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/dashboard",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, null, /* @__PURE__ */ __h(Dashboard, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/products",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, { requiredRoles: ["admin", "superadmin"] }, /* @__PURE__ */ __h(AdminProducts, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/orders",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, null, /* @__PURE__ */ __h(AdminOrders, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/promos",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, { requiredRoles: ["admin", "superadmin"] }, /* @__PURE__ */ __h(AdminPromos, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/users",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, { requiredRoles: ["admin", "superadmin"] }, /* @__PURE__ */ __h(Users, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/database",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, { requiredRoles: ["admin", "superadmin"] }, /* @__PURE__ */ __h(Database, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/newsletter",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, { requiredRoles: ["admin", "superadmin"] }, /* @__PURE__ */ __h(AdminNewsletter, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/reviews",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, null, /* @__PURE__ */ __h(AdminReviews, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/logs",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, null, /* @__PURE__ */ __h(AdminLogs, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/admin/footer",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, { requiredRoles: ["superadmin"] }, /* @__PURE__ */ __h(AdminFooter, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/footer",
		element: /* @__PURE__ */ __h(AdminProtectedRoute, { requiredRoles: ["superadmin"] }, /* @__PURE__ */ __h(AdminFooter, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/cashbox",
		element: /* @__PURE__ */ __h(CashboxProtectedRoute, null, /* @__PURE__ */ __h(Cashbox, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/cashbox/history",
		element: /* @__PURE__ */ __h(CashboxProtectedRoute, { allowedRoles: [
			"leadstaff",
			"admin",
			"superadmin"
		] }, /* @__PURE__ */ __h(CashboxHistory, null))
	}), /* @__PURE__ */ __h(Route, {
		path: "/rules",
		element: /* @__PURE__ */ __h(Rules, null)
	}), /* @__PURE__ */ __h(Route, {
		path: "/terms",
		element: /* @__PURE__ */ __h(Navigate, {
			to: "/rules",
			replace: true
		})
	}), /* @__PURE__ */ __h(Route, {
		path: "/review",
		element: /* @__PURE__ */ __h(Reviews, null)
	}), /* @__PURE__ */ __h(Route, {
		path: "/error",
		element: /* @__PURE__ */ __h(ErrorPage, null)
	}), /* @__PURE__ */ __h(Route, {
		path: "*",
		element: /* @__PURE__ */ __h(ErrorPage, { defaultCode: "404" })
	}))));
};
const AppRoutes = () => {
	return /* @__PURE__ */ __h(Router, null, /* @__PURE__ */ __h(AuthProvider, null, /* @__PURE__ */ __h(AdminAuthProvider, null, /* @__PURE__ */ __h(BasketProvider, null, /* @__PURE__ */ __h(ProfileSecurityProvider, null, /* @__PURE__ */ __h(ScrollToTop, null), /* @__PURE__ */ __h(AnimatedRoutes, null), /* @__PURE__ */ __h(SupportWidget, null), /* @__PURE__ */ __h(BuyNowWidget, null), /* @__PURE__ */ __h(FortuneWidget, null))))));
};
export default AppRoutes;
