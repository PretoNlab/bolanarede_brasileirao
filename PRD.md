# PRD

## Produto

**Nome:** Bola na Rede Manager  
**Plataforma atual:** Web app em React/Vite, com preparação para Android via Capacitor  
**Gênero:** Football manager casual, mobile-first, focado em progressão rápida e gestão acessível

## 1. Resumo Executivo

Bola na Rede Manager é um jogo de gerenciamento de futebol inspirado em managers clássicos, com foco em clubes brasileiros, progressão por temporadas e interface rápida para partidas, mercado, finanças, elenco e evolução estrutural do clube. O produto busca combinar profundidade suficiente para retenção com baixa fricção de entrada.

O jogo hoje já opera em dois modos principais:

- `Carreira de clube`, com Série A e Série B, calendário por rodadas, promoção/rebaixamento, mercado, finanças, staff, treino, infraestrutura, base e notícias.
- `Copa do Mundo 2026`, como modo separado, com seleção de país, fase de grupos, mata-mata e decisão final.

## 2. Problema

Managers de futebol costumam falhar em pelo menos um destes pontos:

- curva de aprendizado alta demais;
- sessões longas demais para mobile;
- excesso de telas burocráticas antes da recompensa;
- pouca identidade local para o público brasileiro.

Bola na Rede Manager resolve isso com:

- interface mobile-first;
- ciclo curto entre decisão e recompensa;
- clubes e contexto brasileiros;
- partidas rápidas com intervenção tática durante a simulação;
- gestão simplificada, mas com camadas de progressão.

## 3. Objetivo do Produto

Entregar um manager de futebol viciante, acessível e rejogável, no qual o jogador:

- escolhe um treinador e um clube;
- administra elenco, tática, caixa e estrutura;
- disputa temporadas completas;
- busca título, promoção e longevidade;
- alterna entre decisões estratégicas e momentos de jogo;
- pode também jogar campanhas curtas e intensas no modo Copa do Mundo.

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
- progressão rápida sem sacrificar estratégia;
- partidas simuladas com sensação de controle;
- combinação de gestão esportiva, financeira e estrutural;
- modo extra de Copa do Mundo para sessões mais curtas e rejogáveis.

## 6. Visão do Produto

Ser o principal football manager casual brasileiro para web e mobile, com forte apelo de retenção, progressão contínua e possibilidade futura de conta em nuvem, economia expandida e conteúdo sazonal.

## 7. Princípios de Produto

- `Acessível`: o jogador deve entender o loop principal em poucos minutos.
- `Rápido`: cada tela deve levar a uma decisão útil.
- `Responsivo`: o usuário deve sentir efeito claro após treino, tática, contratação ou jogo.
- `Rejogável`: times, temporadas e modo Copa precisam sustentar múltiplas campanhas.
- `Local`: linguagem, clubes e fantasia de gestão precisam conversar com o público brasileiro.

## 8. Escopo Atual do MVP

### 8.1 Fluxo principal

1. Tela inicial com `Novo Jogo`, `Continuar` e `Copa do Mundo`.
2. Criação de treinador.
3. Escolha de clube por divisão.
4. Entrada no dashboard.
5. Preparação de partida.
6. Simulação da partida com ajustes táticos.
7. Atualização de rodada, finanças, moral, classificação e notícias.
8. Progressão até fim da temporada.
9. Tela de campeão ou demissão.
10. Nova temporada com promoção e rebaixamento.

### 8.2 Modo carreira de clube

- seleção de clubes das divisões A e B;
- calendário por rodadas;
- classificação por divisão;
- promoção e rebaixamento entre temporadas;
- gestão de elenco;
- renovação de contrato;
- mercado com compra de jogadores;
- finanças com preço de ingresso, empréstimo e expansão de estádio;
- staff técnico;
- infraestrutura do clube;
- categorias de base;
- notícias com efeitos no jogo;
- estatísticas individuais e de times;
- saves locais em 3 slots;
- exportação e importação de save;
- onboarding inicial.

### 8.3 Modo Copa do Mundo 2026

- seleção entre 48 seleções;
- sorteio de grupos;
- tabela da fase de grupos;
- chaveamento do mata-mata;
- simulação de jogos;
- disputa por pênaltis;
- tela de campeão mundial.

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

### 9.3 Loop curto da Copa do Mundo

