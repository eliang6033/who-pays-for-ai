import {ENERGY, COOLING, COMMUNITIES, COSTS} from './simulation.js';

export const FILM_DURATION = 12500;
export const CHAPTERS = [
  {
    "key": "energy",
    "title": "Give the cloud a power source.",
    "name": "Electricity",
    "subtitle": "Lower-carbon electricity means fewer emissions, not less demand.",
    "options": [
      {
        "id": "grid",
        "label": "A shared grid",
        "tag": "FOLLOW THE ELECTRICITY",
        "tradeoff": "More emissions per unit of electricity in this scenario.",
        "detail": "Data centers usually draw electricity from a local grid that combines different power plants. Coal and natural gas plants burn fuel and release carbon dioxide. The same amount of electricity can therefore have a different emissions footprint depending on how it is generated.",
        "boundary": "This simulation keeps computing work fixed and uses 400 kg CO₂e per MWh for this example. This is a teaching assumption, not a measured local supply. The model excludes construction, hardware, and backup generators.",
        "source": "Shehabi et al. · Electricity supply; see also EPA eGRID",
        "sourceId": 12
      },
      {
        "id": "cleaner",
        "label": "A lower-carbon supply",
        "tag": "CHANGE THE SOURCE",
        "tradeoff": "Fewer operational emissions. The same electricity demand.",
        "detail": "Wind turbines use moving air, hydropower uses flowing water, and solar panels convert sunlight into electricity without burning fuel. The animation illustrates wind and solar. These sources can lower operational carbon emissions while the servers, cooling equipment, and grid connections still need power.",
        "boundary": "This simulation uses 50 kg CO₂e per MWh as an illustrative lower-carbon input. It is not a measured technology rate. Efficiency matters, but past efficiency gains do not guarantee that growing AI demand will stay flat.",
        "source": "Shehabi et al. · Electricity supply; see also Masanet et al.",
        "sourceId": 12
      }
    ]
  },
  {
    "key": "cooling",
    "title": "Find a way for the heat to leave.",
    "name": "Cooling",
    "subtitle": "Compare onsite water use with the electricity needed to remove heat.",
    "options": [
      {
        "id": "evaporative",
        "label": "Evaporative cooling",
        "tag": "LET WATER CARRY THE HEAT",
        "tradeoff": "More onsite water. Potentially less electricity.",
        "detail": "Heat moves from the servers through cooling equipment to a cooling tower. Some water evaporates, taking heat into the air, and replacement water is needed. This can use less electricity than an air-cooled chiller, but it consumes water.",
        "boundary": "The same water use matters more where water is scarce. The Viborillas interviews describe residents’ concerns, without measuring how much data centers caused the shortages. The model counts liters, not local water stress.",
        "source": "Shehabi et al. · pp. 40–41, 45; local context in Research",
        "sourceId": 12
      },
      {
        "id": "dry",
        "label": "Dry cooling",
        "tag": "LET AIR CARRY THE HEAT",
        "tradeoff": "Less onsite water. Potentially more electricity.",
        "detail": "An air-cooled chiller rejects heat through air-cooled condensers without evaporating cooling water. Fans move outside air over the coils. This saves onsite water, but fans and refrigeration still need electricity, and the equipment can use more energy than an evaporative system.",
        "boundary": "Onsite water is separate from water used to generate electricity. Dry cooling does not remove every water impact. The simulation’s water and electricity differences are chosen inputs, not universal equipment performance.",
        "source": "Shehabi et al. · pp. 40, 45; indirect water: Mytton",
        "sourceId": 12
      }
    ]
  },
  {
    "key": "community",
    "title": "Put the same bill in two budgets.",
    "name": "Households",
    "subtitle": "Energy burden is the share of household income spent on energy bills.",
    "options": [
      {
        "id": "lower",
        "label": "Lower income",
        "tag": "$30,000 ANNUAL INCOME",
        "tradeoff": "The same charge takes a larger share of income.",
        "detail": "This simulation compares a $1,800 annual energy bill at two incomes. At $30,000, the starting burden is 6%. A grid-upgrade charge leaves less room for other needs. The Kasnik reporting adds a real household concern, but this model does not use their income or bills as inputs.",
        "boundary": "These are fictional budgets. The Ohio tariff illustrates how payment rules can protect other customers from unused-capacity costs; AEP’s contract update does not prove household bills fell. Changing the agreement below lets you test a leverage point.",
        "source": "ACEEE · Data Update, p. 1; policy cases in Research",
        "sourceId": 3
      },
      {
        "id": "higher",
        "label": "Higher income",
        "tag": "$100,000 ANNUAL INCOME",
        "tradeoff": "The same charge takes a smaller share of income.",
        "detail": "This fictional household starts with the same $1,800 annual bill, but it takes only 1.8% of a $100,000 income. The comparison isolates income: an equal dollar charge does not create an equal burden. The physical data center stays the same.",
        "boundary": "Equipment choices change resource use; payment rules change who carries the cost. Changing those rules is an example of Meadows’s leverage-point idea. Only the upgrade agreement changes the modeled added payment, not electricity-price movements.",
        "source": "ACEEE · Data Update, p. 1; system rules: Meadows",
        "sourceId": 3
      }
    ]
  }
];
export const FUNDING = [
  {id:'company',label:'Company pays',note:'Households add $0 / year'},
  {id:'shared',label:'Split equally',note:'Households add $100 / year'},
  {id:'residents',label:'Residents pay',note:'Households add $200 / year'}
];
export const initialCinema = {phase:'intro', step:0, choices:{}, pending:null, funding:null, saved:null, resultTab:'resources'};
export function cinemaReducer(s,a) {
  const key=CHAPTERS[s.step].key;
  const valid={energy:ENERGY,cooling:COOLING,community:COMMUNITIES};
  switch(a.type) {
    case 'BEGIN': return {...s,phase:'choice'};
    case 'OPEN': return s.phase==='choice'&&Object.hasOwn(valid[key],a.value)?{...s,pending:a.value, funding:s.choices.costs||null}:s;
    case 'CLOSE': return {...s,pending:null};
    case 'FUND': return s.phase==='choice'&&key==='community'&&s.pending&&Object.hasOwn(COSTS,a.value)?{...s,funding:a.value}:s;
    case 'CONFIRM': {
      if(s.phase!=='choice'||!s.pending||(key==='community'&&!s.funding))return s;
      return {...s,phase:'film',choices:{...s.choices,[key]:s.pending,...(key==='community'?{costs:s.funding}:{})},pending:null};
    }
    case 'FILM_END': return s.phase==='film'?{...s,phase:'recap'}:s;
    case 'REWATCH': return s.phase==='recap'?{...s,phase:'film'}:s;
    case 'CHANGE': return {...s,phase:'choice',pending:null};
    case 'NEXT': {
      if(s.phase!=='recap')return s;
      if(s.step<2)return {...s,phase:'choice',step:s.step+1,pending:null};
      if(!Object.hasOwn(COSTS,s.choices.costs))return s;
      return {...s,phase:'results',resultTab:'resources'};
    }
    case 'BACK': return s.phase==='choice'?{...s,phase:s.step?'choice':'intro',step:Math.max(0,s.step-1),pending:null}:s;
    case 'EDIT': return {...s,phase:'choice',step:0,pending:null};
    case 'REPLAY': return {...initialCinema,phase:'choice',choices:{},saved:s.saved};
    case 'SAVE': return s.phase==='results'?{...s,saved:{...s.choices}}:s;
    case 'CLEAR_SAVED': return {...s,saved:null};
    case 'RESULT_TAB': return s.phase==='results'&&['resources','people'].includes(a.value)?{...s,resultTab:a.value}:s;
    default:return s;
  }
}

