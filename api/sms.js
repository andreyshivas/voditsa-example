const express = require('express');
import axios from 'axios';
const app = express();

app.use(express.json());

app.post('/create-order', (req, res) => {
  try {
    const orderInfo = req.body;
    const key = 'token';
    const phone = encodeURIComponent(orderInfo.info.phone.replace(/[\D]+/g, ''));
    const sender = encodeURIComponent('voditsa.by');
    const text = encodeURIComponent(`Заказ №${orderInfo.order_number} успешно оформлен`);

    const info = axios.post(`https://api.unisender.com/ru/api/sendSms?format=json&api_key=${key}&phone=${phone}&sender=${sender}&text=${text}`)
      .then(response => {
        console.log(response.data);
        res.status(200).json(response.data);
      })
      .catch(error => {
        console.log('api sms error catch');
        console.log(error)
      });
  } catch (error) {
    console.log('api sms error', error);
    res.status(200).send({info: 'Сообщение не отправлено'});
  }
})


module.exports = app
