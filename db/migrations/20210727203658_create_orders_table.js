exports.up = function (knex) {
  return knex.schema
    .createTable('customers', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('surname', 255).notNullable();
      table.string('phone', 12).notNullable();
      table.string('email', 255).notNullable();
    })

    .createTable('orders', (table) => {
      table.increments('id').primary();
      table.timestamp('createdAtTimeISO').defaultTo(knex.fn.now());
      table.string('currencyCode', 255).notNullable();
    
      table
        .integer('customer_id')
        .references('id')
        .inTable('customers');
      table.string('paymentStatus', 255).notNullable();
    })

    .createTable('products', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.float('price').notNullable();
    })

    .createTable('products_orders', (table) => {
      table.increments('id').primary();
      table
        .integer('product_id')
        .references('id')
        .inTable('products');
      table
        .integer('order_id')
        .references('id')
        .inTable('orders');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('products_orders').dropTable('orders').dropTable('products').dropTable('customers');
};
