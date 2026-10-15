const fs = require('fs');
const path = require('path');
let sharp;
try { sharp = require('sharp'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  sharp = require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'sharp'));
}
const root=path.resolve(process.argv[2] || path.join(__dirname, '..'));
(async()=>{
  let count=0;
  for (const name of fs.readdirSync(root+'/SVG').filter(x=>x.endsWith('.svg'))) {
    for (const size of [24,48,96]) {
      await sharp(root+'/SVG/'+name,{density:288}).resize(size,size).png().toFile(root+'/PNG/'+size+'px/'+name.replace('.svg','.png'));
      count++;
    }
  }
  for (const name of fs.readdirSync(root+'/Estados/SVG').filter(x=>x.endsWith('.svg'))) {
    await sharp(root+'/Estados/SVG/'+name,{density:216}).resize(540,480).png().toFile(root+'/Estados/PNG/'+name.replace('.svg','.png'));
    count++;
  }
  for (const name of fs.readdirSync(root+'/Previa').filter(x=>x.endsWith('.svg'))) {
    await sharp(root+'/Previa/'+name).png().toFile(root+'/Previa/'+name.replace('.svg','.png'));
    count++;
  }
  console.log(`Rendered ${count} PNG files with Sharp ${sharp.versions.sharp} / librsvg ${sharp.versions.rsvg}`);
})().catch(e=>{console.error(e);process.exit(1)});
