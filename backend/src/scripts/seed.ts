import fs from "fs/promises";
import path from "path";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { uploadsDir } from "../middleware/upload";
import type { Category, CustomOrder, Order, Product } from "../types";
import { createSolidPng } from "./pngPlaceholder";

function daysAgo(days: number, hours = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date;
}

const categories: Category[] = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "bags", ar: "حقائب", en: "Bags" },
  { key: "scarves", ar: "اسكارف", en: "Scarves" },
  { key: "accessories", ar: "اكسسوارات", en: "Accessories" },
  { key: "decor", ar: "ديكور", en: "Decor" },
  { key: "cardigans", ar: "كارديجان", en: "Cardigans" },
];

// Product 1 keeps the real photo uploaded earlier from the admin panel
// (the file already lives in backend/uploads/ — this just re-links it).
const products: Omit<Product, "id">[] = [
  {
    category: "bags",
    icon: "bag",
    tint: "teal",
    price: 450,
    isNew: true,
    name: { ar: "شنطة قش كروشيه", en: "Woven Straw Tote" },
    tag: { ar: "غرزة مفردة · حبل قطن", en: "Single crochet · Cotton cord" },
    desc: {
      ar: "شنطة يومية فسيحة بحزام جلد طبيعي، معمولة بخيط قطني متين يتحمل الاستخدام اليومي.",
      en: "A spacious everyday tote with a genuine leather strap, woven from durable cotton cord that holds up to daily use.",
    },
    image: "/uploads/1789421909550-424682317.jpeg",
  },
  {
    category: "bags",
    icon: "bag",
    tint: "rose",
    price: 320,
    isNew: false,
    name: { ar: "شنطة Granny Square صغيرة", en: "Mini Granny Square Bag" },
    tag: { ar: "Granny Square · خليط أكريليك", en: "Granny square · Acrylic blend" },
    desc: {
      ar: "شنطة صغيرة بمربعات الجراني كلاسيك ملونة، مثالية للخروجات المسائية.",
      en: "A small bag made of classic colorful granny squares — perfect for evenings out.",
    },
  },
  {
    category: "scarves",
    icon: "scarf",
    tint: "olive",
    price: 280,
    isNew: false,
    name: { ar: "اسكارف ريب سميك", en: "Chunky Rib Scarf" },
    tag: { ar: "غرزة ريب · صوف سميك", en: "Ribbing stitch · Chunky wool" },
    desc: {
      ar: "اسكارف دافئ بغرزة الريب الكثيفة، مثالي لأجواء الشتاء الباردة.",
      en: "A warm scarf in a dense rib stitch, made for the coldest winter days.",
    },
  },
  {
    category: "scarves",
    icon: "scarf",
    tint: "teal",
    price: 260,
    isNew: true,
    name: { ar: "اسكارف دائري متدرج", en: "Ombré Infinity Scarf" },
    tag: { ar: "صبغة أومبريه · خليط موهير", en: "Ombré dye · Mohair blend" },
    desc: {
      ar: "اسكارف دائري بتدرج لوني ناعم من خيوط الموهير الرقيقة الدافئة.",
      en: "An infinity scarf with a soft color gradient, crocheted from delicate warm mohair yarn.",
    },
  },
  {
    category: "accessories",
    icon: "flower",
    tint: "rose",
    price: 120,
    isNew: false,
    name: { ar: "طقم مشابك شعر بالخرز", en: "Beaded Hair Clip Set" },
    tag: { ar: "تطريز خرز · خيط قطن", en: "Bead trim · Cotton thread" },
    desc: {
      ar: "طقم من 3 مشابك بزهور كروشيه صغيرة مطرزة بالخرز الملون.",
      en: "A set of 3 hair clips with tiny crochet flowers trimmed in colorful beads.",
    },
  },
  {
    category: "accessories",
    icon: "flower",
    tint: "olive",
    price: 95,
    isNew: false,
    name: { ar: "إسورة كروشيه", en: "Wrist Cuff Bracelet" },
    tag: { ar: "غرزة الصدفة · قطن", en: "Shell stitch · Cotton" },
    desc: {
      ar: "إسورة أنيقة بغرزة الصدفة وزرار خشب طبيعي.",
      en: "An elegant cuff bracelet in shell stitch, finished with a natural wooden button.",
    },
  },
  {
    category: "decor",
    icon: "plant",
    tint: "olive",
    price: 180,
    isNew: false,
    name: { ar: "معلقة نباتات مكرمية", en: "Macramé Plant Hanger" },
    tag: { ar: "حبل مكرمية · جوت طبيعي", en: "Macramé cord · Natural jute" },
    desc: {
      ar: "معلقة نباتات بتقنية المكرمية من خيوط الجوت الطبيعية، تضيف لمسة بوهيمية لأي ركن.",
      en: "A plant hanger in macramé technique from natural jute cord, adding a boho touch to any corner.",
    },
  },
  {
    category: "decor",
    icon: "plant",
    tint: "rose",
    price: 240,
    isNew: true,
    name: { ar: "مخدة كروشيه مزخرفة", en: "Textured Throw Pillow" },
    tag: { ar: "غرزة البوبكورن · صوف", en: "Popcorn stitch · Wool" },
    desc: {
      ar: "مخدة زخرفية بملمس بارز من غرزة البوبكورن، تضيف دفء لأي صالة.",
      en: "A decorative pillow with raised popcorn-stitch texture, adding warmth to any living room.",
    },
  },
  {
    category: "cardigans",
    icon: "cardigan",
    tint: "teal",
    price: 620,
    isNew: false,
    name: { ar: "كارديجان قصير هافل", en: "Cropped Waffle Cardigan" },
    tag: { ar: "غرزة الوافل · خليط قطن", en: "Waffle stitch · Cotton blend" },
    desc: {
      ar: "كارديجان قصير بملمس الوافل الناعم، خفيف ومناسب لكل الفصول.",
      en: "A cropped cardigan with soft waffle texture — lightweight and wearable through every season.",
    },
  },
  {
    category: "cardigans",
    icon: "cardigan",
    tint: "rose",
    price: 690,
    isNew: true,
    name: { ar: "كارديجان غراني أوفرسايز", en: "Oversized Granny Cardigan" },
    tag: { ar: "Granny Square · خليط صوف", en: "Granny square · Wool blend" },
    desc: {
      ar: "كارديجان أوفرسايز بمربعات الجراني الملونة، قطعة مميزة تلفت الأنظار.",
      en: "An oversized cardigan in colorful granny squares — a statement piece that turns heads.",
    },
  },
];

