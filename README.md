# InfoTech.io • Sistema de gestão automotiva

Sistema privado para estéticas automotivas: atendimentos em cartões, agenda, clientes, orçamentos, financeiro e relatórios.

## Publicação

A branch `main` contém `index.html`, `bundle.js`, os fragmentos compactados de aplicação `style.b64` e `code-1.b64` a `code-3.b64`, além de `infotech-custom.js`. O loader aplica ajustes de marca/textos e acrescenta a integração Google. Não edite manualmente os `.b64`. O pacote de fonte legível `detailnow-infotech-producao.zip` entregue anteriormente é uma versão anterior aos ajustes desta data; a referência atual é este repositório.

A página poderá publicar automaticamente pelo GitHub Pages ou pela Cloudflare Pages, se a respectiva implantação já estiver ativada. O `_headers` somente se aplica à Cloudflare Pages. O envio de commits NÃO confirma que a URL pública já recebeu o último deploy: confira pelo endereço HTTPS e pelo painel da hospedagem.

## Alterações de marca e acesso (setembro de 2026)

- Identidade de interface agora `InfoTech.io`; a logo oficial é carregada de `lucasjanoca/InfoTech.io`, arquivo `assets/brand/logo-192.webp`, com fallback para ícone local se não carregar.
- Botão **Entrar com Google** integrado ao método `supabase.auth.signInWithOAuth({provider:'google'})`, com `redirectTo` explícito para a URL atual. **Só funcionará após a ativação/configuração do provedor Google no Supabase e Google Cloud e a inclusão da URL HTTPS da aplicação em Redirect URLs.** O login ponta a ponta ainda não foi testado.
- Contas novas: somente uma empresa. A RPC `detailnow_create_workspace` checa, sob trava por usuário, se já existe vínculo ou empresa. Não altere essa checagem. A seleção de empresas do cabeçalho foi ocultada e o formulário de criar nova empresa some ao existir uma empresa.
- **Dados pré-existentes preservados:** se alguma conta já possuía duas empresas, ambas permanecem no banco e podem ser acessadas pelo menu Conta; não excluir ou mesclar sem decisão expressa do titular. A RPC bloqueia criação de empresas adicionais para essa conta. Nenhum cliente, ordem ou dado foi apagado por esta mudança.
- Removidos os textos solicitados sobre WhatsApp manual e explicação contábil. Remover a frase NÃO muda o comportamento do WhatsApp: o envio ainda exige ação/confirmação do usuário.

## Configuração pendente para o Google

1. Google Cloud Console: criar/configurar projeto OAuth para aplicação Web, preencher branding/público e criar Client ID/Client Secret. Origens JavaScript autorizadas: origem HTTPS exata do site. Redirect URI autorizada: URL de callback copiada de Supabase > Authentication > Providers > Google (`https://yncspxfsvlqdnodlsosb.supabase.co/auth/v1/callback`).
2. Supabase > Authentication > Providers > Google: habilitar provedor e cadastrar Client ID/Client Secret **somente no painel**, nunca no GitHub ou código público.
3. Supabase > Authentication > URL Configuration: acrescentar URL HTTPS exata do sistema em Redirect URLs. O Supabase é compartilhado com outros sites: não alterar Site URL global ou configurações de outros provedores sem revisar impactos.
4. Testar autenticação Google, retorno à aplicação e dados vinculados à conta correta. Não presumir que identidades com emails iguais estejam vinculadas automaticamente.

Documentação oficial: https://supabase.com/docs/guides/auth/social-login/auth-google

## Banco e segurança

As tabelas `detailnow_workspaces`, `detailnow_memberships`, `detailnow_state` e `detailnow_daily_backups` usam RLS para dados por empresa; gravações passam pela RPC com revisão para evitar sobrescrita silenciosa. Pontos diários de restauração estão no mesmo banco, e não substituem backup externo nem teste de recuperação. Uma conta já tinha múltiplas empresas ao aplicar a regra; por isso não foi criada uma constraint UNIQUE retroativa que falharia ou exigiria apagar dados. Nova criação é impedida pela RPC atualmente concedida a `authenticated`.

Antes de cadastrar dados reais, confirmar URL publicada, login Google/e-mail, fluxo de pagamentos, uso em dois dispositivos, retenção/LGPD, cópia fora do Supabase, recuperação de dados, SMTP e proteção contra senhas vazadas. Há um problema antigo de valores de atendimento a corrigir antes de uso comercial. Estoque permanece recurso futuro. Nunca publicar chaves secretas, senhas nem dados de clientes neste repositório.