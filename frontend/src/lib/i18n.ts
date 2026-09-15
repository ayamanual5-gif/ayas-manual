import type { Lang } from "./types";

export const translations = {
  "header.slogan": { ar: "معمول بحب في كل غرزة", en: "Crafted with love in every stitch" },
  "nav.shop": { ar: "المتجر", en: "Shop" },
  "nav.custom": { ar: "طلب خاص", en: "Custom Order" },
  "nav.about": { ar: "من نحن", en: "About Us" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact" },

  "hero.eyebrow": { ar: "صناعة يدوية 100%", en: "100% Handmade" },
  "hero.headline": { ar: "Aya's Manual — فن بيتعمل بحب، غرزة غرزة", en: "Aya's Manual — Handwoven Art with Love" },
  "hero.sub": {
    ar: "كل قطعة بنعملها بإيدينا من غرزة السلسلة الأولى، بخيوط قطن وصوف طبيعية، وتقدري تختاري الألوان اللي تعبّر عنك.",
    en: "Every piece is hand-crocheted from the very first chain stitch, using natural cotton and wool yarns — and you choose the colors that feel like you.",
  },
  "hero.cta1": { ar: "تسوقي الآن", en: "Shop Now" },
  "hero.cta2": { ar: "اكتشفي أكثر", en: "Learn More" },
  "hero.badge1": { ar: "🧶 يدوي بالكامل", en: "🧶 Fully Handmade" },
  "hero.badge2": { ar: "🌿 خيوط طبيعية", en: "🌿 Natural Yarns" },
  "hero.badge3": { ar: "📦 صناعة مصرية", en: "📦 Made in Egypt" },

  "value1": { ar: "كل قطعة بتتعمل خصيصاً لطلبك", en: "Every piece crocheted to order" },
  "value2": { ar: "ألوان مخصصة حسب طلبك", en: "Custom colorways on request" },
  "value3": { ar: "شحن لكل محافظات مصر", en: "Shipping to every governorate" },

  "shop.eyebrow": { ar: "تشكيلاتنا", en: "Our Collections" },
  "shop.title": { ar: "اختاري القطعة اللي تشبهك", en: "Find the piece that feels like you" },
  "shop.sub": {
    ar: "تشكيلة من الشنط والاسكارفات والإكسسوارات والديكور، كلها معمولة بإيد آية.",
    en: "Bags, scarves, accessories and decor — every stitch hand-crocheted by Aya.",
  },
  "shop.loadError": {
    ar: "تعذر تحميل المنتجات — تأكدي إن السيرفر الخلفي شغال على http://localhost:4000",
    en: "Couldn't load products — make sure the backend server is running at http://localhost:4000",
  },
  "shop.empty": { ar: "مفيش منتجات في التصنيف ده حالياً.", en: "No products in this category yet." },

  "about.eyebrow": { ar: "قصتنا", en: "Our Story" },
  "about.title": { ar: "آية، ومعمولة بإيدها", en: "Aya, and everything her hands weave" },
  "about.body": {
    ar: "بدأت آية بغرزة السلسلة الأولى في أوضتها، وكل قطعة دلوقتي بتاخد ساعات من الصبر والحب. مفيش قطعتين متطابقين — كل تصميم بيتعمل مرة واحدة بس، عشانك إنتي.",
    en: "Aya started with a single chain stitch in her bedroom. Every piece today still takes hours of patience and care — no two pieces are ever identical, each one crocheted once, just for you.",
  },

  "custom.eyebrow": { ar: "طلب خاص", en: "Custom Order" },
  "custom.title": { ar: "صمّمي قطعتك بنفسك", en: "Design something just for you" },
  "custom.sub": {
    ar: "ارفعي صورة للقطعة اللي في بالك، واحنا هنعملهالك بنفس الشكل أو بلمستنا الخاصة.",
    en: "Upload a photo of the piece you have in mind, and we'll crochet it true to the picture — or with our own signature twist.",
  },
  "custom.uploadLabel": { ar: "صورة مرجعية", en: "Reference Photo" },
  "custom.uploadTitle": { ar: "اسحبي الصورة هنا أو اضغطي للاختيار", en: "Drag a photo here or click to browse" },
  "custom.uploadHint": { ar: "JPG أو PNG — حتى 10 ميجا", en: "JPG or PNG — up to 10MB" },
  "custom.removeImg": { ar: "إزالة الصورة", en: "Remove photo" },
  "custom.techTitle": { ar: "تقنيات بنشتغل بيها", en: "Techniques we work with" },
  "tech1": { ar: "Granny Square", en: "Granny Square" },
  "tech2": { ar: "غرزة نصف عمود", en: "Half Double Crochet" },
  "tech3": { ar: "غرزة الصدفة", en: "Shell Stitch" },
  "tech4": { ar: "مكرمية", en: "Macramé" },
  "custom.labelName": { ar: "الاسم بالكامل", en: "Full Name" },
  "custom.phName": { ar: "اكتبي اسمك", en: "Enter your name" },
  "custom.labelPhone": { ar: "رقم الموبايل", en: "Phone Number" },
  "custom.phPhone": { ar: "01xxxxxxxxx", en: "01xxxxxxxxx" },
  "custom.labelCategory": { ar: "نوع القطعة", en: "Category" },
  "custom.labelDesc": { ar: "تفاصيل الطلب", en: "Order Details" },
  "custom.phDesc": {
    ar: "قوليلنا الألوان والمقاس واي تفاصيل تانية...",
    en: "Tell us the colors, size and any other details...",
  },
  "custom.submit": { ar: "إرسال الطلب", en: "Send Request" },
  "custom.submitting": { ar: "جاري الإرسال...", en: "Sending..." },
  "custom.errorMsg": {
    ar: "حصل خطأ أثناء إرسال الطلب. جربي تاني.",
    en: "Something went wrong sending your request. Please try again.",
  },
  "custom.successTitle": { ar: "استلمنا طلبك!", en: "Request received!" },
  "custom.successMsg": {
    ar: "هيتواصل معاكي فريق آية خلال 24 ساعة لتأكيد التفاصيل والسعر.",
    en: "Aya's team will reach out within 24 hours to confirm details and price.",
  },
  "custom.sendAnother": { ar: "إرسال طلب تاني", en: "Send another request" },

  "news.title": { ar: "اشتركي في نشرتنا", en: "Join our newsletter" },
  "news.sub": { ar: "أول ما توصلنا قطع جديدة، هتبقي أول وحدة تعرفي.", en: "Be the first to know when new pieces arrive." },
  "news.ph": { ar: "بريدك الإلكتروني", en: "Your email address" },
  "news.btn": { ar: "اشتراك", en: "Subscribe" },

  "footer.about": {
    ar: "علامة مصرية للكروشيه اليدوي — كل قطعة بتتعمل بحب واهتمام بالتفاصيل.",
    en: "An Egyptian handmade crochet brand — every piece made with love and care for detail.",
  },
  "footer.linksTitle": { ar: "روابط سريعة", en: "Quick Links" },
  "footer.contactTitle": { ar: "تواصلي معانا", en: "Get in Touch" },
  "footer.location": { ar: "القاهرة، مصر", en: "Cairo, Egypt" },
  "footer.followTitle": { ar: "تابعينا", en: "Follow Us" },
  "footer.rights": { ar: "© 2026 Aya's Manual. جميع الحقوق محفوظة.", en: "© 2026 Aya's Manual. All rights reserved." },

  "cart.title": { ar: "شنطة المشتريات", en: "Your Cart" },
  "cart.subtotal": { ar: "الإجمالي", en: "Subtotal" },
  "cart.checkout": { ar: "إتمام الطلب", en: "Checkout" },
  "cart.empty": { ar: "شنطتك لسه فاضية — يلا نملاها!", en: "Your cart is empty — let's fill it up!" },
  "cart.continueShopping": { ar: "تصفحي المتجر", en: "Browse the shop" },
  "currency": { ar: "ج.م", en: "EGP" },

  "product.add": { ar: "أضيفي للسلة", en: "Add to Cart" },
  "product.view": { ar: "التفاصيل", en: "View Details" },
  "product.new": { ar: "جديد", en: "New" },

  "toast.added": { ar: "تمت الإضافة للسلة 🧶", en: "Added to cart 🧶" },
  "toast.news": { ar: "تم الاشتراك، شكراً ليكي!", en: "Subscribed — thank you!" },

  "modal.add": { ar: "أضيفي للسلة", en: "Add to Cart" },

  "checkout.title": { ar: "إتمام الطلب", en: "Checkout" },
  "checkout.emptyTitle": { ar: "الشنطة فاضية", en: "Your cart is empty" },
  "checkout.emptyMsg": {
    ar: "لسه معملتيش أي طلب. ارجعي للمتجر واختاري القطع اللي عجبتك.",
    en: "You haven't added anything yet. Head back to the shop and pick out a few pieces.",
  },
  "checkout.itemsTitle": { ar: "ملخص الطلب", en: "Order Summary" },
  "checkout.customerTitle": { ar: "بيانات التوصيل", en: "Delivery Details" },
  "checkout.labelAddress": { ar: "العنوان بالتفصيل", en: "Full Address" },
  "checkout.phAddress": { ar: "الشارع، المنطقة، رقم العمارة...", en: "Street, area, building number..." },
  "checkout.labelCity": { ar: "المحافظة", en: "Governorate" },
  "checkout.phCity": { ar: "القاهرة، الجيزة، الإسكندرية...", en: "Cairo, Giza, Alexandria..." },
  "checkout.labelNotes": { ar: "ملاحظات إضافية (اختياري)", en: "Additional Notes (optional)" },
  "checkout.phNotes": { ar: "أي تفاصيل تانية حابة تقوليها...", en: "Any other details you'd like to share..." },
  "checkout.paymentTitle": { ar: "طريقة الدفع", en: "Payment Method" },
  "checkout.paymentInstaPay": { ar: "إنستاباي", en: "InstaPay" },
  "checkout.paymentVodafone": { ar: "فودافون كاش", en: "Vodafone Cash" },
  "checkout.instapayHandle": { ar: "حوّلي المبلغ على حساب إنستاباي:", en: "Transfer the total to this InstaPay handle:" },
  "checkout.vodafoneNumber": { ar: "حوّلي المبلغ على رقم فودافون كاش:", en: "Transfer the total to this Vodafone Cash number:" },
  "checkout.paymentNote": {
    ar: "بعد التحويل، اكتبي رقم العملية أو آخر 4 أرقام في خانة الملاحظات — وهيتم تأكيد طلبك بمجرد التحقق من التحويل.",
    en: "After transferring, note the transaction ID or last 4 digits in the notes field — your order will be confirmed once the transfer is verified.",
  },
  "checkout.labelPaymentRef": { ar: "رقم العملية / آخر 4 أرقام", en: "Transaction ID / last 4 digits" },
  "checkout.phPaymentRef": { ar: "مثال: 4821", en: "e.g. 4821" },
  "checkout.submit": { ar: "تأكيد الطلب", en: "Confirm Order" },
  "checkout.submitting": { ar: "جاري إرسال الطلب...", en: "Submitting order..." },
  "checkout.errorMsg": {
    ar: "حصل خطأ أثناء إرسال الطلب. تأكدي إن السيرفر الخلفي شغال وجربي تاني.",
    en: "Something went wrong submitting your order. Make sure the backend is running and try again.",
  },
  "checkout.successTitle": { ar: "تم استلام طلبك!", en: "Order received!" },
  "checkout.successMsg": {
    ar: "هيتواصل معاكي فريق آية لتأكيد التحويل والشحن قريباً.",
    en: "Aya's team will reach out shortly to confirm your payment and shipping.",
  },
  "checkout.backHome": { ar: "العودة للرئيسية", en: "Back to Home" },
} as const;

export type TranslationKey = keyof typeof translations;

export function translate(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}
