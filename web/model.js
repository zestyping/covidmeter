const loc = {};

for (const code in prevalence) {
  const record = prevalence[code];
  key = record.label.toLowerCase().replace(/ +/g, '_');
  typical = parseFloat(record['estimatedPrevalence']) * 1e6;
  unvaccinated = typical * record['unvaccinatedPrevalenceRatio'];
  vaccinated = unvaccinated * record['averageFullyVaccinatedMultiplier'];
  loc[key] = {
    typ: Math.round(typical),
    vac: Math.round(vaccinated),
    unvac: Math.round(unvaccinated)
  };
}

const VACCINE_MULTIPLIERS = {
  'jj': 0.36,
  'mrna1': 0.76,
  'mrna2': 0.17
};
const TRANSMISSION_PER_HOUR = 0.14;
const MAX_TRANSMISSION = 0.60;
const FACTORS = {
  d: 1/2,  // keeping 6 ft of distance
  m: 1/2,  // others are wearing cloth masks
  n: 1/3,  // self is wearing an N95 mask
  o: 1/20,  // outdoors
  s: 1/5,  // silent, no talking
};

function uc(ownVaccine, profile, minutes, factors) {
  var multiplier = (VACCINE_MULTIPLIERS[ownVaccine] || 1);
  var transmission =
      Math.min(TRANSMISSION_PER_HOUR * minutes / 60, MAX_TRANSMISSION);
  var result = profile * multiplier * transmission;
  for (const ch of (factors || '')) {
    result *= (FACTORS[ch] || 1);
  }
  return Math.round(result);
}
