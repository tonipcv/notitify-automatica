# Telegram Channel Notification Bot

Bot para monitorar mensagens de um canal do Telegram e enviar para um webhook.

## Configuração

1. Crie um arquivo `.env` com as seguintes variáveis:
```env
BOT_TOKEN=seu_token_aqui
GROUP_ID=id_do_canal_aqui
BOT_CHAT_ID=seu_id_aqui
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o bot:
```bash
node server.js
```

## Funcionalidades

- Monitora mensagens de um canal específico
- Envia mensagens para um webhook configurado
- Suporte a mensagens editadas
- Logs detalhados no console

## Dependências

- node-telegram-bot-api
- dotenv
- node-fetch 