import { ERRO } from './afd.ts'
import type { Receita } from './receitas.ts'

const RAIO = 14

/** Quadro da receita: estados nas posições do layout, arestas agrupadas por par (de, para). */
export function grafo(r: Receita, trilha: string[]) {
  const { afd, layout } = r
  const atual = trilha.at(-1)
  const usada = trilha.length > 1 ? `${trilha.at(-2)}>${atual}` : ''
  const arestas = new Map<string, string[]>()
  const liga = (de: string, para: string, s: string) => {
    const k = `${de}>${para}`
    arestas.set(k, [...(arestas.get(k) ?? []), s])
  }
  for (const [de, ts] of Object.entries(afd.delta)) for (const [s, para] of Object.entries(ts)) liga(de, para, s)
  if (r.mostrarErro) {
    // estado sem transição nenhuma manda tudo para qx: Σ, não "outros"
    for (const q of afd.estados) if (q !== ERRO) liga(q, ERRO, afd.delta[q] ? 'outros' : 'Σ')
    liga(ERRO, ERRO, 'Σ')
  }

  let out = ''
  for (const [k, simbolos] of arestas) {
    const [de, para] = k.split('>')
    const [x1, y1] = layout[de]
    const [x2, y2] = layout[para]
    const cls = `aresta${k === usada ? ' usada' : ''}${para === ERRO ? ' erro' : ''}`
    const rotulo = simbolos.join(',')
    if (de === para) {
      const d = y1 > 65 ? 1 : -1 // laço para fora do quadro
      out += `<g class="${cls}"><path d="M${x1 - 7} ${y1 + d * 12} C${x1 - 16} ${y1 + d * 38} ${x1 + 16} ${y1 + d * 38} ${x1 + 7} ${y1 + d * 12}"/>`
      out += `<text x="${x1}" y="${y1 + d * 43}">${rotulo}</text></g>`
      continue
    }
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy)
    const ux = dx / len, uy = dy / len
    // ida e volta entre o mesmo par: curva para o lado, senão reta
    const curva = arestas.has(`${para}>${de}`) ? 14 : 0
    const mx = (x1 + x2) / 2 + uy * curva, my = (y1 + y2) / 2 - ux * curva
    const ax = x1 + ux * RAIO, ay = y1 + uy * RAIO, bx = x2 - ux * (RAIO + 2), by = y2 - uy * (RAIO + 2)
    // o meio da curva fica na metade do caminho até o ponto de controle
    const off = curva / 2 + 10
    const lx = (x1 + x2) / 2 + uy * off, ly = (y1 + y2) / 2 - ux * off
    out += `<g class="${cls}"><path d="M${ax} ${ay} Q${mx} ${my} ${bx} ${by}"/><text x="${lx}" y="${ly}">${rotulo}</text></g>`
  }

  const [ix, iy] = layout[afd.inicial]
  out += `<path class="aresta inicial" d="M${ix - RAIO - 18} ${iy} L${ix - RAIO - 2} ${iy}"/>`
  for (const q of afd.estados) {
    if (q === ERRO && !r.mostrarErro) continue
    const [x, y] = layout[q]
    const fin = afd.finais.includes(q)
    out += `<g class="estado${q === atual ? ' atual' : ''}${fin ? ' final' : ''}${q === ERRO ? ' erro' : ''}">`
    out += `<circle cx="${x}" cy="${y}" r="${RAIO}"/>${fin ? `<circle cx="${x}" cy="${y}" r="${RAIO - 3}"/>` : ''}`
    out += `<text x="${x}" y="${y}">${q.replace(/^q/, '')}</text></g>`
  }
  return `<svg class="grafo" viewBox="0 -10 240 150" role="img" aria-label="Grafo da receita ${r.nome}">
    <defs><marker id="seta" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
    <path d="M0 0 L6 3 L0 6 z" fill="context-stroke"/></marker></defs>${out}</svg>`
}
