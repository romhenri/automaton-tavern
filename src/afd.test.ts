import { describe, expect, it } from 'vitest'
import { ERRO, complemento, executar, type AFD } from './afd.ts'
import { CAPACIDADE, DRINKS } from './jogo.ts'
import { RECEITAS } from './receitas.ts'

const hidromel: AFD = { estados: ['q0', 'q1', 'q2'], inicial: 'q0', finais: ['q2'], delta: { q0: { m: 'q1' }, q1: { m: 'q1', B: 'q2' } } }

describe('executar', () => {
  it('segue a trilha até um estado final', () => {
    expect(executar(hidromel, [...'mmB'])).toEqual({ aceita: true, final: 'q2', trilha: ['q0', 'q1', 'q1', 'q2'] })
  })
  it('transição ausente cai em qx e fica lá', () => {
    expect(executar(hidromel, [...'BmB'])).toMatchObject({ aceita: false, final: 'qx', trilha: ['q0', 'qx', 'qx', 'qx'] })
  })
  it('para em estado não final', () => {
    expect(executar(hidromel, ['m'])).toMatchObject({ aceita: false, final: 'q1' })
  })
})

describe('complemento', () => {
  const contra = complemento(hidromel)
  it('aceita o que o original rejeita, inclusive quem cai em qx', () => {
    for (const w of ['B', 'm', 'mBm', 'c']) expect(executar(contra, [...w]).aceita).toBe(true)
  })
  it('rejeita o que o original aceita', () => {
    for (const w of ['mB', 'mmmB']) expect(executar(contra, [...w]).aceita).toBe(false)
  })
})

describe.each(RECEITAS.map((r) => [r.nome, r] as const))('%s', (_, r) => {
  it.each(r.exemplos.aceitas)('aceita %s', (w) => expect(executar(r.afd, [...w]).aceita).toBe(true))
  it.each(r.exemplos.rejeitadas)('rejeita %s', (w) => expect(executar(r.afd, [...w]).aceita).toBe(false))
  it('tem posição no quadro para todo estado', () => {
    for (const q of r.afd.estados) expect(r.layout[q]).toBeDefined()
  })
})

describe('receitas', () => {
  it.each(RECEITAS.map((r) => [r.nome, r] as const))('%s dá para terminar com drinks distintos que cabem na caneca', (_, r) => {
    const ok = new Set(r.exemplos.aceitas.filter((w) => w.length <= CAPACIDADE))
    expect(ok.size).toBeGreaterThanOrEqual(DRINKS)
  })

  it('o AFD da Gabi é mínimo: nenhum par de estados é equivalente', () => {
    const { afd } = RECEITAS.find((r) => r.cliente === 'Gabi dos Teclados')!
    const estados = [...afd.estados, ERRO]
    const sigma = 'tbgcmBMAF'
    const passo = (q: string, s: string) => afd.delta[q]?.[s] ?? ERRO
    // Moore: refina a partição final/não final até estabilizar
    let classe = new Map(estados.map((q) => [q, afd.finais.includes(q) ? 'F' : 'N']))
    for (;;) {
      const nova = new Map(estados.map((q) => [q, classe.get(q) + [...sigma].map((s) => classe.get(passo(q, s))).join()]))
      if (new Set(nova.values()).size === new Set(classe.values()).size) break
      classe = nova
    }
    expect(new Set(classe.values()).size).toBe(estados.length)
  })

  it('Rômulo fica fixo na fase 12, Lari na 8 e Barios na 11', () => {
    expect(RECEITAS[11].cliente).toBe('Rômulo, o Comprido')
    expect(RECEITAS[7].cliente).toBe('Lari Nobre')
    expect(RECEITAS[10].cliente).toBe('Barios')
  })

  it('o Mestre das Formigas é o chefe final: última fase', () => {
    expect(RECEITAS.at(-1)!.cliente).toBe('Mestre das Formigas')
    expect(RECEITAS.filter((r) => r.chefe)).toHaveLength(1)
  })

  it('Gabi dos Teclados tem mais estados que qualquer outro anão', () => {
    const gabi = RECEITAS.find((r) => r.cliente === 'Gabi dos Teclados')!
    for (const r of RECEITAS) if (r !== gabi) expect(gabi.afd.estados.length).toBeGreaterThan(r.afd.estados.length)
  })
})
