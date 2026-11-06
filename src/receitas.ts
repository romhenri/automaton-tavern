import { complemento, type AFD } from './afd.ts'
import type { Visual } from './sprites.ts'

export type Simbolo = { s: string; nome: string; acao: boolean; sabor: string }

// Minúsculas = ingredientes, maiúsculas = ações. |Σ| = 9.
export const ALFABETO: Simbolo[] = [
  { s: 't', nome: 'Bactris', acao: false, sabor: 'Fruto de palmeira espinhosa, trazido por mercadores da superfície' },
  { s: 'b', nome: 'Bagas', acao: false, sabor: 'Bagas vermelhas das cavernas rasas' },
  { s: 'g', nome: 'Cogumelos', acao: false, sabor: 'Cogumelo luminoso das minas profundas' },
  { s: 'c', nome: 'Cevada Negra', acao: false, sabor: 'Base de toda cerveja anã que se preze' },
  { s: 'm', nome: 'Mel', acao: false, sabor: 'Mel de abelhas de rocha, raríssimo' },
  { s: 'B', nome: 'Bater', acao: true, sabor: 'Agita a caneca com força' },
  { s: 'M', nome: 'Mexer', acao: true, sabor: 'Mexe devagar com colher de ferro' },
  { s: 'A', nome: 'Aquecer', acao: true, sabor: 'Leva a caneca à forja' },
  { s: 'F', nome: 'Fermentar', acao: true, sabor: 'Deixa descansar no barril' },
]

export type Receita = {
  id: string
  nome: string
  cliente: string
  /** Ofício do anão no cliente dwarf-fortress-api: define roupa e ferramenta do sprite. */
  oficio: string
  /** Aparência fixa; sem ela o sprite sai do hash do nome. */
  visual?: Visual
  fala: string
  conceito: string
  afd: AFD
  layout: Record<string, [number, number]>
  /** Desenha qx no quadro (só faz sentido quando ele importa, como no complemento). */
  mostrarErro?: boolean
  bonus?: boolean
  /** Chefe final: a última fase. */
  chefe?: boolean
  /** Personalidade: falas próprias por veredito, no lugar das padrão. */
  falas?: Partial<Record<'novo' | 'repetido' | 'incompleto' | 'erro', string>>
  exemplos: { aceitas: string[]; rejeitadas: string[] }
}

const hidromel: AFD = {
  estados: ['q0', 'q1', 'q2'],
  inicial: 'q0',
  finais: ['q2'],
  delta: { q0: { m: 'q1' }, q1: { m: 'q1', B: 'q2' } },
}

