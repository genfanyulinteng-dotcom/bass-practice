// Pure checks: no child processes, network sockets, browser, or writes to user data.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ts=require('typescript');
const cache=new Map();
function source(name){if(cache.has(name))return cache.get(name);const filename=path.join(__dirname,'../lib',name+'.ts'),m={exports:{}};cache.set(name,m.exports);const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;new Function('require','module','exports',code)(id=>{if(id.startsWith('./'))return source(id.slice(2));throw Error('Unexpected import '+id);},m,m.exports);return m.exports;}
const {SCALE_CATALOG,SCALE_FAMILIES,getContext,sameCollectionModes,toRelativeConfig,harmonyTones,upperTriad,positionsForContext}=source('degree-engine');
const {DEFAULT_LAB,validateLab}=source('lab-state');
const mod=n=>(n%12+12)%12,major=[0,2,4,5,7,9,11],natural={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const pc=name=>mod(natural[name[0]]+[...name].filter(c=>c==='♯').length-[...name].filter(c=>c==='♭').length);
const cfg=(id,tonicPc=0)=>({tonicPc,strategy:'parallel',modeIndex:0,scaleId:id,fromFret:0,toFret:24});
const sets=ctx=>ctx.notes.map(n=>n.pc).sort((a,b)=>a-b);
assert.equal(SCALE_CATALOG.length,33);assert.equal(new Set(SCALE_CATALOG.map(s=>s.id)).size,33);
assert.equal(SCALE_CATALOG.filter(s=>s.family==='旋律小调家族').length,7);assert.equal(SCALE_CATALOG.filter(s=>s.family==='和声小调家族').length,7);
let contexts=0,locations=0,recenters=0;
for(const scale of SCALE_CATALOG){
 assert(SCALE_FAMILIES.includes(scale.family));assert.equal(scale.offsets.length,scale.degrees.length);assert.equal(scale.offsets[0],0);assert.equal(scale.degrees[0],'1');assert.equal(new Set(scale.degrees).size,scale.degrees.length);
 scale.degrees.forEach((degree,i)=>assert.equal(mod(major[Number(degree.replace(/[^0-9]/g,''))-1]+[...degree].filter(c=>c==='♯').length-[...degree].filter(c=>c==='♭').length),scale.offsets[i],scale.id+' '+degree));
 for(let tonic=0;tonic<12;tonic++){
  const config=cfg(scale.id,tonic),ctx=getContext(config);contexts++;
  assert.equal(pc(ctx.rootName),tonic);ctx.notes.forEach(n=>assert.equal(pc(n.name),n.pc));
  const modes=sameCollectionModes(config);assert(modes.some(m=>m.context.modeId===scale.id&&m.context.rootMidi===ctx.rootMidi));
  for(const mode of modes){assert.deepEqual(sets(mode.context),sets(ctx));recenters++;}
  if(scale.family==='大调家族'||scale.family==='旋律小调家族'||scale.family==='和声小调家族')assert.equal(modes.length,7,scale.id+' should have seven rotations');
  for(const n of harmonyTones(ctx)){assert(ctx.notes.some(t=>t.pc===n.pc));assert(!scale.passing?.includes(n.degree));}
  if(scale.offsets.length!==7||scale.id==='altered')assert.equal(upperTriad(ctx,1),null);
  for(const tuning of [[23,28,33,38,43],[21,28,33,38,43],[24,29,35,38,45]])for(const p of positionsForContext(ctx,tuning,0,24)){assert.equal(p.midi,tuning[p.s]+p.f);assert.equal(ctx.notes.find(n=>n.degree===p.degree).pc,p.midi%12);locations++;}
  const relative=toRelativeConfig(config);if(scale.family==='大调家族'){assert(relative);assert.deepEqual(sets(getContext(relative)),sets(ctx));assert.equal(getContext(relative).rootMidi,ctx.rootMidi);}else assert.equal(relative,null);
  assert(validateLab({...structuredClone(DEFAULT_LAB),config,progression:[config],guide:{level:6,checks:[true,false]}}));
 }
}
for(const [family,parent] of [['旋律小调家族',[0,2,3,5,7,9,11]],['和声小调家族',[0,2,3,5,7,8,11]]]){
 const expected=parent.map(root=>parent.map(n=>mod(n-root)).sort((a,b)=>a-b).join(',')).sort();assert.deepEqual(SCALE_CATALOG.filter(s=>s.family===family).map(s=>s.offsets.join(',')).sort(),expected);
}
assert.deepEqual(harmonyTones(getContext(cfg('major-blues'))).map(n=>n.degree),['3','6']);
assert.deepEqual(harmonyTones(getContext(cfg('bebop-dominant'))).map(n=>n.degree),['3','♭7']);
assert.deepEqual(harmonyTones(getContext(cfg('diminished-whole-half'))).map(n=>n.degree),['♭3','♭♭7']);
assert.deepEqual(harmonyTones(getContext(cfg('ultralocrian'))).map(n=>n.degree),['♭3','♭♭7']);
assert(!validateLab({...DEFAULT_LAB,guide:null}));assert(!validateLab({...DEFAULT_LAB,guide:{level:7,checks:[false,false]}}));
console.log(JSON.stringify({result:'PASS',scales:33,contexts,locations,recenters,checks:['independent interval spelling','all twelve roots','three tuning maps','major and minor family rotations','same collection preservation','passing notes excluded from harmony','diminished seventh support','new scale state validation']}));
