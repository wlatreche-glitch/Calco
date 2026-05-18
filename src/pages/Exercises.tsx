import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dices, BookOpen, GraduationCap, Target, RefreshCw, Eye, EyeOff, CheckCircle2 } from "lucide-react";

type Branch = "sciences" | "math" | "technical";
type Topic = "equations" | "functions" | "integrals" | "matrices" | "sequences" | "statistics" | "geometry";
type Level = "easy" | "medium" | "hard";

interface Exercise {
  id: string;
  question: string;
  questionAr: string;
  hint?: string;
  solution: string;
  solutionSteps: string[];
  topic: Topic;
  level: Level;
  branch: Branch[];
}

const branches: { value: Branch; label: string; labelAr: string }[] = [
  { value: "sciences", label: "Sciences Expérimentales", labelAr: "علوم تجريبية" },
  { value: "math", label: "Mathématiques", labelAr: "رياضيات" },
  { value: "technical", label: "Technique Mathématique", labelAr: "تقني رياضي" },
];

const topics: { value: Topic; label: string; labelAr: string }[] = [
  { value: "equations", label: "Équations", labelAr: "المعادلات" },
  { value: "functions", label: "Fonctions", labelAr: "الدوال" },
  { value: "integrals", label: "Intégrales", labelAr: "التكاملات" },
  { value: "matrices", label: "Matrices", labelAr: "المصفوفات" },
  { value: "sequences", label: "Suites", labelAr: "المتتاليات" },
  { value: "statistics", label: "Statistiques", labelAr: "الإحصاء" },
  { value: "geometry", label: "Géométrie", labelAr: "الهندسة" },
];

const levels: { value: Level; label: string; labelAr: string; color: string }[] = [
  { value: "easy", label: "Facile", labelAr: "سهل", color: "bg-emerald-500" },
  { value: "medium", label: "Moyen", labelAr: "متوسط", color: "bg-amber-500" },
  { value: "hard", label: "Difficile", labelAr: "صعب", color: "bg-rose-500" },
];