const orders: Omit<Order, "id">[] = [
  {
    customerName: "مريم أحمد",
    phone: "01012345678",
    address: "شارع عباس العقاد، عمارة 12، مدينة نصر",
    city: "القاهرة",
    paymentMethod: "instapay",
    paymentReference: "4821",
    items: [
      { productId: 1, name: "شنطة قش كروشيه", price: 450, qty: 1 },
      { productId: 5, name: "طقم مشابك شعر بالخرز", price: 120, qty: 2 },
    ],
    subtotal: 690,
    status: "confirmed",
    createdAt: daysAgo(3).toISOString(),
  },
  {
    customerName: "نور الهدى محمد",
    phone: "01123456789",
    address: "شارع التحرير، الدقي",
    city: "الجيزة",
    paymentMethod: "vodafone_cash",
    paymentReference: "7734",
    items: [{ productId: 9, name: "كارديجان قصير هافل", price: 620, qty: 1 }],
    subtotal: 620,
    status: "shipped",
    createdAt: daysAgo(6).toISOString(),
  },
  {
    customerName: "سارة خالد",
    phone: "01234567890",
    address: "شارع فؤاد، سيدي جابر",
    city: "الإسكندرية",
    paymentMethod: "instapay",
    items: [
      { productId: 3, name: "اسكارف ريب سميك", price: 280, qty: 1 },
      { productId: 6, name: "إسورة كروشيه", price: 95, qty: 1 },
    ],
    subtotal: 375,
    status: "pending",
    createdAt: daysAgo(1).toISOString(),
  },
  {
    customerName: "هدى إبراهيم",
    phone: "01098765432",
    address: "شارع 9، المعادي",
    city: "القاهرة",
    paymentMethod: "vodafone_cash",
    items: [
      { productId: 10, name: "كارديجان غراني أوفرسايز", price: 690, qty: 1 },
      { productId: 7, name: "معلقة نباتات مكرمية", price: 180, qty: 1 },
    ],
    subtotal: 870,
    status: "pending",
    createdAt: daysAgo(0, 3).toISOString(),
  },
];

async function buildCustomOrders(): Promise<Omit<CustomOrder, "id">[]> {
  const roseImage = createSolidPng(480, 360, [190, 110, 119]);
  const oliveImage = createSolidPng(480, 360, [147, 113, 47]);

  const roseFilename = "seed-custom-bag-reference.png";
  const oliveFilename = "seed-custom-cardigan-reference.png";

  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, roseFilename), roseImage);
  await fs.writeFile(path.join(uploadsDir, oliveFilename), oliveImage);

  return [
    {
      name: "رنا سامي",
      phone: "01011122233",
      category: "bags",
      description: "عايزة شنطة كروشيه بألوان الباستيل، بيج وروز، بمقاس متوسط ويكون فيها سوستة من جوه.",
      imagePath: `/uploads/${roseFilename}`,
      status: "pending",
      internalNote: "",
      createdAt: daysAgo(2).toISOString(),
    },
    {
      name: "ياسمين طارق",
      phone: "01155566677",
      category: "cardigans",
      description: "عايزة كارديجان بلون الزيتي بمقاس Large وأكمام طويلة، شبه الصورة المرفقة بالظبط.",
      imagePath: `/uploads/${oliveFilename}`,
      status: "confirmed",
      internalNote: "اتفقنا على السعر 750 جنيه، هتحول تحويل إنستاباي خلال يومين.",
      createdAt: daysAgo(5).toISOString(),
    },
    {
      name: "دينا فتحي",
      phone: "01277788899",
      category: "decor",
      description: "حابة معلقة نباتات مقاس كبير بلون بيج وأبيض تناسب ركن المكتب عندي.",
      imagePath: null,
      status: "pending",
      internalNote: "",
      createdAt: daysAgo(1).toISOString(),
    },
  ];
}

async function main() {
  // Full reset — this script is meant to bring the DB back to a clean demo state.
  await prisma.order.deleteMany();
  await prisma.customOrder.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.settings.deleteMany();

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }

  for (const product of products) {
    await prisma.product.create({ data: product as unknown as Prisma.ProductCreateInput });
  }

  for (const order of orders) {
    await prisma.order.create({
      data: {
        ...order,
        items: order.items as unknown as Prisma.InputJsonValue,
        createdAt: new Date(order.createdAt),
      },
    });
  }

  const customOrders = await buildCustomOrders();
  for (const customOrder of customOrders) {
    await prisma.customOrder.create({
      data: { ...customOrder, createdAt: new Date(customOrder.createdAt) },
    });
  }

  await prisma.settings.create({
    data: { id: 1, instapayHandle: "ayasmanual@instapay", vodafoneCashNumber: "010 0123 4567" },
  });

  console.log(
    `Seeded ${categories.length} categories, ${products.length} products, ${orders.length} orders, ${customOrders.length} custom orders, and default settings.`
  );
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
