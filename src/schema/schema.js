/* eslint-disable camelcase */
const graphql = require('graphql');
const Order = require('../models/order.model');

const {
  GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLID, GraphQLList,
} = graphql;

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: { type: GraphQLID },
    createdAtTimeISO: { type: GraphQLString },
    currencyCode: { type: GraphQLString },
    customer: { type: GraphQLInt },
    paymentStatus: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    order: {
      type: OrderType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        const { id } = args;
        return Order.query().where('id', id);
      },
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve() {
        return Order.query();
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
      },
      async resolve(parent, args) {
        const { currencyCode, customer_id, paymentStatus } = args;
        await Order.transaction(async (trx) => {
          const order = await Order.query(trx).insert({ currencyCode, customer_id, paymentStatus });
          return order;
        });
      },
    },
    updateOrder: {
      type: OrderType,
      args: {
        id: { type: GraphQLID },
        currencyCode: { type: GraphQLString },
        customer_id: { type: GraphQLInt, required: false },
        paymentStatus: { type: GraphQLString, required: false },
      },
      async resolve(parent, args) {
        const { id, currencyCode, customer_id, paymentStatus } = args;
        return Order.transaction(async (trx) => {
          await Order.query(trx).update({ currencyCode, customer_id, paymentStatus }).where('id', id);
          const order = Order.query(trx).findById(id);
          return order;
        });
      },
    },
    deleteOrder: {
      type: OrderType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const { id } = args;
        await Order.transaction(async (trx) => {
          const order = await Order.query(trx).deleteById(id);
          return order;
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