// Exercise database
const exerciseDatabase: Exercise[] = [
  // Equations - Easy
  {
    id: "eq-1",
    question: "Solve: 2x + 5 = 15",
    questionAr: "حل المعادلة: 2x + 5 = 15",
    solution: "x = 5",
    solutionSteps: [
      "2x + 5 = 15",
      "2x = 15 - 5",
      "2x = 10",
      "x = 10 ÷ 2",
      "x = 5"
    ],
    topic: "equations",
    level: "easy",
    branch: ["sciences", "math", "technical"],
  },
  {
    id: "eq-2",
    question: "Solve: 3x - 7 = 2x + 4",
    questionAr: "حل المعادلة: 3x - 7 = 2x + 4",
    solution: "x = 11",
    solutionSteps: [
      "3x - 7 = 2x + 4",
      "3x - 2x = 4 + 7",
      "x = 11"
    ],
    topic: "equations",
    level: "easy",
    branch: ["sciences", "math", "technical"],
  },
  // Equations - Medium
  {
    id: "eq-3",
    question: "Solve: x² - 5x + 6 = 0",
    questionAr: "حل المعادلة: x² - 5x + 6 = 0",
    hint: "استخدم التحليل أو صيغة المميز",
    solution: "x = 2 أو x = 3",
    solutionSteps: [
      "x² - 5x + 6 = 0",
      "Δ = b² - 4ac = 25 - 24 = 1",
      "x = (5 ± 1) / 2",
      "x₁ = 3, x₂ = 2"
    ],
    topic: "equations",
    level: "medium",
    branch: ["sciences", "math", "technical"],
  },
  {
    id: "eq-4",
    question: "Solve: 2x² + 3x - 5 = 0",
    questionAr: "حل المعادلة: 2x² + 3x - 5 = 0",
    solution: "x = 1 أو x = -2.5",
    solutionSteps: [
      "2x² + 3x - 5 = 0",
      "Δ = 9 + 40 = 49",
      "x = (-3 ± 7) / 4",
      "x₁ = 1, x₂ = -5/2"
    ],
    topic: "equations",
    level: "medium",
    branch: ["sciences", "math", "technical"],
  },
  // Equations - Hard
  {
    id: "eq-5",
    question: "Solve: x³ - 6x² + 11x - 6 = 0",
    questionAr: "حل المعادلة: x³ - 6x² + 11x - 6 = 0",
    hint: "ابحث عن جذر واضح ثم حلل",
    solution: "x = 1, x = 2, x = 3",
    solutionSteps: [
      "نجرب x = 1: 1 - 6 + 11 - 6 = 0 ✓",
      "نقسم على (x - 1)",
      "x³ - 6x² + 11x - 6 = (x - 1)(x² - 5x + 6)",
      "x² - 5x + 6 = (x - 2)(x - 3)",
      "الحلول: x = 1, 2, 3"
    ],
    topic: "equations",
    level: "hard",
    branch: ["math", "technical"],
  },
  // Functions - Easy
  {
    id: "fn-1",
    question: "Find f'(x) if f(x) = 3x² + 2x",
    questionAr: "أوجد f'(x) إذا كانت f(x) = 3x² + 2x",
    solution: "f'(x) = 6x + 2",
    solutionSteps: [
      "f(x) = 3x² + 2x",
      "f'(x) = 3 × 2x + 2",
      "f'(x) = 6x + 2"
    ],
    topic: "functions",
    level: "easy",
    branch: ["sciences", "math", "technical"],
  },
  // Functions - Medium
  {
    id: "fn-2",
    question: "Study the variations of f(x) = x³ - 3x + 2",
    questionAr: "ادرس تغيرات الدالة f(x) = x³ - 3x + 2",
    solution: "تزايدية على ]-∞, -1] ∪ [1, +∞[، تناقصية على [-1, 1]",
    solutionSteps: [
      "f'(x) = 3x² - 3 = 3(x² - 1)",
      "f'(x) = 0 ⟹ x = ±1",
      "f'(x) > 0 لما x < -1 أو x > 1",
      "f'(x) < 0 لما -1 < x < 1",
      "f(-1) = 4 (قيمة عظمى محلية)",
      "f(1) = 0 (قيمة صغرى محلية)"
    ],
    topic: "functions",
    level: "medium",
    branch: ["sciences", "math", "technical"],
  },
  // Functions - Hard
  {
    id: "fn-3",
    question: "Find lim(x→0) (sin(x) - x) / x³",
    questionAr: "أوجد النهاية: lim(x→0) (sin(x) - x) / x³",
    hint: "استخدم تطوير تايلور أو قاعدة لوبيتال",
    solution: "-1/6",
    solutionSteps: [
      "sin(x) ≈ x - x³/6 + x⁵/120 - ...",
      "sin(x) - x ≈ -x³/6",
      "(sin(x) - x) / x³ ≈ -1/6",
      "lim = -1/6"
    ],
    topic: "functions",
    level: "hard",
    branch: ["math"],
  },
  // Integrals - Easy
  {
    id: "int-1",
    question: "Calculate ∫(2x + 3)dx",
    questionAr: "احسب التكامل: ∫(2x + 3)dx",
    solution: "x² + 3x + C",
    solutionSteps: [
      "∫(2x + 3)dx",
      "= ∫2x dx + ∫3 dx",
      "= x² + 3x + C"
    ],
    topic: "integrals",
    level: "easy",
    branch: ["sciences", "math", "technical"],
  },
  // Integrals - Medium
  {
    id: "int-2",
    question: "Calculate ∫₀¹ x²dx",
    questionAr: "احسب التكامل المحدد: ∫₀¹ x²dx",
    solution: "1/3",
    solutionSteps: [
      "∫x² dx = x³/3",
      "[x³/3]₀¹ = 1/3 - 0",
      "= 1/3"
    ],
    topic: "integrals",
    level: "medium",
    branch: ["sciences", "math", "technical"],
  },
  // Matrices - Easy
  {
    id: "mat-1",
    question: "Calculate det|2 3; 1 4|",
    questionAr: "احسب المحدد: |2 3; 1 4|",
    solution: "5",
    solutionSteps: [
      "det = ad - bc",
      "= 2×4 - 3×1",
      "= 8 - 3 = 5"
    ],
    topic: "matrices",
    level: "easy",
    branch: ["sciences", "math", "technical"],
  },
  // Matrices - Medium
  {
    id: "mat-2",
    question: "Find the inverse of A = |2 1; 5 3|",
    questionAr: "أوجد معكوس المصفوفة A = |2 1; 5 3|",
    solution: "A⁻¹ = |3 -1; -5 2|",
    solutionSteps: [
      "det(A) = 6 - 5 = 1",
      "A⁻¹ = (1/det) × |d -b; -c a|",
      "A⁻¹ = |3 -1; -5 2|"
    ],
    topic: "matrices",
    level: "medium",
    branch: ["math", "technical"],
  },
  // Sequences - Easy
  {
    id: "seq-1",
    question: "Find the 10th term of the arithmetic sequence: 3, 7, 11, ...",
    questionAr: "أوجد الحد العاشر من المتتالية الحسابية: 3, 7, 11, ...",
    solution: "u₁₀ = 39",
    solutionSteps: [
      "u₁ = 3, r = 4",
      "uₙ = u₁ + (n-1)r",
      "u₁₀ = 3 + 9×4 = 39"
    ],
    topic: "sequences",
    level: "easy",
    branch: ["sciences", "math", "technical"],
  },
  // Sequences - Medium
  {
    id: "seq-2",
    question: "Find the sum of the first 20 terms: 2, 6, 18, 54, ...",
    questionAr: "أوجد مجموع أول 20 حد من المتتالية: 2, 6, 18, 54, ...",
    solution: "S₂₀ = 3,486,784,400",
    solutionSteps: [
      "متتالية هندسية: u₁ = 2, q = 3",
      "Sₙ = u₁(qⁿ - 1)/(q - 1)",
      "S₂₀ = 2(3²⁰ - 1)/2",
      "S₂₀ = 3²⁰ - 1 ≈ 3.49 × 10⁹"
    ],
    topic: "sequences",
    level: "medium",
    branch: ["sciences", "math", "technical"],
  },
  // Statistics - Easy
  {
    id: "stat-1",
    question: "Find the mean of: 5, 8, 12, 15, 20",
    questionAr: "أوجد المتوسط الحسابي للأعداد: 5, 8, 12, 15, 20",
    solution: "x̄ = 12",
    solutionSteps: [
      "المجموع = 5 + 8 + 12 + 15 + 20 = 60",
      "x̄ = 60/5 = 12"
    ],
    topic: "statistics",
    level: "easy",
    branch: ["sciences", "math", "technical"],
  },
  // Statistics - Medium
  {
    id: "stat-2",
    question: "Find the variance of: 2, 4, 6, 8, 10",
    questionAr: "أوجد التباين للأعداد: 2, 4, 6, 8, 10",
    solution: "σ² = 8",
    solutionSteps: [
      "x̄ = 30/5 = 6",
      "σ² = Σ(xᵢ - x̄)²/n",
      "= [(−4)² + (−2)² + 0² + 2² + 4²]/5",
      "= 40/5 = 8"
    ],
    topic: "statistics",
    level: "medium",
    branch: ["sciences", "math", "technical"],
  },
  // Geometry - Medium
  {
    id: "geo-1",
    question: "Find the equation of the line passing through A(1,2) and B(3,6)",
    questionAr: "أوجد معادلة المستقيم المار بـ A(1,2) و B(3,6)",
    solution: "y = 2x",
    solutionSteps: [
      "m = (y₂ - y₁)/(x₂ - x₁)",
      "m = (6 - 2)/(3 - 1) = 2",
      "y - 2 = 2(x - 1)",
      "y = 2x"
    ],
    topic: "geometry",
    level: "medium",
    branch: ["sciences", "math", "technical"],
  },
  // Geometry - Hard
  {
    id: "geo-2",
    question: "Find the distance from point P(3,4,5) to the plane 2x - y + 2z = 6",
    questionAr: "أوجد المسافة من النقطة P(3,4,5) إلى المستوى 2x - y + 2z = 6",
    solution: "d = 4/3",
    solutionSteps: [
      "d = |ax₀ + by₀ + cz₀ - d| / √(a² + b² + c²)",
      "d = |2(3) - 4 + 2(5) - 6| / √(4 + 1 + 4)",
      "d = |6 - 4 + 10 - 6| / 3",
      "d = 6/3 = 2... نصحح: |12-6|/3 = 2"
    ],
    topic: "geometry",
    level: "hard",
    branch: ["math", "technical"],
  },
];

