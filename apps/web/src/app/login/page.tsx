"use client";

import { ArrowRight, LockKeyhole, ScanBarcode, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../lib/auth/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(credential, password);
      router.push("/dashboard");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Giriş mümkün olmadı");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,187,137,0.28),transparent_25%),linear-gradient(135deg,#10213f_0%,#16325f_45%,#254d7a_100%)]" />
      <div className="absolute inset-y-0 left-0 hidden w-1/2 border-r border-white/10 bg-white/5 backdrop-blur-sm lg:block" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1600px] items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <section className="hidden text-white lg:block">
          <div className="max-w-xl">
            <p className="display-font text-7xl leading-none">İL & AY</p>
            <p className="mt-5 text-lg leading-8 text-white/78">
              Cehizlik mağazası üçün zərif, sürətli və mobil uyğun POS idarəetmə sistemi.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { title: "Barkod", icon: <ScanBarcode className="h-5 w-5" />, text: "Məhsulları barkodla sürətli tapın." },
              { title: "POS", icon: <ShoppingBag className="h-5 w-5" />, text: "Nağd, kart, bank krediti və taksit." },
              { title: "Təhlükəsizlik", icon: <LockKeyhole className="h-5 w-5" />, text: "JWT giriş və rol əsaslı icazə." }
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/8 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--navy-950)]">
                  {item.icon}
                </div>
                <p className="mt-4 text-lg font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/72">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <Card className="glass-panel luxury-border mx-auto w-full max-w-[520px] overflow-hidden border-white/40">
          <CardContent className="p-6 sm:p-8">
            <div className="rounded-[28px] bg-[linear-gradient(135deg,rgba(22,50,95,0.06),rgba(216,187,137,0.16))] p-6">
              <p className="display-font text-5xl text-[var(--primary)]">İL & AY</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">Cehizlik mağazası · Mingəçevir</p>
              <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Sistemə daxil ol</h1>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">İstifadəçi adı, telefon və ya email ilə daxil olun.</p>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">Giriş məlumatı</label>
                <Input
                  placeholder="owner, +994..., və ya email"
                  value={credential}
                  onChange={(event) => setCredential(event.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">Şifrə</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error ? (
                <div className="rounded-[20px] border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Daxil olunur..." : "Daxil ol"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 grid gap-3 rounded-[24px] border border-[var(--border)] bg-white/75 p-4 text-sm text-[var(--muted-foreground)] sm:grid-cols-3">
              <div>
                <p className="font-semibold text-[var(--foreground)]">admin</p>
                <p>Admin (Sahibkar)</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)]">satici1</p>
                <p>Satıcı</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)]">derzi1</p>
                <p>Dərzi paneli</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}