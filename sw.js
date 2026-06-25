// Service Worker حقيقي - إتقان SRS Pro
// يجب أن يكون ملفاً منفصلاً (لا Blob) ليعمل تثبيت PWA والتنبيهات

self.addEventListener('install', function(e) {
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(self.clients.claim());
});

// fetch فارغ - مطلوب فقط ليعتبره المتصفح PWA صالحاً
self.addEventListener('fetch', function(e) {});

// النقر على التنبيه - يفتح التطبيق
self.addEventListener('notificationclick', function(e) {
    e.notification.close();
    e.waitUntil(
        self.clients.matchAll({ type: 'window' }).then(function(list) {
            for (var i = 0; i < list.length; i++) {
                var c = list[i];
                if (c.url && 'focus' in c) return c.focus();
            }
            if (self.clients.openWindow) return self.clients.openWindow('./');
        })
    );
});

// جدولة التنبيهات
self.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'SCHEDULE') {
        var delay = e.data.delay || 0;
        setTimeout(function() {
            self.registration.showNotification(e.data.title || 'إتقان SRS Pro', {
                body: e.data.body || 'لديك بطاقات تحتاج مراجعة',
                icon: e.data.icon,
                badge: e.data.icon,
                tag: 'srs-due',
                renotify: true,
                dir: 'rtl',
                lang: 'ar'
            });
        }, delay);
    }
});
