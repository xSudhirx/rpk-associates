/**
 * FY 2025-26 (AY 2026-27) resident individual estimates.
 * New regime: Section 115BAC slabs + standard deduction ₹75k (salary/pension) + rebate u/s 87A (max ₹60k, TI ≤ ₹12L).
 * Old regime: Chapter VI-A deductions + standard deduction ₹50k (salary/pension) + rebate u/s 87A (max ₹12.5k, TI ≤ ₹5L).
 * Excludes surcharge, special-rate income, marginal relief above rebate thresholds.
 */

export function formatInr(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

/** ₹4L–₹8L through ₹20L–₹24L: five slices of ₹4L at 5%,10%,15%,20%,25%. Above ₹24L: 30%. */
const NEW_SLAB_RATES = [0.05, 0.1, 0.15, 0.2, 0.25];

export function newRegimeTaxBeforeRebate(taxableIncome) {
  const T = Math.max(0, taxableIncome);
  if (T <= 400_000) return 0;
  let tax = 0;
  let prev = 400_000;
  for (let i = 0; i < NEW_SLAB_RATES.length; i++) {
    const ceiling = prev + 400_000;
    if (T <= prev) break;
    const slice = Math.min(T, ceiling) - prev;
    if (slice > 0) tax += slice * NEW_SLAB_RATES[i];
    prev = ceiling;
  }
  if (T > 2_400_000) tax += (T - 2_400_000) * 0.3;
  return tax;
}

export function oldRegimeTaxBeforeRebate(taxableIncome, ageGroup) {
  const T = Math.max(0, taxableIncome);
  let nilUpto;
  if (ageGroup === '60to80') nilUpto = 300_000;
  else if (ageGroup === 'above80') nilUpto = 500_000;
  else nilUpto = 250_000;

  if (T <= nilUpto) return 0;

  if (ageGroup === 'above80') {
    if (T <= 1_000_000) return (T - nilUpto) * 0.2;
    return 100_000 + (T - 1_000_000) * 0.3;
  }

  if (ageGroup === '60to80') {
    if (T <= 500_000) return (T - nilUpto) * 0.05;
    if (T <= 1_000_000) return 10_000 + (T - 500_000) * 0.2;
    return 110_000 + (T - 1_000_000) * 0.3;
  }

  if (T <= 500_000) return (T - nilUpto) * 0.05;
  if (T <= 1_000_000) return 12_500 + (T - 500_000) * 0.2;
  return 112_500 + (T - 1_000_000) * 0.3;
}

export function computeIncomeTax({
  grossIncome,
  regime,
  ageGroup,
  isSalariedOrPensioner,
  deduction80C,
  otherChapterVIA,
}) {
  const G = Math.max(0, grossIncome || 0);
  const c80 = Math.min(Math.max(0, deduction80C || 0), 150_000);
  const other = Math.max(0, otherChapterVIA || 0);
  const breakdown = [];

  let taxable = G;
  let taxBeforeRebate = 0;

  if (regime === 'new') {
    const std = isSalariedOrPensioner ? 75_000 : 0;
    taxable = Math.max(0, G - std);
    if (std) breakdown.push(['Standard deduction (salary / pension)', formatInr(std)]);
    breakdown.push(['Taxable income (for slab rates)', formatInr(taxable)]);
    const taxPre87A = newRegimeTaxBeforeRebate(taxable);
    breakdown.push(['Tax before rebate u/s 87A (new slabs)', formatInr(taxPre87A)]);

    let rebate = 0;
    if (taxable <= 12_00_000) {
      rebate = Math.min(taxPre87A, 60_000);
      if (rebate > 0) breakdown.push(['Rebate u/s 87A (max ₹60,000 if TI ≤ ₹12L)', `− ${formatInr(rebate)}`]);
    }
    taxBeforeRebate = Math.max(0, taxPre87A - rebate);
  } else {
    const std = isSalariedOrPensioner ? 50_000 : 0;
    const totalDed = std + c80 + other;
    taxable = Math.max(0, G - totalDed);
    if (std) breakdown.push(['Standard deduction (old regime)', formatInr(std)]);
    if (c80) breakdown.push(['Deduction u/s 80C (capped ₹1,50,000)', formatInr(c80)]);
    if (other) breakdown.push(['Other Chapter VI-A (80D, 80CCD, etc.)', formatInr(other)]);
    breakdown.push(['Taxable income', formatInr(taxable)]);
    taxBeforeRebate = oldRegimeTaxBeforeRebate(taxable, ageGroup);
    breakdown.push(['Tax before rebate (old regime slabs)', formatInr(taxBeforeRebate)]);

    let rebate = 0;
    if (taxable <= 5_00_000) {
      rebate = Math.min(taxBeforeRebate, 12_500);
      if (rebate > 0) breakdown.push(['Rebate u/s 87A (old regime, max ₹12,500)', `− ${formatInr(rebate)}`]);
    }
    taxBeforeRebate = Math.max(0, taxBeforeRebate - rebate);
  }

  const cess = taxBeforeRebate * 0.04;
  breakdown.push(['Health & education cess @ 4%', formatInr(cess)]);
  const total = taxBeforeRebate + cess;
  breakdown.push(['Estimated total tax (excl. surcharge)', formatInr(total)]);

  return {
    taxableIncome: taxable,
    taxBeforeCess: taxBeforeRebate,
    cess,
    total,
    breakdown,
    disclaimer:
      'Indicative only: marginal relief above rebate thresholds, surcharge, and special-rate income are not included.',
  };
}
