Dragon Game Cafe 2026 UX and reliability specification.

Order flow: table QR -> mobile menu -> cart -> central server -> cashier/kitchen -> live status -> Zafaran bridge.

Keep right-side vertical categories on mobile and blue glassmorphism. Use large product photography, clear touch targets, lightweight feedback animations, and prefers-reduced-motion.

Operational requirements: unique table QR, product/category management, image upload, availability controls, kitchen display, cashier dashboard, export, idempotent order IDs, atomic server writes, single-order status endpoint, periodic sync now and SSE/WebSocket later.

PWA requirements: app shell caching and offline fallback; server remains source of truth for orders.

Security: set ADMIN_API_KEY in production; never store Zafaran secrets in the browser.

Zafaran: use a configurable bridge until the installed Zafaran edition exposes/accepts a verified integration method.

Research references: MDN PWA best practices and offline/background operation; 2026 QR-ordering and KDS guidance; digital-menu allergen guidance.