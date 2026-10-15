#!/usr/bin/env python3
"""Apliquefy Display — Regular R2 1.001 / Bold 1.000; original outlines built from geometric paths.
No external typeface is read, renamed, traced or used as an outline source.
Requirements: fonttools[woff], skia-pathops, brotli, uharfbuzz, Pillow.
"""
from pathlib import Path
import math, json, unicodedata, csv, shutil
import pathops
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.qu2cuPen import Qu2CuPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont, newTable
from fontTools.ttLib.tables._k_e_r_n import KernTable_format_0
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools import agl
import uharfbuzz as hb
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parent
OUT=ROOT.parent if ROOT.name == 'Fontes' else ROOT/'build'
if '--output' in __import__('sys').argv:
 OUT=Path(__import__('sys').argv[__import__('sys').argv.index('--output')+1]).resolve()
for d in ['TTF','OTF','Web','Fontes','Previa']:(OUT/d).mkdir(parents=True,exist_ok=True)
K=.5522847498307936
FONT_VERSIONS={'Regular':'1.001','Bold':'1.000'}
FONT_FAMILIES={'Regular':'Apliquefy Display R2','Bold':'Apliquefy Display'}
FONT_STEMS={'Regular':'ApliquefyDisplayR2-Regular','Bold':'ApliquefyDisplay-Bold'}

def ellipse(cx,cy,rx,ry):
 p=pathops.Path();p.moveTo(cx+rx,cy)
 p.cubicTo(cx+rx,cy+K*ry,cx+K*rx,cy+ry,cx,cy+ry)
 p.cubicTo(cx-K*rx,cy+ry,cx-rx,cy+K*ry,cx-rx,cy)
 p.cubicTo(cx-rx,cy-K*ry,cx-K*rx,cy-ry,cx,cy-ry)
 p.cubicTo(cx+K*rx,cy-ry,cx+rx,cy-K*ry,cx+rx,cy);p.close();return p

def path(cmds):
 p=pathops.Path()
 for op,pts in cmds:
  {'M':p.moveTo,'L':p.lineTo,'C':p.cubicTo,'Q':p.quadTo,'Z':p.close}[op](*pts)
 return p

def stroke(cmds,s):
 p=path(cmds) if isinstance(cmds,list) else cmds
 p.stroke(s,pathops.LineCap.ROUND_CAP,pathops.LineJoin.ROUND_JOIN,4)
 p.convertConicsToQuads(.08)
 return p

def line(x1,y1,x2,y2,s):return stroke([('M',(x1,y1)),('L',(x2,y2))],s)
def merge(*parts):
 p=pathops.Path()
 for q in parts:p.addPath(pathops.simplify(q,fix_winding=True,clockwise=True))
 return pathops.simplify(p,fix_winding=True,clockwise=True) if parts else p

def gn(c):return agl.UV2AGL.get(ord(c),'uni%04X'%ord(c))

