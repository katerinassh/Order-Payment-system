const express = require('express');
const knex = require('./db/knex');
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');

const schema = graphql.buildSchema(`
  type Query {
    getHello: String
  }
`);

const root = { getHello: () => "Hello world!" };

const app = express();
app.use('/', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(8000, () => {
  console.log('App listening on port 8000!');
});
