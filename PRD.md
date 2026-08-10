# PRD

## Produto

**Nome:** BNR Manager (rebrand de "Bola na Rede Manager"; domínio, save local e dados de jogo não mudaram, só a marca pública)
**Identidade visual:** Neo-Emerald & Gold — paleta escura com verde-esmeralda como cor primária e dourado como acento
**Plataforma atual:** Web app em React 19/Vite, publicado via Vercel, com preparação para Android via Capacitor
**Gênero:** Football manager casual, mobile-first, focado em progressão rápida e gestão acessível
**Domínio:** `bolanarede.ia.br`

## 1. Resumo Executivo

BNR Manager é um jogo de gerenciamento de futebol inspirado em managers clássicos, com foco em clubes brasileiros, progressão por temporadas e interface rápida para partidas, mercado, finanças, elenco e evolução estrutural do clube. O produto busca combinar profundidade suficiente para retenção com baixa fricção de entrada.

O jogo hoje opera em duas áreas principais dentro de uma única carreira:

- `Carreira de clube`, com Série A e Série B, calendário por rodadas, promoção/rebaixamento, mercado, finanças, staff, treino, infraestrutura, base e notícias.
- `Competições continentais`, integradas à carreira, com Copa Libertadores e Copa Sul-Americana usando a composição oficial de grupos de 2026 e elencos estrangeiros reais.

Além do loop de jogo, o produto já opera como um site público com instrumentação de aquisição e produto: analytics (GA4 + Microsoft Clarity), captura de leads por formulário embutido, e uma tela de novidades/roadmap voltada a quem ainda não é jogador ativo.

## 2. Problema

Managers de futebol costumam falhar em pelo menos um destes pontos:

- curva de aprendizado alta demais;
- sessões longas demais para mobile;
- excesso de telas burocráticas antes da recompensa;
- pouca identidade local para o público brasileiro.

BNR Manager resolve isso com:

- interface mobile-first;
- ciclo curto entre decisão e recompensa;
- clubes e contexto brasileiros, com elencos reais;
- partidas rápidas com intervenção tática durante a simulação;
- gestão simplificada, mas com camadas de progressão.

## 3. Objetivo do Produto

Entregar um manager de futebol viciante, acessível e rejogável, no qual o jogador:

- escolhe um treinador e um clube;
- administra elenco, tática, caixa e estrutura;
- disputa temporadas completas;
- busca título, promoção e longevidade;
- alterna entre decisões estratégicas e momentos de jogo;
- busca vagas continentais e disputa Libertadores/Sul-Americana dentro da mesma carreira.

## 4. Público-Alvo

### Primário

- fãs brasileiros de futebol;
- jogadores nostálgicos de Elifoot e managers leves;
- usuários mobile que querem sessões curtas de 3 a 10 minutos.

### Secundário

- jogadores casuais de simuladores esportivos;
- usuários que preferem gerenciamento simplificado em vez de simuladores ultra complexos;
- jogadores que gostam de progressão, coleção e narrativa emergente.

## 5. Proposta de Valor

- manager brasileiro com identidade local forte;
- elencos reais (base CBF/Transfermarkt para clubes nacionais, base ESPN para clubes sul-americanos) em vez de nomes genéricos;
- progressão rápida sem sacrificar estratégia;
- partidas simuladas com sensação de controle, incluindo acompanhamento ao vivo de outros jogos da rodada;
- combinação de gestão esportiva, financeira e estrutural;
- competições continentais com sorteio oficial 2026 para ampliar objetivos de temporada e rejogabilidade.

## 6. Visão do Produto

Ser o principal football manager casual brasileiro para web e mobile, com forte apelo de retenção, progressão contínua e possibilidade futura de conta em nuvem, economia expandida e conteúdo sazonal.

## 7. Princípios de Produto

- `Acessível`: o jogador deve entender o loop principal em poucos minutos.
- `Rápido`: cada tela deve levar a uma decisão útil.
- `Responsivo`: o usuário deve sentir efeito claro após treino, tática, contratação ou jogo.
- `Rejogável`: times, temporadas e competições continentais precisam sustentar múltiplas campanhas.
- `Local`: linguagem, clubes e fantasia de gestão precisam conversar com o público brasileiro.
- `Confiável em mobile`: nenhuma tela deve depender de altura de viewport fixa (`100vh`) nem travar navegação por erro de plugin/telemetria.

## 8. Escopo Atual

### 8.1 Fluxo principal

