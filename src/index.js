const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const { ordersRouter } = require('./modules/orders/orders.router');

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.use('/orders', ordersRouter);

app.listen(8000, () => {
  console.log('App listening on port 8000!');
});
