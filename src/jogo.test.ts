import { describe, expect, it } from 'vitest'
import { BONUS, MOEDAS, novoTurno, servir } from './jogo.ts'
import { RECEITAS } from './receitas.ts'

const [hidromel, , , licor] = RECEITAS
const w = (s: string) => [...s]

describe('servir', () => {
  it('classifica cada drink pela trilha', () => {
    const t = novoTurno(hidromel)
    expect(servir(t, w('mB'))).toBe('novo')
    expect(servir(t, w('mB'))).toBe('repetido')
    expect(servir(t, w('m'))).toBe('incompleto')
    expect(servir(t, w('B'))).toBe('erro')
    expect(t.servidos.map((d) => d.cadeia)).toEqual(['mB'])
    expect(t.rejeitados).toBe(2)
    expect(t.moedas).toBe(MOEDAS)
  })

  it('3 aceitos e distintos: anão sai satisfeito, com bônus se cada um usar arestas diferentes', () => {
    const t = novoTurno(licor)
    for (const d of ['tB', 'bbB', 'btbB']) servir(t, w(d))
    expect(t.fim).toBe('satisfeito')
    expect(t.moedas).toBe(3 * MOEDAS + BONUS)
  })

  it('sem bônus quando só repetem um laço mais vezes', () => {
    const t = novoTurno(hidromel)
    for (const d of ['mB', 'mmB', 'mmmB']) servir(t, w(d))
    expect(t.fim).toBe('satisfeito')
    expect(t.moedas).toBe(3 * MOEDAS)
  })

  it('3 rejeitados: anão vai embora bravo, repetido não gasta paciência', () => {
    const t = novoTurno(hidromel)
    servir(t, w('mB'))
    servir(t, w('mB'))
    for (const d of ['B', 'm']) servir(t, w(d))
    expect(t.fim).toBeNull()
    servir(t, w('c'))
    expect(t.fim).toBe('bravo')
  })
})
