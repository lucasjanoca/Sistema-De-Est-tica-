# DetailNow • by InfoTech.io

Sistema interno para estéticas automotivas, com tema preto/grafite e azul, atendimentos em cards, agenda em lista, orçamentos, clientes e veículos, financeiro e relatórios.

## Estrutura do site

`index.html` é a página inicial. `bundle.js` carrega `style.b64` e `code-1.b64`, `code-2.b64`, `code-3.b64`, arquivos compactados do CSS e JavaScript. O código-fonte legível está no pacote `detailnow-infotech-producao.zip` entregue no ChatGPT; para manutenção, parta dos arquivos originais e gere um novo build em vez de editar o conteúdo compactado.

O site usa Supabase Auth e tabelas `detailnow_*` com RLS para separar os dados por empresa. Os dados começam vazios, não há clientes fictícios e é obrigatório entrar na conta. Somente a chave pública do Supabase está no código; nunca inclua segredos no GitHub.

## Hospedagem automática

Se sua publicação automática já estiver ligada à branch `main`, o commit de `index.html` aciona uma nova implantação. Cloudflare Pages: projeto estático, sem comando de build, diretório de saída `.`. GitHub Pages: Settings → Pages → branch `main` / `(root)`. O arquivo `_headers` funciona no Cloudflare Pages, não no GitHub Pages.

Configure no Supabase Authentication → URL Configuration o endereço HTTPS real em Site URL e Redirect URLs. Antes de cadastrar clientes reais, valide com contas reais login, confirmação e recuperação de e-mail, isolamento entre empresas, alterações em dois aparelhos, backups, privacidade/LGPD e SMTP. Publicação do site não significa que o sistema já foi homologado para produção.
