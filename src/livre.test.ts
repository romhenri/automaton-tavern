import { expect, it } from 'vitest'
import { EXTRAS, FALAS, INICIO, LOCAL, MAPA, andavel } from './livre.ts'
import { ALFABETO, RECEITAS } from './receitas.ts'

it('todo anão está num piso livre, alcançável a partir da taverna', () => {
  expect(MAPA.every((l) => l.length === MAPA[0].length)).toBe(true)
  const lugares = [
    ...RECEITAS.map((r) => LOCAL[r.id]),
    ...EXTRAS.flatMap((e) => Array.from({ length: e.s * e.s }, (_, k): [number, number] => [e.x + (k % e.s), e.y + Math.floor(k / e.s)])),
  ]
  const ocupado = new Set(lugares.map(String))
  lugares.forEach(([x, y]) => expect(andavel(x, y)).toBe(true))
  // BFS desviando dos outros anões, como no jogo
  const visto = new Set([String(INICIO)])
  const fila = [INICIO]
  for (const [x, y] of fila)
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const p: [number, number] = [x + dx, y + dy]
      if (andavel(...p) && !ocupado.has(String(p)) && !visto.has(String(p))) visto.add(String(p)), fila.push(p)
    }
  // bichos (P, G) ficam presos nos cercados: a taverna não chega neles
  MAPA.forEach((l, y) => [...l].forEach((ch, x) => 'PGh'.includes(ch) && expect(visto.has(String([x, y]))).toBe(false)))
  for (const [x, y] of lugares) expect([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => visto.has(String([x + dx, y + dy])))).toBe(true)
})

it('pela fortaleza cada anão tem fala própria, sem drink nem ingrediente', () => {
  // nomes inteiros de receita, ingredientes (e plural) e palavras de bebida, sempre como palavra inteira
  const ingredientes = ALFABETO.filter((a) => !a.acao).flatMap((a) => [a.nome, a.nome.replace(/s$/, '')])
  const bebida = ['drink', 'bebida', 'beber', 'caneca', 'gole', 'cerveja', 'hidromel', 'licor', 'grogue', 'taça']
  const proibidas = [...RECEITAS.map((r) => r.nome), ...ingredientes, ...bebida].map((w) => w.toLowerCase())
  const tem = (frase: string, w: string) => new RegExp(`(^|[^a-zà-ú])${w}([^a-zà-ú]|$)`).test(frase)
  for (const r of RECEITAS) {
    expect(FALAS[r.id], r.id).toBeTruthy()
    expect(FALAS[r.id]).not.toBe(r.fala)
    for (const w of proibidas) expect(tem(FALAS[r.id].toLowerCase(), w), `${r.id}: ${w}`).toBe(false)
  }
})
