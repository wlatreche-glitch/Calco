/**
 * Geometry Engine for 4th Year Middle School (4AM)
 * Algerian Curriculum - Mathematics
 * 
 * Covers:
 * - Thales Theorem (Direct & Converse)
 * - Pythagoras Theorem (Direct & Converse)
 * - Distance & Radius Calculations
 * - Angles & Triangles
 * - Areas & Volumes
 */

export type PedagogyMode = 'learning' | 'practice' | 'exam';

export interface Step {
  title: string;
  content: string;
  formula?: string;
  explanation?: string;
}

export interface GeometryResult {
  success: boolean;
  steps: Step[];
  finalAnswer: string;
  justification?: string;
  error?: string;
  warnings?: string[];
}

// ============================================
// THALES THEOREM ENGINE
// ============================================

export interface ThalesInput {
  mode: 'direct' | 'converse';
  // For direct: compute missing length
  // For converse: prove parallelism
  AB?: number;
  AC?: number;
  AD?: number;
  AE?: number;
  DB?: number;
  EC?: number;
  isParallel?: boolean; // Given that (DE) // (BC)
}

export function solveThales(input: ThalesInput, pedagogy: PedagogyMode): GeometryResult {
  const steps: Step[] = [];
  const warnings: string[] = [];

  if (input.mode === 'direct') {
    // Direct Thales: Given parallelism, compute missing length
    if (!input.isParallel) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'لتطبيق نظرية طاليس المباشرة، يجب أن يكون (DE) // (BC)'
      };
    }

    // Determine what we have and what we need
    const AB = input.AB ?? (input.AD && input.DB ? input.AD + input.DB : undefined);
    const AC = input.AC ?? (input.AE && input.EC ? input.AE + input.EC : undefined);
    const AD = input.AD;
    const AE = input.AE;

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المعطيات',
        content: `(DE) // (BC)\n${AB ? `AB = ${AB}` : ''}${AC ? `\nAC = ${AC}` : ''}${AD ? `\nAD = ${AD}` : ''}${AE ? `\nAE = ${AE}` : ''}`,
        explanation: 'نحدد المعطيات المتوفرة في المسألة'
      });
    }

    if (pedagogy === 'learning') {
      steps.push({
        title: 'نظرية طاليس',
        content: 'بما أن (DE) // (BC)، فإن:',
        formula: 'AD/AB = AE/AC = DE/BC',
        explanation: 'نظرية طاليس: إذا قطع مستقيمان متوازيان ضلعي زاوية، فإنهما يحددان عليهما أجزاء متناسبة'
      });
    }

    // Calculate missing value
    let result: number | null = null;
    let missingVar = '';

    if (AB && AD && AC && !AE) {
      result = (AD * AC) / AB;
      missingVar = 'AE';
      
      if (pedagogy !== 'exam') {
        steps.push({
          title: 'تطبيق التناسب',
          content: `AD/AB = AE/AC`,
          formula: `${AD}/${AB} = AE/${AC}`,
          explanation: 'نستخدم تناسب طاليس لإيجاد AE'
        });
        steps.push({
          title: 'حساب القيمة',
          content: `AE = (AD × AC) / AB`,
          formula: `AE = (${AD} × ${AC}) / ${AB} = ${result}`,
          explanation: 'نجري الضرب التبادلي ونحسب'
        });
      }
    } else if (AB && AD && AE && !AC) {
      result = (AB * AE) / AD;
      missingVar = 'AC';
      
      if (pedagogy !== 'exam') {
        steps.push({
          title: 'تطبيق التناسب',
          content: `AD/AB = AE/AC`,
          formula: `${AD}/${AB} = ${AE}/AC`,
          explanation: 'نستخدم تناسب طاليس لإيجاد AC'
        });
        steps.push({
          title: 'حساب القيمة',
          content: `AC = (AB × AE) / AD`,
          formula: `AC = (${AB} × ${AE}) / ${AD} = ${result}`,
          explanation: 'نجري الضرب التبادلي ونحسب'
        });
      }
    } else if (AC && AE && AB && !AD) {
      result = (AB * AE) / AC;
      missingVar = 'AD';
      
      if (pedagogy !== 'exam') {
        steps.push({
          title: 'تطبيق التناسب',
          content: `AD/AB = AE/AC`,
          formula: `AD/${AB} = ${AE}/${AC}`,
          explanation: 'نستخدم تناسب طاليس لإيجاد AD'
        });
        steps.push({
          title: 'حساب القيمة',
          content: `AD = (AB × AE) / AC`,
          formula: `AD = (${AB} × ${AE}) / ${AC} = ${result}`,
          explanation: 'نجري الضرب التبادلي ونحسب'
        });
      }
    }

    if (result === null) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'المعطيات غير كافية. نحتاج على الأقل 3 قياسات لحساب القيمة الرابعة'
      };
    }

    const finalAnswer = `${missingVar} = ${Number.isInteger(result) ? result : result.toFixed(2)}`;
    
    return {
      success: true,
      steps,
      finalAnswer,
      justification: `بتطبيق نظرية طاليس على المثلث حيث (DE) // (BC)، وباستخدام التناسب، نجد أن ${finalAnswer}`,
      warnings
    };

  } else {
    // Converse Thales: Prove parallelism
    const AB = input.AB ?? (input.AD && input.DB ? input.AD + input.DB : undefined);
    const AC = input.AC ?? (input.AE && input.EC ? input.AE + input.EC : undefined);
    const AD = input.AD;
    const AE = input.AE;

    if (!AB || !AC || !AD || !AE) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'لتطبيق عكس نظرية طاليس، نحتاج: AB, AC, AD, AE'
      };
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المعطيات',
        content: `AB = ${AB}\nAC = ${AC}\nAD = ${AD}\nAE = ${AE}`,
        explanation: 'نحدد القياسات المعطاة'
      });
    }

    if (pedagogy === 'learning') {
      steps.push({
        title: 'عكس نظرية طاليس',
        content: 'إذا كانت النقط D و E تنتميان للضلعين [AB] و [AC] على الترتيب، وكان:',
        formula: 'AD/AB = AE/AC',
        explanation: 'فإن (DE) // (BC)'
      });
    }

    const ratio1 = AD / AB;
    const ratio2 = AE / AC;

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'حساب النسب',
        content: `AD/AB = ${AD}/${AB} = ${ratio1.toFixed(4)}\nAE/AC = ${AE}/${AC} = ${ratio2.toFixed(4)}`,
        explanation: 'نحسب كل نسبة على حدة'
      });
    }

    const areEqual = Math.abs(ratio1 - ratio2) < 0.0001;

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المقارنة',
        content: areEqual 
          ? `النسبتان متساويتان: ${ratio1.toFixed(4)} = ${ratio2.toFixed(4)}`
          : `النسبتان غير متساويتان: ${ratio1.toFixed(4)} ≠ ${ratio2.toFixed(4)}`,
        explanation: areEqual ? 'بما أن النسب متساوية، يمكننا تطبيق عكس نظرية طاليس' : 'النسب غير متساوية'
      });
    }

    if (areEqual) {
      return {
        success: true,
        steps,
        finalAnswer: '(DE) // (BC)',
        justification: `بما أن D ∈ [AB] و E ∈ [AC] و AD/AB = AE/AC = ${ratio1.toFixed(2)}، فإنه حسب عكس نظرية طاليس: (DE) // (BC)`
      };
    } else {
      return {
        success: true,
        steps,
        finalAnswer: '(DE) غير موازي لـ (BC)',
        justification: `بما أن AD/AB ≠ AE/AC (${ratio1.toFixed(2)} ≠ ${ratio2.toFixed(2)})، فإن (DE) غير موازي لـ (BC)`
      };
    }
  }
}

