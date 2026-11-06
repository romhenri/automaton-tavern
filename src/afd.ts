export type AFD = {
  estados: string[]
  inicial: string
  finais: string[]
  delta: Record<string, Record<string, string>> // ausente = qx
}

export const ERRO = 'qx'

/** δ*(q0, w): a trilha alimenta o grafo e o tipo de reclamação do anão. */
export function executar(afd: AFD, cadeia: string[]) {
  const trilha = [afd.inicial]
  for (const s of cadeia) trilha.push(afd.delta[trilha.at(-1)!]?.[s] ?? ERRO)
  const final = trilha.at(-1)!
  return { aceita: afd.finais.includes(final), final, trilha }
}

/** Troca F por Q \ F. Só funciona porque qx existe: ele vira final. */
export function complemento(afd: AFD): AFD {
  const estados = [...afd.estados, ERRO]
  return { ...afd, estados, finais: estados.filter((q) => !afd.finais.includes(q)) }
}
