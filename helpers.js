const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard');
const frases = require('./frases')
const cache = require('memory-cache')
const applicationChatId = '-243442467';


const firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "./coffeshoop-1fa82302d55c.json",
    databaseURL: "https://coffeshoop-c4e75.firebaseio.com/"
})

module.exports = {
    start(msg) {
        firebase.database().ref('users/' + msg.chat.id).set(msg.chat);
    },
    sendHome(bot, chatId) {
        bot.sendPhoto(chatId, frases.label_url, {
                caption: frases.home,
                reply_markup: keyboard.home.reply_markup

            }
        )
    },
    addContact(bot, msg) {
        var chatId = msg.chat.id;
        firebase.database().ref('users/' + chatId).update({
            phone_number: msg.contact.phone_number
        });
        bot.sendMessage(
            applicationChatId,
            `${getDateTime()}\n<b>Новый клиент:</b>\n\nИмя: <a href="tg://user?id` +
            `=${msg.chat.id}">${msg.chat.first_name}</a>\nНомер: ${msg.contact.phone_number}`,
            {parse_mode: 'HTML'});

        bot.sendMessage(chatId, frases.welcome(msg.chat.first_name), {
            reply_markup: {
                remove_keyboard: true
            }
        }).then(function () {
            setTimeout(function () {
                sendHome(bot, chatId)
            }, 500)

        })
    },
    basket(bot, chatId) {
        firebase.database().ref(`/goodsById`).once('value', function (snapshot) {
            var data = snapshot.val();
            bot.sendMessage(chatId, getCheck(data), keyboard.basket)
        })
    },
    sendUnits(bot, id, category) {
        firebase.database().ref('goods/').once('value', function (snapshot) {
            var goods = snapshot.val();
            if (goods[category] != null) {
                goods = goods[category];
                var key = [];
                // if (category === 'smhs' || category === 'coffee' || category === 'fresh') {
                //     for (var temp in goods) {
                //         key.push([kb.checkButton(category, goods[temp], false)])
                // }
                // key.push([kb.rebout(category), kb.ready(category, '')])
                // key.push([kb.back_to_categories, kb.back_to_home])
                // } else if (category === 'tea' || category === 'milks' || category === 'drinks') {
                for (var temp in goods) {
                    key.push([kb.unitButton(goods[temp])])
                }
                key.push([kb.back_to_categories, kb.back_to_home])
                // }
                cache.put(id, {category: category});
                bot.sendMessage(id, frases.titles[category], {
                    reply_markup: {
                        inline_keyboard: key
                    }
                })

            } else {
                bot.sendMessage(id, frases.empty, keyboard.categories)
            }
        })
    },
    clearCategory(chatId) {
        var temp = cache.get(chatId)
        temp.category = ''
        cache.put(temp)
    },
    // checkUnit(bot, id, query) {
    //     firebase.database().ref('goods/').once('value', function (snapshot) {
    //         var goods = snapshot.val();
    //         var category = query.c;
    //         if (goods[category] != null) {
    //             goods = goods[category];
    //             var key = [];
    //             var queryIDs = uni(query.id.split('&'));
    //             query.id = queryIDs.join('&');
    //             var but;
    //             for (var temp in goods) {
    //                 if (queryIDs.indexOf(goods[temp].id) == -1) {
    //                     if (queryIDs.length < 6)
    //                         goods[temp].id = (query.id + '&' + goods[temp].id);
    //                     but = kb.checkButton(category, goods[temp]);
    //                     if (but.callback_data.length <= 64)
    //                         key.push([but]);
    //                 } else {
    //                     if (queryIDs.length < 6)
    //                         goods[temp].id = (query.id + '&' + goods[temp].id);
    //                     but = kb.checkButton(category, goods[temp], true);
    //                     if (but.callback_data.length <= 64)
    //                         key.push([but]);
    //                 }
    //             }
    //
    //             key.push([kb.rebout(category), kb.ready(category, query.id)])
    //             key.push([kb.back_to_categories, kb.back_to_home])
    //
    //
    //             bot.sendMessage(id, frases.titles[category], {
    //                 reply_markup: {
    //                     inline_keyboard: key
    //                 }
    //             })
    //         } else {
    //             bot.sendMessage(id, frases.empty, keyboard.categories)
    //         }
    //     })
    // },
    askUnit(bot, chatId, unitId) {
        if (cache.get(chatId).category === 'smhs' || cache.get(chatId).category === 'fresh') {
            bot.sendMessage(chatId, 'куда налить?', keyboard.bottle_ask({id: unitId}))
        } else {
            bot.sendMessage(chatId, 'точно?', keyboard.just_ask({id: unitId}))
        }
    },
    addToBasket(bot, chatId, unitId) {
        var temp = cache.get(chatId)
        if (temp.basket) {
            temp.basket.push(unitId)
        } else {
            temp.basket = [unitId]
        }
        cache.put(temp)
        bot.sendMessage(chatId, 'готово', keyboard.ready)

    },
    // addUnit(bot, chatId, unitId) {
    //     firebase.database().ref(`/goodsById/${unitId}`).once('value', function (snapshot) {
    //         var unit = snapshot.val()
    //         if (unit === null) {
    //             bot.sendMessage(chatId, frases.error_message, keyboard.categories);
    //             return
    //         }
    //         if (unit.type === 'tea' || unit.type === 'milks' || unit.type === 'drinks') {
    //             firebase.database().ref(`/users/${chatId}/basket`).push(unit).then(result => {
    //                     bot.sendMessage(chatId, frases.successful_add_unit, keyboard.categories);
    //                 },
    //                 error => {
    //                     bot.sendMessage(chatId, frases.error_message, keyboard.categories);
    //                 })
    //         } else if (unit.type === 'smhs' || unit.type === 'coffee' || unit.type === 'fresh') {
    //             bot.sendMessage(chatId, 'В разработке', keyboard.categories);
    //         } else {
    //             bot.sendMessage(chatId, frases.error_message, keyboard.categories);
    //         }
    //
    //
    //     })
    // },
    // clearBasket(bot, chatId) {
    //     firebase.database().ref(`users/${chatId}/basket`).remove();
    //     bot.sendMessage(chatId, frases.basket_is_empty, keyboard.emptyBasket)
    // },
    submitOrder(bot, chatId, check) {
        firebase.database().ref('users/' + chatId).once('value', function (snapshot) {
            var msg = snapshot.val();
            if (msg !== null) {
                var uid = getUid();
                var text = `${getDateTime()}\n<b>Новый заказ:</b>\n\nИмя: <a href="tg://user?id` +
                    `=${chatId}">${msg.first_name}</a>\nНомер: ${msg.phone_number}\n\nЗаказ #${uid}:\n` + check;

                bot.sendMessage(applicationChatId, text, {parse_mode: 'HTML'})
                    .then(() => {
                        firebase.database().ref(`users/${chatId}/basket`).remove()
                    }).then(() => {
                    bot.sendMessage(chatId, frases.order_is_submitted(uid), keyboard.emptyBasket)
                });
            }
        })

    },
    // bottleAsk(bot, chatId, query) {
    //     bot.sendMessage(chatId, frases.bottle_ask, keyboard.bottle_ask(query))
    // }
}