1. Landing pública com apresentação do produto, prova social e captura de lead.
2. Tela inicial do jogo com `Novo Jogo` e `Continuar`.
3. Criação de treinador.
4. Escolha de clube por divisão.
5. Entrada no dashboard.
6. Preparação de partida, com auto-ajuste de escalação em 1 clique quando há pendência.
7. Simulação da partida com ajustes táticos e acompanhamento de outros jogos da rodada.
8. Atualização de rodada, finanças, moral, classificação e notícias.
9. Ao final da temporada: modal de captura de e-mail para novidades.
10. Progressão até fim da temporada, com tela de campeão ou demissão.
11. Nova temporada com promoção, rebaixamento e recálculo de vagas continentais.

### 8.2 Modo carreira de clube

- seleção entre 40 clubes das divisões Série A e Série B, com elencos reais (CBF/Transfermarkt, julho 2026);
- calendário por rodadas;
- classificação por divisão;
- promoção e rebaixamento entre temporadas;
- gestão de elenco, com renovação de contrato;
- mercado com compra de jogadores, agentes livres e janelas de transferência;
- finanças com preço de ingresso, empréstimo e expansão de estádio;
- staff técnico (coach, physio, scout em níveis bronze/silver/gold);
- infraestrutura do clube (centro de treinamento, departamento médico, scouting);
- categorias de base com promoção de jovens;
- notícias com efeitos no jogo e decisões narrativas;
- estatísticas individuais e de times, com filtro por competição (Série A / Série B);
- saves locais em 3 slots, com autosave, exportação e importação em JSON;
- onboarding inicial com checklist de primeiros passos (tática, elenco, finanças, primeira partida), reaberto a qualquer momento pelos Ajustes;
- alternância de tema claro/escuro.

### 8.3 Competições continentais

- classificação automática via desempenho na Série A: melhores colocados para Libertadores, faixa seguinte para Sul-Americana;
- composição oficial dos grupos de 2026 (sem sorteio aleatório) na primeira disputa, com sorteio dinâmico baseado em classificação em temporadas seguintes;
- elencos estrangeiros reais (fonte ESPN), sem clubes clonados/numerados para preencher vaga;
- fase de grupos com tabela e classificação por saldo de gols;
- mata-mata de ida e volta;
- premiação por participação e avanço de fase;
- tela dedicada (`CONMEBOL`) para acompanhar grupos, chaveamento e evolução por temporada.

### 8.4 Site público, aquisição e growth

- landing page com hero, prova social, clubes em destaque, FAQ e CTA de início de carreira;
- tela `/novidades` com roadmap de features futuras, para visitantes que ainda não têm save;
- modal de captura de lead (iframe de formulário externo) ao final de temporada;
- analytics de produto: Google Analytics 4 e Microsoft Clarity instalados via CSP restrita (script liberado por hash SHA-256 sempre que possível, evitando `unsafe-inline` sem necessidade);
- funil de performance instrumentado localmente (ver seção 15).

## 9. Loops de Produto

### 9.1 Loop principal da carreira

1. Analisar elenco, moral, finanças e próximo adversário.
2. Ajustar tática, escalação e preparação.
3. Jogar ou simular a partida.
4. Receber impacto em caixa, classificação, moral e notícias.
5. Reinvestir em elenco, infraestrutura ou staff.
6. Avançar rodada.

### 9.2 Loop de meta progressão

1. Concluir temporada.
2. Registrar histórico.
3. Subir de divisão, escapar do rebaixamento ou disputar título.
4. Evoluir elenco por idade e desempenho.
5. Iniciar nova temporada mais forte ou mais pressionado.

### 9.3 Loop continental

1. Terminar bem a temporada nacional.
2. Classificar para Libertadores ou Sul-Americana.
3. Disputar grupos e mata-mata no calendário da carreira.
4. Buscar premiação, prestígio e título continental.

## 10. Funcionalidades

### 10.1 Coach setup

- definição do nome do treinador;
- escolha de estilo;
- criação de identidade do perfil.

### 10.2 Seleção de time

- escolha por divisão;
- visualização de força, finanças e contexto do clube;
- confirmação antes de iniciar campanha.

### 10.3 Dashboard

- visão geral do clube;
- próximo adversário;
- status de caixa;
- atalhos para áreas principais, incluindo `CONMEBOL`;
- navegação principal do jogo em barra inferior única, com o CTA de partida como botão elevado central e respeito à área segura do dispositivo (`safe-area-inset-bottom`).

### 10.4 Partida e pré-jogo

- tela de preparação antes da partida, com comparação entre times;
- correção automática de pendências de escalação em 1 clique;
- acesso rápido a tática e elenco;
- simulação da partida com eventos, narração e substituições;
- pausa, aceleração, mudanças de estilo e substituições em campo;
- acompanhamento de outros jogos da rodada em tempo real;
- efeito de momentum durante o jogo.

