import { useEffect } from "../../utils/runtime.js";
import { useLocation } from "../../utils/router.js";
const ScrollToTop = () => {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return null;
};
export default ScrollToTop;