export const RECEITAS: Receita[] = [
  {
    id: 'hidromel',
    nome: 'Hidromel do Mineiro',
    cliente: 'Borin Barbaferro',
    oficio: 'Miner',
    fala: 'Mel, quanto mais melhor, e uma boa batida no final.',
    conceito: 'Sequência e laço',
    afd: hidromel,
    falas: { novo: '*glub* Mel de rocha! Pela minha picareta!' },
    layout: { q0: [40, 65], q1: [120, 65], q2: [200, 65] },
    exemplos: { aceitas: ['mB', 'mmB', 'mmmB'], rejeitadas: ['B', 'm', 'mBm', 'mcB'] },
  },
  {
    id: 'cerveja',
    nome: 'Cerveja Negra de Khazad',
    cliente: 'Dagna Martelo-Rubro',
    oficio: 'Hammerdwarf',
    fala: 'Começa com cevada, pode adoçar ou engrossar à vontade, e fermenta.',
    conceito: 'Escolha dentro do laço',
    afd: {
      estados: ['q0', 'q1', 'q2'],
      inicial: 'q0',
      finais: ['q2'],
      delta: { q0: { c: 'q1' }, q1: { c: 'q1', m: 'q1', F: 'q2' } },
    },
    falas: { erro: 'Isso aí eu uso pra temperar martelo, não pra beber!' },
    layout: { q0: [40, 65], q1: [120, 65], q2: [200, 65] },
    exemplos: { aceitas: ['cF', 'cmF', 'ccmF'], rejeitadas: ['mcF', 'cmm', 'cFF'] },
  },
  {
    id: 'grogue',
    nome: 'Grogue do Cogumelo',
    cliente: 'Thrain, o Ranzinza',
    oficio: 'Metalsmith',
    fala: 'Um cogumelo. UM. Dois e você acorda em Valfenda.',
    conceito: 'Contagem exata',
    afd: {
      estados: ['q0', 'q1', 'q2'],
      inicial: 'q0',
      finais: ['q2'],
      delta: { q0: { c: 'q0', M: 'q0', g: 'q1' }, q1: { c: 'q1', M: 'q1', A: 'q2' } },
    },
    falas: { repetido: 'De novo isso? Já disse que quero OUTRO.', novo: 'Hmpf. Passável.' },
    layout: { q0: [40, 70], q1: [120, 70], q2: [200, 70] },
    exemplos: { aceitas: ['gA', 'cgA', 'cMgcA'], rejeitadas: ['cA', 'gcgA'] },
  },
  {
    id: 'licor',
    nome: 'Licor de Bagas',
    cliente: 'Gimra Pé-de-Pedra',
    oficio: 'Farmer',
    fala: 'Bagas sempre aos pares, senão azeda.',
    conceito: 'Paridade (memória finita)',
    afd: {
      estados: ['q0', 'qPar', 'qImpar', 'q3'],
      inicial: 'q0',
      finais: ['q3'],
      delta: {
        q0: { t: 'qPar', b: 'qImpar' },
        qPar: { t: 'qPar', b: 'qImpar', B: 'q3' },
        qImpar: { t: 'qImpar', b: 'qPar' },
      },
    },
    falas: { incompleto: 'Azedou! Conta as bagas, criatura!' },
    layout: { q0: [36, 65], qPar: [116, 42], qImpar: [116, 86], q3: [204, 42] },
    exemplos: { aceitas: ['tB', 'bbB', 'btbB'], rejeitadas: ['bB', 'bbbB'] },
  },
  {
    id: 'furia',
    nome: 'Fúria de Durin',
    cliente: 'Urist Forjamor',
    oficio: 'Brewer',
    fala: 'Esquenta, mas nunca duas vezes seguidas, ou a caneca derrete.',
    conceito: 'Proibição de padrão',
    afd: {
      estados: ['q0', 'q1', 'q2'],
      inicial: 'q0',
      finais: ['q2'],
      delta: {
        q0: { c: 'q0', A: 'q1', M: 'q2' },
        q1: { c: 'q0', M: 'q2' },
        q2: { c: 'q0', A: 'q1', M: 'q2' },
      },
    },
    falas: { erro: 'Derreteu a caneca! Nem na minha cervejaria!' },
    layout: { q0: [40, 86], q1: [120, 40], q2: [200, 86] },
    exemplos: { aceitas: ['cM', 'cAM', 'AMAM'], rejeitadas: ['cAAM', 'cA'] },
  },
  {
    id: 'contra',
    nome: 'O Anão do Contra',
    cliente: 'Nali, o do Contra',
    oficio: 'Axedwarf',
    fala: 'Qualquer coisa, MENOS Hidromel.',
    conceito: 'Complemento de AFD',
    afd: complemento(hidromel),
    falas: { incompleto: 'Hidromel?! Eu disse QUALQUER COISA menos isso!' },
    layout: { q0: [40, 40], q1: [120, 40], q2: [200, 40], qx: [120, 86] },
    mostrarErro: true,
    bonus: true,
    exemplos: { aceitas: ['m', 'B', 'mBm', 'cF'], rejeitadas: ['mB', 'mmB'] },
  },

  // ---------------------------------------------------------------- fases bônus
  {
    id: 'teclados',
    nome: 'Sinfonia de Oito Teclas',
    cliente: 'Gabi dos Teclados',
    oficio: 'Mechanic',
    visual: { cabelo: '#f0d060', barba: 'nenhuma', longo: true, roupa: '#6a3a9a' },
    fala: 'Uma sinfonia! Cevada aos pares ou mel batido, e fermenta. Depois mexe e fermenta de novo, ou aquece pra fechar.',
    conceito: 'Tudo junto: ramos, paridade, laços, ciclos e dois finais',
    // Mínimo (ver afd.test.ts). qA/qA2: paridade da cevada. qB1/qB2: mel e batida.
    // qD: fermentado (final). qE/qG: mexido uma/duas vezes. qF: aquecido (final, fecha).
    afd: {
      estados: ['q0', 'qA', 'qA2', 'qB1', 'qB2', 'qD', 'qE', 'qG', 'qF'],
      inicial: 'q0',
      finais: ['qD', 'qF'],
      delta: {
        q0: { c: 'qA', m: 'qB1' },
        qA: { c: 'qA2', m: 'qB1' },
        qA2: { c: 'qA', F: 'qD' },
        qB1: { m: 'qB1', B: 'qB2' },
        qB2: { F: 'qD' },
        qD: { M: 'qE', A: 'qF' },
        qE: { F: 'qD', M: 'qG' },
        qG: { F: 'qD', B: 'qB2' },
      },
    },
    bonus: true,
    falas: { incompleto: 'A sinfonia não terminou! Fermenta ou aquece.', erro: 'Desafinou! Cevada é aos pares, mel precisa bater.', novo: '*tlec tlec tlec* Bravíssimo!' },
    layout: {
      qA: [95, 20], qA2: [155, 20], qF: [215, 20],
      q0: [36, 70], qB1: [95, 70], qB2: [155, 70], qD: [215, 70],
      qG: [155, 120], qE: [215, 120],
    },
    exemplos: {
      aceitas: ['ccF', 'mBF', 'ccFA', 'cmBF', 'mmBFMF', 'ccFMMF', 'mBFMMBF'],
      rejeitadas: ['cF', 'mF', 'ccFAM', 'mBFM', 'cccF'],
    },
  },
  {
    id: 'nobre',
    nome: 'Selo Real',
    cliente: 'Lari Nobre',
    oficio: 'Noble',
    visual: { cabelo: '#5a3a1a', pele: '#fbe6d4', barba: 'nenhuma', longo: true, franja: true, roupa: '#b0242a' },
    fala: 'Uma dama exige o selo real: bagas, mel e bagas, uma atrás da outra. O resto é enfeite. Fermente para servir.',
    conceito: 'Busca de padrão (contém bmb)',
    // q0..q3 = quanto do selo bmb já apareceu; errar no meio volta para onde o prefixo ainda serve
    afd: {
      estados: ['q0', 'q1', 'q2', 'q3', 'q4'],
      inicial: 'q0',
      finais: ['q4'],
      delta: {
        q0: { b: 'q1', m: 'q0', c: 'q0' },
        q1: { b: 'q1', m: 'q2', c: 'q0' },
        q2: { b: 'q3', m: 'q0', c: 'q0' },
        q3: { b: 'q3', m: 'q3', c: 'q3', F: 'q4' },
      },
    },
    bonus: true,
    falas: { incompleto: 'Cadê o selo? Bagas, mel, bagas. Em sequência.', erro: 'Que vulgar! Sem selo real não se fermenta.', novo: 'Digno da realeza!' },
    layout: { q0: [36, 88], q1: [90, 44], q2: [150, 44], q3: [170, 88], q4: [222, 88] },
    exemplos: { aceitas: ['bmbF', 'cbmbF', 'bbmbF', 'bmbmcF'], rejeitadas: ['bmF', 'bmcbF', 'bmb', 'bmmbF'] },
  },
  {
    id: 'trapacas',
    nome: 'Trapaça de Cogumelo',
    cliente: 'Arthur das Trapaças',
    oficio: 'Trapaceiro',
    visual: { cabelo: '#3a3030', barba: 'cheia', oculos: true, roupa: '#2a4a3a' },
    fala: 'Cogumelo! Muito cogumelo! Três no mínimo. A cevada é só disfarce. Mexe no final.',
    conceito: 'Contagem mínima (pelo menos 3)',
    afd: {
      estados: ['q0', 'q1', 'q2', 'q3', 'q4'],
      inicial: 'q0',
      finais: ['q4'],
      delta: {
        q0: { g: 'q1', c: 'q0' },
        q1: { g: 'q2', c: 'q1' },
        q2: { g: 'q3', c: 'q2' },
        q3: { g: 'q3', c: 'q3', M: 'q4' },
      },
    },
    bonus: true,
    falas: { incompleto: 'Só isso de cogumelo? Tá me trapaceando?', novo: 'Hehehe... agora sim, vejo cores!' },
    layout: { q0: [36, 70], q1: [82, 70], q2: [128, 70], q3: [174, 70], q4: [220, 70] },
    exemplos: { aceitas: ['gggM', 'gcggM', 'ggggM'], rejeitadas: ['ggM', 'gggA', 'gggMc'] },
  },
  {
    id: 'lampadas',
    nome: 'Lampião de Mel e Bagas',
    cliente: 'Rita das Lâmpadas',
    oficio: 'Lamplighter',
    visual: { cabelo: '#3a3030', pele: '#fbe6d4', barba: 'nenhuma', longo: true, roupa: '#b07a1a' },
    fala: 'Mel e bagas, os dois, quantos quiser. Depois esquenta até brilhar.',
    conceito: 'Lembrar duas coisas (produto de condições)',
    // q1 = já tem mel, q2 = já tem bagas, q3 = tem os dois
    afd: {
      estados: ['q0', 'q1', 'q2', 'q3', 'q4'],
      inicial: 'q0',
      finais: ['q4'],
      delta: {
        q0: { m: 'q1', b: 'q2' },
        q1: { m: 'q1', b: 'q3' },
        q2: { b: 'q2', m: 'q3' },
        q3: { m: 'q3', b: 'q3', A: 'q4' },
      },
    },
    bonus: true,
    falas: { incompleto: 'Cadê o outro? Mel E bagas, querido.', novo: 'Ahh, agora sim tá aceso!' },
    layout: { q0: [36, 65], q1: [100, 42], q2: [100, 88], q3: [164, 65], q4: [220, 65] },
    exemplos: { aceitas: ['mbA', 'bmA', 'mmbbA'], rejeitadas: ['mmA', 'mbB', 'Amb'] },
  },
  {
    id: 'moderado',
    nome: 'Cogumelo Moderado',
    cliente: 'Barios',
    oficio: 'Trapaceiro',
    visual: { cabelo: '#3a3030', barba: 'cheia', oculos: true, roupa: '#6a2a4a' },
    fala: 'Meu irmão Arthur exagera. Eu sou moderado: no máximo dois cogumelos. Cevada à vontade, mexe no fim.',
    conceito: 'Contagem máxima (no máximo 2)',
    // q0..q2 = cogumelos até agora; o terceiro g cai em qx
    afd: {
      estados: ['q0', 'q1', 'q2', 'q3'],
      inicial: 'q0',
      finais: ['q3'],
      delta: {
        q0: { g: 'q1', c: 'q0', M: 'q3' },
        q1: { g: 'q2', c: 'q1', M: 'q3' },
        q2: { c: 'q2', M: 'q3' },
      },
    },
    bonus: true,
    falas: { incompleto: 'Mexe no final, por favor. Com moderação.', erro: 'Cogumelo demais! Isso é coisa do Arthur.', novo: 'Na medida certa.' },
    layout: { q0: [36, 42], q1: [110, 42], q2: [184, 42], q3: [110, 104] },
    exemplos: { aceitas: ['M', 'gM', 'gcgM', 'cgcM'], rejeitadas: ['gggM', 'gg', 'gMc'] },
  },
  {
    id: 'comprido',
    nome: 'Suco Comprido',
    cliente: 'Rômulo, o Comprido',
    oficio: 'Farmer',
    visual: { cabelo: '#6a4224', barba: 'bigode' },
    fala: 'Só bagas. Nada de bater, nada de mexer. E muitas: quatro no mínimo.',
    conceito: 'Estado final com laço (sem ação no fim)',
    afd: {
      estados: ['q0', 'q1', 'q2', 'q3', 'q4'],
      inicial: 'q0',
      finais: ['q4'],
      delta: { q0: { b: 'q1' }, q1: { b: 'q2' }, q2: { b: 'q3' }, q3: { b: 'q4' }, q4: { b: 'q4' } },
    },
    bonus: true,
    falas: { incompleto: 'Curto demais. Eu sou comprido, o suco também.', erro: 'Eu disse SÓ bagas!' },
    layout: { q0: [36, 70], q1: [82, 70], q2: [128, 70], q3: [174, 70], q4: [220, 70] },
    exemplos: { aceitas: ['bbbb', 'bbbbb', 'bbbbbb'], rejeitadas: ['bbb', 'bbbbB', 'tbbbb'] },
  },
  {
    id: 'mari',
    nome: 'Bactris de Ponta a Ponta',
    cliente: 'Mari das Costuras',
    oficio: 'Gardener',
    visual: { cabelo: '#c8501a', pele: '#a8704a', barba: 'nenhuma', longo: true, cachos: true, roupa: '#3a8a6a' },
    fala: 'Bactris no começo e bactris no fim. No meio, bate ou mexe à vontade.',
    conceito: 'Começa e termina com o mesmo símbolo',
    afd: {
      estados: ['q0', 'q1', 'q2'],
      inicial: 'q0',
      finais: ['q2'],
      delta: { q0: { t: 'q1' }, q1: { t: 'q2', M: 'q1', B: 'q1' }, q2: { t: 'q2', M: 'q1', B: 'q1' } },
    },
    bonus: true,
    falas: { incompleto: 'E a bactris do final, cadê?', erro: 'Começa com bactris, ué!' },
    layout: { q0: [40, 60], q1: [120, 60], q2: [200, 60] },
    exemplos: { aceitas: ['tt', 'tMt', 'tBtt'], rejeitadas: ['t', 'Mt', 'tM'] },
  },
  {
    id: 'aquecido',
    nome: 'Febre de Laboratório',
    cliente: 'Sergio Rato-Branco',
    oficio: 'Doctor',
    visual: { pele: '#fbe6d4', barba: 'nenhuma', roupa: '#e8e8e0' },
    fala: 'Primeiro um cogumelo de cobaia. Depois aquece, aquece, aquece! De três em três. Cevada quando quiser, e mexe no final.',
    conceito: 'Contagem módulo 3 (ciclo)',
    // q0 exige o cogumelo; q1..q3 = A mod 3 antes do primeiro trio; q4 = múltiplo de 3 (≥ 3), único que aceita M
    afd: {
      estados: ['q0', 'q1', 'q2', 'q3', 'q4', 'q5'],
      inicial: 'q0',
      finais: ['q5'],
      delta: {
        q0: { g: 'q1' },
        q1: { c: 'q1', A: 'q2' },
        q2: { c: 'q2', A: 'q3' },
        q3: { c: 'q3', A: 'q4' },
        q4: { c: 'q4', A: 'q2', M: 'q5' },
      },
    },
    bonus: true,
    falas: { incompleto: 'Morno! Faltou fogo, conta de três em três.', erro: 'Cadê o cogumelo? E isso queimou meus bigodes de rato!', novo: '*squeak* Quentinho no ponto!' },
    layout: { q0: [36, 100], q1: [36, 42], q2: [110, 42], q3: [184, 42], q4: [147, 88], q5: [90, 104] },
    exemplos: { aceitas: ['gAAAM', 'gcAAAM', 'gAcAAM', 'gAAAAAAM'], rejeitadas: ['AAAM', 'gAAM', 'gAAAAM', 'gAAAMA'] },
  },
  {
    id: 'pontes',
    nome: 'Ponte de Khazad',
    cliente: 'Mariana, Faz Pontes',
    oficio: 'Engineer',
    visual: { cabelo: '#a87040', pele: '#fbe6d4', barba: 'nenhuma', longo: true, roupa: '#2a5a9a' },
    fala: 'Eu faço pontes: um Hidromel de um lado, uma Cerveja Negra do outro. A batida liga os dois.',
    conceito: 'Concatenação (Hidromel · Cerveja)',
    // q0..q2 é o Hidromel (m+B), q2..q4 é a Cerveja (c(c|m)*F): a aresta c de q2 é a ponte
    afd: {
      estados: ['q0', 'q1', 'q2', 'q3', 'q4'],
      inicial: 'q0',
      finais: ['q4'],
      delta: {
        q0: { m: 'q1' },
        q1: { m: 'q1', B: 'q2' },
        q2: { c: 'q3' },
        q3: { c: 'q3', m: 'q3', F: 'q4' },
      },
    },
    bonus: true,
    falas: { incompleto: 'A ponte tá pela metade! Falta chegar do outro lado.', erro: 'Essa ponte desabou. Hidromel primeiro, depois cevada.', novo: 'Ponte firme, de margem a margem!' },
    layout: { q0: [36, 70], q1: [84, 70], q2: [132, 70], q3: [180, 70], q4: [222, 70] },
    exemplos: { aceitas: ['mBcF', 'mmBcF', 'mBcmF', 'mBccmF'], rejeitadas: ['mBF', 'cF', 'mBc', 'mcBF'] },
  },
  {
    id: 'papagaios',
    nome: 'Eco de Papagaio',
    cliente: 'Gui dos Papagaios',
    oficio: 'Animal Trainer',
    visual: { cabelo: '#2a2020', pele: '#5a3420', barba: 'nenhuma', roupa: '#2a9a4a' },
    fala: 'Meus papagaios repetem tudo! Cada fruta duas vezes seguidas: bactris ou bagas. Quantas duplas quiser.',
    conceito: 'Lembrar o último símbolo (pares)',
    // qt/qb lembram a fruta que espera o eco; q1 = dupla fechada (final)
    afd: {
      estados: ['q0', 'qt', 'qb', 'q1'],
      inicial: 'q0',
      finais: ['q1'],
      delta: {
        q0: { t: 'qt', b: 'qb' },
        qt: { t: 'q1' },
        qb: { b: 'q1' },
        q1: { t: 'qt', b: 'qb' },
      },
    },
    bonus: true,
    falas: { incompleto: 'Cadê o eco? O papagaio ficou esperando!', erro: 'Croc! Papagaio não repete isso não!', novo: 'Croc! Croc! Isso! Isso!' },
    layout: { q0: [36, 65], qt: [110, 16], qb: [110, 114], q1: [216, 65] },
    exemplos: { aceitas: ['tt', 'bbtt', 'ttbbtt', 'bbbb'], rejeitadas: ['t', 'tb', 'ttb', 'mm'] },
  },
  {
    id: 'scarlett',
    nome: 'Brasa Escarlate',
    cliente: 'Scarlett',
    oficio: 'Dancer',
    visual: { cabelo: '#d8281a', pele: '#f2d0b0', barba: 'nenhuma', longo: true, roupa: '#8a1424' },
    fala: 'Coloque o que quiser, querido. Só não esqueça: termina com bagas na brasa.',
    conceito: 'Sufixo (termina com bA)',
    // q1 = acabou de pôr bagas, q2 = bagas e logo brasa (final); continuar mexe na trilha
    afd: {
      estados: ['q0', 'q1', 'q2'],
      inicial: 'q0',
      finais: ['q2'],
      delta: {
        q0: { b: 'q1', m: 'q0', A: 'q0' },
        q1: { b: 'q1', m: 'q0', A: 'q2' },
        q2: { b: 'q1', m: 'q0', A: 'q0' },
      },
    },
    bonus: true,
    falas: { incompleto: 'Quase, querido. O final é bagas na brasa.', erro: 'Isso nem é vermelho!', novo: 'Escarlate como meu cabelo!' },
    layout: { q0: [40, 86], q1: [120, 44], q2: [200, 86] },
    exemplos: { aceitas: ['bA', 'mbA', 'bAbA', 'AbbA'], rejeitadas: ['b', 'bAm', 'bAA', 'Ab'] },
  },
  {
    id: 'formigas',
    nome: 'Colônia Binária',
    cliente: 'Mestre das Formigas',
    oficio: 'Mestre',
    // as cores do Borin, com barba curta e sem picareta
    visual: { cabelo: '#f0f0e8', pele: '#f0c8a0', barba: 'curta', roupa: '#7a6a5a' },
    fala: 'Minhas formigas contam em binário: baga é 1, mel é 0. O número tem que ser divisível por 3. Fermente, e prove que pensa como uma colônia.',
    conceito: 'Divisibilidade por 3 (binário)',
    // r0/r1/r2 = resto do número lido até agora; cada dígito d leva r a (2r + d) mod 3
    afd: {
      estados: ['q0', 'r0', 'r1', 'r2', 'qF'],
      inicial: 'q0',
      finais: ['qF'],
      delta: {
        q0: { m: 'r0', b: 'r1' },
        r0: { m: 'r0', b: 'r1', F: 'qF' },
        r1: { m: 'r2', b: 'r0' },
        r2: { m: 'r1', b: 'r2' },
      },
    },
    bonus: true,
    chefe: true,
    falas: { incompleto: 'Sobrou resto! A colônia não aceita.', erro: 'Formiga não lê isso. Só baga, mel e fermento.', novo: 'A colônia aprova. Você conta como nós.' },
    layout: { qF: [36, 30], q0: [36, 100], r0: [100, 44], r1: [156, 100], r2: [212, 44] },
    exemplos: { aceitas: ['bbF', 'bbmF', 'bmmbF', 'mF', 'bbbbF'], rejeitadas: ['bF', 'bmF', 'bmbF', 'bb'] },
  },
]
