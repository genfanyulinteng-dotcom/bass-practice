import {harmonyTones,type DegreeContext} from './degree-engine';
export type JamFrame={bar:number;beat:number;countIn:boolean;contextIndex:number;done:boolean};
export class JamAudio{
 context:AudioContext|null=null;nodes=new Set<AudioScheduledSourceNode>();callbacks=new Set<ReturnType<typeof setTimeout>>();scheduler:ReturnType<typeof setInterval>|null=null;generation=0;master:GainNode|null=null;
 stop(){this.generation++;if(this.scheduler)clearInterval(this.scheduler);this.scheduler=null;for(const timer of this.callbacks)clearTimeout(timer);this.callbacks.clear();for(const node of this.nodes){try{node.stop();}catch{}}this.nodes.clear();}
 dispose(){this.stop();void this.context?.close();this.context=null;}
 private tone(midi:number,time:number,duration:number,volume:number,kind:OscillatorType='triangle',frequency=false){if(!this.context||!this.master)return;const ctx=this.context,o=ctx.createOscillator(),g=ctx.createGain();o.type=kind;o.frequency.setValueAtTime(frequency?midi:440*2**((midi-69)/12),time);g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.008);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(this.master);o.start(time);o.stop(time+duration+.02);this.nodes.add(o);o.onended=()=>{o.disconnect();g.disconnect();this.nodes.delete(o);};}
 private drum(time:number,kick:boolean,accent:boolean){this.tone(kick?68:1100,time,kick?.15:.035,accent?.12:.055,'sine',true);}
 async start(contexts:DegreeContext[],bpm:number,bars:number,onFrame:(frame:JamFrame)=>void,options:{changeEvery?:number;harmony?:boolean;volume?:number;rhythm?:'straight'|'332'}={}){
  this.stop();const generation=this.generation;
  if(!contexts.length||bpm<40||bpm>160||bars<1)throw Error('Invalid Jam parameters');
  this.context??=new AudioContext();if(this.context.state==='suspended')await this.context.resume();if(generation!==this.generation)return;
  const ctx=this.context;this.master?.disconnect();this.master=ctx.createGain();this.master.gain.value=Math.max(0,Math.min(1,options.volume??.55));this.master.connect(ctx.destination);
  const seconds=60/bpm,total=4+bars*4,changeEvery=options.changeEvery??4;let beatNumber=0,nextTime=ctx.currentTime+.1;
  const notify=(frame:JamFrame,time:number)=>{const timer=setTimeout(()=>{this.callbacks.delete(timer);if(generation===this.generation)onFrame(frame);},Math.max(0,(time-ctx.currentTime)*1000));this.callbacks.add(timer);};
  const schedule=()=>{if(generation!==this.generation)return;while(nextTime<ctx.currentTime+.15&&beatNumber<total){const intro=beatNumber<4,index=beatNumber-4,bar=Math.max(0,Math.floor(index/4)),beat=intro?beatNumber:index%4,contextIndex=Math.floor(bar/changeEvery)%contexts.length;
    if(intro)this.tone(beat===0?1200:850,nextTime,.05,.1,'sine',true);
    else {const c=contexts[contextIndex];this.drum(nextTime,beat===0||beat===2,beat===0);if(options.rhythm==='332'){for(let h=0;h<2;h++){const eighth=beat*2+h;this.tone([0,3,6].includes(eighth)?1600:950,nextTime+h*seconds/2,.035,[0,3,6].includes(eighth)?.11:.025,'sine',true);}}else this.tone(950,nextTime+seconds/2,.025,.025,'sine',true);
     if(beat===0){this.tone(c.rootMidi-12,nextTime,seconds*3.85,.18,'sine');if(options.harmony){for(const n of harmonyTones(c)){this.tone(n.midi+12,nextTime,seconds*3.4,.035);}}}
    }
    notify({bar,beat,countIn:intro,contextIndex,done:false},nextTime);beatNumber++;nextTime+=seconds;
   }
   if(beatNumber===total){if(this.scheduler)clearInterval(this.scheduler);this.scheduler=null;notify({bar:bars-1,beat:3,countIn:false,contextIndex:Math.floor((bars-1)/changeEvery)%contexts.length,done:true},nextTime);}
  };
  this.scheduler=setInterval(schedule,25);schedule();
 }
}
