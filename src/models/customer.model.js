const { Model } = require('objection');

class Customer extends Model {
  static get tableName() {
    return 'customers';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'surname', 'phone'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string ' },
        surname: { type: 'string ' },
        phone: { type: 'string ' },
        email: { type: 'string ' },
      },
    };
  }
}

module.exports = Customer;
