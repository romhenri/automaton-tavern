import { expect, it } from 'vitest'
import { ALTURA, LARGURA, enquadra } from './tela.ts'

/** Tamanho do palco na tela depois de girar e escalar. */
const naTela = (w: number, h: number, toque: boolean) => {
  const { escala, giro } = enquadra(w, h, toque)
  return giro ? [ALTURA * escala, LARGURA * escala] : [LARGURA * escala, ALTURA * escala]
}

it('o palco cabe inteiro na janela, sem corte', () => {
  const janelas = [[390, 844], [844, 390], [360, 640], [640, 360], [375, 553], [768, 1024], [1920, 1080], [1366, 768], [500, 500]]
  for (const [w, h] of janelas) for (const toque of [true, false]) {
    const [pw, ph] = naTela(w, h, toque)
    expect(pw).toBeLessThanOrEqual(w + 1e-9)
    expect(ph).toBeLessThanOrEqual(h + 1e-9)
  }
})

it('celular em pé gira e ocupa a tela; deitado não gira', () => {
  expect(enquadra(390, 844, true)).toEqual({ escala: 390 / 360, giro: true })
  expect(enquadra(844, 390, true)).toEqual({ escala: 390 / 360, giro: false })
})

it('desktop nunca gira e usa escala inteira quando cabe', () => {
  expect(enquadra(1920, 1080, false)).toEqual({ escala: 3, giro: false })
  expect(enquadra(800, 1200, false)).toEqual({ escala: 1, giro: false })
  expect(enquadra(320, 180, false).escala).toBe(0.5)
})
