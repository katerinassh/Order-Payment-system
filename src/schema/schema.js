/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
const graphql = require('graphql');
const Order = require('../models/order.model');
const OrderProduct = require('../models/order-product.model');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
} = graphql;

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
  }),
});

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: { type: GraphQLID },
    createdAtTimeISO: { type: GraphQLString },
    currency_code: { type: GraphQLString },
    customer: { type: GraphQLInt },
    payment_status: { type: GraphQLString },
    products: { type: GraphQLList(ProductType) },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    order: {
      type: OrderType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const { id } = args;
        const orders = await Order.query().withGraphJoined('products').where('orders.id', id);
        return orders[0];
      },
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve() {
        return Order.query().withGraphJoined('products');
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createOrder: {
      type: OrderType,
      args: {
        currency_code: { type: GraphQLString },
        customer_id: { type: GraphQLInt },
        payment_status: { type: GraphQLString },
        products: { type: GraphQLList(GraphQLInt) },
      },
      async resolve(parent, args) {
        const {
          currency_code, customer_id, payment_status, products,
        } = args;

        return Order.transaction(async (trx) => {
          const order = await Order.query(trx).insert({ currency_code, customer_id, payment_status });
          for await (const product_id of products) {
            await OrderProduct.query(trx).insert({ product_id, order_id: order.id });
          }

          const orderWithProducts = await Order.query(trx).withGraphJoined('products').where('orders.id', order.id);
          return orderWithProducts[0];
        });
      },
    },
    updateOrder: {
      type: OrderType,
      args: {
        id: { type: GraphQLInt },
        currency_code: { type: GraphQLString },
        customer_id: { type: GraphQLInt },
        payment_status: { type: GraphQLString },
        products: { type: GraphQLList(GraphQLInt) },
      },
      async resolve(parent, args) {
        const {
          id, currency_code, customer_id, payment_status, products,
        } = args;
        return Order.transaction(async (trx) => {
          const orderBeforeUpd = await Order.query(trx).findById(id).withGraphJoined('products');

          await Order.query(trx).update({
            currency_code: currency_code || orderBeforeUpd.currency_code,
            customer_id: customer_id || orderBeforeUpd.customer_id,
            payment_status: payment_status || orderBeforeUpd.payment_status,
          }).where('id', id);
          await OrderProduct.query(trx).delete().where('order_id', id);

          for await (const product_id of products) {
            await OrderProduct.query(trx).insert({ product_id, order_id: id });
          }

          return Order.query(trx).findById(id).withGraphJoined('products');
        });
      },
    },
    deleteOrder: {
      type: OrderType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const { id } = args;
        return Order.transaction(async (trx) => {
          await OrderProduct.query(trx).delete().where('order_id', id);
          return Order.query(trx).deleteById(id);
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