// ============================================
// PYTHAGORAS THEOREM ENGINE
// ============================================

export interface PythagorasInput {
  mode: 'direct' | 'converse';
  sideA?: number;  // First side
  sideB?: number;  // Second side
  sideC?: number;  // Third side (or hypotenuse)
  rightAngleAt?: 'A' | 'B' | 'C'; // Which vertex has the right angle
}

export function solvePythagoras(input: PythagorasInput, pedagogy: PedagogyMode): GeometryResult {
  const steps: Step[] = [];

  if (input.mode === 'direct') {
    // Direct: Calculate missing side in a right triangle
    const { sideA, sideB, sideC, rightAngleAt } = input;
    
    if (!rightAngleAt) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'يجب تحديد موقع الزاوية القائمة'
      };
    }

    // Determine hypotenuse based on right angle position
    let hypotenuse: number | undefined;
    let leg1: number | undefined;
    let leg2: number | undefined;
    let hypName: string;
    let leg1Name: string;
    let leg2Name: string;

    if (rightAngleAt === 'A') {
      hypName = 'BC';
      leg1Name = 'AB';
      leg2Name = 'AC';
      hypotenuse = sideA;
      leg1 = sideB;
      leg2 = sideC;
    } else if (rightAngleAt === 'B') {
      hypName = 'AC';
      leg1Name = 'AB';
      leg2Name = 'BC';
      hypotenuse = sideB;
      leg1 = sideA;
      leg2 = sideC;
    } else {
      hypName = 'AB';
      leg1Name = 'AC';
      leg2Name = 'BC';
      hypotenuse = sideC;
      leg1 = sideA;
      leg2 = sideB;
    }

    const givenCount = [hypotenuse, leg1, leg2].filter(x => x !== undefined).length;
    
    if (givenCount !== 2) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'يجب إعطاء قياسين بالضبط لحساب الثالث'
      };
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المعطيات',
        content: `المثلث ABC قائم في ${rightAngleAt}\n${hypotenuse ? `${hypName} = ${hypotenuse}` : `${hypName} = ?`}\n${leg1 ? `${leg1Name} = ${leg1}` : `${leg1Name} = ?`}\n${leg2 ? `${leg2Name} = ${leg2}` : `${leg2Name} = ?`}`,
        explanation: `الوتر هو ${hypName} (الضلع المقابل للزاوية القائمة)`
      });
    }

    if (pedagogy === 'learning') {
      steps.push({
        title: 'نظرية فيثاغورس',
        content: 'في المثلث القائم، مربع الوتر يساوي مجموع مربعي الضلعين الآخرين',
        formula: `${hypName}² = ${leg1Name}² + ${leg2Name}²`,
        explanation: 'هذه هي العلاقة الأساسية في المثلث القائم'
      });
    }

    let result: number;
    let resultName: string;

    if (hypotenuse === undefined && leg1 !== undefined && leg2 !== undefined) {
      // Calculate hypotenuse
      result = Math.sqrt(leg1 * leg1 + leg2 * leg2);
      resultName = hypName;

      if (pedagogy !== 'exam') {
        steps.push({
          title: 'تطبيق النظرية',
          content: `${hypName}² = ${leg1Name}² + ${leg2Name}²`,
          formula: `${hypName}² = ${leg1}² + ${leg2}² = ${leg1 * leg1} + ${leg2 * leg2} = ${leg1 * leg1 + leg2 * leg2}`,
          explanation: 'نحسب مربع كل ضلع ثم نجمع'
        });
        steps.push({
          title: 'استخراج الجذر',
          content: `${hypName} = √${leg1 * leg1 + leg2 * leg2}`,
          formula: `${hypName} = ${Number.isInteger(result) ? result : result.toFixed(2)}`,
          explanation: 'نستخرج الجذر التربيعي للحصول على طول الوتر'
        });
      }
    } else if (leg1 === undefined && hypotenuse !== undefined && leg2 !== undefined) {
      // Calculate leg1
      const diff = hypotenuse * hypotenuse - leg2 * leg2;
      if (diff < 0) {
        return {
          success: false,
          steps: [],
          finalAnswer: '',
          error: 'خطأ: الوتر يجب أن يكون أكبر من أي ضلع آخر'
        };
      }
      result = Math.sqrt(diff);
      resultName = leg1Name;

      if (pedagogy !== 'exam') {
        steps.push({
          title: 'تطبيق النظرية',
          content: `${hypName}² = ${leg1Name}² + ${leg2Name}²`,
          formula: `${leg1Name}² = ${hypName}² - ${leg2Name}² = ${hypotenuse}² - ${leg2}² = ${hypotenuse * hypotenuse} - ${leg2 * leg2} = ${diff}`,
          explanation: 'نعزل المجهول في طرف'
        });
        steps.push({
          title: 'استخراج الجذر',
          content: `${leg1Name} = √${diff}`,
          formula: `${leg1Name} = ${Number.isInteger(result) ? result : result.toFixed(2)}`,
          explanation: 'نستخرج الجذر التربيعي'
        });
      }
    } else if (leg2 === undefined && hypotenuse !== undefined && leg1 !== undefined) {
      // Calculate leg2
      const diff = hypotenuse * hypotenuse - leg1 * leg1;
      if (diff < 0) {
        return {
          success: false,
          steps: [],
          finalAnswer: '',
          error: 'خطأ: الوتر يجب أن يكون أكبر من أي ضلع آخر'
        };
      }
      result = Math.sqrt(diff);
      resultName = leg2Name;

      if (pedagogy !== 'exam') {
        steps.push({
          title: 'تطبيق النظرية',
          content: `${hypName}² = ${leg1Name}² + ${leg2Name}²`,
          formula: `${leg2Name}² = ${hypName}² - ${leg1Name}² = ${hypotenuse}² - ${leg1}² = ${hypotenuse * hypotenuse} - ${leg1 * leg1} = ${diff}`,
          explanation: 'نعزل المجهول في طرف'
        });
        steps.push({
          title: 'استخراج الجذر',
          content: `${leg2Name} = √${diff}`,
          formula: `${leg2Name} = ${Number.isInteger(result) ? result : result.toFixed(2)}`,
          explanation: 'نستخرج الجذر التربيعي'
        });
      }
    } else {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'حالة غير معالجة'
      };
    }

    const finalAnswer = `${resultName} = ${Number.isInteger(result) ? result : result.toFixed(2)}`;

    return {
      success: true,
      steps,
      finalAnswer,
      justification: `بتطبيق نظرية فيثاغورس في المثلث ABC القائم في ${rightAngleAt}، نجد أن ${finalAnswer}`
    };

  } else {
    // Converse: Test if triangle is right-angled
    const { sideA, sideB, sideC } = input;

    if (!sideA || !sideB || !sideC) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'يجب إعطاء الأضلاع الثلاثة للمثلث'
      };
    }

    // Find the longest side (potential hypotenuse)
    const sides = [
      { name: 'BC', value: sideA },
      { name: 'AC', value: sideB },
      { name: 'AB', value: sideC }
    ].sort((a, b) => b.value - a.value);

    const longest = sides[0];
    const other1 = sides[1];
    const other2 = sides[2];

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المعطيات',
        content: `BC = ${sideA}\nAC = ${sideB}\nAB = ${sideC}`,
        explanation: 'نحدد أطوال أضلاع المثلث'
      });
    }

    if (pedagogy === 'learning') {
      steps.push({
        title: 'عكس نظرية فيثاغورس',
        content: 'إذا كان مربع الضلع الأكبر يساوي مجموع مربعي الضلعين الآخرين، فالمثلث قائم',
        formula: `إذا كان ${longest.name}² = ${other1.name}² + ${other2.name}²`,
        explanation: 'فإن المثلث قائم والزاوية القائمة مقابلة للضلع الأكبر'
      });
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'تحديد الضلع الأكبر',
        content: `الضلع الأكبر هو ${longest.name} = ${longest.value}`,
        explanation: 'الوتر المحتمل هو الضلع الأكبر'
      });
    }

    const longestSquare = longest.value * longest.value;
    const sumOfSquares = other1.value * other1.value + other2.value * other2.value;

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'حساب المربعات',
        content: `${longest.name}² = ${longest.value}² = ${longestSquare}\n${other1.name}² + ${other2.name}² = ${other1.value}² + ${other2.value}² = ${other1.value * other1.value} + ${other2.value * other2.value} = ${sumOfSquares}`,
        explanation: 'نحسب مربع كل ضلع'
      });
    }

    const isRightTriangle = Math.abs(longestSquare - sumOfSquares) < 0.0001;

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المقارنة',
        content: isRightTriangle
          ? `${longestSquare} = ${sumOfSquares} ✓`
          : `${longestSquare} ≠ ${sumOfSquares}`,
        explanation: isRightTriangle ? 'المربعات متساوية' : 'المربعات غير متساوية'
      });
    }

    if (isRightTriangle) {
      const rightAngleVertex = longest.name === 'BC' ? 'A' : longest.name === 'AC' ? 'B' : 'C';
      return {
        success: true,
        steps,
        finalAnswer: `المثلث ABC قائم في ${rightAngleVertex}`,
        justification: `بما أن ${longest.name}² = ${other1.name}² + ${other2.name}² (${longestSquare} = ${sumOfSquares})، فإنه حسب عكس نظرية فيثاغورس، المثلث ABC قائم في ${rightAngleVertex}`
      };
    } else {
      return {
        success: true,
        steps,
        finalAnswer: 'المثلث ABC ليس قائماً',
        justification: `بما أن ${longest.name}² ≠ ${other1.name}² + ${other2.name}² (${longestSquare} ≠ ${sumOfSquares})، فإن المثلث ABC ليس قائماً`
      };
    }
  }
}

