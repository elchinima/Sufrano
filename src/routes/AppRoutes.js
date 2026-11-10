import { __h, __Fragment } from '../utils/runtime.js';
import React, { Suspense, useEffect } from "../utils/runtime.js";
const loaderIcon = "/assets/icons/loader-animated.svg";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "../utils/router.js";
import { AnimatePresence } from "../utils/motion.js";
import Home from "../components/PublicPages/Home/Home.js";
import Catalog from "../components/PublicPages/Catalog/Catalog.js";
import Auth from "../components/PublicPages/Auth/Auth.js";
import GoogleAuth from "../components/PublicPages/Auth/GoogleAuth.js";
import Fortune from "../components/UserPages/Fortune/Fortune.js";
import Profile from "../components/UserPages/Profile/Profile.js";
import Promos from "../components/UserPages/Promos/Promos.js";
import Sessions from "../components/UserPages/Sessions/Sessions.js";
import Order from "../components/UserPages/Order/Order.js";
import Orders from "../components/UserPages/Orders/Orders.js";
import Addresses from "../components/UserPages/Addresses/Addresses.js";
import PaymentMethods from "../components/UserPages/PaymentMethods/PaymentMethods.js";
import UserReviews from "../components/UserPages/Reviews/Reviews.js";
import Basket from "../components/PublicPages/Basket/Basket.js";
import AdminLogin from "../components/AdminPages/AdminLogin/AdminLogin.js";
import Dashboard from "../components/AdminPages/Dashboard/Dashboard.js";
import AdminProducts from "../components/AdminPages/Products/Products.js";
import AdminOrders from "../components/AdminPages/Orders/Orders.js";
import Users from "../components/AdminPages/Users/Users.js";
import Database from "../components/AdminPages/Database/Database.js";
import AdminReviews from "../components/AdminPages/Reviews/Reviews.js";
import AdminPromos from "../components/AdminPages/Promos/Promos.js";
import AdminNewsletter from "../components/AdminPages/Newsletter/Newsletter.js";
import AdminLogs from "../components/AdminPages/AdminLogs/AdminLogs.js";
import Cashbox from "../components/Cashbox/Cashbox.js";
import CashboxHistory from "../components/Cashbox/History/CashboxHistory.js";
import ProtectedRoute from "./ProtectedRoute.js";
import ProfileSecurityGuard from "./ProfileSecurityGuard.js";
import AdminProtectedRoute from "./AdminProtectedRoute.js";
import CashboxProtectedRoute from "./CashboxProtectedRoute.js";
import ErrorPage from "../components/PublicPages/ErrorPage/ErrorPage.js";
import Rules from "../components/PublicPages/Rules/Rules.js";
import Reviews from "../components/PublicPages/Reviews/Reviews.js";
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
