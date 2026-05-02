"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { DashboardShell } from "../../components/layout/dashboard-shell";
import { useApi } from "../../lib/auth/auth-context";

type Measurement = { id: string; roomName: string; width: number; height: number; notes?: string; createdAt: string };
type SaleSnap = { id: string; saleNumber: string; total: number; deposit: number; debt: number; soldAt: string; note?: string };
type Customer = {
  id: string; name: string; phone: string; address?: string; notes?: string;
  totalDebt: number; createdAt: string;
  measurements?: Measurement[];
  sales?: SaleSnap[];
};

export default function CustomersPage() {
  const apiFetch = useApi();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showMeasForm, setShowMeasForm] = useState(false);

  // Yeni müştəri formu
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newNotes, setNewNotes] = useState("");
  // Yeni ölçü formu
  const [roomName, setRoomName] = useState("");
  const [measWidth, setMeasWidth] = useState("");
  const [measHeight, setMeasHeight] = useState("");
  const [measNotes, setMeasNotes] = useState("");
  // Borc ödə
  const [payDebtSaleId, setPayDebtSaleId] = useState("");
  const [payDebtAmount, setPayDebtAmount] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: "1", limit: "30" });
    if (search) params.set("q", search);
    apiFetch<{ items: Customer[]; total: number }>(`/customers?${params}`)
      .then(d => { setCustomers(d.items); setTotal(d.total); })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [apiFetch, search]);

  useEffect(() => { load(); }, [load]);

  async function openCustomer(c: Customer) {
    const full = await apiFetch<Customer>(`/customers/${c.id}`);
    setSelected(full);
  }

  async function createCustomer() {
    if (!newName || !newPhone) { alert("Ad və telefon tələb olunur"); return; }
    try {
      await apiFetch("/customers", {
        method: "POST",
        body: JSON.stringify({ name: newName, phone: newPhone, address: newAddress, notes: newNotes })
      });
      setShowForm(false);
      setNewName(""); setNewPhone(""); setNewAddress(""); setNewNotes("");
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xəta");
    }
  }

  async function addMeasurement() {
    if (!selected || !roomName || !measWidth || !measHeight) { alert("Otaq adı, en və hündürlük tələb olunur"); return; }
    try {
      await apiFetch(`/customers/${selected.id}/measurements`, {
        method: "POST",
        body: JSON.stringify({ roomName, width: Number(measWidth), height: Number(measHeight), notes: measNotes })
      });
      setShowMeasForm(false);
      setRoomName(""); setMeasWidth(""); setMeasHeight(""); setMeasNotes("");
      const full = await apiFetch<Customer>(`/customers/${selected.id}`);
      setSelected(full);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xəta");
    }
  }

  async function payDebt() {
    if (!payDebtSaleId || !payDebtAmount) return;
    try {
      await apiFetch(`/sales/${payDebtSaleId}/pay-debt`, {
        method: "POST",
        body: JSON.stringify({ amount: Number(payDebtAmount), paymentType: "CASH" })
      });
      setPayDebtSaleId(""); setPayDebtAmount("");
      if (selected) {
        const full = await apiFetch<Customer>(`/customers/${selected.id}`);
        setSelected(full);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xəta");
    }
  }

  return (
    <DashboardShell>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        {/* Sol: Siyahı */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="display-font text-3xl text-[var(--primary)]">Müştərilər</h1>
              <p className="text-sm text-[var(--muted-foreground)]">{total} müştəri</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} size="sm">+ Yeni</Button>
          </div>

          {showForm && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Yeni müştəri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Ad Soyad" value={newName} onChange={e => setNewName(e.target.value)} />
                <Input placeholder="+994 XX XXX XX XX" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
                <Input placeholder="Ünvan (ixtiyari)" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
                <Input placeholder="Qeyd" value={newNotes} onChange={e => setNewNotes(e.target.value)} />
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={createCustomer}>Yadda saxla</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Ləğv</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Input
            placeholder="Telefon və ya ad ilə axtar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="space-y-2">
            {loading ? (
              <p className="text-center text-sm text-[var(--muted-foreground)]">Yüklənir...</p>
            ) : customers.length === 0 ? (
              <p className="text-center text-sm text-[var(--muted-foreground)]">Müştəri tapılmadı</p>
            ) : customers.map(c => (
              <button
                key={c.id}
                onClick={() => openCustomer(c)}
                className={`w-full rounded-[22px] border p-4 text-left transition hover:border-[var(--accent)] ${selected?.id === c.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] bg-white/60"}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{c.phone}</p>
                  </div>
                  <div className="text-right">
                    {c.totalDebt > 0
                      ? <Badge variant="destructive" className="text-xs">Borc: ₼ {c.totalDebt.toFixed(2)}</Badge>
                      : <Badge variant="success" className="text-xs">Borcsuzdur</Badge>
                    }
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sağ: Detallar */}
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="display-font text-2xl text-[var(--primary)]">{selected.name}</h2>
                <p className="text-sm text-[var(--muted-foreground)]">{selected.phone}</p>
                {selected.address && <p className="text-sm text-[var(--muted-foreground)]">{selected.address}</p>}
              </div>
              {selected.totalDebt > 0 && (
                <Badge variant="destructive">Borc: ₼ {selected.totalDebt.toFixed(2)}</Badge>
              )}
            </div>

            {/* Ölçülər */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Saxlanmış ölçülər</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setShowMeasForm(!showMeasForm)}>+ Ölçü</Button>
                </div>
              </CardHeader>
              <CardContent>
                {showMeasForm && (
                  <div className="mb-4 space-y-3 rounded-[18px] border border-[var(--border)] p-3">
                    <Input placeholder="Otaq adı (Salon, Yataq...)" value={roomName} onChange={e => setRoomName(e.target.value)} className="text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" placeholder="En (m)" value={measWidth} onChange={e => setMeasWidth(e.target.value)} className="text-sm" />
                      <Input type="number" placeholder="Hündürlük (m)" value={measHeight} onChange={e => setMeasHeight(e.target.value)} className="text-sm" />
                    </div>
                    <Input placeholder="Qeyd" value={measNotes} onChange={e => setMeasNotes(e.target.value)} className="text-sm" />
                    <div className="flex gap-2">
                      <Button className="flex-1 text-xs" onClick={addMeasurement}>Yadda saxla</Button>
                      <Button variant="outline" className="flex-1 text-xs" onClick={() => setShowMeasForm(false)}>Ləğv</Button>
                    </div>
                  </div>
                )}

                {!selected.measurements?.length ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Ölçü saxlanılmayıb</p>
                ) : (
                  <div className="space-y-2">
                    {selected.measurements.map(m => (
                      <div key={m.id} className="flex items-center justify-between rounded-[16px] border border-[var(--border)] px-3 py-2 text-sm">
                        <span className="font-medium">{m.roomName}</span>
                        <span className="text-[var(--muted-foreground)]">{m.width} × {m.height} m</span>
                        {m.notes && <span className="text-xs text-[var(--muted-foreground)]">{m.notes}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alış tarixçəsi / Borc */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Satış tarixçəsi & Borc</CardTitle>
                <CardDescription>Son 50 satış</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Borc ödə */}
                {selected.totalDebt > 0 && selected.sales?.some(s => s.debt > 0) && (
                  <div className="rounded-[18px] border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-3 space-y-2">
                    <p className="text-sm font-semibold text-[var(--danger)]">Borc ödə</p>
                    <div className="flex gap-2">
                      <select value={payDebtSaleId} onChange={e => setPayDebtSaleId(e.target.value)}
                        className="flex-1 h-9 rounded-xl border border-[var(--border)] px-2 text-xs">
                        <option value="">Satış seçin</option>
                        {selected.sales?.filter(s => s.debt > 0).map(s => (
                          <option key={s.id} value={s.id}>
                            #{s.saleNumber.slice(-8)} · ₼ {s.debt.toFixed(2)}
                          </option>
                        ))}
                      </select>
                      <Input type="number" placeholder="₼" value={payDebtAmount} onChange={e => setPayDebtAmount(e.target.value)} className="w-24 h-9 text-sm" />
                      <Button size="sm" onClick={payDebt}>Ödə</Button>
                    </div>
                  </div>
                )}

                {!selected.sales?.length ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Satış tapılmadı</p>
                ) : selected.sales.map(s => (
                  <div key={s.id} className="flex items-center justify-between rounded-[16px] border border-[var(--border)] px-3 py-2 text-sm">
                    <div>
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">#{s.saleNumber.slice(-8)}</span>
                      <span className="ml-2">{new Date(s.soldAt).toLocaleDateString("az-AZ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₼ {s.total.toFixed(2)}</span>
                      {s.debt > 0
                        ? <Badge variant="destructive" className="text-xs">Borc ₼{s.debt.toFixed(2)}</Badge>
                        : <Badge variant="success" className="text-xs">Ödənilib</Badge>
                      }
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-[28px] border border-dashed border-[var(--border)] py-24">
            <p className="text-[var(--muted-foreground)]">Sol tərəfdən müştəri seçin</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
