import { Link } from 'react-router-dom';
import { GraduationCap, School, ArrowLeft } from 'lucide-react';

export default function PathCards() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-extrabold flex items-center gap-2">
        🎓 اختر مسارك
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="group relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-calco-violet via-purple-600 to-calco-blue shadow-xl transition">
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-white/15 blur-3xl" />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black">🟣 الباكالوريا</h3>
                <p className="text-sm opacity-90 mt-1">اختر القسم وشاهد الأدوات المطوَّرة لكل فرع</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/bac-math"
                className="rounded-2xl border border-white/10 bg-white/10 p-4 text-right transition hover:bg-white/20"
              >
                <p className="text-sm font-semibold">📘 رياضيات</p>
                <p className="text-[11px] opacity-80 mt-2 leading-5">
                  الأدوات الستة للرياضيات في الباك
                </p>
              </Link>
              <Link
                to="/physics"
                className="rounded-2xl border border-white/10 bg-white/10 p-4 text-right transition hover:bg-white/20"
              >
                <p className="text-sm font-semibold">⚛️ فيزياء</p>
                <p className="text-[11px] opacity-80 mt-2 leading-5">
                  أدوات الفيزياء التفاعلية الخاصة بالباك
                </p>
              </Link>
              <Link
                to="/bac-chemistry"
                className="rounded-2xl border border-white/10 bg-white/10 p-4 text-right transition hover:bg-white/20"
              >
                <p className="text-sm font-semibold">🧪 كيمياء</p>
                <p className="text-[11px] opacity-80 mt-2 leading-5">
                  أدوات الكيمياء لبكالوريا العلوم التجريبية
                </p>
              </Link>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-emerald-500 via-teal-500 to-calco-cyan shadow-xl transition">
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-white/15 blur-3xl" />
          <div className="relative flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <School className="w-6 h-6" />
            </div>
            <Link to="/bem" className="flex-1">
              <h3 className="text-xl font-black">🔵 BEM / متوسط</h3>
              <p className="text-sm opacity-90 mt-1">اختر القسم وشاهد الأدوات</p>
              <p className="text-[11px] opacity-75 mt-2">
                رياضيات متوسط • فيزياء
              </p>
            </Link>
            <ArrowLeft className="w-5 h-5 opacity-80 transition" />
          </div>
        </div>
      </div>
    </section>
  );
}