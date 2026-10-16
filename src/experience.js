import {COMMUNITIES, ENERGY, COOLING, COSTS} from './simulation.js';
export const STEP_KEYS = ['community', 'energy', 'cooling', 'costs'];
const valid = {community: COMMUNITIES, energy: ENERGY, cooling: COOLING, costs: COSTS};
export const initialExperience = {phase: 'briefing', step: 0, choices: {}, saved: null, resultTab: 'resources'};
export function experienceReducer(state, action) {
  switch (action.type) {
    case 'BEGIN': return {...state, phase: 'decision'};
    case 'CHOOSE': {
      const key = STEP_KEYS[state.step];
      if (state.phase !== 'decision' || !Object.hasOwn(valid[key], action.value)) return state;
      return {...state, choices: {...state.choices, [key]: action.value}};
    }
    case 'NEXT': {
      if (state.phase !== 'decision' || !state.choices[STEP_KEYS[state.step]]) return state;
      if (state.step < STEP_KEYS.length - 1) return {...state, step: state.step + 1};
      if (!STEP_KEYS.every(key => Object.hasOwn(valid[key], state.choices[key]))) return state;
      return {...state, phase: 'results', resultTab: 'resources'};
    }
    case 'BACK': return state.phase !== 'decision' ? state : {...state, phase: state.step === 0 ? 'briefing' : 'decision', step: Math.max(0, state.step - 1)};
    case 'EDIT': return state.phase === 'results' ? {...state, phase: 'decision', step: 0} : state;
    case 'REPLAY': return {...initialExperience, phase: 'decision', choices: {}, saved: state.saved};
    case 'SAVE': return state.phase === 'results' ? {...state, saved: {...state.choices}} : state;
    case 'CLEAR_SAVED': return {...state, saved: null};
    case 'RESULT_TAB': return state.phase === 'results' && ['resources','people'].includes(action.value) ? {...state, resultTab: action.value} : state;
    default: return state;
  }
}
