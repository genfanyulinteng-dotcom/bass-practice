export const SCALES = [
 {id:'ionian',name:'伊奥尼亚 / 大调',offsets:[0,2,4,5,7,9,11,12],degrees:['1','2','3','4','5','6','7','1'],feature:'3 与 7',hint:'先听主音 C，再听大三度 E 与大七度 B。',phrase:[0,4,7,11,12,7,4,0],lesson:29},
 {id:'aeolian',name:'自然小调 Aeolian',offsets:[0,2,3,5,7,8,10,12],degrees:['1','2','♭3','4','5','♭6','♭7','1'],feature:'♭3、♭6、♭7',hint:'主音仍是 C；注意 E♭、A♭、B♭，与同主音大调对照。',phrase:[0,3,7,8,10,8,7,0],lesson:30},
 {id:'major-pent',name:'大五声音阶',offsets:[0,2,4,7,9,12],degrees:['1','2','3','5','6','1'],feature:'1、2、3、5、6',hint:'保持 C 为中心，听 3 与 6；这组音省去了大调的 4、7。',phrase:[0,2,4,7,9,7,4,0],lesson:32},
 {id:'minor-pent',name:'小五声音阶',offsets:[0,3,5,7,10,12],degrees:['1','♭3','4','5','♭7','1'],feature:'1、♭3、4、5、♭7',hint:'保持 C 为中心，听 E♭ 与 B♭，并回到主音收尾。',phrase:[0,3,5,7,10,7,3,0],lesson:33},
 {id:'dorian',name:'多利亚 Dorian',offsets:[0,2,3,5,7,9,10,12],degrees:['1','2','♭3','4','5','6','♭7','1'],feature:'小三度 + 大六度',hint:'C 小调色彩中保留 A：相对自然小调，只有第六级升高。',phrase:[0,3,7,9,7,5,3,0],lesson:36},
 {id:'phrygian',name:'弗里几亚 Phrygian',offsets:[0,1,3,5,7,8,10,12],degrees:['1','♭2','♭3','4','5','♭6','♭7','1'],feature:'♭2',hint:'保持 C 为中心，反复听 D♭ 返回 C 的半音关系。',phrase:[0,1,0,3,5,3,1,0],lesson:37},
 {id:'lydian',name:'利底亚 Lydian',offsets:[0,2,4,6,7,9,11,12],degrees:['1','2','3','♯4','5','6','7','1'],feature:'♯4',hint:'保持 C 为中心，突出 F♯；不要弹回大调的 F。',phrase:[0,4,6,7,6,4,2,0],lesson:38},
 {id:'mixolydian',name:'混合利底亚 Mixolydian',offsets:[0,2,4,5,7,9,10,12],degrees:['1','2','3','4','5','6','♭7','1'],feature:'大三度 + 小七度',hint:'保持 C 为中心，听 E 与 B♭，与大调的 B 对照。',phrase:[0,4,7,10,9,7,4,0],lesson:39},
 {id:'locrian',name:'洛克里亚 Locrian',offsets:[0,1,3,5,6,8,10,12],degrees:['1','♭2','♭3','4','♭5','♭6','♭7','1'],feature:'♭2、♭5',hint:'以持续的 C 为参照，听 D♭ 与 G♭；主三和弦是减三和弦。',phrase:[0,1,3,6,5,3,1,0],lesson:40},
];
export function scaleById(id?:string){return SCALES.find(s=>s.id===id);}
export function scaleDegree(midi:number,root:number,id?:string){const scale=scaleById(id);if(!scale)return null;const offset=((midi-root)%12+12)%12;const index=scale.offsets.indexOf(offset);return index>=0?scale.degrees[index]:null;}
export function scaleNote(midi:number,root:number,id?:string){const degree=scaleDegree(midi,root,id);if(!degree||root%12!==0)return null;const letters=['C','D','E','F','G','A','B'];const number=Number(degree.replace(/[^1-7]/g,''))-1;const accidental=degree.includes('♭')?'♭':degree.includes('♯')?'♯':'';const octave=Math.floor(midi/12)-1;return letters[number]+accidental+octave;}
