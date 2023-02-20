const express = require('express');
const nodeMailer = require('nodemailer');

const app = express();

app.use(express.json());

app.post('/create-order', (req, res) => {
  try {
    const orderInfo = req.body;

    const transporter = nodeMailer.createTransport({
      service: 'mail',
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      // debug: true,
      // logger: true,
      auth: {
        user: 'info@voditsa.by',
        pass: 'pass'
      }
    });

    const products = orderInfo.products.map(product => {
      return `<div>${product.content.title} x ${product.count}</div>`
    });

    const mailInfo = {
      'Номер заказа': `#${orderInfo.order_number}`,
      'Дата создания': orderInfo.created_at,
      'Товары': products.join(''),
      'Цена': `${orderInfo.price} руб.`,
      'Имя': orderInfo.info.firstname,
      'Фамилия': orderInfo.info.lastname,
      'Email': orderInfo.info.email,
      'Телефон': orderInfo.info.phone,
      'Способ оплаты': orderInfo.info.paymethod,
      'Способ доставки': orderInfo.info.delivery,
    }

    if (orderInfo.info.address) {
      mailInfo['Адрес доставки'] = orderInfo.info.address;
    }

    if (orderInfo.info.city) {
      mailInfo['Город'] = orderInfo.info.city;
    }

    if (orderInfo.info.street) {
      mailInfo['Улица'] = orderInfo.info.street;
    }

    if (orderInfo.info.home) {
      mailInfo['Дом'] = orderInfo.info.home;
    }

    if (orderInfo.info.building) {
      mailInfo['Корпус'] = orderInfo.info.building;
    }

    if (orderInfo.info.flat) {
      mailInfo['Квартира'] = orderInfo.info.flat;
    }

    if (orderInfo.info.floor) {
      mailInfo['Этаж'] = orderInfo.info.floor;
    }

    if (orderInfo.info.entrance) {
      mailInfo['Подъезд'] = orderInfo.info.entrance;
    }

    if (orderInfo.info.office) {
      mailInfo['Офис'] = orderInfo.info.office.WarehouseName;
    }

    if (orderInfo.info.comment) {
      mailInfo['Комментарий'] = orderInfo.info.comment;
    }

    if (orderInfo.discount) {
      mailInfo['Примененный промокод'] = orderInfo.discount.name;
    }

    let body = ''
    let odd = true

    for (const prop in mailInfo) {
      odd = !odd
      if (odd) {
        body += `<tr style="background-color: #fff;"><td style="padding: 15px; border: #e9e9e9 1px solid; border: 0!important; font-family: Arial, Helvetica, San Francisco, sans-serif; font-weight: 300; font-size: 15px;">${prop}</td><td style="padding: 15px; border: #e9e9e9 1px solid; border: 0!important; font-family: Arial, Helvetica, San Francisco, sans-serif; font-weight: 300; font-size: 15px;">${mailInfo[prop]}</td></tr>`
      } else {
        body += `<tr style="background-color: #f8f8f8;"><td style="padding: 15px; border: #e9e9e9 1px solid; border: 0!important; font-family: Arial, Helvetica, San Francisco, sans-serif; font-weight: 300; font-size: 15px;">${prop}</td><td style="padding: 15px; border: #e9e9e9 1px solid; border: 0!important; font-family: Arial, Helvetica, San Francisco, sans-serif; font-weight: 300; font-size: 15px;">${mailInfo[prop]}</td></tr>`
      }
    }

    const mailOptions = {
      from: '"Voditsa.by" <info@voditsa.by>',
      to: `${orderInfo.info.email}, info@voditsa.by`,
      subject: `Заказ #${orderInfo.order_number} офомлен на сайте Voditsa.by`,
      text: 'Спасибо за ваш заказ',
      html: `
        <h3>Спасибо за ваш заказ</h3>
        <table style="width: 100%;" cellspacing="0" cellpadding="0">${body}</table>
      `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        res.status(400).send({success: false, error: error.response})
      } else {
        res.status(200).send({body: req.body, mailInfo: mailInfo, info: info});
      }
    })

  } catch (error) {
    console.log('api mail error', error);
    res.status(200).send({info: 'Сообщение не отправлено'});
  }
})


module.exports = app
