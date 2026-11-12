(function () {
	var __mods = (window.__SUFRANO_MODULES__ = window.__SUFRANO_MODULES__ || {});
	var __cache = (window.__SUFRANO_CACHE__ = window.__SUFRANO_CACHE__ || {});
	window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {};
	window.__SUFRANO_USE_PAGE_BUNDLES__ = true;

	function __define(id, factory) {
		__mods[id] = factory;
	}

	function __require(id) {
		if (__cache[id]) return __cache[id].exports;
		var factory = __mods[id];
		if (!factory) throw new Error("Module not found: " + id);
		var module = { exports: {} };
		__cache[id] = module;
		factory(module.exports, __require, module);
		return module.exports;
	}

	window.__SUFRANO_DEFINE__ = __define;
	window.__SUFRANO_REQUIRE__ = __require;

	//#region utils/runtime.js
	__define("utils/runtime.js", function (exports, __require, module) {
		// Pure Vanilla JS DOM & State Runtime for Süfrano (Zero React dependency)

		const Fragment = Symbol('Fragment');
		const TEXT_NODE = Symbol('TextNode');
		const EMPTY_NODE = Symbol('EmptyNode');
		const PORTAL_NODE = Symbol('PortalNode');

		const SVG_NS = 'http://www.w3.org/2000/svg';

		const UNITLESS_STYLES = new Set([
		  'animationIterationCount', 'aspectRatio', 'borderImageOutset', 'borderImageSlice',
		  'borderImageWidth', 'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup', 'columnCount',
		  'columns', 'flex', 'flexGrow', 'flexPositive', 'flexShrink', 'flexNegative',
		  'flexOrder', 'gridArea', 'gridRow', 'gridRowEnd', 'gridRowSpan', 'gridRowStart',
		  'gridColumn', 'gridColumnEnd', 'gridColumnSpan', 'gridColumnStart', 'fontWeight',
		  'lineClamp', 'WebkitLineClamp', 'lineHeight', 'opacity', 'order', 'orphans',
		  'tabSize', 'widows', 'zIndex', 'zoom', 'fillOpacity', 'floodOpacity',
		  'stopOpacity', 'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit',
		  'strokeOpacity', 'strokeWidth', 'scale'
		]);

		const SVG_ATTR_MAP = {
		  strokeWidth: 'stroke-width',
		  strokeLinecap: 'stroke-linecap',
		  strokeLinejoin: 'stroke-linejoin',
		  strokeDasharray: 'stroke-dasharray',
		  strokeDashoffset: 'stroke-dashoffset',
		  strokeMiterlimit: 'stroke-miterlimit',
		  strokeOpacity: 'stroke-opacity',
		  fillRule: 'fill-rule',
		  clipRule: 'clip-rule',
		  clipPath: 'clip-path',
		  fillOpacity: 'fill-opacity',
		  stopColor: 'stop-color',
		  stopOpacity: 'stop-opacity',
		  textAnchor: 'text-anchor',
		  dominantBaseline: 'dominant-baseline',
		  alignmentBaseline: 'alignment-baseline',
		  baselineShift: 'baseline-shift',
		  fontFamily: 'font-family',
		  fontSize: 'font-size',
		  fontWeight: 'font-weight',
		  letterSpacing: 'letter-spacing',
		  vectorEffect: 'vector-effect',
		  pointerEvents: 'pointer-events',
		  shapeRendering: 'shape-rendering',
		  xlinkHref: 'href'
		};

		function h(type, props, ...rawChildren) {
		  const normalizedProps = props ? { ...props } : {};
		  const key = normalizedProps.key !== undefined ? String(normalizedProps.key) : null;
		  const ref = normalizedProps.ref !== undefined ? normalizedProps.ref : null;
		  delete normalizedProps.key;
		  delete normalizedProps.ref;

		  let childrenArg = rawChildren;
		  if (childrenArg.length === 0 && normalizedProps.children !== undefined) {
		    childrenArg = Array.isArray(normalizedProps.children)
		      ? normalizedProps.children
		      : [normalizedProps.children];
		  }

		  if (typeof type === 'function' && type !== Fragment) {
		    if (rawChildren.length === 1) {
		      normalizedProps.children = rawChildren[0];
		    } else if (rawChildren.length > 1) {
		      normalizedProps.children = rawChildren;
		    }
		    return {
		      type,
		      props: normalizedProps,
		      children: [],
		      key,
		      ref,
		      _dom: null,
		      _instance: null
		    };
		  }

		  const children = normalizeChildren(childrenArg);
		  return {
		    type,
		    props: normalizedProps,
		    children,
		    key,
		    ref,
		    _dom: null,
		    _instance: null
		  };
		}

		function normalizeChildren(rawChildren, prefix = '') {
		  const out = [];
		  for (let i = 0; i < rawChildren.length; i++) {
		    const child = rawChildren[i];
		    if (Array.isArray(child)) {
		      const nested = normalizeChildren(child, `${prefix}${i}_`);
		      for (let j = 0; j < nested.length; j++) {
		        out.push(nested[j]);
		      }
		    } else {
		      const vnode = normalizeVNode(child);
		      if (vnode.key === null && prefix) {
		        vnode.key = `__arr_${prefix}${i}`;
		      }
		      out.push(vnode);
		    }
		  }
		  return out;
		}

		function normalizeVNode(node) {
		  if (node === null || node === undefined || typeof node === 'boolean') {
		    return { type: EMPTY_NODE, props: {}, children: [], key: null, ref: null, _dom: null };
		  }
		  if (typeof node === 'string' || typeof node === 'number') {
		    return {
		      type: TEXT_NODE,
		      props: { nodeValue: String(node) },
		      children: [],
		      key: null,
		      ref: null,
		      _dom: null
		    };
		  }
		  if (Array.isArray(node)) {
		    const children = normalizeChildren(node);
		    return {
		      type: Fragment,
		      props: {},
		      children: children.length > 0 ? children : [normalizeVNode(null)],
		      key: null,
		      ref: null,
		      _dom: null
		    };
		  }
		  if (node.type === Fragment && (!node.children || node.children.length === 0)) {
		    return {
		      ...node,
		      children: [normalizeVNode(null)]
		    };
		  }
		  return node;
		}

		function createPortal(children, container) {
		  const normalized = normalizeVNode(children);
		  return {
		    type: PORTAL_NODE,
		    props: { container: container || document.body },
		    children: [normalized],
		    key: null,
		    ref: null,
		    _dom: null
		  };
		}

		let currentInstance = null;
		const dirtyInstances = new Set();
		let isFlushing = false;
		let currentBatchUpdated = null;
		const pendingEffectInstances = [];

		function scheduleUpdate(instance) {
		  if (!instance || !instance.isMounted) return;
		  dirtyInstances.add(instance);
		  if (!isFlushing) {
		    isFlushing = true;
		    queueMicrotask(flushUpdates);
		  }
		}

		function flushUpdates() {
		  let guard = 0;
		  isFlushing = true;
		  try {
		    while ((dirtyInstances.size > 0 || pendingEffectInstances.length > 0) && guard < 50) {
		      guard++;
		      while (dirtyInstances.size > 0) {
		        const batch = Array.from(dirtyInstances).sort((a, b) => a.depth - b.depth);
		        dirtyInstances.clear();
		        const batchUpdated = new Set();
		        currentBatchUpdated = batchUpdated;
		        try {
		          for (const inst of batch) {
		            if (inst.isMounted && !batchUpdated.has(inst)) {
		              updateComponent(inst);
		            }
		          }
		        } finally {
		          currentBatchUpdated = null;
		        }
		      }
		      flushEffects();
		    }
		  } finally {
		    isFlushing = false;
		  }
		}

		function flushEffects() {
		  while (pendingEffectInstances.length > 0) {
		    const inst = pendingEffectInstances.shift();
		    if (!inst.isMounted) continue;
		    const effects = inst.pendingEffects.splice(0);
		    for (const hook of effects) {
		      try {
		        if (typeof hook.cleanup === 'function') {
		          hook.cleanup();
		          hook.cleanup = null;
		        }
		        const cleanup = hook.callback();
		        if (typeof cleanup === 'function') {
		          hook.cleanup = cleanup;
		        }
		      } catch (err) {
		        console.error('[Runtime Effect Error]', err);
		      }
		    }
		  }
		}

		function getNextHook() {
		  if (!currentInstance) {
		    throw new Error('Hook called outside of component render');
		  }
		  const idx = currentInstance.hookIndex++;
		  if (idx >= currentInstance.hooks.length) {
		    currentInstance.hooks.push({});
		  }
		  return currentInstance.hooks[idx];
		}

		function useState(initialValue) {
		  const inst = currentInstance;
		  const hook = getNextHook();
		  if (!(' initialized' in hook)) {
		    hook[' initialized'] = true;
		    hook.state = typeof initialValue === 'function' ? initialValue() : initialValue;
		    hook.setState = (updater) => {
		      if (!inst.isMounted) return;
		      const nextState = typeof updater === 'function' ? updater(hook.state) : updater;
		      if (!Object.is(nextState, hook.state)) {
		        hook.state = nextState;
		        scheduleUpdate(inst);
		      }
		    };
		  }
		  return [hook.state, hook.setState];
		}

		function useRef(initialValue) {
		  const hook = getNextHook();
		  if (!('ref' in hook)) {
		    hook.ref = { current: initialValue };
		  }
		  return hook.ref;
		}

		function useMemo(factory, deps) {
		  const hook = getNextHook();
		  if (!('initialized' in hook) || depsChanged(hook.deps, deps)) {
		    hook.initialized = true;
		    hook.deps = deps;
		    hook.value = factory();
		  }
		  return hook.value;
		}

		function useCallback(callback, deps) {
		  return useMemo(() => callback, deps);
		}

		function useEffect(callback, deps) {
		  const inst = currentInstance;
		  const hook = getNextHook();
		  if (!('initialized' in hook) || depsChanged(hook.deps, deps)) {
		    hook.initialized = true;
		    hook.deps = deps;
		    hook.callback = callback;
		    inst.pendingEffects.push(hook);
		    if (!pendingEffectInstances.includes(inst)) {
		      pendingEffectInstances.push(inst);
		    }
		  }
		}

		function depsChanged(oldDeps, newDeps) {
		  if (!oldDeps || !newDeps) return true;
		  if (oldDeps.length !== newDeps.length) return true;
		  for (let i = 0; i < oldDeps.length; i++) {
		    if (!Object.is(oldDeps[i], newDeps[i])) return true;
		  }
		  return false;
		}

		function createContext(defaultValue) {
		  const contextId = Symbol('Context');
		  const contextObj = {
		    _id: contextId,
		    _defaultValue: defaultValue,
		    _currentValue: defaultValue,
		    _subscribers: new Set(),
		    Provider: null
		  };

		  function Provider(props) {
		    const children = props.children;
		    if (Array.isArray(children)) {
		      return h(Fragment, null, ...children);
		    }
		    return children ?? null;
		  }
		  Provider._isContextProvider = true;
		  Provider._contextId = contextId;
		  Provider._context = contextObj;
		  contextObj.Provider = Provider;

		  return contextObj;
		}

		function useContext(context) {
		  if (!context) return undefined;
		  if (currentInstance) {
		    context._subscribers.add(currentInstance);
		    if (!currentInstance.subscribedContexts) {
		      currentInstance.subscribedContexts = new Set();
		    }
		    currentInstance.subscribedContexts.add(context);
		    if (currentInstance.contextMap && currentInstance.contextMap.has(context._id)) {
		      return currentInstance.contextMap.get(context._id);
		    }
		  }
		  return context._currentValue !== undefined ? context._currentValue : context._defaultValue;
		}

		class Component {
		  constructor(props) {
		    this.props = props || {};
		    this.state = {};
		    this._instance = null;
		  }
		  setState(partial) {
		    const next = typeof partial === 'function' ? partial(this.state, this.props) : partial;
		    this.state = { ...this.state, ...next };
		    if (this._instance) {
		      scheduleUpdate(this._instance);
		    }
		  }
		  render() {
		    return this.props.children ?? null;
		  }
		}

		function Suspense({ children }) {
		  if (Array.isArray(children)) {
		    return h(Fragment, null, ...children);
		  }
		  return children ?? null;
		}

		function StrictMode({ children }) {
		  if (Array.isArray(children)) {
		    return h(Fragment, null, ...children);
		  }
		  return children ?? null;
		}

		function lazy(loader) {
		  let LoadedComponent = null;
		  let loadPromise = null;
		  let loadError = null;

		  return function LazyWrapper(props) {
		    const [, setTick] = useState(0);
		    useEffect(() => {
		      if (!LoadedComponent && !loadError) {
		        if (!loadPromise) {
		          loadPromise = loader()
		            .then((mod) => {
		              LoadedComponent = mod.default || mod;
		            })
		            .catch((err) => {
		              console.error('[Lazy Load Error]', err);
		              loadError = err;
		            });
		        }
		        loadPromise.then(() => setTick((t) => t + 1));
		      }
		    }, []);

		    if (LoadedComponent) {
		      return h(LoadedComponent, props);
		    }
		    return null;
		  };
		}

		// DOM Helpers
		function getDomNodes(vnode) {
		  if (!vnode) return [];
		  if (vnode.type === PORTAL_NODE) {
		    return [vnode._dom];
		  }
		  if (vnode.type === TEXT_NODE || vnode.type === EMPTY_NODE || typeof vnode.type === 'string') {
		    return vnode._dom ? [vnode._dom] : [];
		  }
		  if (vnode.type === Fragment) {
		    const res = [];
		    for (let i = 0; i < vnode.children.length; i++) {
		      const nodes = getDomNodes(vnode.children[i]);
		      for (let j = 0; j < nodes.length; j++) res.push(nodes[j]);
		    }
		    return res;
		  }
		  if (typeof vnode.type === 'function') {
		    return vnode._instance ? getDomNodes(vnode._instance.subTree) : [];
		  }
		  return [];
		}

		function getFirstDom(vnode) {
		  const nodes = getDomNodes(vnode);
		  return nodes.length > 0 ? nodes[0] : null;
		}

		function getNextSiblingDom(vnode) {
		  const nodes = getDomNodes(vnode);
		  if (nodes.length === 0) return null;
		  const last = nodes[nodes.length - 1];
		  return last ? last.nextSibling : null;
		}

		function insertDom(parentDom, dom, anchor) {
		  if (!parentDom || !dom) return;
		  if (anchor && anchor.parentNode === parentDom) {
		    parentDom.insertBefore(dom, anchor);
		  } else {
		    parentDom.appendChild(dom);
		  }
		}

		function setRef(ref, value) {
		  if (!ref) return;
		  if (typeof ref === 'function') {
		    try { ref(value); } catch {}
		  } else if (typeof ref === 'object') {
		    ref.current = value;
		  }
		}

		function applyStyle(dom, oldStyle, newStyle) {
		  if (typeof newStyle === 'string') {
		    dom.style.cssText = newStyle;
		    return;
		  }
		  if (typeof oldStyle === 'string') {
		    dom.style.cssText = '';
		  }
		  if (oldStyle && typeof oldStyle === 'object') {
		    for (const k of Object.keys(oldStyle)) {
		      if (!newStyle || !(k in newStyle)) {
		        if (k.startsWith('--')) {
		          dom.style.removeProperty(k);
		        } else {
		          dom.style[k] = '';
		        }
		      }
		    }
		  }
		  if (newStyle && typeof newStyle === 'object') {
		    for (const [k, v] of Object.entries(newStyle)) {
		      if (v === null || v === undefined || v === false) {
		        if (k.startsWith('--')) {
		          dom.style.removeProperty(k);
		        } else {
		          dom.style[k] = '';
		        }
		      } else if (k.startsWith('--')) {
		        dom.style.setProperty(k, String(v));
		      } else if (typeof v === 'number' && !UNITLESS_STYLES.has(k)) {
		        dom.style[k] = `${v}px`;
		      } else {
		        dom.style[k] = String(v);
		      }
		    }
		  }
		}

		function resolveEventName(propKey, tagName, inputType) {
		  const raw = propKey.slice(2).toLowerCase();
		  if (raw === 'change') {
		    if (tagName === 'textarea') return 'input';
		    if (tagName === 'input') {
		      const t = (inputType || 'text').toLowerCase();
		      if (t !== 'checkbox' && t !== 'radio' && t !== 'file') {
		        return 'input';
		      }
		    }
		    return 'change';
		  }
		  if (raw === 'doubleclick') return 'dblclick';
		  return raw;
		}

		function updateDomProps(dom, oldProps, newProps, isSvg) {
		  const tagName = dom.tagName ? dom.tagName.toLowerCase() : '';
		  const inputType = newProps.type || oldProps.type || '';

		  const allKeys = new Set([...Object.keys(oldProps || {}), ...Object.keys(newProps || {})]);

		  for (const key of allKeys) {
		    if (key === 'children' || key === 'key' || key === 'ref') continue;
		    const oldVal = oldProps ? oldProps[key] : undefined;
		    const newVal = newProps ? newProps[key] : undefined;
		    if (Object.is(oldVal, newVal) && key !== 'value' && key !== 'checked') continue;

		    if (key === 'style') {
		      applyStyle(dom, oldVal, newVal);
		      continue;
		    }

		    if (key === 'dangerouslySetInnerHTML') {
		      const html = newVal && newVal.__html != null ? String(newVal.__html) : '';
		      if (dom.innerHTML !== html) {
		        dom.innerHTML = html;
		      }
		      continue;
		    }

		    if (key.startsWith('on') && key.length > 2 && key[2] === key[2].toUpperCase()) {
		      const evtName = resolveEventName(key, tagName, inputType);
		      if (!dom._listeners) dom._listeners = {};
		      if (!dom._wrappers) dom._wrappers = {};

		      dom._listeners[evtName] = newVal;
		      if (newVal && !dom._wrappers[evtName]) {
		        const wrapper = (e) => {
		          const fn = dom._listeners[evtName];
		          if (typeof fn === 'function') {
		            fn(e);
		          }
		        };
		        dom._wrappers[evtName] = wrapper;
		        dom.addEventListener(evtName, wrapper);
		      } else if (!newVal && dom._wrappers[evtName]) {
		        dom.removeEventListener(evtName, dom._wrappers[evtName]);
		        delete dom._wrappers[evtName];
		      }
		      continue;
		    }

		    if (key === 'className' || key === 'class') {
		      const cls = newVal ? String(newVal) : '';
		      if (isSvg) {
		        if (cls) dom.setAttribute('class', cls);
		        else dom.removeAttribute('class');
		      } else {
		        if (dom.className !== cls) dom.className = cls;
		      }
		      continue;
		    }

		    if (key === 'htmlFor') {
		      if (newVal != null) dom.setAttribute('for', String(newVal));
		      else dom.removeAttribute('for');
		      continue;
		    }

		    if (!isSvg && (key === 'value' || key === 'defaultValue')) {
		      const strVal = newVal == null ? '' : String(newVal);
		      if (dom.value !== strVal) {
		        dom.value = strVal;
		      }
		      continue;
		    }

		    if (!isSvg && (key === 'checked' || key === 'defaultChecked')) {
		      const boolVal = Boolean(newVal);
		      if (dom.checked !== boolVal) {
		        dom.checked = boolVal;
		      }
		      continue;
		    }

		    if (!isSvg && (key === 'disabled' || key === 'readOnly' || key === 'required' || key === 'multiple' || key === 'selected' || key === 'autoFocus' || key === 'muted' || key === 'loop' || key === 'playsInline' || key === 'playsinline' || key === 'autoPlay' || key === 'autoplay' || key === 'controls')) {
		      const boolVal = Boolean(newVal);
		      const lowerKey = key.toLowerCase();
		      if (lowerKey === 'autoplay') {
		        dom.autoplay = boolVal;
		      } else if (lowerKey === 'muted') {
		        dom.muted = boolVal;
		        dom.defaultMuted = boolVal;
		      } else if (lowerKey === 'playsinline') {
		        dom.playsInline = boolVal;
		      } else {
		        dom[key] = boolVal;
		      }
		      if (boolVal) {
		        dom.setAttribute(lowerKey, '');
		        if (lowerKey === 'playsinline') {
		          dom.setAttribute('webkit-playsinline', '');
		        }
		      } else {
		        dom.removeAttribute(lowerKey);
		        if (lowerKey === 'playsinline') {
		          dom.removeAttribute('webkit-playsinline');
		        }
		      }
		      continue;
		    }

		    const attrName = isSvg && SVG_ATTR_MAP[key] ? SVG_ATTR_MAP[key] : key;
		    if (newVal === null || newVal === undefined || newVal === false) {
		      dom.removeAttribute(attrName);
		    } else if (newVal === true) {
		      dom.setAttribute(attrName, '');
		    } else if (typeof newVal !== 'function' && typeof newVal !== 'object') {
		      let strAttr = String(newVal);
		      if (attrName === 'src' || attrName === 'href' || attrName === 'data') {
		        if (
		          strAttr.startsWith('/assets/') &&
		          typeof window !== 'undefined' &&
		          window.__SUFRANO_BASE__
		        ) {
		          strAttr = window.__SUFRANO_BASE__ + strAttr;
		        }
		        if (strAttr.includes('/assets/icons/') && strAttr.endsWith('.svg')) {
		          strAttr += '?v=2';
		        }
		      }
		      dom.setAttribute(attrName, strAttr);
		    }
		  }
		}

		function mount(vnode, parentDom, anchor, contextMap, isSvg, depth = 0) {
		  if (!vnode) return;

		  if (vnode.type === EMPTY_NODE) {
		    const dom = document.createTextNode('');
		    vnode._dom = dom;
		    insertDom(parentDom, dom, anchor);
		    return;
		  }

		  if (vnode.type === TEXT_NODE) {
		    const dom = document.createTextNode(vnode.props.nodeValue);
		    vnode._dom = dom;
		    insertDom(parentDom, dom, anchor);
		    return;
		  }

		  if (vnode.type === PORTAL_NODE) {
		    const placeholder = document.createTextNode('');
		    vnode._dom = placeholder;
		    insertDom(parentDom, placeholder, anchor);
		    const portalContainer = vnode.props.container || document.body;
		    for (let i = 0; i < vnode.children.length; i++) {
		      mount(vnode.children[i], portalContainer, null, contextMap, false, depth + 1);
		    }
		    return;
		  }

		  if (vnode.type === Fragment) {
		    for (let i = 0; i < vnode.children.length; i++) {
		      mount(vnode.children[i], parentDom, anchor, contextMap, isSvg, depth);
		    }
		    return;
		  }

		  if (typeof vnode.type === 'function') {
		    let nextContextMap = contextMap;
		    if (vnode.type._isContextProvider) {
		      nextContextMap = new Map(contextMap);
		      nextContextMap.set(vnode.type._contextId, vnode.props.value);
		      if (vnode.type._context) {
		        vnode.type._context._currentValue = vnode.props.value;
		      }
		    }

		    const instance = {
		      Component: vnode.type,
		      props: vnode.props,
		      hooks: [],
		      hookIndex: 0,
		      pendingEffects: [],
		      subscribedContexts: null,
		      vnode,
		      subTree: null,
		      parentDom,
		      contextMap: nextContextMap,
		      isSvg,
		      depth,
		      isMounted: true,
		      classInstance: null
		    };
		    vnode._instance = instance;

		    const prevInstance = currentInstance;
		    currentInstance = instance;
		    let rendered = null;
		    try {
		      if (vnode.type.prototype && typeof vnode.type.prototype.render === 'function') {
		        const cls = new vnode.type(vnode.props);
		        cls._instance = instance;
		        instance.classInstance = cls;
		        rendered = cls.render();
		      } else {
		        rendered = vnode.type(vnode.props);
		      }
		    } catch (err) {
		      console.error('[Component Render Error]', vnode.type.name, err);
		      rendered = null;
		    }
		    currentInstance = prevInstance;

		    instance.subTree = normalizeVNode(rendered);
		    mount(instance.subTree, parentDom, anchor, nextContextMap, isSvg, depth + 1);
		    return;
		  }

		  if (typeof vnode.type === 'string') {
		    const nextIsSvg = isSvg || vnode.type === 'svg';
		    const dom = nextIsSvg
		      ? document.createElementNS(SVG_NS, vnode.type)
		      : document.createElement(vnode.type);
		    vnode._dom = dom;

		    updateDomProps(dom, {}, vnode.props, nextIsSvg);

		    const childIsSvg = nextIsSvg && vnode.type !== 'foreignObject';
		    if (!vnode.props.dangerouslySetInnerHTML) {
		      for (let i = 0; i < vnode.children.length; i++) {
		        mount(vnode.children[i], dom, null, contextMap, childIsSvg, depth + 1);
		      }
		    }

		    if (vnode.type === 'select' && vnode.props.value !== undefined) {
		      dom.value = String(vnode.props.value ?? '');
		    }

		    insertDom(parentDom, dom, anchor);
		    setRef(vnode.ref, dom);
		    if (typeof vnode.props.__onMount === 'function') {
		      vnode.props.__onMount(dom);
		    }
		  }
		}

		function updateComponent(instance) {
		  if (!instance.isMounted) return;
		  dirtyInstances.delete(instance);
		  if (currentBatchUpdated) {
		    currentBatchUpdated.add(instance);
		  }
		  instance.hookIndex = 0;

		  let nextContextMap = instance.contextMap;
		  if (instance.Component._isContextProvider) {
		    nextContextMap = new Map(instance.contextMap);
		    nextContextMap.set(instance.Component._contextId, instance.props.value);
		    instance.contextMap = nextContextMap;
		    const ctx = instance.Component._context;
		    if (ctx) {
		      ctx._currentValue = instance.props.value;
		      for (const sub of Array.from(ctx._subscribers)) {
		        if (sub && sub.isMounted && sub !== instance) {
		          if (sub.contextMap) {
		            sub.contextMap.set(ctx._id, instance.props.value);
		          }
		          scheduleUpdate(sub);
		        }
		      }
		    }
		  }

		  const prevInstance = currentInstance;
		  currentInstance = instance;
		  let rendered = null;
		  try {
		    if (instance.classInstance) {
		      instance.classInstance.props = instance.props;
		      rendered = instance.classInstance.render();
		    } else {
		      rendered = instance.Component(instance.props);
		    }
		  } catch (err) {
		    console.error('[Component Update Error]', instance.Component.name, err);
		    rendered = null;
		  }
		  currentInstance = prevInstance;

		  const nextSubTree = normalizeVNode(rendered);
		  const prevSubTree = instance.subTree;
		  instance.subTree = nextSubTree;

		  patch(instance.parentDom, prevSubTree, nextSubTree, nextContextMap, instance.isSvg, instance.depth + 1);
		}

		function patch(parentDom, oldVNode, newVNode, contextMap, isSvg, depth = 0) {
		  if (oldVNode === newVNode) return;

		  if (!oldVNode) {
		    mount(newVNode, parentDom, null, contextMap, isSvg, depth);
		    return;
		  }

		  if (!newVNode) {
		    unmount(oldVNode);
		    return;
		  }

		  if (oldVNode.type !== newVNode.type || oldVNode.key !== newVNode.key) {
		    const anchor = getFirstDom(oldVNode);
		    mount(newVNode, parentDom, anchor, contextMap, isSvg, depth);
		    unmount(oldVNode);
		    return;
		  }

		  if (newVNode.type === EMPTY_NODE) {
		    newVNode._dom = oldVNode._dom;
		    return;
		  }

		  if (newVNode.type === TEXT_NODE) {
		    const dom = (newVNode._dom = oldVNode._dom);
		    if (dom && dom.nodeValue !== newVNode.props.nodeValue) {
		      dom.nodeValue = newVNode.props.nodeValue;
		    }
		    return;
		  }

		  if (newVNode.type === PORTAL_NODE) {
		    newVNode._dom = oldVNode._dom;
		    const portalContainer = newVNode.props.container || document.body;
		    patchChildren(portalContainer, oldVNode.children, newVNode.children, null, contextMap, false, depth + 1);
		    return;
		  }

		  if (newVNode.type === Fragment) {
		    const endAnchor = getNextSiblingDom(oldVNode);
		    patchChildren(parentDom, oldVNode.children, newVNode.children, endAnchor, contextMap, isSvg, depth);
		    return;
		  }

		  if (typeof newVNode.type === 'function') {
		    const instance = (newVNode._instance = oldVNode._instance);
		    instance.vnode = newVNode;
		    instance.props = newVNode.props;
		    instance.parentDom = parentDom;
		    if (!instance.Component._isContextProvider) {
		      instance.contextMap = contextMap;
		    }
		    dirtyInstances.delete(instance);
		    updateComponent(instance);
		    return;
		  }

		  if (typeof newVNode.type === 'string') {
		    const dom = (newVNode._dom = oldVNode._dom);
		    const nextIsSvg = isSvg || newVNode.type === 'svg';

		    if (oldVNode.ref !== newVNode.ref) {
		      setRef(oldVNode.ref, null);
		      setRef(newVNode.ref, dom);
		    } else if (newVNode.ref) {
		      setRef(newVNode.ref, dom);
		    }

		    updateDomProps(dom, oldVNode.props, newVNode.props, nextIsSvg);

		    const childIsSvg = nextIsSvg && newVNode.type !== 'foreignObject';
		    if (!newVNode.props.dangerouslySetInnerHTML) {
		      patchChildren(dom, oldVNode.children, newVNode.children, null, contextMap, childIsSvg, depth + 1);
		    }

		    if (newVNode.type === 'select' && newVNode.props.value !== undefined) {
		      const targetVal = String(newVNode.props.value ?? '');
		      if (dom.value !== targetVal) {
		        dom.value = targetVal;
		      }
		    }

		    if (typeof newVNode.props.__onUpdate === 'function') {
		      newVNode.props.__onUpdate(dom);
		    }
		  }
		}

		function patchChildren(parentDom, oldChildren, newChildren, endAnchor, contextMap, isSvg, depth) {
		  const oldLen = oldChildren.length;
		  const newLen = newChildren.length;

		  const hasKeys =
		    oldChildren.some((c) => c && c.key !== null) ||
		    newChildren.some((c) => c && c.key !== null);

		  if (!hasKeys) {
		    const commonLen = Math.min(oldLen, newLen);
		    for (let i = 0; i < commonLen; i++) {
		      patch(parentDom, oldChildren[i], newChildren[i], contextMap, isSvg, depth);
		    }
		    if (newLen > oldLen) {
		      for (let i = oldLen; i < newLen; i++) {
		        mount(newChildren[i], parentDom, endAnchor, contextMap, isSvg, depth);
		      }
		    } else if (oldLen > newLen) {
		      for (let i = newLen; i < oldLen; i++) {
		        unmount(oldChildren[i]);
		      }
		    }
		    return;
		  }

		  // Keyed reconciliation
		  const oldMap = new Map();
		  for (let i = 0; i < oldLen; i++) {
		    const c = oldChildren[i];
		    const k = c.key !== null ? `k:${c.key}` : `i:${i}`;
		    oldMap.set(k, c);
		  }

		  const matchedOld = new Set();
		  for (let i = 0; i < newLen; i++) {
		    const newChild = newChildren[i];
		    const k = newChild.key !== null ? `k:${newChild.key}` : `i:${i}`;
		    const matched = oldMap.get(k);
		    if (matched && matched.type === newChild.type) {
		      matchedOld.add(matched);
		    }
		  }

		  for (let i = 0; i < oldLen; i++) {
		    const oldChild = oldChildren[i];
		    if (!matchedOld.has(oldChild)) {
		      unmount(oldChild);
		    }
		  }

		  let cursorAnchor = endAnchor;
		  for (let i = newLen - 1; i >= 0; i--) {
		    const newChild = newChildren[i];
		    const k = newChild.key !== null ? `k:${newChild.key}` : `i:${i}`;
		    const matched = oldMap.get(k);

		    if (matched && matchedOld.has(matched)) {
		      patch(parentDom, matched, newChild, contextMap, isSvg, depth);
		      const nodes = getDomNodes(newChild);
		      if (nodes.length > 0) {
		        const lastNode = nodes[nodes.length - 1];
		        if (lastNode.nextSibling !== cursorAnchor) {
		          for (let j = 0; j < nodes.length; j++) {
		            insertDom(parentDom, nodes[j], cursorAnchor);
		          }
		        }
		        cursorAnchor = nodes[0];
		      }
		    } else {
		      mount(newChild, parentDom, cursorAnchor, contextMap, isSvg, depth);
		      const first = getFirstDom(newChild);
		      if (first) {
		        cursorAnchor = first;
		      }
		    }
		  }
		}

		function unmount(vnode, removeDom = true) {
		  if (!vnode) return;

		  if (vnode.ref) {
		    setRef(vnode.ref, null);
		  }

		  if (vnode.type === PORTAL_NODE) {
		    for (let i = 0; i < vnode.children.length; i++) {
		      unmount(vnode.children[i], true);
		    }
		    if (removeDom && vnode._dom && vnode._dom.parentNode) {
		      vnode._dom.parentNode.removeChild(vnode._dom);
		    }
		    return;
		  }

		  if (typeof vnode.type === 'function') {
		    const instance = vnode._instance;
		    if (instance) {
		      instance.isMounted = false;
		      dirtyInstances.delete(instance);
		      if (instance.subscribedContexts) {
		        for (const ctx of instance.subscribedContexts) {
		          ctx._subscribers.delete(instance);
		        }
		        instance.subscribedContexts.clear();
		      }
		      for (const hook of instance.hooks) {
		        if (typeof hook.cleanup === 'function') {
		          try { hook.cleanup(); } catch {}
		          hook.cleanup = null;
		        }
		      }
		      if (instance.subTree) {
		        unmount(instance.subTree, removeDom);
		      }
		    }
		    return;
		  }

		  if (vnode.type === Fragment) {
		    for (let i = 0; i < vnode.children.length; i++) {
		      unmount(vnode.children[i], removeDom);
		    }
		    return;
		  }

		  if (vnode.children && vnode.children.length > 0) {
		    for (let i = 0; i < vnode.children.length; i++) {
		      unmount(vnode.children[i], false);
		    }
		  }

		  if (removeDom && vnode._dom && vnode._dom.parentNode) {
		    vnode._dom.parentNode.removeChild(vnode._dom);
		  }
		}

		function createRoot(container) {
		  let rootVNode = null;
		  return {
		    render(element) {
		      const nextVNode = normalizeVNode(element);
		      if (!rootVNode) {
		        container.innerHTML = '';
		        mount(nextVNode, container, null, new Map(), false, 0);
		      } else {
		        patch(container, rootVNode, nextVNode, new Map(), false, 0);
		      }
		      rootVNode = nextVNode;
		      flushUpdates();
		    },
		    unmount() {
		      if (rootVNode) {
		        unmount(rootVNode, true);
		        rootVNode = null;
		      }
		    }
		  };
		}

		const useLayoutEffect = useEffect;
		const createElement = h;
		const memo = (Comp) => Comp;
		const forwardRef = (renderFn) => (props) => renderFn(props, props?.ref);
		function cloneElement(vnode, extraProps = {}, ...children) {
		  if (!vnode || typeof vnode !== 'object') return vnode;
		  const mergedProps = { ...vnode.props, ...extraProps };
		  if (children.length > 0) {
		    mergedProps.children = children.length === 1 ? children[0] : children;
		  }
		  return h(vnode.type, mergedProps);
		}
		function isValidElement(vnode) {
		  return Boolean(vnode && typeof vnode === 'object' && 'type' in vnode && 'props' in vnode);
		}
		const Children = {
		  map: (children, fn) => (Array.isArray(children) ? children.map(fn) : children != null ? [fn(children, 0)] : []),
		  forEach: (children, fn) => (Array.isArray(children) ? children.forEach(fn) : children != null ? fn(children, 0) : undefined),
		  count: (children) => (Array.isArray(children) ? children.length : children != null ? 1 : 0),
		  toArray: (children) => (Array.isArray(children) ? children : children != null ? [children] : [])
		};

		const RuntimeDefault = {
		  h,
		  __h: h,
		  createElement: h,
		  Fragment,
		  __Fragment: Fragment,
		  Component,
		  useState,
		  useEffect,
		  useLayoutEffect,
		  useRef,
		  useMemo,
		  useCallback,
		  useContext,
		  createContext,
		  createPortal,
		  Suspense,
		  StrictMode,
		  lazy,
		  memo,
		  forwardRef,
		  cloneElement,
		  isValidElement,
		  Children,
		  createRoot
		};


		Object.defineProperty(exports, "Fragment", { enumerable: true, get: function () { return Fragment; } });
		Object.defineProperty(exports, "h", { enumerable: true, get: function () { return h; } });
		Object.defineProperty(exports, "createPortal", { enumerable: true, get: function () { return createPortal; } });
		Object.defineProperty(exports, "useState", { enumerable: true, get: function () { return useState; } });
		Object.defineProperty(exports, "useRef", { enumerable: true, get: function () { return useRef; } });
		Object.defineProperty(exports, "useMemo", { enumerable: true, get: function () { return useMemo; } });
		Object.defineProperty(exports, "useCallback", { enumerable: true, get: function () { return useCallback; } });
		Object.defineProperty(exports, "useEffect", { enumerable: true, get: function () { return useEffect; } });
		Object.defineProperty(exports, "createContext", { enumerable: true, get: function () { return createContext; } });
		Object.defineProperty(exports, "useContext", { enumerable: true, get: function () { return useContext; } });
		Object.defineProperty(exports, "Component", { enumerable: true, get: function () { return Component; } });
		Object.defineProperty(exports, "Suspense", { enumerable: true, get: function () { return Suspense; } });
		Object.defineProperty(exports, "StrictMode", { enumerable: true, get: function () { return StrictMode; } });
		Object.defineProperty(exports, "lazy", { enumerable: true, get: function () { return lazy; } });
		Object.defineProperty(exports, "createRoot", { enumerable: true, get: function () { return createRoot; } });
		Object.defineProperty(exports, "useLayoutEffect", { enumerable: true, get: function () { return useLayoutEffect; } });
		Object.defineProperty(exports, "createElement", { enumerable: true, get: function () { return createElement; } });
		Object.defineProperty(exports, "memo", { enumerable: true, get: function () { return memo; } });
		Object.defineProperty(exports, "forwardRef", { enumerable: true, get: function () { return forwardRef; } });
		Object.defineProperty(exports, "cloneElement", { enumerable: true, get: function () { return cloneElement; } });
		Object.defineProperty(exports, "isValidElement", { enumerable: true, get: function () { return isValidElement; } });
		Object.defineProperty(exports, "Children", { enumerable: true, get: function () { return Children; } });
		Object.defineProperty(exports, "__h", { enumerable: true, get: function () { return h; } });
		Object.defineProperty(exports, "__Fragment", { enumerable: true, get: function () { return Fragment; } });
		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return RuntimeDefault; } });
	});
	//#endregion

	//#region utils/router.js
	__define("utils/router.js", function (exports, __require, module) {
		// Pure Vanilla JS Router for Süfrano (History API)
		const { h, Fragment, useState, useEffect, useCallback, useMemo } = __require("utils/runtime.js");

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

		function navigateTo(to, options = {}) {
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

		function useLocation() {
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

		function useNavigate() {
		  return useCallback((to, options) => {
		    navigateTo(to, options);
		  }, []);
		}

		function useSearchParams() {
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

		function useParams() {
		  return {};
		}

		function BrowserRouter({ children }) {
		  if (Array.isArray(children)) {
		    return h(Fragment, null, ...children);
		  }
		  return children ?? null;
		}

		const Router = BrowserRouter;

		function Route() {
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

		function Routes({ children, location: overrideLocation }) {
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

		function Navigate({ to, replace = true, state }) {
		  useEffect(() => {
		    navigateTo(to, { replace, state });
		  }, [to, replace, state]);
		  return null;
		}

		function Link({ to, replace, state, onClick, target, children, ...rest }) {
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

		function NavLink({ to, className, end, children, ...rest }) {
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

		  const resolvedChildren = typeof children === 'function' ? children({ isActive }) : children;

		  return h(Link, { ...rest, to, className: resolvedClass }, ...(Array.isArray(resolvedChildren) ? resolvedChildren : [resolvedChildren]));
		}

		Object.defineProperty(exports, "navigateTo", { enumerable: true, get: function () { return navigateTo; } });
		Object.defineProperty(exports, "useLocation", { enumerable: true, get: function () { return useLocation; } });
		Object.defineProperty(exports, "useNavigate", { enumerable: true, get: function () { return useNavigate; } });
		Object.defineProperty(exports, "useSearchParams", { enumerable: true, get: function () { return useSearchParams; } });
		Object.defineProperty(exports, "useParams", { enumerable: true, get: function () { return useParams; } });
		Object.defineProperty(exports, "BrowserRouter", { enumerable: true, get: function () { return BrowserRouter; } });
		Object.defineProperty(exports, "Router", { enumerable: true, get: function () { return Router; } });
		Object.defineProperty(exports, "Route", { enumerable: true, get: function () { return Route; } });
		Object.defineProperty(exports, "Routes", { enumerable: true, get: function () { return Routes; } });
		Object.defineProperty(exports, "Navigate", { enumerable: true, get: function () { return Navigate; } });
		Object.defineProperty(exports, "Link", { enumerable: true, get: function () { return Link; } });
		Object.defineProperty(exports, "NavLink", { enumerable: true, get: function () { return NavLink; } });
	});
	//#endregion

	//#region utils/motion.js
	__define("utils/motion.js", function (exports, __require, module) {
		// Pure Vanilla JS Animation Wrapper for Süfrano (Zero Framer Motion dependency)
		const { h, Fragment } = __require("utils/runtime.js");

		const MOTION_PROPS = new Set([
		  'initial',
		  'animate',
		  'exit',
		  'transition',
		  'variants',
		  'whileHover',
		  'whileTap',
		  'whileFocus',
		  'whileInView',
		  'viewport',
		  'layout',
		  'layoutId',
		  'onAnimationStart',
		  'onAnimationComplete'
		]);

		function resolveVariant(val, variants) {
		  if (!val) return null;
		  if (typeof val === 'string' && variants && variants[val]) {
		    return variants[val];
		  }
		  if (typeof val === 'object') {
		    return val;
		  }
		  return null;
		}

		function toCssKeyframe(stateObj) {
		  if (!stateObj || typeof stateObj !== 'object') return null;
		  const frame = {};
		  const transforms = [];

		  if (stateObj.x !== undefined) {
		    const xVal = typeof stateObj.x === 'number' ? `${stateObj.x}px` : stateObj.x;
		    transforms.push(`translateX(${xVal})`);
		  }
		  if (stateObj.y !== undefined) {
		    const yVal = typeof stateObj.y === 'number' ? `${stateObj.y}px` : stateObj.y;
		    transforms.push(`translateY(${yVal})`);
		  }
		  if (stateObj.scale !== undefined) {
		    transforms.push(`scale(${stateObj.scale})`);
		  }
		  if (stateObj.rotate !== undefined) {
		    const rVal = typeof stateObj.rotate === 'number' ? `${stateObj.rotate}deg` : stateObj.rotate;
		    transforms.push(`rotate(${rVal})`);
		  }

		  if (transforms.length > 0) {
		    frame.transform = transforms.join(' ');
		  }
		  if (stateObj.opacity !== undefined) {
		    frame.opacity = stateObj.opacity;
		  }
		  if (stateObj.borderRadius !== undefined) {
		    frame.borderRadius = typeof stateObj.borderRadius === 'number' ? `${stateObj.borderRadius}px` : stateObj.borderRadius;
		  }
		  if (stateObj.height !== undefined && stateObj.height !== 'auto') {
		    frame.height = typeof stateObj.height === 'number' ? `${stateObj.height}px` : stateObj.height;
		  }
		  return Object.keys(frame).length > 0 ? frame : null;
		}

		const tagCache = new Map();

		function createMotionTag(tag) {
		  if (tagCache.has(tag)) return tagCache.get(tag);

		  const MotionComponent = (props) => {
		    const cleanProps = {};
		    for (const [k, v] of Object.entries(props || {})) {
		      if (!MOTION_PROPS.has(k) && k !== 'children') {
		        cleanProps[k] = v;
		      }
		    }

		    const initObj = resolveVariant(props?.initial, props?.variants);
		    const animObj = resolveVariant(props?.animate || props?.whileInView, props?.variants);
		    const finalFrame = toCssKeyframe(animObj);

		    if (finalFrame) {
		      cleanProps.style = {
		        ...(cleanProps.style || {}),
		        ...(finalFrame.borderRadius ? { borderRadius: finalFrame.borderRadius } : {})
		      };
		    }

		    cleanProps.__onMount = (dom) => {
		      if (!dom || typeof dom.animate !== 'function') return;
		      const fromFrame = toCssKeyframe(initObj);
		      const toFrame = toCssKeyframe(animObj);
		      if (fromFrame && toFrame) {
		        const trans = animObj?.transition || props?.transition || {};
		        const duration = (typeof trans.duration === 'number' ? trans.duration : 0.3) * 1000;
		        const delay = (typeof trans.delay === 'number' ? trans.delay : 0) * 1000;
		        try {
		          dom.animate([fromFrame, toFrame], {
		            duration: Math.min(Math.max(duration, 120), 650),
		            delay: Math.min(delay, 300),
		            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
		            fill: 'backwards'
		          });
		        } catch {}
		      }
		    };

		    const children = props?.children;
		    const childArgs = Array.isArray(children) ? children : children !== undefined ? [children] : [];
		    return h(tag, cleanProps, ...childArgs);
		  };

		  tagCache.set(tag, MotionComponent);
		  return MotionComponent;
		}

		const motion = new Proxy(
		  {},
		  {
		    get(_, prop) {
		      return createMotionTag(String(prop));
		    }
		  }
		);

		function AnimatePresence({ children }) {
		  if (Array.isArray(children)) {
		    return h(Fragment, null, ...children);
		  }
		  return children ?? null;
		}

		Object.defineProperty(exports, "motion", { enumerable: true, get: function () { return motion; } });
		Object.defineProperty(exports, "AnimatePresence", { enumerable: true, get: function () { return AnimatePresence; } });
	});
	//#endregion

	//#region utils/pageLoader.js
	__define("utils/pageLoader.js", function (exports, __require, module) {
		const pendingPageLoads = new Map();
		const loadedCssPages = new Set();

		function loadPageStylesheet(pageName) {
		  if (typeof document === 'undefined' || loadedCssPages.has(pageName)) {
		    return Promise.resolve();
		  }

		  const existing = document.querySelector(`link[data-sufrano-page-css="${pageName}"]`);
		  if (existing && existing.sheet) {
		    loadedCssPages.add(pageName);
		    return Promise.resolve();
		  }

		  return new Promise((resolve) => {
		    const link = existing || document.createElement('link');
		    let settled = false;

		    const finish = () => {
		      if (settled) return;
		      settled = true;
		      loadedCssPages.add(pageName);
		      resolve();
		    };

		    const timer = setTimeout(finish, 1500);
		    const onDone = () => {
		      clearTimeout(timer);
		      finish();
		    };

		    link.addEventListener('load', onDone, { once: true });
		    link.addEventListener('error', onDone, { once: true });

		    if (!existing) {
		      link.rel = 'stylesheet';
		      link.href = `styles/pages/${pageName}.css?v=2`;
		      link.setAttribute('data-sufrano-page-css', pageName);
		      document.head.appendChild(link);
		    } else if (existing.sheet) {
		      onDone();
		    }
		  });
		}

		function loadPageScript(pageName) {
		  const pagesRegistry = (typeof window !== 'undefined' && window.__SUFRANO_PAGES__) || {};
		  if (pagesRegistry[pageName]) {
		    return Promise.resolve(pagesRegistry[pageName]);
		  }

		  return new Promise((resolve, reject) => {
		    const existing = document.querySelector(`script[data-sufrano-page-js="${pageName}"]`);
		    if (existing && existing.dataset.loaded === 'true' && window.__SUFRANO_PAGES__?.[pageName]) {
		      resolve(window.__SUFRANO_PAGES__[pageName]);
		      return;
		    }

		    const script = existing || document.createElement('script');

		    const handleLoad = () => {
		      script.dataset.loaded = 'true';
		      const comp = window.__SUFRANO_PAGES__?.[pageName];
		      if (comp) {
		        resolve(comp);
		      } else {
		        reject(new Error(`Page bundle "${pageName}" did not register a component.`));
		      }
		    };

		    const handleError = () => {
		      if (!existing && script.parentNode) {
		        script.parentNode.removeChild(script);
		      }
		      reject(new Error(`Failed to load page script: pages/${pageName}.js`));
		    };

		    script.addEventListener('load', handleLoad, { once: true });
		    script.addEventListener('error', handleError, { once: true });

		    if (!existing) {
		      script.src = `pages/${pageName}.js?v=2`;
		      script.async = true;
		      script.setAttribute('data-sufrano-page-js', pageName);
		      document.head.appendChild(script);
		    }
		  });
		}

		function loadPage(pageName, esModuleLoader) {
		  if (typeof window === 'undefined' || !window.__SUFRANO_USE_PAGE_BUNDLES__) {
		    if (typeof esModuleLoader === 'function') {
		      return esModuleLoader();
		    }
		    return Promise.reject(new Error(`No loader available for page "${pageName}"`));
		  }

		  const cachedComp = window.__SUFRANO_PAGES__?.[pageName];
		  if (cachedComp && loadedCssPages.has(pageName)) {
		    return Promise.resolve({ default: cachedComp });
		  }

		  if (pendingPageLoads.has(pageName)) {
		    return pendingPageLoads.get(pageName);
		  }

		  const loadPromise = Promise.all([
		    loadPageStylesheet(pageName),
		    loadPageScript(pageName)
		  ])
		    .then(([, comp]) => ({ default: comp }))
		    .catch((err) => {
		      pendingPageLoads.delete(pageName);
		      throw err;
		    });

		  pendingPageLoads.set(pageName, loadPromise);
		  return loadPromise;
		}

		Object.defineProperty(exports, "loadPage", { enumerable: true, get: function () { return loadPage; } });
	});
	//#endregion

	//#region utils/rateLimitInterceptor.js
	__define("utils/rateLimitInterceptor.js", function (exports, __require, module) {
		async function handleBackendErrorResponse(response) {
			if (typeof window === "undefined") return;
			if (window.location.pathname.startsWith("/error")) return;
			const status = response?.status || 500;
			let title = "";
			let message = "";
			let retrySeconds = 0;
			try {
				const clone = response.clone();
				const data = await clone.json();
				if (data) {
					title = data.title || data.error || "";
					message = data.message || (typeof data.error === "string" && data.error !== title ? data.error : "") || "";
					if (data.retryAfterSeconds) {
						retrySeconds = parseInt(data.retryAfterSeconds, 10);
					}
				}
			} catch {}
			if (!retrySeconds && status === 429) {
				try {
					const retryHeader = response.headers?.get("Retry-After");
					if (retryHeader) {
						const parsed = parseInt(retryHeader, 10);
						if (!isNaN(parsed) && parsed > 0) {
							retrySeconds = parsed;
						}
					}
				} catch {}
				if (!retrySeconds) retrySeconds = 30;
			}
			const query = new URLSearchParams();
			query.set("code", status.toString());
			if (title) query.set("title", title);
			if (message) query.set("message", message);
			if (retrySeconds > 0) query.set("retry", retrySeconds.toString());
			window.location.href = `/error?${query.toString()}`;
		}
		function initGlobalRateLimitInterceptor() {}

		Object.defineProperty(exports, "handleBackendErrorResponse", { enumerable: true, get: function () { return handleBackendErrorResponse; } });
		Object.defineProperty(exports, "initGlobalRateLimitInterceptor", { enumerable: true, get: function () { return initGlobalRateLimitInterceptor; } });
	});
	//#endregion

	//#region utils/clientHints.js
	__define("utils/clientHints.js", function (exports, __require, module) {
		let cachedHints = {
			platformVersion: null,
			model: null
		};
		let hintsPromise = null;
		if (typeof navigator !== "undefined" && navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
			hintsPromise = navigator.userAgentData.getHighEntropyValues(["platformVersion", "model"]).then((hints) => {
				if (hints) {
					if (hints.platformVersion) cachedHints.platformVersion = hints.platformVersion;
					if (hints.model) cachedHints.model = hints.model;
				}
				return cachedHints;
			}).catch(() => cachedHints);
		}
		function getClientHintsHeaders() {
			const headers = {};
			if (cachedHints.platformVersion) {
				headers["X-Platform-Version"] = cachedHints.platformVersion;
			}
			if (cachedHints.model) {
				headers["X-Device-Model"] = cachedHints.model;
			}
			return headers;
		}
		async function ensureClientHintsHeaders() {
			if (hintsPromise) {
				try {
					await hintsPromise;
				} catch {}
			}
			return getClientHintsHeaders();
		}

		Object.defineProperty(exports, "getClientHintsHeaders", { enumerable: true, get: function () { return getClientHintsHeaders; } });
		Object.defineProperty(exports, "ensureClientHintsHeaders", { enumerable: true, get: function () { return ensureClientHintsHeaders; } });
	});
	//#endregion

	//#region utils/config.js
	__define("utils/config.js", function (exports, __require, module) {
		const API_URL = (typeof window !== 'undefined' && window.__SUFRANO_API_URL__) || '';

		Object.defineProperty(exports, "API_URL", { enumerable: true, get: function () { return API_URL; } });
	});
	//#endregion

	//#region utils/fetchWithRefresh.js
	__define("utils/fetchWithRefresh.js", function (exports, __require, module) {
		const { handleBackendErrorResponse } = __require("utils/rateLimitInterceptor.js");
		const { ensureClientHintsHeaders } = __require("utils/clientHints.js");
		const { API_URL } = __require("utils/config.js");
		const apiUrl = API_URL;
		let isRefreshing = false;
		let refreshPromise = null;
		async function doRefresh() {
			const clientHeaders = await ensureClientHintsHeaders();
			for (let attempt = 0; attempt < 3; attempt++) {
				try {
					const refreshResponse = await fetch(`${apiUrl}/api/auth/refresh`, {
						method: "POST",
						credentials: "include",
						headers: { ...clientHeaders }
					});
					if (refreshResponse.ok) return true;
					if (refreshResponse.status === 401) return false;
				} catch {}
				if (attempt < 2) {
					await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
				}
			}
			return false;
		}
		async function fetchWithRefresh(url, options = {}) {
			const skipAuthRedirect = options.skipAuthRedirect || false;
			const clientHeaders = await ensureClientHintsHeaders();
			const opts = {
				...options,
				credentials: "include",
				headers: {
					...clientHeaders,
					...options.headers || {}
				}
			};
			delete opts.skipAuthRedirect;
			let response;
			try {
				response = await fetch(url, opts);
			} catch (err) {
				await new Promise((r) => setTimeout(r, 2e3));
				try {
					response = await fetch(url, opts);
				} catch {
					throw err;
				}
			}
			if (response.status === 429) {
				handleBackendErrorResponse(response);
				return response;
			}
			if (response.status >= 500 && response.status <= 599) {
				await new Promise((r) => setTimeout(r, 2e3));
				try {
					response = await fetch(url, opts);
				} catch {}
				if (response.status >= 500 && response.status <= 599) {
					handleBackendErrorResponse(response);
					return response;
				}
			}
			if (response.status === 401 && !skipAuthRedirect) {
				if (!isRefreshing) {
					isRefreshing = true;
					refreshPromise = doRefresh().finally(() => {
						isRefreshing = false;
						refreshPromise = null;
					});
				}
				const refreshed = await refreshPromise;
				if (refreshed) {
					response = await fetch(url, opts);
					if (response.status === 429 || response.status >= 500 && response.status <= 599) {
						handleBackendErrorResponse(response);
					}
				} else {
					localStorage.removeItem("rednest_auth");
					localStorage.removeItem("rednest_user");
					window.dispatchEvent(new CustomEvent("auth:unauthorized"));
				}
			}
			return response;
		}

		Object.defineProperty(exports, "fetchWithRefresh", { enumerable: true, get: function () { return fetchWithRefresh; } });
	});
	//#endregion

	//#region context/AuthContext.js
	__define("context/AuthContext.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { createContext, useContext, useState, useCallback, useEffect } = __imp_0;
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { API_URL } = __require("utils/config.js");
		const AuthContext = createContext(null);
		const AuthProvider = ({ children }) => {
			const [isAuthenticated, setIsAuthenticated] = useState(() => {
				return localStorage.getItem("rednest_auth") === "true";
			});
			const [user, setUser] = useState(() => {
				const saved = localStorage.getItem("rednest_user");
				return saved ? JSON.parse(saved) : null;
			});
			const [authLoading, setAuthLoading] = useState(true);
			const login = useCallback((userData) => {
				let profile = userData;
				if (userData && userData.user) {
					profile = userData.user;
				}
				if (!profile || !profile.name && !profile.email && !profile.Id && !profile.id) {
					profile = {
						name: "User",
						email: ""
					};
				}
				localStorage.setItem("rednest_auth", "true");
				localStorage.setItem("rednest_user", JSON.stringify(profile));
				setIsAuthenticated(true);
				setUser(profile);
			}, []);
			const logout = useCallback(async () => {
				try {
					const apiUrl = API_URL;
					await fetch(`${apiUrl}/api/auth/logout`, {
						method: "POST",
						credentials: "include"
					});
				} catch {}
				localStorage.removeItem("rednest_auth");
				localStorage.removeItem("rednest_user");
				setIsAuthenticated(false);
				setUser(null);
			}, []);
			const fetchCurrentUser = useCallback(async () => {
				try {
					const apiUrl = API_URL;
					const response = await fetchWithRefresh(`${apiUrl}/api/auth/me`);
					if (response.ok) {
						const data = await response.json();
						login(data);
						return {
							ok: true,
							data
						};
					}
					if (response.status === 401) {
						return {
							ok: false,
							unauthorized: true
						};
					}
					return {
						ok: false,
						unauthorized: false
					};
				} catch (err) {
					console.error("Session validation failed:", err);
					return {
						ok: false,
						unauthorized: false
					};
				}
			}, [login]);
			const checkAuthStatus = useCallback(async () => {
				const hasAuth = localStorage.getItem("rednest_auth") === "true";
				if (!hasAuth) return { ok: false };
				const result = await fetchCurrentUser();
				if (result && result.unauthorized) {
					localStorage.removeItem("rednest_auth");
					localStorage.removeItem("rednest_user");
					setIsAuthenticated(false);
					setUser(null);
				}
				return result;
			}, [fetchCurrentUser]);
			useEffect(() => {
				const handleUnauthorized = () => {
					localStorage.removeItem("rednest_auth");
					localStorage.removeItem("rednest_user");
					setIsAuthenticated(false);
					setUser(null);
				};
				window.addEventListener("auth:unauthorized", handleUnauthorized);
				return () => {
					window.removeEventListener("auth:unauthorized", handleUnauthorized);
				};
			}, []);
			useEffect(() => {
				const validateSession = async () => {
					const hasAuth = localStorage.getItem("rednest_auth") === "true";
					if (!hasAuth) {
						setAuthLoading(false);
						return;
					}
					const retryDelays = [3e3, 5e3];
					let result = await fetchCurrentUser();
					for (let i = 0; i < retryDelays.length && result && !result.ok && !result.unauthorized; i++) {
						await new Promise((r) => setTimeout(r, retryDelays[i]));
						result = await fetchCurrentUser();
					}
					if (result && result.unauthorized) {
						localStorage.removeItem("rednest_auth");
						localStorage.removeItem("rednest_user");
						setIsAuthenticated(false);
						setUser(null);
					}
					setAuthLoading(false);
				};
				validateSession();
			}, [fetchCurrentUser]);
			const updateUser = useCallback((updatedFields) => {
				setUser((prev) => {
					const updated = {
						...prev,
						...updatedFields
					};
					localStorage.setItem("rednest_user", JSON.stringify(updated));
					return updated;
				});
			}, []);
			return /* @__PURE__ */ __h(AuthContext.Provider, { value: {
				isAuthenticated,
				user,
				login,
				logout,
				updateUser,
				authLoading,
				fetchCurrentUser,
				checkAuthStatus
			} }, children);
		};
		const useAuth = () => {
			const ctx = useContext(AuthContext);
			if (!ctx) throw new Error("useAuth must be used within AuthProvider");
			return ctx;
		};

		Object.defineProperty(exports, "AuthProvider", { enumerable: true, get: function () { return AuthProvider; } });
		Object.defineProperty(exports, "useAuth", { enumerable: true, get: function () { return useAuth; } });
		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return AuthContext; } });
	});
	//#endregion

	//#region routes/ProtectedRoute.js
	__define("routes/ProtectedRoute.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useEffect, useRef } = __imp_0;
		const { Navigate, useLocation } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const AUTH_CHECK_TTL_MS = 5 * 60 * 1e3;
		const ProtectedRoute = ({ children }) => {
			const { isAuthenticated, authLoading, checkAuthStatus } = useAuth();
			const location = useLocation();
			const lastCheckRef = useRef(0);
			useEffect(() => {
				if (checkAuthStatus) {
					const now = Date.now();
					if (now - lastCheckRef.current > AUTH_CHECK_TTL_MS) {
						lastCheckRef.current = now;
						checkAuthStatus();
					}
				}
			}, [location.pathname, checkAuthStatus]);
			if (authLoading) {
				return null;
			}
			if (!isAuthenticated) {
				return /* @__PURE__ */ __h(Navigate, {
					to: "/login",
					state: { from: location },
					replace: true
				});
			}
			return children;
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return ProtectedRoute; } });
	});
	//#endregion

	//#region components/Elements/AnimatedModalWrapper.js
	__define("components/Elements/AnimatedModalWrapper.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useEffect, useState } = __imp_0;
		const { createPortal } = __require("utils/runtime.js");
		const { motion, AnimatePresence } = __require("utils/motion.js");
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

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return AnimatedModalWrapper; } });
	});
	//#endregion

	//#region utils/useLang.js
	__define("utils/useLang.js", function (exports, __require, module) {
		const { useState, useEffect } = __require("utils/runtime.js");
		const getStoredLanguage = () => {
			try {
				return localStorage.getItem("rednest_language") || "az";
			} catch {
				return "az";
			}
		};
		const setStoredLanguage = (newLang) => {
			try {
				localStorage.setItem("rednest_language", newLang);
				localStorage.setItem("rednest_language_updated_at", new Date().toISOString());
				window.dispatchEvent(new CustomEvent("languagechange", { detail: newLang }));
			} catch {}
		};
		const useLang = () => {
			const [lang, setLang] = useState(getStoredLanguage);
			useEffect(() => {
				const handleLanguageChange = (e) => {
					const newLang = e?.detail || getStoredLanguage();
					setLang(newLang);
				};
				window.addEventListener("languagechange", handleLanguageChange);
				window.addEventListener("storage", handleLanguageChange);
				return () => {
					window.removeEventListener("languagechange", handleLanguageChange);
					window.removeEventListener("storage", handleLanguageChange);
				};
			}, []);
			return lang;
		};

		Object.defineProperty(exports, "getStoredLanguage", { enumerable: true, get: function () { return getStoredLanguage; } });
		Object.defineProperty(exports, "setStoredLanguage", { enumerable: true, get: function () { return setStoredLanguage; } });
		Object.defineProperty(exports, "useLang", { enumerable: true, get: function () { return useLang; } });
		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return useLang; } });
	});
	//#endregion

	//#region components/Elements/Lang.js
	__define("components/Elements/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"widget_buynow_cart": "В корзину",
				"widget_buynow_write_review": "Написать отзыв",
				"widget_fortune_aria": "Колесо фортуны",
				"widget_fortune_tooltip": "Вращайте колесо и получайте подарки!",
				"widget_support_aria": "Чат поддержки",
				"widget_support_tooltip": "Готовы помочь вам с выбором",
				"nav_home": "Главная",
				"nav_menu": "Меню",
				"nav_review": "Отзывы",
				"user_nav_login": "Войти",
				"user_nav_profile": "Профиль",
				"user_nav_promos": "Промокоды",
				"user_nav_admin": "Админ панель",
				"user_nav_pos": "POS терминал",
				"user_nav_logout": "Выйти",
				"modal_logout_title": "Выход из аккаунта",
				"modal_logout_text": "Вы уверены, что хотите выйти из своей учетной записи?",
				"modal_logout_confirm": "Выйти",
				"modal_logout_cancel": "Отмена",
				"modal_delete_cancel": "Отмена",
				"modal_delete_remove": "Удалить",
				"modal_delete_deleting": "Удаление...",
				"modal_security_title": "Проверка безопасности",
				"modal_security_desc": "Введите пароль вашей учетной записи для доступа.",
				"modal_security_desc_profile": "Введите пароль учетной записи для доступа к настройкам профиля.",
				"modal_security_desc_addresses": "Введите пароль учетной записи для доступа к адресам доставки.",
				"modal_security_desc_payments": "Введите пароль учетной записи для доступа к способам оплаты.",
				"modal_security_desc_sessions": "Введите пароль учетной записи для доступа к активным сессиям.",
				"modal_security_desc_orders": "Введите пароль учетной записи для доступа к истории заказов.",
				"modal_security_desc_reviews": "Введите пароль учетной записи для доступа к вашим отзывам.",
				"modal_security_placeholder": "Введите пароль",
				"modal_security_unlock": "Подтвердить",
				"modal_security_unlocking": "Проверка..."
			},
			en: {
				"widget_buynow_cart": "Buy Now",
				"widget_buynow_write_review": "Write a Review",
				"widget_fortune_aria": "Wheel of Fortune",
				"widget_fortune_tooltip": "Spin the wheel for a gift!",
				"widget_support_aria": "Support chat",
				"widget_support_tooltip": "Ready to help you with your choice",
				"nav_home": "Home",
				"nav_menu": "Menu",
				"nav_review": "Review",
				"user_nav_login": "Log In",
				"user_nav_profile": "Profile",
				"user_nav_promos": "Promos",
				"user_nav_admin": "Admin",
				"user_nav_pos": "POS Terminal",
				"user_nav_logout": "Log Out",
				"modal_logout_title": "Log Out",
				"modal_logout_text": "Are you sure you want to log out of your account?",
				"modal_logout_confirm": "Log Out",
				"modal_logout_cancel": "Cancel",
				"modal_delete_cancel": "Cancel",
				"modal_delete_remove": "Remove",
				"modal_delete_deleting": "Deleting...",
				"modal_security_title": "Security Check",
				"modal_security_desc": "Enter your account password to proceed.",
				"modal_security_desc_profile": "Enter your account password to access Profile settings.",
				"modal_security_desc_addresses": "Enter your account password to access Delivery Addresses.",
				"modal_security_desc_payments": "Enter your account password to access Payment Methods.",
				"modal_security_desc_sessions": "Enter your account password to access Active Sessions.",
				"modal_security_desc_orders": "Enter your account password to access Order History.",
				"modal_security_desc_reviews": "Enter your account password to access Your Reviews.",
				"modal_security_placeholder": "Enter your password",
				"modal_security_unlock": "Unlock",
				"modal_security_unlocking": "Verifying..."
			},
			az: {
				"widget_buynow_cart": "İndi al",
				"widget_buynow_write_review": "Rəy yazın",
				"widget_fortune_aria": "Hədiyyə çarxı",
				"widget_fortune_tooltip": "Hədiyyə üçün çarxı fırladın!",
				"widget_support_aria": "Dəstək çatı",
				"widget_support_tooltip": "Seçiminizdə sizə kömək etməyə hazırıq",
				"nav_home": "Ana səhifə",
				"nav_menu": "Menyu",
				"nav_review": "Rəylər",
				"user_nav_login": "Daxil ol",
				"user_nav_profile": "Profil",
				"user_nav_promos": "Promokodlar",
				"user_nav_admin": "Admin",
				"user_nav_pos": "POS terminal",
				"user_nav_logout": "Çıxış",
				"modal_logout_title": "Hesabdan çıxış",
				"modal_logout_text": "Hesabınızdan çıxmaq istədiyinizə əminsiniz?",
				"modal_logout_confirm": "Çıxış",
				"modal_logout_cancel": "Ləğv et",
				"modal_delete_cancel": "Ləğv et",
				"modal_delete_remove": "Sil",
				"modal_delete_deleting": "Silinir...",
				"modal_security_title": "Təhlükəsizlik yoxlaması",
				"modal_security_desc": "Davam etmək üçün hesabınızın şifrəsini daxil edin.",
				"modal_security_desc_profile": "Profil ayarlarına daxil olmaq üçün hesabınızın şifrəsini daxil edin.",
				"modal_security_desc_addresses": "Çatdırılma ünvanlarına daxil olmaq üçün hesabınızın şifrəsini daxil edin.",
				"modal_security_desc_payments": "Ödəniş üsullarına daxil olmaq üçün hesabınızın şifrəsini daxil edin.",
				"modal_security_desc_sessions": "Aktiv sessiyalara daxil olmaq üçün hesabınızın şifrəsini daxil edin.",
				"modal_security_desc_orders": "Sifariş tarixçəsinə daxil olmaq üçün hesabınızın şifrəsini daxil edin.",
				"modal_security_desc_reviews": "Rəylərinizə daxil olmaq üçün hesabınızın şifrəsini daxil edin.",
				"modal_security_placeholder": "Şifrənizi daxil edin",
				"modal_security_unlock": "Təsdiqlə",
				"modal_security_unlocking": "Yoxlanılır..."
			}
		};
		const getWidgetTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.az || translations.ru;
			return dict[dataId] || translations.en[dataId] || dataId;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getWidgetTranslation", { enumerable: true, get: function () { return getWidgetTranslation; } });
	});
	//#endregion

	//#region components/Elements/ProfilePasswordModal.js
	__define("components/Elements/ProfilePasswordModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useRef } = __imp_0;
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const logo = "/assets/icons/rednest_logo.png";
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { useLang } = __require("utils/useLang.js");
		const { getWidgetTranslation } = __require("components/Elements/Lang.js");
		const EyeIcon = ({ visible }) => visible ? /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }), /* @__PURE__ */ __h("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		})) : /* @__PURE__ */ __h("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, /* @__PURE__ */ __h("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }), /* @__PURE__ */ __h("line", {
			x1: "1",
			y1: "1",
			x2: "23",
			y2: "23"
		}));
		const ProfilePasswordModal = ({ isOpen, onClose, onSuccess, title, description }) => {
			const lang = useLang();
			const t = (id) => getWidgetTranslation(lang, id);
			const displayTitle = title || t("modal_security_title");
			const displayDescription = description || t("modal_security_desc");
			const [password, setPassword] = useState("");
			const [showPassword, setShowPassword] = useState(false);
			const [loading, setLoading] = useState(false);
			const [error, setError] = useState("");
			const inputRef = useRef(null);
			useEffect(() => {
				if (isOpen) {
					setPassword("");
					setError("");
					setShowPassword(false);
					const timer = setTimeout(() => {
						if (inputRef.current) {
							inputRef.current.focus();
						}
					}, 100);
					return () => clearTimeout(timer);
				}
			}, [isOpen]);
			const handleClose = () => {
				if (loading) return;
				setError("");
				setPassword("");
				onClose();
			};
			const handleSubmit = async (e) => {
				e.preventDefault();
				if (loading) return;
				if (!password.trim()) {
					setError(lang === "az" ? "Hesabınızın şifrəsini daxil edin." : lang === "en" ? "Please enter your account password." : "Пожалуйста, введите пароль вашей учетной записи.");
					if (inputRef.current) inputRef.current.focus();
					return;
				}
				setLoading(true);
				setError("");
				try {
					const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
					const response = await fetchWithRefresh(`${apiUrl}/api/auth/verify-password`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ password }),
						skipAuthRedirect: true
					});
					const data = await response.json().catch(() => ({}));
					if (response.ok) {
						setPassword("");
						setError("");
						if (onSuccess) {
							onSuccess();
						}
					} else {
						setError(data.message || (lang === "az" ? "Yanlış şifrə. Yenidən cəhd edin." : lang === "en" ? "Incorrect password. Please try again." : "Неверный пароль. Попробуйте еще раз."));
						if (inputRef.current) {
							inputRef.current.select();
						}
					}
				} catch {
					setError(lang === "az" ? "Bağlantı xətası. Yenidən cəhd edin." : lang === "en" ? "Connection error. Please try again." : "Ошибка подключения. Попробуйте еще раз.");
				} finally {
					setLoading(false);
				}
			};
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose: handleClose,
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "profile-auth-card-split",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "profile-auth-close-btn",
				onClick: handleClose,
				disabled: loading,
				"aria-label": "Close"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("line", {
				x1: "18",
				y1: "6",
				x2: "6",
				y2: "18"
			}), /* @__PURE__ */ __h("line", {
				x1: "6",
				y1: "6",
				x2: "18",
				y2: "18"
			}))), /* @__PURE__ */ __h("div", { className: "profile-auth-card-left" }, /* @__PURE__ */ __h("div", { className: "profile-auth-card-left__content" }, /* @__PURE__ */ __h("img", {
				src: logo,
				alt: "Süfrano",
				className: "profile-auth-card-left__logo"
			}), /* @__PURE__ */ __h("h2", null, "Süfrano"), /* @__PURE__ */ __h("p", null, lang === "az" ? "Şəxsi məlumatlarınıza və hesab ayarlarına təhlükəsiz giriş üçün şifrənizi təsdiqləyin." : lang === "en" ? "Confirm your password to securely access your personal details and account settings." : "Подтвердите пароль для безопасного доступа к личным данным и настройкам аккаунта."))), /* @__PURE__ */ __h("div", { className: "profile-auth-card-right" }, /* @__PURE__ */ __h("div", { className: "profile-auth-header" }, /* @__PURE__ */ __h("img", {
				src: logo,
				alt: "Süfrano",
				className: "profile-auth-header__mobile-logo"
			}), /* @__PURE__ */ __h("h2", null, displayTitle), /* @__PURE__ */ __h("p", null, displayDescription)), /* @__PURE__ */ __h("form", {
				onSubmit: handleSubmit,
				className: "profile-auth-form",
				noValidate: true
			}, /* @__PURE__ */ __h("div", { className: "profile-auth-input-group" }, /* @__PURE__ */ __h("label", { htmlFor: "profile-auth-password" }, lang === "az" ? "Şifrə" : lang === "en" ? "Password" : "Пароль"), /* @__PURE__ */ __h("div", { className: "profile-auth-input-wrap" }, /* @__PURE__ */ __h("input", {
				ref: inputRef,
				id: "profile-auth-password",
				type: showPassword ? "text" : "password",
				placeholder: t("modal_security_placeholder"),
				value: password,
				onChange: (e) => {
					setPassword(e.target.value);
					if (error) setError("");
				},
				className: error ? "has-error" : "",
				disabled: loading,
				autoComplete: "current-password"
			}), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "profile-auth-toggle-pwd",
				onClick: () => setShowPassword((prev) => !prev),
				tabIndex: -1,
				"aria-label": showPassword ? "Hide password" : "Show password"
			}, /* @__PURE__ */ __h(EyeIcon, { visible: showPassword })))), error && /* @__PURE__ */ __h("div", {
				className: "profile-auth-error",
				role: "alert"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "8",
				x2: "12",
				y2: "12"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "16",
				x2: "12.01",
				y2: "16"
			})), /* @__PURE__ */ __h("span", null, error)), /* @__PURE__ */ __h("div", { className: "profile-auth-actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "profile-auth-cancel-btn",
				onClick: handleClose,
				disabled: loading
			}, t("modal_logout_cancel")), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "profile-auth-submit-btn",
				disabled: loading
			}, loading ? /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Loading...",
				className: "profile-auth-btn-spinner"
			}) : t("modal_security_unlock")))))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return ProfilePasswordModal; } });
	});
	//#endregion

	//#region context/ProfileSecurityContext.js
	__define("context/ProfileSecurityContext.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { createContext, useContext, useState, useCallback, useRef, useEffect } = __imp_0;
		const { useNavigate, useLocation } = __require("utils/router.js");
		const __imp_1 = __require("components/Elements/ProfilePasswordModal.js");
		const ProfilePasswordModal = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { API_URL } = __require("utils/config.js");
		const { useLang } = __require("utils/useLang.js");
		const { getWidgetTranslation } = __require("components/Elements/Lang.js");
		const ProfileSecurityContext = createContext(null);
		const PROTECTED_ROUTES = [
			"/profile",
			"/addresses",
			"/adresses",
			"/payment-methods",
			"/sessions",
			"/orders",
			"/reviews"
		];
		const getModalContent = (path, lang) => {
			const t = (id) => getWidgetTranslation(lang, id);
			const title = t("modal_security_title");
			if (path === "/addresses" || path === "/adresses") {
				return {
					title,
					description: t("modal_security_desc_addresses")
				};
			}
			if (path === "/payment-methods") {
				return {
					title,
					description: t("modal_security_desc_payments")
				};
			}
			if (path === "/sessions") {
				return {
					title,
					description: t("modal_security_desc_sessions")
				};
			}
			if (path === "/orders") {
				return {
					title,
					description: t("modal_security_desc_orders")
				};
			}
			if (path === "/reviews") {
				return {
					title,
					description: t("modal_security_desc_reviews")
				};
			}
			return {
				title,
				description: t("modal_security_desc_profile")
			};
		};
		const ProfileSecurityProvider = ({ children }) => {
			const [isProfileUnlocked, setIsProfileUnlocked] = useState(false);
			const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
			const [targetPath, setTargetPath] = useState("/profile");
			const navigate = useNavigate();
			const location = useLocation();
			const lang = useLang();
			const successCallbackRef = useRef(null);
			const checkSecurityStatus = useCallback(async () => {
				try {
					const apiUrl = API_URL;
					const res = await fetchWithRefresh(`${apiUrl}/api/auth/security-status`, { skipAuthRedirect: true });
					if (res.ok) {
						const data = await res.json().catch(() => ({}));
						if (data?.verified) {
							setIsProfileUnlocked(true);
							return true;
						}
					}
					setIsProfileUnlocked(false);
					return false;
				} catch {
					return false;
				}
			}, []);
			const requireProfileAccess = useCallback((destination = "/profile", onSuccess = null) => {
				setTargetPath(destination);
				successCallbackRef.current = onSuccess;
				setIsPasswordModalOpen(true);
			}, []);
			const lockProfile = useCallback(() => {
				setIsProfileUnlocked(false);
			}, []);
			const handleVerificationSuccess = useCallback(() => {
				setIsProfileUnlocked(true);
				setIsPasswordModalOpen(false);
				if (successCallbackRef.current) {
					successCallbackRef.current();
					successCallbackRef.current = null;
				}
				if (targetPath && location.pathname !== targetPath) {
					navigate(targetPath);
				}
			}, [
				navigate,
				location.pathname,
				targetPath
			]);
			const handleModalClose = useCallback(() => {
				setIsPasswordModalOpen(false);
				successCallbackRef.current = null;
				if (!isProfileUnlocked && PROTECTED_ROUTES.includes(location.pathname)) {
					navigate("/", { replace: true });
				}
			}, [
				location.pathname,
				isProfileUnlocked,
				navigate
			]);
			const modalContent = getModalContent(targetPath || location.pathname, lang);
			return /* @__PURE__ */ __h(ProfileSecurityContext.Provider, { value: {
				isProfileUnlocked,
				requireProfileAccess,
				lockProfile,
				setIsProfileUnlocked,
				checkSecurityStatus
			} }, children, /* @__PURE__ */ __h(ProfilePasswordModal, {
				isOpen: isPasswordModalOpen,
				onClose: handleModalClose,
				onSuccess: handleVerificationSuccess,
				title: modalContent.title,
				description: modalContent.description
			}));
		};
		const useProfileSecurity = () => {
			const ctx = useContext(ProfileSecurityContext);
			if (!ctx) {
				throw new Error("useProfileSecurity must be used within ProfileSecurityProvider");
			}
			return ctx;
		};

		Object.defineProperty(exports, "ProfileSecurityProvider", { enumerable: true, get: function () { return ProfileSecurityProvider; } });
		Object.defineProperty(exports, "useProfileSecurity", { enumerable: true, get: function () { return useProfileSecurity; } });
		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return ProfileSecurityContext; } });
	});
	//#endregion

	//#region routes/ProfileSecurityGuard.js
	__define("routes/ProfileSecurityGuard.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useEffect, useState } = __imp_0;
		const { useLocation } = __require("utils/router.js");
		const { useProfileSecurity } = __require("context/ProfileSecurityContext.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const ProfileSecurityGuard = ({ children }) => {
			const { isProfileUnlocked, requireProfileAccess, checkSecurityStatus } = useProfileSecurity();
			const location = useLocation();
			const [checking, setChecking] = useState(true);
			useEffect(() => {
				let isMounted = true;
				if (isProfileUnlocked) {
					setChecking(false);
					return;
				}
				setChecking(true);
				checkSecurityStatus().then((isVerified) => {
					if (isMounted) {
						if (!isVerified) {
							requireProfileAccess(location.pathname);
						}
						setChecking(false);
					}
				});
				return () => {
					isMounted = false;
				};
			}, [
				location.pathname,
				isProfileUnlocked,
				requireProfileAccess,
				checkSecurityStatus
			]);
			if (checking || !isProfileUnlocked) {
				return /* @__PURE__ */ __h("div", { style: {
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#0d0d0d"
				} }, /* @__PURE__ */ __h("img", {
					src: loaderIcon,
					alt: "Security check...",
					style: {
						width: "40px",
						height: "40px"
					}
				}));
			}
			return children;
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return ProfileSecurityGuard; } });
	});
	//#endregion

	//#region context/AdminAuthContext.js
	__define("context/AdminAuthContext.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { createContext, useContext, useState, useCallback } = __imp_0;
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { API_URL } = __require("utils/config.js");
		const AdminAuthContext = createContext(null);
		const AdminAuthProvider = ({ children }) => {
			const [isAdminAuth, setIsAdminAuth] = useState(false);
			const [adminRole, setAdminRole] = useState(null);
			const [loading, setLoading] = useState(false);
			const verify = useCallback(async () => {
				setLoading(true);
				try {
					const apiUrl = API_URL;
					const res = await fetchWithRefresh(`${apiUrl}/api/admin/verify`, { skipAuthRedirect: true });
					if (res.ok) {
						const data = await res.json().catch(() => ({}));
						setIsAdminAuth(true);
						if (data && data.role) {
							setAdminRole(data.role);
						}
						return {
							ok: true,
							role: data?.role,
							user: data
						};
					}
					setIsAdminAuth(false);
					setAdminRole(null);
					return {
						ok: false,
						status: res.status
					};
				} catch {
					setIsAdminAuth(false);
					setAdminRole(null);
					return { ok: false };
				} finally {
					setLoading(false);
				}
			}, []);
			const adminLogin = useCallback(async (password) => {
				const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
				const res = await fetchWithRefresh(`${apiUrl}/api/admin/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ password }),
					skipAuthRedirect: true
				});
				if (res.ok) {
					setIsAdminAuth(true);
					return { ok: true };
				}
				const data = await res.json().catch(() => ({}));
				return {
					ok: false,
					status: res.status,
					message: data.message || "Incorrect password. Please try again."
				};
			}, []);
			const adminLogout = useCallback(async () => {
				const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
				try {
					await fetchWithRefresh(`${apiUrl}/api/admin/logout`, {
						method: "POST",
						skipAuthRedirect: true
					});
				} catch {}
				setIsAdminAuth(false);
				setAdminRole(null);
			}, []);
			return /* @__PURE__ */ __h(AdminAuthContext.Provider, { value: {
				isAdminAuth,
				adminRole,
				loading,
				adminLogin,
				adminLogout,
				verify
			} }, children);
		};
		const useAdminAuth = () => {
			const ctx = useContext(AdminAuthContext);
			if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
			return ctx;
		};

		Object.defineProperty(exports, "AdminAuthProvider", { enumerable: true, get: function () { return AdminAuthProvider; } });
		Object.defineProperty(exports, "useAdminAuth", { enumerable: true, get: function () { return useAdminAuth; } });
		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return AdminAuthContext; } });
	});
	//#endregion

	//#region routes/AdminProtectedRoute.js
	__define("routes/AdminProtectedRoute.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useEffect, useState } = __imp_0;
		const { Navigate, useLocation } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { useAdminAuth } = __require("context/AdminAuthContext.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const ALLOWED_ADMIN_ROLES = [
			"moderator",
			"admin",
			"super admin",
			"superadmin"
		];
		const cleanRole = (role) => (role || "").toLowerCase().replace(/\s+/g, "");
		const isAllowedAdminRole = (role) => {
			if (!role) return false;
			return ALLOWED_ADMIN_ROLES.map(cleanRole).includes(cleanRole(role));
		};
		const AdminProtectedRoute = ({ children, requiredRoles }) => {
			const { isAuthenticated, user, authLoading } = useAuth();
			const { isAdminAuth, loading: adminLoading, verify } = useAdminAuth();
			const location = useLocation();
			const [checkingRoute, setCheckingRoute] = useState(true);
			const [verifiedRole, setVerifiedRole] = useState(null);
			useEffect(() => {
				let isMounted = true;
				setCheckingRoute(true);
				if (!isAuthenticated) {
					setCheckingRoute(false);
					return;
				}
				verify().then((res) => {
					if (isMounted) {
						if (res && res.role) {
							setVerifiedRole(res.role);
						} else {
							setVerifiedRole(null);
						}
						setCheckingRoute(false);
					}
				}).catch(() => {
					if (isMounted) {
						setCheckingRoute(false);
					}
				});
				return () => {
					isMounted = false;
				};
			}, [
				location.pathname,
				isAuthenticated,
				verify
			]);
			const activeRole = verifiedRole || user?.role || user?.Role;
			const hasAdminRole = isAllowedAdminRole(activeRole);
			const normalizedRole = cleanRole(activeRole);
			if (authLoading || isAuthenticated && (adminLoading || checkingRoute)) {
				return /* @__PURE__ */ __h("div", { className: "admin-loading-screen" }, /* @__PURE__ */ __h("img", {
					src: loaderIcon,
					alt: "Loading...",
					className: "admin-loading-spinner"
				}));
			}
			if (!isAuthenticated) {
				return /* @__PURE__ */ __h(Navigate, {
					to: "/login",
					state: { from: location },
					replace: true
				});
			}
			if (!hasAdminRole) {
				return /* @__PURE__ */ __h(Navigate, {
					to: "/",
					state: {
						from: location,
						roleForbidden: true
					},
					replace: true
				});
			}
			if (!isAdminAuth) {
				return /* @__PURE__ */ __h(Navigate, {
					to: "/admin/login",
					state: { from: location },
					replace: true
				});
			}
			if (requiredRoles && requiredRoles.length > 0) {
				const normalizedRequired = requiredRoles.map(cleanRole);
				if (!normalizedRequired.includes(normalizedRole)) {
					return /* @__PURE__ */ __h(Navigate, {
						to: "/admin/dashboard",
						state: { accessDenied: true },
						replace: true
					});
				}
			}
			return children;
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return AdminProtectedRoute; } });
	});
	//#endregion

	//#region routes/CashboxProtectedRoute.js
	__define("routes/CashboxProtectedRoute.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useEffect, useState } = __imp_0;
		const { Navigate, useLocation } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const ALLOWED_CASHBOX_ROLES = [
			"staff",
			"leadstaff",
			"admin",
			"superadmin"
		];
		const ALLOWED_HISTORY_ROLES = [
			"leadstaff",
			"admin",
			"superadmin"
		];
		const cleanRole = (role) => (role || "").toLowerCase().replace(/[\s_-]+/g, "");
		const isAllowedCashboxRole = (role) => {
			if (!role) return false;
			return ALLOWED_CASHBOX_ROLES.includes(cleanRole(role));
		};
		const isAllowedCashboxHistoryRole = (role) => {
			if (!role) return false;
			return ALLOWED_HISTORY_ROLES.includes(cleanRole(role));
		};
		const CashboxProtectedRoute = ({ children, allowedRoles = ALLOWED_CASHBOX_ROLES }) => {
			const { isAuthenticated, user, authLoading, fetchCurrentUser } = useAuth();
			const location = useLocation();
			const [checking, setChecking] = useState(false);
			useEffect(() => {
				const currentRole = user?.role || user?.Role;
				if (isAuthenticated && !currentRole && fetchCurrentUser) {
					setChecking(true);
					fetchCurrentUser().finally(() => setChecking(false));
				}
			}, [
				isAuthenticated,
				user,
				fetchCurrentUser
			]);
			if (authLoading || checking) {
				return /* @__PURE__ */ __h("div", { className: "admin-loading-screen" }, /* @__PURE__ */ __h("img", {
					src: loaderIcon,
					alt: "Loading...",
					className: "admin-loading-spinner"
				}));
			}
			if (!isAuthenticated) {
				return /* @__PURE__ */ __h(Navigate, {
					to: "/login",
					state: { from: location },
					replace: true
				});
			}
			const role = user?.role || user?.Role;
			const isAllowed = allowedRoles.map(cleanRole).includes(cleanRole(role));
			if (!isAllowed) {
				return /* @__PURE__ */ __h(Navigate, {
					to: "/error?code=403",
					state: { from: location },
					replace: true
				});
			}
			return children;
		};

		Object.defineProperty(exports, "isAllowedCashboxRole", { enumerable: true, get: function () { return isAllowedCashboxRole; } });
		Object.defineProperty(exports, "isAllowedCashboxHistoryRole", { enumerable: true, get: function () { return isAllowedCashboxHistoryRole; } });
		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return CashboxProtectedRoute; } });
	});
	//#endregion

	//#region components/Elements/ScrollToTop.js
	__define("components/Elements/ScrollToTop.js", function (exports, __require, module) {
		const { useEffect } = __require("utils/runtime.js");
		const { useLocation } = __require("utils/router.js");
		const ScrollToTop = () => {
			const { pathname } = useLocation();
			useEffect(() => {
				window.scrollTo(0, 0);
			}, [pathname]);
			return null;
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return ScrollToTop; } });
	});
	//#endregion

	//#region components/Elements/SupportWidget.js
	__define("components/Elements/SupportWidget.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect } = __imp_0;
		const { useLocation, useNavigate } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const smileyAnimated = "/assets/icons/smiley-animated.svg";
		const { useLang } = __require("utils/useLang.js");
		const { getWidgetTranslation } = __require("components/Elements/Lang.js");
		const supportStyles = `
		.support-widget-container {
		  position: fixed;
		  bottom: 30px;
		  right: 30px;
		  z-index: 9999;
		  display: flex;
		  align-items: center;
		  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		  opacity: 0;
		  pointer-events: none;
		  transform: translateY(20px) scale(0.8);
		}
		body.mobile-menu-open .support-widget-container {
		  opacity: 0 !important;
		  pointer-events: none !important;
		}
		.support-widget-container.visible {
		  opacity: 1;
		  pointer-events: auto;
		  transform: translateY(0) scale(1);
		}
		@media (max-width: 768px) {
		  .support-widget-container {
		    bottom: 20px;
		    right: 20px;
		  }
		  .support-tooltip {
		    font-size: 0.76rem;
		    padding: 10px 14px;
		  }
		}
		.support-tooltip {
		  position: absolute;
		  right: calc(100% + 15px);
		  background: rgba(24, 3, 9, 0.9);
		  backdrop-filter: blur(16px);
		  -webkit-backdrop-filter: blur(16px);
		  border: 1px solid rgba(197, 160, 89, 0.4);
		  padding: 12px 18px;
		  border-radius: 12px 12px 0 12px;
		  color: #fff;
		  font-size: 0.9rem;
		  font-weight: 500;
		  white-space: nowrap;
		  opacity: 0;
		  visibility: hidden;
		  transform: translate(15px, -50px) scale(0.9);
		  pointer-events: none;
		  box-shadow: 0 0 14px rgba(197, 160, 89, 0.16), 0 6px 20px rgba(0, 0, 0, 0.4);
		}
		.support-widget-container:hover .support-tooltip {
		  visibility: visible;
		  animation: supportTooltipPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
		}
		@keyframes supportTooltipPop {
		  0% {
		    opacity: 0;
		    transform: translate(15px, -50px) scale(0.9);
		  }
		  100% {
		    opacity: 1;
		    transform: translate(0, -50px) scale(1);
		  }
		}
		.support-widget {
		  width: 65px;
		  height: 65px;
		  border-radius: 50%;
		  background: rgba(24, 3, 9, 0.88);
		  backdrop-filter: blur(16px);
		  -webkit-backdrop-filter: blur(16px);
		  border: 1px solid rgba(197, 160, 89, 0.42);
		  box-shadow: 0 0 14px rgba(197, 160, 89, 0.18), 0 0 30px rgba(197, 160, 89, 0.08), 0 6px 20px rgba(0, 0, 0, 0.4);
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  cursor: pointer;
		  transition: all 0.3s ease;
		}
		.support-widget img {
		  width: 40px;
		  height: 40px;
		}
		.support-widget:hover {
		  transform: scale(1.12) translateY(-5px);
		  background: rgba(36, 5, 13, 0.96);
		  border-color: rgba(223, 194, 136, 0.7);
		  box-shadow: 0 0 20px rgba(197, 160, 89, 0.32), 0 0 40px rgba(197, 160, 89, 0.14), 0 8px 24px rgba(0, 0, 0, 0.5);
		}
		.support-widget:active {
		  transform: scale(0.95);
		}
		@media (max-width: 768px) {
		  .support-widget {
		    width: 55px;
		    height: 55px;
		  }
		  .support-widget img {
		    width: 34px;
		    height: 34px;
		  }
		}
		`;
		const SupportWidget = () => {
			const lang = useLang();
			const t = (id) => getWidgetTranslation(lang, id);
			const location = useLocation();
			const navigate = useNavigate();
			const { isAuthenticated } = useAuth();
			const [isScrolled, setIsScrolled] = useState(false);
			const [isFooterVisible, setIsFooterVisible] = useState(false);
			useEffect(() => {
				const handleScroll = () => {
					const scrollY = window.scrollY;
					let isAtBottom = false;
					const footer = document.querySelector("footer");
					if (footer) {
						const footerRect = footer.getBoundingClientRect();
						if (footerRect.top <= window.innerHeight - 60) {
							isAtBottom = true;
						}
					} else {
						isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100;
					}
					setIsScrolled(scrollY >= 10);
					setIsFooterVisible(isAtBottom);
				};
				window.addEventListener("scroll", handleScroll);
				handleScroll();
				return () => window.removeEventListener("scroll", handleScroll);
			}, [location.pathname]);
			const hiddenPaths = [
				"/login",
				"/fortune",
				"/profile",
				"/sessions",
				"/promos",
				"/order",
				"/orders",
				"/error"
			];
			if (hiddenPaths.includes(location.pathname) || location.pathname.startsWith("/admin") || location.pathname.startsWith("/cashbox")) {
				return null;
			}
			const isVisible = isScrolled && !isFooterVisible;
			return /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("style", null, supportStyles), /* @__PURE__ */ __h("div", { className: `support-widget-container ${isVisible ? "visible" : ""}` }, /* @__PURE__ */ __h("span", {
				className: "support-tooltip",
				"data-id": "widget_support_tooltip"
			}, t("widget_support_tooltip")), /* @__PURE__ */ __h("button", {
				className: "support-widget",
				"aria-label": t("widget_support_aria"),
				"data-id": "widget_support_aria",
				onClick: () => {
					if (!isAuthenticated) {
						navigate("/login");
					}
				}
			}, /* @__PURE__ */ __h("img", {
				src: smileyAnimated,
				alt: "Support"
			}))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return SupportWidget; } });
	});
	//#endregion

	//#region context/BasketContext.js
	__define("context/BasketContext.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { createContext, useContext, useState, useEffect, useCallback, useRef } = __imp_0;
		const { useAuth } = __require("context/AuthContext.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { API_URL } = __require("utils/config.js");
		const BasketContext = createContext(null);
		const LOCAL_STORAGE_KEY = "rednest_basket";
		const basketChannel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("rednest_basket_channel") : null;
		function getLocalBasket() {
			try {
				const data = localStorage.getItem(LOCAL_STORAGE_KEY);
				return data ? JSON.parse(data) : [];
			} catch {
				return [];
			}
		}
		function setLocalBasket(items) {
			try {
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
			} catch {}
		}
		function getBakuTimeISO() {
			const formatter = new Intl.DateTimeFormat("en-CA", {
				timeZone: "Asia/Baku",
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false
			});
			const parts = formatter.formatToParts(new Date());
			const get = (type) => parts.find((p) => p.type === type)?.value || "00";
			return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}.000Z`;
		}
		function clearLocalBasket() {
			try {
				localStorage.removeItem(LOCAL_STORAGE_KEY);
			} catch {}
		}
		const BasketProvider = ({ children }) => {
			const { isAuthenticated, user, authLoading } = useAuth();
			const [items, setItems] = useState([]);
			const [loading, setLoading] = useState(true);
			const hasSynced = useRef(false);
			const apiUrl = API_URL;
			useEffect(() => {
				if (!basketChannel) return;
				const handleMessage = (event) => {
					if (event.data?.type === "BASKET_SYNC" && Array.isArray(event.data.items)) {
						setItems(event.data.items);
					}
				};
				basketChannel.addEventListener("message", handleMessage);
				return () => {
					basketChannel.removeEventListener("message", handleMessage);
				};
			}, []);
			useEffect(() => {
				if (authLoading) return;
				const loadBasket = async () => {
					if (isAuthenticated && user) {
						const localItems = getLocalBasket();
						if (localItems.length > 0 && !hasSynced.current) {
							hasSynced.current = true;
							try {
								await fetchWithRefresh(`${apiUrl}/api/basket/sync`, {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ items: localItems })
								});
								clearLocalBasket();
							} catch (err) {
								console.error("Basket sync failed:", err);
							}
						}
						try {
							const response = await fetchWithRefresh(`${apiUrl}/api/basket`);
							if (response.ok) {
								const data = await response.json();
								setItems(data.items || []);
							}
						} catch (err) {
							console.error("Failed to fetch basket:", err);
						}
					} else {
						hasSynced.current = false;
						setItems(getLocalBasket());
					}
					setLoading(false);
				};
				loadBasket();
			}, [
				isAuthenticated,
				user,
				authLoading
			]);
			const broadcastSync = (newItems) => {
				try {
					basketChannel?.postMessage({
						type: "BASKET_SYNC",
						items: newItems
					});
				} catch {}
			};
			const applyUpdate = useCallback((transform, apiCall) => {
				let nextItems = null;
				setItems((prev) => {
					const result = transform(prev);
					if (result === prev) return prev;
					nextItems = result;
					return result;
				});
				if (nextItems) {
					broadcastSync(nextItems);
					if (isAuthenticated && user) {
						apiCall?.().catch((err) => console.error("Basket API error:", err));
					} else {
						setLocalBasket(nextItems);
					}
				}
			}, [isAuthenticated, user]);
			const addItem = useCallback(async (productId) => {
				applyUpdate((prev) => {
					const existing = prev.find((i) => i.productId === productId);
					if (existing) {
						if (existing.quantity >= 100) return prev;
						return prev.map((i) => i.productId === productId ? {
							...i,
							quantity: i.quantity + 1
						} : i);
					}
					return [...prev, {
						productId,
						addedAt: getBakuTimeISO(),
						quantity: 1
					}];
				}, () => fetchWithRefresh(`${apiUrl}/api/basket/add`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ productId })
				}));
			}, [applyUpdate, apiUrl]);
			const removeItem = useCallback(async (productId) => {
				applyUpdate((prev) => {
					const existing = prev.find((i) => i.productId === productId);
					if (!existing) return prev;
					if (existing.quantity <= 1) {
						return prev.filter((i) => i.productId !== productId);
					}
					return prev.map((i) => i.productId === productId ? {
						...i,
						quantity: i.quantity - 1
					} : i);
				}, () => fetchWithRefresh(`${apiUrl}/api/basket/remove`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ productId })
				}));
			}, [applyUpdate, apiUrl]);
			const deleteItem = useCallback(async (productId) => {
				applyUpdate((prev) => prev.filter((i) => i.productId !== productId), () => fetchWithRefresh(`${apiUrl}/api/basket/delete/${productId}`, { method: "DELETE" }));
			}, [applyUpdate, apiUrl]);
			const getItemQuantity = useCallback((productId) => {
				const item = items.find((i) => i.productId === productId);
				return item ? item.quantity : 0;
			}, [items]);
			const clearBasket = useCallback(() => {
				setItems([]);
				clearLocalBasket();
				broadcastSync([]);
			}, []);
			const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
			return /* @__PURE__ */ __h(BasketContext.Provider, { value: {
				items,
				addItem,
				removeItem,
				deleteItem,
				getItemQuantity,
				clearBasket,
				totalCount,
				loading
			} }, children);
		};
		const useBasket = () => {
			const ctx = useContext(BasketContext);
			if (!ctx) throw new Error("useBasket must be used within BasketProvider");
			return ctx;
		};

		Object.defineProperty(exports, "BasketProvider", { enumerable: true, get: function () { return BasketProvider; } });
		Object.defineProperty(exports, "useBasket", { enumerable: true, get: function () { return useBasket; } });
		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return BasketContext; } });
	});
	//#endregion

	//#region components/Elements/BuyNowWidget.js
	__define("components/Elements/BuyNowWidget.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect } = __imp_0;
		const { useLocation, useNavigate } = __require("utils/router.js");
		const { useBasket } = __require("context/BasketContext.js");
		const cartAnimated = "/assets/icons/cart-animated.svg";
		const { useLang } = __require("utils/useLang.js");
		const { getWidgetTranslation } = __require("components/Elements/Lang.js");
		const buyNowStyles = `
		.buynow-widget-container {
		  position: fixed;
		  bottom: 30px;
		  left: 50%;
		  transform: translate(-50%, 20px) scale(0.8);
		  z-index: 9998;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  gap: 12px;
		  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		  opacity: 0;
		  pointer-events: none;
		}
		body.mobile-menu-open .buynow-widget-container {
		  opacity: 0 !important;
		  pointer-events: none !important;
		}
		.buynow-widget-container.visible {
		  opacity: 1;
		  pointer-events: auto;
		  transform: translate(-50%, 0) scale(1);
		}
		@media (max-width: 768px) {
		  .buynow-widget-container {
		    bottom: 20px;
		    gap: 10px;
		  }
		  .buynow-widget {
		    padding: 0 16px;
		    font-size: 0.76rem;
		  }
		}
		.buynow-widget {
		  padding: 0 24px;
		  height: 49px !important;
		  min-height: 49px !important;
		  box-sizing: border-box;
		  border-radius: 26px;
		  background: rgba(24, 3, 9, 0.88);
		  backdrop-filter: blur(16px);
		  -webkit-backdrop-filter: blur(16px);
		  border: 1px solid rgba(197, 160, 89, 0.42);
		  box-shadow: 0 0 14px rgba(197, 160, 89, 0.18), 0 0 30px rgba(197, 160, 89, 0.08), 0 6px 20px rgba(0, 0, 0, 0.4);
		  color: #fff;
		  font-size: 0.85rem;
		  font-weight: 700;
		  text-transform: uppercase;
		  letter-spacing: 1px;
		  cursor: pointer;
		  transition: all 0.3s ease;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  gap: 10px;
		  white-space: nowrap;
		}
		.buynow-widget:hover {
		  transform: scale(1.06) translateY(-3px);
		  background: rgba(36, 5, 13, 0.96);
		  border-color: rgba(223, 194, 136, 0.7);
		  box-shadow: 0 0 20px rgba(197, 160, 89, 0.32), 0 0 40px rgba(197, 160, 89, 0.14), 0 8px 24px rgba(0, 0, 0, 0.5);
		}
		.buynow-widget:active {
		  transform: scale(0.95);
		}
		.buynow-icon-wrapper {
		  position: relative;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		}
		.buynow-icon {
		  width: 19px;
		  height: 19px;
		  fill: currentColor;
		  transform: translateX(-2px);
		}
		.review-widget-icon {
		  width: 18px;
		  height: 18px;
		  color: #dfc288;
		}
		.cart-badge {
		  position: absolute;
		  top: -6px;
		  right: -7px;
		  background: linear-gradient(135deg, #dfc288 0%, #c5a059 100%);
		  color: #24050d;
		  font-size: 0.52rem;
		  font-weight: 800;
		  min-width: 13px;
		  height: 13px;
		  padding: 0 2px;
		  border-radius: 7px;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
		  animation: badgePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		  line-height: 1;
		}
		@keyframes badgePop {
		  0% { transform: scale(0); }
		  80% { transform: scale(1.2); }
		  100% { transform: scale(1); }
		}
		@media (max-width: 768px) {
		  .buynow-widget {
		    padding: 0 18px;
		    height: 41px !important;
		    min-height: 41px !important;
		    font-size: 0.75rem;
		  }
		  .buynow-icon {
		    width: 16px;
		    height: 16px;
		  }
		  .cart-badge {
		    top: -5px;
		    right: -6px;
		    min-width: 11px;
		    height: 11px;
		    font-size: 0.48rem;
		    padding: 0 2px;
		  }

		  .buynow-widget-container.is-review-page .buynow-widget {
		    padding: 0;
		    width: 44px;
		    height: 44px !important;
		    min-height: 44px !important;
		    border-radius: 50%;
		    gap: 0;
		  }
		  .buynow-widget-container.is-review-page .buynow-widget-text {
		    display: none;
		  }
		  .buynow-widget-container.is-review-page .buynow-icon {
		    transform: none;
		  }
		}
		`;
		const BuyNowWidget = () => {
			const lang = useLang();
			const t = (id) => getWidgetTranslation(lang, id);
			const location = useLocation();
			const navigate = useNavigate();
			const [isScrolled, setIsScrolled] = useState(false);
			const [isFooterVisible, setIsFooterVisible] = useState(false);
			const { totalCount } = useBasket();
			const isReviewPage = location.pathname === "/review";
			useEffect(() => {
				const handleScroll = () => {
					const scrollY = window.scrollY;
					let isAtBottom = false;
					const footer = document.querySelector("footer");
					if (footer) {
						const footerRect = footer.getBoundingClientRect();
						if (footerRect.top <= window.innerHeight - 60) {
							isAtBottom = true;
						}
					} else {
						isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100;
					}
					setIsScrolled(scrollY >= 10);
					setIsFooterVisible(isAtBottom);
				};
				window.addEventListener("scroll", handleScroll);
				handleScroll();
				return () => window.removeEventListener("scroll", handleScroll);
			}, [location.pathname]);
			const hiddenPaths = [
				"/login",
				"/fortune",
				"/basket",
				"/profile",
				"/sessions",
				"/promos",
				"/order",
				"/orders",
				"/rules",
				"/terms",
				"/error"
			];
			if (hiddenPaths.includes(location.pathname) || location.pathname.startsWith("/admin") || location.pathname.startsWith("/cashbox")) {
				return null;
			}
			const isVisible = isScrolled && !isFooterVisible;
			return /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("style", null, buyNowStyles), /* @__PURE__ */ __h("div", { className: `buynow-widget-container ${isVisible ? "visible" : ""} ${isReviewPage ? "is-review-page" : ""}` }, /* @__PURE__ */ __h("button", {
				className: "buynow-widget",
				onClick: () => navigate("/basket"),
				"aria-label": t("widget_buynow_cart"),
				"data-id": "widget_buynow_cart"
			}, /* @__PURE__ */ __h("div", { className: "buynow-icon-wrapper" }, /* @__PURE__ */ __h("img", {
				src: cartAnimated,
				alt: "Cart",
				className: "buynow-icon"
			}), totalCount > 0 && /* @__PURE__ */ __h("span", {
				key: totalCount,
				className: "cart-badge"
			}, totalCount)), /* @__PURE__ */ __h("span", {
				className: "buynow-widget-text",
				"data-id": "widget_buynow_cart"
			}, t("widget_buynow_cart"))), isReviewPage && /* @__PURE__ */ __h("button", {
				className: "buynow-widget review-widget-btn",
				onClick: () => window.dispatchEvent(new CustomEvent("open-write-review-modal")),
				"aria-label": t("widget_buynow_write_review"),
				"data-id": "widget_buynow_write_review"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				width: "18",
				height: "18",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				className: "review-widget-icon"
			}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })), /* @__PURE__ */ __h("span", {
				className: "buynow-widget-text",
				"data-id": "widget_buynow_write_review"
			}, t("widget_buynow_write_review")))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return BuyNowWidget; } });
	});
	//#endregion

	//#region components/Elements/FortuneWidget.js
	__define("components/Elements/FortuneWidget.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect } = __imp_0;
		const { useLocation, useNavigate } = __require("utils/router.js");
		const fortuneWheel = "/assets/icons/fortune-wheel.svg";
		const { useAuth } = __require("context/AuthContext.js");
		const { useLang } = __require("utils/useLang.js");
		const { getWidgetTranslation } = __require("components/Elements/Lang.js");
		const fortuneStyles = `
		.fortune-widget-container {
		  position: fixed;
		  bottom: 30px;
		  left: 30px;
		  z-index: 9999;
		  display: flex;
		  align-items: center;
		  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		  opacity: 0;
		  pointer-events: none;
		  transform: translateY(20px) scale(0.8);
		}
		body.mobile-menu-open .fortune-widget-container {
		  opacity: 0 !important;
		  pointer-events: none !important;
		}
		.fortune-widget-container.visible {
		  opacity: 1;
		  pointer-events: auto;
		  transform: translateY(0) scale(1);
		}
		@media (max-width: 768px) {
		  .fortune-widget-container {
		    bottom: 20px;
		    left: 20px;
		  }
		}
		.fortune-tooltip {
		  position: absolute;
		  left: calc(100% + 15px);
		  background: rgba(24, 3, 9, 0.9);
		  backdrop-filter: blur(16px);
		  -webkit-backdrop-filter: blur(16px);
		  border: 1px solid rgba(197, 160, 89, 0.4);
		  padding: 12px 18px;
		  border-radius: 12px 12px 12px 0;
		  color: #fff;
		  font-size: 0.9rem;
		  font-weight: 500;
		  white-space: nowrap;
		  opacity: 0;
		  visibility: hidden;
		  transform: translate(-15px, -50px) scale(0.9);
		  pointer-events: none;
		  box-shadow: 0 0 14px rgba(197, 160, 89, 0.16), 0 6px 20px rgba(0, 0, 0, 0.4);
		}
		.fortune-widget-container:hover .fortune-tooltip {
		  visibility: visible;
		  animation: fortuneTooltipPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
		}
		@keyframes fortuneTooltipPop {
		  0% {
		    opacity: 0;
		    transform: translate(-15px, -50px) scale(0.9);
		  }
		  100% {
		    opacity: 1;
		    transform: translate(0, -50px) scale(1);
		  }
		}
		.fortune-widget {
		  width: 65px;
		  height: 65px;
		  border-radius: 50%;
		  background: rgba(24, 3, 9, 0.88);
		  backdrop-filter: blur(16px);
		  -webkit-backdrop-filter: blur(16px);
		  border: 1px solid rgba(197, 160, 89, 0.42);
		  box-shadow: 0 0 14px rgba(197, 160, 89, 0.18), 0 0 30px rgba(197, 160, 89, 0.08), 0 6px 20px rgba(0, 0, 0, 0.4);
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  cursor: pointer;
		  transition: all 0.3s ease;
		}
		.fortune-widget img {
		  width: 40px;
		  height: 40px;
		}
		.fortune-widget:hover {
		  transform: scale(1.12) translateY(-5px);
		  background: rgba(36, 5, 13, 0.96);
		  border-color: rgba(223, 194, 136, 0.7);
		  box-shadow: 0 0 20px rgba(197, 160, 89, 0.32), 0 0 40px rgba(197, 160, 89, 0.14), 0 8px 24px rgba(0, 0, 0, 0.5);
		}
		.fortune-widget:active {
		  transform: scale(0.95);
		}
		@media (max-width: 768px) {
		  .fortune-widget {
		    width: 55px;
		    height: 55px;
		  }
		  .fortune-widget img {
		    width: 34px;
		    height: 34px;
		  }
		}
		`;
		const FortuneWidget = () => {
			const lang = useLang();
			const t = (id) => getWidgetTranslation(lang, id);
			const location = useLocation();
			const navigate = useNavigate();
			const { isAuthenticated } = useAuth();
			const [isScrolled, setIsScrolled] = useState(false);
			const [isFooterVisible, setIsFooterVisible] = useState(false);
			useEffect(() => {
				const handleScroll = () => {
					const scrollY = window.scrollY;
					let isAtBottom = false;
					const footer = document.querySelector("footer");
					if (footer) {
						const footerRect = footer.getBoundingClientRect();
						if (footerRect.top <= window.innerHeight - 60) {
							isAtBottom = true;
						}
					} else {
						isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100;
					}
					setIsScrolled(scrollY >= 10);
					setIsFooterVisible(isAtBottom);
				};
				window.addEventListener("scroll", handleScroll);
				handleScroll();
				return () => window.removeEventListener("scroll", handleScroll);
			}, [location.pathname]);
			const hiddenPaths = [
				"/login",
				"/fortune",
				"/basket",
				"/profile",
				"/sessions",
				"/promos",
				"/order",
				"/orders",
				"/rules",
				"/terms",
				"/error"
			];
			if (hiddenPaths.includes(location.pathname) || location.pathname.startsWith("/admin") || location.pathname.startsWith("/cashbox")) {
				return null;
			}
			const isVisible = isScrolled && !isFooterVisible;
			const handleFortuneClick = () => {
				if (isAuthenticated) {
					navigate("/fortune");
				} else {
					navigate("/login");
				}
			};
			return /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("style", null, fortuneStyles), /* @__PURE__ */ __h("div", { className: `fortune-widget-container ${isVisible ? "visible" : ""}` }, /* @__PURE__ */ __h("button", {
				className: "fortune-widget",
				"aria-label": t("widget_fortune_aria"),
				"data-id": "widget_fortune_aria",
				onClick: handleFortuneClick
			}, /* @__PURE__ */ __h("img", {
				src: fortuneWheel,
				alt: "Fortune"
			})), /* @__PURE__ */ __h("span", {
				className: "fortune-tooltip",
				"data-id": "widget_fortune_tooltip"
			}, t("widget_fortune_tooltip"))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return FortuneWidget; } });
	});
	//#endregion

	//#region routes/AppRoutes.js
	__define("routes/AppRoutes.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { Suspense, lazy, useEffect } = __imp_0;
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const { BrowserRouter: Router, Routes, Route, Navigate, useLocation } = __require("utils/router.js");
		const { AnimatePresence } = __require("utils/motion.js");
		const { loadPage } = __require("utils/pageLoader.js");
		const Home = lazy(() => loadPage("home", null));
		const Catalog = lazy(() => loadPage("catalog", null));
		const Auth = lazy(() => loadPage("auth", null));
		const GoogleAuth = lazy(() => loadPage("google-auth", null));
		const Fortune = lazy(() => loadPage("fortune", null));
		const Profile = lazy(() => loadPage("profile", null));
		const Promos = lazy(() => loadPage("promos", null));
		const Sessions = lazy(() => loadPage("sessions", null));
		const Order = lazy(() => loadPage("order", null));
		const Orders = lazy(() => loadPage("orders", null));
		const Addresses = lazy(() => loadPage("addresses", null));
		const PaymentMethods = lazy(() => loadPage("payment-methods", null));
		const UserReviews = lazy(() => loadPage("user-reviews", null));
		const Basket = lazy(() => loadPage("basket", null));
		const AdminLogin = lazy(() => loadPage("admin-login", null));
		const Dashboard = lazy(() => loadPage("admin-dashboard", null));
		const AdminProducts = lazy(() => loadPage("admin-products", null));
		const AdminOrders = lazy(() => loadPage("admin-orders", null));
		const Users = lazy(() => loadPage("admin-users", null));
		const Database = lazy(() => loadPage("admin-database", null));
		const AdminReviews = lazy(() => loadPage("admin-reviews", null));
		const AdminPromos = lazy(() => loadPage("admin-promos", null));
		const AdminNewsletter = lazy(() => loadPage("admin-newsletter", null));
		const AdminLogs = lazy(() => loadPage("admin-logs", null));
		const AdminFooter = lazy(() => loadPage("admin-footer", null));
		const Cashbox = lazy(() => loadPage("cashbox", null));
		const CashboxHistory = lazy(() => loadPage("cashbox-history", null));
		const __imp_1 = __require("routes/ProtectedRoute.js");
		const ProtectedRoute = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("routes/ProfileSecurityGuard.js");
		const ProfileSecurityGuard = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const __imp_3 = __require("routes/AdminProtectedRoute.js");
		const AdminProtectedRoute = __imp_3.default !== undefined ? __imp_3.default : __imp_3;
		const __imp_4 = __require("routes/CashboxProtectedRoute.js");
		const CashboxProtectedRoute = __imp_4.default !== undefined ? __imp_4.default : __imp_4;
		const ErrorPage = lazy(() => loadPage("error-page", null));
		const Rules = lazy(() => loadPage("rules", null));
		const Reviews = lazy(() => loadPage("reviews", null));
		const __imp_5 = __require("components/Elements/ScrollToTop.js");
		const ScrollToTop = __imp_5.default !== undefined ? __imp_5.default : __imp_5;
		const __imp_6 = __require("components/Elements/SupportWidget.js");
		const SupportWidget = __imp_6.default !== undefined ? __imp_6.default : __imp_6;
		const __imp_7 = __require("components/Elements/BuyNowWidget.js");
		const BuyNowWidget = __imp_7.default !== undefined ? __imp_7.default : __imp_7;
		const __imp_8 = __require("components/Elements/FortuneWidget.js");
		const FortuneWidget = __imp_8.default !== undefined ? __imp_8.default : __imp_8;
		const { AuthProvider } = __require("context/AuthContext.js");
		const { AdminAuthProvider } = __require("context/AdminAuthContext.js");
		const { BasketProvider } = __require("context/BasketContext.js");
		const { ProfileSecurityProvider } = __require("context/ProfileSecurityContext.js");
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

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return AppRoutes; } });
	});
	//#endregion

	//#region components/Elements/ErrorBoundary.js
	__define("components/Elements/ErrorBoundary.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
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
						backgroundImage: "radial-gradient(circle at top right, rgba(197, 160, 89, 0.15) 0%, transparent 50%), radial-gradient(circle at bottom left, #24050d 0%, #4a0e1c 100%)",
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
							background: "#c5a059",
							color: "#fff",
							fontWeight: 600,
							fontSize: "14px",
							cursor: "pointer",
							transition: "background 0.2s",
							fontFamily: "inherit"
						},
						onMouseOver: (e) => e.target.style.background = "#d4b475",
						onMouseOut: (e) => e.target.style.background = "#c5a059"
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

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return ErrorBoundary; } });
	});
	//#endregion

	//#region App.js
	__define("App.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const __imp_1 = __require("routes/AppRoutes.js");
		const AppRoutes = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/Elements/ErrorBoundary.js");
		const ErrorBoundary = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		function App() {
			return /* @__PURE__ */ __h(ErrorBoundary, null, /* @__PURE__ */ __h("div", { className: "app-container" }, /* @__PURE__ */ __h(AppRoutes, null)));
		}

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return App; } });
	});
	//#endregion

	//#region components/Footer/AppDownloadBanner.js
	__define("components/Footer/AppDownloadBanner.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useMemo, useState, useEffect, useRef } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const { useLang } = __require("utils/useLang.js");
		const summerModel = "/assets/images/footer_image_summer.png";
		const winterModel = "/assets/images/footer_image_winter.png";
		const addIcon = "/assets/icons/add.svg";
		const isWinterSeason = () => {
			const month = new Date().getMonth();
			return month >= 9 || month <= 2;
		};
		const BANNER_CONTENT = {
			ru: {
				title: "Скачай приложение — забери кофе в подарок!",
				features: [
					{
						step: "1",
						title: "1. Скачай приложение",
						desc: "Доступно на iOS и Android",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}, /* @__PURE__ */ __h("rect", {
							x: "5",
							y: "2",
							width: "14",
							height: "20",
							rx: "3",
							ry: "3"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "18",
							x2: "12.01",
							y2: "18"
						}), /* @__PURE__ */ __h("polyline", { points: "9 9 12 12 15 9" }), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "6",
							x2: "12",
							y2: "12"
						}))
					},
					{
						step: "2",
						title: "2. Крути Колесо Фортуны",
						desc: "Выигрывай подарки каждый день",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}, /* @__PURE__ */ __h("circle", {
							cx: "12",
							cy: "12",
							r: "10"
						}), /* @__PURE__ */ __h("circle", {
							cx: "12",
							cy: "12",
							r: "3"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "2",
							x2: "12",
							y2: "5"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "19",
							x2: "12",
							y2: "22"
						}), /* @__PURE__ */ __h("line", {
							x1: "2",
							y1: "12",
							x2: "5",
							y2: "12"
						}), /* @__PURE__ */ __h("line", {
							x1: "19",
							y1: "12",
							x2: "22",
							y2: "12"
						}), /* @__PURE__ */ __h("line", {
							x1: "4.93",
							y1: "4.93",
							x2: "7.05",
							y2: "7.05"
						}), /* @__PURE__ */ __h("line", {
							x1: "16.95",
							y1: "16.95",
							x2: "19.07",
							y2: "19.07"
						}), /* @__PURE__ */ __h("line", {
							x1: "4.93",
							y1: "19.07",
							x2: "7.05",
							y2: "16.95"
						}), /* @__PURE__ */ __h("line", {
							x1: "16.95",
							y1: "7.05",
							x2: "19.07",
							y2: "4.93"
						}))
					},
					{
						step: "3",
						title: "3. Забирай призы и кэшбэк",
						desc: "До 20% с каждой чашки кофе",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}, /* @__PURE__ */ __h("polyline", { points: "20 12 20 22 4 22 4 12" }), /* @__PURE__ */ __h("rect", {
							x: "2",
							y: "7",
							width: "20",
							height: "5"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "22",
							x2: "12",
							y2: "7"
						}), /* @__PURE__ */ __h("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }), /* @__PURE__ */ __h("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }))
					}
				],
				appStore: {
					subtitle: "Скачать",
					title: "App Store"
				},
				googlePlay: {
					subtitle: "Скачать",
					title: "Google Play"
				}
			},
			az: {
				title: "Tətbiqi yüklə — hədiyyə qəhvə qazan!",
				features: [
					{
						step: "1",
						title: "1. Tətbiqi yüklə",
						desc: "iOS və Android üçün əlçatandır",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}, /* @__PURE__ */ __h("rect", {
							x: "5",
							y: "2",
							width: "14",
							height: "20",
							rx: "3",
							ry: "3"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "18",
							x2: "12.01",
							y2: "18"
						}), /* @__PURE__ */ __h("polyline", { points: "9 9 12 12 15 9" }), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "6",
							x2: "12",
							y2: "12"
						}))
					},
					{
						step: "2",
						title: "2. Bəxt Çarxını fırlat",
						desc: "Hər gün yeni hədiyyələr qazan",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}, /* @__PURE__ */ __h("circle", {
							cx: "12",
							cy: "12",
							r: "10"
						}), /* @__PURE__ */ __h("circle", {
							cx: "12",
							cy: "12",
							r: "3"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "2",
							x2: "12",
							y2: "5"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "19",
							x2: "12",
							y2: "22"
						}), /* @__PURE__ */ __h("line", {
							x1: "2",
							y1: "12",
							x2: "5",
							y2: "12"
						}), /* @__PURE__ */ __h("line", {
							x1: "19",
							y1: "12",
							x2: "22",
							y2: "12"
						}), /* @__PURE__ */ __h("line", {
							x1: "4.93",
							y1: "4.93",
							x2: "7.05",
							y2: "7.05"
						}), /* @__PURE__ */ __h("line", {
							x1: "16.95",
							y1: "16.95",
							x2: "19.07",
							y2: "19.07"
						}), /* @__PURE__ */ __h("line", {
							x1: "4.93",
							y1: "19.07",
							x2: "7.05",
							y2: "16.95"
						}), /* @__PURE__ */ __h("line", {
							x1: "16.95",
							y1: "7.05",
							x2: "19.07",
							y2: "4.93"
						}))
					},
					{
						step: "3",
						title: "3. Mükafatlar və keşbek qazan",
						desc: "Hər fincandan 20%-dək keşbek",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}, /* @__PURE__ */ __h("polyline", { points: "20 12 20 22 4 22 4 12" }), /* @__PURE__ */ __h("rect", {
							x: "2",
							y: "7",
							width: "20",
							height: "5"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "22",
							x2: "12",
							y2: "7"
						}), /* @__PURE__ */ __h("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }), /* @__PURE__ */ __h("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }))
					}
				],
				appStore: {
					subtitle: "Yüklə",
					title: "App Store"
				},
				googlePlay: {
					subtitle: "Yüklə",
					title: "Google Play"
				}
			},
			en: {
				title: "Download the app — get a free coffee!",
				features: [
					{
						step: "1",
						title: "1. Download the app",
						desc: "Available for iOS & Android",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}, /* @__PURE__ */ __h("rect", {
							x: "5",
							y: "2",
							width: "14",
							height: "20",
							rx: "3",
							ry: "3"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "18",
							x2: "12.01",
							y2: "18"
						}), /* @__PURE__ */ __h("polyline", { points: "9 9 12 12 15 9" }), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "6",
							x2: "12",
							y2: "12"
						}))
					},
					{
						step: "2",
						title: "2. Spin Fortune Wheel",
						desc: "Win fresh prizes every day",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}, /* @__PURE__ */ __h("circle", {
							cx: "12",
							cy: "12",
							r: "10"
						}), /* @__PURE__ */ __h("circle", {
							cx: "12",
							cy: "12",
							r: "3"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "2",
							x2: "12",
							y2: "5"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "19",
							x2: "12",
							y2: "22"
						}), /* @__PURE__ */ __h("line", {
							x1: "2",
							y1: "12",
							x2: "5",
							y2: "12"
						}), /* @__PURE__ */ __h("line", {
							x1: "19",
							y1: "12",
							x2: "22",
							y2: "12"
						}), /* @__PURE__ */ __h("line", {
							x1: "4.93",
							y1: "4.93",
							x2: "7.05",
							y2: "7.05"
						}), /* @__PURE__ */ __h("line", {
							x1: "16.95",
							y1: "16.95",
							x2: "19.07",
							y2: "19.07"
						}), /* @__PURE__ */ __h("line", {
							x1: "4.93",
							y1: "19.07",
							x2: "7.05",
							y2: "16.95"
						}), /* @__PURE__ */ __h("line", {
							x1: "16.95",
							y1: "7.05",
							x2: "19.07",
							y2: "4.93"
						}))
					},
					{
						step: "3",
						title: "3. Get rewards & cashback",
						desc: "Up to 20% on every order",
						icon: /* @__PURE__ */ __h("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}, /* @__PURE__ */ __h("polyline", { points: "20 12 20 22 4 22 4 12" }), /* @__PURE__ */ __h("rect", {
							x: "2",
							y: "7",
							width: "20",
							height: "5"
						}), /* @__PURE__ */ __h("line", {
							x1: "12",
							y1: "22",
							x2: "12",
							y2: "7"
						}), /* @__PURE__ */ __h("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }), /* @__PURE__ */ __h("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }))
					}
				],
				appStore: {
					subtitle: "Download",
					title: "App Store"
				},
				googlePlay: {
					subtitle: "Get it on",
					title: "Google Play"
				}
			}
		};
		const AppDownloadBanner = () => {
			const currentLang = useLang() || "ru";
			const content = useMemo(() => {
				return BANNER_CONTENT[currentLang] || BANNER_CONTENT.ru;
			}, [currentLang]);
			const [isMobile, setIsMobile] = useState(() => {
				if (typeof window !== "undefined") {
					return window.innerWidth <= 900;
				}
				return false;
			});
			useEffect(() => {
				const handleResize = () => {
					setIsMobile(window.innerWidth <= 900);
				};
				window.addEventListener("resize", handleResize);
				return () => window.removeEventListener("resize", handleResize);
			}, []);
			const featureRefs = useRef([]);
			const [marqueeState, setMarqueeState] = useState(null);
			const handleFeatureClick = (e, idx) => {
				e.stopPropagation();
				if (marqueeState && marqueeState.index === idx) {
					return;
				}
				const cardEl = featureRefs.current[idx];
				if (!cardEl) return;
				const descEl = cardEl.querySelector(".feature-desc");
				const titleEl = cardEl.querySelector(".feature-title");
				const descOverflows = descEl ? descEl.scrollWidth > descEl.clientWidth + 1 : false;
				const titleOverflows = titleEl ? titleEl.scrollWidth > titleEl.clientWidth + 1 : false;
				if (descOverflows || titleOverflows) {
					const descWidth = descEl ? descEl.scrollWidth : 0;
					const titleWidth = titleEl ? titleEl.scrollWidth : 0;
					const descDuration = Math.max(5, Math.min(14, Math.round((descWidth + 36) / 35)));
					const titleDuration = Math.max(5, Math.min(14, Math.round((titleWidth + 36) / 35)));
					setMarqueeState({
						index: idx,
						descOverflow: descOverflows,
						titleOverflow: titleOverflows,
						descDuration,
						titleDuration
					});
				} else {
					setMarqueeState(null);
				}
			};
			useEffect(() => {
				if (!marqueeState) return;
				const handleClickOutside = (e) => {
					const activeCard = featureRefs.current[marqueeState.index];
					if (activeCard && !activeCard.contains(e.target)) {
						setMarqueeState(null);
					}
				};
				const timer = setTimeout(() => {
					document.addEventListener("click", handleClickOutside);
				}, 0);
				return () => {
					clearTimeout(timer);
					document.removeEventListener("click", handleClickOutside);
				};
			}, [marqueeState]);
			useEffect(() => {
				setMarqueeState(null);
			}, [currentLang]);
			const [isVisible, setIsVisible] = useState(() => {
				try {
					const hiddenUntil = localStorage.getItem("rednest_app_banner_hidden_until");
					if (hiddenUntil) {
						const time = parseInt(hiddenUntil, 10);
						if (!isNaN(time) && Date.now() < time) {
							return false;
						}
					}
				} catch {
					return true;
				}
				return true;
			});
			const handleDismiss = (e) => {
				e.stopPropagation();
				try {
					const hideUntil = Date.now() + 24 * 60 * 60 * 1e3;
					localStorage.setItem("rednest_app_banner_hidden_until", hideUntil.toString());
				} catch {}
				setIsVisible(false);
			};
			const isWinter = isWinterSeason();
			const modelImg = isWinter ? winterModel : summerModel;
			const modelAlt = isWinter ? "Süfrano Winter Coffee App" : "Süfrano Summer Coffee App";
			return /* @__PURE__ */ __h(AnimatePresence, null, isVisible && /* @__PURE__ */ __h(motion.section, {
				className: "rednest-app-banner",
				initial: {
					opacity: 0,
					y: 35
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: -25,
					scale: .96,
					height: 0,
					marginTop: 0,
					marginBottom: 0,
					transition: {
						duration: .4,
						ease: "easeInOut"
					}
				},
				transition: {
					duration: .6,
					ease: "easeOut"
				}
			}, /* @__PURE__ */ __h("div", { className: "banner-inner" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "banner-close-btn",
				onClick: handleDismiss,
				"aria-label": "Close"
			}, /* @__PURE__ */ __h("img", {
				src: addIcon,
				alt: "",
				className: "banner-close-icon"
			})), /* @__PURE__ */ __h("div", { className: "banner-ambient-glow" }), !isMobile && /* @__PURE__ */ __h("div", { className: "banner-model-col" }, /* @__PURE__ */ __h("div", { className: "model-glow-ring" }), /* @__PURE__ */ __h("img", {
				src: modelImg,
				alt: modelAlt,
				className: "model-img",
				loading: "lazy"
			})), /* @__PURE__ */ __h("div", { className: "banner-center-col" }, /* @__PURE__ */ __h("h3", { className: "banner-title" }, content.title), /* @__PURE__ */ __h("div", { className: "banner-features-track" }, content.features.map((feature, idx) => {
				const isCardActive = marqueeState?.index === idx;
				const isDescMarquee = isCardActive && marqueeState.descOverflow;
				const isTitleMarquee = isCardActive && marqueeState.titleOverflow;
				return /* @__PURE__ */ __h(motion.div, {
					key: idx,
					ref: (el) => {
						featureRefs.current[idx] = el;
					},
					className: `banner-feature-card ${isCardActive ? "is-marquee-active" : ""}`,
					onClick: (e) => handleFeatureClick(e, idx),
					initial: {
						opacity: 0,
						x: -20
					},
					whileInView: {
						opacity: 1,
						x: 0
					},
					viewport: { once: true },
					transition: {
						duration: .5,
						delay: .08 * (idx + 1),
						ease: "easeOut"
					},
					animate: { x: [
						0,
						8,
						0
					] },
					transitionRepeat: {
						repeat: Infinity,
						duration: 4 + idx * .7,
						ease: "easeInOut"
					},
					whileHover: {
						x: 12,
						scale: 1.015,
						transition: { duration: .2 }
					}
				}, /* @__PURE__ */ __h("div", { className: "feature-icon-box" }, feature.icon), /* @__PURE__ */ __h("div", { className: "feature-text" }, /* @__PURE__ */ __h("span", {
					className: `feature-title ${isTitleMarquee ? "is-marquee" : ""}`,
					title: feature.title
				}, isTitleMarquee ? /* @__PURE__ */ __h("span", {
					className: "marquee-track",
					style: { animationDuration: `${marqueeState.titleDuration}s` }
				}, /* @__PURE__ */ __h("span", { className: "marquee-item" }, feature.title), /* @__PURE__ */ __h("span", {
					className: "marquee-item",
					"aria-hidden": "true"
				}, feature.title)) : feature.title), /* @__PURE__ */ __h("span", {
					className: `feature-desc ${isDescMarquee ? "is-marquee" : ""}`,
					title: feature.desc
				}, isDescMarquee ? /* @__PURE__ */ __h("span", {
					className: "marquee-track",
					style: { animationDuration: `${marqueeState.descDuration}s` }
				}, /* @__PURE__ */ __h("span", { className: "marquee-item" }, feature.desc), /* @__PURE__ */ __h("span", {
					className: "marquee-item",
					"aria-hidden": "true"
				}, feature.desc)) : feature.desc)));
			}))), /* @__PURE__ */ __h("div", { className: "banner-stores-col" }, /* @__PURE__ */ __h("a", {
				href: "https://apps.apple.com",
				target: "_blank",
				rel: "noopener noreferrer",
				className: "store-btn apple-btn",
				"aria-label": "Download Süfrano App on App Store"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				className: "store-icon",
				fill: "currentColor"
			}, /* @__PURE__ */ __h("path", { d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.03-.49 2.65-1.24z" })), /* @__PURE__ */ __h("div", { className: "store-text" }, /* @__PURE__ */ __h("span", { className: "store-sub" }, content.appStore.subtitle), /* @__PURE__ */ __h("span", { className: "store-name" }, content.appStore.title))), /* @__PURE__ */ __h("a", {
				href: "https://play.google.com",
				target: "_blank",
				rel: "noopener noreferrer",
				className: "store-btn google-btn",
				"aria-label": "Download Süfrano App on Google Play"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				className: "store-icon",
				fill: "currentColor"
			}, /* @__PURE__ */ __h("path", { d: "M3.609 1.814L13.793 12 3.61 22.186c-.365-.32-.61-.795-.61-1.35V3.164c0-.555.245-1.03.61-1.35zm11.242 11.244l2.128 2.127-11.83 6.786 9.702-8.913zm0-2.116L4.747 2.03l11.83 6.784-2.126 2.128zm1.06 1.058l3.15 1.807c.883.506.883 1.332 0 1.838l-3.15 1.808-1.92-1.92 1.92-1.733z" })), /* @__PURE__ */ __h("div", { className: "store-text" }, /* @__PURE__ */ __h("span", { className: "store-sub" }, content.googlePlay.subtitle), /* @__PURE__ */ __h("span", { className: "store-name" }, content.googlePlay.title)))))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return AppDownloadBanner; } });
	});
	//#endregion

	//#region utils/footerData.js
	__define("utils/footerData.js", function (exports, __require, module) {
		const { useState, useEffect } = __require("utils/runtime.js");
		const { API_URL } = __require("utils/config.js");
		const { useLang, getStoredLanguage } = __require("utils/useLang.js");
		const STORAGE_KEY = "rednest_footer_cache";
		const loadStoredCache = () => {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				return raw ? JSON.parse(raw) : null;
			} catch {
				return null;
			}
		};
		let cachedFooterData = loadStoredCache();
		let pendingFooterPromise = null;
		const listeners = new Set();
		const getLanguageContent = (data, lang) => {
			if (!data) return null;
			if (lang === "en") {
				return data.footerEN || data.FooterEN || null;
			}
			if (lang === "az") {
				return data.footerAZ || data.FooterAZ || null;
			}
			return data.footerRU || data.FooterRU || null;
		};
		const getSocialMediaLinks = (data, lang) => {
			if (!data) return {
				instagramUrl: "",
				tiktokUrl: "",
				whatsappUrl: ""
			};
			const currentLang = lang || getStoredLanguage();
			const activeContent = getLanguageContent(data, currentLang);
			const sm = activeContent?.socialMedia || activeContent?.SocialMedia;
			const smAZ = data.footerAZ?.socialMedia || data.footerAZ?.SocialMedia || data.FooterAZ?.socialMedia || data.FooterAZ?.SocialMedia;
			const smRU = data.footerRU?.socialMedia || data.footerRU?.SocialMedia || data.FooterRU?.socialMedia || data.FooterRU?.SocialMedia;
			const smEN = data.footerEN?.socialMedia || data.footerEN?.SocialMedia || data.FooterEN?.socialMedia || data.FooterEN?.SocialMedia;
			const rawInstagram = sm?.instagram || sm?.Instagram || smAZ?.instagram || smAZ?.Instagram || smRU?.instagram || smRU?.Instagram || smEN?.instagram || smEN?.Instagram || "";
			const rawTikTok = sm?.tikTok || sm?.tiktok || sm?.TikTok || smAZ?.tikTok || smAZ?.tiktok || smAZ?.TikTok || smRU?.tikTok || smRU?.tiktok || smRU?.TikTok || smEN?.tikTok || smEN?.tiktok || smEN?.TikTok || "";
			const rawWhatsApp = sm?.whatsApp || sm?.whatsapp || sm?.WhatsApp || smAZ?.whatsApp || smAZ?.whatsapp || smAZ?.WhatsApp || smRU?.whatsApp || smRU?.whatsapp || smRU?.WhatsApp || smEN?.whatsApp || smEN?.whatsapp || smEN?.WhatsApp || "";
			const normalizeUrl = (url, type) => {
				if (!url) return "";
				const trimmed = String(url).trim();
				if (!trimmed) return "";
				if (type === "whatsapp") {
					if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("//")) {
						return trimmed;
					}
					const digits = trimmed.replace(/[^\d]/g, "");
					return digits ? `https://wa.me/${digits}` : trimmed;
				}
				if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("//")) {
					return `https://${trimmed}`;
				}
				return trimmed;
			};
			return {
				instagramUrl: normalizeUrl(rawInstagram, "instagram"),
				tiktokUrl: normalizeUrl(rawTikTok, "tiktok"),
				whatsappUrl: normalizeUrl(rawWhatsApp, "whatsapp")
			};
		};
		const fetchFooterData = async () => {
			if (pendingFooterPromise) return pendingFooterPromise;
			pendingFooterPromise = fetch(`${API_URL}/api/footer`, { headers: { "Accept": "application/json" } }).then((res) => {
				if (!res.ok) throw new Error("Failed to fetch footer");
				return res.json();
			}).then((data) => {
				if (data) {
					cachedFooterData = data;
					try {
						localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
					} catch {}
					listeners.forEach((cb) => {
						try {
							cb(data);
						} catch {}
					});
				}
				pendingFooterPromise = null;
				return data;
			}).catch(() => {
				pendingFooterPromise = null;
				return cachedFooterData;
			});
			return pendingFooterPromise;
		};
		const useFooterData = () => {
			const lang = useLang();
			const [data, setData] = useState(() => cachedFooterData);
			useEffect(() => {
				let isMounted = true;
				const handleUpdate = (updated) => {
					if (isMounted) setData(updated);
				};
				listeners.add(handleUpdate);
				fetchFooterData().then((res) => {
					if (isMounted && res) {
						setData(res);
					}
				});
				return () => {
					isMounted = false;
					listeners.delete(handleUpdate);
				};
			}, []);
			const activeContent = getLanguageContent(data, lang);
			const { instagramUrl, tiktokUrl, whatsappUrl } = getSocialMediaLinks(data, lang);
			return {
				footerData: data,
				activeContent,
				instagramUrl,
				tiktokUrl,
				whatsappUrl,
				language: lang
			};
		};

		Object.defineProperty(exports, "getLanguageContent", { enumerable: true, get: function () { return getLanguageContent; } });
		Object.defineProperty(exports, "getSocialMediaLinks", { enumerable: true, get: function () { return getSocialMediaLinks; } });
		Object.defineProperty(exports, "fetchFooterData", { enumerable: true, get: function () { return fetchFooterData; } });
		Object.defineProperty(exports, "useFooterData", { enumerable: true, get: function () { return useFooterData; } });
		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return useFooterData; } });
	});
	//#endregion

	//#region components/Footer/Footer.js
	__define("components/Footer/Footer.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect } = __imp_0;
		const { motion } = __require("utils/motion.js");
		const { Link } = __require("utils/router.js");
		const __imp_1 = __require("components/Footer/AppDownloadBanner.js");
		const AppDownloadBanner = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const logo = "/assets/icons/rednest_logo.png";
		const getBakuYear = () => {
			try {
				return new Intl.DateTimeFormat("en-US", {
					timeZone: "Asia/Baku",
					year: "numeric"
				}).format(new Date());
			} catch {
				return new Date(Date.now() + 4 * 60 * 60 * 1e3).getUTCFullYear().toString();
			}
		};
		const { setStoredLanguage } = __require("utils/useLang.js");
		const { useFooterData } = __require("utils/footerData.js");
		const Footer = () => {
			const currentYear = getBakuYear();
			const { activeContent, instagramUrl, tiktokUrl, whatsappUrl, language } = useFooterData();
			const handleLanguageChange = (newLang) => {
				setStoredLanguage(newLang);
			};
			const description = activeContent?.description || activeContent?.Description || "";
			const quickLinksTitle = activeContent?.quickLinksTitle || activeContent?.QuickLinksTitle || "";
			const contactUsTitle = activeContent?.contactUsTitle || activeContent?.ContactUsTitle || "";
			const termsOfUseTitle = activeContent?.termsOfUseTitle || activeContent?.TermsOfUseTitle || "";
			const copyrightText = activeContent?.copyrightText || activeContent?.CopyrightText || "";
			const quickLinks = activeContent?.quickLinks || activeContent?.QuickLinks || [];
			const contactUs = activeContent?.contactUs || activeContent?.ContactUs || {};
			const address = contactUs.address || contactUs.Address || "";
			const phone = contactUs.phone || contactUs.Phone || "";
			const email = contactUs.email || contactUs.Email || "";
			return /* @__PURE__ */ __h(motion.footer, {
				className: "footer",
				initial: {
					opacity: 0,
					y: 50
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .1
				},
				transition: { duration: .6 }
			}, /* @__PURE__ */ __h("div", { className: "footer-content" }, /* @__PURE__ */ __h("div", { className: "footer-top" }, /* @__PURE__ */ __h("div", { className: "footer-col brand-col" }, /* @__PURE__ */ __h("div", { className: "footer-brand" }, /* @__PURE__ */ __h("img", {
				src: logo,
				alt: "Süfrano Logo",
				className: "footer-logo"
			}), /* @__PURE__ */ __h("span", null, "Süfrano")), description && /* @__PURE__ */ __h("p", { className: "brand-desc" }, description), /* @__PURE__ */ __h("div", { className: "social-links" }, instagramUrl && /* @__PURE__ */ __h("a", {
				href: instagramUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "social-link",
				"aria-label": "Instagram"
			}, /* @__PURE__ */ __h("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("rect", {
				x: "2",
				y: "2",
				width: "20",
				height: "20",
				rx: "5",
				ry: "5"
			}), /* @__PURE__ */ __h("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }), /* @__PURE__ */ __h("line", {
				x1: "17.5",
				y1: "6.5",
				x2: "17.51",
				y2: "6.5"
			})), /* @__PURE__ */ __h("span", null, "Instagram")), tiktokUrl && /* @__PURE__ */ __h("a", {
				href: tiktokUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "social-link",
				"aria-label": "TikTok"
			}, /* @__PURE__ */ __h("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" })), /* @__PURE__ */ __h("span", null, "TikTok")), whatsappUrl && /* @__PURE__ */ __h("a", {
				href: whatsappUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "social-link",
				"aria-label": "WhatsApp"
			}, /* @__PURE__ */ __h("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" })), /* @__PURE__ */ __h("span", null, "WhatsApp")))), /* @__PURE__ */ __h("div", { className: "footer-col links-col" }, quickLinksTitle && /* @__PURE__ */ __h("h4", null, quickLinksTitle), /* @__PURE__ */ __h("ul", null, quickLinks.map((item, index) => /* @__PURE__ */ __h("li", { key: index }, /* @__PURE__ */ __h(Link, { to: item.link || item.Link || "/" }, item.title || item.Title))))), /* @__PURE__ */ __h("div", { className: "footer-col contact-col" }, contactUsTitle && /* @__PURE__ */ __h("h4", null, contactUsTitle), /* @__PURE__ */ __h("ul", null, address && /* @__PURE__ */ __h("li", null, /* @__PURE__ */ __h("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "16",
				height: "16",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "10",
				r: "3"
			})), /* @__PURE__ */ __h("span", null, address)), phone && /* @__PURE__ */ __h("li", null, /* @__PURE__ */ __h("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "16",
				height: "16",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })), /* @__PURE__ */ __h("span", null, phone)), email && /* @__PURE__ */ __h("li", null, /* @__PURE__ */ __h("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "16",
				height: "16",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ __h("polyline", { points: "22,6 12,13 2,6" })), /* @__PURE__ */ __h("span", null, email))))), /* @__PURE__ */ __h(AppDownloadBanner, null), /* @__PURE__ */ __h("div", { className: "footer-bottom" }, /* @__PURE__ */ __h("div", { className: "language-switcher" }, /* @__PURE__ */ __h("select", {
				"aria-label": "Select language",
				value: language,
				onChange: (e) => handleLanguageChange(e.target.value)
			}, /* @__PURE__ */ __h("option", { value: "ru" }, "Русский"), /* @__PURE__ */ __h("option", { value: "en" }, "English"), /* @__PURE__ */ __h("option", { value: "az" }, "Azərbaycan"))), /* @__PURE__ */ __h("p", { className: "copyright" }, "© ", currentYear, " Süfrano", copyrightText ? `. ${copyrightText}` : ""), termsOfUseTitle && /* @__PURE__ */ __h("div", { className: "terms-link" }, /* @__PURE__ */ __h(Link, { to: "/rules" }, termsOfUseTitle)))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Footer; } });
	});
	//#endregion

	//#region components/Elements/LogoutModal.js
	__define("components/Elements/LogoutModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const { useLang } = __require("utils/useLang.js");
		const { getWidgetTranslation } = __require("components/Elements/Lang.js");
		const LogoutModal = ({ isOpen, onClose, onConfirm, loading, title, text, confirmText }) => {
			const lang = useLang();
			const t = (id) => getWidgetTranslation(lang, id);
			const displayTitle = title || t("modal_logout_title");
			const displayText = text || t("modal_logout_text");
			const displayConfirmText = confirmText || t("modal_logout_confirm");
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose: () => !loading && onClose(),
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "rednest-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "rednest-modal__icon rednest-modal__icon--danger" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), /* @__PURE__ */ __h("polyline", { points: "16 17 21 12 16 7" }), /* @__PURE__ */ __h("line", {
				x1: "21",
				y1: "12",
				x2: "9",
				y2: "12"
			}))), /* @__PURE__ */ __h("h3", { className: "rednest-modal__title" }, displayTitle), /* @__PURE__ */ __h("p", { className: "rednest-modal__text" }, displayText), /* @__PURE__ */ __h("div", { className: "rednest-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "rednest-modal__btn rednest-modal__btn--cancel",
				onClick: onClose,
				disabled: loading
			}, t("modal_logout_cancel")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "rednest-modal__btn rednest-modal__btn--danger",
				onClick: onConfirm,
				disabled: loading
			}, loading ? /* @__PURE__ */ __h("span", { style: {
				display: "flex",
				alignItems: "center",
				gap: "8px",
				color: "#d4b475"
			} }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Loading",
				style: {
					width: "18px",
					height: "18px"
				}
			}), t("modal_delete_deleting")) : displayConfirmText))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return LogoutModal; } });
	});
	//#endregion

	//#region utils/avatar.js
	__define("utils/avatar.js", function (exports, __require, module) {
		const DEFAULT_USER_AVATAR = "/assets/images/user_default_avatar.webp";

		function isDefaultAvatarUrl(url) {
			if (typeof url !== "string") return true;
			const trimmed = url.trim();
			if (!trimmed) return true;
			const pathWithoutQuery = trimmed.split(/[?#]/)[0].toLowerCase();
			return pathWithoutQuery === DEFAULT_USER_AVATAR || pathWithoutQuery.endsWith("/user_default_avatar.webp");
		}

		function getUserAvatarUrl(url) {
			return isDefaultAvatarUrl(url) ? DEFAULT_USER_AVATAR : url.trim();
		}

		function handleAvatarError(e) {
			const img = e?.currentTarget;
			if (!img || isDefaultAvatarUrl(img.getAttribute("src")) || isDefaultAvatarUrl(img.src)) return;
			img.src = DEFAULT_USER_AVATAR;
		}

		Object.defineProperty(exports, "DEFAULT_USER_AVATAR", { enumerable: true, get: function () { return DEFAULT_USER_AVATAR; } });
		Object.defineProperty(exports, "isDefaultAvatarUrl", { enumerable: true, get: function () { return isDefaultAvatarUrl; } });
		Object.defineProperty(exports, "getUserAvatarUrl", { enumerable: true, get: function () { return getUserAvatarUrl; } });
		Object.defineProperty(exports, "handleAvatarError", { enumerable: true, get: function () { return handleAvatarError; } });
	});
	//#endregion

	//#region components/Elements/UserNavPills.js
	__define("components/Elements/UserNavPills.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useRef, useEffect } = __imp_0;
		const { Link, useNavigate } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { useProfileSecurity } = __require("context/ProfileSecurityContext.js");
		const { useLang } = __require("utils/useLang.js");
		const { getWidgetTranslation } = __require("components/Elements/Lang.js");
		const __imp_1 = __require("components/Elements/LogoutModal.js");
		const LogoutModal = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const { isAllowedCashboxRole } = __require("routes/CashboxProtectedRoute.js");
		const { getUserAvatarUrl, handleAvatarError } = __require("utils/avatar.js");
		const UserNavPills = ({ onMenuClose }) => {
			const { user, authLoading, logout, isAuthenticated } = useAuth();
			const { isProfileUnlocked, requireProfileAccess, lockProfile } = useProfileSecurity();
			const lang = useLang();
			const t = (id) => getWidgetTranslation(lang, id);
			const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
			const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
			const [isLoggingOut, setIsLoggingOut] = useState(false);
			const userMenuRef = useRef(null);
			const navigate = useNavigate();
			useEffect(() => {
				const handleClickOutside = (event) => {
					if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
						setIsUserMenuOpen(false);
					}
				};
				if (isUserMenuOpen) {
					document.addEventListener("mousedown", handleClickOutside);
				}
				return () => {
					document.removeEventListener("mousedown", handleClickOutside);
				};
			}, [isUserMenuOpen]);
			const handleLogout = async () => {
				setIsLoggingOut(true);
				try {
					lockProfile();
					await logout();
					setIsLogoutModalOpen(false);
					setIsUserMenuOpen(false);
					if (onMenuClose) onMenuClose();
					navigate("/");
				} catch (err) {
					console.error("Logout failed:", err);
				} finally {
					setIsLoggingOut(false);
				}
			};
			if (authLoading) {
				return /* @__PURE__ */ __h("div", {
					className: "user-nav-loader-capsule",
					"aria-label": "Loading"
				}, /* @__PURE__ */ __h("img", {
					src: loaderIcon,
					alt: "Loading",
					className: "user-nav-loader-spinner"
				}));
			}
			if (!user && !isAuthenticated) {
				return /* @__PURE__ */ __h(Link, {
					to: "/login",
					className: "cta-btn sm user-nav-login-btn",
					onClick: () => onMenuClose && onMenuClose()
				}, t("user_nav_login"));
			}
			const avatarUrl = getUserAvatarUrl(user?.profilePictureUrl || user?.ProfilePictureUrl);
			const userName = user?.name || user?.Name || "User";
			const rawBalance = user?.balance ?? user?.Balance ?? 0;
			const formattedBalance = Number(rawBalance || 0).toFixed(2);
			const userRole = user?.role || user?.Role;
			const canAccessCashbox = isAllowedCashboxRole(userRole);
			const handleProfileClick = () => {
				setIsUserMenuOpen(false);
				if (onMenuClose) onMenuClose();
			};
			return /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h("div", {
				className: "user-nav-capsule-wrapper",
				ref: userMenuRef
			}, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "user-nav-capsule",
				onClick: () => setIsUserMenuOpen((prev) => !prev),
				"aria-expanded": isUserMenuOpen,
				"aria-haspopup": "true"
			}, /* @__PURE__ */ __h("div", {
				className: "user-nav-capsule__avatar",
				title: `Profile - ${userName}`
			}, /* @__PURE__ */ __h("img", {
				src: avatarUrl,
				alt: userName,
				className: "user-nav-capsule__avatar-img",
				onError: handleAvatarError
			})), /* @__PURE__ */ __h("span", { className: "user-nav-capsule__info-row" }, /* @__PURE__ */ __h("span", { className: "user-nav-capsule__name" }, userName), /* @__PURE__ */ __h("span", { className: "user-nav-capsule__divider" }), /* @__PURE__ */ __h("span", { className: "user-nav-capsule__balance" }, /* @__PURE__ */ __h("span", { className: "user-nav-capsule__balance-amount" }, formattedBalance), /* @__PURE__ */ __h("span", { className: "user-nav-capsule__balance-symbol" }, "₼")), /* @__PURE__ */ __h("svg", {
				className: `user-nav-capsule__chevron ${isUserMenuOpen ? "open" : ""}`,
				viewBox: "0 0 24 24",
				width: "14",
				height: "14",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("polyline", { points: "6 9 12 15 18 9" })))), /* @__PURE__ */ __h("div", { className: `user-nav-capsule__dropdown-wrapper ${isUserMenuOpen ? "open" : ""}` }, /* @__PURE__ */ __h("div", { className: "user-nav-capsule__dropdown" }, /* @__PURE__ */ __h("div", { className: "user-nav-capsule__dropdown-inner" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "user-nav-capsule__dropdown-item",
				onClick: () => {
					setIsUserMenuOpen(false);
					if (onMenuClose) onMenuClose();
					if (isProfileUnlocked) {
						navigate("/profile");
					} else {
						requireProfileAccess("/profile");
					}
				}
			}, t("user_nav_profile")), /* @__PURE__ */ __h(Link, {
				to: "/promos",
				className: "user-nav-capsule__dropdown-item",
				onClick: handleProfileClick
			}, t("user_nav_promos")), /* @__PURE__ */ __h(Link, {
				to: "/admin/dashboard",
				className: "user-nav-capsule__dropdown-item",
				onClick: handleProfileClick
			}, t("user_nav_admin")), canAccessCashbox && /* @__PURE__ */ __h(Link, {
				to: "/cashbox",
				className: "user-nav-capsule__dropdown-item",
				onClick: handleProfileClick
			}, t("user_nav_pos")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "user-nav-capsule__dropdown-item",
				onClick: () => {
					setIsUserMenuOpen(false);
					if (onMenuClose) onMenuClose();
					setIsLogoutModalOpen(true);
				}
			}, t("user_nav_logout")))))), /* @__PURE__ */ __h(LogoutModal, {
				isOpen: isLogoutModalOpen,
				onClose: () => setIsLogoutModalOpen(false),
				onConfirm: handleLogout,
				loading: isLoggingOut
			}));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return UserNavPills; } });
	});
	//#endregion

	//#region components/Elements/Navbar.js
	__define("components/Elements/Navbar.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect } = __imp_0;
		const { Link, useLocation } = __require("utils/router.js");
		const logo = "/assets/icons/rednest_logo.png";
		const __imp_1 = __require("components/Elements/UserNavPills.js");
		const UserNavPills = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const { useLang } = __require("utils/useLang.js");
		const { useFooterData } = __require("utils/footerData.js");
		const { getWidgetTranslation } = __require("components/Elements/Lang.js");
		const Navbar = () => {
			const lang = useLang();
			const t = (id) => getWidgetTranslation(lang, id);
			const { instagramUrl, tiktokUrl, whatsappUrl } = useFooterData();
			const [isMenuOpen, setIsMenuOpen] = useState(false);
			const [isScrolled, setIsScrolled] = useState(false);
			const location = useLocation();
			const isHome = location.pathname === "/" || location.pathname === "/home";
			useEffect(() => {
				const handleScroll = () => {
					setIsScrolled(window.scrollY > 20);
				};
				handleScroll();
				window.addEventListener("scroll", handleScroll, { passive: true });
				return () => window.removeEventListener("scroll", handleScroll);
			}, []);
			useEffect(() => {
				if (isMenuOpen) {
					document.body.classList.add("mobile-menu-open");
				} else {
					document.body.classList.remove("mobile-menu-open");
				}
				return () => {
					document.body.classList.remove("mobile-menu-open");
				};
			}, [isMenuOpen]);
			useEffect(() => {
				setIsMenuOpen(false);
			}, [location.pathname]);
			const handleCloseMenu = () => setIsMenuOpen(false);
			return /* @__PURE__ */ __h("header", { className: `home-header ${isHome ? "home-header--home" : ""} ${isScrolled ? "home-header--scrolled" : "home-header--transparent"}` }, /* @__PURE__ */ __h("div", { className: "logo-container" }, /* @__PURE__ */ __h(Link, {
				to: "/",
				onClick: handleCloseMenu,
				style: {
					textDecoration: "none",
					display: "flex",
					alignItems: "center",
					gap: "0.5rem"
				}
			}, /* @__PURE__ */ __h("img", {
				src: logo,
				alt: "Süfrano Logo",
				className: "logo"
			}), /* @__PURE__ */ __h("span", { className: "brand-name" }, "Süfrano"))), /* @__PURE__ */ __h("div", { className: `nav-menu ${isMenuOpen ? "open" : ""}` }, /* @__PURE__ */ __h(UserNavPills, { onMenuClose: handleCloseMenu }), /* @__PURE__ */ __h("nav", { className: "nav-links" }, /* @__PURE__ */ __h(Link, {
				to: "/",
				className: `nav-link ${location.pathname === "/" ? "active" : ""}`,
				onClick: handleCloseMenu,
				"data-id": "nav_home"
			}, /* @__PURE__ */ __h("svg", {
				className: "nav-link__icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" }), /* @__PURE__ */ __h("path", { d: "M9 21V12h6v9" })), /* @__PURE__ */ __h("span", null, t("nav_home"))), /* @__PURE__ */ __h(Link, {
				to: "/catalog",
				className: `nav-link ${location.pathname === "/catalog" ? "active" : ""}`,
				onClick: handleCloseMenu,
				"data-id": "nav_menu"
			}, /* @__PURE__ */ __h("svg", {
				className: "nav-link__icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("rect", {
				x: "3",
				y: "3",
				width: "7",
				height: "7",
				rx: "1"
			}), /* @__PURE__ */ __h("rect", {
				x: "14",
				y: "3",
				width: "7",
				height: "7",
				rx: "1"
			}), /* @__PURE__ */ __h("rect", {
				x: "3",
				y: "14",
				width: "7",
				height: "7",
				rx: "1"
			}), /* @__PURE__ */ __h("rect", {
				x: "14",
				y: "14",
				width: "7",
				height: "7",
				rx: "1"
			})), /* @__PURE__ */ __h("span", null, t("nav_menu"))), /* @__PURE__ */ __h(Link, {
				to: "/review",
				className: `nav-link ${location.pathname === "/review" || location.pathname === "/reviews" ? "active" : ""}`,
				onClick: handleCloseMenu,
				"data-id": "nav_review"
			}, /* @__PURE__ */ __h("svg", {
				className: "nav-link__icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" })), /* @__PURE__ */ __h("span", null, t("nav_review")))), /* @__PURE__ */ __h("div", { className: "nav-menu__footer" }, /* @__PURE__ */ __h("div", { className: "nav-menu__social" }, instagramUrl && /* @__PURE__ */ __h("a", {
				href: instagramUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				"aria-label": "Instagram"
			}, /* @__PURE__ */ __h("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("rect", {
				x: "2",
				y: "2",
				width: "20",
				height: "20",
				rx: "5",
				ry: "5"
			}), /* @__PURE__ */ __h("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }), /* @__PURE__ */ __h("line", {
				x1: "17.5",
				y1: "6.5",
				x2: "17.51",
				y2: "6.5"
			}))), tiktokUrl && /* @__PURE__ */ __h("a", {
				href: tiktokUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				"aria-label": "TikTok"
			}, /* @__PURE__ */ __h("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" }))), whatsappUrl && /* @__PURE__ */ __h("a", {
				href: whatsappUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				"aria-label": "WhatsApp"
			}, /* @__PURE__ */ __h("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" })))))), /* @__PURE__ */ __h("div", {
				className: `menu-overlay ${isMenuOpen ? "open" : ""}`,
				onClick: handleCloseMenu
			}), /* @__PURE__ */ __h("button", {
				className: "mobile-menu-btn",
				onClick: () => setIsMenuOpen(!isMenuOpen),
				"aria-label": "Toggle menu"
			}, isMenuOpen ? "✕" : "☰"));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Navbar; } });
	});
	//#endregion

	//#region components/Elements/FitText.js
	__define("components/Elements/FitText.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useRef, useState, useLayoutEffect, useEffect } = __imp_0;
		const FitText = ({ children, as: Component = "span", maxFontSize = 1.2, minFontSize = .7, unit = "rem", className = "", style = {}, ...props }) => {
			const containerRef = useRef(null);
			const textRef = useRef(null);
			const [currentFontSize, setCurrentFontSize] = useState(maxFontSize);
			const calculateSize = () => {
				const container = containerRef.current;
				const text = textRef.current;
				if (!container || !text) return;
				const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
				const maxPx = unit === "rem" ? maxFontSize * rootFontSize : maxFontSize;
				const minPx = unit === "rem" ? minFontSize * rootFontSize : minFontSize;
				const availableWidth = container.clientWidth;
				if (availableWidth <= 0) return;
				text.style.fontSize = `${maxPx}px`;
				text.style.display = "inline-block";
				text.style.whiteSpace = "nowrap";
				const naturalWidth = text.scrollWidth;
				if (naturalWidth <= availableWidth) {
					setCurrentFontSize(maxFontSize);
					text.style.fontSize = `${maxPx}px`;
				} else {
					const ratio = availableWidth / naturalWidth;
					const calculatedPx = maxPx * ratio;
					const clampedPx = Math.max(minPx, Math.min(maxPx, Math.floor(calculatedPx * .98)));
					const finalValue = unit === "rem" ? clampedPx / rootFontSize : clampedPx;
					setCurrentFontSize(finalValue);
					text.style.fontSize = `${clampedPx}px`;
				}
			};
			useLayoutEffect(() => {
				calculateSize();
			}, [
				children,
				maxFontSize,
				minFontSize,
				unit
			]);
			useEffect(() => {
				const container = containerRef.current;
				if (!container) return;
				const resizeObserver = new ResizeObserver(() => {
					calculateSize();
				});
				resizeObserver.observe(container);
				if (document.fonts) {
					document.fonts.ready.then(calculateSize).catch(() => {});
				}
				return () => {
					resizeObserver.disconnect();
				};
			}, [
				children,
				maxFontSize,
				minFontSize,
				unit
			]);
			return /* @__PURE__ */ __h(Component, {
				ref: containerRef,
				className: `fit-text-container ${className}`,
				style: {
					display: "block",
					width: "100%",
					minWidth: 0,
					overflow: "hidden",
					...style
				},
				...props
			}, /* @__PURE__ */ __h("span", {
				ref: textRef,
				style: {
					display: "block",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
					fontSize: `${currentFontSize}${unit}`,
					lineHeight: "1.25",
					transition: "font-size 0.1s ease-out"
				}
			}, children));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return FitText; } });
	});
	//#endregion

	//#region utils/useSequentialImageLoader.js
	__define("utils/useSequentialImageLoader.js", function (exports, __require, module) {
		const { useState, useEffect, useRef, useCallback } = __require("utils/runtime.js");
		const globalLoadedSet = new Set();
		function useSequentialImageLoader(items = []) {
			const [loadedMap, setLoadedMap] = useState(() => {
				const initial = {};
				if (Array.isArray(items)) {
					items.forEach((item) => {
						if (item && item.id && globalLoadedSet.has(item.id)) {
							initial[item.id] = true;
						}
					});
				}
				return initial;
			});
			const activeImgRef = useRef(null);
			const isRunningRef = useRef(false);
			const itemsRef = useRef(items);
			itemsRef.current = items;
			const markLoaded = useCallback((id) => {
				if (!id) return;
				globalLoadedSet.add(id);
				setLoadedMap((prev) => {
					if (prev[id]) return prev;
					return {
						...prev,
						[id]: true
					};
				});
			}, []);
			useEffect(() => {
				if (!items || items.length === 0) return;
				items.forEach((item) => {
					if (item && item.id && globalLoadedSet.has(item.id)) {
						markLoaded(item.id);
					}
				});
				let isMounted = true;
				function processQueue() {
					if (!isMounted) {
						isRunningRef.current = false;
						return;
					}
					const currentList = itemsRef.current || [];
					const nextItem = currentList.find((item) => item && item.id && (item.images?.image || item.imageUrl) && !globalLoadedSet.has(item.id));
					if (!nextItem) {
						isRunningRef.current = false;
						activeImgRef.current = null;
						return;
					}
					const itemImgSrc = nextItem.images?.image || nextItem.imageUrl;
					isRunningRef.current = true;
					const img = new Image();
					activeImgRef.current = img;
					let resolved = false;
					const done = () => {
						if (resolved) return;
						resolved = true;
						globalLoadedSet.add(nextItem.id);
						if (isMounted) {
							setLoadedMap((prev) => ({
								...prev,
								[nextItem.id]: true
							}));
							setTimeout(() => {
								if (isMounted) {
									processQueue();
								}
							}, 20);
						} else {
							isRunningRef.current = false;
						}
					};
					img.onload = done;
					img.onerror = done;
					img.src = itemImgSrc;
					if (img.complete) {
						done();
					}
				}
				if (!isRunningRef.current) {
					processQueue();
				}
				return () => {
					isMounted = false;
					isRunningRef.current = false;
					if (activeImgRef.current) {
						activeImgRef.current.onload = null;
						activeImgRef.current.onerror = null;
					}
				};
			}, [items, markLoaded]);
			loadedMap.markLoaded = markLoaded;
			return loadedMap;
		}

		Object.defineProperty(exports, "useSequentialImageLoader", { enumerable: true, get: function () { return useSequentialImageLoader; } });
		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return useSequentialImageLoader; } });
	});
	//#endregion

	//#region components/PublicPages/Auth/Lang.js
	__define("components/PublicPages/Auth/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"auth_back_home": "На главную",
				"auth_hero_title": "Пробудите ваши чувства",
				"auth_hero_subtitle": "Оцените богатый, насыщенный вкус наших фирменных кофейных блендов. Присоединяйтесь к нам сегодня.",
				"auth_step_login_title": "Добро пожаловать в Süfrano",
				"auth_step_login_subtitle": "Введите email и пароль для входа или создания нового аккаунта.",
				"auth_step_2fa_title": "Двухфакторная аутентификация",
				"auth_step_2fa_subtitle": "Мы отправили 4-значный код подтверждения на ваш email",
				"auth_step_name_title": "Добро пожаловать в Süfrano",
				"auth_step_name_subtitle": "Пожалуйста, укажите ваше имя, чтобы мы знали, как к вам обращаться.",
				"auth_label_email": "Электронная почта",
				"auth_placeholder_email": "name@example.com",
				"auth_label_password": "Пароль",
				"auth_placeholder_password": "Ваш пароль",
				"auth_label_name": "Ваше имя",
				"auth_placeholder_name": "Например: Фарид",
				"auth_agree_terms": "Я принимаю",
				"auth_terms_link": "Условия использования и политику",
				"auth_btn_continue": "Продолжить",
				"auth_btn_verify": "Подтвердить код",
				"auth_btn_complete": "Завершить регистрацию",
				"auth_btn_resend_wait": "Отправить снова через",
				"auth_btn_resend": "Отправить код повторно",
				"auth_or_divider": "или",
				"auth_btn_google": "Продолжить с Google",
				"auth_err_agree": "Пожалуйста, подтвердите согласие с правилами использования.",
				"auth_err_email": "Пожалуйста, введите корректный адрес электронной почты.",
				"auth_err_password": "Пожалуйста, введите пароль.",
				"auth_err_code_length": "Пожалуйста, введите полный 4-значный код.",
				"auth_err_name": "Пожалуйста, введите ваше имя.",
				"google_connecting_title": "Подключение к Google",
				"google_connecting_desc": "Выполняется вход в аккаунт, пожалуйста, подождите...",
				"google_not_found_title": "Аккаунт не найден",
				"google_not_found_desc": "Аккаунт с таким Google адресом не найден. Пожалуйста, сначала зарегистрируйтесь.",
				"google_not_found_btn": "Перейти к регистрации / входу",
				"google_error_title": "Ошибка авторизации",
				"google_error_btn": "Вернуться ко входу",
				"auth_step_forgot_title": "Сброс пароля",
				"auth_step_forgot_subtitle": "Введите ваш email, чтобы получить 7-значный код для сброса пароля.",
				"auth_step_reset_title": "Установка нового пароля",
				"auth_step_reset_subtitle": "Введите 7-значный код из письма и ваш новый пароль.",
				"auth_label_new_password": "Новый пароль",
				"auth_placeholder_new_password": "Минимум 6 символов",
				"auth_label_confirm_password": "Подтвердите пароль",
				"auth_placeholder_confirm_password": "Повторите новый пароль",
				"auth_btn_send_code": "Отправить код",
				"auth_btn_reset_password": "Сбросить пароль",
				"auth_btn_back_login": "Назад ко входу",
				"auth_err_code_7_length": "Пожалуйста, введите полный 7-значный код.",
				"auth_err_password_mismatch": "Пароли не совпадают.",
				"auth_err_password_short": "Пароль должен содержать минимум 6 символов.",
				"auth_reset_code_sent": "7-значный код отправлен на вашу почту.",
				"auth_reset_success": "Пароль успешно изменен!"
			},
			en: {
				"auth_back_home": "Back to Home",
				"auth_hero_title": "Awaken Your Senses",
				"auth_hero_subtitle": "Experience the rich, bold flavors of our premium coffee blends. Join our community today.",
				"auth_step_login_title": "Welcome to Süfrano",
				"auth_step_login_subtitle": "Enter your email and password to log in or create a new account.",
				"auth_step_2fa_title": "Two-Factor Authentication",
				"auth_step_2fa_subtitle": "Enter the 4-digit verification code sent to your email",
				"auth_step_name_title": "Welcome to Süfrano",
				"auth_step_name_subtitle": "Please tell us what we should call you.",
				"auth_label_email": "Email Address",
				"auth_placeholder_email": "name@example.com",
				"auth_label_password": "Password",
				"auth_placeholder_password": "Your password",
				"auth_label_name": "Your Name",
				"auth_placeholder_name": "e.g. Alex",
				"auth_agree_terms": "I agree to the",
				"auth_terms_link": "Terms of Use & Privacy Policy",
				"auth_btn_continue": "Continue",
				"auth_btn_verify": "Verify Code",
				"auth_btn_complete": "Complete Registration",
				"auth_btn_resend_wait": "Resend code in",
				"auth_btn_resend": "Resend code",
				"auth_or_divider": "or",
				"auth_btn_google": "Continue with Google",
				"auth_err_agree": "Please agree to the Terms of Use to proceed.",
				"auth_err_email": "Please enter a valid email address.",
				"auth_err_password": "Please enter your password.",
				"auth_err_code_length": "Please enter the full 4-digit code.",
				"auth_err_name": "Please enter your name.",
				"google_connecting_title": "Connecting to Google",
				"google_connecting_desc": "Authenticating your account, please wait a moment...",
				"google_not_found_title": "Account Not Found",
				"google_not_found_desc": "Account not found. Please register first before signing in with Google.",
				"google_not_found_btn": "Go to Registration / Login",
				"google_error_title": "Authentication Failed",
				"google_error_btn": "Back to Login",
				"auth_step_forgot_title": "Reset Password",
				"auth_step_forgot_subtitle": "Enter your email to receive a 7-digit password reset code.",
				"auth_step_reset_title": "Set New Password",
				"auth_step_reset_subtitle": "Enter the 7-digit code sent to your email and your new password.",
				"auth_label_new_password": "New Password",
				"auth_placeholder_new_password": "At least 6 characters",
				"auth_label_confirm_password": "Confirm Password",
				"auth_placeholder_confirm_password": "Repeat new password",
				"auth_btn_send_code": "Send Reset Code",
				"auth_btn_reset_password": "Reset Password",
				"auth_btn_back_login": "Back to login",
				"auth_err_code_7_length": "Please enter the full 7-digit code.",
				"auth_err_password_mismatch": "Passwords do not match.",
				"auth_err_password_short": "Password must be at least 6 characters long.",
				"auth_reset_code_sent": "7-digit code sent to your email.",
				"auth_reset_success": "Password has been reset successfully!"
			},
			az: {
				"auth_back_home": "Ana səhifəyə",
				"auth_hero_title": "Hisslərinizi oyadın",
				"auth_hero_subtitle": "Premium qəhvə çeşidlərimizin zəngin dadını kəşf edin. Bu gün ailəmizə qoşulun.",
				"auth_step_login_title": "Süfrano-ya xoş gəlmisiniz",
				"auth_step_login_subtitle": "Daxil olmaq və ya yeni hesab yaratmaq üçün e-poçt və şifrənizi daxil edin.",
				"auth_step_2fa_title": "İki faktorlu autentifikasiya",
				"auth_step_2fa_subtitle": "E-poçtunuza göndərilən 4 rəqəmli təsdiq kodunu daxil edin",
				"auth_step_name_title": "Süfrano-ya xoş gəlmisiniz",
				"auth_step_name_subtitle": "Sizə necə müraciət edəcəyimizi bilmək üçün zəhmət olmasa adınızı qeyd edin.",
				"auth_label_email": "E-poçt ünvanı",
				"auth_placeholder_email": "ad@numune.com",
				"auth_label_password": "Şifrə",
				"auth_placeholder_password": "Şifrəniz",
				"auth_label_name": "Adınız",
				"auth_placeholder_name": "məs: Fərid",
				"auth_agree_terms": "Qəbul edirəm:",
				"auth_terms_link": "İstifadə qaydaları və gizlilik siyasəti",
				"auth_btn_continue": "Davam et",
				"auth_btn_verify": "Kodu təsdiqlə",
				"auth_btn_complete": "Qeydiyyatı tamamla",
				"auth_btn_resend_wait": "Yenidən göndər:",
				"auth_btn_resend": "Kodu yenidən göndər",
				"auth_or_divider": "və ya",
				"auth_btn_google": "Google ilə davam et",
				"auth_err_agree": "Davam etmək üçün istifadə qaydaları ilə razılaşmalısınız.",
				"auth_err_email": "Zəhmət olmasa düzgün e-poçt ünvanı daxil edin.",
				"auth_err_password": "Zəhmət olmasa şifrənizi daxil edin.",
				"auth_err_code_length": "Zəhmət olmasa 4 rəqəmli kodu tam daxil edin.",
				"auth_err_name": "Zəhmət olmasa adınızı daxil edin.",
				"google_connecting_title": "Google ilə əlaqə qurulur",
				"google_connecting_desc": "Hesabınız təsdiqlənir, zəhmət olmasa bir qədər gözləyin...",
				"google_not_found_title": "Hesab tapılmadı",
				"google_not_found_desc": "Bu Google ünvanı ilə hesab tapılmadı. Zəhmət olmasa əvvəlcə qeydiyyatdan keçin.",
				"google_not_found_btn": "Qeydiyyat / Giriş səhifəsinə keç",
				"google_error_title": "Autentifikasiya xətası",
				"google_error_btn": "Girişə qayıt",
				"auth_step_forgot_title": "Şifrənin bərpası",
				"auth_step_forgot_subtitle": "Şifrəni sıfırlamaq üçün 7 rəqəmli kodu əldə etmək üçün e-poçtunuzu daxil edin.",
				"auth_step_reset_title": "Yeni şifrənin təyini",
				"auth_step_reset_subtitle": "E-poçtunuza göndərilən 7 rəqəmli kodu və yeni şifrənizi daxil edin.",
				"auth_label_new_password": "Yeni şifrə",
				"auth_placeholder_new_password": "Ən azı 6 simvol",
				"auth_label_confirm_password": "Şifrəni təsdiqləyin",
				"auth_placeholder_confirm_password": "Yeni şifrəni təkrar edin",
				"auth_btn_send_code": "Kodu göndər",
				"auth_btn_reset_password": "Şifrəni yenilə",
				"auth_btn_back_login": "Girişə qayıt",
				"auth_err_code_7_length": "Zəhmət olmasa 7 rəqəmli kodu tam daxil edin.",
				"auth_err_password_mismatch": "Şifrələr uyğun gəlmir.",
				"auth_err_password_short": "Şifrə ən azı 6 simvoldan ibarət olmalıdır.",
				"auth_reset_code_sent": "7 rəqəmli kod e-poçtunuza göndərildi.",
				"auth_reset_success": "Şifrə uğurla yeniləndi!"
			}
		};
		const getAuthTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.az || translations.ru;
			return dict[dataId] || translations.en[dataId] || dataId;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getAuthTranslation", { enumerable: true, get: function () { return getAuthTranslation; } });
	});
	//#endregion

	//#region components/Elements/DeleteConfirmModal.js
	__define("components/Elements/DeleteConfirmModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const { useLang } = __require("utils/useLang.js");
		const { getWidgetTranslation } = __require("components/Elements/Lang.js");
		const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, title, text, confirmLabel, loading }) => {
			const lang = useLang();
			const t = (id) => getWidgetTranslation(lang, id);
			const displayTitle = title || t("modal_delete_remove");
			const displayConfirmLabel = confirmLabel || t("modal_delete_remove");
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose: () => !loading && onClose(),
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "rednest-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "rednest-modal__icon rednest-modal__icon--danger" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ __h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }), /* @__PURE__ */ __h("line", {
				x1: "10",
				y1: "11",
				x2: "10",
				y2: "17"
			}), /* @__PURE__ */ __h("line", {
				x1: "14",
				y1: "11",
				x2: "14",
				y2: "17"
			}))), /* @__PURE__ */ __h("h3", { className: "rednest-modal__title" }, displayTitle), /* @__PURE__ */ __h("p", { className: "rednest-modal__text" }, text || (itemName ? lang === "az" ? `${itemName} səbətinizdən silinsin?` : lang === "en" ? `Are you sure you want to remove ${itemName} from your basket?` : `Вы уверены, что хотите удалить ${itemName} из корзины?` : lang === "az" ? "Bu məhsulu silmək istədiyinizə əminsiniz?" : lang === "en" ? "Are you sure you want to remove this item?" : "Вы уверены, что хотите удалить этот элемент?")), /* @__PURE__ */ __h("div", { className: "rednest-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "rednest-modal__btn rednest-modal__btn--cancel",
				onClick: onClose,
				disabled: loading
			}, t("modal_delete_cancel")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "rednest-modal__btn rednest-modal__btn--danger",
				onClick: onConfirm,
				disabled: loading
			}, loading ? /* @__PURE__ */ __h("span", { style: {
				display: "flex",
				alignItems: "center",
				gap: "8px",
				color: "#d4b475"
			} }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Loading",
				style: {
					width: "18px",
					height: "18px"
				}
			}), t("modal_delete_deleting")) : displayConfirmLabel))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return DeleteConfirmModal; } });
	});
	//#endregion

	//#region components/PublicPages/Reviews/reviewsData.js
	__define("components/PublicPages/Reviews/reviewsData.js", function (exports, __require, module) {
		const REVIEW_CATEGORIES = [
			{
				id: "all",
				label: "All Reviews",
				icon: "✨"
			},
			{
				id: "Delivery",
				label: "Delivery",
				icon: "🚀"
			},
			{
				id: "Products",
				label: "Products",
				icon: "☕"
			},
			{
				id: "Service",
				label: "Service",
				icon: "⭐"
			},
			{
				id: "Staff",
				label: "Staff",
				icon: "👥"
			}
		];
		const AVATAR_GRADIENTS = [
			"linear-gradient(135deg, #c5a059, #9e7a36)",
			"linear-gradient(135deg, #c5a059, #9e7a36)",
			"linear-gradient(135deg, #ec4899, #be185d)",
			"linear-gradient(135deg, #8b5cf6, #6d28d9)",
			"linear-gradient(135deg, #10b981, #047857)",
			"linear-gradient(135deg, #3b82f6, #1d4ed8)",
			"linear-gradient(135deg, #06b6d4, #0e7490)",
			"linear-gradient(135deg, #6366f1, #4338ca)"
		];
		const getAvatarGradient = (idOrName) => {
			let hash = 0;
			const str = String(idOrName || "user");
			for (let i = 0; i < str.length; i++) {
				hash = str.charCodeAt(i) + ((hash << 5) - hash);
			}
			const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
			return AVATAR_GRADIENTS[index];
		};
		const formatBakuDateTime = (dateInput) => {
			if (!dateInput) return "—";
			try {
				if (typeof dateInput === "string") {
					const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
					if (match) {
						const [, year, month, day, hour, minute] = match;
						return `${day}.${month}.${year}, ${hour}:${minute}`;
					}
				}
				const d = new Date(dateInput);
				if (isNaN(d.getTime())) return "—";
				const day = String(d.getDate()).padStart(2, "0");
				const month = String(d.getMonth() + 1).padStart(2, "0");
				const year = d.getFullYear();
				const hour = String(d.getHours()).padStart(2, "0");
				const minute = String(d.getMinutes()).padStart(2, "0");
				return `${day}.${month}.${year}, ${hour}:${minute}`;
			} catch {
				return "—";
			}
		};
		const formatTimeAgo = (dateInput) => {
			if (!dateInput) return "Today";
			try {
				let d;
				if (typeof dateInput === "string") {
					const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):?(\d{2})?/);
					if (match) {
						const [, year, month, day, hour, minute, second] = match;
						d = Date.UTC(+year, +month - 1, +day, +hour, +minute, +(second || 0));
					}
				}
				if (!d) {
					const parsed = new Date(dateInput);
					if (isNaN(parsed.getTime())) return "Today";
					d = parsed.getTime();
				}
				const nowUtc = Date.now();
				const nowBaku = nowUtc + 4 * 36e5;
				const diffMs = Math.max(0, nowBaku - d);
				const diffSec = Math.floor(diffMs / 1e3);
				const diffMins = Math.floor(diffSec / 60);
				const diffHours = Math.floor(diffMins / 60);
				const diffDays = Math.floor(diffHours / 24);
				if (diffMins < 1) {
					return "Just now";
				}
				if (diffMins < 60) {
					return `${diffMins}m ago`;
				}
				if (diffHours < 24) {
					return `${diffHours}h ago`;
				}
				if (diffDays === 1) {
					return "Yesterday";
				}
				if (diffDays < 7) {
					return `${diffDays}d ago`;
				}
				return formatBakuDateTime(dateInput);
			} catch {
				return "Today";
			}
		};
		const normalizeLanguageCode = (langStr) => {
			if (!langStr) return "";
			const l = String(langStr).trim().toLowerCase();
			if (l.includes("ru") || l.includes("russia")) return "ru";
			if (l.includes("az") || l.includes("azerbaijan")) return "az";
			if (l.includes("en") || l.includes("english")) return "en";
			return "";
		};
		const detectCommentLanguage = (comment) => {
			if (!comment || typeof comment !== "string") return "";
			const text = comment.trim();
			if (!text) return "";
			if (/[а-яёА-ЯЁ]/.test(text)) {
				return "ru";
			}
			if (/[əıöşğçüƏIÖŞĞÇÜ]/i.test(text)) {
				return "az";
			}
			const azKeywords = /\b(cox|çox|ela|əla|dadli|dadlı|dadlidir|dadlıdır|qeseng|qəşəng|yaxsi|yaxşı|pis|sagol|sağol|sag|sağ|olun|tesekkur|təşəkkür|minnetdaram|minnətdaram|sifaris|sifariş|catdirilma|çatdırılma|baku|baki|bakı|men|mən|sen|sən|biz|siz|ve|və|amma|ancaq|ucun|üçün|hec|heç|her|hər|bir|kimi)\b/i;
			if (azKeywords.test(text)) {
				return "az";
			}
			const enKeywords = /\b(the|and|is|it|you|that|was|for|are|with|have|this|from|great|good|coffee|service|delivery|taste|delicious|fast|nice|friendly|best|place|food|drink|order)\b/i;
			if (enKeywords.test(text)) {
				return "en";
			}
			if (/^[a-zA-Z0-9\s.,!?'"()#@%&*+/:;-]+$/.test(text)) {
				return "en";
			}
			return "";
		};
		const getReviewLanguage = (review) => {
			if (!review) return "";
			const fromExplicit = normalizeLanguageCode(review.language);
			if (fromExplicit) return fromExplicit;
			return detectCommentLanguage(review.comment);
		};
		const doesReviewMatchLanguage = (review, userLang) => {
			if (!userLang) return false;
			const target = normalizeLanguageCode(userLang);
			if (!target) return false;
			return getReviewLanguage(review) === target;
		};
		const sortReviewsByLanguage = (reviewsList, userLang) => {
			if (!Array.isArray(reviewsList) || reviewsList.length <= 1) return reviewsList || [];
			const targetLang = normalizeLanguageCode(userLang);
			if (!targetLang) return reviewsList;
			const matching = [];
			const others = [];
			for (const review of reviewsList) {
				if (doesReviewMatchLanguage(review, targetLang)) {
					matching.push(review);
				} else {
					others.push(review);
				}
			}
			return [...matching, ...others];
		};

		Object.defineProperty(exports, "REVIEW_CATEGORIES", { enumerable: true, get: function () { return REVIEW_CATEGORIES; } });
		Object.defineProperty(exports, "AVATAR_GRADIENTS", { enumerable: true, get: function () { return AVATAR_GRADIENTS; } });
		Object.defineProperty(exports, "getAvatarGradient", { enumerable: true, get: function () { return getAvatarGradient; } });
		Object.defineProperty(exports, "formatBakuDateTime", { enumerable: true, get: function () { return formatBakuDateTime; } });
		Object.defineProperty(exports, "formatTimeAgo", { enumerable: true, get: function () { return formatTimeAgo; } });
		Object.defineProperty(exports, "normalizeLanguageCode", { enumerable: true, get: function () { return normalizeLanguageCode; } });
		Object.defineProperty(exports, "detectCommentLanguage", { enumerable: true, get: function () { return detectCommentLanguage; } });
		Object.defineProperty(exports, "getReviewLanguage", { enumerable: true, get: function () { return getReviewLanguage; } });
		Object.defineProperty(exports, "doesReviewMatchLanguage", { enumerable: true, get: function () { return doesReviewMatchLanguage; } });
		Object.defineProperty(exports, "sortReviewsByLanguage", { enumerable: true, get: function () { return sortReviewsByLanguage; } });
	});
	//#endregion

	//#region components/PublicPages/Reviews/Lang.js
	__define("components/PublicPages/Reviews/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"reviews_hero_title": "Отзывы",
				"reviews_hero_subtitle": "Узнайте искренние отзывы и впечатления наших гостей.",
				"reviews_count_singular": "отзыв",
				"reviews_count_few": "отзыва",
				"reviews_count_plural": "отзывов",
				"reviews_my_reviews": "Мои отзывы",
				"reviews_cat_all": "Все отзывы",
				"reviews_cat_delivery": "Доставка",
				"reviews_cat_products": "Продукция",
				"reviews_cat_service": "Сервис",
				"reviews_cat_staff": "Персонал",
				"reviews_loading": "Загрузка отзывов...",
				"reviews_empty_my_title": "Вы еще не написали отзывов",
				"reviews_empty_all_title": "Отзывов пока нет",
				"reviews_empty_my_desc": "Поделитесь впечатлениями о Süfrano после оформления заказа, чтобы помочь другим гостям!",
				"reviews_empty_all_desc": "Будьте первым, кто поделится своим отзывом о Süfrano после оформления заказа!",
				"reviews_empty_cat_desc": "В этой категории пока нет отзывов.",
				"reviews_write_btn": "Написать отзыв",
				"reviews_card_you": "Вы",
				"reviews_card_delete": "Удалить отзыв",
				"reviews_card_verified": "Подтвержденный заказ",
				"reviews_card_view_order": "Посмотреть заказ",
				"reviews_likes_singular": "лайк получен",
				"reviews_likes_plural": "лайков получено",
				"reviews_helpful": "Полезно",
				"reviews_delete_modal_title": "Удалить отзыв",
				"reviews_delete_modal_text": "Вы уверены, что хотите удалить отзыв? Вы сможете написать новый отзыв для этого заказа позже.",
				"reviews_modal_title": "Написать отзыв",
				"reviews_modal_desc": "Поделитесь впечатлениями о вашем завершенном заказе в Süfrano",
				"reviews_modal_loading_orders": "Проверка доступных заказов...",
				"reviews_modal_empty_title": "Нет доступных заказов",
				"reviews_modal_empty_desc": "Вы можете оставить отзыв только после завершения заказа со статусом «Выполнен». Каждый заказ можно оценить только один раз.",
				"reviews_modal_rating_label": "Ваша оценка",
				"reviews_rating_poor": "Плохо",
				"reviews_rating_fair": "Нормально",
				"reviews_rating_good": "Хорошо",
				"reviews_rating_very_good": "Очень хорошо",
				"reviews_rating_exceptional": "Отлично",
				"reviews_modal_category": "Категория",
				"reviews_modal_select_order": "Выберите заказ",
				"reviews_modal_choose_order": "Выберите заказ...",
				"reviews_modal_your_review": "Ваш отзыв",
				"reviews_modal_placeholder": "Поделитесь подробностями о вкусе кофе, доставке, сервисе...",
				"reviews_modal_cancel": "Отмена",
				"reviews_modal_submit": "Опубликовать отзыв",
				"reviews_modal_submitting": "Публикация...",
				"reviews_order_select_title": "Выберите выполненный заказ",
				"reviews_order_select_desc": "Выберите, какой выполненный заказ вы хотите оценить",
				"reviews_order_card_order": "Заказ"
			},
			en: {
				"reviews_hero_title": "Review",
				"reviews_hero_subtitle": "Discover authentic thoughts and stories from our coffee community.",
				"reviews_count_singular": "review",
				"reviews_count_few": "reviews",
				"reviews_count_plural": "reviews",
				"reviews_my_reviews": "My Reviews",
				"reviews_cat_all": "All Reviews",
				"reviews_cat_delivery": "Delivery",
				"reviews_cat_products": "Products",
				"reviews_cat_service": "Service",
				"reviews_cat_staff": "Staff",
				"reviews_loading": "Loading reviews...",
				"reviews_empty_my_title": "No reviews written yet",
				"reviews_empty_all_title": "No reviews found",
				"reviews_empty_my_desc": "Share your experience with Süfrano after completing an order to help fellow coffee lovers!",
				"reviews_empty_all_desc": "Be the first to share your experience with Süfrano after completing an order!",
				"reviews_empty_cat_desc": "There are currently no reviews in this category.",
				"reviews_write_btn": "Write Review",
				"reviews_card_you": "You",
				"reviews_card_delete": "Delete review",
				"reviews_card_verified": "Verified Order",
				"reviews_card_view_order": "View Order",
				"reviews_likes_singular": "like received",
				"reviews_likes_plural": "likes received",
				"reviews_helpful": "Helpful",
				"reviews_delete_modal_title": "Delete Review",
				"reviews_delete_modal_text": "Are you sure you want to delete your review? You will be able to write a new review for this order again.",
				"reviews_modal_title": "Write a Review",
				"reviews_modal_desc": "Share your experience on your completed Süfrano order",
				"reviews_modal_loading_orders": "Checking eligible orders...",
				"reviews_modal_empty_title": "No eligible orders found",
				"reviews_modal_empty_desc": "You can only write a review after your order status is marked as Complete. Each order can only be reviewed once.",
				"reviews_modal_rating_label": "Your Rating",
				"reviews_rating_poor": "Poor",
				"reviews_rating_fair": "Fair",
				"reviews_rating_good": "Good",
				"reviews_rating_very_good": "Very Good",
				"reviews_rating_exceptional": "Exceptional",
				"reviews_modal_category": "Category",
				"reviews_modal_select_order": "Select Order",
				"reviews_modal_choose_order": "Choose order...",
				"reviews_modal_your_review": "Your Review",
				"reviews_modal_placeholder": "Share details about the taste, coffee quality, delivery, staff...",
				"reviews_modal_cancel": "Cancel",
				"reviews_modal_submit": "Submit Review",
				"reviews_modal_submitting": "Submitting...",
				"reviews_order_select_title": "Select Completed Order",
				"reviews_order_select_desc": "Choose which completed order you would like to evaluate",
				"reviews_order_card_order": "Order"
			},
			az: {
				"reviews_hero_title": "Rəylər",
				"reviews_hero_subtitle": "Qəhvə icmamızın səmimi fikirlərini və hekayələrini kəşf edin.",
				"reviews_count_singular": "rəy",
				"reviews_count_few": "rəy",
				"reviews_count_plural": "rəy",
				"reviews_my_reviews": "Mənim rəylərim",
				"reviews_cat_all": "Bütün rəylər",
				"reviews_cat_delivery": "Çatdırılma",
				"reviews_cat_products": "Məhsullar",
				"reviews_cat_service": "Xidmət",
				"reviews_cat_staff": "Heyət",
				"reviews_loading": "Rəylər yüklənir...",
				"reviews_empty_my_title": "Hələ rəy yazılmayıb",
				"reviews_empty_all_title": "Rəy tapılmadı",
				"reviews_empty_my_desc": "Sifarişi tamamladıqdan sonra digər qəhvəsevərlərə kömək etmək üçün təcrübənizi bölüşün!",
				"reviews_empty_all_desc": "Sifarişi tamamladıqdan sonra Süfrano ilə təcrübənizi bölüşən ilk şəxs olun!",
				"reviews_empty_cat_desc": "Bu kateqoriyada hələlik heç bir rəy yoxdur.",
				"reviews_write_btn": "Rəy yaz",
				"reviews_card_you": "Siz",
				"reviews_card_delete": "Rəyi sil",
				"reviews_card_verified": "Təsdiqlənmiş sifariş",
				"reviews_card_view_order": "Sifarişə bax",
				"reviews_likes_singular": "bəyənmə alındı",
				"reviews_likes_plural": "bəyənmə alındı",
				"reviews_helpful": "Faydalı",
				"reviews_delete_modal_title": "Rəyi sil",
				"reviews_delete_modal_text": "Rəyinizi silmək istədiyinizdən əminsiniz? Daha sonra bu sifariş üçün yenidən rəy yaza biləcəksiniz.",
				"reviews_modal_title": "Rəy yazın",
				"reviews_modal_desc": "Tamamlanmış Süfrano sifarişiniz haqqında təəssüratlarınızı bölüşün",
				"reviews_modal_loading_orders": "Uyğun sifarişlər yoxlanılır...",
				"reviews_modal_empty_title": "Uyğun sifariş tapılmadı",
				"reviews_modal_empty_desc": "Rəyi yalnız sifarişinizin statusu «Tamamlandı» olduqdan sonra yaza bilərsiniz. Hər sifariş yalnız bir dəfə qiymətləndirilə bilər.",
				"reviews_modal_rating_label": "Sizin qiymətiniz",
				"reviews_rating_poor": "Pis",
				"reviews_rating_fair": "Kafi",
				"reviews_rating_good": "Yaxşı",
				"reviews_rating_very_good": "Çox yaxşı",
				"reviews_rating_exceptional": "Əla",
				"reviews_modal_category": "Kateqoriya",
				"reviews_modal_select_order": "Sifarişi seçin",
				"reviews_modal_choose_order": "Sifarişi seçin...",
				"reviews_modal_your_review": "Sizin rəyiniz",
				"reviews_modal_placeholder": "Qəhvənin dadı, çatdırılma və xidmət haqqında təfərrüatları bölüşün...",
				"reviews_modal_cancel": "Ləğv et",
				"reviews_modal_submit": "Rəyi göndər",
				"reviews_modal_submitting": "Göndərilir...",
				"reviews_order_select_title": "Tamamlanmış sifarişi seçin",
				"reviews_order_select_desc": "Hansı tamamlanmış sifarişi qiymətləndirmək istədiyinizi seçin",
				"reviews_order_card_order": "Sifariş"
			}
		};
		const getReviewsTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.ru;
			return dict[dataId] || translations.en[dataId] || dataId;
		};
		const getReviewCategoryLabel = (lang, catId) => {
			const normalized = (catId || "").toLowerCase();
			if (normalized === "all") return getReviewsTranslation(lang, "reviews_cat_all");
			if (normalized === "delivery") return getReviewsTranslation(lang, "reviews_cat_delivery");
			if (normalized === "products") return getReviewsTranslation(lang, "reviews_cat_products");
			if (normalized === "service") return getReviewsTranslation(lang, "reviews_cat_service");
			if (normalized === "staff") return getReviewsTranslation(lang, "reviews_cat_staff");
			return catId;
		};
		const getReviewRatingLabel = (lang, score) => {
			const round = Math.round(score);
			if (round === 1) return getReviewsTranslation(lang, "reviews_rating_poor");
			if (round === 2) return getReviewsTranslation(lang, "reviews_rating_fair");
			if (round === 3) return getReviewsTranslation(lang, "reviews_rating_good");
			if (round === 4) return getReviewsTranslation(lang, "reviews_rating_very_good");
			return getReviewsTranslation(lang, "reviews_rating_exceptional");
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getReviewsTranslation", { enumerable: true, get: function () { return getReviewsTranslation; } });
		Object.defineProperty(exports, "getReviewCategoryLabel", { enumerable: true, get: function () { return getReviewCategoryLabel; } });
		Object.defineProperty(exports, "getReviewRatingLabel", { enumerable: true, get: function () { return getReviewRatingLabel; } });
	});
	//#endregion

	//#region components/PublicPages/Reviews/OrderSelectModal.js
	__define("components/PublicPages/Reviews/OrderSelectModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { motion } = __require("utils/motion.js");
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const { formatBakuDateTime } = __require("components/PublicPages/Reviews/reviewsData.js");
		const { useLang } = __require("utils/useLang.js");
		const { getReviewsTranslation } = __require("components/PublicPages/Reviews/Lang.js");
		const OrderSelectModal = ({ isOpen, onClose, orders = [], selectedOrderId, onSelectOrder }) => {
			const lang = useLang();
			const t = (id) => getReviewsTranslation(lang, id);
			if (!isOpen) return null;
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose,
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "order-select-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "order-select-modal__close",
				onClick: onClose,
				"aria-label": "Close order selector"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("line", {
				x1: "18",
				y1: "6",
				x2: "6",
				y2: "18"
			}), /* @__PURE__ */ __h("line", {
				x1: "6",
				y1: "6",
				x2: "18",
				y2: "18"
			}))), /* @__PURE__ */ __h("div", { className: "order-select-modal__header" }, /* @__PURE__ */ __h("div", { className: "order-select-modal__icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }), /* @__PURE__ */ __h("line", {
				x1: "3",
				y1: "6",
				x2: "21",
				y2: "6"
			}), /* @__PURE__ */ __h("path", { d: "M16 10a4 4 0 0 1-8 0" }))), /* @__PURE__ */ __h("h2", {
				className: "order-select-modal__title",
				"data-id": "reviews_order_select_title"
			}, t("reviews_order_select_title")), /* @__PURE__ */ __h("p", {
				className: "order-select-modal__desc",
				"data-id": "reviews_order_select_desc"
			}, t("reviews_order_select_desc"))), /* @__PURE__ */ __h("div", { className: "order-select-modal__list" }, orders.map((order) => {
				const isSelected = order.id === selectedOrderId;
				const shortId = order.id.slice(0, 8).toUpperCase();
				const total = Number(order.totalAmount || 0).toFixed(2);
				const items = order.items || [];
				return /* @__PURE__ */ __h(motion.div, {
					key: order.id,
					className: `order-select-card ${isSelected ? "order-select-card--selected" : ""}`,
					onClick: () => {
						onSelectOrder(order.id);
						onClose();
					},
					whileHover: { scale: 1.01 },
					whileTap: { scale: .99 }
				}, /* @__PURE__ */ __h("div", { className: "order-select-card__top" }, /* @__PURE__ */ __h("div", { className: "order-select-card__id-group" }, /* @__PURE__ */ __h("span", { className: "order-select-card__id" }, t("reviews_order_card_order"), " #", shortId), /* @__PURE__ */ __h("span", {
					className: "order-select-card__date",
					title: "Time in Baku (UTC+4)"
				}, formatBakuDateTime(order.createdAt))), /* @__PURE__ */ __h("div", { className: "order-select-card__price-group" }, /* @__PURE__ */ __h("span", { className: "order-select-card__price" }, total, " ₼"), /* @__PURE__ */ __h("div", { className: `order-select-card__radio ${isSelected ? "active" : ""}` }, isSelected && /* @__PURE__ */ __h("div", { className: "order-select-card__radio-dot" })))), items.length > 0 && /* @__PURE__ */ __h("div", { className: "order-select-card__items" }, items.map((item, idx) => {
					const iconUrl = item.images?.icon || item.images?.image || item.imageUrl;
					return /* @__PURE__ */ __h("div", {
						key: idx,
						className: "order-select-card__item-chip",
						title: `${item.name} (x${item.quantity || 1})`
					}, /* @__PURE__ */ __h("div", { className: "order-select-card__item-img-wrapper" }, iconUrl ? /* @__PURE__ */ __h("img", {
						src: iconUrl,
						alt: item.name || "Product",
						className: "order-select-card__item-img"
					}) : /* @__PURE__ */ __h("span", { className: "order-select-card__item-fallback" }, "☕")), /* @__PURE__ */ __h("span", { className: "order-select-card__item-name" }, item.name || "Coffee Item"), /* @__PURE__ */ __h("span", { className: "order-select-card__item-qty" }, "x", item.quantity || 1));
				})));
			})), /* @__PURE__ */ __h("div", { className: "order-select-modal__footer" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm order-select-modal__btn",
				onClick: onClose
			}, "Done"))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return OrderSelectModal; } });
	});
	//#endregion

	//#region components/PublicPages/Reviews/WriteReviewModal.js
	__define("components/PublicPages/Reviews/WriteReviewModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect, useMemo } = __imp_0;
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const __imp_2 = __require("components/PublicPages/Reviews/OrderSelectModal.js");
		const OrderSelectModal = __imp_2.default !== undefined ? __imp_2.default : __imp_2;
		const { REVIEW_CATEGORIES, formatBakuDateTime } = __require("components/PublicPages/Reviews/reviewsData.js");
		const { fetchWithRefresh } = __require("utils/fetchWithRefresh.js");
		const { useLang } = __require("utils/useLang.js");
		const { getReviewsTranslation, getReviewCategoryLabel, getReviewRatingLabel } = __require("components/PublicPages/Reviews/Lang.js");
		const loaderIcon = "/assets/icons/loader-animated.svg";
		const loaderIconRed = "/assets/icons/loader-animated-red.svg";
		const WriteReviewModal = ({ isOpen, onClose, onSubmitReview }) => {
			const lang = useLang();
			const t = (id) => getReviewsTranslation(lang, id);
			const [rating, setRating] = useState(5);
			const [hoverRating, setHoverRating] = useState(0);
			const [category, setCategory] = useState("Delivery");
			const [comment, setComment] = useState("");
			const [eligibleOrders, setEligibleOrders] = useState([]);
			const [selectedOrderId, setSelectedOrderId] = useState("");
			const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
			const [loadingOrders, setLoadingOrders] = useState(true);
			const [error, setError] = useState("");
			const [submitting, setSubmitting] = useState(false);
			useEffect(() => {
				if (!isOpen) return;
				setRating(5);
				setHoverRating(0);
				setCategory("Delivery");
				setComment("");
				setError("");
				setSubmitting(false);
				setLoadingOrders(true);
				setIsOrderModalOpen(false);
				const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
				fetchWithRefresh(`${apiUrl}/api/reviews/eligible-orders`).then(async (res) => {
					if (res.ok) {
						const data = await res.json();
						setEligibleOrders(data || []);
						if (data && data.length > 0) {
							setSelectedOrderId(data[0].id);
						} else {
							setSelectedOrderId("");
						}
					} else {
						setEligibleOrders([]);
						setSelectedOrderId("");
					}
				}).catch(() => {
					setEligibleOrders([]);
					setSelectedOrderId("");
				}).finally(() => {
					setLoadingOrders(false);
				});
			}, [isOpen]);
			const handleClose = () => {
				if (submitting) return;
				setError("");
				setIsOrderModalOpen(false);
				onClose();
			};
			const selectedOrder = useMemo(() => {
				return eligibleOrders.find((o) => o.id === selectedOrderId) || null;
			}, [eligibleOrders, selectedOrderId]);
			const activeRating = hoverRating || rating;
			const currentLabel = getReviewRatingLabel(lang, activeRating);
			const sliderPercentage = (activeRating - 1) / 4 * 100;
			const handleSubmit = async (e) => {
				e.preventDefault();
				if (submitting) return;
				setError("");
				if (!selectedOrderId) {
					setError("Please select a completed order for this review.");
					return;
				}
				if (!comment.trim() || comment.trim().length < 5) {
					setError("Please write at least 5 characters for your review.");
					return;
				}
				if (comment.trim().length > 300) {
					setError("Review comment cannot exceed 300 characters.");
					return;
				}
				setSubmitting(true);
				try {
					const apiUrl = window.__SUFRANO_API_URL__ || "" || "";
					const response = await fetchWithRefresh(`${apiUrl}/api/reviews`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							orderId: selectedOrderId,
							category,
							rating: Number(rating),
							comment: comment.trim(),
							language: lang === "ru" ? "Russian" : lang === "az" ? "Azerbaijani" : "English"
						})
					});
					const data = await response.json();
					if (response.ok) {
						onSubmitReview(data);
						onClose();
					} else {
						setError(data.message || "Failed to submit review. Please try again.");
					}
				} catch (err) {
					setError("A network error occurred. Please try again.");
				} finally {
					setSubmitting(false);
				}
			};
			return /* @__PURE__ */ __h(__Fragment, null, /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose: handleClose,
				targetBorderRadius: "24px"
			}, /* @__PURE__ */ __h("div", {
				className: "review-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "review-modal__close",
				onClick: handleClose,
				disabled: submitting,
				"aria-label": "Close modal"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("line", {
				x1: "18",
				y1: "6",
				x2: "6",
				y2: "18"
			}), /* @__PURE__ */ __h("line", {
				x1: "6",
				y1: "6",
				x2: "18",
				y2: "18"
			}))), /* @__PURE__ */ __h("div", { className: "review-modal__header" }, /* @__PURE__ */ __h("div", { className: "review-modal__icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ __h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" }))), /* @__PURE__ */ __h("h2", {
				className: "review-modal__title",
				"data-id": "reviews_modal_title"
			}, t("reviews_modal_title")), /* @__PURE__ */ __h("p", {
				className: "review-modal__desc",
				"data-id": "reviews_modal_desc"
			}, t("reviews_modal_desc"))), loadingOrders ? /* @__PURE__ */ __h("div", { className: "review-modal__loader" }, /* @__PURE__ */ __h("img", {
				src: loaderIcon,
				alt: "Loading",
				className: "review-modal__spinner"
			}), /* @__PURE__ */ __h("span", { "data-id": "reviews_modal_loading_orders" }, t("reviews_modal_loading_orders"))) : eligibleOrders.length === 0 ? /* @__PURE__ */ __h("div", { className: "review-modal__empty-orders" }, /* @__PURE__ */ __h("div", { className: "review-modal__empty-icon" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "8",
				x2: "12",
				y2: "12"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "16",
				x2: "12.01",
				y2: "16"
			}))), /* @__PURE__ */ __h("h3", { "data-id": "reviews_modal_empty_title" }, t("reviews_modal_empty_title")), /* @__PURE__ */ __h("p", { "data-id": "reviews_modal_empty_desc" }, t("reviews_modal_empty_desc")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm review-modal__btn--close",
				onClick: handleClose,
				"data-id": "reviews_modal_cancel"
			}, t("reviews_modal_cancel"))) : /* @__PURE__ */ __h("form", {
				className: "review-modal__form",
				onSubmit: handleSubmit
			}, error && /* @__PURE__ */ __h("div", { className: "review-modal__error" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "8",
				x2: "12",
				y2: "12"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "16",
				x2: "12.01",
				y2: "16"
			})), /* @__PURE__ */ __h("span", null, error)), /* @__PURE__ */ __h("div", { className: "review-modal__field review-modal__field--rating-top" }, /* @__PURE__ */ __h("div", { className: "review-modal__rating-header" }, /* @__PURE__ */ __h("span", {
				className: "review-modal__label-title",
				"data-id": "reviews_modal_rating_label"
			}, t("reviews_modal_rating_label"), " ", /* @__PURE__ */ __h("span", { className: "review-modal__required" }, "*")), /* @__PURE__ */ __h("div", { className: "review-modal__rating-pill" }, /* @__PURE__ */ __h("span", { className: "review-modal__rating-val" }, Math.round(rating)), /* @__PURE__ */ __h("svg", {
				className: "review-modal__rating-star",
				viewBox: "0 0 24 24",
				width: "14.5",
				height: "14.5",
				fill: "#c5a059",
				stroke: "#c5a059",
				strokeWidth: "1"
			}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })), /* @__PURE__ */ __h("span", { className: "review-modal__rating-sep" }, "·"), /* @__PURE__ */ __h("span", { className: "review-modal__rating-text" }, currentLabel))), /* @__PURE__ */ __h("div", { className: "review-modal__slider-wrapper" }, /* @__PURE__ */ __h("input", {
				type: "range",
				min: "1",
				max: "5",
				step: "1",
				value: rating,
				onChange: (e) => {
					setRating(Number(e.target.value));
				},
				className: "review-modal__slider",
				style: { background: `linear-gradient(90deg, #c5a059 0%, #c5a059 ${sliderPercentage}%, rgba(255, 255, 255, 0.12) ${sliderPercentage}%)` },
				"aria-label": "Slide to adjust rating"
			}), /* @__PURE__ */ __h("div", { className: "review-modal__slider-ticks" }, /* @__PURE__ */ __h("span", {
				className: rating >= 1 ? "active" : "",
				onClick: () => setRating(1)
			}, "1"), /* @__PURE__ */ __h("span", {
				className: rating >= 2 ? "active" : "",
				onClick: () => setRating(2)
			}, "2"), /* @__PURE__ */ __h("span", {
				className: rating >= 3 ? "active" : "",
				onClick: () => setRating(3)
			}, "3"), /* @__PURE__ */ __h("span", {
				className: rating >= 4 ? "active" : "",
				onClick: () => setRating(4)
			}, "4"), /* @__PURE__ */ __h("span", {
				className: rating >= 5 ? "active" : "",
				onClick: () => setRating(5)
			}, "5")))), /* @__PURE__ */ __h("div", { className: "review-modal__row" }, /* @__PURE__ */ __h("div", { className: "review-modal__field review-modal__col" }, /* @__PURE__ */ __h("label", {
				htmlFor: "rev-category",
				"data-id": "reviews_modal_category"
			}, t("reviews_modal_category"), " ", /* @__PURE__ */ __h("span", { className: "review-modal__required" }, "*")), /* @__PURE__ */ __h("select", {
				id: "rev-category",
				value: category,
				onChange: (e) => setCategory(e.target.value),
				disabled: submitting
			}, REVIEW_CATEGORIES.filter((c) => c.id !== "all").map((c) => /* @__PURE__ */ __h("option", {
				key: c.id,
				value: c.id
			}, c.icon, " ", getReviewCategoryLabel(lang, c.id))))), /* @__PURE__ */ __h("div", { className: "review-modal__field review-modal__col" }, /* @__PURE__ */ __h("label", { "data-id": "reviews_modal_select_order" }, t("reviews_modal_select_order"), " ", /* @__PURE__ */ __h("span", { className: "review-modal__required" }, "*")), /* @__PURE__ */ __h("button", {
				type: "button",
				className: "review-modal__order-trigger",
				onClick: () => setIsOrderModalOpen(true),
				disabled: submitting,
				title: "Click to choose completed order"
			}, selectedOrder ? /* @__PURE__ */ __h("div", { className: "review-modal__order-trigger-info" }, /* @__PURE__ */ __h("span", { className: "review-modal__order-trigger-id" }, "#", selectedOrder.id.slice(0, 8).toUpperCase()), /* @__PURE__ */ __h("span", { className: "review-modal__order-trigger-price" }, Number(selectedOrder.totalAmount || 0).toFixed(2), " ₼")) : /* @__PURE__ */ __h("span", {
				className: "review-modal__order-trigger-placeholder",
				"data-id": "reviews_modal_choose_order"
			}, t("reviews_modal_choose_order")), /* @__PURE__ */ __h("svg", {
				className: "review-modal__order-trigger-chevron",
				viewBox: "0 0 24 24",
				width: "16",
				height: "16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("polyline", { points: "6 9 12 15 18 9" }))))), /* @__PURE__ */ __h("div", { className: "review-modal__field" }, /* @__PURE__ */ __h("div", { className: "review-modal__label-row" }, /* @__PURE__ */ __h("label", {
				htmlFor: "rev-comment",
				"data-id": "reviews_modal_your_review"
			}, t("reviews_modal_your_review"), " ", /* @__PURE__ */ __h("span", { className: "review-modal__required" }, "*")), /* @__PURE__ */ __h("span", { className: `review-modal__counter ${comment.length >= 300 ? "limit" : ""}` }, comment.length, "/300")), /* @__PURE__ */ __h("textarea", {
				id: "rev-comment",
				className: "review-modal__textarea--tall",
				placeholder: t("reviews_modal_placeholder"),
				"data-id": "reviews_modal_placeholder",
				value: comment,
				onChange: (e) => {
					setComment(e.target.value.slice(0, 300));
					if (error) setError("");
				},
				maxLength: 300,
				rows: 7,
				required: true,
				disabled: submitting
			})), /* @__PURE__ */ __h("div", { className: "review-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cta-btn sm review-modal__btn review-modal__btn--cancel",
				onClick: handleClose,
				disabled: submitting,
				"data-id": "reviews_modal_cancel"
			}, t("reviews_modal_cancel")), /* @__PURE__ */ __h("button", {
				type: "submit",
				className: "cta-btn sm review-modal__btn review-modal__btn--submit",
				disabled: submitting || !selectedOrderId || !comment.trim(),
				"data-id": "reviews_modal_submit"
			}, submitting ? /* @__PURE__ */ __h("span", { className: "review-btn-loader" }, /* @__PURE__ */ __h("img", {
				src: loaderIconRed,
				alt: "Submitting...",
				style: {
					width: "18px",
					height: "18px"
				}
			}), t("reviews_modal_submitting")) : t("reviews_modal_submit")))))), /* @__PURE__ */ __h(OrderSelectModal, {
				isOpen: isOrderModalOpen,
				onClose: () => setIsOrderModalOpen(false),
				orders: eligibleOrders,
				selectedOrderId,
				onSelectOrder: (id) => setSelectedOrderId(id)
			}));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return WriteReviewModal; } });
	});
	//#endregion

	//#region components/UserPages/PaymentMethods/Lang.js
	__define("components/UserPages/PaymentMethods/Lang.js", function (exports, __require, module) {
		const translations = {
			ru: {
				"pm_hero_title": "Способы оплаты",
				"pm_hero_desc": "Управление сохраненными картами Visa и Mastercard, настройка основного метода оплаты для быстрых покупок",
				"pm_btn_add": "Добавить новую карту",
				"pm_limit_reached": "Вы можете сохранить максимум 3 банковские карты. Пожалуйста, удалите существующую карту, чтобы добавить новую.",
				"pm_limit_title": "Ошибка карты",
				"pm_loading": "Загрузка способов оплаты...",
				"pm_error_load": "Не удалось загрузить сохраненные способы оплаты.",
				"pm_try_again": "Попробовать снова",
				"pm_added_on": "Добавлена",
				"pm_badge_default": "Основная",
				"pm_cardholder": "Владелец",
				"pm_expires": "Срок",
				"pm_set_default": "Сделать основной",
				"pm_setting_default": "Сохранение...",
				"pm_delete": "Удалить",
				"pm_toast_added": "Банковская карта успешно добавлена!",
				"pm_toast_default": "установлена как основная карта!",
				"pm_toast_deleted": "Банковская карта успешно удалена.",
				"pm_this_card": "эта карта",
				"pm_ending_in": "с окончанием на",
				"card_modal_title": "Добавить банковскую карту",
				"card_modal_subtitle": "Введите данные вашей карты Visa или Mastercard",
				"card_number": "Номер карты",
				"card_expiry": "Срок действия",
				"card_cvc": "CVC / CVV",
				"card_holder_label": "Имя владельца (необязательно)",
				"card_holder_ph": "например: ELCHIN",
				"card_name_label": "Название карты (необязательно)",
				"card_name_ph": "например: Зарплатная карта",
				"card_set_default": "Сделать основной",
				"card_agree_prefix": "Согласен с ",
				"card_agree_rules": "Правилами оплаты",
				"card_btn_cancel": "Отмена",
				"card_btn_add": "Добавить карту",
				"card_btn_saving": "Сохранение карты...",
				"card_err_num_req": "Номер карты обязателен.",
				"card_err_num_len": "Номер карты должен содержать 16 цифр.",
				"card_err_brand": "Поддерживаются только карты Visa и Mastercard.",
				"card_err_luhn": "Неверная контрольная сумма номера карты.",
				"card_err_exp_req": "Срок действия обязателен.",
				"card_err_exp_fmt": "Формат должен быть ММ/ГГ.",
				"card_err_exp_month": "Месяц должен быть от 01 до 12.",
				"card_err_exp_past": "Срок действия карты истек.",
				"card_err_cvc_req": "CVC обязателен.",
				"card_err_cvc_len": "Должно быть 3 цифры.",
				"card_err_holder": "Пожалуйста, введите корректное имя владельца.",
				"card_err_rules": "Необходимо согласиться с правилами оплаты.",
				"modal_understand": "Понятно"
			},
			en: {
				"pm_hero_title": "Payment Methods",
				"pm_hero_desc": "Manage your saved Visa and Mastercard cards, configure default payment method, and speed up checkout",
				"pm_btn_add": "Add New Card",
				"pm_limit_reached": "You can only save up to 3 payment cards. Please delete an existing card to add a new one.",
				"pm_limit_title": "Card Error",
				"pm_loading": "Loading your saved payment methods...",
				"pm_error_load": "Failed to load saved payment methods.",
				"pm_try_again": "Try Again",
				"pm_added_on": "Added",
				"pm_badge_default": "Default",
				"pm_cardholder": "Cardholder",
				"pm_expires": "Expires",
				"pm_set_default": "Set Default",
				"pm_setting_default": "Setting...",
				"pm_delete": "Delete",
				"pm_toast_added": "Payment card added successfully!",
				"pm_toast_default": "set as default payment method!",
				"pm_toast_deleted": "Payment card removed successfully.",
				"pm_this_card": "this card",
				"pm_ending_in": "ending in",
				"card_modal_title": "Add Payment Card",
				"card_modal_subtitle": "Enter your Visa or Mastercard details",
				"card_number": "Card Number",
				"card_expiry": "Expiry Date",
				"card_cvc": "CVC / CVV",
				"card_holder_label": "Cardholder (Optional)",
				"card_holder_ph": "e.g. ELCHIN",
				"card_name_label": "Card Label (Optional)",
				"card_name_ph": "e.g. Salary Card",
				"card_set_default": "Set as default",
				"card_agree_prefix": "Agree to ",
				"card_agree_rules": "Payment Rules",
				"card_btn_cancel": "Cancel",
				"card_btn_add": "Add Card",
				"card_btn_saving": "Saving Card...",
				"card_err_num_req": "Card number is required.",
				"card_err_num_len": "Card number must be 16 digits.",
				"card_err_brand": "Only Visa and Mastercard cards are supported.",
				"card_err_luhn": "Invalid card number checksum.",
				"card_err_exp_req": "Expiry date is required.",
				"card_err_exp_fmt": "Format must be MM/YY.",
				"card_err_exp_month": "Month must be 01–12.",
				"card_err_exp_past": "Card has expired.",
				"card_err_cvc_req": "CVC is required.",
				"card_err_cvc_len": "Must be 3 digits.",
				"card_err_holder": "Please enter a valid cardholder name.",
				"card_err_rules": "You must agree to the payment rules.",
				"modal_understand": "Understand"
			},
			az: {
				"pm_hero_title": "Ödəniş üsulları",
				"pm_hero_desc": "Saxlanılan Visa və Mastercard kartlarınızı idarə edin, əsas ödəniş üsulunu seçin və sürətli sifariş verin",
				"pm_btn_add": "Yeni kart əlavə et",
				"pm_limit_reached": "Maksimum 3 bank kartı saxlaya bilərsiniz. Yenisini əlavə etmək üçün mövcud kartı silin.",
				"pm_limit_title": "Kart xətası",
				"pm_loading": "Yadda saxlanılmış ödəniş üsulları yüklənir...",
				"pm_error_load": "Yadda saxlanılmış ödəniş üsullarını yükləmək mümkün olmadı.",
				"pm_try_again": "Yenidən cəhd edin",
				"pm_added_on": "Əlavə edilib",
				"pm_badge_default": "Əsas",
				"pm_cardholder": "Kart sahibi",
				"pm_expires": "Bitmə vaxtı",
				"pm_set_default": "Əsas et",
				"pm_setting_default": "Dəyişdirilir...",
				"pm_delete": "Sil",
				"pm_toast_added": "Ödəniş kartı uğurla əlavə edildi!",
				"pm_toast_default": "əsas ödəniş üsulu kimi təyin edildi!",
				"pm_toast_deleted": "Ödəniş kartı uğurla silindi.",
				"pm_this_card": "bu kart",
				"pm_ending_in": "son rəqəmləri",
				"card_modal_title": "Ödəniş kartı əlavə et",
				"card_modal_subtitle": "Visa və ya Mastercard kart məlumatlarınızı daxil edin",
				"card_number": "Kart nömrəsi",
				"card_expiry": "Bitmə tarixi",
				"card_cvc": "CVC / CVV",
				"card_holder_label": "Kart sahibi (istəyə görə)",
				"card_holder_ph": "məs: ELCHIN",
				"card_name_label": "Kartın adı (istəyə görə)",
				"card_name_ph": "məs: Maaş kartı",
				"card_set_default": "Əsas kart et",
				"card_agree_prefix": "Razıyam: ",
				"card_agree_rules": "Ödəniş qaydaları",
				"card_btn_cancel": "Ləğv et",
				"card_btn_add": "Kart əlavə et",
				"card_btn_saving": "Kart saxlanılır...",
				"card_err_num_req": "Kart nömrəsi mütləqdir.",
				"card_err_num_len": "Kart nömrəsi 16 rəqəmdən ibarət olmalıdır.",
				"card_err_brand": "Yalnız Visa və Mastercard kartları dəstəklənir.",
				"card_err_luhn": "Kart nömrəsinin yoxlama cəmi yanlışdır.",
				"card_err_exp_req": "Bitmə tarixi mütləqdir.",
				"card_err_exp_fmt": "Format AA/İİ olmalıdır.",
				"card_err_exp_month": "Ay 01–12 aralığında olmalıdır.",
				"card_err_exp_past": "Kartın etibarlılıq müddəti bitib.",
				"card_err_cvc_req": "CVC mütləqdir.",
				"card_err_cvc_len": "3 rəqəm olmalıdır.",
				"card_err_holder": "Zəhmət olmasa kart sahibinin düzgün adını qeyd edin.",
				"card_err_rules": "Ödəniş qaydaları ilə razılaşmaq mütləqdir.",
				"modal_understand": "Aydındır"
			}
		};
		const getPaymentMethodsTranslation = (lang, dataId) => {
			const dict = translations[lang] || translations.az || translations.ru;
			return dict[dataId] || translations.en && translations.en[dataId] || dataId;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getPaymentMethodsTranslation", { enumerable: true, get: function () { return getPaymentMethodsTranslation; } });
	});
	//#endregion

	//#region components/UserPages/PaymentMethods/PaymentErrorModal.js
	__define("components/UserPages/PaymentMethods/PaymentErrorModal.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const __imp_1 = __require("components/Elements/AnimatedModalWrapper.js");
		const AnimatedModalWrapper = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const { useLang } = __require("utils/useLang.js");
		const { getPaymentMethodsTranslation } = __require("components/UserPages/PaymentMethods/Lang.js");
		const PaymentErrorModal = ({ isOpen, onClose, message, title = "Card Error" }) => {
			const lang = useLang();
			const t = (id) => getPaymentMethodsTranslation(lang, id);
			return /* @__PURE__ */ __h(AnimatedModalWrapper, {
				isOpen,
				onClose,
				targetBorderRadius: "24px",
				zIndex: 100005
			}, /* @__PURE__ */ __h("div", {
				className: "rednest-modal",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ __h("div", { className: "rednest-modal__icon rednest-modal__icon--danger" }, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("line", {
				x1: "15",
				y1: "9",
				x2: "9",
				y2: "15"
			}), /* @__PURE__ */ __h("line", {
				x1: "9",
				y1: "9",
				x2: "15",
				y2: "15"
			}))), /* @__PURE__ */ __h("h3", { className: "rednest-modal__title" }, title), /* @__PURE__ */ __h("p", { className: "rednest-modal__text" }, message || "An error occurred while processing your card."), /* @__PURE__ */ __h("div", { className: "rednest-modal__actions" }, /* @__PURE__ */ __h("button", {
				type: "button",
				className: "rednest-modal__btn rednest-modal__btn--danger",
				onClick: onClose
			}, t("modal_understand")))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return PaymentErrorModal; } });
	});
	//#endregion

	//#region components/AdminPages/AdminLayout/AdminLayout.js
	__define("components/AdminPages/AdminLayout/AdminLayout.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useEffect } = __imp_0;
		const { NavLink, useNavigate, useLocation } = __require("utils/router.js");
		const { motion, AnimatePresence } = __require("utils/motion.js");
		const logo = "/assets/icons/rednest_logo.png";
		const { useAdminAuth } = __require("context/AdminAuthContext.js");
		const { useAuth } = __require("context/AuthContext.js");
		const __imp_1 = __require("components/Elements/LogoutModal.js");
		const LogoutModal = __imp_1.default !== undefined ? __imp_1.default : __imp_1;
		const cleanRole = (role) => (role || "").toLowerCase().replace(/\s+/g, "");
		const NAV_ITEMS = [
			{
				to: "/admin/dashboard",
				label: "Dashboard",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("rect", {
					x: "3",
					y: "3",
					width: "7",
					height: "7",
					rx: "1"
				}), /* @__PURE__ */ __h("rect", {
					x: "14",
					y: "3",
					width: "7",
					height: "7",
					rx: "1"
				}), /* @__PURE__ */ __h("rect", {
					x: "3",
					y: "14",
					width: "7",
					height: "7",
					rx: "1"
				}), /* @__PURE__ */ __h("rect", {
					x: "14",
					y: "14",
					width: "7",
					height: "7",
					rx: "1"
				}))
			},
			{
				to: "/admin/products",
				label: "Products",
				requiredRoles: ["admin", "superadmin"],
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }), /* @__PURE__ */ __h("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }), /* @__PURE__ */ __h("line", {
					x1: "6",
					y1: "1",
					x2: "6",
					y2: "4"
				}), /* @__PURE__ */ __h("line", {
					x1: "10",
					y1: "1",
					x2: "10",
					y2: "4"
				}), /* @__PURE__ */ __h("line", {
					x1: "14",
					y1: "1",
					x2: "14",
					y2: "4"
				}))
			},
			{
				to: "/admin/orders",
				label: "Orders",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" }), /* @__PURE__ */ __h("path", { d: "M3 6h18" }), /* @__PURE__ */ __h("path", { d: "M16 10a4 4 0 0 1-8 0" }))
			},
			{
				to: "/admin/promos",
				label: "Promos",
				requiredRoles: ["admin", "superadmin"],
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("path", { d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" }), /* @__PURE__ */ __h("line", {
					x1: "12",
					y1: "9",
					x2: "12",
					y2: "15"
				}))
			},
			{
				to: "/admin/users",
				label: "Users",
				requiredRoles: ["admin", "superadmin"],
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ __h("circle", {
					cx: "9",
					cy: "7",
					r: "4"
				}), /* @__PURE__ */ __h("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), /* @__PURE__ */ __h("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }))
			},
			{
				to: "/admin/newsletter",
				label: "Newsletter",
				requiredRoles: ["admin", "superadmin"],
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ __h("polyline", { points: "22,6 12,13 2,6" }))
			},
			{
				to: "/admin/reviews",
				label: "Reviews",
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }))
			},
			{
				to: "/admin/database",
				label: "Database",
				requiredRoles: ["admin", "superadmin"],
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("ellipse", {
					cx: "12",
					cy: "5",
					rx: "9",
					ry: "3"
				}), /* @__PURE__ */ __h("path", { d: "M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" }), /* @__PURE__ */ __h("path", { d: "M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" }))
			},
			{
				to: "/admin/footer",
				label: "Footer",
				requiredRoles: ["superadmin"],
				icon: /* @__PURE__ */ __h("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}, /* @__PURE__ */ __h("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "2"
				}), /* @__PURE__ */ __h("line", {
					x1: "3",
					y1: "15",
					x2: "21",
					y2: "15"
				}))
			}
		];
		const AdminLayout = ({ children }) => {
			const { adminLogout, adminRole, verify } = useAdminAuth();
			const { user } = useAuth();
			const navigate = useNavigate();
			const location = useLocation();
			const [sidebarOpen, setSidebarOpen] = useState(false);
			const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
			const [isLoggingOut, setIsLoggingOut] = useState(false);
			const [accessDeniedToast, setAccessDeniedToast] = useState("");
			const currentUserRole = cleanRole(adminRole || user?.role || user?.Role);
			useEffect(() => {
				setSidebarOpen(false);
			}, [location.pathname]);
			useEffect(() => {
				if (location.state?.accessDenied) {
					setAccessDeniedToast("Access restricted. You do not have permission to view this section.");
					navigate(location.pathname, {
						replace: true,
						state: {}
					});
				}
			}, [
				location.state,
				location.pathname,
				navigate
			]);
			useEffect(() => {
				if (accessDeniedToast) {
					const timer = setTimeout(() => setAccessDeniedToast(""), 5e3);
					return () => clearTimeout(timer);
				}
			}, [accessDeniedToast]);
			useEffect(() => {
				if (sidebarOpen) {
					document.body.style.overflow = "hidden";
				} else {
					document.body.style.overflow = "";
				}
				return () => {
					document.body.style.overflow = "";
				};
			}, [sidebarOpen]);
			const handleLogout = async () => {
				setIsLoggingOut(true);
				try {
					await adminLogout();
					setIsLogoutModalOpen(false);
					navigate("/", { replace: true });
				} catch (err) {
					console.error("Admin logout failed:", err);
					navigate("/", { replace: true });
				} finally {
					setIsLoggingOut(false);
				}
			};
			return /* @__PURE__ */ __h("div", { className: "admin-layout" }, /* @__PURE__ */ __h(AnimatePresence, null, accessDeniedToast && /* @__PURE__ */ __h(motion.div, {
				className: "admin-layout__toast",
				initial: {
					opacity: 0,
					y: -20,
					scale: .95
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: -20,
					scale: .95
				}
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "8",
				x2: "12",
				y2: "12"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "16",
				x2: "12.01",
				y2: "16"
			})), /* @__PURE__ */ __h("span", null, accessDeniedToast))), /* @__PURE__ */ __h("header", { className: "admin-mobile-header" }, /* @__PURE__ */ __h("button", {
				id: "admin-mobile-menu-btn",
				className: "admin-mobile-header__toggle",
				onClick: () => setSidebarOpen((prev) => !prev),
				"aria-label": "Toggle navigation"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("line", {
				x1: "3",
				y1: "12",
				x2: "21",
				y2: "12"
			}), /* @__PURE__ */ __h("line", {
				x1: "3",
				y1: "6",
				x2: "21",
				y2: "6"
			}), /* @__PURE__ */ __h("line", {
				x1: "3",
				y1: "18",
				x2: "21",
				y2: "18"
			}))), /* @__PURE__ */ __h("div", { className: "admin-mobile-header__brand" }, /* @__PURE__ */ __h("span", { className: "admin-mobile-header__title" }, "Admin Panel")), /* @__PURE__ */ __h("button", {
				className: "admin-mobile-header__logout",
				onClick: () => setIsLogoutModalOpen(true),
				"aria-label": "Exit Admin",
				title: "Exit Admin"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), /* @__PURE__ */ __h("polyline", { points: "16 17 21 12 16 7" }), /* @__PURE__ */ __h("line", {
				x1: "21",
				y1: "12",
				x2: "9",
				y2: "12"
			})))), /* @__PURE__ */ __h(AnimatePresence, null, sidebarOpen && /* @__PURE__ */ __h(motion.div, {
				className: "admin-sidebar-overlay",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				onClick: () => setSidebarOpen(false)
			})), /* @__PURE__ */ __h("aside", { className: `admin-sidebar${sidebarOpen ? " admin-sidebar--open" : ""}` }, /* @__PURE__ */ __h("div", { className: "admin-sidebar__header" }, /* @__PURE__ */ __h("div", { className: "admin-sidebar__header-info" }, /* @__PURE__ */ __h("img", {
				src: logo,
				alt: "Süfrano",
				className: "admin-sidebar__logo"
			}), /* @__PURE__ */ __h("div", { className: "admin-sidebar__brand" }, /* @__PURE__ */ __h("span", { className: "admin-sidebar__title" }, "Süfrano"), /* @__PURE__ */ __h("span", { className: "admin-sidebar__subtitle" }, "Admin Panel"))), /* @__PURE__ */ __h("button", {
				className: "admin-sidebar__close",
				onClick: () => setSidebarOpen(false),
				"aria-label": "Close menu"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("line", {
				x1: "18",
				y1: "6",
				x2: "6",
				y2: "18"
			}), /* @__PURE__ */ __h("line", {
				x1: "6",
				y1: "6",
				x2: "18",
				y2: "18"
			})))), /* @__PURE__ */ __h("nav", { className: "admin-sidebar__nav" }, /* @__PURE__ */ __h("p", { className: "admin-sidebar__section-label" }, "Navigation"), NAV_ITEMS.map((item) => {
				const isLocked = item.requiredRoles && !item.requiredRoles.includes(currentUserRole);
				return /* @__PURE__ */ __h(NavLink, {
					key: item.to,
					to: isLocked ? "#" : item.to,
					id: `admin-nav-${item.label.toLowerCase()}`,
					className: ({ isActive }) => `admin-sidebar__link${isActive && !isLocked ? " admin-sidebar__link--active" : ""}${isLocked ? " admin-sidebar__link--locked" : ""}`,
					onClick: async (e) => {
						const restrictionText = item.requiredRoles && item.requiredRoles.length === 1 && item.requiredRoles[0] === "superadmin"
							? "Super Admin only"
							: "Admin and Super Admin only";
						if (isLocked) {
							e.preventDefault();
							setAccessDeniedToast(`Access to "${item.label}" is restricted (${restrictionText}).`);
						} else {
							setSidebarOpen(false);
							const res = await verify();
							if (res && res.role) {
								const updatedRole = cleanRole(res.role);
								if (item.requiredRoles && !item.requiredRoles.includes(updatedRole)) {
									e.preventDefault();
									setAccessDeniedToast(`Access to "${item.label}" is restricted (${restrictionText}).`);
								}
							}
						}
					}
				}, ({ isActive }) => /* @__PURE__ */ __h(__Fragment, null, isActive && !isLocked && /* @__PURE__ */ __h(motion.div, {
					layoutId: "admin-nav-indicator",
					className: "admin-sidebar__link-bg",
					transition: {
						type: "spring",
						bounce: .2,
						duration: .45
					}
				}), /* @__PURE__ */ __h("span", { className: "admin-sidebar__link-icon" }, item.icon), /* @__PURE__ */ __h("span", { className: "admin-sidebar__link-label" }, item.label), isLocked && /* @__PURE__ */ __h("span", {
					className: "admin-sidebar__link-lock",
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
				}), /* @__PURE__ */ __h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })))));
			})), /* @__PURE__ */ __h("div", { className: "admin-sidebar__bottom-actions" }, /* @__PURE__ */ __h("button", {
				id: "admin-audit-log-btn",
				className: `admin-sidebar__audit-btn${location.pathname === "/admin/logs" ? " admin-sidebar__audit-btn--active" : ""}`,
				type: "button",
				onClick: () => {
					setSidebarOpen(false);
					navigate("/admin/logs");
				}
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ __h("polyline", { points: "14 2 14 8 20 8" }), /* @__PURE__ */ __h("line", {
				x1: "16",
				y1: "13",
				x2: "8",
				y2: "13"
			}), /* @__PURE__ */ __h("line", {
				x1: "16",
				y1: "17",
				x2: "8",
				y2: "17"
			}), /* @__PURE__ */ __h("polyline", { points: "10 9 9 9 8 9" })), /* @__PURE__ */ __h("span", null, "Audit Log")), /* @__PURE__ */ __h("button", {
				id: "admin-logout-btn",
				className: "admin-sidebar__logout",
				onClick: () => setIsLogoutModalOpen(true)
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), /* @__PURE__ */ __h("polyline", { points: "16 17 21 12 16 7" }), /* @__PURE__ */ __h("line", {
				x1: "21",
				y1: "12",
				x2: "9",
				y2: "12"
			})), /* @__PURE__ */ __h("span", { className: "admin-sidebar__exit-text-full" }, "Exit Admin"), /* @__PURE__ */ __h("span", { className: "admin-sidebar__exit-text-short" }, "Exit")))), /* @__PURE__ */ __h("main", { className: "admin-content" }, children), /* @__PURE__ */ __h(LogoutModal, {
				isOpen: isLogoutModalOpen,
				onClose: () => setIsLogoutModalOpen(false),
				onConfirm: handleLogout,
				loading: isLoggingOut,
				title: "Exit Admin Panel",
				text: "Are you sure you want to exit the Admin Panel and return to the Home page?",
				confirmText: "Exit Admin"
			}));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return AdminLayout; } });
	});
	//#endregion

	//#region components/Elements/AdminTableActions.js
	__define("components/Elements/AdminTableActions.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useState, useRef, useEffect } = __imp_0;
		const { motion, AnimatePresence } = __require("utils/motion.js");
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

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return AdminTableActions; } });
	});
	//#endregion

	//#region components/Cashbox/Lang.js
	__define("components/Cashbox/Lang.js", function (exports, __require, module) {
		const translations = {
			az: {
				searchPlaceholder: "Məhsul adı və ya kateqoriyaya görə axtarın...",
				clearSearch: "Axtarışı təmizlə",
				cashier: "Kassir:",
				unknownUser: "Naməlum istifadəçi",
				categories: {
					"All": "Hamısı",
					"Main Drinks": "Əsas içkilər",
					"Specialty Drinks": "Xüsusi içkilər",
					"Desserts": "Desertlər",
					"Coffee": "Qəhvə",
					"Tea": "Çay",
					"Drinks": "İçkilər",
					"Bakery": "Şirniyyat",
					"Food": "Qida",
					"Sandwiches": "Sendviçlər",
					"General": "Ümumi"
				},
				promoCodes: "Promo",
				promoActive: "Promokod aktivdir",
				promoActiveCount: (count = 1) => `Promo (${count})`,
				loadingCatalog: "Kataloq yüklənir...",
				noProductsFound: "Məhsul tapılmadı",
				noProductsDesc: "Axtarış sorğusunu dəyişin və ya başqa kateqoriya seçin",
				resetFilters: "Filtrləri sıfırla",
				productDefault: "Məhsul",
				electronicReceipt: "Elektron qəbz",
				clearReceipt: "Təmizlə",
				clearReceiptTitle: "Qəbzi təmizlə",
				receiptEmpty: "Qəbz boşdur",
				receiptEmptyDesc: "Kataloqdan içki və ya desertləri seçin",
				decreaseQty: "Sayı azalt",
				increaseQty: "Sayı artır",
				removeItem: "Məhsulu sil",
				removePromo: "Promokodu sil",
				usePromoCode: "Promokod tətbiq et",
				subtotal: "Məbləğ:",
				promoDiscount: "Promokod endirimi",
				promoDiscountLabel: (code) => code ? `Promokod endirimi (${code}):` : "Promokod endirimi:",
				total: "Yekun:",
				itemsSuffix: "məhsul",
				confirm: "Təsdiqlə",
				cash: "Nağd",
				card: "Qeyri-nağd",
				cashDesc: "Nağd pulla ödəniş",
				cardDesc: "Bank kartı və ya POS terminal ilə",
				cancel: "Ləğv et",
				cancelSplit: "Bölünməni ləğv et",
				selectPayMethod: "Ödəniş üsulu",
				totalToPay: "Ödəniləcək yekun:",
				currentOrder: "Cari sifariş",
				closeReceipt: "Qəbzi bağla",
				closeModal: "Bağla",
				promoModalTitle: "Promokod axtarışı",
				promoModalSubtitle: "Barkod və ya promokod nömrəsi ilə axtarış",
				promoInputPlaceholder: "Barkod və ya promokod...",
				search: "Axtar",
				searching: "Axtarılır...",
				searchingDb: "Bazada promokodlar axtarılır...",
				scanOrEnter: "Barkodu skan edin və ya promokodu daxil edin",
				scanOrEnterDesc: "Etibarlılığı, endirim məbləğini və hesab sahibini yoxlamaq üçün müştərinin promokodunu və ya barkodunu daxil edin.",
				noActivePromo: "Aktiv promokod tapılmadı",
				noActivePromoDesc: (query) => `"${query}" sorğusuna uyğun aktiv promokod tapılmadı.`,
				active: "Aktiv",
				expired: "Vaxtı bitib",
				inactive: "Qeyri-aktiv",
				accountOwner: "Hesab sahibi",
				unclaimedPublic: "Ümumi promokod",
				anonymousCustomer: "Anonim müştəri",
				promoCodeLabel: "Promokod",
				barcodeLabel: "Barkod nömrəsi",
				discountLabel: "Endirim",
				cashbackLabel: "Keşbek",
				appliedToReceipt: "Qəbzə tətbiq edildi",
				removeFromReceipt: "Qəbzdən çıxar",
				remove: "Sil",
				applyToOrder: "Sifarişə tətbiq et",
				activated: "Aktivləşdirilib:",
				expires: "Bitmə tarixi:",
				promoSearchError: "Promokodları axtarmaq mümkün olmadı.",
				promoNetworkError: "Promokod axtarışı zamanı şəbəkə xətası baş verdi.",
				freeDrink: "Pulsuz içki",
				freeDessert: "Pulsuz desert",
				superPrize: "Super hədiyyə",
				discount25: "25% endirim",
				discount50: "50% endirim",
				receiptEmptyToast: "Qəbz boşdur! Zəhmət olmasa məhsul əlavə edin.",
				promoAppliedToast: (code) => `${code} promokodu tətbiq edildi!`,
				promoRemovedToast: "Promokod qəbzdən silindi.",
				orderFailedToast: "Sifarişi rəsmiləşdirmək mümkün olmadı.",
				orderNetworkErrorToast: "Sifariş zamanı şəbəkə xətası baş verdi.",
				orderConfirmedCash: (amt, promo) => promo ? `Sifariş təsdiqləndi (Nağd): ${amt} ₼ (${promo})` : `Sifariş təsdiqləndi (Nağd): ${amt} ₼`,
				orderConfirmedCard: (amt, promo) => promo ? `Sifariş təsdiqləndi (Qeyri-nağd): ${amt} ₼ (${promo})` : `Sifariş təsdiqləndi (Qeyri-nağd): ${amt} ₼`,
				received: "Qəbul edildi:",
				change: "Qalıq:",
				payByCard: "Kartla ödə",
				cashPayment: "Nağd ödəniş",
				backspace: "Sil",
				history: {
					title: "Kassa Tarixçəsi",
					subtitle: "Bütün kassa əməliyyatlarının və çeklərin reyestri",
					backToCashbox: "Kassaya qayıt",
					totalOrders: "Sifarişlər (cari ay)",
					totalRevenue: "Gəlir (cari ay)",
					cashTotal: "Nağd (cari ay)",
					cardTotal: "Kart (cari ay)",
					allStatuses: "Bütün statuslar",
					allMethods: "Bütün üsullar",
					allTime: "Bütün dövr",
					today: "Bu gün",
					yesterday: "Dünən",
					thisWeek: "Son 7 gün",
					thisMonth: "Son 30 gün",
					searchPlaceholder: "Sifariş ID, promokod və ya qeyd...",
					orderId: "Sifariş №",
					date: "Tarix",
					cashier: "Kassir",
					items: "Məhsullar",
					payment: "Ödəniş",
					status: "Status",
					total: "Məbləğ",
					actions: "Əməliyyatlar",
					viewDetails: "Ətraflı",
					orderDetails: "Detallar",
					tabInfo: "Info",
					tabProducts: "Məhsullar",
					tabStatus: "Status",
					note: "Qeyd",
					addNote: "Qeyd əlavə et",
					saveChanges: "Yadda saxla",
					changeStatus: "Statusu dəyiş",
					deleteOrder: "Sifarişi sil",
					confirmDelete: "Sifarişi silmək istədiyinizdən əminsiniz?",
					deleteWarning: "Bu əməliyyat geri qaytarıla bilməz.",
					noOrdersFound: "Sifariş tapılmadı",
					noOrdersDesc: "Axtarış parametrlərini dəyişərək yenidən yoxlayın.",
					loadingHistory: "Tarixçə yüklənir...",
					loadError: "Tarixçəni yükləmək mümkün olmadı",
					statusUpdated: "Status uğurla yeniləndi",
					orderDeleted: "Sifariş uğurla silindi",
					refresh: "Yenilə",
					itemCount: (c) => `${c} məhsul`,
					subtotal: "Məhsul məbləği:",
					discount: "Endirim:",
					initial: "İlkin məbləğ:",
					createdBy: "Yaradan:",
					editedBy: "Düzəliş edən:",
					userId: "İstifadəçi ID:",
					notEdited: "Düzəliş edilməyib",
					cash: "Nağd",
					card: "Kart",
					statusSuccess: "Uğurlu",
					statusCancelled: "Ləğv edildi",
					statusRefunded: "Qaytarıldı",
					statusPending: "Gözləmədə",
					statusProcessing: "İcrada",
					historyButton: "Tarixçə",
					cashboxButton: "Kassa",
					pageOf: (p, total) => `Səhifə ${p} / ${total}`
				}
			},
			ru: {
				searchPlaceholder: "Поиск товаров по названию или категории...",
				clearSearch: "Очистить поиск",
				cashier: "Кассир:",
				unknownUser: "Неизвестный пользователь",
				categories: {
					"All": "Все",
					"Main Drinks": "Основные напитки",
					"Specialty Drinks": "Особые напитки",
					"Desserts": "Десерты",
					"Coffee": "Кофе",
					"Tea": "Чай",
					"Drinks": "Напитки",
					"Bakery": "Выпечка",
					"Food": "Еда",
					"Sandwiches": "Сэндвичи",
					"General": "Общее"
				},
				promoCodes: "Promo",
				promoActive: "Промокод активен",
				promoActiveCount: (count = 1) => `Promo (${count})`,
				loadingCatalog: "Загрузка каталога...",
				noProductsFound: "Товары не найдены",
				noProductsDesc: "Попробуйте изменить поисковый запрос или выберите другую категорию",
				resetFilters: "Сбросить фильтры",
				productDefault: "Товар",
				electronicReceipt: "Электронный чек",
				clearReceipt: "Очистить",
				clearReceiptTitle: "Очистить чек",
				receiptEmpty: "Чек пуст",
				receiptEmptyDesc: "Выберите напитки или десерты из каталога",
				decreaseQty: "Уменьшить количество",
				increaseQty: "Увеличить количество",
				removeItem: "Удалить позицию",
				removePromo: "Удалить промокод",
				usePromoCode: "Применить промокод",
				subtotal: "Подытог:",
				promoDiscount: "Скидка по промокоду",
				promoDiscountLabel: (code) => code ? `Скидка по промокоду (${code}):` : "Скидка по промокоду:",
				total: "Итого:",
				itemsSuffix: "товаров",
				confirm: "Подтвердить",
				cash: "Наличными",
				card: "Безналичными",
				cashDesc: "Оплата наличными средствами",
				cardDesc: "Банковской картой или POS-терминалом",
				cancel: "Отмена",
				cancelSplit: "Отменить выбор",
				selectPayMethod: "Способ оплаты",
				totalToPay: "Сумма к оплате:",
				currentOrder: "Текущий заказ",
				closeReceipt: "Закрыть чек",
				closeModal: "Закрыть",
				promoModalTitle: "Поиск промокода",
				promoModalSubtitle: "Поиск по штрихкоду или номеру промокода",
				promoInputPlaceholder: "Штрихкод или промокод...",
				search: "Поиск",
				searching: "Поиск...",
				searchingDb: "Поиск промокодов в базе данных...",
				scanOrEnter: "Сканируйте или введите штрихкод / код",
				scanOrEnterDesc: "Введите промокод или штрихкод клиента для проверки срока действия, размера скидки и владельца.",
				noActivePromo: "Активный промокод не найден",
				noActivePromoDesc: (query) => `По запросу «${query}» активных промокодов не найдено.`,
				active: "Активен",
				expired: "Истек",
				inactive: "Неактивен",
				accountOwner: "Владелец аккаунта",
				unclaimedPublic: "Общий промокод",
				anonymousCustomer: "Анонимный клиент",
				promoCodeLabel: "Промокод",
				barcodeLabel: "Штрихкод",
				discountLabel: "Скидка",
				cashbackLabel: "Кэшбэк",
				appliedToReceipt: "Применен к чеку",
				removeFromReceipt: "Удалить из чека",
				remove: "Удалить",
				applyToOrder: "Применить к заказу",
				activated: "Активирован:",
				expires: "Истекает:",
				promoSearchError: "Не удалось выполнить поиск промокодов.",
				promoNetworkError: "Ошибка сети при поиске промокодов.",
				freeDrink: "Бесплатный напиток",
				freeDessert: "Бесплатный десерт",
				superPrize: "Суперприз",
				discount25: "Скидка 25%",
				discount50: "Скидка 50%",
				receiptEmptyToast: "Чек пуст! Пожалуйста, добавьте товары.",
				promoAppliedToast: (code) => `Промокод ${code} применен!`,
				promoRemovedToast: "Промокод удален из чека.",
				orderFailedToast: "Не удалось оформить заказ.",
				orderNetworkErrorToast: "Ошибка сети при оформлении заказа.",
				orderConfirmedCash: (amt, promo) => promo ? `Заказ оформлен (Наличные): ${amt} ₼ (Промокод ${promo})` : `Заказ оформлен (Наличные): ${amt} ₼`,
				orderConfirmedCard: (amt, promo) => promo ? `Заказ оформлен (Безналичные): ${amt} ₼ (Промокод ${promo})` : `Заказ оформлен (Безналичные): ${amt} ₼`,
				received: "Получено:",
				change: "Сдача:",
				payByCard: "Оплата картой",
				cashPayment: "Оплата наличными",
				backspace: "Стереть",
				history: {
					title: "История кассы",
					subtitle: "Реестр всех кассовых операций и чеков",
					backToCashbox: "Вернуться в кассу",
					totalOrders: "Заказов (за месяц)",
					totalRevenue: "Выручка (за месяц)",
					cashTotal: "Наличными (за месяц)",
					cardTotal: "Картой (за месяц)",
					allStatuses: "Все статусы",
					allMethods: "Все способы",
					allTime: "За всё время",
					today: "Сегодня",
					yesterday: "Вчера",
					thisWeek: "За 7 дней",
					thisMonth: "За 30 дней",
					searchPlaceholder: "ID заказа, промокод или примечание...",
					orderId: "Заказ №",
					date: "Дата",
					cashier: "Кассир",
					items: "Товары",
					payment: "Оплата",
					status: "Статус",
					total: "Сумма",
					actions: "Действия",
					viewDetails: "Подробнее",
					orderDetails: "Детали",
					tabInfo: "Инфо",
					tabProducts: "Товары",
					tabStatus: "Статус",
					note: "Примечание",
					addNote: "Добавить примечание",
					saveChanges: "Сохранить",
					changeStatus: "Сменить статус",
					deleteOrder: "Удалить заказ",
					confirmDelete: "Вы уверены, что хотите удалить заказ?",
					deleteWarning: "Это действие нельзя отменить.",
					noOrdersFound: "Заказы не найдены",
					noOrdersDesc: "Попробуйте изменить параметры фильтрации или поисковый запрос.",
					loadingHistory: "Загрузка истории...",
					loadError: "Не удалось загрузить историю",
					statusUpdated: "Статус успешно обновлен",
					orderDeleted: "Заказ успешно удален",
					refresh: "Обновить",
					itemCount: (c) => `${c} шт.`,
					subtotal: "Подытог:",
					discount: "Скидка:",
					initial: "Исходная сумма:",
					createdBy: "Создал:",
					editedBy: "Изменил:",
					userId: "ID пользователя:",
					notEdited: "Без изменений",
					cash: "Наличные",
					card: "Карта",
					statusSuccess: "Успешно",
					statusCancelled: "Отменен",
					statusRefunded: "Возврат",
					statusPending: "В ожидании",
					statusProcessing: "В обработке",
					historyButton: "История",
					cashboxButton: "Касса",
					pageOf: (p, total) => `Страница ${p} из ${total}`
				}
			},
			en: {
				searchPlaceholder: "Search products by name or category...",
				clearSearch: "Clear search",
				cashier: "Cashier:",
				unknownUser: "Unknown User",
				categories: {
					"All": "All",
					"Main Drinks": "Main Drinks",
					"Specialty Drinks": "Specialty Drinks",
					"Desserts": "Desserts",
					"Coffee": "Coffee",
					"Tea": "Tea",
					"Drinks": "Drinks",
					"Bakery": "Bakery",
					"Food": "Food",
					"Sandwiches": "Sandwiches",
					"General": "General"
				},
				promoCodes: "Promo",
				promoActive: "Promo code active",
				promoActiveCount: (count = 1) => `Promo (${count})`,
				loadingCatalog: "Loading catalog...",
				noProductsFound: "No Products Found",
				noProductsDesc: "Try adjusting your search query or select a different category",
				resetFilters: "Reset Filters",
				productDefault: "Product",
				electronicReceipt: "Electronic Receipt",
				clearReceipt: "Clear",
				clearReceiptTitle: "Clear receipt",
				receiptEmpty: "Receipt is empty",
				receiptEmptyDesc: "Select beverages or desserts from the catalog",
				decreaseQty: "Decrease quantity",
				increaseQty: "Increase quantity",
				removeItem: "Remove item",
				removePromo: "Remove promo code",
				usePromoCode: "Use Promo Code",
				subtotal: "Subtotal:",
				promoDiscount: "Promo Discount",
				promoDiscountLabel: (code) => code ? `Promo Discount (${code}):` : "Promo Discount:",
				total: "Total:",
				itemsSuffix: "items",
				confirm: "Confirm",
				cash: "Cash",
				card: "Card",
				cashDesc: "Cash payment with banknotes or coins",
				cardDesc: "Debit / Credit card or POS terminal",
				cancel: "Cancel",
				cancelSplit: "Cancel split",
				selectPayMethod: "Payment Method",
				totalToPay: "Total amount:",
				currentOrder: "Current Order",
				closeReceipt: "Close receipt",
				closeModal: "Close",
				promoModalTitle: "Promo Code Lookup",
				promoModalSubtitle: "Search by barcode or promo code number",
				promoInputPlaceholder: "Barcode or promo code...",
				search: "Search",
				searching: "Searching...",
				searchingDb: "Searching promo codes in database...",
				scanOrEnter: "Scan or enter barcode / code",
				scanOrEnterDesc: "Enter customer's promo code or barcode to check validity, discount amount, and account owner.",
				noActivePromo: "No active promo code found",
				noActivePromoDesc: (query) => `No active promo codes match "${query}".`,
				active: "Active",
				expired: "Expired",
				inactive: "Inactive",
				accountOwner: "Account Owner",
				unclaimedPublic: "Unclaimed (Public Promo)",
				anonymousCustomer: "Anonymous Customer",
				promoCodeLabel: "Promo Code",
				barcodeLabel: "Barcode Number",
				discountLabel: "Discount",
				cashbackLabel: "Cashback",
				appliedToReceipt: "Applied to Receipt",
				removeFromReceipt: "Remove from receipt",
				remove: "Remove",
				applyToOrder: "Apply to Order",
				activated: "Activated:",
				expires: "Expires:",
				promoSearchError: "Failed to search promo codes.",
				promoNetworkError: "Network error while searching promo codes.",
				freeDrink: "Free Drink",
				freeDessert: "Free Dessert",
				superPrize: "Super Prize",
				discount25: "25% Off Order",
				discount50: "50% Off Order",
				receiptEmptyToast: "Receipt is empty! Please add products.",
				promoAppliedToast: (code) => `Promo code ${code} applied!`,
				promoRemovedToast: "Promo code removed from receipt.",
				orderFailedToast: "Failed to process order.",
				orderNetworkErrorToast: "Network error while processing order.",
				orderConfirmedCash: (amt, promo) => promo ? `Order confirmed (Cash): ${amt} ₼ (Promo ${promo} redeemed)` : `Order confirmed (Cash): ${amt} ₼`,
				orderConfirmedCard: (amt, promo) => promo ? `Order confirmed (Card): ${amt} ₼ (Promo ${promo} redeemed)` : `Order confirmed (Card): ${amt} ₼`,
				received: "Received:",
				change: "Change:",
				payByCard: "Pay by Card",
				cashPayment: "Cash Payment",
				backspace: "Backspace",
				history: {
					title: "Cashbox History",
					subtitle: "Registry of all POS transactions and receipts",
					backToCashbox: "Back to Cashbox",
					totalOrders: "Orders (This Month)",
					totalRevenue: "Revenue (This Month)",
					cashTotal: "Cash (This Month)",
					cardTotal: "Card (This Month)",
					allStatuses: "All Statuses",
					allMethods: "All Methods",
					allTime: "All Time",
					today: "Today",
					yesterday: "Yesterday",
					thisWeek: "Last 7 Days",
					thisMonth: "Last 30 Days",
					searchPlaceholder: "Search Order ID, promo code, note...",
					orderId: "Order #",
					date: "Date",
					cashier: "Cashier",
					items: "Items",
					payment: "Payment",
					status: "Status",
					total: "Total",
					actions: "Actions",
					viewDetails: "Details",
					orderDetails: "Details",
					tabInfo: "Info",
					tabProducts: "Products",
					tabStatus: "Status",
					note: "Note",
					addNote: "Add Note",
					saveChanges: "Save Changes",
					changeStatus: "Change Status",
					deleteOrder: "Delete Order",
					confirmDelete: "Are you sure you want to delete this order?",
					deleteWarning: "This action cannot be undone.",
					noOrdersFound: "No Orders Found",
					noOrdersDesc: "Try adjusting your filters or search query.",
					loadingHistory: "Loading history...",
					loadError: "Failed to load history",
					statusUpdated: "Status successfully updated",
					orderDeleted: "Order successfully deleted",
					refresh: "Refresh",
					itemCount: (c) => `${c} items`,
					subtotal: "Subtotal:",
					discount: "Discount:",
					initial: "Initial amount:",
					createdBy: "Created by:",
					editedBy: "Edited by:",
					userId: "User ID:",
					notEdited: "Not edited",
					cash: "Cash",
					card: "Card",
					statusSuccess: "Success",
					statusCancelled: "Cancelled",
					statusRefunded: "Refunded",
					statusPending: "Pending",
					statusProcessing: "Processing",
					historyButton: "History",
					cashboxButton: "Cashbox",
					pageOf: (p, total) => `Page ${p} of ${total}`
				}
			}
		};
		const getCashboxTranslation = (lang) => {
			return translations[lang] || translations.az;
		};

		Object.defineProperty(exports, "translations", { enumerable: true, get: function () { return translations; } });
		Object.defineProperty(exports, "getCashboxTranslation", { enumerable: true, get: function () { return getCashboxTranslation; } });
	});
	//#endregion

	//#region components/Cashbox/components/CashboxTopBar.js
	__define("components/Cashbox/components/CashboxTopBar.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const __imp_0 = __require("utils/runtime.js");
		const React = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { useNavigate } = __require("utils/router.js");
		const { useAuth } = __require("context/AuthContext.js");
		const { isAllowedCashboxHistoryRole } = __require("routes/CashboxProtectedRoute.js");
		const { getUserAvatarUrl, handleAvatarError } = __require("utils/avatar.js");
		const logo = "/assets/icons/rednest_logo.png";
		const CashboxTopBar = ({ cashierName, cashierAvatar, searchQuery, setSearchQuery, searchPlaceholder, t, isHistory = false }) => {
			const navigate = useNavigate();
			const { user } = useAuth();
			const canAccessHistory = isAllowedCashboxHistoryRole(user?.role || user?.Role);
			return /* @__PURE__ */ __h("header", { className: "cashbox-topbar" }, /* @__PURE__ */ __h("div", {
				className: "cashbox-topbar__brand",
				onClick: () => navigate(isHistory ? "/cashbox" : "/")
			}, /* @__PURE__ */ __h("img", {
				src: logo,
				alt: "Süfrano",
				className: "cashbox-topbar__logo"
			}), /* @__PURE__ */ __h("span", { className: "cashbox-topbar__brand-text" }, "Süfrano"), /* @__PURE__ */ __h("span", { className: "cashbox-topbar__badge" }, "POS")), setSearchQuery && /* @__PURE__ */ __h("div", { className: "cashbox-topbar__search" }, /* @__PURE__ */ __h("svg", {
				className: "cashbox-topbar__search-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2"
			}, /* @__PURE__ */ __h("circle", {
				cx: "11",
				cy: "11",
				r: "8"
			}), /* @__PURE__ */ __h("line", {
				x1: "21",
				y1: "21",
				x2: "16.65",
				y2: "16.65"
			})), /* @__PURE__ */ __h("input", {
				type: "text",
				value: searchQuery || "",
				onChange: (e) => setSearchQuery(e.target.value),
				placeholder: searchPlaceholder || t?.searchPlaceholder || "Search products by name or category...",
				className: "cashbox-topbar__search-input"
			}), searchQuery && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cashbox-topbar__search-clear",
				onClick: () => setSearchQuery(""),
				title: t?.clearSearch || "Clear search"
			}, "✕")), /* @__PURE__ */ __h("div", { className: "cashbox-topbar__meta" }, isHistory ? /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cashbox-topbar__history-btn",
				onClick: () => navigate("/cashbox"),
				title: t?.history?.cashboxButton || t?.history?.backToCashbox || "Cashbox"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("rect", {
				x: "2",
				y: "3",
				width: "20",
				height: "14",
				rx: "2",
				ry: "2"
			}), /* @__PURE__ */ __h("line", {
				x1: "8",
				y1: "21",
				x2: "16",
				y2: "21"
			}), /* @__PURE__ */ __h("line", {
				x1: "12",
				y1: "17",
				x2: "12",
				y2: "21"
			})), /* @__PURE__ */ __h("span", { className: "cashbox-topbar__history-text" }, t?.history?.cashboxButton || t?.history?.backToCashbox || "Cashbox")) : canAccessHistory && /* @__PURE__ */ __h("button", {
				type: "button",
				className: "cashbox-topbar__history-btn",
				onClick: () => navigate("/cashbox/history"),
				title: t?.history?.title || "Cashbox History"
			}, /* @__PURE__ */ __h("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, /* @__PURE__ */ __h("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ __h("polyline", { points: "12 6 12 12 16 14" })), /* @__PURE__ */ __h("span", { className: "cashbox-topbar__history-text" }, t?.history?.historyButton || "History")), /* @__PURE__ */ __h("div", { className: "cashbox-topbar__chip" }, /* @__PURE__ */ __h("div", { className: "cashbox-topbar__avatar" }, /* @__PURE__ */ __h("img", {
				src: getUserAvatarUrl(cashierAvatar),
				alt: cashierName,
				className: "cashbox-topbar__avatar-img",
				onError: handleAvatarError
			})), /* @__PURE__ */ __h("span", null, /* @__PURE__ */ __h("span", { className: "cashbox-topbar__cashier-label" }, t?.cashier || "Cashier:", " "), /* @__PURE__ */ __h("strong", null, cashierName)))));
		};

		Object.defineProperty(exports, "default", { enumerable: true, get: function () { return CashboxTopBar; } });
	});
	//#endregion

	//#region main.js
	__define("main.js", function (exports, __require, module) {
		const { __h, __Fragment } = __require("utils/runtime.js");
		const { StrictMode } = __require("utils/runtime.js");
		const { createRoot } = __require("utils/runtime.js");
		const __imp_0 = __require("App.js");
		const App = __imp_0.default !== undefined ? __imp_0.default : __imp_0;
		const { initGlobalRateLimitInterceptor } = __require("utils/rateLimitInterceptor.js");
		initGlobalRateLimitInterceptor();
		createRoot(document.getElementById("root")).render(/* @__PURE__ */ __h(StrictMode, null, /* @__PURE__ */ __h(App, null)));

	});
	//#endregion

	__require("main.js");
})();
