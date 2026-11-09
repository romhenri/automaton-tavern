// Modo livre: anda pela fortaleza com um anão e conversa com os outros, cada um no seu canto.
import { RECEITAS, type Receita } from './receitas.ts'
import { BARRIL, PEPITA, compose, dwarfSprite, icone, type Grid } from './sprites.ts'

// Um caractere por tile de 16x16. Gerado à mão: salas separadas por rocha, com portas.
export const MAPA = [
  '################################################################################################',
  '#6.......5.....#||||||||||||||#k+?w?k+wk+?k+?ww?k+?k+#_s_s_s_s#?"$"?"qq"?"$"?#úxxx#úxx#úxx#úxxx#',
  '#..7...........#ssssssssssssss#wwwwwwwwwwwwwwwwwwwwww#ssssssss#xxxxxxxxxxxxxx#xxxx#xxx#xxx#xxxx#',
  '#...........8..#s>s>sCssCs>s>s#wwwwwwwwwwwwwwwwwwwwwwwssssssss#"5xy"xxxx"yx5"#xxxx#xxx#xxx#xxxx#',
  '#....9.........#ssssssssssssss#wwwwwwwwwwwwwwwwwwwwww#ssssssss#xxxxxxxxxxxxxx#íííí#ííí#ííí#íííí#',
  '#............5.#|s>ssssss>ssss#k+wwwk+wk+?k+?ww?k+?k+#0s0s:s:s#?"$xxxxxxxx$"?#xxxxxxxxxxxxxxxxx#',
  '#..............#############ss###www#################################ü+###################xx####',
  '#.5..6..$....9.#pBpN+FFFpN+Bpp#uxxxxxu#EEEEEEEEEEEEEE#N+wwwN+w#xxxxxxxxxxxxxxxxxxxxxxx#SHMxxXSH#',
  '#.....7....$..7#ppp++pppp++ppp#xxxxxxx#vvvvvvvvvvvvvv#++www++w#x^`^xxxxxx`^xx^`^xx`^`x#xxxxxxxx#',
  '#5..6......$.8.#pppppppppppppp#xxxxxxx#vEEEvvvvvvEEEv#wCwwwCww#xxxxxxxxxxxxxxxxxxxxxxx#x;T;xxx?#',
  '#..9.7.........pppppIpppIppppp#Bxxxxxx#vvvvvvvvvvvvvv#wwwwwwww#xqyxxxxxxxyqyxxxqqxxyqx#xxxxxxxx#',
  '#..8........6..#pjpppppppppppp#uxxxxxu#vvv;;;vv;;;vvv#ww]++www#xxxxxxxxxxxxxxxxxxxxxxx#xxxxxxxx#',
  '#..7..5..8.7..6#pjppppppppppqq#xxxxxxB#vvv]++vv]++vvv#cw;w;wBw#xx))xxxxxx)`xx)))xx`)`x#k+xxxxxB#',
  '#..5.....895...#ypppIpppIppppp#xxxxxxx#vvv;;;vv;;;vvv#bwwwwwBw#xxxxxxxxxxxxxxxxxxxxxxx#xxxxxxxx#',
  '#9....6........#ppypppppppppqq#xxxxxxx#vvvvvvvvvvvvvv#Uwwwwwww#x`^`xxxxxxx^^xx`^`xx^`x#xxxxxxxx#',
  '#.9.7...5..6..8#pBpppppppppBpp#uxxxxxu#EEEvvvvvvvvEEE#EEwwwEEw#xxxxxxxxxxxxxxxxxxxxxxx#Bxxxxxx?#',
  '######################pp#########xxx######vv############ww##########xxxx###################xxx##',
  '#ww}}ww<www<<ww#EE??EEvvEE??EE#uxxxxxxxxBxxxx#BBwRORORORwrrrrr#xSHMXxxxxSHMXx#k+xk+#éwéwé#uxxxu#',
  '#wwwwwwwwwwwwww#vvvvvvvvvvvvvv#xxxxxxxxxxxxxx#Bwwwwwwwwwwrr!rr#xxxxxxxxxxxxxx#?xxx?#wwwww#xxxxx#',
  '#w{www{www{wwww#v*v*vvvvvv*v*v#x;;;xxxxxx;;;x#wwAWAWAWAwwwwwww#xxDxxxxDxxxDxx#k+xk+#áwáwá#xxxxx#',
  '#wwwwwwwwwwwwwwwv;v;vvvvvv;v;vvx]++xxxxxx]++xwwwwwwwwwwwww;;ww#xxxxxxxxxxxxxxxxxxk+#wwwwwwxxxxx#',
  '#wwwwwwwwwwwwww#vvvvvvvvvvvvvvvx;;;xxxxxx;;;xwww;;;wwwwwww[+ww#xxxxxxxxxxxxxxxxxxx?#wwwwwwxxxxu#',
  '#w{www{www{wwww#v*v*vvvvvv*v*vvxxxxxxxxxxxxxx#ww]++ww;;;ww;;ww#xxxxxxxxxxxxxxxxxxk+#wwwwwwxxxxB#',
  '#wwwwwwwwwwwwww#v;v;vvvvvv;v;v#xxxxxxxxxxxxxx#ww;;;ww]++wwwwww#xxDxxxxDxxxDxx#k+xk+#áwáwá#xxxxx#',
  '#wwwwwwwwwwwwww#vvvvvvvvvvvvvv#xxxxxxxxxxxxxx#wwwwwww;;;wwwwww#xxxxxxxxxxxxxx#?xxx?#wwwww#xxxxx#',
  '#w<<w}}ww}}w<<w#??vvvvvvvvvv??#uxxxxxxxxxxxBu#wwwwwwwwwwwwwwBB#xxxxxxxxxxxxxx#k+xk+#ówéwó#uxxxu#',
  '#######ww###########################xx####################ww########xxxx###################xxx##',
  '#,,,,l,,,,l,,,l,,,,,,,,,,,,,,,,,,,,,,,,,,~~~Y,,,,,,,,,,,,,,,,iii,,,,,,,,,,,,,,,,,,,,,,,/,,,,,,,#',
  '#,,,,,,,,,,u,,,,u,,,,,,,,,,,,,,,,,,,,,,,u~~~,,,,,,,,,,,,,,,,,,,,,,,,,,/,,,,,,,,,,,,,Y,,,,,/,,,,#',
  '#,,,,,,,,,z,,,,,,,,,c,,c,,c,,c,,c,,c,,c,,~~~,,,@,&,%,V,,,,,,,,,,,,/,,,,,,,/,,,,Y,,/,,,,,,,,,Y,,#',
  '#,,,l,,,l,,l,,l,,l,,c,,c,,c,,c,,c,,c,,c,,~~~,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,aQaaaa#',
  '#,,,,,,,,,,,,,,,,,,,c,,c,,c,,c,,c,,c,,c,,~~~,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/,,l,a5Qaaaa#',
  '#,,Y,,,,,,l,,l,,,,,,c,,c,,c,,c,,c,,c,,c,,===,,,,,,,,,,,,,,,,,,,,,,,/,,,,,,,,,,,,,,,,,,,aaaaaQaa#',
  '#,,,,,l,,,,,,,,,l,,,c,,c,,c,,c,,c,,c,,c,,~~~,,,,,ffffffffffffffff,,,,,,,,,,,,,,l,,,,,,,maaaaamQ#',
  '#,,,,,,,,,,,,,,,,,,,c,,c,,c,,c,,c,,c,,c,,~~~,,,,,f,,P,f,h,,f,,G,f,,,,,,,,,,,,,,,,Y,,,,,aaaaaaaa#',
  '#,,,,l,,l,,Y,,l,,l,,c,,c,,c,,c,,c,,c,,c,,~~~,,,,,f,P,,f,,h,fGG,,f,/,,,,,,,,,,,,,,,,/,,,,QaaQa5a#',
  '#,,,Y,u,,u,,,,u,,Y,,,,,,,,,,,,,,,,,,,,,,,~~~Yu,,,ffffffffffffffff,,,/,,,,,,,,,,,,,,,,,,,,aQaaaa#',
  '#,,,,,,,,,,,,,,,ppppppppppppppppppppppppp~~~pppppppppppppppppp,,,/,,,,,,,,,,/,,,,,,,,,,,,,,Y,,,#',
  '#,Y,,,,,,,Y,,,l,Bpppppppppppppppppppppppp~~~pppppppppppppppppB,,/Y,,,,,/,,Y,,,,,,Y,,,,,,,,,,,,,#',
  '#,,,e,,,,,,,,l,,ppJ+ppppK+pppppppJ+pppppp~~~ppppZ+ppppJ+pppppp,,,,l,,,,,,,,,,,,,,,,,,l,,,,/,l,,#',
  '#,g,,,,,,,,,,,,,pp++pppp++ppppppp++pppppp~~~pppp++pppp++pppppp,,,,,,/,,,,l,,,,,,,,/,,,,,,,,,,,,#',
  '#n,,,g,,,Y,,l,,,ppppppppppppppppppppppppp~~~pppppppppppppppppp,,,,,,,,,,,,,,/,,/,,,,,,,,,,,,,,,#',
  '#,,e,,,,n,,,,,l,pppppppppppppppppppp(+ppp---pppppppppppp(+pppp,,,/,,,,,,Y,,,,,,,,l,,Y,,,,,l,,,,#',
  '#g,e,,,g,,,,,,,,pBppppppppppppppppppppppp---ppppppppppppppppBp,,,,,,l,,,,,,,,,,Y,,,,,,,,,,,,,,,#',
  '#,e,n,,,,,,,,,,,pppppK+ppppZ+pppppppK+ppp---pppppppJ+ppppK+ppp,,,,,,,,/,,,/,,,,,,,,,,,,,,,,/,,,#',
  '#,,g,ee,n,,,,l,,ppppp++pppp++ppppppp++ppp~~~ppppppp++pppp++ppp,,,,,,,Y,,,,,,,,/,,,,,,,,,,,,,,/,#',
  '#n,,e,n,,,Y,,,,,ppppppppppppppppppppppppp~~~pppppppppppppppppp,,,,,,,,l,,/,,,,,,,,,Y,,,,/,,,,,,#',
  '#,g,,e,,,g,,,,l,ppppppp(+pppppppppppppppp~~~pp(+pppppppppppppp,/,,Y,,,,,,,,l,,,,,,,,,,,,,,Y,,,,#',
  '#g,g,,ne,,,,l,,,Bpppppppppppppppppppppppp~~~pppppppppppppppppB,,,,,,/,,,,,,,,,,,,,,,,/,,,,,,,,,#',
  '#,,,,,,,,,/,,,/,,,,,,,,,,,,,,,,,,,,,,,,,,~~~,,,,,,,,,,,,,,,,,,,,,/,,,,,,,,,,,,,,,,Y,,,,,,,,,,,,#',
  '#,nl,,le,,,,/,,,l,,,,,,l,/,,,,,,,,,,,,,,,~~~,,,,,,,,,/,,,l,,,,,,,,,,Y,,,,,,,,/,,,,,,/,,,,Y,,,,,#',
  '#,,,,n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~~~,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,l,,/,,,,,,,,,,,Y#',
  '#Y,g,,,Y,,,,Y,,,,/,,,,,,,,,,/,,/,/,,,,/,,~~~,,,,,,,/,,,,,,,,,,,l,,,,,,,,,Y,,,Y,,,,,,,,l,,,,/,,,#',
  '################################################################################################',
]
const T = 16
const PAREDE = '#o1234' // rocha e veios de minério
const SOLIDO = PAREDE + '~BTFLbfENIYuDSHMXJKZmCUROAW$@&%56789!^(+[]jqyi{}<*?>|k"0_:`)áéóíúü' // P, G, h (ovelha), Q, V e z são bichos: o chão embaixo é livre, eles é que ocupam. Trigo (c), cogumelos (g, e, n), mato (/) e cadeira (;) se atravessam.
// Objetos maiores que um tile ficam com a letra no canto de cima à esquerda e '+' no resto.
export const INICIO: [number, number] = [54, 21] // meio da taverna

