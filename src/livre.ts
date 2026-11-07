// Modo livre: anda pela fortaleza com um anão e conversa com os outros, cada um no seu canto.
import { RECEITAS, type Receita } from './receitas.ts'
import { BARRIL, PEPITA, compose, dwarfSprite, icone, type Grid } from './sprites.ts'

// Um caractere por tile de 16x16. Gerado à mão: salas separadas por rocha, com portas.
export const MAPA = [
  '##o#14#2#o#3####################################',
  '#......$....#xSHMXxSHMX#BpN+FFFpN+B#EEEErrrEEEE#',
  '2.........$.1xxxxxxxxxx#pp++pppp++p#x^xxrrrxx^x#',
  'o..6......$.3xxDxxxxDxx#ppppppppppp#xxxxrrrxxxx#',
  '4.9.7........xxxxxxxxxx.pppIpppIppp.xxxxrrrxxxx#',
  '#............xxxxxxxxxx.ppppppppppp.xxTxrrrxTxx#',
  '#.........7.#xxxxxxxxxx#ppppppppppp#xxxxrrrxxxx#',
  '1.5.....89..2xxDxxxxDxx#pppIpppIppp#xxxxrrrxxxx#',
  '3....6......oxxxxxxxxxx#ppppppppppp#x^xxrrrxx^x#',
  '#...........4xxxxxxxxxx#BpppppppppB#xxxxxxxxxxx#',
  '#2#o#3..#14##############################..#####',
  '#u,,,,,,,,,,,,u#BBwRORORORwrrrrr#BvEvEvB#tttttt#',
  '#,c,,c,,c,,c,,,#Bwwwwwwwwwwrr!rr#vvvvvvv#tTtTtT#',
  '#,c,,c,,c,,c,,,#wwAWAWAWAwwwwwww#vvvvvvv#tttttt#',
  '#,c,,c,,c,,c,,,.wwwwwwwwwwww;;ww.vvvvvvv.tttttt#',
  '#,c,,c,,c,,c,,,.ww;;;wwwwwww[+ww.vvvvvvv.tttttt#',
  '#fffff,,,ffffff#ww]++ww;;;ww;;ww#v;;v;;v.tttttt#',
  '#,,P,f,,,f,,,G,#ww;;;ww]++wwwwww#v[+v[+v#tttttt#',
  '#,P,,f,,,f,G,,,#wwwwwww;;;wwwwww#vvvIvvv#tttttt#',
  '#,,,,f,,,f,,G,,#wwwwwwwwwwwwwwBB#vvvvvvv#ttttEE#',
  '######..####~#####..########..###########..#####',
  '#,,l,,,,l,,~~~Yhhhhhhhhh#N+tttttN+#aaaaaaaaaaaa#',
  '#,g,,g,,gu,~~~hhhhhhhhhh#++ttttt++#aoaQaaaaamaa#',
  '#,,,,,,,z,,~~~hhh@h&h%hh#ttttttttt#aamaaaaaaoaa#',
  '#,l,,,l,,l,~~~hhhhhhhhhh#tCtttttCt#aaaaaaaQaaaQ#',
  '#,,g,,,g,,,~~~hhhhhhhhhh#ttttttttt#aaaaaaoaaaaa#',
  '#Y,,,,,,l,,===hhhhhhhhhh#ttt]++ttt#aaQaaaaaaQaa#',
  '#,,,l,,,,,,~~~hhhhffffff#ctt;t;ttB#aaaamaaaaama#',
  '#,g,,g,,g,,~~~hhVhfhhhGh#btttttttB#aaaoaaaaaaaa#',
  '#,,l,,l,,Y,~~~hhhhfhGhhh#Utttttttt#amaaaQaaQaoa#',
  '#,Y,u,,u,,,~~~YuhhfhhPhh#EEtttttEE#aaaaaaaaaaaa#',
  '#####..#########..######################..######',
  '#YppppppppppppppppppppppppppppppppppppppppppppY#',
  '#ppJ+ppppK+ppppZ+ppppJ+ppppK+ppppZ+ppppJ+pppppp#',
  '#pp++pppp++pppp++pppp++pppp++pppp++pppp++pppppp#',
  '#pppppppppppppppppppppppppppppppppppppppppppppp#',
  '#ppppppppppppppppppppppp(+ppppppppppppppp(+pppp#',
  '#puppppppppppppppppppppppppppppppppppppppppppup#',
  '#pppppK+ppppZ+ppppJ+ppppK+ppppZ+ppppJ+ppppK+ppp#',
  '#ppppp++pppp++pppp++pppp++pppp++pppp++pppp++ppp#',
  '#pppppppppppppppppppppppppppppppppppppppppppppp#',
  '#ppppppp(+ppppppppppppppppppppp(+pppppppppppppp#',
  '#YppppppppppppppppppppppppppppppppppppppppppppY#',
  '################################################',

]
const T = 16
const PAREDE = '#o1234' // rocha e veios de minério
const SOLIDO = PAREDE + '~BTFLbfENIYuDSHMXJKZmCUROAW$@&%56789!^(+[]' // P, G, Q, V e z são bichos: o chão embaixo é livre, eles é que ocupam. Trigo (c), cogumelo (g) e cadeira (;) se atravessam.
// Objetos maiores que um tile ficam com a letra no canto de cima à esquerda e '+' no resto.
export const INICIO: [number, number] = [24, 15] // meio da taverna

