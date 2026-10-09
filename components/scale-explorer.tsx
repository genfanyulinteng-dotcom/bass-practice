'use client';
import {useMemo,useState} from 'react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogTrigger} from '@/components/ui/dialog';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {Volume2} from 'lucide-react';
import {Fretboard} from '@/components/fretboard';
import {Settings,makeRoutes,noteName,posLabel} from '@/lib/practice';
import {SCALES,scaleNote} from '@/lib/scales';
export function ScaleExplorer({settings,onPlay,onStop,onStart,disabled}:{settings:Settings;onPlay:(notes:number[],tonic?:number)=>void;onStop:()=>void;onStart:(lesson:number)=>void;disabled:boolean}){
 const [open,setOpen]=useState(false),[id,setId]=useState('ionian'),[routeIndex,setRouteIndex]=useState(0);
 const scale=SCALES.find(s=>s.id===id)!;
 const pitches=scale.offsets.map(n=>36+n);
 const routes=useMemo(()=>makeRoutes(pitches,settings,pitches.length===8?[[3,3,2],[4,4],[5,3]]:[[3,3],[4,2],[5,1]]),[id,settings]);
 const route=routes[Math.min(routeIndex,Math.max(0,routes.length-1))];
 return <Dialog open={open} onOpenChange={value=>{setOpen(value);if(!value)onStop();}}><DialogTrigger asChild><Button variant="outline" disabled={disabled}>音阶与调式</Button></DialogTrigger><DialogContent className="scale-dialog"><DialogHeader><DialogTitle>音阶与调式</DialogTitle><DialogDescription>全部以 C 为主音。先听主音持续音，再听特色音；改变分弦时保持同一串实际音高。</DialogDescription></DialogHeader><Select value={id} onValueChange={value=>{onStop();setId(value);setRouteIndex(0);}}><SelectTrigger className="scale-select" aria-label="音阶或调式"><SelectValue/></SelectTrigger><SelectContent>{SCALES.map(s=><SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><div className="scale-degrees">{scale.degrees.map((degree,i)=><span key={i}><strong>{degree}</strong><small>{scaleNote(pitches[i],36,id)??noteName(pitches[i])}</small></span>)}</div><div className="scale-focus"><strong>关注 {scale.feature}</strong><p>{scale.hint}</p></div><div className="actions"><Button variant="secondary" onClick={()=>onPlay(pitches,36)}><Volume2 size={16}/>主音 + 音阶试听</Button><Button variant="secondary" onClick={()=>onPlay(scale.phrase.map(n=>36+n),36)}><Volume2 size={16}/>听特色音短句</Button><Button variant="ghost" onClick={onStop}>停止</Button></div>{routes.length?<><Tabs value={String(routeIndex)} onValueChange={v=>{onStop();setRouteIndex(Number(v));}}><TabsList className="route-tabs">{routes.map((r,i)=><TabsTrigger key={i} value={String(i)}>{r.name.replace(' 分弦','')}</TabsTrigger>)}</TabsList></Tabs><ol className="scale-positions">{route.notes.map((n,i)=><li key={i}><strong>{scaleNote(n.midi,36,id)??noteName(n.midi)}</strong><span>{posLabel(n,settings.tuning)}</span></li>)}</ol><Fretboard notes={route.notes} settings={settings}/></>:<p className="status-error">当前定弦无法完整演奏这一音域，请核对设置。</p>}<div className="actions"><Button disabled={!routes.length} onClick={()=>{onStop();onStart(scale.lesson);setOpen(false);}}>从对应课次开始练</Button><span className="small-hint muted">会重新开始本次任务；已有完成记录保留。</span></div><a className="scale-source" href="https://online.berklee.edu/takenote/music-modes-major-and-minor/" target="_blank" rel="noreferrer">调式关系参考：Berklee Online</a></DialogContent></Dialog>;
}
