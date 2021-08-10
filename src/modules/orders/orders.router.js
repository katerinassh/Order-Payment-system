const express = require('express');
const {
  getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder,
} = require('./orders.service');

const ordersRouter = express.Router();

ordersRouter.get('/:id', async (req, res) => {
  res.status(200).send(await getOrderById(req.params.id));
});

ordersRouter.get('/', async (req, res) => {
  res.status(200).send(await getAllOrders());
});

ordersRouter.post('/createOrder', async (req, res) => {
  res.status(200).send(await createOrder(req.body));
});

ordersRouter.put('/updateOrder', async (req, res) => {
  res.status(200).send(await updateOrder(req.body));
});

ordersRouter.delete('/deleteOrder', async (req, res) => {
  await deleteOrder(req.body);
  res.status(200).send();
});

module.exports = { ordersRouter };