export function filmBeats(key,id,costs='company') {
  const charge={company:0,shared:100,residents:200}[costs];
  if(key==='cooling')return [
    ['Inside the data center','Servers produce heat. Cooling removes it, using electricity and sometimes water.','Final draft · Cooling and Water Use · Shehabi et al. [12]'],
    ['First, move the heat','Cooling equipment transfers heat away from the racks. Follow the warm path toward the outdoor unit.','Simplified heat-flow diagram · Shehabi et al., pp. 40–41 [12]'],
    id==='evaporative'?['Water carries heat to the tower','Some cooling-tower water evaporates. That evaporation carries heat into the outside air.','Shehabi et al., pp. 40–41 [12]']:['Air carries the heat away','Fans move outside air over the condenser coils. Heat leaves without evaporating cooling water.','Shehabi et al., p. 40 [12]'],
    id==='evaporative'?['Consumed water must be replaced','The tower needs replacement water. It can use less electricity than an air-cooled chiller, but consumes water.','Possible tradeoff · Shehabi et al., p. 45 [12]']:['Saving water still takes power','Air-cooled chillers save onsite water, but can need more energy. The tradeoff depends on equipment and conditions.','Possible tradeoff · Shehabi et al., p. 45 [12]'],
    id==='evaporative'?['Location changes what water use means','Viborillas residents report shortages. Their concerns matter, but the report does not measure how much data centers caused.','Local context: Siddik et al. [13]; Baptista and McDonnell [2]']:['Onsite water is only part of the picture','The model leaves out water used to generate electricity. Less onsite water does not mean no water impact.','Mytton [10]; Siddik et al. [13] · fixed model assumptions']
  ];
  if(key==='energy')return [
    ['AI runs on physical infrastructure','Data centers used 485 TWh worldwide in 2025—roughly 45 million US homes’ annual electricity purchases.','IEA [7]; EIA 2022 residential average [5] · all data centers, not AI alone'],
    id==='grid'?['Where does the electricity come from?','A shared grid combines power plants. Coal and natural gas generation burn fuel and release carbon dioxide.','Final draft · Electricity Use · Shehabi et al. [12]']:['How is lower-carbon power made?','Wind turns turbines and solar panels convert sunlight into electricity. Neither burns fuel while generating power.','Illustrative lower-carbon supply · Shehabi et al. [12]'],
    ['The grid still has a job to do','Electricity travels to the facility. Lower-carbon supply still needs power lines, connections, and cooling.','Final draft · power source and electricity demand are separate'],
    ['Keep the computing work fixed','Efficiency helped in the past; growth can still raise demand. Here, changing supply leaves the workload unchanged.','Masanet et al. [8]; Shehabi et al. [12] · controlled model comparison'],
    [id==='grid'?'More emissions per unit of electricity':'Less emissions per unit of electricity',id==='grid'?'This scenario assumes 400 kg CO₂e per MWh. Electricity use times this factor gives modeled emissions.':'This scenario assumes 50 kg CO₂e per MWh. Modeled emissions fall; electricity demand stays the same.','Assumed factors · calculation follows EPA eGRID, pp. 2–3 [4]']
  ];
  return [
    ['Same bill. Different financial room.','Energy burden means the share of income spent on energy bills. The homes and computing workload stay the same.','ACEEE · Data Update, p. 1 [3]'],
    ['Start with the same energy bill','Both households pay $1,800 a year. These are fictional comparison budgets, not the Kasnik family’s reported bills.','Final draft · household reporting: Jarboe [6]'],
    ['See the share of income','That bill takes 6% of $30,000, but 1.8% of $100,000. Equal bills do not mean equal burdens.','Assumed incomes and bill · not household survey results'],
    ['Now follow the upgrade payment',`Your agreement adds $${charge} per household each year. ${costs==='company'?'The company funds the upgrade.':costs==='shared'?'The company and households split the cost.':'Households fund the modeled upgrade.'}`,'$20 million ÷ 10 years ÷ 10,000 homes × resident share'],
    ['Experience a leverage point','Payment rules change who carries costs. Ohio’s tariff addresses infrastructure risk; its update does not prove household bills fell.','Meadows [9]; PUCO [11]; AEP Ohio, February 2026 [1]']
  ];
}
