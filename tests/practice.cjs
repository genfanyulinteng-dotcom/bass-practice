const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..');
const ts=require(path.join(root,'node_modules/typescript'));
const out=path.join(__dirname,'.tmp-practice');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
for(const file of ['scales','practice'])fs.writeFileSync(path.join(out,file+'.js'),ts.transpileModule(fs.readFileSync(path.join(root,'lib',file+'.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText);
const engine=require(path.join(out,'practice.js')),scales=require(path.join(out,'scales.js'));
let cases=0,routes=0;
for(const tuning of [[23,28,33,38,43],[21,28,33,38,43],[21,26,31,36,41]])for(const frets of [20,24])for(let lesson=1;lesson<=42;lesson++){
 const state=structuredClone(engine.DEFAULT_STATE);state.settings.tuning=tuning;state.settings.frets=frets;state.lesson=lesson;
 assert(engine.validateState(state));const day=engine.buildDay(state);assert.equal(day.missing.length,0,`Missing notes lesson ${lesson}`);assert(day.routes.length>=2,`Too few routes ${lesson}`);
 for(const r of day.routes){assert.deepEqual(r.notes.map(n=>n.midi),day.phrase);for(const n of r.notes){assert(n.f>=0&&n.f<=frets);assert.equal(tuning[n.s]+n.f,n.midi);}routes++;}
 for(const c of day.cards){assert(c.start);assert.equal(tuning[c.start.s]+c.start.f,c.from);assert(c.targets.length);for(const p of c.targets)assert.equal(tuning[p.s]+p.f,c.to);}
 assert.equal(day.application.length,day.progression.reduce((n,c)=>n+c.offsets.length,0));for(const p of day.application)assert.equal(tuning[p.s]+p.f,p.midi);cases++;
}
assert.equal(engine.LESSONS.length,42);assert.equal(engine.lessonFor(43).index,0);
assert.equal(scales.scaleNote(37,36,'phrygian'),'D♭2');assert.equal(scales.scaleNote(42,36,'locrian'),'G♭2');assert.equal(scales.scaleNote(42,36,'lydian'),'F♯2');
const malformed=structuredClone(engine.DEFAULT_STATE);malformed.settings.tuning=[23,28,20,38,43];assert(!engine.validateState(malformed));
const high=structuredClone(engine.DEFAULT_STATE);high.settings.tuning=[43,46,49,52,55];assert(engine.buildDay(high).missing.length>0);
console.log(`PASS: ${cases} lesson/tuning/fret combinations; ${routes} exact-pitch routes; modal spellings; invalid tuning and out-of-range guards.`);
