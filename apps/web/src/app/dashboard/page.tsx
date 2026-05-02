"use client";

import { useEffect, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { StatCard } from "../../components/dashboard/stat-card";
import { DashboardShell } from "../../components/layout/dashboard-shell";
import { useApi, useAuth } from "../../lib/auth/auth-context";

type Summary = {
  totalRevenue: number;
  totalSales: number;
  totalProfit?: number;
  netProfit?: number;
  totalExpenses?: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const apiFetch = useApi();
  const [summary, setSummary] = useState<Summary | null>(null);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    apiFetch<Summary>("/reports/summary")
      .then(setSummary)
      .catch(() => undefined);
  }, [apiFetch]);

  if (user?.role === "TAILOR") {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="display-font text-4xl text-[var(--primary)]">Salam, {user.fullName}!</p>
          <p className="mt-4 text-[var(--muted-foreground)]">Dərzi panelinə keçin – sifarişlərinizi görün və status yeniləyin.</p>
          <a
            href="/tailor"
            className="mt-6 inline-block rounded-[20px] bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-strong)] transition"
          >
            Dərzi paneli →
          </a>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <section className="space-y-6">
        {/* Hero */}
        <Card className="overflow-hidden bg-[linear-gradient(140deg,rgba(22,50,95,0.98),rgba(15,29,57,0.95))] text-white">
          <CardHeader>
            <Badge className="w-fit bg-white/10 text-white">İL & AY · Pərdə & Jalüz ERP</Badge>
            <CardTitle className="display-font text-4xl text-white">Cehizlik mağazası üçün tam idarəetmə sistemi</CardTitle>
            <CardDescription className="text-base text-white/72">
              Anbar, satış kalkulyatoru, müştəri CRM, dərzi paneli və maliyyə hesabatları bir yerdə.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {["Pərdə büzmə hesabı", "Jalüz m² kalkulyatoru", "Beh & borc izləmə"].map(item => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-white/8 p-4 text-sm text-white/80">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Statistikalar */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Bugünkü gəlir"
            value={summary ? `₼ ${summary.totalRevenue.toFixed(2)}` : "—"}
            tone="primary"
            detail="Bütün ödəniş növləri"
          />
          <StatCard
            title="Satış sayı"
            value={summary ? String(summary.totalSales) : "—"}
            tone="success"
            detail="Bugün tamamlanan"
          />
          {isAdmin && (
            <>
              <StatCard
                title="Xalis mənfəət"
                value={summary?.netProfit !== undefined ? `₼ ${summary.netProfit.toFixed(2)}` : "—"}
                tone="accent"
                detail="Xərclərdən sonra"
              />
              <StatCard
                title="Ümumi xərc"
                value={summary?.totalExpenses !== undefined ? `₼ ${summary.totalExpenses.toFixed(2)}` : "—"}
                tone="warning"
                detail="Bugünkü xərclər"
              />
            </>
          )}
          {!isAdmin && (
            <StatCard
              title="Rol"
              value="Satıcı"
              tone="accent"
              detail="Alış qiyməti gizlidir"
            />
          )}
        </div>

        {/* Modullar */}
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="display-font text-2xl">Sürətli keçidlər</CardTitle>
              <CardDescription>Ən çox istifadə olunan modullar</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/sales", label: "Yeni satış", desc: "Pərdə/jalüz kalkulyatoru" },
                { href: "/inventory", label: "Anbar", desc: "Stok və Excel import" },
                { href: "/customers", label: "Müştərilər", desc: "CRM və borc izləmə" },
                { href: "/tailor", label: "Dərzi paneli", desc: "Sifariş statusları" },
                ...(isAdmin ? [
                  { href: "/reports", label: "Hesabatlar", desc: "Mənfəət & komissiyalar" },
                  { href: "/expenses", label: "Xərclər", desc: "Gündəlik xərc qeydi" }
                ] : [
                  { href: "/expenses", label: "Xərc qeyd et", desc: "Parasok, kommunal vs." }
                ])
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group rounded-[20px] border border-[var(--border)] bg-[var(--background)]/60 p-4 transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  <p className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">{item.label}</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.desc}</p>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="display-font text-2xl">Sistem rolları</CardTitle>
              <CardDescription>3 fərqli giriş səviyyəsi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { role: "ADMIN", label: "Admin (Sahibkar)", desc: "Tam giriş: alış qiyməti, xalis mənfəət, komissiyalar, bütün hesabatlar.", color: "bg-[var(--accent)]/15 border-[var(--accent)]/30" },
                { role: "SELLER", label: "Satıcı", desc: "Satış, anbar girişi, müştəri CRM, xərc qeydi. Alış qiyməti gizlidir.", color: "bg-[var(--soft-navy)] border-[var(--border)]" },
                { role: "TAILOR", label: "Dərzi", desc: "Yalnız dərzi sifarişlərini görür: ölçülər, model, status yeniləmə.", color: "bg-[var(--success-soft)] border-[var(--success)]/30" }
              ].map(item => (
                <div key={item.role} className={`rounded-[20px] border p-4 ${item.color} ${user?.role === item.role ? "ring-2 ring-[var(--accent)]" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--foreground)]">{item.label}</span>
                    {user?.role === item.role && <Badge variant="accent">Siz</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}
