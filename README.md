# Página de Vendas - Mentoria de TCC

Página estática para divulgar serviços de consultoria de TCC, com seções de serviços, processo, planos, depoimentos e contato.

## Estrutura
- `index.html`: marcação principal da landing page e script do acordeão/login.
- `styles.css`: estilos globais e responsivos.
- `cadastro.html`: página dedicada para visitantes criarem conta (nome, e-mail e senha) e seguirem para o painel.
- `api/`: API Node/Express simples com autenticação via SQLite e JWT para testes locais.

## Visualizar
Abra `index.html` em qualquer navegador ou use um servidor local simples (por exemplo, `python -m http.server`).

## Publicar e gerar um link para clientes
1. Crie um repositório no GitHub e envie estes arquivos:
   ```bash
   git init
   git add .
   git commit -m "Publica landing page"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/<seu-repo>.git
   git push -u origin main
   ```
2. No GitHub, acesse **Settings > Pages**, escolha **Source: Deploy from a branch**, selecione **main / (root)** e salve.
3. Após a publicação, o GitHub Pages fornecerá uma URL no formato `https://<seu-usuario>.github.io/<seu-repo>/` para compartilhar com clientes.

Alternativa: envie a pasta para serviços como Netlify ou Vercel, escolhendo o diretório de publicação como a raiz do projeto e compartilhando o link gerado.

## Login de usuários
O formulário de login agora pode usar:
- **Supabase (PostgreSQL gerenciado)**: já configurado com o projeto público informado pelo cliente (`https://atgotspourufrqqnhirl.supabase.co`). Basta abrir a página estática que o cadastro/login já gravam usuários reais no Supabase Auth.
- **API local em Node/SQLite**: opcional para testes offline (porta padrão 4000), salvando o token JWT no `localStorage`.

Você pode cadastrar pelo próprio `index.html` (aba **Criar acesso básico**) ou pela página específica `cadastro.html`, que também grava o token e envia direto para o painel.

### Como usar com Supabase (já configurado)
1. Abra `index.html` ou `cadastro.html`. O front-end já importa o SDK do Supabase via CDN.
2. A instância pública e a chave anônima padrão estão embutidas: `SUPABASE_URL=https://atgotspourufrqqnhirl.supabase.co`.
3. Caso queira apontar para outro projeto, defina `window.SUPABASE_URL` e `window.SUPABASE_KEY` em um script antes dos arquivos principais ou altere os valores direto no HTML.
4. Ao cadastrar ou logar, o usuário é criado e autenticado no Supabase Auth e o painel `area-aluno.html` é liberado com base na sessão válida.

### Como rodar a API local (SQLite)
1. Instale dependências na pasta `api`:
   ```bash
   cd api
   npm install
   ```
2. Opcional: defina variáveis no `.env` (serão lidas automaticamente):
   ```bash
   PORT=4000
   JWT_SECRET=troque-este-segredo
   DB_PATH=api/data/auth.db
   ```
3. Inicie o servidor:
   ```bash
   npm run dev
   ```
4. Acesse a landing page (por exemplo, `python -m http.server` na raiz) e use o formulário para **Criar acesso básico** (registro) ou **Já tenho acesso** (login). O token será guardado, a sessão ficará ativa até você clicar em “Encerrar sessão” e você será levado ao `area-aluno.html` para ver conteúdos exclusivos.

### Publicar a API
- Sugerido para ambiente de teste: Render, Railway, Fly.io ou VPS. Suba o conteúdo da pasta `api`, configure `PORT`, `JWT_SECRET` e `DB_PATH` (ou string de conexão para outro banco), instale dependências e exponha a rota.
- Depois do deploy, defina `window.AUTH_API_BASE` no front-end para apontar para o novo endpoint (ex.: `https://sua-api.fly.dev`).
