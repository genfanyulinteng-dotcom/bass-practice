'use client';
import {useEffect,useRef,useState} from 'react';
import PracticeApp from '@/app/practice-app';
import {DEFAULT_STATE,validateState,type Settings} from '@/lib/practice';
import {DEFAULT_LAB,validateLab,type LabState} from '@/lib/lab-state';
import {DegreeLab} from '@/components/degree-lab';
import {TransitionLab} from '@/components/transition-lab';
import {TheoryGuide} from '@/components/theory-guide';
import {StudyPlan} from '@/components/study-plan';
import {SourceLab} from '@/components/source-lab';
export function LocalWorkbench(){
 const [view,setView]=useState(()=>typeof window!=='undefined'&&['plan','daily','map','jam','source','theory'].includes(window.location.hash.slice(1))?window.location.hash.slice(1):'plan'),[settings,setSettings]=useState<Settings>(DEFAULT_STATE.settings),[state,setState]=useState<LabState>(structuredClone(DEFAULT_LAB));
 const [ready,setReady]=useState(false),[error,setError]=useState(''),[status,setStatus]=useState('读取进度…');
 const current=useRef(state),queue=useRef(Promise.resolve()),serial=useRef(0);
 async function load(){setError('');try{const [a,b]=await Promise.all([fetch('/api/lab',{cache:'no-store'}),fetch('/api/practice',{cache:'no-store'})]);const [lab,practice]=await Promise.all([a.json(),b.json()]);if(!a.ok||!validateLab(lab))throw Error((lab as {error?:string}).error||'音级练习进度无法读取。');if(!b.ok||!validateState(practice))throw Error('定弦设置无法读取。');current.current=lab;setState(lab);setSettings(practice.settings);setReady(true);setStatus('已保存到本机');}catch(e){setError(e instanceof Error?e.message:'读取失败。');}}
 useEffect(()=>{void load();},[]);
 function save(next:LabState){if(!ready)return;current.current=next;setState(next);setStatus('保存中…');const id=++serial.current;queue.current=queue.current.catch(()=>{}).then(async()=>{const r=await fetch('/api/lab',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(next)});if(!r.ok){const body=await r.json();throw Error((body as {error?:string}).error||'保存失败。');}if(id===serial.current){setStatus('已保存到本机');setError('');}}).catch(e=>{setStatus('尚未保存');setError(e.message);});}
 async function navigate(next:string){if(view==='daily'&&next!=='daily'){try{const r=await fetch('/api/practice',{cache:'no-store'}),s=await r.json();if(!r.ok||!validateState(s))throw Error('请先确认每日路线的设置已保存。');setSettings(s.settings);}catch(e){setError(e instanceof Error?e.message:'读取设置失败');return;}}setView(next);window.history.replaceState(null,'','#'+next);}
 return <><nav className="lab-navigation" aria-label="练习模块"><div><strong>五弦贝斯 · 本地工作台</strong><div>{[['plan','练习顺序'],['daily','每日路线'],['map','音级地图'],['jam','转换与 Jam'],['source','陌生素材'],['theory','怎样思考']].map(([key,label])=><button key={key} aria-current={view===key?'page':undefined} onClick={()=>void navigate(key)}>{label}</button>)}</div></div></nav>{view==='daily'?<PracticeApp/>:<main className="lab-shell"><div className="lab-topline"><span>定弦与琴品沿用「每日路线」右上角设置</span><span>{status}</span></div>{error&&<div className="lab-error" role="alert">{error}<button onClick={()=>ready?save(current.current):void load()}>重试</button></div>}{!ready?<p>正在读取本机练习进度…</p>:view==='plan'?<StudyPlan state={state} onChange={save} onOpen={next=>{setView(next);window.history.replaceState(null,'','#'+next);}}/>:view==='map'?<DegreeLab state={state} settings={settings} onChange={save} onJam={()=>void navigate('jam')}/>:view==='jam'?<TransitionLab state={state} settings={settings} onChange={save}/>:view==='source'?<SourceLab onMap={config=>{save({...state,config,stage:0});void navigate('map');}}/>:<TheoryGuide onMap={()=>void navigate('map')} onJam={()=>void navigate('jam')}/>}</main>}</>;
}
