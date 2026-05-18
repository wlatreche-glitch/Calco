// ============================================
// PHYSICS CONSTANTS & UNITS ENGINE
// المحرك الأساسي للثوابت الفيزيائية والوحدات
// ============================================

export interface PhysicalConstant {
  symbol: string;
  nameAr: string;
  nameFr: string;
  value: number;
  unit: string;
  category: 'universal' | 'electromagnetic' | 'atomic' | 'thermodynamic' | 'mechanical';
}

// الثوابت الفيزيائية الأساسية (منهاج BAC الجزائري)
export const PHYSICS_CONSTANTS: Record<string, PhysicalConstant> = {
  // الثوابت العالمية
  c: {
    symbol: 'c',
    nameAr: 'سرعة الضوء في الفراغ',
    nameFr: 'Vitesse de la lumière',
    value: 3e8,
    unit: 'm/s',
    category: 'universal'
  },
  g: {
    symbol: 'g',
    nameAr: 'تسارع الجاذبية الأرضية',
    nameFr: 'Accélération gravitationnelle',
    value: 9.8,
    unit: 'm/s²',
    category: 'universal'
  },
  G: {
    symbol: 'G',
    nameAr: 'ثابت الجاذبية العام',
    nameFr: 'Constante gravitationnelle',
    value: 6.67e-11,
    unit: 'N·m²/kg²',
    category: 'universal'
  },
  h: {
    symbol: 'h',
    nameAr: 'ثابت بلانك',
    nameFr: 'Constante de Planck',
    value: 6.626e-34,
    unit: 'J·s',
    category: 'atomic'
  },
  NA: {
    symbol: 'NA',
    nameAr: 'عدد أفوغادرو',
    nameFr: "Nombre d'Avogadro",
    value: 6.022e23,
    unit: 'mol⁻¹',
    category: 'atomic'
  },
  
  // الثوابت الكهرومغناطيسية
  e: {
    symbol: 'e',
    nameAr: 'شحنة الإلكترون',
    nameFr: "Charge de l'électron",
    value: 1.602e-19,
    unit: 'C',
    category: 'electromagnetic'
  },
  epsilon0: {
    symbol: 'ε₀',
    nameAr: 'السماحية الكهربائية للفراغ',
    nameFr: 'Permittivité du vide',
    value: 8.854e-12,
    unit: 'F/m',
    category: 'electromagnetic'
  },
  mu0: {
    symbol: 'μ₀',
    nameAr: 'النفاذية المغناطيسية للفراغ',
    nameFr: 'Perméabilité du vide',
    value: 4 * Math.PI * 1e-7,
    unit: 'H/m',
    category: 'electromagnetic'
  },
  k: {
    symbol: 'k',
    nameAr: 'ثابت كولوم',
    nameFr: 'Constante de Coulomb',
    value: 9e9,
    unit: 'N·m²/C²',
    category: 'electromagnetic'
  },
  
  // الثوابت الذرية
  me: {
    symbol: 'mₑ',
    nameAr: 'كتلة الإلكترون',
    nameFr: "Masse de l'électron",
    value: 9.109e-31,
    unit: 'kg',
    category: 'atomic'
  },
  mp: {
    symbol: 'mₚ',
    nameAr: 'كتلة البروتون',
    nameFr: 'Masse du proton',
    value: 1.673e-27,
    unit: 'kg',
    category: 'atomic'
  },
  mn: {
    symbol: 'mₙ',
    nameAr: 'كتلة النيوترون',
    nameFr: 'Masse du neutron',
    value: 1.675e-27,
    unit: 'kg',
    category: 'atomic'
  },
  u: {
    symbol: 'u',
    nameAr: 'وحدة الكتلة الذرية',
    nameFr: 'Unité de masse atomique',
    value: 1.66054e-27,
    unit: 'kg',
    category: 'atomic'
  },
  
  // الثوابت الحرارية
  R: {
    symbol: 'R',
    nameAr: 'ثابت الغازات المثالية',
    nameFr: 'Constante des gaz parfaits',
    value: 8.314,
    unit: 'J/(mol·K)',
    category: 'thermodynamic'
  },
  kB: {
    symbol: 'kB',
    nameAr: 'ثابت بولتزمان',
    nameFr: 'Constante de Boltzmann',
    value: 1.381e-23,
    unit: 'J/K',
    category: 'thermodynamic'
  },
  sigma: {
    symbol: 'σ',
    nameAr: 'ثابت ستيفان-بولتزمان',
    nameFr: 'Constante de Stefan-Boltzmann',
    value: 5.67e-8,
    unit: 'W/(m²·K⁴)',
    category: 'thermodynamic'
  }
};

