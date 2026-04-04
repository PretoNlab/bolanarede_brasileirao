<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Bola na Rede Manager

Manager de futebol brasileiro com carreira, Série A, Série B, mercado, finanças, staff, base e Copa do Mundo 2026.

## Rodar Localmente

Pré-requisito: `Node.js`

1. Instale as dependências:
   `npm install`
2. Crie um `.env.local` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Rode o app:
   `npm run dev`

## Release

- Verificação mínima antes de deploy:
  `npm run release:check`
- Build de produção:
  `npm run build`
