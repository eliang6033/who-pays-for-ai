import test from 'node:test';
import assert from 'node:assert/strict';
import {simulate, DEFAULT, COMMUNITIES, ENERGY, COOLING, COSTS} from '../src/simulation.js';
test('default scenario follows dimensional arithmetic', () => {
 const x = simulate(DEFAULT);
 assert.equal(x.itMWh, 70080); assert.equal(x.electricityMWh, 84096);
 assert.equal(x.waterLiters, 84096000); assert.equal(x.carbonTonnes, 33638.4);
 assert.equal(x.extraAnnualUSD, 100); assert.ok(Math.abs(x.totalBurden - 6.333333333333333) < 1e-12);
});
test('income changes burden, not resource use or dollar charge', () => {
 const a=simulate(DEFAULT), b=simulate({...DEFAULT,community:'higher'});
 for(const k of ['electricityMWh','waterLiters','carbonTonnes','extraAnnualUSD']) assert.equal(a[k],b[k]);
 assert.ok(a.totalBurden > b.totalBurden);
});
test('dry cooling trades lower direct water for greater electricity under our assumptions',()=>{
 const a=simulate(DEFAULT), b=simulate({...DEFAULT,cooling:'dry'});
 assert.ok(b.waterLiters<a.waterLiters); assert.ok(b.electricityMWh>a.electricityMWh);
});
test('lower carbon supply changes operational emissions only',()=>{
 const a=simulate(DEFAULT), b=simulate({...DEFAULT,energy:'cleaner'});
 assert.equal(b.electricityMWh,a.electricityMWh); assert.equal(b.waterLiters,a.waterLiters);
 assert.equal(b.carbonTonnes,a.carbonTonnes/8);
});
test('cost recovery is conserved at all three allocations',()=>{
 for(const costs of Object.keys(COSTS)) {
  const x=simulate({...DEFAULT,costs});
  assert.equal(x.extraAnnualUSD*10000*10,20000000*COSTS[costs].residentShare);
 }
 assert.equal(simulate({...DEFAULT,costs:'company'}).addedBurden,0);
});
test('all 24 combinations are finite and nonnegative',()=>{
 let count=0;
 for(const community in COMMUNITIES) for(const energy in ENERGY) for(const cooling in COOLING) for(const costs in COSTS){
  Object.values(simulate({community,energy,cooling,costs})).forEach(v=>assert.ok(Number.isFinite(v)&&v>=0)); count++;
 }
 assert.equal(count,24);
});
test('invalid model states fail explicitly',()=>assert.throws(()=>simulate({...DEFAULT,cooling:'unknown'})));