/** Onde cada anão fica, perto do que faz. */
export const LOCAL: Record<string, [number, number]> = {
  hidromel: [7, 10], // mina
  cerveja: [67, 20], // quartel
  grogue: [22, 9], // forja
  licor: [22, 34], // fazenda
  furia: [49, 18], // barris da taverna
  contra: [72, 23], // quartel
  teclados: [45, 10], // biblioteca
  nobre: [70, 8], // museu
  trapacas: [25, 42], // livre comércio
  lampadas: [29, 43], // lampiões do livre comércio
  moderado: [50, 47], // livre comércio
  comprido: [25, 30], // fazenda
  mari: [6, 30], // jardim
  aquecido: [23, 21], // administração
  pontes: [40, 31], // ponte
  papagaios: [49, 31], // animais
  scarlett: [60, 18], // palco da taverna
  formigas: [89, 33], // formigueiro
}

/** O que cada anão diz pela fortaleza: conversa do dia a dia, sem pedido de drink nem ingrediente. */
export const FALAS: Record<string, string> = {
  hidromel: 'Não acorda o dragão. Eu cavo baixinho perto dele há trinta anos.',
  cerveja: 'Martelo no ombro, escudo no braço. Quem passa pelo quartel treina comigo.',
  grogue: 'Esse fogo não apaga desde o tempo do meu avô. E não vai apagar no meu.',
  licor: 'Terra boa é terra trabalhada. O trigo daqui alimenta a fortaleza inteira.',
  furia: 'Fico de olho na taverna. Briga aqui dentro, eu separo. Briga lá fora, eu assisto.',
  contra: 'Todo mundo treina de manhã. Eu treino de noite. Alguém tem que ser diferente.',
  teclados: 'Estou desmontando um relógio élfico. Já entendi tudo, só sobraram sete peças.',
  nobre: 'Cada peça deste museu tem história. A maioria fui eu que trouxe, e não pergunte como.',
  trapacas: 'Pedra da sorte, autêntica! Só um pouco pintada. Faço preço bom pra você.',
  lampadas: 'Acendo cada lanterna da fortaleza antes do sino. Sem mim, todo mundo tropeça.',
  moderado: 'Não compre nada do meu irmão. Compre de mim. A diferença é que eu devolvo o troco.',
  comprido: 'Daqui de cima eu vejo a fazenda inteira. É a vantagem de ser comprido.',
  mari: 'Cuidado com a cobra. Ela é mansa, mas só comigo.',
  aquecido: 'Agora cuido dos papéis da fortaleza. Receita de remédio ou recibo, a letra é a mesma.',
  pontes: 'Essa ponte aguenta um mamute. Testei com três anões pulando.',
  papagaios: 'Diga oi pros meus papagaios. Mas cuidado: eles repetem os segredos também.',
  scarlett: 'O palco é meu até a última música. Depois disso, ainda é meu.',
  formigas: 'Cada formiga aqui tem nome. Estou na de número quatrocentos e doze.',
}

const ZONAS: [string, number, number][] = [
  ['Mina', 7, 1], ['Quartel', 69.5, 18], ['Forja', 22.5, 7], ['Museu', 74, 15], ['Fazenda', 28, 27], ['Taverna', 53.5, 17],
  ['Biblioteca', 45.5, 8], ['Alquimista', 22.5, 1], ['Jardim', 7.5, 27], ['Animais', 53.5, 27], ['Cozinha', 57.5, 8], ['Formigueiro', 90.5, 30],
  ['Livre Comércio', 38.5, 38], ['Cogumelos', 5, 39], ['Carpintaria', 7.5, 17], ['Área Comum', 37.5, 17], ['Administração', 22.5, 17], ['Dormitório Militar', 80, 17], ['Cofre', 69.5, 1], ['Dormitório', 41.5, 1], ['Corredor', 34, 7], ['Corredor', 92, 17], ['Atelier', 86, 17], ['Prisão', 86, 1], ['Guarda', 90.5, 7], ['Banheiro', 57.5, 1],
]
/** Áreas novas, ainda vazias: só um nome grande no chão para referência (tamanho da letra cabe na altura da faixa). */
const SALAS: [string, number, number, number][] = [
]

export const andavel = (x: number, y: number) => !SOLIDO.includes(MAPA[y]?.[x] ?? '#')

// ---------------------------------------------------------------- desenho

