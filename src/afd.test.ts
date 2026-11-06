import { describe, expect, it } from 'vitest'
import { complemento, executar, type AFD } from './afd.ts'
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
