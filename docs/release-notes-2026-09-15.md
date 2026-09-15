## 2026-09-15

- Reviewed the QR ordering architecture and current menu source.
- Added reliability specification for mobile-first QR ordering, kitchen/cashier flow, idempotency, server-side source of truth, PWA/offline shell, security and Zafaran bridge.
- Hardened `dragon-cafe-server/server.js` with single-order tracking, idempotent order creation, validated statuses and atomic JSON writes.
- Added `manifest.webmanifest` and `sw.js` for a basic installable/offline-capable PWA shell.
- Local enhanced build contains right-side mobile categories, larger product media, glass blue UI, motion feedback and customer order timeline.
