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
]
