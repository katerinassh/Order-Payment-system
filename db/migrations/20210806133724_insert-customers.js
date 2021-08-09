exports.up = function (knex) {
  return knex('customers')
    .insert([{
      name: 'Kate', surname: 'Jimashibily', phone: '0671237613', email: 'jimash123@gmail.com',
    },
    {
      name: 'Tim', surname: 'Glebov', phone: '0987615600', email: 'glebtim@gmail.com',
    }]);
};

exports.down = function (knex) {
  return knex('customers')
    .where({ phone: '0671237613' } || { phone: '0671237613' }).del();
};
