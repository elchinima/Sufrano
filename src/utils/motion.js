// Pure Vanilla JS Animation Wrapper for Süfrano (Zero Framer Motion dependency)
import { h, Fragment } from './runtime.js';

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
    const animObj = resolveVariant(props?.animate, props?.variants);
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

export const motion = new Proxy(
  {},
  {
    get(_, prop) {
      return createMotionTag(String(prop));
    }
  }
);

export function AnimatePresence({ children }) {
  if (Array.isArray(children)) {
    return h(Fragment, null, ...children);
  }
  return children ?? null;
}
