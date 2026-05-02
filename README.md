# İL & AY — Pərdə & Jalüz ERP

> Pərdə və jalüz mağazası üçün tam POS / ERP sistemi.
> **Azərbaycan dilindədir. "Old Money" dark estetikası. Mobile-responsive.**

## Texnologiya

| Qat | Stack |
|-----|-------|
| Frontend | Next.js 15 (App Router) + Tailwind CSS v4 |
| Backend | Express.js + TypeScript |
| ORM | Prisma + **SQLite** |
| Auth | JWT (Access + Refresh token) |
| Monorepo | pnpm workspaces |

---

## İşə salmaq

```bash
# 1. Asılılıqlar
pnpm install

# 2. .env faylını yarat
cp .env.example apps/api/.env
# apps/api/.env içərisindəki DATABASE_URL="file:./dev.db" olaraq qalır

# 3. Verilənlər bazasını yarat
cd apps/api
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 4. Hər iki tərəfi qoş
cd ../..
pnpm dev
```

| Xidmət | URL |
|--------|-----|
| Web (Next.js) | http://localhost:3000 |
| API (Express) | http://localhost:4000 |

---

## Giriş məlumatları (seed)

| İstifadəçi | Şifrə | Rol |
|-----------|-------|-----|
| `admin` | `Admin123!` | Admin (Sahibkar) – tam giriş |
| `satici1` | `Satici123!` | Satıcı – alış qiyməti gizli |
| `satici2` | `Satici123!` | Satıcı |
| `derzi1` | `Derzi123!` | Dərzi – yalnız sifarişlər |

---

## Modullar

### Anbar
- Excel/CSV idxalı (Access-dən gelen format: Kod, Ad, Alış, Faiz, Satış, Qalıq, Vahid, Tip)
- Pərdə toplarının metraj izlənməsi
- Stok düzəlişi + hərəkət jurnalı
- 58mm etiket çapı (termal printer)
- Aşağı stok xəbərdarlığı

### Satış Kalkulyatoru
**Pərdə:** Metr x Büzmə əmsalı x Satış qiyməti
- Büzmə əmsalları: x1.5, x2, x2.5, x3

**Jalüz:** En x Hündürlük = m2 (minimum 1 m2)

**Endirim:** faiz (%) VƏ ya məbləğ (AZN)
**Ödəniş:** Beh sistemi + borc (cəri) izlənməsi
**Çek:** 58mm/80mm termal printer + brauzer çapı

### Müştəri CRM
- Telefon nömrəsi ilə sürətli axtarış
- Keçmiş ölçülərin saxlanması (otaq adı, en x hündürlük)
- Satış tarixçəsi + borc ödəmə

### Dərzi Paneli
- Kanban board (Gözləyir / Tikilir / Hazırdır)
- Dərzi yalnız öz sifarişlərini görür
- Status yeniləmə bir toxunuşla

### Admin / Maliyyə
- Gündəlik xərclər: Parasok, Kommunal, Yemək, Nəqliyyat, Kirayə, Digər
- Xalis mənfəət = Satış mənfəəti − Xərclər
- İşçi komissiyaları (faiz x gəlir)
- Mənfəət hesabatı (tarix aralığı)

---

## Rol icazə matrisi

| İcazə | Admin | Satıcı | Dərzi |
|-------|:-----:|:------:|:-----:|
| Alış qiyməti | ✓ | — | — |
| Xalis mənfəət | ✓ | — | — |
| Komissiya hesabatı | ✓ | — | — |
| Satış yarat | ✓ | ✓ | — |
| Anbar import | ✓ | ✓ | — |
| CRM oxu/yaz | ✓ | ✓ | — |
| Dərzi panel | ✓ | oxu | ✓ |
| Xərc qeydi | ✓ | öz | — |
| İstifadəçi idarəsi | ✓ | — | — |

---

## CSV Import Formatı

```csv
Malin Kodu;Adi;Alis;Faiz;Satis;Qaliq;Vahidi;Tip
PRD-001;Tul perde ag;2.50;80;4.50;150;m;CURTAIN
JAL-001;Ufuqi jaluz (25mm);8.00;75;14.00;200;m2;JALOUSIE
ACC-001;Perde cubuqu;4.50;80;8.10;40;edəd;OTHER
```

- Ayırıcı: `;` və ya `,` və ya `TAB`
- Tip: `CURTAIN` (Pərdə), `JALOUSIE` (Jalüz), `OTHER` (Digər)

---

## Layihə strukturu

```
cehizlik-pos/
├── apps/
│   ├── api/                     Express + Prisma
│   │   ├── prisma/
│   │   │   ├── schema.prisma    SQLite schema
│   │   │   └── seed.ts          Test məlumatları
│   │   └── src/modules/
│   │       ├── auth/        JWT giriş/çıxış
│   │       ├── inventory/   Anbar + import
│   │       ├── sales/       Satış + borc
│   │       ├── customers/   CRM + ölçülər
│   │       ├── tailor/      Dərzi sifarişi
│   │       ├── expenses/    Xərclər
│   │       ├── reports/     Hesabatlar
│   │       └── users/       İstifadəçi idarəsi
│   └── web/src/app/
│       ├── dashboard/
│       ├── sales/
│       ├── inventory/
│       ├── customers/
│       ├── tailor/
│       ├── expenses/
│       ├── reports/
│       └── users/
└── packages/types/src/index.ts  Rol, icazə, hesablamalar
```
