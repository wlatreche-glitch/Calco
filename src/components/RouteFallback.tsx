import { Loader2 } from 'lucide-react';

export default function RouteFallback() {
  return (
    <div dir="rtl" className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">جاري التحميل…</p>
    </div>
  );
}