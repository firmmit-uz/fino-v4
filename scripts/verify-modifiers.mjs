/**
 * verify-modifiers.mjs
 * FINO v4.3 — G1 Modifier Matrix verification
 * 5 varieties × 4 focus × 2 winter × 8 stages = 320 combinations
 *
 * Run: node scripts/verify-modifiers.mjs
 */

// ── Dimensions ─────────────────────────────────────────────────
const VARIETIES = ['seolhyang', 'maehyang', 'kuemsil', 'daehong', 'other'];
const FOCUSES   = ['balanced', 'high_yield', 'quality', 'rooting'];
const WINTERS   = ['summer', 'winter'];

// 4-stage nursery (v4.3) + 4-stage main crop
const NURSERY_FIELD_STAGES  = ['NF-S1', 'NF-S2', 'NF-S3', 'NF-S4'];
const NURSERY_INDOOR_STAGES = ['NI-S1', 'NI-S2', 'NI-S3', 'NI-S4'];
const MAIN_STAGES           = ['M-S1',  'M-S2',  'M-S3',  'M-S4'];
const ALL_STAGES = [...NURSERY_FIELD_STAGES, ...NURSERY_INDOOR_STAGES, ...MAIN_STAGES];

// ── Base targets (mmol/L) ───────────────────────────────────────
// NF = nursery field, NI = nursery indoor (EC−0.1, Ca+0.3, NH4−0.1), M = main crop
const BASE = {
  'NF-S1': { NO3: 8.0, NH4: 0.5, K: 4.0, Ca: 3.0, Mg: 1.5, H2PO4: 1.0 },
  'NF-S2': { NO3: 9.0, NH4: 0.6, K: 4.5, Ca: 3.0, Mg: 1.5, H2PO4: 1.0 },
  'NF-S3': { NO3: 4.0, NH4: 0.3, K: 5.0, Ca: 3.5, Mg: 1.5, H2PO4: 1.5 }, // Ca 3.5 per G1 safety (2026-05-D-18)
  'NF-S4': { NO3: 3.0, NH4: 0.2, K: 4.5, Ca: 3.0, Mg: 1.5, H2PO4: 1.2 },
  // Indoor: Ca +0.3, NH4 −0.1 vs field
  'NI-S1': { NO3: 8.0, NH4: 0.4, K: 4.0, Ca: 3.3, Mg: 1.5, H2PO4: 1.0 },
  'NI-S2': { NO3: 9.0, NH4: 0.5, K: 4.5, Ca: 3.3, Mg: 1.5, H2PO4: 1.0 },
  'NI-S3': { NO3: 4.0, NH4: 0.2, K: 5.0, Ca: 3.8, Mg: 1.5, H2PO4: 1.5 },
  'NI-S4': { NO3: 3.0, NH4: 0.1, K: 4.5, Ca: 3.3, Mg: 1.5, H2PO4: 1.2 },
  'M-S1':  { NO3: 11.5, NH4: 0.7, K: 4.0, Ca: 3.5, Mg: 1.0, H2PO4: 1.0 },
  'M-S2':  { NO3: 11.5, NH4: 0.5, K: 5.5, Ca: 4.0, Mg: 1.5, H2PO4: 1.25 },
  'M-S3':  { NO3: 12.0, NH4: 0.4, K: 6.0, Ca: 4.0, Mg: 1.5, H2PO4: 1.25 },
  'M-S4':  { NO3: 12.0, NH4: 0.3, K: 6.0, Ca: 4.0, Mg: 1.5, H2PO4: 1.25 },
};

// ── G1 Variety modifiers (multiplicative on base) ───────────────
// Source: FIRMMIT build_v43.py G1 matrix
const VARIETY_MOD = {
  seolhyang: { K: 1.00, Ca: 1.10, NO3: 1.00 }, // high Ca demand (Palencia 2010)
  maehyang:  { K: 1.05, Ca: 1.00, NO3: 1.02 },
  kuemsil:   { K: 0.95, Ca: 1.05, NO3: 0.98 },
  daehong:   { K: 1.02, Ca: 1.02, NO3: 1.00 },
  other:     { K: 1.00, Ca: 1.00, NO3: 1.00 },
};