const PISO: Record<string, [string, string]> = {
  '#': ['#2a221d', '#3d322a'], '.': ['#4a3c30', '#3d322a'], p: ['#2a221d', '#5a4e44'], x: ['#5e5652', '#3e3834'],
  s: ['#3e3834', '#5e5652'], v: ['#8a6438', '#6a4420'], ',': ['#3a3018', '#5a8a2a'], w: ['#6a4018', '#4a2a10'],
  r: ['#8a1424', '#b0302a'], '~': ['#1a3a6a', '#5ce6e6'], '=': ['#9c6a2f', '#5a3a18'], '-': ['#6a5e52', '#3d322a'], a: ['#5a3a1a', '#3a2410'],
}
const MADEIRA = { n: '#9c6a2f', N: '#c88a4a' }
const VEIO = [
  '................', '..o.........O...', '.oOo.......oo...', '..oo..........o.', '.......o.....oOo', '......oOo.....o.',
  '.......oo.......', '..o.............', '.oOo........o...', '..o........oOo..', '............oo..', '....o...........',
  '...oOo.....o....', '....oo....oOo...', '...........o....', '................',
]
const MINERIO: Record<string, Grid> = {
  o: compose([VEIO], { o: '#f0c040', O: '#fff0a0' }), // ouro
  1: compose([VEIO], { o: '#a8705a', O: '#d8a890' }), // ferro
  2: compose([VEIO], { o: '#d87830', O: '#ffb070' }), // cobre
  3: compose([VEIO], { o: '#111111', O: '#4a4a4a' }), // carvão
  4: compose([VEIO], { o: '#2fc870', O: '#aaffcc' }), // esmeralda
}
const PEDRA = [
  '', '', '', '', '', '......kkkk......', '....kkssSskk....', '...ksSssssssk...', '..kssosssssOsk..', '..kssOossssssk..',
  '.ksssssssoOsssk.', '.ksoOssssssssSk.', '.kssossssOsssSk.', '..kkSSSSSSSSkk..', '....kkkkkkkk....',
]
const VEIOS: [string, string, string][] = [['5', '#f0c040', '#fff0a0'], ['6', '#a8705a', '#d8a890'], ['7', '#d87830', '#ffb070'], ['8', '#111111', '#4a4a4a'], ['9', '#2fc870', '#aaffcc']]
const PEDRAS = Object.fromEntries(VEIOS.map(([c, o, O]) => [c, compose([PEDRA], { s: '#7a6a5a', S: '#5a4a3a', o, O })]))
const MICROFONE = compose([[
  '', '......kkkk......', '.....kIiIik.....', '.....kiIiIk.....', '......kkkk......', '.......kk.......', '.......ki.......', '.......ki.......',
  '.......ki.......', '.......ki.......', '.......ki.......', '.......ki.......', '.......ki.......', '.....kkiikk.....', '....kiiiiiik....', '....kkkkkkkk....',
]], { i: '#6a6a72', I: '#b8bcc4' })
/** Troca cada cor do sprite por um dos quatro `tons`, do escuro ao claro, conforme o brilho. */
const tinge = (g: Grid, tons: string[]): Grid => g.map((row) => row.map((c) => {
  if (!c) return c
  const n = parseInt(c.slice(1), 16), luz = ((n >> 16) + ((n >> 8) & 255) + (n & 255)) / 3
  return tons[luz < 50 ? 0 : luz < 110 ? 1 : luz < 170 ? 2 : 3]
}))
const ESTATUA = tinge(dwarfSprite('Estátua', 'Metalsmith'), ['#4a2e05', '#a87418', '#e0a82a', '#fff0a0']) // anão de ouro
const QUEIMADO = ['#000000', '#141414', '#262626', '#3a3a3a']
const ENVENENADO = ['#2a0a3a', '#6a2a8a', '#a050c8', '#d8a0f0']
const SUPORTE = ['', '', '', '', '', '', '', '', '', '', '', '', '', '....kkkkkkkk....', '...knnnnnnnnk...', '...kkkkkkkkkk...']
const ARMA = { ...MADEIRA, i: '#6a6a72', I: '#b8bcc4', w: '#e8ecf0', y: '#e0a82a' }
const ESPADA = compose([SUPORTE, [
  '.......kk.......', '......kwIk......', '......kwIk......', '......kwIk......', '......kwIk......', '......kwIk......',
  '......kwIk......', '......kwIk......', '....kkkwIkkk....', '....kyyyyyyk....', '....kkknnkkk....', '......knnk......', '......kyyk......',
]], ARMA)
const ESCUDO = compose([[
  '........', '....kkkk', '..kkiiii', '.kinnnnn', '.kinNnnn', 'kinnNnnn', 'kinnNnkk', 'kiNNNkII',
  'kinnNkII', 'kinnNnkk', '.kinNnnn', '.kinnnnn', '..kiiiii', '...kkkkk', '........', '........',
]], { n: '#a8302a', N: '#d8a040', i: '#8a8f99', I: '#d8dce4' })
const CABO = ['........', ...Array(12).fill('......kn'), '....kkkk', '...knnnn', '...kkkkk']
const MARTELO = compose([CABO, ['..kkkkkk', '.kIIIIII', '.kiiiiii', '.kiiiiii', '..kkkkkk']], ARMA)
const MACHADO = compose([CABO, ['......kk', '.kk...kn', 'kIik..kn', 'kIiikkkn', 'kIiiiiin', 'kIiikkkn', 'kIik..kn', '.kk...kn']], ARMA)
const BONECO = compose([[
  '........', '.....kkk', '....kyYy', '....kyyy', '.....kkk', 'kkkkkyyy', 'nnnnkyrr', 'kkkkkyrw',
  '....kyrr', '....kyyy', '.....kkk', '......kn', '......kn', '....kkkn', '...knnnn', '...kkkkk',
]], { y: '#c8a050', Y: '#e8c070', r: '#c43a1a', w: '#f4ecd8', n: '#7a4a22' })
const FOGO = { r: '#e83a1a', y: '#ffb02a', w: '#fff0a0' }
const CALDEIRAO = compose([[
  '................', '.....s....s.....', '......s..s......', '.....s.Gg..s....', '...kkkkkkkkkk...', '..kIIIIIIIIIIk..',
  '..kgGggGgggGgk..', '.kkiiiiiiiiiikk.', 'k.kiIIiiiiiiik.k', 'k.kiIiiiiiiiik.k', '.kkiiiiiiiiiikk.', '..kiiiiiiiiiik..',
  '...kkkkkkkkkk...', '...ry.wyrr.yr...', '..knnkkknnkkknk.', '..kkkkkkkkkkkkk.',
]], { g: '#5ac83a', G: '#b8ff8a', i: '#2a2a32', I: '#5a5a66', s: '#c8c8c8', n: '#7a4a22', ...FOGO })
const MONTE = compose([[
  '................', '................', '................', '................', '................', '.......kk.......',
  '.....kkaakk.....', '....kaaAaaak....', '...kaaAkkAaak...', '..kaaAkxxkAaak..', '..kaaaAkkAaaak..', '.kaAaaaaaaaAaak.',
  '.kaaaAaaaAaaaak.', 'kkkkkkkkkkkkkkkk', '................', '................',
]], { a: '#7a5028', A: '#9a6a3a', x: '#0d0a08' })
const FORMIGA = compose([[
  '', '', '', '', '', '', '', '', '', '', '.....k.k..k.....', '......kk.k......', '...kk.kkkkkk.kk.', '..kkkkkkkk.kkkk.', '.....k.k..k.k...',
]], {})
const CERCA = compose([[
  '........', '........', '........', '.kkk....', '.knk....', 'kknkkkkk', 'NNnNNNNN', 'kknkkkkk',
  '.knk....', 'kknkkkkk', 'NNnNNNNN', 'kknkkkkk', '.knk....', '.knk....', '.kkk....', '........',
]], MADEIRA)
const MESA = compose([[
  '........', '........', '........', '........', '.kkkkkkk', '.kNNNNNN', '.knnnnnn', '.kkkkkkk',
  '..knk...', '..knk...', '..knk...', '..kkk...', '........', '........', '........', '........',
]], MADEIRA)
const ESTANTE = compose([[
  'kkkkkkkk', 'knnnnnnn', 'knkkkkkk', 'knrrbbgk', 'knrrbbgk', 'knrrbbgk', 'knnnnnnn', 'knkkkkkk',
  'knyygrrk', 'knyygrrk', 'knyygrrk', 'knnnnnnn', 'knkkkkkk', 'knbbyyrk', 'knnnnnnn', 'kkkkkkkk',
]], { ...MADEIRA, r: '#b0302a', b: '#3a5aa8', g: '#3a8a2a', y: '#e0a82a' })
const FORJA = compose([[
  '.kkkkkkk', 'kbBbbBbb', 'kbbbbbbb', 'kBbbBbbb', 'kbbkkkkk', 'kbkryryr', 'kbkyrwyr', 'kbkrryrr',
  'kbkkkkkk', 'kbBbbbBb', 'kbbbbbbb', 'kkkkkkkk', '........', '........', '........', '........',
]], { ...FOGO, b: '#8a3a1a', B: '#a84a2a' })
const BIGORNA = compose([[
  '........', '........', '........', '........', '.kkkkkkk', 'kiIIIIII', 'kiiiiiii', '.kkkiiii',
  '...kkiii', '....kiii', '...kkiii', '..kiiiii', '..kiiiii', '..kkkkkk', '........', '........',
]], { i: '#4a4a52', I: '#8a8f99' })
const VERDE = { g: '#3a8a2a', G: '#6cdc4a' }
/** Copa 32x22: meio tile para cada lado e por cima do tronco. Elipse com borda irregular e brilho espalhado. */
// Copa feita de tufos redondos: cada tufo tem luz em cima à esquerda, sombra embaixo à direita e um traço que o separa do vizinho.
const TUFOS = [[16, 6, 7], [9, 10, 7], [23, 10, 7], [5, 15, 5], [27, 15, 5], [12, 15, 6], [20, 15, 6], [16, 12, 6]]
const tufo = (i: number, j: number) => {
  for (let n = TUFOS.length - 1; n >= 0; n--) { // o último tufo fica na frente
    const [cx, cy, r] = TUFOS[n], dx = (i - cx) / r, dy = (j - cy) / r
    if (dx * dx + dy * dy < 1) return { n, dx, dy, borda: dx * dx + dy * dy > 0.75 }
  }
}
const COPA: Grid = Array.from({ length: 22 }, (_, j) => Array.from({ length: 32 }, (_, i) => {
  const t = tufo(i, j)
  if (!t) return null
  if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => !tufo(i + a, j + b))) return '#1b1410'
  if (t.borda && tufo(i, j + 1)?.n !== t.n && t.dy > 0) return '#1f4a1a' // dobra entre tufos
  if ((i * 7 + j * 13) % 19 === 0) return '#9cf06a' // folha solta brilhando
  return t.dx + t.dy < -0.7 ? VERDE.G : t.dx + t.dy > 0.4 ? '#2a6a22' : VERDE.g
}))
const ARVORE = compose([[
  '.....knn', '.....knn', '.....knn', '.....knn', '.....knn', '.....knn', '.....kNn', '.....knn',
  '.....knn', '.....knn', '.....knn', '....kknn', '...knnnn', '..kkkkkk', '........', '........',
]], { n: '#5a3a18', N: '#7a5a2a' })
const CERCA_V = compose([[
  '......kN', '......kN', '.....kkn', '.....knn', '.....kkn', '......kN', '......kN', '......kN',
  '......kN', '......kN', '.....kkn', '.....knn', '.....kkn', '......kN', '......kN', '......kN',
]], MADEIRA)
const ARBUSTO = compose([[
  '....kkkk.kkkk...', '..kkgGGgkgGGgk..',
  '.kgGGggrgGgggdk.', '.kgGgrwggggrgdk.',
  'kgGggrrggggrrgdk', 'kgggggggGGgggddk',
  'kgGgrggGGggggdgk', 'kggrwrgggggrgddk',
  'kgggrggggrgrwgdk', 'kgGgggGggrrggddk',
  '.kgggGGggggggdk.', 'kgggrgggggrggddk',
  'kgdgrrgggrwrgddk', '.kdddgggggrgdddk',
  '..kdddddddddddk.', '...kkkkkkkkkkk..',
]], { ...VERDE, d: '#2a6a22', r: '#e02a3a', w: '#ffb0b8' })
const FLORES = compose([[
  '................', '................', '...r.......y....', '..rwr.....ywy...', '...r.......y....', '...g.......g....',
  '...g...p...g....', '......pwp.......', '.......p........', '.......g........',
]], { ...VERDE, r: '#e02a3a', y: '#ffd23b', p: '#c070e0', w: '#fff6e0' })
const PORCO = compose([[
  '', '', '', '', '', '..k.kkkkkkk.....', '.kpkpppppppkk...', '..kpppppppppkk..', '.kppppppppepPk..',
  '.kppppppppppPPk.', '.kppppppppppPPk.', '..kpppppppppkk..', '...kkkkkkkkk....', '...kpk...kpk....', '...kk.....kk....',
]], { p: '#f0a0a8', P: '#d87888', e: '#1b1410' })
const GALINHA = compose([[
  '', '', '', '..........kk....', '.........krrk...', '........kwwwwk..', '........kwwewkk.', '..k.....kwwwkyyk',
  '.kwk...kwwwwkkk.', '.kwwkkkwwwwwwk..', 'kwwwwwwwwwwwwk..', 'kwwWWWwwwwwwwk..', 'kwwwWWWwwwwwk...', '.kwwwwwwwwwk....',
  '..kkkkkkkkk.....', '....y...y.......',
]], { w: '#f4ecd8', W: '#d8d0b8', r: '#e02a3a', y: '#ffb02a', e: '#1b1410' })
/** Grade de qualquer tamanho, para o que não cabe em 16x16. */
const grade = (rows: string[], pal: Record<string, string>): Grid => rows.map((r) => [...r].map((c) => (c === '.' ? null : (pal[c] ?? '#1b1410'))))
const pad = (r: string) => r.padEnd(32, '.')
/** Mesa comprida de n tiles. */
const mesaLonga = (n: number) => {
  const w = n * T, meio = (c: string) => '.k' + c.repeat(w - 4) + 'k.'
  const perna = (p: string) => p + '.'.repeat(w - 10) + [...p].reverse().join('')
  return grade(['', '', '', '', '.' + 'k'.repeat(w - 2) + '.', meio('N'), meio('n'), '.' + 'k'.repeat(w - 2) + '.',
    perna('..knk'), perna('..knk'), perna('..knk'), perna('..kkk')].map((r) => r.padEnd(w, '.')), MADEIRA)
}
const CADEIRA = compose([['', '', '', '', '', '', '...kkkkk', '...knnnn', '...kNNNN', '...kkkkk', '...kn...', '...kn...', '...kk...']], MADEIRA)
/** Fornalha 2x2 de tijolos, chaminé em cima e boca em arco com fogo. */
const FORNALHA = grade(Array.from({ length: 32 }, (_, j) => Array.from({ length: 32 }, (_, i) => {
  const chamine = i >= 12 && i <= 19 && j <= 4, corpo = i >= 2 && i <= 29 && j >= 4 && j <= 30
  if (!chamine && !corpo) return '.'
  if (chamine && j < 4 ? i === 12 || i === 19 || j === 0 : i === 2 || i === 29 || j === 4 || j === 30) return 'k'
  const boca = (bi: number, bj: number) => bi >= 9 && bi <= 22 && bj <= 29 && (bj >= 20 || (bi - 15.5) ** 2 / 42 + (bj - 20) ** 2 / 36 < 1)
  if (boca(i, j)) {
    if (!boca(i - 1, j) || !boca(i + 1, j) || !boca(i, j - 1)) return 'k'
    return j < 23 ? 'x' : (i * 5 + j * 3) % 7 < 2 ? 'w' : (i + j) % 3 ? 'y' : 'r'
  }
  return j % 4 === 0 || (i + (Math.floor(j / 4) % 2) * 3) % 6 === 0 ? 'm' : (i * 3 + j) % 5 ? 's' : 'S'
}).join('')), { m: '#3a3a42', s: '#6a6a72', S: '#8a8a92', x: '#1b1410', ...FOGO })
// Barraca 2x2: toldo listrado, postes e balcão com quatro montes de mercadoria.
const MONTE_BENS = ['..1..', '.111.', '1w111', '11111']
const BARRACA = [
  '.' + 'k'.repeat(30) + '.',
  ...Array.from({ length: 6 }, () => 'k' + 'aaaaAAAA'.repeat(4).slice(0, 30) + 'k'),
  '.' + 'k'.repeat(30) + '.',
  '..' + Array.from({ length: 7 }, (_, i) => (i % 2 ? 'kAAk' : 'kaak')).join('') + '..',
  '..' + '.kk.'.repeat(7) + '..',
  ...Array(7).fill('..kn' + '.'.repeat(24) + 'nk..'),
  ...MONTE_BENS.map((m) => '..kn' + [1, 2, 3, 1].map((n) => '.' + m.replaceAll('1', String(n))).join('') + 'nk..'),
  'k'.repeat(32),
  'k' + 'N'.repeat(30) + 'k',
  ...Array(6).fill('k' + 'n'.repeat(9) + 'N' + 'n'.repeat(10) + 'N' + 'n'.repeat(9) + 'k'),
  'k'.repeat(32),
  '.'.repeat(32),
]
const BENS = { ...MADEIRA, w: '#fff6e0' }
// Carrinho de frutas 2x1
const CARRINHO = grade([
  '', '', '.......1....2.....3', '.....11w1..2w2...3w33', '....1111122222.33333331', '...k1112222w22333332111k',
  '...knnnnnnnnnnnnnnnnnnnk', '...kNNNNNNNNNNNNNNNNNNNkkkkkkkk', '...knnnnnnnnnnnnnnnnnnnknnnnnnnk', '...kNNNNNNNNNNNNNNNNNNNkkkkkkkk',
  '...kkkkkkkkkkkkkkkkkkkkk', '.....kkkk.......kkkk', '....kiiiik.....kiiiik', '....kiNNik.....kiNNik', '....kiiiik.....kiiiik', '.....kkkk.......kkkk',
].map(pad), { ...MADEIRA, 1: '#e02a3a', 2: '#ffb02a', 3: '#6cdc4a', w: '#fff6e0', i: '#4a4a52' })
// 2x2: de perfil olhando para a direita, sela no lombo onde o anão senta
const CORPO_CAVALO = [
  '', '', '........................k.k', '.......................kbkbk',
  '......................kmbbbbk', '.....................kmmbbbbbk', '....................kmmhbbbebbk', '....................kmmhbbbbbbbk',
  '...................kmmhbbbbbbnnk', '...................kmmhbbkkbnenk', '..................kmmhbbbk.knnk', '..................kmmhbbbk..kk',
  '.................kmmhbbbbbk', '..kk.............kmhbbbbbbk', '.kmmk.kkkkkkkkkkkkhhbbbbbbBk', 'kmmmmkhksssssssSkhhbbbbbbbBk',
  'kmmmkbbksssssssSkbbbbbbbbbBk', '.kmmkbbkSSSSSSSSkbbbbbbbbbBk', '.kmmkbbbkkkkkkkkbbbbbbbbbbBk', 'kmmmkbbbbbbbbbbbbbbbbbbbbbBk',
  'kmmmkBbbbbbbbbbbbbbbbbbbbBBk', 'kmmk.kBbbbbbbbbbbbbbbbbbBBk', 'kmmk.kBBBBBBBBBBBBBBBBBBBBk', '.kmk.kbBkBBkkkkkkkkkbBkBBk',
  '.kmk.kbBkBBk.......kbBkBBk', '..kk.kbBkBBk.......kbBkBBk', '.....khBkBBk.......khBkBBk', '.....kbBkBBk.......kbBkBBk',
  '.....kbBkBBk.......kbBkBBk', '.....kwwkddk.......kwwkddk', '.....kddkddk.......kddkddk', '.....kkkkkkk.......kkkkkkk',
]
const COR_CAVALO = { b: '#8a5a2a', B: '#6a4018', h: '#a87a4a', m: '#2a1a0a', d: '#3a2a18', n: '#5a3a1a', w: '#f4ecd8', s: '#c43a1a', S: '#8a1424' }
const CAVALO = grade(CORPO_CAVALO.map(pad), COR_CAVALO)
// Passos do anão a pé: só os pés (linhas 14 e 15) mudam, a altura fica a mesma.
const PES = [['..kddk...kddk...', '.kddkk....kddk..'], ['...kddk...kddk..', '..kddk....kkddk.']]
// Trote: só as pernas mudam, os cascos ficam sempre na mesma linha para o cavalo não subir e descer.
const TROTE = [[
  '.kmk.kbBkBBk.......kbBkBBk', '..kkkbBk.kBBk.......kbBkk', '....khBk.kBBk.......khBkk', '...kbBk...kBBk......kkbBk',
  '...kbBk...kBBk......kkbBk', '...kwwk...kddk......kkwwk', '..kddk.....kddk....kddkddk', '..kkkk.....kkkk....kkkkkkk',
], [
  '.kmk.kbBkBBk.......kbBkBBk', '..kk..kbBkk.......kbBk.kBBk', '......khBkk.......khBk.kBBk', '......kkbBk......kbBk...kBBk',
  '......kkbBk......kbBk...kBBk', '......kkwwk......kwwk...kddk', '.....kddkddk....kddk.....kddk', '.....kkkkkkk....kkkk.....kkkk',
]].map((pernas) => grade([...CORPO_CAVALO.slice(0, 24), ...pernas].map(pad), COR_CAVALO))
const COBRA = compose([[
  '', '', '', '', '', '', '', '', '..........kkk...', '.........kgegk..', '..kkk....kgggkr.', '.kgGgk..kgGgk...',
  'kgk.kgkkgGgk....', 'kgk..kgGggk.....', '.kgk..kkkk......', '..kk............',
]], { g: '#5a9a2a', G: '#c8d84a', e: '#ffe14a', r: '#e02a3a' })
const PAPAGAIO = [
  '................', '................', '.......kkk......', '......kpppk.....', '......kpepkk....', '......kppkyyk...',
  '.....kppppkk....', '....kpPPppk.....', '....kpPPPpk.....', '....kpPPppk.....', '.....kppkk......', '...kkkpkkkkk....',
  '...knnnnnnnk....', '...kkkknkkkk....', '.......n........', '.....kknkk......',
]
// Bater de asa: a asa abre para trás e para cima sem passar da cabeça, então o papagaio não muda de altura.
const MEIA_ASA = [...PAPAGAIO.slice(0, 6), '...kkppppkk.....', '..kPPkPppk......', '..kPPPPPpk......', '...kkPPppk......', ...PAPAGAIO.slice(10)]
const ASA_CIMA = [...PAPAGAIO.slice(0, 3), '..k...kpppk.....', '.kPk..kpepkk....', '.kPPk.kppkyyk...', '.kPPPkppppkk....', '..kPPPkpppk.....',
  '...kPPPkppk.....', '....kkkpppk.....', ...PAPAGAIO.slice(10)]
