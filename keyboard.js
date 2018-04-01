const kb = require('./keyboard-buttons');
const frases = require('./frases');
module.exports = {
    phone: {
        reply_markup: {
            keyboard: [
                [{
                    text : 'Отправить номер',
                    request_contact: true
                }]
            ]//,
            //one_time_keyboard: true
        }
    },
    home: {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [kb.home.order],
                 [kb.feedback],
                 [kb.home.about_stock],
                 [kb.home.about_company]
            ]
        }
    },
    // back_to_home:{
    //     reply_markup: {
    //         inline_keyboard: [
    //             [kb.back_to_home]
    //         ]
    //     }
    // },
    categories: {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Кофе',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'coffee'
                    })
                },
                    {
                        text: 'Чаи',
                        callback_data: JSON.stringify({
                            type: 'unit',
                            unit: 'tea'
                        })
                    }],
                [{
                    text: 'Смузи',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'smhs'
                    })
                },{
                    text: 'Фреш',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'fresh'
                    })
                }],
                [{
                    text: 'Молочные коктейли',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'milks'
                    })
                }],
                [{
                    text: 'Сезонные напитки',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'drinks'
                    })
                }],
                [kb.back_to_home,kb.basket(kb.back_to_home.callback_data)]
            ]
        }
    }


}