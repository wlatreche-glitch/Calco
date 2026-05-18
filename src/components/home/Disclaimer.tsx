import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
      <p className="text-sm leading-relaxed text-foreground/90">
        ⚠️ هذه المنصة أداة مساعدة تعليمية ولا تغني عن الدراسة الرسمية أو الأساتذة،
        وقد تحتوي بعض الإجابات على أخطاء غير مقصودة.
      </p>
    </div>
  );
}