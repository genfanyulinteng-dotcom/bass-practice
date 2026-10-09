import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/postcss';
import esbuild from 'esbuild';
import {collectLicenses} from './licenses.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist/bass-practice');
fs.mkdirSync(out,{recursive:true});
await build({configFile:false,root,publicDir:'public',plugins:[react()],resolve:{alias:{'@':root}},css:{postcss:{plugins:[tailwind({base:root})]}},build:{outDir:path.join(out,'app'),emptyOutDir:true}});
for(const [input,output] of [['practice','engine'],['lab-state','lab-engine']])await esbuild.build({entryPoints:[path.join(root,'lib',input+'.ts')],bundle:true,platform:'node',format:'cjs',outfile:path.join(out,output+'.cjs'),logLevel:'warning'});
for(const name of ['server.cjs','launch.ps1','desktop-shortcut.ps1']){
 const content=fs.readFileSync(path.join(root,'desktop',name),'utf8').replace(/^\uFEFF/,'');
 fs.writeFileSync(path.join(out,name),(name.endsWith('.ps1')?'\uFEFF':'')+content);
}
for(const [name,script,args] of [['开始练习.cmd','launch.ps1',''],['关闭工具.cmd','launch.ps1',' -Stop'],['创建桌面入口.cmd','desktop-shortcut.ps1','']])fs.writeFileSync(path.join(out,name),'@echo off\r\npowershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0'+script+'"'+args+'\r\n');
const instructions=[
 '贝斯每日练习 · 本地版','',
 'Windows 便携版：先完整解压，再双击“开始练习.cmd”。无需安装 Node，无需 Codex，无需联网。',
 '双击“创建桌面入口.cmd”生成快捷方式。移动文件夹后重新运行此脚本。',
 '关闭网页不会停止本地服务；需要停止时双击“关闭工具.cmd”。重启电脑后再次双击启动。',
 '本机地址：http://127.0.0.1:5175/。一次仅启动一份；另一份占用端口时请先关闭。','',
 '从“练习顺序”开始，每次只练当前一层。音级地图与 Jam 提供 33 种音阶、9 条转换路径。',
 '默认 B–E–A–D–G；在“每日路线”设置中修改定弦与琴品。',
 '没有确认音乐中心时，先记录实际音与音程，允许保留多个候选。',
 '工具不监听或自动评分实琴，不自动检测歌曲调性。素材草稿临时保存，离开模块会清空。','',
 '公共下载包不含任何个人记录。首次使用后进度保存在本应用目录的 data/ 内。',
 '备份先关闭工具，再复制整个应用目录。升级时保留原 data/；不要覆盖较新的记录。',
 '源码：https://github.com/genfanyulinteng-dotcom/bass-practice',
 '第三方许可见 THIRD_PARTY_NOTICES.md、licenses/；Windows 内置 Node 的完整许可见 runtime/Node-LICENSE.txt。',''
];fs.writeFileSync(path.join(out,'使用说明.txt'),'\uFEFF'+instructions.join('\r\n'));
await collectLicenses(root);
for(const name of ['THIRD_PARTY_NOTICES.md'])if(fs.existsSync(path.join(root,name)))fs.copyFileSync(path.join(root,name),path.join(out,name));
fs.mkdirSync(path.join(out,'licenses'),{recursive:true});fs.copyFileSync(path.join(root,'licenses/third-party.txt'),path.join(out,'licenses/third-party.txt'));
console.log('Built local app: '+out+'\nStart with npm start. Existing data/ is preserved.');
