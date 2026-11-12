import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

/**
 * Page definitions: route page name -> entry JS module & CSS source files.
 */
const PAGE_CONFIG = {
  home: {
    entry: 'components/PublicPages/Home/Home.js',
    css: [
      'components/PublicPages/Home/Home.css',
      'components/PublicPages/Home/SubscribeModal.css'
    ]
  },
  catalog: {
    entry: 'components/PublicPages/Catalog/Catalog.js',
    css: ['components/PublicPages/Catalog/Catalog.css']
  },
  auth: {
    entry: 'components/PublicPages/Auth/Auth.js',
    css: ['components/PublicPages/Auth/Auth.css']
  },
  'google-auth': {
    entry: 'components/PublicPages/Auth/GoogleAuth.js',
    css: ['components/PublicPages/Auth/GoogleAuth.css']
  },
  basket: {
    entry: 'components/PublicPages/Basket/Basket.js',
    css: ['components/PublicPages/Basket/Basket.css']
  },
  rules: {
    entry: 'components/PublicPages/Rules/Rules.js',
    css: ['components/PublicPages/Rules/Rules.css']
  },
  reviews: {
    entry: 'components/PublicPages/Reviews/Reviews.js',
    css: [
      'components/PublicPages/Reviews/OrderSelectModal.css',
      'components/PublicPages/Reviews/WriteReviewModal.css',
      'components/PublicPages/Reviews/Reviews.css'
    ]
  },
  'error-page': {
    entry: 'components/PublicPages/ErrorPage/ErrorPage.js',
    css: ['components/PublicPages/ErrorPage/ErrorPage.css']
  },
  fortune: {
    entry: 'components/UserPages/Fortune/Fortune.js',
    css: ['components/UserPages/Fortune/Fortune.css']
  },
  profile: {
    entry: 'components/UserPages/Profile/Profile.js',
    css: [
      'components/UserPages/Profile/ChangePasswordModal.css',
      'components/UserPages/Profile/Profile.css'
    ]
  },
  addresses: {
    entry: 'components/UserPages/Addresses/Addresses.js',
    css: [
      'components/UserPages/Addresses/AddressModal.css',
      'components/UserPages/Addresses/Addresses.css'
    ]
  },
  'payment-methods': {
    entry: 'components/UserPages/PaymentMethods/PaymentMethods.js',
    css: [
      'components/UserPages/PaymentMethods/AddCardModal.css',
      'components/UserPages/PaymentMethods/PaymentMethods.css'
    ]
  },
  promos: {
    entry: 'components/UserPages/Promos/Promos.js',
    css: ['components/UserPages/Promos/Promos.css']
  },
  sessions: {
    entry: 'components/UserPages/Sessions/Sessions.js',
    css: ['components/UserPages/Sessions/Sessions.css']
  },
  order: {
    entry: 'components/UserPages/Order/Order.js',
    css: [
      'components/UserPages/Order/StripePaymentModal.css',
      'components/UserPages/Order/Order.css'
    ]
  },
  orders: {
    entry: 'components/UserPages/Orders/Orders.js',
    css: ['components/UserPages/Orders/Orders.css']
  },
  'user-reviews': {
    entry: 'components/UserPages/Reviews/Reviews.js',
    css: [
      'components/PublicPages/Reviews/OrderSelectModal.css',
      'components/PublicPages/Reviews/WriteReviewModal.css',
      'components/UserPages/Reviews/Reviews.css'
    ]
  },
  'admin-login': {
    entry: 'components/AdminPages/AdminLogin/AdminLogin.js',
    css: ['components/AdminPages/AdminLogin/AdminLogin.css']
  },
  'admin-dashboard': {
    entry: 'components/AdminPages/Dashboard/Dashboard.js',
    css: ['components/AdminPages/Dashboard/Dashboard.css']
  },
  'admin-products': {
    entry: 'components/AdminPages/Products/Products.js',
    css: ['components/AdminPages/Products/Products.css']
  },
  'admin-orders': {
    entry: 'components/AdminPages/Orders/Orders.js',
    css: ['components/AdminPages/Orders/Orders.css']
  },
  'admin-promos': {
    entry: 'components/AdminPages/Promos/Promos.js',
    css: ['components/AdminPages/Promos/Promos.css']
  },
  'admin-users': {
    entry: 'components/AdminPages/Users/Users.js',
    css: ['components/AdminPages/Users/Users.css']
  },
  'admin-database': {
    entry: 'components/AdminPages/Database/Database.js',
    css: ['components/AdminPages/Database/Database.css']
  },
  'admin-newsletter': {
    entry: 'components/AdminPages/Newsletter/Newsletter.js',
    css: ['components/AdminPages/Newsletter/Newsletter.css']
  },
  'admin-reviews': {
    entry: 'components/AdminPages/Reviews/Reviews.js',
    css: ['components/AdminPages/Reviews/Reviews.css']
  },
  'admin-logs': {
    entry: 'components/AdminPages/AdminLogs/AdminLogs.js',
    css: ['components/AdminPages/AdminLogs/AdminLogs.css']
  },
  'admin-footer': {
    entry: 'components/AdminPages/Footer/Footer.js',
    css: ['components/AdminPages/Footer/Footer.css']
  },
  cashbox: {
    entry: 'components/Cashbox/Cashbox.js',
    css: ['components/Cashbox/Cashbox.css']
  },
  'cashbox-history': {
    entry: 'components/Cashbox/History/CashboxHistory.js',
    css: [
      'components/Cashbox/Cashbox.css',
      'components/Cashbox/History/CashboxHistory.css'
    ]
  }
};

