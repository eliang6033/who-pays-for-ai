import {useEffect, useReducer, useRef, useState} from 'react';
import CinemaArt from './CinemaArt.jsx';
import {CiteText} from './Story.jsx';
import World from './World.jsx';
import {Results} from './Simulator.jsx';
import {CHAPTERS, FUNDING, FILM_DURATION, filmBeats, initialCinema, cinemaReducer} from './cinema.js';
import {DEFAULT, simulate, format} from './simulation.js';
import './cinema.css';

function useReducedMotion(){
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const q=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(q.matches);q.addEventListener('change',change);return()=>q.removeEventListener('change',change)},[]);
 return reduced;
}

function Film({chapter,option,choices,dispatch,reduced}) {
 const [time,setTime]=useState(0),[playing,setPlaying]=useState(!reduced);
 const elapsed=useRef(0),last=useRef(null);
 const beats=filmBeats(chapter.key,option,choices.costs);
 const beat=Math.min(4,Math.floor(time/2500));
 useEffect(()=>{if(reduced)setPlaying(false)},[reduced]);
 useEffect(()=>{
  const onVisibility=()=>{if(document.hidden)setPlaying(false)};
  document.addEventListener('visibilitychange',onVisibility);
  return()=>document.removeEventListener('visibilitychange',onVisibility);
 },[]);
 useEffect(()=>{
  if(!playing){last.current=null;return;}
  let id;
  const tick=now=>{
   if(last.current!==null)elapsed.current=Math.min(FILM_DURATION,elapsed.current+now-last.current);
   last.current=now;setTime(elapsed.current);
   if(elapsed.current>=FILM_DURATION){dispatch({type:'FILM_END'});return;}
   id=requestAnimationFrame(tick);
  };
  id=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(id);last.current=null;};
 },[playing,dispatch]);
 function replay(){elapsed.current=0;last.current=null;setTime(0);setPlaying(!reduced);}
 function nextScene(){const t=(beat+1)*2500;elapsed.current=t;last.current=null;if(t>=FILM_DURATION)dispatch({type:'FILM_END'});else setTime(t);}
 return <div className={`cin-film ${playing?'is-playing':'is-paused'} ${reduced?'is-reduced':''}`}>
   <div className="cin-film-top"><span className="cin-eyebrow"><i/> INSIDE THE CHOICE</span><span>{chapter.name} / Scene {beat+1} of 5</span></div>
   <div className="cin-narration" aria-live="polite" aria-atomic="true"><div className="cin-scene-number">0{beat+1}</div><div key={beat} className="cin-caption"><h2>{beats[beat][0]}</h2><p>{beats[beat][1]}</p></div></div>
   <div className="cin-screen">
    {chapter.key!=='community'&&<div className={`cin-establish ${beat===0?'visible':''}`}><World choices={{...choices,community:'lower'}}/><span>APPROACHING THE DATA CENTER</span></div>}
    <div className={`cin-closeup ${beat===0&&chapter.key!=='community'?'waiting':''}`}><CinemaArt kind={chapter.key} option={option} beat={beat} costs={choices.costs} paused={!playing||reduced}/></div>
    <div className="cin-frame-mark frame-tl"/><div className="cin-frame-mark frame-tr"/><div className="cin-frame-mark frame-bl"/><div className="cin-frame-mark frame-br"/>
    <div className="cin-screen-note"><span>ILLUSTRATIVE ANIMATION</span><span>{reduced?'REDUCED MOTION · MANUAL SCENES':'12.5 SECOND EXPLAINER'}</span></div>
   </div>
   <div className="cin-film-citation"><CiteText text={beats[beat][2]} inheritColor/></div>
   <div className="cin-film-controls"><div className="cin-playback"><button onClick={()=>setPlaying(p=>!p)} aria-label={playing?'Pause animation':'Play animation'}>{playing?'Ⅱ Pause':'▷ Play'}</button><button onClick={replay}>↺ Restart</button>{(!playing||reduced)&&<button onClick={nextScene}>Next scene →</button>}</div><span className="cin-time">{(time/1000).toFixed(1)} / 12.5 s</span><button className="cin-skip" onClick={()=>dispatch({type:'FILM_END'})}>Skip to takeaway →</button></div>
   <div className="cin-timeline" role="progressbar" aria-label="Animation progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(time/FILM_DURATION*100)}>{beats.map((_,i)=><span key={i}><i style={{transform:`scaleX(${Math.min(1,Math.max(0,(time-i*2500)/2500))})`}}/></span>)}</div>
 </div>;
}

