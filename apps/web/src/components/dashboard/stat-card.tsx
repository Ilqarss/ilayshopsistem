import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

type Tone = "primary" | "success" | "warning" | "accent";

const toneMap = {
  primary: "bg-[var(--soft-navy)] text-[var(--primary)]",
  success: "bg-[var(--success-soft)] text-[var(--success)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  accent: "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
} as const;

export function StatCard({
  title,
  value,
  tone,
  detail
}: {
  title: string;
  value: string;
  tone: Tone;
  detail?: string;
}) {
  return (
    <Card className="luxury-border overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-[18px] ${toneMap[tone]}`}>
            <span className="text-lg">✦</span>
          </div>
          <Badge variant={tone === "primary" ? "default" : tone}>{title}</Badge>
        </div>
        <div className="mt-6">
          <p className="text-sm text-[var(--muted-foreground)]">{title}</p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-[var(--foreground)]">{value}</p>
          {detail ? <p className="mt-3 text-sm text-[var(--muted-foreground)]">{detail}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}