class Typeface:
 def __init__(self,s):
  self.s=s;self.G={};self.W={};self.base();self.spacing()
 def spacing(self):
  # Preserve letter construction but normalize optical sidebearings. Accented
  # forms inherit their base letter metrics; accent overhangs do not reflow text.
  offsets={};widths={}
  for c,p in self.G.items():
   if not (c.isalpha() or c.isdecimal()) or not len(p):continue
   dec=unicodedata.normalize('NFD',c)
   if len(dec)>1 and dec[0] in self.G:continue
   xmin,_,xmax,_=p.bounds
   sb=35 if c.isupper() or c.isdecimal() else 26
   offsets[c]=sb-xmin;widths[c]=round(xmax-xmin+2*sb)
  for c in list(self.G):
   base=unicodedata.normalize('NFD',c)[0]
   key=base if base in offsets else c
   if key in offsets:
    self.G[c]=self.G[c].transform(1,0,0,1,offsets[key],0);self.W[c]=widths[key]
 def add(self,c,w,*p):self.G[c]=merge(*p);self.W[c]=w
 def st(self,commands,s=None):return stroke(commands,self.s if s is None else s)
 def ln(self,*v,s=None):return line(*v,self.s if s is None else s)
 def ring(self,cx=278,cy=260,rx=None,ry=None):
  return self.st(ellipse(cx,cy,(260-self.s/2) if rx is None else rx,(268-self.s/2) if ry is None else ry))
 def trans(self,c,sx=1,sy=1,dx=0,dy=0):return self.G[c].transform(sx,0,0,sy,dx,dy)
 def base(self):
  s=self.s;t=s/2;b=t;top=520-t;cap=720-t;asc=740-t;left=92;right=464
  self.add(' ',290);self.add('\u00a0',290)
  ring=self.ring()
  # Regular only: place each bowl-attached stem on the outer tangent.
  # The former 92/464 centers were tuned for the heavier construction and
  # left a visible circular lip beyond the thinner Regular stem. Keep the
  # original coordinates for Bold and for unrelated arches (n, h, m, etc.).
  bowl_left=18+t if s==102 else left
  bowl_right=538-t if s==102 else right
  self.add('o',558,ring)
  self.add('a',558,ring,self.ln(bowl_right,b,bowl_right,top))
  self.add('p',558,ring,self.ln(bowl_left,-210+t,bowl_left,top))
  self.add('q',558,ring,self.ln(bowl_right,-210+t,bowl_right,top))
  self.add('b',558,ring,self.ln(bowl_left,b,bowl_left,asc))
  self.add('d',558,ring,self.ln(bowl_right,b,bowl_right,asc))
  self.add('g',558,ring,self.st([('M',(bowl_right,top)),('L',(bowl_right,-38)),('C',(bowl_right,-200,265,-220,182,-150))]))
  self.add('c',530,self.st([('M',(443,423)),('C',(350,522,197,492,115,388)),('C',(30,275,69,126,170,67)),('C',(267,9,381,44,450,111))]))
  self.add('e',558,self.st([('M',(432,96)),('C',(345,22,219,36,134,129)),('C',(45,229,78,372,176,423)),('C',(295,499,457,421,466,294)),('L',(102,190))]))
  arch=[('M',(left,276)),('C',(left,502,right,518,right,294)),('L',(right,b))]
  self.add('n',558,self.ln(left,b,left,top),self.st(arch))
  self.add('h',558,self.ln(left,b,left,asc),self.st(arch))
  self.add('u',548,self.st([('M',(left,top)),('L',(left,236)),('C',(left,12,454,12,454,236)),('L',(454,top))]))
  self.add('m',822,self.ln(left,b,left,top),self.st([('M',(left,276)),('C',(left,495,413,516,413,282)),('L',(413,b))]),self.st([('M',(413,282)),('C',(413,516,730,495,730,282)),('L',(730,b))]))
  self.add('l',205,self.ln(102,b,102,asc))
  self.add('i',205,self.ln(102,b,102,top),ellipse(102,651,t,t))
  self.add('ı',205,self.ln(102,b,102,top))
  self.add('j',258,self.st([('M',(165,top)),('L',(165,-72)),('C',(165,-172,78,-177,40,-147))]),ellipse(165,651,t,t))
  self.add('k',510,self.ln(left,b,left,asc),self.ln(431,top,left,207),self.ln(270,330,437,b))
  self.add('f',340,self.st([('M',(145,b)),('L',(145,508)),('C',(145,655,215,708,297,667))]),self.ln(62,429,279,429))
  self.add('t',365,self.st([('M',(158,622)),('L',(158,184)),('C',(158,49,233,50,290,81))]),self.ln(64,429,285,429))
  self.add('r',388,self.ln(left,b,left,top),self.st([('M',(left,289)),('C',(left,443,202,514,308,440))]))
  self.add('s',482,self.st([('M',(381,414)),('C',(304,495,120,489,105,377)),('C',(86,246,377,290,384,151)),('C',(391,36,194,17,95,99))]))
  self.add('v',514,self.st([('M',(80,top)),('L',(257,b)),('L',(434,top))]))
  self.add('w',744,self.st([('M',(79,top)),('L',(213,b)),('L',(372,356)),('L',(531,b)),('L',(665,top))]))
  self.add('x',513,self.ln(80,top,433,b),self.ln(433,top,80,b))
  self.add('y',523,self.ln(80,top,260,117),self.ln(443,top,155,-210+t))
  self.add('z',510,self.st([('M',(88,top)),('L',(422,top)),('L',(88,b)),('L',(422,b))]))
  # Capitals; optical sidebearings, curved terminals, coherent stroke.
  self.add('A',690,self.st([('M',(83,b)),('L',(345,cap)),('L',(607,b))]),self.ln(174,244,516,244))
  self.add('B',628,self.ln(100,b,100,cap),self.st([('M',(100,cap)),('L',(315,cap)),('C',(588,cap,604,384,337,374)),('L',(104,374)),('M',(260,374)),('L',(344,374)),('C',(622,374,612,b,337,b)),('L',(100,b))]))
  self.add('C',684,self.st([('M',(574,581)),('C',(418,780,117,664,99,400)),('C',(79,105,390,-45,581,139))]))
  self.add('D',686,self.ln(100,b,100,cap),self.st([('M',(100,cap)),('L',(294,cap)),('C',(705,cap,705,b,294,b)),('L',(100,b))]))
  self.add('E',557,self.st([('M',(470,cap)),('L',(100,cap)),('L',(100,b)),('L',(478,b))]),self.ln(100,364,423,364))
  self.add('F',548,self.st([('M',(470,cap)),('L',(100,cap)),('L',(100,b))]),self.ln(100,370,418,370))
  self.add('G',713,self.st([('M',(583,584)),('C',(420,771,127,674,99,401)),('C',(66,76,414,-50,605,159)),('L',(605,321)),('L',(419,321))]))
  self.add('H',682,self.ln(100,b,100,cap),self.ln(582,b,582,cap),self.ln(100,364,582,364))
  self.add('I',240,self.ln(120,b,120,cap))
  self.add('J',535,self.st([('M',(435,cap)),('L',(435,213)),('C',(435,24,157,-20,83,166))]))
  self.add('K',637,self.ln(100,b,100,cap),self.ln(547,cap,100,238),self.ln(334,440,558,b))
  self.add('L',536,self.st([('M',(100,cap)),('L',(100,b)),('L',(461,b))]))
  self.add('M',816,self.st([('M',(100,b)),('L',(100,cap)),('L',(408,294)),('L',(716,cap)),('L',(716,b))]))
  self.add('N',701,self.st([('M',(100,b)),('L',(100,cap)),('L',(601,b)),('L',(601,cap))]))
  self.add('O',706,self.st(ellipse(353,360,323-t,368-t)))
  self.add('P',615,self.ln(100,b,100,cap),self.st([('M',(100,cap)),('L',(315,cap)),('C',(612,cap,612,334,315,334)),('L',(100,334))]))
  self.add('Q',706,self.G['O'],self.ln(420,183,617,-16))
  self.add('R',650,self.G['P'],self.ln(316,334,566,b))
  self.add('S',613,self.st([('M',(507,567)),('C',(402,711,118,672,106,509)),('C',(89,291,510,424,519,211)),('C',(527,24,217,5,92,149))]))
  self.add('T',614,self.ln(72,cap,542,cap),self.ln(307,b,307,cap))
  self.add('U',688,self.st([('M',(100,cap)),('L',(100,264)),('C',(100,-20,588,-20,588,264)),('L',(588,cap))]))
  self.add('V',670,self.st([('M',(78,cap)),('L',(335,b)),('L',(592,cap))]))
  self.add('W',922,self.st([('M',(78,cap)),('L',(267,b)),('L',(461,482)),('L',(655,b)),('L',(844,cap))]))
  self.add('X',637,self.ln(82,cap,555,b),self.ln(555,cap,82,b))
  self.add('Y',653,self.st([('M',(77,cap)),('L',(326,333)),('L',(576,cap))]),self.ln(326,b,326,333))
  self.add('Z',597,self.st([('M',(88,cap)),('L',(509,cap)),('L',(88,b)),('L',(509,b))]))
  # Figures are original proportional forms with a common 598-unit advance.
  self.add('0',598,self.st(ellipse(299,360,269-t,368-t)))
  self.add('1',422,self.st([('M',(84,516)),('L',(235,cap)),('L',(235,b))]),self.ln(93,b,353,b))
  self.add('2',598,self.st([('M',(90,544)),('C',(174,729,457,692,502,528)),('C',(547,365,229,200,92,b)),('L',(510,b))]))
  self.add('3',598,self.st([('M',(102,574)),('C',(224,706,503,659,503,521)),('C',(503,408,406,365,300,365)),('C',(604,395,588,76,343,63)),('C',(241,51,145,78,91,136))]))
  self.add('4',616,self.st([('M',(429,b)),('L',(429,cap)),('L',(82,249)),('L',(535,249))]))
  self.add('5',598,self.st([('M',(493,cap)),('L',(140,cap)),('L',(118,378)),('C',(279,478,526,382,513,213)),('C',(501,42,258,14,101,121))]))
  self.add('6',598,self.st([('M',(477,601)),('C',(255,758,83,493,83,251)),('C',(83,-2,515,0,515,251)),('C',(515,473,173,448,83,251))]))
  self.add('7',575,self.st([('M',(77,cap)),('L',(498,cap)),('L',(201,b))]))
  self.add('8',598,self.st(ellipse(299,535,216-t,193-t)),self.st(ellipse(299,198,247-t,207-t)))
  self.add('9',598,self.G['6'].transform(-1,0,0,-1,598,720))
  # Punctuation, technical and monetary symbols.
  dot=ellipse(112,t,t,t)
  self.add('.',224,dot);self.add(',',224,dot,self.ln(126,46,78,-83,s=s*.57))
  self.add(':',224,dot,dot.transform(1,0,0,1,0,349));self.add(';',224,self.G[','],dot.transform(1,0,0,1,0,349))
  self.add('!',228,ellipse(114,t,t,t),self.ln(114,300,114,cap))
  self.add('?',508,ellipse(251,t,t,t),self.st([('M',(95,551)),('C',(135,718,443,698,438,520)),('C',(431,399,251,404,251,291))]))
  self.add('-',361,self.ln(85,262,276,262,s=s*.8));self.add('–',566,self.ln(85,262,481,262,s=s*.8));self.add('—',854,self.ln(85,262,769,262,s=s*.8));self.add('_',552,self.ln(73,-89,479,-89,s=s*.7))
  self.add('/',414,self.ln(67,-96,347,783,s=s*.74));self.add('\\',414,self.ln(347,-96,67,783,s=s*.74))
  self.add('|',220,self.ln(110,-94,110,783,s=s*.7))
  self.add('(',314,self.st([('M',(230,799)),('C',(12,555,12,161,230,-95))],s*.74));self.add(')',314,self.G['('].transform(-1,0,0,1,314,0))
  self.add('[',319,self.st([('M',(247,780)),('L',(107,780)),('L',(107,-86)),('L',(247,-86))],s*.7));self.add(']',319,self.G['['].transform(-1,0,0,1,319,0))
  self.add('{',366,self.st([('M',(278,780)),('C',(139,780,170,627,170,501)),('C',(170,390,123,365,77,350)),('C',(123,335,170,310,170,199)),('C',(170,70,139,-85,278,-85))],s*.69));self.add('}',366,self.G['{'].transform(-1,0,0,1,366,0))
  self.add('+',536,self.ln(92,310,444,310,s=s*.8),self.ln(268,134,268,486,s=s*.8))
  self.add('=',536,self.ln(92,201,444,201,s=s*.8),self.ln(92,417,444,417,s=s*.8))
  self.add('<',509,self.st([('M',(418,494)),('L',(92,310)),('L',(418,126))],s*.78));self.add('>',509,self.G['<'].transform(-1,0,0,1,509,0))
  self.add('~',567,self.st([('M',(83,275)),('C',(229,451,344,172,484,346))],s*.68))
  self.add('^',455,self.st([('M',(81,497)),('L',(227,682)),('L',(374,497))],s*.65))
  self.add("'",185,self.ln(95,530,110,665,s=s*.68));self.add('"',352,self.G["'"],self.G["'"].transform(1,0,0,1,166,0))
  self.add('`',261,self.ln(81,718,180,606,s=s*.63))
  self.add('‘',194,self.st([('M',(116,718)),('Q',(42,638,91,559))],s*.68));self.add('’',194,self.G['‘'].transform(-1,0,0,1,194,0));self.add('“',353,self.G['‘'],self.G['‘'].transform(1,0,0,1,160,0));self.add('”',353,self.G['’'],self.G['’'].transform(1,0,0,1,160,0));self.add('‚',194,self.G['’'].transform(1,0,0,1,0,-530));self.add('„',353,self.G['”'].transform(1,0,0,1,0,-530))
  self.add('…',660,self.G['.'],self.G['.'].transform(1,0,0,1,218,0),self.G['.'].transform(1,0,0,1,436,0))
  self.add('*',414,*[self.ln(207,558,207+131*math.sin(i*2*math.pi/5),558+131*math.cos(i*2*math.pi/5),s=s*.55) for i in range(5)])
  self.add('#',628,self.ln(241,94,314,639,s=s*.66),self.ln(412,94,485,639,s=s*.66),self.ln(115,264,522,264,s=s*.66),self.ln(143,474,548,474,s=s*.66))
  self.add('%',750,self.st(ellipse(177,574,97,114),s*.54),self.st(ellipse(574,146,97,114),s*.54),self.ln(159,77,592,643,s=s*.66))
  self.add('&',704,self.st([('M',(574,443)),('C',(530,263,476,85,304,76)),('C',(42,62,57,328,218,395)),('C',(497,509,436,675,272,663)),('C',(105,651,90,494,222,358)),('L',(607,b))],s*.89))
  self.add('@',914,self.st([('M',(668,251)),('C',(732,175,835,254,829,408)),('C',(817,748,100,769,89,348)),('C',(78,-37,611,-109,776,31))],s*.65),self.st(ellipse(459,344,143,159),s*.71),self.ln(601,451,583,257,s=s*.71))
  self.add('$',613,self.G['S'],self.ln(307,-58,307,786,s=s*.53))
  self.add('€',658,self.G['C'].transform(.89,0,0,1,33,0),self.ln(74,434,436,434,s=s*.55),self.ln(74,282,389,282,s=s*.55))
  self.add('£',597,self.st([('M',(482,577)),('C',(368,721,169,654,183,470)),('L',(198,233)),('C',(199,125,146,102,84,b)),('L',(513,b))]),self.ln(82,325,390,325,s=s*.72))
  self.add('¥',653,self.G['Y'],self.ln(142,295,510,295,s=s*.53),self.ln(142,154,510,154,s=s*.53))
  self.add('¢',530,self.G['c'],self.ln(280,-53,280,578,s=s*.5))
  self.add('×',536,self.ln(116,138,420,442,s=s*.78),self.ln(420,138,116,442,s=s*.78))
  self.add('÷',536,self.ln(92,290,444,290,s=s*.78),ellipse(268,105,s*.39,s*.39),ellipse(268,475,s*.39,s*.39))
  self.add('±',536,self.G['+'].transform(1,0,0,1,0,85),self.ln(92,67,444,67,s=s*.78))
  self.add('°',323,self.st(ellipse(161,591,101,101),s*.54))
  self.add('•',320,ellipse(160,299,s*.77,s*.77));self.add('·',224,ellipse(112,299,s*.40,s*.40))
  self.add('¡',228,self.G['!'].transform(1,0,0,-1,0,520));self.add('¿',508,self.G['?'].transform(-1,0,0,-1,508,520))
  self.add('«',593,self.G['<'].transform(.6,0,0,.85,15,46),self.G['<'].transform(.6,0,0,.85,235,46));self.add('»',593,self.G['«'].transform(-1,0,0,1,593,0))
  self.add('‹',366,self.G['<'].transform(.6,0,0,.85,20,46));self.add('›',366,self.G['‹'].transform(-1,0,0,1,366,0))
  self.add('¬',534,self.st([('M',(78,365)),('L',(452,365)),('L',(452,177))],s*.7))
  self.add('¦',220,self.ln(110,454,110,783,s=s*.7),self.ln(110,-94,110,265,s=s*.7))
  self.add('¶',620,self.G['P'].transform(-.85,0,0,1,564,0),self.ln(524,-66,524,cap,s=s*.65))
  self.add('§',600,self.G['s'].transform(.95,0,0,1.0,70,247),self.G['s'].transform(.95,0,0,1.0,70,-129))
  self.add('¤',601,self.st(ellipse(300,355,142,142),s*.65),*[self.ln(300+140*math.cos(a),355+140*math.sin(a),300+224*math.cos(a),355+224*math.sin(a),s=s*.55) for a in [math.pi/4,3*math.pi/4,5*math.pi/4,7*math.pi/4]])
  self.add('©',838,self.st(ellipse(419,360,350,350),s*.44),self.G['C'].transform(.54,0,0,.54,227,166))
  self.add('®',838,self.st(ellipse(419,360,350,350),s*.44),self.G['R'].transform(.54,0,0,.54,245,166))
  self.add('™',882,self.G['T'].transform(.48,0,0,.48,25,375),self.G['M'].transform(.48,0,0,.48,460,375))
  self.add('†',445,self.ln(223,-51,223,705,s=s*.58),self.ln(72,464,373,464,s=s*.58));self.add('‡',445,self.G['†'],self.ln(72,214,373,214,s=s*.58))
  self.add('‰',1036,self.G['%'],self.G['%'].transform(1,0,0,1,283,0)) # replace below with distinct third ring
  self.add('‰',1036,self.G['%'],self.st(ellipse(862,146,97,114),s*.54))
  self.add('ƒ',406,self.G['f'],self.st([('M',(145,100)),('L',(145,-85)),('C',(145,-164,78,-180,28,-144))]))
  # Extended alphabet forms are also original, derived only from our own outlines.
  self.add('Æ',909,self.G['A'].transform(.8,0,0,1,0,0),self.G['E'].transform(.83,0,0,1,447,0))
  self.add('æ',887,self.G['a'].transform(.9,0,0,1,0,0),self.G['e'].transform(.94,0,0,1,365,0))
  self.add('Œ',1089,self.G['O'].transform(.94,0,0,1,0,0),self.G['E'].transform(.92,0,0,1,578,0))
  self.add('œ',929,self.G['o'].transform(.94,0,0,1,0,0),self.G['e'].transform(.94,0,0,1,411,0))
  self.add('Ø',706,self.G['O'],self.ln(118,38,594,683,s=s*.58));self.add('ø',558,self.G['o'],self.ln(83,6,479,518,s=s*.55))
  self.add('Ð',706,self.G['D'].transform(1,0,0,1,20,0),self.ln(27,356,300,356,s=s*.68))
  self.add('ð',563,self.G['o'],self.st([('M',(465,293)),('C',(449,483,344,641,184,713))]),self.ln(144,558,395,679,s=s*.61))
  self.add('Þ',615,self.ln(100,b,100,cap),self.G['P'].transform(1,0,0,.73,0,12))
  self.add('þ',558,self.G['p'],self.ln(bowl_left,top,bowl_left,asc))
  self.add('ß',631,self.st([('M',(99,b)),('L',(99,491)),('C',(99,750,489,721,477,517)),('C',(471,419,355,391,324,343)),('C',(624,357,599,28,341,76))]))
  self.add('ẞ',683,self.G['ß'].transform(1.06,0,0,1.03,10,0))
  self.add('Ł',549,self.G['L'],self.ln(38,227,354,477,s=s*.66));self.add('ł',244,self.G['l'].transform(1,0,0,1,16,0),self.ln(23,268,224,467,s=s*.6))
  self.add('µ',574,self.G['u'],self.ln(left,-210+t,left,top))
  self.add('º',365,self.G['o'].transform(.57,0,0,.57,20,345));self.add('ª',365,self.G['a'].transform(.57,0,0,.57,20,345))
  self.add('¹',292,self.G['1'].transform(.54,0,0,.54,20,388));self.add('²',345,self.G['2'].transform(.51,0,0,.51,15,388));self.add('³',345,self.G['3'].transform(.51,0,0,.51,15,388))
  for char,n,d in [('¼','1','4'),('½','1','2'),('¾','3','4')]:
   self.add(char,789,self.G[n].transform(.48,0,0,.48,10,376),self.G[d].transform(.48,0,0,.48,497,8),self.ln(215,61,586,661,s=s*.54))
  self.add('\u00ad',361,self.G['-'])
  # Spacing diacritics and precomposed Latin coverage.
  for c,mark in [('´','acute'),('¨','dieresis'),('¯','macron'),('¸','cedilla'),('ˇ','caron'),('˘','breve'),('˚','ring'),('˛','ogonek')]:self.add(c,390,self.accent(mark,195,520))
  latin=list(range(0xC0,0x100))+list(range(0x100,0x180))
  for cp in latin:
   c=chr(cp)
   if c in self.G:continue
   decomp=unicodedata.normalize('NFD',c)
   if len(decomp)==2 and decomp[0] in self.G:
    base,comb=decomp
    marks={'\u0300':'grave','\u0301':'acute','\u0302':'circumflex','\u0303':'tilde','\u0308':'dieresis','\u030a':'ring','\u0327':'cedilla','\u0304':'macron','\u0306':'breve','\u030c':'caron','\u0307':'dot','\u0328':'ogonek','\u030b':'doubleacute'}
    if comb in marks:
     src=self.G['ı'] if base=='i' else self.G[base]
     if base=='j':src=self.st([('M',(165,top)),('L',(165,-72)),('C',(165,-172,78,-177,40,-147))])
     width=self.W[base];height=720 if base.isupper() else 520
     # ascenders need their mark above the actual ascender.
     if base in 'bdfhkl':height=740
     self.add(c,width,src,self.accent(marks[comb],width/2,height))
  # A conventional .notdef box avoids confusing missing glyphs with blank spaces.
  self.notdef=merge(self.st([('M',(98,0)),('L',(498,0)),('L',(498,720)),('L',(98,720)),('Z',())],s*.5),self.ln(98,0,498,720,s=s*.35),self.ln(498,0,98,720,s=s*.35))
 def accent(self,kind,cx,height):
  s=self.s*.58;y=height+138
  if kind=='acute':return line(cx-45,y-20,cx+70,y+94,s)
  if kind=='grave':return line(cx-70,y+94,cx+45,y-20,s)
  if kind=='circumflex':return stroke([('M',(cx-120,y-6)),('L',(cx,y+96)),('L',(cx+120,y-6))],s*.85)
  if kind=='caron':return stroke([('M',(cx-120,y+93)),('L',(cx,y-9)),('L',(cx+120,y+93))],s*.85)
  if kind=='dieresis':return merge(ellipse(cx-99,y+22,s*.59,s*.59),ellipse(cx+99,y+22,s*.59,s*.59))
  if kind=='dot':return ellipse(cx,y+22,s*.60,s*.60)
  if kind=='tilde':return stroke([('M',(cx-133,y)),('C',(cx-54,y+102,cx+50,y-77,cx+134,y+34))],s*.82)
  if kind=='macron':return line(cx-131,y+29,cx+131,y+29,s*.80)
  if kind=='ring':return stroke(ellipse(cx,y+37,69,69),s*.57)
  if kind=='breve':return stroke([('M',(cx-124,y+77)),('C',(cx-93,y-43,cx+92,y-43,cx+124,y+77))],s*.8)
  if kind=='doubleacute':return merge(line(cx-119,y-17,cx-13,y+94,s*.79),line(cx+47,y-17,cx+153,y+94,s*.79))
  if kind=='cedilla':return stroke([('M',(cx+12,-7)),('L',(cx-27,-79)),('C',(cx+120,-54,cx+136,-193,cx-26,-190))],s*.74)
  if kind=='ogonek':return stroke([('M',(cx+78,12)),('C',(cx-51,-82,cx-28,-198,cx+98,-158))],s*.75)
  raise ValueError(kind)

