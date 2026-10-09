'use client';
import {useEffect,useRef,useState} from 'react';
import {Position,Settings,noteName,posLabel} from '@/lib/practice';
export function Fretboard({notes,settings,active=-1}:{notes:Position[];settings:Settings;active?:number}){
 const box=useRef<HTMLDivElement>(null),[width,setWidth]=useState(720);
 useEffect(()=>{const el=box.current;if(!el)return;const ro=new ResizeObserver(()=>setWidth(el.clientWidth));ro.observe(el);return()=>ro.disconnect();},[]);
 if(!notes.length)return null;
 const low=Math.max(0,Math.min(...notes.map(n=>n.f))-1),high=Math.min(settings.frets,Math.max(...notes.map(n=>n.f))+1);
 const columns=width<480?8:width<680?12:24;
 const panels:number[][]=[];for(let start=low;start<=high;start+=columns)panels.push([start,Math.min(high,start+columns-1)]);
 return <div className="fretboard" ref={box}><div className="diagram-label"><span>高音弦在上 · 数字为首次落点顺序，完整重复顺序见音符列表</span><span>5弦最低，1弦最高</span></div>{panels.map(([first,last])=>{
 const w=Math.max(width,260),dx=(w-68)/(last-first+1),x=(f:number)=>54+(f-first+.5)*dx;
 const unique=[...new Map(notes.filter(n=>n.f>=first&&n.f<=last).map(n=>[`${n.s}-${n.f}`,n])).values()];
 return <svg key={first} viewBox={`0 0 ${w} 222`} role="img" aria-label={notes.map((n,i)=>`${i+1}：${noteName(n.midi)}，${posLabel(n,settings.tuning)}`).join('；')}>
 {Array.from({length:last-first+1},(_,i)=>i+first).map(f=><g key={f}><text x={x(f)} y={18} textAnchor="middle" className="fret-label">{f}</text><line x1={x(f)} x2={x(f)} y1={31} y2={205}/></g>)}
 {[4,3,2,1,0].map((s,i)=><g key={s}><text x={4} y={49+i*38} className="string-label">{5-s} · {noteName(settings.tuning[s]).replace(/\d/g,'')}</text><line x1={49} x2={w-6} y1={44+i*38} y2={44+i*38} strokeWidth={.7+i*.3}/></g>)}
 {unique.map(n=>{const indices=notes.flatMap((p,i)=>p.s===n.s&&p.f===n.f?[i]:[]);const selected=indices.includes(active);return <g key={`${n.s}-${n.f}`}><circle cx={x(n.f)} cy={44+(4-n.s)*38} r={13} className={selected?'playing':indices.includes(0)?'origin':'destination'}/><text x={x(n.f)} y={49+(4-n.s)*38} textAnchor="middle" className="note-index">{selected?active+1:indices[0]+1}</text></g>;})}
 </svg>;
 })}</div>;
}
