# Configurar a área privada e as publicações

O site está ligado ao projeto Firebase `teste-114ef` e à aplicação Web `Atletas Olímpicos STP`. O início de sessão por e-mail/palavra-passe está ativo e `localhost` está autorizado. A base Firestore Standard está criada em `europe-west1` (Bélgica), em modo de produção. As regras de `firestore.rules` já estão publicadas.

## Estado atual

Existem dois administradores autorizados na coleção `admins`. Para iniciar sessão, cada um usa a sua própria conta Firebase. Abra `INICIAR_SITE.bat`; o navegador abrirá a área de login. Não use `file://`.

## Criar outra conta de acesso

Só é necessário criar outra conta se pretender substituir ou acrescentar um utilizador. A autorização exige uma conta criada no projeto Firebase `teste-114ef`.

1. Abra [Authentication → Users](https://console.firebase.google.com/project/teste-114ef/authentication/users).
2. Escolha **Adicionar usuário** e crie a conta com o seu próprio email e uma palavra-passe definida por si. Não envie a palavra-passe a ninguém.
3. Copie o **UID do usuário** mostrado pelo Firebase.

## Autorizar outra conta

1. Em [Cloud Firestore → Data](https://console.firebase.google.com/project/teste-114ef/firestore/data), crie (se ainda não existir) a coleção `admins` e um documento cujo ID é exatamente o UID copiado.
2. Adicione `role`, tipo **string**, valor `admin`.
3. Esta autorização permite publicar, editar e apagar conteúdo. Não autorize UID de outra pessoa.

As regras publicadas permitem leitura pública da coleção `posts`; só administradores autorizados podem criar, editar ou apagar publicações. Os restantes documentos ficam bloqueados por padrão. O código de login confirma o documento de administrador antes de abrir a área privada.

## Antes de publicar online

O site ainda precisa de ser publicado no Firebase Hosting. Para publicar no domínio Firebase gratuito, execute `PUBLICAR_SITE.bat` e siga as instruções de autenticação. Os domínios padrão do Firebase são autorizados automaticamente; se escolher um domínio próprio, adicione-o em [Authentication → Settings → Authorized domains](https://console.firebase.google.com/project/teste-114ef/authentication/settings). Se o login indicar `auth/unauthorized-domain`, adicione o domínio que aparece na barra do navegador.

## Publicações antigas

As publicações guardadas no navegador são importadas no primeiro início de sessão autorizado. A migração evita duplicados. As imagens têm limite de 500 KB e os campos são validados pelas regras.

## Testar localmente

Faça duplo clique em `INICIAR_SITE.bat`, mantenha a janela aberta e use a página de login que abrir. Não abra por `file://`.

## Acesso ao Firebase Console

O Console mostrou um aviso para ativar a autenticação multifator (MFA) na Conta Google antes de 3 de novembro de 2026 para continuar a aceder ao Firebase. Ative a verificação em duas etapas na sua Conta Google; não partilhe códigos de confirmação.
