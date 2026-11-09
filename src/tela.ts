/** Resolução base 320x180 em dobro (640x360). */
export const LARGURA = 640
export const ALTURA = 360

/**
 * Quanto escalar o palco para caber na janela w x h. No desktop a escala é inteira (pixel nítido);
 * no celular é fracionária para ocupar a tela, e em pé o palco gira 90° para jogar deitado.
 */
export function enquadra(w: number, h: number, toque: boolean) {
  const giro = toque && h > w
  if (giro) [w, h] = [h, w]
  const k = Math.min(w / LARGURA, h / ALTURA)
  return { escala: k >= 1 && !toque ? Math.floor(k) : k, giro }
}
