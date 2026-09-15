# Aya's Manual

متجر "Aya's Manual" للكروشيه اليدوي — تطبيق **واحد** (Next.js) فيه المتجر ولوحة تحكم الأدمين والـ API كلهم مع بعض. مفيش سيرفر منفصل، مفيش تشغيل تيرمينالين، ديبلوي واحد بس.

مشروع Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 واحد، في جذر الريبو مباشرة — مفيش فولدر فرعي، عشان Vercel يتعرف عليه كـ Next.js تلقائيًا من غير أي إعداد إضافي.

- **البيانات**: Postgres حقيقي (Neon) عبر Prisma.
- **الصور** (منتجات + طلبات خاصة): Cloudflare R2.
- **الديبلوي**: مشروع Vercel واحد بس — مفيش CORS ولا مشاكل كوكيز عبر الدومينات، لأن كل حاجة نفس السيرفر.

---

## المتطلبات

- **Node.js 18.18 أو أحدث** — تأكد إنه متثبت (`node -v`, `npm -v`).
- **قاعدة بيانات Postgres** (مربوطة بـ [Neon](https://neon.tech) حاليًا).
- **حساب Cloudflare** ببكت R2 مفعّل عليه Public Access.

---

## 1) التشغيل محليًا

```powershell
npm install
npx prisma db push   # يجهّز الجداول في القاعدة (مرة واحدة، أو بعد أي تعديل في schema.prisma)
npm run seed          # يملأ القاعدة بمنتجات/فئات/طلبات تجريبية واقعية
npm run dev
```

هيشتغل الموقع كامل (المتجر + الأدمين + الـ API) على `http://localhost:3000` — **تيرمينال واحد بس**.

> ملف `.env` موجود بالفعل ببيانات جاهزة (شوفي قسم "حساب الأدمين" تحت).

### حساب الأدمين

```
البريد:      admin@ayasmanual.com
كلمة المرور: Ayas@Admin123
```

⚠️ **غيّري كلمة المرور دي** قبل ما توري المشروع لأي حد أو ترفعيه أونلاين:

```powershell
npm run hash-password -- "كلمة-المرور-الجديدة"
```

انسخي الناتج والصقيه في `.env` بدل `ADMIN_PASSWORD_HASH`.

⚠️ **مهم جدًا**: أي `$` في الهاش لازم يتكتب `\$` (يعني `\$2a\$10\$...`) — Next.js بيعمل توسيع لمتغيرات `$VAR` في ملفات `.env`، وهاشات bcrypt مليانة علامات `$`. لو نسيتي تعمليها escape، تسجيل الدخول هيفشل بصمت من غير أي رسالة خطأ واضحة.

---

## 2) هيكل المشروع

```
├── prisma/
│   └── schema.prisma          # Product, Category, Order, CustomOrder, Settings
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root: fonts + Toast
│   │   ├── (site)/            # المتجر (Header/Footer/Cart)
│   │   │   ├── page.tsx       # "/"
│   │   │   └── checkout/      # "/checkout"
│   │   ├── admin/             # لوحة التحكم (عربي/RTL دايمًا)
│   │   │   ├── login/
│   │   │   └── (dashboard)/   # المنتجات، الفئات، الطلبات، الإعدادات...
│   │   └── api/                # كل الـ API routes (بديل الباك إند القديم)
│   │       ├── products/, categories/, settings/, orders/, custom-orders/  (عامة)
│   │       └── admin/          # محمية بـ withAdmin (login/logout عامة)
│   ├── server/                 # كود السيرفر بس (يشتغل جوه الـ Route Handlers فقط)
│   │   ├── prisma.ts           # Prisma Client singleton
│   │   ├── r2.ts                # رفع/حذف الصور على Cloudflare R2
│   │   ├── adminAuth.ts        # JWT + كوكي الأدمين + withAdmin() wrapper
│   │   └── services/            # منطق البيانات (Product/Category/Order/...)
│   ├── scripts/                 # seed.ts, generateAdminHash.ts (تشغيل بـ tsx)
│   ├── components/              # مكونات الواجهة (متجر + أدمين)
│   ├── context/                  # Lang / Cart / Toast / AdminAuth
│   └── lib/                      # types + دوال fetch من جانب المتصفح
```

### ليه مفيش باك إند منفصل

كانت الفكرة الأولى تشغيل باك إند Express جنب الفرونت إند، لكن ده معناه ديبلويين منفصلين على Vercel وكوكيز عبر دومينين مختلفين (تعقيد إضافي من غير داعي). دلوقتي كل منطق الـ API اتحوّل لـ **Next.js Route Handlers** — نفس الداتابيز، نفس الـ R2، بس شغالين جوه نفس تطبيق Next.js. النتيجة: ديبلوي واحد، دومين واحد، تيرمينال واحد للتشغيل المحلي.

### الـ Endpoints العامة (Public)

| Method | Path                  | الوظيفة                                              |
| ------ | --------------------- | ----------------------------------------------------- |
| GET    | `/api/health`         | فحص إن السيرفر شغال                                   |
| GET    | `/api/products`       | إرجاع كل المنتجات                                     |
| GET    | `/api/categories`     | إرجاع كل التصنيفات                                    |
| GET    | `/api/settings`       | بيانات الدفع (إنستاباي/فودافون كاش) لصفحة الـ Checkout |
| POST   | `/api/orders`         | حفظ طلب شراء عادي                                     |
| POST   | `/api/custom-orders`  | حفظ طلب خاص + صورة مرفوعة (`multipart/form-data`)     |

### الـ Endpoints الخاصة بالأدمين (محتاجة تسجيل دخول)

| Method | Path                              | الوظيفة                                    |
| ------ | --------------------------------- | ------------------------------------------- |
| POST   | `/api/admin/login`                | تسجيل الدخول (كوكي httpOnly)                |
| POST   | `/api/admin/logout`               | تسجيل الخروج                                |
| GET    | `/api/admin/me`                   | بيانات الأدمين الحالي                       |
| GET    | `/api/admin/stats`                | إحصائيات لوحة التحكم                        |
| GET/POST | `/api/admin/products`           | عرض/إضافة منتج (صورة اختيارية)              |
| PUT/DELETE | `/api/admin/products/:id`      | تعديل/حذف منتج                              |
| GET/POST | `/api/admin/categories`         | عرض/إضافة فئة                               |
| PUT/DELETE | `/api/admin/categories/:key`   | تعديل/حذف فئة (ممنوع حذف فئة مرتبطة بمنتجات أو فئة "الكل") |
| GET    | `/api/admin/orders`               | كل طلبات الشراء                             |
| PATCH  | `/api/admin/orders/:id`           | تحديث حالة الطلب                            |
| GET    | `/api/admin/custom-orders`        | كل الطلبات الخاصة                           |
| PATCH  | `/api/admin/custom-orders/:id`    | تحديث الحالة و/أو الملاحظة الداخلية        |
| GET/PUT | `/api/admin/settings`            | عرض/تعديل رقم إنستاباي وفودافون كاش        |

---

## 3) صفحات الموقع

### المتجر (عام)
- `/` — Hero، شريط القيم، المتجر (فلترة + منتجات)، قصتنا، طلب خاص، نشرة بريدية.
- `/checkout` — ملخص السلة، بيانات التوصيل، طريقة الدفع (بيانات حية من الإعدادات).

### لوحة الأدمين (عربي فقط، مفيش تبديل لغة)
- `/admin/login`, `/admin` (نظرة عامة), `/admin/products`, `/admin/categories`, `/admin/orders`, `/admin/custom-orders`, `/admin/settings`.

---

## 4) قاعدة البيانات والصور

- **Postgres عبر Prisma**: بعد أي تعديل في `prisma/schema.prisma` شغّلي `npx prisma db push`. `npx prisma studio` بيفتح واجهة رسومية لتصفح/تعديل البيانات مباشرة.
- **الصور على R2**: كل صورة بترفعها بتتخزن على R2 وترجع كرابط عام كامل. لما تعدّلي/تمسحي صورة، النسخة القديمة بتتمسح من R2 تلقائيًا.
- **`npm run seed`**: بيمسح كل الجداول ويعيد تعبئتها بـ 6 فئات، 10 منتجات، 4 طلبات، 3 طلبات خاصة. ⚠️ ده بيمسح أي بيانات حقيقية موجودة — استخدميه بس لما تحبي ترجعي لحالة ديمو نضيفة.

---

## 5) متغيرات البيئة

نفس المتغيرات محليًا وعلى Vercel (مشروع واحد):

```
DATABASE_URL=<connection string بتاع Postgres>

ADMIN_EMAIL=admin@ayasmanual.com
ADMIN_PASSWORD_HASH=<bcrypt hash — بعلامات $ متعملة escape كـ \$>
JWT_SECRET=<سلسلة عشوائية طويلة>

R2_ACCOUNT_ID=<Cloudflare account id>
R2_ACCESS_KEY_ID=<من R2 API Token>
R2_SECRET_ACCESS_KEY=<من R2 API Token>
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_BUCKET_NAME=<اسم الـ bucket>
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

لما تنشري على Vercel: انسخي نفس المتغيرات دي في إعدادات المشروع (Environment Variables)، وولّدي `JWT_SECRET` و`ADMIN_PASSWORD_HASH` جداد (متستخدميش القيم التجريبية دي في بيئة حقيقية).

---

## 6) النشر على Vercel

مشروع Vercel واحد بس. الريبو دلوقتي مشروع Next.js في جذره مباشرة، يعني Vercel بيتعرف عليه تلقائيًا من غير أي إعداد Root Directory. حطي كل المتغيرات فوق في إعدادات المشروع، واعملي Deploy. خلاص — الموقع كله (متجر + أدمين + API) هيشتغل من رابط واحد.

---

## اللي لسه ناقص (لو حبيتي نكمل فيه)

- **Authentication لعميلات المتجر** — حاليًا مفيش تسجيل دخول للعميلة نفسها لمتابعة طلباتها (بس الأدمين بس).
- **دفع إلكتروني حقيقي** — حاليًا الدفع بيتم يدويًا (تحويل بنكي/محفظة + رقم عملية يراجعه الأدمين)، ولو حبيتي لاحقًا تدمجي بوابة دفع فعلية (Paymob, Fawry, إلخ).
- **صلاحيات متعددة** — حاليًا أدمين واحد بس في `.env`؛ لو احتجتي أكتر من مستخدم محتاجين نظام مستخدمين حقيقي.

قولّي إمتى تحب تبدأ في أي من النقط دي وهنكمل خطوة بخطوة.
