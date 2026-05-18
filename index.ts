const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DISTRIBUTIONS: Record<string, Record<string, number>> = {
  physics: { Electricity: 0.3, Motion: 0.2, Energy: 0.2, Waves: 0.2, General: 0.1 },
  chemistry: { Mole: 0.3, Reactions: 0.25, pH: 0.2, Concentration: 0.15, General: 0.1 },
  math: { Functions: 0.3, Derivatives: 0.25, Integrals: 0.2, Probability: 0.15, Limits: 0.1 },
};

function buildPlan(subject: string, count: number, forcedUnit?: string) {
  if (forcedUnit) return [{ unit: forcedUnit, n: count }];
  const dist = DISTRIBUTIONS[subject] ?? DISTRIBUTIONS.physics;
  const plan: { unit: string; n: number }[] = [];
  let remaining = count;
  const entries = Object.entries(dist);
  entries.forEach(([unit, ratio], i) => {
    const n = i === entries.length - 1 ? remaining : Math.max(1, Math.round(count * ratio));
    plan.push({ unit, n });
    remaining -= n;
  });
  return plan.filter((p) => p.n > 0);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { subject = "physics", unit, count = 10, difficulty = "medium" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const plan = buildPlan(subject, Math.max(3, Math.min(20, count)), unit);
    const planTxt = plan.map((p) => `- ${p.unit}: ${p.n} سؤال`).join("\n");

    const sys = `أنت مولّد أسئلة كويز للباكالوريا الجزائرية في مادة ${subject}.
- اكتب الأسئلة بالعربية الفصحى البسيطة.
- 4 خيارات لكل سؤال، واحد فقط صحيح.
- المستوى: ${difficulty}.
- اشرح بإيجاز سبب الإجابة الصحيحة.
- كل المعادلات الرياضية والرموز يجب كتابتها بصيغة LaTeX داخل علامتي $...$ للأسطر القصيرة و $$...$$ للمعادلات الطويلة.
- مثال: "احسب مشتقة $f(x) = x^2 + 3x$" أو الشرح: "نطبق $$f'(x) = 2x + 3$$".
- استعمل LaTeX دائماً للكسور (\\frac), الأسس (^), الجذور (\\sqrt), النهايات (\\lim), التكاملات (\\int), والوحدات الفيزيائية.`;

    const user = `أنشئ ${plan.reduce((a, p) => a + p.n, 0)} سؤال متعدد الخيارات.
التوزيع المطلوب:
${planTxt}

استعمل الأداة return_quiz لإرجاع الأسئلة.`;

    const tool = {
      type: "function",
      function: {
        name: "return_quiz",
        description: "Return quiz questions",
        parameters: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  unit: { type: "string" },
                  q: { type: "string" },
                  options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                  answer: { type: "integer", minimum: 0, maximum: 3 },
                  explain: { type: "string" },
                },
                required: ["unit", "q", "options", "answer", "explain"],
                additionalProperties: false,
              },
            },
          },
          required: ["questions"],
          additionalProperties: false,
        },
      },
    };

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, { role: "user", content: user }],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "return_quiz" } },
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      console.error("AI error", r.status, t);
      if (r.status === 429) return new Response(JSON.stringify({ error: "تم تجاوز الحد، حاول لاحقا." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "نفدت الأرصدة." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await r.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = typeof args === "string" ? JSON.parse(args) : args;
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});