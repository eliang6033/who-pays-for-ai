import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const r=JSON.parse(readFileSync(new URL('../src/research.json',import.meta.url),'utf8'));
test('Draft 2 web edition has all six chapters and a reproducible body word count',()=>{
 const count=r.sections.flatMap(s=>s.paragraphs).join(' ').replace(/\[\d+\]/g,'').trim().split(/\s+/).length;
 assert.equal(count,r.wordCount);assert.ok(count>=1500&&count<=2000);
 assert.deepEqual(r.sections.map(s=>s.title),['Introduction','Electricity Use','Cooling and Water Use','Income and Cost Sharing','Results and Limitations','Conclusion']);
});
test('Draft 2 sources are all cited, uniquely linked, and accurately typed',()=>{
 assert.equal(r.sources.length,10);assert.equal(new Set(r.sources.map(s=>s.id)).size,10);
 assert.equal(r.sources.filter(s=>s.peerReviewed).length,3);
 assert.match(r.sources.find(s=>s.id===9).title,/Leverage Points/);
 assert.match(r.sources.find(s=>s.id===10).author,/Jarboe/);
 const text=r.sections.flatMap(s=>s.paragraphs).join(' ');
 const ids=new Set([...text.matchAll(/\[(\d+)\]/g)].map(m=>Number(m[1])));
 assert.deepEqual([...ids].sort((a,b)=>a-b),r.sources.map(s=>s.id));
 r.sources.forEach(s=>assert.ok(s.url.startsWith('https://')));
});
