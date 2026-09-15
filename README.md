# Aya's Manual — Local Prototype

مشروع محلي كامل لمتجر "Aya's Manual" للكروشيه اليدوي، مبني على تصميم ملف `ayas-manual-3.html` الأصلي (نفس الألوان، الخطوط، ودعم عربي/إنجليزي RTL/LTR)، بالإضافة للوحة تحكم أدمين كاملة لإدارة المتجر. المشروع مقسّم لفولدرين مستقلين:

```
bakar/
├── backend/    # Express + TypeScript API، بيانات مخزنة في ملفات JSON محلية
└── frontend/   # Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
```

لا يوجد قاعدة بيانات حقيقية أو نشر (deployment) في هذه المرحلة — فقط تشغيل محلي، مع هيكلة الباك إند بحيث يسهل التبديل لقاعدة بيانات حقيقية لاحقاً بدون تعديل الـ routes.

---

## المتطلبات

- **Node.js 18.18 أو أحدث** (مطلوب لـ Next.js 16 و React 19) — تأكد إنه متثبت ومتاح في الـ PATH (`node -v`, `npm -v`).

---

## 1) تشغيل الباك إند (Backend)

```powershell
cd backend
npm install
npm run seed     # يملأ orders.json و custom-orders.json ببيانات تجريبية واقعية
npm run dev
```

هيشتغل السيرفر على `http://localhost:4000` (البورت قابل للتعديل من `.env`).

> ملف `backend/.env` موجود بالفعل ببيانات دخول تجريبية جاهزة (شوفي قسم "حساب الأدمين" تحت). لو مسحتيه أو عايزة تبدئي من جديد، انسخي `.env.example` وحطي فيه قيمك.

### الـ Endpoints العامة (Public)

| Method | Path                  | الوظيفة                                              |
| ------ | --------------------- | ----------------------------------------------------- |
| GET    | `/api/health`         | فحص إن السيرفر شغال                                   |
| GET    | `/api/products`       | إرجاع كل المنتجات                                     |
| GET    | `/api/categories`     | إرجاع كل التصنيفات                                    |
| GET    | `/api/settings`       | بيانات الدفع (إنستاباي/فودافون كاش) لصفحة الـ Checkout |
| POST   | `/api/orders`         | حفظ طلب شراء عادي (JSON)                              |
| POST   | `/api/custom-orders`  | حفظ طلب خاص + صورة مرفوعة (`multipart/form-data`)     |

### الـ Endpoints الخاصة بالأدمين (Protected — محتاجة تسجيل دخول)

| Method | Path                              | الوظيفة                                    |
| ------ | --------------------------------- | ------------------------------------------- |
| POST   | `/api/admin/login`                | تسجيل الدخول (يرجّع JWT في httpOnly cookie) |
| POST   | `/api/admin/logout`               | تسجيل الخروج                                |
| GET    | `/api/admin/me`                   | بيانات الأدمين الحالي (للتحقق من الجلسة)   |
| GET    | `/api/admin/stats`                | إحصائيات سريعة للوحة التحكم                |
| GET/POST | `/api/admin/products`           | عرض/إضافة منتج (الإضافة `multipart/form-data` مع صورة اختيارية) |
| PUT/DELETE | `/api/admin/products/:id`      | تعديل/حذف منتج                              |
| GET/POST | `/api/admin/categories`         | عرض/إضافة فئة                               |
| PUT/DELETE | `/api/admin/categories/:key`   | تعديل/حذف فئة (ممنوع حذف فئة مرتبطة بمنتجات، أو فئة "الكل") |
| GET    | `/api/admin/orders`               | كل طلبات الشراء                             |
| PATCH  | `/api/admin/orders/:id`           | تحديث حالة الطلب (`pending`/`confirmed`/`shipped`) |
| GET    | `/api/admin/custom-orders`        | كل الطلبات الخاصة                           |
| PATCH  | `/api/admin/custom-orders/:id`    | تحديث الحالة و/أو الملاحظة الداخلية        |
| GET/PUT | `/api/admin/settings`            | عرض/تعديل رقم إنستاباي وفودافون كاش        |

الصور المرفوعة (طلبات خاصة + صور منتجات) بتتخزن في `backend/uploads/` وبتتقرأ عبر `http://localhost:4000/uploads/<filename>`.

### حساب الأدمين

بيانات تجريبية جاهزة في `backend/.env`:

```
البريد:      admin@ayasmanual.com
كلمة المرور: Ayas@Admin123
```

⚠️ **غيّري كلمة المرور دي** قبل ما توري المشروع لأي حد أو ترفعيه أونلاين. لتوليد هاش جديد لكلمة مرور جديدة:

```powershell
cd backend
npm run hash-password -- "كلمة-المرور-الجديدة"
```

انسخي الناتج والصقيه في `backend/.env` بدل `ADMIN_PASSWORD_HASH`.

### هيكلة الباك إند (ليه سهل تبديل قاعدة البيانات لاحقاً)

