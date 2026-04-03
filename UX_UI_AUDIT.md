# UX/UI Audit

Projeto: `bolanarede-manager`

Data: `2026-04-03`

Escopo:
- landing pública
- launcher/home interna
- onboarding e seleção inicial
- dashboard
- telas densas de gestão e partida
- padrões visuais e consistência do design system

## Resumo Executivo

O projeto tem identidade visual forte, personalidade própria e uma direção de produto clara. A landing comunica bem o conceito, o app interno já tem cara de jogo mobile-first e os fluxos principais melhoraram com a priorização do save local.

O principal problema não é falta de qualidade visual. O principal problema é falta de coerência sistêmica entre telas. Cada área resolve UX de forma local, então a experiência geral fica boa em momentos isolados, mas irregular como produto.

Avaliação geral:

- Direção visual: `8/10`
- Clareza dos fluxos principais: `6.5/10`
- Consistência entre telas: `5.5/10`
- Hierarquia de informação: `6/10`
- Acessibilidade e legibilidade: `4.5/10`
- Maturidade do design system: `6/10`

## O Que Já Está Forte

- A landing tem boa narrativa, boa hierarquia e CTAs claros.
- O fluxo offline-first ficou mais coerente com o momento do produto.
- A home interna do jogo é simples e objetiva.
- O onboarding inicial em etapas reduz fricção.
- O dashboard tem energia visual e sensação de produto premium.
- Existe base de design system com tokens, safe areas, animações e padrões reutilizáveis.

## Achados Principais

### 1. Falta coerência entre as camadas do produto

Hoje existem três linguagens de UX convivendo:

- landing editorial e premium
- launcher/app shell enxuto
- telas internas com padrão denso baseado em cards

As três funcionam separadamente, mas a costura entre elas ainda não é consistente.