### 10.5 Elenco

- lista completa do plantel;
- visualização por jogador, com barra de desgaste;
- atributos detalhados;
- histórico do atleta;
- renovação contratual.

### 10.6 Tática

- formações;
- estilo de jogo;
- definição da escalação titular com ajuste de encaixe por posição.

### 10.7 Mercado

- visualização de jogadores de outros clubes;
- filtro de agentes livres;
- negociação de compra;
- janela de transferências por rodada;
- movimentações automáticas da IA com geração de notícias.

### 10.8 Finanças

- controle de caixa;
- definição de preço de ingresso;
- expansão de estádio;
- tomada de empréstimo.

### 10.9 Staff

- contratação e dispensa de staff;
- perfis de coach, physio e scout;
- níveis bronze, silver e gold;
- bônus associados por especialidade.

### 10.10 Infraestrutura

- evolução de centro de treinamento;
- evolução de departamento médico;
- evolução de scouting;
- custo progressivo por melhoria.

### 10.11 Base

- gestão da categoria de base;
- promoção de jovens ao profissional.

### 10.12 Notícias e decisões

- eventos de moral, mercado, finanças e diretoria;
- notícias com impacto narrativo;
- decisões com consequência.

### 10.13 Estatísticas

- artilharia e assistências, com filtro por competição (Série A / Série B);
- ranking geral de clubes;
- acompanhamento por temporada.

### 10.14 Competições continentais

- ver seção 8.3.

### 10.15 Ajustes

- alternância entre tema `Cinematic Dark` (padrão) e `Off-White Light`;
- gestão de saves locais;
- botão para reativar o guia/tutorial de onboarding a qualquer momento;
- (cloud save/login ainda não conectados — ver seção 15).

### 10.16 Saves

- autosave local;
- 3 slots manuais;
- exportação e importação em JSON.

### 10.17 Aquisição e retenção externa

- landing pública com prova social e CTA de carreira;
- tela `/novidades` com roadmap público;
- modal de captura de e-mail ao fim de temporada;
- GA4 + Microsoft Clarity para análise de comportamento.

## 11. Regras de Negócio Atuais

- o jogo começa em `2026`;
- o usuário inicia com `R$ 1.200.000`;
- janelas de transferências ocorrem nas rodadas `1-5` e `10-14`;
- ao fim de cada rodada, o caixa é afetado por receita e salários;
- o treinador recebe salário acumulado por jogo;
- se o caixa cair abaixo de `-R$ 500.000`, ocorre demissão;
- ao fim da temporada, os `4 últimos` da Série A caem;
- os `4 primeiros` da Série B sobem;
- jogadores envelhecem e podem evoluir ou regredir entre temporadas;
- moral e estatísticas são reiniciadas na nova temporada;
- competições continentais avançam por grupos e mata-mata até a final;
- nenhum clube disputa Libertadores e Sul-Americana na mesma temporada.

## 12. Experiência do Usuário

### 12.1 Norte de UX

- linguagem simples;
- decisões rápidas;
- forte hierarquia visual;
- foco em telas densas, mas legíveis em mobile;
- feedback imediato via animações, cards, haptics (com fallback silencioso quando o navegador não suporta) e toasts.

### 12.2 Sensações desejadas

- "estou no controle";
- "cada rodada importa";
- "meu clube está evoluindo";
- "minhas decisões geraram consequência".

### 12.3 Padrões de mobile obrigatórios

- altura de tela via `dvh` (dynamic viewport height), nunca `vh` fixo, para que rodapés fixos não fiquem inacessíveis atrás da barra de endereço do navegador;
- `padding-bottom` de área segura (`pb-safe`) em qualquer rodapé fixo, para não invadir a zona de gesto do iOS;
- nomes de jogador/clube sempre com `truncate`/`line-clamp` em containers estreitos — elencos reais têm nomes mais longos que os antigos nomes gerados;
- chamadas de haptics nunca devem lançar exceção não tratada (navegadores sem Vibration API, como o Safari iOS, devem falhar silenciosamente).

## 13. Stack Técnico

