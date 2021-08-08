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
    currencyCode: { type: GraphQLString },
    customer: { type: GraphQLInt },
    paymentStatus: { type: GraphQLString },
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
        const orders = await Order.query().withGraphJoined('products').where('orders.id', id).limit(1);
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
        currencyCode: { type: GraphQLString },
        customer_id: { type: GraphQLInt },
        paymentStatus: { type: GraphQLString },
        products: { type: GraphQLList(GraphQLInt) },
      },
      async resolve(parent, args) {
        const {
          currencyCode, customer_id, paymentStatus, products,
        } = args;

        return Order.transaction(async (trx) => {
          const order = await Order.query(trx).insert({ currencyCode, customer_id, paymentStatus });
          for await (const product_id of products) {
            await OrderProduct.query(trx).insert({ product_id, order_id: order.id });
          }

          const orderWithProducts = await Order.query(trx).withGraphJoined('products').where('orders.id', order.id).limit(1);
          return orderWithProducts[0];
        });
      },
    },
    updateOrder: {
      type: OrderType,
      args: {
        id: { type: GraphQLInt },
        currencyCode: { type: GraphQLString },
        customer_id: { type: GraphQLInt },
        paymentStatus: { type: GraphQLString },
        products: { type: GraphQLList(GraphQLInt) },
      },
      async resolve(parent, args) {
        const {
          id, currencyCode, customer_id, paymentStatus, products,
        } = args;
        return Order.transaction(async (trx) => {
          await Order.query(trx).update({ currencyCode, customer_id, paymentStatus }).where('id', id);
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