// ============================================
// TRIGONOMETRY ENGINE (حساب المثلثات)
// ============================================

export interface TrigonometryInput {
  mode: 'findSide' | 'findAngle';
  rightAngleAt: 'A' | 'B' | 'C';
  // For findSide: given an angle and a side, find another side
  knownAngleVertex?: 'A' | 'B' | 'C'; // which vertex has the known angle
  knownAngleDeg?: number; // angle in degrees
  knownSideName?: string; // e.g. 'BC', 'AC', 'AB'
  knownSideValue?: number;
  targetSideName?: string; // side to find
  // For findAngle: given two sides, find the angle
  side1Name?: string;
  side1Value?: number;
  side2Name?: string;
  side2Value?: number;
  targetAngleVertex?: 'A' | 'B' | 'C';
}

export function solveTrigonometry(input: TrigonometryInput, pedagogy: PedagogyMode): GeometryResult {
  const steps: Step[] = [];
  const { rightAngleAt } = input;

  // Side names relative to a given angle vertex in a right triangle
  const getSideRoles = (angleVertex: string) => {
    // In triangle ABC with right angle at rightAngleAt
    // For a given angle vertex, determine opposite and adjacent sides
    const vertices = ['A', 'B', 'C'];
    const otherVertices = vertices.filter(v => v !== rightAngleAt && v !== angleVertex);
    if (otherVertices.length !== 1) return null;
    const thirdVertex = otherVertices[0];
    
    // Hypotenuse: side opposite to right angle
    const hypVertices = vertices.filter(v => v !== rightAngleAt).sort();
    const hypotenuse = hypVertices.join('');
    
    // Opposite to angle: side not touching the angle vertex and not the hypotenuse vertex... 
    // Actually: opposite = side between rightAngle vertex and third vertex
    const opposite = [rightAngleAt, thirdVertex].sort().join('');
    // Adjacent = side between angle vertex and rightAngle vertex
    const adjacent = [angleVertex, rightAngleAt].sort().join('');
    
    return { hypotenuse, opposite, adjacent };
  };

  if (input.mode === 'findSide') {
    const { knownAngleVertex, knownAngleDeg, knownSideName, knownSideValue, targetSideName } = input;
    
    if (!knownAngleVertex || !knownAngleDeg || !knownSideName || !knownSideValue || !targetSideName) {
      return { success: false, steps: [], finalAnswer: '', error: 'يجب إدخال الزاوية المعلومة وقيمتها وضلع معلوم والضلع المطلوب' };
    }

    if (knownAngleVertex === rightAngleAt) {
      return { success: false, steps: [], finalAnswer: '', error: 'الزاوية المختارة هي الزاوية القائمة (90°). اختر زاوية أخرى' };
    }

    if (knownAngleDeg <= 0 || knownAngleDeg >= 90) {
      return { success: false, steps: [], finalAnswer: '', error: 'الزاوية يجب أن تكون بين 0° و 90°' };
    }

    const roles = getSideRoles(knownAngleVertex);
    if (!roles) {
      return { success: false, steps: [], finalAnswer: '', error: 'خطأ في تحديد الأضلاع' };
    }

    const angleRad = (knownAngleDeg * Math.PI) / 180;

    // Determine the role of known and target sides
    const getRole = (sideName: string) => {
      const sorted = sideName.split('').sort().join('');
      if (sorted === roles.hypotenuse) return 'hypotenuse';
      if (sorted === roles.opposite) return 'opposite';
      if (sorted === roles.adjacent) return 'adjacent';
      return null;
    };

    const knownRole = getRole(knownSideName);
    const targetRole = getRole(targetSideName);

    if (!knownRole || !targetRole) {
      return { success: false, steps: [], finalAnswer: '', error: 'أسماء الأضلاع غير صحيحة' };
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المعطيات',
        content: `المثلث ABC قائم في ${rightAngleAt}\nالزاوية ${knownAngleVertex} = ${knownAngleDeg}°\n${knownSideName} = ${knownSideValue}`,
        explanation: `نريد إيجاد ${targetSideName}`
      });
    }

    // Determine which trig ratio to use
    let ratio: string;
    let result: number;

    if ((knownRole === 'opposite' && targetRole === 'hypotenuse') || (knownRole === 'hypotenuse' && targetRole === 'opposite')) {
      ratio = 'sin';
      if (knownRole === 'opposite') {
        result = knownSideValue / Math.sin(angleRad);
      } else {
        result = knownSideValue * Math.sin(angleRad);
      }
    } else if ((knownRole === 'adjacent' && targetRole === 'hypotenuse') || (knownRole === 'hypotenuse' && targetRole === 'adjacent')) {
      ratio = 'cos';
      if (knownRole === 'adjacent') {
        result = knownSideValue / Math.cos(angleRad);
      } else {
        result = knownSideValue * Math.cos(angleRad);
      }
    } else if ((knownRole === 'opposite' && targetRole === 'adjacent') || (knownRole === 'adjacent' && targetRole === 'opposite')) {
      ratio = 'tan';
      if (knownRole === 'opposite') {
        result = knownSideValue / Math.tan(angleRad);
      } else {
        result = knownSideValue * Math.tan(angleRad);
      }
    } else {
      return { success: false, steps: [], finalAnswer: '', error: 'لا يمكن تحديد النسبة المثلثية المناسبة' };
    }

    const ratioArabic = ratio === 'sin' ? 'جيب (sin)' : ratio === 'cos' ? 'جيب التمام (cos)' : 'ظل (tan)';

    if (pedagogy === 'learning') {
      steps.push({
        title: 'تحديد النسبة المثلثية',
        content: `بالنسبة للزاوية ${knownAngleVertex}:\n• المقابل = ${roles.opposite}\n• المجاور = ${roles.adjacent}\n• الوتر = ${roles.hypotenuse}`,
        formula: `sin = مقابل/وتر | cos = مجاور/وتر | tan = مقابل/مجاور`,
        explanation: `نستخدم النسبة ${ratioArabic} لأن لدينا ${knownRole === 'opposite' ? 'المقابل' : knownRole === 'adjacent' ? 'المجاور' : 'الوتر'} ونريد ${targetRole === 'opposite' ? 'المقابل' : targetRole === 'adjacent' ? 'المجاور' : 'الوتر'}`
      });
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'تطبيق النسبة المثلثية',
        content: `${ratio}(${knownAngleDeg}°) = ${ratio === 'sin' ? `${roles.opposite}/${roles.hypotenuse}` : ratio === 'cos' ? `${roles.adjacent}/${roles.hypotenuse}` : `${roles.opposite}/${roles.adjacent}`}`,
        formula: `${targetSideName} = ${result.toFixed(2)}`,
        explanation: `نعوض القيم المعلومة ونحسب`
      });
    }

    const finalAnswer = `${targetSideName} = ${Number.isInteger(result) ? result : result.toFixed(2)}`;
    return {
      success: true,
      steps,
      finalAnswer,
      justification: `بتطبيق النسبة المثلثية ${ratioArabic} في المثلث ABC القائم في ${rightAngleAt}، نجد أن ${finalAnswer}`
    };

  } else {
    // findAngle mode
    const { side1Name, side1Value, side2Name, side2Value, targetAngleVertex } = input;

    if (!side1Name || !side1Value || !side2Name || !side2Value || !targetAngleVertex) {
      return { success: false, steps: [], finalAnswer: '', error: 'يجب إدخال ضلعين معلومين والزاوية المطلوبة' };
    }

    if (targetAngleVertex === rightAngleAt) {
      return { success: false, steps: [], finalAnswer: '', error: 'الزاوية المختارة هي الزاوية القائمة (90°). اختر زاوية أخرى' };
    }

    const roles = getSideRoles(targetAngleVertex);
    if (!roles) {
      return { success: false, steps: [], finalAnswer: '', error: 'خطأ في تحديد الأضلاع' };
    }

    const getRole = (sideName: string) => {
      const sorted = sideName.split('').sort().join('');
      if (sorted === roles.hypotenuse) return 'hypotenuse';
      if (sorted === roles.opposite) return 'opposite';
      if (sorted === roles.adjacent) return 'adjacent';
      return null;
    };

    const role1 = getRole(side1Name);
    const role2 = getRole(side2Name);

    if (!role1 || !role2) {
      return { success: false, steps: [], finalAnswer: '', error: 'أسماء الأضلاع غير صحيحة' };
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المعطيات',
        content: `المثلث ABC قائم في ${rightAngleAt}\n${side1Name} = ${side1Value}\n${side2Name} = ${side2Value}`,
        explanation: `نريد إيجاد الزاوية ${targetAngleVertex}`
      });
    }

    let ratio: string;
    let angleRad: number;
    let ratioValue: number;

    const sides: Record<string, number> = {};
    sides[role1] = side1Value;
    sides[role2] = side2Value;

    if (sides['opposite'] !== undefined && sides['hypotenuse'] !== undefined) {
      ratio = 'sin';
      ratioValue = sides['opposite'] / sides['hypotenuse'];
      angleRad = Math.asin(ratioValue);
    } else if (sides['adjacent'] !== undefined && sides['hypotenuse'] !== undefined) {
      ratio = 'cos';
      ratioValue = sides['adjacent'] / sides['hypotenuse'];
      angleRad = Math.acos(ratioValue);
    } else if (sides['opposite'] !== undefined && sides['adjacent'] !== undefined) {
      ratio = 'tan';
      ratioValue = sides['opposite'] / sides['adjacent'];
      angleRad = Math.atan(ratioValue);
    } else {
      return { success: false, steps: [], finalAnswer: '', error: 'لا يمكن تحديد النسبة المثلثية المناسبة' };
    }

    if (ratioValue > 1 && (ratio === 'sin' || ratio === 'cos')) {
      return { success: false, steps: [], finalAnswer: '', error: 'القيم المدخلة غير صحيحة: النسبة أكبر من 1' };
    }

    const angleDeg = (angleRad * 180) / Math.PI;
    const ratioArabic = ratio === 'sin' ? 'جيب (sin)' : ratio === 'cos' ? 'جيب التمام (cos)' : 'ظل (tan)';

    if (pedagogy === 'learning') {
      steps.push({
        title: 'تحديد النسبة المثلثية',
        content: `بالنسبة للزاوية ${targetAngleVertex}:\n• المقابل = ${roles.opposite}\n• المجاور = ${roles.adjacent}\n• الوتر = ${roles.hypotenuse}`,
        formula: `sin = مقابل/وتر | cos = مجاور/وتر | tan = مقابل/مجاور`,
        explanation: `نستخدم ${ratioArabic} لأن لدينا الضلعين المناسبين`
      });
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'حساب الزاوية',
        content: `${ratio}(${targetAngleVertex}) = ${ratioValue.toFixed(4)}`,
        formula: `${targetAngleVertex} = ${ratio}⁻¹(${ratioValue.toFixed(4)}) = ${angleDeg.toFixed(2)}°`,
        explanation: `نستخدم الدالة العكسية لإيجاد الزاوية`
      });
    }

    const finalAnswer = `الزاوية ${targetAngleVertex} = ${angleDeg.toFixed(2)}°`;
    return {
      success: true,
      steps,
      finalAnswer,
      justification: `بتطبيق النسبة المثلثية العكسية ${ratioArabic} في المثلث ABC القائم في ${rightAngleAt}، نجد أن ${finalAnswer}`
    };
  }
}

