import {useState} from 'react';
function Home({x,y}) {
 return <g transform={`translate(${x} ${y})`}><path d="m0 0 32-18 36 20-32 19Z" fill="#7c8170"/><path d="M0 0v35l36 21V21Z" fill="#b5b9a1"/><path d="m36 21 32-19v35L36 56Z" fill="#748f7f"/><path d="m10 15 10 6v16l-10-6Z" fill="#f1dc9a"/><path d="m44 24 13-7v14l-13 7Z" fill="#c5dcac"/></g>;
}
function Tree({x,y}){return <g transform={`translate(${x} ${y})`}><path d="M0 0v24" stroke="#526c59" strokeWidth="3"/><ellipse rx="12" ry="21" fill="#426e59"/><path d="M0-18V16" stroke="#6c9471" strokeWidth="1"/></g>}

function Turbine({x,y,height=70,delay=0}) {
 return <g transform={`translate(${x} ${y})`} style={{'--build-delay':`${delay}s`}}>
  <ellipse className="build-foundation" cx="0" cy={height} rx="15" ry="7" fill="#8eae86" stroke="#d6eeb2"/>
  <ellipse className="construction-ring" cx="0" cy={height} rx="25" ry="12" fill="none" stroke="#c9f596"/>
  <path className="tower-section tower-lower" pathLength="1" d={`M0 ${height}V${height*.48}`} stroke="#adcbb4" strokeWidth="7"/>
  <path className="tower-section tower-upper" pathLength="1" d={`M0 ${height*.48}V0`} stroke="#e0ead0" strokeWidth="5"/>
  <g className="nacelle"><path d="m-9-4 17-4 7 6-17 5Z" fill="#f4f3da"/><path d="M-9-4v8l7 4V3Z" fill="#89ae97"/></g>
  <g className="wind-rotor assembled-rotor">
   {[0,120,240].map((angle,i)=><g key={angle} transform={`rotate(${angle})`}><path className="turbine-blade" style={{'--blade-delay':`${1.3+i*.25+delay}s`}} d="M0 0 0-48Q8-34 3-5Z" fill="#e4efc9" stroke="#b5d4a4" strokeWidth=".6"/></g>)}
   <circle className="rotor-hub" r="5" fill="#f3f5d7"/>
  </g>
 </g>;
}
function SolarArray() {
 return <g transform="translate(266 219)">
  <path d="m-4 2 60-35 55 31-60 35Z" fill="#234f50" stroke="#4e8a7c"/>
  {[0,1,2].map(col=>[0,1].map(row=><g key={`${col}-${row}`} transform={`translate(${col*18+row*25} ${-col*10.6+row*14.5})`}><g className="solar-tile" style={{'--tile-delay':`${1.15+(col*2+row)*.12}s`}}><path d="m0 0 17-10 23 13-17 10Z" fill="#397e88" stroke="#a1e2d6" strokeWidth=".8"/><path d="m6-3 23 13M12-7l23 13M11 6l17-10" stroke="#8ed7d0" strokeWidth=".4"/></g></g>))}
 </g>;
}
function CoolingPlant({dry,cooling}) {
 return dry?<g transform="translate(540 349)">{[0,1,2].map(i=><g key={i} transform={`translate(${i*36} ${-i*21})`} style={{'--unit-delay':`${i*.28}s`}}>
  <g className="cooling-unit"><path d="m0 0 29-17 24 14-29 17Z" fill="#c0cdb0"/><path d="M0 0v28l24 14V14Z" fill="#769983"/><path d="m24 14 29-17v28L24 42Z" fill="#4e7865"/><path d="m29 22 18-10m-18 17 18-10" stroke="#203f35" strokeWidth="2"/></g>
  <g transform="translate(26 -1)"><g className="fan-install"><g className="fan-rotor"><ellipse rx="10" ry="6" fill="#233e34"/><path d="M-8 0H8M0-5V5" stroke="#d4ecb9" strokeWidth="2"/></g></g></g>
  <path className="air-stream" d="m5-14q-10-10 0-20m14 10q-10-10 0-20" stroke="#d5f2c1" fill="none" strokeWidth="1.5"/>
 </g>)}</g>:<g transform="translate(562 347)">{[0,1].map(i=><g key={i} transform={`translate(${i*49} ${-i*27})`} style={{'--unit-delay':`${i*.35}s`}}>
  <ellipse className="build-foundation" cx="17" cy="2" rx="20" ry="10" fill="#47796d" stroke="#9dd5c5"/>
  <g className="tower-shell"><path d="M0 0q8-23 2-43h30q-6 20 2 43Z" fill="#8bb9ac"/><path d="M7-3q5-20 1-36m18 36q-5-20-1-36" fill="none" stroke="#b3d4b8" strokeWidth="2"/><ellipse cx="17" cy="0" rx="17" ry="8" fill="#5c8d82"/></g>
  <ellipse className="tower-cap" cx="17" cy="-43" rx="15" ry="7" fill="#345f57" stroke="#b6d7bf"/>
  <g className="cooling-vapor"><ellipse cx="18" cy="-58" rx="11" ry="14" fill="#c6e8d4" opacity=".4"/><ellipse cx="23" cy="-78" rx="16" ry="14" fill="#b9d7c2" opacity=".2"/></g>
 </g>)}<path className={`water-route ${cooling?'active-route':''}`} d="m-320 66 74-43 70 40 125-70" stroke="#7accca" strokeWidth="5" strokeDasharray="8 9" fill="none"/></g>;
}

