/**
 * AgriTech Soil Health Rule Engine
 *
 * Implements configurable demo thresholds defined in Architecture Version 2.3 (Section 3.3).
 * NOTE: These are representative starting values for demonstration. They are NOT universal
 * agronomic standards and include an explicit advisory disclaimer on every calculation.
 */

const MANDATORY_ADVISORY_DISCLAIMER =
  'These recommendations are indicative, rule-based advisories generated from configurable demo thresholds. They are for educational and preliminary planning purposes only and do not constitute a certified laboratory or agronomist diagnosis. Always consult a qualified local agronomist before applying chemical soil amendments.';

const evaluateSoilHealth = ({ phLevel, nitrogenKgPerHa, phosphorusKgPerHa, potassiumKgPerHa, organicCarbonPercent }) => {
  const recommendations = [];
  const parameters = {};
  let attentionFlags = 0;

  // 1. pH Evaluation
  if (phLevel < 6.0) {
    parameters.ph = {
      value: phLevel,
      status: 'Low (Acidic)',
      statusType: 'warning',
      advice: 'Soil may be acidic (< 6.0). Consider consulting an agronomist about agricultural lime application.',
    };
    recommendations.push(parameters.ph.advice);
    attentionFlags++;
  } else if (phLevel <= 7.5) {
    parameters.ph = {
      value: phLevel,
      status: 'Optimal',
      statusType: 'success',
      advice: 'Soil pH is within optimal typical range (6.0 - 7.5). Nutrient absorption is maximized.',
    };
  } else {
    parameters.ph = {
      value: phLevel,
      status: 'High (Alkaline)',
      statusType: 'warning',
      advice:
        'Soil may be alkaline (> 7.5). Consult an agronomist about appropriate amendment options. Do not automatically apply gypsum without secondary salinity/EC testing.',
    };
    recommendations.push(parameters.ph.advice);
    attentionFlags++;
  }

  // 2. Nitrogen (N) Evaluation (kg/ha)
  if (nitrogenKgPerHa < 280) {
    parameters.nitrogen = {
      value: nitrogenKgPerHa,
      status: 'Low',
      statusType: 'warning',
      advice: 'Nitrogen appears low (< 280 kg/ha). Consider green manure, legume rotation, or balanced bio-fertilizers.',
    };
    recommendations.push(parameters.nitrogen.advice);
    attentionFlags++;
  } else if (nitrogenKgPerHa <= 560) {
    parameters.nitrogen = {
      value: nitrogenKgPerHa,
      status: 'Optimal',
      statusType: 'success',
      advice: 'Nitrogen is within typical range (280 - 560 kg/ha). Supports healthy canopy development.',
    };
  } else {
    parameters.nitrogen = {
      value: nitrogenKgPerHa,
      status: 'High',
      statusType: 'info',
      advice: 'Nitrogen is high (> 560 kg/ha). Consider reducing nitrogen inputs to prevent excess vegetative growth.',
    };
    recommendations.push(parameters.nitrogen.advice);
  }

  // 3. Phosphorus (P) Evaluation (kg/ha)
  if (phosphorusKgPerHa < 10) {
    parameters.phosphorus = {
      value: phosphorusKgPerHa,
      status: 'Low',
      statusType: 'warning',
      advice: 'Phosphorus appears low (< 10 kg/ha). Consider SSP or DAP placement near root zone at sowing.',
    };
    recommendations.push(parameters.phosphorus.advice);
    attentionFlags++;
  } else if (phosphorusKgPerHa <= 25) {
    parameters.phosphorus = {
      value: phosphorusKgPerHa,
      status: 'Optimal',
      statusType: 'success',
      advice: 'Phosphorus is within typical range (10 - 25 kg/ha). Adequate for root development and flowering.',
    };
  } else {
    parameters.phosphorus = {
      value: phosphorusKgPerHa,
      status: 'High',
      statusType: 'info',
      advice: 'Phosphorus is high (> 25 kg/ha). Avoid additional phosphate fertilizer application.',
    };
    recommendations.push(parameters.phosphorus.advice);
  }

  // 4. Potassium (K) Evaluation (kg/ha)
  if (potassiumKgPerHa < 110) {
    parameters.potassium = {
      value: potassiumKgPerHa,
      status: 'Low',
      statusType: 'warning',
      advice: 'Potassium appears low (< 110 kg/ha). Consider Muriate of Potash (MOP) or organic potassium sources.',
    };
    recommendations.push(parameters.potassium.advice);
    attentionFlags++;
  } else if (potassiumKgPerHa <= 280) {
    parameters.potassium = {
      value: potassiumKgPerHa,
      status: 'Optimal',
      statusType: 'success',
      advice: 'Potassium is within typical range (110 - 280 kg/ha). Enhances disease tolerance and crop quality.',
    };
  } else {
    parameters.potassium = {
      value: potassiumKgPerHa,
      status: 'Sufficient / High',
      statusType: 'success',
      advice: 'Potassium is sufficient (> 280 kg/ha). No supplementary potash required.',
    };
  }

  // Compile summary
  const recommendationSummary =
    recommendations.length > 0
      ? recommendations.join(' ')
      : 'All primary soil parameters (pH, N, P, K) are within balanced target ranges. Maintain standard agronomic practices.';

  const overallRating =
    attentionFlags === 0 ? 'Optimal' : attentionFlags <= 2 ? 'Monitoring' : 'Needs Attention';

  return {
    parameters,
    recommendationSummary,
    disclaimerText: MANDATORY_ADVISORY_DISCLAIMER,
    overallRating,
  };
};

module.exports = {
  evaluateSoilHealth,
  MANDATORY_ADVISORY_DISCLAIMER,
};