const CORE_CSS_FILES = [
  'index.css',
  'components/Elements/AdminTableActions.css',
  'components/Elements/ProfilePasswordModal.css',
  'components/Elements/RednestModal.css',
  'components/Elements/UserNavPills.css',
  'components/Footer/AppDownloadBanner.css',
  'components/Footer/Footer.css',
  'routes/AdminProtectedRoute.css',
  'components/AdminPages/AdminLayout/AdminLayout.css'
];

function resolveRel(fromRel, spec) {
  return path.posix.normalize(path.posix.join(path.posix.dirname(fromRel), spec));
}

function getModuleDependencies(relPath) {
  const code = fs.readFileSync(path.join(srcDir, relPath), 'utf8');
  const deps = [];
  for (const line of code.split(/\r?\n/)) {
    if (/^\s*import\b/.test(line)) {
      const m = line.match(/from\s+['"]([^'"]+)['"]/);
      if (m) deps.push(resolveRel(relPath, m[1]));
    } else if (relPath !== 'routes/AppRoutes.js') {
      const dynMatches = line.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g);
      for (const m of dynMatches) {
        deps.push(resolveRel(relPath, m[1]));
      }
    }
  }
  return [...new Set(deps)];
}

function collectClosure(entryRel, stopSet = new Set()) {
  const visited = new Set();
  const ordered = [];
  function visit(rel) {
    if (visited.has(rel) || stopSet.has(rel)) return;
    visited.add(rel);
    for (const dep of getModuleDependencies(rel)) {
      visit(dep);
    }
    ordered.push(rel);
  }
  visit(entryRel);
  return ordered;
}

function parseNamedSpecifiers(braceContent) {
  return braceContent
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/);
      return m ? { imported: m[1], local: m[2] } : { imported: part, local: part };
    });
}

