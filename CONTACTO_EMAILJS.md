# Formulário de contacto (EmailJS)

O formulário do site usa EmailJS no navegador, sem servidor próprio. O destinatário configurado é `caoscomissaoatletasolimpicos@gmail.com` e pode ser alterado em `contact-email.js` e no campo **To Email** do modelo EmailJS.

## Configuração atual

- Serviço: `service_3z68wgw` (Gmail)
- Modelo: `template_9vhdydo` (Contact Us)
- Variáveis: `{{name}}`, `{{email}}` e `{{message}}`
- Destinatário: `caoscomissaoatletasolimpicos@gmail.com`
- Reply-To: `{{email}}`
- Assunto: `Nova mensagem do site CAOS — {{name}}`

O HTML do modelo está em português e mostra o nome, o email e a mensagem. O ficheiro `emailjs-config.js` contém a Public Key necessária para o SDK. A Public Key é pública por desenho; nunca coloques uma Secret Key ou palavra-passe nos ficheiros do site.

## Proteção e envio

- O formulário inclui um honeypot e limita envios repetidos a 30 segundos nesta página. O EmailJS também aplica limites por IP; um bot avançado pode contornar o limite local.
- O plano gratuito tem um limite mensal de pedidos; o painel EmailJS mostra o consumo atual.
- Os campos só são limpos quando o EmailJS confirma o envio. Em caso de falha, são mantidos e o formulário mostra uma mensagem.
- Para alterar o destinatário, atualiza `contact-email.js` e o campo **To Email** deste modelo.

A conta EmailJS já tem dois modelos (Auto-Reply e Contact Us) e atingiu o limite atual de modelos do plano gratuito; para criar outro, será necessário remover um modelo ou mudar de plano.
