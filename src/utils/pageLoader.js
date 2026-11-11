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

export function loadPage(pageName, esModuleLoader) {
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
