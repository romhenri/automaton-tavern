import { ERRO, executar } from './afd.ts'
import type { Receita } from './receitas.ts'

export const CAPACIDADE = 8
export const PACIENCIA = 3
export const DRINKS = 3
export const MOEDAS = 10
export const BONUS = 15

export type Veredito = 'novo' | 'repetido' | 'incompleto' | 'erro'
export type Turno = {
  receita: Receita
  servidos: { cadeia: string; trilha: string[] }[]
  rejeitados: number
  moedas: number
  fim: 'satisfeito' | 'bravo' | null
}

export const novoTurno = (receita: Receita): Turno => ({ receita, servidos: [], rejeitados: 0, moedas: 0, fim: null })

export function servir(t: Turno, cadeia: string[]): Veredito {
  const { aceita, final, trilha } = executar(t.receita.afd, cadeia)
  const w = cadeia.join('')
  if (!aceita) {
    if (++t.rejeitados >= PACIENCIA) t.fim = 'bravo'
    return final === ERRO ? 'erro' : 'incompleto'
  }
  if (t.servidos.some((d) => d.cadeia === w)) return 'repetido'
  t.servidos.push({ cadeia: w, trilha })
  t.moedas += MOEDAS
  if (t.servidos.length === DRINKS) {
    t.fim = 'satisfeito'
    if (new Set(t.servidos.map((d) => arestas(d.trilha))).size === DRINKS) t.moedas += BONUS
  }
  return 'novo'
}

/** Conjunto de arestas (de, para) percorridas: dar mais voltas no mesmo laço não é caminho novo. */
const arestas = (trilha: string[]) => [...new Set(trilha.slice(1).map((q, i) => `${trilha[i]}>${q}`))].sort().join()