/** Quadros de cada papagaio: pousado, meia asa, asa em cima, meia asa. */
const PAPAGAIOS: Record<string, Grid[]> = Object.fromEntries(Object.entries({ '@': ['#e02a3a', '#3a5aa8'], '&': ['#3a7ae8', '#ffd23b'], '%': ['#3a9a3a', '#e02a3a'] })
  .map(([ch, [p, P]]) => [ch, [PAPAGAIO, MEIA_ASA, ASA_CIMA, MEIA_ASA].map((g) => compose([g], { ...MADEIRA, p, P, e: '#1b1410', y: '#f0e0a0' }))]))
// Bar: prateleira de garrafas de todo tamanho e balcão com drinks.
const FUNDO = Array(16).fill('dddddddd')
const GARRAFAS = [
  'kkkkkkkkkkkkkkkk', 'k..1........4..k', 'k..1....3...4..k', 'k.111..333.444.k', 'k.1w1.63w3.4w4.k', 'k.111.6333.444.k',
  'k.111.6333.444.k', 'knnnnnnnnnnnnnnk', 'k...5......2...k', 'k..555.11..2.4.k', 'k..5w5.1w..2.4.k', 'k..555.11.2224.k',
  'k..555.11.2w2.4k', 'k..555.11.222.4k', 'knnnnnnnnnnnnnnk', 'kkkkkkkkkkkkkkkk',
]
const VIDROS = { ...MADEIRA, d: '#2a1a0a', w: '#fff6e0' }
const BALCAO = ['', '', '', '', '', '', '', '', 'kkkkkkkkkkkkkkkk', 'kNNNNNNNNNNNNNNk', 'knnnnnnnnnnnnnnk', 'knnnnnnnnnnnnnnk',
  'knnNnnnnnnnnNnnk', 'knnnnnnnnnnnnnnk', 'kkkkkkkkkkkkkkkk']
const CANECO = ['', '', '', '..fff.......2...', '.kyyyk.....k2k..', '.kyyykk....k2k..', '.kyyyk.k...kkk..', '.kkkkkk.....k...']
const TACAS = ['', '.........3......', '.........3......', '........333.....', '..k.k...3w3.....', '..kgk...333.....', '...k....333.....', '..kkk...333.....']

// Lapidação: bancada com roda de pedra, mostruário de gemas e monte de gemas brutas.
const GEMAS_PAL = { r: '#e02a3a', R: '#ff8a8a', g: '#2fc870', G: '#aaffcc', b: '#3a7ae8', B: '#9ad0ff', y: '#ffd23b', Y: '#fff6b0' }
const LAPIDARIO = compose([[
  '................', '................', '....kkkk........', '...kiIIik.......', '..kiIiiIik......', '..kiIkkIik......', '..kiiiiiik...k..', '...kiiiik...kgk.',
  '....kkkk...kgGgk', 'kkkkkkkkkkkkkkkk', 'kNNNNNNNNNNNNNNk', 'knnnnnnnnnnnnnnk', 'kkkkkkkkkkkkkkkk', '.knk........knk.', '.knk........knk.', '.kkk........kkk.',
]], { ...MADEIRA, ...GEMAS_PAL, i: '#6a6a72', I: '#b8bcc4' })
const MOSTRUARIO = compose([[
  '', '', '', '.kkkkkkkkkkkkkk.', '.kwccccccccccck.', '.kvrRvgGvbBvyYk.', '.kvvvvvvvvvvvvk.', '.kkkkkkkkkkkkkk.',
  '.kNNNNNNNNNNNNk.', '.knnnnnnnnnnnnk.', '.knnnnnNNnnnnnk.', '.kkkkkkkkkkkkkk.', '.knk........knk.', '.kkk........kkk.',
]], { ...MADEIRA, ...GEMAS_PAL, c: '#9ad0e8', w: '#f4ecd8', v: '#5a1a3a' })
const GEMAS = compose([[
  '', '', '', '', '', '', '', '', '.......k........', '......kGk...k...', '......kgk..kBk..', '..k..kggGk.kbk..',
  '.kRk.kgggkkbBbk.', 'krRrkkkkkkkbbbk.', 'kkkkkkkkkkkkkkk.',
]], GEMAS_PAL)

// Colmeia de palha trançada num suporte de madeira, com abelhas em volta.
const COLMEIA = compose([[
  '', '', '......kkkk......', '....kkyYyykk....', '...kyyyyyyyyk...', '...kYYYYYYYYk.b.', '..kyyyyyyyyyyk..', '..kyyyyyyyyyyk.b',
  '..kYYYYYYYYYYk..', '..kyyyykkyyyyk..', '..kyyykxxkyyyk..', '..kYYYkxxkYYYk..', '.kkkkkkkkkkkkkk.', '.knnnnnnnnnnnnk.', '.kkkkkkkkkkkkkk.', '..kk........kk..',
]], { ...MADEIRA, y: '#d8a040', Y: '#a8742a', x: '#1b1410', b: '#ffd23b' })

// Mais dois cogumelos, para o canteiro: o vermelho de pintas brancas e um trio pardo.
const AMANITA = compose([[
  '', '', '', '', '', '.....kkkkkk.....', '...kkrrwrrrkk...', '..krwrrrrrwrrk..', '..krrrrwrrrrrk..', '.krrwrrrrrrwrrk.',
  '.kkkkkkkkkkkkkk.', '......kssk......', '......kssk......', '.....ksSssk.....', '.....kkkkkk.....',
]], { r: '#c43a1a', w: '#f4ecd8', s: '#e8dcc0', S: '#c8b898' })
const PARDOS = compose([[
  '', '', '', '', '', '', '', '..kkkk....kkkk..', '.kbBBbk..kbBBbk.', '.kbbbbk..kbbbbk.', '..kssk.kkk.ksk..', '..kssk.kBk.ksk..',
  '..kssk..s..ksk..', '.kkkkkkkkkkkkkk.',
]], { b: '#8a5a2a', B: '#b07a3a', s: '#e8dcc0' })

// Carpintaria: bancada com serrote, pilha de tábuas e toras vistas de ponta.
const BANCADA_CARP = compose([[
  '', '', '', '', '', '...kkkkkkkk.kkk.', '...kIIIIIIIkknnk', '...kkikikikk.kk.', 'kkkkkkkkkkkkkkkk', 'kNNNNNNNNNNNNNNk', 'knnnnnnnnnnnnnnk',
  'kkkkkkkkkkkkkkkk', '.knk..kkkk..knk.', '.knk..knnk..knk.', '.knk..kkkk..knk.', '.kkk........kkk.',
]], { ...MADEIRA, i: '#6a6a72', I: '#b8bcc4' })
const TABUAS = compose([[
  '', '', '', '', '', '', '', '.kkkkkkkkkkkkkk.', 'kNNNNNNNNNNNNNNk', 'knnnnnnnnnnnnnnk', 'kkkkkkkkkkkkkkkk', 'kNNNNNNNNNNNNNNk',
  'knnnnnnnnnnnnnnk', 'kkkkkkkkkkkkkkkk', 'kNNNNNNNNNNNNNNk', 'kkkkkkkkkkkkkkkk',
]], MADEIRA)
const TORAS = compose([['................', '................', '................', '................', '................', '................', '......kkk.......', '.....kyYyk......', '.....kYoYk......', '.....kyYyk......', '...kkkkkkkkk....', '..kyYyk.kyYyk...', '..kYoYk.kYoYk...', '..kyYyk.kyYyk...', '...kkk...kkk....', '................']], { y: '#c88a4a', Y: '#9c6a2f', o: '#5a3a18' })
// Administração: escrivaninha com papéis, pena e tinteiro; baú com faixas de ferro.
const ESCRIVANINHA = compose([[
  '', '', '', '', '', '..kkkkk...kk....', '..kwwwwk.kfk....', '..kwlwwk.kfk....', '..kwlwlkkkxk....', 'kkkkkkkkkkkkkkkk', 'kNNNNNNNNNNNNNNk',
  'knnnnnnnnnnnnnnk', 'kkkkkkkkkkkkkkkk', '.knk........knk.', '.knk........knk.', '.kkk........kkk.',
]], { ...MADEIRA, w: '#f4ecd8', l: '#8a7a6a', f: '#e8e0d0', x: '#1b1410' })
const BAU = compose([[
  '', '', '', '', '', '', '', '..kkkkkkkkkkkk..', '.kNNNNNNNNNNNNk.', '.knnnnnnnnnnnnk.', '.kiiiiiyyiiiiik.', '.knnnnnyynnnnnk.',
  '.knnnnnnnnnnnnk.', '.kiiiiiiiiiiiik.', '.kkkkkkkkkkkkkk.',
]], { ...MADEIRA, i: '#6a6a72', y: '#e0a82a' })

// Alquimista: bancada com balão e frasco borbulhando, prateleira de poções.
const BANCADA_ALQ = compose([[
  '', '', '', '....kk..........', '....kk......k...', '...kppk....kbk..', '..kpPppk...kbk..', '..kppppk..kbbbk.', '...kkkk..kbbbbbk', 'kkkkkkkkkkkkkkkk', 'kNNNNNNNNNNNNNNk', 'knnnnnnnnnnnnnnk', 'kkkkkkkkkkkkkkkk', '.knk........knk.', '.knk........knk.', '.kkk........kkk.',
]], { ...MADEIRA, p: '#a050c8', P: '#d8a0f0', b: '#5ce6e6' })
const POCOES = compose([['kkkkkkkkkkkkkkkk', 'knnnnnnnnnnnnnnk', 'knddkdddkdddkdnk', 'kndkrkdkgkdkbknk', 'kndkRkdkGkdkBknk', 'kndkkkdkkkdkkknk', 'knnnnnnnnnnnnnnk', 'knnnnnnnnnnnnnnk', 'knddkdddkdddkdnk', 'kndkpkdkykdkcknk', 'kndkPkdkYkdkCknk', 'kndkkkdkkkdkkknk', 'knnnnnnnnnnnnnnk', 'kkkkkkkkkkkkkkkk', '................', '................']], {
  ...MADEIRA, d: '#2a1a0a', r: '#e02a3a', R: '#ff8a8a', g: '#2fc870', G: '#aaffcc', b: '#3a7ae8', B: '#9ad0ff', p: '#a050c8', P: '#d8a0f0', y: '#ffd23b', Y: '#fff6b0', c: '#5ce6e6', C: '#c8ffff',
})

