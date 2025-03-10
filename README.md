# Telegram Channel Notification Bot

Bot para monitorar mensagens de um canal do Telegram e enviar para um webhook.

## Configuração

### Método 1: Execução Local

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

### Método 2: Usando Docker

1. Construa a imagem Docker:
```bash
docker build -t telegram-notification-bot .
```

2. Execute o container:
```bash
docker run -d \
  --name telegram-bot \
  -e BOT_TOKEN=seu_token_aqui \
  -e GROUP_ID=id_do_canal_aqui \
  -e BOT_CHAT_ID=seu_id_aqui \
  telegram-notification-bot
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