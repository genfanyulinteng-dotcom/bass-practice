import {scaleDegree} from './scales';
export type Position = {s:number; f:number; midi:number};
export type Settings = {tuning:number[]; previousTuning:number[]|null; frets:number; bpm:number};
export type RecordEntry = {lesson:number; date:string; correct:number; bpm:number};
export type PracticeState = {settings:Settings; lesson:number; step:number; card:number; answers:boolean[]; routeRounds:number[]; loops:number; located:boolean; history:RecordEntry[]; finished:boolean};
export const DEFAULT_STATE:PracticeState = {settings:{tuning:[23,28,33,38,43],previousTuning:null,frets:24,bpm:60},lesson:1,step:0,card:0,answers:[],routeRounds:[],loops:0,located:false,history:[],finished:false};
export const STEP_TITLES = ['校准与定位','听音程，找落点','同一句，换路线','跟拍连接'];
export const STEP_SECONDS = [180,420,420,480];
export const PHASES = ['五度与八度','三度与和弦','分弦与换把','七度与综合','音阶与主音','七种调式'];
const NAMES = ['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
export function noteName(midi:number) {return NAMES[((midi%12)+12)%12]+(Math.floor(midi/12)-1);}
export function stringName(tuning:number[],s:number) {return `${5-s}弦 ${noteName(tuning[s])}`;}
export function posLabel(p:Position,tuning:number[]) {return `${5-p.s}弦 · ${p.f===0?'空弦':p.f+'品'}`;}
export function positions(midi:number,settings:Settings):Position[] {return settings.tuning.map((open,s)=>({s,f:midi-open,midi})).filter(p=>p.f>=0&&p.f<=settings.frets);}
function cost(p:Position,center=6) {return Math.abs(p.f-center)+(p.f===0?0.4:0)+Math.abs(p.s-2)*0.2;}
export function nearestPositions(midi:number,settings:Settings,max=3) {return positions(midi,settings).sort((a,b)=>cost(a)-cost(b)).slice(0,max);}
export function intervalName(delta:number) {const names=['同度','小二度','大二度','小三度','大三度','纯四度','三全音','纯五度','小六度','大六度','小七度','大七度','八度'];return `${delta<0?'下行':delta>0?'上行':''}${names[Math.abs(delta)]??Math.abs(delta)+'个半音'}`;}
export function degreeName(midi:number,root:number) {return ['1','♭2','2','♭3','3','4','♯4','5','♭6','6','♭7','7'][((midi-root)%12+12)%12];}
type Lesson = {title:string; root:number; pairs:number[][]; phrase:number[]; splits?:number[][]; scaleId?:string; application?:number[]; chords?:{root:number;offsets:number[];name:string}[]};
const C=36,D=38,A=33;
const major=[0,2,4,5,7,9,11,12],melody=[0,2,4,7,9,7,4,0];
export const LESSONS:Lesson[] = [
 {title:'同一个五度，三个落点',root:C,pairs:[[0,7]],phrase:[0,7,12,7]},
 {title:'把八度连接起来',root:C,pairs:[[0,12]],phrase:[0,12,7,0]},
 {title:'从五度返回起点',root:C,pairs:[[7,0]],phrase:[7,0,7,12]},
 {title:'从高八度返回',root:C,pairs:[[12,0]],phrase:[12,0,7,0]},
 {title:'把关系移到 D',root:D,pairs:[[0,7],[0,12]],phrase:[0,7,12,7]},
 {title:'五度和八度连续走',root:C,pairs:[[0,7],[7,12],[12,0]],phrase:[0,7,12,7,0,12,7,0]},
 {title:'复核一：任意入口',root:D,pairs:[[0,7],[7,0],[0,12],[12,0]],phrase:[0,7,12,7,0,12,7,0]},
 {title:'大三度加入地图',root:C,pairs:[[0,4],[4,7]],phrase:[0,4,7,12]},
 {title:'小三度加入地图',root:C,pairs:[[0,3],[3,7]],phrase:[0,3,7,12]},
 {title:'只差一品的大小三度',root:C,pairs:[[0,4],[0,3],[4,0],[3,0]],phrase:[0,4,7,4,0,3,7,3]},
 {title:'A 小三和弦的三条路',root:A,pairs:[[0,3],[3,7],[0,7]],phrase:[0,3,7,12]},
 {title:'D 小三和弦的三条路',root:D,pairs:[[0,3],[3,7],[7,12]],phrase:[0,3,7,12]},
 {title:'四小节 C—Am—Dm—C',root:C,pairs:[[0,4],[4,7],[7,4]],phrase:[0,4,7,4],chords:[{root:C,offsets:[0,4,7,4],name:'C'},{root:A,offsets:[0,3,7,3],name:'Am'},{root:D,offsets:[0,3,7,3],name:'Dm'},{root:C,offsets:[0,4,7,4],name:'C'}]},
 {title:'复核二：换路不换声音',root:C,pairs:[[0,3],[0,4],[4,7],[7,0]],phrase:[0,4,7,12,7,4,0,0]},
 {title:'同一音阶：3＋3＋2',root:C,pairs:[[0,4],[4,7],[7,12]],phrase:major,splits:[[3,3,2],[4,4]]},
 {title:'同一音阶：4＋4',root:C,pairs:[[0,5],[5,7],[7,12]],phrase:major,splits:[[4,4],[3,3,2]]},
 {title:'同一音阶：5＋3',root:C,pairs:[[0,7],[7,9],[9,12]],phrase:major,splits:[[5,3],[4,4]]},
 {title:'不等长分组：2＋3＋3',root:C,pairs:[[2,7],[7,11],[11,12]],phrase:major,splits:[[2,3,3],[3,5]]},
 {title:'倒走熟悉的路线',root:C,pairs:[[12,7],[7,4],[4,0]],phrase:[...major].reverse(),splits:[[2,3,3],[4,4]]},
 {title:'旋律拐弯，路线也能拐弯',root:C,pairs:[[0,4],[4,7],[9,7],[7,4]],phrase:melody},
 {title:'复核三：中途换出口',root:C,pairs:[[0,7],[4,9],[9,4],[7,0]],phrase:major,splits:[[3,3,2],[5,3],[4,4]]},
 {title:'大七度：Cmaj7',root:C,pairs:[[0,11],[7,11],[11,0]],phrase:[0,4,7,11]},
 {title:'小七度：C7',root:C,pairs:[[0,10],[0,11],[10,7]],phrase:[0,4,7,10]},
 {title:'Am7 与 Dm7',root:A,pairs:[[0,10],[3,7],[7,10]],phrase:[0,3,7,10],chords:[{root:A,offsets:[0,3,7,10],name:'Am7'},{root:D,offsets:[0,3,7,10],name:'Dm7'}]},
 {title:'以 G 为接点，连接前后句',root:C,pairs:[[0,7],[4,7],[7,12]],phrase:[0,4,7,9,11,12,7,0]},
 {title:'换弦组，或迁移到新定弦',root:C,pairs:[[0,7],[4,9],[9,4]],phrase:melody},
 {title:'四小节和弦音连接',root:C,pairs:[[0,11],[0,10],[4,7]],phrase:[0,4,7,11],chords:[{root:C,offsets:[0,4,7,11],name:'Cmaj7'},{root:A,offsets:[0,3,7,10],name:'Am7'},{root:D,offsets:[0,3,7,10],name:'Dm7'},{root:C,offsets:[0,4,7,11],name:'Cmaj7'}]},
 {title:'复核四：听到、找到、接上',root:C,pairs:[[0,7],[7,0],[0,4],[0,3],[0,11],[0,10],[12,0]],phrase:melody,chords:[{root:C,offsets:[0,4,7,11],name:'Cmaj7'},{root:A,offsets:[0,3,7,10],name:'Am7'},{root:D,offsets:[0,3,7,10],name:'Dm7'},{root:C,offsets:[0,4,7,11],name:'Cmaj7'}]},
];
LESSONS.push(
 {title:'大调：先听主音，再走音阶',root:C,pairs:[[0,4],[0,11]],phrase:major,splits:[[3,3,2],[4,4]],scaleId:'ionian',application:[0,4,7,11,12,7,4,0]},
 {title:'自然小调：主音仍然是 C',root:C,pairs:[[0,3],[0,8],[0,10]],phrase:[0,2,3,5,7,8,10,12],splits:[[3,3,2],[4,4]],scaleId:'aeolian',application:[0,3,7,8,10,8,7,0]},
 {title:'同主音的大调、小调对照',root:C,pairs:[[0,4],[0,3],[0,9],[0,8]],phrase:[0,4,7,11,0,3,7,10],application:[0,4,7,11,0,3,7,10]},
 {title:'大五声音阶：五个音的路线',root:C,pairs:[[0,4],[0,9]],phrase:[0,2,4,7,9,12],splits:[[3,3],[4,2],[5,1]],scaleId:'major-pent',application:[0,2,4,7,9,7,4,0]},
 {title:'小五声音阶：同主音换颜色',root:C,pairs:[[0,3],[0,10]],phrase:[0,3,5,7,10,12],splits:[[3,3],[4,2],[5,1]],scaleId:'minor-pent',application:[0,3,5,7,10,7,3,0]},
 {title:'音阶中途，用音程换路线',root:C,pairs:[[2,9],[9,4],[4,0]],phrase:[0,2,4,7,9,7,4,0],scaleId:'major-pent'},
 {title:'复核五：主音保持不动',root:C,pairs:[[0,4],[0,3],[0,9],[0,8],[0,11],[0,10]],phrase:[0,4,7,9,0,3,7,8]},
 {title:'多利亚：听见自然六级',root:C,pairs:[[0,3],[0,9],[9,7]],phrase:[0,2,3,5,7,9,10,12],splits:[[3,3,2],[4,4]],scaleId:'dorian',application:[0,3,7,9,7,5,3,0]},
 {title:'弗里几亚：半音回到主音',root:C,pairs:[[0,1],[1,0],[0,3]],phrase:[0,1,3,5,7,8,10,12],splits:[[3,3,2],[4,4]],scaleId:'phrygian',application:[0,1,0,3,5,3,1,0]},
 {title:'利底亚：突出升四级',root:C,pairs:[[0,6],[6,7],[6,0]],phrase:[0,2,4,6,7,9,11,12],splits:[[3,3,2],[4,4]],scaleId:'lydian',application:[0,4,6,7,6,4,2,0]},
 {title:'混合利底亚：大三度与小七度',root:C,pairs:[[0,4],[0,10],[10,0]],phrase:[0,2,4,5,7,9,10,12],splits:[[3,3,2],[4,4]],scaleId:'mixolydian',application:[0,4,7,10,9,7,4,0]},
 {title:'洛克里亚：辨认降二、降五',root:C,pairs:[[0,1],[0,6],[6,0]],phrase:[0,1,3,5,6,8,10,12],splits:[[3,3,2],[4,4]],scaleId:'locrian',application:[0,1,3,6,5,3,1,0]},
 {title:'七种调式：固定 C，比特色音',root:C,pairs:[[0,4],[0,3],[0,6],[0,1],[0,9],[0,8],[0,11],[0,10]],phrase:[0,4,6,7,0,3,9,10],application:[0,4,6,7,0,3,9,10]},
 {title:'复核六：调式与路线一起听',root:C,pairs:[[0,1],[0,6],[0,9],[0,10],[0,11],[0,3]],phrase:[0,3,7,9,10,9,7,0],scaleId:'dorian',application:[0,3,7,9,7,5,3,0]}
);
export function lessonFor(number:number) {const index=(number-1)%LESSONS.length;return {...LESSONS[index],index,phase:Math.floor(index/7),cycle:Math.floor((number-1)/LESSONS.length)+1};}
export type Route = {name:string;notes:Position[];hint:string};
export function flexibleRoute(pitches:number[],settings:Settings,center=5,penalty:Position[]=[]):Position[] {
  if(!pitches.length)return [];
  let paths:{notes:Position[];value:number}[] = positions(pitches[0],settings).map(p=>({notes:[p],value:cost(p,center)+(penalty[0]?.s===p.s?4:0)}));
  for(let i=1;i<pitches.length;i++){
    paths=positions(pitches[i],settings).map(p=>{
      let best:{notes:Position[];value:number}|null=null;
      for(const prev of paths){const last=prev.notes[prev.notes.length-1];const value=prev.value+Math.abs(last.f-p.f)*0.85+Math.abs(last.s-p.s)*1.1+cost(p,center)*0.18+(penalty[i]?.s===p.s?4:0);if(!best||value<best.value)best={notes:[...prev.notes,p],value};}
      return best;
    }).filter((p):p is {notes:Position[];value:number}=>p!==null);
  }
  return paths.sort((a,b)=>a.value-b.value)[0]?.notes??[];
}
export function splitRoute(pitches:number[],counts:number[],settings:Settings):Position[] {
  if(counts.reduce((a,b)=>a+b,0)!==pitches.length)return [];
  const ascending=pitches[pitches.length-1]>=pitches[0];
  let best:Position[]=[];let bestCost=Infinity;
  for(let start=0;start<5;start++){
    let i=0;const route:Position[]=[];
    counts.forEach((count,g)=>{const s=start+(ascending?g:-g);for(let k=0;k<count;k++){const midi=pitches[i++];route.push({s,f:s>=0&&s<5?midi-settings.tuning[s]:-1,midi});}});
    if(route.some(p=>p.s<0||p.s>4||p.f<0||p.f>settings.frets))continue;
    const value=route.reduce((total,p)=>total+cost(p,6),0);
    if(value<bestCost){best=route;bestCost=value;}
  }
  return best;
}
export function makeRoutes(pitches:number[],settings:Settings,splits?:number[][]):Route[] {
  const routes:Route[]=[];
  if(splits) for(const split of splits){const notes=splitRoute(pitches,split,settings);if(notes.length)routes.push({name:split.join('＋')+' 分弦',notes,hint:'按序弹；同弦跨度大时换把，不固定撑开手指。'});}
  if(!splits){
    const a=flexibleRoute(pitches,settings,4);if(a.length)routes.push({name:'路线 A · 附近连接',notes:a,hint:'保持每拍一个音，先熟悉这一条路线。'});
    const b=flexibleRoute(pitches,settings,9,a);if(b.length&&JSON.stringify(b)!==JSON.stringify(a))routes.push({name:'路线 B · 换一个入口',notes:b,hint:'音高与顺序不变；跟随新的弦位和品位。'});
    if(pitches.length<=8){for(let s=2;s>=0;s--){const notes=pitches.map(midi=>({s,f:midi-settings.tuning[s],midi}));if(notes.every(p=>p.f>=0&&p.f<=settings.frets)&&!routes.some(r=>JSON.stringify(r.notes)===JSON.stringify(notes))){routes.push({name:'路线 C · 沿单弦移动',notes,hint:'整句留在同一根弦，通过换把连接。'});break;}}}
  }
  if(!routes.length){const notes=flexibleRoute(pitches,settings);if(notes.length)routes.push({name:'当前定弦可行路线',notes,hint:'原分弦方式在当前音域不可行；保留原音高，使用此路线。'});}
  return routes.slice(0,3);
}
export function buildDay(state:PracticeState){
  const lesson=lessonFor(state.lesson), settings=state.settings;
  const phrase=lesson.phrase.map(n=>lesson.root+n);
  const cards=Array.from({length:10},(_,i)=>{const pair=lesson.pairs[i%lesson.pairs.length];const from=lesson.root+pair[0],to=lesson.root+pair[1];const starts=nearestPositions(from,settings,4);return {from,to,start:starts[Math.floor(i/lesson.pairs.length)%Math.max(1,starts.length)],targets:nearestPositions(to,settings,3),interval:intervalName(to-from),functionLabel:`相对 ${noteName(lesson.root)}：${scaleDegree(from,lesson.root,lesson.scaleId)??degreeName(from,lesson.root)} → ${scaleDegree(to,lesson.root,lesson.scaleId)??degreeName(to,lesson.root)}`};});
  const routes=makeRoutes(phrase,settings,lesson.splits);
  const progression=lesson.chords??[{root:lesson.root,offsets:lesson.application??lesson.phrase,name:noteName(lesson.root)+' 中心短句'}];
  const applicationPitches=progression.flatMap(c=>c.offsets.map(n=>c.root+n));
  const application=flexibleRoute(applicationPitches,settings,5);
  const missing=[...new Set([...phrase,...applicationPitches,...cards.flatMap(c=>[c.from,c.to])])].filter(m=>!positions(m,settings).length);
  return {lesson,phrase,cards,routes,application,progression,missing,anchors:nearestPositions(lesson.root,settings,3)};
}
export function freshLesson(state:PracticeState):PracticeState {return {...state,step:0,card:0,answers:[],routeRounds:[],loops:0,located:false,finished:false};}
export function validateState(value:unknown):value is PracticeState {
  if(!value||typeof value!=='object')return false;
  const v=value as PracticeState,s=v.settings;
  const isTuning=(a:unknown):a is number[]=>Array.isArray(a)&&a.length===5&&a.every((n,i)=>Number.isInteger(n)&&n>=18&&n<=55&&(i===0||n>a[i-1]));
  return !!s&&isTuning(s.tuning)&&(s.previousTuning===null||isTuning(s.previousTuning))&&[20,21,22,24].includes(s.frets)&&Number.isInteger(s.bpm)&&s.bpm>=40&&s.bpm<=120&&Number.isInteger(v.lesson)&&v.lesson>=1&&v.lesson<=10000&&Number.isInteger(v.step)&&v.step>=0&&v.step<4&&Number.isInteger(v.card)&&v.card>=0&&v.card<=9&&Array.isArray(v.answers)&&v.answers.length<=10&&v.answers.every(n=>typeof n==='boolean')&&Array.isArray(v.routeRounds)&&v.routeRounds.length<=3&&v.routeRounds.every(n=>Number.isInteger(n)&&n>=0&&n<=2)&&Number.isInteger(v.loops)&&v.loops>=0&&v.loops<=3&&typeof v.located==='boolean'&&typeof v.finished==='boolean'&&Array.isArray(v.history)&&v.history.length<=120&&v.history.every(h=>Number.isInteger(h.lesson)&&h.lesson>0&&typeof h.date==='string'&&h.date.length<40&&Number.isInteger(h.correct)&&h.correct>=0&&h.correct<=10&&Number.isInteger(h.bpm)&&h.bpm>=40&&h.bpm<=120);
}
