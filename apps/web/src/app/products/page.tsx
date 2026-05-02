"use client";

import { ImagePlus, PackagePlus, Pencil, ScanBarcode, Trash2 } from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import { DashboardShell } from "../../components/layout/dashboard-shell";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

type Category = {
  id: string;
  nameAz: string;
  slug: string;
  descriptionAz: string;
};

type Product = {
  id: string;
  nameAz: string;
  barcode: string;
  categoryId: string;
  stock: number;
  minStockLevel: number;
  salePrice: number;
  costPrice: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  imageUrl?: string;
  descriptionAz?: string;
};

const initialCategories: Category[] = [
  { id: "cat-1", nameAz: "Yemək dəstləri", slug: "yemek-destleri", descriptionAz: "Qonaq və servis dəstləri" },
  { id: "cat-2", nameAz: "Mətbəx texnikası", slug: "metbex-texnikasi", descriptionAz: "Çaydan və kiçik texnika" },
  { id: "cat-3", nameAz: "Dekor", slug: "dekor", descriptionAz: "Suvenir və aksesuarlar" }
];

const initialProducts: Product[] = [
  {
    id: "prd-1",
    nameAz: "12 nəfərlik boşqab dəsti",
    barcode: "4781000012456",
    categoryId: "cat-1",
    stock: 14,
    minStockLevel: 10,
    salePrice: 120,
    costPrice: 82,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=900&q=80",
    descriptionAz: "Qızılı haşiyəli premium servis dəsti"
  },
  {
    id: "prd-2",
    nameAz: "Elektrik çaydanı",
    barcode: "4781000099901",
    categoryId: "cat-2",
    stock: 7,
    minStockLevel: 10,
    salePrice: 65,
    costPrice: 44,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=80",
    descriptionAz: "Paslanmayan polad gövdəli model"
  }
];

