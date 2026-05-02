import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertUser(input: {
  fullName: string;
  username: string;
  phone: string;
  password: string;
  role: string;
  commission?: number;
}) {
  return prisma.user.upsert({
    where: { username: input.username },
    update: { fullName: input.fullName, phone: input.phone, role: input.role, commission: input.commission ?? 0, isActive: true },
    create: {
      fullName: input.fullName,
      username: input.username,
      phone: input.phone,
      passwordHash: await bcrypt.hash(input.password, 12),
      role: input.role,
      commission: input.commission ?? 0,
      isActive: true
    }
  });
}

async function upsertProduct(data: {
  code: string; nameAz: string;
  productType: string;
  unit: string; costPrice: number; marginPct: number; salePrice: number; stock: number; minStock: number;
}) {
  return prisma.product.upsert({
    where: { code: data.code },
    update: data,
    create: data
  });
}

async function main() {
  console.log("İL & AY seed başladı...");

  // ─── İstifadəçilər ──────────────────────────────────────────────────────────
  await upsertUser({ fullName: "İlqar Əliyev", username: "admin", phone: "+994501234567", password: "Admin123!", role: "ADMIN", commission: 0 });
  await upsertUser({ fullName: "Aytən Həsənova", username: "satici1", phone: "+994551234567", password: "Satici123!", role: "SELLER", commission: 3 });
  await upsertUser({ fullName: "Nigar Əhmədova", username: "satici2", phone: "+994701234567", password: "Satici123!", role: "SELLER", commission: 3 });
  await upsertUser({ fullName: "Rəna Quliyeva", username: "derzi1", phone: "+994771234567", password: "Derzi123!", role: "TAILOR", commission: 0 });

  // ─── Pərdə topları ──────────────────────────────────────────────────────────
  await upsertProduct({ code: "PRD-001", nameAz: "Tül pərdə – ağ", productType: "CURTAIN", unit: "m", costPrice: 2.5, marginPct: 80, salePrice: 4.5, stock: 150, minStock: 20 });
  await upsertProduct({ code: "PRD-002", nameAz: "Tül pərdə – krem", productType: "CURTAIN", unit: "m", costPrice: 2.8, marginPct: 75, salePrice: 4.9, stock: 120, minStock: 20 });
  await upsertProduct({ code: "PRD-003", nameAz: "Qalın pərdə – lacivert", productType: "CURTAIN", unit: "m", costPrice: 5.5, marginPct: 70, salePrice: 9.5, stock: 80, minStock: 15 });
  await upsertProduct({ code: "PRD-004", nameAz: "Qalın pərdə – bordo", productType: "CURTAIN", unit: "m", costPrice: 5.8, marginPct: 68, salePrice: 9.8, stock: 60, minStock: 15 });
  await upsertProduct({ code: "PRD-005", nameAz: "Blackout pərdə – qara", productType: "CURTAIN", unit: "m", costPrice: 7.0, marginPct: 65, salePrice: 11.5, stock: 45, minStock: 10 });
  await upsertProduct({ code: "PRD-006", nameAz: "Blackout pərdə – bej", productType: "CURTAIN", unit: "m", costPrice: 6.8, marginPct: 65, salePrice: 11.2, stock: 50, minStock: 10 });
  await upsertProduct({ code: "PRD-007", nameAz: "İpəkimsi pərdə – qızılı", productType: "CURTAIN", unit: "m", costPrice: 8.5, marginPct: 72, salePrice: 14.6, stock: 30, minStock: 8 });

  // ─── Jalüzlər ───────────────────────────────────────────────────────────────
  await upsertProduct({ code: "JAL-001", nameAz: "Üfüqi jalüz – ağ (25mm)", productType: "JALOUSIE", unit: "m²", costPrice: 8.0, marginPct: 75, salePrice: 14.0, stock: 200, minStock: 30 });
  await upsertProduct({ code: "JAL-002", nameAz: "Üfüqi jalüz – bej (25mm)", productType: "JALOUSIE", unit: "m²", costPrice: 8.5, marginPct: 72, salePrice: 14.6, stock: 180, minStock: 30 });
  await upsertProduct({ code: "JAL-003", nameAz: "Şaquli jalüz – ağ (89mm)", productType: "JALOUSIE", unit: "m²", costPrice: 10.0, marginPct: 70, salePrice: 17.0, stock: 150, minStock: 20 });
  await upsertProduct({ code: "JAL-004", nameAz: "Şaquli jalüz – qara (89mm)", productType: "JALOUSIE", unit: "m²", costPrice: 11.0, marginPct: 68, salePrice: 18.5, stock: 100, minStock: 20 });
  await upsertProduct({ code: "JAL-005", nameAz: "Rulo pərdə – ağ", productType: "JALOUSIE", unit: "m²", costPrice: 9.5, marginPct: 73, salePrice: 16.4, stock: 120, minStock: 20 });
  await upsertProduct({ code: "JAL-006", nameAz: "Rulo pərdə – bej", productType: "JALOUSIE", unit: "m²", costPrice: 9.8, marginPct: 70, salePrice: 16.7, stock: 110, minStock: 20 });

  // ─── Aksessuarlar ───────────────────────────────────────────────────────────
  await upsertProduct({ code: "ACC-001", nameAz: "Pərdə çubuğu – ağ 2m", productType: "OTHER", unit: "ədəd", costPrice: 4.5, marginPct: 80, salePrice: 8.1, stock: 40, minStock: 10 });
  await upsertProduct({ code: "ACC-002", nameAz: "Pərdə çubuğu – gümüşü 2m", productType: "OTHER", unit: "ədəd", costPrice: 5.0, marginPct: 78, salePrice: 8.9, stock: 35, minStock: 10 });
  await upsertProduct({ code: "ACC-003", nameAz: "Pərdə halqaları (10 ədəd)", productType: "OTHER", unit: "dəst", costPrice: 1.2, marginPct: 100, salePrice: 2.4, stock: 100, minStock: 20 });
  await upsertProduct({ code: "ACC-004", nameAz: "Pərdə bağı – qızılı", productType: "OTHER", unit: "cüt", costPrice: 2.0, marginPct: 90, salePrice: 3.8, stock: 50, minStock: 15 });
  await upsertProduct({ code: "ACC-005", nameAz: "Pərdə klaməri", productType: "OTHER", unit: "ədəd", costPrice: 0.5, marginPct: 100, salePrice: 1.0, stock: 200, minStock: 30 });

  // ─── Parametrlər ────────────────────────────────────────────────────────────
  await prisma.setting.upsert({
    where: { key: "store.name" },
    update: { value: "İL & AY" },
    create: { key: "store.name", value: "İL & AY" }
  });
  await prisma.setting.upsert({
    where: { key: "store.subtitle" },
    update: { value: "Pərdə & Jalüz mağazası · Mingəçevir" },
    create: { key: "store.subtitle", value: "Pərdə & Jalüz mağazası · Mingəçevir" }
  });
  await prisma.setting.upsert({
    where: { key: "receipt.default_width" },
    update: { value: "80mm" },
    create: { key: "receipt.default_width", value: "80mm" }
  });

  console.log("Seed tamamlandı.");
  console.log("─────────────────────────────────────");
  console.log("Giriş məlumatları:");
  console.log("  admin / Admin123!   → Admin (Sahibkar)");
  console.log("  satici1 / Satici123! → Satıcı (faiz görməz)");
  console.log("  derzi1 / Derzi123!  → Dərzi (yalnız sifarişlər)");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