KERN={('a','p'):-8,('p','l'):-5,('l','i'):3,('i','q'):-3,('q','u'):-6,('u','e'):-8,('e','f'):20,('f','y'):12,
('A','V'):-64,('A','W'):-46,('A','Y'):-64,('A','T'):-55,('V','A'):-64,('W','A'):-46,('Y','A'):-64,('T','A'):-55,
('T','a'):-55,('T','e'):-55,('T','o'):-58,('T','u'):-34,('T','r'):-32,('T','y'):-27,('V','a'):-42,('V','e'):-42,('V','o'):-42,
('W','a'):-24,('W','e'):-24,('W','o'):-24,('Y','a'):-55,('Y','e'):-55,('Y','o'):-55,('Y','u'):-35,('F','a'):-26,('F','o'):-27,('F','e'):-27,
('L','T'):-53,('L','V'):-53,('L','W'):-41,('L','Y'):-63,('P','a'):-22,('P','o'):-22,('P','.'):-65,('r','.'):-42,('v','a'):-15,('v','o'):-15,('w','o'):-10,('y','o'):-14,('f','a'):-13,('f','o'):-14,
('T','.'):-58,('V','.'):-68,('W','.'):-43,('Y','.'):-76,('T',','):-58,('V',','):-68,('W',','):-43,('Y',','):-76}

