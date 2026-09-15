import fs from "fs/promises";
import path from "path";
import { uploadsDir } from "../middleware/upload";
import type { CustomOrder, Order } from "../types";
import { createSolidPng } from "./pngPlaceholder";

const dataDir = path.join(__dirname, "..", "..", "data");

function daysAgo(days: number, hours = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

const orders: Order[] = [
  {
    id: 1001,
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
    createdAt: daysAgo(3),
  },
  {
    id: 1002,
    customerName: "نور الهدى محمد",
    phone: "01123456789",
    address: "شارع التحرير، الدقي",
    city: "الجيزة",
    paymentMethod: "vodafone_cash",
    paymentReference: "7734",
    items: [{ productId: 9, name: "كارديجان قصير هافل", price: 620, qty: 1 }],
    subtotal: 620,
    status: "shipped",
    createdAt: daysAgo(6),
  },
  {
    id: 1003,
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
    createdAt: daysAgo(1),
  },
  {
    id: 1004,
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
    createdAt: daysAgo(0, 3),
  },
];

async function buildCustomOrders(): Promise<CustomOrder[]> {
  const roseImage = createSolidPng(480, 360, [190, 110, 119]);
  const oliveImage = createSolidPng(480, 360, [147, 113, 47]);

  const roseFilename = "seed-custom-bag-reference.png";
  const oliveFilename = "seed-custom-cardigan-reference.png";

  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, roseFilename), roseImage);
  await fs.writeFile(path.join(uploadsDir, oliveFilename), oliveImage);

  return [
    {
      id: 2001,
      name: "رنا سامي",
      phone: "01011122233",
      category: "bags",
      description: "عايزة شنطة كروشيه بألوان الباستيل، بيج وروز، بمقاس متوسط ويكون فيها سوستة من جوه.",
      imagePath: `/uploads/${roseFilename}`,
      status: "pending",
      internalNote: "",
      createdAt: daysAgo(2),
    },
    {
      id: 2002,
      name: "ياسمين طارق",
      phone: "01155566677",
      category: "cardigans",
      description: "عايزة كارديجان بلون الزيتي بمقاس Large وأكمام طويلة، شبه الصورة المرفقة بالظبط.",
      imagePath: `/uploads/${oliveFilename}`,
      status: "confirmed",
      internalNote: "اتفقنا على السعر 750 جنيه، هتحول تحويل إنستاباي خلال يومين.",
      createdAt: daysAgo(5),
    },
    {
      id: 2003,
      name: "دينا فتحي",
      phone: "01277788899",
      category: "decor",
      description: "حابة معلقة نباتات مقاس كبير بلون بيج وأبيض تناسب ركن المكتب عندي.",
      imagePath: null,
      status: "pending",
      internalNote: "",
      createdAt: daysAgo(1),
    },
  ];
}

async function writeJson(fileName: string, data: unknown): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, fileName), JSON.stringify(data, null, 2), "utf-8");
}

async function main() {
  const customOrders = await buildCustomOrders();

  await writeJson("orders.json", orders);
  await writeJson("custom-orders.json", customOrders);

  console.log(`Seeded ${orders.length} orders and ${customOrders.length} custom orders.`);
  console.log("Run the backend (npm run dev) and log into /admin to see them.");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
