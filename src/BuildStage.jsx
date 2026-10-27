import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import World from './World.jsx';
import {ResearchNote} from './Story.jsx';
import {scenePoint} from './placement.js';
import './builder.css';

// Each part is a live diagram, shared by the tray and the object being carried.
export function PartArt({kind, value}) {
 const water=value==='evaporative';
 return <svg className={`part-art art-${value}`} viewBox="0 0 180 128" aria-hidden="true">
  <ellipse cx="90" cy="109" rx="70" ry="12" fill="currentColor" opacity=".08"/>
  {kind==='community'?<>
   <path d="m25 55 35-25 35 25v50H25Z" fill="#426e5d" stroke="#b5cfad" strokeWidth="2"/><path d="m20 56 40-30 40 30" fill="none" stroke="#dbe8c3" strokeWidth="5" strokeLinejoin="round"/><path d="M42 70h13v15H42m15 20V83h15v22" fill="#e1cf91"/>
   <g fill="#a6cfb6"><circle cx="114" cy="62" r="8"/><path d="M102 96V83a12 12 0 0 1 24 0v13Z"/><circle cx="140" cy="70" r="6"/><path d="M131 96V86a9 9 0 0 1 18 0v10Z"/></g>
   {Array.from({length:value==='lower'?3:10},(_,i)=><rect className="budget-token" key={i} x={104+(i%5)*10} y={44-Math.floor(i/5)*10} width="7" height="7" rx="2" fill="#dfcc8a" style={{animationDelay:`${i*.09}s`}}/>)}
  </>:kind==='energy'?(value==='cleaner'?<>
   <path d="M66 104V43M119 102V60" stroke="#a8c8ae" strokeWidth="5"/><g transform="translate(66 43)"><g className="part-wind">{[0,120,240].map(a=><path key={a} transform={`rotate(${a})`} d="M0 0-3-34Q9-26 3-4Z" fill="#d8eabb"/>)}<circle r="5" fill="#f1e7bc"/></g></g>
   <g transform="translate(119 60)"><g className="part-wind slow">{[0,120,240].map(a=><path key={a} transform={`rotate(${a})`} d="M0 0-2-25Q7-21 3-3Z" fill="#a7ccb5"/>)}</g></g><path d="m87 101 25-16 38 13-24 17Z" fill="#346970" stroke="#9bd3cb"/><path d="m101 92 37 13m-13-16-25 16" stroke="#9bd3cb"/>
  </>:<>
   <path d="m59 108 28-85 28 85M65 87h44M69 72h36M65 50h44M61 36h52M87 23v85M69 72l40 15M105 72 65 87" fill="none" stroke="#d2c7a5" strokeWidth="3"/>
   <path d="M13 57q25-6 48-21m52 0q26 21 51 21M13 75q26-7 52-25m44 0q28 25 55 25" fill="none" stroke="#aaae8e" strokeWidth="2"/><path className="part-flow" d="M12 57q25-6 49-21m52 0q26 21 51 21" fill="none" stroke="#ffda8b" strokeWidth="3" strokeDasharray="5 18"/><path d="m85 50-10 20h12l-5 20 18-27H88l6-13Z" fill="#edca7c"/>
  </>):kind==='cooling'?<>
   <path d="m47 44 25-14 61 30-25 15Z" fill="#71988a" stroke="#b6d7c6"/><path d="M47 44v52l61 30V75Z" fill="#365f54" stroke="#8fb6a3"/><path d="m108 75 25-15v50l-25 16Z" fill="#24483f" stroke="#8fb6a3"/>
   {water?<><path d="M20 101V66q0-8 8-8h27v33h27V56h24" fill="none" stroke="#2f7a87" strokeWidth="9"/><path className="part-flow" d="M20 101V66q0-8 8-8h27v33h27V56h24" fill="none" stroke="#a2eced" strokeWidth="3" strokeDasharray="4 9"/><path d="M24 22q-20 23 0 25 20-2 0-25" fill="#78d5dd"/><g className="part-steam" fill="none" stroke="#b4e5dc" strokeWidth="2"><path d="M87 28q-10-10 0-20m15 24q-10-10 0-20"/></g></>:<>
   {[0,1].map(i=><g key={i} transform={`translate(${64+i*27} ${68+i*13})`}><circle r="15" fill="#182f2b" stroke="#a7cfc3"/><g className="part-fan"><path d="M0-2C-15-16-17 5-3 3C-16 17 5 17 3 3C17 16 17-5 3-3C16-17-5-17-3-3Z" fill="#bbd8c3"/></g><circle r="3" fill="#e1edcd"/></g>)}
   <g className="part-air" fill="none" stroke="#c2e7cc" strokeWidth="2"><path d="M18 38h27q14 0 10-9M17 48h21M124 29h28q14 0 8-9M135 40h30"/></g>
   </>}
  </>:<>
   <path d="M20 85V38h36v47M24 46h6m7 0h6m-19 12h6m7 0h6m-19 12h6m7 0h6" fill="#4f6d6a" stroke="#c5d1c0" strokeWidth="2"/><path d="m121 54 20-16 21 16v31h-41Z" fill="#526e55" stroke="#ced4b2" strokeWidth="2"/>
   <path d="M81 101V73h23v28Z" fill="#7d6d91" stroke="#dfcaef"/><path d="m91 76-5 12h8l-4 10 11-15h-9l3-7Z" fill="#ead9f4"/>
   {value!=='residents'&&<path className="part-flow" d="M40 91q0 20 38 10" stroke="#d6bbed" fill="none" strokeWidth="3" strokeDasharray="4 8"/>}
   {value!=='company'&&<path className="part-flow" d="M141 91q0 20-34 10" stroke="#d6bbed" fill="none" strokeWidth="3" strokeDasharray="4 8"/>}
   <g fill="#ead3a0">{(value==='shared'?[55,125]:[value==='company'?55:125]).map(x=><g key={x}><circle cx={x} cy="23" r="12"/><text x={x} y="28" textAnchor="middle" fill="#5e5235" fontSize="16">$</text></g>)}</g>
  </>}
 </svg>;
}
const labels={community:'Place a household in the neighborhood',energy:'Connect a supply to the data center',cooling:'Install cooling at the data center',costs:'Deliver a funding agreement'};
const defaults={community:{x:28,y:62},energy:{x:28,y:30},cooling:{x:70,y:58},costs:{x:50,y:42}};
export default function BuildStage({step, index, choices, dispatch, onResearch}) {
 const selected=step.options.find(o=>o.id===choices[step.key]);
 const [armed,setArmed]=useState(null),[drag,setDrag]=useState(null),[message,setMessage]=useState(''),[positions,setPositions]=useState({}),[stamp,setStamp]=useState(0);
 const stage=useRef(null), gesture=useRef(null), suppressClick=useRef(false), target=useRef(null);
 const point=positions[step.key]||defaults[step.key];
 useEffect(()=>{setArmed(null);setDrag(null);setMessage('');gesture.current=null;},[step.key]);
 function place(value,p){dispatch({type:'CHOOSE',value});setPositions(old=>({...old,[step.key]:p}));setArmed(null);setStamp(n=>n+1);setMessage(`${step.options.find(o=>o.id===value).label} installed. You can move it or swap it before continuing.`);}
 function start(e,value){if(e.button!==0)return; e.currentTarget.setPointerCapture(e.pointerId);gesture.current={id:e.pointerId,value,x:e.clientX,y:e.clientY,moved:false};setArmed(value);setMessage('');}
 function move(e){const g=gesture.current;if(!g||g.id!==e.pointerId)return;if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>5)g.moved=true;if(g.moved){const p=scenePoint(e.clientX,e.clientY,stage.current.getBoundingClientRect());setDrag({value:g.value,x:e.clientX,y:e.clientY,over:!!p});}}
 function end(e){const g=gesture.current;if(!g||g.id!==e.pointerId)return;gesture.current=null;setDrag(null);if(g.moved){suppressClick.current=true;setTimeout(()=>{suppressClick.current=false;},0);const p=scenePoint(e.clientX,e.clientY,stage.current.getBoundingClientRect());if(p)place(g.value,p);else setMessage('Outside the site. Your previous plan is unchanged. Drag onto the illuminated site to install.');}}
 function cancel(){gesture.current=null;setDrag(null);setArmed(null);setMessage('Move cancelled. Your plan is unchanged.');}
 function clickPart(value){if(suppressClick.current){suppressClick.current=false;return;}setArmed(value);setMessage(`${step.options.find(o=>o.id===value).label} ready. Click the site to place it, or press Enter on the installation target.`);requestAnimationFrame(()=>target.current?.focus({preventScroll:true}));}
 useEffect(()=>{function esc(e){if(e.key==='Escape'){gesture.current=null;setDrag(null);setArmed(null);setMessage('Move cancelled. Your plan is unchanged.');}}window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc);},[]);
 const events=value=>({onPointerDown:e=>start(e,value),onPointerMove:move,onPointerUp:end,onPointerCancel:cancel,onClick:()=>clickPart(value)});
 return <div className={`build-workshop workshop-${step.key}`}>
  <div className="workshop-heading"><div><span className="sim-kicker">Decision 0{index+1} / {step.name}</span><h1>{step.title}</h1></div><p>{step.lead}</p></div>
  <div className="workshop-layout">
   <div className={`installation-site ${armed?'is-armed':''} ${drag?.over?'drag-over':''}`} ref={stage} onClick={e=>{if(armed&&!e.target.closest('button')){const p=scenePoint(e.clientX,e.clientY,stage.current.getBoundingClientRect());if(p)place(armed,p);}}}>
    <div className="site-toolbar"><span><i className="status-light"/> LIVE BUILD SITE</span><span>10 MW · FICTIONAL SCENARIO</span></div>
    <World choices={choices} focus={step.key}/>
    <div className="site-blueprint" aria-hidden="true"/>
    <button className="installation-target" ref={target} type="button" disabled={!armed} onClick={()=>armed&&place(armed,defaults[step.key])}><span>{drag?.over?'↓':armed?'+':'◎'}</span>{drag?.over?'Release to install':armed?'Install here':labels[step.key]}</button>
    {selected&&<button key={`${step.key}-${stamp}`} className="installed-part" style={{left:`${point.x}%`,top:`${point.y}%`}} aria-label={`Move installed ${selected.label}`} {...events(selected.id)}><PartArt kind={step.key} value={selected.id}/><span>✓ {selected.label}<small>Drag to reposition</small></span></button>}
    <div className="site-hint">{armed?'Place anywhere on the site · Esc to cancel':'Drag a part onto the site · Move it again to arrange your scene'}</div>
   </div>
   <aside className="parts-dock" aria-label={`${step.name} parts`}><div className="dock-heading"><span className="sim-kicker">Your parts tray</span><p>Pick it up. Put it to work.</p><small>Drag onto the site, or select a part and then tap “Install here”.</small></div>
    <div className="parts-grid">{step.options.map(option=><button key={option.id} type="button" className={`build-part ${selected?.id===option.id?'is-installed':''} ${armed===option.id?'is-held':''}`} aria-label={`Pick up ${option.label}`} aria-pressed={armed===option.id} {...events(option.id)}><div className="part-picture"><span className="part-handle">⠿</span><PartArt kind={step.key} value={option.id}/><span className="part-state">{selected?.id===option.id?'INSTALLED':armed===option.id?'READY TO PLACE':'DRAG TO INSTALL'}</span></div><strong>{option.label}</strong><small>{option.short}</small></button>)}</div>
    <div className="dock-note">{step.key==='community'?'The same homes. Different budgets. Each gold block represents $10,000 of assumed annual income.':step.key==='cooling'?'Watch the equipment: flowing water or spinning fans. The model keeps direct water separate from electricity use.':step.key==='energy'?'Follow the moving electricity route. Wind and solar are symbols for a lower carbon supply, not a modeled generation mix.':'Follow the purple payments from the company, households, or both to the grid upgrade.'}</div>
   </aside>
  </div>
  <div className="workshop-feedback" role="status" aria-live="polite">{message||(selected?`${selected.label} is installed. Drag it to reposition, or swap in another part.`:'No part installed yet. Try dragging one from the tray into the scene.')}</div>
  <div className="workshop-bottom"><div className="placement-explanation"><span className="sim-kicker">{selected?'Your choice, explained':'Build first. Discover the consequences.'}</span><h2>{selected?selected.title:labels[step.key]}</h2><p>{selected?selected.description:step.context}</p><button className="sim-link" onClick={()=>onResearch(`source-${step.source}`)}>Research behind this decision [{step.source}] ↗</button></div><div className="decision-navigation"><button className="sim-back" onClick={()=>dispatch({type:'BACK'})} aria-label={index===0?'Back to briefing':'Previous decision'}>←</button><button className="sim-next" disabled={!selected||!!drag} onClick={()=>dispatch({type:'NEXT'})}>{index===3?'Run the year':'Keep building'} <span>→</span></button></div></div>
  {selected&&<ResearchNote kind={step.key} onResearch={onResearch}/>}
  {drag&&createPortal(<div className={`carried-part ${drag.over?'can-drop':''}`} style={{left:drag.x,top:drag.y}}><PartArt kind={step.key} value={drag.value}/><span>{drag.over?'Release to install':'Move onto the site'}</span></div>,document.body)}
 </div>;
}
