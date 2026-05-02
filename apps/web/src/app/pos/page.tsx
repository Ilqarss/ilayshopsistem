import { DashboardShell } from "../../components/layout/dashboard-shell";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export default function PosPage() {
  return (
    <DashboardShell>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <Badge className="w-fit" variant="accent">İL & AY POS</Badge>
            <CardTitle className="display-font text-4xl">Satış ekranı</CardTitle>
            <CardDescription>Barkodla sürətli satış, mobil kassir axını və çek önizləməsi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Barkodu skan edin və ya daxil edin" />
            <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--background)]/70 p-8 text-center text-[var(--muted-foreground)]">
              Səbət və barkod axını Faza 3-də tam satış logikası ilə davam edəcək.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="display-font text-3xl">Ödəniş xülasəsi</CardTitle>
            <CardDescription>Nağd, kart, bank krediti və taksit dəstəyi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Aralıq cəm", "₼ 0.00"],
              ["Endirim", "₼ 0.00"],
              ["Yekun", "₼ 0.00"]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-[20px] border border-[var(--border)] px-4 py-3">
                <span className="text-[var(--muted-foreground)]">{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
            <div className="grid gap-2 sm:grid-cols-2">
              {["Nağd", "Kart", "Bank krediti", "Taksit"].map((item) => (
                <Badge key={item} className="justify-center py-2" variant="default">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}