def full_kern(tf):
 # Apply base-pair positioning consistently to precomposed accented letters.
 pairs={}
 groups={}
 for c in tf.G:
  base=unicodedata.normalize('NFD',c)[0]
  groups.setdefault(base,[]).append(c)
 kern=KERN.copy()
 for l,r in zip("apliquefy","pliquefy"):
  gap=42 if tf.s>130 else 44
  kern[(l,r)]=round(gap-(tf.W[l]+tf.G[r].bounds[0]-tf.G[l].bounds[2]))
 for (l,r),v in kern.items():
  for lc in groups.get(l,[l]):
   for rc in groups.get(r,[r]):
    if lc in tf.G and rc in tf.G:pairs[(gn(lc),gn(rc))]=v
 return pairs

def build(tf,style,weight):
 version=FONT_VERSIONS[style];family=FONT_FAMILIES[style];stem=FONT_STEMS[style]
 chars=sorted(tf.G,key=ord);order=['.notdef']+[gn(c) for c in chars]
 outlines={'.notdef':tf.notdef,**{gn(c):tf.G[c] for c in chars}}
 metrics={'.notdef':(596,50),**{gn(c):(tf.W[c],round(tf.G[c].bounds[0]) if len(tf.G[c]) else 0) for c in chars}}
 cmap={ord(c):gn(c) for c in chars};pairs=full_kern(tf)
 for cff in [False,True]:
  fb=FontBuilder(1000,isTTF=not cff)
  fb.setupGlyphOrder(order);fb.setupCharacterMap(cmap)
  if not cff:
   glyphs={}
   for name,p in outlines.items():
    pen=TTGlyphPen(None);q=Cu2QuPen(pen,max_err=.45,reverse_direction=False);p.draw(q);glyphs[name]=pen.glyph()
   fb.setupGlyf(glyphs)
  else:
   glyphs={}
   for name,p in outlines.items():
    pen=T2CharStringPen(metrics[name][0],None);p.draw(pen);glyphs[name]=pen.getCharString()
   fb.setupCFF(stem,{'FullName':family+' '+style,'FamilyName':family,'Weight':style,'version':version,'Notice':'Original outlines created for Apliquefy. 2026.'},glyphs,{})
  fb.setupHorizontalMetrics(metrics);fb.setupHorizontalHeader(ascent=1080,descent=-300,lineGap=0)
  fb.setupNameTable({'familyName':family,'styleName':style,'uniqueFontIdentifier':family.replace(' ','')+'-'+version+'-'+style,'fullName':family+' '+style,'psName':stem,'version':'Version '+version,'copyright':'Original custom typeface created for Apliquefy, 2026.','manufacturer':'Apliquefy','designer':'Custom geometric construction for Apliquefy','description':'Original rounded geometric display typeface. Latin alphabet, European accents, numerals and symbols.','licenseDescription':'Custom deliverable for Apliquefy. Commercial use, embedding, modification and redistribution within brand projects permitted. See accompanying usage note.'})
  if style=='Regular':
   fb.font['name'].setName(family,16,3,1,0x409);fb.font['name'].setName(family,16,1,0,0)
   fb.font['name'].setName(style,17,3,1,0x409);fb.font['name'].setName(style,17,1,0,0)
  fb.setupOS2(version=4,sTypoAscender=1080,sTypoDescender=-300,sTypoLineGap=0,usWinAscent=1080,usWinDescent=300,sxHeight=520,sCapHeight=720,usWeightClass=weight,fsType=0,fsSelection=(0x80|(0x20 if weight>=700 else 0x40)))
  fb.setupPost(keepGlyphNames=True);fb.setupMaxp()
  fb.font['head'].macStyle=1 if weight>=700 else 0
  fb.font['head'].fontRevision=float(version)
  feat='languagesystem DFLT dflt;\nlanguagesystem latn dflt;\nfeature kern {\n'+''.join(f'pos {l} {r} {v};\n' for (l,r),v in pairs.items())+'} kern;\n'
  addOpenTypeFeaturesFromString(fb.font,feat)
  kern=newTable('kern');kern.version=0;k=KernTable_format_0();k.version=0;k.coverage=1;k.kernTable=pairs;kern.kernTables=[k];fb.font['kern']=kern
  ext='otf' if cff else 'ttf';folder='OTF' if cff else 'TTF';dst=OUT/folder/f'{stem}.{ext}'
  fb.font.save(dst)
  if not cff:
   font=TTFont(dst);font.flavor='woff2';font.save(OUT/'Web'/f'{stem}.woff2')
  print(dst,flush=True)
 return chars,pairs

