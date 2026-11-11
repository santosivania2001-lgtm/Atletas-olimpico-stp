# Site da CAOS — GitHub Pages

Site estático da Comissão dos Atletas Olímpicos Santomenses. O Firebase continua a gerir o login e as publicações; o EmailJS gere o formulário de contacto.

## Publicação

O workflow `.github/workflows/deploy.yml` publica automaticamente o site no GitHub Pages sempre que há uma atualização na branch `main`. O endereço previsto é:

https://santosivania2001-lgtm.github.io/Atletas-olimpico-stp/

Na primeira publicação, confirma em **Settings → Pages** que a origem está definida como **GitHub Actions**. Depois da publicação, adiciona `santosivania2001-lgtm.github.io` em **Firebase Authentication → Settings → Authorized domains** para permitir o login no endereço publicado.

## Segurança

O repositório tem de ser público para usar GitHub Pages no plano gratuito. Não guardes palavras-passe, códigos de autenticação ou chaves privadas neste repositório. As configurações públicas do Firebase e a chave pública do EmailJS são usadas pelo site no navegador.