function transformEsmToFactory(relPath) {
  const code = fs.readFileSync(path.join(srcDir, relPath), 'utf8');
  const lines = code.split(/\r?\n/);
  const outLines = [];
  const exportsToBind = [];
  let impIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Replace AppRoutes lazy ES-module fallback loaders with null in bundle mode
    if (relPath === 'routes/AppRoutes.js') {
      line = line.replace(/\(\)\s*=>\s*import\s*\(\s*['"][^'"]+['"]\s*\)/g, 'null');
    } else {
      line = line.replace(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (_, spec) => {
        const target = resolveRel(relPath, spec);
        return `Promise.resolve(__require(${JSON.stringify(target)}))`;
      });
    }

    // Handle static imports
    if (/^\s*import\b/.test(line)) {
      const trimmed = line.trim();
      let m;
      if ((m = trimmed.match(/^import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]\s*;?$/))) {
        const target = resolveRel(relPath, m[2]);
        outLines.push(`const ${m[1]} = __require(${JSON.stringify(target)});`);
        continue;
      }
      if ((m = trimmed.match(/^import\s+([A-Za-z_$][\w$]*)\s*,\s*\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]\s*;?$/))) {
        const target = resolveRel(relPath, m[3]);
        const tmp = `__imp_${impIdx++}`;
        const named = parseNamedSpecifiers(m[2])
          .map(({ imported, local }) => (imported === local ? imported : `${imported}: ${local}`))
          .join(', ');
        outLines.push(`const ${tmp} = __require(${JSON.stringify(target)});`);
        outLines.push(`const ${m[1]} = ${tmp}.default !== undefined ? ${tmp}.default : ${tmp};`);
        if (named) outLines.push(`const { ${named} } = ${tmp};`);
        continue;
      }
      if ((m = trimmed.match(/^import\s+\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]\s*;?$/))) {
        const target = resolveRel(relPath, m[2]);
        const named = parseNamedSpecifiers(m[1])
          .map(({ imported, local }) => (imported === local ? imported : `${imported}: ${local}`))
          .join(', ');
        if (named) outLines.push(`const { ${named} } = __require(${JSON.stringify(target)});`);
        continue;
      }
      if ((m = trimmed.match(/^import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]\s*;?$/))) {
        const target = resolveRel(relPath, m[2]);
        const tmp = `__imp_${impIdx++}`;
        outLines.push(`const ${tmp} = __require(${JSON.stringify(target)});`);
        outLines.push(`const ${m[1]} = ${tmp}.default !== undefined ? ${tmp}.default : ${tmp};`);
        continue;
      }
      if ((m = trimmed.match(/^import\s+['"]([^'"]+)['"]\s*;?$/))) {
        const target = resolveRel(relPath, m[1]);
        outLines.push(`__require(${JSON.stringify(target)});`);
        continue;
      }
      throw new Error(`Unsupported import syntax in ${relPath}:${i + 1}: ${line}`);
    }

    // Handle exports
    if (/^\s*export\b/.test(line)) {
      const trimmed = line.trim();
      let m;
      if ((m = trimmed.match(/^export\s+default\s+([A-Za-z_$][\w$]*)\s*;?$/))) {
        exportsToBind.push({ exported: 'default', local: m[1] });
        continue;
      }
      if ((m = trimmed.match(/^export\s+\{([^}]*)\}\s*;?$/))) {
        for (const { imported, local } of parseNamedSpecifiers(m[1])) {
          exportsToBind.push({ exported: local, local: imported });
        }
        continue;
      }
      if ((m = line.match(/^(\s*)export\s+(async\s+function|function|class|const|let|var)\s+([A-Za-z_$][\w$]*)(.*)$/))) {
        exportsToBind.push({ exported: m[3], local: m[3] });
        outLines.push(`${m[1]}${m[2]} ${m[3]}${m[4]}`);
        continue;
      }
      throw new Error(`Unsupported export syntax in ${relPath}:${i + 1}: ${line}`);
    }

    outLines.push(line);
  }

  for (const { exported, local } of exportsToBind) {
    outLines.push(
      `Object.defineProperty(exports, ${JSON.stringify(exported)}, { enumerable: true, get: function () { return ${local}; } });`
    );
  }

  const indented = outLines.map((l) => (l ? `\t\t${l}` : '')).join('\n');
  return `\t//#region ${relPath}\n\t__define(${JSON.stringify(relPath)}, function (exports, __require, module) {\n${indented}\n\t});\n\t//#endregion`;
}

function buildCssBundle(cssFiles) {
  return cssFiles
    .map((rel) => {
      const fullPath = path.join(srcDir, rel);
      const content = fs.readFileSync(fullPath, 'utf8').trimEnd();
      return `/* === ${rel} === */\n${content}`;
    })
    .join('\n\n') + '\n';
}