def svg_wordmark(font_path,text='apliquefy',color='#14121C'):
 raw=font_path.read_bytes();face=hb.Face(raw);hf=hb.Font(face);hf.scale=(1000,1000)
 buf=hb.Buffer();buf.add_str(text);buf.guess_segment_properties();hb.shape(hf,buf,{'kern':True})
 ft=TTFont(font_path);gs=ft.getGlyphSet();order=ft.getGlyphOrder();pieces=[];x=0
 from fontTools.pens.boundsPen import BoundsPen
 bounds=[]
 for info,pos in zip(buf.glyph_infos,buf.glyph_positions):
  name=order[info.codepoint];pen=SVGPathPen(gs);tr=TransformPen(pen,(1,0,0,-1,x+pos.x_offset,-pos.y_offset));gs[name].draw(tr);pieces.append(pen.getCommands())
  bp=BoundsPen(gs);gs[name].draw(TransformPen(bp,(1,0,0,-1,x+pos.x_offset,-pos.y_offset)))
  if bp.bounds:bounds.append(bp.bounds)
  x+=pos.x_advance
 bb=[min(b[0] for b in bounds),min(b[1] for b in bounds),max(b[2] for b in bounds),max(b[3] for b in bounds)]
 view=f'{bb[0]:g} {bb[1]:g} {bb[2]-bb[0]:g} {bb[3]-bb[1]:g}'
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" role="img" aria-label="Apliquefy"><title>Apliquefy — original wordmark</title><g fill="{color}">'+''.join(f'<path d="{p}"/>' for p in pieces)+'</g></svg>'
 return svg,{'text':text,'font':'Apliquefy Display Bold','unitsPerEm':1000,'bounds':bb,'advance':x,'glyphs':[{'name':order[a.codepoint],'x_advance':b.x_advance,'x_offset':b.x_offset} for a,b in zip(buf.glyph_infos,buf.glyph_positions)]}