// ============================================
// DISTANCE & RADIUS ENGINE
// ============================================

export interface DistanceInput {
  type: 'distance' | 'radius' | 'diameter';
  // For distance
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  // For circle
  radius?: number;
  diameter?: number;
}

export function solveDistance(input: DistanceInput, pedagogy: PedagogyMode): GeometryResult {
  const steps: Step[] = [];

  if (input.type === 'distance') {
    const { x1, y1, x2, y2 } = input;
    
    if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'يجب إعطاء إحداثيات النقطتين A(x₁,y₁) و B(x₂,y₂)'
      };
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المعطيات',
        content: `A(${x1}, ${y1})\nB(${x2}, ${y2})`,
        explanation: 'إحداثيات النقطتين في المستوي'
      });
    }

    if (pedagogy === 'learning') {
      steps.push({
        title: 'صيغة المسافة',
        content: 'المسافة بين نقطتين تحسب بالعلاقة:',
        formula: 'AB = √[(x₂-x₁)² + (y₂-y₁)²]',
        explanation: 'هذه الصيغة مشتقة من نظرية فيثاغورس'
      });
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    const distanceSquared = dx * dx + dy * dy;
    const distance = Math.sqrt(distanceSquared);

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'الحساب',
        content: `AB = √[(${x2}-${x1})² + (${y2}-${y1})²]\nAB = √[${dx}² + ${dy}²]\nAB = √[${dx * dx} + ${dy * dy}]\nAB = √${distanceSquared}`,
        formula: `AB = ${Number.isInteger(distance) ? distance : distance.toFixed(2)}`,
        explanation: 'نطبق الصيغة خطوة بخطوة'
      });
    }

    const finalAnswer = `AB = ${Number.isInteger(distance) ? distance : distance.toFixed(2)}`;

    return {
      success: true,
      steps,
      finalAnswer,
      justification: `المسافة بين A(${x1},${y1}) و B(${x2},${y2}) هي ${Number.isInteger(distance) ? distance : distance.toFixed(2)} وحدة`
    };

  } else if (input.type === 'radius') {
    if (input.diameter !== undefined) {
      const radius = input.diameter / 2;
      
      if (pedagogy !== 'exam') {
        steps.push({
          title: 'المعطيات',
          content: `القطر d = ${input.diameter}`,
          explanation: 'القطر هو أطول وتر في الدائرة'
        });
      }

      if (pedagogy === 'learning') {
        steps.push({
          title: 'العلاقة',
          content: 'نصف القطر هو نصف القطر:',
          formula: 'r = d / 2',
          explanation: 'القطر يمر بالمركز ويساوي ضعف نصف القطر'
        });
      }

      if (pedagogy !== 'exam') {
        steps.push({
          title: 'الحساب',
          content: `r = ${input.diameter} / 2`,
          formula: `r = ${radius}`,
          explanation: 'نقسم القطر على 2'
        });
      }

      return {
        success: true,
        steps,
        finalAnswer: `r = ${radius}`,
        justification: `نصف قطر الدائرة هو ${radius}`
      };
    }
    
    return {
      success: false,
      steps: [],
      finalAnswer: '',
      error: 'يجب إعطاء القطر لحساب نصف القطر'
    };

  } else if (input.type === 'diameter') {
    if (input.radius !== undefined) {
      const diameter = input.radius * 2;
      
      if (pedagogy !== 'exam') {
        steps.push({
          title: 'المعطيات',
          content: `نصف القطر r = ${input.radius}`,
          explanation: 'نصف القطر هو المسافة من المركز إلى أي نقطة على الدائرة'
        });
      }

      if (pedagogy === 'learning') {
        steps.push({
          title: 'العلاقة',
          content: 'القطر يساوي ضعف نصف القطر:',
          formula: 'd = 2 × r',
          explanation: 'القطر هو ضعف نصف القطر'
        });
      }

      if (pedagogy !== 'exam') {
        steps.push({
          title: 'الحساب',
          content: `d = 2 × ${input.radius}`,
          formula: `d = ${diameter}`,
          explanation: 'نضرب نصف القطر في 2'
        });
      }

      return {
        success: true,
        steps,
        finalAnswer: `d = ${diameter}`,
        justification: `قطر الدائرة هو ${diameter}`
      };
    }
    
    return {
      success: false,
      steps: [],
      finalAnswer: '',
      error: 'يجب إعطاء نصف القطر لحساب القطر'
    };
  }

  return {
    success: false,
    steps: [],
    finalAnswer: '',
    error: 'نوع الحساب غير معروف'
  };
}