const Exercises = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | "all">("all");
  const [selectedTopic, setSelectedTopic] = useState<Topic | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState<Level | "all">("all");
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<string[]>([]);

  const generateExercise = () => {
    let filtered = exerciseDatabase;

    if (selectedBranch !== "all") {
      filtered = filtered.filter(ex => ex.branch.includes(selectedBranch));
    }
    if (selectedTopic !== "all") {
      filtered = filtered.filter(ex => ex.topic === selectedTopic);
    }
    if (selectedLevel !== "all") {
      filtered = filtered.filter(ex => ex.level === selectedLevel);
    }

    // Avoid repeating recent exercises
    const available = filtered.filter(ex => !exerciseHistory.includes(ex.id));
    const pool = available.length > 0 ? available : filtered;

    if (pool.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const exercise = pool[randomIndex];
    
    setCurrentExercise(exercise);
    setShowSolution(false);
    setExerciseHistory(prev => [...prev.slice(-5), exercise.id]);
  };

  const getLevelBadge = (level: Level) => {
    const levelInfo = levels.find(l => l.value === level);
    return (
      <Badge className={`${levelInfo?.color} text-white`}>
        {levelInfo?.labelAr}
      </Badge>
    );
  };

  const getTopicLabel = (topic: Topic) => {
    return topics.find(t => t.value === topic)?.labelAr || topic;
  };

  return (
    <div className="space-y-6">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
              <Dices className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              مولد التمارين العشوائية
            </h1>
            <p className="text-muted-foreground">
              اختر الشعبة والمحور والمستوى لتوليد تمارين مناسبة
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-primary" />
                  خيارات التمرين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Branch */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      الشعبة
                    </label>
                    <Select value={selectedBranch} onValueChange={(v) => setSelectedBranch(v as Branch | "all")}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الشعبة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الشعب</SelectItem>
                        {branches.map(branch => (
                          <SelectItem key={branch.value} value={branch.value}>
                            {branch.labelAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Topic */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-secondary" />
                      المحور
                    </label>
                    <Select value={selectedTopic} onValueChange={(v) => setSelectedTopic(v as Topic | "all")}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المحور" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المحاور</SelectItem>
                        {topics.map(topic => (
                          <SelectItem key={topic.value} value={topic.value}>
                            {topic.labelAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Level */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Target className="w-4 h-4 text-accent" />
                      المستوى
                    </label>
                    <Select value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as Level | "all")}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستوى" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المستويات</SelectItem>
                        {levels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            <span className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${level.color}`}></span>
                              {level.labelAr}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={generateExercise}
                  className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  size="lg"
                >
                  <Dices className="w-5 h-5 ml-2" />
                  توليد تمرين جديد
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Exercise Display */}
          <AnimatePresence mode="wait">
            {currentExercise && (
              <motion.div
                key={currentExercise.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-primary/30 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-xl">التمرين</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{getTopicLabel(currentExercise.topic)}</Badge>
                        {getLevelBadge(currentExercise.level)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Question */}
                    <div className="bg-muted/50 rounded-xl p-6 mb-6">
                      <p className="text-xl font-semibold text-foreground leading-relaxed">
                        {currentExercise.questionAr}
                      </p>
                      {currentExercise.hint && (
                        <p className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-amber-500">💡</span>
                          تلميح: {currentExercise.hint}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                      <Button
                        variant={showSolution ? "secondary" : "default"}
                        onClick={() => setShowSolution(!showSolution)}
                        className="flex-1"
                      >
                        {showSolution ? (
                          <>
                            <EyeOff className="w-4 h-4 ml-2" />
                            إخفاء الحل
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 ml-2" />
                            عرض الحل
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={generateExercise}
                      >
                        <RefreshCw className="w-4 h-4 ml-2" />
                        تمرين آخر
                      </Button>
                    </div>

                    {/* Solution */}
                    <AnimatePresence>
                      {showSolution && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2 mb-4">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <h3 className="font-bold text-emerald-700 dark:text-emerald-400">
                                الحل
                              </h3>
                            </div>
                            
                            {/* Final Answer */}
                            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-4">
                              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                {currentExercise.solution}
                              </p>
                            </div>

                            {/* Steps */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                                خطوات الحل:
                              </h4>
                              {currentExercise.solutionSteps.map((step, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start gap-3 p-3 bg-white/30 dark:bg-black/10 rounded-lg"
                                >
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">
                                    {index + 1}
                                  </span>
                                  <span className="text-foreground font-mono">
                                    {step}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!currentExercise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Dices className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                اضغط على "توليد تمرين جديد" للبدء
              </p>
            </motion.div>
          )}
        </div>
    </div>
  );
};

export default Exercises;
