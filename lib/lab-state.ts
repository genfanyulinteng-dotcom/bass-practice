import {SCALE_CATALOG,type MapConfig} from './degree-engine';
export type RecallRecord={at:string;context:string;degree:string;correct:boolean;assisted:boolean};
export type JamRecord={id:string;at:string;tonicPc:number;strategy:'relative'|'parallel';modeIndex:number;bpm:number;bars:number;changes:boolean;selfChecks:boolean[];usedHints:boolean;blind?:boolean;identified?:number;centerCount?:number;rhythm?:string;progression?:{rootName:string;modeName:string}[]};
export type LabState={version:1;config:MapConfig;stage:number;recall:{total:number;correct:number;last:RecallRecord[]};jamHistory:JamRecord[];progression:MapConfig[];presetId:string;guide?:{level:number;checks:boolean[]}};
export const DEFAULT_LAB:LabState={version:1,config:{tonicPc:0,strategy:'relative',modeIndex:0,fromFret:0,toFret:12},stage:0,recall:{total:0,correct:0,last:[]},jamHistory:[],progression:[{tonicPc:2,strategy:'parallel',modeIndex:1,fromFret:0,toFret:12},{tonicPc:2,strategy:'parallel',modeIndex:5,fromFret:0,toFret:12},{tonicPc:2,strategy:'parallel',modeIndex:1,scaleId:'melodic-minor',fromFret:0,toFret:12},{tonicPc:2,strategy:'parallel',modeIndex:1,fromFret:0,toFret:12}],presetId:'one-note'};
const integer=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isInteger(v)&&v>=min&&v<=max;
const str=(v:unknown,max=100)=>typeof v==='string'&&v.length<=max;
export function validateMapConfig(v:unknown):v is MapConfig{
 if(!v||typeof v!=='object')return false;const a=v as MapConfig;
 return integer(a.tonicPc,0,11)&&['relative','parallel'].includes(a.strategy)&&integer(a.modeIndex,0,6)&&integer(a.fromFret,0,24)&&integer(a.toFret,a.fromFret,24)&&(a.scaleId===undefined||SCALE_CATALOG.some(s=>s.id===a.scaleId));
}
export function validateLab(v:unknown):v is LabState{
 if(!v||typeof v!=='object')return false;const a=v as LabState;
 return a.version===1&&validateMapConfig(a.config)&&integer(a.stage,0,3)&&str(a.presetId,50)&&(a.guide===undefined||(!!a.guide&&typeof a.guide==='object'&&integer(a.guide.level,0,6)&&Array.isArray(a.guide.checks)&&a.guide.checks.length===2&&a.guide.checks.every(v=>typeof v==='boolean')))&&Array.isArray(a.progression)&&a.progression.length>=1&&a.progression.length<=8&&a.progression.every(validateMapConfig)
 &&!!a.recall&&integer(a.recall.total,0,1000000)&&integer(a.recall.correct,0,a.recall.total)&&Array.isArray(a.recall.last)&&a.recall.last.length<=70&&a.recall.last.every(r=>r&&str(r.at,40)&&Number.isFinite(Date.parse(r.at))&&str(r.context)&&str(r.degree,12)&&typeof r.correct==='boolean'&&typeof r.assisted==='boolean')
 &&Array.isArray(a.jamHistory)&&a.jamHistory.length<=40&&a.jamHistory.every(r=>r&&str(r.id,100)&&str(r.at,40)&&Number.isFinite(Date.parse(r.at))&&integer(r.tonicPc,0,11)&&['relative','parallel'].includes(r.strategy)&&integer(r.modeIndex,0,6)&&integer(r.bpm,40,160)&&integer(r.bars,4,64)&&typeof r.changes==='boolean'&&typeof r.usedHints==='boolean'&&Array.isArray(r.selfChecks)&&r.selfChecks.length===4&&r.selfChecks.every(v=>typeof v==='boolean'));
}