export default function World({choices,focus='overview',finished=false}) {
 const [replay,setReplay]=useState(0);
 const selected=Boolean(choices[focus]);
 const sequenceKey=`${focus}-${choices[focus]||'empty'}-${replay}`;
 const cleaner=choices.energy==='cleaner', dry=choices.cooling==='dry', funded=Boolean(choices.costs), cooling=Boolean(choices.cooling);
 return <div className={`world-view world-${focus} ${cleaner?'clean-supply':''} ${dry?'dry-system':''} ${finished?'world-finished':''} ${selected?'construction-active':''}`}>
 <svg className="world-svg" viewBox="0 0 840 600" role="img" aria-label={`Fictional city diagram. ${choices.energy ? (cleaner?'Wind and solar illustrate a lower carbon electricity supply.':'Transmission pylons illustrate the grid supply.'):'Electricity supply has not been selected.'} ${cooling?(dry?'Fans illustrate dry cooling.':'Water pipes and cooling towers illustrate evaporative cooling.'):'Cooling has not been selected.'} ${funded?'Animated payment paths show '+(choices.costs==='company'?'the company':choices.costs==='residents'?'residents':'both the company and residents')+' funding the grid upgrade.':''} Household income does not change the physical neighborhood.`}>
 <defs><pattern id="world-grid" width="42" height="24" patternUnits="userSpaceOnUse" patternTransform="skewY(-8)"><path d="M42 0H0V24" fill="none" stroke="#779e8e" strokeWidth=".5"/></pattern><linearGradient id="land-face" x2="0" y2="1"><stop stopColor="#426e5b"/><stop offset="1" stopColor="#213f37"/></linearGradient><linearGradient id="water-fill" x2="0" y2="1"><stop stopColor="#4d9e9c"/><stop offset="1" stopColor="#254e51"/></linearGradient><radialGradient id="world-glow"><stop stopColor="#a5d89a" stopOpacity=".16"/><stop offset="1" stopColor="#a5d89a" stopOpacity="0"/></radialGradient></defs>
 <ellipse cx="420" cy="340" rx="370" ry="240" fill="url(#world-glow)"/>
 <g className="world-camera" key={sequenceKey}><g className="floating-city">
 <path d="M40 280 405 72 798 291 427 506Z" fill="#284e40" stroke="#527762"/>
 <path d="M40 280v24l387 226v-24Z" fill="#1d382f"/><path d="M427 506v24l371-215v-24Z" fill="url(#land-face)"/>
 <path d="m41 281 364-208 392 219-369 214Z" fill="url(#world-grid)" opacity=".35"/>
 <path d="m45 344 207 120 43-25-207-120Z" fill="url(#water-fill)"/><path className="river-line" d="m64 346 184 107m-144-95 162 94" stroke="#8dc4bd" strokeWidth="1" strokeDasharray="9 20" opacity=".6"/>
 <path d="m150 228 397 220M266 160l395 218M111 319l400-228M256 404l397-229" stroke="#64816d" strokeWidth="17"/><path d="m150 228 397 220M266 160l395 218M111 319l400-228M256 404l397-229" stroke="#a3b797" strokeWidth=".7" strokeDasharray="5 10" opacity=".5"/>
 <g className={`scene-energy scene-focus ${choices.energy?'is-built':''}`}>
 {cleaner?<g className="clean-buildings"><Turbine x={193} y={157}/><Turbine x={258} y={120} height={64} delay={.28}/><SolarArray/></g>:<g className="grid-buildings"><g transform="translate(189 139)" fill="none" stroke="#b0bda3" strokeWidth="3"><path pathLength="1" d="m0 99 25-99 25 99M7 68h36M3 35h44M4 16h42M25 0v99M3 35l40 33M47 35 7 68"/><path pathLength="1" d="M0 16q29-5 78 14M50 16q50 0 78 16" strokeWidth="1"/></g><g transform="translate(283 170)" fill="none" stroke="#809b81" strokeWidth="2"><path pathLength="1" d="m0 79 19-79 19 79M5 54h28M0 27h38M0 13h38M19 0v79M0 27l33 27M38 27 5 54"/></g><path pathLength="1" d="m189 155q50 30 94 28m-44-28q50 32 82 28" stroke="#9cb398" fill="none" strokeWidth="1"/></g>}
 <path className={`energy-route ${choices.energy?'active-route':''}`} d="m241 251 91 52 66-38" fill="none" stroke={cleaner?'#d4eea2':'#edbf73'} strokeWidth="4" strokeDasharray="8 9"/>
 </g>
 <g className="scene-community scene-focus"><Home x={124} y={291}/><Home x={188} y={327}/><Home x={252} y={365}/><Home x={531} y={166}/><Home x={592} y={202}/><Home x={650} y={235}/><circle cx="229" cy="394" r="7" fill="#bad49b" className="person-marker"/><path d="M229 402v13" stroke="#bad49b" strokeWidth="5" strokeLinecap="round"/></g>
 <g className="scene-center scene-focus" transform="translate(337 201)"><path d="m0 38 117-67 146 83-118 69Z" fill="#c0c5a3"/><path d="m0 38 145 85v100L0 139Z" fill="#4f7966"/><path d="m145 123 118-69v100l-118 69Z" fill="#365b4d"/><path d="m10 39 107-61 133 77-106 62Z" fill="#8c9b7b"/>
 {[0,1,2,3].map(i=><g key={i} transform={`translate(${29+i*26} ${37+i*15})`}><path d="m0 0 61-35 16 9-61 35Z" fill="#284d40"/><path d="M0 0v13l16 9V9Z" fill="#617c62"/><path d="m16 9 61-35v13L16 22Z" fill="#3c5f4c"/><path d="m6 4 61-35" stroke="#c9e6a4" strokeWidth="1" opacity={finished?1:.35}/></g>)}
 {[0,1,2,3,4].map(i=><g className="server-light" key={i} style={{animationDelay:`${i*.3}s`}}><path d={`m${14+i*25} ${82+i*14.5} 14 8v28l-14-8Z`} fill="#d2e9a7" opacity={finished?1:.65}/><path d={`m${14+i*25} ${120+i*14.5} 14 8v3l-14-8Z`} fill="#a5c78b"/></g>)}
 <text transform="matrix(.87 .5 0 1 17 164)" fontSize="11" fill="#e7edd2" letterSpacing="2">YOUR DATA CENTER</text><path d="m156 144 95-55v39l-95 55Z" fill="#23453c"/><path d="m168 149 72-42m-72 54 72-42" stroke="#5f8770" strokeWidth="2"/></g>
 <g className={`scene-cooling scene-focus ${cooling?'is-built':''}`}>
 <CoolingPlant dry={dry} cooling={cooling}/>
 </g>
 {[{x:92,y:263},{x:308,y:150},{x:357,y:123},{x:466,y:135},{x:635,y:355},{x:601,y:391},{x:473,y:451},{x:322,y:426}].map((p,i)=><Tree {...p} key={i}/>)}
 <g className={`scene-costs scene-focus ${funded?'is-built':''}`}>
 <path className="upgrade-line" d="m149 229 163 94 105-60" stroke="#cdb9ed" strokeWidth="2" strokeDasharray="3 6" fill="none"/>
 {funded&&choices.costs!=='residents'&&<g className="company-payment payment-install"><path className="payment-route" d="m430 209-100-56-97 57" stroke="#d4b8ee" fill="none" strokeWidth="3" strokeDasharray="3 11"/><circle cx="350" cy="166" r="12" fill="#d8c2e7"/><text x="350" y="171" textAnchor="middle" fill="#413553" fontSize="14">$</text></g>}
 {funded&&choices.costs!=='company'&&<g className="resident-payment payment-install"><path className="payment-route" d="m213 334-99-55 94-53" stroke="#d4b8ee" fill="none" strokeWidth="3" strokeDasharray="3 11"/><circle cx="144" cy="294" r="12" fill="#d8c2e7"/><text x="144" y="299" textAnchor="middle" fill="#413553" fontSize="14">$</text></g>}
 </g>
 <g className="map-labels" fontSize="10" letterSpacing="1.8" fill="#c3d3bd"><text x="147" y="107">{cleaner?'LOWER CARBON SUPPLY':'SHARED ELECTRICITY GRID'}</text><text x="96" y="437">THE COMMUNITY</text><text x="579" y="419">COOLING SYSTEM</text></g>
 </g></g>
 </svg>
 {focus!=='overview'&&<div className="world-director"><span aria-hidden="true"><i/> LIVE DIORAMA</span><button type="button" disabled={!selected} onClick={()=>setReplay(n=>n+1)} aria-label="Replay scene animation">↻ Replay animation</button></div>}
 <div className="world-coordinate">FICTIONAL SITE 01 <span>SCHEMATIC · NOT TO SCALE</span></div>
 </div>;
}
