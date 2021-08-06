exports.up = function (knex) {
  return knex('products')
    .insert([{ name: 'Pizza', price: 5 },
      { name: 'Burger', price: 4.5 },
      { name: 'Icecream', price: 2 },
      { name: 'Lavanda ice latte', price: 3.5 },
      { name: 'Cookie', price: 0.5 }]);
};

exports.down = function (knex) {
  return knex('products')
    .where({ name: 'Pizza' } || { name: 'Burger' } || { name: 'Icecream' } || { name: 'Lavanda ice latte' } || { name: 'Cookie' }).del();
};
