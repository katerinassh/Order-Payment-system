const { Model } = require('objection');

class Customer extends Model {
  static get tableName() {
    return 'customers';
  }

  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        name: { type: 'string ' },
        surname: { type: 'string ' },
        phone: { type: 'string ' },
        email: { type: 'string ' },
      },
    };
  }
  // static get relationMappings() {

  // }
}

module.exports = Customer;
