import { Router, type Request, type Response } from "express";
import { prisma } from "../../db";
import { authenticate, requirePermission } from "../../middleware/auth";

const router = Router();
router.use(authenticate);

// ─── Siyahı (telefon ilə sürətli axtarış) ────────────────────────────────────
router.get("/", requirePermission("customers:read"), async (req: Request, res: Response): Promise<void> => {
  const { q, page = "1", limit = "30" } = req.query as Record<string, string>;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const where = q
      ? {
          OR: [
            { phone: { contains: q } },
            { name: { contains: q } }
          ]
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { updatedAt: "desc" },
        include: { measurements: { orderBy: { createdAt: "desc" } } }
      }),
      prisma.customer.count({ where })
    ]);

    res.json({ success: true, data: { items, total } });
  } catch {
    res.status(500).json({ success: false, error: "Müştərilər alınmadı" });
  }
});

// ─── Tək müştəri (borc tarixçəsi ilə) ────────────────────────────────────────
router.get("/:id", requirePermission("customers:read"), async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        measurements: { orderBy: { createdAt: "desc" } },
        sales: {
          orderBy: { soldAt: "desc" },
          take: 50,
          select: {
            id: true, saleNumber: true, total: true, deposit: true, debt: true, soldAt: true, note: true
          }
        }
      }
    });
    if (!customer) {
      res.status(404).json({ success: false, error: "Müştəri tapılmadı" });
      return;
    }
    res.json({ success: true, data: customer });
  } catch {
    res.status(500).json({ success: false, error: "Müştəri alınmadı" });
  }
});

// ─── Yeni müştəri ─────────────────────────────────────────────────────────────
router.post("/", requirePermission("customers:write"), async (req: Request, res: Response): Promise<void> => {
  const { name, phone, address, notes } = req.body as Record<string, string>;
  if (!name || !phone) {
    res.status(400).json({ success: false, error: "Ad və telefon tələb olunur" });
    return;
  }
  try {
    const customer = await prisma.customer.create({ data: { name, phone, address: address ?? null, notes: notes ?? null } });
    res.status(201).json({ success: true, data: customer });
  } catch (e) {
    const err = e as { code?: string };
    if (err.code === "P2002") {
      res.status(409).json({ success: false, error: "Bu telefon artıq mövcuddur" });
      return;
    }
    res.status(500).json({ success: false, error: "Müştəri yaradılmadı" });
  }
});

// ─── Müştəri yenilə ───────────────────────────────────────────────────────────
router.patch("/:id", requirePermission("customers:write"), async (req: Request, res: Response): Promise<void> => {
  const { name, phone, address, notes } = req.body as Record<string, string>;
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { name, phone, address, notes }
    });
    res.json({ success: true, data: customer });
  } catch {
    res.status(500).json({ success: false, error: "Müştəri yenilənmədi" });
  }
});

// ─── Ölçü əlavə et ────────────────────────────────────────────────────────────
router.post("/:id/measurements", requirePermission("customers:write"), async (req: Request, res: Response): Promise<void> => {
  const { roomName, width, height, notes } = req.body as Record<string, unknown>;
  if (!roomName || width === undefined || height === undefined) {
    res.status(400).json({ success: false, error: "Otaq adı, en və hündürlük tələb olunur" });
    return;
  }
  try {
    const measurement = await prisma.customerMeasurement.create({
      data: {
        customerId: req.params.id,
        roomName: String(roomName),
        width: Number(width),
        height: Number(height),
        notes: notes ? String(notes) : null
      }
    });
    res.status(201).json({ success: true, data: measurement });
  } catch {
    res.status(500).json({ success: false, error: "Ölçü əlavə olunmadı" });
  }
});

export default router;