// Tufo de mato à Minecraft: lâminas finas de alturas diferentes abrindo em leque, escuras na base e claras na ponta.
const MATO = compose([[
  '................', '................', '......G.........', '......G..G......', '......h..G...G..', '..G...h..h...G..', '..G...h..h..h...', '...h...h.hG.h..G',
  'G..h...gg.h.h.h.', '.h..hG.gg.hg..h.', '.h..gh.ggh.g.h.G', 'G.g.gh.ggg.G.g.h', 'h.g.Gggdgggh.gh.', '.g.ghdgddgdgg.g.', '.g.dgddddddgd.d.', '.d.dddddddddd.d.',
]], { d: '#1f4a1a', g: '#2f7a2a', h: '#4caa34', G: '#8ae05a' })

// Dormitório: cama de campanha de 1,5 tile, lençol branco e cobertor vermelho. Ocupa 2 tiles ('k+') e fica centrada neles.
const CAMA = grade([...Array(4).fill('.'.repeat(32)), '....kkkkkkkkkkkkkkkkkkkkkkkk....', '....knwwwwwkrrrrrrrrrrrrrrnk....', '....knwWWWwkrRrrrrrrrRrrrrnk....', '....knwwwwwkrrrrrrrrrrrrrrnk....', '....knwWWWwkrrrrRrrrrrrrrrnk....', '....knwwwwwkrrrrrrrrrrRrrrnk....', '....knkkkkkkrrrrrrrrrrrrrrnk....', '....knnnnnnnnnnnnnnnnnnnnnnk....', '....kkkkkkkkkkkkkkkkkkkkkkkk....', '.....kk..................kk.....'], { ...MADEIRA, w: '#f4ecd8', W: '#d8d0b8', r: '#8a1424', R: '#b0302a' })
// Cofre: monte de moedas de ouro.
const OURO = compose([['', '', '', '', '', '', '', '.......k........', '......kYk.......', '.....kyYyk..k...', '....kyyYyyk.kYk.', '...kyYyyyYykyyk.', '..kyyyYyyyyyyyyk', '.kyYyyyyYyyyYyyk', 'kkkkkkkkkkkkkkkk']], { y: '#e0a82a', Y: '#fff0a0' })

// Banheiro: tina de madeira com água, latrina de madeira e bacia de metal num pé.
const TINA = compose([['', '', '', '', '', '', '.kkkkkkkkkkkkkk.', 'kNNNNNNNNNNNNNNk', 'knbBbbbbbBbbbbnk', 'knbbbBbbbbbbBbnk', 'knbbbbbbBbbbbbnk', 'knnnnnnnnnnnnnnk', 'kkkkkkkkkkkkkkkk', '.kk..........kk.']], { ...MADEIRA, b: '#3a7ae8', B: '#9ad0ff' })
const LATRINA = compose([['', '', '', '', '....kkkkkkkk....', '...knnnnnnnnk...', '...kNNNNNNNNk...', '...kkkkkkkkkk...', '..kNNNNNNNNNNk..', '..kNNkxxxxkNNk..', '..kNNkxxxxkNNk..', '..kNNNkkkkNNNk..', '..knnnnnnnnnnk..', '..kkkkkkkkkkkk..', '...kk......kk...']], { ...MADEIRA, x: '#1b1410' })
const BACIA = compose([['', '', '', '', '', '', '...kkkkkkkkkk...', '..kiIIIIIIIIik..', '..kibBbbbbBbik..', '...kiiiiiiiik...', '.....knnnnk.....', '......knnk......', '......knnk......', '....kkknnkkk....', '....knnnnnnk....', '....kkkkkkkk....']], { ...MADEIRA, i: '#6a6a72', I: '#b8bcc4', b: '#3a7ae8', B: '#9ad0ff' })

// Museu: estátua de pedra (a mesma do anão de ouro, em cinza) e esqueleto de anão num pedestal.
const ESTATUA_PEDRA = tinge(dwarfSprite('Estátua', 'Metalsmith'), ['#2a2a2e', '#5a5a62', '#8a8a92', '#c8c8d0'])
const ESQUELETO = compose([['........', '.....kkk', '....kwww', '....kwkk', '....kwww', '.....kwk', '......kw', '...kkkkw', '..kw.kww', '..kw.kwk', '..kw.kww', '..k..kwk', '....kwww', '....kw.k', '..kkkkkk', '..knnnnn']], { w: '#e8e0d0', n: '#6a6a72' })

// Atelier: tear com fios brancos e o pano vermelho saindo, rolos de tecido vistos de ponta e roca de fiar.
const TEAR = compose([['', '', 'kkkkkkkkkkkkkkkk', 'kNNNNNNNNNNNNNNk', 'kkkkkkkkkkkkkkkk', '.kn.w.w.w.w.wnk.', '.kn.w.w.w.w.wnk.', '.kn.w.w.w.w.wnk.', '.knrrrrrrrrrrnk.', '.knRrRrRrRrRrnk.', '.knrrrrrrrrrrnk.', 'kkkkkkkkkkkkkkkk', 'kNNNNNNNNNNNNNNk', 'kkkkkkkkkkkkkkkk', '.knk........knk.', '.kkk........kkk.']], { ...MADEIRA, w: '#f4ecd8', r: '#8a1424', R: '#b0302a' })
const ROLOS = compose([['................', '................', '................', '................', '................', '................', '......kkk.......', '.....kbBbk......', '.....kBwBk......', '.....kbBbk......', '...kkkkkkkkk....', '..kgGgk.kyYyk...', '..kGwGk.kYwYk...', '..kgGgk.kyYyk...', '...kkk...kkk....', '................']], { b: '#3a5aa8', B: '#7a9ae8', g: '#3a8a2a', G: '#6cdc4a', y: '#e0a82a', Y: '#ffd23b', w: '#f4ecd8' })
const ROCA = compose([['', '', '....kkkkkk......', '...knnnnnnk.....', '..kn.k..k.nk....', '..kn..kk..nk....', '..kn..kk..nk....', '..kn.k..k.nk..w.', '...knnnnnnk..ww.', '....kkkkkk..kwwk', '......kk....knnk', '......kk....knnk', '..kkkkkkkkkkkkkk', '..knnnnnnnnnnnnk', '..kkkkkkkkkkkkkk', '...kk........kk.']], { ...MADEIRA, w: '#f4ecd8' })

// Prisão: grade de ferro na frente das celas e um monte de palha para dormir.
const GRADE = compose([['kIi.kIi.kIi.kIi.', 'kIi.kIi.kIi.kIi.', 'kkkkkkkkkkkkkkkk', 'kiiiiiiiiiiiiiik', 'kIi.kIi.kIi.kIi.', 'kIi.kIi.kIi.kIi.', 'kIi.kIi.kIi.kIi.', 'kIi.kIi.kIi.kIi.', 'kIi.kIi.kIi.kIi.', 'kIi.kIi.kIi.kIi.', 'kIi.kIi.kIi.kIi.', 'kIi.kIi.kIi.kIi.', 'kiiiiiiiiiiiiiik', 'kkkkkkkkkkkkkkkk', 'kIi.kIi.kIi.kIi.', 'kIi.kIi.kIi.kIi.']], { i: '#4a4a52', I: '#8a8f99' })
const PALHA = compose([['', '', '', '', '', '', '', '', '', '....kkkkkkkk....', '..kkyYyyYyyYkk..', '.kyYyyyYyyyyyYk.', '.kyyyYyyyYyyyyk.', '.kYyyyyyyyYyyyk.', '..kkkkkkkkkkkk..']], { y: '#c8a050', Y: '#e8c070' })

// Porta do cofre fechada: batente de ferro com rebites de ouro e duas folhas com volante. Tranca a passagem.
const PORTA_COFRE = grade(['kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', 'kIIIyIIIIyIIIIyIIIIyIIIIyIIIIIIk', 'kIkkkkkkkkkkkkkkkkkkkkkkkkkkkkIk', 'kIkiiiiiiiiiiiikkiiiiiiiiiiiikIk', 'kykiiiiiiiiiiiikkiiiiiiiiiiiikyk', 'kIkiiYiiiiiiiiikkiiiiiiiiiYiikIk', 'kIkiiiiiiiiiiiikyiiiiiiiiiiiikIk', 'kIkiiiiiiiiiiyikkiyiiiiiiiiiikIk', 'kykiiiiiiiiiiiiyyiiiiiiiiiiiikyk', 'kIkiiiiiiiiiyiykkyiyiiiiiiiiikIk', 'kIkiiiiiiiiiiiiyyiiiiiiiiiiiikIk', 'kIkiiiiiiiiiiyikkiyiiiiiiiiiikIk', 'kykiiYiiiiiiiiikyiiiiiiiiiYiikyk', 'kIkiiiiiiiiiiiikkiiiiiiiiiiiikIk', 'kIkiiiiiiiiiiiikkiiiiiiiiiiiikIk', 'kIkkkkkkkkkkkkkkkkkkkkkkkkkkkkIk'], { i: '#4a4a52', I: '#8a8f99', y: '#e0a82a', Y: '#fff0a0' })

const PROP: Record<string, Grid> = {
  ...MINERIO, ...PEDRAS, '!': MICROFONE, '^': ESTATUA, B: BARRIL, U: icone('m'), C: CALDEIRAO, F: FORJA, L: icone('A'), c: icone('c'), b: icone('b'), g: icone('g'),
  f: CERCA, T: MESA, '[': mesaLonga(2), ']': mesaLonga(3), ';': CADEIRA, $: PEPITA, E: ESTANTE, N: FORNALHA, I: BIGORNA, Y: ARVORE, u: ARBUSTO, l: FLORES,
  R: compose([FUNDO, GARRAFAS], { ...VIDROS, 1: '#2fc870', 2: '#e02a3a', 3: '#e8a02a', 4: '#3a5aa8', 5: '#c070e0', 6: '#5ce6e6' }),
  O: compose([FUNDO, GARRAFAS], { ...VIDROS, 1: '#c070e0', 2: '#ffd23b', 3: '#5a2a1a', 4: '#e02a3a', 5: '#2fc870', 6: '#f4ecd8' }),
  A: compose([BALCAO, CANECO], { ...MADEIRA, y: '#e8a02a', f: '#fff6e0', 2: '#8a1424' }),
  W: compose([BALCAO, TACAS], { ...MADEIRA, w: '#fff6e0', 3: '#3a5aa8', g: '#6cdc4a' }),
  D: BONECO, S: ESPADA, H: ESCUDO, M: MARTELO, X: MACHADO, m: MONTE,
  J: grade(BARRACA, { ...BENS, a: '#e02a3a', A: '#f4ecd8', 1: '#e02a3a', 2: '#ffb02a', 3: '#6cdc4a' }), // frutas
  K: grade(BARRACA, { ...BENS, a: '#3a5aa8', A: '#f4ecd8', 1: '#c070e0', 2: '#5ce6e6', 3: '#ffd23b' }), // tecidos
  Z: grade(BARRACA, { ...BENS, a: '#3a8a2a', A: '#ffd23b', 1: '#5ce6e6', 2: '#e83a1a', 3: '#c070e0' }), // poções
  '(': CARRINHO,
  j: LAPIDARIO, q: MOSTRUARIO, y: GEMAS, i: COLMEIA, e: AMANITA, n: PARDOS,
  '{': BANCADA_CARP, '}': TABUAS, '<': TORAS, '*': ESCRIVANINHA, '?': BAU, '>': BANCADA_ALQ, '|': POCOES, '/': MATO, k: CAMA, '"': OURO, '0': TINA, _: LATRINA, ':': BACIA, '`': ESTATUA_PEDRA, ')': ESQUELETO, á: TEAR, é: ROLOS, ó: ROCA, í: GRADE, ú: PALHA, ü: PORTA_COFRE,
}
const OVELHA = compose([[
  '', '', '', '', '', '....kkkkkk......', '...kwwWwwwk.kk..', '..kwWwwwWwwkddk.', '.kwwwwwwwwwkdedk', '.kwWwwwwWwwkdddk',
  '.kwwwwwwwwwwkkk.', '..kwwWwwwwwk....', '...kkkkkkkk.....', '...kdk..kdk.....', '...kdk..kdk.....', '...kk...kk......',
]], { w: '#f4ecd8', W: '#d8d0b8', d: '#3a2a18', e: '#f4ecd8' })
const BICHO: Record<string, Grid> = { P: PORCO, G: GALINHA, h: OVELHA, Q: FORMIGA, V: CAVALO, z: COBRA }