function Outcome({state}) {
 const key=CHAPTERS[state.step].key, value=state.choices[key];
 if(key==='energy')return <div className="cin-outcome"><span className="cin-eyebrow">YOUR CHOICE / MODEL ASSUMPTION</span><strong>{value==='cleaner'?'50':'400'}<small>kg CO₂e / MWh</small></strong><p>{value==='cleaner'?'A lower emissions factor changes the carbon calculation. It does not reduce the electricity demand.':'This higher emissions factor increases modeled carbon for each unit of electricity. A real grid rate depends on location and year.'}</p><div className="cin-summary-pills"><span>Same computing work</span><span>{value==='cleaner'?'Lower assumed emissions':'Higher assumed emissions'}</span></div></div>;
 if(key==='cooling')return <div className="cin-outcome"><span className="cin-eyebrow">YOUR CHOICE / MODEL ASSUMPTIONS</span><div className="cin-stat-pair"><strong>{value==='dry'?'0.02':'1.20'}<small>L water / IT kWh</small></strong><strong>{value==='dry'?'1.35':'1.20'}<small>facility kWh / IT kWh</small></strong></div><p>{value==='dry'?'Less onsite water, more electricity under these assumptions. As the final draft explains, water used to generate electricity is excluded.':'More onsite water, less electricity under these assumptions. Siddik and the Viborillas interviews explain why local water availability matters.'}</p><div className="cin-summary-pills"><span>Onsite water only</span><span>Weather not modeled</span></div></div>;
 const r=simulate({...DEFAULT,...state.choices});
 return <div className="cin-outcome"><span className="cin-eyebrow">YOUR HOUSEHOLD / CALCULATED EXAMPLE</span><strong>{format(r.totalBurden,2)}%<small>of annual income spent on energy</small></strong><p>Your agreement adds ${format(r.extraAnnualUSD,0)} per year to the assumed $1,800 energy bill. The charge funds the grid upgrade; it does not estimate changes in electricity prices.</p><div className="cin-summary-pills"><span>Same physical footprint</span><span>Different ability to pay</span></div></div>;
}

