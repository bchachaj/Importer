'use strict';

const express = require('express');
const URL = require('url').URL;
const axios = require('axios');
const morgan = require('morgan');
const parseHTML = require('./utils/parseHTML');

const app = express();
app.use(morgan('combined'));

const { buildResponseObject } = require('./utils/buildResponseObject');
const { executeTraining } = require('./classifier/train/train_classifier');

// init program with training classifier
executeTraining();

app.get('/recipes', async (req, res) => {
  const targetUrl = req.query.url;

  if (!validateURL(targetUrl)) {
    res.status(422).send('Must provide a valid URL');
  }

  axios.get(targetUrl).then(async (response) => {
    if (response.status === 200) {
      const { data: html } = response;
      const extractedData = await parseHTML(html, targetUrl);
      const jsonRecipe = buildResponseObject(extractedData);
      res.send(jsonRecipe).status(200);
    } else {
      res.send(response);
    }
  }).catch((e) => {
    res.send(e.message);
  });
});

function validateURL (url) {
  /* eslint-disable no-new */
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

app.listen('8080', () => {
  console.log('listening on 8080');
});