// Gente que não é anão: fala como os anões, mas não tem fase.
const GOBLIN = compose([[
  '........', '........', '....kkkk', 'kk.kgggg', 'kgkggggg', '.kgggegg', '..kggggg', '...kgkww',
  '...kkggg', '..kccccc', '.kgkcccc', '.kgkcccc', '..kkcccc', '...kcckk', '...kggk.', '...kkkk.',
]], { g: '#6a9a2a', e: '#ff3b2f', w: '#f4ecd8', c: '#5a3a1a' })
const ELFO = compose([[
  '.....kkk', '....kyyy', '...kyyyy', '...kyyss', 'ks.kysss', '.kskyses', '..kyssss', '..kyysss',
  '..kygkkk', '..kygggg', '.kskgggg', '.kskgGgg', '..kkgggg', '...kgggg', '...kdkkd', '...kkk..',
]], { y: '#f0e070', s: '#f0c8a0', e: '#1b1410', g: '#2f7a3a', G: '#6cdc4a', d: '#3a2a18' })
// 32x32, dormindo em cima do ouro
const DRAGAO = grade([
  '................................', '................................', '..........k.....................', '.........kSk.........k...k......',
  '........kSsk........khk.khk.....', '.......kSssk.........khkhk......', '......kSsssk.......kkkrrrkk.....', '.....kSssssk......krrrrrrrrk....',
  '....kSsssssk.....krrrRrrrrrrk...', '...kSssssssk.....krrrrrkkrrrrkk.', '..kSsssssssk....krrrrrrrrrrrrrrk', '.kSSSSSsssskk...krrrrrrrrrRRRRRk',
  '.kkkkkkSSSSrrk..kRrrrrrrkwkwkwk.', '.......kkkkrrrk.koRRrrrrrkkkkk..', '........krrrrrrkkoorrrrk........', '......kkrrrrrrrrkoorrrk.........',
  '....kkrrrrrRrrrrkoorrrk.........', '...krrrrRrrrrrrrkoorrk..........', '..krrrrrrrrrrRrrrkoorrk.........', '..krrRrrrrrrrrrrrkoorrk.........',
  '.krrrrrrrrrrrrrrrrkoorrk........', '.krrrrrrrrrrrrrrrrkooork........', '.kRrrrrrrrrrrrrrrrrkoork........', '.kRRrrrrrrrrrrrrrrrkkkrk........',
  '..kRRoooooooooooooRRrrRk........', '...kkRRkkkkkkkRRkkkRRRk.........', 'kk...kRRk....kRRk.kRRk..........', 'krk..kwkwk...kwkwkkwkwk.........',
  '.krkkkkkkkggggkkkkkkkkgggg......', '..kRRrrrrkgGgggggGggggggGgg.....', '...kkkkkkgggggGgggggGggggggg....', '........kkkkkkkkkkkkkkkkkkkkk...',
], { r: '#c43a1a', R: '#8a1424', o: '#ffb02a', h: '#e8d8a8', w: '#f4ecd8', s: '#8a1424', S: '#5a0a14', g: '#f0c040', G: '#fff0a0' })
/** Ocupam s x s tiles a partir de (x, y). */
const ORC = compose([[
  '........', '...kkkkk', '..kggggg', '.kgggggg', '.kgkkggg', '.kggeggg', '.kgggggg', '..kgwkkk',
  '..kkgggg', '.kAAAAAA', 'kgkAaAAA', 'kgkAAAaA', 'kkkAAAAA', '...kddkk', '...kddk.', '...kkkk.',
]], { g: '#5a7a3a', e: '#ff3b2f', w: '#f4ecd8', A: '#4a4a52', a: '#8a8f99', d: '#3a2a18' })
// Kobold: lagartinho de escamas cor de ferrugem, chifres claros e olhos amarelos.
const KOBOLD = compose([['........', '..k.....', '..kh....', '...khkkk', '...krrrr', '..krrerr', '..krrrrr', '...krrRR', '....kkkk', '...kbbbb', '..krbbbb', '..krbbbb', '...kbbbb', '....krrk', '....krrk', '....kkkk']], { r: '#a8502a', R: '#d88a5a', h: '#e8d8a8', e: '#ffe14a', b: '#5a3a1a' })
export const EXTRAS = [
  { id: 'goblin', nome: 'Grishnak, o Goblin', fala: 'Psiu... troco ouro de anão por um gole. Ninguém precisa saber.', x: 45, y: 41, s: 1, g: GOBLIN },
  { id: 'elfo', nome: 'Elandor, o Elfo', fala: 'Vim provar a cerveja anã. Dizem que é melhor que vinho élfico. Duvido.', x: 8, y: 33, s: 1, g: ELFO },
  { id: 'snik', nome: 'Snik, o Goblin', fala: 'Bugigangas! Pedras brilhantes! Quase nada roubado!', x: 26, y: 42, s: 1, g: GOBLIN },
  { id: 'grot', nome: 'Grot, o Goblin', fala: 'Não olha pra minha barraca. Olha pra lá. ...Pronto, já era.', x: 53, y: 47, s: 1, g: GOBLIN },
  { id: 'orc', nome: 'Urzog, o Orc', fala: 'Orc quer cerveja. Orc paga com... respeito.', x: 32, y: 47, s: 1, g: ORC },
  { id: 'dragao', nome: 'Ignaroth, o Dragão', fala: 'Zzz... quem chega perto do meu ouro? ...Ah, só um anão. Zzz.', x: 9, y: 8, s: 2, g: DRAGAO },
  // presos: atrás da grade, ninguém chega neles; dá para conversar do corredor
  { id: 'preso-goblin', nome: 'Grizzle, o Goblin', fala: 'Eu só peguei emprestado! Fala com o guarda, vai. Eu divido com você.', x: 84, y: 3, s: 1, g: GOBLIN, preso: true },
  { id: 'kobold', nome: 'Skrit, o Kobold', fala: 'Skrit não cavou túnel nenhum. Skrit só estava... testando a parede.', x: 92, y: 3, s: 1, g: KOBOLD, preso: true },
]

function pinta(ctx: CanvasRenderingContext2D, g: Grid, x: number, y: number) {
  g.forEach((row, j) => row.forEach((c, i) => c && ((ctx.fillStyle = c), ctx.fillRect(x + i, y + j, 1, 1))))
}
const sprite = (g: Grid) => {
  const c = Object.assign(document.createElement('canvas'), { width: g[0].length, height: g.length })
  pinta(c.getContext('2d')!, g, 0, 0)
  return c
}
/** Altura do pé: a linha logo abaixo do último pixel pintado. É a chave do Y-sort. */
const pe = (g: Grid) => g.length - [...g].reverse().findIndex((r) => r.some(Boolean))

/** Vizinhos do mais perto ao mais longe: objetos grandes cercam o meio de outros objetos. */
const VIZINHOS = [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [1, -1], [-1, 1], [1, 1], [-2, 0], [2, 0], [0, 2], [0, -2], [-3, 0], [3, 0]]
const ePiso = (c?: string): c is string => !!c && c in PISO && c !== '#' && c !== '~'
/** Chão sob um objeto: o piso que mais aparece nos 8 vizinhos (no empate, o mais perto); sem nenhum, o mais perto da lista toda. */
const chao = (x: number, y: number) => {
  const em = ([dx, dy]: number[]) => MAPA[y + dy]?.[x + dx]
  const perto = VIZINHOS.slice(0, 8).map(em).filter(ePiso)
  const conta = (c: string) => perto.filter((d) => d === c).length
  return perto.reduce((m, c) => (conta(c) > conta(m) ? c : m), perto[0]) ?? VIZINHOS.map(em).find(ePiso) ?? '.'
}
const parede = (x: number, y: number) => PAREDE.includes(MAPA[y]?.[x] ?? '#')

/** Pinta o tile (x, y) com o padrão do piso `qual`. */
function piso(ctx: CanvasRenderingContext2D, qual: string, x: number, y: number) {
  const [base, mancha] = PISO[qual]
  const rect = (c: string, rx: number, ry: number, w: number, h: number) => ((ctx.fillStyle = c), ctx.fillRect(x * T + rx, y * T + ry, w, h))
  rect(base, 0, 0, T, T)
  if (qual === 'p') { // calçamento de pedras
    const pedras = y % 2 ? [[0, 0, 7], [8, 0, 7], [0, 8, 3], [4, 8, 7], [12, 8, 4]] : [[0, 0, 3], [4, 0, 7], [12, 0, 4], [0, 8, 7], [8, 8, 7]]
    pedras.forEach(([sx, sy, w], k) => (rect((x + k) % 3 ? mancha : '#6a5e52', sx, sy, w, 7), rect('#7a6e62', sx, sy, w, 1)))
    // meio-fio onde o calçamento encontra grama ou o rio: pedra clara na borda e uma linha de sombra para dentro
    const grama = (nx: number, ny: number) => { const n = MAPA[ny]?.[nx]; return n === 'f' || n === '~' || (!!n && !(n in PISO) && !PAREDE.includes(n) ? chao(nx, ny) === ',' : n === ',') } // cerca sempre fica na grama; '~' é a margem do rio
    if (grama(x, y - 1)) rect('#8a7e72', 0, 0, T, 2), rect('#1b1410', 0, 2, T, 1)
    if (grama(x, y + 1)) rect('#1b1410', 0, 13, T, 1), rect('#8a7e72', 0, 14, T, 2)
    if (grama(x - 1, y)) rect('#8a7e72', 0, 0, 2, T), rect('#1b1410', 2, 0, 1, T)
    if (grama(x + 1, y)) rect('#1b1410', 13, 0, 1, T), rect('#8a7e72', 14, 0, 2, T)
  } else if (qual === 's') { // lajes de pedra nas cores do chão do quartel: duas fiadas de placas desencontradas, cada placa num tom, com luz na borda de cima
    const c1 = 4 + ((x * 5 + y * 3) % 8), c2 = 4 + ((x * 3 + y * 7) % 8)
    ;[[0, 0, c1], [c1, 0, T - c1], [0, 8, c2], [c2, 8, T - c2]].forEach(([sx, sy, w], k) => {
      rect(['#5e5652', '#665e5a', '#56504c'][(x + y + k) % 3], sx + 1, sy + 1, w - 1, 7)
      rect('#7a706a', sx + 1, sy + 1, w - 1, 1)
    })
  } else if (qual === 'x') { // chão talhado
    rect('#7a706a', 0, 0, T, 1)
    rect(mancha, 0, 15, T, 1)
    rect(mancha, 15, 0, 1, T)
    if ((x + y) % 2) rect(mancha, 4, 4, 8, 1), rect(mancha, 4, 11, 8, 1), rect(mancha, 4, 4, 1, 8), rect(mancha, 11, 4, 1, 8)
  } else if (qual === 'v') { // madeira clara
    for (let i = 0; i < 4; i++) rect(mancha, 0, i * 4 + 3, T, 1), rect(mancha, (i * 5 + x * 3) % 16, i * 4, 1, 3)
  } else if (qual === '=') { // ponte: tábuas atravessadas, corrimãos e contorno
    for (let i = 0; i < 4; i++) rect(mancha, i * 4 + 3, 3, 1, 10)
    rect('#c08a4a', 0, 1, T, 1)
    rect(mancha, 0, 2, T, 1)
    rect(mancha, 0, 13, T, 2)
    rect('#1b1410', 0, 0, T, 1)
    rect('#1b1410', 0, 15, T, 1)
    if (MAPA[y][x - 1] !== '=') rect('#1b1410', 0, 0, 1, T)
    if (MAPA[y][x + 1] !== '=') rect('#1b1410', 15, 0, 1, T)
  } else if (qual === '-') { // ponte de pedra, nos cinzas quentes do calçamento do livre comércio: tijolos em fiadas desencontradas, parapeito só nas bordas de cima e de baixo
    for (let j = 0; j < 4; j++) {
      rect(mancha, 0, j * 4 + 3, T, 1)
      for (let i = (j % 2) * 4; i < T; i += 8) rect(mancha, i, j * 4, 1, 3)
      rect('#7a6e62', 0, j * 4, T, 1)
    }
    if (MAPA[y - 1][x] !== '-') rect('#1b1410', 0, 0, T, 1), rect('#8a7e72', 0, 1, T, 2), rect(mancha, 0, 3, T, 1)
    if (MAPA[y + 1][x] !== '-') rect('#8a7e72', 0, 12, T, 2), rect(mancha, 0, 14, T, 1), rect('#1b1410', 0, 15, T, 1)
    if (MAPA[y][x - 1] !== '-') rect('#1b1410', 0, 0, 1, T)
    if (MAPA[y][x + 1] !== '-') rect('#1b1410', 15, 0, 1, T)
  } else {
    for (let k = 0; k < 6; k++) rect(mancha, (x * 7 + y * 13 + k * 5) % 15, (x * 3 + y * 11 + k * 7) % 15, qual === 'w' ? 4 : 1, 1)
    if (qual === 'w') rect(mancha, 0, 15, T, 1) // tábuas
  }
  if (qual === '#' && !parede(x, y + 1)) { // face da parede: blocos talhados
    rect('#4a3c30', 0, 4, T, 12)
    rect('#6a5a4a', 0, 4, T, 1)
    rect(base, 0, 9, T, 1)
    rect(base, 0, 14, T, 1)
    rect(base, (x % 2) * 7 + 3, 5, 1, 4)
    rect(base, (x % 2) * 7 + 9, 10, 1, 4)
    rect('#1b1410', 0, 15, T, 1)
  }
  if (qual !== '#' && parede(x, y - 1)) rect('#00000050', 0, 0, T, 3) // sombra da parede
}

