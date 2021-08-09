const { Model } = require('objection');
const Order = require('./order.model');
const Product = require('./product.model');
const knex = require('../../db/knex');

Model.knex(knex);

class OrderProduct extends Model {
  static get tableName() {
    return 'products_orders';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['product_id', 'order_id'],

      properties: {
        product_id: { type: 'integer' },
        order_id: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    return {
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: 'orders.id',
          to: 'products_orders.order_id',
        },
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'products.id',
          to: 'products_orders.product_id',
        },
      },
    };
  }
}

module.exports = OrderProduct;