/** Onde cada anão fica, perto do que faz. */
export const LOCAL: Record<string, [number, number]> = {
  hidromel: [6, 4], // mina
  cerveja: [17, 5], // quartel
  grogue: [29, 3], // forja
  licor: [7, 17], // entre os cercados da fazenda
  furia: [19, 12], // barris da taverna
  contra: [20, 8], // quartel
  teclados: [36, 14], // oficina
  nobre: [41, 2], // salão nobre
  trapacas: [10, 36], // feira
  lampadas: [17, 37], // lampiões da feira
  moderado: [35, 41], // feira
  comprido: [10, 13], // fazenda
  mari: [4, 24], // jardim
  aquecido: [43, 14], // consultório
  pontes: [10, 25], // ponte
  papagaios: [19, 25], // estábulo
  scarlett: [30, 12], // palco da taverna
  formigas: [41, 27], // formigueiro
}

const ZONAS: [string, number, number][] = [
  ['Mina', 6, 1], ['Quartel', 17.5, 2], ['Forja', 29, 2], ['Salão Nobre', 41, 9], ['Fazenda', 7.5, 11], ['Taverna', 23.5, 11],
  ['Oficina', 36, 12], ['Consultório', 43.5, 11], ['Jardim', 5.5, 21], ['Estábulo', 19, 21], ['Cozinha', 29, 22], ['Formigueiro', 40.5, 21],
  ['Feira', 23.5, 32],
]

export const andavel = (x: number, y: number) => !SOLIDO.includes(MAPA[y]?.[x] ?? '#')

// ---------------------------------------------------------------- desenho

const PISO: Record<string, [string, string]> = {
  '#': ['#2a221d', '#3d322a'], '.': ['#4a3c30', '#3d322a'], p: ['#2a221d', '#5a4e44'], x: ['#5e5652', '#3e3834'],
  t: ['#8a8f99', '#e8ecf0'], v: ['#b0804a', '#8a5a2a'], ',': ['#3a3018', '#5a8a2a'], w: ['#6a4018', '#4a2a10'],
  r: ['#8a1424', '#b0302a'], '~': ['#1a3a6a', '#5ce6e6'], '=': ['#9c6a2f', '#5a3a18'], h: ['#8a7a3a', '#c8b060'], a: ['#5a3a1a', '#3a2410'],
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
  '........', '........', '........', '........', '........', '....kkkk', '..kkgggg', '.kgGgggg',
  '.kggggGg', 'kgggrggg', 'kggggggg', 'kgGggggg', '.kkggggg', '...kkkkk', '........', '........',
]], { ...VERDE, r: '#e02a3a' })
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
// 32x24: dois tiles de largura, um e meio de altura
/** Quatro pernas finas: as de trás dobram no jarrete, as da frente têm joelho; as do lado de lá são mais escuras. */
function pernas() {
  const linhas = Array.from({ length: 6 }, () => [...'.'.repeat(32)])
  const PERNAS: [number, string, number[]][] = [[9, 'B', [0, -1, -1, 0, 0, 0]], [16, 'B', [0, 0, 0, 0, 0, 0]], [6, 'b', [0, -1, -1, 0, 0, 0]], [19, 'b', [0, 0, 0, 0, 0, 0]]]
  for (const [col, cor, desvio] of PERNAS)
    desvio.forEach((d, j) => {
      const meio = j === 4 ? 'd' : j === 5 ? 'k' : j === 2 && cor === 'b' ? 'h' : cor // casco escuro, joelho claro
      linhas[j].splice(col + d, 3, 'k', meio, 'k')
    })
  return linhas.map((l) => l.join(''))
}
const CAVALO = grade([
  '........................kk......', '.......................kbk......', '......................kmbbkk....', '.....................kmmbbbbk...',
  '....................kmmbbebbbk..', '...................kmmbbbbbbbbk.', '..................kmmbbbbkkbbbBk', '.................kmmbbbbk..kbbBk',
  '.................kmbbbbk....kkk.', '..kkk...........kmbbbbbk........', '.kmmmkkkkkkkkkkkkbbbbbbk........', 'kmmk.kbbbbbbbbbbbbbbbbbk........',
  'kmk.kbbbbbbbbbbbbbbbbbbbk.......', 'km..kbbbbbbbbbbbbbbbbbbbk.......', 'kmk.kbbbbbbbbbbbbbbbbbbBk.......', '.kmkkBbbbbbbbbbbbbbbbbBBk.......',
  '.km.kBBbbbbbbbbbbbbbbBBk........', '..kk.kkkkkkkkkkkkkkkkkkk........', ...pernas(),
], { b: '#8a5a2a', B: '#6a4018', m: '#2a1a0a', d: '#3a2a18', h: '#a87a4a' })
const COBRA = compose([[
  '', '', '', '', '', '', '', '', '..........kkk...', '.........kgegk..', '..kkk....kgggkr.', '.kgGgk..kgGgk...',
  'kgk.kgkkgGgk....', 'kgk..kgGggk.....', '.kgk..kkkk......', '..kk............',
]], { g: '#5a9a2a', G: '#c8d84a', e: '#ffe14a', r: '#e02a3a' })
const PAPAGAIO = [
  '................', '................', '.......kkk......', '......kpppk.....', '......kpepkk....', '......kppkyyk...',
  '.....kppppkk....', '....kpPPppk.....', '....kpPPPpk.....', '....kpPPppk.....', '.....kppkk......', '...kkkpkkkkk....',
  '...knnnnnnnk....', '...kkkknkkkk....', '.......n........', '.....kknkk......',
]
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

