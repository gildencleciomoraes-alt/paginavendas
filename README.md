# Página de Vendas - Mentoria de TCC

Página estática para divulgar serviços de consultoria de TCC, com seções de serviços, processo, planos, depoimentos e contato.

## Estrutura
- `index.html`: marcação principal da landing page e script do acordeão/login.

- `styles.css`: estilos globais e responsivos.

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