Evidência:
- [App.tsx](/Users/diegomachado/bolanarede-manager00/App.tsx)
- [screens/SplashScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/SplashScreen.tsx#L169)
- [screens/GameHomeScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/GameHomeScreen.tsx#L14)
- [screens/DashboardScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/DashboardScreen.tsx#L87)

Impacto:
- percepção de produto fragmentado
- curva de adaptação maior entre contextos
- menor previsibilidade de navegação e ação

### 2. A hierarquia de ação muda demais por tela

Algumas telas têm CTA evidente. Outras colocam várias ações competindo ao mesmo tempo. Isso aumenta carga cognitiva.

Evidência:
- CTA bem resolvido na home interna: [screens/GameHomeScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/GameHomeScreen.tsx#L35)
- dashboard com muitas ações simultâneas: [screens/DashboardScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/DashboardScreen.tsx#L124)
- mercado com tabs, busca, filtro e negociação no mesmo nível: [screens/MarketScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/MarketScreen.tsx#L97)

Impacto:
- decisões mais lentas
- telas “bonitas porém pesadas”
- jogador sem clareza sobre o que fazer primeiro

### 3. O design system existe, mas não governa as telas

Há tokens e uma direção visual definidos, mas a aplicação prática varia muito por tela em contraste, radius, blur, peso tipográfico e semântica de cor.

Evidência:
- tokens e base: [index.css](/Users/diegomachado/bolanarede-manager00/index.css#L11)
- forte variação local nas telas: [screens/TeamSelectionScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/TeamSelectionScreen.tsx#L66), [screens/FinanceScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/FinanceScreen.tsx#L26), [screens/MarketScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/MarketScreen.tsx#L83)

Impacto:
- menos previsibilidade
- mais custo de manutenção visual
- mais risco de regressão de UX em novas telas

### 4. Legibilidade em mobile precisa subir

Há muito uso de texto muito pequeno, uppercase agressivo e contraste reduzido em áreas densas.

Evidência:
- grande volume de `text-[8px]`, `text-[9px]`, `text-[10px]` em dashboard e navegação inferior: [screens/DashboardScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/DashboardScreen.tsx#L102), [screens/DashboardScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/DashboardScreen.tsx#L246)
- `text-secondary` hoje herda um verde claro único para múltiplos contextos: [index.css](/Users/diegomachado/bolanarede-manager00/index.css#L151)

Impacto:
- leitura pior em dispositivos menores
- percepção de interface “apertada”
- acessibilidade limitada

### 5. Acessibilidade está abaixo do ideal

O produto privilegia atmosfera visual, mas vários padrões prejudicam uso real.

Evidência:
- seleção de texto global desabilitada: [index.css](/Users/diegomachado/bolanarede-manager00/index.css#L53)
- scrollbars ocultadas em quase toda a interface: [index.css](/Users/diegomachado/bolanarede-manager00/index.css#L85)
- botões e estados dependendo demais de cor, tamanho e contexto

Impacto:
- menor usabilidade para usuários com necessidades diversas
- pior descoberta de scroll
- pior ergonomia geral

### 6. Seleção de clube é forte visualmente, mas com atrito funcional

A tela é marcante, porém densa. O ícone de busca no header sugere ação mas não executa nada, e a jornada lista > modal > confirmar pode ser lenta.

Evidência:
- header e busca visual: [screens/TeamSelectionScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/TeamSelectionScreen.tsx#L70)
- lista de cards e modal: [screens/TeamSelectionScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/TeamSelectionScreen.tsx#L108), [screens/TeamSelectionScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/TeamSelectionScreen.tsx#L186)

Impacto:
- descoberta boa, decisão menos fluida
- sensação de peso para usuário experiente

### 7. Dashboard ainda está mais para vitrine do que para centro de decisão

Ele apresenta muito bem os módulos, mas ainda orienta pouco o jogador sobre prioridade operacional.

Evidência:
- bloco de próxima rodada é bom, mas não há bloco claro de “ação recomendada agora”: [screens/DashboardScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/DashboardScreen.tsx#L156)
- grid principal expõe muitos módulos no mesmo nível: [screens/DashboardScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/DashboardScreen.tsx#L189)

Impacto:
- o jogador precisa interpretar mais do que deveria
- a profundidade do sistema não vira clareza estratégica

### 8. Mercado e finanças parecem menores do que a promessa visual

As telas são visualmente fortes, mas ainda entregam pouca inteligência de decisão.

Evidência:
- mercado: [screens/MarketScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/MarketScreen.tsx#L119)
- finanças: [screens/FinanceScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/FinanceScreen.tsx#L36)

Impacto:
- sensação de produto mais raso do que o design sugere

### 9. Match screen tem boa teatralidade, mas risco de ruído

A tela de partida é interessante e viva, mas acumula muitos sinais simultâneos.

Evidência:
- pitch animado, glows, momentum, danger, haptics, feed e overlays: [screens/MatchScreen.tsx](/Users/diegomachado/bolanarede-manager00/screens/MatchScreen.tsx#L20)

Impacto:
- possível fadiga visual
- menor legibilidade dos estados mais importantes

## Diretrizes de Melhoria

### A. Criar uma gramática visual do jogo

Definir e documentar:

- 3 níveis de heading
- 2 níveis de texto auxiliar
- 1 padrão de header de tela
- 1 padrão de card informativo
- 1 padrão de card acionável
- 1 padrão de CTA primário
- 1 padrão de CTA secundário
- 1 padrão de badge de status
- 1 padrão de navegação inferior

Objetivo:
- tornar novas telas mais consistentes
- reduzir improviso de UI
- fortalecer percepção de produto coeso

### B. Reestruturar o dashboard por prioridade

Proposta:

- bloco 1: próxima ação
- bloco 2: próximo jogo
- bloco 3: alertas do clube
- bloco 4: atalhos de gestão
- bloco 5: navegação sistêmica

Objetivo:
- reduzir carga cognitiva
- aumentar clareza estratégica

### C. Melhorar legibilidade

Recomendações:

- reduzir dependência de textos `8px/9px`
- aumentar contraste de textos auxiliares
- limitar uppercase em conteúdo secundário
- usar mais diferenciação por peso e espaçamento, menos por opacidade

### D. Fixar semântica de cor

Sugestão:

- verde: positivo, confirmado, ativo
- amarelo: atenção, oportunidade
- vermelho: risco, fechamento, perda
- azul/ciano: informação, contexto
- roxo/rosa: usar só se houver semântica consistente

### E. Diminuir atrito na seleção de clube

Melhorias:

- remover ou ativar de fato o ícone de busca do header
- permitir seleção rápida sem modal
- deixar o modal como “ver detalhes”
- criar filtros melhores:
  - mais caixa
  - mais forte
  - mais difícil
  - mais pressão
  - melhor para iniciantes

### F. Enriquecer mercado e finanças com decisão assistida

Mercado:

- mostrar categoria do jogador
- mostrar risco/valor percebido
- mostrar impacto esperado no elenco
- melhorar estados vazios por aba

Finanças:

- explicar consequência de preço do ingresso
- explicar retorno estimado de expansão
- deixar o empréstimo mais contextualizado

### G. Melhorar onboarding

O onboarding deve ensinar prioridade prática, não só ambientação.

Deveria responder:

- o que fazer primeiro
- o que acompanhar no dashboard
- quando mexer em tática
- quando ir ao mercado
- por que moral e energia importam

## Plano de Execução

### Fase 1: Consistência Visual

Prioridade: alta

Entregas:

- ajustar escala tipográfica
- revisar contraste
- padronizar headers
- padronizar botões
- padronizar badges e estados

### Fase 2: Clareza de Fluxo

Prioridade: alta

Entregas:

- reorganizar dashboard
- simplificar seleção de clube
- melhorar launcher/home interna
- revisar estados de save e progresso

### Fase 3: Profundidade de Gestão

Prioridade: média

Entregas:

- enriquecer mercado
- enriquecer finanças
- melhorar sistema de alertas
- melhorar guidance de decisão

### Fase 4: Polimento e Acessibilidade

Prioridade: média

Entregas:

- rever motion e ruído visual
- revisar scroll affordance
- permitir melhor leitura/seleção onde fizer sentido
- melhorar empty states e feedbacks

## Recomendações Imediatas

As três ações com melhor custo/benefício agora:

1. Redesenhar a hierarquia do dashboard
2. Padronizar tipografia e contraste em todas as telas internas
3. Simplificar a seleção de clube para decisão rápida + detalhe opcional

## Conclusão

O projeto já tem uma das coisas mais difíceis de obter: identidade. Ele não parece genérico.

O próximo salto de qualidade não depende de “mais efeito visual”. Depende de coerência:

- coerência de navegação
- coerência de linguagem visual
- coerência de prioridade
- coerência de feedback

Se isso for resolvido, a percepção do produto sobe bastante sem exigir reescrita completa.