export default function CinematicSimulator({onResearch}) {
 const [state,dispatch]=useReducer(cinemaReducer,initialCinema),reduced=useReducedMotion();
 const title=useRef(null),detailTitle=useRef(null),cardRefs=useRef({}),lastOpen=useRef(null);
 const chapter=CHAPTERS[state.step], selected=chapter.options.find(o=>o.id===state.pending), chosen=state.choices[chapter.key];
 useEffect(()=>{title.current?.focus({preventScroll:true});document.getElementById('experiment')?.scrollIntoView({behavior:'instant',block:'start'});},[state.phase,state.step]);
 useEffect(()=>{if(state.pending){lastOpen.current=state.pending;detailTitle.current?.focus({preventScroll:true});}else if(lastOpen.current&&state.phase==='choice'){cardRefs.current[lastOpen.current]?.focus({preventScroll:true});}},[state.pending,state.phase]);
 useEffect(()=>{if(!state.pending)return;const close=e=>{if(e.key==='Escape')dispatch({type:'CLOSE'})};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[state.pending]);
 if(state.phase==='results')return <section id="experiment" className="simulator-shell cinema-results"><Results state={state} dispatch={dispatch} onResearch={onResearch}/></section>;
 return <section id="experiment" className={`cinema-shell cin-phase-${state.phase}`} aria-label="Cinematic data center simulator">
  {state.phase==='intro'?<div className="cin-intro">
   <div className="cin-intro-copy"><div className="cin-eyebrow"><span className="cin-live-dot"/> A FINAL-DRAFT RESEARCH STORY YOU DIRECT</div><h1 ref={title} tabIndex={-1}>The cloud<br/>has a <em>footprint.</em></h1><p>Change how a data center runs. Change who pays.<br/>Experience the leverage points behind AI’s costs.</p><button className="cin-primary" onClick={()=>dispatch({type:'BEGIN'})}>Begin the story <span>↗</span></button><div className="cin-intro-meta"><span>3 chapters</span><span>Choose · watch · reflect</span><span>About 3 minutes</span></div></div>
   <div className="cin-intro-world"><World choices={{energy:'cleaner',cooling:'evaporative',community:'lower',costs:'shared'}}/><span className="cin-world-label">ONE FICTIONAL PLACE. CONNECTED CONSEQUENCES.</span></div>
   <div className="cin-intro-bottom"><span>Electricity. Water. The household bill.</span><button onClick={()=>onResearch('research')}>Read the full research ↗</button><p>A teaching simulation. Every model input is visible.</p></div>
  </div>:<>
   <div className="cin-chapter-nav"><button className="cin-back" onClick={()=>dispatch({type:state.phase==='choice'?'BACK':'CHANGE'})}>{state.phase==='choice'?'← Back':'← Change choice'}</button><ol aria-label="Story chapters">{CHAPTERS.map((c,i)=><li key={c.key} className={i===state.step?'current':i<state.step?'done':''} aria-current={i===state.step?'step':undefined}><span>{i<state.step?'✓':`0${i+1}`}</span>{c.name}</li>)}</ol><span className="cin-preview-label">LOCAL PREVIEW</span></div>
   {state.phase==='choice'?<>
    <div className="cin-heading"><span className="cin-eyebrow">CHAPTER 0{state.step+1} / YOUR DECISION</span><h1 ref={title} tabIndex={-1}>{chapter.title}</h1><p>{chapter.subtitle}</p></div>
    {!selected?<><p className="cin-instruction">Open a card to see how it works. Your choice is confirmed inside.</p><div className="cin-choice-grid">{chapter.options.map((o,i)=><button ref={el=>cardRefs.current[o.id]=el} key={o.id} className={`cin-option option-${o.id}`} onClick={()=>dispatch({type:'OPEN',value:o.id})} aria-label={`Explore ${o.label}`}><div className="cin-card-image"><CinemaArt kind={chapter.key} option={o.id} mini paused={reduced}/><span className="cin-option-number">0{i+1}</span><span className="cin-open-icon">↗</span></div><div className="cin-card-copy"><span className="cin-eyebrow">{o.tag}</span><h2>{o.label}</h2><p>{o.tradeoff}</p><div className="cin-card-footer"><span>Explore this choice</span><span>HOW IT WORKS + TRADEOFF →</span></div></div></button>)}</div></>:
    <article className={`cin-detail detail-${selected.id}`}><div className="cin-detail-visual"><CinemaArt kind={chapter.key} option={selected.id} mini paused={reduced} costs={state.funding||'company'}/><div className="cin-detail-visual-caption"><span>INSIDE THE SYSTEM</span><p>{selected.tradeoff}</p></div></div><div className="cin-detail-copy"><button className="cin-text-button" onClick={()=>dispatch({type:'CLOSE'})}>← Compare both cards</button><span className="cin-eyebrow">{selected.tag}</span><h2 ref={detailTitle} tabIndex={-1}>{selected.label}</h2><h3>How it works</h3><p>{selected.detail}</p><h3>The tradeoff</h3><p>{selected.tradeoff} {selected.boundary}</p>
    {chapter.key==='community'&&<fieldset className="cin-funding"><legend>Who pays for the grid upgrade?</legend><p>Test a leverage point: change who funds the upgrade. All charges are assumed annual values.</p><div>{FUNDING.map(f=><label key={f.id} className={state.funding===f.id?'checked':''}><input type="radio" name="funding" value={f.id} checked={state.funding===f.id} onChange={()=>dispatch({type:'FUND',value:f.id})}/><span>{f.label}<small>{f.note}</small></span></label>)}</div></fieldset>}
    <button className="cin-source" onClick={()=>onResearch(`source-${selected.sourceId}`)}>{selected.source} ↗</button><button className="cin-primary" disabled={chapter.key==='community'&&!state.funding} onClick={()=>dispatch({type:'CONFIRM'})}>Choose {selected.label.toLowerCase()} <span>▷</span></button><p className="cin-watch-hint">{chapter.key==='community'&&!state.funding?'Choose a funding agreement to continue.':reduced?'Continue through five scenes at your own pace.':'Then watch a 12.5-second journey through your choice.'}</p></div></article>}
    <div className="cin-bottom-note"><span>RESEARCH → SIMULATION</span><p>Based on the final draft and its 13 sources. Research supports the relationships; model inputs remain assumptions.</p><button onClick={()=>onResearch('methods')}>See model inputs ↗</button></div>
   </>:state.phase==='film'?<><h1 className="cin-sr-only" tabIndex={-1} ref={title}>{chapter.name} animation</h1><Film chapter={chapter} option={chosen} choices={state.choices} dispatch={dispatch} reduced={reduced}/></>:
   <div className="cin-recap"><div className="cin-recap-heading"><span className="cin-eyebrow">CHAPTER 0{state.step+1} / THE TAKEAWAY</span><h1 tabIndex={-1} ref={title}>{chapter.options.find(o=>o.id===chosen).label}</h1></div><div className="cin-recap-grid"><div className="cin-recap-art"><CinemaArt kind={chapter.key} option={chosen} costs={state.choices.costs} paused={reduced}/><button className="cin-rewatch" onClick={()=>dispatch({type:'REWATCH'})}>↺ Watch the sequence again</button></div><Outcome state={state}/></div><div className="cin-recap-actions"><button className="cin-text-button" onClick={()=>dispatch({type:'CHANGE'})}>Explore the other choice</button><button className="cin-primary" onClick={()=>dispatch({type:'NEXT'})}>{state.step<2?`Continue to ${CHAPTERS[state.step+1].name.toLowerCase()}`:'Reveal my impact report'} <span>→</span></button></div></div>}
  </>}
 </section>;
}
