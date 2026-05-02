import { Router, type Request, type Response } from "express";
import { prisma } from "../../db";
import { authenticate, requirePermission } from "../../middleware/auth";

const router = Router();

router.use(authenticate, requirePermission("categories:read"));

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: [{ sortOrder: "asc" }, { nameAz: "asc" }]
    });

    res.json({ success: true, data: { items: categories } });
  } catch {
    res.status(500).json({ success: false, error: "Kateqoriyalar alınmadı" });
  }
});

router.post("/", requirePermission("categories:write"), async (req: Request, res: Response): Promise<void> => {
  const { nameAz, slug, descriptionAz, parentId, imageUrl, sortOrder, isActive } = req.body as {
    nameAz?: string;
    slug?: string;
    descriptionAz?: string;
    parentId?: string | null;
    imageUrl?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  };

  if (!nameAz || !slug) {
    res.status(400).json({ success: false, error: "Kateqoriya adı və slug tələb olunur" });
    return;
  }

  try {
    const category = await prisma.category.create({
      data: {
        nameAz,
        slug,
        descriptionAz,
        parentId,
        imageUrl,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true
      }
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      res.status(409).json({ success: false, error: "Bu slug artıq istifadə olunur" });
      return;
    }

    res.status(500).json({ success: false, error: "Kateqoriya yaradıla bilmədi" });
  }
});

router.patch("/:id", requirePermission("categories:write"), async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json({ success: true, data: category });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      res.status(404).json({ success: false, error: "Kateqoriya tapılmadı" });
      return;
    }

    res.status(500).json({ success: false, error: "Kateqoriya yenilənmədi" });
  }
});

router.delete("/:id", requirePermission("categories:write"), async (req: Request, res: Response): Promise<void> => {
  try {
    const productCount = await prisma.product.count({ where: { categoryId: req.params.id } });
    if (productCount > 0) {
      res.status(400).json({ success: false, error: "Bu kateqoriyada məhsullar var" });
      return;
    }

    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      res.status(404).json({ success: false, error: "Kateqoriya tapılmadı" });
      return;
    }

    res.status(500).json({ success: false, error: "Kateqoriya silinmədi" });
  }
});

export default router;