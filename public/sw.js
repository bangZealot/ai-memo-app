const CACHE_NAME = 'ai-memo-app-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // API 요청(서버 액션)은 캐시하지 않고 네트워크 우선
  if (url.pathname.startsWith('/_next/') || url.pathname.includes('action')) {
    event.respondWith(fetch(event.request))
    return
  }

  // 나머지는 네트워크 우선, 실패 시 캐시 응답
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const cloned = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned))
        return response
      })
      .catch(() => caches.match(event.request))
  )
})
