import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(process.platform!=='win32'||process.arch!=='x64')throw Error('Build the Windows x64 portable package on Windows x64.');
await import('./build.mjs');
const app=path.join(root,'dist/bass-practice'),version=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version;
const staging=fs.mkdtempSync(path.join(os.tmpdir(),'bass-practice-release-')),clean=path.join(staging,'bass-practice');fs.mkdirSync(clean);
// Explicit allowlist: never include user data, logs, or server control files.
for(const name of ['app','server.cjs','engine.cjs','lab-engine.cjs','launch.ps1','desktop-shortcut.ps1','开始练习.cmd','关闭工具.cmd','创建桌面入口.cmd','使用说明.txt','THIRD_PARTY_NOTICES.md','licenses'])fs.cpSync(path.join(app,name),path.join(clean,name),{recursive:true});
fs.mkdirSync(path.join(clean,'runtime'));fs.copyFileSync(process.execPath,path.join(clean,'runtime/node.exe'));
const licenseUrl=`https://raw.githubusercontent.com/nodejs/node/${process.version}/LICENSE`;
const response=await fetch(licenseUrl);if(!response.ok)throw Error('Could not retrieve the matching Node.js LICENSE: '+response.status);
const license=await response.text();if(!license.includes('Permission is hereby granted')||license.length<10000)throw Error('Unexpected Node.js license response');fs.writeFileSync(path.join(clean,'runtime/Node-LICENSE.txt'),license);
const files=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else files.push({path:path.relative(clean,full).replaceAll('\\','/'),bytes:fs.statSync(full).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex')});}}walk(clean);
if(files.some(f=>f.path.startsWith('data/')||f.path.endsWith('.log')))throw Error('Public package must not contain personal data.');
fs.writeFileSync(path.join(clean,'package-manifest.json'),JSON.stringify({version,node:process.version,platform:'Windows x64',personalDataIncluded:false,files},null,2));
const output=path.join(root,'release');fs.mkdirSync(output,{recursive:true});const zip=path.join(output,`bass-practice-${version}-windows-x64.zip`);if(fs.existsSync(zip))throw Error('Release ZIP already exists; retain or move it before rebuilding.');
const quoted=s=>"'"+s.replaceAll("'","''")+"'";
const ps=`Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory(${quoted(staging)},${quoted(zip)},[System.IO.Compression.CompressionLevel]::Optimal,$false)`;
const r=spawnSync(path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),['-NoProfile','-NonInteractive','-Command',ps],{windowsHide:true,stdio:'inherit'});if(r.status!==0)throw Error('ZIP creation failed.');
const checksum=crypto.createHash('sha256').update(fs.readFileSync(zip)).digest('hex');fs.writeFileSync(zip+'.sha256',checksum+'  '+path.basename(zip)+'\n');
console.log(JSON.stringify({release:zip,sha256:checksum,personalDataIncluded:false}));
// Remove only the task-created staging directory, after checking the resolved parent.
const resolved=fs.realpathSync(staging),temp=fs.realpathSync(os.tmpdir());if(path.dirname(resolved).toLowerCase()!==temp.toLowerCase()||!path.basename(resolved).startsWith('bass-practice-release-'))throw Error('Unexpected staging path');fs.rmSync(resolved,{recursive:true});
