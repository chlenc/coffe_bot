const TelegramBot = require('node-telegram-bot-api');
//люблю пуса
const helpers = require('./helpers');
const keyboard = require('./keyboard');
const kb = require('./keyboard-buttons');
const frases = require('./frases');

const token = '553624068:AAEp_a77CNsbRDYnnXukiEqrMyj08ix8TRc';
const PORT = 80;
const URL = 'https://d83b25bb.ngrok.io';
const bot = new TelegramBot(token, {polling: true});
// const bot = new TelegramBot(token, {
//     webHook: {
//         port: PORT
//     }
// })
//
// bot.setWebHook(URL + '/bot' + token)
//     .then(result => {
//             console.log('WebHook listening in port: ' + PORT + ' and url: ' + URL);
//         },
//         error => {
//             console.log('WebHook failed');
//
//         });


bot.onText(/\/start/, function (msg) {
    helpers.start(msg);
    bot.sendMessage(msg.chat.id, frases.phone, keyboard.phone);
});

bot.onText(/\/chatId/, function (msg) {
    bot.sendMessage(msg.chat.id, msg.chat.id);
});

// bot.onText(/\/echo/, function (msg) {
//     //helpers.error()
// });

bot.on('message', function (msg) {
    const chatId = msg.chat.id;
    if (msg.contact) {
        helpers.addContact(bot, msg);
    }
});

bot.on('callback_query', function (query) {
    const {chat, message_id, text} = query.message;
    console.log(query.data)
    switch (query.data) {
        case kb.home.about_company.callback_data:
            bot.sendMessage(chat.id, frases.about_company, keyboard.home);
            break;
        case kb.home.about_stock.callback_data :
            bot.sendMessage(chat.id, frases.about_company, keyboard.home);
            break;
        case kb.feedback.callback_data :
            bot.sendMessage(chat.id, frases.feedback_text, keyboard.home);
            break;
        case (kb.home.order.callback_data):
            bot.sendMessage(chat.id, frases.menu_title, keyboard.categories);
            break;
        case (kb.back_to_categories.callback_data):
            bot.sendMessage(chat.id, frases.menu_title, keyboard.categories);
            break;
        case kb.back_to_home.callback_data :
            helpers.sendHome(bot, chat.id);
            break;
        case kb.clearBasket.callback_data :
            helpers.clearBasket(bot, chat.id);
            break;
        case kb.submitOrder.callback_data:
            helpers.submitOrder(bot, chat.id, text)
            break;
        default:
            try {
                var parceQuery = JSON.parse(query.data);
                if (parceQuery.t === 'category') {
                    helpers.sendUnits(bot, chat.id, parceQuery.unit)
                } else if (parceQuery.t === 'basket') {
                    helpers.basket(bot, chat.id, parceQuery.back)
                } else if (parceQuery.t === 'unit') {
                    helpers.addUnit(bot, chat.id, parceQuery.id)
                } else if (parceQuery.t === 'rebout') {
                    helpers.sendUnits(bot, chat.id, parceQuery.categ)
                } else if (parceQuery.t === 'ch') {
                    helpers.checkUnit(bot, chat.id, parceQuery)
                }else if (parceQuery.t === 'r') {
                    //helpers.bottleAsk(bot, chat.id, parceQuery)
                }
                else {
                    bot.sendMessage(chat.id, frases.error_message, keyboard.home)
                }
            } catch (e) {
                bot.sendMessage(chat.id, frases.error_message, keyboard.home)
            }
            break;
    }


    try {
        bot.deleteMessage(chat.id, message_id);
    } catch (e) {
        console.log('delete error')
    }
})

console.log(bot.isPolling() ? 'bot has been started use polling' : 'bot has been started use WebHook');
