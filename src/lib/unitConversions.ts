// Unit conversions for Bac chemistry inputs.
// All canonical units match what `chemistryEngine.ts` expects:
//   C0  → mol/L
//   V   → L
//   sigma → S/m
//   lambda → S·m²/mol
//   n0  → mol
//   Vm  → L/mol

export type UnitOption = { value: string; label: string; factor: number };

// Each map: unit code → factor to multiply value by to reach the canonical unit.

export const concentrationUnits: UnitOption[] = [
  { value: 'mol/L',   label: 'mol/L',  factor: 1 },
  { value: 'mmol/L',  label: 'mmol/L', factor: 1e-3 },
  { value: 'mol/m3',  label: 'mol/m³', factor: 1e-3 }, // 1 mol/m³ = 1e-3 mol/L
];

export const volumeUnits: UnitOption[] = [
  { value: 'L',  label: 'L',  factor: 1 },
  { value: 'mL', label: 'mL', factor: 1e-3 },
  { value: 'cL', label: 'cL', factor: 1e-2 },
  { value: 'dL', label: 'dL', factor: 1e-1 },
  { value: 'm3', label: 'm³', factor: 1e3 },
];

export const conductivityUnits: UnitOption[] = [
  { value: 'S/m',   label: 'S/m',   factor: 1 },
  { value: 'mS/m',  label: 'mS/m',  factor: 1e-3 },
  { value: 'mS/cm', label: 'mS/cm', factor: 0.1 },   // 1 mS/cm = 0.1 S/m
  { value: 'µS/cm', label: 'µS/cm', factor: 1e-4 },  // 1 µS/cm = 1e-4 S/m
];

// λ canonical: S·m²/mol
export const lambdaUnits: UnitOption[] = [
  { value: 'S·m2/mol',    label: 'S·m²/mol',    factor: 1 },
  { value: 'mS·m2/mol',   label: 'mS·m²/mol',   factor: 1e-3 },
  // Common in textbooks: S·cm²/mol = 1e-4 S·m²/mol
  { value: 'S·cm2/mol',   label: 'S·cm²/mol',   factor: 1e-4 },
  { value: 'mS·cm2/mol',  label: 'mS·cm²/mol',  factor: 1e-7 },
];

export const moleUnits: UnitOption[] = [
  { value: 'mol',  label: 'mol',  factor: 1 },
  { value: 'mmol', label: 'mmol', factor: 1e-3 },
  { value: 'µmol', label: 'µmol', factor: 1e-6 },
];

export const molarVolumeUnits: UnitOption[] = [
  { value: 'L/mol',  label: 'L/mol',  factor: 1 },
  { value: 'mL/mol', label: 'mL/mol', factor: 1e-3 },
  { value: 'm3/mol', label: 'm³/mol', factor: 1e3 },
];

import type { InputKey } from './dynamicInputSystem';

export type UnitSelections = Partial<Record<InputKey, string>>;

/** Map InputKey → option list + default unit. */
export const unitOptionsByKey: Partial<Record<InputKey, { options: UnitOption[]; defaultUnit: string }>> = {
  C0:           { options: concentrationUnits, defaultUnit: 'mol/L' },
  V:            { options: volumeUnits,        defaultUnit: 'L' },
  sigma:        { options: conductivityUnits,  defaultUnit: 'S/m' },
  lambdaCation: { options: lambdaUnits,        defaultUnit: 'S·m2/mol' },
  lambdaAnion:  { options: lambdaUnits,        defaultUnit: 'S·m2/mol' },
  n0:           { options: moleUnits,          defaultUnit: 'mol' },
  Vm:           { options: molarVolumeUnits,   defaultUnit: 'L/mol' },
};

/** Convert a raw numeric value entered in `unit` to the canonical unit. */
export function toCanonical(key: InputKey, value: number, unit?: string): number {
  const config = unitOptionsByKey[key];
  if (!config) return value;
  const u = unit || config.defaultUnit;
  const opt = config.options.find(o => o.value === u);
  return opt ? value * opt.factor : value;
}

/** Build default selections for all keys that support units. */
export function defaultUnitSelections(): UnitSelections {
  const out: UnitSelections = {};
  (Object.keys(unitOptionsByKey) as InputKey[]).forEach(k => {
    out[k] = unitOptionsByKey[k]!.defaultUnit;
  });
  return out;
}