const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {DEFAULT_STATE,validateState} = require('./engine.cjs');
const {DEFAULT_LAB,validateLab} = require('./lab-engine.cjs');
const root = __dirname, port = Number(process.env.BASS_LOCAL_PORT || 5175);
const dataDir = path.resolve(process.env.BASS_LOCAL_DATA_DIR || path.join(root,'data'));
const origin = `http://127.0.0.1:${port}`;
const installation = crypto.createHash('sha256').update(root.toLowerCase()).digest('hex').slice(0,16);
const build = crypto.createHash('sha256').update(['server.cjs','engine.cjs','lab-engine.cjs'].map(name=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex')).join(':')).digest('hex');
fs.mkdirSync(dataDir,{recursive:true});
const stateFile = path.join(dataDir,'progress.json'), backupFile=path.join(dataDir,'progress.backup.json');
const controlFile = path.join(dataDir,'server.json');
const token = crypto.randomBytes(32).toString('hex');
let queue=Promise.resolve(),stopping=false;
function readState(kind='practice'){
 const stateFile=path.join(dataDir,kind==='lab'?'lab-progress.json':'progress.json');
 const validate=kind==='lab'?validateLab:validateState;
 const defaults=kind==='lab'?DEFAULT_LAB:DEFAULT_STATE;
 if(!fs.existsSync(stateFile))return structuredClone(defaults);
 const state=JSON.parse(fs.readFileSync(stateFile,'utf8').replace(/^\uFEFF/,''));
 if(!validate(state))throw new Error('Invalid saved progress');
 return state;
}
function saveState(state,kind='practice'){
 const stateFile=path.join(dataDir,kind==='lab'?'lab-progress.json':'progress.json'),backupFile=path.join(dataDir,kind==='lab'?'lab-progress.backup.json':'progress.backup.json');
 const task=queue.catch(()=>{}).then(async()=>{
  if(fs.existsSync(stateFile)){readState(kind);await fs.promises.copyFile(stateFile,backupFile);}
  const temp=path.join(dataDir,`progress.${crypto.randomUUID()}.tmp`);
  const file=await fs.promises.open(temp,'wx');
  try{await file.writeFile(JSON.stringify(state,null,2)+'\n');await file.sync();}finally{await file.close();}
  await fs.promises.rename(temp,stateFile);
 });
 queue=task;return task;
}
function json(res,data,status=200){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
async function body(req){req.setEncoding('utf8');let text='';for await(const chunk of req){text+=chunk;if(Buffer.byteLength(text)>60000)throw Object.assign(new Error('记录过大。'),{status:413});}try{return JSON.parse(text);}catch{throw Object.assign(new Error('记录格式不正确。'),{status:400});}}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
 try{
  if(req.headers.host!==`127.0.0.1:${port}`)return json(res,{error:'本地地址不匹配。'},403);
  const url=new URL(req.url,origin);
  if(req.headers.origin&&req.headers.origin!==origin)return json(res,{error:'不允许此来源。'},403);
  if(url.pathname==='/health'&&req.method==='GET')return json(res,{app:'bass-practice-local',version:3,installation,build});
  if(url.pathname==='/__stop'&&req.method==='POST'){
   if(req.headers['x-bass-control']!==token)return json(res,{error:'无权关闭。'},403);
   stopping=true;await queue.catch(()=>{});json(res,{stopped:true});server.close();server.closeIdleConnections();return;
  }
  if(url.pathname==='/api/practice'||url.pathname==='/api/lab'){
   const kind=url.pathname==='/api/lab'?'lab':'practice';
   if(req.method==='GET'){await queue.catch(()=>{});return json(res,readState(kind));}
   if(req.method==='PUT'){
    if(stopping)return json(res,{error:'工具正在关闭，请重新打开。'},503);
    if(!String(req.headers['content-type']).startsWith('application/json'))return json(res,{error:'需要 JSON 格式。'},415);
    const state=await body(req);if(!(kind==='lab'?validateLab(state):validateState(state)))return json(res,{error:'练习设置或进度不正确。'},400);
    await saveState(state,kind);return json(res,{saved:true});
   }
   return json(res,{error:'不支持此操作。'},405);
  }
  if(!['GET','HEAD'].includes(req.method))return json(res,{error:'不支持此操作。'},405);
  const relative=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const assetRoot=path.join(root,'app'),file=path.resolve(assetRoot,relative);
  if(!file.startsWith(assetRoot+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return json(res,{error:'文件不存在。'},404);
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res);
 }catch(error){console.error(new Date().toISOString(),error.message);json(res,{error:error.status?error.message:'本机进度未能读取或保存。请保留 data 文件夹，查看日志后重试。'},error.status||503);}
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.on('close',()=>{try{const current=JSON.parse(fs.readFileSync(controlFile,'utf8'));if(current.token===token)fs.unlinkSync(controlFile);}catch{}});
server.listen(port,'127.0.0.1',()=>{fs.writeFileSync(controlFile,JSON.stringify({pid:process.pid,token,origin,installation}));console.log(`Bass practice ready: ${origin}`);});
