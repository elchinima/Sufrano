// Pure Vanilla JS DOM & State Runtime for Süfrano (Zero React dependency)

export const Fragment = Symbol('Fragment');
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

export function h(type, props, ...rawChildren) {
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

export function createPortal(children, container) {
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

// Hooks & Component state
let currentInstance = null;
const dirtyInstances = new Set();
let isFlushing = false;
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
  while (dirtyInstances.size > 0) {
    const batch = Array.from(dirtyInstances).sort((a, b) => a.depth - b.depth);
    dirtyInstances.clear();
    for (const inst of batch) {
      if (inst.isMounted && !inst.updatedInPass) {
        updateComponent(inst);
      }
    }
    for (const inst of batch) {
      inst.updatedInPass = false;
    }
  }
  isFlushing = false;
  flushEffects();
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

export function useState(initialValue) {
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

export function useRef(initialValue) {
  const hook = getNextHook();
  if (!('ref' in hook)) {
    hook.ref = { current: initialValue };
  }
  return hook.ref;
}

export function useMemo(factory, deps) {
  const hook = getNextHook();
  if (!('initialized' in hook) || depsChanged(hook.deps, deps)) {
    hook.initialized = true;
    hook.deps = deps;
    hook.value = factory();
  }
  return hook.value;
}

export function useCallback(callback, deps) {
  return useMemo(() => callback, deps);
}

export function useEffect(callback, deps) {
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

export function createContext(defaultValue) {
  const contextId = Symbol('Context');
  function Provider(props) {
    const children = props.children;
    if (Array.isArray(children)) {
      return h(Fragment, null, ...children);
    }
    return children ?? null;
  }
  Provider._isContextProvider = true;
  Provider._contextId = contextId;

  return {
    _id: contextId,
    _defaultValue: defaultValue,
    Provider
  };
}

export function useContext(context) {
  if (!currentInstance || !context) return context?._defaultValue;
  if (currentInstance.contextMap && currentInstance.contextMap.has(context._id)) {
    return currentInstance.contextMap.get(context._id);
  }
  return context._defaultValue;
}

export class Component {
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

export function Suspense({ children }) {
  if (Array.isArray(children)) {
    return h(Fragment, null, ...children);
  }
  return children ?? null;
}

export function StrictMode({ children }) {
  if (Array.isArray(children)) {
    return h(Fragment, null, ...children);
  }
  return children ?? null;
}

export function lazy(loader) {
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

    if (!isSvg && (key === 'disabled' || key === 'readOnly' || key === 'required' || key === 'multiple' || key === 'selected' || key === 'autoFocus' || key === 'muted' || key === 'loop' || key === 'playsInline' || key === 'autoPlay' || key === 'controls')) {
      dom[key] = Boolean(newVal);
      if (!newVal) dom.removeAttribute(key.toLowerCase());
      continue;
    }

    const attrName = isSvg && SVG_ATTR_MAP[key] ? SVG_ATTR_MAP[key] : key;
    if (newVal === null || newVal === undefined || newVal === false) {
      dom.removeAttribute(attrName);
    } else if (newVal === true) {
      dom.setAttribute(attrName, '');
    } else if (typeof newVal !== 'function' && typeof newVal !== 'object') {
      dom.setAttribute(attrName, String(newVal));
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
    }

    const instance = {
      Component: vnode.type,
      props: vnode.props,
      hooks: [],
      hookIndex: 0,
      pendingEffects: [],
      vnode,
      subTree: null,
      parentDom,
      contextMap: nextContextMap,
      isSvg,
      depth,
      isMounted: true,
      updatedInPass: false,
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
    flushEffects();
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
  instance.updatedInPass = true;
  instance.hookIndex = 0;

  let nextContextMap = instance.contextMap;
  if (instance.Component._isContextProvider) {
    nextContextMap = new Map(instance.contextMap);
    nextContextMap.set(instance.Component._contextId, instance.props.value);
    instance.contextMap = nextContextMap;
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
  flushEffects();
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

export function createRoot(container) {
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
    },
    unmount() {
      if (rootVNode) {
        unmount(rootVNode, true);
        rootVNode = null;
      }
    }
  };
}

export const useLayoutEffect = useEffect;
export const createElement = h;
export const memo = (Comp) => Comp;
export const forwardRef = (renderFn) => (props) => renderFn(props, props?.ref);
export function cloneElement(vnode, extraProps = {}, ...children) {
  if (!vnode || typeof vnode !== 'object') return vnode;
  const mergedProps = { ...vnode.props, ...extraProps };
  if (children.length > 0) {
    mergedProps.children = children.length === 1 ? children[0] : children;
  }
  return h(vnode.type, mergedProps);
}
export function isValidElement(vnode) {
  return Boolean(vnode && typeof vnode === 'object' && 'type' in vnode && 'props' in vnode);
}
export const Children = {
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

export { h as __h, Fragment as __Fragment };
export default RuntimeDefault;
