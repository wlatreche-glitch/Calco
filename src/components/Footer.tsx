import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-12 bg-card/40">
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div className="space-y-2">
          <h4 className="font-extrabold text-base">Calco</h4>
          <p className="text-muted-foreground leading-relaxed">
            منصة تعليمية ذكية للطلاب الجزائريين — باكالوريا و BEM.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-extrabold text-base">روابط</h4>
          <ul className="space-y-1.5">
            <li><Link to="/" className="text-muted-foreground hover:text-foreground transition">الرئيسية</Link></li>
            <li><Link to="/coach" className="text-muted-foreground hover:text-foreground transition">Calco Coach</Link></li>
            <li><Link to="/exercises" className="text-muted-foreground hover:text-foreground transition">التمارين</Link></li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-extrabold text-base">قانوني</h4>
          <ul className="space-y-1.5">
            <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition">شروط الاستخدام</Link></li>
            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition">سياسة الخصوصية</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-4 text-center text-xs text-muted-foreground">
        © 2026 Calco — جميع الحقوق محفوظة · منصة تعليمية ذكية للطلاب الجزائريين
      </div>
    </footer>
  );
}