// ============================================
// ANGLES & TRIANGLES ENGINE
// ============================================

export interface AnglesInput {
  type: 'parallel_transversal' | 'triangle_sum' | 'triangle_type' | 'isosceles' | 'equilateral';
  // For parallel + transversal
  givenAngle?: number;
  angleType?: 'corresponding' | 'alternate' | 'co_interior';
  // For triangle
  angle1?: number;
  angle2?: number;
  angle3?: number;
  // For isosceles
  vertexAngle?: number;
  baseAngle?: number;
}

export function solveAngles(input: AnglesInput, pedagogy: PedagogyMode): GeometryResult {
  const steps: Step[] = [];

  if (input.type === 'parallel_transversal') {
    const { givenAngle, angleType } = input;
    
    if (givenAngle === undefined || !angleType) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'يجب إعطاء الزاوية ونوعها'
      };
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المعطيات',
        content: `مستقيمان متوازيان يقطعهما قاطع\nالزاوية المعطاة = ${givenAngle}°`,
        explanation: 'القاطع يشكل زوايا مع المستقيمين المتوازيين'
      });
    }

    let resultAngle: number;
    let relationship: string;
    let explanation: string;

    switch (angleType) {
      case 'corresponding':
        resultAngle = givenAngle;
        relationship = 'الزاويتان متناظرتان';
        explanation = 'الزوايا المتناظرة متساوية عندما يكون المستقيمان متوازيين';
        break;
      case 'alternate':
        resultAngle = givenAngle;
        relationship = 'الزاويتان متبادلتان داخلياً';
        explanation = 'الزوايا المتبادلة داخلياً متساوية عندما يكون المستقيمان متوازيين';
        break;
      case 'co_interior':
        resultAngle = 180 - givenAngle;
        relationship = 'الزاويتان داخليتان من جهة واحدة';
        explanation = 'الزوايا الداخلية من جهة واحدة متتامتان (مجموعهما 180°)';
        break;
      default:
        return {
          success: false,
          steps: [],
          finalAnswer: '',
          error: 'نوع الزاوية غير معروف'
        };
    }

    if (pedagogy === 'learning') {
      steps.push({
        title: 'القاعدة',
        content: relationship,
        explanation: explanation
      });
    }

    if (pedagogy !== 'exam') {
      if (angleType === 'co_interior') {
        steps.push({
          title: 'الحساب',
          content: `الزاوية المطلوبة = 180° - ${givenAngle}°`,
          formula: `= ${resultAngle}°`,
          explanation: 'الزوايا الداخلية من جهة واحدة متتامتان'
        });
      } else {
        steps.push({
          title: 'النتيجة',
          content: `الزاوية المطلوبة = ${givenAngle}°`,
          explanation: 'الزوايا متساوية لأن المستقيمين متوازيان'
        });
      }
    }

    return {
      success: true,
      steps,
      finalAnswer: `الزاوية = ${resultAngle}°`,
      justification: `بما أن المستقيمين متوازيان و${relationship}، فإن الزاوية المطلوبة = ${resultAngle}°`
    };

  } else if (input.type === 'triangle_sum') {
    const { angle1, angle2 } = input;
    
    if (angle1 === undefined || angle2 === undefined) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'يجب إعطاء زاويتين لحساب الثالثة'
      };
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المعطيات',
        content: `الزاوية الأولى = ${angle1}°\nالزاوية الثانية = ${angle2}°`,
        explanation: 'زاويتان من زوايا المثلث'
      });
    }

    if (pedagogy === 'learning') {
      steps.push({
        title: 'القاعدة',
        content: 'مجموع زوايا المثلث يساوي 180°',
        formula: 'α + β + γ = 180°',
        explanation: 'هذه خاصية أساسية للمثلث'
      });
    }

    const angle3 = 180 - angle1 - angle2;

    if (angle3 <= 0) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'خطأ: مجموع الزاويتين يتجاوز 180°، وهذا غير ممكن في مثلث'
      };
    }

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'الحساب',
        content: `الزاوية الثالثة = 180° - ${angle1}° - ${angle2}°\n= 180° - ${angle1 + angle2}°`,
        formula: `= ${angle3}°`,
        explanation: 'نطرح مجموع الزاويتين المعروفتين من 180°'
      });
    }

    return {
      success: true,
      steps,
      finalAnswer: `الزاوية الثالثة = ${angle3}°`,
      justification: `بما أن مجموع زوايا المثلث = 180°، فإن الزاوية الثالثة = 180° - ${angle1}° - ${angle2}° = ${angle3}°`
    };

  } else if (input.type === 'isosceles') {
    const { vertexAngle, baseAngle } = input;

    if (pedagogy !== 'exam') {
      steps.push({
        title: 'المعطيات',
        content: 'مثلث متساوي الساقين',
        explanation: 'في المثلث متساوي الساقين، زاويتا القاعدة متساويتان'
      });
    }

    if (vertexAngle !== undefined) {
      if (vertexAngle >= 180 || vertexAngle <= 0) {
        return {
          success: false,
          steps: [],
          finalAnswer: '',
          error: 'خطأ: الزاوية يجب أن تكون بين 0° و 180°'
        };
      }

      const baseAngleCalc = (180 - vertexAngle) / 2;

      if (pedagogy === 'learning') {
        steps.push({
          title: 'القاعدة',
          content: 'في المثلث متساوي الساقين:',
          formula: 'زاوية الرأس + 2 × زاوية القاعدة = 180°',
          explanation: 'زاويتا القاعدة متساويتان'
        });
      }

      if (pedagogy !== 'exam') {
        steps.push({
          title: 'الحساب',
          content: `2 × زاوية القاعدة = 180° - ${vertexAngle}°\n= ${180 - vertexAngle}°`,
          formula: `زاوية القاعدة = ${baseAngleCalc}°`,
          explanation: 'نقسم على 2 للحصول على زاوية القاعدة'
        });
      }

      return {
        success: true,
        steps,
        finalAnswer: `زاوية القاعدة = ${baseAngleCalc}°`,
        justification: `في المثلث متساوي الساقين حيث زاوية الرأس = ${vertexAngle}°، زاوية القاعدة = ${baseAngleCalc}°`
      };
    } else if (baseAngle !== undefined) {
      if (baseAngle >= 90 || baseAngle <= 0) {
        return {
          success: false,
          steps: [],
          finalAnswer: '',
          error: 'خطأ: زاوية القاعدة يجب أن تكون بين 0° و 90°'
        };
      }

      const vertexAngleCalc = 180 - 2 * baseAngle;

      if (pedagogy === 'learning') {
        steps.push({
          title: 'القاعدة',
          content: 'في المثلث متساوي الساقين:',
          formula: 'زاوية الرأس = 180° - 2 × زاوية القاعدة',
          explanation: 'مجموع الزوايا = 180°'
        });
      }

      if (pedagogy !== 'exam') {
        steps.push({
          title: 'الحساب',
          content: `زاوية الرأس = 180° - 2 × ${baseAngle}°\n= 180° - ${2 * baseAngle}°`,
          formula: `= ${vertexAngleCalc}°`,
          explanation: 'نطبق الصيغة'
        });
      }

      return {
        success: true,
        steps,
        finalAnswer: `زاوية الرأس = ${vertexAngleCalc}°`,
        justification: `في المثلث متساوي الساقين حيث زاوية القاعدة = ${baseAngle}°، زاوية الرأس = ${vertexAngleCalc}°`
      };
    }

    return {
      success: false,
      steps: [],
      finalAnswer: '',
      error: 'يجب إعطاء زاوية الرأس أو زاوية القاعدة'
    };

  } else if (input.type === 'equilateral') {
    if (pedagogy === 'learning') {
      steps.push({
        title: 'خاصية المثلث المتساوي الأضلاع',
        content: 'جميع زوايا المثلث المتساوي الأضلاع متساوية',
        formula: 'كل زاوية = 180° ÷ 3 = 60°',
        explanation: 'بما أن المثلث له 3 زوايا متساوية ومجموعها 180°'
      });
    }

    return {
      success: true,
      steps,
      finalAnswer: 'كل زاوية = 60°',
      justification: 'في المثلث المتساوي الأضلاع، جميع الزوايا متساوية وتساوي 60°'
    };
  }

  return {
    success: false,
    steps: [],
    finalAnswer: '',
    error: 'نوع المسألة غير معروف'
  };
}