- **Frontend:** React 19 + TypeScript + Vite 5, Tailwind CSS v4, Framer Motion, `react-hot-toast`, `lucide-react`.
- **Empacotamento mobile:** Capacitor 6 (Android configurado via `capacitor.config.ts`; iOS não configurado).
- **Persistência:** `localStorage` (3 slots + export/import JSON); Supabase (`@supabase/supabase-js`) presente no projeto mas não conectado à UI.
- **Testes:** Vitest, cobrindo o motor de temporada e competições continentais.
- **Deploy:** Vercel, com rewrite SPA e headers de segurança (CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- **Analytics:** Google Analytics 4 (`gtag.js`), Microsoft Clarity, funil de performance próprio em `localStorage` (`performanceMetrics.ts`).

## 14. Analytics & Growth

- **GA4**: instalado via `gtag.js` no `index.html`.
- **Microsoft Clarity**: heatmaps e gravação de sessão, script liberado na CSP por hash SHA-256 dedicado.
- **Funil de performance interno** (`performanceMetrics.ts`, armazenado em `localStorage`, sem servidor): `app_opened → landing_viewed → start_clicked/continue_clicked → play_loaded → career_started → coach_created → team_selected → dashboard_reached → prematch_opened → first_match_started`, com tempo decorrido entre marcos.
- **Captura de lead**: modal com iframe de formulário externo (`formularios.ia.br`), disparado ao fim de temporada; requer `frame-src` liberado na CSP.
- **Nota de segurança**: o script inline do GA4 exigiu `'unsafe-inline'` em `script-src` na CSP. Isso reduz a proteção que o hash SHA-256 do Clarity oferece isoladamente — qualquer script inline passa a poder executar. Se a postura de segurança da CSP for prioridade, o snippet do GA4 pode ser hasheado da mesma forma, permitindo remover `'unsafe-inline'`.

## 15. Restrições e Lacunas do Estado Atual

Este documento separa claramente o que o produto quer ser e o que já está implementado. Hoje, as principais lacunas observadas são:

- **cloud save não conectado**: `supabaseClient.ts` tem `saveToCloud`/`loadFromCloud`/`testSupabaseConnection` funcionais, mas a `SettingsScreen` não referencia sessão nem Supabase — o fluxo de jogo é 100% local. Isso é uma decisão consciente registrada no `WEB_LAUNCH_SMOKE_CHECKLIST.md` ("confirmar que Ajustes não promete sincronização por conta"), não um bug pendente de correção silenciosa;
- mercado ainda está incompleto em partes importantes: ofertas recebidas, venda ativa, empréstimos, logs reais de transferências do usuário;
- não há testes automatizados para o simulador de partida em si (`matchProcessor.ts` tem cobertura indireta via `adaptationEngine.test.ts`, mas não cobertura de ponta a ponta de uma partida simulada);
- não há iOS configurado no Capacitor, apenas Android;
- o mesmo hash de CSP usado para o Clarity precisa ser recalculado manualmente sempre que o conteúdo do script inline mudar — não há automação para isso no pipeline de build;
- o rebrand para `BNR Manager` ainda não se propagou para todos os documentos internos: `README.md`, `LANDING_COPY.md` e o item de marca em `RELEASE_CHECKLIST.md` continuam citando "Bola na Rede Manager".

## 16. Roadmap Recomendado

### Fase 1: Consolidar o core atual

- fechar lacunas do mercado (ofertas recebidas, venda ativa, empréstimos, logs reais);
- expandir cobertura de testes automatizados para o simulador de partida;
- avaliar se cloud save entra nesta fase ou permanece adiado por decisão de produto.

### Fase 2: Aumentar retenção

- objetivos de diretoria por temporada;
- conquistas e marcos do treinador;
- histórico expandido de clube e jogador;
- mais eventos narrativos;
- economia mais profunda.

### Fase 3: Monetização e conta

- conta persistente em nuvem;
- cross-device sync;
- customização cosmética;
- passes sazonais ou conteúdo premium não pay-to-win.

### Fase 4: Conteúdo expandido

- ligas europeias (já anunciado como "em breve" na captura de lead);
- staff com efeitos sistêmicos mais profundos;
- scouting internacional;
- lesões e recuperação mais sofisticadas;
- rivalidades, expectativas de torcida e objetivos da diretoria;
- empacotamento iOS via Capacitor.

## 17. Não Objetivos no Curto Prazo

- simulação ultra realista nível Football Manager;
- multiplayer online;
- economia pay-to-win;
- complexidade tática excessiva;
- dependência de backend pesado para o loop principal offline.

## 18. Posicionamento

BNR Manager deve ocupar o espaço entre:

- a nostalgia e rapidez de managers clássicos;
- a identidade brasileira do futebol local;
- a conveniência de uma experiência pensada para mobile.

Em uma frase:

> Um manager de futebol brasileiro, rápido e viciante, onde cada rodada entrega decisão, consequência e progressão — da Série B à Libertadores.