const PROP: Record<string, Grid> = {
  ...MINERIO, ...PEDRAS, '!': MICROFONE, '^': ESTATUA, B: BARRIL, U: icone('m'), C: CALDEIRAO, F: FORJA, L: icone('A'), c: icone('c'), b: icone('b'), g: icone('g'),
  f: CERCA, T: MESA, '[': mesaLonga(2), ']': mesaLonga(3), ';': CADEIRA, $: PEPITA, E: ESTANTE, N: FORNALHA, I: BIGORNA, Y: ARVORE, u: ARBUSTO, l: FLORES,
  R: compose([FUNDO, GARRAFAS], { ...VIDROS, 1: '#2fc870', 2: '#e02a3a', 3: '#e8a02a', 4: '#3a5aa8', 5: '#c070e0', 6: '#5ce6e6' }),
  O: compose([FUNDO, GARRAFAS], { ...VIDROS, 1: '#c070e0', 2: '#ffd23b', 3: '#5a2a1a', 4: '#e02a3a', 5: '#2fc870', 6: '#f4ecd8' }),
  A: compose([BALCAO, CANECO], { ...MADEIRA, y: '#e8a02a', f: '#fff6e0', 2: '#8a1424' }),
  W: compose([BALCAO, TACAS], { ...MADEIRA, w: '#fff6e0', 3: '#3a5aa8', g: '#6cdc4a' }),
  '@': compose([PAPAGAIO], { ...MADEIRA, p: '#e02a3a', P: '#3a5aa8', e: '#1b1410', y: '#f0e0a0' }),
  '&': compose([PAPAGAIO], { ...MADEIRA, p: '#3a7ae8', P: '#ffd23b', e: '#1b1410', y: '#f0e0a0' }),
  '%': compose([PAPAGAIO], { ...MADEIRA, p: '#3a9a3a', P: '#e02a3a', e: '#1b1410', y: '#f0e0a0' }),
  D: BONECO, S: ESPADA, H: ESCUDO, M: MARTELO, X: MACHADO, m: MONTE,
  J: grade(BARRACA, { ...BENS, a: '#e02a3a', A: '#f4ecd8', 1: '#e02a3a', 2: '#ffb02a', 3: '#6cdc4a' }), // frutas
  K: grade(BARRACA, { ...BENS, a: '#3a5aa8', A: '#f4ecd8', 1: '#c070e0', 2: '#5ce6e6', 3: '#ffd23b' }), // tecidos
  Z: grade(BARRACA, { ...BENS, a: '#3a8a2a', A: '#ffd23b', 1: '#5ce6e6', 2: '#e83a1a', 3: '#c070e0' }), // poções
  '(': CARRINHO,
}
const BICHO: Record<string, Grid> = { P: PORCO, G: GALINHA, Q: FORMIGA, V: CAVALO, z: COBRA }

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
export const EXTRAS = [
  { id: 'goblin', nome: 'Grishnak, o Goblin', fala: 'Psiu... troco ouro de anão por um gole. Ninguém precisa saber.', x: 21, y: 14, s: 1, g: GOBLIN },
  { id: 'elfo', nome: 'Elandor, o Elfo', fala: 'Vim provar a cerveja anã. Dizem que é melhor que vinho élfico. Duvido.', x: 6, y: 27, s: 1, g: ELFO },
  { id: 'snik', nome: 'Snik, o Goblin', fala: 'Bugigangas! Pedras brilhantes! Quase nada roubado!', x: 13, y: 36, s: 1, g: GOBLIN },
  { id: 'grot', nome: 'Grot, o Goblin', fala: 'Não olha pra minha barraca. Olha pra lá. ...Pronto, já era.', x: 38, y: 41, s: 1, g: GOBLIN },
  { id: 'orc', nome: 'Urzog, o Orc', fala: 'Orc quer cerveja. Orc paga com... respeito.', x: 20, y: 41, s: 1, g: ORC },
  { id: 'dragao', nome: 'Ignaroth, o Dragão', fala: 'Zzz... quem chega perto do meu ouro? ...Ah, só um anão. Zzz.', x: 8, y: 2, s: 2, g: DRAGAO },
]

