import { useState } from 'react';
import { MessageCircle, X, Check } from 'lucide-react';
import { addFeedback } from '@/lib/userPrefs';
import { toast } from 'sonner';

const TOOLS = ['عام', 'BAC Calculator', 'Calco Coach', 'الدوال', 'المعادلات', 'الفيزياء', 'الكيمياء', 'الإحصاء', 'BEM'];

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState('عام');
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) return;
    addFeedback({ tool, text: text.trim() });
    toast.success('شكراً! تم إرسال ملاحظتك.');
    setText('');
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="ملاحظات"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 bg-gradient-to-br from-calco-violet to-calco-blue text-white font-bold px-4 py-3 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-sm">💬 ملاحظات</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div dir="rtl" className="w-full max-w-md bg-card rounded-3xl shadow-2xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">💬 ساعدنا في تحسين Calco</h3>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-muted-foreground">هل لاحظت خطأ أو لديك اقتراح؟ شاركنا رأيك.</p>

            <div>
              <label className="text-sm font-semibold block mb-1.5">الأداة</label>
              <select value={tool} onChange={(e) => setTool(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1.5">ملاحظتك</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
                placeholder="اكتب ملاحظتك هنا..."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none" />
            </div>

            <button onClick={submit} disabled={!text.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-br from-calco-violet to-calco-blue text-white font-extrabold py-3 rounded-2xl disabled:opacity-50">
              <Check className="w-5 h-5" /> إرسال
            </button>
            <p className="text-[11px] text-muted-foreground text-center">يتم الحفظ محليًا فقط على جهازك.</p>
          </div>
        </div>
      )}
    </>
  );
}