def specimen():
 im=Image.new('RGB',(2400,2240),'#F6F4FA');d=ImageDraw.Draw(im)
 body=str(OUT/'TTF'/'ApliquefyDisplayR2-Regular.ttf')
 small=ImageFont.truetype(body,29);label=ImageFont.truetype(body,23)
 y=65
 d.text((95,y),'APLIQUEFY DISPLAY / REGULAR R2 + BOLD',font=small,fill='#6B6278');y+=90
 for style in ['Bold','Regular']:
  f=lambda n:ImageFont.truetype(str(OUT/'TTF'/f'{FONT_STEMS[style]}.ttf'),n)
  d.text((95,y),'REGULAR R2 / 1.001' if style=='Regular' else 'BOLD / 1.000',font=label,fill='#7A3BFF');y+=40
  d.text((85,y),'apliquefy',font=f(235),fill='#14121C');y+=265
  d.text((95,y),'Seu próximo passo.',font=f(119),fill='#14121C');y+=150
  for text in ['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz','0123456789  @ € $ % & ? !','ÁÀÂÃÄÉÊÍÓÔÕÖÚÜÇ  áàâãäéêíóôõöúüç','Trabalho · Farmácia · Estágio · Comércio']:
   d.text((95,y),text,font=f(74),fill='#14121C');y+=110
  y+=65
 im.save(OUT/'Previa'/'ApliquefyDisplay-Specimen.png')

