const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const orders = [
  { id: '1', name: 'Order from atb' },
  { id: '2', name: 'Order from silpo' },
  { id: '3', name: 'Order from novus' },
];

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    order: {
      type: OrderType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // code to get data from db
        return orders.find((order) => order.id === args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
