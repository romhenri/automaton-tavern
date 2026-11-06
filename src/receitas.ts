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
]
