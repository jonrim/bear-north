'use strict';
var Sequelize = require('sequelize');

module.exports = function (db) { //two files, one for order, one for orderDetail CdV/OB

    db.define('order', {
        address: {
            type: Sequelize.TEXT //no empty strings? CdV/OB
        },
        status: {
            type: Sequelize.ENUM('pending', 'active', 'fulfilled', 'returned'),
            defaultValue: 'pending'
        },
        shipDate: {
            type: Sequelize.DATE,
            validate: {isDate: true}
        }
    }, {
        instanceMethods: {
            getTotal: function() {
                return this.getOrderDetails()
                    .then(function(orderDetailObjects) {
                        return orderDetailObjects.reduce(function(a, b) {
                            return a.subtotal + b.subtotal;
                        }, { subtotal: 0 });
                    })
                    .then(function(result) {
                        return result.subtotal;
                    });
            }
        }
    });

    var Order = db.model('order');
    var OrderDetail = db.model('orderDetail');

    Order.addScope('defaultScope', {include: [{model: OrderDetail}]}, {override: true})

    Order.beforeDestroy(function(order) {
      return OrderDetail.destroy({where: {orderId: order.id}}); //discuss transactions CdV/OB
    })


}
