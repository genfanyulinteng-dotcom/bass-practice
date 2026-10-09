const assert=require('node:assert/strict'),path=require('path'),esbuild=require('esbuild');
for(const [entry,name] of [['audio.ts','audio'],['jam-audio.ts','jam-audio']])esbuild.buildSync({entryPoints:[path.join(__dirname,'../lib',entry)],bundle:true,platform:'node',format:'cjs',outfile:path.join(__dirname,'.tmp-'+name+'-module.cjs')});
let contexts=[];
class Param{setValueAtTime(){}linearRampToValueAtTime(){}exponentialRampToValueAtTime(){}}
class FakeContext{constructor(){this.state='suspended';this.currentTime=0;this.destination={};this.starts=[];contexts.push(this);}resume(){return new Promise(resolve=>{this.resolve=()=>{this.state='running';resolve();};});}close(){return Promise.resolve();}createGain(){return {gain:new Param(),connect(){},disconnect(){}};}createOscillator(){const owner=this;return {frequency:new Param(),connect(){},disconnect(){},start(time){owner.starts.push(time);},stop(){}};}}
global.AudioContext=FakeContext;
const {PracticeAudio}=require('./.tmp-audio-module.cjs'),{JamAudio}=require('./.tmp-jam-audio-module.cjs');
(async()=>{const p=new PracticeAudio();let done=p.play([36,40],60,()=>{});p.stop();contexts.at(-1).resolve();await done;assert.equal(contexts.at(-1).starts.length,0,'Stopped pending melody resumed');p.dispose();
const m=new PracticeAudio();done=m.startMetronome(60,()=>{});m.stopMetronome();contexts.at(-1).resolve();await done;assert.equal(contexts.at(-1).starts.length,0,'Stopped pending metronome resumed');m.dispose();
const j=new JamAudio();const c={rootMidi:36,notes:[{midi:36,degree:'1'},{midi:40,degree:'3'},{midi:46,degree:'♭7'}]};done=j.start([c],120,8,()=>{});j.stop();contexts.at(-1).resolve();await done;assert.equal(contexts.at(-1).starts.length,0,'Stopped pending Jam resumed');j.dispose();
const scheduled=new PracticeAudio();done=scheduled.startMetronome(120,()=>{});contexts.at(-1).resolve();await done;assert.equal(contexts.at(-1).starts[0],.06);scheduled.dispose();
console.log(JSON.stringify({result:'PASS',checks:['pending melody cancellation','pending metronome cancellation','pending Jam cancellation','audio-clock lookahead starts']}));})().catch(e=>{console.error(e);process.exit(1);});