function getCheck(data) {
    var order = 'Чек\n\n';
    var count, price;
    for (var temp in data) {
        count = 0;
        for (var temp2 in data) {
            if (data[temp].id === data[temp2].id)
                count++;
        }
        data[temp].count = count
    }
    for (var temp in data) {
        data[data[temp].id] = data[temp];
        delete data[temp]
    }
    price = 0;
    for (var temp in data) {
        order += `${data[temp].title}: ${data[temp].count} X ` +
            `${data[temp].price}₽ = ${data[temp].count * data[temp].price}₽\n`
        price += data[temp].count * data[temp].price;
    }
    order += '\nИтоговая цена: ' + price + '₽';
    return order
}

function getUid() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}


function sendHome(bot, chatId) {
    bot.sendPhoto(chatId, frases.label_url, {
            caption: frases.home,
            reply_markup: keyboard.home.reply_markup

        }
    )
}

function getDateTime() {
    var date = new Date()
    return `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`
}

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var j = 0;
    for (var i = 0; i < a.length; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}

function uni(arr) {

    var result = arr.reduce(function (acc, el) {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
    }, {});
    var out = [];
    for (var temp in result) {
        if (result[temp] == 1)
            out.push(temp);
    }
    return (out)
}

//  function getOffsetDate(date,offset,time) {
//     if(time == undefined)
//         time = '';
//     date = new Date(date.getFullYear(),date.getMonth(),date.getDate()+offset)
//      return (('0' + (date.getDate())).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear()+' '+time)
//  }
//
//  function getSpbOffsetDate() {
//      var out = [];
//      var date = new Date();
//      for(var i = 1; i<=6;i++){
//          var day = (new Date(date.getFullYear(),date.getMonth(),date.getDate()+i)).getDay();
//          if(day === 0){
//              continue
//          }else if(day === 6){
//              out.push(getOffsetDate(date,i,'09:00 до 16:00'))
//          }else{
//              out.push(getOffsetDate(date,i,'09:00 до 16:00'))
//              out.push(getOffsetDate(date,i,'17:00 до 22:00'))
//          }
//      }
//      return out
//  }
// function getmurOffsetDate() {
//     var out = [];
//     var date = new Date();
//     for(var i = 0; i<=6;i++){
//         var day = (new Date(date.getFullYear(),date.getMonth(),date.getDate()+i)).getDay();
//         if(day === 6){
//             out.push(getOffsetDate(date,i,'10:00 до 16:00'))
//         }else{
//             out.push(getOffsetDate(date,i,'15:00 до 21:00'))
//         }
//     }
//     return out
// }