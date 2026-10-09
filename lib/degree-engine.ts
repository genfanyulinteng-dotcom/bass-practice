export type MapConfig={tonicPc:number;strategy:'relative'|'parallel';modeIndex:number;fromFret:number;toFret:number;scaleId?:string};
export const ROOT_OPTIONS=[{pc:0,name:'C'},{pc:1,name:'D♭'},{pc:2,name:'D'},{pc:3,name:'E♭'},{pc:4,name:'E'},{pc:5,name:'F'},{pc:6,name:'F♯'},{pc:7,name:'G'},{pc:8,name:'A♭'},{pc:9,name:'A'},{pc:10,name:'B♭'},{pc:11,name:'B'}];
type Scale={id:string;name:string;offsets:number[];degrees:string[];characteristic:string[];family:string;passing?:string[];harmonyDegrees?:string[];hint?:string};
export const SCALE_CATALOG:Scale[]=[
 {id:'ionian',name:'大调 / Ionian',offsets:[0,2,4,5,7,9,11],degrees:['1','2','3','4','5','6','7'],characteristic:['3','7'],family:'大调家族'},
 {id:'dorian',name:'Dorian 多利亚',offsets:[0,2,3,5,7,9,10],degrees:['1','2','♭3','4','5','6','♭7'],characteristic:['6','♭3'],family:'大调家族'},
 {id:'phrygian',name:'Phrygian 弗里几亚',offsets:[0,1,3,5,7,8,10],degrees:['1','♭2','♭3','4','5','♭6','♭7'],characteristic:['♭2'],family:'大调家族'},
 {id:'lydian',name:'Lydian 利底亚',offsets:[0,2,4,6,7,9,11],degrees:['1','2','3','♯4','5','6','7'],characteristic:['♯4'],family:'大调家族'},
 {id:'mixolydian',name:'Mixolydian 混合利底亚',offsets:[0,2,4,5,7,9,10],degrees:['1','2','3','4','5','6','♭7'],characteristic:['♭7','3'],family:'大调家族'},
 {id:'aeolian',name:'Aeolian 自然小调',offsets:[0,2,3,5,7,8,10],degrees:['1','2','♭3','4','5','♭6','♭7'],characteristic:['♭6','♭3'],family:'大调家族'},
 {id:'locrian',name:'Locrian 洛克里亚',offsets:[0,1,3,5,6,8,10],degrees:['1','♭2','♭3','4','♭5','♭6','♭7'],characteristic:['♭5','♭2'],family:'大调家族'},
 {id:'melodic-minor',name:'爵士旋律小调',offsets:[0,2,3,5,7,9,11],degrees:['1','2','♭3','4','5','6','7'],characteristic:['6','7','♭3'],family:'旋律小调家族'},
 {id:'harmonic-minor',name:'和声小调',offsets:[0,2,3,5,7,8,11],degrees:['1','2','♭3','4','5','♭6','7'],characteristic:['♭6','7'],family:'和声小调家族'},
 {id:'lydian-dominant',name:'Lydian dominant 利底亚属',offsets:[0,2,4,6,7,9,10],degrees:['1','2','3','♯4','5','6','♭7'],characteristic:['♯4','♭7'],family:'旋律小调家族'},
 {id:'altered',name:'Altered 变化属音阶',offsets:[0,1,3,4,6,8,10],degrees:['1','♭2','♯2','3','♭5','♯5','♭7'],characteristic:['♭2','♯2','♭5','♯5'],family:'旋律小调家族',harmonyDegrees:['3','♭7'],hint:'旋律小调第 7 模式；此处按变化属和弦记作 ♯2、3、♯5 等。先听 3、♭7 骨架，再把张力音解决到下一和弦。'},
 {id:'phrygian-dominant',name:'Phrygian dominant 弗里几亚属',offsets:[0,1,4,5,7,8,10],degrees:['1','♭2','3','4','5','♭6','♭7'],characteristic:['♭2','3'],family:'和声小调家族'},
 {id:'whole-tone',name:'全音音阶',offsets:[0,2,4,6,8,10],degrees:['1','2','3','♯4','♯5','♭7'],characteristic:['♯4','♯5'],family:'对称集合'},
 {id:'diminished-half-whole',name:'半全减音阶 / 八音集',offsets:[0,1,3,4,6,7,9,10],degrees:['1','♭2','♯2','3','♯4','5','6','♭7'],characteristic:['♭2','♯2','♯4'],family:'对称集合'},
 {id:'dorian-flat2',name:'Dorian ♭2 / 多利亚降二',offsets:[0,1,3,5,7,9,10],degrees:['1','♭2','♭3','4','5','6','♭7'],characteristic:['♭2','6'],family:'旋律小调家族',hint:'旋律小调第 2 模式；对比 Dorian，只把 2 降为 ♭2。'},
 {id:'lydian-augmented',name:'Lydian ♯5 / 利底亚增五',offsets:[0,2,4,6,8,9,11],degrees:['1','2','3','♯4','♯5','6','7'],characteristic:['♯4','♯5'],family:'旋律小调家族',hint:'旋律小调第 3 模式；对比 Lydian，只把 5 升为 ♯5。'},
 {id:'mixolydian-flat6',name:'Mixolydian ♭6 / 混合利底亚降六',offsets:[0,2,4,5,7,8,10],degrees:['1','2','3','4','5','♭6','♭7'],characteristic:['3','♭6'],family:'旋律小调家族',hint:'旋律小调第 5 模式；对比 Mixolydian，只把 6 降为 ♭6。'},
 {id:'locrian-natural2',name:'Locrian ♮2 / 洛克里亚还原二',offsets:[0,2,3,5,6,8,10],degrees:['1','2','♭3','4','♭5','♭6','♭7'],characteristic:['2','♭5'],family:'旋律小调家族',hint:'旋律小调第 6 模式；对比 Locrian，把 ♭2 还原为 2。常用于半减和弦语境。'},
 {id:'locrian-natural6',name:'Locrian ♮6 / 洛克里亚还原六',offsets:[0,1,3,5,6,9,10],degrees:['1','♭2','♭3','4','♭5','6','♭7'],characteristic:['6','♭5'],family:'和声小调家族',hint:'和声小调第 2 模式；对比 Locrian，把 ♭6 还原为 6。'},
 {id:'ionian-augmented',name:'Ionian ♯5 / 大调增五',offsets:[0,2,4,5,8,9,11],degrees:['1','2','3','4','♯5','6','7'],characteristic:['♯5','7'],family:'和声小调家族',hint:'和声小调第 3 模式；对比大调，只把 5 升为 ♯5。'},
 {id:'dorian-sharp4',name:'Dorian ♯4 / 多利亚升四',offsets:[0,2,3,6,7,9,10],degrees:['1','2','♭3','♯4','5','6','♭7'],characteristic:['♯4','6'],family:'和声小调家族',hint:'和声小调第 4 模式；对比 Dorian，只把 4 升为 ♯4。'},
 {id:'lydian-sharp2',name:'Lydian ♯2 / 利底亚升二',offsets:[0,3,4,6,7,9,11],degrees:['1','♯2','3','♯4','5','6','7'],characteristic:['♯2','♯4'],family:'和声小调家族',hint:'和声小调第 6 模式；对比 Lydian，只把 2 升为 ♯2。'},
 {id:'ultralocrian',name:'Ultralocrian / 超洛克里亚降七',offsets:[0,1,3,4,6,8,9],degrees:['1','♭2','♭3','♭4','♭5','♭6','♭♭7'],characteristic:['♭4','♭♭7'],family:'和声小调家族',harmonyDegrees:['♭3','♭♭7'],hint:'和声小调第 7 模式；也称 Super Locrian ♭♭7。♭♭7 与 6 等音，但拼写保留减七和弦关系。'},
 {id:'major-pentatonic',name:'大调五声音阶',offsets:[0,2,4,7,9],degrees:['1','2','3','5','6'],characteristic:['3','6'],family:'五声与布鲁斯',harmonyDegrees:['3','6'],hint:'从大调移去 4、7。先用 1、3、5 组织一句，再加入 2、6。'},
 {id:'minor-pentatonic',name:'小调五声音阶',offsets:[0,3,5,7,10],degrees:['1','♭3','4','5','♭7'],characteristic:['♭3','♭7'],family:'五声与布鲁斯',hint:'从自然小调移去 2、♭6。先用三音短句，再把它移到另一组弦。'},
 {id:'major-blues',name:'大调布鲁斯音阶',offsets:[0,2,3,4,7,9],degrees:['1','2','♭3','3','5','6'],characteristic:['3','6'],passing:['♭3'],family:'五声与布鲁斯',harmonyDegrees:['3','6'],hint:'大调五声加 ♭3。先练 2→♭3→3 的连接，听清小三度与大三度的张力；这里的平均律音符是练习近似。'},
 {id:'minor-blues',name:'小调布鲁斯音阶',offsets:[0,3,5,6,7,10],degrees:['1','♭3','4','♭5','5','♭7'],characteristic:['♭3','♭7'],passing:['♭5'],family:'五声与布鲁斯',hint:'小调五声加 ♭5。先练 4→♭5→5，再把这个连接放回短句，不把所有音都当同样稳定。'},
 {id:'bebop-dominant',name:'属 Bebop 音阶',offsets:[0,2,4,5,7,9,10,11],degrees:['1','2','3','4','5','6','♭7','7'],characteristic:['3','♭7'],passing:['7'],family:'Bebop 经过音',harmonyDegrees:['3','♭7'],hint:'Mixolydian 加 7 作为经过音。先用连续八分音符下行 1→7→♭7→6，听强拍落点；不要把 7 当作伴奏的稳定大七度。'},
 {id:'bebop-major',name:'大调 Bebop 音阶',offsets:[0,2,4,5,7,8,9,11],degrees:['1','2','3','4','5','♭6','6','7'],characteristic:['3','6'],passing:['♭6'],family:'Bebop 经过音',harmonyDegrees:['3','6'],hint:'大调加 ♭6 作为经过音。先练 6→♭6→5 的连续八分音符，注意和弦音落在哪一拍。'},
 {id:'diminished-whole-half',name:'全半减音阶 / 八音集',offsets:[0,2,3,5,6,8,9,11],degrees:['1','2','♭3','4','♭5','♭6','♭♭7','7'],characteristic:['♭5','♭♭7'],family:'对称集合',harmonyDegrees:['♭3','♭♭7'],hint:'全音与半音交替；先听 1–♭3–♭5–♭♭7 的减七和弦骨架，与半全减的属和弦语境分开比较。'},
 {id:'harmonic-major',name:'和声大调 / Ionian ♭6',offsets:[0,2,4,5,7,8,11],degrees:['1','2','3','4','5','♭6','7'],characteristic:['3','♭6'],family:'其他七声色彩',hint:'大调只降低 6。保留大三度，听 ♭6 与 7 之间的增二度；先与同主音大调比较。'},
 {id:'double-harmonic',name:'双和声大调',offsets:[0,1,4,5,7,8,11],degrees:['1','♭2','3','4','5','♭6','7'],characteristic:['♭2','♭6'],family:'其他七声色彩',hint:'和声大调再降低 2。先听 ♭2→1，再听 ♭6→5；此处是十二平均律音集，不代替特定文化的调式实践。'},
 {id:'hungarian-minor',name:'匈牙利小调 / 和声小调 ♯4',offsets:[0,2,3,6,7,8,11],degrees:['1','2','♭3','♯4','5','♭6','7'],characteristic:['♯4','7'],family:'其他七声色彩',hint:'和声小调升高 4；也是双和声大调第 4 模式。先在小三度骨架上加入 ♯4，再解决到 5。'},
];
export const SCALE_FAMILIES=['大调家族','旋律小调家族','和声小调家族','五声与布鲁斯','Bebop 经过音','对称集合','其他七声色彩'];
export const MODE_NAMES=SCALE_CATALOG.slice(0,7).map(s=>s.name);
const mod=(n:number)=>((n%12)+12)%12, letters=['C','D','E','F','G','A','B'],naturals=[0,2,4,5,7,9,11];
export function spellNote(rootName:string,degree:string,pc:number){const step=Number(degree.replace(/[^0-9]/g,''))-1;const letterIndex=(letters.indexOf(rootName[0])+step)%7;let delta=mod(pc-naturals[letterIndex]);if(delta>6)delta-=12;return letters[letterIndex]+(delta<0?'♭'.repeat(-delta):'♯'.repeat(delta));}
export type ContextNote={midi:number;pc:number;name:string;degree:string;parentDegree:string};
export type DegreeContext={rootMidi:number;rootName:string;modeId:string;modeName:string;parentName:string;notes:ContextNote[];characteristic:string[]};
export function getContext(config:MapConfig):DegreeContext{
 const parent=ROOT_OPTIONS.find(r=>r.pc===mod(config.tonicPc))??ROOT_OPTIONS[0];
 const base=SCALE_CATALOG[Math.max(0,Math.min(6,config.modeIndex))];
 const scale=config.strategy==='relative'?base:SCALE_CATALOG.find(s=>s.id===config.scaleId)??base;
 const parentPcs=SCALE_CATALOG[0].offsets.map(n=>mod(n+parent.pc));
 const rootPc=config.strategy==='relative'?parentPcs[config.modeIndex]:parent.pc;
 const rootName=config.strategy==='relative'?spellNote(parent.name,String(config.modeIndex+1),rootPc):parent.name;
 const rootMidi=36+rootPc;
 const notes=scale.offsets.map((offset,i)=>{const midi=rootMidi+offset,pc=mod(midi);return {midi,pc,name:spellNote(rootName,scale.degrees[i],pc),degree:scale.degrees[i],parentDegree:config.strategy==='relative'?String(parentPcs.indexOf(pc)+1):'—'};});
 return {rootMidi,rootName,modeId:scale.id,modeName:scale.name,parentName:parent.name+' 大调',notes,characteristic:scale.characteristic};
}
export function toRelativeConfig(config:MapConfig):MapConfig|null{
 const context=getContext(config),modeIndex=SCALE_CATALOG.slice(0,7).findIndex(s=>s.id===context.modeId);
 if(modeIndex<0)return null;
 return {...config,strategy:'relative',tonicPc:mod(context.rootMidi-SCALE_CATALOG[0].offsets[modeIndex]),modeIndex,scaleId:undefined};
}
export function harmonyTones(context:DegreeContext){
 const scale=SCALE_CATALOG.find(s=>s.id===context.modeId);
 const degrees=scale?.harmonyDegrees??[context.notes.some(n=>n.degree==='3')?'3':'♭3',context.notes.some(n=>n.degree==='7')?'7':context.notes.some(n=>n.degree==='♭7')?'♭7':'♭♭7'];
 return degrees.flatMap(degree=>{const note=context.notes.find(n=>n.degree===degree);return note?[note]:[];});
}
export function sameCollectionModes(config:MapConfig){
 const context=getContext(config);
 return context.notes.flatMap(root=>{
  const offsets=context.notes.map(n=>mod(n.pc-root.pc)).sort((a,b)=>a-b).join(',');
  return SCALE_CATALOG.filter(s=>s.offsets.join(',')===offsets).map(scale=>{
   const index=SCALE_CATALOG.indexOf(scale);
   const next:MapConfig={...config,strategy:'parallel',tonicPc:root.pc,scaleId:scale.id,modeIndex:index<7?index:config.modeIndex};
   return {config:next,context:getContext(next)};
  });
 });
}
export function positionsForContext(context:DegreeContext,tuning:number[],fromFret:number,toFret:number){return tuning.flatMap((open,s)=>Array.from({length:toFret-fromFret+1},(_,i)=>{const f=fromFret+i,midi=open+f,note=context.notes.find(n=>n.pc===mod(midi));return note?{s,f,midi,degree:note.degree,name:note.name,parentDegree:note.parentDegree}:null;})).filter((p):p is NonNullable<typeof p>=>p!==null);}
export function upperTriad(context:DegreeContext,startDegreeIndex:number){
 if(context.notes.length!==7||context.modeId==='altered')return null;
 const start=((startDegreeIndex%7)+7)%7;
 const tones=[0,2,4].map(offset=>{const i=start+offset,n=context.notes[i%7];return {midi:n.midi+12*Math.floor(i/7),name:n.name,degree:n.degree};});
 const intervals=tones.map(n=>n.midi-tones[0].midi).join(',');
 const suffix:Record<string,string>={'0,4,7':' 大三和弦','0,3,7':' 小三和弦','0,3,6':' 减三和弦','0,4,8':' 增三和弦'};
 return {name:tones[0].name+(suffix[intervals]??' 三音结构'),tones};
}
