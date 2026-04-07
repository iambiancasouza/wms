self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

function getNotificationPayload(event) {
  if (!event.data) {
    return null
  }

  try {
    return event.data.json()
  } catch {
    return {
      title: "Where's My Skincare",
      body: event.data.text(),
    }
  }
}

self.addEventListener('push', event => {
  const data = getNotificationPayload(event)

  if (!data) {
    return
  }

  const title = data.title || "Where's My Skincare"
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-192x192.png',
    data: {
      url: data.url || '/',
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  const targetUrl = new URL(
    event.notification.data?.url || '/',
    self.location.origin
  ).href

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus()
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl)
        }

        return undefined
      })
  )
})
