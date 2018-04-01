const TelegramBot = require('node-telegram-bot-api');
const token = '553624068:AAEp_a77CNsbRDYnnXukiEqrMyj08ix8TRc';
const bot = new TelegramBot(token, {polling: true});
const helpers = require('./helpers');
const keyboard = require('./keyboard');
const kb = require('./keyboard-buttons');
const frases = require('./frases');


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
        case kb.home.about_company.callback_data:
            bot.sendMessage(chat.id, frases.about_company, keyboard.home);
            break;
        case kb.home.about_stock.callback_data :
            bot.sendMessage(chat.id, frases.about_company, keyboard.home);
            break;
        case kb.feedback.callback_data :
            bot.sendMessage(chat.id, frases.feedback_text, keyboard.home);
            break;
        case kb.home.order.callback_data :
            bot.sendMessage(chat.id, frases.menu_title, keyboard.categories);
            break;
        case kb.back_to_home.callback_data :
            helpers.sendHome(bot,chat.id);
            break;
        default:
            try{
                var parceQuery = JSON.parse(query.data);
                if(parceQuery.type === 'unit'){

                }else if(parceQuery.type === 'basket'){
                    helpers.basket(bot,chat.id,parceQuery.back)
                }

                else {
                    bot.sendMessage(chat.id, frases.error_message, keyboard.home)
                }
            }catch(e){
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

console.log('bot has been started')

