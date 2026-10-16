// Every numerical model input below is an illustrative assumption, not measured data.
export const ASSUMPTIONS = Object.freeze({itMW: 10, utilization: 0.8, hours: 8760, upgradeUSD: 20_000_000, recoveryYears: 10, households: 10_000, baselineBillUSD: 1800});
export const COMMUNITIES = {lower: {label: 'Lower income', income: 30000}, higher: {label: 'Higher income', income: 100000}};
export const ENERGY = {grid: {label: 'Illustrative grid mix', kgPerMWh: 400}, cleaner: {label: 'Lower carbon supply', kgPerMWh: 50}};
export const COOLING = {evaporative: {label: 'Evaporative', pue: 1.2, litersPerITKWh: 1.2}, dry: {label: 'Dry cooling', pue: 1.35, litersPerITKWh: 0.02}};
export const COSTS = {company: {label: 'Company pays', residentShare: 0}, shared: {label: 'Split equally', residentShare: 0.5}, residents: {label: 'Residents pay', residentShare: 1}};
export const DEFAULT = {community: 'lower', energy: 'grid', cooling: 'evaporative', costs: 'shared'};
export function simulate(selection) {
  const {community, energy, cooling, costs} = selection;
  if (!COMMUNITIES[community] || !ENERGY[energy] || !COOLING[cooling] || !COSTS[costs]) throw new Error('Invalid scenario selection');
  const a = ASSUMPTIONS, c = COOLING[cooling], income = COMMUNITIES[community].income;
  const itMWh = a.itMW * a.utilization * a.hours;
  const electricityMWh = itMWh * c.pue;
  const waterLiters = itMWh * 1000 * c.litersPerITKWh;
  const carbonTonnes = electricityMWh * ENERGY[energy].kgPerMWh / 1000;
  const extraAnnualUSD = a.upgradeUSD / a.recoveryYears * COSTS[costs].residentShare / a.households;
  return {itMWh, electricityMWh, waterLiters, carbonTonnes, extraAnnualUSD, baselineBurden: a.baselineBillUSD / income * 100, addedBurden: extraAnnualUSD / income * 100, totalBurden: (a.baselineBillUSD + extraAnnualUSD) / income * 100};
}
export const format = (n, digits = 1) => new Intl.NumberFormat('en-US', {maximumFractionDigits: digits, minimumFractionDigits: digits}).format(n);