function main() {
  // 1. Compute Core JS module set (from main.js + any module shared across >= 2 pages)
  const coreSet = new Set(collectClosure('main.js'));
  const pageClosures = {};
  const modulePageCounts = new Map();

  for (const [pageName, cfg] of Object.entries(PAGE_CONFIG)) {
    const closure = collectClosure(cfg.entry, coreSet);
    pageClosures[pageName] = closure;
    for (const mod of closure) {
      modulePageCounts.set(mod, (modulePageCounts.get(mod) || 0) + 1);
    }
  }

  let promoted = true;
  while (promoted) {
    promoted = false;
    for (const [mod, count] of modulePageCounts.entries()) {
      if (count >= 2 && !coreSet.has(mod)) {
        for (const dep of collectClosure(mod, coreSet)) {
          if (!coreSet.has(dep)) {
            coreSet.add(dep);
            promoted = true;
          }
        }
      }
    }
  }

  // Order core modules topologically (dependencies before dependents)
  const coreOrdered = [];
  const coreVisited = new Set();
  function visitCore(rel) {
    if (coreVisited.has(rel) || !coreSet.has(rel)) return;
    coreVisited.add(rel);
    for (const dep of getModuleDependencies(rel)) {
      visitCore(dep);
    }
    coreOrdered.push(rel);
  }
  for (const mod of coreSet) {
    if (mod !== 'main.js') visitCore(mod);
  }
  visitCore('main.js');

  // 2. Write src/app.core.js
  const coreModulesCode = coreOrdered.map((rel) => transformEsmToFactory(rel)).join('\n\n');
  const coreOutput = `(function () {
\tvar __mods = (window.__SUFRANO_MODULES__ = window.__SUFRANO_MODULES__ || {});
\tvar __cache = (window.__SUFRANO_CACHE__ = window.__SUFRANO_CACHE__ || {});
\twindow.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {};
\twindow.__SUFRANO_USE_PAGE_BUNDLES__ = true;

\tfunction __define(id, factory) {
\t\t__mods[id] = factory;
\t}

\tfunction __require(id) {
\t\tif (__cache[id]) return __cache[id].exports;
\t\tvar factory = __mods[id];
\t\tif (!factory) throw new Error("Module not found: " + id);
\t\tvar module = { exports: {} };
\t\t__cache[id] = module;
\t\tfactory(module.exports, __require, module);
\t\treturn module.exports;
\t}

\twindow.__SUFRANO_DEFINE__ = __define;
\twindow.__SUFRANO_REQUIRE__ = __require;

${coreModulesCode}

\t__require("main.js");
})();
`;
  fs.writeFileSync(path.join(srcDir, 'app.core.js'), coreOutput, 'utf8');

  // 3. Prepare clean output directories for per-page JS and CSS
  const pagesJsDir = path.join(srcDir, 'pages');
  const pagesCssDir = path.join(srcDir, 'styles', 'pages');
  fs.rmSync(pagesJsDir, { recursive: true, force: true });
  fs.rmSync(pagesCssDir, { recursive: true, force: true });
  fs.mkdirSync(pagesJsDir, { recursive: true });
  fs.mkdirSync(pagesCssDir, { recursive: true });

  // 4. Write per-page JS and CSS files
  for (const [pageName, cfg] of Object.entries(PAGE_CONFIG)) {
    const pageMods = collectClosure(cfg.entry, coreSet);
    const pageModulesCode = pageMods.map((rel) => transformEsmToFactory(rel)).join('\n\n');
    const pageJsOutput = `(function () {
\tvar __define = window.__SUFRANO_DEFINE__;
\tvar __require = window.__SUFRANO_REQUIRE__;
\tvar __pages = (window.__SUFRANO_PAGES__ = window.__SUFRANO_PAGES__ || {});

${pageModulesCode}

\tvar entryExports = __require(${JSON.stringify(cfg.entry)});
\t__pages[${JSON.stringify(pageName)}] = entryExports.default || entryExports;
})();
`;
    fs.writeFileSync(path.join(pagesJsDir, `${pageName}.js`), pageJsOutput, 'utf8');
    fs.writeFileSync(path.join(pagesCssDir, `${pageName}.css`), buildCssBundle(cfg.css), 'utf8');
  }

  // 5. Write src/styles/core.css
  fs.writeFileSync(path.join(srcDir, 'styles', 'core.css'), buildCssBundle(CORE_CSS_FILES), 'utf8');

  console.log(`Built app.core.js (${coreOrdered.length} core modules), styles/core.css, and ${Object.keys(PAGE_CONFIG).length} per-page JS & CSS files.`);
  console.log('Core modules promoted from shared pages:', [...coreSet].filter((m) => !collectClosure('main.js').includes(m)));
}

main();
