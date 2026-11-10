// Pure Vanilla JS Router for Süfrano (History API)
import { h, Fragment, useState, useEffect, useCallback, useMemo } from './runtime.js';

let currentLocationState = (typeof window !== 'undefined' && window.history?.state) || null;
const routerListeners = new Set();
let virtualLocation = null;

function normalizeRoutePath(rawPathname) {
  if (!rawPathname) return '/';
  let p = rawPathname.replace(/\\/g, '/');
  if (p.endsWith('/src/index.html') || p === '/src' || p === '/src/') {
    return '/';
  }
  if (p.startsWith('/src/')) {
    p = p.slice(4) || '/';
  }
  if (p.endsWith('/index.html')) {
    return '/';
  }
  return p || '/';
}

function getSnapshot() {
  if (virtualLocation) {
    return {
      pathname: virtualLocation.pathname,
      search: virtualLocation.search,
      hash: virtualLocation.hash,
      state: currentLocationState
    };
  }
  const rawPathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  return {
    pathname: normalizeRoutePath(rawPathname),
    search: (typeof window !== 'undefined' && window.location.search) || '',
    hash: (typeof window !== 'undefined' && window.location.hash) || '',
    state: currentLocationState
  };
}

let currentLocation = getSnapshot();

function notifyListeners() {
  currentLocation = getSnapshot();
  for (const listener of Array.from(routerListeners)) {
    try {
      listener(currentLocation);
    } catch (err) {
      console.error('[Router Listener Error]', err);
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', (e) => {
    currentLocationState = e.state || null;
    virtualLocation = null;
    notifyListeners();
  });
}

export function navigateTo(to, options = {}) {
  if (typeof to === 'number') {
    window.history.go(to);
    return;
  }

  let targetUrl = '/';
  if (typeof to === 'string') {
    targetUrl = to;
  } else if (to && typeof to === 'object') {
    const p = to.pathname || currentLocation.pathname || '/';
    const s = to.search ? (to.search.startsWith('?') ? to.search : `?${to.search}`) : '';
    const hash = to.hash ? (to.hash.startsWith('#') ? to.hash : `#${to.hash}`) : '';
    targetUrl = `${p}${s}${hash}`;
  }

  currentLocationState = options.state !== undefined ? options.state : null;

  const isFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:';
  const isLiveServerSrc =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/src/') || window.location.pathname.endsWith('/index.html'));

  if (isFileProtocol || isLiveServerSrc) {
    const parsed = new URL(targetUrl, 'http://localhost');
    virtualLocation = {
      pathname: normalizeRoutePath(parsed.pathname),
      search: parsed.search || '',
      hash: parsed.hash || ''
    };
  } else {
    virtualLocation = null;
    try {
      if (options.replace) {
        window.history.replaceState(currentLocationState, '', targetUrl);
      } else {
        window.history.pushState(currentLocationState, '', targetUrl);
      }
    } catch {
      const parsed = new URL(targetUrl, 'http://localhost');
      virtualLocation = {
        pathname: normalizeRoutePath(parsed.pathname),
        search: parsed.search || '',
        hash: parsed.hash || ''
      };
    }
  }

  notifyListeners();
}

export function useLocation() {
  const [loc, setLoc] = useState(() => currentLocation);
  useEffect(() => {
    const handler = (nextLoc) => setLoc(nextLoc);
    routerListeners.add(handler);
    if (loc.pathname !== currentLocation.pathname || loc.search !== currentLocation.search) {
      setLoc(currentLocation);
    }
    return () => routerListeners.delete(handler);
  }, []);
  return loc;
}

export function useNavigate() {
  return useCallback((to, options) => {
    navigateTo(to, options);
  }, []);
}

export function useSearchParams() {
  const loc = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const setSearchParams = useCallback((nextInit, navigateOptions) => {
    let params;
    if (typeof nextInit === 'function') {
      params = new URLSearchParams(nextInit(new URLSearchParams(window.location.search)));
    } else {
      params = new URLSearchParams(nextInit);
    }
    const qs = params.toString();
    const target = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash || ''}`;
    navigateTo(target, navigateOptions);
  }, []);

  return [searchParams, setSearchParams];
}

export function useParams() {
  return {};
}

export function BrowserRouter({ children }) {
  if (Array.isArray(children)) {
    return h(Fragment, null, ...children);
  }
  return children ?? null;
}

export const Router = BrowserRouter;

export function Route() {
  return null;
}

function matchPath(routePath, currentPathname) {
  if (!routePath) return false;
  if (routePath === '*') return true;
  const normRoute = routePath === '/' ? '/' : routePath.replace(/\/+$/, '');
  const normPath = currentPathname === '/' ? '/' : currentPathname.replace(/\/+$/, '');
  if (normRoute.toLowerCase() === normPath.toLowerCase()) return true;

  if (normRoute.includes(':')) {
    const rParts = normRoute.split('/');
    const pParts = normPath.split('/');
    if (rParts.length !== pParts.length) return false;
    return rParts.every((seg, idx) => seg.startsWith(':') || seg.toLowerCase() === pParts[idx].toLowerCase());
  }
  return false;
}

export function Routes({ children, location: overrideLocation }) {
  const liveLocation = useLocation();
  const loc = overrideLocation || liveLocation;
  const pathname = loc.pathname || '/';

  const list = Array.isArray(children) ? children.flat(Infinity) : [children];
  let fallbackElement = null;

  for (const child of list) {
    if (!child || !child.props) continue;
    const { path, element } = child.props;
    if (path === '*') {
      fallbackElement = element;
      continue;
    }
    if (matchPath(path, pathname)) {
      return element ?? null;
    }
  }

  return fallbackElement ?? null;
}

export function Navigate({ to, replace = true, state }) {
  useEffect(() => {
    navigateTo(to, { replace, state });
  }, [to, replace, state]);
  return null;
}

export function Link({ to, replace, state, onClick, target, children, ...rest }) {
  const href = typeof to === 'string' ? to : (to?.pathname || '/');

  const handleClick = (e) => {
    if (typeof onClick === 'function') {
      onClick(e);
    }
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      target === '_blank' ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }
    e.preventDefault();
    navigateTo(to, { replace, state });
  };

  const childList = Array.isArray(children) ? children : [children];
  return h('a', { ...rest, href, target, onClick: handleClick }, ...childList);
}

export function NavLink({ to, className, end, children, ...rest }) {
  const loc = useLocation();
  const targetPath = typeof to === 'string' ? to : (to?.pathname || '/');
  const normTarget = targetPath === '/' ? '/' : targetPath.replace(/\/+$/, '');
  const normCurrent = loc.pathname === '/' ? '/' : loc.pathname.replace(/\/+$/, '');

  const isActive = end
    ? normCurrent.toLowerCase() === normTarget.toLowerCase()
    : normCurrent.toLowerCase() === normTarget.toLowerCase() ||
      (normTarget !== '/' && normCurrent.toLowerCase().startsWith(`${normTarget.toLowerCase()}/`));

  const resolvedClass =
    typeof className === 'function'
      ? className({ isActive })
      : isActive
        ? `${className || ''} active`.trim()
        : className || '';

  return h(Link, { ...rest, to, className: resolvedClass }, ...(Array.isArray(children) ? children : [children]));
}
