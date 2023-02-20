const express = require('express');
import axios from 'axios';

const app = express();
app.use(express.json());

app.get('/offices', (req, res) => {

  axios.post('https://evropochta.by/api/directory.Json/?What=Postal.OfficesOut')
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.log('api offices');
    console.log(error)
  });
});

module.exports = app
