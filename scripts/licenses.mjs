import fs from 'node:fs';
import path from 'node:path';
export async function collectLicenses(root){
 const lock=JSON.parse(fs.readFileSync(path.join(root,'package-lock.json'),'utf8'));
 const sections=[],missing=[];
 for(const [relative,entry] of Object.entries(lock.packages)){
  if(!relative||entry.dev)continue;
  const folder=path.join(root,relative);if(!fs.existsSync(folder))continue;
  const pkg=JSON.parse(fs.readFileSync(path.join(folder,'package.json'),'utf8'));
  const names=fs.readdirSync(folder).filter(n=>/^(licen[cs]e|copying|notice)(\.|-|$)/i.test(n)&&fs.statSync(path.join(folder,n)).isFile());
  if(!names.length){
   const fallback=path.join(root,'licenses',pkg.name.replaceAll('/','-')+'-LICENSE.txt');
   if(fs.existsSync(fallback))sections.push(`=== ${pkg.name}@${pkg.version} (upstream license copy) ===\n`+fs.readFileSync(fallback,'utf8'));else missing.push(pkg.name);
   continue;
  }
  sections.push(`=== ${pkg.name}@${pkg.version} (${pkg.license??'see original text'}) ===\n`+names.map(n=>'--- '+n+' ---\n'+fs.readFileSync(path.join(folder,n),'utf8')).join('\n'));
 }
 for(const name of ['tailwindcss','tw-animate-css']){const dir=path.join(root,'node_modules',name),pkg=JSON.parse(fs.readFileSync(path.join(dir,'package.json'),'utf8'));const license=fs.readdirSync(dir).find(n=>/^licen[cs]e(\.|$)/i.test(n));if(!license)throw Error('Missing CSS license: '+name);sections.push(`=== ${name}@${pkg.version} ===\n`+fs.readFileSync(path.join(dir,license),'utf8'));}
 sections.push('=== shadcn/ui components and vendored CSS ===\n'+fs.readFileSync(path.join(root,'vendor/shadcn-tailwind-4.13.0.LICENSE.md'),'utf8'));
 if(missing.length)throw Error('Missing dependency license text: '+missing.join(', '));
 fs.mkdirSync(path.join(root,'licenses'),{recursive:true});fs.writeFileSync(path.join(root,'licenses/third-party.txt'),sections.join('\n\n'));
}
