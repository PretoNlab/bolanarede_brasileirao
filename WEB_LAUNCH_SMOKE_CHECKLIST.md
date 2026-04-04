# Web Launch Smoke Checklist

Use esta checklist antes de publicar uma nova versão web.

## Pré-check técnico

- `npm run build`
- `npm run release:check`
- `npx tsc --noEmit`

## Funil público

- Abrir `/` e validar hero, CTAs e navegação para `/play`.
- Validar `Começar`, `Continuar` e `Copa do Mundo`.
- Confirmar que a landing carrega com a paleta bege e sem blocos quebrados.

## Fluxo principal do jogo

- Iniciar uma carreira nova e chegar ao dashboard.
- Continuar uma carreira já salva.
- Abrir `Tática`, `Elenco`, `Mercado`, `Finanças` e `Ajustes`.
- Simular uma partida e retornar ao dashboard sem travar.

## Saves e ajustes

- Salvar manualmente no slot ativo.
- Carregar um slot preenchido.
- Exportar o save atual.
- Importar um save válido.
- Reiniciar a carreira e confirmar que o fluxo volta ao estado inicial.
- Confirmar em `Ajustes` que apenas o fluxo local está exposto, sem promessa de sincronização por conta.

## Copa do Mundo

- Entrar no modo Copa.
- Passar pela fase de grupos sem repetir adversário.
- Verificar que goleiros não aparecem como artilheiros.
- Verificar que a final fecha corretamente e a tela do campeão abre.

## Mobile

- Abrir `Tática` em viewport mobile.
- Confirmar que `Esquema Tático`, `Mentalidade` e instruções aparecem no painel inferior.
- Trocar formação e garantir que o campo continua clicável.
