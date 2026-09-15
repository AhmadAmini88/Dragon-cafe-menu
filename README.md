# Dragon Game Café — QR Menu & Order System

پروژه منوی دیجیتال و سفارش‌گیری Dragon Game Café.

## بخش‌ها

- `game-cafe-menu-3.html` — نسخه اصلی منو
- `dragon-cafe-server/` — Backend مرکزی سفارش‌ها
- `docs/ARCHITECTURE_FA.md` — معماری و جریان سیستم
- `docs/UI_MOTION_SPEC_FA.md` — استاندارد اکشن‌ها و Timeline
- `prototypes/dragon-motion-timeline-demo.html` — دموی تعاملی Motion/Timeline

## جریان محصول

QR میز → منوی موبایل → سبد خرید → ثبت سفارش → Backend مرکزی → پنل حسابدار/آشپزخانه → Bridge زعفران

## UX تصمیم‌های اصلی

منوی موبایل باید دسته‌بندی‌ها را در ستون ثابت سمت راست نگه دارد. کارت‌های محصول Glassmorphism هستند، عکس محصول اولویت بصری دارد و انیمیشن‌ها کوتاه و کاربردی‌اند. Timeline برای پیگیری سفارش استفاده می‌شود.

## اجرای Backend

```bash
cd dragon-cafe-server
node server.js
```

سپس در پنل مدیریت، آدرس سرور را به شکل `http://SERVER:8080` تنظیم کن.

## زعفران

اتصال مستقیم از مرورگر به نرم‌افزار حسابداری توصیه نمی‌شود. از Bridge استفاده شود و endpoint واقعی براساس نسخه نصب‌شده زعفران تنظیم گردد.