export default function ProductsPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [draft, setDraft] = useState({
    nameAz: "",
    barcode: "",
    categoryId: initialCategories[0]?.id ?? "",
    stock: 0,
    minStockLevel: 5,
    salePrice: 0,
    costPrice: 0,
    status: "ACTIVE" as Product["status"],
    imageUrl: "",
    descriptionAz: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const lowStockCount = useMemo(() => products.filter((product) => product.stock <= product.minStockLevel).length, [products]);

  function resetDraft() {
    setDraft({
      nameAz: "",
      barcode: "",
      categoryId: categories[0]?.id ?? "",
      stock: 0,
      minStockLevel: 5,
      salePrice: 0,
      costPrice: 0,
      status: "ACTIVE",
      imageUrl: "",
      descriptionAz: ""
    });
    setEditingId(null);
  }

  function handleCategoryCreate() {
    if (!categoryName.trim() || !categorySlug.trim()) {
      return;
    }

    setCategories((current) => [
      {
        id: `cat-${Date.now()}`,
        nameAz: categoryName.trim(),
        slug: categorySlug.trim(),
        descriptionAz: categoryDescription.trim()
      },
      ...current
    ]);
    setCategoryName("");
    setCategorySlug("");
    setCategoryDescription("");
  }

  function handleProductSave() {
    if (!draft.nameAz || !draft.barcode || !draft.categoryId) {
      return;
    }

    if (editingId) {
      setProducts((current) =>
        current.map((product) => (product.id === editingId ? { ...product, ...draft } : product))
      );
    } else {
      setProducts((current) => [{ id: `prd-${Date.now()}`, ...draft }, ...current]);
    }

    resetDraft();
  }

  function handleProductEdit(product: Product) {
    setEditingId(product.id);
    setDraft({
      nameAz: product.nameAz,
      barcode: product.barcode,
      categoryId: product.categoryId,
      stock: product.stock,
      minStockLevel: product.minStockLevel,
      salePrice: product.salePrice,
      costPrice: product.costPrice,
      status: product.status,
      imageUrl: product.imageUrl ?? "",
      descriptionAz: product.descriptionAz ?? ""
    });
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setDraft((current) => ({ ...current, imageUrl: localUrl }));
  }

  return (
    <DashboardShell>
      <section className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden bg-[linear-gradient(145deg,rgba(22,50,95,0.98),rgba(31,67,112,0.92))] text-white">
            <CardHeader>
              <Badge className="w-fit bg-white/10 text-white">İL & AY məhsul idarəetməsi</Badge>
              <CardTitle className="display-font text-5xl text-white">Barkodlu məhsul kataloqu</CardTitle>
              <CardDescription className="max-w-2xl text-base text-white/70">
                Kateqoriya və məhsul CRUD, şəkil yükləmə sahəsi, qiymət strukturu və aşağı stok nəzarəti eyni ekranda.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <InfoPill title="Məhsul sayı" value={String(products.length)} />
              <InfoPill title="Kateqoriya" value={String(categories.length)} />
              <InfoPill title="Aşağı stok" value={String(lowStockCount)} />
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="display-font text-3xl">Yeni kateqoriya</CardTitle>
              <CardDescription>Menecer üçün sürətli kateqoriya yaradılması.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Kateqoriya adı" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} />
              <Input placeholder="Slug" value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)} />
              <Textarea
                placeholder="Qısa izah"
                value={categoryDescription}
                onChange={(event) => setCategoryDescription(event.target.value)}
              />
              <Button className="w-full" onClick={handleCategoryCreate}>
                <PackagePlus className="mr-2 h-4 w-4" />
                Kateqoriya əlavə et
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="display-font text-3xl">{editingId ? "Məhsulu redaktə et" : "Yeni məhsul"}</CardTitle>
              <CardDescription>Barkod, şəkil, stok və qiymət parametrləri.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Məhsul adı"
                  value={draft.nameAz}
                  onChange={(event) => setDraft((current) => ({ ...current, nameAz: event.target.value }))}
                />
                <div className="relative">
                  <ScanBarcode className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
                  <Input
                    className="pl-10"
                    placeholder="Barkod"
                    value={draft.barcode}
                    onChange={(event) => setDraft((current) => ({ ...current, barcode: event.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  className="h-11 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm outline-none focus:border-[var(--ring)]"
                  value={draft.categoryId}
                  onChange={(event) => setDraft((current) => ({ ...current, categoryId: event.target.value }))}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameAz}
                    </option>
                  ))}
                </select>
                <select
                  className="h-11 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm outline-none focus:border-[var(--ring)]"
                  value={draft.status}
                  onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as Product["status"] }))}
                >
                  <option value="ACTIVE">Aktiv</option>
                  <option value="INACTIVE">Passiv</option>
                  <option value="ARCHIVED">Arxiv</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="number"
                  placeholder="Satış qiyməti"
                  value={draft.salePrice}
                  onChange={(event) => setDraft((current) => ({ ...current, salePrice: Number(event.target.value) }))}
                />
                <Input
                  type="number"
                  placeholder="Maya dəyəri"
                  value={draft.costPrice}
                  onChange={(event) => setDraft((current) => ({ ...current, costPrice: Number(event.target.value) }))}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="number"
                  placeholder="Cari stok"
                  value={draft.stock}
                  onChange={(event) => setDraft((current) => ({ ...current, stock: Number(event.target.value) }))}
                />
                <Input
                  type="number"
                  placeholder="Minimum stok"
                  value={draft.minStockLevel}
                  onChange={(event) => setDraft((current) => ({ ...current, minStockLevel: Number(event.target.value) }))}
                />
              </div>

              <Textarea
                placeholder="Məhsul təsviri"
                value={draft.descriptionAz}
                onChange={(event) => setDraft((current) => ({ ...current, descriptionAz: event.target.value }))}
              />

              <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--background)]/80 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Şəkil yüklə</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Məhsul kartı üçün əsas şəkil əlavə edin.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold">
                    <ImagePlus className="h-4 w-4" />
                    Fayl seç
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {draft.imageUrl ? (
                  <div className="mt-4 overflow-hidden rounded-[22px]">
                    <img src={draft.imageUrl} alt="Məhsul ön baxış" className="h-52 w-full object-cover" />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleProductSave}>{editingId ? "Yenilə" : "Məhsulu əlavə et"}</Button>
                {editingId ? (
                  <Button variant="secondary" onClick={resetDraft}>
                    Ləğv et
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="display-font text-3xl">Məhsul siyahısı</CardTitle>
              <CardDescription>Mobil üçün kart görünüşü, geniş ekran üçün rahat idarəetmə ilə hazırlanıb.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {products.map((product) => {
                const category = categories.find((item) => item.id === product.categoryId);
                const isLowStock = product.stock <= product.minStockLevel;

                return (
                  <div key={product.id} className="grid gap-4 rounded-[26px] border border-[var(--border)] bg-[var(--background)]/70 p-4 md:grid-cols-[140px_1fr]">
                    <div className="overflow-hidden rounded-[22px] bg-white">
                      <img
                        src={product.imageUrl ?? "https://placehold.co/600x600/f7f4ee/16325f?text=İL+%26+AY"}
                        alt={product.nameAz}
                        className="h-full min-h-36 w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-[var(--foreground)]">{product.nameAz}</h3>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            {category?.nameAz} · Barkod: {product.barcode}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={isLowStock ? "warning" : "success"}>{isLowStock ? "Aşağı stok" : "Normal stok"}</Badge>
                          <Badge variant="accent">{product.status}</Badge>
                        </div>
                      </div>

                      <p className="text-sm text-[var(--muted-foreground)]">{product.descriptionAz}</p>

                      <div className="grid gap-3 sm:grid-cols-4">
                        <Metric label="Satış" value={`₼ ${product.salePrice}`} />
                        <Metric label="Maya" value={`₼ ${product.costPrice}`} />
                        <Metric label="Qalıq" value={String(product.stock)} />
                        <Metric label="Min. stok" value={String(product.minStockLevel)} />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button variant="secondary" onClick={() => handleProductEdit(product)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Redaktə et
                        </Button>
                        <Button variant="destructive" onClick={() => setProducts((current) => current.filter((item) => item.id !== product.id))}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Sil
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}

function InfoPill({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
      <p className="text-sm text-white/68">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}