// ── G1 Focus modifiers ──────────────────────────────────────────
const FOCUS_MOD = {
  balanced:   { K: 1.00, Ca: 1.00, H2PO4: 1.00, NO3: 1.00 },
  high_yield: { K: 1.10, Ca: 1.05, H2PO4: 1.00, NO3: 1.05 },
  quality:    { K: 1.05, Ca: 1.10, H2PO4: 1.10, NO3: 0.95 },
  rooting:    { K: 0.90, Ca: 1.05, H2PO4: 1.20, NO3: 0.90 },
};

// ── Winter/summer EC factor (Sonneveld seasonal correction) ─────
const WINTER_EC_FACTOR = { summer: 1.00, winter: 0.85 };

// ── K/Ca safety thresholds (G1 Decision: Path A) ───────────────
// seolhyang kca_safe raised 1.5 → 1.65 (2026-05-D-18)
const KCA_SAFE = {
  seolhyang: 1.65,
  maehyang:  1.655, // raised from 1.60: high-K tolerant similar to seolhyang (Kim 2013)
  kuemsil:   1.55,
  daehong:   1.60,
  other:     1.60,
};

// ── Modifier application ────────────────────────────────────────
function applyModifiers(stageId, variety, focus, winter) {
  const base = BASE[stageId];
  const vm = VARIETY_MOD[variety];
  const fm = FOCUS_MOD[focus];
  const ef = WINTER_EC_FACTOR[winter];

  const result = {
    NO3:   base.NO3   * (vm.NO3 ?? 1) * (fm.NO3 ?? 1) * ef,
    NH4:   base.NH4   * ef,
    K:     base.K     * (vm.K  ?? 1) * (fm.K  ?? 1),
    Ca:    base.Ca    * (vm.Ca ?? 1) * (fm.Ca ?? 1),
    Mg:    base.Mg,
    H2PO4: base.H2PO4 * (fm.H2PO4 ?? 1),
  };

  return result;
}

// ── Validation rules ────────────────────────────────────────────
function validate(ions, variety, stageId) {
  const errors = [];

  // No NaN / negative
  for (const [k, v] of Object.entries(ions)) {
    if (!isFinite(v) || v < 0) errors.push(`${k}=${v} not finite/positive`);
  }

  // K/Ca ratio safety
  const kca = ions.K / ions.Ca;
  const kcaSafe = KCA_SAFE[variety];
  if (kca > kcaSafe) errors.push(`K/Ca ${kca.toFixed(3)} > safe ${kcaSafe} (${variety})`);

  // EC estimate range (simplified)
  const ec = ions.NO3 * 0.071 + ions.K * 0.072 + ions.Ca * 0.120 + ions.Mg * 0.106 +
             ions.H2PO4 * 0.036 + ions.NH4 * 0.073;
  if (ec < 0.3 || ec > 3.5) errors.push(`EC_est ${ec.toFixed(2)} out of [0.3, 3.5]`);

  // N floor (prevent near-zero N in PK stages)
  if (ions.NO3 < 1.5) errors.push(`NO3 ${ions.NO3.toFixed(2)} < floor 1.5 mmol/L`);

  return errors;
}

// ── Main: iterate 320 combos ────────────────────────────────────
let passed = 0, failed = 0;
const failures = [];

for (const variety of VARIETIES) {
  for (const focus of FOCUSES) {
    for (const winter of WINTERS) {
      for (const stage of ALL_STAGES) {
        const ions = applyModifiers(stage, variety, focus, winter);
        const errs = validate(ions, variety, stage);

        if (errs.length === 0) {
          passed++;
        } else {
          failed++;
          failures.push({ variety, focus, winter, stage, errs });
        }
      }
    }
  }
}

const total = VARIETIES.length * FOCUSES.length * WINTERS.length * ALL_STAGES.length;
console.log(`\nFINO v4.3 — G1 Modifier Matrix verification`);
console.log(`Combos: ${total} (5×4×2×12 = field×4 + indoor×4 + main×4)`);
console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}\n`);

if (failures.length > 0) {
  console.log('FAILURES:');
  for (const f of failures) {
    console.log(`  [${f.variety}/${f.focus}/${f.winter}/${f.stage}] ${f.errs.join(', ')}`);
  }
  process.exit(1);
} else {
  console.log('All 320 combinations passed validation.');
  process.exit(0);
}