- `src/services/StorageService.ts` — الواجهة (interface) العامة لأي مصدر بيانات (`getAll`, `getById`, `create`, `update`, `remove`).
- `src/services/JSONStorageService.ts` — التنفيذ الحالي: بيقرأ/يكتب في ملفات JSON تحت `backend/data/`.
- `src/services/ProductService.ts` / `CategoryService.ts` / `OrderService.ts` / `CustomOrderService.ts` — كل واحدة بتستخدم `JSONStorageService` لملف مختلف.
- `src/services/SettingsService.ts` — كائن إعدادات واحد (مش array) في `data/settings.json`.
- لما تحب تنتقل لقاعدة بيانات حقيقية (مثلاً PostgreSQL + Prisma)، هتعمل كلاس جديد زي `PrismaStorageService` يطبّق نفس `StorageService` interface، وتستبدله في ملفات الـ `*Service.ts` بس — من غير أي تعديل في الـ routes أو الـ controllers.
- `src/middleware/requireAdmin.ts` — بيتحقق من JWT في الكوكي `admin_token` قبل أي مسار أدمين.

### بيانات JSON

- `data/products.json` — نفس الـ 10 منتجات من التصميم الأصلي (bilingual: `ar`/`en`)، وكل منتج ممكن يكون له `image` حقيقية (لو اتضافت من الأدمين) أو من غيرها بيظهر شكل أيقوني بلون مميز.
- `data/categories.json` — التصنيفات (الكل، حقائب، اسكارف، اكسسوارات، ديكور، كارديجان) — فئة "الكل" أساسية ومحمية من التعديل/الحذف.
- `data/orders.json` / `data/custom-orders.json` — بيتملوا تلقائيًا من المتجر، ومبدئيًا معبيين ببيانات تجريبية عبر `npm run seed`.
- `data/settings.json` — رقم إنستاباي وفودافون كاش (بتتولد تلقائيًا بقيم افتراضية أول مرة).

### إعادة تعبئة البيانات التجريبية

`npm run seed` بيعمل overwrite لـ `orders.json` و`custom-orders.json` بـ 4 طلبات و3 طلبات خاصة (باستخدام صور placeholder بيتم توليدها برمجيًا، مش ملفات حقيقية) — شغّليه وقت ما حابة ترجعي لبيانات ديمو نضيفة.

---

## 2) تشغيل الفرونت إند (Frontend)

في تيرمينال تاني (مع سيبان الباك إند شغال):

```powershell
cd frontend
npm install
npm run dev
```

هيشتغل الموقع على `http://localhost:3000`.

### صفحات المتجر (عامة)

- `/` — الصفحة الرئيسية: Hero، شريط القيم، المتجر (فلترة تصنيفات + منتجات من الـ API)، قصتنا، طلب خاص (رفع صورة)، نشرة بريدية.
- `/checkout` — صفحة إتمام الطلب: ملخص السلة، بيانات التوصيل، اختيار طريقة الدفع (إنستاباي / فودافون كاش، الأرقام بتيجي مباشرة من إعدادات الأدمين) ثم إرسال الطلب لـ الباك إند.

### لوحة تحكم الأدمين

- `/admin/login` — تسجيل الدخول.
- `/admin` — نظرة عامة (عدد الطلبات الجديدة، الطلبات الخاصة الجديدة، عدد المنتجات).
- `/admin/products` — جدول المنتجات + فورم إضافة/تعديل (بما فيه رفع صورة حقيقية اختيارية) + تأكيد قبل الحذف.
- `/admin/categories` — إضافة/تعديل/حذف الفئات.
- `/admin/orders` — كل طلبات الشراء مع Dropdown لتغيير الحالة.
- `/admin/custom-orders` — كل الطلبات الخاصة، الصورة المرفقة بحجم واضح، ملاحظة داخلية، Dropdown لتغيير الحالة.
- `/admin/settings` — تعديل رقم إنستاباي وفودافون كاش (بتنعكس فورًا على صفحة الـ Checkout).

لوحة الأدمين بالعربي بس دايمًا (مفيش تبديل لغة)، بغض النظر عن اللغة المختارة في المتجر.

### إدارة الحالة

- **اللغة**: `src/context/LangContext.tsx` (للمتجر فقط) — بيتحكم في `dir`/`lang` على مستوى `<html>` وبيغيّر النصوص عبر دالة `t(key)`. اختيار اللغة بيتحفظ في `localStorage`.
- **السلة**: `src/context/CartContext.tsx` — عربة تسوق محلية، بتتحفظ في `localStorage`.
- **التنبيهات (Toast)**: `src/context/ToastContext.tsx` — مشتركة بين المتجر ولوحة الأدمين.
- **جلسة الأدمين**: `src/context/AdminAuthContext.tsx` — بتتحقق من `/api/admin/me` عند التحميل، وبتحوّل تلقائيًا لصفحة اللوجين لو مفيش جلسة صالحة.

### هيكل الصفحات (App Router)

استخدمنا route group `(site)` عشان نفصل شكل المتجر (Header/Footer/Cart) عن شكل لوحة الأدمين (Sidebar/Topbar) بدون ما يأثر على الروابط:

```
src/app/
├── layout.tsx              # Root: fonts + Toast فقط
├── (site)/
│   ├── layout.tsx          # Header + Footer + Cart (Lang/Cart providers)
│   ├── page.tsx            # الصفحة الرئيسية "/"
│   └── checkout/page.tsx   # "/checkout"
└── admin/
    ├── layout.tsx          # يفرض عربي/RTL + AdminAuthProvider
    ├── login/page.tsx      # "/admin/login"
    └── (dashboard)/
        ├── layout.tsx      # يتحقق من تسجيل الدخول، Sidebar + Topbar
        ├── page.tsx        # "/admin"
        ├── products/page.tsx
        ├── categories/page.tsx
        ├── orders/page.tsx
        ├── custom-orders/page.tsx
        └── settings/page.tsx
```

### ملحوظة عن اللوجو

اللوجو (base64 JPEG) اللي كان متضمن جوه ملف الـ HTML الأصلي اتبدّل بشعار SVG بسيط بنفس روح التصميم (نفس الألوان والدوائر المتداخلة زي رسمة الـ Hero)، بدل نسخ نص base64 ضخم يدويًا جوه الكود. لو عندك ملف اللوجو الحقيقي، حطه في `frontend/public/logo.png` (أو `.svg`) واستبدل محتوى `frontend/src/components/Logo.tsx` بـ `<Image src="/logo.png" ... />`.

---

## 3) اختبار سريع بعد التشغيل

**المتجر:**
1. افتح `http://localhost:3000` — المفروض تشوف المنتجات محمّلة من الباك إند.
2. جربي فلترة التصنيفات، فتح تفاصيل منتج، وإضافته للسلة.
3. غيّري اللغة من الزرار في الهيدر (AR/EN) وشوفي إن الاتجاه بيتقلب RTL/LTR صح.
4. افتحي "طلب خاص"، ارفعي صورة، واملي البيانات وابعتي.
5. ضيفي منتجات للسلة وروحي `Checkout`، املي بيانات التوصيل وابعتي.

**لوحة الأدمين:**
1. افتحي `http://localhost:3000/admin` — المفروض تتحولي تلقائيًا لصفحة اللوجين.
2. سجّلي دخول بالبيانات التجريبية (فوق).
3. من `/admin` هتشوفي إحصائيات فيها أرقام حقيقية (لو شغّلتي `npm run seed`).
4. من `/admin/products` جربي إضافة منتج جديد بصورة، وتعديله، وحذفه.
5. من `/admin/orders` و`/admin/custom-orders` غيّري حالة أي طلب وشوفي التحديث فورًا.
6. من `/admin/settings` غيّري رقم فودافون كاش، وارجعي لصفحة `/checkout` في المتجر وشوفي إن الرقم اتغيّر.

---

## 4) متغيرات البيئة (Environment Variables)

### `backend/.env`
```
PORT=4000
CORS_ORIGIN=http://localhost:3000

ADMIN_EMAIL=admin@ayasmanual.com
ADMIN_PASSWORD_HASH=<bcrypt hash>
JWT_SECRET=<سلسلة عشوائية طويلة>
```

### `frontend/.env.example`
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

لما تنتقل للاستضافة (hosting) لاحقًا:
- غيّري `NEXT_PUBLIC_API_BASE_URL` على رابط الباك إند المنشور، و`CORS_ORIGIN` على رابط الفرونت إند المنشور.
- غيّري `JWT_SECRET` و`ADMIN_PASSWORD_HASH` لقيم حقيقية جديدة (متستخدميش القيم التجريبية دي في أي بيئة حقيقية).
- فعّلي `secure: true` على كوكي الأدمين (بيحصل تلقائيًا لما `NODE_ENV=production` مع https).

---

## اللي لسه ناقص (لو حبيتي نكمل فيه)

- **Authentication لعميلات المتجر** — حاليًا مفيش تسجيل دخول للعميلة نفسها لمتابعة طلباتها (بس الأدمين بس).
- **قاعدة بيانات حقيقية** — الانتقال من JSON files لـ PostgreSQL/MySQL (مع Prisma مثلاً)، الهيكلة الحالية مُجهزة لده بالفعل.
- **نشر (Deployment)** — رفع الباك إند (مثلاً على Render/Railway) والفرونت إند (مثلاً على Vercel)، وربط دومين حقيقي.
- **دفع إلكتروني حقيقي** — حاليًا الدفع بيتم يدويًا (تحويل بنكي/محفظة + رقم عملية يراجعه الأدمين)، ولو حبيتي لاحقًا تدمجي بوابة دفع فعلية (Paymob, Fawry, إلخ).
- **صلاحيات متعددة** — حاليًا أدمين واحد بس؛ لو احتجتي أكتر من مستخدم بصلاحيات مختلفة محتاجين نظام مستخدمين حقيقي بدل حساب واحد في `.env`.

قولّي إمتى تحب تبدأ في أي من النقط دي وهنكمل خطوة بخطوة.
