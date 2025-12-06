# Página de Vendas - Mentoria de TCC

Página estática para divulgar serviços de consultoria de TCC, com seções de serviços, processo, planos, depoimentos e contato.

## Estrutura
- `index.html`: marcação principal da landing page e script do acordeão/login.
- `styles.css`: estilos globais e responsivos.
- `cadastro.html`: página dedicada para visitantes criarem conta (nome, e-mail e senha) e seguirem para o painel.
- `pagina.html`: página pública permanente gerada para cada aluno (busca dados em `/pages/:slug`).
- `admin.html`: painel para o administrador listar usuários, recriar páginas e acessar slugs.
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
Há uma área de login demonstrativa para alunos, com validação apenas no front-end. Para liberar acessos reais, conecte a um back-end ou autorize manualmente os usuários e ajuste o envio do formulário.

## Integrando com Supabase
O site entra em modo de API simulada quando o atributo `data-api-base` do `<body>` fica vazio ou igual a `mock`. Para ativar um back-end real (como o Supabase), defina `data-api-base` com a URL da sua API e implemente os endpoints `/api/auth/register`, `/api/auth/login` e `/api/members/me` consumindo/verificando JSON.

Informações necessárias para usar o Supabase diretamente:
1. **Supabase URL**: endereço principal do projeto (ex.: `https://<PROJ>.supabase.co`).
2. **Supabase anon/public key**: chave pública para uso no front-end.
3. **Tabela de usuários/perfis** com os campos exibidos no dashboard (nome, email, área, plano, status, próxima sessão, mensagens, conteúdos liberados).
4. **Fluxo de autenticação**: decidir se o front-end chamará `supabase.auth.signUp`/`signInWithPassword` via SDK ou se você criará rotas HTTP intermediárias que façam essa ponte.

Sem essas informações, o site continua apenas no mock local (`localStorage`). Configure `data-api-base` e a camada de autenticação (SDK ou rotas) para persistir cadastros no banco do Supabase.

### Checklist do que você precisa fornecer/definir
- **URL do Supabase** (ex.: `https://<PROJ>.supabase.co`).
- **Chave pública (anon)** do Supabase para o front-end.
- **Banco/tabelas** onde os cadastros devem ser gravados (campos básicos: nome, e-mail, senha e os dados exibidos no dashboard).
- **Endereços das rotas** que receberão `POST /api/auth/register`, `POST /api/auth/login` e `GET /api/members/me` (podem ser Edge Functions ou um backend seu).
- **Variáveis de ambiente/segredos** que não devem ir para o repositório (por exemplo, chaves de serviço do Supabase), se for preciso processar algo no servidor.

Sem esses dados não é possível sair do modo mock: o HTML atual não tem as URLs nem as chaves para que os formulários de cadastro/login conversem com o Supabase ou com outro backend.
