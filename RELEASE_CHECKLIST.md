# Release Checklist

Domínio alvo: `bolanarede.ia.br`

## Gate Técnico

- `npm install` concluído sem erro
- `npm run release:check` passando
- `npm run build` passando em ambiente limpo
- variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` definidas no ambiente de produção, se cloud save/login forem habilitados
- `vercel.json` aplicado com headers e rewrite SPA

## Gate de Produto

- landing abre sem quebra visual em mobile e desktop
- onboarding conclui sem travar o fluxo
- nova carreira inicia corretamente
- continuar save local funciona
- competições continentais (Libertadores/Sul-Americana) abrem a partir do dashboard sem erro
- mercado, finanças, tática e calendário abrem sem tela quebrada
- artilharia da Série A e Série B renderiza corretamente

## Gate de Dados

- elencos brasileiros usam a base real (CBF/Transfermarkt) quando disponível, com fallback gerado sinalizado
- clubes estrangeiros da Libertadores/Sul-Americana não aparecem com nomes numerados ("Clube 2", "Clube 3") além do estritamente necessário para completar o chaveamento
- nenhum clube disputa Libertadores e Sul-Americana na mesma temporada

## Gate de Marca e Página Pública

- título e description do `index.html` alinhados com a proposta do produto
- `manifest.json` e `metadata.json` alinhados com a marca `Bola na Rede Manager`
- capa social presente em `public/social-cover.svg`
- `robots.txt` publicado

## Gate Operacional

- consolidar mudanças locais em commits claros
- subir branch/`main` com estado reprodutível
- validar deploy preview antes de promover produção
- conferir domínio `bolanarede.ia.br` apontando para o projeto certo
- revisar se launch será `beta` ou `oficial`

## Recomendação Atual

Hoje o projeto está mais perto de `beta controlado` do que de `lançamento oficial`. Só promover para lançamento oficial depois de fechar o gate técnico e a rodada manual de QA.