// ============================================
// AREA & VOLUME ENGINE
// ============================================

export type Shape2D = 'rectangle' | 'square' | 'triangle' | 'parallelogram' | 'trapezoid' | 'circle';
export type Solid3D = 'cube' | 'rectangular_prism' | 'cylinder';

export interface AreaVolumeInput {
  type: '2d' | '3d';
  shape?: Shape2D;
  solid?: Solid3D;
  // Dimensions
  length?: number;
  width?: number;
  height?: number;
  base?: number;
  base1?: number;
  base2?: number;
  radius?: number;
  side?: number;
}

export function solveAreaVolume(input: AreaVolumeInput, pedagogy: PedagogyMode): GeometryResult {
  const steps: Step[] = [];

  if (input.type === '2d') {
    const { shape } = input;

    if (!shape) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'يجب تحديد نوع الشكل'
      };
    }

    let area: number;
    let formula: string;
    let shapeName: string;

    switch (shape) {
      case 'rectangle':
        if (!input.length || !input.width) {
          return { success: false, steps: [], finalAnswer: '', error: 'يجب إعطاء الطول والعرض' };
        }
        shapeName = 'المستطيل';
        formula = 'S = L × W';
        area = input.length * input.width;

        if (pedagogy !== 'exam') {
          steps.push({
            title: 'المعطيات',
            content: `الطول L = ${input.length}\nالعرض W = ${input.width}`,
            explanation: 'أبعاد المستطيل'
          });
        }
        if (pedagogy === 'learning') {
          steps.push({
            title: 'الصيغة',
            content: `مساحة ${shapeName}:`,
            formula,
            explanation: 'المساحة = الطول × العرض'
          });
        }
        if (pedagogy !== 'exam') {
          steps.push({
            title: 'الحساب',
            content: `S = ${input.length} × ${input.width}`,
            formula: `S = ${area}`,
            explanation: 'نضرب الطول في العرض'
          });
        }
        break;

      case 'square':
        if (!input.side) {
          return { success: false, steps: [], finalAnswer: '', error: 'يجب إعطاء طول الضلع' };
        }
        shapeName = 'المربع';
        formula = 'S = a²';
        area = input.side * input.side;

        if (pedagogy !== 'exam') {
          steps.push({
            title: 'المعطيات',
            content: `طول الضلع a = ${input.side}`,
            explanation: 'جميع أضلاع المربع متساوية'
          });
        }
        if (pedagogy === 'learning') {
          steps.push({
            title: 'الصيغة',
            content: `مساحة ${shapeName}:`,
            formula,
            explanation: 'المساحة = مربع طول الضلع'
          });
        }
        if (pedagogy !== 'exam') {
          steps.push({
            title: 'الحساب',
            content: `S = ${input.side}²`,
            formula: `S = ${area}`,
            explanation: 'نرفع الضلع للقوة 2'
          });
        }
        break;

      case 'triangle':
        if (!input.base || !input.height) {
          return { success: false, steps: [], finalAnswer: '', error: 'يجب إعطاء القاعدة والارتفاع' };
        }
        shapeName = 'المثلث';
        formula = 'S = (b × h) / 2';
        area = (input.base * input.height) / 2;

        if (pedagogy !== 'exam') {
          steps.push({
            title: 'المعطيات',
            content: `القاعدة b = ${input.base}\nالارتفاع h = ${input.height}`,
            explanation: 'الارتفاع عمودي على القاعدة'
          });
        }
        if (pedagogy === 'learning') {
          steps.push({
            title: 'الصيغة',
            content: `مساحة ${shapeName}:`,
            formula,
            explanation: 'المساحة = نصف حاصل ضرب القاعدة في الارتفاع'
          });
        }
        if (pedagogy !== 'exam') {
          steps.push({
            title: 'الحساب',
            content: `S = (${input.base} × ${input.height}) / 2\nS = ${input.base * input.height} / 2`,
            formula: `S = ${area}`,
            explanation: 'نضرب ثم نقسم على 2'
          });
        }
        break;

      case 'parallelogram':
        if (!input.base || !input.height) {
          return { success: false, steps: [], finalAnswer: '', error: 'يجب إعطاء القاعدة والارتفاع' };
        }
        shapeName = 'متوازي الأضلاع';
        formula = 'S = b × h';
        area = input.base * input.height;

        if (pedagogy !== 'exam') {
          steps.push({
            title: 'المعطيات',
            content: `القاعدة b = ${input.base}\nالارتفاع h = ${input.height}`,
            explanation: 'الارتفاع عمودي على القاعدة'
          });
        }
        if (pedagogy === 'learning') {
          steps.push({
            title: 'الصيغة',
            content: `مساحة ${shapeName}:`,
            formula,
            explanation: 'المساحة = القاعدة × الارتفاع'
          });
        }
        if (pedagogy !== 'exam') {
          steps.push({
            title: 'الحساب',
            content: `S = ${input.base} × ${input.height}`,
            formula: `S = ${area}`,
            explanation: 'نضرب القاعدة في الارتفاع'
          });
        }
        break;

      case 'trapezoid':
        if (!input.base1 || !input.base2 || !input.height) {
          return { success: false, steps: [], finalAnswer: '', error: 'يجب إعطاء القاعدتين والارتفاع' };
        }
        shapeName = 'شبه المنحرف';
        formula = 'S = [(b₁ + b₂) × h] / 2';
        area = ((input.base1 + input.base2) * input.height) / 2;

        if (pedagogy !== 'exam') {
          steps.push({
            title: 'المعطيات',
            content: `القاعدة الكبرى b₁ = ${input.base1}\nالقاعدة الصغرى b₂ = ${input.base2}\nالارتفاع h = ${input.height}`,
            explanation: 'القاعدتان متوازيتان'
          });
        }
        if (pedagogy === 'learning') {
          steps.push({
            title: 'الصيغة',
            content: `مساحة ${shapeName}:`,
            formula,
            explanation: 'المساحة = نصف مجموع القاعدتين × الارتفاع'
          });
        }
        if (pedagogy !== 'exam') {
          steps.push({
            title: 'الحساب',
            content: `S = [(${input.base1} + ${input.base2}) × ${input.height}] / 2\nS = [${input.base1 + input.base2} × ${input.height}] / 2\nS = ${(input.base1 + input.base2) * input.height} / 2`,
            formula: `S = ${area}`,
            explanation: 'نجمع القاعدتين، نضرب في الارتفاع، ثم نقسم على 2'
          });
        }
        break;

      case 'circle':
        if (!input.radius) {
          return { success: false, steps: [], finalAnswer: '', error: 'يجب إعطاء نصف القطر' };
        }
        shapeName = 'الدائرة';
        formula = 'S = π × r²';
        area = Math.PI * input.radius * input.radius;

        if (pedagogy !== 'exam') {
          steps.push({
            title: 'المعطيات',
            content: `نصف القطر r = ${input.radius}`,
            explanation: 'نصف القطر هو المسافة من المركز للمحيط'
          });
        }
        if (pedagogy === 'learning') {
          steps.push({
            title: 'الصيغة',
            content: `مساحة ${shapeName}:`,
            formula: 'S = π × r²',
            explanation: 'π ≈ 3.14159...'
          });
        }
        if (pedagogy !== 'exam') {
          steps.push({
            title: 'الحساب',
            content: `S = π × ${input.radius}²\nS = π × ${input.radius * input.radius}\nS = ${(Math.PI * input.radius * input.radius).toFixed(4)}`,
            formula: `S ≈ ${area.toFixed(2)}`,
            explanation: 'نرفع نصف القطر للقوة 2 ثم نضرب في π'
          });
        }
        break;

      default:
        return { success: false, steps: [], finalAnswer: '', error: 'شكل غير معروف' };
    }

    const finalValue = Number.isInteger(area) ? area.toString() : area.toFixed(2);
    return {
      success: true,
      steps,
      finalAnswer: `المساحة = ${finalValue} وحدة مربعة`,
      justification: `مساحة ${shapeName} = ${finalValue} وحدة مربعة`
    };

  } else if (input.type === '3d') {
    const { solid } = input;

    if (!solid) {
      return {
        success: false,
        steps: [],
        finalAnswer: '',
        error: 'يجب تحديد نوع المجسم'
      };
    }

    let volume: number;
    let formula: string;
    let solidName: string;

    switch (solid) {
      case 'cube':
        if (!input.side) {
          return { success: false, steps: [], finalAnswer: '', error: 'يجب إعطاء طول الحرف' };
        }
        solidName = 'المكعب';
        formula = 'V = a³';
        volume = input.side ** 3;

        if (pedagogy !== 'exam') {
          steps.push({
            title: 'المعطيات',
            content: `طول الحرف a = ${input.side}`,
            explanation: 'جميع أحرف المكعب متساوية'
          });
        }
        if (pedagogy === 'learning') {
          steps.push({
            title: 'الصيغة',
            content: `حجم ${solidName}:`,
            formula,
            explanation: 'الحجم = مكعب طول الحرف'
          });
        }
        if (pedagogy !== 'exam') {
          steps.push({
            title: 'الحساب',
            content: `V = ${input.side}³`,
            formula: `V = ${volume}`,
            explanation: 'نرفع الحرف للقوة 3'
          });
        }
        break;

      case 'rectangular_prism':
        if (!input.length || !input.width || !input.height) {
          return { success: false, steps: [], finalAnswer: '', error: 'يجب إعطاء الطول والعرض والارتفاع' };
        }
        solidName = 'متوازي المستطيلات';
        formula = 'V = L × W × H';
        volume = input.length * input.width * input.height;

        if (pedagogy !== 'exam') {
          steps.push({
            title: 'المعطيات',
            content: `الطول L = ${input.length}\nالعرض W = ${input.width}\nالارتفاع H = ${input.height}`,
            explanation: 'الأبعاد الثلاثة للمتوازي'
          });
        }
        if (pedagogy === 'learning') {
          steps.push({
            title: 'الصيغة',
            content: `حجم ${solidName}:`,
            formula,
            explanation: 'الحجم = الطول × العرض × الارتفاع'
          });
        }
        if (pedagogy !== 'exam') {
          steps.push({
            title: 'الحساب',
            content: `V = ${input.length} × ${input.width} × ${input.height}`,
            formula: `V = ${volume}`,
            explanation: 'نضرب الأبعاد الثلاثة'
          });
        }
        break;

      case 'cylinder':
        if (!input.radius || !input.height) {
          return { success: false, steps: [], finalAnswer: '', error: 'يجب إعطاء نصف القطر والارتفاع' };
        }
        solidName = 'الأسطوانة';
        formula = 'V = π × r² × h';
        volume = Math.PI * input.radius * input.radius * input.height;

        if (pedagogy !== 'exam') {
          steps.push({
            title: 'المعطيات',
            content: `نصف قطر القاعدة r = ${input.radius}\nالارتفاع h = ${input.height}`,
            explanation: 'الأسطوانة لها قاعدتان دائريتان'
          });
        }
        if (pedagogy === 'learning') {
          steps.push({
            title: 'الصيغة',
            content: `حجم ${solidName}:`,
            formula,
            explanation: 'الحجم = مساحة القاعدة × الارتفاع'
          });
        }
        if (pedagogy !== 'exam') {
          steps.push({
            title: 'الحساب',
            content: `V = π × ${input.radius}² × ${input.height}\nV = π × ${input.radius * input.radius} × ${input.height}\nV = ${(Math.PI * input.radius * input.radius * input.height).toFixed(4)}`,
            formula: `V ≈ ${volume.toFixed(2)}`,
            explanation: 'نحسب مساحة القاعدة ثم نضرب في الارتفاع'
          });
        }
        break;

      default:
        return { success: false, steps: [], finalAnswer: '', error: 'مجسم غير معروف' };
    }

    const finalValue = Number.isInteger(volume) ? volume.toString() : volume.toFixed(2);
    return {
      success: true,
      steps,
      finalAnswer: `الحجم = ${finalValue} وحدة مكعبة`,
      justification: `حجم ${solidName} = ${finalValue} وحدة مكعبة`
    };
  }

  return {
    success: false,
    steps: [],
    finalAnswer: '',
    error: 'يجب تحديد نوع الحساب (مساحة أو حجم)'
  };
}
