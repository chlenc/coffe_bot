const kb = require('./keyboard-buttons');
const frases = require('./frases');
module.exports = {
    phone: {
        reply_markup: {
            keyboard: [
                [{
                    text: 'Отправить номер',
                    request_contact: true
                }]
            ]
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
    categories: {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Кофе',
                    callback_data: JSON.stringify({
                        type: 'category',
                        unit: 'coffee'
                    })
                },
                    {
                        text: 'Чаи',
                        callback_data: JSON.stringify({
                            type: 'category',
                            unit: 'tea'
                        })
                    }],
                [{
                    text: 'Смузи',
                    callback_data: JSON.stringify({
                        type: 'category',
                        unit: 'smhs'
                    })
                }, {
                    text: 'Фреш',
                    callback_data: JSON.stringify({
                        type: 'category',
                        unit: 'fresh'
                    })
                }],
                [{
                    text: 'Молочные коктейли',
                    callback_data: JSON.stringify({
                        type: 'category',
                        unit: 'milks'
                    })
                }],
                [{
                    text: 'Сезонные напитки',
                    callback_data: JSON.stringify({
                        type: 'category',
                        unit: 'drinks'
                    })
                }],
                [kb.back_to_home, kb.basket(kb.back_to_home.callback_data)]
            ]
        }
    },
    basket: {
        reply_markup: {
            inline_keyboard: [[kb.submitOrder],
                [kb.clearBasket], [kb.back_to_home]]
        }
    },
    emptyBasket: {
        reply_markup: {
            inline_keyboard: [[kb.back_to_categories, kb.back_to_home]]
        }
    },
    bottle_ask(query) {
        var key = {
            reply_markup: {
                inline_keyboard: [
                    [kb.bottle(query), kb.cup(query)],
                    [kb.back_to_home]
                ]
            }
        }
        return key
    }, just_ask(query) {
        var key = {
            reply_markup: {
                inline_keyboard: [
                    [kb.just_yes(query)],
                    [kb.back_to_home]
                ]
            }
        }
        return key
    },
    ready:{
        reply_markup: {
            inline_keyboard: [
                [kb.basket(kb.back_to_home.callback_data)],
                [kb.back_to_home]
            ]
        }
    }
}
