const fs = require('fs');
const path = require('path');
const sharp = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'sharp') : 'sharp');
const root = path.resolve(process.argv[2] || path.join(__dirname, '../../Apliquefy_Identidade_Visual'));
async function run() {
  let count=0;
  for (const folder of ['01_Logos', '02_Simbolo_Produto']) {
    const src=path.join(root,folder,'SVG');if(!fs.existsSync(src)) continue;
    const dst=path.join(root,folder,'PNG');fs.mkdirSync(dst,{recursive:true});
    for(const name of fs.readdirSync(src).filter(x=>x.endsWith('.svg'))){
      const input=path.join(src,name);
      let sizes=folder==='01_Logos'?[400,800,1600,3200]:name.includes('app-')?[180,192,512,1024]:name.includes('micro')?[16,20,32]:[24,32,48,64,128,256,512,1024];
      for(const width of sizes){
        await sharp(input,{density:Math.max(144,Math.ceil(width/2))}).resize({width}).png().toFile(path.join(dst,`${name.slice(0,-4)}-width${width}.png`));count++;
      }
    }
  }
  console.log(JSON.stringify({png_exported:count}));
}
run().catch(e=>{console.error(e);process.exit(1)});
