const { Model } = require('objection');
const Customer = require('./customer.model');
const knex = require('../../db/knex');
const Product = require('./product.model');

Model.knex(knex);

class Order extends Model {
  static get tableName() {
    return 'orders';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['currencyCode', 'customer_id', 'paymentStatus'],

      properties: {
        id: { type: 'integer' },
        createdAtTimeISO: { type: 'timestamp' },
        currencyCode: { type: 'string', minLength: 1, maxLength: 255 },
        customer_id: { type: 'integer' },
        paymentStatus: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    return {
      customer: {
        relation: Model.HasManyRelation,
        modelClass: Customer,
        join: {
          from: 'customers.id',
          to: 'orders.customer_id',
        },
      },
      products: {
        relation: Model.ManyToManyRelation,
        modelClass: Product,
        join: {
          from: 'orders.id',
          through: {
            from: 'products_orders.order_id',
            to: 'products_orders.product_id',
          },
          to: 'products.id',
        },
      },
    };
  }
}

module.exports = Order;
