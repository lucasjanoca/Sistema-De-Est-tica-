# InfoTech.io · Sistema de Gestão Automotiva

Aplicação multitenant de gestão para estéticas automotivas. Cada empresa possui estado separado no Supabase (clientes, veículos, orçamentos, ordens, lançamentos e catálogo de serviços). O administrador da plataforma é diferente do proprietário de um estabelecimento.

## Endereços

- Sistema: `https://lucasjanoca.github.io/Sistema-De-Est-tica-/`
- Administração da InfoTech.io: `https://lucasjanoca.github.io/Sistema-De-Est-tica-/admin.html` (redireciona para `admin-v2.html`). A interface só é apresentada com login e confirmação de permissão pelo Supabase. Conhecer a URL não dá permissão administrativa.

## Código e publicação

`index.html` carrega `bundle.js`, que monta o JS compacto de `code-1.b64` a `code-3.b64` e o CSS de `style.b64`, seguido dos complementos `infotech-custom.js`, `admin-extension.js`, `infotech-release.js`, `logo-fix.js`. Não edite os `.b64` manualmente. `admin-v2.html` carrega `admin.js` e `admin-release.js`. O arquivo `infotech-mark.svg` é a marca vetorial local.

O GitHub pode publicar no Pages automaticamente quando configurado; um commit não garante a conclusão da publicação. `_headers` é aplicado na Cloudflare Pages, não no GitHub Pages. A CSP principal está no próprio HTML.

## Fluxo atual: somente operador cria contas

1. Entre em `admin.html` com a conta administrativa autorizada; em **Nova empresa e proprietário**, preencha estabelecimento, e-mail e uma **senha inicial nova**. A Edge Function `detailnow-admin-create-account` verifica a sessão e a permissão administrativa antes de chamar Supabase Auth `signUp`. O e-mail de confirmação é responsabilidade do Supabase Auth/SMTP configurado.
2. Após a criação Auth, o painel chama `detailnow_admin_provision_company`, criando empresa isolada, associação de proprietário e estado vazio. Confirmação de e-mail é obrigatória para ler/salvar estado. Caso o envio falhe ou o vínculo falhe, confira o cadastro e a mensagem antes de repetir; a rotina recusa e-mail já vinculado a outra empresa.
3. Em **Cadastrar funcionário**, selecione a empresa, e-mail e senha nova. A Edge Function cria o usuário caso ainda não exista e `detailnow_admin_provision_staff` vincula como `editor`. Um e-mail que já tem conta Supabase não tem a senha sobrescrita, para evitar afetar outros aplicativos do projeto compartilhado.
4. `detailnow_create_workspace`, `detailnow_invite_staff`, `detailnow_claim_invitations` e `detailnow_admin_invite_company` não são executáveis por usuários comuns. A opção de auto-cadastro foi removida da interface. O Supabase é compartilhado: não desativar globalmente a criação de usuários sem avaliar os outros aplicativos; somente contas com associação à empresa podem acessar os dados desta aplicação.

**Status de implantação:** a interface e a Edge Function estão implantadas no repositório/Supabase. As duas contas finais Oliveira precisam ser cadastradas pelo administrador autenticado e confirmar seus e-mails; não foram criadas por armazenamento de senhas no GitHub nem por SQL em `auth.users`. O Gmail de funcionário já existia no Auth sem associação a empresa ao verificar o banco em 20/09/2026; pode ser associado pelo painel após a criação da empresa. Não reutilize senhas compartilhadas em chats.

## Permissões, preços e orçamentos

`owner` cadastra e altera catálogo no menu **Serviços e preços**, que fica salvo em `detailnow_state.data.servicesCatalog` por empresa. Itens podem ser desativados sem apagá-los. A criação de orçamento/ordem usa esses valores. O valor de cada ordem fica registrado separadamente: mudar o preço de tabela não muda os valores antigos.

`editor` visualiza preços, mas não altera os preços da tabela na UI e a RPC `detailnow_save_state` impede mudanças de catálogo e alterações de nomes/preços de serviços em ordens existentes; novas ordens do funcionário devem usar nome e valor ativos cadastrados pelo proprietário. Como a tabela era inicialmente inexistente, o primeiro acesso do proprietário migra valores padrão para o catálogo. O proprietário deve preencher os preços reais antes de liberar a equipe.

A opção **Imprimir / PDF** abre um documento HTML isolado, com CSS de impressão A4 claro e dados do orçamento. É o navegador que oferece a opção de salvar como PDF. Cabeçalhos/rodapés extras do navegador são controlados pelas configurações de impressão do usuário. Um teste de orçamento simples gerou uma única página A4; propostas longas podem ocupar mais de uma página.

## Empresas e exclusão segura

O painel InfoTech.io permite suspender, reativar e **excluir** com dupla confirmação (incluindo o nome exato do estabelecimento). Excluir é arquivamento lógico (`status='deleted'`): impede leitura/gravação e oculta a empresa no acesso normal, mantendo dados para recuperação. A interface administrativa pode reativar a empresa. Não usar exclusão física do banco sem política de retenção, consentimento e backup externo.

A listagem de todas as empresas e operações administrativas exige role de plataforma conferida no servidor; isso não dá leitura automática dos dados privados de clientes de outras empresas. Tabelas internas de controle usam RLS sem política direta; as RPCs SECURITY DEFINER verificam `auth.uid()` e autorização explicitamente.

## Pendências antes de vender em produção

- Verificar a publicação no Pages e testar com autenticação real, inclusive criação de conta e confirmação de e-mail com SMTP e Redirect URLs.
- Configurar Google OAuth no Google Cloud e Supabase Authentication > Providers > Google, sem compartilhar Client Secret em chat/GitHub. Testar login por Google com Gmail autorizado; identidade com e-mail igual não dispensa verificar o vínculo da conta.
- Testar uso simultâneo em dois dispositivos, política LGPD/privacidade, recuperação de dados, backup externo/restauração, valores e fluxo comercial completos. Pontos automáticos no mesmo banco não substituem backup externo.
- Monitorar atualizações e linter de segurança Supabase, documentar retenção e reversão de exclusão.

**Jamais commitar senha, tokens, `service_role` ou dados de clientes.**