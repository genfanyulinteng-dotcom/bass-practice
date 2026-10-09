const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'../dist/bass-practice'),data=path.join(__dirname,'.tmp-server-'+Date.now()),url='http://127.0.0.1:5176';
const {DEFAULT_STATE}=require(path.join(root,'engine.cjs'));
const {DEFAULT_LAB}=require(path.join(root,'lab-engine.cjs'));
let child;const errors=[];
async function start(){child=spawn(process.execPath,[path.join(root,'server.cjs')],{windowsHide:true,env:{...process.env,BASS_LOCAL_PORT:'5176',BASS_LOCAL_DATA_DIR:data},stdio:['ignore','pipe','pipe']});child.stderr.on('data',x=>errors.push(String(x)));for(let n=0;n<50;n++){try{const h=await fetch(url+'/health').then(r=>r.json());if(h.app==='bass-practice-local')return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error('Local test server not ready');}
async function stop(){const config=JSON.parse(fs.readFileSync(path.join(data,'server.json'),'utf8'));const done=new Promise(resolve=>child.once('exit',resolve));assert.equal((await fetch(url+'/__stop',{method:'POST',headers:{'X-Bass-Control':config.token}})).status,200);await done;}
async function put(state,headers={}){return fetch(url+'/api/practice',{method:'PUT',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(state)});}
async function putLab(state){return fetch(url+'/api/lab',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(state)});}
(async()=>{
 await start();assert.equal((await fetch(url)).status,200);
 const state={...structuredClone(DEFAULT_STATE),lesson:37,located:true};
 assert.equal((await put(state)).status,200);assert.deepEqual(await fetch(url+'/api/practice').then(r=>r.json()),state);
 const lab={...structuredClone(DEFAULT_LAB),guide:{level:4,checks:[true,false]},jamHistory:[{id:'qa-round',at:new Date().toISOString(),tonicPc:2,strategy:'parallel',modeIndex:1,bpm:70,bars:16,changes:true,selfChecks:[true,false,true,false],usedHints:false,blind:true,identified:1,centerCount:2}]};
 assert.equal((await putLab(lab)).status,200);assert.deepEqual(await fetch(url+'/api/lab').then(r=>r.json()),lab);
 for(const guide of [null,{level:7,checks:[false,false]},{level:1,checks:[false]}])assert.equal((await putLab({...lab,guide})).status,400);
 assert.deepEqual(await fetch(url+'/api/practice').then(r=>r.json()),state);
 assert.equal((await put({...state,lesson:0})).status,400);
 assert.equal((await put(state,{Origin:'https://example.com'})).status,403);
 assert.equal((await put(state,{'Content-Type':'text/plain'})).status,415);
 assert.equal((await fetch(url+'/__stop',{method:'POST'})).status,403);
 await stop();await start();assert.deepEqual(await fetch(url+'/api/practice').then(r=>r.json()),state);
 assert.deepEqual(await fetch(url+'/api/lab').then(r=>r.json()),lab);
 const nextLab={...lab,guide:{level:5,checks:[false,false]}};assert.equal((await putLab(nextLab)).status,200);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(data,'lab-progress.backup.json'),'utf8')),lab);
 fs.writeFileSync(path.join(data,'lab-progress.json'),'broken-lab');assert.equal((await fetch(url+'/api/lab')).status,503);assert.equal((await putLab(lab)).status,503);assert.equal(fs.readFileSync(path.join(data,'lab-progress.json'),'utf8'),'broken-lab');assert.deepEqual(await fetch(url+'/api/practice').then(r=>r.json()),state);
 const newer={...state,lesson:38};assert.equal((await put(newer)).status,200);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(data,'progress.backup.json'),'utf8')),state);
 fs.writeFileSync(path.join(data,'progress.json'),'broken');assert.equal((await fetch(url+'/api/practice')).status,503);assert.equal((await put(state)).status,503);assert.equal(fs.readFileSync(path.join(data,'progress.json'),'utf8'),'broken');
 await stop();console.log(JSON.stringify({result:'PASS',checks:['loopback server','independent practice and lab save','guide and Jam persist after restart','both last-good backups','invalid guide and practice rejected','cross-origin rejected','authenticated stop','both corrupt files preserved']}));
})().catch(e=>{child?.kill();console.error(e);process.exitCode=1;});
