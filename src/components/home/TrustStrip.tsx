import { CheckCircle2, BookCheck, Sparkles, Smartphone, Timer } from 'lucide-react';

const ITEMS = [
  { icon: BookCheck, text: 'متوافق مع المنهاج الجزائري' },
  { icon: CheckCircle2, text: 'مراجعة نهائية للبكالوريا و BEM' },
  { icon: Sparkles, text: 'مدعوم بالذكاء الاصطناعي' },
  { icon: Smartphone, text: 'مناسب للهواتف' },
  { icon: Timer, text: 'مصمم للمراجعة السريعة' },
];

export default function TrustStrip() {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {ITEMS.map((it) => {
        const Icon = it.icon;
        return (
          <div
            key={it.text}
            className="glass-card rounded-2xl p-3 flex items-center gap-2 text-sm font-semibold text-foreground/90 bg-card/60"
          >
            <Icon className="w-5 h-5 text-calco-blue shrink-0" />
            <span className="leading-tight">{it.text}</span>
          </div>
        );
      })}
    </section>
  );
}