# InfoTech.io • Sistema de Gestão Automotiva

Sistema para múltiplas estéticas automotivas no mesmo site, com dados separados por estabelecimento no Supabase. A interface principal possui atendimentos, agenda, clientes, orçamentos, financeiro e relatórios.

## Publicação e arquivos

A branch `main` contém `index.html`, `bundle.js`, `style.b64`, os fragmentos `code-1.b64` a `code-3.b64`, `infotech-custom.js` e `admin-extension.js`. O loader monta a interface e carrega ambas as extensões; **não edite manualmente os arquivos `.b64`**. `admin.html` e `admin.js` implementam o painel do operador.

O repositório pode ser publicado por GitHub Pages ou Cloudflare Pages. O `_headers` só funciona na Cloudflare. Um commit no GitHub não prova que o deploy público terminou: conferir a URL HTTPS real.

## Painel exclusivo InfoTech.io

Abrir `admin.html` na mesma origem HTTPS do site (GitHub Pages: `https://lucasjanoca.github.io/Sistema-De-Est-tica-/admin.html`, após publicação da revisão). O acesso exige sessão válida no Supabase **e** autorização na tabela privada `detailnow_platform_admins` conferida por RPC no servidor. O administrador inicial foi atribuído exclusivamente ao proprietário verificado das duas empresas InfoTech.io e Lucas Janoca De Sousa Feitosa já existentes. Nenhum usuário obtém acesso administrativo ao escrever seu e-mail no navegador ou criar uma empresa chamada InfoTech.io.

O operador pode ver a relação de empresas, responsáveis, equipe e quantidades de atendimentos; preparar convites para empresas, convidar/remover funcionários, revogar convites, suspender/reativar estabelecimentos e consultar um histórico básico de operações. **O painel não dá leitura automática de dados privados de clientes de outras empresas**, nem permite editar finanças/atendimentos de terceiros. Se for necessário suporte com dados reais, estabelecer autorização e trilha de auditoria específica.

### Fluxo de nova empresa

1. No painel, digitar nome do estabelecimento e e-mail do proprietário em “Cadastrar nova empresa”. Um **convite pendente**, não uma conta nem dados falsos, é criado no Supabase. Ele expira em 30 dias.
2. Usar “Abrir e-mail” no convite para abrir uma mensagem pronta, **confirmar o envio no aplicativo de e-mail**. Não há SMTP/envio automático embutido neste painel.
3. O proprietário acessa o site, cria uma conta usando **exatamente o e-mail convidado**, confirma o e-mail e faz login. A RPC `detailnow_claim_invitations` verifica o e-mail confirmado e cria a empresa com estado vazio, vinculando esse usuário como `owner`.
4. Para funcionários, usar “Convidar funcionário”, selecionar o estabelecimento e informar um e-mail diferente, sem vínculo com outra empresa. O usuário confirma esse e-mail e entra para aceitar o acesso automaticamente. O proprietário também encontra uma função simples de convite no menu Conta do sistema. O operador pode revogar convites e remover funcionários, sem excluir a conta Auth de outro aplicativo.
5. Um usuário comum só pode entrar em **um** estabelecimento. A função anterior de cadastro livre `detailnow_create_workspace` teve seu EXECUTE revogado para `authenticated`; novas empresas são criadas mediante convite. A conta legada que já possuía duas empresas teve **todos os dados preservados** e continua usando o menu Conta para alternar entre elas.

### Segurança do banco

As tabelas `detailnow_platform_admins`, `detailnow_company_invitations`, `detailnow_member_invitations` e `detailnow_platform_audit` usam RLS padrão-negado, sem privilégios diretos para `anon` e `authenticated`. RPCs `SECURITY DEFINER` conferem identidade e papel explicitamente, com `search_path` vazio. As tabelas originais de estado e backups só permitem leitura para membro de empresa ativa; gravação também verifica status, vínculo e revisão para evitar sobrescrita silenciosa. Suspender empresa não apaga seus dados. Ações administrativas relevantes geram eventos de auditoria.

**Limitação importante:** os papéis atuais `owner` e `editor` restringem os vínculos por estabelecimento; a função de gravação ainda autoriza ambos a editar o documento JSON inteiro. Bloqueio granular para impedir que funcionários mudem preços requer a futura separação de serviços/preços em tabelas próprias e validações adicionais. Não afirmar que essa restrição já funciona.

## Google e condições antes de liberar clientes reais

O botão Google existe no aplicativo, mas exige configuração do OAuth no Google Cloud e Supabase > Authentication > Providers > Google, mais a URL HTTPS em Authentication > URL Configuration > Redirect URLs. O projeto Supabase é compartilhado com outros aplicativos: não trocar Site URL global, políticas de outros projetos ou publicar Client Secret no GitHub. Guia: https://supabase.com/docs/guides/auth/social-login/auth-google

Ainda faltam validação real de login, e-mail e convite ponta a ponta, testes em dois dispositivos, SMTP adequado, proteção contra senhas vazadas, política de privacidade/LGPD e backup externo com restauração ensaiada. Os pontos de restauração existentes ficam no mesmo banco. A correção do valor de atendimento, a tabela de preços fixos com permissão somente do proprietário, a nova logo específica, o PDF de orçamento e a criação segura das contas solicitadas pelo cliente **não fazem parte desta entrega do painel** e continuam pendentes. Nunca publicar senhas, `service_role`, tokens ou dados de clientes no repositório público.