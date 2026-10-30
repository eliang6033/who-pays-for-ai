import {useId} from 'react';
import {simulate, DEFAULT, format} from './simulation.js';

function Rack({x=0,y=0}) {
 return <g transform={`translate(${x} ${y})`}><path d="M0 0 18-11 66 0 48 12Z" fill="#467485"/><path d="m48 12 18-12v154l-18 12Z" fill="#112d3d"/><rect width="48" height="166" y="12" rx="5" fill="#183e50" stroke="#5c8892"/>{[0,1,2,3,4,5].map(i=><g key={i}><rect x="6" y={23+i*24} width="36" height="16" rx="2" fill="#0b2333"/><path d={`M11 ${30+i*24}h17`} stroke="#4f7985" strokeWidth="2"/><circle className="rack-led" cx="35" cy={31+i*24} r="2" fill="#85f1cf" style={{animationDelay:`${i*.2}s`}}/></g>)}</g>;
}
function Fan({x,y,r=31}) {
 return <g transform={`translate(${x} ${y})`}><circle r={r+5} fill="#091e2b" stroke="#527783" strokeWidth="2"/><circle r={r-3} fill="none" stroke="#214553"/><g className="cin-fan">{[0,90,180,270].map(n=><path key={n} transform={`rotate(${n})`} d={`M0 0Q${r} -${r} ${r-4} 0Q${r/2} 9 0 0`} fill="#81b4ba"/>)}</g><circle r="6" fill="#dcf6e9"/></g>;
}
function Label({x,y,children,color='#9dbbc7',anchor='middle',size=12}) {
 return <text x={x} y={y} fill={color} textAnchor={anchor} fontSize={size} fontFamily="Arial, sans-serif" letterSpacing="1.2">{children}</text>;
}
function Route({d,color='#7ee5d5',active=true,width=5}) {
 return <g className={active?'route-on':'route-off'}><path d={d} fill="none" stroke={color} strokeWidth={width+9} opacity=".08"/><path d={d} fill="none" stroke={color} strokeWidth={width} opacity=".28"/><path className="cin-flow" d={d} fill="none" stroke={color} strokeWidth={width-1} strokeDasharray="6 23" strokeLinecap="round"/></g>;
}
function CoolingArt({dry,beat,mini}) {
 return <>
  <g className="cin-server-zone"><path d="M65 190 260 140 320 195 125 255Z" fill="#173547" stroke="#365e6d"/><path d="M65 190v174l60 53V255Z" fill="#0a2434" stroke="#2f5262"/><path d="m125 255 195-60v174l-195 59Z" fill="#0b293a" stroke="#365e6d"/><g transform="translate(98 210)"><Rack/><Rack x={67} y={-20}/><Rack x={134} y={-40}/></g><Label x={189} y={451}>SERVER ROOM</Label><Label x={189} y={474} size={11}>Same computing workload</Label></g>
  <g className={beat>=1?'heat-visible':'heat-hidden'}>{[0,1,2,3].map(i=><path key={i} className="cin-heat" style={{animationDelay:`${i*.28}s`}} d={`M${128+i*43} ${184-i*8}q-13-18 0-33t0-33`} stroke="#ff9a75" fill="none" strokeWidth="3"/>)}<Label x={205} y={101} color="#ffb294">HEAT OUT</Label></g>
  <Route d="M292 247H414Q430 247 430 263V282" color="#ff9b79" active={beat>=1}/>
  <Route d="M430 354V383Q430 399 412 399H298" active={beat>=2}/>
  <g className={`cin-exchanger ${beat>=1?'lit':''}`}><rect x="397" y="278" width="95" height="80" rx="12" fill="#143c4a" stroke="#6b9d9f"/><path d="M414 294h53v10h-53v10h53v10h-53v10h53" fill="none" stroke="#e6c797" strokeWidth="3"/><Label x={445} y={439} size={11}>HEAT TRANSFER</Label><Label x={445} y={457} size={10}>Cooling equipment</Label></g>
  <Route d="M492 295H548Q564 295 564 278V220H661" color="#ff9b79" active={beat>=2}/>
  <Route d="M666 363H579Q562 363 562 380V399H492V342" active={beat>=2}/>
  {dry?<g className="cin-dry-unit">
    <path d="M640 210 687 180 831 210 788 239Z" fill="#3b6979" stroke="#688d99"/><path d="m788 239 43-29v145l-43 28Z" fill="#143748" stroke="#466b7a"/><rect x="640" y="239" width="148" height="144" rx="7" fill="#204959" stroke="#7295a0"/><path d="M652 328h124m-124 8h124m-124 8h124m-124 8h124m-124 8h124m-124 8h124" stroke="#608690" strokeWidth="2"/>
    <g className={beat>=2?'fans-on':'fans-off'}><Fan x={680} y={282} r={27}/><Fan x={746} y={282} r={27}/></g>
    <g className={beat>=2?'air-visible':'air-hidden'}>{[0,1,2].map(i=><path className="cin-air" key={i} style={{animationDelay:`${i*.3}s`}} d={`M${670+i*45} 190q-24-25 0-53t0-50`} stroke="#acd9ed" strokeWidth="3" fill="none" strokeDasharray="25 12"/>)}<Label x={738} y={64} color="#c5e8f7">WARM AIR OUT</Label></g>
    <Label x={730} y={425}>AIR-COOLED CHILLER</Label>
    <g className={beat>=3?'resource-note visible':'resource-note'}><rect x="650" y="464" width="164" height="43" rx="21" fill="#1c4351" stroke="#73c3cf"/><Label x={732} y={490} color="#bfe5ec" size={11}>NO EVAPORATIVE LOSS</Label><Route d="M824 480H872V332H831" color="#f5cc85" width={3}/></g>
  </g>:<g className="cin-tower-unit">
    <path d="M655 370Q683 294 662 206H789Q770 292 800 370Z" fill="#285a68" stroke="#739fa5" strokeWidth="2"/>
    <path d="M678 351Q696 279 684 220m35 139V219m34 140q-15-75 11-139" fill="none" stroke="#4a8790" strokeWidth="6"/>
    <ellipse cx="726" cy="205" rx="65" ry="17" fill="#0d2c3a" stroke="#7bb5b5" strokeWidth="2"/>
    <ellipse cx="727" cy="371" rx="73" ry="17" fill="#295266" stroke="#77aab0"/>
    <g className={beat>=2?'water-visible':'water-hidden'}><path d="M689 235h71M699 259h52M693 284h65M688 310h74M681 339h90" stroke="#7ee4d6" strokeWidth="3" strokeDasharray="2 7"/>{Array.from({length:8},(_,i)=><circle key={i} className="cin-droplet" cx={690+i*10} cy="247" r="2.5" fill="#8eecdf" style={{animationDelay:`${i*.23}s`}}/>)}</g>
    <g className={beat>=3?'vapor-visible':'vapor-hidden'}>{[0,1,2,3].map(i=><ellipse className="cin-vapor" key={i} cx={694+i*20} cy={174-i%2*12} rx="18" ry="25" fill="#b9e8dc" style={{animationDelay:`${i*.45}s`}}/>)}<Label x={730} y={67} color="#bcefe4">WATER VAPOR + HEAT</Label></g>
    <Label x={731} y={425}>COOLING TOWER</Label>
    <g className={beat>=3?'resource-note visible':'resource-note'}><rect x="650" y="465" width="163" height="40" rx="20" fill="#164657" stroke="#72c5d0"/><Label x={732} y={491} color="#9fdef0" size={11}>REPLACEMENT WATER</Label><Route d="M731 465V390" color="#81cee8" width={3}/></g>
  </g>}
  <g className="loop-label"><Label x={355} y={225} color="#ffb294" size={10}>WARM PATH →</Label><Label x={355} y={425} color="#9fe8d9" size={10}>← COOL RETURN</Label></g>
  {!mini&&<Label x={466} y={538} size={10}>Heat-flow schematic · equipment and circuits simplified</Label>}
 </>;
}
function Wind({x,y,size=1,delay=0}) {
 return <g transform={`translate(${x} ${y}) scale(${size})`}><path className="cin-wind-mast" d="M0 130V0" stroke="#a4cbc8" strokeWidth="7" style={{animationDelay:`${delay}s`}}/><ellipse cx="0" cy="130" rx="26" ry="8" fill="#254b55"/><g className="cin-wind-rotor">{[0,120,240].map(n=><path key={n} transform={`rotate(${n})`} d="M0 0-5-64Q10-46 5-9Z" fill="#c9e9df"/>)}<circle r="7" fill="#fcf6d6"/></g></g>;
}
function EnergyArt({clean,beat,mini}) {
 return <>
  <path d="M45 353 235 274 418 346 235 432Z" fill="#123443" stroke="#355d65"/>
  {clean?<g className="cin-generation"><Wind x={144} y={205}/><Wind x={267} y={165} size={.85} delay={.3}/><g className="cin-solar"><path d="m244 354 90-45 66 30-90 45Z" fill="#245871" stroke="#84c7d5"/><path d="m268 342 66 29m-42-41 65 28m-89 14 90-44m-68 55 90-44" stroke="#71aabe"/></g><g className="sun-orbit"><circle cx="355" cy="117" r="23" fill="#f7d08c"/><circle cx="355" cy="117" r="35" stroke="#f7d08c" fill="none" opacity=".2"/></g><Label x={221} y={462}>WIND + SOLAR</Label><Label x={221} y={484} size={10}>Illustrative lower-carbon supply</Label></g>:<g className="cin-generation"><path d="m101 277 81-36 134 53-78 39Z" fill="#486373"/><path d="M101 277v85l137 53v-82Z" fill="#254452" stroke="#5d7e86"/><path d="m238 333 78-39v85l-78 36Z" fill="#183544"/>{[0,1].map(i=><g key={i} transform={`translate(${159+i*65} ${253+i*23})`}><path d="M-12 0V-106H12V0" fill="#69828a" stroke="#9daaa7"/><rect x="-12" y="-92" width="24" height="15" fill="#b8907d"/><g className={beat>=1?'cin-stack visible':'cin-stack'}>{[0,1,2].map(k=><circle className="cin-carbon" key={k} cx={k*10} cy={-124-k*20} r={12+k*2} fill="#b09b8f" style={{animationDelay:`${k*.6}s`}}/>)}</g></g>)}<Label x={216} y={462}>MIXED GENERATION</Label><Label x={216} y={484} size={10}>Fossil generation shown · mix varies</Label></g>}
  <g transform="translate(474 206)" stroke="#86a6ad" fill="none"><path d="M-28 166 0 0 28 166M-22 123h44M-13 69h26M-28 37h56M-35 17h70M0 0v166M-22 123l35-54M22 123-13 69" strokeWidth="3"/><path d="M-35 17Q-112 63-150 31M35 17Q116 81 150 61" strokeWidth="2"/></g>
  <g transform="translate(632 220)"><path d="M0 0 127-32 226 25 99 57Z" fill="#365f70"/><path d="m0 0 99 57v139L0 140Z" fill="#254a5a"/><path d="m99 57 127-32v140L99 196Z" fill="#102c3d"/><g transform="translate(20 32) scale(.68)"><Rack/><Rack x={65} y={35}/><Rack x={130} y={67}/></g></g>
  <Route d="M290 394H473Q496 394 496 417H708V395" color={clean?'#88efcf':'#f4cc87'} active={beat>=2} width={6}/>
  <Label x={474} y={461}>THE SHARED GRID</Label><Label x={750} y={461}>DATA CENTER</Label>
  <g className={beat>=3?'resource-note visible':'resource-note'}><rect x="660" y="118" width="185" height="52" rx="9" fill="#123e4a" stroke="#5c9d9b"/><Label x={752} y={141} color="#c4f4d9" size={11}>COMPUTING WORKLOAD</Label><Label x={752} y={159} size={10}>UNCHANGED</Label></g>
  {beat>=4&&<g className="cin-emissions"><rect x="61" y="72" width="249" height="49" rx="24" fill={clean?'#143e38':'#443c31'} stroke={clean?'#6ab999':'#bc9770'}/><Label x={185} y={103} color={clean?'#b1f0cf':'#f9d29d'} size={15}>{clean?'50':'400'} kg CO₂e / MWh</Label></g>}
  {!mini&&<Label x={470} y={538} size={10}>Source → transmission → computing · illustrative supply, not hourly grid dispatch</Label>}
 </>;
}
function House({x,y}) {
 return <g transform={`translate(${x} ${y})`}><path d="m0 42 57-43 69 43-17 4-52-30L14 48Z" fill="#87b2b4"/><path d="M14 46 57 16l52 30v78H14Z" fill="#214857" stroke="#678e99"/><rect x="28" y="56" width="22" height="25" fill="#e8c68d"/><path d="M39 56v25M28 68h22" stroke="#2c4f5a"/><rect x="69" y="56" width="22" height="25" fill="#e8c68d"/><path d="M80 56v25M69 68h22" stroke="#2c4f5a"/><rect x="52" y="92" width="20" height="32" fill="#537c85"/></g>;
}
function IncomeArt({selected,beat,costs,mini}) {
 const charge=simulate({...DEFAULT,costs:costs||'company'}).extraAnnualUSD;
 return <>
  <g className="income-canvas">
   {[['lower',30000,160],['higher',100000,555]].map(([id,income,x])=>{
    const baseline=1800/income*100, extra=charge/income*100;
    return <g key={id} className={selected===id?'selected-house':'other-house'}>
     <rect x={x-30} y="119" width="295" height="344" rx="18" fill={selected===id?'#143a4b':'#102c3c'} stroke={selected===id?'#81c9d0':'#305362'} strokeWidth={selected===id?2:1}/>
     <House x={x+54} y={145}/><Label x={x+116} y={302} color="#d3e8e9" size={17}>${format(income,0)} / year</Label>
     <Label x={x+116} y={327} size={11}>{id==='lower'?'LOWER INCOME':'HIGHER INCOME'}{selected===id?' · YOUR HOUSEHOLD':''}</Label>
     <g className={beat>=1?'resource-note visible':'resource-note'}><Label x={x+116} y={355} color="#f0d5aa" size={14}>$1,800{beat>=3?` + $${charge}`:''} annual bill</Label></g>
     <g className={beat>=2?'resource-note visible':'resource-note'}><rect x={x-5} y="379" width="245" height="17" rx="8" fill="#09212f"/><rect className="cin-budget" x={x-5} y="379" width={245*baseline/7} height="17" rx="8" fill="#75cbd0"/>{beat>=3&&<rect className="cin-budget" x={x-5+245*baseline/7} y="379" width={245*extra/7} height="17" fill="#eab980"/>}<Label x={x+116} y={425} color="#bce9e4" size={23}>{format(baseline+(beat>=3?extra:0),2)}%</Label><Label x={x+116} y={446} size={9}>OF ANNUAL INCOME · SCALE 0–7%</Label></g>
    </g>;
   })}
   <g className={beat>=3?'resource-note visible':'resource-note'}><rect x="329" y="45" width="283" height="47" rx="23" fill="#3e3540" stroke="#c4a0bd"/><Label x={470} y={75} color="#edc7d2" size={13}>{costs==='company'?'COMPANY PAYS':costs==='residents'?'RESIDENTS PAY':'COSTS SPLIT EQUALLY'}</Label><Route d="M367 92V105H276V119M573 92V105H670V119" color="#d9acbd" width={3}/></g>
  </g>
  {!mini&&<Label x={470} y={523} size={11}>Same home. Same starting bill. Different financial room.</Label>}
 </>;
}
export default function CinemaArt({kind='cooling',option='evaporative',beat=4,mini=false,paused=false,costs='company'}) {
 const uid=useId().replace(/:/g,'');
 return <svg className={`cin-art art-${kind} option-${option} beat-${beat} ${mini?'art-mini':''} ${paused?'art-paused':''}`} viewBox="0 0 940 560" role="img" aria-label={kind==='cooling'?`${option==='dry'?'Air-cooled chiller transfers heat into outside air':'Evaporative cooling tower releases heat through water evaporation'}. Warm path and cool return connect to the server room.`:kind==='energy'?`${option==='cleaner'?'Wind and solar illustrate lower-carbon supply':'Mixed generation supplies the grid'}. Electricity travels to the same data center.`:'Two identical homes compare the same energy bill at annual incomes of $30,000 and $100,000.'}>
   <defs><radialGradient id={`ambient-${uid}`}><stop stopColor="#2b6b7c" stopOpacity=".24"/><stop offset="1" stopColor="#102d40" stopOpacity="0"/></radialGradient><pattern id={`dots-${uid}`} width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#8db0c1" opacity=".18"/></pattern></defs>
   <rect width="940" height="560" fill="#0b2030"/><rect width="940" height="560" fill={`url(#dots-${uid})`}/><ellipse cx="475" cy="288" rx="465" ry="285" fill={`url(#ambient-${uid})`}/>
   <g className={`cin-camera ${mini?'':`camera-${beat}`}`}>{kind==='cooling'?<CoolingArt dry={option==='dry'} beat={beat} mini={mini}/>:kind==='energy'?<EnergyArt clean={option==='cleaner'} beat={beat} mini={mini}/>:<IncomeArt selected={option} beat={beat} costs={costs} mini={mini}/>}</g>
 </svg>;
}
