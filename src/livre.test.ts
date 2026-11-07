import { expect, it } from 'vitest'
import { EXTRAS, INICIO, LOCAL, MAPA, andavel } from './livre.ts'
import { RECEITAS } from './receitas.ts'

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
  MAPA.forEach((l, y) => [...l].forEach((ch, x) => 'PG'.includes(ch) && expect(visto.has(String([x, y]))).toBe(false)))
  for (const [x, y] of lugares) expect([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => visto.has(String([x + dx, y + dy])))).toBe(true)
})
