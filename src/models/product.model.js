const { Model } = require('objection');

class Product extends Model {
  static get tableName() {
    return 'products';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'price'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        price: { type: 'float' },
      },
    };
  }
}

module.exports = Product;