function pinta(ctx: CanvasRenderingContext2D, g: Grid, x: number, y: number) {
  g.forEach((row, j) => row.forEach((c, i) => c && ((ctx.fillStyle = c), ctx.fillRect(x + i, y + j, 1, 1))))
}
const sprite = (g: Grid) => {
  const c = Object.assign(document.createElement('canvas'), { width: g[0].length, height: g.length })
  pinta(c.getContext('2d')!, g, 0, 0)
  return c
}

/** Chão sob um objeto: o vizinho mais perto que é piso (objetos grandes cercam o meio de outros objetos). */
const VIZINHOS = [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [1, -1], [-1, 1], [1, 1], [-2, 0], [2, 0], [0, 2], [0, -2], [-3, 0], [3, 0]]
const chao = (x: number, y: number) =>
  VIZINHOS.map(([dx, dy]) => MAPA[y + dy]?.[x + dx]).find((c) => c && c in PISO && c !== '#' && c !== '~') ?? '.'
const parede = (x: number, y: number) => PAREDE.includes(MAPA[y]?.[x] ?? '#')

/** Pinta o tile (x, y) com o padrão do piso `qual`. */
function piso(ctx: CanvasRenderingContext2D, qual: string, x: number, y: number) {
  const [base, mancha] = PISO[qual]
  const rect = (c: string, rx: number, ry: number, w: number, h: number) => ((ctx.fillStyle = c), ctx.fillRect(x * T + rx, y * T + ry, w, h))
  rect(base, 0, 0, T, T)
  if (qual === 'p') { // calçamento de pedras
    const pedras = y % 2 ? [[0, 0, 7], [8, 0, 7], [0, 8, 3], [4, 8, 7], [12, 8, 4]] : [[0, 0, 3], [4, 0, 7], [12, 0, 4], [0, 8, 7], [8, 8, 7]]
    pedras.forEach(([sx, sy, w], k) => (rect((x + k) % 3 ? mancha : '#6a5e52', sx, sy, w, 7), rect('#7a6e62', sx, sy, w, 1)))
  } else if (qual === 't') { // azulejo
    for (const [qx, qy] of [[0, 0], [8, 0], [0, 8], [8, 8]]) rect((qx + qy) % 16 ? '#7aa8c8' : mancha, qx, qy, 7, 7)
  } else if (qual === 'x') { // chão talhado
    rect('#7a706a', 0, 0, T, 1)
    rect(mancha, 0, 15, T, 1)
    rect(mancha, 15, 0, 1, T)
    if ((x + y) % 2) rect(mancha, 4, 4, 8, 1), rect(mancha, 4, 11, 8, 1), rect(mancha, 4, 4, 1, 8), rect(mancha, 11, 4, 1, 8)
  } else if (qual === 'v') { // madeira clara
    for (let i = 0; i < 4; i++) rect(mancha, 0, i * 4 + 3, T, 1), rect(mancha, (i * 5 + x * 3) % 16, i * 4, 1, 3)
  } else {
    for (let k = 0; k < 6; k++) rect(mancha, (x * 7 + y * 13 + k * 5) % 15, (x * 3 + y * 11 + k * 7) % 15, qual === 'w' || qual === '=' ? 4 : 1, 1)
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

/** Chão com objetos, e por cima dos bonecos as copas das árvores. */
function desenhaMapa() {
  const tela = () => Object.assign(document.createElement('canvas'), { width: MAPA[0].length * T, height: MAPA.length * T })
  const c = tela(), copas = tela()
  const ctx = c.getContext('2d')!
  const cerca = (x: number, y: number) => MAPA[y]?.[x] === 'f'
  MAPA.forEach((linha, y) => [...linha].forEach((ch, x) => piso(ctx, ch in PISO ? ch : PAREDE.includes(ch) ? '#' : chao(x, y), x, y)))
  // objetos depois de todo o chão, para os de 2 tiles não serem cobertos pelo piso vizinho
  MAPA.forEach((linha, y) => [...linha].forEach((ch, x) => {
    if (ch === 'f') { // cerca encaixa com as vizinhas: deitada, em pé ou nos dois sentidos no canto
      const v = cerca(x, y - 1) || cerca(x, y + 1)
      if (cerca(x - 1, y) || cerca(x + 1, y) || !v) pinta(ctx, CERCA, x * T, y * T)
      if (v) pinta(ctx, CERCA_V, x * T, y * T)
    } else if (PROP[ch]) pinta(ctx, PROP[ch], x * T, y * T)
    if (ch === 'Y') pinta(copas.getContext('2d')!, COPA, x * T - 8, y * T - 20)
  }))
  return [c, copas]
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
    ...RECEITAS.filter((r) => r !== eu).map((r) => ({ id: r.id, nome: r.cliente, fala: r.fala, x: LOCAL[r.id][0], y: LOCAL[r.id][1], s: 1, img: sprite(retrato(r)) })),
    ...EXTRAS.map((e) => ({ ...e, img: sprite(e.g) })),
  ]
  const em = (o: (typeof outros)[number], ox: number, oy: number) => ox >= o.x && ox < o.x + o.s && oy >= o.y && oy < o.y + o.s
  // Bichos passeiam sozinhos dentro dos cercados.
  const bichos = MAPA.flatMap((l, by) => [...l].flatMap((ch, bx) => BICHO[ch] ? [{ x: bx, y: by, w: BICHO[ch][0].length / T, de: [bx, by], t: 1, esq: false, img: sprite(BICHO[ch]), chao: chao(bx, by), tipo: ch }] : []))
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
    <button class="btn interagir" aria-label="Interagir (E ou Espaço)">✦</button>
    <div class="dpad">${['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'].map((k) => `<button class="btn" data-dir="${k}" aria-label="${k}">${{ ArrowUp: '▲', ArrowLeft: '◀', ArrowRight: '▶', ArrowDown: '▼' }[k]}</button>`).join('')}</div>`
  const ctx = palco.querySelector('canvas')!.getContext('2d')!
  const balao = palco.querySelector<HTMLElement>('.balao')!
  const [mapa, copas] = desenhaMapa()
  const img = sprite(retrato(eu)), preto = sprite(tinge(retrato(eu), QUEIMADO)), roxo = sprite(tinge(retrato(eu), ENVENENADO))
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
    const boneco = (im: HTMLCanvasElement, bx: number, by: number, esq: boolean) => {
      ctx.save()
      ctx.translate(bx + (esq ? im.width : 0), by)
      ctx.scale(esq ? -1 : 1, 1)
      ctx.drawImage(im, 0, 0)
      ctx.restore()
    }
    const viz = (o: (typeof outros)[number]) => Math.max(o.x - x, x - o.x - o.s + 1, o.y - y, y - o.y - o.s + 1) <= 1
    const perto = outros.find(viz)
    const bichoPerto = (tipo: string) => bichos.find((b) => b.tipo === tipo && Math.max(b.x - x, x - b.x - b.w + 1, Math.abs(b.y - y)) <= 1)
    outros.forEach((o, k) => boneco(o.img, o.x * T, o.y * T - (Math.floor(agora / 500 + k) % 2), viz(o) && x < o.x))
    for (const b of bichos) boneco(b.img, meio((b.de[0] + (b.x - b.de[0]) * b.t) * T), meio((b.de[1] + (b.y - b.de[1]) * b.t) * T) + T - b.img.height, b.esq)
    if (montado) boneco(montado.img, px - 8, py + T - montado.img.height, olhaEsq)
    boneco(corDe <= agora && agora < corAte ? cor : img, px, py - (montado ? 9 : 0), olhaEsq)
    ctx.drawImage(copas, 0, 0)

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
