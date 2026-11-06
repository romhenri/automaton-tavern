import './style.css'
import { ERRO, executar } from './afd.ts'
import { grafo } from './grafo.ts'
import { CAPACIDADE, DRINKS, PACIENCIA, novoTurno, servir, type Turno, type Veredito } from './jogo.ts'
import { ALFABETO, RECEITAS } from './receitas.ts'
import { BARRIL, canecaSprite, dwarfSprite, icone, svg, type Expressao } from './sprites.ts'

const REACAO: Record<Veredito, { fala: string; cara: Expressao; anim: string }> = {
  novo: { fala: '*glub glub* Ahh! Isso sim!', cara: 'feliz', anim: 'bebe' },
  repetido: { fala: 'Já bebi esse, quero outro!', cara: 'neutro', anim: '' },
  incompleto: { fala: 'Tá faltando coisa aí, rapaz!', cara: 'bravo', anim: 'treme' },
  erro: { fala: 'Isso é mijo de elfo! *ptui*', cara: 'bravo', anim: 'cospe' },
}

const palco = document.querySelector<HTMLElement>('#palco')!
let nivel = 0
let moedas = 0
let reputacao = 0
let turno: Turno
let cadeia: string[] = []

const $ = <T extends HTMLElement>(sel: string) => palco.querySelector<T>(sel)!
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)

// Resolução base 320x180 em dobro (640x360), escalada por inteiro.
function escala() {
  const k = Math.min(innerWidth / 640, innerHeight / 360)
  document.documentElement.style.setProperty('--escala', String(k >= 1 ? Math.floor(k) : k))
}
addEventListener('resize', escala)
escala()

// ---------------------------------------------------------------- telas

function titulo() {
  palco.className = 'tela-titulo'
  palco.innerHTML = `
    <div class="titulo">
      <div class="logo">${svg(BARRIL, 48)}<h1>Taverna<br><b>do Autômato</b></h1>${svg(BARRIL, 48)}</div>
      <p class="muted">Cada receita é um AFD. Cada drink, uma cadeia.</p>
      <div class="linha">
        <button class="btn btn-gold" data-ir="jogar">Jogar</button>
        <button class="btn" data-ir="ajuda">Como jogar</button>
      </div>
      <p class="muted small">Moedas ☼${moedas} · Reputação ${reputacao}</p>
    </div>`
}

function ajuda() {
  palco.className = 'tela-ajuda'
  palco.innerHTML = `
    <div class="painel ajuda">
      <h2 class="painel-titulo">Como jogar</h2>
      <p>Cada anão pede um drink. A <b>receita</b> aparece no quadro como um grafo.
      Clique nos ingredientes e ações (ou digite a letra) para montar o drink na caneca e aperte <b>Servir</b>.
      Sirva <b>${DRINKS} drinks diferentes</b> aceitos. Ele tolera ${PACIENCIA} drinks ruins.</p>
      <dl>
        <dt>Estado</dt><dd>Etapa do preparo, um círculo no quadro. O atual acende.</dd>
        <dt>Transição δ(q, a)</dt><dd>Seta rotulada: com o ingrediente <i>a</i> na etapa <i>q</i>, vá para onde a seta aponta.</dd>
        <dt>Estado final</dt><dd>Borda dupla: o drink está pronto para servir.</dd>
        <dt>Estado de erro qx</dt><dd>Toda seta não desenhada leva a ele. Drink estragado, sem volta.</dd>
        <dt>Cadeia</dt><dd>A sequência de símbolos na caneca. Minúsculas são ingredientes, maiúsculas são ações.</dd>
      </dl>
      <p class="muted small">Teclado: letras montam, Backspace desfaz, Esc esvazia, Enter serve.</p>
      <button class="btn btn-gold" data-ir="titulo">Voltar</button>
    </div>`
}

function jogo() {
  const r = RECEITAS[nivel]
  turno = novoTurno(r)
  cadeia = []
  const botao = (a: (typeof ALFABETO)[number]) =>
    `<button class="btn simbolo" data-s="${a.s}" title="${esc(`${a.nome}: ${a.sabor}`)}">${svg(icone(a.s), 32)}<span><kbd>${a.s}</kbd> ${a.nome.split(" ")[0]}</span></button>`
  palco.className = 'tela-jogo'
  palco.innerHTML = `
    <section class="quadro" aria-label="Quadro da receita">
      <h2>${r.nome} <small>nível ${nivel + 1}${r.bonus ? ' (bônus)' : ''} · ${r.conceito}</small></h2>
      <div id="grafo"></div>
    </section>
    <section class="cliente" aria-live="polite">
      <div class="prateleira">${svg(BARRIL, 32)}${svg(BARRIL, 32)}${svg(BARRIL, 32)}</div>
      <div id="anao"></div>
      <div class="balao" id="fala"></div>
      <p class="nome">${r.cliente}</p>
      <p id="status"></p>
    </section>
    <section class="mesa">
      <div id="caneca"></div>
      <div id="slots" class="slots" aria-label="Caneca"></div>
      <p id="estado"></p>
      <div id="historico" class="historico" aria-label="Drinks servidos"></div>
    </section>
    <section class="balcao">
      <div class="grupo">${ALFABETO.filter((a) => !a.acao).map(botao).join('')}</div>
      <div class="grupo acoes">${ALFABETO.filter((a) => a.acao).map(botao).join('')}</div>
      <div class="linha">
        <button class="btn" data-cmd="desfazer">Desfazer</button>
        <button class="btn" data-cmd="esvaziar">Esvaziar</button>
        <button class="btn btn-gold" data-cmd="servir">Servir</button>
      </div>
    </section>`
  anao('neutro', r.fala)
  atualiza()
}

