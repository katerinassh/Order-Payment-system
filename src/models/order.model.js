const { Model } = require('objection');
const Customer = require('./customer.model');
const knex = require('../../db/knex');

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
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'orders.customer_id',
          to: 'customers.id',
        },
      },
    };
  }
}

module.exports = Order;
