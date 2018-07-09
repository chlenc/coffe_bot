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

bot.onText(/\/start/, function (msg) {
    helpers.start(msg);
    bot.sendMessage(msg.chat.id, frases.phone, keyboard.phone);
});

bot.onText(/\/chatId/, function (msg) {
    bot.sendMessage(msg.chat.id, msg.chat.id);
});

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
        case kb.home.about_company.callback_data:                           //about_company
            bot.sendMessage(chat.id, frases.about_company, keyboard.home);
            break;
        case kb.home.about_stock.callback_data :                            //about_stock
            bot.sendMessage(chat.id, frases.about_stock, keyboard.home);
            break;
        case kb.feedback.callback_data :                                    //feedback
            bot.sendMessage(chat.id, frases.feedback_text, keyboard.home);
            break;
        case (kb.home.order.callback_data):                                 //order
            bot.sendMessage(chat.id, frases.menu_title, keyboard.categories);
            break;
        case (kb.back_to_categories.callback_data):                         //back_to_categories
            bot.sendMessage(chat.id, frases.menu_title, keyboard.categories);
            break;
        case kb.back_to_home.callback_data :                                //back_to_home
            helpers.sendHome(bot, chat.id);
            helpers.clearCategory(chat.id)
            break;
        // case kb.clearBasket.callback_data :                                 //clearBasket
        //     helpers.clearBasket(bot, chat.id);
        //     break;
        // case kb.submitOrder.callback_data:                                  //submitOrder
        //     helpers.submitOrder(bot, chat.id, text)
        //     break;
        default:
            try {
                var parceQuery = JSON.parse(query.data);
                if (parceQuery.type === 'category') {
                    helpers.sendUnits(bot, chat.id, parceQuery.unit)
                } else if (parceQuery.t === 'unit') {
                    helpers.askUnit(bot, chat.id, parceQuery.id)
                }else if(parceQuery.t === 'sub'){
                    helpers.addToBasket(bot, chat.id, parceQuery.id)
                }
                // else if (parceQuery.t === 'ch') {
                //     helpers.checkUnit(bot, chat.id, parceQuery)
                // }
                //          //else if (parceQuery.t === 'basket') {
                //         //     helpers.basket(bot, chat.id, parceQuery.back)
                //         //}
                //
                //         //else if (parceQuery.t === 'rebout') {
                //         //     helpers.sendUnits(bot, chat.id, parceQuery.categ)
                //        else if (parceQuery.t === 'r') {
                //         //     //helpers.bottleAsk(bot, chat.id, parceQuery)
                //         // }
                // else {
                //     bot.sendMessage(chat.id, frases.error_message, keyboard.home)
                // }
            } catch (e) {
                bot.sendMessage(chat.id, frases.error_message, keyboard.home)
            }
            break;
    }


    try {
        // bot.deleteMessage(chat.id, message_id);
    } catch (e) {
        console.log('delete error')
    }
})

console.log(bot.isPolling() ? 'bot has been started use polling' : 'bot has been started use WebHook');

