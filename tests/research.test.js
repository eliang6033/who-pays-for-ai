import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CHAPTERS,filmBeats} from '../src/cinema.js';
const r=JSON.parse(readFileSync(new URL('../src/research.json',import.meta.url),'utf8'));
const text=r.sections.flatMap(s=>s.paragraphs).join(' ');
const refIds=t=>[...t.matchAll(/\[(\d+)\]/g)].map(m=>Number(m[1]));
test('final draft has six chapters, latest additions and a reproducible body word count',()=>{
 const count=text.replace(/\[\d+\]/g,'').trim().split(/\s+/).length;
 assert.equal(count,r.wordCount);assert.ok(count>=1500&&count<=2200);
 assert.match(r.revision,/Final draft/);assert.doesNotMatch(r.adaptationNote,/Draft 2/);
 assert.deepEqual(r.sections.map(s=>s.title),['Introduction','Electricity Use','Cooling and Water Use','Income and Cost Sharing','Results and Limitations','Conclusion']);
 for(const phrase of ['45 million','10,791','leverage points','air-cooled condensers','Viborillas','5,642','12,219','does not link'])assert.ok(text.includes(phrase),phrase);
});
test('all 13 final-draft MLA sources are cited and match the agreed bibliography',()=>{
 const expected=JSON.parse(readFileSync(new URL('./fixtures/references-13.json',import.meta.url),'utf8'));
 assert.equal(r.sources.length,13);assert.equal(new Set(r.sources.map(s=>s.id)).size,13);
 assert.equal(r.sources.filter(s=>s.peerReviewed).length,3);
 assert.deepEqual(r.sources.map(s=>s.url),expected.map(s=>s[1]));
 assert.deepEqual([...new Set(refIds(text))].sort((a,b)=>a-b),r.sources.map(s=>s.id));
 r.sources.forEach((s,i)=>{assert.ok(s.url.startsWith('https://'));assert.equal(s.mla,expected[i][0].trim().replace(/,$/,'')+'.');});
 assert.match(r.sources.find(s=>s.id===9).title,/Leverage Points/);
 assert.match(r.sources.find(s=>s.id===6).author,/Jarboe/);
 assert.match(r.sources.find(s=>s.id===12).author,/Shehabi/);
});
test('cards and every film citation resolve to final sources without changing model boundaries',()=>{
 for(const chapter of CHAPTERS)for(const option of chapter.options){
  assert.ok(r.sources.some(s=>s.id===option.sourceId));
  for(const frame of filmBeats(chapter.key,option.id,'shared'))for(const id of refIds(frame[2]))assert.ok(r.sources.some(s=>s.id===id),`Missing film source ${id}`);
 }
 assert.ok(text.includes('cryptocurrency mining campus'));
 assert.ok(text.includes('does not establish'));
 assert.ok(text.includes('does not demonstrate lower household bills'));
 assert.ok(text.includes('central projection'));
 assert.ok(text.includes('not measured values for a particular facility'));
});
