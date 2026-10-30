import research from './research.json';
import {simulate, format} from './simulation.js';
import './story.css';

export function MlaText({text}) {
 return text.split(/(\*[^*]+\*)/g).map((part,i)=>part.startsWith('*')?<em key={i}>{part.slice(1,-1)}</em>:part);
}
export function CiteText({text,inheritColor=false}) {
 return text.split(/(\[\d+\])/g).map((part,i)=>/^\[\d+\]$/.test(part)?<a key={i} className="citation" style={inheritColor?{color:"inherit"}:undefined} href={`#source-${part.slice(1,-1)}`} aria-label={`Reference ${part.slice(1,-1)}`}>{part}</a>:part);
}
const notes={
 community:{section:'households',paragraph:0,heading:'Why compare the same bill?',bridge:'A household’s income changes what a bill means, not how much water the data center uses.'},
 energy:{section:'electricity',paragraph:1,heading:'Efficiency does not settle the demand question.',bridge:'The final draft compares historical efficiency gains with newer demand projections. Here, the workload stays fixed so you can test the power source.'},
 cooling:{section:'water',paragraph:0,heading:'Less water is only one side of the tradeoff.',bridge:'The final draft separates direct water from electricity demand. Local climate and equipment design matter beyond this simplified site.'},
 costs:{section:'households',paragraph:3,heading:'Who pays is a rule we can change.',bridge:'A funding agreement changes the distribution of costs. Its reach matters: a real tariff protects only the customers and investments it covers.'}
};
export function ResearchNote({kind,onResearch}) {
 const note=notes[kind],section=research.sections.find(s=>s.id===note.section);
 return <aside className="decision-reading" aria-label="Research connected to your decision"><div><span className="story-label">From the paper / {section.title}</span><h2>{note.heading}</h2><p>{note.bridge}</p></div><details><summary>Read the argument behind this choice</summary><p><CiteText text={section.paragraphs[note.paragraph]}/></p><button className="sim-link" onClick={()=>onResearch(note.section)}>Continue this chapter ↗</button></details></aside>;
}
export function ResearchLead({onResearch}) {
 return <div className="research-prologue"><div><span className="story-label">A research question you can test</span><h2>{research.question}</h2></div><div><p>{research.thesis}</p><div className="prologue-pair"><span><b>01 / Engineering</b>Power source & cooling</span><span><b>02 / Policy</b>Who funds the upgrade</span></div><button className="sim-link" onClick={()=>onResearch('physical')}>Read the introduction ↗</button></div></div>;
}
export function CaseStudy({onResearch}) {
 return <aside className="reported-case"><div className="story-label">Reported experience / Ohio, 2026</div><h3>A household behind the bill.</h3><p>The Kasnik household’s reported electricity bills offer a real-world affordability question alongside the fictional model.</p><div className="case-figures"><span><strong>&gt; $500</strong>December bill</span><span><strong>&gt; $600</strong>February bill</span><span><strong>+60%</strong>December–March spending, year over year</span></div><p className="case-boundary">Nearby facility: cryptocurrency mining. These figures do not establish its causal share of the increase, and they are not simulation inputs.</p><button onClick={()=>onResearch('source-6')} className="text-link">Read Michelle Jarboe’s reporting [6] ↗</button></aside>;
}
export function ModelTakeaways({onResearch}) {
 const base={community:'lower',energy:'grid',cooling:'evaporative',costs:'residents'};
 const a=simulate(base),clean=simulate({...base,energy:'cleaner'}),dry=simulate({...base,cooling:'dry'}),higher=simulate({...base,community:'higher'});
 return <section className="paper-conclusions"><span className="story-label">Your experiment, back to the question</span><h2>Three comparisons. Two responsibilities.</h2><p className="conclusions-intro">These are the paper’s controlled comparisons, not three additional measurements of your selected run. Change one setting and hold the others fixed.</p><div className="conclusion-grid"><article><span>01 / Power source</span><strong>−{format((1-clean.carbonTonnes/a.carbonTonnes)*100,1)}%</strong><h3>Electricity emissions</h3><p>Lower carbon supply versus the illustrative grid. Electricity demand is unchanged.</p></article><article><span>02 / Cooling</span><strong>−{format((1-dry.waterLiters/a.waterLiters)*100,1)}%</strong><h3>Direct water</h3><p>Dry versus evaporative cooling, with {format((dry.electricityMWh/a.electricityMWh-1)*100,1)}% more facility electricity under our assumptions.</p></article><article><span>03 / Residents pay</span><strong>{format(a.totalBurden,2)}% <small>vs.</small> {format(higher.totalBurden,2)}%</strong><h3>Household energy burden</h3><p>Lower and higher incomes carry the same ${format(a.extraAnnualUSD,0)} annual upgrade charge differently.</p></article></div><div className="result-boundary"><b>The missing connection</b><p>The model does not turn the facility’s electricity demand into household electricity prices. Extra power for dry cooling never becomes an extra residential energy charge here. Only the upgrade agreement changes the added household payment.</p></div><p>{research.thesis}</p><button className="sim-link" onClick={()=>onResearch('limits')}>Read the results and limitations ↗</button><button className="sim-link" onClick={()=>onResearch('conclusion')}>Return to the conclusion ↗</button></section>;
}
export function ReadingGuide() {
 return <div className="reading-guide"><div><span className="story-label">The argument</span><h2>Two choices.<br/>One shared responsibility.</h2></div><div className="reading-pillars"><article><span>01 / Resource use</span><h3>How does it run?</h3><p>Trace electricity demand, cooling water, and operational emissions.</p></article><article><span>02 / Cost sharing</span><h3>Who carries the cost?</h3><p>Connect household budgets, resident experiences, and the Ohio tariff’s infrastructure rules.</p></article></div></div>;
}
