const CACHE_PREFIX = "shogakusei-sansu-navi-ipad-";
const CACHE_NAME = `${CACHE_PREFIX}v14`;
const SW_BASE_URL = new URL("./", self.location.href);

function normalizeSwAssetPath(path) {
  return String(path || "")
    .replace(/\\/g, "/")
    .replace(/^(?:\.\/)+/, "")
    .replace(/^\/+/, "");
}

function resolveSwAssetUrl(path) {
  return new URL(normalizeSwAssetPath(path), SW_BASE_URL).href;
}

const APP_SHELL_PATHS = [
  "",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "images/teacher-character.png",
  "images/teacher-correct.png",
  "images/teacher-incorrect.png",
  "images/teacher-evolution/teacher_level_01.webp",
  "images/teacher-evolution/teacher_level_15.webp",
  "images/teacher-evolution/teacher_level_30.webp",
  "images/teacher-evolution/teacher_level_45.webp",
  "images/teacher-evolution/teacher_level_60.webp",
  "images/teacher-evolution/teacher_level_80.webp",
  "images/teacher-evolution/teacher_level_99.webp"
];

const APP_ROOT_URL = resolveSwAssetUrl("");
const INDEX_URL = resolveSwAssetUrl("index.html");
const APP_SHELL_URLS = APP_SHELL_PATHS.map(resolveSwAssetUrl);

function extractIndexAssetUrls(html) {
  const urls = [];
  const pattern = /\b(?:src|href)=["']([^"']+)["']/g;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const path = normalizeSwAssetPath(match[1]);
    if (path.startsWith("assets/")) urls.push(resolveSwAssetUrl(path));
  }
  return [...new Set(urls)];
}

async function cacheRequiredAssets(cache, urls) {
  for (const url of urls) {
    const request = new Request(url, { cache: "reload" });
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`[PWA] Failed to cache ${url}: ${response.status}`);
    }
    await cache.put(request, response);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cacheRequiredAssets(cache, APP_SHELL_URLS);

    const cachedIndex = await cache.match(INDEX_URL);
    if (cachedIndex) {
      const html = await cachedIndex.text();
      await cacheRequiredAssets(cache, extractIndexAssetUrls(html));
    }

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await Promise.all([
            cache.put(INDEX_URL, response.clone()),
            cache.put(APP_ROOT_URL, response.clone()),
          ]);
        }
        return response;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(INDEX_URL))
          || (await cache.match(APP_ROOT_URL))
          || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return Response.error();
    }
  })());
});