// تحويلات الوحدات
export interface UnitConversion {
  from: string;
  to: string;
  factor: number;
  category: string;
}

export const UNIT_CONVERSIONS: UnitConversion[] = [
  // الطول
  { from: 'km', to: 'm', factor: 1000, category: 'length' },
  { from: 'cm', to: 'm', factor: 0.01, category: 'length' },
  { from: 'mm', to: 'm', factor: 0.001, category: 'length' },
  { from: 'μm', to: 'm', factor: 1e-6, category: 'length' },
  { from: 'nm', to: 'm', factor: 1e-9, category: 'length' },
  
  // الزمن
  { from: 'ms', to: 's', factor: 0.001, category: 'time' },
  { from: 'μs', to: 's', factor: 1e-6, category: 'time' },
  { from: 'min', to: 's', factor: 60, category: 'time' },
  { from: 'h', to: 's', factor: 3600, category: 'time' },
  
  // الكتلة
  { from: 'g', to: 'kg', factor: 0.001, category: 'mass' },
  { from: 'mg', to: 'kg', factor: 1e-6, category: 'mass' },
  { from: 't', to: 'kg', factor: 1000, category: 'mass' },
  
  // الطاقة
  { from: 'eV', to: 'J', factor: 1.602e-19, category: 'energy' },
  { from: 'keV', to: 'J', factor: 1.602e-16, category: 'energy' },
  { from: 'MeV', to: 'J', factor: 1.602e-13, category: 'energy' },
  { from: 'kJ', to: 'J', factor: 1000, category: 'energy' },
  { from: 'cal', to: 'J', factor: 4.184, category: 'energy' },
  { from: 'kcal', to: 'J', factor: 4184, category: 'energy' },
  
  // الضغط
  { from: 'atm', to: 'Pa', factor: 101325, category: 'pressure' },
  { from: 'bar', to: 'Pa', factor: 1e5, category: 'pressure' },
  { from: 'mmHg', to: 'Pa', factor: 133.322, category: 'pressure' },
  
  // التردد
  { from: 'kHz', to: 'Hz', factor: 1000, category: 'frequency' },
  { from: 'MHz', to: 'Hz', factor: 1e6, category: 'frequency' },
  { from: 'GHz', to: 'Hz', factor: 1e9, category: 'frequency' },
  
  // الزاوية
  { from: '°', to: 'rad', factor: Math.PI / 180, category: 'angle' },
];

// دالة تحويل الوحدات
export function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  
  // معالجة خاصة لدرجة الحرارة
  if (fromUnit === '°C' && toUnit === 'K') {
    return value + 273.15;
  }
  if (fromUnit === 'K' && toUnit === '°C') {
    return value - 273.15;
  }
  
  // البحث عن التحويل المباشر
  const directConversion = UNIT_CONVERSIONS.find(
    c => c.from === fromUnit && c.to === toUnit
  );
  if (directConversion) {
    return value * directConversion.factor;
  }
  
  // البحث عن التحويل العكسي
  const reverseConversion = UNIT_CONVERSIONS.find(
    c => c.from === toUnit && c.to === fromUnit
  );
  if (reverseConversion) {
    return value / reverseConversion.factor;
  }
  
  // التحويل عبر وحدة مرجعية (SI)
  const fromToSI = UNIT_CONVERSIONS.find(c => c.from === fromUnit);
  const toFromSI = UNIT_CONVERSIONS.find(c => c.from === toUnit);
  
  if (fromToSI && toFromSI && fromToSI.to === toFromSI.to) {
    const valueInSI = value * fromToSI.factor;
    return valueInSI / toFromSI.factor;
  }
  
  throw new Error(`لا يمكن التحويل من ${fromUnit} إلى ${toUnit}`);
}

// دالة للحصول على ثابت فيزيائي
export function getConstant(symbol: string): PhysicalConstant | undefined {
  return PHYSICS_CONSTANTS[symbol];
}

// تجميع الثوابت حسب الفئة
export function getConstantsByCategory(category: PhysicalConstant['category']): PhysicalConstant[] {
  return Object.values(PHYSICS_CONSTANTS).filter(c => c.category === category);
}
