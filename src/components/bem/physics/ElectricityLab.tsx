import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ElectricityLab() {
  const [activeTab, setActiveTab] = useState<'ac' | 'safety'>('ac');
  const [acResults, setAcResults] = useState<any>(null);
  const [exercisePanel, setExercisePanel] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [exerciseFeedback, setExerciseFeedback] = useState<any>(null);
  const [safetySelected, setSafetySelected] = useState('');
  const [safetyDiagnosis, setSafetyDiagnosis] = useState<any>(null);

  // Form states for AC
  const [n, setN] = useState('');
  const [sv, setSv] = useState('');
  const [m, setM] = useState('');
  const [sh, setSh] = useState('');

  const calculateAC = () => {
    const nVal = parseFloat(n);
    const svVal = parseFloat(sv);
    const mVal = parseFloat(m);
    const shVal = parseFloat(sh);

    if (!nVal || !svVal || !mVal || !shVal) {
      alert('⚠️ يرجى ملء جميع الحقول');
      return;
    }

    const umax = nVal * svVal;
    const ueff = (umax / Math.sqrt(2)).toFixed(2);
    const t_ms = mVal * shVal;
    const t_s = (t_ms / 1000).toFixed(4);
    const f = (1 / parseFloat(t_s)).toFixed(2);

    setAcResults({
      umax: umax.toFixed(2),
      umaxSubst: `${nVal} × ${svVal}`,
      ueff,
      ueffSubst: `${umax.toFixed(2)} ÷ √2`,
      t_ms: t_ms.toFixed(2),
      t_msSubst: `${mVal} × ${shVal}`,
      t_s,
      t_sSubst: `${t_ms.toFixed(2)} ÷ 1000`,
      f,
      fSubst: `1 ÷ ${t_s}`,
    });
  };

  const generateExercise = () => {
    const randomN = Math.floor(Math.random() * 4) + 1;
    const randomSv = Math.floor(Math.random() * 5) + 2;
    const randomM = Math.floor(Math.random() * 4) + 1;
    const randomSh = Math.floor(Math.random() * 5) + 5;

    const umaxCorrect = randomN * randomSv;
    const t_ms = randomM * randomSh;
    const t_s = t_ms / 1000;
    const fCorrect = (1 / t_s).toFixed(2);

    setCurrentExercise({
      n: randomN,
      sv: randomSv,
      m: randomM,
      sh: randomSh,
      umaxCorrect,
      fCorrect,
      userUmax: '',
      userF: '',
    });
    setExercisePanel(true);
    setExerciseFeedback(null);
  };

  const checkExercise = () => {
    if (!currentExercise) return;

    const userUmax = parseFloat(currentExercise.userUmax);
    const userF = parseFloat(currentExercise.userF);

    const umaxOk = Math.abs(userUmax - currentExercise.umaxCorrect) < 0.01;
    const fOk = Math.abs(userF - parseFloat(currentExercise.fCorrect)) < 0.5;
    const allCorrect = umaxOk && fOk;

    setExerciseFeedback({
      correct: allCorrect,
      umaxOk,
      fOk,
      umaxCorrect: currentExercise.umaxCorrect,
      fCorrect: currentExercise.fCorrect,
    });
  };

  const safetyData: Record<string, any> = {
    shock_metal: {
      cause: 'السلك الناقل (Phase) يلمس الهيكل المعدني للجهاز + عدم وجود سلك تأريض (Earth wire) لتفريغ التيار.',
      solution: 'عزل السلك الناقي وتوصيل سلك التأريض بشكل صحيح للهيكل المعدني.',
      rule: 'سلك التأريض يحمي الشخص من الصدمة بتوفير مسار آمن للتيار نحو الأرض.',
    },
    breaker_trip: {
      cause: 'الاستهلاك الإجمالي للأجهزة يتجاوز السعة المقررة للقاطع الرئيسي، مما يسبب حملاً زائداً.',
      solution: 'تقليل عدد الأجهزة المشغلة في نفس الوقت أو استبدال القاطع برأس أكبر.',
      rule: 'القواطع الكهربائية تحمي الشبكة من الحمل الزائد بقطع التيار تلقائياً.',
    },
    shock_bulb: {
      cause: 'السلك الناقي (Phase) للمصباح لا يزال يحمل التيار حتى عند فتح القاطعة.',
      solution: 'تأكد من أن القاطعة مثبتة على السلك الناقي (Phase) وليس على المحايد (Neutral).',
      rule: 'القاطعة يجب أن توقف التيار عن جميع المستقبلات لضمان الأمان عند الصيانة.',
    },
    device_fail: {
      cause: 'الفيوز (Fuse) قد يكون محترقاً أو مقطوعاً بسبب حمل زائد سابق أو عطل في الجهاز.',
      solution: 'استبدال الفيوز بآخر من نفس التصنيف (مثلاً 10A)، والتحقق من سبب احتراقه.',
      rule: 'الفيوز يحمي الدارة والجهاز من الحمل الزائد بقطع التيار تلقائياً عند تجاوز التيار المقرر.',
    },
  };

  const handleSafetyChange = (value: string) => {
    setSafetySelected(value);
    if (value && safetyData[value]) {
      setSafetyDiagnosis(safetyData[value]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* TABS */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('ac')}
          className={`px-4 py-2 font-semibold transition-all ${
            activeTab === 'ac'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          التيار المتناوب
        </button>
        <button
          onClick={() => setActiveTab('safety')}
          className={`px-4 py-2 font-semibold transition-all ${
            activeTab === 'safety'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          الأمن الكهربائي
        </button>
      </div>

      {/* AC TAB */}
      {activeTab === 'ac' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                📊 راسم الاهتزاز المهبطي (Oscilloscope)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vertical Axis */}
              <div>
                <h3 className="font-semibold mb-3 text-blue-600">محور التوترات (Vertical Axis)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">عدد التقسيمات n</label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="مثال: 3"
                      value={n}
                      onChange={(e) => setN(e.target.value)}
                    />
                    <span className="text-xs text-muted-foreground">divisions</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">الحساسية S<sub>v</sub></label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="مثال: 5"
                      value={sv}
                      onChange={(e) => setSv(e.target.value)}
                    />
                    <span className="text-xs text-muted-foreground">V/div</span>
                  </div>
                </div>
              </div>

              {/* Horizontal Axis */}
              <div>
                <h3 className="font-semibold mb-3 text-blue-600">محور الزمن (Horizontal Axis)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">عدد التقسيمات m</label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="مثال: 2"
                      value={m}
                      onChange={(e) => setM(e.target.value)}
                    />
                    <span className="text-xs text-muted-foreground">divisions</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">الحساسية S<sub>h</sub></label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="مثال: 10"
                      value={sh}
                      onChange={(e) => setSh(e.target.value)}
                    />
                    <span className="text-xs text-muted-foreground">ms/div</span>
                  </div>
                </div>
              </div>

              <Button onClick={calculateAC} className="w-full bg-blue-600 hover:bg-blue-700">
                حساب النتائج 🔍
              </Button>

              {/* Results */}
              {acResults && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 bg-blue-50 p-4 rounded-lg">
                  <div>
                    <Badge className="mb-2">الخطوة 1: U<sub>max</sub></Badge>
                    <div className="text-sm font-mono mb-2">U<sub>max</sub> = n × S<sub>v</sub> = {acResults.umaxSubst}</div>
                    <div className="text-lg font-bold text-green-600">
                      U<sub>max</sub> = {acResults.umax} <span className="text-sm">V</span>
                    </div>
                  </div>

                  <div>
                    <Badge className="mb-2">الخطوة 2: U<sub>eff</sub></Badge>
                    <div className="text-sm font-mono mb-2">U<sub>eff</sub> = U<sub>max</sub> ÷ √2 = {acResults.ueffSubst}</div>
                    <div className="text-lg font-bold text-green-600">
                      U<sub>eff</sub> = {acResults.ueff} <span className="text-sm">V</span>
                    </div>
                  </div>

                  <div>
                    <Badge className="mb-2">الخطوة 3: T (بالميلي ثانية)</Badge>
                    <div className="text-sm font-mono mb-2">T = m × S<sub>h</sub> = {acResults.t_msSubst}</div>
                    <div className="text-lg font-bold text-green-600">
                      T = {acResults.t_ms} <span className="text-sm">ms</span>
                    </div>
                  </div>

                  <div>
                    <Badge className="mb-2 bg-red-600">الخطوة 4: تحويل T إلى الثواني (CRITICAL)</Badge>
                    <div className="text-sm font-mono mb-2">T<sub>s</sub> = T<sub>ms</sub> ÷ 1000 = {acResults.t_sSubst}</div>
                    <div className="text-lg font-bold text-red-600">
                      T<sub>s</sub> = {acResults.t_s} <span className="text-sm">s</span>
                    </div>
                  </div>

                  <div>
                    <Badge className="mb-2">الخطوة 5: التردد f</Badge>
                    <div className="text-sm font-mono mb-2">f = 1 ÷ T<sub>s</sub> = {acResults.fSubst}</div>
                    <div className="text-lg font-bold text-green-600">
                      f = {acResults.f} <span className="text-sm">Hz</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Exercise Section */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 توليد تمرين</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">اضغط الزر لتوليد تمرين عشوائي وحل المسألة:</p>
              <Button onClick={generateExercise} className="w-full bg-orange-500 hover:bg-orange-600">
                توليد تمرين جديد
              </Button>

              {exercisePanel && currentExercise && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm bg-white p-3 rounded">
                    <strong>📊 تمرين عشوائي:</strong>
                    <div className="mt-2">
                      n = {currentExercise.n} | S<sub>v</sub> = {currentExercise.sv} V/div
                      <br />
                      m = {currentExercise.m} | S<sub>h</sub> = {currentExercise.sh} ms/div
                      <br />
                      <strong>احسب: U<sub>max</sub> و f</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="U_max (V)"
                      value={currentExercise.userUmax}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, userUmax: e.target.value })}
                    />
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="f (Hz)"
                      value={currentExercise.userF}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, userF: e.target.value })}
                    />
                  </div>

                  <Button onClick={checkExercise} className="w-full">
                    تحقق من الإجابة ✓
                  </Button>

                  {exerciseFeedback && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-3 rounded-lg ${
                        exerciseFeedback.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className={`font-bold ${exerciseFeedback.correct ? 'text-green-700' : 'text-red-700'}`}>
                        {exerciseFeedback.correct ? '✅ ممتاز! إجابتك صحيحة!' : '⚠️ بعض الإجابات غير صحيحة'}
                      </div>
                      <div className="text-sm mt-2 space-y-1">
                        <div className={!exerciseFeedback.umaxOk ? 'text-red-600' : 'text-green-600'}>
                          {!exerciseFeedback.umaxOk && '❌ '}U<sub>max</sub> الصحيحة: {exerciseFeedback.umaxCorrect} V
                        </div>
                        <div className={!exerciseFeedback.fOk ? 'text-red-600' : 'text-green-600'}>
                          {!exerciseFeedback.fOk && '❌ '}f الصحيحة: {exerciseFeedback.fCorrect} Hz
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* SAFETY TAB */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                🔒 تشخيص المشاكل الشائعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">اختر المشكلة الشائعة:</label>
                <select
                  value={safetySelected}
                  onChange={(e) => handleSafetyChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">-- اختر مشكلة --</option>
                  <option value="shock_metal">صدمة كهربائية عند لمس الهيكل المعدني</option>
                  <option value="breaker_trip">انقطاع التيار عند تشغيل عدة أجهزة</option>
                  <option value="shock_bulb">صدمة عند تغيير مصباح والقاطعة مفتوحة</option>
                  <option value="device_fail">عدم اشتغال جهاز رغم سلامته</option>
                </select>
              </div>

              {safetyDiagnosis && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-red-50 border-r-4 border-red-600 p-4 rounded">
                    <div className="font-bold text-red-700 mb-2">⚠️ السبب</div>
                    <div className="text-sm text-red-900">{safetyDiagnosis.cause}</div>
                  </div>

                  <div className="bg-green-50 border-r-4 border-green-600 p-4 rounded">
                    <div className="font-bold text-green-700 mb-2">✓ الحل</div>
                    <div className="text-sm text-green-900">{safetyDiagnosis.solution}</div>
                  </div>

                  <div className="bg-blue-50 border-r-4 border-blue-600 p-4 rounded">
                    <div className="font-bold text-blue-700 mb-2">📋 القاعدة الأمنية</div>
                    <div className="text-sm text-blue-900">{safetyDiagnosis.rule}</div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Safety Rules Reference */}
          <Card>
            <CardHeader>
              <CardTitle>📚 مرجع القواعد الأمنية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>🔌 التأريض (Earth Wire):</strong> يحمي من الصدمات الكهربائية بتفريغ التيار إلى الأرض.
              </p>
              <p>
                <strong>⚡ الحماية (Protection):</strong> القواطع والفيوزات تقطع التيار عند الإفراط في الاستهلاك.
              </p>
              <p>
                <strong>🛡️ العزل (Insulation):</strong> يمنع لمس الأسلاك الناقلة للتيار.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