1. Escolher seleção.
2. Passar pela fase de grupos.
3. Avançar no mata-mata.
4. Buscar o título mundial em campanha curta.

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
- atalhos para áreas principais;
- navegação principal do jogo.

### 10.4 Partida e pré-jogo

- tela de preparação antes da partida;
- comparação entre times;
- acesso rápido a tática e elenco;
- simulação da partida com eventos;
- pausa, aceleração, mudanças de estilo e substituições;
- efeito de momentum durante o jogo.

### 10.5 Elenco

- lista completa do plantel;
- visualização por jogador;
- atributos detalhados;
- histórico do atleta;
- renovação contratual.

### 10.6 Tática

- formações;
- estilo de jogo;
- definição da escalação titular.

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

- artilharia;
- assistências;
- ranking geral de clubes;
- acompanhamento por temporada.

### 10.14 Saves

- autosave local;
- 3 slots manuais;
- exportação e importação em JSON.

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
- partidas da Copa do Mundo avançam por grupos e mata-mata até a final.

## 12. Experiência do Usuário

### 12.1 Norte de UX

- linguagem simples;
- decisões rápidas;
- forte hierarquia visual;
- foco em telas densas, mas legíveis em mobile;
- feedback imediato via animações, cards e toasts.

### 12.2 Sensações desejadas

- “estou no controle”;
- “cada rodada importa”;
- “meu clube está evoluindo”;
- “minhas decisões geraram consequência”.

## 13. Métricas de Sucesso

### Produto

- taxa de conclusão do fluxo `Splash > Coach Setup > Team Selection > Dashboard`;
- percentual de jogadores que completam ao menos 1 temporada;
- média de rodadas jogadas por sessão;
- taxa de retorno para nova temporada;
- uso por tela: mercado, finanças, treino, staff, base.

### Retenção

- D1, D7 e D30;
- número médio de saves carregados por usuário;
- frequência de uso do modo Copa do Mundo.

### Engajamento

- partidas por sessão;
- contratações por temporada;
- upgrades de infraestrutura por temporada;
- promoções de jovens por temporada.

## 14. Requisitos Não Funcionais

- performance fluida em mobile intermediário;
- build web leve e jogável offline parcial no futuro;
- layout adaptado para celular;
- persistência local resiliente;
- arquitetura simples para iteração rápida;
- possibilidade de empacotamento Android via Capacitor.

## 15. Restrições e Lacunas do Estado Atual

Este documento separa claramente o que o produto quer ser e o que já está implementado. Hoje, as principais lacunas observadas são:

- integração de `cloud save` e autenticação está desenhada na interface, mas não está conectada no fluxo principal;
- `Supabase` existe no projeto, porém a tela de ajustes recebe `session={null}` e `onLoadCloud` vazio;
- estados de `staff`, `infraestrutura`, `treino`, `base` e `modo Copa` não estão persistidos no `buildSave` atual;
- mercado ainda está incompleto em partes importantes:
  - ofertas recebidas;
  - venda ativa;
  - empréstimos;
  - logs reais de transferências do usuário;
- onboarding é exibido, mas o dashboard recebe `onboardingComplete={true}`, o que indica inconsistência de integração;
- o PRD fala em “conta na nuvem”, mas isso deve ser tratado como fase seguinte, não como feature já entregue.

## 16. Roadmap Recomendado

### Fase 1: Consolidar o core atual

- persistir todos os sistemas no save local;
- concluir integração real de cloud save;
- fechar lacunas do mercado;
- melhorar consistência do onboarding;
- estabilizar balanceamento de finanças e progressão.

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

- copas nacionais/continentais;
- staff com efeitos sistêmicos mais profundos;
- scouting internacional;
- lesões e recuperação mais sofisticadas;
- rivalidades, expectativas de torcida e objetivos da diretoria.

## 17. Não Objetivos no Curto Prazo

- simulação ultra realista nível Football Manager;
- multiplayer online;
- economia pay-to-win;
- complexidade tática excessiva;
- dependência de backend pesado para o loop principal offline.

## 18. Posicionamento

Bola na Rede Manager deve ocupar o espaço entre:

- a nostalgia e rapidez de managers clássicos;
- a identidade brasileira do futebol local;
- a conveniência de uma experiência pensada para mobile.

Em uma frase:

> Um manager de futebol brasileiro, rápido e viciante, onde cada rodada entrega decisão, consequência e progressão.

