# UI Grammar

Projeto: `bolanarede-manager`

Objetivo:
- dar consistência entre landing, launcher e telas internas
- reduzir improviso visual por tela
- tornar prioridades e ações mais previsíveis

## Princípios

### 1. A tela deve responder primeiro: "o que fazer agora?"

Toda tela principal precisa deixar claro:
- o estado atual
- a decisão mais importante
- o risco imediato
- as ações secundárias

### 2. O produto é denso, mas não deve parecer caótico

Regra:
- usar destaque forte só para uma ação primária por área
- limitar quantidade de blocos concorrendo por atenção no topo
- empilhar contexto antes de profundidade

### 3. Cor precisa ter semântica estável

- verde: positivo, ativo, confirmado
- amarelo: atenção, oportunidade, disputa
- vermelho: risco, perda, bloqueio
- azul/ciano: informação, contexto, acompanhamento

### 4. O texto auxiliar precisa ser realmente legível

Evitar:
- excesso de `8px/9px`
- contraste baixo com blur
- uppercase em textos longos

Preferir:
- 10px apenas para labels muito curtas
- 12px e 13px para apoio
- 14px ou mais para explicação

## Estrutura Recomendada por Tela

### Header

Sempre incluir:
- retorno claro
- nome/contexto da tela
- no máximo uma ação primária no header

### Conteúdo

Ordem preferencial:
1. contexto
2. prioridade
3. alertas
4. atalhos
5. profundidade

### CTA

Padrões:
- primário: sólido, alto contraste, único por bloco
- secundário: superfície baixa ou borda
- destrutivo: vermelho, sempre com contexto

## Tipografia

### Heading 1

Uso:
- tela principal
- hero
- confirmação importante

Características:
- editorial
- alto contraste
- pouco texto

### Heading 2

Uso:
- seção principal
- bloco de decisão

### Label

Uso:
- categoria
- badge
- status curto

Regra:
- usar uppercase apenas em labels curtas

## Cards

### Card Informativo

Uso:
- métricas
- status
- resumo

Deve conter:
- label curta
- valor principal
- contexto breve

### Card Acionável

Uso:
- abrir módulo
- iniciar fluxo

Deve conter:
- ícone
- nome
- descrição curta opcional
- feedback de estado, se necessário

## Dashboard

Hierarquia oficial:
1. próxima decisão
2. próximo jogo
3. alertas do clube
4. métricas rápidas
5. gestão principal
6. gestão complementar

## Não Fazer

- não usar mais de um bloco “hero” forte por tela
- não usar ícone acionável sem função real
- não depender só de cor para estado
- não esconder prioridade dentro de grids homogêneos
- não misturar linguagem editorial e operacional no mesmo bloco sem controle
