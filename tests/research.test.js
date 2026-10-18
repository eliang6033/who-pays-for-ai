import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const r=JSON.parse(readFileSync(new URL('../src/research.json',import.meta.url),'utf8'));
test('complete research essay is near 1500 words and count is reproducible',()=>{
 const count=r.sections.flatMap(s=>s.paragraphs).join(' ').replace(/\[\d+\]/g,'').trim().split(/\s+/).length;
 assert.equal(count,r.wordCount);assert.ok(count>=1450&&count<=1700);assert.equal(r.sections.length,7);
});
test('ten external sources plus the assigned Meadows reading are all cited',()=>{
 assert.equal(r.sources.length,11);
 const external=r.sources.filter(s=>s.id!==11);
 assert.equal(external.length,10);assert.ok(external.filter(s=>s.peerReviewed).length>=external.length/2);
 assert.match(r.sources.find(s=>s.id===11).title,/Leverage Points/);
 const text=r.sections.flatMap(s=>s.paragraphs).join(' ');
 const ids=new Set([...text.matchAll(/\[(\d+)\]/g)].map(m=>Number(m[1])));
 assert.deepEqual([...ids].sort((a,b)=>a-b),r.sources.map(s=>s.id));
 r.sources.forEach(s=>assert.ok(s.url.startsWith('https://')));
});