if __name__=='__main__':
 coverage=None
 for style,s,wt in [('Regular',102,400),('Bold',160,700)]:
  tf=Typeface(s);coverage,pairs=build(tf,style,wt)
  if style=='Bold':
   svg,meta=svg_wordmark(OUT/'TTF'/'ApliquefyDisplay-Bold.ttf')
   (OUT/'Fontes'/'apliquefy-wordmark-master.svg').write_text(svg)
   (OUT/'Fontes'/'wordmark-metrics.json').write_text(json.dumps(meta,indent=2))
 with (OUT/'Fontes'/'cobertura-glifos.csv').open('w') as f:
  w=csv.writer(f);w.writerow(['unicode','caractere','nome_unicode','glifo'])
  for c in coverage:w.writerow([f'U+{ord(c):04X}',c,unicodedata.name(c,''),gn(c)])
 (OUT/'Fontes'/'font-metadata.json').write_text(json.dumps({'family':'Apliquefy Display','version':'1.001','styleVersions':FONT_VERSIONS,'installedFamilies':FONT_FAMILIES,'fileStems':FONT_STEMS,'cssFamily':'Apliquefy Display','weights':{'Regular':400,'Bold':700},'unitsPerEm':1000,'xHeight':520,'capHeight':720,'ascender':1080,'descender':-300,'encodedCharacters':len(coverage),'kerningPairs':len(pairs),'scripts':['Latin'],'originalOutlines':True,'formats':['TTF','OTF/CFF','WOFF2']},indent=2))
 css='/* Apliquefy Display CSS family: Regular R2 at 400, original Bold at 700. */\n'
 for style,weight in [('Regular',400),('Bold',700)]:css+=f"@font-face {{\n  font-family: 'Apliquefy Display';\n  src: url('./{FONT_STEMS[style]}.woff2') format('woff2');\n  font-style: normal;\n  font-weight: {weight};\n  font-display: swap;\n}}\n"
 (OUT/'Web'/'apliquefy-display.css').write_text(css)
 specimen()
 if ROOT/'generate_font.py' != OUT/'Fontes'/'generate_font.py':shutil.copy2(__file__,OUT/'Fontes'/'generate_font.py')
 print('DONE',len(coverage),'characters',len(pairs),'kerning pairs')
