/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
const Order = require('../../models/order.model');
const OrderProduct = require('../../models/order-product.model');

async function getAllOrders() {
  return Order.query().withGraphJoined('products');
}
async function getOrderById(id) {
  const orders = await Order.query().withGraphJoined('products').where('orders.id', id);
  return orders[0];
}

async function createOrder(body) {
  const {
    currency_code, customer_id, payment_status, products,
  } = body;

  return Order.transaction(async (trx) => {
    const order = await Order.query(trx).insert({ currency_code, customer_id, payment_status });
    for await (const product_id of products) {
      await OrderProduct.query(trx).insert({ product_id, order_id: order.id });
    }

    const orderWithProducts = await Order.query(trx).withGraphJoined('products').where('orders.id', order.id);
    return orderWithProducts[0];
  });
}

async function updateOrder(body) {
  const {
    id, currency_code, customer_id, payment_status, products,
  } = body;
  return Order.transaction(async (trx) => {
    const orderBeforeUpd = await Order.query(trx).findById(id).withGraphJoined('products');

    await Order.query(trx).update({
      currency_code: currency_code || orderBeforeUpd.currency_code,
      customer_id: customer_id || orderBeforeUpd.customer_id,
      payment_status: payment_status || orderBeforeUpd.payment_status,
    }).where('id', id);
    await OrderProduct.query(trx).delete().where('order_id', id);

    if (products) {
      for await (const product_id of products) {
        await OrderProduct.query(trx).insert({ product_id, order_id: id });
      }
    }

    return Order.query(trx).findById(id).withGraphJoined('products');
  });
}

async function deleteOrder(body) {
  const { id } = body;
  return Order.transaction(async (trx) => {
    await OrderProduct.query(trx).delete().where('order_id', id);
    return Order.query(trx).deleteById(id);
  });
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
