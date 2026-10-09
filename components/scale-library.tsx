import {SCALE_CATALOG,SCALE_FAMILIES} from '@/lib/degree-engine';
export function ScaleOptions(){return <>{SCALE_FAMILIES.map(family=><optgroup key={family} label={family}>{SCALE_CATALOG.filter(s=>s.family===family).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>)}</>;}
export function ScaleSummary({id}:{id:string}){
 const scale=SCALE_CATALOG.find(s=>s.id===id);if(!scale)return null;
 const hint=scale.hint??(scale.family==='旋律小调家族'?'本工具采用上下行相同的爵士旋律小调材料。先选一个特色音，与熟悉的同主音调式比较。':scale.family==='和声小调家族'?'先唱根音与特色音，再与同主音自然小调或熟悉调式比较。':scale.family==='对称集合'?'先用持续音建立练习参照，再听三音动机。音集的对称性本身不能证明唯一主音。':'先听一个特色音与根音的关系，再把短句放到另一组弦。');
 return <div className="scale-summary"><span className="lab-kicker">{scale.family} · {scale.offsets.length} 音</span><p><strong>音级公式：</strong>{scale.degrees.join(' · ')}</p><p>{hint}</p>{scale.passing?.length&&<p><strong>本练习先作经过音：</strong>{scale.passing.join('、')}。地图保留这些音，但伴奏骨架不会直接把它们当稳定和弦音。</p>}<p className="lab-small">这些是练习用的音高材料；放到实际和弦与节奏里，音的作用仍要靠听觉判断。</p></div>;
}