function fimTurno() {
  const ok = turno.fim === 'satisfeito'
  reputacao += ok ? 1 : -1
  moedas += turno.moedas
  const ultimo = nivel === RECEITAS.length - 1
  const div = document.createElement('div')
  div.className = 'cortina'
  div.innerHTML = `
    <div class="painel resumo">
      <h2 class="painel-titulo">${ok ? 'Cliente satisfeito!' : 'Cliente foi embora bravo!'}</h2>
      ${svg(dwarfSprite(turno.receita.cliente, turno.receita.oficio, ok ? 'feliz' : 'bravo'), 96)}
      <p>"${ok ? 'Que taverna! Volto amanhã.' : 'Chega! Vou beber com os elfos!'}"</p>
      <p>Moedas no turno: <b class="ouro">☼${turno.moedas}</b> · Total: <b class="ouro">☼${moedas}</b></p>
      <p>Reputação: <b class="${ok ? 'verde' : 'vermelho'}">${reputacao} (${ok ? '+1' : '-1'})</b></p>
      <button class="btn btn-gold" data-ir="${ultimo ? 'fim' : 'proximo'}">${ultimo ? 'Fechar a taverna' : 'Próximo cliente'}</button>
    </div>`
  palco.append(div)
  div.querySelector<HTMLElement>('button')!.focus()
}

function fim() {
  palco.className = 'tela-titulo'
  palco.innerHTML = `
    <div class="titulo">
      <h1>Fim de expediente</h1>
      <p>Você serviu todos os clientes da noite.</p>
      <p>Moedas <b class="ouro">☼${moedas}</b> · Reputação <b>${reputacao}</b></p>
      <button class="btn btn-gold" data-ir="titulo">Voltar ao início</button>
    </div>`
  nivel = 0
}

// ---------------------------------------------------------------- jogo

function anao(expr: Expressao, fala: string, anim = '') {
  $('#anao').innerHTML = svg(dwarfSprite(turno.receita.cliente, turno.receita.oficio, expr), 96, anim)
  $('#fala').textContent = fala
}

function atualiza() {
  const r = turno.receita
  const { trilha, final, aceita } = executar(r.afd, cadeia)
  $('#grafo').innerHTML = grafo(r, trilha)
  const estragada = final === ERRO && !r.mostrarErro
  $('#caneca').innerHTML = svg(canecaSprite(cadeia.length === 0 ? 'vazia' : estragada ? 'estragada' : 'cheia'), 64, estragada ? 'fumega' : 'borbulha')
  $('#slots').innerHTML = Array.from({ length: CAPACIDADE }, (_, i) =>
    cadeia[i] ? `<span class="slot cheio" title="${cadeia[i]}">${svg(icone(cadeia[i]), 24)}</span>` : '<span class="slot"></span>').join('')
  $('#estado').innerHTML = `Estado: <b class="${aceita ? 'verde' : final === ERRO ? 'vermelho' : ''}">${final}${aceita ? ' ✔' : ''}</b>`
  $('#historico').innerHTML = Array.from({ length: DRINKS }, (_, i) =>
    turno.servidos[i] ? `<span class="servido">${turno.servidos[i].cadeia} ✔</span>` : '<span class="servido vazio">?</span>').join('')
  $('#status').innerHTML = `Paciência ${'<span class="coracao">♥</span>'.repeat(PACIENCIA - turno.rejeitados)}${'<span class="coracao perdido">♥</span>'.repeat(turno.rejeitados)} · <span class="ouro">☼${moedas + turno.moedas}</span>`
  palco.querySelectorAll<HTMLButtonElement>('[data-s]').forEach((b) => (b.disabled = cadeia.length >= CAPACIDADE))
  $<HTMLButtonElement>('[data-cmd=servir]').disabled = cadeia.length === 0
}

function comando(cmd: string) {
  if (turno.fim) return
  if (cmd === 'desfazer') cadeia.pop()
  else if (cmd === 'esvaziar') cadeia = []
  else if (cmd === 'servir' && cadeia.length) {
    const v = servir(turno, cadeia)
    const { fala, cara, anim } = REACAO[v]
    anao(cara, turno.receita.falas?.[v] ?? fala, anim)
    cadeia = []
    if (turno.fim) setTimeout(fimTurno, 900)
  } else if (ALFABETO.some((a) => a.s === cmd) && cadeia.length < CAPACIDADE) cadeia.push(cmd)
  atualiza()
}

const TELAS: Record<string, () => void> = { jogar: jogo, ajuda, titulo, fim, proximo: () => (nivel++, jogo()) }

palco.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-s],[data-cmd],[data-ir]')
  if (!el) return
  if (el.dataset.s) comando(el.dataset.s)
  else if (el.dataset.cmd) comando(el.dataset.cmd)
  else TELAS[el.dataset.ir!]?.()
})

const TECLA: Record<string, string> = { Backspace: 'desfazer', Escape: 'esvaziar', Enter: 'servir' }
const COMANDOS = { desfazer: 1, esvaziar: 1, servir: 1 }

addEventListener('keydown', (e) => {
  if (palco.className !== 'tela-jogo' || e.ctrlKey || e.metaKey || e.altKey) return
  const cmd = TECLA[e.key] ?? e.key
  if (document.activeElement?.closest('.cortina')) return // Enter no resumo aperta o botão dele
  if (cmd in COMANDOS || ALFABETO.some((a) => a.s === cmd)) {
    e.preventDefault()
    comando(cmd)
  }
})

titulo()
