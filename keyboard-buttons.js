module.exports = {
    home: {
        order: {
            text: 'Сделать заказ',
            callback_data: 'order'
        },
        about_stock: {
            text: 'Об ассортименте',
            callback_data: 'about_stock'
        },
        about_company: {
            text: 'О компании',
            callback_data: 'about_company'
        }
    },
    back_to_home: {
        text: 'Домой 🏠',
        callback_data: 'back_to_home'
    },
    back_to_categories: {
        text: 'Сделать заказ',
        callback_data: 'back_to_categories'
    },
    feedback: {
        text: 'Написать директору',
        callback_data: 'feedback'
    },
    basket(back) {
        return {
            text: 'Заказ 🛒',
            callback_data: JSON.stringify({
                type: 'basket',
                back: back
            })
        }
    },
    submitOrder: {
        text: 'Оформить заказ',
        callback_data: 'addressAsk'
    },
    unitButton(unit) {
        return {
            text: unit.title +' - '+unit.price+'₽',
            callback_data: JSON.stringify({
                type: 'unit',
                id: unit.id
            })
        }
    }
    // back_to_some_category(unit) {
    //     return {
    //         text: 'Назад 🔙',
    //         callback_data: JSON.stringify({
    //             type: 'unit',
    //             unit: unit
    //         })
    //     }
    // },
    // back_to_some_unit(unit) {
    //     return {
    //         text: 'Назад 🔙',
    //         callback_data: JSON.stringify({
    //             type: 'back_to_some_category',
    //             unit: unit
    //         })
    //     }
    // },
    // plus10(unit,isWater){
    //     return {
    //         text: '+10',
    //         callback_data: JSON.stringify({
    //             type: 'plus10',
    //             unit:  unit,
    //             isw: isWater
    //         })
    //     }
    // },
    // plus(unit,isWater){
    //     return {
    //         text: '+',
    //         callback_data: JSON.stringify({
    //             type: 'plus',
    //             unit:  unit,
    //             isw: isWater
    //         })
    //     }
    // },
    // minus(unit,isWater){
    //     return {
    //         text: '-',
    //         callback_data: JSON.stringify({
    //             type: 'minus',
    //             unit:  unit,
    //             isw: isWater
    //         })
    //     }
    // },
    // count(unit,c){
    //     return {
    //         text: c,
    //         callback_data: ' '
    //     }
    // },
    // del(unit){
    //     return {
    //         text: '🗑',
    //         callback_data: JSON.stringify({
    //             type: 'del',
    //             unit:  unit
    //         })
    //     }
    // }

}


