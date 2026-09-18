# DetailNow — by InfoTech.io

Sistema interno de gestão para estéticas automotivas, com identidade preta e azul, clientes e veículos, atendimentos em cartões, agenda em lista, orçamentos, checklist, caixa, contas a pagar e relatórios.

## Estado da implantação

O repositório foi identificado e inicializado. **O código completo ainda precisa ser enviado para a raiz do repositório antes de habilitar o site.** Não confunda este README com o site implantado.

## Instalação do pacote

1. Extraia o pacote `detailnow-infotech-producao.zip` entregue no ChatGPT.
2. Envie para a raiz da branch `main` os arquivos `index.html`, `styles.css`, `app.js`, `cloud.js`, `config.js`, `infotech-mark.svg`, `_headers`, `.nojekyll` e `robots.txt`. O `index.html` precisa ficar na raiz.
3. Cloudflare Pages: Workers & Pages → Create → Pages → Connect to Git → selecione este repositório; branch `main`, sem comando de build, diretório de saída `/`.
4. Configure o domínio HTTPS e adicione a URL exata em Supabase → Authentication → URL Configuration → Site URL e Redirect URLs (para cadastro e recuperação de senha).
5. Crie sua conta e empresa pelo sistema. O banco do DetailNow usa as tabelas `detailnow_*`, já preparadas no projeto Supabase conectado. Inicialização vazia; não há clientes fictícios.
6. Antes de cadastrar clientes reais, valide o login, redefinição de senha, acesso isolado entre duas empresas, gravação em dois aparelhos, backup/restauração e política de privacidade. Habilite proteção de senhas vazadas/SMTP e monitore as recomendações de segurança.

### Alternativa com GitHub Pages

Repositório → Settings → Pages → Deploy from a branch → `main` / `(root)` → Save. O arquivo `_headers` não é aplicado pelo GitHub Pages; se usar Cloudflare na frente, configure cabeçalhos de segurança no provedor de borda.

## Segurança

A chave em `config.js` é **publishable**, destinada ao navegador, com dados restritos por Supabase Auth + RLS. Nunca comite `service_role`, segredo de Cloudflare, senha nem dados reais de clientes. A interface não permite acessar operações sem login. Estoque é um módulo futuro e não deve ser anunciado como concluído.

**Este README não confirma publicação. Verifique no painel do provedor se há um deploy publicado com sucesso antes de compartilhar o link com clientes.**