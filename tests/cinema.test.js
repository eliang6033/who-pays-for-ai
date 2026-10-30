import test from 'node:test';
import assert from 'node:assert/strict';
import {cinemaReducer as reduce,initialCinema,CHAPTERS,filmBeats,FILM_DURATION} from '../src/cinema.js';
import {simulate} from '../src/simulation.js';

test('opening a card is not a committed selection; confirmation gates each film',()=>{
 let s=reduce(initialCinema,{type:'BEGIN'});
 assert.equal(reduce(s,{type:'CONFIRM'}),s);
 s=reduce(s,{type:'OPEN',value:'grid'});
 assert.deepEqual(s.choices,{});
 s=reduce(s,{type:'CLOSE'});
 assert.deepEqual(s.choices,{});
 assert.equal(reduce(s,{type:'OPEN',value:'__proto__'}),s);
 s=reduce(s,{type:'OPEN',value:'cleaner'});
 s=reduce(s,{type:'CONFIRM'});
 assert.equal(s.phase,'film');
 assert.equal(reduce(s,{type:'NEXT'}),s);
 s=reduce(s,{type:'FILM_END'});
 assert.equal(s.phase,'recap');
 assert.equal(reduce(s,{type:'NEXT'}).step,1);
});
function run(values,costs){
 let s=reduce(initialCinema,{type:'BEGIN'});
 for(const value of values){
  s=reduce(s,{type:'OPEN',value});
  if(s.step===2){assert.equal(reduce(s,{type:'CONFIRM'}),s);s=reduce(s,{type:'FUND',value:costs});}
  s=reduce(s,{type:'CONFIRM'});assert.equal(s.phase,'film');
  s=reduce(s,{type:'FILM_END'});s=reduce(s,{type:'NEXT'});
 }
 return s;
}
test('all 24 scenarios finish three chapters with a required funding decision',()=>{
 let n=0;
 for(const energy of ['grid','cleaner'])for(const cooling of ['dry','evaporative'])for(const community of ['lower','higher'])for(const costs of ['company','shared','residents']){
  const s=run([energy,cooling,community],costs);
  assert.equal(s.phase,'results');assert.ok(Number.isFinite(simulate(s.choices).totalBurden));n++;
 }
 assert.equal(n,24);
});
test('editing and replay preserve saved comparisons without mutating the snapshot',()=>{
 let s=reduce(run(['cleaner','dry','lower'],'residents'),{type:'SAVE'});
 const snap={...s.saved};
 s=reduce(s,{type:'EDIT'});s=reduce(s,{type:'OPEN',value:'grid'});s=reduce(s,{type:'CONFIRM'});
 assert.deepEqual(s.saved,snap);assert.equal(s.choices.energy,'grid');
 s=reduce(s,{type:'REPLAY'});assert.deepEqual(s.choices,{});assert.deepEqual(s.saved,snap);
});
test('all six choices have five paced scenes and transparent research boundaries',()=>{
 assert.equal(FILM_DURATION,12500);
 for(const c of CHAPTERS)for(const o of c.options){
  const frames=filmBeats(c.key,o.id,'shared');assert.equal(frames.length,5);
  assert.ok(frames.every(f=>f.length===3&&f.every(v=>v.length>0)));
  assert.ok(o.boundary.length>20);
 }
});