/** Rio atravessando a linha de uma parede: rocha nas duas margens. Ali a água despenca. */
const queda = (x: number, y: number) => {
  const margem = (d: number) => { let i = x; while (MAPA[y]?.[i] === '~') i += d; return parede(i, y) }
  return MAPA[y]?.[x] === '~' && margem(-1) && margem(1)
}

/** Água do rio, redesenhada a cada quadro: reflexos descendo com a correnteza e espuma nas margens. */
function agua(ctx: CanvasRenderingContext2D, x: number, y: number, agora: number) {
  const rect = (c: string, rx: number, ry: number, w: number, h: number) => ((ctx.fillStyle = c), ctx.fillRect(x * T + rx, y * T + ry, w, h))
  const t = agora / 120
  if (queda(x, y)) { // cachoeira: fios de água caindo rápido e espuma onde bate
    rect('#3a7ac0', 0, 0, T, T)
    for (let k = 0; k < 6; k++) {
      const rx = (k * 3 + x * 5) % 15, ry = (Math.floor(t * 3 + k * 7 + x * 3) % (T + 6)) - 6
      rect('#a8e6ff', rx, ry, 1, 6)
      rect('#2a5a9a', rx + 1, ry + 2, 1, 4)
    }
    for (let k = 0; k < 6; k++) rect('#e8f8ff', (k * 3 + Math.floor(t) + x) % 15, 12 + ((k + Math.floor(t / 2)) % 4), 2, 1)
    return
  }
  rect('#2a5a9a', 0, 0, T, T)
  for (let k = 0; k < 3; k++) {
    const rx = (x * 7 + k * 5) % 10, ry = Math.floor(k * 6 + t + x * 5) % T
    rect('#5ca8e6', rx, ry, 5, 1)
    rect('#1e4680', rx + 1, (ry + 3) % T, 4, 1)
  }
  if ((Math.floor(t / 4) + x + y) % 5 === 0) rect('#d8f4ff', (x * 3 + y) % 12 + 2, (y * 5) % 12 + 2, 1, 1) // brilho
  for (const [dx, bx] of [[-1, 0], [1, 15]]) {
    if ('~=-'.includes(MAPA[y][x + dx])) continue
    for (let ry = 0; ry < T; ry += 2) rect('#a8e6ff', bx - dx * ((Math.floor(t / 3) + ry / 2 + y) % 2), ry, 1, 2)
  }
  if (parede(x, y - 1)) rect('#00000050', 0, 0, T, 3)
  if ('=-'.includes(MAPA[y - 1][x])) rect('#00000040', 0, 0, T, 2) // sombra da ponte
  if (queda(x, y - 1)) for (let k = 0; k < 5; k++) rect('#d8f4ff', (k * 3 + Math.floor(t) * 5 + x) % 15, (k + Math.floor(t / 2)) % 4, 2, 1) // respingo ao pé da queda
}

/** Árvore inteira, tronco e copa, num sprite só: assim a copa entra no Y-sort pelo pé do tronco. */
function arvore() {
  const c = Object.assign(document.createElement('canvas'), { width: 32, height: 20 + T })
  const ctx = c.getContext('2d')!
  pinta(ctx, ARVORE, 8, 20)
  pinta(ctx, COPA, 0, 0)
  return c
}

/** Chão com objetos, e à parte o que entra no Y-sort com os bonecos: árvores e o que se atravessa (trigo, cogumelo, cadeira, flores). */
function desenhaMapa() {
  const c = Object.assign(document.createElement('canvas'), { width: MAPA[0].length * T, height: MAPA.length * T })
  const ctx = c.getContext('2d')!
  const imgs: Record<string, HTMLCanvasElement> = {}
  const soltos: { img: HTMLCanvasElement; x: number; y: number; pe: number }[] = []
  const aves: { quadros: HTMLCanvasElement[]; x: number; y: number }[] = [] // papagaios, desenhados a cada quadro
  const cerca = (x: number, y: number) => MAPA[y]?.[x] === 'f'
  // cerca é de bicho: sempre em cima de grama, mesmo encostada no Livre Comércio
  MAPA.forEach((linha, y) => [...linha].forEach((ch, x) => piso(ctx, ch in PISO ? ch : PAREDE.includes(ch) ? '#' : ch === 'f' ? ',' : chao(x, y), x, y)))
  // objetos depois de todo o chão, para os de 2 tiles não serem cobertos pelo piso vizinho
  MAPA.forEach((linha, y) => [...linha].forEach((ch, x) => {
    if (ch === 'f') { // cerca encaixa com as vizinhas: deitada, em pé ou nos dois sentidos no canto
      const v = cerca(x, y - 1) || cerca(x, y + 1)
      if (cerca(x - 1, y) || cerca(x + 1, y) || !v) pinta(ctx, CERCA, x * T, y * T)
      if (v) pinta(ctx, CERCA_V, x * T, y * T)
    } else if (PAPAGAIOS[ch]) aves.push({ quadros: PAPAGAIOS[ch].map(sprite), x: x * T, y: y * T })
    else if (ch === 'Y') soltos.push({ img: (imgs.Y ??= arvore()), x: x * T - 8, y: y * T - 20, pe: y * T + pe(ARVORE) })
    else if (PROP[ch] && andavel(x, y)) soltos.push({ img: (imgs[ch] ??= sprite(PROP[ch])), x: x * T, y: y * T, pe: y * T + pe(PROP[ch]) })
    else if (PROP[ch]) pinta(ctx, PROP[ch], x * T, y * T)
  }))
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffd23b40'
  for (const [nome, sx, sy, px] of SALAS) (ctx.font = `${px}px VT323, monospace`), ctx.fillText(nome, sx * T + 8, sy * T + 8)
  const rio = MAPA.flatMap((linha, y) => [...linha].flatMap((ch, x) => (ch === '~' ? [[x, y]] : [])))
  return { mapa: c, soltos, rio, aves }
}

/** Foto da fortaleza inteira, com todo mundo no seu lugar e o nome das zonas. Em dobro, como a tela do jogo. */
export function mapaInteiro(retrato: (r: Receita) => Grid) {
  const { mapa, soltos, rio, aves } = desenhaMapa()
  const c = Object.assign(document.createElement('canvas'), { width: mapa.width * 2, height: mapa.height * 2 })
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  ctx.setTransform(2, 0, 0, 2, 0, 0)
  ctx.drawImage(mapa, 0, 0)
  for (const [ax, ay] of rio) agua(ctx, ax, ay, 0)
  for (const a of aves) ctx.drawImage(a.quadros[0], a.x, a.y)
  const gente = [...RECEITAS.map((r) => ({ g: retrato(r), x: LOCAL[r.id][0], y: LOCAL[r.id][1] })), ...EXTRAS]
  const bichos = MAPA.flatMap((l, by) => [...l].flatMap((ch, bx) => (BICHO[ch] ? [{ g: BICHO[ch], x: bx, y: by + 1 - BICHO[ch].length / T }] : [])))
  // mesmo Y-sort do jogo, parado
  const cena: [number, () => void][] = soltos.map((s) => [s.pe, () => ctx.drawImage(s.img, s.x, s.y)])
  for (const o of [...gente, ...bichos]) cena.push([o.y * T + pe(o.g), () => pinta(ctx, o.g, o.x * T, o.y * T)])
  cena.sort((a, b) => a[0] - b[0]).forEach(([, desenha]) => desenha())
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.font = '16px VT323, monospace'
  ctx.textAlign = 'center'
  for (const [nome, zx, zy] of ZONAS) {
    const sx = (zx * T + 8) * 2, sy = (zy * T + 10) * 2
    ctx.fillStyle = '#000'
    ctx.fillText(nome, sx + 2, sy + 2)
    ctx.fillStyle = '#ffd23b'
    ctx.fillText(nome, sx, sy)
  }
  return c
}

// ---------------------------------------------------------------- jogo

const PASSO = 0.14 // segundos por tile
const DIRECAO: Record<string, [number, number]> = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
}

