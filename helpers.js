const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard');
const frases = require('./frases')

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
    sendHome(bot,chatId) {
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
                sendHome(bot,chatId)
            }, 1000)

        })
    },
    basket(bot,chatId){
        bot.sendMessage(chatId,frases.basket_is_empty,{
            reply_markup:{
                inline_keyboard:[[kb.back_to_categories,kb.back_to_home]]
            }
        })
    },
    sendUnits(bot,id,category){
        firebase.database().ref('goods/').once('value',function (snapshot) {
            var goods = snapshot.val();
            if(goods[category]!=null){
                goods = goods[category];
                var key = [];
                for(var temp in goods){
                    key.push([kb.unitButton(goods[temp])])
                }
                key.push([kb.back_to_categories,kb.back_to_home])
                bot.sendMessage(id,frases.titles[category],{
                    reply_markup:{
                        inline_keyboard:key
                    }
                })
            }else {
                bot.sendMessage(id,frases.empty,keyboard.categories)
            }
        })
    },
    addUnit(chatId,unitId){
        //firebase.database().ref()
    }
}
// sendUnit(bot,id,firebase,match,count){
//     try{
//         firebase.database().ref('goodsById/'+match).once("value", function (snapshot) {
//             var values = snapshot.val();
//             var isWater;
//             if(values===null)
//                 return;
//             if(values.type.substr(0,5) === 'water')
//                  isWater = true;
//             else
//                 isWater=false;
//             bot.sendPhoto(id,values.img,{
//                 caption: `<b>${values.title}</b><a>\n\nОписание: ${values.description}\n\nЦена: ${values.price}₽\n\n${values.url}</a>`,
//                 parse_mode: 'HTML',
//                 reply_markup:{
//                     inline_keyboard: [
//                         [kb.minus(match,isWater),kb.count(match,count),kb.plus(match,isWater),kb.plus10(match,isWater),kb.del(match)],
//                         [kb.basket(match)],
//                         [kb.back_to_some_category(values.type),kb.back_to_home]
//                     ]
//                 }
//             })
//         }, function (errorObject) {
//             //console.log("The read failed: " + errorObject);
//         });
//     }catch(e){}
//
// },
// answerCallbackQuery(bot,id,time){
//     bot.answerCallbackQuery(id,{
//         text:'Пожалуйста, подождите',
//         // show_alert: true,
//         cache_time: time
//     })
// },
// payDeliv(){
//     var date = new Date();
//     return {
//         reply_markup: {
//             inline_keyboard: [
//                 [{
//                    text: getOffsetDate(date,0),
//                     callback_data: JSON.stringify({
//                         type: 'delivDate',
//                         pay: 200,
//                         date:getOffsetDate(date,0)
//                     })
//                 }],
//                 [{
//                     text: getOffsetDate(date,1),
//                     callback_data: JSON.stringify({
//                         type: 'delivDate',
//                         pay: 200,
//                         date:getOffsetDate(date,1)
//                     })
//                 }],
//                 [{
//                     text: getOffsetDate(date,2),
//                     callback_data: JSON.stringify({
//                         type: 'delivDate',
//                         pay: 200,
//                         date:getOffsetDate(date,2)
//                     })
//                 }],
//                 [kb.basket('back_to_home')],[kb.back_to_home]
//
//             ]
//         }
//     }
// },


function sendHome(bot,chatId) {
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