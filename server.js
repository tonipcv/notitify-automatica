require('dotenv').config();
const { Telegraf } = require('telegraf');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Inicializar o bot
const bot = new Telegraf(process.env.BOT_TOKEN);
const WEBHOOK_URL = 'https://boop-notify-ios-ft.dpbdp1.easypanel.host/telegram-webhook';

console.log("Bot iniciado...");
console.log("Configurações:");
console.log(`TOKEN: ${process.env.BOT_TOKEN}`);
console.log(`GROUP_ID: ${process.env.GROUP_ID}`);
console.log(`WEBHOOK_URL: ${WEBHOOK_URL}`);

// Middleware para logar todas as atualizações
bot.use((ctx, next) => {
  console.log('\n🔄 Update recebido:', JSON.stringify(ctx.update, null, 2));
  return next();
});

// Função para enviar mensagem para o webhook
async function enviarParaWebhook(texto, nomeRemetente = "Bot Telegram", idRemetente = "bot_telegram") {
  try {
    const dados = {
      message: {
        text: texto,
        from: {
          first_name: nomeRemetente,
          id: idRemetente
        }
      }
    };

    console.log('\n📤 Enviando para webhook:', JSON.stringify(dados, null, 2));

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.text();
    console.log('✅ Mensagem enviada para webhook com sucesso!');
    console.log('Resposta:', responseData);
    return response.status;
  } catch (error) {
    console.error('❌ Erro ao enviar para webhook:', error.message);
    throw error;
  }
}

// Capturar posts do canal
bot.on('channel_post', async (ctx) => {
  console.log('\n📢 Post no canal recebido:');
  console.log(`Chat ID: ${ctx.chat.id}`);
  console.log(`Tipo: ${ctx.chat.type}`);
  
  // Acessar a mensagem corretamente através do channelPost
  const messageText = ctx.update.channel_post.text || '';
  console.log(`Mensagem: ${messageText}`);

  // Verificar se é o canal correto
  if (String(ctx.chat.id) === String(process.env.GROUP_ID)) {
    console.log('✅ Mensagem é do canal correto, enviando para webhook...');
    try {
      await enviarParaWebhook(
        messageText,
        ctx.chat.title || "Canal Telegram",
        ctx.chat.id.toString()
      );
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error.message);
    }
  } else {
    console.log('❌ Mensagem não é do canal alvo');
    console.log(`Canal recebido: ${ctx.chat.id}`);
    console.log(`Canal esperado: ${process.env.GROUP_ID}`);
  }
});

// Capturar edições de posts no canal
bot.on('edited_channel_post', async (ctx) => {
  console.log('\n✏️ Post editado no canal:', JSON.stringify(ctx.update, null, 2));
  
  if (String(ctx.chat.id) === String(process.env.GROUP_ID)) {
    const messageText = ctx.update.edited_channel_post.text || '';
    try {
      await enviarParaWebhook(
        `[EDITADO] ${messageText}`,
        ctx.chat.title || "Canal Telegram",
        ctx.chat.id.toString()
      );
    } catch (error) {
      console.error('❌ Erro ao processar mensagem editada:', error.message);
    }
  }
});

// Tratamento de erros
bot.catch((err) => {
  console.error('❌ Erro no bot:', err);
});

// Iniciar o bot
async function iniciarBot() {
  try {
    await bot.launch();
    console.log('\n🚀 Bot iniciado e pronto para monitorar mensagens!');

    // Graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    console.error('❌ Erro ao iniciar o bot:', error);
  }
}

iniciarBot();



