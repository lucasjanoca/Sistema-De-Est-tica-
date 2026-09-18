# DetailNow • by InfoTech.io

Sistema privado de gestão para estéticas automotivas com tema grafite/preto e azul, atendimento em cartões, agenda em lista, orçamentos, clientes, financeiro e relatórios.

## Código e hospedagem

O site está na raiz da branch `main`: `index.html` carrega `bundle.js`, que recupera o CSS/JS dos arquivos compactados `style.b64` e `code-1.b64` a `code-3.b64`. O código-fonte legível foi entregue no pacote `detailnow-infotech-producao.zip` na conversa do ChatGPT; não edite os arquivos `.b64` à mão.

Caso a Cloudflare Pages já esteja conectada a esta branch, cada commit poderá iniciar um novo deploy. Configuração estática: sem comando de build, pasta de saída `.`. O arquivo `_headers` é para Cloudflare Pages e NÃO é aplicado pelo GitHub Pages. O sucesso da implantação HTTPS deve ser conferido no painel da hospedagem, pois o envio do código ao GitHub não o comprova.

## Banco, acesso e cópias

O Supabase tem Auth, tabelas `detailnow_workspaces`, `detailnow_memberships`, `detailnow_state` e `detailnow_daily_backups`, com RLS por empresa. RPC de gravação verifica o vínculo com a empresa e uma revisão para detectar conflitos entre dispositivos. As funções SECURITY DEFINER de criação e gravação são executáveis para usuários autenticados de propósito e fazem checagem de autorização; mantenha essa verificação em futuras alterações.

Foi acrescentado o registro automático de UM ponto de restauração por dia em que houver atualização de dados; esses pontos estão no MESMO banco, com leitura restrita aos membros da empresa, e não substituem backup externo nem restauração testada. No aplicativo, a tela Relatórios disponibiliza a exportação manual dos dados em JSON. Salve essa cópia fora do Supabase, em local seguro, e teste sua recuperação antes de usar informações reais. Não comite backups JSON nem dados de clientes neste repositório público.

## Validação realizada

Foram executados testes locais simulados da interface e do build comprimido, incluindo login, criação de empresa, ordem de serviço, atendimento em cards, agenda em lista e versão celular. No banco, testes transacionais com rollback verificaram separação dos dados por empresa, impedimento de gravação cruzada e criação de ponto de restauração diário; não foram preservados dados de teste. Isso NÃO substitui testes reais na URL publicada, no e-mail e em dois dispositivos.

## Faltando para liberar clientes reais

1. Conferir Cloudflare Pages > Deployments: último deploy `Success`; abrir a URL HTTPS e verificar tela, logo e fontes.
2. Supabase > Authentication > URL Configuration: **adicionar a URL HTTPS exata do DetailNow à lista Redirect URLs**, incluindo eventual domínio personalizado. Este projeto Supabase é COMPARTILHADO com outros sites: NÃO troque `Site URL` global sem avaliar o efeito nos outros projetos. O DetailNow fornece `emailRedirectTo` e `redirectTo` explícitos nos fluxos de cadastro e recuperação.
3. Nas configurações do Supabase Auth, revisar política de senha/proteção contra senhas vazadas e configurar SMTP apropriado. O aviso sobre senhas vazadas está ativo no projeto compartilhado.
4. Criar sua conta no site e cadastrar `Estética Oliveira`. O banco começa vazio; não há cliente nem receita inventados.
5. Validar confirmação de e-mail, redefinição de senha, criação de um segundo usuário/empresa, separação de dados entre empresas e acesso por dois aparelhos. Confirmar os registros de pagamentos e relatórios.
6. Definir responsável pelo tratamento dos dados dos clientes, aviso de privacidade e política de retenção; exportar backup externo e executar um ensaio de restauração.

Estoque ainda é recurso futuro. Não confunda interface sem selo DEMO com homologação de produção. Nunca publicar chave service_role, senhas ou token secreto da Cloudflare.