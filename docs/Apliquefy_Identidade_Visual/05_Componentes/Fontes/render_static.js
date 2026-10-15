const fs=require('fs'),path=require('path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'exports/manifest.json')));
 for(const e of manifest.exports){const buf=fs.readFileSync(path.join(root,'exports',e.svg));await sharp(buf,{density:72}).png().toFile(path.join(root,'exports',e.png1x));await sharp(buf,{density:144}).png().toFile(path.join(root,'exports',e.png2x));}
 for(const name of ['composicao-desktop','composicao-mobile'])await sharp(path.join(root,'previews',name+'.svg')).png().toFile(path.join(root,'previews',name+'.png'));
 const desk=await sharp(path.join(root,'previews/composicao-desktop.png')).resize({width:1100}).toBuffer();const dm=await sharp(desk).metadata();const mob=await sharp(path.join(root,'previews/composicao-mobile.png')).resize({width:300}).toBuffer();const mm=await sharp(mob).metadata();
 const sheetHeader=Buffer.from(`<svg width="1512" height="80"><rect width="1512" height="80" fill="#F6F4FA"/><text x="40" y="34" font-family="Arial" font-size="21" font-weight="600" fill="#14121C">Apliquefy · Interface demonstrativa</text><text x="40" y="58" font-family="Arial" font-size="12" fill="#625D6C">Composições vetoriais para desktop e celular. Dados fictícios.</text></svg>`);
 await sharp({create:{width:1512,height:Math.max(dm.height,mm.height)+104,channels:4,background:'#F6F4FA'}}).composite([{input:sheetHeader,left:0,top:0},{input:desk,left:32,top:80},{input:mob,left:1164,top:80}]).png().toFile(path.join(root,'previews/aplicacao-desktop-mobile.png'));
 const tiles=[];let cy=84;const colW=620;const picked=['01-botoes','02-campos','03-status','04-cartao-vaga','05-candidaturas','11-etapas','12-estado-vazio','18-alerta-atencao'];
 for(let i=0;i<picked.length;i+=2){let maxh=0;for(let j=0;j<2;j++){const e=manifest.exports.find(x=>x.id===picked[i+j]);if(!e)continue;const img=await sharp(path.join(root,'exports',e.png2x)).resize({width:Math.min(colW,e.width),withoutEnlargement:true}).flatten({background:'#FFFFFF'}).toBuffer();const m=await sharp(img).metadata();tiles.push({input:img,left:32+j*660,top:cy});maxh=Math.max(maxh,m.height);}cy+=maxh+32;}
 const header=Buffer.from('<svg width="1340" height="64"><rect width="1340" height="64" fill="#FFFFFF"/><text x="32" y="38" font-family="Arial" font-size="22" fill="#14121C" font-weight="600">Apliquefy · Componentes vetoriais</text></svg>');
 await sharp({create:{width:1340,height:cy+8,channels:4,background:'#FFFFFF'}}).composite([{input:header,left:0,top:0},...tiles]).png().toFile(path.join(root,'previews/componentes-prancha.png'));
 console.log('18 SVG + 36 PNG exported; 2 vector application compositions and 4 preview PNGs.');
})();