/** Liga o modo livre no palco com o anão `i` de RECEITAS. Sai sozinho quando o palco troca de tela. */
export function modoLivre(palco: HTMLElement, i: number, retrato: (r: Receita) => Grid) {
  const eu = RECEITAS[i]
  const outros = [
    ...RECEITAS.filter((r) => r !== eu).map((r) => ({ id: r.id, nome: r.cliente, fala: FALAS[r.id], x: LOCAL[r.id][0], y: LOCAL[r.id][1], s: 1, img: sprite(retrato(r)), pe: pe(retrato(r)) })),
    ...EXTRAS.map((e) => ({ ...e, img: sprite(e.g), pe: pe(e.g) })),
  ]
  const em = (o: (typeof outros)[number], ox: number, oy: number) => ox >= o.x && ox < o.x + o.s && oy >= o.y && oy < o.y + o.s
  // Bichos passeiam sozinhos dentro dos cercados.
  const bichos = MAPA.flatMap((l, by) => [...l].flatMap((ch, bx) => BICHO[ch] ? [{ x: bx, y: by, w: Math.floor(BICHO[ch][0].length / T), de: [bx, by], t: 1, esq: false, img: sprite(BICHO[ch]), pe: pe(BICHO[ch]), chao: chao(bx, by), tipo: ch }] : []))
  // caixa dos pés do anão (10x8 px na base do sprite): é ela que colide
  const pisa = (tx: number, ty: number, ax = fx, ay = fy) => ax + 3 < (tx + 1) * T && ax + 13 > tx * T && ay + 8 < (ty + 1) * T && ay + 16 > ty * T
  const ocupado = (ox: number, oy: number, eu?: (typeof bichos)[number]) =>
    pisa(ox, oy) || outros.some((o) => em(o, ox, oy)) || bichos.some((b) => b !== eu && oy === b.y && ox >= b.x && ox < b.x + b.w)

  const fim = new AbortController()
  const opt = { signal: fim.signal }

  palco.className = 'tela-livre'
  palco.innerHTML = `
    <canvas width="640" height="360"></canvas>
    <div class="balao"></div>
    <button class="btn btn-gold voltar" data-ir="titulo">Taverna</button>
    <button class="btn interagir" aria-label="Interagir (E ou Espaço)">◆</button>
    <div class="dpad">${['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'].map((k) => `<button class="btn" data-dir="${k}" aria-label="${k}">${{ ArrowUp: '▲', ArrowLeft: '◀', ArrowRight: '▶', ArrowDown: '▼' }[k]}</button>`).join('')}</div>`
  const ctx = palco.querySelector('canvas')!.getContext('2d')!
  const balao = palco.querySelector<HTMLElement>('.balao')!
  const { mapa, soltos, rio, aves } = desenhaMapa()
  const peEu = pe(retrato(eu))
  const trote = TROTE.map(sprite)
  const passos = [retrato(eu), ...PES.map((p) => [...retrato(eu).slice(0, 14), ...grade(p, { d: '#3a2a18' })])]
  const quadros = (tons?: string[]) => [0, 1, 0, 2].map((k) => sprite(tons ? tinge(passos[k], tons) : passos[k])) // parado, passo, parado, outro passo
  const img = quadros(), preto = quadros(QUEIMADO), roxo = quadros(ENVENENADO)
  const botao = palco.querySelector<HTMLButtonElement>('.interagir')!
  const W = mapa.width - 320, H = mapa.height - 180

  let [x, y] = INICIO // tile onde estão os pés
  let fx = x * T, fy = y * T, olhaEsq = false // posição livre, em pixels da arte
  let camX = NaN, camY = NaN // a câmera persegue o anão com atraso suave
  const segurando: string[] = []
  let montado: (typeof bichos)[number] | undefined
  let fogoAte = 0, corDe = 0, corAte = 0, cor = img // baforada do dragão; cor do anão queimado ou envenenado
  let acao: { rotulo: string; fazer: () => void } | undefined
  botao.addEventListener('click', () => acao?.fazer(), opt)

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') return palco.querySelector<HTMLElement>('.voltar')!.click()
    if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && !e.repeat) return e.preventDefault(), acao?.fazer()
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
    if (!DIRECAO[k] || e.ctrlKey || e.metaKey) return
    e.preventDefault()
    if (!segurando.includes(k)) segurando.push(k)
  }, opt)
  addEventListener('keyup', (e) => segurando.splice(segurando.indexOf(e.key.length === 1 ? e.key.toLowerCase() : e.key) >>> 0, 1), opt)
  addEventListener('blur', () => (segurando.length = 0), opt)
  palco.querySelectorAll<HTMLElement>('[data-dir]').forEach((b) => {
    const k = b.dataset.dir!
    b.addEventListener('pointerdown', (e) => (e.preventDefault(), segurando.includes(k) || segurando.push(k)), opt)
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => segurando.splice(segurando.indexOf(k) >>> 0, 1), opt)
  })

  // o anão atravessa gente e bicho; só parede, objetos e os grandes (dragão e cavalo) bloqueiam
  const bate = (ax: number, ay: number) => {
    for (let ty = Math.floor((ay + 8) / T); ty <= Math.floor((ay + 15.99) / T); ty++)
      for (let tx = Math.floor((ax + 3) / T); tx <= Math.floor((ax + 12.99) / T); tx++)
        if (!andavel(tx, ty) || outros.some((o) => o.s > 1 && em(o, tx, ty)) || bichos.some((b) => b.w > 1 && ty === b.y && tx >= b.x && tx < b.x + b.w)) return true
    return false
  }
  /** Anda num eixo; se bater numa quina, escorrega até 6 px para o lado livre e passa. */
  const mover = (dx: number, dy: number) => {
    if (!dx && !dy) return
    if (!bate(fx + dx, fy + dy)) return void ((fx += dx), (fy += dy))
    for (let d = 1; d <= 6; d++)
      for (const lado of [-1, 1]) {
        const ox = dy ? lado * d : 0, oy = dx ? lado * d : 0
        if (bate(fx + ox + dx, fy + oy + dy)) continue
        const n = Math.min(Math.abs(dx + dy), d), nx = fx + Math.sign(ox) * n, ny = fy + Math.sign(oy) * n
        if (!bate(nx, ny)) (fx = nx), (fy = ny)
        return
      }
  }

  let antes = performance.now()
  function quadro(agora: number) {
    if (palco.className !== 'tela-livre') return fim.abort()
    const dt = Math.min((agora - antes) / 1000, 0.1)
    antes = agora
    // movimento livre: as teclas seguradas somam, diagonal incluída, sempre na mesma velocidade
    let vx = 0, vy = 0
    for (const k of new Set(segurando)) (vx += DIRECAO[k][0]), (vy += DIRECAO[k][1])
    const len = Math.hypot(vx, vy)
    if (len) {
      const v = ((montado ? 2 : 1) * T * dt) / PASSO / len // a cavalo anda o dobro
      if (vx) olhaEsq = vx < 0
      mover(vx * v, 0)
      mover(0, vy * v)
      x = Math.floor((fx + 8) / T)
      y = Math.floor((fy + 12) / T)
    }
    for (const b of bichos) {
      b.t = Math.min(1, b.t + dt / (PASSO * 2.5))
      if (b.t < 1 || Math.random() > dt * 0.7) continue
      const [dx, dy] = Object.values(DIRECAO)[Math.floor(Math.random() * 4)]
      if (dx) b.esq = dx < 0
      const livre = Array.from({ length: b.w }, (_, k) => [b.x + dx + k, b.y + dy]).every(([ax, ay]) => {
        const alvo = MAPA[ay][ax] // bicho só anda no chão onde nasceu
        return (alvo === b.chao || alvo in BICHO) && !ocupado(ax, ay, b)
      })
      if (livre) (b.de = [b.x, b.y]), (b.x += dx), (b.y += dy), (b.t = 0)
    }
    const meio = (v: number) => Math.round(v * 2) / 2 // meio pixel da arte = 1 pixel da tela
    const px = meio(fx), py = meio(fy)
    const alvoX = Math.max(0, Math.min(W, px + 8 - 160)), alvoY = Math.max(0, Math.min(H, py + 8 - 90))
    if (isNaN(camX)) (camX = alvoX), (camY = alvoY)
    const k = 1 - Math.exp(-dt * 12)
    camX += (alvoX - camX) * k
    camY += (alvoY - camY) * k
    const cx = meio(camX), cy = meio(camY)

    ctx.imageSmoothingEnabled = false
    ctx.setTransform(2, 0, 0, 2, -cx * 2, -cy * 2)
    ctx.drawImage(mapa, 0, 0)
    for (const [ax, ay] of rio) agua(ctx, ax, ay, agora)
    aves.forEach((a, k) => { // cada papagaio bate as asas um pouco a cada 3s, fora de compasso com os vizinhos
      const t = (agora + k * 1100) % 3000
      ctx.drawImage(a.quadros[t < 640 ? Math.floor(t / 80) % 4 : 0], a.x, a.y)
    })
    const boneco = (im: HTMLCanvasElement, bx: number, by: number, esq: boolean) => {
      ctx.save()
      ctx.translate(bx + (esq ? im.width : 0), by)
      ctx.scale(esq ? -1 : 1, 1)
      ctx.drawImage(im, 0, 0)
      ctx.restore()
    }
    const viz = (o: (typeof outros)[number]) => Math.max(o.x - x, x - o.x - o.s + 1, o.y - y, y - o.y - o.s + 1) <= ('preso' in o ? 2 : 1) // preso fala através da grade
    const perto = outros.find(viz)
    const bichoPerto = (tipo: string) => bichos.find((b) => b.tipo === tipo && Math.max(b.x - x, x - b.x - b.w + 1, Math.abs(b.y - y)) <= 1)
    // Y-sort: quem tem o pé mais embaixo é desenhado depois, na frente. Objetos entram primeiro, então no empate o boneco ganha.
    const cena: [number, () => void][] = soltos.map((s) => [s.pe, () => ctx.drawImage(s.img, s.x, s.y)])
    outros.forEach((o, k) => cena.push([o.y * T + o.pe, () => boneco(o.img, o.x * T, o.y * T - (Math.floor(agora / 500 + k) % 2), viz(o) && x < o.x)]))
    for (const b of bichos) {
      const by = meio((b.de[1] + (b.y - b.de[1]) * b.t) * T) + T - b.img.height
      cena.push([by + b.pe, () => boneco(b.img, meio((b.de[0] + (b.x - b.de[0]) * b.t) * T), by, b.esq)])
    }
    cena.push([montado ? py + T - montado.img.height + montado.pe : py + peEu, () => { // montado, anão e cavalo são uma peça só
      if (montado) boneco(len ? [montado.img, trote[0], montado.img, trote[1]][Math.floor(agora / 90) % 4] : montado.img, px - 8, py + T - montado.img.height, olhaEsq)
      boneco((corDe <= agora && agora < corAte ? cor : img)[len && !montado ? Math.floor(agora / 130) % 4 : 0], px, py - (montado ? 15 : 0), olhaEsq)
    }])
    cena.sort((a, b) => a[0] - b[0]).forEach(([, desenha]) => desenha())

    // baforada: bolhas de fogo da boca do dragão até o anão
    const dragao = outros.find((o) => o.id === 'dragao')!
    if (agora < fogoAte) {
      const esq = x < dragao.x, bx = dragao.x * T + (esq ? 1 : 30), by = dragao.y * T + 11
      for (let f = 0; f < 16; f++) {
        const q = f / 15, r = 1 + q * 4
        ctx.fillStyle = [FOGO.w, FOGO.y, FOGO.r][Math.floor(Math.random() * 3)]
        ctx.fillRect(bx + (px + 8 - bx) * q + (Math.random() - 0.5) * r * 2 - r / 2, by + (py + 8 - by) * q + (Math.random() - 0.5) * r * 2 - r / 2, r, r)
      }
    }

    // o que E/Espaço faz agora
    const cavalo = bichoPerto('V'), cobra = bichoPerto('z')
    const vaga = montado && [x + 1, x - 2].find((hx) => andavel(hx, y) && andavel(hx + 1, y) && !ocupado(hx, y) && !ocupado(hx + 1, y))
    acao = montado
      ? vaga === undefined ? undefined : { rotulo: 'Descer', fazer: () => {
        Object.assign(montado!, { x: vaga, y, de: [vaga, y], t: 1 })
        ;(fx = x * T), (fy = y * T) // desce encaixado no tile, fora do cavalo
        bichos.push(montado!)
        montado = undefined
      } }
      : cavalo ? { rotulo: 'Montar', fazer: () => ((montado = cavalo), bichos.splice(bichos.indexOf(cavalo), 1)) }
      : viz(dragao) ? { rotulo: 'Cutucar', fazer: () => ((fogoAte = agora + 700), (corDe = agora + 500), (corAte = agora + 5500), (cor = preto)) }
      : cobra ? { rotulo: 'Pegar', fazer: () => ((corDe = agora), (corAte = agora + 5000), (cor = roxo)) }
      : undefined
    botao.title = acao ? `${acao.rotulo} (E)` : 'Interagir (E ou Espaço)'
    botao.classList.toggle('aceso', !!acao)

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.font = '16px VT323, monospace'
    ctx.textAlign = 'center'
    for (const [nome, zx, zy] of ZONAS) {
      const sx = (zx * T + 8 - cx) * 2, sy = (zy * T + 10 - cy) * 2
      ctx.fillStyle = '#000'
      ctx.fillText(nome, sx + 2, sy + 2)
      ctx.fillStyle = '#ffd23b'
      ctx.fillText(nome, sx, sy)
    }

    // o balão aparece e some com transição (CSS); ao sumir, segue preso a quem falou por último
    balao.classList.toggle('visivel', !!perto)
    if (perto && balao.dataset.id !== perto.id) {
      balao.dataset.id = perto.id
      balao.innerHTML = `<b>${perto.nome}</b><br>${perto.fala}`
    }
    const quem = outros.find((o) => o.id === balao.dataset.id)
    if (quem) {
      balao.style.left = `${(quem.x * T + 8 * quem.s - cx) * 2}px`
      balao.style.top = `${(quem.y * T - cy) * 2 - 4}px`
    }
    requestAnimationFrame(quadro)
  }
  requestAnimationFrame(quadro)
}
