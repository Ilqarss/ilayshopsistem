import { Router, type Request, type Response } from "express";
import { prisma } from "../../db";
import { authenticate, requirePermission } from "../../middleware/auth";

const router = Router();

router.get("/", authenticate, requirePermission("settings:read"), async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: "asc" }
    });

    res.json({ success: true, data: { items: settings } });
  } catch {
    res.status(500).json({ success: false, error: "Ayarlar alınmadı" });
  }
});

// GET single setting by key
router.get("/:key", authenticate, requirePermission("settings:read"), async (req: Request, res: Response): Promise<void> => {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: req.params.key } });
    if (!setting) {
      res.json({ success: true, data: null });
      return;
    }
    res.json({ success: true, data: setting });
  } catch {
    res.status(500).json({ success: false, error: "Ayar alınmadı" });
  }
});

// PUT upsert setting (admin only)
router.put("/:key", authenticate, requirePermission("settings:write"), async (req: Request, res: Response): Promise<void> => {
  const { value } = req.body as { value?: string };
  if (value === undefined || value === null) {
    res.status(400).json({ success: false, error: "Dəyər tələb olunur" });
    return;
  }
  try {
    const setting = await prisma.setting.upsert({
      where: { key: req.params.key },
      update: { value },
      create: { key: req.params.key, value }
    });
    res.json({ success: true, data: setting });
  } catch {
    res.status(500).json({ success: false, error: "Ayar saxlanmadı" });
  }
});

export default router;
