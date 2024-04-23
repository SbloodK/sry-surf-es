const express = require('express');
const { Telegraf, Markup } = require('telegraf');

const app = express();
const port = 3000;

const bot = new Telegraf("6890466990:AAHatI1Lqw9iYFlqRrkXrh1-tAeKBbyR3q0");

var userParams = [];
var nowSession = 0;

const keyboard = Markup.inlineKeyboard([
    Markup.button.callback("Let's go", "startFunc"),
]);

// Mesajları saklamak için bir dizi oluşturalım
let messages = [];

// Express.js için ana sayfa endpoint'i
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Express.js için '/messages' endpoint'i
app.get('/messages', (req, res) => {
    // Yanıtlanan mesajları JSON formatında gönder
    res.json(messages);
});

// Telegraf bot için '/start' komutu endpoint'i
bot.command('start', (ctx) => {
    ctx.reply('Answer 3 questions and get a chance to earn from $5000 in p2p arbitrage team! ', keyboard)
    userParams = [];
    nowSession = 0;
});

// Telegraf bot için 'cevapla' komutu endpoint'i
bot.command('cevapla', (ctx) => {
    var args = ctx.update.message.text.split(' ')
    args.splice(0, 1);
    var id = args.splice(0, 1);
    var message = args.join(' ');
    ctx.telegram.sendMessage(id[0], message);

    // Yanıtlanan mesajları listeye ekle
    messages.push(message);

    // Yanıtlanan mesajları JSON formatında gönder
});



// Telegraf bot için buton tıklama işlemleri
bot.action("startFunc", ctx => {
    nextSession(ctx);
});

bot.action(['btn-1', 'btn-2', 'btn-3', 'btn-4', 'btn-5'], ctx => {
    const index = parseInt(ctx.match[0].split('-')[1]) - 1;
    saveData(ctx, index);
    nextSession(ctx);
});

// Telegraf bot ile ilgili işlemler
function saveData(ctx, btnid) {
    var askId = "";
    if (nowSession == 1) {
        askId = "Soru 1";
    } else if (nowSession == 2) {
        askId = "Soru 2";
    } else if (nowSession == 3) {
        askId = "Soru 3";
    }

    userParams.push({
        question: askId,
        answer: getAnswerText(nowSession, btnid),
        username: ctx.from.username || 'Anonim',
        userid: ctx.from.id
    });
}

bot.on('text', (ctx) => {
    const message = ctx.message.text;
    const username = ctx.from.username || 'Anonim';
    const userId = ctx.from.id;
    
    // Kullanıcıya geri gönderilecek mesajı oluştur
    const replyMessage = `Kullanıcı: @${username} (ID: ${userId}) | Mesaj: ${message}`;
    
    // Kendi kullanıcı kimliğinizi veya kullanıcı adınızı belirtin
    const yourUserId = 6342398048; // Kullanıcı kimliğiniz
    const yourUsername = "MillionaireClub_Offical"; // Kullanıcı adınız

    // Kendinize mesajı gönderin
    ctx.telegram.sendMessage(yourUserId, replyMessage);
});

function nextSession(ctx) {
    let photo = '';
    let caption = '';

    if (nowSession == 0) {
        nowSession += 1;
        photo = 'https://i.hizliresim.com/jujrrwa.png'; // Soru 1 için fotoğraf URL'si
        caption = "1. Do you have experience in cryptocurrency?";
    } else if (nowSession == 1) {
        nowSession += 1;
        photo = 'https://i.hizliresim.com/4m8ig7f.png';
        caption = "2. Which of the following exchanges do you already have?";
    } else if (nowSession == 2) {
        nowSession += 1;
        photo = 'https://i.hizliresim.com/kxnu3h4.png';
        caption = `3. What kind of budget are you willing to allocate to the work?

        🔻 Consider the following factors: 
        - We don't sell bundles like others do, we only take a % of YOUR PROFITS 
        - Everything is proportional in Arbitrage, the more you invest, the more % you get
        - We need to find the best bundle for your budget`;
    } else if (nowSession == 3) {
        sendResultsToAdmin(ctx);

        // Soruların cevaplarını düzgün bir biçimde listele
        let answersList = userParams.map((item, index) => `${index + 1}. ${item.answer}`).join("\n        ");

        ctx.replyWithPhoto(
            'https://i.hizliresim.com/1vm4me9.jpg', // Fotoğrafın URL'si
            {
                caption: `✅ Application successful
        
        ⏳ We will review it shortly, please wait
        
        Your answers:
        ${answersList}
        
        ❗️You can also visit our website and learn more about us and what we can offer you!
        
        ⚡️There is a lot of interesting stuff there
        
        P.S. Please keep your notifications on as the manager will be communicating with you here 🙏`,
                reply_markup: {
                    inline_keyboard: [
                        [Markup.button.url('Web Sitemiz', 'https://www.example.com')]
                    ]
                }
            }
        );

        nowSession = 0;
        userParams = [];
        return;
    }

    ctx.replyWithPhoto(photo, {
        caption: caption,
        reply_markup: {
            inline_keyboard: [
                [{ text: "" + getAnswerText(nowSession, 0), callback_data: "btn-1" }],
                [{ text: "" + getAnswerText(nowSession, 1), callback_data: "btn-2" }],
                [{ text: "" + getAnswerText(nowSession, 2), callback_data: "btn-3" }],
                [{ text: "" + getAnswerText(nowSession, 3), callback_data: "btn-4" }],
                [{ text: "" + getAnswerText(nowSession, 4), callback_data: "btn-5" }]
            ]
        }
    });
}





function sendResultsToAdmin(ctx) {
    const resultsMessage = userParams.map(item => `${item.question}, Cevap: ${item.answer}\nKullanıcı: @${item.username} (ID: ${item.userid})`).join('\n');
    const adminChatId = "6342398048"; // Buraya botunuzun sonuçları göndereceği yönetici veya grup ID'sini girin
    ctx.telegram.sendMessage(adminChatId, `Yeni cevaplar alındı:\n${resultsMessage}`);
}

function getAnswerText(session, btnid) {
    let answerText = "";
    switch (session) {
        case 1:
            switch (btnid) {
                case 0:
                    answerText = "Spot/Futures";
                    break;
                case 1:
                    answerText = "P2P";
                    break;
                case 2:
                    answerText = "AirDrops";
                    break;
                case 3:
                    answerText = "Other";
                    break;
                case 4:
                    answerText = "Newbie";
                    break;
            }
            break;
        case 2:
            switch (btnid) {
                case 0:
                    answerText = "Bybit";
                    break;
                case 1:
                    answerText = "MEXC";
                    break;
                case 2:
                    answerText = "OKX";
                    break;
                case 3:
                    answerText = "Binance";
                    break;
                case 4:
                    answerText = "Other";
                    break;
            }
            break;
        case 3:
            switch (btnid) {
                case 0:
                    answerText = "50 - $500";
                    break;
                case 1:
                    answerText = "500 - $2.000";
                    break;
                case 2:
                    answerText = "2.000 - $5.000";
                    break;
                case 3:
                    answerText = "5.000 - $10.000";
                    break;
                case 4:
                    answerText = "$10.000+";
                    break;
            }
            break;
        default:
            answerText = "Invalid answer";
            break;
    }
    return answerText;
}

bot.launch();

app.listen(process.env.PORT || 3000, () => {
    console.log("Sunucu Ayaktadır, Çalışıyor...")
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
