const express = require('express');
import axios from 'axios';

const app = express();
app.use(express.json());

const login = 'login';
const password = 'pass';
const apiUrl = 'https://ecom.alfabank.by/payment/rest/';

app.post('/create-order', (req, res) => {
  const orderNumber = req.body.orderNumber;
  const sum = req.body.sum.toFixed(2).replace('.', '');
  const returnUrl = req.body.returnUrl;

  axios.post(apiUrl + `register.do?userName=${login}&password=${password}&orderNumber=${orderNumber}&amount=${sum}&returnUrl=${returnUrl}`)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.log('create-order');
    console.log(error)
  });
});

app.post('/check-order', (req, res) => {
  const paymentId = req.body.paymentId;

  axios.post(apiUrl + `getOrderStatusExtended.do?userName=${login}&password=${password}&orderId=${paymentId}`)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.log('check-order');
    console.log(error)
  });
});

app.post('/pay', (req, res) => {
  const paymentId = req.body.paymentId;
  const sum = req.body.sum.toFixed(2).replace('.', '');

  axios.post(apiUrl + `deposit.do?userName=${login}&password=${password}&orderId=${paymentId}&amount=${sum}`)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.log('api pay');
    console.log(error)
  });
});

module.exports = app
