// Service Worker 版本（提升首页更新与离线体验）
const CACHE_NAME = 'whattoeat-v1.0.2';
const urlsToCache = [
  '/whattoeat/',
  '/whattoeat/index.html'
];

// 安装事件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 获取事件：
// - 首页与导航请求采用网络优先，保证获取最新 index.html
// - 其他资源采用缓存优先，未命中则回源
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  const isNavigate = req.mode === 'navigate';
  const isIndex = url.pathname === '/whattoeat/' || url.pathname.endsWith('/whattoeat/index.html');
  
  if (isNavigate || isIndex) {
    event.respondWith(
      fetch(req).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return resp;
      }).catch(() => caches.match(req))
    );
    return;
  }
  
  event.respondWith(
    caches.match(req).then(response => response || fetch(req))
  );
});

// 激活事件：清理旧版本缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => {
        if (!cacheWhitelist.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});